-- ════════════════════════════════════════════════════════════════════
-- 0018 — Scale du cron payouts (Option B : toutes les 4h, 500 par run)
-- À exécuter APRÈS 0016_payouts_cron.sql
-- ════════════════════════════════════════════════════════════════════
-- Le cron initial (mig 0016) était :
--   schedule '0 2 * * *' (1× / jour à 02:00 UTC)
--   limit   100 payouts par run
--   → ~100 payouts/jour traités → ~3000 réservations/mois supportées
--
-- À mesure que Byer monte en charge (objectif 20K+ réservations/mois),
-- on bascule sur :
--   schedule '0 */4 * * *' (toutes les 4h : 02:00, 06:00, 10:00, 14:00, 18:00, 22:00 UTC)
--   limit   500 payouts par run
--   → ~3000 payouts/jour traités → ~30K réservations/mois supportées
--
-- Sécurité : si un jour Notch Pay rate-limite notre compte (ex: > X
-- transfers/min), pg_net retourne une erreur sur les requêtes en
-- excès. La row payout reste 'pending' (le mark 'processing' n'a lieu
-- que SI l'invocation Edge Function réussit). Le run suivant les reprendra.
--
-- Si on devait monter au-delà (>100K réservations/mois), il faudra
-- soit augmenter le limit, soit raccourcir l'intervalle, soit migrer
-- vers une vraie queue (Redis, Cloudflare Queues, AWS SQS). Pas urgent.
-- ════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────
-- 1. Unschedule l'ancien job quotidien
-- ────────────────────────────────────────────────────────────────────
do $$
begin
  perform cron.unschedule('byer_payouts_daily')
  where exists (select 1 from cron.job where jobname = 'byer_payouts_daily');
end $$;

-- ────────────────────────────────────────────────────────────────────
-- 2. Schedule le nouveau job 4h
-- ────────────────────────────────────────────────────────────────────
-- Pattern '0 */4 * * *' = à 00 minutes, toutes les 4h (heure UTC)
-- Soit : 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC chaque jour
-- (= 6 runs par jour × 500 payouts = 3000/jour théoriques)

do $$
begin
  -- Idempotent : si déjà créé (re-run de mig), on supprime d'abord
  perform cron.unschedule('byer_payouts_4h')
  where exists (select 1 from cron.job where jobname = 'byer_payouts_4h');

  perform cron.schedule(
    'byer_payouts_4h',
    '0 */4 * * *',
    $cron$ select public.dispatch_eligible_payouts(500); $cron$
  );
end $$;

-- ────────────────────────────────────────────────────────────────────
-- 3. Vérification post-application
-- ────────────────────────────────────────────────────────────────────
-- Run après la migration :
--   select jobname, schedule, active, command from cron.job
--   where jobname like 'byer_payouts%';
--
-- Tu dois voir :
--   - byer_payouts_4h | 0 */4 * * * | true | select public.dispatch_eligible_payouts(500);
--   - byer_payouts_daily NE DOIT PLUS APPARAÎTRE (unscheduled).

-- ════════════════════════════════════════════════════════════════════
-- FIN MIGRATION 0018
-- ════════════════════════════════════════════════════════════════════
