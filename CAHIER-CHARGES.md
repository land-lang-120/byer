# 📖 Byer — Cahier de charges

> Marketplace de location immobilier + véhicules au Cameroun
> Version : **3.0** — 2026-04-25 (backend Supabase 100 % câblé)
> URL prod : https://byer.landonjouajosephpino.workers.dev
> Backend : Supabase `xwqnsovfakzraafiudek` (région eu-west-1) — **9 migrations appliquées, 18 RPCs en service**
> Voir aussi : [PROGRESS.md](PROGRESS.md) (suivi du dev) · [supabase/SETUP.md](supabase/SETUP.md) (procédure migrations)

---

## 1. Vision

Permettre à n'importe qui au Cameroun de **trouver un logement ou un véhicule à louer** (à la nuitée ou au mois) en quelques taps, et payer via les moyens locaux (MTN MoMo, Orange Money, Express Union, virement). Côté propriétaire, mettre un bien en location est aussi simple, et la vérification d'arrivée se fait par scan de QR.

Inspiration : Airbnb pour la fluidité, Bolt/Yango pour les véhicules, Jumia House pour le contexte camerounais.

## 2. Personas & rôles

### 2.1 Locataire (= invité)
- Cherche un bien dans une ville (Douala, Yaoundé, Kribi, etc.)
- Filtre par type, durée, prix, note minimum, équipements, superhost
- Réserve avec son moyen de paiement préféré
- À l'arrivée, montre son QR de réservation au propriétaire
- Système de récompenses : points par parrainage + booking → coupons

### 2.2 Propriétaire (= bailleur)
- Met un bien en location (wizard `PublishScreen` — 6 étapes)
- Reçoit les demandes de réservation
- Scanne le QR du locataire pour valider l'entrée des lieux (`QRScannerOverlay`)
- Reçoit les paiements (loyer mensuel ou nuitée)
- Gère la communication via Messages
- Gère ses biens depuis le **Dashboard bailleur** (vue globale, par type, par bâtiment)
- Boost ses annonces (mise en avant payante)
- Réseau de techniciens et professionnels (entretien)

### 2.3 Cas non-MVP (V2)
- Agent immobilier (gère plusieurs propriétaires)
- Convoyeur véhicule (livraison à domicile)
- Modérateur (vérification annonces)

## 3. Périmètre fonctionnel

### 3.1 Catégories de biens
- **Immobilier** : Maison/Villa, Appartement, Studio, Hôtel, Motel, Auberge, Chambre meublée
- **Véhicules** : SUV, Berline, Citadine, Utilitaire, Moto

### 3.2 Modes de location
- **À la nuitée** (court terme, type Airbnb) — affiche `nightPrice`
- **Au mois** (long terme, bail mensuel) — affiche `monthPrice`
- Un bien peut proposer les deux ou un seul mode

### 3.3 Système de notation (8 critères pondérés — alignés DB)

| Critère (UI)            | Clé UI         | Colonne DB              | Poids | Icône |
|-------------------------|----------------|--------------------------|-------|-------|
| Propreté                | `proprete`     | `rating_proprete`        | 15 %  | 🧹    |
| Confort                 | `confort`      | `rating_confort`         | 15 %  | 🛋️   |
| Emplacement             | `emplacement`  | `rating_emplacement`     | 15 %  | 📍    |
| Convivialité            | `convivialite` | `rating_convivialite`    | 12 %  | 💬    |
| Sécurité                | `securite`     | `rating_securite`        | 11 %  | 🔒    |
| Accessibilité           | `accessibilite`| `rating_accessibilite`   | 10 %  | 🚪    |
| Équipement              | `equipement`   | `rating_equipement`      | 10 %  | 📦    |
| Rapport qualité / prix  | `qualitePrix`  | `rating_qualite_prix`    | 12 %  | 💰    |

Note finale = moyenne arithmétique des 8 critères, calculée **côté serveur** par le trigger `compute_review_rating` (migration 0007). Le trigger `update_listing_rating_and_count` agrège ensuite `rating_avg` et `review_count` sur la fiche listing à chaque review.

> Le mapping clé UI → colonne DB vit dans `js/config.js` (`RATING_KEY_TO_DB`). Toute évolution doit être répliquée des deux côtés.

**Avis séparés par catégorie** (depuis v43) : 3 segments distincts dans l'écran « Mes avis reçus » :
- 🏠 Immobilier
- 🚗 Véhicules
- 🔧 Techniciens

### 3.4 Recherche & filtres
- Par ville (12 villes camerounaises + filtre national « Cameroun »)
- Par type (Villa / Appart / Studio / SUV / etc.)
- Par durée (nuitée / mois)
- Par note minimum (0 à 5 étoiles)
- Par prix max
- Par capacité (nombre de personnes / sièges)
- Par équipements multi-select
- Superhost only (toggle)
- Réservation instantanée (toggle)
- Recherche texte libre (titre + ville)
- Favoris (heart toggle, persisté localStorage + Supabase à venir)

### 3.5 Wizard de publication d'annonce (6 étapes)
1. **Type** (logement / véhicule + sous-catégorie ; sauté si arrivé depuis Dashboard avec segment pré-sélectionné)
2. **Infos** (titre, ville, zone, description, composition par entités-filles : chambres / sdb / cuisine, équipements globaux + par instance)
3. **Prix** (nuitée + mensuel FCFA, équipements véhicule)
4. **Photos** (3 minimum, max = somme des slots prédéfinis selon composition ; auto-tag picker à l'upload depuis v42 ; numérotation auto par type ex. "Chambre 1, Chambre 2"; cap par slots prédéfinis depuis v44 ; bouton × pour annuler le wizard à toutes les étapes depuis v45)
5. **Règlement** (règles pré-définies par type + jusqu'à 10 règles personnalisées, ajouté en v41)
6. **Récap** + bouton **Publier l'annonce ✓**

### 3.6 Paiement
- 4 méthodes :
  - MTN Mobile Money (instantané)
  - Orange Money (instantané)
  - Express Union (en agence physique)
  - Virement bancaire classique
- Décomposition prix stockée côté DB : `price_base`, `price_service`, `price_dossier`, `price_taxes`, `price_caution` (migration 0006)
- Audit paiement : `payment_phone` (numéro MoMo/OM utilisé), `ref` (référence transaction), `paid_at`
- **Anti double-réservation** : contrainte EXCLUDE Postgres + `btree_gist` qui bloque toute insertion `(listing_id, daterange checkin/checkout)` en chevauchement avec une autre confirmée — code erreur SQL `23P01` capturé côté frontend pour message clair
- Confirmation instantanée après paiement (RPC `is_listing_available` en pré-flight)
- **Politique d'annulation** : `cancellation_policy` (`flexible`/`moderate`/`strict`) + RPC `cancel_booking` qui calcule automatiquement le pourcentage de remboursement selon la date d'annulation
- **Payout host** : `host_commission_rate` + `host_payout_amount` (montant net après commission Byer) générés au moment du paiement
- Reçu PDF (V2)

### 3.7 Vérification d'entrée
- Locataire reçoit un QR contenant son **token UUID inviolable** (`qr_token`, généré côté DB) — affiché en sus du `BYR-XXXXXX` lisible
- Propriétaire scanne le QR via `QRScannerOverlay`
- Sheet de vérification (`GuestVerificationSheet`) :
  - Si le code est un UUID → appel RPC `verify_booking_qr` qui retourne `{guest_name, guest_photo, listing_title, checkin, checkout, total_price, payment_status, qr_validated_at}` + warnings éventuels (paiement non reçu, statut invalide…)
  - Sinon (codes démo `BYR-XXXX`) → fallback sur le mock `QR_GUESTS` pour la démo
- Validation : RPC `validate_arrival(qr_token)` — idempotent (renvoie `false` si déjà validé), bascule `status = active` + `qr_validated_at = now()` + crédit auto en cascade
- Rejet : reste `confirmed`, pas de mutation
- Hotfix `0009` : la fonction utilisait un pattern PL/pgSQL illégal (`select b.*, l.owner_id into v_b, v_owner` mélange record + scalaire), corrigé en deux requêtes séparées

### 3.8 Messagerie
- Conversations entre locataire ↔ propriétaire (1-1, ancrée à un listing optionnel)
- Chat plein écran (UX immersive sans nav bar)
- Messages avec `read_at` (accusé de lecture) + RPC `mark_conversation_read` automatique à l'ouverture du chat
- Compteur **non-lus par conversation** (badge sur chaque ligne) + total via RPC `get_unread_count`
- Aperçu du dernier message (`last_message_preview`) stocké côté DB et mis à jour par trigger
- Blocage : RPC `block_conversation` / `unblock_conversation` (avec distinction « j'ai bloqué » vs « j'ai été bloqué »)
- Trigger `enforce_message_not_blocked` : interdit l'insertion de messages dans une conversation bloquée
- Realtime : subscription Supabase `postgres_changes` pour l'arrivée live des messages

### 3.9 Système de récompenses
- Points cumulables : parrainage (+10 parrain / +25 filleul), **booking complété auto +2 guest et +5 host** (trigger `award_booking_points`), bonus signup
- Tiers automatiques (generated column `tier`) : Bronze < 100 < Argent < 500 < Or
- **Catalogue de récompenses** : table `rewards_catalog` (6 récompenses seedées : -10 % loyer, boost annonce 7j, etc.) avec `points_cost`, `min_tier`, `value_fcfa`
- **Échange points → coupon** : RPC SECURITY DEFINER `redeem_reward(reward_id)` — atomique (vérif solde + tier + débit + insertion coupon en une seule transaction)
- **Anti-triche** : RLS column-level qui **interdit le UPDATE direct** de `profiles.rewards_points` côté frontend — toute mutation passe forcément par `redeem_reward` ou les triggers serveur
- Application coupon : RPC `apply_coupon(code)` qui valide expiration + statut + retourne la valeur applicable
- Code de parrainage personnel généré à l'inscription (basé sur le prénom + "24")
- Cleanup auto : `cleanup_expired_coupons` exécuté chaque jour à 03 h UTC via pg_cron

### 3.10 Notifications in-app
- Types : booking, message, rent, boost, review, tech, system
- Compteur non-lus dans l'icône cloche du header
- **Triggers auto** créant les notifs côté DB :
  - `notify_guest_on_booking_confirmed` (host confirme la réservation)
  - `notify_guest_on_status_change` (statut booking : confirmed → active → completed → cancelled)
  - `notify_host_on_new_booking` (réservation entrante)
  - `notify_host_on_review` (nouvelle review d'un guest)
  - `notify_guest_on_review_reply` (host répond à une review)
  - `notify_on_new_message` (chat)

## 4. Architecture technique

### 4.1 Stack actuelle (en production v45)
- **Front** : React 18 (UMD local, `lib/react.min.js` + `react-dom.min.js`) — pas de CDN, fonctionne hors-ligne
- **Build** : `build.js` Node — Babel CLI pré-transpile `js/*.js` en `bundle.js` (~935 KB pur ES5+, plus de Babel à l'exécution)
- **Style** : `css/global.css` (reset + animations + dark mode via filter invert) + string `BYER_CSS` injectée
- **PWA** : `manifest.json` + `sw.js` v44 (cache offline, network-first HTML/JS/CSS, cache-first libs)
- **i18n** : système maison `byerI18n` (FR/EN, langue persistée)
- **Données démo** : mock dans `js/data.js` (PROPERTIES + VEHICLES) — fallback quand Supabase vide

### 4.2 Stack backend (en production)
- **Backend** : **Supabase** `xwqnsovfakzraafiudek` (région AWS eu-west-1, Free tier)
  - **Auth** : email/password + phone OTP + OAuth (Google, Apple, Facebook prêts à activer)
  - **Postgres 15** : **14 tables**, extensions `citext`, `uuid-ossp`, `pgcrypto`, `btree_gist`, `pg_cron`, generated columns, RLS row + column-level, full-text search pondéré
  - **Storage** : 3 buckets (`listing-photos` public, `avatars` public, `kyc-documents` privé)
  - **Edge Functions** (à déployer) : `delete-account`, `send-otp-sms`, `kyc-review`, `momo-webhook`, `om-webhook`
  - **Realtime** : prêt pour chat live (channels par conversation)
  - **pg_cron** : 2 jobs actifs — `auto-complete-bookings` (toutes les heures) + `cleanup-expired-coupons` (3 h UTC quotidien). Vue `cron_jobs_status` pour monitoring
- **Wrapper client** : `js/supabase-client.js` expose `window.byer.db` avec **13 sous-modules** : `auth`, `profiles`, `kyc`, `devices`, `listings`, `photos`, `bookings`, `chat`, `reviews`, `notifications`, `rewards`, `counters`, `storage`
- **Mode dégradé** : si `SUPABASE_READY = false` ou erreur réseau, fallback sur les mocks (`PROPERTIES`/`VEHICLES`/`BOOKINGS`) — chaque module possède un stub offline équivalent

### 4.3 Modèle de données — Postgres / Supabase

**14 tables** organisées en 4 modules. Chaque champ ajouté en cours de route est annoté avec la migration qui l'a introduit (`mig.0005`, `mig.0006`, etc.).

#### Module Auth (migrations 0001 + 0004)
```
profiles (extension de auth.users)
  id (FK auth.users), name, first_name, last_name, email (citext, unique),
  phone, photo_url, avatar_letter, avatar_bg, city, role,
  bio (≤200 chars), member_since, referral_code (unique),
  rewards_points (≥0)              ← lock RLS column-level (mig.0007)
  referral_count (≥0),
  tier (generated: bronze/argent/or selon points),
  email_verified, phone_verified, identity_verified,
  two_factor_enabled, auth_provider (email/phone/google/apple/facebook),
  last_login_at, preferred_language (fr/en),
  notification_prefs (jsonb : push/email/sms/marketing/bookings/messages/...),
  created_at, updated_at

kyc_documents (pièces d'identité — workflow pending → approved)  [mig.0004]
  id, user_id, doc_type (id_card/passport/driver_license/selfie),
  file_path (chemin dans bucket kyc-documents),
  status, reject_reason, submitted_at, reviewed_at, reviewed_by

trusted_devices (sessions multi-appareils)  [mig.0004]
  id, user_id, device_hash, device_label, platform, ip_inet,
  user_agent, last_seen_at, created_at

referrals (parrainage)
  id, referrer_id, referred_id (unique), code_used, created_at
```

#### Module Listings (migrations 0001 + 0005)
```
listings (logements + véhicules dans la même table)
  id, owner_id, type (property/vehicle), subtype, title, description,
  city, zone, address, lat, lng,
  price_night, price_month,        ← contraintes ≥ 0 (mig.0005)
  bedrooms, bathrooms, max_guests,
  brand, model, year, fuel, transmission,
  amenities (text[]),
  general_amenities (text[])       ← équipements globaux (mig.0005)
  child_entities (jsonb)           ← compo Bâtiment : chambres/sdb/cuisine (mig.0005)
  house_rules (text[])             ← règles pré-définies (mig.0005)
  custom_rules (text[])            ← jusqu'à 10 règles persos (mig.0005)
  rating_avg, review_count,        ← maj auto par trigger (mig.0005)
  is_superhost,                    ← maj auto par trigger (mig.0005)
  is_active,
  search_vector (tsvector generated),  ← full-text pondéré titre>ville>desc (mig.0005)
  created_at, updated_at

listing_photos
  id, listing_id, url, position,
  tag (text)                       ← Chambre 1 / Salon / Façade etc. (mig.0005)
  created_at
```

#### Module Bookings + Chat (migrations 0001 + 0006 + 0009)
```
bookings
  id, ref (BYR-XXXXXX, unique), guest_id, host_id, listing_id,
  checkin, checkout, nights (generated), guests_count,
  rental_mode (night/day/week/month)         ← (mig.0006)
  price_base, price_service, price_dossier,  ← décomposition (mig.0006)
  price_taxes, price_caution,
  total_price,
  host_commission_rate, host_payout_amount,  ← payout host (mig.0006)
  payment_method, payment_status, payment_phone, paid_at, ref_payment,
  cancellation_policy (flexible/moderate/strict),  ← (mig.0006)
  refund_amount, cancelled_at,
  qr_token (uuid unique),                     ← QR inviolable (mig.0006)
  qr_validated_at, qr_validated_by,
  status (pending/confirmed/active/completed/cancelled),
  cancel_reason, created_at, updated_at

  EXCLUDE USING gist (
    listing_id WITH =,
    daterange(checkin, checkout) WITH &&
  ) WHERE status IN ('confirmed','active')   ← anti double-booking (mig.0006)

conversations
  id, guest_id, host_id, listing_id, blocked_by,
  last_message_at,
  last_message_preview (text)               ← cache 60 chars (mig.0007)
  created_at
  unique(guest_id, host_id, listing_id)

messages
  id, conversation_id, sender_id, body, read_at, created_at
```

#### Module Reviews + Récompenses + Notifications (migrations 0001 + 0007)
```
reviews (avis multi-critères 8 dimensions, refait en mig.0007)
  id, booking_id, listing_id, author_id, rating (auto-calc trigger),
  rating_proprete, rating_confort, rating_emplacement, rating_convivialite,
  rating_accessibilite, rating_securite, rating_equipement, rating_qualite_prix,
  body,
  host_response, host_response_at,          ← renommé de reply (mig.0007)
  created_at
  unique(booking_id, author_id)

points_transactions
  id, user_id, delta, reason (referral/booking/redeem/signup_promo/booking_complete),
  ref_id, created_at

rewards_catalog (NOUVEAU mig.0007 — 6 récompenses seedées)
  id, code (unique), label, description,
  points_cost, value_fcfa,
  type (discount/boost/paywall),
  min_tier (bronze/argent/or),
  validity_days, is_active

coupons
  id, user_id, reward_id (FK rewards_catalog), code (unique), label,
  type, value_fcfa, status (active/used/expired),
  used_at, expires_at, created_at

notifications
  id, user_id, type (booking/message/rent/boost/review/tech/system),
  title, body, ref_id, is_read, created_at
```

### 4.4 Triggers automatiques

**Auth & Profil** (mig.0001 + 0004)
- `handle_new_auth_user` (after insert auth.users) → crée la ligne profile, splitte first/last, détecte le provider OAuth, récupère avatar_url des metadata Google/Apple
- `generate_referral_code` (before insert profiles) → code basé sur le prénom + "24"
- `touch_updated_at` (before update) → bump updated_at sur profiles/listings/bookings/reviews
- `sync_auth_status_to_profile` (after update auth.users) → miroite `email_confirmed_at` → `email_verified`, idem phone et `last_sign_in_at`
- `sync_kyc_to_profile` (after insert/update kyc_documents) → bascule `profiles.identity_verified` quand un KYC passe à `approved`

**Listings** (mig.0005)
- `update_listing_search_vector` (before insert/update) → recalcule `search_vector` (titre×A, ville×B, desc×C)
- `update_listing_rating_and_count` (after insert/update/delete reviews) → recalcule `rating_avg` + `review_count`
- `update_superhost_status` (after update profiles) → bascule `is_superhost` si rating_avg ≥ 4.7 ET review_count ≥ 10

**Bookings** (mig.0006)
- `compute_booking_payout` (before insert/update) → calcule `host_payout_amount = total_price × (1 - commission_rate)`
- `notify_host_on_new_booking` (after insert) → crée notification host
- `notify_guest_on_status_change` (after update status) → notif guest à chaque changement
- `notify_guest_on_booking_confirmed` (after update payment_status → paid) → notif + génération QR token

**Reviews & Récompenses & Chat** (mig.0007)
- `compute_review_rating` (before insert/update reviews) → moyenne arithmétique des 8 critères → colonne `rating`
- `award_booking_points` (after update booking → completed) → +2 pts guest, +5 pts host (idempotent : flag dans `points_transactions.ref_id`)
- `notify_on_new_message` (after insert messages) → notif au destinataire + maj `last_message_preview`
- `notify_host_on_review` (after insert reviews) → notif host
- `notify_guest_on_review_reply` (after update reviews → host_response renseigné) → notif guest
- `enforce_message_not_blocked` (before insert messages) → empêche d'écrire dans une conversation bloquée

### 4.5 RPC publiques (18 fonctions SECURITY DEFINER)

**Auth & Profil** (mig.0004)
- `check_referral_code(code)` → `{valid, referrer_name}` — accessible anon + authenticated
- `apply_referral_code(code)` → crédit +10 parrain / +25 filleul, idempotent
- `delete_my_account_request()` → anonymise le profil avant edge function admin (RGPD)

**Listings** (mig.0005)
- `search_listings(q, city, type_, price_max, rating_min, …)` → recherche full-text pondérée
- `nearby_listings(lat, lng, radius_km)` → tri par distance via PostGIS-like (Haversine)
- `toggle_listing_active(listing_id, is_active)` → host pause / active une annonce

**Bookings** (mig.0006 + hotfix 0009)
- `is_listing_available(listing_id, checkin, checkout)` → bool (utilise EXCLUDE)
- `get_blocked_dates(listing_id)` → array de dates indisponibles pour le calendrier
- `cancel_booking(booking_id, reason)` → calcule remboursement selon politique + maj statut
- `verify_booking_qr(qr_token)` → `{guest_name, guest_photo, listing_title, dates, payment_status, …}`
- `validate_arrival(qr_token)` → idempotent ; bool true si validé pour la 1re fois, false sinon
- `auto_complete_bookings()` → batch ; basculé en cron horaire (mig.0008)

**Reviews & Récompenses** (mig.0007)
- `redeem_reward(reward_id)` → atomique : vérif points + tier + débit + insertion coupon
- `apply_coupon(code)` → valide expiration + statut + retourne value_fcfa applicable

**Chat** (mig.0007)
- `mark_conversation_read(conv_id)` → maj `read_at` sur tous les messages reçus
- `block_conversation(conv_id)` / `unblock_conversation(conv_id)` → flag bilatéral
- `get_unread_count()` → total non-lus pour `auth.uid()`

**Maintenance** (mig.0007 + 0008)
- `cleanup_expired_coupons()` → marque expired les coupons dont `expires_at < now()` ; cron quotidien 03 h UTC

### 4.6 Sécurité — RLS Postgres
- **profiles** : lecture publique (avatar+nom des hosts visibles partout), update réservé à `id = auth.uid()`
- **profiles.rewards_points** : **column-level RLS** (mig.0007) qui interdit toute mutation directe — seule voie : RPC `redeem_reward` ou les triggers serveur (`award_booking_points`, `apply_referral_code`)
- **listings** : lecture si `is_active = true OR owner_id = auth.uid()`, écriture par `owner_id = auth.uid()`
- **listing_photos** : lecture publique, écriture par owner du listing parent
- **bookings** : lecture/écriture strictement entre `guest_id` et `host_id`
- **conversations + messages** : lecture/écriture strictement entre les 2 parties ; trigger `enforce_message_not_blocked` interdit l'insertion en conversation bloquée
- **reviews** : lecture publique, écriture par auteur **ssi un booking `completed` existe** entre author + listing (vérif côté trigger), `host_response` par owner du listing uniquement
- **points_transactions / coupons / rewards_catalog** : lecture par owner ; écriture via RPC SECURITY DEFINER uniquement
- **kyc_documents** : strictement privé (read/insert par user, delete uniquement si status=pending)
- **trusted_devices** : strictement privé (insert via edge function uniquement)
- **notifications** : chaque user voit/marque comme lues les siennes
- **Storage `kyc-documents`** : privé, signed URLs courtes (<5 min), accès par chemin = `<user_uuid>/...`
- **Storage `avatars`** : public en lecture, écriture par chemin `<user_uuid>/...`
- **Storage `listing-photos`** : public en lecture, écriture par owner du listing

### 4.7 Hébergement & Déploiement (en place depuis 2026-04-25)
- **Hébergeur** : Cloudflare Workers Static Assets — URL prod `https://byer.landonjouajosephpino.workers.dev`
- **Config** : `wrangler.toml` (`name = "byer"`, `[assets] directory = "./"`, SPA fallback `index.html`)
- **Exclusions** : `.assetsignore` retire `node_modules/`, `.git/`, `.github/`, scripts batch, `*.md`, `android-project/`, `supabase/`, `scripts/` (sinon `node_modules/workerd/bin/workerd` à 122 MiB dépasse la limite de 25 MiB de Cloudflare)
- **Auto-deploy CI/CD** : GitHub Actions (`.github/workflows/deploy.yml`) déclenché à chaque push sur `master`
  - Job : checkout → Node 20 → `npm ci` → `node build.js` (Babel transpile JSX → bundle.js) → `cloudflare/wrangler-action@v3`
  - Secrets : `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`
  - Workflow manuel via `workflow_dispatch`
- **Cache busting** : à chaque release, `bundle.js?v=N` dans `index.html` + `CACHE_NAME = 'byer-vN'` dans `sw.js` doivent être bumpés (sinon le SW garde l'ancien JS)
- **Rollback** : `npx wrangler deployments list` puis `npx wrangler rollback <version-id>` (ou interface dash.cloudflare.com)
- **Stratégie service worker** (`sw.js`) :
  - Network-first pour HTML/JS/CSS (toujours fraîche en ligne, fallback cache hors-ligne)
  - Cache-first pour libs locales (React, ReactDOM, Supabase) + icônes
  - Auto-update : `controllerchange` listener déclenche `window.location.reload()` quand un nouveau SW prend la main

### 4.8 Tâches planifiées (pg_cron — mig.0008)

| Job                          | Cron        | Action                                                                 |
|------------------------------|-------------|------------------------------------------------------------------------|
| `auto-complete-bookings`     | `0 * * * *` | Toutes les heures : passe en `completed` les bookings dont la checkout est dépassée. Cascade : notif guest + crédit auto +2 pts guest / +5 pts host |
| `cleanup-expired-coupons`    | `0 3 * * *` | Tous les jours à 03 h UTC : marque `expired` les coupons dont `expires_at < now()`. Libère les filtres « actifs » du dashboard utilisateur |

Vue de monitoring : `select * from cron_jobs_status;` (jobname, schedule, command, last_run_at, last_status, last_message).

Désinstallation si jamais besoin :
```sql
select cron.unschedule('auto-complete-bookings');
select cron.unschedule('cleanup-expired-coupons');
```

### 4.9 Bouton retour système (depuis v40)
- Capture `popstate` (Android back, navigateur PC)
- Si écran secondaire ouvert → ferme tous les overlays + reste sur l'onglet courant
- Sinon → comportement natif (l'app quitte)
- Évite que le back natif quitte brutalement l'app pendant la navigation

## 5. Charte UI

### 5.1 Couleurs
- Primary (coral) : `#FF5A5F`
- Black : `#1A1A1A`
- Dark : `#2D2D2D`
- Mid : `#6B6B6B`
- Light : `#9B9B9B`
- Border : `#EBEBEB`
- BG : `#F7F7F7`
- White : `#FFFFFF`

### 5.2 Dark mode
- Activable via Settings → mode sombre profond style Material You
- Filter CSS sur `body` : `invert(0.96) hue-rotate(180deg) contrast(0.92) brightness(0.82)`
- Contre-inversion sur `img/video/iframe/canvas/.face-avatar` pour préserver les couleurs naturelles

### 5.3 Typographie
- Famille : DM Sans (Google Fonts, opsz 9..40)
- Poids : 300, 400, 500, 600, 700

### 5.4 Composants
- Cards arrondies (radius 12-18px)
- Sheet bottom-up (transform translateY 100%->0, cubic-bezier easing)
- Bottom nav 5 onglets (Accueil/Favoris/Voyages/Messages/Profil)
- Boutons coral pour CTA principaux
- Tap effect : `transform: scale(.97)` au :active
- Loading screen avec logo coral pulsant + barre de progression coral
- Padding-top adaptatif : `--top-pad: max(env(safe-area-inset-top), 35px)` (notch iPhone géré)

## 6. Roadmap MVP → Prod

### MVP — État au 2026-04-25 (v45 + backend full)
- ✅ UI complète (5 onglets, wizard publish 6 étapes, dashboard bailleur, scan QR, chat, reviews multi-segments)
- ✅ Bundle pré-transpilé (Babel CLI, plus de Babel runtime)
- ✅ Déploiement Cloudflare Workers + GitHub Actions CI
- ✅ PWA (offline + cache busting + auto-reload)
- ✅ Backend Supabase Postgres : **9 migrations**, **14 tables**, **18 RPCs**, RLS row + column-level, full-text search, anti-double-booking EXCLUDE, anti-cheat points, pg_cron actif
- ✅ App connectée à la BDD via 13 sous-modules (mode dégradé fallback mocks)
- ✅ Booking flow : `db.bookings.create` + check disponibilité + capture conflit EXCLUDE + décomposition prix complète
- ✅ Vérification arrivée : QR token UUID + RPC `verify_booking_qr` + `validate_arrival` (idempotent)
- ✅ Reviews 8 critères alignés DB + insertion via `db.reviews.create` (trigger compute_review_rating auto)
- ✅ Récompenses : sync backend + RPC `redeem_reward` + catalogue depuis `rewards_catalog`
- ✅ Chat : compteur non-lus par conversation + auto mark-read + block/unblock RPC + Realtime
- 🔄 Implémenter écran d'auth complet (signup multi-étapes + OTP phone)
- 📋 Connecter `publishHandleSubmit` à `db.listings.create` + upload photos (utiliser nouvelles colonnes `general_amenities`/`child_entities`/`house_rules`/`custom_rules`)
- 📋 Connecter recherche/filtres home/explore à RPC `search_listings`
- 📋 UI upload KYC dans le profil (table prête)
- 📋 Edge Function `kyc-review` (déployable sans compte externe)
- 📋 Edge Functions paiement : `momo-webhook` + `om-webhook` (en attente credentials marchand MTN/Orange)
- 📋 Edge Functions : `delete-account`, `send-otp-sms` (Twilio)

### Beta (après MVP)
- Build APK Capacitor (propriétaires sur mobile pour QR scan)
- Beta testers (10-20 propriétaires + 50 locataires Douala)
- Notifications push (web push d'abord, FCM pour APK)
- Mode offline pour QR scan
- Activer OAuth Google + Apple

### Prod
- Soumission Play Store
- Site marketing (sur domaine `byer.cm` ou similaire)
- Support client (email + WhatsApp Business)
- Analytics (Plausible ou PostHog auto-hébergé)
- Internationalisation FR/EN (système i18n déjà en place)

## 7. Risques & dépendances

### Risques techniques
- **Bundle 935 KB** — pas critique sur Cloudflare CDN + cache PWA, mais à surveiller. Migration future Vite envisagée si bundle > 1.5 MB
- **Pas de TypeScript** — refacto progressive fichier par fichier envisagée. Aujourd'hui : JSDoc + tests manuels
- **Mock data dans `js/data.js`** — toujours présent, sert de fallback. Sera supprimé une fois la BDD remplie de vraies annonces
- **Free tier Supabase** : limites 500 Mo DB / 1 Go storage — couvre ~50 000 listings, ~2000 photos HD. Plan Pro à $25/mois si dépassement

### Risques métier
- **Adoption MoMo/OM** dépend de la fluidité d'intégration (sandbox API)
- **Photos de biens** : qualité variable selon propriétaires, prévoir guides + filtres anti-mauvaise photo (compression auto déjà active à l'upload)
- **Confiance** : système de reviews (8 critères + 3 segments) déjà en place dès le V1, alignement DB + booking eligibility check côté trigger (mig.0007)
- **Vérification identité (KYC)** : table prête, bucket privé prêt, workflow admin/edge function `kyc-review` à implémenter pour activer le badge `identity_verified` (sync auto via trigger `sync_kyc_to_profile`)
- **Anti-fraude points** : Anti-cheat RLS déjà en place (mig.0007) — frontend ne peut plus modifier `rewards_points` directement, tout passe par RPC ou triggers. Audit complet via `points_transactions`
- **Anti double-réservation** : contrainte EXCLUDE Postgres rend impossible toute superposition de dates en confirmed/active sur le même listing (mig.0006)

### Dépendances externes
- ✅ Supabase (Auth + Postgres + Storage + Edge Functions)
- ✅ Cloudflare Workers (hébergement + CDN)
- 📋 MTN MoMo Open API (compte développeur requis)
- 📋 Orange Money (via agrégateur CinetPay/Flutterwave probablement)
- 📋 Twilio ou Africa's Talking (OTP SMS Cameroun)
- 📋 Capacitor (build APK, après MVP)

## 8. Conventions code

- React fonctionnel + hooks (pas de classes)
- État local en haut de `ByerApp` (closure root state)
- Closures de fermeture par feature : `closeAndMaybeReturnToDashboard`, `closeAllOverlays`, `switchTab`
- Composants réutilisables dans `js/components.js`
- Fichier par feature (`home.js`, `detail.js`, `gallery.js`, `publish.js`, `booking.js`, `dashboard.js`, etc.)
- Constants en MAJUSCULES (`PROPERTIES`, `LOCATIONS`, `RATING_CRITERIA`, `PHOTO_TAG_TYPES`, `PROPERTY_RULES`)
- FCFA formaté via helper `fmt(n)` → "150 000 F"
- Mois formaté via `fmtM(n)` → "150 000 F/mois"
- Communication Supabase : toujours via `window.byer.db.<module>.<method>`, jamais via `sb.from()` direct dans les composants
- Bumper systématiquement `bundle.js?v=N` ET `CACHE_NAME = 'byer-vN'` à chaque release pour cache-bust le SW

## 9. Historique des versions (frontend)

| Version | Date       | Changement principal |
|---------|------------|----------------------|
| v37     | 2026-04-23 | Photos auto-numérotées par type (Chambre 1, Chambre 2…) |
| v38     | 2026-04-23 | Photos cappées par nb pièces prédéfinies au step précédent |
| v39     | 2026-04-23 | Top-pad réduit à 35px (au lieu de 64px) |
| v40     | 2026-04-23 | Bouton back système ferme les écrans secondaires au lieu de quitter l'app |
| v41     | 2026-04-24 | Ajout étape Règlement (règles pré-définies + jusqu'à 10 personnalisées) |
| v42     | 2026-04-24 | Auto-open tag picker après upload photo |
| v43     | 2026-04-24 | Reviews split 3 segments (immobilier/véhicules/techniciens) |
| v44     | 2026-04-25 | Photo cap = somme des slots prédéfinis + fix « 6 sur 6 » |
| v45     | 2026-04-25 | Bouton × pour annuler le wizard publish à toutes les étapes |
| v46     | 2026-04-25 | Wrapper Supabase étendu (13 modules / 18 RPCs) ; booking flow câblé (pré-flight `is_listing_available` + capture conflit EXCLUDE 23P01 + décomposition prix complète) ; QR scan réel via `verify_booking_qr` + `validate_arrival` (UUID détecté, fallback démo BYR-XXXX) ; Reviews 8 critères alignés DB ; Récompenses sync backend + RPC atomique `redeem_reward` ; Chat compteur non-lus par conv + auto mark-read + RPC block/unblock ; pointsManager passe en backend-first |

## 10. Historique des migrations SQL

| Migration                                  | Contenu |
|--------------------------------------------|---------|
| `0001_initial_schema.sql`                  | 9 tables core (profiles, listings, listing_photos, bookings, conversations, messages, reviews, points_transactions, coupons, referrals, notifications) + triggers `generate_referral_code`, `touch_updated_at`, `handle_new_auth_user` |
| `0002_rls_policies.sql`                    | RLS sur les 11 tables (lecture publique pour profiles/listings/photos/reviews, strict private pour bookings/conversations/messages, RPC-only pour points/coupons) |
| `0003_storage_and_seed.sql`                | Buckets `listing-photos` (public) + `avatars` (public) + politiques storage |
| `0004_auth_extensions.sql`                 | Extension de profiles (first/last/bio/verifications/2FA/langue/prefs notif) + tables `kyc_documents` + `trusted_devices` + bucket privé `kyc-documents` + triggers de synchro auth.users + RPC `check_referral_code`/`apply_referral_code`/`delete_my_account_request` |
| `0005_listings_optimizations.sql`          | Colonnes `general_amenities`, `child_entities`, `house_rules`, `custom_rules` sur listings ; `tag` sur listing_photos ; contraintes métier (prix ≥ 0, lat/lng valides, subtype enum strict) ; full-text search pondéré (titre>ville>desc) ; index GIN sur amenities + house_rules + child_entities ; index spatial pour proximité ; triggers auto `rating_avg`/`review_count`/`is_superhost` ; RPC `search_listings`, `nearby_listings`, `toggle_listing_active` |
| `0006_bookings_optimizations.sql`          | Extension `btree_gist` ; **contrainte EXCLUDE anti double-booking** sur (listing_id × daterange) en confirmed/active ; décomposition prix (`price_base`/`service`/`dossier`/`taxes`/`caution`) ; `rental_mode` (night/day/week/month) ; QR token UUID inviolable + `qr_validated_at`/`qr_validated_by` ; politique d'annulation (flexible/moderate/strict) + remboursement auto ; payout host (commission, montant net) ; audit paiement (téléphone MoMo/OM, ref transaction, paid_at) ; RPC `is_listing_available`, `get_blocked_dates`, `cancel_booking`, `verify_booking_qr`, `validate_arrival`, `auto_complete_bookings` ; triggers notifications guest/host |
| `0007_reviews_rewards_notifications.sql`   | **REVIEWS** alignées 8 critères (proprete/confort/accessibilite/convivialite/emplacement/securite/equipement/qualite_prix) + auto-moyenne + booking eligibility check ; **RÉCOMPENSES** table `rewards_catalog` (6 récompenses seedées) + RPC atomique `redeem_reward` + RPC `apply_coupon` ; **ANTI-TRICHE** verrou RLS column-level sur `profiles.rewards_points` ; **POINTS AUTO** trigger +2 pts guest / +5 pts host à chaque booking completed (idempotent) ; **NOTIFICATIONS** triggers auto sur review/reply/message ; **CHAT** RPC `mark_conversation_read`, `block_conversation`, `unblock_conversation`, `get_unread_count` + trigger `enforce_message_not_blocked` ; utilitaire `cleanup_expired_coupons` pour pg_cron |
| `0008_pg_cron_jobs.sql`                    | Activation extension `pg_cron` + 2 jobs : `auto-complete-bookings` (horaire) et `cleanup-expired-coupons` (3 h UTC quotidien) ; vue `cron_jobs_status` pour monitoring ; idempotent (cron.unschedule avant cron.schedule) |
| `0009_hotfix_validate_arrival.sql`         | 🐛 Hotfix PL/pgSQL : pattern `select b.*, l.owner_id into v_b, v_owner` interdit quand `v_b` est un record. Scindé en 2 requêtes (`select * into v_b` puis `select owner_id into v_owner`). Sans ce fix, l'appel `select validate_arrival(uuid)` échouait avec erreur 42601 |
