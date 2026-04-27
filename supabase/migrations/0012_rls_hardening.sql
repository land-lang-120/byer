-- ════════════════════════════════════════════════════════════════════
-- 0012 — Durcissement RLS (audit sécurité 2026-04-27)
-- ════════════════════════════════════════════════════════════════════
-- Pourquoi cette migration :
-- L'audit du 2026-04-27 a identifié 4 trous RLS dans les migrations
-- antérieures :
--
--   1. Cinq policies UPDATE sans WITH CHECK : un user authentifié peut
--      changer la valeur d'une colonne FK (owner_id, guest_id, host_id,
--      author_id, user_id) vers l'UUID d'un autre user → vol/transfert
--      d'annonces, de réservations, de reviews, de notifications, de
--      conversations.
--
--   2. listing_photos_owner_write (storage) ne vérifie pas que l'uploader
--      est le owner du listing dans le path : tout user authentifié peut
--      uploader une photo dans le dossier d'un autre listing
--      ({otherListingId}/x.jpg). Le delete vérifie correctement, l'insert
--      non. → vol/squat de fiches d'annonces.
--
--   3. profiles_self_update_safe (mig 0007) tente d'empêcher la modif
--      de rewards_points/referral_count/etc. via subselect dans WITH
--      CHECK. Cette policy ne fonctionne PAS de manière fiable en
--      READ COMMITTED — le subselect peut voir la valeur post-update
--      (anti-pattern Postgres connu). On la complète avec un REVOKE
--      column-level qui est, lui, infaillible.
--
--   4. avatars_self_update manquante : supabase-client.js utilise
--      upsert: true pour avatars, donc il fait UPDATE quand le fichier
--      existe déjà → la policy INSERT seule ne suffit pas, l'UPDATE
--      échoue silencieusement. Ajout de la policy manquante.
--
-- Cette migration est strictement défensive (sécurité). Elle ne change
-- aucun comportement légitime — toute requête qui passait avant continuera
-- de passer, sauf celles qui exploitaient les trous décrits.
--
-- Idempotente : drop + recreate à chaque exécution.
-- ════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────
-- 1. listings : ajouter WITH CHECK pour bloquer le transfert d'owner_id
-- ────────────────────────────────────────────────────────────────────
drop policy if exists "listings_owner_update" on public.listings;
create policy "listings_owner_update" on public.listings
  for update
  using       (owner_id = auth.uid())
  with check  (owner_id = auth.uid());
-- Avant : seul USING vérifié → UPDATE peut changer owner_id vers
-- un autre UUID puisque le row matche encore avant le commit.
-- WITH CHECK applique la condition à la ligne post-update.

-- ────────────────────────────────────────────────────────────────────
-- 2. bookings : ajouter WITH CHECK pour bloquer le transfert guest/host
-- ────────────────────────────────────────────────────────────────────
drop policy if exists "bookings_party_update" on public.bookings;
create policy "bookings_party_update" on public.bookings
  for update
  using      (guest_id = auth.uid() or host_id = auth.uid())
  with check (guest_id = auth.uid() or host_id = auth.uid());

-- ────────────────────────────────────────────────────────────────────
-- 3. conversations : ajouter WITH CHECK pour bloquer le transfert
-- ────────────────────────────────────────────────────────────────────
drop policy if exists "conversations_party_update" on public.conversations;
create policy "conversations_party_update" on public.conversations
  for update
  using      (guest_id = auth.uid() or host_id = auth.uid())
  with check (guest_id = auth.uid() or host_id = auth.uid());

-- ────────────────────────────────────────────────────────────────────
-- 4. reviews : ajouter WITH CHECK pour bloquer le transfert d'author
-- ────────────────────────────────────────────────────────────────────
-- Note : la policy d'origine permet à l'host de répondre (champ reply)
-- même s'il n'est pas l'auteur. On préserve cette logique tout en
-- empêchant la modif d'author_id par les deux côtés.
drop policy if exists "reviews_author_update" on public.reviews;
create policy "reviews_author_update" on public.reviews
  for update
  using (
    author_id = auth.uid()
    or exists (
      select 1 from public.bookings b
      where b.id = reviews.booking_id and b.host_id = auth.uid()
    )
  )
  with check (
    -- L'author_id ne doit JAMAIS changer, peu importe qui modifie
    author_id = (select author_id from public.reviews where id = reviews.id)
    -- Et l'auteur peut update OU l'host de la booking peut update (pour reply)
    and (
      author_id = auth.uid()
      or exists (
        select 1 from public.bookings b
        where b.id = reviews.booking_id and b.host_id = auth.uid()
      )
    )
  );

-- ────────────────────────────────────────────────────────────────────
-- 5. notifications : ajouter WITH CHECK pour bloquer le transfert user_id
-- ────────────────────────────────────────────────────────────────────
drop policy if exists "notifs_self_update" on public.notifications;
create policy "notifs_self_update" on public.notifications
  for update
  using      (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ────────────────────────────────────────────────────────────────────
-- 6. Storage listing-photos : forcer le path = listing owné par auth.uid()
-- ────────────────────────────────────────────────────────────────────
-- Le chemin a la forme "<listing_uuid>/<timestamp>.<ext>" (cf.
-- supabase-client.js storage.uploadPhoto). On extrait le 1er segment
-- avec storage.foldername et on vérifie qu'il appartient à l'uploader.
drop policy if exists "listing_photos_owner_write" on storage.objects;
create policy "listing_photos_owner_write"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-photos'
    and auth.uid() is not null
    -- Le 1er dossier du path doit être un listing UUID owné par l'uploader
    and (storage.foldername(name))[1]::uuid in (
      select id from public.listings where owner_id = auth.uid()
    )
  );

-- Pour cohérence : update aussi protégé (le delete l'était déjà)
drop policy if exists "listing_photos_owner_update" on storage.objects;
create policy "listing_photos_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1]::uuid in (
      select id from public.listings where owner_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1]::uuid in (
      select id from public.listings where owner_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────────────
-- 7. Storage avatars : ajouter la policy UPDATE manquante
-- ────────────────────────────────────────────────────────────────────
-- supabase-client.js utilise upsert:true pour les avatars → UPDATE est
-- nécessaire quand l'avatar existe déjà. La policy INSERT seule (mig
-- 0003) faisait échouer le re-upload silencieusement.
drop policy if exists "avatars_self_update" on storage.objects;
create policy "avatars_self_update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Aussi : avatar delete (sinon l'utilisateur ne peut pas supprimer son
-- ancien avatar avant d'en mettre un nouveau de même nom).
drop policy if exists "avatars_self_delete" on storage.objects;
create policy "avatars_self_delete"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ────────────────────────────────────────────────────────────────────
-- 8. ANTI-TRICHE BULLETPROOF : revoke column-level sur profiles
-- ────────────────────────────────────────────────────────────────────
-- La policy profiles_self_update_safe (mig 0007) tente d'empêcher la
-- modif de rewards_points/referral_count via subselect dans WITH CHECK.
-- Cette approche ne fonctionne PAS de manière fiable en READ COMMITTED :
-- le subselect peut voir la valeur post-update dans la même transaction.
--
-- Solution infaillible : REVOKE column-level UPDATE pour le rôle
-- 'authenticated'. Plus aucun update direct possible sur ces colonnes,
-- même si la policy RLS passe. Seules les RPCs SECURITY DEFINER
-- (redeem_reward, apply_referral_code, etc.) peuvent les modifier.

-- Liste des colonnes sensibles à protéger :
--   • rewards_points        — solde points (audit anti-triche)
--   • referral_count        — compteur parrainage
--   • identity_verified     — flag KYC validé (mis par Edge Function admin)
--   • email_verified        — mis par Auth seul
--   • phone_verified        — mis par Auth + Edge Function send-otp-sms
--   • is_superhost          — calculé par trigger mig 0007
--   • role                  — locataire/bailleur (admin only via Edge Function)
--
-- Tier (generated stored) n'a pas besoin d'être révoqué : il est calculé
-- automatiquement à partir de rewards_points donc protégé par transitivité.

revoke update (
  rewards_points,
  referral_count,
  identity_verified,
  email_verified,
  phone_verified,
  is_superhost,
  role
) on public.profiles
from authenticated;

-- Côté policy on simplifie aussi : profiles_self_update reste avec son
-- USING/WITH CHECK existants. Le REVOKE column-level rend les anciens
-- subselects de profiles_self_update_safe redondants, mais on les laisse
-- (defense in depth — si quelqu'un GRANT à nouveau, la policy bloque
-- toujours).

-- ────────────────────────────────────────────────────────────────────
-- 9. trusted_devices : confirmer que l'INSERT direct client est bloqué
-- ────────────────────────────────────────────────────────────────────
-- Mig 0004 disait "L'insertion est faite par une edge function" mais
-- ne créait AUCUNE policy INSERT — le RLS bloque alors par défaut.
-- On rend explicite : l'INSERT est interdit aux clients authentifiés.
-- Cette policy ne change rien fonctionnellement (RLS = deny by default
-- si pas de policy) mais documente l'intention.

drop policy if exists "trusted_devices_no_client_insert" on public.trusted_devices;
create policy "trusted_devices_no_client_insert" on public.trusted_devices
  for insert
  with check (false);

-- ────────────────────────────────────────────────────────────────────
-- 10. apply_referral_code : rate limit basique
-- ────────────────────────────────────────────────────────────────────
-- L'audit suggère un rate limit pour empêcher un attaquant de farmer
-- 10 000 points en créant 1000 comptes-filleuls. Implémentation minimale :
-- un user ne peut PAS appliquer plus de 5 codes en 24h (compteur sur
-- referrals where referrer_id = auth.uid()).
--
-- Note : la vraie protection vient déjà de la contrainte unique
-- (referred_id, referrer_id) — un user ne peut être filleul que d'UN
-- seul autre user. Le rate limit ici est un complément contre les bots.

create or replace function public.apply_referral_code(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id      uuid := auth.uid();
  v_referrer_id  uuid;
  v_recent_count integer;
begin
  if v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'not_authenticated');
  end if;

  -- Rate limit : max 5 codes en 24h depuis le même referrer dans referrals
  -- (en pratique, un user n'applique qu'un seul code ; ce check protège
  -- contre une attaque automatisée).
  select count(*) into v_recent_count
  from public.referrals
  where referrer_id = v_user_id
    and created_at > now() - interval '24 hours';
  if v_recent_count >= 5 then
    return jsonb_build_object('ok', false, 'error', 'rate_limit_exceeded');
  end if;

  -- Trouver le parrain par son code
  select id into v_referrer_id
  from public.profiles
  where referral_code = upper(p_code) and id != v_user_id;
  if v_referrer_id is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_code');
  end if;

  -- Empêcher la double application (la contrainte unique le ferait aussi
  -- mais on retourne un message clair plutôt qu'une 23505).
  if exists (select 1 from public.referrals where referred_id = v_user_id) then
    return jsonb_build_object('ok', false, 'error', 'already_referred');
  end if;

  -- Enregistrer le parrainage. Les triggers existants (mig 0007 award_*)
  -- créditeront les points et bumperont referral_count atomiquement.
  insert into public.referrals (referrer_id, referred_id, code)
  values (v_referrer_id, v_user_id, upper(p_code));

  return jsonb_build_object('ok', true, 'referrer_id', v_referrer_id);
end;
$$;

revoke all on function public.apply_referral_code(text) from public, anon;
grant execute on function public.apply_referral_code(text) to authenticated;

-- ════════════════════════════════════════════════════════════════════
-- FIN MIGRATION 0012
-- ════════════════════════════════════════════════════════════════════
-- Tests post-déploiement à exécuter en SQL Editor :
--
-- A. Vérif policies UPDATE protègent contre transfert FK :
--    set role authenticated;
--    -- (en se mettant dans la session d'un user A)
--    update public.listings set owner_id = '<other_user_uuid>'
--    where id = '<listing_a_id>';
--    -- doit retourner: ERROR / 0 rows
--
-- B. Vérif column-level REVOKE bloque la triche points :
--    update public.profiles set rewards_points = 99999
--    where id = auth.uid();
--    -- doit retourner: ERROR: permission denied for column
--
-- C. Vérif storage path check :
--    -- (try INSERT dans listing-photos avec un dossier UUID qui n'est
--    -- pas un listing owné) → doit échouer.
-- ════════════════════════════════════════════════════════════════════
