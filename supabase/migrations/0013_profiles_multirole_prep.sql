-- ════════════════════════════════════════════════════════════════════
-- 0013 — Préparation multi-rôle utilisateur (V2 Concierges/Agents)
-- ════════════════════════════════════════════════════════════════════
-- Ajoute la colonne `roles text[]` sur profiles pour permettre, en V2,
-- qu'un même utilisateur cumule plusieurs rôles (locataire + bailleur +
-- agent immobilier + concierge + technicien + convoyeur).
--
-- Backward compat : la colonne `role text` existante reste en place et
-- continue d'être utilisée par le frontend v1 pour le toggle simple
-- locataire ↔ bailleur. La colonne `roles[]` est synchronisée via
-- trigger pour rester cohérente.
--
-- En V2 (mig 0014+) on basculera l'UI sur `roles[]` et on dépréciera
-- `role`. La transition se fera sans data loss.
--
-- Audit 2026-04-27 — préparation V2.
-- ════════════════════════════════════════════════════════════════════

-- 1. Ajout de la colonne roles[]
alter table public.profiles
  add column if not exists roles text[] not null default array['locataire']::text[];

-- 2. Backfill : tous les profils existants reçoivent un array d'1 élément
--    qui copie leur valeur `role` actuelle. Idempotent (skip si déjà fait).
update public.profiles
   set roles = array[role]
 where roles is null
    or array_length(roles, 1) is null
    or roles = array['locataire']::text[] and role != 'locataire';

-- 3. Contrainte : chaque rôle doit être dans la liste autorisée.
--    On supporte locataire / bailleur (déjà en place) + agent / concierge /
--    technicien / convoyeur (V2). 'admin' réservé aux comptes internes.
alter table public.profiles
  drop constraint if exists profiles_roles_valid;
alter table public.profiles
  add constraint profiles_roles_valid check (
    roles <@ array['locataire','bailleur','agent','concierge','technicien','convoyeur','admin']::text[]
    and array_length(roles, 1) >= 1
  );

-- 4. Trigger de cohérence : quand `role` change (toggle bailleur ↔ locataire
--    en v1), on met à jour `roles[]` automatiquement. L'inverse n'est PAS
--    fait (modifier `roles[]` ne touche pas `role`) — quand l'UI v2 utilisera
--    `roles[]` directement, on retirera ce trigger.
create or replace function public.sync_role_to_roles()
returns trigger language plpgsql as $$
begin
  if new.role is not null and new.role is distinct from old.role then
    -- Retire l'ancien role (locataire ou bailleur), ajoute le nouveau
    new.roles := array(
      select distinct unnest(array_append(
        array_remove(coalesce(new.roles, array[]::text[]), old.role),
        new.role
      ))
    );
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_sync_role on public.profiles;
create trigger profiles_sync_role
  before update of role on public.profiles
  for each row execute function public.sync_role_to_roles();

-- 5. REVOKE column-level UPDATE sur roles[] : la modification des rôles
--    multiples est réservée aux RPCs SECURITY DEFINER (à venir mig 0014
--    avec la fonction `add_role(p_role)`). Pour la v1, on continue de
--    laisser l'UI toucher `role` (sync vers roles via trigger).
revoke update (roles) on public.profiles from authenticated;

-- ════════════════════════════════════════════════════════════════════
-- FIN MIGRATION 0013
-- ════════════════════════════════════════════════════════════════════
-- Tests post-déploiement :
--
-- A. Vérif que la colonne existe et contient le rôle de chaque user :
--    select id, role, roles from public.profiles limit 5;
--
-- B. Vérif que le trigger sync_role_to_roles fonctionne :
--    -- En tant qu'un user, toggle son role :
--    update public.profiles set role = 'bailleur' where id = auth.uid();
--    -- roles[] doit maintenant contenir 'bailleur' (et plus 'locataire').
--    select role, roles from public.profiles where id = auth.uid();
--
-- C. Vérif REVOKE : toute tentative d'update direct doit échouer :
--    update public.profiles set roles = array['admin'] where id = auth.uid();
--    -- doit retourner: ERROR: permission denied for column roles
-- ════════════════════════════════════════════════════════════════════
