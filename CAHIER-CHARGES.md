# 📖 Byer — Cahier de charges

> Marketplace de location immobilier + véhicules au Cameroun
> Version : **2.0** — 2026-04-25
> URL prod : https://byer.landonjouajosephpino.workers.dev
> Backend : Supabase `xwqnsovfakzraafiudek` (région eu-west-1)
> Voir aussi : [PROGRESS.md](PROGRESS.md) (suivi du dev)

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

### 3.3 Système de notation (8 critères pondérés)

| Critère       | Poids | Icône |
|---------------|-------|-------|
| Propreté      | 20%   | 🧹   |
| Emplacement   | 15%   | 📍   |
| Communication | 15%   | 💬   |
| Rapport qualité | 15% | 💰   |
| Sécurité      | 10%   | 🔒   |
| Confort       | 10%   | 🛋️   |
| Équipements   | 10%   | 📦   |
| Arrivée       | 5%    | 🚪   |

Note finale = somme pondérée des 8 critères (sur 5).

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
- Confirmation instantanée après paiement
- Reçu PDF (V2)

### 3.7 Vérification d'entrée
- Locataire reçoit un QR contenant son code de réservation (`BYR-XXXXXX`)
- Propriétaire scanne le QR via `QRScannerOverlay`
- Sheet de vérification affiche : photo locataire, dates, montant payé
- Validation = entrée OK ; rejet = entrée refusée + notification

### 3.8 Messagerie
- Conversations entre locataire ↔ propriétaire (1-1, ancrée à un listing optionnel)
- Chat plein écran (UX immersive sans nav bar)
- Messages avec read_at (accusé de lecture)
- Possibilité de bloquer une conversation

### 3.9 Système de récompenses
- Points cumulables : parrainage (+10), booking complété (+2), bonus signup (+25 si parrainé)
- Tiers automatiques (generated column) : Bronze < 100 < Argent < 500 < Or
- Conversion points → coupons (boost annonces, paywall)
- Code de parrainage personnel généré à l'inscription (basé sur le prénom)

### 3.10 Notifications in-app
- Types : booking, message, rent, boost, review, tech, system
- Compteur non-lus dans l'icône cloche du header

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
  - **Postgres 15** : 13 tables, citext, uuid-ossp, pgcrypto, generated columns, RLS
  - **Storage** : 3 buckets (`listing-photos` public, `avatars` public, `kyc-documents` privé)
  - **Edge Functions** (à déployer) : `delete-account`, `send-otp-sms`, `kyc-review`
  - **Realtime** : prêt pour chat live (channels par conversation)
- **Wrapper client** : `js/supabase-client.js` expose `window.byer.db` avec sous-modules `auth`/`profiles`/`listings`/`bookings`/`chat`/`reviews`/`notifications`/`rewards`/`storage`
- **Mode dégradé** : si `SUPABASE_READY = false` ou erreur réseau, fallback sur les mocks (`PROPERTIES`/`VEHICLES`/`BOOKINGS`)

### 4.3 Modèle de données — Postgres / Supabase

**13 tables** organisées en 4 modules :

#### Module Auth (couvert par migrations 0001 + 0004)
```
profiles (extension de auth.users)
  id (FK auth.users), name, first_name, last_name, email (citext, unique),
  phone, photo_url, avatar_letter, avatar_bg, city, role,
  bio (≤200 chars), member_since, referral_code (unique),
  rewards_points (≥0), referral_count (≥0),
  tier (generated: bronze/argent/or selon points),
  email_verified, phone_verified, identity_verified,
  two_factor_enabled, auth_provider (email/phone/google/apple/facebook),
  last_login_at, preferred_language (fr/en),
  notification_prefs (jsonb : push/email/sms/marketing/bookings/messages/...),
  created_at, updated_at

kyc_documents (pièces d'identité — workflow pending → approved)
  id, user_id, doc_type (id_card/passport/driver_license/selfie),
  file_path (chemin dans bucket kyc-documents),
  status, reject_reason, submitted_at, reviewed_at, reviewed_by

trusted_devices (sessions multi-appareils)
  id, user_id, device_hash, device_label, platform, ip_inet,
  user_agent, last_seen_at, created_at

referrals (parrainage)
  id, referrer_id, referred_id (unique), code_used, created_at
```

#### Module Listings (couvert par migration 0001)
```
listings (logements + véhicules dans la même table)
  id, owner_id, type (property/vehicle), subtype, title, description,
  city, zone, address, lat, lng,
  price_night, price_month,
  bedrooms, bathrooms, max_guests,
  brand, model, year, fuel, transmission,
  amenities (text[]), rating_avg, review_count, is_superhost, is_active,
  created_at, updated_at

listing_photos
  id, listing_id, url, position, created_at
```

#### Module Bookings + Chat
```
bookings
  id, ref (BYR-XXXXXX, unique), guest_id, host_id, listing_id,
  checkin, checkout, nights (generated), guests_count,
  total_price, payment_method, payment_status,
  status (pending/confirmed/active/completed/cancelled),
  cancel_reason, created_at, updated_at

conversations
  id, guest_id, host_id, listing_id, blocked_by,
  last_message_at, created_at
  unique(guest_id, host_id, listing_id)

messages
  id, conversation_id, sender_id, body, read_at, created_at
```

#### Module Reviews + Récompenses + Notifications
```
reviews (avis multi-critères 8 dimensions)
  id, booking_id, listing_id, author_id, rating,
  rating_clean, rating_comm, rating_value, rating_location,
  body, reply, reply_at, created_at
  unique(booking_id, author_id)

points_transactions
  id, user_id, delta, reason (referral/booking/redeem/signup_promo),
  ref_id, created_at

coupons
  id, user_id, reward_id, label, type (boost/paywall),
  value (FCFA), is_used, used_at, expires_at, created_at

notifications
  id, user_id, type (booking/message/rent/boost/review/tech/system),
  title, body, ref_id, is_read, created_at
```

### 4.4 Triggers automatiques
- `handle_new_auth_user` (after insert auth.users) → crée la ligne profile, splitte first/last, détecte le provider OAuth, récupère avatar_url des metadata Google/Apple
- `generate_referral_code` (before insert profiles) → code basé sur le prénom + "24"
- `touch_updated_at` (before update) → bump updated_at sur profiles/listings/bookings
- `sync_auth_status_to_profile` (after update auth.users) → miroite email_confirmed_at → email_verified, idem phone et last_sign_in_at
- `sync_kyc_to_profile` (after insert/update kyc_documents) → bascule profiles.identity_verified quand un KYC passe à approved

### 4.5 RPC publiques
- `check_referral_code(code)` → `{valid, referrer_name}` — accessible anon + authenticated
- `apply_referral_code(code)` → crédit +10 parrain / +25 filleul, idempotent
- `delete_my_account_request()` → anonymise le profil avant edge function admin (RGPD)

### 4.6 Sécurité — RLS Postgres
- **profiles** : lecture publique (avatar+nom des hosts visibles partout), update réservé à `id = auth.uid()`
- **listings** : lecture si `is_active = true OR owner_id = auth.uid()`, écriture par `owner_id = auth.uid()`
- **listing_photos** : lecture publique, écriture par owner du listing parent
- **bookings** : lecture/écriture strictement entre guest_id et host_id
- **conversations + messages** : lecture/écriture strictement entre les 2 parties
- **reviews** : lecture publique, écriture par auteur, reply par owner du listing
- **points_transactions / coupons** : lecture par owner, écriture via RPC SECURITY DEFINER
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

### 4.8 Bouton retour système (depuis v40)
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

### MVP — État au 2026-04-25 (v45)
- ✅ UI complète (5 onglets, wizard publish 6 étapes, dashboard bailleur, scan QR, chat, reviews multi-segments)
- ✅ Bundle pré-transpilé (Babel CLI, plus de Babel runtime)
- ✅ Déploiement Cloudflare Workers + GitHub Actions CI
- ✅ PWA (offline + cache busting + auto-reload)
- ✅ Backend Supabase Postgres (13 tables, RLS, triggers, RPC, 3 storage buckets)
- ✅ App connectée à la BDD (mode dégradé fallback mocks)
- 🔄 Implémenter écran d'auth complet (signup multi-étapes + OTP phone)
- 📋 Connecter `publishHandleSubmit` à `db.listings.create` + upload photos
- 📋 Connecter Booking flow à `db.bookings.create` + paiement
- 📋 Edge Functions : `delete-account`, `send-otp-sms`, `kyc-review`
- 📋 Paiement MTN MoMo (sandbox)
- 📋 Paiement Orange Money

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
- **Confiance** : système de reviews (8 critères + 3 segments) déjà en place dès le V1
- **Vérification identité (KYC)** : table prête, mais workflow admin/edge function `kyc-review` à implémenter pour activer le badge `identity_verified`

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

## 10. Historique des migrations SQL

| Migration                          | Contenu |
|------------------------------------|---------|
| `0001_initial_schema.sql`          | 9 tables core (profiles, listings, listing_photos, bookings, conversations, messages, reviews, points_transactions, coupons, referrals, notifications) + triggers `generate_referral_code`, `touch_updated_at`, `handle_new_auth_user` |
| `0002_rls_policies.sql`            | RLS sur les 11 tables (lecture publique pour profiles/listings/photos/reviews, strict private pour bookings/conversations/messages, RPC-only pour points/coupons) |
| `0003_storage_and_seed.sql`        | Buckets `listing-photos` (public) + `avatars` (public) + politiques storage |
| `0004_auth_extensions.sql`         | Extension de profiles (first/last/bio/verifications/2FA/langue/prefs notif) + tables `kyc_documents` + `trusted_devices` + bucket privé `kyc-documents` + triggers de synchro auth.users + RPC `check_referral_code`/`apply_referral_code`/`delete_my_account_request` |
