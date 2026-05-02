-- ════════════════════════════════════════════════════════════════════
-- 0016 — pg_cron job pour automatisation des payouts (Phase 4 V1 final)
-- À exécuter APRÈS 0015_payouts.sql et 0008_pg_cron_jobs.sql
-- ════════════════════════════════════════════════════════════════════
-- Tous les jours à 02:00 UTC, on scanne les payouts en status='pending'
-- dont due_at est dans le passé (= séjour terminé depuis +24h, fenêtre
-- anti-réclamation expirée). Pour chaque, on POSTe vers l'Edge Function
-- payout-host qui fait le transfer Notch Pay.
--
-- Pourquoi 02:00 UTC : c'est ~03:00 heure CM, période creuse, et le solde
-- Notch Pay est consolidé après les transactions de la veille.
--
-- Architecture :
--   1. Extension pg_net activée (asynchronous HTTP POST depuis Postgres)
--   2. Fonction dispatch_eligible_payouts() : SELECT eligible + POST chacun
--   3. Cron job 'byer_payouts_daily' : appelle la fonction tous les jours
--
-- Volume : ~100 payouts max par run (limite hard pour éviter saturation NP).
-- Si la queue grossit, augmenter la limite ou passer à plusieurs runs/jour.
-- ════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────
-- 1. Active pg_net pour les HTTP POST asynchrones depuis Postgres
-- ────────────────────────────────────────────────────────────────────
-- Sur Supabase pg_net est généralement déjà actif (utilisé par les
-- features comme webhooks DB→Edge). create extension if not exists est
-- idempotent et safe.

create extension if not exists pg_net with schema extensions;

-- ────────────────────────────────────────────────────────────────────
-- 2. Fonction dispatch_eligible_payouts()
-- ────────────────────────────────────────────────────────────────────
-- Pour chaque payout pending éligible, fait un POST vers payout-host.
-- L'Edge Function est déployée --no-verify-jwt, donc on n'a pas besoin
-- d'auth header. On envoie quand même apikey (anon key publique) pour
-- traverser le gateway Supabase proprement.
--
-- ⚠️ La fonction est SECURITY DEFINER et REVOKE EXECUTE FROM public →
-- seul superuser/service_role peut l'appeler (le cron job s'exécute en
-- superuser).

create or replace function public.dispatch_eligible_payouts(p_max integer default 100)
returns table (
  payout_id     uuid,
  http_request_id bigint
)
language plpgsql
security definer
as $$
declare
  v_endpoint text := 'https://xwqnsovfakzraafiudek.supabase.co/functions/v1/payout-host';
  v_anon_key text := 'sb_publishable_QxwtRGhKcJ3LCdcPJ-RNNg_1hi1BhX3';
  v_payout   record;
  v_req_id   bigint;
begin
  for v_payout in
    select id
      from public.payouts
     where status = 'pending'
       and due_at < now()
     order by due_at asc
     limit p_max
  loop
    -- POST asynchrone vers payout-host avec { payout_id }
    -- net.http_post retourne un request_id (la requête tourne en background)
    select net.http_post(
      url     := v_endpoint,
      body    := jsonb_build_object('payout_id', v_payout.id::text),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'apikey',       v_anon_key,
        'Authorization', 'Bearer ' || v_anon_key
      ),
      timeout_milliseconds := 30000
    ) into v_req_id;

    -- Renvoie chaque (payout_id, request_id) pour observabilité
    payout_id := v_payout.id;
    http_request_id := v_req_id;
    return next;
  end loop;
  return;
end;
$$;

comment on function public.dispatch_eligible_payouts(integer) is
  'Scanne les payouts pending éligibles (due_at < now()) et POST chacun vers Edge Function payout-host. Limite par défaut : 100 par run.';

-- Verrouille l'exécution : pas appelable par les users authenticated/anon
revoke execute on function public.dispatch_eligible_payouts(integer) from public, authenticated, anon;

-- ────────────────────────────────────────────────────────────────────
-- 3. Cron job : tous les jours à 02:00 UTC
-- ────────────────────────────────────────────────────────────────────
-- Schedule '0 2 * * *' = 02:00 UTC tous les jours.
-- Idempotent : on unschedule d'abord si le job existe déjà (re-run de mig).

do $$
begin
  perform cron.unschedule('byer_payouts_daily')
  where exists (select 1 from cron.job where jobname = 'byer_payouts_daily');

  perform cron.schedule(
    'byer_payouts_daily',
    '0 2 * * *',
    $cron$ select public.dispatch_eligible_payouts(100); $cron$
  );
end $$;

-- ────────────────────────────────────────────────────────────────────
-- 4. Vue de monitoring : derniers HTTP requests pg_net pour les payouts
-- ────────────────────────────────────────────────────────────────────
-- Utile pour le dashboard admin Pino : voir si les invocations
-- payout-host se passent bien. À la moindre réponse non-2xx, retry
-- depuis le dashboard.
--
-- Note : pg_net stocke les requests dans net._http_response (avec
-- status_code, content_type, content, headers). On joint avec payouts
-- via le request_id ? Non, on n'a pas de lien direct car le request_id
-- n'est pas stocké sur payouts. On laisse cette vue volontairement
-- simple et on s'appuie sur les logs Edge Functions Supabase pour
-- l'observabilité fine.

-- Pas de vue pour l'instant — observabilité via :
--   • Dashboard Supabase → Edge Functions → payout-host → Logs
--   • Dashboard admin Byer → onglet Reversements (Batch 4)

-- ════════════════════════════════════════════════════════════════════
-- FIN MIGRATION 0016
-- ════════════════════════════════════════════════════════════════════
-- Vérification post-application :
--   select * from cron.job where jobname = 'byer_payouts_daily';
--   → tu dois voir 1 ligne avec schedule='0 2 * * *', active=true
--
-- Pour tester manuellement (sans attendre 02:00) :
--   select * from public.dispatch_eligible_payouts(5);
--   → renvoie les payout_id + http_request_id postés
--   → puis vérifier les logs Edge Function payout-host pour la suite
-- ════════════════════════════════════════════════════════════════════
