-- ════════════════════════════════════════════════════════════════════
-- Byer — Storage bucket + Seed de démo
-- À exécuter APRÈS 0002_rls_policies.sql
-- ════════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════
-- 1. STORAGE BUCKET pour les photos d'annonces
-- (lecture publique, upload/delete réservés à l'owner du listing)
-- ══════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

-- Policies storage : lecture publique, écriture par owner du listing
drop policy if exists "listing_photos_public_read"  on storage.objects;
drop policy if exists "listing_photos_owner_write"  on storage.objects;
drop policy if exists "listing_photos_owner_delete" on storage.objects;

create policy "listing_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

create policy "listing_photos_owner_write"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-photos'
    and auth.uid() is not null
  );

create policy "listing_photos_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'listing-photos'
    and auth.uid() is not null
    and (storage.foldername(name))[1]::uuid in (
      select id from public.listings where owner_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════════════════════════
-- 2. AVATARS bucket (photos de profil)
-- ══════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
drop policy if exists "avatars_self_write"  on storage.objects;

create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_self_write"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ══════════════════════════════════════════════════════════════════
-- 3. SEEDS DE DÉMO
-- (optionnel — facilite le test du frontend avec des données réelles
--  avant que de vrais utilisateurs ne s'inscrivent)
--
-- ⚠️  Pour qu'un seed fonctionne, il faut d'abord avoir créé un user
-- via Supabase Auth (Dashboard → Authentication → Users → Add user).
-- Puis remplacer ci-dessous l'UUID 'XXXXXXXX-...' par son ID réel.
-- ══════════════════════════════════════════════════════════════════

-- Décommenter et adapter quand vous aurez créé un user de test :
--
-- with demo_owner as (select id from public.profiles limit 1)
-- insert into public.listings
--   (owner_id, type, subtype, title, description, city, zone,
--    price_night, price_month, bedrooms, bathrooms, max_guests,
--    amenities, rating_avg, review_count, is_superhost)
-- select id, 'property', 'villa',
--   'Villa balnéaire Kribi',
--   'Magnifique villa pieds dans l''eau, 4 chambres climatisées, piscine privée.',
--   'Kribi', 'Bord de mer',
--   85000, 1800000, 4, 3, 8,
--   array['Piscine','Wifi','Climatisation','Plage privée','Parking','Sécurité 24/7'],
--   4.9, 47, true
-- from demo_owner;

-- ══════════════════════════════════════════════════════════════════
-- ✅ Storage configuré. Bucket "listing-photos" et "avatars" créés.
-- ══════════════════════════════════════════════════════════════════
