// ════════════════════════════════════════════════════════════════════
// Byer — Edge Function : payout-host
// ════════════════════════════════════════════════════════════════════
// Reverse un paiement au bailleur via l'API Notch Pay /transfers.
// Invoquée par :
//   • pg_cron quotidien à 02:00 GMT (job byer_payouts_daily) qui scanne
//     les payouts pending éligibles (due_at < now())
//   • Le dashboard admin Pino pour retry manuel sur les payouts failed
//
// Body : { payout_id: uuid }
// Auth : aucune côté gateway (Edge Function deployed --no-verify-jwt).
//        L'invocation vient toujours de service_role en interne (pg_cron
//        ou admin dashboard) — on n'expose jamais cette URL au public.
//        ⚠️ Une couche de protection légère via header HMAC simple
//        pourrait être ajoutée en V2 si on craint l'enumération.
//
// Variables d'environnement requises :
//   SUPABASE_URL                   (auto-injectée)
//   SUPABASE_SERVICE_ROLE_KEY      (auto-injectée)
//   NOTCHPAY_PUBLIC_KEY            (pk.test_xxx en sandbox, pk.live_xxx en prod)
//   NOTCHPAY_SECRET_KEY            (sk.test_xxx / sk.live_xxx — REQUIS pour /transfers)
//
// Routes :
//   POST /payout-host  → { payout_id } → { ok, status, payout_ref?, error? }
//   GET  /payout-host/health → { ok: true }
// ════════════════════════════════════════════════════════════════════

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

const SUPABASE_URL          = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY           = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const NOTCHPAY_PUBLIC_KEY   = Deno.env.get("NOTCHPAY_PUBLIC_KEY") ?? "";
const NOTCHPAY_SECRET_KEY   = Deno.env.get("NOTCHPAY_SECRET_KEY") ?? "";

const NOTCHPAY_API_BASE     = "https://api.notchpay.co";
const ENV_OK = Boolean(SUPABASE_URL && SERVICE_KEY && NOTCHPAY_PUBLIC_KEY && NOTCHPAY_SECRET_KEY);
if (!ENV_OK) {
  console.error("payout-host: missing required env vars (NOTCHPAY_SECRET_KEY needed for /transfers)");
}

// ─── Mapping interne method → channel Notch Pay ────────────────────
// Notch Pay /transfers attend un `channel` parmi :
//   - "cm.mtn"   pour MTN Mobile Money Cameroun
//   - "cm.orange" pour Orange Money Cameroun
// (Format inspiré de la doc Notch Pay v1.x. À ajuster si l'API évolue.)
function channelFor(method: string): string | null {
  switch (method) {
    case "mtn_momo":     return "cm.mtn";
    case "orange_money": return "cm.orange";
    default:             return null;
  }
}

// ─── Appel Notch Pay POST /transfers ───────────────────────────────
// Authorization headers d'après la doc Notch Pay :
//   - Authorization: <NOTCHPAY_PUBLIC_KEY>           (clé publique directe)
//   - X-Grant: <NOTCHPAY_SECRET_KEY>                 (clé secrète pour ops sensibles)
// Les transfers sortants sont des opérations sensibles → X-Grant requis.
async function notchpayTransfer(payload: {
  amount:       number;
  currency:     string;
  beneficiary:  { phone: string; channel: string; name: string };
  description:  string;
  reference:    string;
}) {
  const res = await fetch(`${NOTCHPAY_API_BASE}/transfers`, {
    method: "POST",
    headers: {
      "Authorization": NOTCHPAY_PUBLIC_KEY,
      "X-Grant":       NOTCHPAY_SECRET_KEY,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify(payload),
  });
  let json: any = null;
  try { json = await res.json(); } catch { /* ignore */ }
  if (!res.ok || (json && typeof json.code === "number" && json.code >= 400)) {
    return {
      error: json?.message ?? "notchpay_transfer_failed",
      raw: json,
      status: res.status,
    };
  }
  return {
    transfer_id: json?.transfer?.id ?? json?.id ?? null,
    status:      json?.transfer?.status ?? json?.status ?? "processing",
    raw:         json,
  };
}

// ─── Handler principal ─────────────────────────────────────────────
Deno.serve(async (req) => {
  const url = new URL(req.url);
  const route = url.pathname.split("/").filter(Boolean).pop();
  const origin = req.headers.get("origin");

  // CORS preflight (inline — éviter le bug preflight(origin) qu'on a eu sur pay-init)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (!ENV_OK) {
    return jsonResponse({ error: "server_misconfigured", details: "env vars missing (NOTCHPAY_SECRET_KEY required)" }, 500, origin);
  }

  // Health check (sans auth, pour monitoring)
  if (route === "health" && req.method === "GET") {
    return jsonResponse({ ok: true, fn: "payout-host", provider: "notchpay" }, 200, origin);
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405, origin);
  }

  // Body
  let body: { payout_id?: string };
  try { body = await req.json(); } catch { return jsonResponse({ error: "invalid_json" }, 400, origin); }
  const payoutId = body?.payout_id;
  if (!payoutId) return jsonResponse({ error: "payout_id_required" }, 400, origin);

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  // ─── 1. Charge le payout + profile bailleur + booking en 1 query
  const { data: payout, error: selErr } = await admin
    .from("payouts")
    .select(`
      id, booking_id, host_id, amount_gross, commission_byer, amount_net,
      currency, status, due_at, payout_ref,
      bookings(ref, listings(title)),
      host:profiles!host_id(payout_method, payout_phone, payout_name)
    `)
    .eq("id", payoutId)
    .single();

  if (selErr || !payout) {
    return jsonResponse({ error: "payout_not_found", details: selErr?.message }, 404, origin);
  }

  // ─── 2. Vérif idempotence : refuse si déjà processing/paid/cancelled
  if (payout.status === "processing") {
    return jsonResponse({ ok: true, idempotent: true, status: "processing", note: "already in flight" }, 200, origin);
  }
  if (payout.status === "paid") {
    return jsonResponse({ ok: true, idempotent: true, status: "paid", payout_ref: payout.payout_ref }, 200, origin);
  }
  if (payout.status === "cancelled" || payout.status === "refunded") {
    return jsonResponse({ error: "payout_terminal_state", status: payout.status }, 409, origin);
  }
  // payout.status doit être 'pending' ou 'failed' (retry) à ce stade

  // ─── 3. Vérif éligibilité : due_at doit être dans le passé (sauf force admin)
  // La logique de "force" via param est volontairement absente — pour
  // forcer un payout en avance, il faut update due_at en SQL admin.
  const dueDate = new Date(payout.due_at);
  if (dueDate.getTime() > Date.now()) {
    return jsonResponse({
      error: "payout_not_yet_due",
      due_at: payout.due_at,
      now: new Date().toISOString(),
    }, 409, origin);
  }

  // ─── 4. Vérif profile bailleur a les coordonnées
  const host = (payout as any).host as { payout_method?: string; payout_phone?: string; payout_name?: string } | null;
  if (!host || !host.payout_method || !host.payout_phone || !host.payout_name) {
    // Marque failed avec raison claire — pas de retry auto possible
    await admin.from("payouts").update({
      status: "failed",
      failure_reason: "missing_host_payout_info (payout_method/phone/name)",
    }).eq("id", payoutId);
    return jsonResponse({ error: "host_payout_info_missing", details: "Le bailleur doit configurer ses infos de paiement avant qu'on puisse le payer." }, 400, origin);
  }

  const channel = channelFor(host.payout_method);
  if (!channel) {
    await admin.from("payouts").update({
      status: "failed",
      failure_reason: `unsupported_payout_method: ${host.payout_method}`,
    }).eq("id", payoutId);
    return jsonResponse({ error: "unsupported_method", method: host.payout_method }, 400, origin);
  }

  // ─── 5. Mark `processing` AVANT l'appel NP (anti race condition)
  // Si le cron est rejoué pendant qu'un transfer est en flight, le 2e
  // verra status='processing' et passera son chemin (étape 2 ci-dessus).
  const localRef = `byer_payout_${payout.id.slice(0, 8)}_${Date.now()}`;
  const { error: lockErr } = await admin
    .from("payouts")
    .update({
      status: "processing",
      payout_method: host.payout_method,   // snapshot
      payout_phone:  host.payout_phone,    // snapshot
      payout_ref: localRef,                 // notre ref locale (sera complétée par le retour NP)
    })
    .eq("id", payoutId)
    .eq("status", payout.status);          // optimistic locking : la row doit être encore au même statut
  if (lockErr) {
    console.error("payout-host: optimistic lock failed", lockErr.message);
    return jsonResponse({ error: "race_condition_lock_failed" }, 409, origin);
  }

  // ─── 6. Appel Notch Pay /transfers
  const description = `Reversement Byer — ${(payout as any).bookings?.ref ?? payout.booking_id} (${(payout as any).bookings?.listings?.title ?? "logement"})`;
  const np = await notchpayTransfer({
    amount:      payout.amount_net,
    currency:    payout.currency,
    beneficiary: {
      phone:   host.payout_phone,
      channel: channel,
      name:    host.payout_name,
    },
    description,
    reference:   localRef,
  });

  if ("error" in np) {
    // Échec NP → marque failed et stocke la raison + raw payload pour debug
    await admin.from("payouts").update({
      status: "failed",
      failure_reason: typeof np.error === "string" ? np.error : "transfer_failed",
      raw_payload: np.raw,
    }).eq("id", payoutId);
    return jsonResponse({
      error: "transfer_failed",
      details: np.error,
      np_status: np.status,
    }, 502, origin);
  }

  // ─── 7. NP a accepté le transfer (probable status="processing" côté NP)
  // On reste en 'processing' chez nous, on attend le webhook transfer.complete
  // pour passer à 'paid'. Le payout_ref est mis à jour avec l'ID NP.
  const { error: updErr } = await admin.from("payouts").update({
    payout_ref: np.transfer_id ?? localRef,  // NP ID si dispo, sinon notre ref
    raw_payload: { ...(np.raw ?? {}), local_ref: localRef },
  }).eq("id", payoutId);

  if (updErr) {
    console.error("payout-host: post-transfer update failed", updErr.message);
    // pas critique : le webhook transfer.complete fera la maj finale
  }

  return jsonResponse({
    ok: true,
    payout_id: payoutId,
    status: "processing",
    np_transfer_id: np.transfer_id,
    np_status: np.status,
    note: "Transfer initiated. Final status will arrive via webhook transfer.complete.",
  }, 200, origin);
});
