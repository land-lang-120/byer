-- ════════════════════════════════════════════════════════════════════
-- Byer — Politiques RLS (Row-Level Security)
-- À exécuter APRÈS 0001_initial_schema.sql
-- Ces règles garantissent qu'aucun user ne peut voir/modifier les
-- données d'un autre user via l'API publique (clé anon).
-- ════════════════════════════════════════════════════════════════════

-- Active RLS sur toutes les tables
alter table public.profiles            enable row level security;
alter table public.listings            enable row level security;
alter table public.listing_photos      enable row level security;
alter table public.bookings            enable row level security;
alter table public.conversations       enable row level security;
alter table public.messages            enable row level security;
alter table public.reviews             enable row level security;
alter table public.points_transactions enable row level security;
alter table public.coupons             enable row level security;
alter table public.referrals           enable row level security;
alter table public.notifications       enable row level security;

-- ══════════════════════════════════════════════════════════════════
-- PROFILES — lecture publique (avatar+nom des hosts visibles partout),
-- modification réservée au propriétaire du profil.
-- ══════════════════════════════════════════════════════════════════
drop policy if exists "profiles_public_read"  on public.profiles;
drop policy if exists "profiles_self_update"  on public.profiles;

create policy "profiles_public_read" on public.profiles
  for select using (true);

create policy "profiles_self_update" on public.profiles
  for update using (id = auth.uid());

-- ══════════════════════════════════════════════════════════════════
-- LISTINGS — annonces actives visibles par tous, gestion par owner.
-- ══════════════════════════════════════════════════════════════════
drop policy if exists "listings_active_read"   on public.listings;
drop policy if exists "listings_owner_insert"  on public.listings;
drop policy if exists "listings_owner_update"  on public.listings;
drop policy if exists "listings_owner_delete"  on public.listings;

create policy "listings_active_read" on public.listings
  for select using (is_active = true or owner_id = auth.uid());

create policy "listings_owner_insert" on public.listings
  for insert with check (owner_id = auth.uid());

create policy "listings_owner_update" on public.listings
  for update using (owner_id = auth.uid());

create policy "listings_owner_delete" on public.listings
  for delete using (owner_id = auth.uid());

-- ══════════════════════════════════════════════════════════════════
-- LISTING_PHOTOS — lecture publique, gestion par l'owner du listing.
-- ══════════════════════════════════════════════════════════════════
drop policy if exists "photos_read"        on public.listing_photos;
drop policy if exists "photos_owner_write" on public.listing_photos;

create policy "photos_read" on public.listing_photos
  for select using (true);

create policy "photos_owner_write" on public.listing_photos
  for all using (
    exists (
      select 1 from public.listings l
      where l.id = listing_photos.listing_id
      and l.owner_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════════════════════════
-- BOOKINGS — visibles uniquement par les 2 parties (guest + host).
-- ══════════════════════════════════════════════════════════════════
drop policy if exists "bookings_party_read"    on public.bookings;
drop policy if exists "bookings_guest_create"  on public.bookings;
drop policy if exists "bookings_party_update"  on public.bookings;

create policy "bookings_party_read" on public.bookings
  for select using (guest_id = auth.uid() or host_id = auth.uid());

create policy "bookings_guest_create" on public.bookings
  for insert with check (guest_id = auth.uid());

create policy "bookings_party_update" on public.bookings
  for update using (guest_id = auth.uid() or host_id = auth.uid());

-- ══════════════════════════════════════════════════════════════════
-- CONVERSATIONS + MESSAGES — strictement entre les 2 parties.
-- ══════════════════════════════════════════════════════════════════
drop policy if exists "conversations_party_read"    on public.conversations;
drop policy if exists "conversations_party_create"  on public.conversations;
drop policy if exists "conversations_party_update"  on public.conversations;

create policy "conversations_party_read" on public.conversations
  for select using (guest_id = auth.uid() or host_id = auth.uid());

create policy "conversations_party_create" on public.conversations
  for insert with check (guest_id = auth.uid() or host_id = auth.uid());

create policy "conversations_party_update" on public.conversations
  for update using (guest_id = auth.uid() or host_id = auth.uid());

drop policy if exists "messages_party_read"  on public.messages;
drop policy if exists "messages_party_send"  on public.messages;

create policy "messages_party_read" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and (c.guest_id = auth.uid() or c.host_id = auth.uid())
    )
  );

create policy "messages_party_send" on public.messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and (c.guest_id = auth.uid() or c.host_id = auth.uid())
    )
  );

-- ══════════════════════════════════════════════════════════════════
-- REVIEWS — lecture publique, écriture par l'auteur,
-- réponse possible par l'owner du listing (pour le champ `reply`).
-- ══════════════════════════════════════════════════════════════════
drop policy if exists "reviews_public_read"    on public.reviews;
drop policy if exists "reviews_author_insert"  on public.reviews;
drop policy if exists "reviews_author_update"  on public.reviews;

create policy "reviews_public_read" on public.reviews
  for select using (true);

create policy "reviews_author_insert" on public.reviews
  for insert with check (author_id = auth.uid());

create policy "reviews_author_update" on public.reviews
  for update using (
    author_id = auth.uid()
    or exists (
      select 1 from public.listings l
      where l.id = reviews.listing_id and l.owner_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════════════════════════
-- POINTS / COUPONS / REFERRALS — lecture par le propriétaire,
-- écriture via fonctions SECURITY DEFINER (RPC) pour éviter la triche.
-- ══════════════════════════════════════════════════════════════════
drop policy if exists "points_self_read" on public.points_transactions;
create policy "points_self_read" on public.points_transactions
  for select using (user_id = auth.uid());

drop policy if exists "coupons_self_read" on public.coupons;
create policy "coupons_self_read" on public.coupons
  for select using (user_id = auth.uid());

drop policy if exists "referrals_self_read" on public.referrals;
create policy "referrals_self_read" on public.referrals
  for select using (referrer_id = auth.uid() or referred_id = auth.uid());

-- ══════════════════════════════════════════════════════════════════
-- NOTIFICATIONS — chaque user voit / marque comme lues les siennes.
-- ══════════════════════════════════════════════════════════════════
drop policy if exists "notifs_self_read"   on public.notifications;
drop policy if exists "notifs_self_update" on public.notifications;

create policy "notifs_self_read"   on public.notifications
  for select using (user_id = auth.uid());

create policy "notifs_self_update" on public.notifications
  for update using (user_id = auth.uid());

-- ══════════════════════════════════════════════════════════════════
-- ✅ RLS activée. La base est sécurisée pour usage public.
-- ══════════════════════════════════════════════════════════════════
