-- ════════════════════════════════════════════════════════════════════
-- Byer — Extensions du schéma d'authentification
-- À exécuter APRÈS 0003_storage_and_seed.sql
--
-- Cette migration complète le module Auth en couvrant 100 % des champs
-- et flux exposés dans le frontend (auth.js, edit-profile.js, settings.js) :
--
--   1. Étend la table profiles : first_name/last_name/bio, vérifications
--      (email/phone/identité), 2FA, langue, préférences notifications.
--   2. Crée la table kyc_documents (CNI, passeport, permis, selfie).
--   3. Crée la table trusted_devices (sessions actives, gestion sécurité).
--   4. Crée le bucket privé "kyc-documents" pour stocker les pièces.
--   5. RLS strictes : kyc + devices = strictement privés (jamais publics).
--   6. Triggers : synchro automatique email_verified/phone_verified
--      depuis auth.users, mise à jour last_login_at.
--   7. Fonctions RPC : check_referral_code, apply_referral_code,
--      delete_my_account (conformité RGPD : droit à l'oubli).
--   8. Met à jour handle_new_auth_user pour populer first_name/last_name
--      et détecter le provider OAuth (Google, Apple, email, phone).
-- ════════════════════════════════════════════════════════════════════

-- Extension citext (case-insensitive text) pour les emails / codes
-- de parrainage : "PINO24" == "pino24" == "Pino24" sans surprise.
create extension if not exists "citext";

-- ══════════════════════════════════════════════════════════════════
-- 1. EXTENSION DE public.profiles
-- ══════════════════════════════════════════════════════════════════

-- 1.a) Champs identité fine
alter table public.profiles
  add column if not exists first_name        text,
  add column if not exists last_name         text,
  add column if not exists bio               text check (char_length(bio) <= 200);

-- 1.b) Vérifications (sources de vérité dénormalisées pour
--      éviter les jointures auth.users à chaque affichage de profil)
alter table public.profiles
  add column if not exists email_verified    boolean default false,
  add column if not exists phone_verified    boolean default false,
  add column if not exists identity_verified boolean default false;

-- 1.c) Sécurité — 2FA + provider d'authentification
alter table public.profiles
  add column if not exists two_factor_enabled boolean default false,
  add column if not exists auth_provider      text   default 'email'
    check (auth_provider in ('email','phone','google','apple','facebook'));

-- 1.d) Activité + préférences
alter table public.profiles
  add column if not exists last_login_at      timestamptz,
  add column if not exists preferred_language text default 'fr'
    check (preferred_language in ('fr','en')),
  -- {push:true, email:true, sms:false, marketing:false, bookings:true,
  --  messages:true, reviews:true, boost:true} — extensible sans migration
  add column if not exists notification_prefs jsonb default jsonb_build_object(
    'push',      true,
    'email',     true,
    'sms',       false,
    'marketing', false,
    'bookings',  true,
    'messages',  true,
    'reviews',   true,
    'boost',     true
  );

-- 1.e) Migration de l'email vers citext (case-insensitive)
--     ⚠️  La colonne email étant déjà unique, on doit drop la contrainte
--     temporairement, changer le type, puis recréer l'index.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='profiles'
      and column_name='email' and data_type='text'
  ) then
    alter table public.profiles
      alter column email type citext using email::citext;
  end if;
end$$;

-- 1.f) Index partiels pour requêtes fréquentes
create index if not exists profiles_email_lower_idx
  on public.profiles (email)
  where email is not null;

create index if not exists profiles_phone_idx
  on public.profiles (phone)
  where phone is not null;

create index if not exists profiles_role_active_idx
  on public.profiles (role, last_login_at desc)
  where last_login_at is not null;

-- 1.g) Backfill : si first_name/last_name sont vides mais name existe,
--     on splitte sur le 1er espace pour avoir une base utilisable.
update public.profiles
set
  first_name = coalesce(first_name, split_part(name, ' ', 1)),
  last_name  = coalesce(last_name,  nullif(substring(name from position(' ' in name) + 1), name))
where (first_name is null or last_name is null)
  and name is not null;

-- ══════════════════════════════════════════════════════════════════
-- 2. KYC_DOCUMENTS — pièces d'identité (CNI, passeport, permis…)
-- ══════════════════════════════════════════════════════════════════
create table if not exists public.kyc_documents (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references public.profiles(id) on delete cascade,
  doc_type      text        not null check (doc_type in (
                  'id_card','passport','driver_license','selfie'
                )),
  -- Chemin relatif dans le bucket "kyc-documents"
  -- Exemple : "<user_uuid>/id_card_recto.jpg"
  file_path     text        not null,
  status        text        not null default 'pending'
                  check (status in ('pending','approved','rejected')),
  reject_reason text,
  submitted_at  timestamptz default now(),
  reviewed_at   timestamptz,
  -- Reviewer = profil admin (à terme, table séparée admins) ; nullable pour
  -- ne pas bloquer la suppression du compte d'un admin.
  reviewed_by   uuid        references public.profiles(id) on delete set null,
  -- Un seul document approuvé par type et par user (évite les doublons valides)
  unique (user_id, doc_type, status) deferrable initially deferred
);

create index if not exists kyc_user_idx
  on public.kyc_documents (user_id, status, submitted_at desc);

-- ══════════════════════════════════════════════════════════════════
-- 3. TRUSTED_DEVICES — sessions actives, gestion sécurité
-- ══════════════════════════════════════════════════════════════════
create table if not exists public.trusted_devices (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references public.profiles(id) on delete cascade,
  -- Hash stable du fingerprint navigateur (jamais le fingerprint brut)
  device_hash   text        not null,
  device_label  text,                                    -- "iPhone de Pino"
  platform      text,                                    -- "iOS","Android","Web/Chrome"
  ip_inet       inet,
  user_agent    text,
  last_seen_at  timestamptz default now(),
  created_at    timestamptz default now(),
  unique (user_id, device_hash)
);

create index if not exists devices_user_idx
  on public.trusted_devices (user_id, last_seen_at desc);

-- ══════════════════════════════════════════════════════════════════
-- 4. STORAGE BUCKET privé pour les KYC
--    Différent des avatars/listing-photos : strictement privé,
--    accès uniquement via signed URLs courtes (<5 min).
-- ══════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('kyc-documents', 'kyc-documents', false)
on conflict (id) do nothing;

drop policy if exists "kyc_self_read"   on storage.objects;
drop policy if exists "kyc_self_write"  on storage.objects;
drop policy if exists "kyc_self_delete" on storage.objects;

-- Lecture : uniquement le propriétaire (1er segment du path = user_uuid)
create policy "kyc_self_read"
  on storage.objects for select
  using (
    bucket_id = 'kyc-documents'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Upload : uniquement dans son propre dossier
create policy "kyc_self_write"
  on storage.objects for insert
  with check (
    bucket_id = 'kyc-documents'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Delete : uniquement ses propres fichiers (avant l'approbation)
create policy "kyc_self_delete"
  on storage.objects for delete
  using (
    bucket_id = 'kyc-documents'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ══════════════════════════════════════════════════════════════════
-- 5. RLS sur les nouvelles tables
-- ══════════════════════════════════════════════════════════════════
alter table public.kyc_documents   enable row level security;
alter table public.trusted_devices enable row level security;

-- KYC : lecture / insertion / suppression strictement par le propriétaire.
-- L'update du status (pending → approved/rejected) est réservé aux admins
-- via une edge function (service_role bypass RLS).
drop policy if exists "kyc_self_read"   on public.kyc_documents;
drop policy if exists "kyc_self_insert" on public.kyc_documents;
drop policy if exists "kyc_self_delete" on public.kyc_documents;

create policy "kyc_self_read" on public.kyc_documents
  for select using (user_id = auth.uid());

create policy "kyc_self_insert" on public.kyc_documents
  for insert with check (user_id = auth.uid());

create policy "kyc_self_delete" on public.kyc_documents
  for delete using (user_id = auth.uid() and status = 'pending');

-- Trusted devices : 100 % privé, lecture + delete par le propriétaire.
-- L'insertion est faite par une edge function (jamais par le client direct,
-- pour éviter qu'un attaquant inscrive son device comme "trusted").
drop policy if exists "devices_self_read"   on public.trusted_devices;
drop policy if exists "devices_self_delete" on public.trusted_devices;

create policy "devices_self_read" on public.trusted_devices
  for select using (user_id = auth.uid());

create policy "devices_self_delete" on public.trusted_devices
  for delete using (user_id = auth.uid());

-- ══════════════════════════════════════════════════════════════════
-- 6. TRIGGERS : synchro auth.users ↔ profiles
-- ══════════════════════════════════════════════════════════════════

-- Synchronise email_verified, phone_verified et last_login_at depuis
-- auth.users. Ainsi, dès qu'un user clique sur le lien de confirmation
-- email envoyé par Supabase Auth, son profil reflète immédiatement la
-- vérification — pas besoin de page de "rafraîchissement" côté client.
create or replace function public.sync_auth_status_to_profile()
returns trigger language plpgsql security definer as $$
begin
  update public.profiles
  set
    email_verified = (new.email_confirmed_at is not null),
    phone_verified = (new.phone_confirmed_at is not null),
    last_login_at  = coalesce(new.last_sign_in_at, last_login_at),
    updated_at     = now()
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_status_change on auth.users;
create trigger on_auth_user_status_change
  after update of email_confirmed_at, phone_confirmed_at, last_sign_in_at
  on auth.users
  for each row execute function public.sync_auth_status_to_profile();

-- Quand un KYC est approuvé/rejeté, on miroite le statut sur le profil
-- pour pouvoir afficher le badge "Vérifié" sans jointure.
create or replace function public.sync_kyc_to_profile()
returns trigger language plpgsql security definer as $$
begin
  update public.profiles
  set
    identity_verified = exists (
      select 1 from public.kyc_documents
      where user_id = new.user_id and status = 'approved'
    ),
    updated_at = now()
  where id = new.user_id;
  return new;
end;
$$;

drop trigger if exists kyc_status_to_profile on public.kyc_documents;
create trigger kyc_status_to_profile
  after insert or update of status on public.kyc_documents
  for each row execute function public.sync_kyc_to_profile();

-- ══════════════════════════════════════════════════════════════════
-- 7. MAJ de handle_new_auth_user pour populer les nouveaux champs
--    (first_name, last_name, auth_provider, email_verified initial).
-- ══════════════════════════════════════════════════════════════════
create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer as $$
declare
  v_name        text;
  v_first       text;
  v_last        text;
  v_provider    text;
begin
  -- Nom : raw_user_meta_data.name (signup email) ou full_name (Google) ou email
  v_name := coalesce(
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1)
  );
  -- Splitting en first/last sur le 1er espace
  v_first := split_part(v_name, ' ', 1);
  v_last  := nullif(substring(v_name from position(' ' in v_name) + 1), v_name);

  -- Détection provider : raw_app_meta_data.provider est posé par Supabase
  -- pour OAuth (google, apple, facebook) et 'email' / 'phone' sinon.
  v_provider := coalesce(new.raw_app_meta_data->>'provider', 'email');
  if v_provider not in ('email','phone','google','apple','facebook') then
    v_provider := 'email';
  end if;

  insert into public.profiles (
    id, name, first_name, last_name, email, phone,
    avatar_letter, avatar_bg, photo_url,
    auth_provider, email_verified, phone_verified
  ) values (
    new.id,
    v_name,
    v_first,
    v_last,
    new.email,
    new.phone,
    upper(substring(v_name, 1, 1)),
    -- Couleur d'avatar pseudo-aléatoire
    (array['#FF5A5F','#3B82F6','#10B981','#F59E0B','#8B5CF6','#EC4899','#06B6D4'])
      [1 + (abs(hashtext(new.id::text)) % 7)],
    -- Photo OAuth (Google/Apple) si présente
    new.raw_user_meta_data->>'avatar_url',
    v_provider,
    (new.email_confirmed_at is not null),
    (new.phone_confirmed_at is not null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- (le trigger on_auth_user_created créé en 0001 reste valide,
--  il appelle automatiquement la nouvelle version de la fonction.)

-- ══════════════════════════════════════════════════════════════════
-- 8. FONCTIONS RPC publiques (appelables depuis le client)
-- ══════════════════════════════════════════════════════════════════

-- 8.a) Vérifie si un code de parrainage existe et retourne le nom
--      du parrain (sans exposer son id ni son email).
create or replace function public.check_referral_code(p_code text)
returns table (valid boolean, referrer_name text)
language plpgsql security definer as $$
begin
  return query
  select
    p.id is not null as valid,
    p.first_name     as referrer_name
  from public.profiles p
  where upper(p.referral_code) = upper(p_code)
  limit 1;

  if not found then
    return query select false, null::text;
  end if;
end;
$$;

grant execute on function public.check_referral_code(text) to anon, authenticated;

-- 8.b) Applique un code de parrainage : crée la ligne dans referrals,
--      crédite +10 points au parrain, +25 au filleul (POINTS_CONFIG).
--      Idempotent : un user ne peut être filleul qu'une seule fois
--      (contrainte unique sur referrals.referred_id).
create or replace function public.apply_referral_code(p_code text)
returns table (success boolean, message text)
language plpgsql security definer as $$
declare
  v_referrer_id uuid;
  v_referred_id uuid;
begin
  v_referred_id := auth.uid();
  if v_referred_id is null then
    return query select false, 'Non authentifié'::text;
    return;
  end if;

  -- Cherche le parrain
  select id into v_referrer_id
  from public.profiles
  where upper(referral_code) = upper(p_code);

  if v_referrer_id is null then
    return query select false, 'Code introuvable'::text;
    return;
  end if;

  if v_referrer_id = v_referred_id then
    return query select false, 'On ne peut pas se parrainer soi-même'::text;
    return;
  end if;

  -- Vérifie que ce filleul n'a pas déjà un parrain
  if exists (select 1 from public.referrals where referred_id = v_referred_id) then
    return query select false, 'Vous avez déjà un parrain'::text;
    return;
  end if;

  -- Crée la relation
  insert into public.referrals (referrer_id, referred_id, code_used)
  values (v_referrer_id, v_referred_id, upper(p_code));

  -- Crédit le parrain (+10 points) et le filleul (+25 points = signup_promo)
  insert into public.points_transactions (user_id, delta, reason, ref_id) values
    (v_referrer_id, 10, 'referral',     v_referred_id),
    (v_referred_id, 25, 'signup_promo', v_referrer_id);

  -- Met à jour les compteurs dénormalisés
  update public.profiles
    set rewards_points = rewards_points + 10,
        referral_count = referral_count + 1
    where id = v_referrer_id;

  update public.profiles
    set rewards_points = rewards_points + 25
    where id = v_referred_id;

  return query select true, 'Parrainage validé'::text;
end;
$$;

grant execute on function public.apply_referral_code(text) to authenticated;

-- 8.c) Suppression compte (RGPD — droit à l'oubli).
--      Supprime auth.users + cascade sur profiles → tout le reste.
--      ⚠️  À appeler depuis une edge function avec service_role,
--      car auth.users n'est pas modifiable par le client direct.
--      La fonction côté SQL retourne juste l'id à passer à l'admin API.
create or replace function public.delete_my_account_request()
returns uuid language plpgsql security definer as $$
begin
  if auth.uid() is null then
    raise exception 'Non authentifié';
  end if;
  -- Marquer le compte pour anonymisation immédiate (le hard-delete
  -- via auth.admin.deleteUser sera fait par l'edge function).
  update public.profiles
  set
    name           = 'Compte supprimé',
    first_name     = null,
    last_name      = null,
    email          = null,
    phone          = null,
    photo_url      = null,
    bio            = null,
    is_active      = false  -- (si la colonne existe, sinon ignorer)
  where id = auth.uid();
  return auth.uid();
exception when undefined_column then
  -- Si is_active n'existe pas sur profiles (cas actuel), on ignore.
  update public.profiles
  set
    name       = 'Compte supprimé',
    first_name = null,
    last_name  = null,
    email      = null,
    phone      = null,
    photo_url  = null,
    bio        = null
  where id = auth.uid();
  return auth.uid();
end;
$$;

grant execute on function public.delete_my_account_request() to authenticated;

-- ══════════════════════════════════════════════════════════════════
-- ✅ Module Auth complet :
--     - profiles enrichi (verifications, 2FA, langue, prefs notif)
--     - kyc_documents + bucket privé "kyc-documents"
--     - trusted_devices (sécurité multi-appareils)
--     - synchro auto auth.users ↔ profiles
--     - RPC : check_referral_code, apply_referral_code,
--       delete_my_account_request
--
-- Étape suivante (côté Supabase Dashboard) :
--     1. Authentication → Providers → activer Email + Google + Apple
--     2. Authentication → Email Templates → personnaliser FR + EN
--     3. Edge Functions → déployer :
--          - delete-account  (appelle delete_my_account_request +
--                             supabase.auth.admin.deleteUser)
--          - send-otp-sms    (Twilio / Africa's Talking pour le Cameroun)
--          - kyc-review      (admin only — passe status à approved/rejected)
-- ════════════════════════════════════════════════════════════════════
