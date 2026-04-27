# Edge Function — `kyc-review`

Permet à un admin de visualiser et de valider les pièces KYC soumises par les
utilisateurs (CNI, passeport, permis, selfie). Stockées dans le bucket privé
`kyc-documents`, elles ne sont accessibles qu'à leur propriétaire et à cette
fonction (qui utilise la `service_role` key).

---

## Routes

| Méthode | Chemin                                            | Auth        | Description                                        |
|---------|---------------------------------------------------|-------------|----------------------------------------------------|
| GET     | `/functions/v1/kyc-review/health`                | header `apikey` (anon) | Liveness check (renvoie aussi le nb d'admins). |
| POST    | `/functions/v1/kyc-review/list-pending`          | `apikey` + Bearer JWT admin | Liste les KYC `pending` avec une signed URL 5 min. |
| POST    | `/functions/v1/kyc-review/review`                | `apikey` + Bearer JWT admin | Approuve ou rejette un document.                   |

> **Note** : le header `apikey: <SUPABASE_ANON_KEY>` est requis par le gateway
> Edge Functions de Supabase, **en plus** du Bearer JWT. Sans lui, toutes les
> requêtes sont rejetées avec 401 avant même d'entrer dans le code de la
> fonction.

Body de `/review` :
```json
{ "doc_id": "uuid", "action": "approve" }
```
ou
```json
{ "doc_id": "uuid", "action": "reject", "reason": "Photo floue, recommencer" }
```

---

## Déploiement (1ère fois)

Pré-requis :
- **Supabase CLI** installé. Sur Windows : `npm i -g supabase` ou
  `scoop install supabase` ; sur macOS : `brew install supabase/tap/supabase`.
- **Migration `0011_kyc_unique_partial.sql` appliquée** sur la base prod
  (sinon les re-soumissions KYC échoueront avec une violation de contrainte
  unique). Voir [supabase/migrations/0011_kyc_unique_partial.sql](../../migrations/0011_kyc_unique_partial.sql).

```bash
# Se placer à la racine du projet Byer
cd C:/Users/Pino/Desktop/UNIVERSAL-TECH/apps/byer

# Login (ouvre le navigateur)
supabase login

# Lier le projet local à xwqnsovfakzraafiudek (one-shot)
supabase link --project-ref xwqnsovfakzraafiudek

# Définir la liste des admins (csv d'emails) — VARIABLE OBLIGATOIRE
# ⚠️ Sur Windows PowerShell : utiliser des guillemets simples ou bash
# (`supabase secrets set ADMIN_EMAILS='pinolando120@gmail.com'`).
supabase secrets set ADMIN_EMAILS=pinolando120@gmail.com

# Déployer la fonction
supabase functions deploy kyc-review
```

Les secrets `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
sont **auto-injectés** par Supabase — pas besoin de les configurer.

---

## Test rapide après déploiement

```bash
# 1. Health
curl https://xwqnsovfakzraafiudek.supabase.co/functions/v1/kyc-review/health \
     -H "apikey: <ANON_KEY>"
# → { "ok": true, "fn": "kyc-review", "admin_count": 1 }

# 2. List pending (en tant qu'admin)
curl -X POST https://xwqnsovfakzraafiudek.supabase.co/functions/v1/kyc-review/list-pending \
     -H "Authorization: Bearer <ADMIN_JWT>" \
     -H "Content-Type: application/json"
# → { "items": [...], "count": N }

# 3. Approuver
curl -X POST https://xwqnsovfakzraafiudek.supabase.co/functions/v1/kyc-review/review \
     -H "Authorization: Bearer <ADMIN_JWT>" \
     -H "Content-Type: application/json" \
     -d '{"doc_id":"<uuid>","action":"approve"}'

# 4. Rejeter
curl -X POST https://xwqnsovfakzraafiudek.supabase.co/functions/v1/kyc-review/review \
     -H "Authorization: Bearer <ADMIN_JWT>" \
     -H "Content-Type: application/json" \
     -d '{"doc_id":"<uuid>","action":"reject","reason":"Photo floue"}'
```

Voir [test-kyc-review.sh](test-kyc-review.sh) pour un test E2E complet.

---

## Codes d'erreur

| HTTP | Corps                                       | Cause                                       |
|------|---------------------------------------------|---------------------------------------------|
| 401  | `Missing Authorization header`              | Pas de Bearer JWT.                          |
| 401  | `Invalid or expired token`                  | JWT incorrect / expiré.                     |
| 403  | `Not an admin`                              | Email du caller absent de `ADMIN_EMAILS`.   |
| 400  | `Missing doc_id` / `action must be ...`     | Payload invalide.                           |
| 404  | `Document not found`                        | UUID inconnu.                               |
| 409  | `Already reviewed (status=approved)`        | Doc déjà approuvé/rejeté (anti double-clic).|
| 500  | autre                                       | Voir logs `supabase functions logs kyc-review`. |

---

## Effet de bord côté DB

Après un `approve` réussi :
1. `kyc_documents.status = 'approved'`, `reviewed_at`, `reviewed_by` renseignés.
2. Le trigger `sync_kyc_to_profile` (mig.0004) bascule
   `profiles.identity_verified = true` automatiquement.
3. Une `notification` (type `system`) est créée pour l'utilisateur.

Après un `reject` :
1. `kyc_documents.status = 'rejected'`, `reject_reason` renseigné.
2. `profiles.identity_verified` reste à sa valeur précédente
   (le trigger n'agit que sur `approved`).
3. Une `notification` est créée pour l'utilisateur avec le motif.

---

## Logs en production

```bash
supabase functions logs kyc-review --tail
```

Erreurs typiques à surveiller :
- `kyc-review: ADMIN_EMAILS is empty` → secret oublié, **toutes les requêtes échouent en 403**.
- `notification insert failed` → table notifications cassée mais la review passe quand même.
