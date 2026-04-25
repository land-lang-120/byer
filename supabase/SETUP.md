# Byer — Setup Supabase (guide pas-à-pas pour Pino)

> Tout est prêt côté code. Il te reste **3 actions manuelles** dans le dashboard Supabase, puis 1 collage dans `js/config.js`.

---

## 1️⃣ Créer ton projet Supabase (5 min, gratuit)

1. Va sur **https://supabase.com** → bouton vert **"Start your project"**
2. Connecte-toi avec **GitHub** ou **Google** (utilise ton compte `pinolando120@gmail.com`)
3. Clique **"New project"** dans le dashboard
4. Remplis :
   - **Name** : `byer-prod`
   - **Database Password** : génère un mot de passe fort avec le bouton 🎲 et **garde-le précieusement** (Bitwarden, Notes, etc.)
   - **Region** : `West EU (Ireland)` ou `Europe Central (Frankfurt)` — au plus proche du Cameroun
   - **Pricing Plan** : `Free` (largement suffisant pour commencer)
5. Clique **"Create new project"** → attends ~2 minutes le provisioning

---

## 2️⃣ Exécuter les 7 migrations SQL

Dès que le projet est prêt :

1. Dans la barre latérale gauche, clique **"SQL Editor"** (icône `</>`)
2. Clique **"New query"** (en haut à droite)
3. **Migration 1** : ouvre le fichier `supabase/migrations/0001_initial_schema.sql` sur ton ordinateur, copie tout son contenu, colle-le dans l'éditeur, clique **"Run"** (en bas à droite)
   - ✅ Tu dois voir `Success. No rows returned`
4. **Migration 2** : nouveau **"New query"** → colle `0002_rls_policies.sql` → **Run**
   - ✅ `Success. No rows returned`
5. **Migration 3** : nouveau **"New query"** → colle `0003_storage_and_seed.sql` → **Run**
   - ✅ `Success. No rows returned`
6. **Migration 4** : nouveau **"New query"** → colle `0004_auth_extensions.sql` → **Run**
   - ✅ `Success. No rows returned`
   - 🔐 Cette migration ajoute : champs first_name/last_name/bio, vérifications (email/phone/identité), 2FA, langue, préférences notifications, table `kyc_documents` (pièces d'identité), table `trusted_devices` (appareils de confiance), bucket privé `kyc-documents`, fonctions RPC `check_referral_code`, `apply_referral_code`, `delete_my_account_request`.
7. **Migration 5** : nouveau **"New query"** → colle `0005_listings_optimizations.sql` → **Run**
   - ✅ `Success. No rows returned`
   - 🏠 Cette migration ajoute : colonnes `general_amenities`, `child_entities` (jsonb compo Bâtiment), `house_rules`, `custom_rules` sur `listings`, colonne `tag` sur `listing_photos`, contraintes métier (prix ≥ 0, lat/lng valides, subtype enum strict), full-text search pondéré (titre>ville>description), index GIN sur amenities + house_rules + child_entities, index spatial pour proximité, triggers auto `rating_avg`/`review_count`/`is_superhost`, RPC `search_listings`, `nearby_listings`, `toggle_listing_active`.
8. **Migration 6** : nouveau **"New query"** → colle `0006_bookings_optimizations.sql` → **Run**
   - ✅ `Success. No rows returned`
   - 🛏️ Cette migration ajoute : extension `btree_gist`, **contrainte EXCLUDE qui empêche les doubles réservations** sur la même annonce aux dates qui se chevauchent, décomposition prix (`price_base`/`service`/`dossier`/`taxes`/`caution`), `rental_mode` (night/day/week/month), QR token UUID inviolable + `qr_validated_at`, politique d'annulation (flexible/moderate/strict) + remboursement auto, payout host (commission, montant net), audit paiement (téléphone MoMo/OM, ref transaction), RPC `is_listing_available`, `get_blocked_dates`, `cancel_booking`, `verify_booking_qr`, `validate_arrival`, `auto_complete_bookings`, triggers notifications auto guest/host.
9. **Migration 7** : nouveau **"New query"** → colle `0007_reviews_rewards_notifications.sql` → **Run**
   - ✅ `Success. No rows returned`
   - ⭐ Cette migration finalise les 4 modules transverses : **REVIEWS** alignées sur les 8 critères de l'UI (proprete, confort, accessibilite, convivialite, emplacement, securite, equipement, qualite_prix) + auto-moyenne + validation que seul le guest d'un booking `completed` peut noter ; **RÉCOMPENSES** avec table `rewards_catalog` (6 récompenses seedées) + RPC atomique `redeem_reward` (vérif points + tier + débit + création coupon) + RPC `apply_coupon` ; **ANTI-TRICHE** verrou RLS sur `profiles.rewards_points` (impossible à modifier directement, doit passer par RPC) ; **POINTS AUTO** trigger qui crédite +2 pts au guest et +5 pts au host à chaque booking `completed` (idempotent) ; **NOTIFICATIONS** triggers auto sur nouvelle review, réponse host, nouveau message ; **CHAT** RPC `mark_conversation_read`, `block_conversation`, `unblock_conversation`, `get_unread_count` ; trigger `enforce_message_not_blocked` ; utilitaire `cleanup_expired_coupons` pour pg_cron.

> Si une migration échoue : copie-colle le message d'erreur dans le chat et je te corrige ça en 30 secondes.

---

## 3️⃣ Récupérer tes clés API

1. Dans la barre latérale, clique **⚙️ Project Settings** (en bas à gauche)
2. Sous-menu **"API"**
3. Repère ces 2 valeurs **et copie-les** :

   | Champ | Exemple |
   |---|---|
   | **Project URL** | `https://abcdefghijklm.supabase.co` |
   | **anon public** (sous "Project API keys") | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (long token JWT) |

   ⚠️ **NE PARTAGE JAMAIS** la clé **`service_role`** (elle bypass toute la sécurité). Seule la clé **`anon`** doit être dans le frontend.

---

## 4️⃣ Coller les clés dans le code

Envoie-moi simplement les 2 valeurs en chat, **ou** ouvre toi-même `js/config.js` et remplace lignes 13-14 :

```js
const SUPABASE_URL      = "https://TON-ID.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIs...";
```

Puis lance dans un terminal :
```bash
cd "C:/Users/Pino/Desktop/UNIVERSAL-TECH/apps/byer"
node build.js
```

---

## 5️⃣ Activer les fournisseurs d'auth (au choix)

Dans le dashboard → **Authentication** → **Providers** :

| Provider | Quand l'activer | Setup |
|---|---|---|
| **Email** | ✅ Déjà activé par défaut | Rien à faire |
| **Phone (SMS)** | Pour OTP par SMS | Twilio account requis (~$0.05/SMS) |
| **Google** | Login en 1 clic | Crée OAuth credentials sur Google Cloud Console |
| **Apple** | Pour iOS | Apple Developer Account requis ($99/an) |
| **Facebook** | Login Facebook | Crée une app sur developers.facebook.com |

> Pour démarrer, l'**Email** suffit. On ajoutera les autres au fur et à mesure.

---

## ✅ Vérification finale

Après avoir collé tes clés et rebuild, ouvre la console navigateur sur l'app. Tu dois voir :

```
[byer] ✅ Supabase client prêt — connecté à https://TON-ID.supabase.co
```

Au lieu de :
```
[byer] Clés Supabase non configurées dans config.js — mode mock activé
```

---

## 📊 Limites du plan gratuit (Free Tier)

- **Database** : 500 Mo (assez pour ~50 000 listings + 1M messages)
- **Storage** : 1 Go (~2 000 photos en HD)
- **Auth** : 50 000 utilisateurs actifs/mois
- **Bandwidth** : 5 Go/mois sortant
- **Edge Functions** : 500K invocations/mois
- **Realtime** : 200 connexions simultanées + 2M messages/mois

Si Byer dépasse ça, le plan **Pro** est à **$25/mois** (8 Go DB, 100 Go storage, 100K MAU).

---

## 🛟 En cas de problème

- Copie-colle l'erreur exacte dans le chat → je te debug ça
- Pour réinitialiser la BDD : **Project Settings → Database → Reset database**
- Pour relire les logs : **Logs Explorer** dans la barre latérale
