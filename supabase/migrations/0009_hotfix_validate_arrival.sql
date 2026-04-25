-- ════════════════════════════════════════════════════════════════════
-- Byer — HOTFIX validate_arrival (migration 0006)
-- À exécuter APRÈS 0008_pg_cron_jobs.sql
-- ════════════════════════════════════════════════════════════════════
-- 🐛 BUG :
--   La fonction validate_arrival() en 0006 utilisait un pattern PL/pgSQL
--   illégal : `select b.*, l.owner_id into v_b, v_owner` où v_b est un
--   record `bookings%rowtype`. PostgreSQL refuse les listes INTO mixtes
--   contenant à la fois un record et un scalaire (erreur 42601).
--
--   Le bug n'a pas été détecté à la création (PL/pgSQL ne valide pas
--   le corps des fonctions à la définition), seulement au premier appel
--   réel : `select validate_arrival('uuid')`.
--
-- ✅ FIX :
--   On scinde en deux requêtes :
--   1) `select * into v_b from bookings where qr_token = ...` (record OK)
--   2) `select owner_id into v_owner from listings where id = v_b.listing_id`
--   Le verrou FOR UPDATE est conservé sur la ligne bookings.
-- ════════════════════════════════════════════════════════════════════

create or replace function public.validate_arrival(p_qr_token uuid)
returns boolean
language plpgsql security definer as $$
declare
  v_uid    uuid := auth.uid();
  v_b      public.bookings%rowtype;
  v_owner  uuid;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  -- 1) Récupération du booking complet (record) avec verrou
  select b.* into v_b
    from public.bookings b
   where b.qr_token = p_qr_token
   for update;

  if v_b.id is null then
    raise exception 'QR token not found';
  end if;

  -- 2) Récupération du propriétaire de l'annonce (scalaire)
  select l.owner_id into v_owner
    from public.listings l
   where l.id = v_b.listing_id;

  if v_owner != v_uid then
    raise exception 'Only the host can validate arrival';
  end if;
  if v_b.payment_status != 'paid' then
    raise exception 'Payment not received';
  end if;
  if v_b.status not in ('confirmed','active') then
    raise exception 'Booking status invalid: %', v_b.status;
  end if;
  if v_b.qr_validated_at is not null then
    return false; -- déjà validé, idempotent
  end if;

  update public.bookings
     set qr_validated_at = now(),
         qr_validated_by = v_uid,
         status          = 'active',
         updated_at      = now()
   where id = v_b.id;

  return true;
end;
$$;

-- Permissions inchangées (déjà accordées par 0006, mais on re-grant par sécurité)
revoke all on function public.validate_arrival(uuid) from public;
grant execute on function public.validate_arrival(uuid) to authenticated;

comment on function public.validate_arrival(uuid) is
  'Hôte valide l''arrivée du guest via QR token. Idempotent. Hotfix 0009.';
