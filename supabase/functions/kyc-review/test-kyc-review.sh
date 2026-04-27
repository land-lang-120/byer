#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════════
# Test E2E pour l'Edge Function kyc-review.
# ════════════════════════════════════════════════════════════════════
# Pré-requis :
#   • la fonction est déployée et ADMIN_EMAILS contient l'email admin ;
#   • `jq` installé localement (Windows : scoop install jq, macOS : brew
#     install jq, Debian : apt-get install jq).
#
# Usage :
#   bash test-kyc-review.sh \
#        <SUPABASE_URL> <ANON_KEY> \
#        <ADMIN_EMAIL> <ADMIN_PASSWORD> \
#        <USER_EMAIL>  <USER_PASSWORD>
#
# Le script :
#   1. Login admin + login user.
#   2. User upload un fichier bidon dans Storage + insert kyc_documents.
#   3. Admin appelle list-pending → vérifie présence du doc.
#   4. Admin appelle review approve.
#   5. Vérifie : status=approved, profiles.identity_verified=true,
#      notification créée.
#   6. Anti-double-review (409 attendu).
#   7. Refus pour non-admin (403 attendu).
# ════════════════════════════════════════════════════════════════════

set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  echo "✗ jq non installé. Voir le pré-requis en tête de script." >&2
  exit 1
fi

if [ "$#" -ne 6 ]; then
  echo "Usage: $0 <SB_URL> <ANON_KEY> <ADMIN_EMAIL> <ADMIN_PWD> <USER_EMAIL> <USER_PWD>" >&2
  exit 1
fi

SB_URL="$1"
ANON="$2"
ADMIN_EMAIL="$3"
ADMIN_PWD="$4"
USER_EMAIL="$5"
USER_PWD="$6"

FN_URL="$SB_URL/functions/v1/kyc-review"

echo "── 1) Health"
curl -s "$FN_URL/health" -H "apikey: $ANON"
echo ""

login() {
  local email="$1" pwd="$2"
  curl -s -X POST "$SB_URL/auth/v1/token?grant_type=password" \
       -H "apikey: $ANON" -H "Content-Type: application/json" \
       -d "{\"email\":\"$email\",\"password\":\"$pwd\"}" \
    | jq -r '.access_token // empty'
}

echo "── 2) Login admin & user"
ADMIN_JWT=$(login "$ADMIN_EMAIL" "$ADMIN_PWD")
USER_JWT=$(login  "$USER_EMAIL"  "$USER_PWD")
[ -z "$ADMIN_JWT" ] && { echo "Login admin KO" >&2; exit 1; }
[ -z "$USER_JWT" ]  && { echo "Login user KO"  >&2; exit 1; }

# Décode le payload JWT (entre les 2 points) pour extraire le sub.
# `tr` corrige le base64-url → base64 standard, `jq` parse.
decode_sub() {
  local jwt="$1"
  echo "$jwt" | awk -F. '{print $2}' \
    | tr '_-' '/+' \
    | base64 -d 2>/dev/null \
    | jq -r '.sub'
}
USER_ID=$(decode_sub "$USER_JWT")
echo "admin OK, user_id=$USER_ID"

echo "── 3) User upload un faux KYC + insert kyc_documents"
# 1x1 px PNG transparent (le plus petit valide) — content-type du bucket
# vérifie juste le mime, pas le contenu.
PNG_HEX="89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000D4944415478DA63606001000000050001AA1A8A4D0000000049454E44AE426082"
PNG_PATH="$USER_ID/test_id_card.png"
PNG_TMP="/tmp/byer-kyc-test.png"
echo "$PNG_HEX" | xxd -r -p > "$PNG_TMP"

# Upload via Storage REST
curl -s -X POST "$SB_URL/storage/v1/object/kyc-documents/$PNG_PATH" \
     -H "Authorization: Bearer $USER_JWT" \
     -H "apikey: $ANON" \
     -H "Content-Type: image/png" \
     --data-binary "@$PNG_TMP" > /dev/null

# Insert KYC row : on parse le 1er élément du tableau retourné
DOC_ID=$(curl -s -X POST "$SB_URL/rest/v1/kyc_documents?select=id" \
              -H "apikey: $ANON" -H "Authorization: Bearer $USER_JWT" \
              -H "Content-Type: application/json" -H "Prefer: return=representation" \
              -d "{\"user_id\":\"$USER_ID\",\"doc_type\":\"id_card\",\"file_path\":\"$PNG_PATH\"}" \
        | jq -r '.[0].id')
[ -z "$DOC_ID" ] || [ "$DOC_ID" = "null" ] && { echo "Insert KYC KO" >&2; exit 1; }
echo "doc_id=$DOC_ID"

echo "── 4) Admin list-pending"
curl -s -X POST "$FN_URL/list-pending" \
     -H "apikey: $ANON" \
     -H "Authorization: Bearer $ADMIN_JWT" \
     -H "Content-Type: application/json" | jq '.count, .items[0] | {id, doc_type, file_path}'
echo ""

echo "── 5) Admin approve"
curl -s -X POST "$FN_URL/review" \
     -H "apikey: $ANON" \
     -H "Authorization: Bearer $ADMIN_JWT" \
     -H "Content-Type: application/json" \
     -d "{\"doc_id\":\"$DOC_ID\",\"action\":\"approve\"}"
echo ""

echo "── 6) Vérif DB : status + identity_verified + notification"
echo "  • kyc_documents :"
curl -s "$SB_URL/rest/v1/kyc_documents?id=eq.$DOC_ID&select=status,reviewed_at,reviewed_by" \
     -H "apikey: $ANON" -H "Authorization: Bearer $ADMIN_JWT"
echo ""
echo "  • profiles :"
curl -s "$SB_URL/rest/v1/profiles?id=eq.$USER_ID&select=identity_verified" \
     -H "apikey: $ANON" -H "Authorization: Bearer $USER_JWT"
echo ""
echo "  • notifications :"
curl -s "$SB_URL/rest/v1/notifications?ref_id=eq.$DOC_ID&select=type,title,body" \
     -H "apikey: $ANON" -H "Authorization: Bearer $USER_JWT"
echo ""

echo "── 7) Anti-double-review (409 attendu)"
curl -s -w "\nhttp=%{http_code}\n" -X POST "$FN_URL/review" \
     -H "apikey: $ANON" \
     -H "Authorization: Bearer $ADMIN_JWT" \
     -H "Content-Type: application/json" \
     -d "{\"doc_id\":\"$DOC_ID\",\"action\":\"reject\",\"reason\":\"test\"}"
echo ""

echo "── 8) Auth refusée pour non-admin (403 attendu)"
curl -s -w "\nhttp=%{http_code}\n" -X POST "$FN_URL/list-pending" \
     -H "apikey: $ANON" \
     -H "Authorization: Bearer $USER_JWT" \
     -H "Content-Type: application/json"
echo ""

echo "✅ Tests E2E terminés."
