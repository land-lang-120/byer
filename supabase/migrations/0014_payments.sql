-- ════════════════════════════════════════════════════════════════════
-- 0014 — Système de paiement (Notch Pay puis MoMo/OM directs en V2)
-- ════════════════════════════════════════════════════════════════════
-- Enregistre chaque tentative de paiement (init → success/failed/cancel)
-- avec le tx_ref renvoyé par le PSP, le payload brut pour audit, et le
-- statut. Une réservation peut avoir plusieurs tentatives (retry après
-- échec), donc clé étrangère N:1 vers bookings.
--
-- Provider abstrait dès le départ : si on switch de Notch Pay vers Stripe
-- ou MoMo direct, seule la valeur de `provider` change. Idem pour les
-- multi-app (CarExpress, Pharmadroid, Sequoia) — même schéma reproductible.
-- ════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────
-- 1. Table payments
-- ────────────────────────────────────────────────────────────────────
create table if not exists public.payments (
  id              uuid primary key default gen_random_uuid(),
  booking_id      uuid not null references public.bookings(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,

  -- Provider abstrait (notchpay, stripe, momo_direct, om_direct, manual)
  provider        text not null check (provider in (
                    'notchpay','stripe','momo_direct','om_direct','manual'
                  )),
  -- Référence externe du PSP (ex: trx.xxx pour Notch Pay)
  tx_ref          text not null,
  -- Méthode de paiement choisie par l'utilisateur (champ informatif)
  method          text check (method in ('card','mtn_momo','orange_money','bank_transfer','manual')),

  -- Montant en centimes/units selon devise (FCFA = unité = 1)
  amount          integer not null check (amount > 0),
  currency        text not null default 'XAF' check (currency in ('XAF','EUR','USD')),

  -- Statut : pending → success / failed / cancelled / refunded
  status          text not null default 'pending' check (status in (
                    'pending','success','failed','cancelled','refunded'
                  )),

  -- URL hosted checkout retournée par le PSP (pour reprendre un paiement
  -- non finalisé dans les 30 min)
  checkout_url    text,

  -- Payload brut du PSP au moment du webhook final (audit + debug)
  raw_payload     jsonb,
  -- Message d'erreur PSP si status='failed'
  failure_reason  text,

  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),

  -- Unique : pas deux paiements avec le même tx_ref pour le même provider
  unique (provider, tx_ref)
);

create index if not exists payments_booking_idx on public.payments (booking_id, created_at desc);
create index if not exists payments_user_idx    on public.payments (user_id, created_at desc);
create index if not exists payments_status_idx  on public.payments (status) where status = 'pending';

-- ────────────────────────────────────────────────────────────────────
-- 2. Colonne payment_ref sur bookings (raccourci pour query rapide)
-- ────────────────────────────────────────────────────────────────────
-- Au lieu de toujours JOIN payments, on garde la dernière ref active
-- directement sur bookings. Mise à jour par le webhook quand le paiement
-- bascule à 'success'.
alter table public.bookings
  add column if not exists payment_ref text,
  add column if not exists payment_method text;

-- ────────────────────────────────────────────────────────────────────
-- 3. Trigger updated_at sur payments
-- ────────────────────────────────────────────────────────────────────
create or replace function public.payments_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists payments_touch on public.payments;
create trigger payments_touch
  before update on public.payments
  for each row execute function public.payments_touch_updated_at();

-- ────────────────────────────────────────────────────────────────────
-- 4. RLS : user voit ses propres paiements + bailleur voit ceux liés
--           à ses listings (via booking.host_id)
-- ────────────────────────────────────────────────────────────────────
alter table public.payments enable row level security;

drop policy if exists "payments_self_read" on public.payments;
create policy "payments_self_read" on public.payments
  for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.bookings b
      where b.id = payments.booking_id
      and (b.guest_id = auth.uid() or b.host_id = auth.uid())
    )
  );

-- INSERT et UPDATE strictement réservés aux Edge Functions (service_role).
-- Pas de policy INSERT / UPDATE pour authenticated → RLS bloque par défaut.
-- Les Edge Functions pay-init et pay-webhook utilisent service_role qui
-- bypass RLS. Le client ne peut PAS créer un paiement directement.

drop policy if exists "payments_no_client_write" on public.payments;
create policy "payments_no_client_write" on public.payments
  for insert with check (false);

drop policy if exists "payments_no_client_update" on public.payments;
create policy "payments_no_client_update" on public.payments
  for update using (false) with check (false);

-- ════════════════════════════════════════════════════════════════════
-- FIN MIGRATION 0014
-- ════════════════════════════════════════════════════════════════════
-- Tests post-déploiement :
-- A. Vérif structure :
--    select column_name, data_type from information_schema.columns
--    where table_name = 'payments' order by ordinal_position;
--
-- B. Vérif RLS bloque INSERT direct (en tant qu'authenticated) :
--    insert into public.payments (booking_id, user_id, provider, tx_ref,
--      amount, currency) values (...);
--    -- doit retourner: ERROR (RLS deny by default + policy with check false)
--
-- C. Vérif unique (provider, tx_ref) :
--    -- 2e insert avec mêmes valeurs → ERROR 23505
-- ════════════════════════════════════════════════════════════════════
