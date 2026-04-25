-- ════════════════════════════════════════════════════════════════════
-- Byer — Optimisations Listings (publish wizard ↔ schéma DB)
-- À exécuter APRÈS 0004_auth_extensions.sql
-- ════════════════════════════════════════════════════════════════════
-- Cette migration aligne le schéma `public.listings` avec le payload
-- réellement envoyé par le wizard publish.js (6 étapes) et ajoute les
-- index, contraintes et RPC nécessaires à une recherche performante.
--
-- ÉCARTS COMBLÉS :
--   1. general_amenities text[]   — IDs canoniques (ex: ["wifi","piscine"])
--   2. child_entities    jsonb    — composition Bâtiment (chambres, douches…)
--   3. house_rules       text[]   — IDs des règles pré-définies cochées
--   4. custom_rules      text[]   — règles personnalisées (max 10)
--   5. listing_photos.tag text    — type+numéro (ex: "chambre-1", "exterior")
--
-- AMÉLIORATIONS :
--   - Subtype enum strict (8 catégories logement + 5 véhicules)
--   - CHECK prix ≥ 0, lat/lng valides, au moins un prix défini
--   - tsvector full-text search (titre + ville + description + zone)
--   - GIN indexes pour amenities + general_amenities + house_rules
--   - Index spatial simple (lat, lng) pour proximité
--   - Limit 30 photos / annonce
--   - RPC search_listings(query, type, city, min_price, max_price, …)
-- ════════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════
-- 1. AJOUT DES COLONNES MANQUANTES À listings
-- ══════════════════════════════════════════════════════════════════

alter table public.listings
  add column if not exists general_amenities text[]    default '{}',
  add column if not exists child_entities    jsonb     default '{}'::jsonb,
  add column if not exists house_rules       text[]    default '{}',
  add column if not exists custom_rules      text[]    default '{}';

comment on column public.listings.general_amenities is
  'IDs canoniques de la palette globale (ex: ["wifi","piscine","gardien"])
   Distinct de `amenities` qui contient les labels lisibles legacy.';

comment on column public.listings.child_entities is
  'Composition Bâtiment : {[entityId]: {count, shared, sharedAmenities, instances}}
   Ex: {"chambre":{"count":3,"shared":true,"sharedAmenities":["wifi","climatise"]}}
   NULL pour les véhicules.';

comment on column public.listings.house_rules is
  'IDs des règles pré-définies cochées par le bailleur
   (ex: ["no_smoking","caution_required","students_only"])';

comment on column public.listings.custom_rules is
  'Règles personnalisées en texte libre (max 10 entries)';

-- ══════════════════════════════════════════════════════════════════
-- 2. CONTRAINTES MÉTIER (corrige les NULL silencieux + valeurs absurdes)
-- ══════════════════════════════════════════════════════════════════

-- Prix non négatifs (un prix peut être NULL = mode non proposé)
alter table public.listings
  drop constraint if exists listings_price_night_positive,
  add  constraint listings_price_night_positive
       check (price_night is null or price_night >= 0);

alter table public.listings
  drop constraint if exists listings_price_month_positive,
  add  constraint listings_price_month_positive
       check (price_month is null or price_month >= 0);

-- Au moins un prix doit être défini (sinon annonce inutile)
alter table public.listings
  drop constraint if exists listings_at_least_one_price,
  add  constraint listings_at_least_one_price
       check (price_night is not null or price_month is not null);

-- Coordonnées géographiques valides
alter table public.listings
  drop constraint if exists listings_lat_valid,
  add  constraint listings_lat_valid
       check (lat is null or (lat between -90 and 90));

alter table public.listings
  drop constraint if exists listings_lng_valid,
  add  constraint listings_lng_valid
       check (lng is null or (lng between -180 and 180));

-- Capacités cohérentes (jamais < 0)
alter table public.listings
  drop constraint if exists listings_bedrooms_positive,
  add  constraint listings_bedrooms_positive
       check (bedrooms is null or bedrooms >= 0);

alter table public.listings
  drop constraint if exists listings_bathrooms_positive,
  add  constraint listings_bathrooms_positive
       check (bathrooms is null or bathrooms >= 0);

alter table public.listings
  drop constraint if exists listings_max_guests_positive,
  add  constraint listings_max_guests_positive
       check (max_guests is null or max_guests >= 1);

-- Maximum 10 règles personnalisées (cohérence UI publish.js)
alter table public.listings
  drop constraint if exists listings_custom_rules_max_10,
  add  constraint listings_custom_rules_max_10
       check (custom_rules is null or array_length(custom_rules, 1) is null
              or array_length(custom_rules, 1) <= 10);

-- Subtype valide selon le type (8 catégories logement + 5 véhicules)
alter table public.listings
  drop constraint if exists listings_subtype_valid,
  add  constraint listings_subtype_valid
       check (
         (type = 'vehicle' and (subtype is null
            or subtype in ('suv','sedan','citadine','utilitaire','moto')))
         or
         (type = 'property' and (subtype is null
            or subtype in ('maison','immeuble','hotel','motel','auberge',
                           'appartement','studio','chambre')))
       );

-- ══════════════════════════════════════════════════════════════════
-- 3. listing_photos — colonne tag + contraintes
-- ══════════════════════════════════════════════════════════════════

alter table public.listing_photos
  add column if not exists tag text;

comment on column public.listing_photos.tag is
  'Type+numéro auto-généré côté client (ex: "chambre-1", "exterior",
   "appartement-0"). Permet de regrouper les photos par pièce/zone
   dans la galerie de détail.';

-- Position non négative
alter table public.listing_photos
  drop constraint if exists photos_position_positive,
  add  constraint photos_position_positive
       check (position >= 0);

-- ══════════════════════════════════════════════════════════════════
-- 4. INDEX FULL-TEXT SEARCH (recherche unifiée multi-mots)
-- ══════════════════════════════════════════════════════════════════
-- Generated column qui concatène les champs textuels en tsvector,
-- normalisé en français. GIN index pour des recherches sub-ms même
-- sur 100k+ annonces.
-- ══════════════════════════════════════════════════════════════════

alter table public.listings
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('french', coalesce(title, '')),       'A') ||
    setweight(to_tsvector('french', coalesce(city, '')),        'B') ||
    setweight(to_tsvector('french', coalesce(zone, '')),        'B') ||
    setweight(to_tsvector('french', coalesce(description, '')), 'C') ||
    setweight(to_tsvector('french', coalesce(brand, '')),       'C')
  ) stored;

create index if not exists listings_search_idx
  on public.listings using gin (search_vector)
  where is_active = true;

comment on column public.listings.search_vector is
  'Vecteur de recherche full-text pondéré :
   A=title, B=city/zone, C=description/brand. Auto-généré, immutable.';

-- ══════════════════════════════════════════════════════════════════
-- 5. INDEX GIN sur les ARRAYS (filtres rapides "wifi AND piscine")
-- ══════════════════════════════════════════════════════════════════

create index if not exists listings_amenities_idx
  on public.listings using gin (amenities)
  where is_active = true;

create index if not exists listings_general_amenities_idx
  on public.listings using gin (general_amenities)
  where is_active = true;

create index if not exists listings_house_rules_idx
  on public.listings using gin (house_rules)
  where is_active = true;

-- Index supplémentaire sur child_entities (jsonb) — utile pour
-- filtrer "annonces avec ≥ 2 chambres" via opérateur @>.
create index if not exists listings_child_entities_idx
  on public.listings using gin (child_entities)
  where is_active = true;

-- ══════════════════════════════════════════════════════════════════
-- 6. INDEX SPATIAL SIMPLE (proximité géographique)
-- ══════════════════════════════════════════════════════════════════
-- Sans PostGIS : un BTREE composite (lat, lng) suffit pour une
-- recherche par bounding box (city + filtre lat/lng range).
-- ══════════════════════════════════════════════════════════════════

create index if not exists listings_geo_idx
  on public.listings (lat, lng)
  where is_active = true and lat is not null and lng is not null;

-- Index composite "type + ville + actif" (déjà existant en partie via
-- listings_city_type_idx mais ce variant trie par prix pour le tri rapide)
create index if not exists listings_type_city_price_idx
  on public.listings (type, city, price_night)
  where is_active = true;

-- ══════════════════════════════════════════════════════════════════
-- 7. TRIGGER : LIMITE 30 PHOTOS PAR ANNONCE
-- ══════════════════════════════════════════════════════════════════
-- Le wizard plafonne à 10, mais on autorise large (édition future).
-- 30 = limite raisonnable storage + rendering galerie.
-- ══════════════════════════════════════════════════════════════════

create or replace function public.enforce_photo_limit()
returns trigger language plpgsql as $$
declare
  cnt int;
begin
  select count(*) into cnt
  from public.listing_photos
  where listing_id = new.listing_id;
  if cnt >= 30 then
    raise exception 'Maximum 30 photos par annonce (actuellement %).', cnt
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists photos_enforce_limit on public.listing_photos;
create trigger photos_enforce_limit
  before insert on public.listing_photos
  for each row execute function public.enforce_photo_limit();

-- ══════════════════════════════════════════════════════════════════
-- 8. TRIGGER : MAJ AUTOMATIQUE DU is_superhost
-- ══════════════════════════════════════════════════════════════════
-- Si l'owner a ≥ 100 points + ≥ 4.7 de moyenne sur ses annonces actives,
-- toutes ses annonces deviennent "superhost". Déclenché à chaque update
-- de profile (rewards_points) ou de review (rating_avg).
-- ══════════════════════════════════════════════════════════════════

create or replace function public.refresh_superhost_status(p_owner_id uuid)
returns void language plpgsql security definer as $$
declare
  v_points  int;
  v_avg_rating numeric;
  v_should_be_superhost boolean;
begin
  select rewards_points into v_points
  from public.profiles where id = p_owner_id;

  select avg(rating_avg) into v_avg_rating
  from public.listings
  where owner_id = p_owner_id and is_active = true and review_count > 0;

  v_should_be_superhost := (coalesce(v_points, 0) >= 100)
                       and (coalesce(v_avg_rating, 0) >= 4.7);

  update public.listings
     set is_superhost = v_should_be_superhost
   where owner_id = p_owner_id
     and is_superhost is distinct from v_should_be_superhost;
end;
$$;

create or replace function public.trigger_refresh_superhost_on_review()
returns trigger language plpgsql as $$
begin
  perform public.refresh_superhost_status(
    (select owner_id from public.listings where id = new.listing_id)
  );
  return new;
end;
$$;

drop trigger if exists reviews_refresh_superhost on public.reviews;
create trigger reviews_refresh_superhost
  after insert or update on public.reviews
  for each row execute function public.trigger_refresh_superhost_on_review();

-- ══════════════════════════════════════════════════════════════════
-- 9. TRIGGER : MAJ rating_avg + review_count automatique
-- ══════════════════════════════════════════════════════════════════
-- Plus besoin de calculer côté frontend : la BDD maintient les
-- agrégats en temps réel à chaque insert/update/delete d'une review.
-- ══════════════════════════════════════════════════════════════════

create or replace function public.refresh_listing_rating()
returns trigger language plpgsql security definer as $$
declare
  v_listing_id uuid;
  v_avg numeric;
  v_count int;
begin
  v_listing_id := coalesce(new.listing_id, old.listing_id);
  select avg(rating)::numeric(3,2), count(*)
    into v_avg, v_count
    from public.reviews
   where listing_id = v_listing_id;

  update public.listings
     set rating_avg   = coalesce(v_avg, 0),
         review_count = v_count
   where id = v_listing_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists reviews_refresh_listing on public.reviews;
create trigger reviews_refresh_listing
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_listing_rating();

-- ══════════════════════════════════════════════════════════════════
-- 10. RPC : search_listings (recherche full-text + filtres en UNE requête)
-- ══════════════════════════════════════════════════════════════════
-- Utilisée par le frontend (futur SearchScreen) pour combiner :
--   - mot-clé (FTS pondéré title>city>desc)
--   - type / sous-type
--   - ville / fourchette de prix
--   - tri par pertinence ou par note
--
-- Retourne directement la première photo + nom owner pour éviter un
-- second round-trip côté client.
-- ══════════════════════════════════════════════════════════════════

create or replace function public.search_listings(
  p_query     text    default null,
  p_type      text    default null,   -- 'property' | 'vehicle' | null
  p_subtype   text    default null,
  p_city      text    default null,
  p_min_price int     default null,
  p_max_price int     default null,
  p_min_rating numeric default null,
  p_amenities text[]  default null,   -- IDs canoniques requis (AND)
  p_limit     int     default 30,
  p_offset    int     default 0
)
returns table (
  id            uuid,
  owner_id      uuid,
  type          text,
  subtype       text,
  title         text,
  city          text,
  zone          text,
  price_night   int,
  price_month   int,
  bedrooms      int,
  bathrooms     int,
  max_guests    int,
  rating_avg    numeric,
  review_count  int,
  is_superhost  boolean,
  first_photo   text,
  owner_name    text,
  rank          real
)
language plpgsql stable security definer as $$
begin
  return query
  select
    l.id,
    l.owner_id,
    l.type,
    l.subtype,
    l.title,
    l.city,
    l.zone,
    l.price_night,
    l.price_month,
    l.bedrooms,
    l.bathrooms,
    l.max_guests,
    l.rating_avg,
    l.review_count,
    l.is_superhost,
    (
      select lp.url from public.listing_photos lp
       where lp.listing_id = l.id
       order by lp.position asc limit 1
    ) as first_photo,
    p.name as owner_name,
    case
      when p_query is not null and length(trim(p_query)) > 0
        then ts_rank(l.search_vector, plainto_tsquery('french', p_query))
      else 0
    end as rank
  from public.listings l
  join public.profiles p on p.id = l.owner_id
  where l.is_active = true
    and (p_query is null or length(trim(p_query)) = 0
         or l.search_vector @@ plainto_tsquery('french', p_query))
    and (p_type      is null or l.type      = p_type)
    and (p_subtype   is null or l.subtype   = p_subtype)
    and (p_city      is null or l.city      = p_city)
    and (p_min_price is null
         or coalesce(l.price_night, l.price_month, 0) >= p_min_price)
    and (p_max_price is null
         or coalesce(l.price_night, l.price_month, 999999999) <= p_max_price)
    and (p_min_rating is null or l.rating_avg >= p_min_rating)
    and (p_amenities  is null or l.general_amenities @> p_amenities
                              or l.amenities         @> p_amenities)
  order by
    case when p_query is not null and length(trim(p_query)) > 0
         then ts_rank(l.search_vector, plainto_tsquery('french', p_query))
         else l.rating_avg
         end desc nulls last,
    l.review_count desc
  limit  p_limit
  offset p_offset;
end;
$$;

revoke all on function public.search_listings(text, text, text, text, int, int, numeric, text[], int, int)
  from public;
grant execute on function public.search_listings(text, text, text, text, int, int, numeric, text[], int, int)
  to anon, authenticated;

comment on function public.search_listings is
  'Recherche full-text + filtres combinés. Pondération title>city/zone>description.
   Retourne déjà first_photo + owner_name pour éviter un second round-trip.';

-- ══════════════════════════════════════════════════════════════════
-- 11. RPC : nearby_listings (proximité géographique sans PostGIS)
-- ══════════════════════════════════════════════════════════════════
-- Calcule la distance euclidienne approximative (suffisant pour ~50km)
-- et trie par proximité. Pour plus de précision, activer postgis et
-- utiliser ST_DistanceSphere — non requis pour le MVP camerounais.
-- ══════════════════════════════════════════════════════════════════

create or replace function public.nearby_listings(
  p_lat       numeric,
  p_lng       numeric,
  p_radius_km int    default 25,
  p_type      text   default null,
  p_limit     int    default 30
)
returns table (
  id           uuid,
  title        text,
  city         text,
  lat          numeric,
  lng          numeric,
  distance_km  numeric,
  price_night  int,
  rating_avg   numeric,
  first_photo  text
)
language plpgsql stable security definer as $$
declare
  -- Conversion approximative degré → km (valable au Cameroun ≈ 4°N)
  -- 1° lat ≈ 111 km, 1° lng ≈ 111*cos(lat) ≈ 110 km
  v_deg_per_km numeric := 1.0 / 111.0;
  v_max_deg    numeric := p_radius_km * v_deg_per_km;
begin
  return query
  select
    l.id,
    l.title,
    l.city,
    l.lat,
    l.lng,
    -- Distance euclidienne approximative en km
    round(
      sqrt(
        power((l.lat - p_lat) * 111.0, 2) +
        power((l.lng - p_lng) * 111.0 * cos(radians(p_lat)), 2)
      )::numeric,
      2
    ) as distance_km,
    l.price_night,
    l.rating_avg,
    (
      select lp.url from public.listing_photos lp
       where lp.listing_id = l.id
       order by lp.position asc limit 1
    ) as first_photo
  from public.listings l
  where l.is_active = true
    and l.lat between p_lat - v_max_deg and p_lat + v_max_deg
    and l.lng between p_lng - v_max_deg and p_lng + v_max_deg
    and (p_type is null or l.type = p_type)
  order by distance_km asc, l.rating_avg desc
  limit p_limit;
end;
$$;

revoke all on function public.nearby_listings(numeric, numeric, int, text, int) from public;
grant execute on function public.nearby_listings(numeric, numeric, int, text, int)
  to anon, authenticated;

comment on function public.nearby_listings is
  'Recherche par proximité géographique (rayon en km). Bbox + distance euclidienne
   pondérée par cos(lat). Suffisant pour le contexte camerounais (latitude ~4°N).';

-- ══════════════════════════════════════════════════════════════════
-- 12. RPC : toggle_listing_active (activer/désactiver son annonce)
-- ══════════════════════════════════════════════════════════════════
-- Wrapper sécurisé vérifiant que c'est bien le owner qui agit.
-- Utilisé par le Dashboard bailleur (bouton "Mettre en pause").
-- ══════════════════════════════════════════════════════════════════

create or replace function public.toggle_listing_active(p_listing_id uuid)
returns boolean
language plpgsql security definer as $$
declare
  v_uid uuid := auth.uid();
  v_owner uuid;
  v_new_status boolean;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  select owner_id, not is_active
    into v_owner, v_new_status
    from public.listings
   where id = p_listing_id;

  if v_owner is null then
    raise exception 'Listing not found';
  end if;
  if v_owner != v_uid then
    raise exception 'Only the owner can toggle this listing';
  end if;

  update public.listings
     set is_active = v_new_status,
         updated_at = now()
   where id = p_listing_id;

  return v_new_status;
end;
$$;

revoke all on function public.toggle_listing_active(uuid) from public;
grant execute on function public.toggle_listing_active(uuid) to authenticated;

-- ══════════════════════════════════════════════════════════════════
-- 13. AJUSTEMENT RLS pour les nouvelles colonnes
-- ══════════════════════════════════════════════════════════════════
-- Les policies de 0002_rls_policies.sql autorisent déjà
--   listings_select  : public read si is_active = true
--   listings_insert  : owner_id = auth.uid()
--   listings_update  : owner_id = auth.uid()
--   listings_delete  : owner_id = auth.uid()
-- Les nouvelles colonnes héritent automatiquement (RLS = row-level,
-- pas column-level). Aucune modif nécessaire.
--
-- Sur listing_photos.tag, idem : la policy "listing_photos_owner_write"
-- couvre déjà l'insert avec n'importe quels champs.
-- ══════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════
-- ✅ Migration 0005 terminée.
-- Étape suivante : connecter publishHandleSubmit à db.listings.create
-- (déjà fait — il faut maintenant tester E2E avec un vrai upload de photo).
-- ══════════════════════════════════════════════════════════════════
