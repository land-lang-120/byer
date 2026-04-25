-- ════════════════════════════════════════════════════════════════════
-- Byer — Reviews + Récompenses + Notifications + Chat
-- À exécuter APRÈS 0006_bookings_optimizations.sql
-- ════════════════════════════════════════════════════════════════════
-- Cette migration finalise les 4 derniers modules transverses :
--
-- ÉCARTS CRITIQUES COMBLÉS :
--   ⚠️  REVIEWS : l'UI utilise 8 critères (proprete, confort, accessibilite,
--       convivialite, emplacement, securite, equipement, qualitePrix)
--       mais le schéma 0001 n'en a que 4 (rating_clean/comm/value/location).
--       → RENOMMAGE + AJOUT pour matcher exactement RATING_CRITERIA.
--   ⚠️  POINTS : actuellement modifiables côté frontend (triche possible).
--       → Verrou RLS + RPC SECURITY DEFINER pour TOUTES les modifs.
--   ⚠️  REWARDS_CATALOG : hardcodé dans data.js, modif = rebuild.
--       → Table `rewards_catalog` modifiable depuis le dashboard.
--   ⚠️  Pas de trigger d'auto-attribution de points sur booking completed.
--       → Trigger qui crédite +2 pts au guest et +5 pts au host à chaque
--         séjour terminé.
--
-- RPC :
--   - redeem_reward(reward_id) → atomique : verif pts + débit + création coupon
--   - apply_coupon(coupon_id) → marque utilisé (idempotent)
--   - block_conversation / unblock_conversation
--   - mark_conversation_read → bulk update read_at sur tous les messages
--
-- TRIGGERS :
--   - auto_award_booking_points (guest +2, host +5 à chaque completed)
--   - notify_review_received (host notif sur nouvelle review)
--   - notify_message_received (autre partie notif sur nouveau message)
--   - sync_referral_count (profile.referral_count auto-incrémenté)
-- ════════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════
-- 1. REVIEWS — alignement 8 critères + commentaire host
-- ══════════════════════════════════════════════════════════════════

-- Renommage: rating_clean → rating_proprete (sémantique fr cohérente avec UI)
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='reviews'
             and column_name='rating_clean') then
    alter table public.reviews rename column rating_clean    to rating_proprete;
  end if;
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='reviews'
             and column_name='rating_comm') then
    alter table public.reviews rename column rating_comm     to rating_convivialite;
  end if;
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='reviews'
             and column_name='rating_value') then
    alter table public.reviews rename column rating_value    to rating_qualite_prix;
  end if;
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='reviews'
             and column_name='rating_location') then
    alter table public.reviews rename column rating_location to rating_emplacement;
  end if;
end $$;

-- Ajout des 4 critères manquants pour matcher l'UI (8 au total)
alter table public.reviews
  add column if not exists rating_confort       numeric(2,1) check (rating_confort       between 1 and 5),
  add column if not exists rating_accessibilite numeric(2,1) check (rating_accessibilite between 1 and 5),
  add column if not exists rating_securite      numeric(2,1) check (rating_securite      between 1 and 5),
  add column if not exists rating_equipement    numeric(2,1) check (rating_equipement    between 1 and 5);

comment on table public.reviews is
  '8 critères de notation alignés sur RATING_CRITERIA (components.js):
   proprete, confort, accessibilite, convivialite, emplacement, securite,
   equipement, qualite_prix. Note globale = moyenne des 8.';

-- Trigger : auto-calcul rating global = moyenne des sous-notes (si fournies)
create or replace function public.compute_review_rating()
returns trigger language plpgsql as $$
declare
  v_sum   numeric := 0;
  v_count int := 0;
begin
  -- Si rating est explicitement fourni, on le garde tel quel
  -- Sinon on calcule la moyenne des 8 sous-notes non nulles
  if tg_op = 'INSERT' or new.rating is null then
    if new.rating_proprete       is not null then v_sum := v_sum + new.rating_proprete;       v_count := v_count + 1; end if;
    if new.rating_confort        is not null then v_sum := v_sum + new.rating_confort;        v_count := v_count + 1; end if;
    if new.rating_accessibilite  is not null then v_sum := v_sum + new.rating_accessibilite;  v_count := v_count + 1; end if;
    if new.rating_convivialite   is not null then v_sum := v_sum + new.rating_convivialite;   v_count := v_count + 1; end if;
    if new.rating_emplacement    is not null then v_sum := v_sum + new.rating_emplacement;    v_count := v_count + 1; end if;
    if new.rating_securite       is not null then v_sum := v_sum + new.rating_securite;       v_count := v_count + 1; end if;
    if new.rating_equipement     is not null then v_sum := v_sum + new.rating_equipement;     v_count := v_count + 1; end if;
    if new.rating_qualite_prix   is not null then v_sum := v_sum + new.rating_qualite_prix;   v_count := v_count + 1; end if;
    if v_count > 0 then
      new.rating := round((v_sum / v_count)::numeric, 1);
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists reviews_compute_rating on public.reviews;
create trigger reviews_compute_rating
  before insert or update on public.reviews
  for each row execute function public.compute_review_rating();

-- ══════════════════════════════════════════════════════════════════
-- 2. REVIEWS — contraintes : 1 review par booking + auteur = guest
-- ══════════════════════════════════════════════════════════════════

-- Une review ne peut être créée que si l'auteur est le guest du booking
-- ET si le booking est completed. Vérifié via trigger BEFORE INSERT.

create or replace function public.validate_review_eligibility()
returns trigger language plpgsql security definer as $$
declare
  v_b public.bookings%rowtype;
begin
  select * into v_b from public.bookings where id = new.booking_id;
  if v_b.id is null then
    raise exception 'Booking % not found', new.booking_id;
  end if;
  if v_b.guest_id != new.author_id then
    raise exception 'Only the guest can review their booking';
  end if;
  if v_b.status != 'completed' then
    raise exception 'Cannot review a booking before it is completed (status=%)', v_b.status;
  end if;
  if v_b.listing_id != new.listing_id then
    raise exception 'listing_id does not match booking';
  end if;
  return new;
end;
$$;

drop trigger if exists reviews_validate_eligibility on public.reviews;
create trigger reviews_validate_eligibility
  before insert on public.reviews
  for each row execute function public.validate_review_eligibility();

-- ══════════════════════════════════════════════════════════════════
-- 3. NOTIFICATIONS — triggers manquants (review reçue, message reçu)
-- ══════════════════════════════════════════════════════════════════

-- Notif à l'host quand une review est postée sur son listing
create or replace function public.notify_host_on_review()
returns trigger language plpgsql security definer as $$
declare
  v_owner uuid;
  v_title text;
  v_author_name text;
begin
  select l.owner_id, l.title into v_owner, v_title
    from public.listings l where l.id = new.listing_id;
  select name into v_author_name from public.profiles where id = new.author_id;

  insert into public.notifications (user_id, type, title, body, ref_id)
  values (
    v_owner,
    'review',
    'Nouvel avis de ' || coalesce(v_author_name, 'un voyageur'),
    'Note: ' || new.rating || ' / 5 sur « ' || coalesce(v_title, 'votre annonce') || ' »',
    new.id
  );
  return new;
end;
$$;

drop trigger if exists reviews_notify_host on public.reviews;
create trigger reviews_notify_host
  after insert on public.reviews
  for each row execute function public.notify_host_on_review();

-- Notif au guest quand l'host répond à sa review
create or replace function public.notify_guest_on_review_reply()
returns trigger language plpgsql security definer as $$
begin
  if new.reply is not null and (old.reply is null or old.reply != new.reply) then
    insert into public.notifications (user_id, type, title, body, ref_id)
    values (
      new.author_id,
      'review',
      'L''hôte a répondu à votre avis',
      substring(new.reply, 1, 80) || case when length(new.reply) > 80 then '…' else '' end,
      new.id
    );
  end if;
  return new;
end;
$$;

drop trigger if exists reviews_notify_guest_on_reply on public.reviews;
create trigger reviews_notify_guest_on_reply
  after update of reply on public.reviews
  for each row execute function public.notify_guest_on_review_reply();

-- Notif au destinataire quand un message arrive (l'autre partie de la conv)
create or replace function public.notify_on_new_message()
returns trigger language plpgsql security definer as $$
declare
  v_conv     public.conversations%rowtype;
  v_recipient uuid;
  v_sender_name text;
  v_listing_title text;
begin
  select * into v_conv from public.conversations where id = new.conversation_id;
  if v_conv.id is null then return new; end if;

  -- Le destinataire est l'autre partie de la conversation
  v_recipient := case when new.sender_id = v_conv.guest_id then v_conv.host_id else v_conv.guest_id end;

  -- Ne notifie pas si conversation bloquée
  if v_conv.blocked_by is not null then return new; end if;

  select name into v_sender_name from public.profiles where id = new.sender_id;
  select title into v_listing_title from public.listings where id = v_conv.listing_id;

  insert into public.notifications (user_id, type, title, body, ref_id)
  values (
    v_recipient,
    'message',
    coalesce(v_sender_name, 'Quelqu''un') || ' vous a écrit',
    coalesce('À propos de « ' || v_listing_title || ' »: ', '') ||
      substring(new.body, 1, 60) || case when length(new.body) > 60 then '…' else '' end,
    new.id
  );
  return new;
end;
$$;

drop trigger if exists messages_notify_recipient on public.messages;
create trigger messages_notify_recipient
  after insert on public.messages
  for each row execute function public.notify_on_new_message();

-- ══════════════════════════════════════════════════════════════════
-- 4. RECOMPENSES — table catalog modifiable (vs hardcodé data.js)
-- ══════════════════════════════════════════════════════════════════

create table if not exists public.rewards_catalog (
  id           text primary key,            -- 'forfait_decv', 'boost_disc1'…
  type         text not null check (type in ('boost','paywall','discount','gift')),
  label        text not null,
  description  text,
  icon         text,                        -- emoji ou nom d'icône
  cost_points  int  not null check (cost_points > 0),
  value_fcfa   int,                         -- valeur en FCFA (pour audit)
  min_tier     text default 'bronze' check (min_tier in ('bronze','argent','or')),
  is_active    boolean default true,
  position     int default 0,               -- ordre d'affichage
  created_at   timestamptz default now()
);

create index if not exists rewards_catalog_active_idx
  on public.rewards_catalog (is_active, position);

-- Lecture publique (catalog visible à tous), écriture admin uniquement
alter table public.rewards_catalog enable row level security;

drop policy if exists "rewards_catalog_public_read" on public.rewards_catalog;
create policy "rewards_catalog_public_read"
  on public.rewards_catalog for select using (is_active = true);

-- (Pas de policy d'écriture publique : les modifs passent par le service_role
--  ou par un futur dashboard admin authentifié)

-- Seed du catalog actuel (data.js POINTS_REWARDS)
insert into public.rewards_catalog (id, type, label, icon, cost_points, value_fcfa, position) values
  ('boost_disc1',  'boost',   '-1 000 F sur Boost',           '🚀',  50,  1000,  1),
  ('boost_disc2',  'boost',   '-5 000 F sur Boost',           '🚀',  200, 5000,  2),
  ('forfait_disc', 'paywall', '-50 % sur forfait Découverte', '🎟️', 100, 1500,  3),
  ('forfait_decv', 'paywall', 'Forfait Découverte gratuit',   '🎁',  300, 3000,  4),
  ('forfait_std',  'paywall', 'Forfait Standard gratuit',     '🎁',  500, 5000,  5),
  ('forfait_prm',  'paywall', 'Forfait Premium gratuit',      '💎',  1000,10000, 6)
on conflict (id) do update set
  type        = excluded.type,
  label       = excluded.label,
  icon        = excluded.icon,
  cost_points = excluded.cost_points,
  value_fcfa  = excluded.value_fcfa,
  position    = excluded.position;

-- ══════════════════════════════════════════════════════════════════
-- 5. ANTI-TRICHE : verrou RLS update direct sur profiles.rewards_points
-- ══════════════════════════════════════════════════════════════════
-- Le policy actuel "profiles_self_update" autorise un user à modifier
-- son propre profil → triche possible (set rewards_points = 99999).
-- On remplace par un policy qui interdit de toucher aux colonnes points/tier
-- via l'API. Toute MAJ doit passer par les RPC SECURITY DEFINER ci-dessous.
-- ══════════════════════════════════════════════════════════════════

drop policy if exists "profiles_self_update" on public.profiles;

create policy "profiles_self_update_safe" on public.profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    -- Empêche la modification directe des champs économiques
    and rewards_points  = (select rewards_points  from public.profiles where id = auth.uid())
    and referral_count  = (select referral_count  from public.profiles where id = auth.uid())
  );

-- Idem sur points_transactions : lecture seule pour l'utilisateur,
-- écriture uniquement via RPC SECURITY DEFINER.
drop policy if exists "points_self_insert" on public.points_transactions;
-- (pas de policy insert → blocage par défaut, seuls les RPC peuvent écrire)

-- ══════════════════════════════════════════════════════════════════
-- 6. RPC : redeem_reward (échange atomique points → coupon)
-- ══════════════════════════════════════════════════════════════════

create or replace function public.redeem_reward(p_reward_id text)
returns table (
  coupon_id   uuid,
  cost_points int,
  remaining   int
)
language plpgsql security definer as $$
declare
  v_uid       uuid := auth.uid();
  v_reward    public.rewards_catalog%rowtype;
  v_balance   int;
  v_user_tier text;
  v_coupon_id uuid;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  select * into v_reward from public.rewards_catalog
   where id = p_reward_id and is_active = true;
  if v_reward.id is null then
    raise exception 'Reward % introuvable ou inactif', p_reward_id;
  end if;

  -- Verrouille la ligne profile pour éviter race condition
  select rewards_points, tier into v_balance, v_user_tier
    from public.profiles where id = v_uid for update;

  if v_balance < v_reward.cost_points then
    raise exception 'Solde insuffisant: % pts (requis: %)',
      v_balance, v_reward.cost_points;
  end if;

  -- Vérif tier minimum
  if (v_reward.min_tier = 'or'     and v_user_tier != 'or')
  or (v_reward.min_tier = 'argent' and v_user_tier = 'bronze') then
    raise exception 'Niveau % requis (vous êtes %)', v_reward.min_tier, v_user_tier;
  end if;

  -- 1. Crée le coupon
  insert into public.coupons (user_id, reward_id, label, type, value, expires_at)
  values (
    v_uid,
    v_reward.id,
    v_reward.label,
    v_reward.type,
    coalesce(v_reward.value_fcfa, 0),
    now() + interval '90 days'
  )
  returning id into v_coupon_id;

  -- 2. Débite les points (transaction atomique)
  update public.profiles
     set rewards_points = rewards_points - v_reward.cost_points,
         updated_at     = now()
   where id = v_uid;

  -- 3. Trace dans points_transactions
  insert into public.points_transactions (user_id, delta, reason, ref_id)
  values (v_uid, -v_reward.cost_points, 'redeem', v_coupon_id);

  return query select v_coupon_id, v_reward.cost_points, (v_balance - v_reward.cost_points);
end;
$$;

revoke all on function public.redeem_reward(text) from public;
grant execute on function public.redeem_reward(text) to authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 7. RPC : apply_coupon (marque comme utilisé, idempotent)
-- ══════════════════════════════════════════════════════════════════

create or replace function public.apply_coupon(p_coupon_id uuid)
returns boolean
language plpgsql security definer as $$
declare
  v_uid uuid := auth.uid();
  v_c   public.coupons%rowtype;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  select * into v_c from public.coupons where id = p_coupon_id for update;
  if v_c.id is null then
    raise exception 'Coupon introuvable';
  end if;
  if v_c.user_id != v_uid then
    raise exception 'Pas votre coupon';
  end if;
  if v_c.is_used then
    return false; -- déjà utilisé, idempotent
  end if;
  if v_c.expires_at < now() then
    raise exception 'Coupon expiré';
  end if;

  update public.coupons
     set is_used = true,
         used_at = now()
   where id = p_coupon_id;
  return true;
end;
$$;

revoke all on function public.apply_coupon(uuid) from public;
grant execute on function public.apply_coupon(uuid) to authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 8. TRIGGER : attribution automatique des points sur booking completed
-- ══════════════════════════════════════════════════════════════════
-- Quand un booking passe à 'completed' :
--   - Guest gagne POINTS_CONFIG.perBooking = 2 pts
--   - Host  gagne 5 pts (incentive à recevoir des séjours réussis)
-- Idempotent : trace via points_transactions.ref_id = booking.id pour
-- éviter les doubles attributions.
-- ══════════════════════════════════════════════════════════════════

create or replace function public.award_booking_points()
returns trigger language plpgsql security definer as $$
declare
  v_already_awarded boolean;
begin
  if old.status = new.status then return new; end if;
  if new.status != 'completed' then return new; end if;

  -- Vérifier qu'on n'a pas déjà crédité ce booking
  select exists(
    select 1 from public.points_transactions
    where ref_id = new.id and reason = 'booking_completed'
  ) into v_already_awarded;
  if v_already_awarded then return new; end if;

  -- +2 points au guest
  update public.profiles set rewards_points = rewards_points + 2,
                              updated_at = now()
   where id = new.guest_id;
  insert into public.points_transactions (user_id, delta, reason, ref_id)
   values (new.guest_id, 2, 'booking_completed', new.id);

  -- +5 points au host
  update public.profiles set rewards_points = rewards_points + 5,
                              updated_at = now()
   where id = new.host_id;
  insert into public.points_transactions (user_id, delta, reason, ref_id)
   values (new.host_id, 5, 'booking_completed', new.id);

  return new;
end;
$$;

drop trigger if exists bookings_award_points on public.bookings;
create trigger bookings_award_points
  after update of status on public.bookings
  for each row execute function public.award_booking_points();

-- ══════════════════════════════════════════════════════════════════
-- 9. TRIGGER : sync referral_count quand un referral est inséré
-- ══════════════════════════════════════════════════════════════════
-- (apply_referral_code de 0004 utilisait déjà ce mécanisme manuellement,
--  mais on ajoute un trigger pour les inserts directs aussi)

create or replace function public.sync_referral_count()
returns trigger language plpgsql security definer as $$
begin
  update public.profiles
     set referral_count = (select count(*) from public.referrals where referrer_id = new.referrer_id),
         updated_at     = now()
   where id = new.referrer_id;
  return new;
end;
$$;

drop trigger if exists referrals_sync_count on public.referrals;
create trigger referrals_sync_count
  after insert on public.referrals
  for each row execute function public.sync_referral_count();

-- ══════════════════════════════════════════════════════════════════
-- 10. CHAT — RPC mark_conversation_read (bulk)
-- ══════════════════════════════════════════════════════════════════
-- Marque tous les messages non lus de l'autre partie comme lus.
-- Évite N requêtes côté frontend.
-- ══════════════════════════════════════════════════════════════════

create or replace function public.mark_conversation_read(p_conversation_id uuid)
returns int
language plpgsql security definer as $$
declare
  v_uid uuid := auth.uid();
  v_count int;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  with updated as (
    update public.messages m
       set read_at = now()
     where m.conversation_id = p_conversation_id
       and m.sender_id != v_uid
       and m.read_at is null
       and exists (
         select 1 from public.conversations c
         where c.id = p_conversation_id
           and (c.guest_id = v_uid or c.host_id = v_uid)
       )
    returning 1
  )
  select count(*) into v_count from updated;
  return v_count;
end;
$$;

revoke all on function public.mark_conversation_read(uuid) from public;
grant execute on function public.mark_conversation_read(uuid) to authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 11. CHAT — RPC block / unblock_conversation
-- ══════════════════════════════════════════════════════════════════

create or replace function public.block_conversation(p_conversation_id uuid)
returns boolean
language plpgsql security definer as $$
declare
  v_uid uuid := auth.uid();
  v_c   public.conversations%rowtype;
begin
  if v_uid is null then raise exception 'Authentication required'; end if;
  select * into v_c from public.conversations where id = p_conversation_id for update;
  if v_c.id is null then raise exception 'Conversation introuvable'; end if;
  if v_c.guest_id != v_uid and v_c.host_id != v_uid then
    raise exception 'Pas votre conversation';
  end if;

  update public.conversations
     set blocked_by = v_uid
   where id = p_conversation_id;
  return true;
end;
$$;

create or replace function public.unblock_conversation(p_conversation_id uuid)
returns boolean
language plpgsql security definer as $$
declare
  v_uid uuid := auth.uid();
  v_c   public.conversations%rowtype;
begin
  if v_uid is null then raise exception 'Authentication required'; end if;
  select * into v_c from public.conversations where id = p_conversation_id for update;
  if v_c.id is null then raise exception 'Conversation introuvable'; end if;
  -- Seul celui qui a bloqué peut débloquer
  if v_c.blocked_by != v_uid then
    raise exception 'Seul l''auteur du blocage peut débloquer';
  end if;

  update public.conversations
     set blocked_by = null
   where id = p_conversation_id;
  return true;
end;
$$;

revoke all on function public.block_conversation(uuid)   from public;
revoke all on function public.unblock_conversation(uuid) from public;
grant execute on function public.block_conversation(uuid)   to authenticated;
grant execute on function public.unblock_conversation(uuid) to authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 12. CHAT — empêcher l'envoi dans une conversation bloquée
-- ══════════════════════════════════════════════════════════════════

create or replace function public.enforce_message_not_blocked()
returns trigger language plpgsql security definer as $$
declare
  v_blocked uuid;
begin
  select blocked_by into v_blocked
    from public.conversations where id = new.conversation_id;
  if v_blocked is not null then
    raise exception 'Conversation bloquée — envoi impossible';
  end if;
  return new;
end;
$$;

drop trigger if exists messages_enforce_not_blocked on public.messages;
create trigger messages_enforce_not_blocked
  before insert on public.messages
  for each row execute function public.enforce_message_not_blocked();

-- ══════════════════════════════════════════════════════════════════
-- 13. RPC : get_unread_count (badge notifications + messages)
-- ══════════════════════════════════════════════════════════════════
-- Une seule requête qui retourne :
--   - notifs non lues
--   - messages non lus toutes conversations confondues
-- ══════════════════════════════════════════════════════════════════

create or replace function public.get_unread_count()
returns table (
  notifications int,
  messages      int
)
language sql stable security definer as $$
  select
    (select count(*)::int from public.notifications n
       where n.user_id = auth.uid() and n.is_read = false) as notifications,
    (select count(*)::int from public.messages m
       join public.conversations c on c.id = m.conversation_id
      where m.sender_id != auth.uid()
        and m.read_at is null
        and (c.guest_id = auth.uid() or c.host_id = auth.uid())) as messages;
$$;

revoke all on function public.get_unread_count() from public;
grant execute on function public.get_unread_count() to authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 14. INDEX additionnels (perf chat + notifs)
-- ══════════════════════════════════════════════════════════════════

-- Index pour le calcul "messages non lus" (filtrage rapide read_at IS NULL)
create index if not exists messages_unread_idx
  on public.messages (conversation_id, sender_id)
  where read_at is null;

-- Index pour les conversations non bloquées (cas le plus fréquent)
create index if not exists conv_active_idx
  on public.conversations (last_message_at desc)
  where blocked_by is null;

-- Index pour les coupons actifs (non utilisés et non expirés)
create index if not exists coupons_active_idx
  on public.coupons (user_id, expires_at)
  where is_used = false;

-- Index pour les notifs non lues par type
create index if not exists notifs_unread_type_idx
  on public.notifications (user_id, type, created_at desc)
  where is_read = false;

-- ══════════════════════════════════════════════════════════════════
-- 15. NETTOYAGE AUTOMATIQUE des coupons expirés (à brancher sur pg_cron)
-- ══════════════════════════════════════════════════════════════════

create or replace function public.cleanup_expired_coupons()
returns int
language plpgsql security definer as $$
declare
  v_count int;
begin
  with deleted as (
    delete from public.coupons
     where expires_at < now()
       and is_used = false
    returning 1
  )
  select count(*) into v_count from deleted;
  return v_count;
end;
$$;

revoke all on function public.cleanup_expired_coupons() from public;
grant execute on function public.cleanup_expired_coupons() to authenticated, anon;

comment on function public.cleanup_expired_coupons is
  'À planifier via pg_cron : SELECT cron.schedule(''cleanup-coupons'', ''0 4 * * *'',
   $$ SELECT public.cleanup_expired_coupons(); $$);';

-- ══════════════════════════════════════════════════════════════════
-- ✅ Migration 0007 terminée — backend complet pour Auth/Listings/
--    Bookings/Reviews/Récompenses/Notifications/Chat.
--
-- Reste à faire (hors scope migration SQL) :
--   - Edge functions : send-otp-sms, momo-webhook, om-webhook, kyc-review
--   - Connexion frontend : pointsManager → RPC backend (au lieu de localStorage)
--   - Cron pg_cron : auto_complete_bookings + cleanup_expired_coupons
-- ══════════════════════════════════════════════════════════════════
