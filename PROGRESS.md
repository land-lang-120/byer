# 📊 byer — Suivi

> Mis à jour : **2026-04-21**

| | |
|---|---|
| **Stack** | Vanilla JS multi-fichiers (~240KB bundle) |
| **Statut** | 🟠 Dev actif |
| **Type** | App événementielle / billetterie avec QR scanner |

---

## ✅ Fait

- Scanner QR pour ID invité
- Architecture multi-fichiers
- Design responsive
- Correctifs récents : erreurs CSS / PROP_TYPES, optimisation loading screens

## 🔄 En cours

- Stabilisation CSS (régressions à éliminer)
- Optimisation des écrans de chargement

## 📋 À faire

1. Créer `CAHIER-CHARGES.md` (définir cas d'usage : organisateur, contrôleur, invité)
2. Migration TypeScript + Vite
3. Firebase : Auth, Firestore (événements + invités), génération QR
4. Audit performance (bundle 240KB — le plus lourd du portfolio, à découper)
5. Tests E2E flow scan → validation invité
6. Mode offline pour scan en lieu sans réseau
7. Build APK Capacitor (rôle contrôleur essentiellement mobile)
8. Soumission Play Store
