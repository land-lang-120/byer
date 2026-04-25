# 📖 Byer — Cahier de charges

> Marketplace de location immobilier + véhicules au Cameroun
> Version : 1.0 — 2026-04-23
> Voir aussi : [PROGRESS.md](PROGRESS.md) (suivi du dev)

---

## 1. Vision

Permettre à n'importe qui au Cameroun de **trouver un logement ou un véhicule à louer** (à la nuitée ou au mois) en quelques taps, et payer via les moyens locaux (MTN MoMo, Orange Money, Express Union, virement). Côté propriétaire, mettre un bien en location est aussi simple, et la vérification d'arrivée se fait par scan de QR.

Inspiration : Airbnb pour la fluidité, Bolt/Yango pour les véhicules, Jumia House pour le contexte camerounais.

## 2. Personas & rôles

### 2.1 Locataire (= invité)
- Cherche un bien dans une ville (Douala, Yaoundé, Kribi, etc.)
- Filtre par type, durée, prix, note minimum
- Réserve avec son moyen de paiement préféré
- À l'arrivée, montre son QR de réservation au propriétaire

### 2.2 Propriétaire (= bailleur)
- Met un bien en location (formulaire `RentScreen`)
- Reçoit les demandes de réservation
- Scanne le QR du locataire pour valider l'entrée des lieux (`QRScannerOverlay`)
- Reçoit les paiements (loyer mensuel ou nuitée)
- Gère la communication via Messages

### 2.3 Cas non-MVP (V2)
- Agent immobilier (gère plusieurs propriétaires)
- Convoyeur véhicule (livraison à domicile)
- Modérateur (vérification annonces)

## 3. Périmètre fonctionnel

### 3.1 Catégories de biens
- **Immobilier** : Villa, Appartement, Studio, Hôtel, Chambre meublée
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

### 3.4 Recherche & filtres
- Par ville (12 villes camerounaises + filtre national)
- Par type (Villa / Appart / Studio / SUV / etc.)
- Par durée (nuitée / mois)
- Par note minimum (0 à 5)
- Recherche texte libre (titre + ville)
- Favoris (heart toggle)

### 3.5 Paiement
- 4 méthodes :
  - MTN Mobile Money (instantané)
  - Orange Money (instantané)
  - Express Union (en agence physique)
  - Virement bancaire classique
- Confirmation instantanée après paiement
- Reçu PDF (V2)

### 3.6 Vérification d'entrée
- Locataire reçoit un QR contenant son code de réservation
- Propriétaire scanne le QR via `QRScannerOverlay`
- Sheet de vérification affiche : photo locataire, dates, montant payé
- Validation = entrée OK ; rejet = entrée refusée + notification

## 4. Architecture technique

### 4.1 Stack actuelle (en cours de refactor)
- **Front** : React 18 chargé via UMD CDN + Babel standalone (script type=text/babel)
- **Build** : `build.js` Node simple qui concatène `js/*.js` en `bundle.js`
- **Style** : `css/global.css` (reset + animations) + string `BYER_CSS` injectée dans `app.js`
- **PWA** : `manifest.json` + `sw.js` (cache offline basique)
- **Données** : mock dans `js/data.js` (PROPERTIES + VEHICLES)

### 4.2 Stack cible (post-migration)
- **Front** : React 18 + TypeScript + Vite (build moderne avec tree-shaking)
- **Style** : CSS modules ou Tailwind (à décider)
- **Backend** : Firebase
  - Auth : OTP téléphone (couvre les 80% du marché sans email)
  - Firestore : `properties`, `vehicles`, `reservations`, `messages`, `users`
  - Storage : photos des biens
  - Functions : webhooks paiement + notifications push
- **Paiement** :
  - MTN MoMo Open API (sandbox puis prod)
  - Orange Money API (via partenaire ou CinetPay/Flutterwave)
  - Express Union : intégration manuelle (codes de transfert)
- **Mobile** : Capacitor (APK Android — propriétaires sur mobile pour QR scan)

### 4.3 Modèle de données (Firestore prévu)

```
properties/{id}
  ownerId: string (-> users)
  type: 'villa' | 'appartement' | 'studio' | 'hotel' | 'chambre'
  title, description: string
  city: 'douala' | 'yaounde' | ... (12 villes)
  address: string
  geo: { lat, lng } (optionnel)
  photos: string[] (URLs Storage)
  nightPrice: number | null (FCFA)
  monthPrice: number | null (FCFA)
  rating: number (calculé depuis reviews)
  reviews: subcollection
  amenities: string[] ('wifi', 'climatisation', 'parking', ...)
  available: boolean
  createdAt, updatedAt

vehicles/{id}
  ownerId, type ('suv'|'berline'|...), title, photos, nightPrice/monthPrice
  features: string[] ('clim', 'gps', 'auto', ...)
  ...

reservations/{id}
  guestId, propertyOrVehicleId, kind ('property'|'vehicle')
  startDate, endDate (ISO)
  totalAmount: number
  paymentMethod: 'mtn'|'orange'|'eu'|'virement'
  paymentStatus: 'pending'|'paid'|'failed'|'refunded'
  qrCode: string (UUID, pour vérification d'arrivée)
  status: 'reserved'|'checked-in'|'completed'|'cancelled'
  createdAt

messages/{conversationId}/messages/{msgId}
  senderId, body, createdAt, read: boolean
```

### 4.4 Sécurité
- Auth obligatoire pour réserver
- Rules Firestore : un user ne peut lire que ses réservations + biens publics
- Photos publiques en lecture, écriture restreinte au propriétaire
- Numéro de téléphone validé par OTP avant 1ère réservation
- Vérification du QR : signature côté Functions (jamais de code prédit côté client)

### 4.5 Hébergement & Déploiement (en place depuis 2026-04-25)
- **Hébergeur** : Cloudflare Workers Static Assets — URL prod `https://byer.landonjouajosephpino.workers.dev`
- **Config** : `wrangler.toml` (`name = "byer"`, `[assets] directory = "./"`, SPA fallback `index.html`)
- **Exclusions** : `.assetsignore` retire `node_modules/`, `.git/`, `.github/`, scripts batch, `*.md`, `android-project/`, `supabase/`, `scripts/` (sinon `node_modules/workerd/bin/workerd` à 122 MiB dépasse la limite de 25 MiB de Cloudflare)
- **Auto-deploy CI/CD** : GitHub Actions (`.github/workflows/deploy.yml`) déclenché à chaque push sur `master`
  - Job : checkout → Node 20 → `npm ci` → `node build.js` (Babel transpile JSX → bundle.js) → `cloudflare/wrangler-action@v3`
  - Secrets stockés dans GitHub Repo Settings : `CLOUDFLARE_API_TOKEN` (token scopé Account-level, permissions Workers Scripts:Edit) + `CLOUDFLARE_ACCOUNT_ID`
  - Workflow manuel aussi disponible via `workflow_dispatch`
- **Cache busting** : à chaque release, `bundle.js?v=N` dans `index.html` + `CACHE_NAME = 'byer-vN'` dans `sw.js` doivent être bumpés manuellement (sinon le service worker garde l'ancien JS)
- **Rollback** : `npx wrangler deployments list` puis `npx wrangler rollback <version-id>` (ou interface dash.cloudflare.com)
- **Stratégie service worker** (`sw.js`) :
  - Network-first pour HTML/JS/CSS (toujours fraîche en ligne, fallback cache hors-ligne)
  - Cache-first pour libs locales (React, ReactDOM, Supabase) + icônes
  - Auto-update : `controllerchange` listener déclenche un `window.location.reload()` quand un nouveau SW prend la main

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

### 5.2 Typographie
- Famille : DM Sans (Google Fonts)
- Poids : 300, 400, 500, 600, 700 (variable opsz 9..40)

### 5.3 Composants
- Cards arrondies (radius 12-18px)
- Sheet bottom-up (transform translateY 100%->0, cubic-bezier easing)
- Bottom nav 5 onglets (Accueil/Favoris/Voyages/Messages/Profil)
- Boutons coral pour CTA principaux
- Tap effect : `transform: scale(.97)` au :active

## 6. Roadmap MVP → Prod

### MVP (en cours)
- ✅ UI complète avec données mockées
- 🔄 Migration TS + Vite
- 📋 Auth Firebase OTP
- 📋 Firestore + données réelles
- 📋 Paiement MTN MoMo (sandbox)
- 📋 Paiement Orange Money

### Beta (après MVP)
- Build APK Capacitor
- Beta testers (10-20 propriétaires + 50 locataires Douala)
- Notifications push
- Reviews & ratings
- Mode offline pour QR scan

### Prod
- Soumission Play Store
- Site marketing (sur domaine `byer.cm` ou similaire)
- Support client (email + WhatsApp Business)
- Analytics
- Internationalisation FR/EN

## 7. Risques & dépendances

### Risques techniques
- **Bundle 240KB** (React + Babel runtime) — résolu par migration Vite
- **Pas de TypeScript** — refacto = source de bugs ; solution = migration progressive fichier par fichier
- **Mock data dans `js/data.js`** — à remplacer par Firestore live, prévoir mode dev local

### Risques métier
- **Adoption MoMo/OM** dépend de la fluidité d'intégration (sandbox API)
- **Photos de biens** : qualité variable selon propriétaires, prévoir guides + filtres anti-mauvaise photo
- **Confiance** : système de reviews indispensable dès le V1

### Dépendances externes
- MTN MoMo Open API (compte développeur requis)
- Orange Money (via agrégateur CinetPay/Flutterwave probablement)
- Firebase (Auth + Firestore + Storage + Functions)
- Capacitor (build APK)

## 8. Conventions code

- React fonctionnel + hooks (pas de classes)
- État local en haut de `ByerApp` (post-migration : Zustand ou Context)
- Composants réutilisables dans `js/components.js` (post-migration : `src/components/`)
- Fichier par feature (`home.js`, `detail.js`, `gallery.js`, etc.)
- Constants en MAJUSCULES (`PROPERTIES`, `LOCATIONS`, `RATING_CRITERIA`)
- FCFA formaté via helper `fmt(n)` → "150 000 F"
- Mois formaté via `fmtM(n)` → "150 000 F/mois"
