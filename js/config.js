/* ═══════════════════════════════════════════════════
   Byer — Config
   Color tokens, constants, React hooks, helpers
   ═══════════════════════════════════════════════════ */

const { useState, useEffect, useRef } = React;

/* ── Supabase Backend ──────────────────────────────
   ⚠️  À REMPLIR par Pino après création du projet :
   Dashboard → Settings → API → URL  + anon public key
   ─────────────────────────────────────────────────── */
const SUPABASE_URL      = "https://xwqnsovfakzraafiudek.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_QxwtRGhKcJ3LCdcPJ-RNNg_1hi1BhX3";

// Détecte si Supabase est configuré (sinon on continue avec les mocks).
// Accepte 2 formats : nouvelle clé "sb_publishable_*" OU ancienne JWT (>100 chars).
const SUPABASE_READY =
  SUPABASE_URL.startsWith("https://") &&
  (SUPABASE_ANON_KEY.startsWith("sb_publishable_") || SUPABASE_ANON_KEY.length > 100);

/* ── Color Palette ── */
const C = {
  coral:  "#FF5A5F",
  black:  "#1A1A1A",
  dark:   "#2D2D2D",
  mid:    "#6B6B6B",
  light:  "#9B9B9B",
  border: "#EBEBEB",
  bg:     "#F7F7F7",
  white:  "#FFFFFF",
};

/* ── Location data ── */
const LOCATIONS = [
  { id: "cameroun", label: "Cameroun",   sub: "Position actuelle · GPS" },
  { id: "douala",   label: "Douala",     sub: "Littoral · Capitale économique" },
  { id: "yaounde",  label: "Yaoundé",    sub: "Centre · Capitale politique" },
  { id: "kribi",    label: "Kribi",      sub: "Sud · Bord de mer" },
  { id: "limbe",    label: "Limbé",      sub: "Sud-Ouest · Plages volcaniques" },
  { id: "buea",     label: "Buéa",       sub: "Sud-Ouest · Mont Cameroun" },
  { id: "bamenda",  label: "Bamenda",    sub: "Nord-Ouest · Hauts plateaux" },
  { id: "bafoussam",label: "Bafoussam",  sub: "Ouest · Pays Bamiléké" },
  { id: "garoua",   label: "Garoua",     sub: "Nord · Sahel" },
  { id: "maroua",   label: "Maroua",     sub: "Extrême-Nord" },
  { id: "ebolowa",  label: "Ebolowa",    sub: "Sud · Forêt équatoriale" },
  { id: "bertoua",  label: "Bertoua",    sub: "Est · Région forestière" },
];

/* ── Rating criteria ── */
const RATING_CRITERIA = [
  { key: "proprete",      label: "Propreté",        icon: "🧹", weight: 20 },
  { key: "emplacement",   label: "Emplacement",     icon: "📍", weight: 15 },
  { key: "communication", label: "Communication",   icon: "💬", weight: 15 },
  { key: "rapport",       label: "Rapport qualité", icon: "💰", weight: 15 },
  { key: "securite",      label: "Sécurité",        icon: "🔒", weight: 10 },
  { key: "confort",       label: "Confort",          icon: "🛋️", weight: 10 },
  { key: "equipements",   label: "Équipements",     icon: "📦", weight: 10 },
  { key: "arrivee",       label: "Arrivée",          icon: "🚪", weight: 5  },
];

/* ── User profile ── */
const USER = {
  name:   "Pino",
  avatar: "P",
  bg:     "#6366F1",
  photo:  null,
  city:   "Douala",
  since:  "mars 2025",
};

/* ── Onboarding slides ── */
const SLIDES = [
  {
    img:    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=85",
    tag:    "Logements & Véhicules",
    title:  "Trouvez\nvotre chez-vous",
    sub:    "Villas, appartements, studios, hôtels ou véhicules — tout ce dont vous avez besoin au Cameroun, en un seul endroit.",
    accent: "#FF5A5F",
  },
  {
    img:    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=85",
    tag:    "Réservation simple",
    title:  "Réservez\nen quelques taps",
    sub:    "Paiement via MTN Mobile Money, Orange Money ou virement. Recevez votre confirmation instantanément.",
    accent: "#6366F1",
  },
  {
    img:    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=85",
    tag:    "Gestion des loyers",
    title:  "Gérez vos loyers\nsans stress",
    sub:    "Rappels automatiques, historique de paiements, et notifications pour bailleurs comme locataires.",
    accent: "#16A34A",
  },
];

/* ── Payment methods ── */
const PAYMENT_METHODS = [
  { id: "mtn",      label: "MTN Mobile Money",  short: "MoMo", sub: "Paiement instantané via MoMo",   accent: "#FFCB05", textColor: "#1A1A1A" },
  { id: "orange",   label: "Orange Money",       short: "OM",   sub: "Paiement via Orange Money",       accent: "#FF6600", textColor: "white" },
  { id: "eu",       label: "Express Union",      short: "EU",   sub: "Transfert en agence",             accent: "#1B4D89", textColor: "white" },
  { id: "virement", label: "Virement bancaire",  short: "VIR",  sub: "Paiement par virement classique", accent: "#6366F1", textColor: "white" },
];

/* ── Helpers ── */
const fmt  = (n) => n ? n.toLocaleString("fr-FR") + " F" : "—";
const fmtM = (n) => n ? n.toLocaleString("fr-FR") + " F/mois" : "—";
