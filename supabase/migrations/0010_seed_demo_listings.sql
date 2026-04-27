-- ════════════════════════════════════════════════════════════════════
-- Byer — Seed démo : 5 annonces (3 logements + 2 véhicules) + photos
-- À exécuter APRÈS 0009_hotfix_validate_arrival.sql
-- ════════════════════════════════════════════════════════════════════
-- Cette migration peuple la base avec des annonces de démo pour tester
-- le flow complet (recherche, booking, chat, reviews) sans devoir
-- chaque fois publier manuellement.
--
-- Owner = pinolando120@gmail.com (compte propriétaire de l'app).
-- Si tu veux re-seeder, supprime d'abord les listings :
--   delete from public.listings where title like 'DEMO %';
-- ════════════════════════════════════════════════════════════════════

do $$
declare
  v_owner uuid;
  v_villa     uuid;
  v_studio    uuid;
  v_motel     uuid;
  v_suv       uuid;
  v_sedan     uuid;
begin
  -- Récupère l'id du compte Pino dans auth.users
  select id into v_owner
    from auth.users
   where email = 'pinolando120@gmail.com'
   limit 1;

  if v_owner is null then
    raise exception 'Compte pinolando120@gmail.com introuvable. Connecte-toi d''abord à Byer pour créer le profile.';
  end if;

  -- S'assure que le profile existe (au cas où le trigger aurait raté)
  -- L'enum role accepte 'locataire' ou 'bailleur' (cf. 0001_initial_schema.sql).
  insert into public.profiles (id, name, role)
  values (v_owner, 'Pino Lando', 'bailleur')
  on conflict (id) do update
     set role = 'bailleur';

  -- ───────────── LOGEMENT 1 — Villa Balnéaire Kribi ─────────────
  insert into public.listings (
    owner_id, type, subtype, title, description,
    city, zone, address, lat, lng,
    price_night, price_month,
    bedrooms, bathrooms, max_guests,
    amenities, general_amenities, house_rules,
    rating_avg, review_count, is_superhost, is_active
  ) values (
    v_owner, 'property', 'maison',
    'DEMO Villa Balnéaire Kribi',
    'Villa de luxe avec vue océan, piscine privée, et accès direct à la plage. Idéale pour un séjour familial ou entre amis. Personnel de ménage inclus.',
    'Kribi', 'Bord de mer', 'Plage Tara, Kribi',
    2.9433, 9.9097,
    85000, 1800000,
    4, 3, 8,
    '{Piscine,Wifi,Climatisation,Parking,Vue mer,Cuisine équipée,Barbecue,Sécurité 24/7}',
    '{Eau chaude,Générateur électrique,Linge fourni}',
    '{Pas de fête bruyante après 22h,Animaux autorisés sur demande,Pas de fumeur à l''intérieur}',
    4.96, 24, true, true
  ) returning id into v_villa;

  -- ───────────── LOGEMENT 2 — Studio Akwa Douala ─────────────
  insert into public.listings (
    owner_id, type, subtype, title, description,
    city, zone, address, lat, lng,
    price_night, price_month,
    bedrooms, bathrooms, max_guests,
    amenities, general_amenities, house_rules,
    rating_avg, review_count, is_active
  ) values (
    v_owner, 'property', 'studio',
    'DEMO Studio Moderne Akwa',
    'Studio cosy en plein cœur d''Akwa, parfait pour un séjour business ou court terme. Wifi fibre, climatisation, ménage hebdomadaire inclus.',
    'Douala', 'Akwa', 'Rue Joffre, Akwa',
    4.0509, 9.7679,
    25000, 450000,
    1, 1, 2,
    '{Wifi,Climatisation,TV,Ménage hebdomadaire}',
    '{Eau chaude,Sécurité 24/7,Ascenseur}',
    '{Pas de fête,Pas de fumeur,Calme exigé après 22h}',
    4.72, 12, true
  ) returning id into v_studio;

  -- ───────────── LOGEMENT 3 — Motel Bonanjo ─────────────
  insert into public.listings (
    owner_id, type, subtype, title, description,
    city, zone, address, lat, lng,
    price_night,
    bedrooms, bathrooms, max_guests,
    amenities, general_amenities,
    rating_avg, review_count, is_active
  ) values (
    v_owner, 'property', 'motel',
    'DEMO Motel Confort Bonanjo',
    'Chambres simples et propres, à proximité du quartier d''affaires. Petit-déjeuner inclus. Idéal pour voyageurs solo ou couples.',
    'Douala', 'Bonanjo', 'Boulevard de la Liberté',
    4.0440, 9.6907,
    18000,
    1, 1, 2,
    '{Wifi,Climatisation,Petit-déjeuner inclus,TV}',
    '{Parking,Sécurité 24/7}',
    4.45, 8, true
  );

  -- ───────────── VÉHICULE 1 — SUV Toyota ─────────────
  insert into public.listings (
    owner_id, type, subtype, title, description,
    city, address, lat, lng,
    price_night,
    brand, model, year, fuel, transmission,
    amenities,
    rating_avg, review_count, is_active
  ) values (
    v_owner, 'vehicle', 'suv',
    'DEMO SUV Toyota RAV4 2022',
    'SUV récent en parfait état, climatisé, GPS intégré, idéal pour familles ou voyages longue distance. Livraison possible.',
    'Douala', 'Akwa, Douala',
    4.0509, 9.7679,
    35000,
    'Toyota', 'RAV4', 2022, 'Essence', 'Automatique',
    '{Climatisation,GPS,Bluetooth,Caméra recul,Sièges cuir}',
    4.83, 15, true
  ) returning id into v_suv;

  -- ───────────── VÉHICULE 2 — Berline Hyundai ─────────────
  insert into public.listings (
    owner_id, type, subtype, title, description,
    city, address, lat, lng,
    price_night,
    brand, model, year, fuel, transmission,
    amenities,
    rating_avg, review_count, is_active
  ) values (
    v_owner, 'vehicle', 'sedan',
    'DEMO Berline Hyundai Elantra 2020',
    'Berline élégante, économique, parfaite pour les déplacements urbains et professionnels. Tarif compétitif.',
    'Douala', 'Bonanjo, Douala',
    4.0440, 9.6907,
    20000,
    'Hyundai', 'Elantra', 2020, 'Essence', 'Manuelle',
    '{Climatisation,Bluetooth,Direction assistée,USB}',
    4.51, 6, true
  ) returning id into v_sedan;

  -- ───────────── PHOTOS (Unsplash, libre de droit) ─────────────
  insert into public.listing_photos (listing_id, url, position) values
    -- Villa Kribi (5 photos)
    (v_villa,  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200', 0),
    (v_villa,  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200', 1),
    (v_villa,  'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=1200', 2),
    (v_villa,  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200', 3),
    (v_villa,  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200', 4),
    -- Studio Akwa (3 photos)
    (v_studio, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 0),
    (v_studio, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200', 1),
    (v_studio, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200', 2),
    -- SUV (2 photos)
    (v_suv,    'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1200', 0),
    (v_suv,    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', 1),
    -- Sedan (2 photos)
    (v_sedan,  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', 0),
    (v_sedan,  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', 1);

  raise notice '✅ Seed terminé. 5 annonces créées pour pinolando120@gmail.com.';
end $$;
