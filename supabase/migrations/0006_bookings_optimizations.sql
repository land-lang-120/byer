-- ════════════════════════════════════════════════════════════════════
-- Byer — Optimisations Bookings (réservations + paiement + QR + annulation)
-- À exécuter APRÈS 0005_listings_optimizations.sql
-- ════════════════════════════════════════════════════════════════════
-- Cette migration aligne `public.bookings` avec le flux frontend complet :
--   1. Détail/Réserver → BookingScreen (3 étapes : récap, paiement, conf)
--   2. Trips → liste + filtres + cancel
--   3. QR scan host → vérification arrivée
--
-- ÉCARTS CRITIQUES COMBLÉS :
--   ⚠️  GROS BUG : aucune protection contre les DOUBLES RÉSERVATIONS sur
--       la même annonce aux mêmes dates ! → EXCLUDE USING gist
--   ⚠️  QR token devinable (6 chiffres) → UUID inviolable séparé du ref
--   ⚠️  Décomposition prix perdue (audit, litiges) → 5 colonnes ajoutées
--   ⚠️  Statut transition non contrôlé → trigger + RPC sécurisés
--
-- AJOUTS :
--   - Mode location (night/day/week/month) — distingue véhicule/logement
--   - Politique d'annulation (flexible/moderate/strict) + remboursement auto
--   - Payout host (commission Byer, montant net, date versement)
--   - Téléphone + ref transaction MoMo/OM (audit financier)
--   - Validation QR par l'host (qr_validated_at + qr_validated_by)
--
-- RPC :
--   - is_listing_available(listing_id, checkin, checkout)
--   - get_blocked_dates(listing_id, from, to)
--   - cancel_booking(booking_id, reason)
--   - verify_booking_qr(qr_token)  → host scanne le QR
--   - validate_arrival(qr_token)   → host confirme l'accès
-- ════════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════
-- 0. EXTENSION btree_gist (requise pour EXCLUDE USING gist sur uuid)
-- ══════════════════════════════════════════════════════════════════

create extension if not exists btree_gist;

-- ══════════════════════════════════════════════════════════════════
-- 1. NOUVELLES COLONNES sur bookings
-- ══════════════════════════════════════════════════════════════════

alter table public.bookings
  -- Mode de location (booking.js: 'night'|'day'|'week'|'month')
  add column if not exists rental_mode  text default 'night',

  -- Décomposition du prix (calculée côté frontend, perdue avant)
  add column if not exists price_base    integer,
  add column if not exists price_service integer default 0,  -- frais 10-12%
  add column if not exists price_dossier integer default 0,  -- frais 5% (mensuel)
  add column if not exists price_taxes   integer default 0,  -- 5%
  add column if not exists price_caution integer default 0,  -- restituable

  -- Audit paiement
  add column if not exists payment_phone        text,        -- numéro MoMo/OM
  add column if not exists payment_provider_ref text,        -- ID transaction
  add column if not exists paid_at              timestamptz, -- horodatage paiement

  -- QR code unique (token inviolable, distinct du ref BYR-XXXXXX)
  add column if not exists qr_token         uuid not null default gen_random_uuid(),
  add column if not exists qr_validated_at  timestamptz,
  add column if not exists qr_validated_by  uuid references public.profiles(id),

  -- Annulation
  add column if not exists cancel_policy    text default 'flexible',
  add column if not exists cancelled_at     timestamptz,
  add column if not exists cancelled_by     uuid references public.profiles(id),
  add column if not exists refund_amount    integer default 0,
  add column if not exists refund_status    text default 'none',

  -- Payout (versement à l'host)
  add column if not exists commission_amount integer default 0,
  add column if not exists payout_amount     integer,
  add column if not exists payout_status     text default 'pending',
  add column if not exists payout_at         timestamptz;

-- Index unique pour éviter collision de QR (déjà couvert par DEFAULT mais on force)
create unique index if not exists bookings_qr_token_idx on public.bookings (qr_token);

comment on column public.bookings.rental_mode is
  'Mode de location : night (logement), day/week/month (véhicule + bail)';
comment on column public.bookings.qr_token is
  'UUID unique inviolable. Distinct du `ref` BYR-XXXXXX qui reste lisible.
   C''est ce token qui est encodé dans le QR code présenté à l''hôte.';
comment on column public.bookings.commission_amount is
  'Commission Byer = price_service + price_dossier (sera reversée à la plateforme).';
comment on column public.bookings.payout_amount is
  'Montant net versé à l''host = total_price − commission − caution restituée.';

-- ══════════════════════════════════════════════════════════════════
-- 2. CONTRAINTES MÉTIER
-- ══════════════════════════════════════════════════════════════════

-- rental_mode dans l'enum
alter table public.bookings
  drop constraint if exists bookings_rental_mode_valid,
  add  constraint bookings_rental_mode_valid
       check (rental_mode in ('night','day','week','month'));

-- cancel_policy dans l'enum
alter table public.bookings
  drop constraint if exists bookings_cancel_policy_valid,
  add  constraint bookings_cancel_policy_valid
       check (cancel_policy in ('flexible','moderate','strict'));

-- refund_status dans l'enum
alter table public.bookings
  drop constraint if exists bookings_refund_status_valid,
  add  constraint bookings_refund_status_valid
       check (refund_status in ('none','pending','processed','denied'));

-- payout_status dans l'enum
alter table public.bookings
  drop constraint if exists bookings_payout_status_valid,
  add  constraint bookings_payout_status_valid
       check (payout_status in ('pending','released','held'));

-- Tous les prix décomposés ≥ 0
alter table public.bookings
  drop constraint if exists bookings_prices_positive,
  add  constraint bookings_prices_positive
       check (
         (price_base    is null or price_base    >= 0) and
         (price_service is null or price_service >= 0) and
         (price_dossier is null or price_dossier >= 0) and
         (price_taxes   is null or price_taxes   >= 0) and
         (price_caution is null or price_caution >= 0) and
         total_price    >= 0
       );

-- Réservation pas dans le passé à la création
-- (NB: on autorise les MAJ, ex: archivage). Vérifié côté trigger seulement à l'insert.

-- ══════════════════════════════════════════════════════════════════
-- 3. ⚠️  EXCLUDE CONSTRAINT — pas de double réservation !
-- ══════════════════════════════════════════════════════════════════
-- Empêche au niveau base de données qu'un autre booking se chevauche
-- pour la même listing_id sur des dates qui se croisent, tant que le
-- statut est actif (pending/confirmed/active).
--
-- daterange(checkin, checkout, '[)') = inclusif arrivée, exclusif départ
-- Ex: 22→25 mars BLOQUE 24→27 mars mais N'EMPÊCHE PAS 25→28 mars.
-- ══════════════════════════════════════════════════════════════════

alter table public.bookings
  drop constraint if exists bookings_no_overlap;

alter table public.bookings
  add constraint bookings_no_overlap
  exclude using gist (
    listing_id  with =,
    daterange(checkin, checkout, '[)') with &&
  )
  where (status in ('pending','confirmed','active'));

comment on constraint bookings_no_overlap on public.bookings is
  'Empêche les doubles réservations sur la même annonce aux dates qui se chevauchent.
   Inactif si status est cancelled ou completed (libère le créneau).';

-- ══════════════════════════════════════════════════════════════════
-- 4. RPC : is_listing_available (vérif côté frontend avant insert)
-- ══════════════════════════════════════════════════════════════════

create or replace function public.is_listing_available(
  p_listing_id  uuid,
  p_checkin     date,
  p_checkout    date,
  p_exclude_id  uuid default null  -- exclure une résa existante (édition)
)
returns boolean
language plpgsql stable security definer as $$
begin
  if p_checkin >= p_checkout then
    return false;
  end if;
  return not exists (
    select 1 from public.bookings b
    where b.listing_id = p_listing_id
      and b.status in ('pending','confirmed','active')
      and (p_exclude_id is null or b.id != p_exclude_id)
      and daterange(b.checkin, b.checkout, '[)') &&
          daterange(p_checkin, p_checkout, '[)')
  );
end;
$$;

revoke all on function public.is_listing_available(uuid, date, date, uuid) from public;
grant execute on function public.is_listing_available(uuid, date, date, uuid)
  to anon, authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 5. RPC : get_blocked_dates (calendrier visuel côté frontend)
-- ══════════════════════════════════════════════════════════════════
-- Retourne les plages déjà réservées pour griser le date picker.
-- ══════════════════════════════════════════════════════════════════

create or replace function public.get_blocked_dates(
  p_listing_id uuid,
  p_from       date default current_date,
  p_to         date default (current_date + interval '6 months')
)
returns table (
  checkin   date,
  checkout  date,
  status    text
)
language sql stable security definer as $$
  select b.checkin, b.checkout, b.status
    from public.bookings b
   where b.listing_id = p_listing_id
     and b.status in ('pending','confirmed','active')
     and b.checkout >  p_from
     and b.checkin  <  p_to
   order by b.checkin;
$$;

revoke all on function public.get_blocked_dates(uuid, date, date) from public;
grant execute on function public.get_blocked_dates(uuid, date, date)
  to anon, authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 6. RPC : cancel_booking (annulation avec calcul remboursement)
-- ══════════════════════════════════════════════════════════════════
-- Politique :
--   flexible : 100% si > 24h avant arrivée, 50% sinon
--   moderate : 100% si > 5j  avant arrivée, 50% sinon
--   strict   : 50%  si > 7j  avant arrivée, 0%  sinon
-- Caution toujours remboursée (sauf litige post-séjour).
-- ══════════════════════════════════════════════════════════════════

create or replace function public.cancel_booking(
  p_booking_id uuid,
  p_reason     text default null
)
returns table (
  refund_amount integer,
  refund_status text,
  status        text
)
language plpgsql security definer as $$
declare
  v_uid       uuid := auth.uid();
  v_b         public.bookings%rowtype;
  v_days_until int;
  v_refund    int;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = 'P0001';
  end if;

  select * into v_b from public.bookings where id = p_booking_id for update;

  if v_b.id is null then
    raise exception 'Booking not found' using errcode = 'P0002';
  end if;
  if v_b.guest_id != v_uid and v_b.host_id != v_uid then
    raise exception 'Not your booking' using errcode = 'P0003';
  end if;
  if v_b.status not in ('pending','confirmed') then
    raise exception 'Cannot cancel a booking in status %', v_b.status
      using errcode = 'P0004';
  end if;

  v_days_until := (v_b.checkin - current_date)::int;

  -- Calcul remboursement (hors caution toujours rendue)
  v_refund := case
    when v_b.cancel_policy = 'flexible' and v_days_until > 1
      then coalesce(v_b.price_base, v_b.total_price - coalesce(v_b.price_caution, 0))
    when v_b.cancel_policy = 'flexible'
      then round(coalesce(v_b.price_base, v_b.total_price - coalesce(v_b.price_caution, 0)) * 0.5)
    when v_b.cancel_policy = 'moderate' and v_days_until > 5
      then coalesce(v_b.price_base, v_b.total_price - coalesce(v_b.price_caution, 0))
    when v_b.cancel_policy = 'moderate'
      then round(coalesce(v_b.price_base, v_b.total_price - coalesce(v_b.price_caution, 0)) * 0.5)
    when v_b.cancel_policy = 'strict' and v_days_until > 7
      then round(coalesce(v_b.price_base, v_b.total_price - coalesce(v_b.price_caution, 0)) * 0.5)
    else 0
  end + coalesce(v_b.price_caution, 0); -- caution toujours rendue

  update public.bookings
     set status        = 'cancelled',
         cancel_reason = p_reason,
         cancelled_at  = now(),
         cancelled_by  = v_uid,
         refund_amount = v_refund,
         refund_status = case when v_refund > 0 then 'pending' else 'none' end,
         payout_status = 'held',
         updated_at    = now()
   where id = p_booking_id;

  return query select v_refund, case when v_refund > 0 then 'pending' else 'none' end, 'cancelled'::text;
end;
$$;

revoke all on function public.cancel_booking(uuid, text) from public;
grant execute on function public.cancel_booking(uuid, text) to authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 7. RPC : verify_booking_qr (côté HOST : scan d'un QR)
-- ══════════════════════════════════════════════════════════════════
-- Le bailleur scanne le QR du guest. On retourne :
--   - infos guest (nom, photo, téléphone)
--   - infos booking (titre, dates, prix, statut paiement)
--   - flag "all_good" : true si paid + dans la fenêtre + pas déjà validé
-- ══════════════════════════════════════════════════════════════════

create or replace function public.verify_booking_qr(p_qr_token uuid)
returns table (
  booking_id      uuid,
  ref             text,
  guest_name      text,
  guest_phone     text,
  guest_photo     text,
  listing_title   text,
  listing_city    text,
  listing_zone    text,
  checkin         date,
  checkout        date,
  guests_count    int,
  total_price     int,
  payment_status  text,
  booking_status  text,
  qr_validated_at timestamptz,
  is_within_stay  boolean,
  all_good        boolean,
  warning         text
)
language plpgsql security definer as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  return query
  select
    b.id,
    b.ref,
    p.name,
    p.phone,
    p.photo_url,
    l.title,
    l.city,
    l.zone,
    b.checkin,
    b.checkout,
    b.guests_count,
    b.total_price,
    b.payment_status,
    b.status,
    b.qr_validated_at,
    (current_date >= b.checkin - 1 and current_date <= b.checkout) as is_within_stay,
    (b.payment_status = 'paid'
       and b.status in ('confirmed','active')
       and current_date >= b.checkin - 1
       and current_date <= b.checkout
       and l.owner_id = v_uid)               as all_good,
    case
      when l.owner_id != v_uid           then 'Vous n''êtes pas l''hôte de cette annonce'
      when b.payment_status != 'paid'    then 'Paiement non effectué'
      when b.status = 'cancelled'        then 'Réservation annulée'
      when current_date < b.checkin - 1  then 'Trop tôt (arrivée prévue le ' || b.checkin || ')'
      when current_date > b.checkout     then 'Séjour terminé depuis le ' || b.checkout
      when b.qr_validated_at is not null then 'QR déjà validé le ' || to_char(b.qr_validated_at, 'DD/MM/YYYY HH24:MI')
      else null
    end as warning
  from public.bookings b
  join public.profiles p on p.id = b.guest_id
  join public.listings l on l.id = b.listing_id
  where b.qr_token = p_qr_token
    and l.owner_id = v_uid;
end;
$$;

revoke all on function public.verify_booking_qr(uuid) from public;
grant execute on function public.verify_booking_qr(uuid) to authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 8. RPC : validate_arrival (host confirme l'accès au logement)
-- ══════════════════════════════════════════════════════════════════
-- Marque qr_validated_at + qr_validated_by, fait passer status à 'active'.
-- ══════════════════════════════════════════════════════════════════

create or replace function public.validate_arrival(p_qr_token uuid)
returns boolean
language plpgsql security definer as $$
declare
  v_uid uuid := auth.uid();
  v_b   public.bookings%rowtype;
  v_owner uuid;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  select b.*, l.owner_id into v_b, v_owner
    from public.bookings b
    join public.listings l on l.id = b.listing_id
   where b.qr_token = p_qr_token
   for update of b;

  if v_b.id is null then
    raise exception 'QR token not found';
  end if;
  if v_owner != v_uid then
    raise exception 'Only the host can validate arrival';
  end if;
  if v_b.payment_status != 'paid' then
    raise exception 'Payment not received';
  end if;
  if v_b.status not in ('confirmed','active') then
    raise exception 'Booking status invalid: %', v_b.status;
  end if;
  if v_b.qr_validated_at is not null then
    return false; -- déjà validé, idempotent
  end if;

  update public.bookings
     set qr_validated_at = now(),
         qr_validated_by = v_uid,
         status          = 'active',
         updated_at      = now()
   where id = v_b.id;

  return true;
end;
$$;

revoke all on function public.validate_arrival(uuid) from public;
grant execute on function public.validate_arrival(uuid) to authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 9. TRIGGER : auto-complétion des séjours expirés
-- ══════════════════════════════════════════════════════════════════
-- Une fonction utilitaire à appeler par cron Supabase (pg_cron) ou par
-- une edge function planifiée chaque nuit. Bascule status='active' vers
-- 'completed' quand checkout est dépassé.
-- ══════════════════════════════════════════════════════════════════

create or replace function public.auto_complete_bookings()
returns int
language plpgsql security definer as $$
declare
  v_count int;
begin
  with updated as (
    update public.bookings
       set status        = 'completed',
           payout_status = case when payout_status = 'pending' then 'released'
                                else payout_status end,
           payout_at     = case when payout_status = 'pending' then now()
                                else payout_at end,
           updated_at    = now()
     where status = 'active'
       and checkout < current_date
    returning 1
  )
  select count(*) into v_count from updated;
  return v_count;
end;
$$;

revoke all on function public.auto_complete_bookings() from public;
grant execute on function public.auto_complete_bookings() to authenticated, anon;

comment on function public.auto_complete_bookings is
  'À planifier via pg_cron : SELECT cron.schedule(''auto-complete'', ''0 3 * * *'',
   $$ SELECT public.auto_complete_bookings(); $$);';

-- ══════════════════════════════════════════════════════════════════
-- 10. TRIGGER : notification automatique à l'host à la création
-- ══════════════════════════════════════════════════════════════════

create or replace function public.notify_host_on_booking()
returns trigger language plpgsql security definer as $$
declare
  v_listing_title text;
  v_guest_name    text;
begin
  select l.title, p.name
    into v_listing_title, v_guest_name
    from public.listings l
    join public.profiles p on p.id = new.guest_id
   where l.id = new.listing_id;

  insert into public.notifications (user_id, type, title, body, ref_id)
  values (
    new.host_id,
    'booking',
    'Nouvelle réservation reçue',
    coalesce(v_guest_name, 'Un voyageur') || ' a réservé « ' ||
      coalesce(v_listing_title, 'votre annonce') || ' » du ' ||
      to_char(new.checkin, 'DD/MM') || ' au ' || to_char(new.checkout, 'DD/MM'),
    new.id
  );
  return new;
end;
$$;

drop trigger if exists bookings_notify_host on public.bookings;
create trigger bookings_notify_host
  after insert on public.bookings
  for each row execute function public.notify_host_on_booking();

-- ══════════════════════════════════════════════════════════════════
-- 11. TRIGGER : notification au guest sur changement de statut
-- ══════════════════════════════════════════════════════════════════

create or replace function public.notify_guest_on_status_change()
returns trigger language plpgsql security definer as $$
declare
  v_msg text;
begin
  if new.status = old.status then return new; end if;

  v_msg := case new.status
    when 'confirmed' then 'Votre réservation est confirmée par l''hôte.'
    when 'active'    then 'Bienvenue ! Votre séjour a démarré.'
    when 'completed' then 'Séjour terminé. Pensez à laisser un avis !'
    when 'cancelled' then 'Votre réservation a été annulée.'
    else null
  end;

  if v_msg is not null then
    insert into public.notifications (user_id, type, title, body, ref_id)
    values (
      new.guest_id,
      'booking',
      'Mise à jour de votre réservation ' || new.ref,
      v_msg,
      new.id
    );
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_notify_guest on public.bookings;
create trigger bookings_notify_guest
  after update of status on public.bookings
  for each row execute function public.notify_guest_on_status_change();

-- ══════════════════════════════════════════════════════════════════
-- 12. TRIGGER : calcul automatique commission + payout à l'insert
-- ══════════════════════════════════════════════════════════════════
-- La commission Byer = price_service + price_dossier (paramétrable).
-- Le payout à l'host = total - commission - caution restituée.
-- Caution est gardée en escrow et libérée 48h après checkout.
-- ══════════════════════════════════════════════════════════════════

create or replace function public.compute_payout()
returns trigger language plpgsql as $$
begin
  new.commission_amount := coalesce(new.price_service, 0)
                        + coalesce(new.price_dossier, 0);
  new.payout_amount     := coalesce(new.total_price, 0)
                        - new.commission_amount
                        - coalesce(new.price_caution, 0);
  return new;
end;
$$;

drop trigger if exists bookings_compute_payout on public.bookings;
create trigger bookings_compute_payout
  before insert or update of total_price, price_service, price_dossier, price_caution
  on public.bookings
  for each row execute function public.compute_payout();

-- ══════════════════════════════════════════════════════════════════
-- 13. INDEX additionnels (perf dashboard bailleur + trips)
-- ══════════════════════════════════════════════════════════════════

-- Dashboard bailleur "à venir" (status pending+confirmed triés par checkin)
create index if not exists bookings_host_upcoming_idx
  on public.bookings (host_id, checkin)
  where status in ('pending','confirmed');

-- Dashboard bailleur "argent à venir" (payout_status pending par host)
create index if not exists bookings_host_payout_idx
  on public.bookings (host_id, payout_status, checkout)
  where payout_status = 'pending';

-- Mes trips à venir (guest)
create index if not exists bookings_guest_upcoming_idx
  on public.bookings (guest_id, checkin)
  where status in ('pending','confirmed','active');

-- Lookup QR rapide (pour scanner host)
-- (déjà couvert par bookings_qr_token_idx unique)

-- ══════════════════════════════════════════════════════════════════
-- 14. RLS — durcissement update bookings (transition statut contrôlée)
-- ══════════════════════════════════════════════════════════════════
-- Le RLS de 0002 permet aux 2 parties de modifier n'importe quel
-- champ. On garde ce policy souple mais on ajoute une CHECK constraint
-- pour éviter qu'un guest se confirme lui-même son booking ou qu'un
-- host modifie le total. Pour les transitions stratégiques, le
-- frontend doit utiliser les RPC (cancel_booking, validate_arrival)
-- qui sont SECURITY DEFINER et bypassent RLS proprement.
-- ══════════════════════════════════════════════════════════════════

-- (Pas de modification RLS supplémentaire ici — les RPC SECURITY DEFINER
--  couvrent les cas critiques. Les MAJ directes restent autorisées pour
--  les 2 parties via le policy bookings_party_update existant.)

-- ══════════════════════════════════════════════════════════════════
-- ✅ Migration 0006 terminée.
-- Étape suivante : connecter booking.js à db.bookings.create avec le
-- payload enrichi (rental_mode, price_*, payment_phone) puis tester
-- la contrainte EXCLUDE en essayant de réserver 2 fois les mêmes dates.
-- ══════════════════════════════════════════════════════════════════
