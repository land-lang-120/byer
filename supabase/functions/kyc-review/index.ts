// ════════════════════════════════════════════════════════════════════
// Byer — Edge Function : kyc-review
// ════════════════════════════════════════════════════════════════════
// Permet à un admin (allowlist par email via env ADMIN_EMAILS) de :
//   • lister les KYC en attente (status='pending') avec signed URLs
//   • approuver ou rejeter un document
//   • notifier l'utilisateur via la table public.notifications
//
// Pourquoi une Edge Function plutôt qu'une RPC SQL :
//   • Les signed URLs Storage nécessitent la service_role key (server-only).
//   • L'allowlist admin est externalisée (pas en DB) → rotation triviale.
//   • Permet d'ajouter plus tard un envoi mail/push sans toucher au schéma.
//
// Sécurité :
//   • SUPABASE_SERVICE_ROLE_KEY est secrète et JAMAIS renvoyée au client.
//   • Le JWT du caller est vérifié, son email comparé à ADMIN_EMAILS.
//   • RLS de la DB n'est pas contournée pour les autres tables — seul
//     l'admin client (créé avec service_role) lit kyc_documents en bypass.
//
// Routes (POST sauf indication) :
//   POST  /functions/v1/kyc-review/list-pending   → []
//   POST  /functions/v1/kyc-review/review         → { doc_id, action, reason? }
//   GET   /functions/v1/kyc-review/health         → { ok: true }
//
// Variables d'environnement requises :
//   SUPABASE_URL                (auto-injectée)
//   SUPABASE_SERVICE_ROLE_KEY   (auto-injectée)
//   SUPABASE_ANON_KEY           (auto-injectée, pour valider le JWT)
//   ADMIN_EMAILS                (csv : "alice@a.com,bob@b.com") — à configurer
// ════════════════════════════════════════════════════════════════════

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders, preflight, jsonResponse } from "../_shared/cors.ts";

// ─── Constantes & helpers d'env ────────────────────────────────────
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY     = Deno.env.get("SUPABASE_ANON_KEY")!;
const ADMIN_EMAILS = (Deno.env.get("ADMIN_EMAILS") ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const SIGNED_URL_TTL_SECONDS = 300; // 5 min : laisse le temps de visualiser, pas plus.

// Les 3 secrets Supabase sont auto-injectés en runtime. Si un seul manque,
// on refuse de servir et on retourne 500 explicite plutôt que de crasher.
const ENV_OK = Boolean(SUPABASE_URL && SERVICE_KEY && ANON_KEY);
if (!ENV_OK) {
  console.error("kyc-review: missing required env vars (SUPABASE_URL / SERVICE_ROLE_KEY / ANON_KEY)");
}
if (ADMIN_EMAILS.length === 0) {
  console.warn("kyc-review: ADMIN_EMAILS is empty — every protected call will be rejected.");
}

// ─── Auth admin ───────────────────────────────────────────────────
type AdminCheck =
  | { ok: true; user_id: string; email: string }
  | { ok: false; status: number; error: string };

async function requireAdmin(req: Request): Promise<AdminCheck> {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.toLowerCase().startsWith("bearer ")) {
    return { ok: false, status: 401, error: "Missing Authorization header" };
  }
  const jwt = auth.slice(7).trim();

  // On valide le JWT côté Supabase Auth en utilisant l'anon key.
  const authClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
  const { data, error } = await authClient.auth.getUser();
  if (error || !data?.user) {
    return { ok: false, status: 401, error: "Invalid or expired token" };
  }

  const email = (data.user.email ?? "").toLowerCase();
  if (!email || !ADMIN_EMAILS.includes(email)) {
    return { ok: false, status: 403, error: "Not an admin" };
  }
  return { ok: true, user_id: data.user.id, email };
}

// ─── Client admin (service role, bypass RLS pour kyc + storage) ────
function adminClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ─── Routes ───────────────────────────────────────────────────────

// GET /health  → liveness check (sans auth)
function healthRoute(origin: string | null): Response {
  return jsonResponse(
    { ok: true, fn: "kyc-review", admin_count: ADMIN_EMAILS.length },
    200,
    origin,
  );
}

// POST /list-pending  → docs en attente avec signed URLs (admin only)
async function listPending(origin: string | null): Promise<Response> {
  const sb = adminClient();

  // 1) Tous les docs pending, plus jeunes en premier
  const { data: docs, error: docsErr } = await sb
    .from("kyc_documents")
    .select(`
      id,
      user_id,
      doc_type,
      file_path,
      status,
      submitted_at,
      profile:profiles!kyc_documents_user_id_fkey (
        id, name, email, phone, avatar_letter
      )
    `)
    .eq("status", "pending")
    .order("submitted_at", { ascending: true })
    .limit(100);

  if (docsErr) {
    return jsonResponse({ error: docsErr.message }, 500, origin);
  }
  if (!docs || docs.length === 0) {
    return jsonResponse({ items: [] }, 200, origin);
  }

  // 2) Signed URLs en batch (1 appel storage par doc — bucket privé "kyc-documents")
  const items = await Promise.all(
    docs.map(async (d) => {
      const { data: signed, error: sErr } = await sb.storage
        .from("kyc-documents")
        .createSignedUrl(d.file_path, SIGNED_URL_TTL_SECONDS);
      return {
        id: d.id,
        user_id: d.user_id,
        doc_type: d.doc_type,
        file_path: d.file_path,
        submitted_at: d.submitted_at,
        profile: d.profile,
        signed_url: signed?.signedUrl ?? null,
        signed_url_error: sErr?.message ?? null,
      };
    }),
  );

  return jsonResponse(
    { items, count: items.length, ttl_seconds: SIGNED_URL_TTL_SECONDS },
    200,
    origin,
  );
}

// POST /review  body { doc_id, action: 'approve'|'reject', reason? }
type ReviewPayload = {
  doc_id?: string;
  action?: "approve" | "reject";
  reason?: string;
};

async function review(
  payload: ReviewPayload,
  admin: { user_id: string; email: string },
  origin: string | null,
): Promise<Response> {
  // ─── Validation entrée ───────────────────────────────────────
  if (!payload.doc_id || typeof payload.doc_id !== "string") {
    return jsonResponse({ error: "Missing doc_id" }, 400, origin);
  }
  if (payload.action !== "approve" && payload.action !== "reject") {
    return jsonResponse({ error: "action must be 'approve' or 'reject'" }, 400, origin);
  }
  if (payload.action === "reject" && !payload.reason?.trim()) {
    return jsonResponse({ error: "reason required when rejecting" }, 400, origin);
  }

  const sb = adminClient();

  // 1) Charge le doc + profil pour la notification
  const { data: doc, error: docErr } = await sb
    .from("kyc_documents")
    .select("id, user_id, doc_type, status")
    .eq("id", payload.doc_id)
    .single();

  if (docErr || !doc) {
    return jsonResponse({ error: "Document not found" }, 404, origin);
  }
  if (doc.status !== "pending") {
    return jsonResponse(
      { error: `Already reviewed (status=${doc.status})` },
      409,
      origin,
    );
  }

  // 2) Update du document
  const newStatus = payload.action === "approve" ? "approved" : "rejected";
  const { data: updated, error: upErr } = await sb
    .from("kyc_documents")
    .update({
      status: newStatus,
      reject_reason: payload.action === "reject" ? payload.reason : null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.user_id,
    })
    .eq("id", payload.doc_id)
    .eq("status", "pending") // garde-fou contre double-review concurrent
    .select("id, status, doc_type, user_id, reviewed_at, reviewed_by")
    .single();

  if (upErr || !updated) {
    return jsonResponse(
      { error: upErr?.message ?? "Update failed (race?)" },
      500,
      origin,
    );
  }

  // 3) Notification au user (best-effort : on ne fait pas planter la review si ça rate)
  const docLabels: Record<string, string> = {
    id_card: "Carte d'identité",
    passport: "Passeport",
    driver_license: "Permis de conduire",
    selfie: "Selfie",
  };
  const docLabel = docLabels[updated.doc_type] ?? updated.doc_type;
  const notifPayload = payload.action === "approve"
    ? {
        user_id: updated.user_id,
        type: "system" as const,
        title: `${docLabel} validée ✅`,
        body: "Votre identité est désormais vérifiée. Vous pouvez réserver et publier sans restriction.",
        ref_id: updated.id,
      }
    : {
        user_id: updated.user_id,
        type: "system" as const,
        title: `${docLabel} refusée`,
        body: `Motif : ${payload.reason}. Vous pouvez soumettre un nouveau document.`,
        ref_id: updated.id,
      };
  const { error: notifErr } = await sb.from("notifications").insert(notifPayload);
  if (notifErr) {
    console.warn("kyc-review: notification insert failed:", notifErr.message);
  }

  return jsonResponse(
    {
      ok: true,
      doc: updated,
      notified: !notifErr,
      reviewer: admin.email,
    },
    200,
    origin,
  );
}

// ─── Router ───────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  const pre = preflight(req);
  if (pre) return pre;

  const origin = req.headers.get("origin");
  const url = new URL(req.url);
  // Robuste face aux trailing slash et doubles slashes : on prend le dernier
  // segment non vide (le path Supabase est toujours `/functions/v1/<fn>/<route>`).
  const route = url.pathname.split("/").filter(Boolean).pop() ?? "";

  try {
    // Garde-fou env : si un secret manque, on échoue net plutôt que de
    // produire des 500 obscurs après un appel HTTP.
    if (!ENV_OK) {
      return jsonResponse({ error: "Service mis-configured" }, 500, origin);
    }

    // health = pas d'auth (utile pour les sondes uptime)
    if (route === "health" && req.method === "GET") {
      return healthRoute(origin);
    }

    // Tout le reste = admin
    const admin = await requireAdmin(req);
    if (!admin.ok) {
      return jsonResponse({ error: admin.error }, admin.status, origin);
    }

    if (route === "list-pending" && req.method === "POST") {
      return await listPending(origin);
    }
    if (route === "review" && req.method === "POST") {
      let body: ReviewPayload = {};
      try {
        body = await req.json();
      } catch {
        return jsonResponse({ error: "Invalid JSON body" }, 400, origin);
      }
      return await review(body, admin, origin);
    }

    return jsonResponse({ error: `Unknown route: ${route}` }, 404, origin);
  } catch (e) {
    console.error("kyc-review: uncaught error", e);
    return jsonResponse({ error: "Internal server error" }, 500, origin);
  }
});
