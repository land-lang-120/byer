-- ════════════════════════════════════════════════════════════════════
-- Byer — Tâches planifiées (pg_cron)
-- À exécuter APRÈS 0007_reviews_rewards_notifications.sql
-- ════════════════════════════════════════════════════════════════════
-- Cette migration active pg_cron et programme 2 jobs récurrents :
--
-- 1️⃣  auto-complete-bookings : toutes les heures
--     → marque automatiquement `status = completed` les bookings dont
--       la checkout est passée (et `status = active`).
--     → déclenche en cascade les triggers :
--         - notify_guest_on_status_change (notif "votre séjour est terminé")
--         - award_booking_points (+2 pts au guest, +5 pts au host)
--
-- 2️⃣  cleanup-expired-coupons : tous les jours à 03:00 (heure UTC)
--     → marque `status = expired` les coupons dont expires_at est dépassé.
--     → libère les filtres "actifs" du dashboard utilisateur.
--
-- ⚠️  PRÉ-REQUIS : pg_cron doit être disponible.
--     Sur Supabase :
--       Dashboard → Database → Extensions → cherche "pg_cron"
--       → bouton "Enable" (gratuit sur tous les plans)
--     Si l'extension échoue à s'activer côté SQL ci-dessous,
--     active-la manuellement dans le dashboard puis ré-exécute.
--
-- 🛠️  DÉSINSTALLATION (si jamais besoin) :
--     select cron.unschedule('auto-complete-bookings');
--     select cron.unschedule('cleanup-expired-coupons');
-- ════════════════════════════════════════════════════════════════════

-- 1. Activation de l'extension pg_cron (idempotent)
create extension if not exists pg_cron;

-- 2. Job toutes les heures : finalisation auto des bookings expirés
--    cron.schedule(name, schedule, command)
--    Le pattern '0 * * * *' = à 00 minutes de chaque heure
do $$
begin
  -- Si le job existe déjà, on le supprime pour le re-créer (idempotent)
  perform cron.unschedule('auto-complete-bookings')
  where exists (select 1 from cron.job where jobname = 'auto-complete-bookings');

  perform cron.schedule(
    'auto-complete-bookings',
    '0 * * * *',
    $cron$ select public.auto_complete_bookings(); $cron$
  );
end $$;

-- 3. Job quotidien à 03:00 UTC : nettoyage coupons expirés
do $$
begin
  perform cron.unschedule('cleanup-expired-coupons')
  where exists (select 1 from cron.job where jobname = 'cleanup-expired-coupons');

  perform cron.schedule(
    'cleanup-expired-coupons',
    '0 3 * * *',
    $cron$ select public.cleanup_expired_coupons(); $cron$
  );
end $$;

-- 4. Vue d'inspection : facilite le debug depuis le SQL Editor
create or replace view public.cron_jobs_status as
  select
    j.jobname           as job_name,
    j.schedule          as cron_schedule,
    j.command           as sql_command,
    j.active            as is_active,
    (select max(d.start_time)
       from cron.job_run_details d
      where d.jobid = j.jobid)               as last_run_at,
    (select d.status
       from cron.job_run_details d
      where d.jobid = j.jobid
      order by d.start_time desc
      limit 1)                               as last_status,
    (select d.return_message
       from cron.job_run_details d
      where d.jobid = j.jobid
      order by d.start_time desc
      limit 1)                               as last_message
  from cron.job j
  where j.jobname in ('auto-complete-bookings', 'cleanup-expired-coupons');

comment on view public.cron_jobs_status is
  'État des tâches planifiées Byer. Requête : select * from cron_jobs_status;';

-- ════════════════════════════════════════════════════════════════════
-- Vérification après exécution :
--   select * from public.cron_jobs_status;
--
-- Tu dois voir 2 lignes :
--   - auto-complete-bookings    | 0 * * * *  | active | (dernière exécution)
--   - cleanup-expired-coupons   | 0 3 * * *  | active | (dernière exécution)
-- ════════════════════════════════════════════════════════════════════
