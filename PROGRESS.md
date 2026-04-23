# 📊 byer — Suivi

> Voir aussi : [CAHIER-CHARGES.md](CAHIER-CHARGES.md) (spec complète)
> Mis à jour : **2026-04-23**

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

## 🔄 En cours

- Stabilisation CSS (régressions à éliminer — dernier correctif récent sur PROP_TYPES)
- Optimisation des écrans de chargement (poll des 200ms en boucle dans `index.html` à remplacer par un événement)

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
