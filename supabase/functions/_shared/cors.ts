// Headers CORS partagés par toutes les Edge Functions Byer.
// Origins autorisés (whitelist). Pour ajouter un domaine custom (ex. byer.cm),
// l'ajouter ici et redéployer la fonction.
//
// Note RFC : on n'émet PAS `Access-Control-Allow-Origin: null` quand l'origin
// n'est pas reconnue — le navigateur traite la valeur "null" comme un refus
// implicite, mais omettre le header est plus propre et plus debug-friendly.

const ALLOWED_ORIGINS = new Set<string>([
  "https://byer.landonjouajosephpino.workers.dev",
  "http://localhost:8787",
  "http://localhost:3000",
  "http://127.0.0.1:8787",
  "https://127.0.0.1:8787",
]);

export function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

export function preflight(req: Request): Response | null {
  if (req.method !== "OPTIONS") return null;
  return new Response(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export function jsonResponse(
  body: unknown,
  status: number,
  origin: string | null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
