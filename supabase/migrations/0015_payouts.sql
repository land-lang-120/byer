-- ════════════════════════════════════════════════════════════════════
-- 0015 — Système de payouts AUTO aux bailleurs (Phase 4 V1 final)
-- ════════════════════════════════════════════════════════════════════
-- À chaque paiement de locataire confirmé (payments.status='success'),
-- on enregistre une row payouts pending qui sera traitée par un job cron
-- quotidien (Edge Function payout-host) et déclenchera un transfer
-- automatique du solde Notch Pay Byer vers le numéro MoMo/OM du
-- bailleur via l'API Notch Pay Transfers.
--
-- Pourquoi automatiser : à l'échelle prévue (30K+ tx/mois), reverser
-- manuellement chaque payout est physiquement impossible. Pino
-- n'intervient que pour vérifier le dashboard et fixer les payouts en
-- status='failed' (numéro invalide, nom non concordant, solde NP
-- insuffisant…).
--
-- Commission Byer : 2.5% du montant brut. Locataire paye 100 000 FCFA →
-- bailleur reçoit 97 500 FCFA, Byer encaisse 2 500 FCFA. Frais Notch
-- Pay (~2-3% sur le paiement entrant + ~50-100 XAF fixe sur le transfer
-- sortant) sont absorbés par Byer sur sa marge.
--
-- Délai 24h après checkout : sécurité anti-fraude/réclamation. Si le
-- locataire signale un problème dans les 24h, le payout reste pending
-- (peut être annulé). Sinon il devient éligible et le cron le libère.
-- ════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────
-- 1. Colonnes payout sur profiles (infos bailleur pour reversement)
-- ────────────────────────────────────────────────────────────────────
-- Sans ces 3 infos, le bailleur ne peut PAS publier d'annonce (UX
-- strict côté frontend dans publish.js wizard). Elles sont demandées
-- à la 1ère publication et restent éditables depuis ProfileScreen.

alter table public.profiles
  add column if not exists payout_method text
    check (payout_method is null or payout_method in ('mtn_momo','orange_money')),
  add column if not exists payout_phone  text,
  add column if not exists payout_name   text;

comment on column public.profiles.payout_method is
  'Méthode de réception des reversements pour les bailleurs : mtn_momo ou orange_money. NULL pour les locataires uniquement.';
comment on column public.profiles.payout_phone is
  'Numéro MoMo/OM (format +237XXXXXXXXX) où Notch Pay envoie les fonds.';
comment on column public.profiles.payout_name is
  'Nom inscrit sur le compte MoMo/OM (pour matching côté Notch Pay).';

-- ────────────────────────────────────────────────────────────────────
-- 2. Fonction utilitaire : calcul commission Byer (2.5%)
-- ────────────────────────────────────────────────────────────────────
-- Centralise le taux pour éviter qu'il dérive entre frontend, trigger
-- et Edge Function. Si on change la commission un jour, c'est ICI.
-- Arrondi à l'entier inférieur (favorable au bailleur sur les arrondis).

create or replace function public.calc_byer_commission(p_amount integer)
returns integer
language sql immutable as $$
  select greatest(0, floor(p_amount * 0.025))::integer;
$$;

comment on function public.calc_byer_commission(integer) is
  'Commission Byer = 2.5% du montant brut, arrondi à l''entier inférieur.';

-- ────────────────────────────────────────────────────────────────────
-- 3. Table payouts
-- ────────────────────────────────────────────────────────────────────
-- 1 row par booking (unique constraint). Le retry sur failed se fait
-- via UPDATE de la row existante, pas INSERT d'une nouvelle.

create table if not exists public.payouts (
  id              uuid primary key default gen_random_uuid(),

  -- FK vers booking : on delete restrict pour préserver l'historique
  -- même si quelqu'un tente de delete un booking (ne doit pas arriver
  -- sauf cleanup admin manuel).
  booking_id      uuid not null unique
                  references public.bookings(id) on delete restrict,

  -- FK vers profil bailleur (le destinataire du payout). Snapshot
  -- au moment du INSERT, pas redondant avec bookings.host_id car on
  -- veut survivre au cas où le booking serait orphelin.
  host_id         uuid not null references public.profiles(id) on delete cascade,

  -- Montants en unités (FCFA = 1, pas de centimes)
  amount_gross    integer not null check (amount_gross > 0),
  commission_byer integer not null check (commission_byer >= 0),
  -- amount_net est dérivé en colonne stockée (jamais de drift possible)
  amount_net      integer generated always as (amount_gross - commission_byer) stored,
  currency        text    not null default 'XAF'
                  check (currency in ('XAF','EUR','USD')),

  -- Statut : pending → processing → paid | failed | cancelled | refunded
  status          text    not null default 'pending'
                  check (status in ('pending','processing','paid','failed','cancelled','refunded')),

  -- Quand le payout devient éligible (= checkout + 24h, fenêtre anti-fraude)
  due_at          timestamptz not null,

  -- Snapshot des coordonnées de paiement au moment du transfer.
  -- On copie depuis profiles au moment de l'invocation payout-host
  -- pour éviter qu'un changement profil après-coup casse la traçabilité.
  payout_method   text,
  payout_phone    text,

  -- Référence Notch Pay du transfer (transfer_id) — set par payout-host
  payout_ref      text,

  -- Audit en cas d'échec / debug
  failure_reason  text,
  raw_payload     jsonb,

  paid_at         timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ────────────────────────────────────────────────────────────────────
-- 4. Index pour le job cron (recherche des payouts éligibles)
-- ────────────────────────────────────────────────────────────────────
-- Index partiel sur status + due_at : ultra-efficace car on ne regarde
-- que pending/failed (les retries) et on filtre par due_at < now().
create index if not exists payouts_eligible_idx
  on public.payouts (status, due_at)
  where status in ('pending','failed');

-- Index pour le dashboard bailleur (voir ses payouts récents)
create index if not exists payouts_host_idx
  on public.payouts (host_id, created_at desc);

-- Index pour le dashboard admin Pino
create index if not exists payouts_status_idx
  on public.payouts (status, created_at desc);

-- ────────────────────────────────────────────────────────────────────
-- 5. Trigger updated_at
-- ────────────────────────────────────────────────────────────────────

create or replace function public.payouts_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists payouts_touch on public.payouts;
create trigger payouts_touch
  before update on public.payouts
  for each row execute function public.payouts_touch_updated_at();

-- ────────────────────────────────────────────────────────────────────
-- 6. Trigger auto-création payout sur payment.status → success
-- ────────────────────────────────────────────────────────────────────
-- C'EST LE LIEN ENTRE pay-webhook ET LE SYSTÈME PAYOUT :
-- quand pay-webhook (Edge Function) update payments.status = 'success'
-- (suite à un webhook Notch Pay payment.complete), ce trigger SQL crée
-- automatiquement la row payouts associée. Pas besoin de logique
-- explicite côté pay-webhook → découplage propre.
--
-- Idempotent via le ON CONFLICT (booking_id) DO NOTHING : si le webhook
-- est rejoué (Notch Pay retry), pas de duplicate. Le booking_id est
-- unique sur payouts.

create or replace function public.auto_create_payout_on_payment_success()
returns trigger
language plpgsql security definer as $$
declare
  v_host_id  uuid;
  v_checkout date;
  v_commission integer;
begin
  -- Ne déclenche que sur la transition vers 'success'
  if new.status <> 'success' then
    return new;
  end if;
  if old.status = 'success' then
    return new;  -- déjà traité, no-op
  end if;

  -- Récupère host_id et checkout depuis bookings
  select b.host_id, b.checkout
    into v_host_id, v_checkout
    from public.bookings b
   where b.id = new.booking_id;

  if v_host_id is null or v_checkout is null then
    -- Booking introuvable ou incomplet — on log et on n'insère pas
    -- (ne doit pas arriver, mais défense en profondeur)
    raise warning 'auto_create_payout: booking % introuvable ou checkout null', new.booking_id;
    return new;
  end if;

  v_commission := public.calc_byer_commission(new.amount);

  insert into public.payouts (
    booking_id, host_id, amount_gross, commission_byer,
    currency, status, due_at
  ) values (
    new.booking_id, v_host_id, new.amount, v_commission,
    new.currency,
    'pending',
    -- Délai 24h après checkout : fenêtre anti-réclamation
    (v_checkout + interval '24 hours')::timestamptz
  )
  on conflict (booking_id) do nothing;
  -- ↑ idempotent : si payout déjà créé (webhook rejoué), no-op

  return new;
end;
$$;

comment on function public.auto_create_payout_on_payment_success() is
  'Crée automatiquement une row payouts en pending lorsqu''un paiement passe à success. Calcule la commission Byer (2.5%) et le délai de libération (checkout + 24h).';

drop trigger if exists payments_to_payouts on public.payments;
create trigger payments_to_payouts
  after update of status on public.payments
  for each row execute function public.auto_create_payout_on_payment_success();

-- ────────────────────────────────────────────────────────────────────
-- 7. RLS : bailleur voit ses propres payouts, AUCUN write client
-- ────────────────────────────────────────────────────────────────────

alter table public.payouts enable row level security;

drop policy if exists "payouts_host_read" on public.payouts;
create policy "payouts_host_read" on public.payouts
  for select
  using (host_id = auth.uid());

-- INSERT et UPDATE bloqués pour authenticated. Seules les Edge Functions
-- service_role (auto_create_payout_on_payment_success en SECURITY DEFINER
-- + payout-host pour le transfer + transfer-webhook pour la conf) peuvent
-- écrire. Le client ne crée JAMAIS un payout directement.

drop policy if exists "payouts_no_client_insert" on public.payouts;
create policy "payouts_no_client_insert" on public.payouts
  for insert with check (false);

drop policy if exists "payouts_no_client_update" on public.payouts;
create policy "payouts_no_client_update" on public.payouts
  for update using (false) with check (false);

-- ────────────────────────────────────────────────────────────────────
-- 8. Vue agrégée pour le dashboard admin Pino (commission Byer & cie)
-- ────────────────────────────────────────────────────────────────────
-- Permet au dashboard d'afficher des stats sans recalculer côté frontend.
-- Réservée au service_role (pas exposée en RLS public — cas d'admin).

create or replace view public.byer_payouts_stats as
select
  date_trunc('month', created_at)::date as month,
  count(*)                                as total_payouts,
  count(*) filter (where status = 'paid') as paid_count,
  count(*) filter (where status = 'pending')    as pending_count,
  count(*) filter (where status = 'processing') as processing_count,
  count(*) filter (where status = 'failed')     as failed_count,
  sum(amount_gross)    filter (where status = 'paid') as gross_paid,
  sum(amount_net)      filter (where status = 'paid') as net_paid,
  sum(commission_byer) filter (where status = 'paid') as commission_paid,
  sum(amount_gross)    filter (where status in ('pending','processing')) as gross_pending
from public.payouts
group by 1
order by 1 desc;

comment on view public.byer_payouts_stats is
  'Stats mensuelles agrégées des payouts pour le dashboard admin Pino. Lecture service_role.';

-- ════════════════════════════════════════════════════════════════════
-- FIN MIGRATION 0015
-- ════════════════════════════════════════════════════════════════════
-- Prochaines étapes (Batch 2 + 3 + 4) :
--   • Edge Function `payout-host` qui appelle Notch Pay /transfers
--   • Job pg_cron quotidien à 02:00 GMT
--   • pay-webhook upgrade pour les events transfer.*
--   • Frontend : retirer "Virement bancaire" + wizard bailleur + dashboard
-- ════════════════════════════════════════════════════════════════════
