-- ════════════════════════════════════════════════════════════════════
-- 0017 — Admin read access on payouts (Phase 4 V1 final - admin web)
-- ════════════════════════════════════════════════════════════════════
-- Le dashboard admin web (admin.html → AdminApp → PayoutsAdminScreen)
-- a besoin de SELECT sur tous les payouts, pas seulement ceux du user
-- connecté. La policy `payouts_host_read` (mig 0015) ne permettait que
-- au host de voir SES propres payouts.
--
-- Cette migration ajoute :
--   1. Une fonction `public.is_byer_admin()` qui retourne TRUE si
--      l'email du caller est dans la whitelist des admins Byer.
--   2. Une policy `payouts_admin_read_all` qui autorise les admins à
--      SELECT toutes les rows.
--
-- Sécurité : la whitelist est en SQL (versionnée), pas dans une table
-- mutable. Pour ajouter un admin, il faut une nouvelle migration. Plus
-- robuste qu'un check côté frontend uniquement.
-- ════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────
-- 1. Fonction is_byer_admin() — whitelist en dur
-- ────────────────────────────────────────────────────────────────────
-- Utilisée par les policies RLS pour gating admin. Synchronisée avec
-- le frontend (ADMIN_EMAILS dans app.js) et l'Edge Function kyc-review.
-- Si tu ajoutes un admin, modifie ces 3 endroits ensemble.

create or replace function public.is_byer_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() ->> 'email') in (
      'pinolando120@gmail.com'
      -- Ajouter d'autres admins ici, séparés par des virgules
    ),
    false
  );
$$;

comment on function public.is_byer_admin() is
  'Retourne TRUE si l''email du caller (auth.jwt) est dans la whitelist Byer admin. Utilisé par les policies RLS sur payouts.';

revoke execute on function public.is_byer_admin() from public;
grant execute on function public.is_byer_admin() to authenticated;

-- ────────────────────────────────────────────────────────────────────
-- 2. Policy admin read sur payouts
-- ────────────────────────────────────────────────────────────────────
-- Autorise les admins à SELECT TOUTES les rows payouts (pas seulement
-- celles dont ils sont le host). Permission en lecture seule — INSERT
-- et UPDATE restent bloqués pour authenticated (cf. mig 0015).

drop policy if exists "payouts_admin_read_all" on public.payouts;
create policy "payouts_admin_read_all" on public.payouts
  for select
  using (public.is_byer_admin());

-- ────────────────────────────────────────────────────────────────────
-- 3. Bonus : policy admin read sur la vue stats
-- ────────────────────────────────────────────────────────────────────
-- La vue byer_payouts_stats hérite des permissions de payouts (sécurité
-- invoker côté Postgres pour les vues). Avec la policy ci-dessus, les
-- admins peuvent maintenant lire la vue. Pas besoin de permission
-- explicite côté view.

-- ────────────────────────────────────────────────────────────────────
-- 4. Test rapide après application
-- ────────────────────────────────────────────────────────────────────
-- En tant que pinolando120@gmail.com (admin) :
--   select public.is_byer_admin();        -- → true
--   select count(*) from public.payouts;  -- → tous les payouts visibles
--
-- En tant que user normal (non-admin) :
--   select public.is_byer_admin();        -- → false
--   select count(*) from public.payouts;  -- → seulement les SIENS

-- ════════════════════════════════════════════════════════════════════
-- FIN MIGRATION 0017
-- ════════════════════════════════════════════════════════════════════
