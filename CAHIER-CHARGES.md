# 📖 Byer — Cahier de charges

> Marketplace de location immobilier + véhicules au Cameroun
> Version : **3.4** — 2026-04-27 (Phase 3 livrée : OwnerDashboard + Home bailleur branchés DB, RentScreen date dynamique, Messages cleanup)
> URL prod : https://byer.landonjouajosephpino.workers.dev
> Backend : Supabase `xwqnsovfakzraafiudek` (région eu-west-1) — **12 migrations appliquées, 18 RPCs en service, 1 Edge Function déployée**
> Bundle frontend : `bundle.js?v=49` (Phase 1 + 2 + 3 — toutes les données mockées remplaçables par DB réelle quand l'utilisateur en a)
> Voir aussi : [PROGRESS.md](PROGRESS.md) (suivi du dev) · [supabase/SETUP.md](supabase/SETUP.md) (procédure migrations)

---

## 0. 📊 État d'avancement (snapshot 2026-04-27)

> Vue d'ensemble unique. Source de vérité pour répondre à "où en est-on ?".

### ✅ Fait (livré + validé en prod)

**Backend / DB**
- 11 migrations Supabase appliquées : initial schema, RLS, storage, auth ext, listings/bookings/reviews optimizations, pg_cron, hotfix arrival, seed démo, KYC unique partial.
- 18 RPCs PostgREST en service (`search_listings`, `nearby_listings`, `is_available`, `cancel_booking`, `validate_arrival`, `redeem_reward`, `apply_referral_code`, `delete_my_account_request`, etc.).
- Edge Function `kyc-review` déployée + testée prod (`/health` → 200 `{ok:true,admin_count:1}`, `/list-pending` → 401 sans JWT admin = OK).
- Storage : bucket privé `kyc-documents` + buckets publics `avatars` + `listing-photos` avec policies.
- Auth Supabase : email/password + magic link + OAuth Google (le redirectTo prod reste à fixer cf. § À faire).
- Secret `ADMIN_EMAILS=pinolando120@gmail.com` configuré.

**Frontend (bundle v47, déployé Cloudflare Workers 2026-04-27)**
- Shell 5 onglets (Accueil / Favoris / Voyages / Messages / Profil) + sélecteur de localisation 12 villes.
- Onboarding 3 slides (logements / véhicules / bailleur).
- Recherche full-text débouncée 350 ms (RPC `search_listings`).
- Booking flow Supabase complet (insert + double-réservation bloquée par GiST exclude).
- Publish flow Supabase complet (insert listings + upload photos parallèle, validation client).
- KYC : upload utilisateur (modal sheet 4 doc types) + écran admin (list-pending + approve/reject avec motif obligatoire).
- Realtime chat 1-1 (Supabase realtime, optimistic UI, mark as read).
- Service Worker auto-update (`SKIP_WAITING` + reload, cache `byer-v47`).
- UX KYC clarifiée (terme expliqué, bouton coral "Envoyer mes documents", section "Administration (admin uniquement)").

**Infra / DevOps**
- Bundle v48 live sur Cloudflare Workers (URL prod, Version `9b6c50b7-7405-488b-9187-2660deb59b9b`).
- GitHub Actions auto-deploy (`push master` → CF en ~1 min) avec CLOUDFLARE_API_TOKEN à jour.
- `.assetsignore` enrichi (.bin, .claude, .wrangler, .vscode, .idea exclus du deploy).

**Phase 1 — 9 fixes critiques frontend (livrée 2026-04-27, bundle v48)**
- 1.A — 6 mismatches schéma `supabase-client.js` corrigés : `kyc.submitted_at`, `devices.device_label/hash`, suppression `last_message_preview`, `reviews.reply/reply_at`, `rewards.cost_points/tier/is_used+expires_at`.
- 1.B — `ByerErrorBoundary` (class React) wrap `<Root/>` dans `main.js` avec fallback "Oups + Recharger" (anti white-screen).
- 1.C — `DetailScreen` : gallery resilient (mocks → `_photos` Supabase → single fallback) + `ownerName` neutre + `adaptListing` enrichi (ownerName/Photo/Verified/Since via FK profiles).
- 1.D — `currentProfile` + `currentUserId` lifted dans `ByerApp` ; `ProfileScreen` affiche les vraies données utilisateur (avant : "Pino" pour TOUS) ; `EditProfileScreen.handleSave` appelle `db.profiles.update` réel + refresh via `onSaved`.
- 1.E — `dbBookings` + `adaptBooking()` ; `TripsScreen` branché sur `db.bookings.listMine` (avec flag `dbBookingsLoaded` pour ne pas mélanger DB et mocks) ; `onCancelBooking` route vers RPC `cancel_booking` (atomique).
- 1.F — `SavedScreen` reçoit la liste fusionnée `dbListings ∪ mocks` dédoublonnée par id.
- 1.G — `NotificationsScreen` branché sur `db.notifications.listMine` + `markRead`/`markAllRead` persistés en DB ; fallback mocks transparent si offline.
- 1.H — Bypass démo retiré : `setTimeout(()=>onLogin())` remplacé par message d'erreur clair ; bouton "Découvrir sans compte" caché en prod ; OAuth `signInOAuth` reçoit `redirectTo: window.location.origin` (Google login fix).
- 1.I — Bandeaux "📊 Données de démonstration" sur `OwnerDashboard` + `HomeScreen` (carte stats bailleur) avec texte explicatif "vraies stats après 1ère annonce".

**Phase 2 — Migration `0012_rls_hardening.sql` (livrée 2026-04-27, appliquée prod Supabase)**
- WITH CHECK ajouté sur 5 policies UPDATE (`listings_owner_update`, `bookings_party_update`, `conversations_party_update`, `reviews_author_update`, `notifs_self_update`) → bloque le transfert de FK vers d'autres users.
- `listing_photos_owner_write` + nouvelle `listing_photos_owner_update` : path check `(storage.foldername(name))[1]::uuid IN (select id from listings where owner_id = auth.uid())` → bloque l'upload dans le dossier d'un autre listing.
- `avatars_self_update` + `avatars_self_delete` ajoutées (manquantes — `upsert:true` du client échouait silencieusement avant).
- REVOKE column-level UPDATE sur `profiles` (`rewards_points`, `referral_count`, `identity_verified`, `email_verified`, `phone_verified`, `role`) → triche points/KYC impossible même si la policy RLS passe.
- REVOKE column-level UPDATE sur `listings` (`is_superhost`, `rating_avg`, `review_count`) → bloque la triche superhost (calculé par trigger uniquement).
- `trusted_devices_no_client_insert` (explicite, `with check (false)`) → INSERT direct côté client interdit, force passage par Edge Function.
- `apply_referral_code` réécrit avec rate limit 5 codes/24h + return `jsonb {ok, error}` + DROP IF EXISTS pour permettre changement de signature.

**Phase 3 — Cleanup données réelles (livrée 2026-04-27, bundle v49)**
- 3.B — `HomeScreen` bailleur branché sur `ownerStats` (memoïsé dans ByerApp) : `myListings`/`incomingReqs`/`activeBookings`/`monthRevenue` agrégés depuis `dbMyListings` + `dbBookings(role=host)`. Bandeau "Démo" disparaît dès que `hasRealData=true` (≥1 listing OU ≥1 host booking).
- 3.C — `OwnerDashboard` : adapter `buildOwnerFromDb(currentProfile, dbMyListings)` qui remplace `OWNERS["Ekwalla M."]` par un owner virtuel. Listings groupées par city → "buildings virtuels". Vehicles séparés. Owner card = vrais nom/photo/since/city du profil. Fallback mock si pas encore d'annonce.
- 3.D — `data.js` : `TODAY = new Date()` (était figé `"2025-03-22"` → cassait DAYS_LEFT/WARN en 2026). `DEADLINE_1` = dernier jour du mois courant calculé dynamiquement.
- 3.E — `messages.js` : retiré l'enrichissement bailleur avec contacts hardcodés (`Caroline N.`, `David M.`, `Aïcha B.`, `Junior K.`, `Sandrine T.`). Si user authentifié, les vraies conversations Supabase remplacent les mocks ; sinon empty state via démo neutre.
- 3.F — Script `scripts/cleanup-demo-listings.sql` : `delete from listings where title like 'DEMO %'` (preview + delete commenté pour confirmation manuelle). À exécuter manuellement quand Pino veut nettoyer le seed mig 0010.

### 🔄 En cours (Phase 3 → branchement OwnerDashboard sur DB réelle)

**Aucune tâche bloquante en cours actuellement.** L'app est sécurisée en prod, prête pour les tests utilisateur. Phase 3 démarrera après validation QA Pino.

### 📋 À faire (avant release Play Store)

**Phase 3 — Cleanup divers + OwnerDashboard (~2-3 h)**
- Brancher `OwnerDashboard` + `Home` bailleur stats sur DB réelle (`db.listings.listMine` + agrégations) → retirer les bandeaux "Démo" actuels.
- Retirer la mig `0010_seed_demo_listings` en prod (les titres "DEMO" Villa Kribi etc. polluent le moteur de recherche). Soit DELETE FROM listings WHERE title LIKE '%DEMO%', soit re-seed avec des données plausibles.
- Auditer `RentScreen` : date figée `2025-03-22` dans `data.js:436` → remplacer par `new Date()` ou cacher l'écran tant qu'il n'est pas branché DB.
- Audit `MessagesScreen` mode bailleur : retirer les noms hardcodés (Caroline N., David Mboma, etc.) → si pas de vraies conversations DB, afficher empty state propre.
- Audit `OWNERS["Ekwalla M."]` : remplacer par `currentProfile` partout dans `owner-dashboard.js` (le bandeau démo est posé mais les chiffres restent ceux de Ekwalla).

**Phase 4 — Paiements (~3-4 h)** — _Stripe non supporté au Cameroun, on bascule sur Flutterwave qui couvre cartes + MoMo + OM dans une seule API_
- Création compte **Flutterwave** côté Pino (mode TEST d'abord) : https://dashboard.flutterwave.com/signup
- Edge Function `flw-init-payment` : POST avec montant + customer + redirect_url → renvoie `data.link` (URL hosted checkout Flutterwave) qu'on ouvre dans un onglet/iframe.
- Edge Function `flw-webhook` : reçoit notification post-paiement, vérifie signature `verif-hash` (secret hash configuré dans dashboard FLW), update `bookings.payment_status` + insert `payments`.
- Migration `0013_payments_flw.sql` : table `payments` (id, booking_id, provider='flw', tx_ref, flw_id, amount, currency='XAF', status, raw_payload jsonb) + colonne `flw_tx_ref` sur `bookings`.
- Frontend `booking.js` : si méthode paiement choisie → POST `/functions/v1/flw-init-payment` → redirect URL retournée. Au retour (callback URL), polling `payments` ou listening notification realtime.
- Tests CM : carte test `5531 8866 5214 2950` PIN `3310` OTP `12345`, MoMo MTN `+237 670 000 000`, Orange Money `+237 690 000 000`.
- Bonus : Flutterwave permet aussi **virement bancaire** (Express Union) via le même endpoint — un seul code couvre toutes les méthodes du Cameroun.

**Phase 5 — Soumission Play Store (~3 h)**
- Lighthouse + perf audit (mobile 3G, low-end Android).
- Compte Google Play Developer payé (Pino, 25 USD lifetime).
- Build APK/AAB via PWABuilder.com (input PWA URL → output AAB signé).
- Politique de confidentialité (URL publique avec mention KYC + photos + Supabase + Cloudflare + Stripe).
- Screenshots store (5-8 captures portrait 1080x1920) + icône 512x512 + bannière 1024x500.
- Description marketplace (FR + EN, ASO keywords).
- Soumission revue Google Play (24-72 h en moyenne).

### 📅 Prévu plus tard (post-v1)

**Paiements (post-v1, optimisations)**
- Intégrations natives directes (sans gateway Flutterwave) si volume élevé : MTN MoMo Open API + Orange Money API → réduit les fees ~3% vs aggregateur.
- Multi-app : un seul compte Flutterwave partagé entre Byer / CarExpress / Pharmadroid / Sequoia, avec `metadata.app` pour ségréguer + vues séparées dashboard.
- Stripe en backup pour la diaspora (paiement carte international depuis FR/US/UK) — passer par Stripe Atlas (LLC US) ou un agent fiscal.
- Cryptos (BTC, USDC) via NOWPayments / Coinbase Commerce — niche mais demandé Cameroun jeunes tech-savvy.

**Edge Functions auxiliaires**
- `delete-account` (suppression GDPR-compliant via service_role : auth.users + cascade tables liées).
- `send-otp-sms` (Twilio pour vérification téléphone).
- `listing-review` (modération annonces avant publication).
- `password-strength` (côté serveur, anti-leak HIBP).

**Sécurité avancée**
- 2FA réel (TOTP via `otplib` ou SMS via Twilio).
- Audit log table (`audit_logs` : qui a fait quoi quand).
- Rate limiting global via Cloudflare Workers (limit IP).
- IP geo-blocking si nécessaire.

**Tests / Qualité**
- E2E automatisés (Playwright) sur les 5 flows critiques.
- Sentry ou similaire pour error tracking en prod.
- Smoke tests post-deploy automatisés (CI).
- Coverage SQL via pgTAP.

**App / UX**
- App native iOS via TestFlight (Capacitor).
- Multi-langue effectif (extraire textes FR hardcodés vers `i18n.js`).
- Push notifications (Firebase Cloud Messaging via Edge Function `send-push`).
- Mode hors ligne complet (queue mutations + sync au retour réseau).
- Dark mode polish (déjà en place côté CSS, valider sur tous écrans).
- Animations transitions entre écrans (framer-motion alternative léger).

**Fonctionnel V2**
- Réseau de techniciens (entretien, plomberie, électricité — déjà câblé partiellement).
- Convoyeur véhicules (livraison à domicile).
- Agent immobilier multi-comptes (rôle "agent" + permissions sur plusieurs `owner_id`).
- Modérateur annonces (rôle "moderator" + écran review).
- Système de boost annonces (mise en avant payante via Stripe).
- Programme de récompenses : tier system (déjà en DB) + UI rewards-store.
- Refer-a-friend deep link (`byer://r/CODE`) avec attribution device-fingerprint.

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
- ✅ Edge Function `kyc-review` (codée 2026-04-28, à déployer via `supabase functions deploy kyc-review`)
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

## 10bis. Bugs rencontrés & leçons apprises

> Cette section capture les pièges réels qu'on a touchés sur Byer pour ne pas
> les répéter sur les prochains projets. Format : symptôme → cause racine →
> fix → leçon transposable.

### 🐛 Bug B-001 : PL/pgSQL multi-INTO record + scalaire (mig.0006 → 0009)
- **Symptôme** : `select validate_arrival('uuid')` échoue avec `ERREUR 42601 : la variable d'enregistrement ne peut pas faire partie d'une liste INTO à plusieurs éléments`. Pas détecté à `CREATE FUNCTION`, seulement au 1er appel.
- **Cause racine** : pattern `select b.*, l.owner_id into v_b, v_owner` interdit en PL/pgSQL quand `v_b` est un `%rowtype`. PostgreSQL ne valide PAS le corps des fonctions PL/pgSQL à la création — seulement à l'exécution.
- **Fix (mig.0009)** : scinder en 2 requêtes (`select b.* into v_b` puis `select l.owner_id into v_owner`).
- **Leçon transposable** : à chaque RPC créée, **faire immédiatement un appel réel** (`select my_rpc(test_args);`). Ne jamais se contenter du `Success. No rows returned` à la création.

### 🐛 Bug B-002 : Wrapper client out-of-sync avec les migrations (sessions précédentes)
- **Symptôme** : 18 RPCs côté DB mais frontend appelait toujours du `sb.from()` direct ou des méthodes inexistantes. Logique métier dupliquée client/serveur.
- **Cause racine** : pas de discipline « 1 migration = 1 méthode wrapper ». Le wrapper a accumulé du retard sur les migrations 0004→0007.
- **Fix** : refonte complète du `js/supabase-client.js` avec 13 sous-modules cartographiés sur les 7 migrations. Commentaires `// migration 0006` / `// migration 0007` à chaque méthode.
- **Leçon** : à chaque migration SQL qui ajoute une RPC, mettre à jour le wrapper dans le **même PR/commit**. Sinon le frontend dérive.

### 🐛 Bug B-003 : Mismatch clés UI ↔ colonnes DB sur les ratings
- **Symptôme** : `db.reviews.create({ rating_communication: 4 })` échoue avec `column does not exist`. La table avait `rating_convivialite`.
- **Cause racine** : UI codée en premier (`communication`, `rapport`, `equipements`, `arrivee`) sans aligner sur le schéma DB (`convivialite`, `qualite_prix`, `equipement`, `accessibilite`).
- **Fix** : mapping centralisé `RATING_KEY_TO_DB` dans `js/config.js` + correction des 8 clés UI. Schema DB devient la source de vérité.
- **Leçon** : définir le **contrat de données (DB schema)** en premier. Toute clé UI = projection de ce contrat, jamais l'inverse. Stocker le mapping dans 1 seul endroit.

### 🐛 Bug B-004 : Anti-triche points en localStorage
- **Symptôme** : un user motivé pouvait modifier `localStorage.byer_points` et se créditer 100k pts.
- **Cause racine** : pointsManager initial gérait la balance côté client uniquement.
- **Fix (mig.0007)** : RLS column-level qui interdit `UPDATE profiles SET rewards_points = ...`. Tout passe par RPC `redeem_reward` SECURITY DEFINER ou par le trigger `award_booking_points`. Frontend `pointsManager.syncFromBackend()` lit la valeur serveur, jamais l'inverse.
- **Leçon** : tout ce qui a une **valeur économique** (points, soldes, tokens) doit vivre côté serveur, validé par RLS column-level + RPC SECURITY DEFINER. Le client n'écrit JAMAIS directement, il appelle une RPC qui contrôle la légitimité.

### 🐛 Bug B-005 : Concurrence sur les réservations
- **Symptôme** : risque que 2 users réservent les mêmes dates en simultané (race condition entre `is_available` check et `INSERT`).
- **Cause racine** : pas de verrou Postgres au niveau du schema. La logique applicative `if available then insert` est intrinsèquement non-atomique.
- **Fix (mig.0006)** : contrainte `EXCLUDE USING gist (listing_id WITH =, daterange(checkin,checkout) WITH &&)` qui rend l'insertion conflictuelle physiquement impossible. Capture du code erreur SQL `23P01` côté frontend pour message clair.
- **Leçon** : pour la concurrence sur des ressources finies, **toujours préférer une contrainte Postgres** (EXCLUDE, UNIQUE partielle, FOR UPDATE) à de la logique applicative. La DB garantit l'atomicité, l'app non.

### 🐛 Bug B-006 : PWA cache trop agressif
- **Symptôme** : Cloudflare déploie v23 mais les users voient encore v22 (HTML cached, JS cached, SW garde l'ancienne version).
- **Cause racine** : Service Worker `byer-v22` cache `bundle.js` sans query param de version, donc nouvelle build = même clé cache.
- **Fix** : double cache-busting obligatoire à chaque release : (a) `bundle.js?v=N` dans `index.html` (b) `CACHE_NAME = 'byer-vN'` dans `sw.js`. Listener `controllerchange` déclenche `window.location.reload()` automatiquement.
- **Leçon** : tout déploiement front avec PWA doit bumper **2 versions** synchronisées (asset URL + cache key). Documenter cette règle visiblement (dans CLAUDE.md / contributing.md). Idéalement, automatiser via un script `bump-version.js`.

### 🐛 Bug B-007 : Cloudflare Workers refuse le déploiement (>25 MB)
- **Symptôme** : `wrangler deploy` échoue avec « total asset size exceeds 25 MiB ». Le binaire `node_modules/workerd/bin/workerd` à lui seul fait 122 MiB.
- **Cause racine** : `wrangler` upload TOUT le directory par défaut, y compris node_modules.
- **Fix** : créer `.assetsignore` qui exclut `node_modules/`, `.git/`, `.github/`, `*.md`, scripts batch, `android-project/`, `supabase/`, `scripts/`.
- **Leçon** : sur un projet Cloudflare Workers Static Assets, **créer `.assetsignore` au tout début** (avant le 1er deploy). Modèle de référence à conserver.

### 🐛 Bug B-008 : Auth confirme l'email mais user "incorrect" au login ✅ RÉSOLU 2026-04-25
- **Symptôme** : signup réussit, mais login avec mêmes credentials renvoie « Email ou mot de passe incorrect ».
- **Cause racine confirmée** : option **« Confirm email »** activée par défaut dans Supabase Authentication. Tant que le user n'a pas cliqué le lien dans l'email reçu, `signInWithPassword` est rejeté avec `Email not confirmed`.
- **Fix appliqué (phase QA)** : Dashboard Supabase → Authentication → Sign In / Providers → Email → décocher « Confirm email » + Save. Vérifié par curl : signup + login renvoient bien tous deux un `access_token` avec `email_verified:true`.
- **Fix prod** : garder « Confirm email » activé, mais soigner l'UX du flow VerifyEmailScreen + customiser le template d'email (déjà fait via `VerifyEmailScreen.handleResend`).
- **Leçon** : toujours vérifier l'état des **toggles Auth Supabase** (Confirm email, Secure email change, Allow phone signup, etc.) AVANT de tester en QA. Ces toggles silencieux changent radicalement le comportement.

### 🐛 Bug B-009 : Cloudflare auto-deploy invisible (sessions précédentes)
- **Symptôme** : commit pushé sur master, mais Cloudflare sert toujours l'ancienne version. Aucun message d'erreur.
- **Cause racine** : il n'y avait AUCUN auto-deploy configuré. Le déploiement se faisait manuellement via `wrangler deploy`. Pas de webhook, pas de GitHub Action.
- **Fix** : créer `.github/workflows/deploy.yml` avec `cloudflare/wrangler-action@v3`. Secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` stockés dans GitHub Secrets.
- **Leçon** : à la 1re session sur un nouveau projet, **vérifier explicitement** : « est-ce que `git push` déclenche un déploiement ? ». Si non, le mettre en place AVANT toute autre feature. Sinon, on debug pendant des heures un code qui n'est pas en prod.

### 🐛 Bug B-010 : Génération d'un compte qui ne peut PAS être réutilisé pour login (post-fix B-008)
- **Symptôme** : après désactivation du « Confirm email », un compte créé via `auth.users` direct (insert SQL) ne pouvait pas se logguer car `email_confirmed_at` était NULL et la colonne `confirmed_at` est générée (`generated always as`).
- **Erreur Postgres** : `confirmed_at can only be updated to default value` (code 428C9).
- **Cause racine** : `auth.users.confirmed_at` est une colonne **générée** depuis `email_confirmed_at`. Tenter de la mettre à jour directement = blocage.
- **Fix** : ne mettre à jour QUE `email_confirmed_at = now()`, laisser Postgres recalculer `confirmed_at` automatiquement.
- **Leçon** : avant tout `UPDATE auth.users` en SQL direct, vérifier le DDL — Supabase utilise des **generated columns** sur cette table. Toujours préférer la RPC officielle (`auth.admin.updateUserById`) ou le Dashboard.

### 🐛 Bug B-011 : Mot de passe oublié — pas de reset UI possible en QA
- **Symptôme** : compte `pinolando120@gmail.com` existait déjà avec un ancien password. Login renvoyait « invalid credentials ». Aucune option « Mot de passe oublié » pour le reset (mail SMTP non configuré en QA).
- **Cause racine** : Supabase n'expose PAS de bouton « réinitialiser » dans le Dashboard pour un user existant. Le reset password passe forcément par un email envoyé à l'utilisateur.
- **Fix appliqué** : SQL direct dans Editor :
  ```sql
  update auth.users
     set encrypted_password = crypt('Pino@2026!', gen_salt('bf')),
         email_confirmed_at  = coalesce(email_confirmed_at, now())
   where email = 'pinolando120@gmail.com';
  ```
- **Leçon** : pour tout reset password en environnement QA sans SMTP, utiliser `crypt(plaintext, gen_salt('bf'))` directement. Bcrypt natif Postgres = même algo que Supabase Auth, donc compatible.

### 🐛 Bug B-012 : Seed migration — enum `profiles.role` strict ('host' invalide)
- **Symptôme** : seed `0010_seed_demo_listings.sql` a échoué avec `profiles_role_check` violation lors d'un `INSERT INTO profiles ... role = 'host'`.
- **Erreur Postgres** : `new row for relation "profiles" violates check constraint "profiles_role_check"` (23514).
- **Cause racine** : la contrainte CHECK définie en mig.0001 n'autorise QUE `('locataire','bailleur')`. La valeur `'host'` (sémantique anglaise héritée d'Airbnb) n'est PAS reconnue.
- **Fix** : remplacer `'host'` par `'bailleur'` dans le seed (les 2 occurrences : INSERT + UPDATE conflit).
- **Leçon** : avant tout seed, **lire les contraintes CHECK** sur les tables ciblées (`\d+ table_name` ou ouvrir le fichier `0001_initial_schema.sql`). Ne pas s'appuyer sur la sémantique « host/owner/landlord » universelle — chaque schéma a son enum.

### 🐛 Bug B-013 : Seed migration — enum `listings.subtype` strict ('villa' invalide)
- **Symptôme** : seed a re-échoué après B-012 avec `listings_subtype_valid` violation pour `subtype = 'villa'`.
- **Erreur Postgres** : `new row for relation "listings" violates check constraint "listings_subtype_valid"` (23514).
- **Cause racine** : la contrainte définie en mig.0005 fixe pour `type = 'property'` la liste exacte : `('maison','immeuble','hotel','motel','auberge','appartement','studio','chambre')`. **Villa n'y est pas** — c'est considéré comme un sous-type de `'maison'`.
- **Fix** : remplacer `subtype = 'villa'` par `subtype = 'maison'` (le titre `'DEMO Villa Balnéaire Kribi'` reste pour l'affichage).
- **Leçon** : double verrou — la contrainte est composée (`type = 'X' and subtype in (...)`). Pour ajouter une catégorie réellement nouvelle, **migration dédiée** qui DROP/recrée la contrainte. Ne pas inventer de subtypes en seed.

### 🐛 Bug B-014 : Chrome auto-traduit le SQL avant envoi à Supabase 🚨 PIÈGE NON-DEV
- **Symptôme** : tentative d'exécution du seed → `ERREUR : 42601 : L'instruction INSERT comporte plus d'expressions que de colonnes cibles`. Inspection : tous les identifiants SQL sont **en français** (`propriétaire_id`, `sous-type`, `titre`, `chambres`, `'propriété'`), et les nombres décimaux ont des virgules françaises (`4,0509` au lieu de `4.0509`).
- **Cause racine** : Google Chrome a détecté la page Supabase comme « anglaise » et a proposé/activé la traduction automatique. Le contenu de l'éditeur SQL — y compris ce qui est collé via Ctrl+V — est traduit AVANT d'être envoyé au serveur.
- **Fix immédiat** : clic droit sur la page → décocher « Traduire en français » / cliquer « Afficher l'original ». Vider l'éditeur, recharger la page, recoller, vérifier visuellement que `owner_id` est en anglais.
- **Fix durable** : Chrome → Paramètres → Langues → désactiver « Utiliser Google Traduction » + « Proposer de traduire les pages ».
- **Leçon** : pour les utilisateurs francophones non-dev, **toujours désactiver l'auto-traduction du navigateur** sur les outils dev (Supabase, GitHub, Cloudflare Dashboard, Stripe). Ces UI ont des contenus mixtes anglais/dynamique, et le navigateur traduit même les zones de saisie. C'est un bug INVISIBLE pour le développeur (qui voit `owner_id`) mais visible pour le serveur (qui reçoit `propriétaire_id`).

### 🐛 Bug B-015 : Self-booking autorisé (un user peut réserver son propre listing)
- **Symptôme** : un INSERT dans `public.bookings` avec `guest_id = host_id = listing.owner_id` réussit (RLS = `bookings_guest_create` vérifie seulement `guest_id = auth.uid()`).
- **Cause racine** : aucune contrainte business — la RLS protège le data ownership, pas la cohérence métier. La règle « un host ne peut pas se booker lui-même » est implicite mais pas codée.
- **Risque** : exploitation pour gonfler artificiellement son `review_count` ou ses `rewards_points` via auto-bookings (un host gagne +5 pts par booking complété, le guest +2 = +7 pts pour l'auteur).
- **Fix recommandé** : ajouter au schéma `bookings` une CHECK constraint :
  ```sql
  alter table public.bookings
    add constraint bookings_no_self_booking check (guest_id != host_id);
  ```
  Ou un trigger qui compare avec `listings.owner_id` côté DB.
- **Statut** : 🟡 À corriger en mig.0011. Pas urgent en QA mais bloquant pour la prod.

### 🐛 Bug B-016 : Migration 0006 jamais exécutée en prod 🚨 CRITIQUE ✅ RÉSOLU 2026-04-28
- **Symptôme** : tentative d'appel des RPC `is_listing_available`, `cancel_booking`, `verify_booking_qr`, `validate_arrival`, `auto_complete_bookings` → `PGRST202: function not found`. Tentative d'INSERT sur `bookings.price_base` → `42703: column does not exist`. Cron job `auto-complete-bookings` (créé par mig.0008) **plante toutes les heures** : `last_status: failed, last_message: function public.auto_complete_bookings() does not exist`.
- **Cause racine** : la migration `0006_bookings_optimizations.sql` n'a jamais été appliquée sur la base prod. Cependant, les migrations `0007_reviews_rewards_notifications.sql`, `0008_pg_cron_jobs.sql`, et `0010_seed_demo_listings.sql` ont été appliquées par-dessus, créant un trou logique. Le cron 0008 référence des fonctions de 0006 qui n'existent pas.
- **Impact business** :
  - 🚨 **Anti-double-booking ABSENT** : 2 réservations qui chevauchent les mêmes dates sur le même listing sont acceptées (testé en QA — bookings BYR-971672 et BYR-871450 sur Villa Kribi 1-4 mai et 2-5 mai créées sans erreur).
  - 🚨 **Politique d'annulation absente** : pas de calcul auto de remboursement (flexible/moderate/strict).
  - 🚨 **QR check-in absent** : pas de token UUID, pas de `verify_booking_qr`.
  - 🚨 **Auto-completion absente** : les bookings ne passent jamais à `completed`, donc aucun trigger de points ne se déclenche, aucun review n'est éligible.
  - 🚨 **Décomposition prix absente** : colonnes `price_base/service/dossier/taxes/caution` manquantes.
- **Fix immédiat** :
  1. Nettoyer les bookings de test (delete les 2 BYR-971672 et BYR-871450).
  2. Ouvrir [0006_bookings_optimizations.sql](C:\Users\Pino\Desktop\UNIVERSAL-TECH\apps\byer\supabase\migrations\0006_bookings_optimizations.sql) → coller dans Supabase SQL Editor → Run.
  3. Puis [0009_hotfix_validate_arrival.sql](C:\Users\Pino\Desktop\UNIVERSAL-TECH\apps\byer\supabase\migrations\0009_hotfix_validate_arrival.sql) → Run.
  4. Vérifier le retour du cron : `select * from cron_jobs_status;` → `last_status` doit passer à `succeeded`.
  5. Re-tester le double-booking → doit échouer avec contrainte EXCLUDE.
- **Leçon** : à chaque session SQL Supabase, **vérifier que TOUTES les migrations ont été appliquées** dans le bon ordre, pas juste la dernière. Garder une table `_migrations_applied(name, applied_at)` ou utiliser le système officiel `supabase migration` côté CLI. Ne JAMAIS sauter une migration en pensant « celle d'après corrige tout ».

### 🐛 Bug B-017 : Frontend bundle référence colonne inexistante `price_per_night`
- **Symptôme** : page d'accueil Byer affichait des annonces de démo (mocks) au lieu d'erreur, MAIS un appel REST custom dans la console DevTools renvoyait `column listings.price_per_night does not exist` (42703).
- **Cause racine** : la migration mig.0001 a créé la colonne `price_night` (sans le `_per_`). Quelque part dans `bundle.js` (frontend Cloudflare Workers), un select PostgREST utilise encore l'ancien nom.
- **Statut** : 🟡 À investiguer. Pas bloquant pour le seed (le seed utilise les bons noms), mais bloque potentiellement la recherche `search_listings` côté UI.
- **Leçon** : à chaque renaming de colonne en migration, **grepper** le frontend pour les anciens noms AVANT de merger. Ajouter au workflow : `git grep -n "price_per_night\|old_col_name" js/ src/`.

---

## 10ter. Tests E2E validés en QA (2026-04-28)

> Récap des scénarios bout-en-bout joués par curl direct sur l'API REST Supabase
> APRÈS application de mig.0006 (avec hotfix B-001 inline). Tous les tests
> passés ✅. Sert de baseline de non-régression pour les prochaines releases.

### ✅ T-001 : Anti-double-booking (EXCLUDE constraint mig.0006)
- **Setup** : 1er booking Villa Kribi 11-14 mai créé avec succès. 2e tentative chevauchante 13-15 mai sur le même listing.
- **Résultat** : 23P01 `bookings_no_overlap` — la contrainte `EXCLUDE USING gist` bloque physiquement l'INSERT.
- **Preuve** : `daterange(checkin, checkout, '[)')` exclut le checkout, donc 11-14 et 14-17 OK (2 séjours adjacents). 11-14 et 13-15 KO (overlap).

### ✅ T-002 : Trigger `award_booking_points` (mig.0007)
- **Setup** : booking `cacb94de-7aef-48ed-8ffa-1e9365d9f5b9` BYR-472165 sur Villa Kribi. UPDATE status='completed'.
- **Résultat** : Pino (host) 25 → 30 pts (+5). test-guest (guest) 25 → 27 pts (+2).
- **Idempotence** : 2e UPDATE status='completed' → points inchangés (Pino 30, guest 27). Pas de double-award.

### ✅ T-003 : Review 8 critères + auto-recompute rating_avg (mig.0007)
- **Setup** : POST `/rest/v1/reviews` sur le booking BYR-472165 avec les 8 ratings (proprete:5, confort:5, emplacement:5, convivialite:4, accessibilite:4, securite:5, equipement:4, qualite_prix:5) + body de 50 chars.
- **Résultat** : review `7af202e6-c910-4cbb-b5f7-7e494b72bbf2` créée. Colonne `rating` calculée automatiquement à 4.6 (moyenne pondérée). Listing Villa Kribi `rating_avg: 4.60`, `review_count: 1` mis à jour par trigger.

### ✅ T-004 : RPC `cancel_booking` (mig.0006) — 4/4 politiques
- **T4-A Flexible 22j ahead** : booking 200000 FCFA (170k base + 30k caution) → `refund_amount: 200000` (100% base + caution).
- **T4-B Moderate 17j ahead** : booking 55000 FCFA (50k base + 5k caution) → `refund_amount: 55000` (100% base + caution).
- **T4-C Strict 12j ahead** : booking 40000 FCFA (36k base + 4k caution) → `refund_amount: 22000` (50% base + caution).
- **T4-D Strict 2j ahead** : booking 80000 FCFA (70k base + 10k caution) → `refund_amount: 10000` (caution seule, 0% base).
- **Edge cases** : re-cancel sur status='cancelled' → P0004. Booking inexistant → P0002. Sans JWT → P0001 "Authentication required".
- **Side-effects DB** : `status='cancelled', payout_status='held', refund_status='pending', cancelled_at, cancelled_by` correctement renseignés.

### ✅ T-005 : RPC `validate_arrival` (mig.0006 + B-001 inline) — 5/5 cas
- **Setup** : host de test `1ecb954b-30ff-4bb0-8264-b04d32d8ade6` + listing `c5450db0-fc20-459d-b57c-cc9175252177` + booking `a6784cf0-de10-4941-b161-9a7c030f1997` BYR-211801 (status='confirmed', payment_status='paid'). QR token = `48cc5375-b931-49b4-b4ef-301e1ceabc3a`.
- **A. Guest tente validate** : "Only the host can validate arrival" ✅ (sécurité role-based OK).
- **B. Host scan via verify_booking_qr** : retourne `{guest_name, listing_title, checkin, all_good: true, ...}` ✅.
- **C. Host validate avec QR valide** : `true` ✅. Booking → `status='active'`, `qr_validated_at: 2026-04-28T15:20:44Z`, `qr_validated_by = host_id`.
- **D. Host re-validate même QR** : `false` ✅ (idempotent, pas de double-validation).
- **E. QR random** : "QR token not found" ✅.
- **Confirmation B-001 fix** : la logique `select * into v_b` puis `select l.owner_id into v_owner` fonctionne — pattern record + scalaire séparés validé en PG15.

### Résumé QA
| Test | RPC / Trigger | Cas | Statut |
|------|--------------|-----|--------|
| T-001 | EXCLUDE constraint | Double-booking bloqué | ✅ |
| T-002 | award_booking_points | +2 guest / +5 host idempotent | ✅ |
| T-003 | Trigger review | rating_avg recalculé auto | ✅ |
| T-004 | cancel_booking | flexible/moderate/strict + edges | ✅ 4+3 |
| T-005 | validate_arrival | guest blocked / host valide / idempotent | ✅ 5/5 |

**Restant** : cron `auto-complete-bookings` à vérifier (last_status doit passer à `succeeded` au prochain run après que mig.0006 a injecté la fonction `auto_complete_bookings`).

---

## 10quater. Edge Functions livrées

### `kyc-review` (livrée 2026-04-28)

> Permet à un admin (allowlist email via env `ADMIN_EMAILS`) de visualiser
> et valider les pièces KYC. Utilise la `service_role` key côté serveur,
> jamais exposée au client.

**Localisation** : [supabase/functions/kyc-review/](C:\Users\Pino\Desktop\UNIVERSAL-TECH\apps\byer\supabase\functions\kyc-review\)

**Composants** :
- [index.ts](C:\Users\Pino\Desktop\UNIVERSAL-TECH\apps\byer\supabase\functions\kyc-review\index.ts) — Deno + supabase-js, 3 routes (`/health`, `/list-pending`, `/review`)
- [_shared/cors.ts](C:\Users\Pino\Desktop\UNIVERSAL-TECH\apps\byer\supabase\functions\_shared\cors.ts) — headers CORS partagés (allowlist d'origins)
- [README.md](C:\Users\Pino\Desktop\UNIVERSAL-TECH\apps\byer\supabase\functions\kyc-review\README.md) — déploiement + curl examples
- [test-kyc-review.sh](C:\Users\Pino\Desktop\UNIVERSAL-TECH\apps\byer\supabase\functions\kyc-review\test-kyc-review.sh) — test E2E (8 étapes : login admin/user, upload faux PNG, list-pending, approve, vérif DB, anti-double-review, refus non-admin)

**Décisions de design** :
1. **Allowlist email plutôt qu'une table `admins`** : permet une rotation immédiate via `supabase secrets set ADMIN_EMAILS=...`, sans migration. Si on grandit, on créera une table dédiée — pour l'instant 1-3 admins suffisent.
2. **Signed URLs 5 min** pour les pièces KYC : assez pour visualiser, pas assez pour leak via screenshot ciblé.
3. **Anti-double-review via `WHERE status='pending'` dans l'UPDATE** : si 2 admins cliquent en même temps, le 2e reçoit un 409, pas une race.
4. **Notification best-effort** : un échec d'INSERT dans `notifications` n'invalide pas la review (logguer + continuer). La table KYC reste source de vérité.
5. **Pas de soft-delete** : un doc rejected reste en DB pour audit. L'utilisateur peut en soumettre un nouveau (la contrainte unique tient car elle inclut `status` : un doc rejected n'empêche pas un re-pending).

**Side-effects** :
- Trigger `sync_kyc_to_profile` (mig.0004) bascule auto `profiles.identity_verified=true` quand un doc passe à `approved`.
- Une notification de type `system` est insérée pour l'utilisateur (titre + body localisés FR).

**Audit pré-deploy 2026-04-28 — bugs interceptés** :
- 🐛 **B-018** PostgREST embed ambigu (`profile:profiles(...)` sans hint FK) : la table `kyc_documents` a 2 FK vers `profiles` (`user_id` et `reviewed_by`). Sans `!kyc_documents_user_id_fkey`, l'API retourne `PGRST201`. Vérifié en live curl. **Fixé** : hint FK explicite ajouté.
- 🐛 **B-019** UNIQUE composite `(user_id, doc_type, status)` (mig.0004) bloque les re-soumissions : un user ne peut pas avoir 2 lignes 'rejected' ou 2 'pending' du même type. **Fixé** par mig.0011 — index unique partiel `where status = 'approved'` (1 seul approved par type, historique pending/rejected libre).
- 🐛 **B-020** Path parsing fragile (trailing slash → `route=""`). **Fixé** : `split('/').filter(Boolean).pop()`.
- 🐛 **B-021** CORS émettait `Access-Control-Allow-Origin: null` sur origin non-listée (RFC : null = refus implicite, mais confusing à debugger). **Fixé** : header omis si origin pas dans l'allowlist.
- 🐛 **B-022** `Deno.env.get(...)!` plante au runtime si secret manquant. **Fixé** : flag `ENV_OK` + 500 explicite.
- 🐛 **B-023** Test script `grep -oP` non-portable (macOS). **Fixé** : `jq` partout.
- 🐛 **B-024** README oubliait que le header `apikey` est OBLIGATOIRE en plus du Bearer JWT pour passer le gateway Edge Functions. **Fixé** : doc + script.

**Reste à faire** :
1. ✅ `supabase link --project-ref xwqnsovfakzraafiudek` — fait via PAT non-interactif (2026-04-27).
2. ✅ **mig.0011 appliquée** — confirmée par Pino le 2026-04-27.
3. ✅ `supabase secrets set ADMIN_EMAILS=pinolando120@gmail.com` — fait.
4. ✅ `supabase functions deploy kyc-review` — fait. `/health` répond `{ok:true, admin_count:1}` HTTP 200.
5. ✅ UI admin frontend pour `list-pending` + `review` — livré dans Option C (cf. 10quinquies).

**Toutes les étapes terminées.** Section 10sexies couvre le déploiement frontend v47 qui rend les fonctionnalités visibles en prod.

---

## 10quinquies. Frontend bonus (livré 2026-04-28)

> Bouclage de la chaîne : la recherche full-text, l'upload KYC et la review
> admin ne sont plus des endpoints orphelins — ils ont une UI dans l'app.

### C1 — Recherche full-text branchée
**Fichiers** :
- [js/app.js](apps/byer/js/app.js) — état `searchResults` + `useEffect` debouncé 350 ms qui appelle `db.listings.search()` (RPC `search_listings`, mig.0005) dès 2 caractères. Filtres avancés (`maxPrice`, `minRating`, `amenities`, `city`) propagés au RPC.
- [js/home.js](apps/byer/js/home.js) — prop `searchLoading` + spinner coral remplaçant l'icône loupe pendant la requête.

**Comportement** :
- `search.length < 2` → liste classique (mocks ou `dbListings`).
- `search.length ≥ 2` → résultats RPC remplacent la source. Le filtre client saute la partie textuelle (déjà faite par `ts_vector` pondéré title>city>desc).
- Supabase offline → fallback sur le filtre client `title.includes()` historique. Aucune régression.

### C2 — UI upload KYC (côté utilisateur)
**Fichiers** :
- [js/kyc.js](apps/byer/js/kyc.js) — composant `KycUploadSheet` (modal feuille, anim `sheetUp`).
- [js/edit-profile.js](apps/byer/js/edit-profile.js) — bouton "Vérifier" de la section Identité ouvre la sheet ; statut `identity_verified` lu depuis `profiles` au mount + au close.

**Capacités** :
- Liste les 4 docs (CNI, passeport, permis, selfie) avec leur statut courant (badge coloré : pending=orange, approved=vert, rejected=rouge avec motif).
- Upload via input file caché (PNG/JPG/WEBP/PDF, 5 Mo max) → `db.kyc.upload()` → bucket privé `kyc-documents` + insert `kyc_documents` en pending.
- Garde-fous client : taille + mime, message d'erreur si UNIQUE violé (déjà approuvé).
- Toast feedback succès/erreur.

### C3 — UI Admin KYC review
**Fichier** :
- [js/kyc.js](apps/byer/js/kyc.js) — composant `KycAdminScreen`.

**Intégration app.js** :
- Détection admin au mount via comparaison `session.user.email` vs `ADMIN_EMAILS = ['pinolando120@gmail.com']` (gating UI ; la sécurité réelle est server-side dans l'Edge Function).
- Nouvelle entrée dans Settings → "Administration" → "Vérifications KYC en attente" (visible aux admins seulement).
- L'écran admin appelle `${SUPABASE_URL}/functions/v1/kyc-review/list-pending` (POST + apikey + Bearer admin JWT) puis affiche la liste avec photo (signed URL 5 min), profil utilisateur, type, date.
- Boutons Approuver (call direct) et Rejeter (modal motif obligatoire 300 chars max).
- Optimiste : retire la carte de la liste après succès (refresh manuel via bouton "↻ Actualiser").

### Build & versioning
- [build.js](apps/byer/build.js) : `kyc.js` ajouté à FILES (31 fichiers au total).
- [index.html](apps/byer/index.html) : bump `bundle.js?v=47` (v46 jamais déployé en prod, v47 inclut les fixes UX cf. 10sexies).
- [sw.js](apps/byer/sw.js) : `CACHE_NAME = 'byer-v47'` pour invalider le cache SW au prochain reload.
- Bundle final : 1020 KB (31 fichiers Babel CLI, runtime client = 0).

### Tests à faire (manuels, après déploiement Edge Function)
| # | Scénario | Attendu |
|---|----------|---------|
| C-T1 | Tape "douala" dans la recherche home, segment Logements | Spinner coral pendant ~350 ms, puis résultats RPC |
| C-T2 | Profile → Modifier → Vérifier (Identité) | Sheet avec 4 lignes vides "Non soumis" |
| C-T3 | Upload PNG 1 Mo de CNI | Toast "Document soumis ✓", ligne devient "En cours…" orange |
| C-T4 | Re-upload alors que le doc précédent est `pending` | Bouton "Remplacer" actif, nouvelle ligne pending (l'ancienne non-approved reste en historique) |
| C-T5 | Settings (en tant qu'admin) → "Vérifications KYC en attente" | Liste des pendings avec preview ; un user lambda ne voit pas l'entrée |
| C-T6 | Admin clique Rejeter sans saisir de motif | Bouton "Confirmer" disabled + texte d'aide |
| C-T7 | Admin Approuve → l'utilisateur reçoit une notification + identity_verified=true | Effet de bord du trigger `sync_kyc_to_profile` (mig.0004) |

---

## 10sexies. Déploiement live + fixes UX KYC (2026-04-27)

> Le code Option B + C était bien dans le repo mais **bundle v46 n'est jamais sorti
> en prod sur Cloudflare Workers**. Les retours QA de Pino l'ont révélé :
> "le bouton Vérifier n'est pas cliquable", "Modération KYC absente". v47 + redeploy.

### Déploiement Edge Function (côté Supabase)
- **Méthode** : Personal Access Token Supabase (PAT, scope `account/tokens`) → env var `SUPABASE_ACCESS_TOKEN` pour `link`/`secrets`/`deploy` non-interactifs (contournement du `supabase login` qui exige un clic browser).
- **Secret** : `ADMIN_EMAILS=pinolando120@gmail.com` (1 admin).
- **Tests E2E validés** :
  - `GET /health` (apikey=publishable + Bearer=anon JWT) → `{ok:true, fn:"kyc-review", admin_count:1}` HTTP 200
  - `POST /list-pending` (sans JWT user admin) → `{error:"Invalid or expired token"}` HTTP 401 (refus correct)
- **Headers gateway Edge Functions** :
  - `apikey` accepte le format publishable (`sb_publishable_*`) ✅
  - `Authorization: Bearer` exige un JWT format strict (le user session JWT en est un) ✅
  - Pour monitoring externe sans user, fournir le legacy anon JWT (récupérable via `supabase projects api-keys`).

### Fixes UX KYC (bundle v47)
> Audit utilisateur non-tech : 3 points de friction identifiés.

**Bug U1 — Bouton "Vérifier" Email mort** ([js/edit-profile.js:489-498](apps/byer/js/edit-profile.js)) :
- Avant : 2 boutons `Vérifier` identiques (Email + Identité), seul celui de l'Identité avait un onClick.
- Fix : remplacé celui de l'Email par un label `Bientôt` italique non-cliquable. Plus de confusion.

**Bug U2 — Mot "KYC" non expliqué** :
- Le terme apparaissait sec dans Settings et la modal sans définition.
- Fix [js/edit-profile.js:500-518](apps/byer/js/edit-profile.js) : section renommée "Pièce d'identité" + sous-titre 11px "Aussi appelé KYC. Carte d'identité, passeport ou permis pour confirmer qui vous êtes."
- Fix [js/kyc.js:178-183](apps/byer/js/kyc.js) : modal title devient "Vérification d'identité (KYC)" + paragraphe explicatif "KYC = Know Your Customer".
- Fix [js/settings.js:351-354](apps/byer/js/settings.js) : section header "Administration (admin uniquement)" + ligne "Modérer les pièces d'identité (KYC)".

**Bug U3 — Bouton "Vérifier" trop discret (lien souligné)** :
- Avant : style `verifyButtonStyle` = lien orange souligné, peu visible sur mobile.
- Fix : remplacé par un pill coral solide "Envoyer mes documents" (plus actionable, contraste fort).

### Déploiement frontend (Cloudflare Workers)
- `npx wrangler deploy` (wrangler v4.85.0 via npx, pas d'install globale).
- Static assets directory `./` (config wrangler.toml).
- Validation post-deploy : `curl https://byer.landonjouajosephpino.workers.dev/bundle.js?v=47 | grep -c KycUploadSheet` doit être `> 0`.

### Tests utilisateur après v47 (refait C-T2 → C-T7)
> ⚠️ **Pino doit faire Ctrl+Shift+R après deploy** pour invalider le SW byer-v45 → byer-v47.
> Le SW se met à jour automatiquement (`reg.update()` dans index.html), mais le hard reload force le passage immédiat.

### ✅ Validation prod (2026-04-27 14:25)
- Deploy via `npx wrangler deploy` avec `CLOUDFLARE_API_TOKEN` (PAT non-interactif).
- Asset directory : 4514 fichiers (après `.assetsignore` enrichi : `.bin/`, `.claude/`, `.wrangler/`, `.vscode/`, `.idea/`).
- Upload : 9 fichiers modifiés en 18.21 sec → URL prod **byer.landonjouajosephpino.workers.dev** (Version ID `b057d5ed-eb63-4f94-baf1-77a6109a9761`).
- Vérif live :
  - `curl /bundle.js?v=47 | grep -c KycUploadSheet|KycAdminScreen|kyc-review` → 11 occurrences ✅
  - `curl / | grep bundle.js` → `<script src="bundle.js?v=47">` ✅
  - `curl /sw.js | grep CACHE_NAME` → `byer-v47` ✅
- **QA utilisateur (Pino) : tous les ajouts UX validés** — bouton "Envoyer mes documents" visible, "Bientôt" sur Email, section "Administration" visible avec "Modérer les pièces d'identité (KYC)", explications KYC partout.

---

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
