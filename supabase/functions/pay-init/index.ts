// ════════════════════════════════════════════════════════════════════
// Byer — Edge Function : pay-init
// ════════════════════════════════════════════════════════════════════
// Initialise un paiement chez Notch Pay (provider par défaut v1).
// L'utilisateur authentifié POSTe { booking_id, method? } et reçoit en
// retour { authorization_url, tx_ref } pour rediriger vers le hosted
// checkout Notch Pay.
//
// Pourquoi côté serveur (Edge Function) plutôt que client direct :
//   • Le service_role peut INSERT dans public.payments (RLS bloque le
//     client direct par design — cf. mig 0014).
//   • On valide que le booking appartient bien au caller (anti-fraude).
//   • Le tx_ref généré côté serveur est unique + lié à la session user.
//   • L'abstraction provider permet de changer de PSP sans toucher au
//     frontend (Notch Pay → Stripe → MoMo direct selon roadmap).
//
// Variables d'environnement requises :
//   SUPABASE_URL                   (auto-injectée)
//   SUPABASE_SERVICE_ROLE_KEY      (auto-injectée)
//   SUPABASE_ANON_KEY              (auto-injectée — pour valider JWT)
//   NOTCHPAY_PUBLIC_KEY            (à configurer : pk_test.xxx ou pk.xxx)
//   NOTCHPAY_WEBHOOK_HASH          (à configurer : hash secret pour signer
//                                   le X-Hub-Signature de notre webhook)
//   APP_URL                        (à configurer : URL de l'app pour callback,
//                                   ex: https://byer.landonjouajosephpino.workers.dev)
//
// Routes :
//   POST /pay-init  → { booking_id, method? } → { authorization_url, tx_ref }
//   GET  /pay-init/health → { ok: true }
// ════════════════════════════════════════════════════════════════════

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders, preflight, jsonResponse } from "../_shared/cors.ts";

const SUPABASE_URL          = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY           = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY              = Deno.env.get("SUPABASE_ANON_KEY")!;
const NOTCHPAY_PUBLIC_KEY   = Deno.env.get("NOTCHPAY_PUBLIC_KEY") ?? "";
const APP_URL               = Deno.env.get("APP_URL") ?? "https://byer.landonjouajosephpino.workers.dev";

const NOTCHPAY_API_BASE     = "https://api.notchpay.co";
const ENV_OK = Boolean(SUPABASE_URL && SERVICE_KEY && ANON_KEY && NOTCHPAY_PUBLIC_KEY);
if (!ENV_OK) {
  console.error("pay-init: missing required env vars");
}

// ─── Auth helper : valide le JWT et renvoie le user_id + email ─────
type AuthCheck =
  | { ok: true; user_id: string; email: string }
  | { ok: false; status: number; error: string };

async function authenticate(req: Request): Promise<AuthCheck> {
  const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization");
  const jwt = authHeader?.replace(/^Bearer\s+/i, "").trim();
  if (!jwt) return { ok: false, status: 401, error: "missing_jwt" };

  const sbClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
  const { data: { user }, error } = await sbClient.auth.getUser(jwt);
  if (error || !user) return { ok: false, status: 401, error: "invalid_jwt" };
  return { ok: true, user_id: user.id, email: user.email ?? "" };
}

// ─── Charge le booking et vérifie qu'il appartient au user ─────────
async function loadAndAuthorize(admin: SupabaseClient, bookingId: string, userId: string) {
  const { data: booking, error } = await admin
    .from("bookings")
    .select("id, guest_id, host_id, listing_id, total_price, status, payment_status, listings(title)")
    .eq("id", bookingId)
    .single();
  if (error || !booking) return { error: "booking_not_found", status: 404 };

  // Seul le guest peut initier le paiement (le host ne paie pas, il reçoit)
  if (booking.guest_id !== userId) return { error: "not_booking_owner", status: 403 };

  // Refuser si déjà payé
  if (booking.payment_status === "paid") return { error: "already_paid", status: 409 };

  // Refuser si annulé
  if (booking.status === "cancelled") return { error: "booking_cancelled", status: 409 };

  return { booking };
}

// ─── Appel Notch Pay /payments ─────────────────────────────────────
async function notchpayInitialize(payload: {
  amount: number;
  currency: string;
  customer: { email: string; phone?: string; name?: string };
  description: string;
  reference: string;
  callback: string;
}) {
  const res = await fetch(`${NOTCHPAY_API_BASE}/payments`, {
    method: "POST",
    headers: {
      "Authorization": NOTCHPAY_PUBLIC_KEY,    // ⚠️ pas "Bearer", la clé directe
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || json?.code >= 400) {
    return { error: json?.message ?? "notchpay_init_failed", raw: json, status: res.status };
  }
  return {
    transaction:        json.transaction,        // UUID Notch Pay
    authorization_url:  json.authorization_url,  // URL hosted checkout
    raw:                json,
  };
}

// ─── Handler principal ─────────────────────────────────────────────
Deno.serve(async (req) => {
  const url = new URL(req.url);
  const route = url.pathname.split("/").filter(Boolean).pop();
  const origin = req.headers.get("origin");

  // CORS preflight
  if (req.method === "OPTIONS") return preflight(origin);

  if (!ENV_OK) {
    return jsonResponse({ error: "server_misconfigured", details: "env vars missing" }, 500, origin);
  }

  // Health check (sans auth, pour monitoring)
  if (route === "health" && req.method === "GET") {
    return jsonResponse({ ok: true, fn: "pay-init", provider: "notchpay" }, 200, origin);
  }

  // POST seulement
  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405, origin);
  }

  // Auth
  const auth = await authenticate(req);
  if (!auth.ok) return jsonResponse({ error: auth.error }, auth.status, origin);

  // Body
  let body: { booking_id?: string; method?: string };
  try { body = await req.json(); } catch { return jsonResponse({ error: "invalid_json" }, 400, origin); }
  if (!body.booking_id) return jsonResponse({ error: "booking_id_required" }, 400, origin);

  // Admin client pour bypass RLS sur la lecture booking + insert payment
  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  // Charge & autorise le booking
  const loaded = await loadAndAuthorize(admin, body.booking_id, auth.user_id);
  if ("error" in loaded) return jsonResponse({ error: loaded.error }, loaded.status, origin);
  const { booking } = loaded;

  // Référence unique côté nous (ne dépend pas du PSP)
  const localRef = `byer_${booking.id.slice(0, 8)}_${Date.now()}`;

  // Init paiement Notch Pay
  const np = await notchpayInitialize({
    amount:    booking.total_price,
    currency:  "XAF",
    customer:  { email: auth.email, name: auth.email.split("@")[0] },
    description: `Réservation ${(booking as any).listings?.title ?? "Byer"}`,
    reference: localRef,
    callback:  `${APP_URL}/?payment=callback&ref=${localRef}`,
  });

  if ("error" in np) {
    // Note l'échec en DB pour le SAV (audit log)
    await admin.from("payments").insert({
      booking_id:   booking.id,
      user_id:      auth.user_id,
      provider:     "notchpay",
      tx_ref:       localRef,
      method:       body.method ?? null,
      amount:       booking.total_price,
      currency:     "XAF",
      status:       "failed",
      raw_payload:  np.raw,
      failure_reason: typeof np.error === "string" ? np.error : "init_failed",
    });
    return jsonResponse({ error: "init_failed", details: np.error }, 502, origin);
  }

  // Insert payment row (statut pending, sera bumped à success/failed par
  // le webhook quand l'utilisateur finalise dans Notch Pay)
  const { error: insertErr } = await admin.from("payments").insert({
    booking_id:    booking.id,
    user_id:       auth.user_id,
    provider:      "notchpay",
    tx_ref:        localRef,
    method:        body.method ?? null,
    amount:        booking.total_price,
    currency:      "XAF",
    status:        "pending",
    checkout_url:  np.authorization_url,
    raw_payload:   { initialize_response: np.raw },
  });
  if (insertErr) {
    console.error("pay-init: payments insert failed", insertErr.message);
    // On continue quand même : le paiement est lancé chez Notch Pay,
    // le webhook re-créera la ligne via upsert si besoin (à ajouter en V2)
  }

  // Bumper booking.payment_ref + payment_method (raccourci de query)
  await admin.from("bookings")
    .update({ payment_ref: localRef, payment_method: body.method ?? null })
    .eq("id", booking.id);

  return jsonResponse({
    ok: true,
    authorization_url: np.authorization_url,
    tx_ref:            localRef,
    notchpay_tx:       np.transaction,
  }, 200, origin);
});
