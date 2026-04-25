# 📊 byer — Suivi

> Voir aussi : [CAHIER-CHARGES.md](CAHIER-CHARGES.md) (spec complète)
> Mis à jour : **2026-04-25**

| | |
|---|---|
| **Stack** | React 18 (UMD CDN) + Babel standalone, build maison `build.js` qui concatène `js/*.js` en `bundle.js` (~240KB) |
| **Statut** | 🟠 Dev actif — UI fonctionnelle avec données mockées |
| **Type** | Marketplace location immobilier + véhicules (Cameroun) |
| **Pitch** | Trouver un logement (villa/appart/studio/hôtel) ou un véhicule (à la nuitée ou au mois), payer via MTN/Orange Money |
| **Cible géo** | 12 villes camerounaises (Douala, Yaoundé, Kribi, Limbé, Buéa, Bamenda, Bafoussam, Garoua, Maroua, Ebolowa, Bertoua + filtre national) |

---

## ✅ Fait

### UI & navigation
- Shell 5 onglets : Accueil / Favoris / Voyages / Messages / Profil
- Onboarding 3 slides (logements/véhicules, réservation, gestion loyers)
- Sélecteur de localisation (12 villes du Cameroun)
- Sheet de filtres (type, durée nuit/mois, note minimum)

### Écrans
- **HomeScreen** — liste filtrée properties + vehicles, segments (immo/véhicules), recherche
- **DetailScreen** — fiche détaillée avec galerie, note, profil propriétaire
- **GalleryScreen** — visualisation photos plein écran
- **SavedScreen** — favoris (state local `saved`)
- **TripsScreen** — historique réservations
- **MessagesScreen** — chat (UI seule, pas de backend)
- **ProfileScreen** — profil utilisateur + bouton "Mettre en location"
- **RentScreen** — formulaire mise en location
- **OwnerProfileScreen** — fiche propriétaire d'un bien

### Système de notation
- 8 critères pondérés : Propreté (20%), Emplacement (15%), Communication (15%), Rapport qualité (15%), Sécurité (10%), Confort (10%), Équipements (10%), Arrivée (5%)

### Paiement (UI seule)
- 4 méthodes affichées : MTN Mobile Money, Orange Money, Express Union, Virement bancaire
- Pas encore d'intégration paiement réel

### QR
- Scanner QR pour vérification invité (propriétaire scanne le code du locataire)
- Sheet de vérification après scan

### Loading
- Loading screen avec logo pulse + barre de progression animée
- Fade out après render React

---

## 📅 Journal — Session 2026-04-25

Phase QA active : Pino teste l'app en ligne et remonte les bugs au fur et à mesure.

### 🔓 Auth — Mode démo (bundle v22, déployé)
- `LoginScreen` : ajout d'un bouton **"Découvrir l'app sans compte"** (auth.js)
- Bypass complet de Supabase pour entrer dans l'app sans compte (utile QA + démo prospects)
- L'app retombe sur les données mockées quand Supabase n'a pas de session

### 🛠️ Owner Dashboard — 3 bugs corrigés (bundle v23, déployé)
1. **Filtre par ville absent** → ajout d'une rangée de chips `📍 Ville: Toutes / Douala / Yaoundé / …` (dérivée dynamiquement des bâtiments + véhicules du propriétaire). Les stats et les groupes par type se recalculent en fonction du filtre sélectionné.
2. **Back navigation cassée** → après ouverture d'un sous-écran depuis le Dashboard (Techniciens, Pros, Boost, Publish, fiche bâtiment), le bouton retour ré-affichait le Profil. Ajout d'un flag `returnToDashboard` dans `app.js` qui ré-ouvre le Dashboard à la fermeture des sous-écrans.
3. **Section "Mes Véhicules" inexistante** → propriétaire ne pouvait pas voir ses véhicules. Ajout d'une section horizontale (cartes scrollables : marque, modèle, année, plaque, statut, carburant, transmission, places, prix) + bouton "+ Ajouter" qui ouvre le formulaire en mode véhicule. Données sample dans `OWNERS["Ekwalla M."].vehicles` (Toyota Land Cruiser, Mercedes Classe E, Hyundai Tucson).

### 🧹 Profile menu — Doublon supprimé (bundle v24, déployé)
- Ligne **"Mes véhicules"** retirée du menu Profil (`profile.js`) — elle ouvrait par erreur le formulaire `Publier une annonce`, ce qui faisait doublon avec la ligne du dessus + créait une incohérence UX. Les véhicules restent accessibles via Dashboard → section "Mes Véhicules".

### 🚀 Infrastructure de déploiement — résolu une bonne fois pour toutes
**Problème découvert** : les commits v23 et v24 étaient bien sur GitHub `master` mais Cloudflare servait toujours v22 — il n'y avait **aucun auto-deploy**, le déploiement était strictement manuel via `wrangler deploy`. Diagnostic via `curl` sur l'URL de production qui révélait `bundle.js?v=22` malgré les pushes.

**Solution mise en place** :
1. **API Token Cloudflare** créé via le téléphone (le captcha web ne s'affichait pas sur PC, login OAuth Google/GitHub Cloudflare aussi en panne) — token Account-scoped avec permissions `Workers Scripts:Edit`.
2. Déploiement manuel v24 réussi avec `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` en variables d'environnement.
3. **GitHub Actions auto-deploy** configuré via `.github/workflows/deploy.yml` (Node 20 + `npm ci` + `node build.js` + `cloudflare/wrangler-action@v3`). Secrets stockés dans GitHub Secrets du repo.
4. **`.assetsignore`** créé pour exclure `node_modules/`, `.git/`, `.github/`, `*.md`, scripts batch, etc. du déploiement (sinon `node_modules/workerd/bin/workerd` à 122 MiB faisait échouer l'upload).

À partir de maintenant : **`git push origin master` ⇒ déploiement Cloudflare automatique en ~1 min**.

### 📦 Versions déployées dans la session
| Bundle | Cache SW | Contenu |
|---|---|---|
| `v22` | `byer-v22` | Mode démo bypass Supabase |
| `v23` | `byer-v23` | Owner Dashboard : filtre ville + back nav + section Véhicules |
| `v24` | `byer-v24` | Profile : suppression du doublon "Mes véhicules" |

---

## 🔄 En cours

- Stabilisation CSS (régressions à éliminer — dernier correctif récent sur PROP_TYPES)
- Optimisation des écrans de chargement (poll des 200ms en boucle dans `index.html` à remplacer par un événement)
- QA continue par Pino (cycle court : il teste → bug remonté → fix → push → auto-deploy → re-test)

## 📋 À faire

### Court terme (cette semaine)
1. **Créer `CAHIER-CHARGES.md`** ← fait dans cette session
2. Remplacer le poll loading par `addEventListener('byer-ready')` côté React
3. Audit CSS : extraire `BYER_CSS` (string injectée) dans un vrai fichier, voir s'il y a des doublons avec `global.css`

### Moyen terme
4. **Migration TypeScript + Vite** (sortie du CDN Babel = -200KB + bundling moderne)
5. Firebase : Auth (téléphone OTP), Firestore (annonces + réservations + messages), Storage (photos biens)
6. Intégration paiement : MTN MoMo API + Orange Money API + endpoint webhook réservation
7. Audit performance bundle (240KB dont React + Babel — on peut diviser par 3)
8. Tests E2E : flow réservation complète (parcours invité)
9. Mode offline pour QR scan (PWA déjà en place via `sw.js`)

### Long terme
10. Build APK Capacitor (rôle propriétaire = mobile principal pour QR scan)
11. Soumission Play Store
12. Analytics (Plausible ou Firebase Analytics) — KPIs : réservations, paiements, abandons
13. Internationalisation EN/FR (Cameroun bilingue)
14. Notifications push (rappel arrivée, paiement loyer, message)
