-- ════════════════════════════════════════════════════════════════════
-- Byer — Schéma initial Supabase
-- À exécuter UNE FOIS dans : Dashboard → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════════

-- Extensions nécessaires
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ══════════════════════════════════════════════════════════════════
-- 1. PROFILES (extension de auth.users gérée par Supabase Auth)
-- ══════════════════════════════════════════════════════════════════
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  name            text not null,
  email           text unique,
  phone           text,
  photo_url       text,
  avatar_letter   text,                                 -- "P" pour Pino
  avatar_bg       text,                                 -- couleur hex "#3B82F6"
  city            text,                                 -- "Douala", "Yaoundé"
  role            text default 'locataire' check (role in ('locataire','bailleur')),
  member_since    date default current_date,
  referral_code   text unique,

  -- Système de récompenses
  rewards_points  integer default 25 check (rewards_points >= 0),
  referral_count  integer default 0 check (referral_count >= 0),
  tier            text generated always as (
    case
      when rewards_points >= 500 then 'or'
      when rewards_points >= 100 then 'argent'
      else 'bronze'
    end
  ) stored,

  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ══════════════════════════════════════════════════════════════════
-- 2. LISTINGS (logements + véhicules dans la même table, type discriminant)
-- ══════════════════════════════════════════════════════════════════
create table if not exists public.listings (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references public.profiles(id) on delete cascade,
  type          text not null check (type in ('property','vehicle')),
  subtype       text,                          -- 'villa','studio','suv','sedan'…
  title         text not null,
  description   text,
  city          text not null,
  zone          text,                          -- 'Akwa', 'Bonanjo'
  address       text,
  lat           numeric(9,6),
  lng           numeric(9,6),

  -- Tarifs (FCFA)
  price_night   integer,
  price_month   integer,

  -- Logement
  bedrooms      integer,
  bathrooms     integer,
  max_guests    integer,

  -- Véhicule
  brand         text,
  model         text,
  year          integer,
  fuel          text,
  transmission  text,

  -- Commun
  amenities     text[] default '{}',           -- {Piscine,Wifi,Climatisation}
  rating_avg    numeric(3,2) default 0,
  review_count  integer default 0,
  is_superhost  boolean default false,
  is_active     boolean default true,

  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists listings_owner_idx       on public.listings (owner_id);
create index if not exists listings_city_type_idx   on public.listings (city, type) where is_active = true;
create index if not exists listings_rating_idx      on public.listings (rating_avg desc) where is_active = true;

-- ══════════════════════════════════════════════════════════════════
-- 3. LISTING_PHOTOS
-- ══════════════════════════════════════════════════════════════════
create table if not exists public.listing_photos (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  url         text not null,
  position    integer default 0,
  created_at  timestamptz default now()
);

create index if not exists photos_listing_idx on public.listing_photos (listing_id, position);

-- ══════════════════════════════════════════════════════════════════
-- 4. BOOKINGS (réservations)
-- ══════════════════════════════════════════════════════════════════
create table if not exists public.bookings (
  id              uuid primary key default gen_random_uuid(),
  ref             text unique not null default 'BYR-' || lpad(floor(random()*1000000)::text, 6, '0'),
  guest_id        uuid not null references public.profiles(id) on delete restrict,
  host_id         uuid not null references public.profiles(id) on delete restrict,
  listing_id      uuid not null references public.listings(id) on delete restrict,

  checkin         date not null,
  checkout        date not null,
  nights          integer generated always as (checkout - checkin) stored,
  guests_count    integer default 1,

  total_price     integer not null,            -- FCFA
  payment_method  text,                        -- 'momo','om','card'
  payment_status  text default 'pending' check (payment_status in ('pending','paid','refunded','failed')),

  status          text default 'pending' check (status in ('pending','confirmed','active','completed','cancelled')),
  cancel_reason   text,

  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),

  check (checkout > checkin)
);

create index if not exists bookings_guest_idx    on public.bookings (guest_id, status);
create index if not exists bookings_host_idx     on public.bookings (host_id, status);
create index if not exists bookings_listing_idx  on public.bookings (listing_id, checkin);

-- ══════════════════════════════════════════════════════════════════
-- 5. CONVERSATIONS + MESSAGES (chat temps réel)
-- ══════════════════════════════════════════════════════════════════
create table if not exists public.conversations (
  id               uuid primary key default gen_random_uuid(),
  guest_id         uuid not null references public.profiles(id) on delete cascade,
  host_id          uuid not null references public.profiles(id) on delete cascade,
  listing_id       uuid references public.listings(id) on delete set null,
  blocked_by       uuid references public.profiles(id),
  last_message_at  timestamptz default now(),
  created_at       timestamptz default now(),
  unique (guest_id, host_id, listing_id)
);

create index if not exists conv_guest_idx on public.conversations (guest_id, last_message_at desc);
create index if not exists conv_host_idx  on public.conversations (host_id,  last_message_at desc);

create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  sender_id        uuid not null references public.profiles(id),
  body             text not null,
  read_at          timestamptz,
  created_at       timestamptz default now()
);

create index if not exists messages_conv_idx on public.messages (conversation_id, created_at desc);

-- ══════════════════════════════════════════════════════════════════
-- 6. REVIEWS (avis multi-critères)
-- ══════════════════════════════════════════════════════════════════
create table if not exists public.reviews (
  id              uuid primary key default gen_random_uuid(),
  booking_id      uuid not null references public.bookings(id) on delete cascade,
  listing_id      uuid not null references public.listings(id) on delete cascade,
  author_id       uuid not null references public.profiles(id),

  rating          numeric(2,1) not null check (rating between 1 and 5),
  rating_clean    numeric(2,1) check (rating_clean    between 1 and 5),
  rating_comm     numeric(2,1) check (rating_comm     between 1 and 5),
  rating_value    numeric(2,1) check (rating_value    between 1 and 5),
  rating_location numeric(2,1) check (rating_location between 1 and 5),

  body            text,
  reply           text,                       -- réponse de l'hôte
  reply_at        timestamptz,

  created_at      timestamptz default now(),
  unique (booking_id, author_id)
);

create index if not exists reviews_listing_idx on public.reviews (listing_id, created_at desc);

-- ══════════════════════════════════════════════════════════════════
-- 7. POINTS / COUPONS / RÉFÉRENCES (système de récompenses)
-- ══════════════════════════════════════════════════════════════════
create table if not exists public.points_transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  delta       integer not null,
  reason      text not null,                  -- 'referral','booking','redeem','signup_promo'
  ref_id      uuid,
  created_at  timestamptz default now()
);

create index if not exists points_user_idx on public.points_transactions (user_id, created_at desc);

create table if not exists public.coupons (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  reward_id   text not null,                  -- 'forfait_decv','boost_disc1'
  label       text not null,
  type        text not null,                  -- 'boost','paywall'
  value       integer not null,               -- FCFA
  is_used     boolean default false,
  used_at     timestamptz,
  expires_at  timestamptz default (now() + interval '90 days'),
  created_at  timestamptz default now()
);

create index if not exists coupons_user_idx on public.coupons (user_id) where is_used = false;

create table if not exists public.referrals (
  id           uuid primary key default gen_random_uuid(),
  referrer_id  uuid not null references public.profiles(id),
  referred_id  uuid unique not null references public.profiles(id) on delete cascade,
  code_used    text,
  created_at   timestamptz default now()
);

-- ══════════════════════════════════════════════════════════════════
-- 8. NOTIFICATIONS in-app
-- ══════════════════════════════════════════════════════════════════
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null check (type in ('booking','message','rent','boost','review','tech','system')),
  title       text not null,
  body        text,
  ref_id      uuid,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

create index if not exists notifs_user_idx on public.notifications (user_id, created_at desc) where is_read = false;

-- ══════════════════════════════════════════════════════════════════
-- 9. TRIGGERS UTILITAIRES
-- ══════════════════════════════════════════════════════════════════

-- Génère un referral_code automatiquement à l'inscription
create or replace function public.generate_referral_code()
returns trigger language plpgsql as $$
begin
  if new.referral_code is null then
    new.referral_code := upper(substring(replace(coalesce(new.name,'BYER'), ' ', ''), 1, 6)) || '24';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_set_referral_code on public.profiles;
create trigger profiles_set_referral_code
  before insert on public.profiles
  for each row execute function public.generate_referral_code();

-- Bumpe updated_at à chaque modification
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists listings_touch on public.listings;
create trigger listings_touch before update on public.listings
  for each row execute function public.touch_updated_at();

drop trigger if exists bookings_touch on public.bookings;
create trigger bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();

-- ══════════════════════════════════════════════════════════════════
-- 10. AUTO-CRÉATION DU PROFIL À L'INSCRIPTION
-- Quand un user signe via Supabase Auth, on crée automatiquement
-- son profil dans public.profiles avec le nom + email du metadata.
-- ══════════════════════════════════════════════════════════════════
create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email, phone, avatar_letter, avatar_bg)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.phone,
    upper(substring(coalesce(new.raw_user_meta_data->>'name', new.email), 1, 1)),
    -- Couleur d'avatar pseudo-aléatoire
    (array['#FF5A5F','#3B82F6','#10B981','#F59E0B','#8B5CF6','#EC4899','#06B6D4'])
      [1 + (abs(hashtext(new.id::text)) % 7)]
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ══════════════════════════════════════════════════════════════════
-- ✅ Schéma initial créé.
-- Étape suivante : exécuter 0002_rls_policies.sql pour la sécurité.
-- ══════════════════════════════════════════════════════════════════
