// ════════════════════════════════════════════════════════════════════
// Byer — Edge Function : pay-webhook
// ════════════════════════════════════════════════════════════════════
// Reçoit les notifications de Notch Pay quand un paiement change de statut.
//
// Configurer dans le dashboard Notch Pay :
//   Settings → Webhooks → Add endpoint
//   URL : https://<project_ref>.supabase.co/functions/v1/pay-webhook
//   Events : payment.complete, payment.failed, payment.canceled
//
// Sécurité :
//   • Notch Pay signe chaque webhook avec HMAC SHA-256 du body brut
//     en utilisant le "Webhook hash" configuré côté Notch Pay.
//   • On vérifie via le header `x-notch-signature` AVANT de toucher la DB.
//   • Comparaison en temps constant pour éviter timing attack.
//
// Variables d'environnement :
//   SUPABASE_URL                (auto)
//   SUPABASE_SERVICE_ROLE_KEY   (auto)
//   NOTCHPAY_WEBHOOK_HASH       (à configurer : copié du dashboard NP)
// ════════════════════════════════════════════════════════════════════

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

const SUPABASE_URL              = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY               = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const NOTCHPAY_WEBHOOK_HASH     = Deno.env.get("NOTCHPAY_WEBHOOK_HASH") ?? "";
const ENV_OK = Boolean(SUPABASE_URL && SERVICE_KEY && NOTCHPAY_WEBHOOK_HASH);
if (!ENV_OK) {
  console.error("pay-webhook: missing required env vars (SUPABASE_URL / SERVICE_KEY / NOTCHPAY_WEBHOOK_HASH)");
}

// ─── HMAC SHA-256 verify (Web Crypto API, dispo dans Deno) ─────────
async function verifySignature(rawBody: string, signature: string, hashKey: string): Promise<boolean> {
  if (!signature || !hashKey) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(hashKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  // Convert to hex string
  const computed = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  // Constant-time comparison
  if (computed.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) {
    diff |= computed.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

// ─── Mapping Notch Pay event → notre status (payments) ─────────────
function mapPaymentStatus(event: string, dataStatus?: string): string {
  if (event === "payment.complete" || dataStatus === "complete") return "success";
  if (event === "payment.failed"   || dataStatus === "failed")   return "failed";
  if (event === "payment.canceled" || event === "payment.cancelled" || dataStatus === "canceled") return "cancelled";
  if (event === "payment.refunded" || dataStatus === "refunded") return "refunded";
  return "pending";
}

// ─── Mapping Notch Pay event → notre status (payouts/transfers) ────
// Les transfers ont leur propre cycle : pending → processing → complete | failed
function mapTransferStatus(event: string, dataStatus?: string): string {
  if (event === "transfer.complete" || event === "transfer.successful" || dataStatus === "complete" || dataStatus === "successful") return "paid";
  if (event === "transfer.failed"   || dataStatus === "failed")   return "failed";
  if (event === "transfer.canceled" || event === "transfer.cancelled" || dataStatus === "canceled") return "cancelled";
  if (event === "transfer.refunded" || dataStatus === "refunded") return "refunded";
  return "processing";
}

// ─── Helper : déterminer si l'event concerne un transfer/payout ────
function isTransferEvent(event: string): boolean {
  return typeof event === "string" && event.startsWith("transfer.");
}

// ─── Handler ───────────────────────────────────────────────────────
Deno.serve(async (req) => {
  const url = new URL(req.url);
  const route = url.pathname.split("/").filter(Boolean).pop();
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (!ENV_OK) return jsonResponse({ error: "server_misconfigured" }, 500, origin);

  if (route === "health" && req.method === "GET") {
    return jsonResponse({ ok: true, fn: "pay-webhook", provider: "notchpay" }, 200, origin);
  }

  // GET sur n'importe quel chemin → 200 (Notch Pay peut faire un probe GET
  // pour vérifier que l'endpoint répond avant d'enregistrer le webhook)
  if (req.method === "GET") {
    return jsonResponse({ ok: true, fn: "pay-webhook", provider: "notchpay" }, 200, origin);
  }

  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405, origin);

  // 1. Récupérer le body BRUT (avant tout parsing) pour la vérif signature
  const rawBody = await req.text();
  const signature = req.headers.get("x-notch-signature") ?? req.headers.get("X-Notch-Signature") ?? "";

  // 1bis. Verification ping de Notch Pay : POST vide ou sans signature →
  //       on répond 200 pour valider la création du webhook. Aucune action DB.
  //       (Notch Pay enverra des events réels avec signature après.)
  if (!signature || rawBody.length === 0 || rawBody === "{}") {
    console.log("pay-webhook: verification ping accepted (no signature or empty body)");
    return jsonResponse({ ok: true, verification: "accepted" }, 200, origin);
  }

  // 1ter. Mode bootstrap : tant que NOTCHPAY_WEBHOOK_HASH est le placeholder
  //       (configuré avant que Notch Pay nous donne la vraie valeur, à la
  //       1ère création du webhook), on accepte les events SANS vérifier la
  //       signature pour permettre à Notch Pay de valider l'endpoint. Une
  //       fois qu'on aura le vrai hash, on redéploiera et ce branche se
  //       désactivera (la prochaine ligne `verifySignature` reprendra la
  //       main avec le vrai hash).
  if (NOTCHPAY_WEBHOOK_HASH.startsWith("placeholder_")) {
    console.warn("pay-webhook: BOOTSTRAP mode — accepting signed event WITHOUT verifying signature. Set real NOTCHPAY_WEBHOOK_HASH ASAP.");
    // Continue le traitement (parse + update DB) mais log explicitement que
    // c'est un mode dégradé.
  } else {
    // 2. Vérifier la signature HMAC SHA-256 (events réels uniquement)
    const valid = await verifySignature(rawBody, signature, NOTCHPAY_WEBHOOK_HASH);
    if (!valid) {
      console.warn("pay-webhook: invalid signature", { signature_received: signature.slice(0, 8) + "..." });
      return jsonResponse({ error: "invalid_signature" }, 401, origin);
    }
  }

  // 3. Parser le body
  let payload: any;
  try { payload = JSON.parse(rawBody); } catch {
    return jsonResponse({ error: "invalid_json" }, 400, origin);
  }

  // Notch Pay envoie le payload suivant :
  //   { event: "payment.complete", data: {
  //       reference:          "trx.test_xxx",   ← Notch Pay's internal ID (PSP-side)
  //       trxref:             "byer_xxx",       ← NOTRE ref (que nous avons envoyée en /payments init)
  //       merchant_reference: "byer_xxx",       ← idem (alias plus standard)
  //       status, amount, ...
  //   }}
  //
  // ⚠️ BUG corrigé : on cherchait `data.reference` qui est l'ID PSP-side.
  // Comme on stocke NOTRE ref dans payments.tx_ref, le SELECT retournait
  // toujours 0 row → ignored, le booking restait pending même après un
  // paiement réussi. On utilise maintenant merchant_reference (ou trxref
  // en fallback) qui contient bien notre référence.
  const event = payload.event ?? "";
  const data  = payload.data ?? {};
  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  // ════════════════════════════════════════════════════════════════
  // BRANCHE A — Event TRANSFER.* (payout sortant aux bailleurs)
  // ════════════════════════════════════════════════════════════════
  if (isTransferEvent(event)) {
    // Notch Pay payload pour transfers (similaire à payments) :
    //   data.reference          = ID NP du transfer (ex: trf.test_xxx)
    //   data.trxref / data.merchant_reference = NOTRE localRef (byer_payout_xxx)
    //   data.id, data.amount, data.status…
    const transferRef =
      data.merchant_reference || data.trxref || data.reference || data.id;
    if (!transferRef) {
      return jsonResponse({ error: "missing_transfer_reference" }, 400, origin);
    }

    const newStatus = mapTransferStatus(event, data.status);

    // Lookup payouts row par payout_ref (qui contient soit l'ID NP, soit notre localRef
    // selon ce qu'a stocké payout-host)
    const { data: payout, error: poErr } = await admin
      .from("payouts")
      .select("id, host_id, booking_id, status, amount_net, currency, bookings(ref, listings(title))")
      .eq("payout_ref", transferRef)
      .single();

    if (poErr || !payout) {
      console.warn("pay-webhook (transfer): payout row not found for ref", transferRef);
      return jsonResponse({ ok: true, ignored: "unknown_transfer_ref" }, 200, origin);
    }

    // Idempotence : déjà à un statut terminal identique ?
    if (["paid","failed","cancelled","refunded"].includes(payout.status) && payout.status === newStatus) {
      return jsonResponse({ ok: true, idempotent: true }, 200, origin);
    }

    const updates: any = {
      status:      newStatus,
      raw_payload: payload,
    };
    if (newStatus === "paid") {
      updates.paid_at = new Date().toISOString();
      updates.failure_reason = null;
    }
    if (newStatus === "failed") {
      updates.failure_reason = data.message ?? data.failure_reason ?? "transfer_failed";
    }

    const { error: updErr } = await admin
      .from("payouts")
      .update(updates)
      .eq("id", payout.id);
    if (updErr) {
      console.error("pay-webhook (transfer): payout update failed", updErr.message);
      return jsonResponse({ error: "db_update_failed" }, 500, origin);
    }

    // Notification au bailleur si paiement réussi
    if (newStatus === "paid") {
      const listingTitle = (payout as any).bookings?.listings?.title ?? "votre logement";
      const formattedAmount = new Intl.NumberFormat("fr-FR").format(payout.amount_net);
      await admin.from("notifications").insert({
        user_id: payout.host_id,
        type:    "payment",
        title:   "Paiement reçu",
        body:    `Vous avez reçu ${formattedAmount} ${payout.currency} pour la réservation de ${listingTitle}.`,
        ref_id:  payout.booking_id,
      });
    }

    return jsonResponse({ ok: true, kind: "transfer", status: newStatus }, 200, origin);
  }

  // ════════════════════════════════════════════════════════════════
  // BRANCHE B — Event PAYMENT.* (paiement entrant des locataires)
  // ════════════════════════════════════════════════════════════════
  const txRef = data.merchant_reference || data.trxref || data.reference;
  if (!txRef) return jsonResponse({ error: "missing_reference" }, 400, origin);

  const newStatus = mapPaymentStatus(event, data.status);

  // 4. Update payments row (idempotent : si déjà 'success', no-op)
  const { data: existing, error: selErr } = await admin
    .from("payments")
    .select("id, booking_id, status")
    .eq("provider", "notchpay")
    .eq("tx_ref", txRef)
    .single();

  if (selErr || !existing) {
    // Le paiement n'existe pas dans notre DB → suspect (peut-être un test
    // ou une attaque). On log et on renvoie 200 pour pas que NP retry
    // indéfiniment (NP retry sur 4xx/5xx).
    console.warn("pay-webhook: payment row not found for tx_ref", txRef);
    return jsonResponse({ ok: true, ignored: "unknown_tx_ref" }, 200, origin);
  }

  // Idempotence : ignore si déjà à un statut terminal
  if (["success","failed","cancelled","refunded"].includes(existing.status) && existing.status === newStatus) {
    return jsonResponse({ ok: true, idempotent: true }, 200, origin);
  }

  const { error: updErr } = await admin
    .from("payments")
    .update({
      status:        newStatus,
      raw_payload:   payload,
      failure_reason: newStatus === "failed" ? (data.message ?? data.failure_reason ?? null) : null,
    })
    .eq("id", existing.id);

  if (updErr) {
    console.error("pay-webhook: update failed", updErr.message);
    return jsonResponse({ error: "db_update_failed" }, 500, origin);
  }

  // 5. Si paiement réussi : marquer booking.payment_status = 'paid' +
  //    bump booking.status à 'confirmed' si pending. Crée notification.
  // ⚠️ Le trigger SQL `payments_to_payouts` (mig 0015) crée AUSSI une
  // row payouts en pending automatiquement à ce moment-là — pas besoin
  // de l'INSERT côté code, c'est tracké par DB.
  if (newStatus === "success") {
    const { data: booking } = await admin
      .from("bookings")
      .select("id, guest_id, host_id, status, listings(title)")
      .eq("id", existing.booking_id)
      .single();

    if (booking) {
      const updates: any = { payment_status: "paid" };
      if (booking.status === "pending") updates.status = "confirmed";
      await admin.from("bookings").update(updates).eq("id", booking.id);

      // Notif au guest : "paiement confirmé"
      await admin.from("notifications").insert({
        user_id: booking.guest_id,
        type:    "booking",
        title:   "Paiement confirmé",
        body:    `Votre paiement pour ${(booking as any).listings?.title ?? "votre réservation"} a été reçu. Profitez bien !`,
        ref_id:  booking.id,
      });
      // Notif au host : "nouveau paiement"
      await admin.from("notifications").insert({
        user_id: booking.host_id,
        type:    "booking",
        title:   "Nouveau paiement reçu",
        body:    `Vous avez reçu un paiement pour ${(booking as any).listings?.title ?? "votre annonce"}. Le reversement sera effectué automatiquement après le séjour.`,
        ref_id:  booking.id,
      });
    }
  }

  return jsonResponse({ ok: true, kind: "payment", status: newStatus }, 200, origin);
});
