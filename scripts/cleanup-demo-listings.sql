-- ════════════════════════════════════════════════════════════════════
-- Cleanup : retirer les annonces de seed DEMO (mig 0010)
-- ════════════════════════════════════════════════════════════════════
-- À exécuter UNE FOIS dans le Supabase SQL Editor quand tu veux nettoyer
-- les annonces de démo qui polluent les recherches publiques.
--
-- URL : https://supabase.com/dashboard/project/xwqnsovfakzraafiudek/sql/new
--
-- Ce script :
--   1. Compte les annonces DEMO (preview avant DELETE).
--   2. Supprime les listings dont le title commence par "DEMO ".
--   3. Cascade automatique sur listing_photos (ON DELETE CASCADE
--      défini en mig 0001).
--
-- Note : seul le seed mig 0010 utilise le préfixe "DEMO " dans le title,
-- donc ce filtre est sûr. Les vraies annonces utilisateur ne seront
-- jamais préfixées par "DEMO ".
--
-- Audit 2026-04-27 — Phase 3.F.
-- ════════════════════════════════════════════════════════════════════

-- Étape 1 — Preview (lance d'abord ce SELECT pour vérifier ce qui va sauter)
select id, type, subtype, title, city, owner_id
from public.listings
where title like 'DEMO %'
order by created_at;

-- ─────────────────────────────────────────────────────────────────────
-- Étape 2 — DELETE (exécute après avoir vérifié la liste ci-dessus)
-- Décommente la ligne suivante quand tu es prêt :
-- ─────────────────────────────────────────────────────────────────────

-- delete from public.listings where title like 'DEMO %';

-- Étape 3 — Vérifier qu'il ne reste plus rien
-- (devrait retourner 0 lignes après le DELETE)
-- select count(*) as remaining_demo from public.listings where title like 'DEMO %';
