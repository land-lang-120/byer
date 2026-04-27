#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════════
# Byer — Déploiement de l'Edge Function kyc-review
# ════════════════════════════════════════════════════════════════════
# Usage (Git Bash sur Windows ou Terminal sur macOS/Linux) :
#   cd C:/Users/Pino/Desktop/UNIVERSAL-TECH/apps/byer
#   bash scripts/deploy-edge-functions.sh
#
# Pré-requis :
#   • Le binaire Supabase CLI est dans .bin/supabase.exe (téléchargé par Claude)
#   • La migration 0011_kyc_unique_partial.sql a été appliquée sur la base prod
# ════════════════════════════════════════════════════════════════════

set -euo pipefail

PROJECT_REF="xwqnsovfakzraafiudek"
ADMIN_EMAIL="pinolando120@gmail.com"
SB_BIN="./.bin/supabase.exe"

if [ ! -x "$SB_BIN" ]; then
  echo "✗ Binaire Supabase CLI introuvable à $SB_BIN" >&2
  echo "  Relance d'abord la phase d'installation par Claude." >&2
  exit 1
fi

echo "──────────────────────────────────────────────────"
echo "  1/4  Login (un onglet va s'ouvrir dans ton navigateur)"
echo "──────────────────────────────────────────────────"
"$SB_BIN" login

echo ""
echo "──────────────────────────────────────────────────"
echo "  2/4  Link au projet $PROJECT_REF"
echo "──────────────────────────────────────────────────"
# --yes accepte les prompts interactifs (fait écho à un mot de passe DB que
# Supabase peut demander pour le first link — on n'en a pas besoin pour les
# Edge Functions, donc on saute en passant une valeur vide via env).
SUPABASE_DB_PASSWORD="" "$SB_BIN" link --project-ref "$PROJECT_REF" || true

echo ""
echo "──────────────────────────────────────────────────"
echo "  3/4  Set secret ADMIN_EMAILS=$ADMIN_EMAIL"
echo "──────────────────────────────────────────────────"
"$SB_BIN" secrets set "ADMIN_EMAILS=$ADMIN_EMAIL"

echo ""
echo "──────────────────────────────────────────────────"
echo "  4/4  Deploy de la fonction kyc-review"
echo "──────────────────────────────────────────────────"
"$SB_BIN" functions deploy kyc-review

echo ""
echo "✅ Déploiement terminé."
echo ""
echo "Test rapide :"
echo "  curl https://$PROJECT_REF.supabase.co/functions/v1/kyc-review/health \\"
echo "       -H \"apikey: <ANON_KEY>\""
echo ""
echo "  Réponse attendue : { \"ok\": true, \"fn\": \"kyc-review\", \"admin_count\": 1 }"
