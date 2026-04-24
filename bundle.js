/* Byer — Auto-generated bundle. Do not edit manually. */


/* ═══ js/config.js ═══ */
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


/* ═══ js/supabase-client.js ═══ */
/* ═══════════════════════════════════════════════════
   Byer — Supabase Client Wrapper
   Exposé : window.byer.db
   Toutes les méthodes sont async et renvoient { data, error }.
   Si Supabase n'est pas configuré (SUPABASE_READY=false),
   les méthodes renvoient { data:null, error:{message:"offline"} }
   pour que l'UI continue de fonctionner avec les mocks.
   ═══════════════════════════════════════════════════ */

(function initSupabase() {
  // Garde : si la lib UMD n'a pas chargé, on log et on quitte proprement
  if (typeof window.supabase === "undefined" || !window.supabase.createClient) {
    console.warn("[byer] Supabase UMD library non chargée — mode mock activé");
    window.byer = window.byer || {};
    window.byer.db = makeOfflineStub();
    return;
  }

  if (!SUPABASE_READY) {
    console.warn("[byer] Clés Supabase non configurées dans config.js — mode mock activé");
    window.byer = window.byer || {};
    window.byer.db = makeOfflineStub();
    return;
  }

  // Création du client Supabase
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,        // garde la session après reload (localStorage)
      autoRefreshToken: true,      // renouvelle le JWT tout seul
      detectSessionInUrl: true,    // gère les retours OAuth/magic link
    },
    realtime: {
      params: { eventsPerSecond: 5 },
    },
  });

  console.log("[byer] ✅ Supabase client prêt — connecté à", SUPABASE_URL);

  // ──────────────────────────────────────────────────
  //  AUTH
  // ──────────────────────────────────────────────────
  const auth = {
    // Inscription email + password
    signUp: async (email, password, name) => {
      return await sb.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
    },

    // Connexion email + password
    signIn: async (email, password) => {
      return await sb.auth.signInWithPassword({ email, password });
    },

    // Connexion par lien magique (envoyé par email)
    signInMagicLink: async (email) => {
      return await sb.auth.signInWithOtp({ email });
    },

    // Connexion par OTP SMS
    signInSMS: async (phone) => {
      return await sb.auth.signInWithOtp({ phone });
    },

    verifySMS: async (phone, token) => {
      return await sb.auth.verifyOtp({ phone, token, type: "sms" });
    },

    // SSO (Google, Apple, Facebook)
    signInOAuth: async (provider) => {
      return await sb.auth.signInWithOAuth({ provider });
    },

    // Récupération de mot de passe
    resetPassword: async (email) => {
      return await sb.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/?reset=1",
      });
    },

    // Changement de mot de passe (user connecté)
    updatePassword: async (newPassword) => {
      return await sb.auth.updateUser({ password: newPassword });
    },

    // Déconnexion
    signOut: async () => sb.auth.signOut(),

    // User courant
    getUser: async () => sb.auth.getUser(),
    getSession: async () => sb.auth.getSession(),

    // Écoute les changements de session (login/logout)
    onAuthChange: (cb) => sb.auth.onAuthStateChange(cb),
  };

  // ──────────────────────────────────────────────────
  //  PROFILES
  // ──────────────────────────────────────────────────
  const profiles = {
    get: async (userId) => {
      return await sb.from("profiles").select("*").eq("id", userId).single();
    },

    update: async (userId, patch) => {
      return await sb.from("profiles").update(patch).eq("id", userId).select().single();
    },

    findByReferralCode: async (code) => {
      return await sb.from("profiles").select("id,name").eq("referral_code", code).single();
    },
  };

  // ──────────────────────────────────────────────────
  //  LISTINGS (logements + véhicules)
  // ──────────────────────────────────────────────────
  const listings = {
    list: async ({ type, city, limit = 30 } = {}) => {
      let q = sb.from("listings")
        .select("*, listing_photos(url, position)")
        .eq("is_active", true)
        .order("rating_avg", { ascending: false })
        .limit(limit);
      if (type) q = q.eq("type", type);
      if (city) q = q.eq("city", city);
      return await q;
    },

    get: async (id) => {
      return await sb.from("listings")
        .select("*, listing_photos(url, position), profiles!owner_id(name, photo_url, avatar_letter, avatar_bg, member_since)")
        .eq("id", id).single();
    },

    create: async (data) => {
      return await sb.from("listings").insert(data).select().single();
    },

    update: async (id, patch) => {
      return await sb.from("listings").update(patch).eq("id", id).select().single();
    },

    remove: async (id) => {
      return await sb.from("listings").delete().eq("id", id);
    },

    listMine: async (userId) => {
      return await sb.from("listings")
        .select("*, listing_photos(url, position)")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });
    },
  };

  // ──────────────────────────────────────────────────
  //  BOOKINGS
  // ──────────────────────────────────────────────────
  const bookings = {
    listMine: async (userId, role = "guest") => {
      const col = role === "host" ? "host_id" : "guest_id";
      return await sb.from("bookings")
        .select("*, listings(title, city, listing_photos(url))")
        .eq(col, userId)
        .order("checkin", { ascending: false });
    },

    create: async (data) => {
      return await sb.from("bookings").insert(data).select().single();
    },

    updateStatus: async (id, status) => {
      return await sb.from("bookings").update({ status }).eq("id", id).select().single();
    },
  };

  // ──────────────────────────────────────────────────
  //  CHAT (conversations + messages)
  // ──────────────────────────────────────────────────
  const chat = {
    listConversations: async (userId) => {
      return await sb.from("conversations")
        .select(`
          *,
          guest:profiles!guest_id(name, photo_url, avatar_letter, avatar_bg),
          host:profiles!host_id(name, photo_url, avatar_letter, avatar_bg),
          listings(title, city)
        `)
        .or(`guest_id.eq.${userId},host_id.eq.${userId}`)
        .order("last_message_at", { ascending: false });
    },

    getOrCreate: async (guestId, hostId, listingId) => {
      // Tente la lecture
      const { data: existing } = await sb.from("conversations")
        .select("*")
        .eq("guest_id", guestId)
        .eq("host_id", hostId)
        .eq("listing_id", listingId)
        .maybeSingle();
      if (existing) return { data: existing, error: null };
      // Sinon création
      return await sb.from("conversations")
        .insert({ guest_id: guestId, host_id: hostId, listing_id: listingId })
        .select().single();
    },

    listMessages: async (conversationId, limit = 100) => {
      return await sb.from("messages")
        .select("*, sender:profiles!sender_id(name, avatar_letter, avatar_bg)")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(limit);
    },

    sendMessage: async (conversationId, senderId, body) => {
      const { data, error } = await sb.from("messages")
        .insert({ conversation_id: conversationId, sender_id: senderId, body })
        .select().single();
      if (!error) {
        // Bumpe le last_message_at de la conv
        await sb.from("conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId);
      }
      return { data, error };
    },

    // Realtime : écoute les nouveaux messages d'une conversation
    subscribeMessages: (conversationId, onNew) => {
      const channel = sb.channel(`messages:${conversationId}`)
        .on("postgres_changes",
          { event: "INSERT", schema: "public", table: "messages",
            filter: `conversation_id=eq.${conversationId}` },
          (payload) => onNew(payload.new))
        .subscribe();
      return () => sb.removeChannel(channel); // unsubscribe
    },
  };

  // ──────────────────────────────────────────────────
  //  REVIEWS
  // ──────────────────────────────────────────────────
  const reviews = {
    listForListing: async (listingId) => {
      return await sb.from("reviews")
        .select("*, profiles!author_id(name, photo_url, avatar_letter, avatar_bg)")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false });
    },

    create: async (data) => {
      return await sb.from("reviews").insert(data).select().single();
    },

    reply: async (reviewId, replyText) => {
      return await sb.from("reviews")
        .update({ reply: replyText, reply_at: new Date().toISOString() })
        .eq("id", reviewId).select().single();
    },
  };

  // ──────────────────────────────────────────────────
  //  NOTIFICATIONS
  // ──────────────────────────────────────────────────
  const notifications = {
    listMine: async (userId, limit = 50) => {
      return await sb.from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);
    },

    markRead: async (id) => {
      return await sb.from("notifications").update({ is_read: true }).eq("id", id);
    },

    markAllRead: async (userId) => {
      return await sb.from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);
    },
  };

  // ──────────────────────────────────────────────────
  //  POINTS / COUPONS / REFERRALS
  // ──────────────────────────────────────────────────
  const rewards = {
    listPoints: async (userId) => {
      return await sb.from("points_transactions")
        .select("*").eq("user_id", userId)
        .order("created_at", { ascending: false });
    },

    listCoupons: async (userId) => {
      return await sb.from("coupons")
        .select("*").eq("user_id", userId).eq("is_used", false)
        .order("created_at", { ascending: false });
    },

    listReferrals: async (userId) => {
      return await sb.from("referrals")
        .select("*, profiles!referred_id(name, created_at)")
        .eq("referrer_id", userId);
    },
  };

  // ──────────────────────────────────────────────────
  //  STORAGE (photos d'annonces)
  // ──────────────────────────────────────────────────
  const storage = {
    // Upload d'une photo dans le bucket "listing-photos"
    uploadPhoto: async (file, listingId) => {
      const ext = file.name.split(".").pop();
      const path = `${listingId}/${Date.now()}.${ext}`;
      const { data, error } = await sb.storage
        .from("listing-photos")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) return { data: null, error };
      const { data: urlData } = sb.storage.from("listing-photos").getPublicUrl(path);
      return { data: { path, url: urlData.publicUrl }, error: null };
    },

    deletePhoto: async (path) => {
      return await sb.storage.from("listing-photos").remove([path]);
    },
  };

  // ──────────────────────────────────────────────────
  //  EXPORT GLOBAL
  // ──────────────────────────────────────────────────
  window.byer = window.byer || {};
  window.byer.db = {
    raw: sb,           // accès brut au client (pour cas avancés)
    auth,
    profiles,
    listings,
    bookings,
    chat,
    reviews,
    notifications,
    rewards,
    storage,
    isReady: true,
  };

  // ──────────────────────────────────────────────────
  //  STUB OFFLINE (fallback quand Supabase indispo)
  // ──────────────────────────────────────────────────
  function makeOfflineStub() {
    const off = async () => ({ data: null, error: { message: "Supabase non configuré" } });
    return {
      raw: null, isReady: false,
      auth: { signUp: off, signIn: off, signOut: off, getUser: off, getSession: off,
              signInMagicLink: off, signInSMS: off, verifySMS: off, signInOAuth: off,
              resetPassword: off, updatePassword: off, onAuthChange: () => () => {} },
      profiles: { get: off, update: off, findByReferralCode: off },
      listings: { list: off, get: off, create: off, update: off, remove: off, listMine: off },
      bookings: { listMine: off, create: off, updateStatus: off },
      chat: { listConversations: off, getOrCreate: off, listMessages: off, sendMessage: off,
              subscribeMessages: () => () => {} },
      reviews: { listForListing: off, create: off, reply: off },
      notifications: { listMine: off, markRead: off, markAllRead: off },
      rewards: { listPoints: off, listCoupons: off, listReferrals: off },
      storage: { uploadPhoto: off, deletePhoto: off },
    };
  }
})();


/* ═══ js/data.js ═══ */
/* Byer — Mock Data */

/* ─── LOCAL STORAGE HELPER ──────────────────────── */
// Wrapper safe : fail-silent si quotaExceeded ou localStorage indisponible (mode privé Safari)
const byerStorage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(`byer.${key}`);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`byer.${key}`, JSON.stringify(value));
      return true;
    } catch (e) {
      return false; // Quota/disabled
    }
  },
  remove(key) {
    try { localStorage.removeItem(`byer.${key}`); } catch (e) {}
  },
};

/* ─── DURATION HELPERS ─────────────────────────── */
// Toggle options par segment
const DURATION_OPTS = {
  property: [
    { id:"night", label:"Nuit" },
    { id:"month", label:"Mois" },
  ],
  vehicle: [
    { id:"day",   label:"Jour"    },
    { id:"week",  label:"Semaine" },
    { id:"month", label:"Mois"    },
  ],
};

// Calcule prix + unité pour un item selon la durée sélectionnée
function priceFor(item, dur) {
  if (item.type === "vehicle") {
    const day = item.nightPrice; // base journalière (champ commun)
    if (dur === "week")  return { price: Math.round(day * 6),  unit:"/sem",   label:"semaine" };
    if (dur === "month") return { price: Math.round(day * 22), unit:"/mois",  label:"mois"    };
    return { price: day, unit:"/jour", label:"jour" };
  }
  // property
  if (dur === "month" && item.monthPrice) return { price: item.monthPrice, unit:"/mois", label:"mois" };
  return { price: item.nightPrice, unit:"/nuit", label:"nuit" };
}

// Coordonnées GPS approximatives des villes (pour mini-carte OSM)
const CITY_COORDS = {
  "Douala":    { lat: 4.0511, lon: 9.7679  },
  "Yaoundé":   { lat: 3.8480, lon: 11.5020 },
  "Kribi":     { lat: 2.9400, lon: 9.9100  },
  "Limbé":     { lat: 4.0186, lon: 9.2031  },
  "Bafoussam": { lat: 5.4781, lon: 10.4181 },
  "Bamenda":   { lat: 5.9631, lon: 10.1591 },
  "Garoua":    { lat: 9.3017, lon: 13.3921 },
  "Maroua":    { lat: 10.595, lon: 14.3247 },
};

// Convertit une durée entre segments (utilisé au switch property↔vehicle)
function migrateDuration(prevDur, newSegment) {
  if (newSegment === "vehicle") {
    if (prevDur === "night") return "day";
    if (prevDur === "month") return "month";
    return "day";
  }
  // property
  if (prevDur === "day" || prevDur === "week") return "night";
  if (prevDur === "month") return "month";
  return "night";
}

/* ─── PROPERTY TYPE CHIPS ──────────────────────── */
const PROP_TYPES = [
  { id:"all",        label:"Tous",       icon:"grid"    },
  { id:"appartement",label:"Appart.",    icon:"home"    },
  { id:"villa",      label:"Villa",      icon:"villa"   },
  { id:"studio",     label:"Studio",     icon:"studio"  },
  { id:"hotel",      label:"Hôtel",      icon:"hotel"   },
  { id:"motel",      label:"Motel",      icon:"motel"   },
  { id:"auberge",    label:"Auberge",    icon:"auberge" },
  { id:"chambre",    label:"Chambre",    icon:"bed"     },
];

/* ─── GALLERY ──────────────────────────────────────
   Photo galleries per listing (keyed by item id).
   5 photos each with labels.
─────────────────────────────────────────────────── */
const GALLERY = {

  /* ── 1 · Villa Balnéaire Kribi ─ villa tropicale bord de mer + piscine ── */
  1: {
    labels:["Façade & piscine","Grand salon","Chambre principale","Cuisine ouverte","Vue mer"],
    imgs:[
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80", // villa tropicale piscine
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80", // salon lumineux
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", // chambre vue mer
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",   // cuisine moderne
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80", // terrasse mer
    ],
  },

  /* ── 2 · Appartement Bonamoussadi ─ appart urbain moderne ── */
  2: {
    labels:["Séjour","Chambre","Cuisine équipée","Salle de bain","Balcon"],
    imgs:[
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",   // living room moderne
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80", // chambre propre
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80", // cuisine équipée
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",   // salle de bain
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",   // immeuble balcon
    ],
  },

  /* ── 3 · Penthouse Bastos ─ luxe vue panoramique ── */
  3: {
    labels:["Terrasse rooftop","Grand salon","Suite master","Cuisine ouverte","Salle de bain luxe"],
    imgs:[
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", // penthouse extérieur
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80", // salon luxueux
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80", // chambre luxe
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",   // cuisine design
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",   // sdb marbre
    ],
  },

  /* ── 4 · Studio Ndokoti ─ studio compact fonctionnel ── */
  4: {
    labels:["Studio complet","Coin nuit","Bureau","Coin cuisine","Salle de bain"],
    imgs:[
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80", // studio vue ensemble
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80", // lit simple propre
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80", // bureau compact
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80",   // kitchenette
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",   // sdb studio
    ],
  },

  /* ── 5 · Villa Bafoussam Hills ─ villa avec jardin collines ── */
  5: {
    labels:["Façade & jardin","Salon","Chambre","Terrasse BBQ","Vue collines"],
    imgs:[
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80", // villa jardin
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80", // salon confortable
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80", // chambre cosy
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80", // terrasse verdure
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // vue collines
    ],
  },

  /* ── 6 · Chambre Limbé Plage ─ chambre côtière ── */
  6: {
    labels:["Chambre vue mer","Lit double","Salle de bain","Terrasse","Plage proche"],
    imgs:[
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", // chambre bord de mer
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80", // lit propre blanc
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",   // sdb simple
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80", // terrasse plage
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", // plage tropicale
    ],
  },

  /* ── 7 · Hôtel La Falaise ─ hôtel facade + lobby + chambres ── */
  7: {
    labels:["Façade hôtel","Lobby & réception","Chambre standard","Salle de bain","Restaurant"],
    imgs:[
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", // hotel facade
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",   // hotel lobby
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", // chambre hôtel
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80", // sdb hôtel
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", // restaurant hôtel
    ],
  },

  /* ── 8 · Motel Autoroute Douala ─ motel simple fonctionnel ── */
  8: {
    labels:["Extérieur motel","Chambre","Bureau","Salle de bain","Parking"],
    imgs:[
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", // motel extérieur
      "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=800&q=80", // chambre simple
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80", // bureau tv
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",   // sdb basique
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",   // parking
    ],
  },

  /* ── 9 · Auberge du Voyageur ─ auberge de jeunesse conviviale ── */
  9: {
    labels:["Entrée auberge","Dortoir","Cuisine commune","Espace détente","Jardin"],
    imgs:[
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",   // entrée auberge
      "https://images.unsplash.com/photo-1520277739336-7bf67a832e24?w=800&q=80", // dortoir lits superposés
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",   // cuisine commune
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80", // salon commun
      "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80", // jardin détente
    ],
  },

  /* ── 10 · Toyota Land Cruiser ── */
  10: {
    labels:["Face avant","Profil droit","Intérieur","Tableau de bord","Coffre"],
    imgs:[
      "https://images.unsplash.com/photo-1594502184342-2e12f877aa17?w=800&q=80", // 4x4 land cruiser face
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80", // suv profil 4x4
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80", // intérieur 4x4 cuir
      "https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&q=80", // tableau de bord moderne
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80", // coffre suv ouvert
    ],
  },

  /* ── 11 · Hyundai Tucson ── */
  11: {
    labels:["Face avant","Profil gauche","Habitacle","Console centrale","Arrière"],
    imgs:[
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",   // tucson face
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",   // suv côté
      "https://images.unsplash.com/photo-1605559424843-9073c6e09a6b?w=800&q=80", // intérieur propre
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80", // console
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80", // arrière suv
    ],
  },

  /* ── 12 · Mercedes Classe E ── */
  12: {
    labels:["Face avant","3/4 arrière","Cuir intérieur","Tableau de bord","Jantes AMG"],
    imgs:[
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80",   // mercedes face
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80", // mercedes 3/4
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", // cuir beige luxe
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80", // tableau de bord luxe
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",   // jantes
    ],
  },

  /* ── 13 · Appart. Bonapriso Neuf ─ appartement neuf haut standing ── */
  13: {
    labels:["Séjour moderne","Chambre master","2ème chambre","Cuisine","Balcon vue"],
    imgs:[
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", // appart neuf salon
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80", // chambre haut standing
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", // 2e chambre
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80", // cuisine moderne
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",   // balcon immeuble neuf
    ],
  },
};

/* ─── PROPERTIES ───────────────────────────────────
   10 property listings across Cameroon.
   nightPrice = prix/nuit  |  monthPrice = prix/mois (null = non disponible)
─────────────────────────────────────────────────── */
const PROPERTIES = [
  { id:1,  type:"property", propType:"villa",       title:"Villa Balnéaire Kribi",    city:"Kribi",     zone:"Bord de mer",    nightPrice:75000,  monthPrice:1200000, rating:4.96, reviews:89,  superhost:true,  beds:4, baths:3, guests:8,  amenities:["Piscine","Vue mer","Terrasse","WiFi"] },
  { id:2,  type:"property", propType:"appartement", title:"Appartement Bonamoussadi", city:"Douala",    zone:"Bonamoussadi",   nightPrice:35000,  monthPrice:450000,  rating:4.82, reviews:134, superhost:false, beds:2, baths:1, guests:4,  amenities:["Climatisé","Parking","WiFi fibre"] },
  { id:3,  type:"property", propType:"villa",       title:"Penthouse Bastos",         city:"Yaoundé",   zone:"Bastos",         nightPrice:120000, monthPrice:1800000, rating:5.0,  reviews:42,  superhost:true,  beds:5, baths:4, guests:10, amenities:["Rooftop","Conciergerie","Gardien","Smart TV"] },
  { id:4,  type:"property", propType:"studio",      title:"Studio Ndokoti",           city:"Douala",    zone:"Ndokoti",        nightPrice:18000,  monthPrice:220000,  rating:4.71, reviews:201, superhost:false, beds:1, baths:1, guests:2,  amenities:["Climatisé","Eau chaude"] },
  { id:5,  type:"property", propType:"villa",       title:"Villa Bafoussam Hills",    city:"Bafoussam", zone:"Tamdja",         nightPrice:55000,  monthPrice:750000,  rating:4.91, reviews:67,  superhost:true,  beds:3, baths:2, guests:6,  amenities:["Jardin","BBQ","Vue collines"] },
  { id:6,  type:"property", propType:"chambre",     title:"Chambre Limbé Plage",      city:"Limbé",     zone:"Down Beach",     nightPrice:22000,  monthPrice:280000,  rating:4.78, reviews:56,  superhost:false, beds:1, baths:1, guests:2,  amenities:["Plage 2min","Petit-déj"] },
  { id:7,  type:"property", propType:"hotel",       title:"Hôtel La Falaise",         city:"Yaoundé",   zone:"Hippodrome",     nightPrice:65000,  monthPrice:null,    rating:4.85, reviews:312, superhost:true,  beds:1, baths:1, guests:2,  amenities:["Room service","Piscine","Restaurant","Bar","WiFi"] },
  { id:8,  type:"property", propType:"motel",       title:"Motel Autoroute Douala",   city:"Douala",    zone:"PK12",           nightPrice:25000,  monthPrice:null,    rating:4.55, reviews:88,  superhost:false, beds:1, baths:1, guests:2,  amenities:["Parking gratuit","Climatisé","TV satellite"] },
  { id:9,  type:"property", propType:"auberge",     title:"Auberge du Voyageur",      city:"Kribi",     zone:"Centre",         nightPrice:12000,  monthPrice:150000,  rating:4.67, reviews:145, superhost:false, beds:1, baths:1, guests:2,  amenities:["Cuisine commune","WiFi","Casiers","Ambiance"] },
  { id:13, type:"property", propType:"appartement", title:"Appart. Bonapriso Neuf",   city:"Douala",    zone:"Bonapriso",      nightPrice:48000,  monthPrice:580000,  rating:4.88, reviews:72,  superhost:true,  beds:3, baths:2, guests:6,  amenities:["Gardienné","Groupe électrogène","WiFi","Parking"] },
];

/* ─── VEHICLES ─────────────────────────────────────
   3 vehicle listings
─────────────────────────────────────────────────── */
const VEHICLES = [
  { id:10, type:"vehicle", title:"Toyota Land Cruiser 2022", city:"Douala",    zone:"Akwa",           nightPrice:55000, monthPrice:1100000, rating:4.95, reviews:61, superhost:true,  seats:7,  fuel:"Essence", trans:"Automatique", consumption:11.5, amenities:["4×4","GPS","Climatisé","Chauffeur optionnel"] },
  { id:11, type:"vehicle", title:"Hyundai Tucson 2023",      city:"Yaoundé",   zone:"Centre-ville",   nightPrice:40000, monthPrice:800000,  rating:4.88, reviews:44, superhost:false, seats:5,  fuel:"Essence", trans:"Automatique", consumption:8.2,  amenities:["GPS","Climatisé","Bluetooth"] },
  { id:12, type:"vehicle", title:"Mercedes Classe E 2021",   city:"Douala",    zone:"Bonapriso",      nightPrice:85000, monthPrice:1700000, rating:5.0,  reviews:29, superhost:true,  seats:5,  fuel:"Diesel",  trans:"Automatique", consumption:6.5,  amenities:["Luxe","Chauffeur","Wifi embarqué"] },
  { id:13, type:"vehicle", title:"Toyota Yaris 2022",        city:"Yaoundé",   zone:"Mvan",           nightPrice:18000, monthPrice:360000,  rating:4.6,  reviews:38, superhost:false, seats:5,  fuel:"Essence", trans:"Manuelle",    consumption:5.4,  amenities:["Climatisé","Bluetooth","USB"] },
  { id:14, type:"vehicle", title:"Kia Picanto 2023",         city:"Douala",    zone:"Bonamoussadi",   nightPrice:15000, monthPrice:300000,  rating:4.5,  reviews:52, superhost:false, seats:4,  fuel:"Essence", trans:"Manuelle",    consumption:4.9,  amenities:["Climatisé","Économique","Bluetooth"] },
  { id:15, type:"vehicle", title:"Nissan Patrol 2021",       city:"Kribi",     zone:"Bord de mer",    nightPrice:65000, monthPrice:1300000, rating:4.85, reviews:18, superhost:true,  seats:7,  fuel:"Diesel",  trans:"Automatique", consumption:10.8, amenities:["4×4","GPS","Climatisé","Tout-terrain"] },
  { id:16, type:"vehicle", title:"Renault Duster 2022",      city:"Bafoussam", zone:"Centre",         nightPrice:28000, monthPrice:560000,  rating:4.7,  reviews:24, superhost:false, seats:5,  fuel:"Diesel",  trans:"Manuelle",    consumption:6.3,  amenities:["SUV compact","GPS","Climatisé"] },
  { id:17, type:"vehicle", title:"Ford Ranger 2023",         city:"Limbé",     zone:"Down Beach",     nightPrice:50000, monthPrice:1000000, rating:4.9,  reviews:14, superhost:true,  seats:5,  fuel:"Diesel",  trans:"Automatique", consumption:9.1,  amenities:["Pickup","4×4","Climatisé","Caméra recul"] },
  { id:18, type:"vehicle", title:"BMW Série 3 2022",         city:"Douala",    zone:"Bonanjo",        nightPrice:75000, monthPrice:1500000, rating:4.95, reviews:21, superhost:true,  seats:5,  fuel:"Essence", trans:"Automatique", consumption:7.2,  amenities:["Premium","Cuir","Wifi embarqué","Caméra 360°"] },
];

/* ─── RATINGS DÉTAILLÉES ───────────────────────────
   8 critères : Propreté · Confort · Accessibilité ·
   Convivialité · Emplacement · Sécurité ·
   Équipement · Rapport qualité/prix
   Chaque note est sur 5. La note globale = moyenne.
─────────────────────────────────────────────────── */
const RATINGS = {
  1:  { proprete:5.0, confort:4.9, accessibilite:4.8, convivialite:5.0, emplacement:4.9, securite:4.9, equipement:4.8, qualitePrix:4.8 },
  2:  { proprete:4.8, confort:4.7, accessibilite:4.9, convivialite:4.8, emplacement:4.7, securite:4.8, equipement:4.7, qualitePrix:4.9 },
  3:  { proprete:5.0, confort:5.0, accessibilite:4.9, convivialite:5.0, emplacement:5.0, securite:5.0, equipement:5.0, qualitePrix:4.9 },
  4:  { proprete:4.6, confort:4.5, accessibilite:4.8, convivialite:4.7, emplacement:4.6, securite:4.5, equipement:4.4, qualitePrix:4.8 },
  5:  { proprete:4.9, confort:4.9, accessibilite:4.7, convivialite:5.0, emplacement:4.8, securite:4.8, equipement:4.7, qualitePrix:4.9 },
  6:  { proprete:4.8, confort:4.7, accessibilite:4.6, convivialite:4.8, emplacement:5.0, securite:4.6, equipement:4.5, qualitePrix:4.7 },
  7:  { proprete:4.9, confort:4.8, accessibilite:4.9, convivialite:4.8, emplacement:4.7, securite:4.9, equipement:4.9, qualitePrix:4.7 },
  8:  { proprete:4.5, confort:4.4, accessibilite:4.8, convivialite:4.5, emplacement:4.5, securite:4.4, equipement:4.3, qualitePrix:4.6 },
  9:  { proprete:4.7, confort:4.5, accessibilite:4.6, convivialite:4.9, emplacement:4.6, securite:4.5, equipement:4.4, qualitePrix:4.8 },
  10: { proprete:4.9, confort:4.9, accessibilite:4.8, convivialite:5.0, emplacement:4.9, securite:5.0, equipement:4.9, qualitePrix:4.8 },
  11: { proprete:4.9, confort:4.8, accessibilite:4.9, convivialite:4.9, emplacement:4.8, securite:4.9, equipement:4.8, qualitePrix:4.8 },
  12: { proprete:5.0, confort:5.0, accessibilite:5.0, convivialite:5.0, emplacement:5.0, securite:5.0, equipement:5.0, qualitePrix:4.9 },
  13: { proprete:4.9, confort:4.8, accessibilite:5.0, convivialite:4.9, emplacement:4.8, securite:4.9, equipement:4.9, qualitePrix:4.9 },
};

/* ─── SAMPLE REVIEWS ──────────────────────────────── */
const SAMPLE_REVIEWS = {
  1:  [
    { name:"Kofi A.",   date:"Fév. 2025", score:5.0, text:"Villa impeccable, propreté irréprochable et vue sur mer magnifique. L'hôte est très disponible.", avatar:"K", bg:"#6366F1", photo:"https://i.pravatar.cc/80?u=kofia" },
    { name:"Mariama D.",date:"Jan. 2025", score:4.9, text:"Séjour parfait en famille. La piscine est un vrai plus. Je recommande vivement !", avatar:"M", bg:"#0EA5E9", photo:"https://i.pravatar.cc/80?u=mariamd" },
  ],
  2:  [
    { name:"Thierry N.", date:"Mars 2025", score:4.8, text:"Appartement propre et bien situé. Le WiFi est excellent. Hôte réactif.", avatar:"T", bg:"#F59E0B", photo:"https://i.pravatar.cc/80?u=thierry" },
    { name:"Fatou S.",   date:"Fév. 2025", score:4.7, text:"Bon rapport qualité/prix. Le parking est pratique. Je reviendrai.", avatar:"F", bg:"#EF4444", photo:"https://i.pravatar.cc/80?u=fatous" },
  ],
  3:  [
    { name:"Rodrigue F.",date:"Mars 2025", score:5.0, text:"Penthouse exceptionnel ! Vue panoramique sur Yaoundé, équipements haut de gamme.", avatar:"R", bg:"#8B5CF6", photo:"https://i.pravatar.cc/80?u=rodriguef" },
    { name:"Amina B.",   date:"Fév. 2025", score:5.0, text:"Le meilleur séjour de ma vie à Yaoundé. Service de conciergerie au top.", avatar:"A", bg:"#10B981", photo:"https://i.pravatar.cc/80?u=aminab" },
  ],
  4:  [{ name:"Patrick K.",date:"Mars 2025", score:4.7, text:"Studio fonctionnel, bien équipé. Idéal pour un séjour seul.", avatar:"P", bg:"#F59E0B", photo:"https://i.pravatar.cc/80?u=patrickk" }],
  5:  [{ name:"Nadège T.", date:"Fév. 2025", score:4.9, text:"Villa magnifique avec une vue imprenable sur les collines. Très paisible.", avatar:"N", bg:"#6366F1", photo:"https://i.pravatar.cc/80?u=nadeget" }],
  6:  [{ name:"Eric M.",   date:"Jan. 2025", score:4.8, text:"À 2 minutes de la plage ! Petit déjeuner inclus, accueil chaleureux.", avatar:"E", bg:"#0EA5E9", photo:"https://i.pravatar.cc/80?u=ericm" }],
  7:  [{ name:"Sophie L.", date:"Mars 2025", score:4.9, text:"Hôtel très professionnel. Chambre impeccable, restaurant excellent.", avatar:"S", bg:"#8B5CF6", photo:"https://i.pravatar.cc/80?u=sophiel" }],
  8:  [{ name:"Jean-Paul N.",date:"Fév. 2025", score:4.5, text:"Motel propre et pratique pour une étape. Parking spacieux.", avatar:"J", bg:"#64748B", photo:"https://i.pravatar.cc/80?u=jeanpauln" }],
  9:  [{ name:"Clémentine A.",date:"Jan. 2025", score:4.7, text:"Auberge avec une super ambiance. J'ai rencontré des voyageurs du monde entier.", avatar:"C", bg:"#EA580C", photo:"https://i.pravatar.cc/80?u=clemantinea" }],
  13: [{ name:"Serge B.",  date:"Mars 2025", score:4.9, text:"Appartement neuf et très bien situé à Bonapriso. Groupe électrogène très apprécié !", avatar:"S", bg:"#16A34A", photo:"https://i.pravatar.cc/80?u=sergeb" }],
  10: [{ name:"Claude E.", date:"Mars 2025", score:4.9, text:"Land Cruiser en parfait état. Chauffeur très professionnel.", avatar:"C", bg:"#6366F1", photo:"https://i.pravatar.cc/80?u=claudee" }],
  11: [{ name:"Brigitte F.",date:"Fév. 2025", score:4.8, text:"Tucson impeccable, GPS fonctionnel. Location très fluide.", avatar:"B", bg:"#F59E0B", photo:"https://i.pravatar.cc/80?u=brigittef" }],
  12: [{ name:"Michel A.", date:"Mars 2025", score:5.0, text:"Classe E de rêve. Intérieur cuir parfait, chauffeur élégant.", avatar:"M", bg:"#0EA5E9", photo:"https://i.pravatar.cc/80?u=michela" }],
};

/* ─── OWNER PORTFOLIOS ─────────────────────────────
   Chaque propriétaire possède un ou plusieurs immeubles/
   établissements, chacun contenant des unités (appartements,
   chambres, studios…). Un hôtel = établissement parent
   avec types de chambres comme unités enfants.
─────────────────────────────────────────────────── */
const OWNERS = {
  "Ekwalla M.": {
    id:"O1", name:"Ekwalla M.", since:"2019", city:"Douala",
    avatar:"E", avatarBg:"#6366F1",
    photo:"https://i.pravatar.cc/120?u=ekwallam",
    superhost:true, rating:4.88, reviews:347,
    about:"Propriétaire professionnel à Douala depuis 2019. Je gère mes biens en personne pour garantir un séjour de qualité.",
    buildings: [
      {
        id:"B1", name:"Résidence Les Palmiers", address:"Rue Ivy, Bonamoussadi, Douala",
        type:"immeuble", floors:4, img:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
        units:[
          { id:2,  label:"Appart. 2A · 2 ch.",  floor:"2ème",  propType:"appartement", nightPrice:35000, monthPrice:450000,  available:true,  availableFrom:null },
          { id:13, label:"Appart. 3B · 3 ch.",  floor:"3ème",  propType:"appartement", nightPrice:48000, monthPrice:580000,  available:false, availableFrom:"26 mars 2025" },
          { id:4,  label:"Studio 1C",            floor:"1er",   propType:"studio",      nightPrice:18000, monthPrice:220000,  available:true,  availableFrom:null },
          { id:"U5", label:"Studio 1D",          floor:"1er",   propType:"studio",      nightPrice:18000, monthPrice:220000,  available:false, availableFrom:"1 avr. 2025" },
          { id:"U6", label:"Chambre 4A",         floor:"4ème",  propType:"chambre",     nightPrice:12000, monthPrice:140000,  available:true,  availableFrom:null },
        ],
      },
      {
        id:"B2", name:"Villa Akwa Prestige", address:"Rue de la Paix, Akwa, Douala",
        type:"villa", floors:2, img:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
        units:[
          { id:"U7", label:"Villa entière",    floor:"Entier", propType:"villa",       nightPrice:95000, monthPrice:1400000, available:true,  availableFrom:null },
          { id:"U8", label:"Suite principale", floor:"1er",    propType:"chambre",     nightPrice:45000, monthPrice:null,    available:true,  availableFrom:null },
        ],
      },
    ],
  },
  "Fouda R.": {
    id:"O2", name:"Fouda R.", since:"2021", city:"Yaoundé",
    avatar:"F", avatarBg:"#0EA5E9",
    photo:"https://i.pravatar.cc/120?u=foudar",
    superhost:true, rating:4.95, reviews:201,
    about:"Gestionnaire d'hôtels et de résidences premium à Yaoundé. Qualité et service haut de gamme.",
    buildings:[
      {
        id:"B3", name:"Hôtel La Falaise", address:"Avenue Hippodrome, Yaoundé",
        type:"hotel", floors:6, img:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        units:[
          { id:7,    label:"Chambre Standard",  floor:"2–3ème", propType:"chambre",    nightPrice:45000, monthPrice:null,   available:true,  availableFrom:null,          count:8  },
          { id:"U9", label:"Chambre Supérieure",floor:"4ème",   propType:"chambre",    nightPrice:65000, monthPrice:null,   available:false, availableFrom:"24 mars 2025", count:4  },
          { id:"U10",label:"Suite Junior",      floor:"5ème",   propType:"chambre",    nightPrice:95000, monthPrice:null,   available:true,  availableFrom:null,          count:3  },
          { id:"U11",label:"Suite Présidentielle",floor:"6ème", propType:"chambre",    nightPrice:180000,monthPrice:null,   available:false, availableFrom:"28 mars 2025", count:1  },
        ],
      },
      {
        id:"B4", name:"Penthouse Bastos", address:"Quartier Bastos, Yaoundé",
        type:"villa", floors:2, img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
        units:[
          { id:3, label:"Penthouse complet", floor:"Entier", propType:"villa", nightPrice:120000, monthPrice:1800000, available:true, availableFrom:null },
        ],
      },
    ],
  },
};

/* ─── AVAILABILITY MAP ─────────────────────────────
   Simule les réservations actives qui bloquent un bien.
   Dans une vraie app : données serveur en temps réel.
─────────────────────────────────────────────────── */
const BOOKED_UNTIL = {
  13: "26 mars 2025",   // Appart. 3B réservé
  "U5": "1 avr. 2025",  // Studio 1D réservé
  "U9": "24 mars 2025", // Chambre Supérieure hôtel
  "U11":"28 mars 2025", // Suite Présidentielle
};

/* ─── RENT SCREEN CONSTANTS ────────────────────────
   Dates et seuils pour l'écran de loyers
─────────────────────────────────────────────────── */
const TODAY      = new Date("2025-03-22");
const DEADLINE_1 = new Date("2025-03-31"); // fin du mois courant
const DAYS_LEFT  = Math.ceil((DEADLINE_1 - TODAY) / 86400000); // 9 jours
const WARN       = DAYS_LEFT <= 7; // rappel actif si <= 7 jours

/* ─── LOYERS — VUE LOCATAIRE ───────────────────────── */
const LOYERS_LOCATAIRE = [
  {
    id:"L1", logement:"Appartement Bonamoussadi", bailleur:"Ekwalla M.",
    montant:450000, echeance:"31 mars 2025", statut:"en_attente",
    joursRestants: DAYS_LEFT, rappelActif: WARN,
  },
  {
    id:"L2", logement:"Appartement Bonamoussadi", bailleur:"Ekwalla M.",
    montant:450000, echeance:"28 fév. 2025", statut:"payé",
    datePaiement:"25 fév. 2025", methode:"MTN Mobile Money", ref:"MTN250225KD91",
  },
  {
    id:"L3", logement:"Appartement Bonamoussadi", bailleur:"Ekwalla M.",
    montant:450000, echeance:"31 jan. 2025", statut:"payé",
    datePaiement:"28 jan. 2025", methode:"Orange Money", ref:"OM250128AX44",
  },
  {
    id:"L4", logement:"Appartement Bonamoussadi", bailleur:"Ekwalla M.",
    montant:450000, echeance:"31 déc. 2024", statut:"payé",
    datePaiement:"29 déc. 2024", methode:"Express Union", ref:"EU241229BM07",
  },
];

/* ─── LOYERS — VUE BAILLEUR ────────────────────────── */
const LOYERS_BAILLEUR = [
  {
    id:"B1", locataire:"Kamga P.", logement:"Studio Ndokoti",
    montant:220000, echeance:"31 mars 2025", statut:"en_attente",
    joursRestants: DAYS_LEFT, rappelEnvoye: false,
  },
  {
    id:"B2", locataire:"Nguema A.", logement:"Appart. Bonapriso Neuf",
    montant:580000, echeance:"31 mars 2025", statut:"payé",
    datePaiement:"20 mars 2025", methode:"MTN Mobile Money", ref:"MTN250320NG55",
  },
  {
    id:"B3", locataire:"Mballa T.", logement:"Villa Bafoussam Hills",
    montant:750000, echeance:"31 mars 2025", statut:"en_retard",
    joursRestants:-3, rappelEnvoye: true,
  },
  {
    id:"B4", locataire:"Kamga P.", logement:"Studio Ndokoti",
    montant:220000, echeance:"28 fév. 2025", statut:"payé",
    datePaiement:"26 fév. 2025", methode:"Orange Money", ref:"OM250226KP12",
  },
  {
    id:"B5", locataire:"Mballa T.", logement:"Villa Bafoussam Hills",
    montant:750000, echeance:"28 fév. 2025", statut:"payé",
    datePaiement:"27 fév. 2025", methode:"Virement bancaire", ref:"VIR250227MT88",
  },
];

/* ─── CONVERSATIONS ────────────────────────────────
   4 conversations avec messages
─────────────────────────────────────────────────── */
const CONVERSATIONS_DATA = [
  {
    id:"C1", role:"locataire",
    contact:"Ekwalla M.", contactRole:"Bailleur",
    logement:"Appartement Bonamoussadi",
    avatar:"E", avatarBg:"#6366F1",
    photo:"https://i.pravatar.cc/80?u=ekwallam",
    lastMsg:"Bonjour, tout est prêt pour votre arrivée demain.",
    lastTime:"10:42", unread:2, blocked:false,
    messages:[
      {id:1, from:"them", text:"Bonjour, avez-vous bien reçu la confirmation de votre réservation ?", time:"09:15"},
      {id:2, from:"me",   text:"Oui merci, tout est parfait !", time:"09:22"},
      {id:3, from:"them", text:"N'hésitez pas si vous avez des questions sur l'appartement.", time:"09:45"},
      {id:4, from:"me",   text:"Super ! Quelle est l'adresse exacte et le code de la porte ?", time:"10:10"},
      {id:5, from:"them", text:"L'adresse est Rue Ivy, Bonamoussadi. Code porte : 4521.", time:"10:38"},
      {id:6, from:"them", text:"Bonjour, tout est prêt pour votre arrivée demain.", time:"10:42"},
    ],
  },
  {
    id:"C2", role:"locataire",
    contact:"Atangana B.", contactRole:"Bailleur",
    logement:"Villa Balnéaire Kribi",
    avatar:"A", avatarBg:"#0EA5E9",
    photo:"https://i.pravatar.cc/80?u=atanganab",
    lastMsg:"Le ménage sera fait avant votre arrivée",
    lastTime:"Hier", unread:0, blocked:false,
    messages:[
      {id:1, from:"me",   text:"Bonjour, est-ce que la piscine sera disponible pendant notre séjour ?", time:"14:00"},
      {id:2, from:"them", text:"Absolument, elle est chauffée et accessible 24h/24.", time:"14:20"},
      {id:3, from:"me",   text:"Parfait, merci beaucoup !", time:"14:35"},
      {id:4, from:"them", text:"Le ménage sera fait avant votre arrivée", time:"15:00"},
    ],
  },
  {
    id:"C3", role:"bailleur",
    contact:"Kamga P.", contactRole:"Locataire",
    logement:"Studio Ndokoti",
    avatar:"K", avatarBg:"#F59E0B",
    photo:"https://i.pravatar.cc/80?u=kamgap",
    lastMsg:"D'accord, je procède au paiement ce soir.",
    lastTime:"Lun.", unread:0, blocked:false,
    messages:[
      {id:1, from:"them", text:"Bonjour, est-il possible de décaler l'échéance de 3 jours ?", time:"08:00"},
      {id:2, from:"me",   text:"Bonjour Kamga, malheureusement l'échéance est fixée au 31.", time:"08:30"},
      {id:3, from:"them", text:"Je comprends, je ferai le nécessaire.", time:"09:00"},
      {id:4, from:"them", text:"D'accord, je procède au paiement ce soir.", time:"09:15"},
    ],
  },
  {
    id:"C4", role:"bailleur",
    contact:"Mballa T.", contactRole:"Locataire",
    logement:"Villa Bafoussam Hills",
    avatar:"M", avatarBg:"#EF4444",
    photo:"https://i.pravatar.cc/80?u=mballat",
    lastMsg:"Je ne peux pas payer ce mois-ci.",
    lastTime:"Dim.", unread:1, blocked:false,
    messages:[
      {id:1, from:"them", text:"Bonjour, j'ai un souci financier ce mois.", time:"18:00"},
      {id:2, from:"me",   text:"Bonjour, le loyer reste dû à la date prévue.", time:"18:30"},
      {id:3, from:"them", text:"Je comprends mais la situation est difficile.", time:"19:00"},
      {id:4, from:"them", text:"Je ne peux pas payer ce mois-ci.", time:"20:00"},
    ],
  },
];

/* ─── BOOKINGS ─────────────────────────────────────
   4 bookings (active, upcoming, past)
─────────────────────────────────────────────────── */
const BOOKINGS = [
  {
    id:"R1", status:"active",
    title:"Appartement Bonamoussadi", type:"property",
    city:"Douala", zone:"Bonamoussadi",
    address:"Rue Ivy, Bonamoussadi, Douala",
    host:"Ekwalla M.", hostPhoto:"https://i.pravatar.cc/80?img=33",
    checkIn:"22 mars 2025", checkOut:"25 mars 2025",
    nights:3, price:35000,
    img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    lat:4.0667, lng:9.7500, ref:"BYR-2025-0322-A",
    amenities:["Climatisé","Parking","WiFi fibre"],
  },
  {
    id:"R2", status:"upcoming",
    title:"Villa Balnéaire Kribi", type:"property",
    city:"Kribi", zone:"Bord de mer",
    address:"Avenue de la Plage, Kribi",
    host:"Atangana B.", hostPhoto:"https://i.pravatar.cc/80?img=11",
    checkIn:"10 avr. 2025", checkOut:"14 avr. 2025",
    nights:4, price:75000,
    img:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    lat:2.9390, lng:9.9090, ref:"BYR-2025-0410-B",
    amenities:["Piscine","Vue mer","Terrasse"],
  },
  {
    id:"R3", status:"upcoming",
    title:"Toyota Land Cruiser 2022", type:"vehicle",
    city:"Douala", zone:"Akwa",
    address:"Agence Byer, Avenue de Gaulle, Akwa, Douala",
    host:"Mbarga C.", hostPhoto:"https://i.pravatar.cc/80?img=57",
    checkIn:"22 mars 2025", checkOut:"24 mars 2025",
    nights:2, price:55000,
    img:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    lat:4.0472, lng:9.6952, ref:"BYR-2025-0322-C",
    amenities:["4×4","GPS","Climatisé"],
  },
  {
    id:"R4", status:"past",
    title:"Penthouse Bastos", type:"property",
    city:"Yaoundé", zone:"Bastos",
    address:"Quartier Bastos, Yaoundé",
    host:"Fouda R.", hostPhoto:"https://i.pravatar.cc/80?img=14",
    checkIn:"1 fév. 2025", checkOut:"4 fév. 2025",
    nights:3, price:120000,
    img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    lat:3.8780, lng:11.5360, ref:"BYR-2025-0201-D",
    amenities:["Rooftop","Conciergerie","Smart TV"],
  },
];

/* ─── STATUS CONFIG ────────────────────────────────
   Booking status labels and colors
─────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  active:   { label:"En cours",   bg:"#F0FDF4", color:"#16A34A", dot:"#16A34A" },
  upcoming: { label:"À venir",    bg:"#EFF6FF", color:"#2563EB", dot:"#2563EB" },
  past:     { label:"Terminé",    bg:C.bg,      color:C.mid,     dot:C.light   },
};

/* ─── STAR LABELS ─────────────────────────────────── */
const STAR_LABELS = { 1:"Mauvais", 2:"Moyen", 3:"Bien", 4:"Très bien", 5:"Excellent" };

/* ═══════════════════════════════════════════════════
   TECHNICIANS — Mock Data
   ═══════════════════════════════════════════════════ */
const TECH_CATEGORIES = [
  { id:"plomberie",    label:"Plomberie",    icon:"🔧", color:"#2563EB" },
  { id:"electronique", label:"Électronique", icon:"⚡", color:"#F59E0B" },
  { id:"menuiserie",   label:"Menuiserie",   icon:"🪚", color:"#16A34A" },
  { id:"mecanique",    label:"Mécanique",    icon:"🔩", color:"#EF4444" },
  { id:"peinture",     label:"Peinture",     icon:"🎨", color:"#8B5CF6" },
  { id:"climatisation",label:"Climatisation",icon:"❄️", color:"#0EA5E9" },
];

const TECHNICIANS = [
  { id:"T1", name:"Njoh Bernard",    category:"plomberie",    phone:"+237 6 90 12 34 56", rating:4.9, jobs:87,  photo:"https://i.pravatar.cc/100?u=njohb",    city:"Douala",   zone:"Bonamoussadi", available:true,  verified:true,  about:"Plombier professionnel avec 12 ans d'expérience. Interventions rapides et propres." },
  { id:"T2", name:"Tamba Paul",      category:"electronique", phone:"+237 6 77 88 99 00", rating:4.8, jobs:124, photo:"https://i.pravatar.cc/100?u=tambap",    city:"Douala",   zone:"Akwa",         available:true,  verified:true,  about:"Électricien certifié, installations neuves et dépannage. Disponible 7j/7." },
  { id:"T3", name:"Fotso Emmanuel",  category:"menuiserie",   phone:"+237 6 55 44 33 22", rating:4.7, jobs:63,  photo:"https://i.pravatar.cc/100?u=fotsoe",   city:"Yaoundé",  zone:"Bastos",       available:false, verified:true,  about:"Menuisier ébéniste, fabrication sur mesure et réparations." },
  { id:"T4", name:"Mbarga Charles",  category:"mecanique",    phone:"+237 6 99 88 77 66", rating:4.6, jobs:201, photo:"https://i.pravatar.cc/100?u=mbargac",   city:"Douala",   zone:"PK12",         available:true,  verified:true,  about:"Mécanicien auto toutes marques. Diagnostic et réparations rapides." },
  { id:"T5", name:"Ateba Simon",     category:"peinture",     phone:"+237 6 11 22 33 44", rating:4.9, jobs:45,  photo:"https://i.pravatar.cc/100?u=atebas",   city:"Yaoundé",  zone:"Mvan",         available:true,  verified:false, about:"Peintre décorateur, finitions impeccables. Devis gratuit." },
  { id:"T6", name:"Ngono Michel",    category:"climatisation",phone:"+237 6 66 55 44 33", rating:4.8, jobs:92,  photo:"https://i.pravatar.cc/100?u=ngonom",   city:"Douala",   zone:"Bonapriso",    available:true,  verified:true,  about:"Spécialiste climatisation et ventilation. Installation et maintenance." },
];

/* Owner's assigned technicians (by owner id) */
const OWNER_TECHNICIANS = {
  "Ekwalla M.": ["T1","T2","T6"],
  "Fouda R.":   ["T3","T5"],
};

/* ═══════════════════════════════════════════════════
   CONCIERGES & AGENTS IMMOBILIERS — Mock Data
   ═══════════════════════════════════════════════════ */
const PRO_CATEGORIES = [
  { id:"conciergerie",   label:"Conciergerie",         icon:"🛎️", color:"#9333EA",
    desc:"Gestion locative, accueil voyageurs, ménage, check-in/out." },
  { id:"agent_immo",     label:"Agent immobilier",     icon:"🏘️", color:"#0EA5E9",
    desc:"Recherche, négociation, visites, mise en location ou vente." },
  { id:"gestion_loc",    label:"Gestion locative",     icon:"📋", color:"#F59E0B",
    desc:"Encaissement loyers, suivi techniques, états des lieux." },
];

const PROFESSIONALS = [
  // Conciergeries
  { id:"P1", name:"Mbella Carine",       category:"conciergerie", phone:"+237 6 70 11 22 33", rating:4.9, jobs:142, photo:"https://i.pravatar.cc/100?u=mbellac",   city:"Douala",   zone:"Bonanjo",      available:true,  verified:true,
    company:"Akwa Concierge", commission:"15% des loyers", languages:["Français","Anglais"],
    services:["Check-in 24/7","Ménage premium","Linge","Accueil"], experience:"8 ans",
    about:"Conciergerie haut de gamme spécialisée dans la location courte durée à Douala. Disponibilité 24/7." },
  { id:"P2", name:"Kana Sandrine",       category:"conciergerie", phone:"+237 6 99 44 55 66", rating:4.8, jobs:88,  photo:"https://i.pravatar.cc/100?u=kanas",     city:"Yaoundé",  zone:"Bastos",       available:true,  verified:true,
    company:"Bastos Stay", commission:"12% des loyers", languages:["Français","Anglais","Allemand"],
    services:["Accueil voyageurs","Ménage","Maintenance légère"], experience:"5 ans",
    about:"Service de conciergerie pour particuliers et professionnels. Réactivité garantie." },
  { id:"P3", name:"Eyenga Patrick",      category:"conciergerie", phone:"+237 6 55 66 77 88", rating:4.7, jobs:65,  photo:"https://i.pravatar.cc/100?u=eyengap",   city:"Kribi",    zone:"Bord de mer",  available:true,  verified:false,
    company:"Kribi Beach Concierge", commission:"18% des loyers", languages:["Français","Anglais"],
    services:["Check-in plage","Excursions","Ménage","Transferts"], experience:"3 ans",
    about:"Conciergerie balnéaire — idéal pour villas et résidences secondaires en bord de mer." },

  // Agents immobiliers
  { id:"P4", name:"Tchoumi Gérard",      category:"agent_immo",   phone:"+237 6 22 33 44 55", rating:4.9, jobs:312, photo:"https://i.pravatar.cc/100?u=tchoumig",  city:"Douala",   zone:"Bonapriso",    available:true,  verified:true,
    company:"Cameroon Premium Realty", commission:"1 mois (location) · 5% (vente)", languages:["Français","Anglais"],
    services:["Visites","Négociation","Mise en location","Vente"], experience:"15 ans",
    about:"Agent immobilier confirmé, portefeuille premium sur Douala. Réseau d'investisseurs." },
  { id:"P5", name:"Nguini Sylvie",       category:"agent_immo",   phone:"+237 6 88 77 66 55", rating:4.85,jobs:178, photo:"https://i.pravatar.cc/100?u=nguinis",   city:"Yaoundé",  zone:"Centre-ville", available:true,  verified:true,
    company:"Yaoundé Habitat", commission:"1 mois (location)", languages:["Français"],
    services:["Recherche locataires","Visites","Contrats","États des lieux"], experience:"9 ans",
    about:"Agence familiale, suivi personnalisé des bailleurs et locataires." },
  { id:"P6", name:"Talla Bertrand",      category:"agent_immo",   phone:"+237 6 44 55 66 77", rating:4.6, jobs:96,  photo:"https://i.pravatar.cc/100?u=tallab",    city:"Bafoussam",zone:"Centre",       available:false, verified:true,
    company:"Ouest Immo Conseil", commission:"1.5 mois (location) · 6% (vente)", languages:["Français"],
    services:["Vente","Location","Estimation","Conseil juridique"], experience:"11 ans",
    about:"Spécialiste de la région de l'Ouest, expertise en vente et conseil patrimonial." },

  // Gestion locative
  { id:"P7", name:"Mbarga Lucie",        category:"gestion_loc",  phone:"+237 6 11 22 99 88", rating:4.85,jobs:234, photo:"https://i.pravatar.cc/100?u=mbargal",   city:"Douala",   zone:"Akwa",         available:true,  verified:true,
    company:"Loyer & Co", commission:"8% des loyers", languages:["Français","Anglais"],
    services:["Encaissement loyers","Suivi techniques","Reporting mensuel"], experience:"7 ans",
    about:"Gestion locative complète pour bailleurs absents ou multi-propriétaires." },
  { id:"P8", name:"Onana Jean-Marc",     category:"gestion_loc",  phone:"+237 6 33 22 11 00", rating:4.7, jobs:156, photo:"https://i.pravatar.cc/100?u=onanajm",   city:"Yaoundé",  zone:"Mvan",         available:true,  verified:true,
    company:"Yaoundé Gestion+", commission:"7% des loyers", languages:["Français"],
    services:["Encaissement","Relances","États des lieux","Petites réparations"], experience:"6 ans",
    about:"Gestion locative dédiée aux particuliers et petites SCI." },
];

/* Owner's assigned professionals (concierges/agents) — by owner id */
const OWNER_PROFESSIONALS = {
  "Ekwalla M.": ["P1","P4","P7"],
  "Fouda R.":   ["P5"],
};

/* ═══════════════════════════════════════════════════
   BUILDING DELEGATIONS (Many-to-Many)
   Une entité (immeuble/villa/hôtel) peut être gérée par
   un ou plusieurs agents/concierges, et un pro peut gérer
   plusieurs entités. Mapping : buildingId → [proId, ...]
   ═══════════════════════════════════════════════════ */
const BUILDING_DELEGATIONS_INITIAL = {
  "B1": ["P4","P7"],   // Résidence Les Palmiers : agent immo + gestion locative
  "B2": ["P1"],         // Villa Akwa Prestige : conciergerie
  "B3": ["P3"],         // Hôtel La Falaise : conciergerie de Kribi (à corriger côté UI si non pertinent)
  "B4": ["P5"],         // Penthouse Bastos : agent immo Yaoundé
};

/* Helpers : lecture/écriture des délégations en localStorage */
const delegations = {
  getAll() {
    return byerStorage.get("buildingDelegations", BUILDING_DELEGATIONS_INITIAL);
  },
  setAll(map) {
    byerStorage.set("buildingDelegations", map);
  },
  /* Pros qui gèrent ce bâtiment */
  forBuilding(buildingId) {
    const map = this.getAll();
    return map[buildingId] || [];
  },
  /* Bâtiments gérés par ce pro (toutes propriétés confondues) */
  forPro(proId) {
    const map = this.getAll();
    const ids = [];
    Object.entries(map).forEach(([bId, proIds]) => {
      if (proIds.includes(proId)) ids.push(bId);
    });
    return ids;
  },
  /* Ajouter un pro à un bâtiment */
  add(buildingId, proId) {
    const map = this.getAll();
    const list = map[buildingId] || [];
    if (!list.includes(proId)) list.push(proId);
    map[buildingId] = list;
    this.setAll(map);
  },
  /* Retirer un pro d'un bâtiment */
  remove(buildingId, proId) {
    const map = this.getAll();
    const list = map[buildingId] || [];
    map[buildingId] = list.filter(id => id !== proId);
    this.setAll(map);
  },
};

/* ═══════════════════════════════════════════════════
   USER-REGISTERED PROFILES
   Profils ajoutés par l'utilisateur via "Devenir technicien"
   ou "Devenir concierge/agent". Persistés en localStorage.
   ═══════════════════════════════════════════════════ */
const userProfiles = {
  /* Techniciens créés par l'utilisateur */
  getTechs() { return byerStorage.get("userTechs", []); },
  setTechs(arr) { byerStorage.set("userTechs", arr); },
  addTech(tech) {
    const arr = this.getTechs();
    arr.unshift(tech);
    this.setTechs(arr);
  },
  /* Pros (concierges/agents) créés par l'utilisateur */
  getPros() { return byerStorage.get("userPros", []); },
  setPros(arr) { byerStorage.set("userPros", arr); },
  addPro(pro) {
    const arr = this.getPros();
    arr.unshift(pro);
    this.setPros(arr);
  },
  /* Vue combinée : base + ajouts utilisateur */
  allTechs() { return [...this.getTechs(), ...TECHNICIANS]; },
  allPros()  { return [...this.getPros(),  ...PROFESSIONALS]; },
};

/* ═══════════════════════════════════════════════════
   BOOST — Enchères Découverte Mock Data
   ═══════════════════════════════════════════════════ */
const BOOST_CONFIG = {
  minBid:     1000,
  maxBid:     100000,
  step:       500,
  currency:   "FCFA",
  periodLabel:"par jour",
};

const BOOST_BIDS = [
  { id:"BO1", propertyId:1,  ownerName:"Atangana B.",  amount:15000, date:"22 mars 2025", active:true },
  { id:"BO2", propertyId:3,  ownerName:"Fouda R.",     amount:25000, date:"21 mars 2025", active:true },
  { id:"BO3", propertyId:7,  ownerName:"Fouda R.",     amount:10000, date:"20 mars 2025", active:true },
  { id:"BO4", propertyId:2,  ownerName:"Ekwalla M.",   amount:5000,  date:"19 mars 2025", active:false },
  { id:"BO5", propertyId:13, ownerName:"Ekwalla M.",   amount:8000,  date:"22 mars 2025", active:true },
];

/* ═══════════════════════════════════════════════════
   PAYWALL — Location au Mois Mock Data
   ═══════════════════════════════════════════════════ */
const PAYWALL_TIERS = [
  { id:"basic",   label:"Découverte",  price:3000,  visits:10, duration:null,     favorites:0,  favDuration:null,  color:"#F59E0B", desc:"Accédez à 10 visites d'annonces location mensuelle." },
  { id:"standard",label:"Standard",    price:5000,  visits:20, duration:null,     favorites:0,  favDuration:null,  color:"#2563EB", desc:"20 visites d'annonces pour trouver votre logement idéal." },
  { id:"premium", label:"Premium",     price:10000, visits:null,duration:"2h",    favorites:10, favDuration:"72h", color:C.coral,   desc:"Accès illimité pendant 2h + 10 favoris consultables 72h." },
];

/* Track user's paywall state */
const PAYWALL_STATE = {
  active:       false,
  tier:         null,
  visitsLeft:   0,
  expiresAt:    null,
  favorites:    [],
  favExpiresAt: null,
};

/* ═══════════════════════════════════════════════════
   PARRAINAGE & POINTS — Programme de fidélité
   Rythme : 10 pts par filleul → 100 pts pour 10 amis invités.
   Pour débloquer un Forfait Premium gratuit (1 000 pts), il faut
   100 filleuls. Le programme reste exigeant pour rester rentable.
   ═══════════════════════════════════════════════════ */
const POINTS_CONFIG = {
  perReferral:   10,    // pts gagnés par filleul qui s'inscrit avec mon code
  perBooking:    2,     // pts gagnés à chaque réservation perso
  ratio:         15,    // valeur indicative : 1 pt ≈ 15 FCFA de réduction
};

/* Paliers de niveau (basés sur le total cumulé de points) */
const POINTS_TIERS = {
  silver: 100,   // Argent à partir de 100 pts (= 10 filleuls)
  gold:   500,   // Or à partir de 500 pts (= 50 filleuls)
};

/* Catalogue d'échange : ce que les points permettent de débloquer.
   Calibré pour qu'un parrainage actif (~30 filleuls = 300 pts) débloque
   un forfait Découverte gratuit. */
const POINTS_REWARDS = [
  { id:"boost_disc1",  type:"boost",   cost:50,   label:"-1 000 F sur Boost",          icon:"🚀", value:1000  },
  { id:"boost_disc2",  type:"boost",   cost:200,  label:"-5 000 F sur Boost",          icon:"🚀", value:5000  },
  { id:"forfait_disc", type:"paywall", cost:100,  label:"-50 % sur forfait Découverte",icon:"🎟️", value:1500  },
  { id:"forfait_decv", type:"paywall", cost:300,  label:"Forfait Découverte gratuit",  icon:"🎁", value:3000  },
  { id:"forfait_std",  type:"paywall", cost:500,  label:"Forfait Standard gratuit",    icon:"🎁", value:5000  },
  { id:"forfait_prm",  type:"paywall", cost:1000, label:"Forfait Premium gratuit",     icon:"💎", value:10000 },
];

/* Helper: gestion des points (lecture/écriture localStorage) */
const pointsManager = {
  get()         { return byerStorage.get("rewardsPoints", 25); },
  set(n)        { byerStorage.set("rewardsPoints", Math.max(0, n|0)); },
  add(n)        { const cur = this.get(); this.set(cur + (n|0)); return cur + (n|0); },
  redeem(cost)  {
    const cur = this.get();
    if (cur < cost) return false;
    this.set(cur - cost);
    return true;
  },
  /* Bons générés par échange (= coupons en attente d'application) */
  getCoupons()  { return byerStorage.get("pointsCoupons", []); },
  addCoupon(c)  {
    const arr = this.getCoupons();
    arr.unshift({ ...c, id: "CP"+Date.now(), createdAt: Date.now() });
    byerStorage.set("pointsCoupons", arr);
    return arr;
  },
  consumeCoupon(id) {
    const arr = this.getCoupons().filter(c => c.id !== id);
    byerStorage.set("pointsCoupons", arr);
  },
  /* Compteur filleuls (pour stats de la page parrainage) */
  getReferrals()  { return byerStorage.get("referralCount", 0); },
  addReferral()   {
    const n = this.getReferrals() + 1;
    byerStorage.set("referralCount", n);
    this.add(POINTS_CONFIG.perReferral);
    return n;
  },
};


/* ═══ js/styles.js ═══ */
/* Byer — Styles */

/* SignupFieldIcon defined in auth.js — removed duplicate here to avoid Babel "already declared" error */

/* ─── AUTH CSS ───────────────────────────────────── */
const AUTH_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  body,input,button,textarea{font-family:'DM Sans',-apple-system,sans-serif;}
  ::-webkit-scrollbar{display:none;}
  @keyframes spin{to{transform:rotate(360deg)}}
`;

/* ─── ONBOARDING STYLES ──────────────────────────── */
const Os = {
  root:       { display:"flex", flexDirection:"column", height:"100vh", width:"100%", background:C.white, overflow:"hidden" },
  authHero:   { background:C.coral, padding:"var(--top-pad) 28px 32px", position:"relative", overflow:"hidden" },
  authLogoWrap:{ display:"flex", alignItems:"center", gap:10, marginBottom:20 },
  authLogoTxt:{ fontSize:28, fontWeight:800, color:"white", letterSpacing:-1, fontFamily:"'DM Sans',sans-serif" },
  authTitle:  { fontSize:28, fontWeight:800, color:"white", marginBottom:6, fontFamily:"'DM Sans',sans-serif" },
  authSub:    { fontSize:14, color:"rgba(255,255,255,.8)", fontFamily:"'DM Sans',sans-serif" },
  authCard:   { flex:1, overflowY:"auto", background:C.white, borderRadius:"24px 24px 0 0", marginTop:-16, padding:"28px 24px 40px" },
  socialBtn:  { flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px", borderRadius:14, border:`1.5px solid ${C.border}`, background:C.white, cursor:"pointer" },
  dividerRow: { display:"flex", alignItems:"center", gap:10, margin:"16px 0" },
  dividerLine:{ flex:1, height:1, background:C.border },
  dividerTxt: { fontSize:12, color:C.light, whiteSpace:"nowrap" },
  fieldLabel: { display:"block", fontSize:12, fontWeight:600, color:C.dark, marginBottom:7, textTransform:"uppercase", letterSpacing:.5 },
  fieldWrap:  { display:"flex", alignItems:"center", gap:10, background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"12px 14px", transition:"border .15s" },
  fieldInput: { flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, color:C.dark, fontFamily:"'DM Sans',sans-serif" },
  ctaBtn:     { width:"100%", background:C.coral, color:"white", border:"none", borderRadius:16, padding:"16px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", transition:"opacity .18s" },
  spinner:    { width:20, height:20, borderRadius:10, border:"2.5px solid rgba(255,255,255,.3)", borderTopColor:"white", animation:"spin .7s linear infinite" },
  roleCard:   { width:"100%", background:C.white, border:`1.5px solid ${C.border}`, borderRadius:18, padding:"18px", cursor:"pointer", marginBottom:14, textAlign:"left", transition:"all .18s" },
  roleCardOn: { border:`1.5px solid ${C.coral}`, background:"#FFF8F8" },

  // Email / phone toggle
  methodToggle:{ display:"flex", background:C.bg, borderRadius:12, padding:3, gap:3, marginBottom:18 },
  methodBtn:   { flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px 0", borderRadius:9, border:"none", cursor:"pointer", background:"none", transition:"all .18s" },
  methodBtnOn: { background:C.white, boxShadow:"0 1px 6px rgba(0,0,0,.1)" },
};

/* ─── STYLES ────────────────────────────────────── */
const S = {
  shell:    {display:"flex",flexDirection:"column",height:"100vh",width:"100%",background:C.bg,overflow:"hidden",position:"relative"},
  scroll:   {flex:1,overflowY:"auto",overflowX:"hidden",paddingBottom:80},
  nav:      {display:"flex",background:C.white,borderTop:`1px solid ${C.border}`,padding:"8px 0 18px",flexShrink:0,position:"absolute",bottom:0,left:0,right:0,zIndex:100,boxShadow:"0 -2px 8px rgba(0,0,0,0.04)"},
  navBtn:   {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",padding:"4px 0"},
  navLabel: {fontSize:10,fontWeight:500},

  stickyTop:{background:C.white,padding:"var(--top-pad) 20px 0",borderBottom:`1px solid ${C.border}`},
  logoRow:  {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24},
  logoMark: {display:"flex",alignItems:"center",gap:7},
  logoTxt:  {fontSize:24,fontWeight:800,color:C.coral,letterSpacing:-1},
  bellBtn:  {position:"relative",width:38,height:38,borderRadius:19,background:C.bg,border:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0},
  greeting: {fontSize:18,fontWeight:700,color:C.black,marginBottom:12},

  // Search row with duration toggle
  searchRow:{display:"flex",alignItems:"center",gap:8,marginBottom:14},
  searchWrap:{flex:1,display:"flex",alignItems:"center",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"10px 12px",gap:8},
  searchIn: {flex:1,border:"none",outline:"none",background:"transparent",fontSize:14,color:C.dark,minWidth:0},
  clearBtn: {background:"none",border:"none",cursor:"pointer",color:C.light,fontSize:14},
  filterIconBtn:{background:"none",border:"none",cursor:"pointer",display:"flex",padding:2},

  // Duration toggle
  durToggle:{display:"flex",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:12,padding:2,flexShrink:0},
  durBtn:   {background:"none",border:"none",borderRadius:9,padding:"7px 9px",fontSize:11.5,fontWeight:600,color:C.mid,cursor:"pointer",transition:"all .18s",whiteSpace:"nowrap"},
  durBtnOn: {background:C.white,color:C.coral,boxShadow:"0 1px 4px rgba(0,0,0,.1)"},

  // Duration banner
  durBanner:{display:"flex",alignItems:"flex-start",gap:8,background:"#FFF8F8",border:`1px solid #FFD6D7`,borderRadius:12,padding:"10px 14px",margin:"0 16px 12px"},

  segments: {display:"flex"},
  seg:      {flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"none",border:"none",cursor:"pointer",padding:"12px 0",borderBottom:"2px solid transparent",transition:"all .18s"},
  segOn:    {borderBottom:`2px solid ${C.coral}`},
  segTxt:   {fontSize:14,fontWeight:600,color:C.mid},

  // Property type chips
  typeRow:  {display:"flex",gap:6,padding:"10px 20px",overflowX:"auto",background:C.white,borderBottom:`1px solid ${C.border}`},
  typeChip: {flexShrink:0,display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:20,border:`1.5px solid ${C.border}`,background:C.white,cursor:"pointer",transition:"all .18s"},
  typeChipOn:{border:`1.5px solid ${C.coral}`,background:"#FFF5F5"},
  typeLabel:{fontSize:12,fontWeight:600,color:C.mid},

  pillRow:  {display:"flex",gap:8,padding:"10px 20px",overflowX:"auto"},
  pill:     {flexShrink:0,padding:"6px 16px",borderRadius:20,border:`1.5px solid ${C.border}`,background:C.white,fontSize:13,fontWeight:500,color:C.mid,cursor:"pointer"},
  pillOn:   {background:C.black,color:C.white,border:`1.5px solid ${C.black}`},
  secTitle: {fontSize:17,fontWeight:700,color:C.black,marginBottom:14},

  feedStack:{display:"flex",flexDirection:"column",gap:20},
  bigCard:  {background:C.white,borderRadius:20,overflow:"hidden",boxShadow:"0 2px 16px rgba(0,0,0,.07)",cursor:"pointer"},
  bigImgWrap:{position:"relative",height:230,overflow:"hidden"},
  bigImg:   {width:"100%",height:"100%",objectFit:"cover"},
  bigGrad:  {position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.45) 0%,transparent 55%)"},
  arrowBtn: {position:"absolute",top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.38)",border:"none",borderRadius:50,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:2},
  dotsRow:  {position:"absolute",bottom:44,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:2},
  dot:      {width:5,height:5,borderRadius:3,background:"rgba(255,255,255,.45)",transition:"all .2s"},
  dotOn:    {width:14,background:"white"},
  superBadge:{position:"absolute",top:12,left:12,background:"white",borderRadius:8,padding:"3px 9px",fontSize:11,fontWeight:700,color:C.black,zIndex:2},
  heartBtn: {position:"absolute",top:12,right:12,background:"rgba(0,0,0,.28)",border:"none",borderRadius:50,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:2},
  galleryBtn:{position:"absolute",bottom:10,right:12,display:"flex",alignItems:"center",gap:5,background:"rgba(0,0,0,.45)",border:"none",borderRadius:20,padding:"5px 11px",cursor:"pointer",zIndex:2},
  bigInfo:  {padding:"14px 16px 16px"},
  bigCity:  {display:"flex",alignItems:"center",fontSize:11,color:C.light},
  bigTitle: {fontSize:16,fontWeight:700,color:C.black,lineHeight:1.25,marginBottom:4},
  bigMeta:  {fontSize:12,color:C.light},
  ratingPill:{display:"flex",alignItems:"center",background:C.bg,borderRadius:9,padding:"4px 8px",flexShrink:0,height:"fit-content"},
  tagsRow:  {display:"flex",gap:6,marginTop:10,marginBottom:12,flexWrap:"wrap"},
  tag:      {background:C.bg,color:C.dark,fontSize:11,fontWeight:500,padding:"4px 10px",borderRadius:20,border:`1px solid ${C.border}`},
  bigBottom:{display:"flex",alignItems:"flex-end",justifyContent:"space-between"},
  bigPrice: {fontSize:16,fontWeight:800,color:C.black},
  bigNight: {fontSize:12,color:C.light},
  detailBtn:{background:C.black,color:C.white,border:"none",borderRadius:12,padding:"9px 16px",fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0},

  // Gallery
  galRoot:  {display:"flex",flexDirection:"column",height:"100vh",width:"100%",background:C.black,overflow:"hidden"},
  galHeader:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"var(--top-pad) 16px 14px",background:C.white,flexShrink:0},
  galBack:  {background:"none",border:"none",cursor:"pointer",padding:6,borderRadius:8,display:"flex"},
  galDetailBtn:{background:C.coral,color:C.white,border:"none",borderRadius:10,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer"},
  galMain:  {flex:1,position:"relative",overflow:"hidden",minHeight:0},
  galImg:   {width:"100%",height:"100%",objectFit:"contain"},
  galLabel: {position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,.55)",color:"white",fontSize:12,fontWeight:600,padding:"5px 14px",borderRadius:20,whiteSpace:"nowrap"},
  galArrow: {position:"absolute",top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,.18)",border:"none",borderRadius:50,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"},
  thumbStrip:{display:"flex",gap:6,padding:"10px 14px",background:C.black,overflowX:"auto",flexShrink:0},
  thumb:    {flexShrink:0,width:56,height:56,borderRadius:8,overflow:"hidden",border:"2px solid transparent",cursor:"pointer",position:"relative"},
  thumbOn:  {border:`2px solid ${C.coral}`},
  thumbActiveOverlay:{position:"absolute",inset:0,background:"rgba(255,90,95,.12)"},
  labelsStrip:{display:"flex",gap:6,padding:"0 14px 20px",background:C.black,overflowX:"auto",flexShrink:0},
  labelChip:{flexShrink:0,background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.6)",border:"1px solid rgba(255,255,255,.15)",borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:500,cursor:"pointer"},
  labelChipOn:{background:C.coral,color:C.white,border:`1px solid ${C.coral}`},

  // Detail
  dScroll:  {flex:1,overflowY:"auto"},
  dCard:    {background:C.white,padding:"22px 20px 20px"},
  dBack:    {position:"absolute",top:52,left:16,background:"rgba(0,0,0,.3)",border:"none",borderRadius:50,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"},
  dAction:  {background:"rgba(0,0,0,.3)",border:"none",borderRadius:50,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"},
  heroGalleryBtn:{position:"absolute",bottom:12,right:14,display:"flex",alignItems:"center",gap:5,background:"rgba(0,0,0,.45)",border:"none",borderRadius:20,padding:"6px 12px",cursor:"pointer"},
  thumbPreviewRow:{display:"flex",gap:6,padding:"10px 16px",background:C.white,overflowX:"auto",borderBottom:`1px solid ${C.border}`},
  thumbPreview:{flexShrink:0,position:"relative",width:80,height:58,borderRadius:10,overflow:"hidden",border:"none",cursor:"pointer"},
  thumbPreviewLabel:{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,.5)",color:"white",fontSize:9,fontWeight:600,padding:"3px 5px",textAlign:"center"},
  detailDurRow:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,background:C.bg,borderRadius:14,padding:"12px 14px"},
  dFooter:  {background:C.white,borderTop:`1px solid ${C.border}`,padding:"14px 20px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0},
  reserveBtn:{background:C.coral,color:C.white,border:"none",borderRadius:14,padding:"14px 28px",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},

  pageHead: {padding:"var(--top-pad) 20px 12px",background:C.white,borderBottom:`1px solid ${C.border}`,marginBottom:4},
  pageTitle:{fontSize:22,fontWeight:700,color:C.black},

  // Trips screen
  tripsTabs:     {display:"flex",gap:0,padding:"0 16px",background:C.white,borderBottom:`1px solid ${C.border}`,overflowX:"auto"},
  tripsTab:      {flexShrink:0,padding:"12px 14px",background:"none",border:"none",borderBottom:"2px solid transparent",fontSize:13,fontWeight:600,color:C.light,cursor:"pointer",transition:"all .18s"},
  tripsTabOn:    {borderBottom:`2px solid ${C.coral}`,color:C.coral},
  tripsDatesRow: {display:"flex",alignItems:"center",gap:8,marginBottom:0},
  tripsDatesCol: {flex:1,display:"flex",flexDirection:"column",gap:2},
  tripsDatesLabel:{fontSize:9,fontWeight:700,color:C.light,textTransform:"uppercase",letterSpacing:.6},
  tripsDatesVal: {fontSize:14,fontWeight:700,color:C.black},
  tripsArrow:    {display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0},
  tripsActions:  {display:"flex",gap:8,padding:"0 14px 14px"},
  mapsBtn:       {flex:2,display:"flex",alignItems:"center",gap:8,background:"#EAF3FB",border:"1.5px solid #BFDBFE",borderRadius:12,padding:"11px 13px",cursor:"pointer",fontSize:13,fontWeight:700,color:"#1D4ED8",fontFamily:"'DM Sans',sans-serif"},
  tripsSecBtn:   {flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"11px 10px",cursor:"pointer",fontSize:12,fontWeight:600,color:C.dark,fontFamily:"'DM Sans',sans-serif"},

  // Profile rent CTA
  rentCta:    {display:"flex",alignItems:"center",justifyContent:"space-between",margin:"0 16px 8px",background:C.white,borderRadius:16,padding:"16px",border:`1.5px solid ${C.border}`,cursor:"pointer",width:"calc(100% - 32px)",boxShadow:"0 2px 10px rgba(255,90,95,.08)",textAlign:"left"},
  rentCtaLeft:{display:"flex",alignItems:"center",gap:12},
  rentCtaIcon:{width:44,height:44,borderRadius:13,background:"#FFF5F5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  urgentBadge:{background:C.coral,color:C.white,fontSize:11,fontWeight:700,width:20,height:20,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"},

  // Rent screen
  rentHeader: {background:C.white,borderBottom:`1px solid ${C.border}`,padding:"var(--top-pad) 20px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0},
  dBack2:     {background:"none",border:"none",cursor:"pointer",padding:6,borderRadius:8,display:"flex",alignItems:"center"},
  rentRoleWrap:{display:"flex",background:C.bg,borderRadius:14,margin:"16px 16px 0",padding:4,gap:4},
  roleBtn:    {flex:1,padding:"10px 8px",borderRadius:10,border:"none",fontSize:13,fontWeight:600,color:C.mid,cursor:"pointer",background:"none",transition:"all .18s"},
  roleBtnOn:  {background:C.white,color:C.coral,boxShadow:"0 2px 8px rgba(0,0,0,.08)"},

  rentSummary:{display:"flex",background:C.white,margin:"12px 16px 0",borderRadius:16,padding:"16px",boxShadow:"0 1px 8px rgba(0,0,0,.05)"},
  summaryCol: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3},
  summaryVal: {fontSize:16,fontWeight:800,color:C.black},
  summaryLabel:{fontSize:10,color:C.light,fontWeight:500,textAlign:"center"},
  summaryDivider:{width:1,background:C.border,margin:"0 4px"},

  rentTabs:   {display:"flex",gap:0,padding:"12px 16px 0"},
  rentTab:    {flex:1,padding:"10px 0",background:"none",border:"none",borderBottom:"2px solid transparent",fontSize:13,fontWeight:600,color:C.light,cursor:"pointer",transition:"all .18s"},
  rentTabOn:  {borderBottom:`2px solid ${C.coral}`,color:C.coral},

  loyerCard:  {background:C.white,borderRadius:16,padding:"14px 14px 14px 16px",boxShadow:"0 1px 8px rgba(0,0,0,.05)"},
  statutBadge:{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:20,flexShrink:0},
  payBtn:     {width:"100%",background:C.coral,color:C.white,border:"none",borderRadius:12,padding:"13px",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .18s"},
  paidConfirm:{display:"flex",alignItems:"center",gap:6,justifyContent:"center",padding:"10px",background:"#F0FDF4",borderRadius:10},
  reminderBtn:{width:"100%",background:C.bg,color:C.dark,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"11px",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  reminderBtnSent:{background:"#F0FDF4",color:"#16A34A",border:"1.5px solid #BBF7D0"},

  histCard:   {background:C.white,borderRadius:16,padding:"14px",boxShadow:"0 1px 6px rgba(0,0,0,.04)"},
  proofBox:   {display:"flex",alignItems:"center",gap:10,background:C.bg,borderRadius:10,padding:"8px 10px",marginTop:10},
  proofIcon:  {width:28,height:28,borderRadius:8,background:"#FFF5F5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},

  autoRappelCard:{background:C.white,borderRadius:16,padding:"16px",boxShadow:"0 1px 8px rgba(0,0,0,.05)"},
  rappelCard: {background:C.white,borderRadius:14,padding:"14px",boxShadow:"0 1px 6px rgba(0,0,0,.04)"},
  rappelDot:  {width:10,height:10,borderRadius:5,flexShrink:0},

  // Bailleur notification buttons (post-échéance uniquement)
  autoMsgBox: {display:"flex",alignItems:"flex-start",gap:8,background:"#FAFAFA",border:`1px dashed ${C.border}`,borderRadius:10,padding:"10px 12px"},
  notifBtn:   {display:"flex",alignItems:"center",justifyContent:"center",gap:7,width:"100%",background:"#FFF5F5",color:C.coral,border:`1.5px solid #FFD6D7`,borderRadius:12,padding:"11px",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  notifBtnRed:{display:"flex",alignItems:"center",justifyContent:"center",gap:7,width:"100%",background:"#FEF2F2",color:"#EF4444",border:"1.5px solid #FECACA",borderRadius:12,padding:"11px",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  notifBtnDone:{background:"#F0FDF4",color:"#16A34A",border:"1.5px solid #BBF7D0",cursor:"default"},

  // Payment sheet
  payAmountBox:{background:C.bg,borderRadius:14,padding:"14px 16px"},
  methodBtn:  {display:"flex",alignItems:"center",gap:12,padding:"14px",background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,cursor:"pointer",width:"100%",textAlign:"left"},
  methodLogo: {width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  phoneInput: {display:"flex",alignItems:"center",gap:10,background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"12px 14px"},
  successCircle:{width:72,height:72,borderRadius:36,background:"#16A34A",display:"flex",alignItems:"center",justifyContent:"center"},

  // Availability
  unavailBadge:{position:"absolute",bottom:44,left:12,display:"flex",alignItems:"center",gap:5,background:"rgba(239,68,68,.85)",borderRadius:20,padding:"5px 10px",zIndex:2,backdropFilter:"blur(4px)"},
  unavailDetail:{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:14,padding:"12px 14px",marginBottom:0},
  availDetail:  {display:"flex",alignItems:"center",gap:8,padding:"4px 0"},
  hostRow:      {display:"flex",alignItems:"center",gap:12,background:"none",border:"none",padding:"0"},

  // Filter active dot
  filterActiveDot:{position:"absolute",top:0,right:0,width:8,height:8,borderRadius:4,background:C.coral,border:`1.5px solid white`},
  filterIconBtn:  {background:"none",border:"none",cursor:"pointer",display:"flex",padding:2,position:"relative"},

  // Rating breakdown
  ratingHero:       {display:"flex",alignItems:"center",gap:16,background:C.bg,borderRadius:16,padding:"14px 16px",marginBottom:14},
  ratingScore:      {display:"flex",flexDirection:"column",alignItems:"center",gap:6},
  ratingScoreNum:   {fontSize:36,fontWeight:800,color:C.black,lineHeight:1},
  ratingMeta:       {flex:1,display:"flex",flexDirection:"column",gap:5},
  ratingLabel:      {fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,alignSelf:"flex-start"},
  topCriteriaChip:  {display:"flex",alignItems:"center",gap:10,background:"#FFF5F5",border:`1px solid ${C.coral}22`,borderRadius:12,padding:"10px 14px"},
  criteriaGrid:     {display:"flex",flexDirection:"column",gap:10},
  criteriaRow:      {display:"flex",alignItems:"center",gap:12},
  criteriaLeft:     {display:"flex",alignItems:"center",gap:7,width:155,flexShrink:0},
  criteriaLabel:    {fontSize:12,fontWeight:500,color:C.dark},
  criteriaRight:    {display:"flex",alignItems:"center",gap:8,flex:1},
  progressTrack:    {flex:1,height:6,borderRadius:3,background:C.border,overflow:"hidden"},
  progressFill:     {height:"100%",borderRadius:3,transition:"width .4s ease"},
  criteriaScore:    {fontSize:12,fontWeight:700,color:C.dark,width:26,textAlign:"right",flexShrink:0},
  reviewCard:       {background:C.bg,borderRadius:14,padding:"14px",marginBottom:10},
  leaveReviewBtn:   {display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",background:"#FFF5F5",border:`1.5px solid ${C.coral}44`,borderRadius:12,padding:"12px",marginTop:14,cursor:"pointer",fontSize:13,fontWeight:600,color:C.coral,fontFamily:"'DM Sans',sans-serif"},
  locPill:  {display:"flex",alignItems:"center",gap:6,background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"6px 10px 6px 8px",cursor:"pointer",transition:"all .18s",flexShrink:0},
  locTexts: {display:"flex",flexDirection:"column",alignItems:"flex-start",lineHeight:1.2},
  locSub:   {fontSize:9,fontWeight:500,color:C.light,textTransform:"uppercase",letterSpacing:.5},
  locLabel: {fontSize:13,fontWeight:700,color:C.black},

  // Location bottom sheet
  sheetBackdrop:{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:200},
  sheet:        {position:"fixed",bottom:0,left:0,right:0,width:"100%",background:C.white,borderRadius:"22px 22px 0 0",zIndex:201,paddingBottom:32,maxHeight:"80vh",display:"flex",flexDirection:"column"},
  sheetHandle:  {width:36,height:4,borderRadius:2,background:C.border,margin:"12px auto 4px"},
  sheetHeader:  {display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 20px 12px"},
  sheetTitle:   {fontSize:17,fontWeight:700,color:C.black},
  sheetClose:   {background:"none",border:"none",cursor:"pointer",padding:4,borderRadius:8,display:"flex"},
  sheetSearch:  {display:"flex",alignItems:"center",gap:10,background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"10px 14px",margin:"0 16px 12px"},
  sheetList:    {overflowY:"auto",flex:1},
  sheetRow:     {display:"flex",alignItems:"center",gap:12,width:"100%",padding:"11px 20px",background:"none",border:"none",cursor:"pointer",textAlign:"left",transition:"background .15s"},
  sheetRowOn:   {background:"#FFF5F5"},
  sheetPinWrap: {width:36,height:36,borderRadius:18,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  sheetRowTexts:{flex:1,display:"flex",flexDirection:"column",gap:2},
  sheetRowLabel:{fontSize:14,fontWeight:600,color:C.black},
  sheetRowSub:  {fontSize:12,color:C.light},

  // Messages list
  convRow:    {display:"flex",alignItems:"center",gap:12,padding:"14px 20px",background:"none",border:"none",cursor:"pointer",borderBottom:`1px solid ${C.border}`,textAlign:"left",width:"100%",transition:"background .15s"},
  convAvatar: {width:46,height:46,borderRadius:23,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:15,fontWeight:700},
  unreadDot:  {position:"absolute",top:-2,right:-2,width:18,height:18,borderRadius:9,background:C.coral,color:"white",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid white"},

  // Chat screen
  chatHeader:   {background:C.white,borderBottom:`1px solid ${C.border}`,padding:"var(--top-pad) 16px 12px",display:"flex",alignItems:"center",gap:10,flexShrink:0,position:"relative",zIndex:10},
  chatMenuBtn:  {background:"none",border:"none",cursor:"pointer",padding:6,borderRadius:8,display:"flex",flexShrink:0},
  chatMenu:     {position:"absolute",top:"100%",right:12,background:C.white,borderRadius:14,boxShadow:"0 8px 30px rgba(0,0,0,.14)",border:`1px solid ${C.border}`,minWidth:200,zIndex:60,padding:"6px"},
  chatMenuItem: {display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 14px",background:"none",border:"none",cursor:"pointer",borderRadius:10,fontSize:13,fontWeight:500,color:C.dark,fontFamily:"'DM Sans',sans-serif",textAlign:"left",transition:"background .15s"},
  chatMenuBlock:{color:C.coral},
  chatMenuUnblock:{color:"#16A34A"},
  chatContext:  {display:"flex",alignItems:"center",gap:5,padding:"6px 16px",background:"#FAFAFA",borderBottom:`1px solid ${C.border}`,flexShrink:0},
  chatMessages: {flex:1,overflowY:"auto",padding:"16px 16px 8px",display:"flex",flexDirection:"column"},
  blockedBanner:{display:"flex",alignItems:"flex-start",gap:8,background:"#FFF5F5",border:`1px solid #FFD6D7`,borderRadius:12,padding:"10px 12px",marginBottom:14,fontSize:12,color:C.dark,lineHeight:1.6},
  chatInputRow: {display:"flex",alignItems:"center",gap:8,padding:"10px 14px 24px",background:C.white,borderTop:`1px solid ${C.border}`,flexShrink:0,marginBottom:64},
  chatInput:    {flex:1,display:"flex",alignItems:"center",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:24,padding:"10px 16px"},
  chatSendBtn:  {width:42,height:42,borderRadius:21,background:C.coral,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"opacity .18s"},
  chatBlockedInput:{flex:1,display:"flex",alignItems:"center",gap:8,background:C.bg,borderRadius:24,padding:"12px 16px",justifyContent:"center"},

  // Block confirmation modal
  blockModal:   {position:"fixed",bottom:0,left:0,right:0,width:"100%",background:C.white,borderRadius:"22px 22px 0 0",padding:"28px 24px 40px",zIndex:301,display:"flex",flexDirection:"column",alignItems:"center",gap:14},
  blockModalIcon:{width:60,height:60,borderRadius:30,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"},
};

/* ─── BYER CSS (injected via <style>{BYER_CSS}</style>) ── */
const BYER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  body{font-family:'DM Sans',-apple-system,sans-serif;}
  input,select,button{font-family:'DM Sans',-apple-system,sans-serif;}
  input[type=date]::-webkit-calendar-picker-indicator{opacity:.4;}
  ::-webkit-scrollbar{display:none;}
  .bigcard{animation:cardUp .4s ease both;}
  @keyframes cardUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
  .galimg{animation:galFade .22s ease;}
  @keyframes galFade{from{opacity:.5;}to{opacity:1;}}
  .sheet{animation:sheetUp .32s cubic-bezier(.32,0,.67,0) both;}
  @keyframes sheetUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
  .resBtn:hover{opacity:.88;}.resBtn:active{transform:scale(.97);}
`;


/* ═══ js/components.js ═══ */
/* Byer — Shared Components */

/* ─── ICONS ─────────────────────────────────────── */
const Icon = ({ name, size=22, color=C.mid, stroke=1.8 }) => {
  const p = { width:size, height:size, fill:"none", stroke:color, strokeWidth:stroke, strokeLinecap:"round", strokeLinejoin:"round", viewBox:"0 0 24 24", style:{display:"block",flexShrink:0} };
  const icons = {
    home:    <svg {...p}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
    car:     <svg {...p}><rect x="1" y="9" width="22" height="10" rx="2"/><path d="M16 9V7a2 2 0 00-2-2H10a2 2 0 00-2 2v2"/><circle cx="7" cy="19" r="2" fill={color} stroke={color}/><circle cx="17" cy="19" r="2" fill={color} stroke={color}/></svg>,
    search:  <svg {...p}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    heart:   <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    heartF:  <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill={color} stroke={color}/></svg>,
    pin:     <svg {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    trips:   <svg {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    message: <svg {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    user:    <svg {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    star:    <svg {...p} fill={color} stroke={color} strokeWidth="0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    back:    <svg {...p}><polyline points="15 18 9 12 15 6"/></svg>,
    share:   <svg {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    filter:  <svg {...p}><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>,
    check:   <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    bed:     <svg {...p}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>,
    person:  <svg {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    fuel:    <svg {...p}><path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16"/><path d="M3 10h12"/><path d="M17 8h1a2 2 0 012 2v6a1 1 0 002 0v-4a1 1 0 00-1-1h-2"/></svg>,
    gear:    <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    chevron: <svg {...p}><polyline points="9 18 15 12 9 6"/></svg>,
    grid:    <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    close:   <svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    // Property type icons
    villa:   <svg {...p}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/><rect x="10" y="3" width="4" height="4" fill={color} stroke="none" rx="1"/></svg>,
    studio:  <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>,
    hotel:   <svg {...p}><path d="M3 22V6a1 1 0 011-1h16a1 1 0 011 1v16"/><path d="M2 22h20"/><rect x="7" y="10" width="4" height="4"/><rect x="13" y="10" width="4" height="4"/><rect x="10" y="16" width="4" height="6"/></svg>,
    motel:   <svg {...p}><path d="M3 22V8l9-5 9 5v14"/><path d="M3 12h18"/><rect x="8" y="14" width="3" height="4"/><rect x="13" y="14" width="3" height="4"/></svg>,
    auberge: <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/><circle cx="12" cy="8" r="2" fill={color} stroke="none"/></svg>,
  };
  return icons[name] || null;
};

/* ─── BYER PIN ─────────────────────────────────────── */
function ByerPin({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:"block",flexShrink:0}}>
      <path
        d="M12 22C12 22 4.5 15 4.5 9.5C4.5 5.4 7.9 2 12 2C16.1 2 19.5 5.4 19.5 9.5C19.5 15 12 22 12 22Z"
        fill={C.coral}
      />
      <circle cx="12" cy="9.5" r="2.8" fill={C.white}/>
    </svg>
  );
}

/* ─── FACE AVATAR ───────────────────────────────────── */
function FaceAvatar({ photo, avatar, bg, size=46, radius, blocked=false }) {
  const r = radius ?? size/2;
  const [err, setErr] = useState(false);
  if (blocked) return (
    <div style={{width:size,height:size,borderRadius:r,background:C.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <svg width={size*.4} height={size*.4} fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    </div>
  );
  if (photo && !err) return (
    <img
      src={photo} alt={avatar}
      onError={()=>setErr(true)}
      style={{width:size,height:size,borderRadius:r,objectFit:"cover",flexShrink:0,display:"block"}}
    />
  );
  return (
    <div style={{width:size,height:size,borderRadius:r,background:bg||C.mid,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontSize:size*.38,fontWeight:700,color:"white",lineHeight:1}}>{avatar}</span>
    </div>
  );
}

/* ─── RATING STARS ──────────────────────────────── */
function RatingStars({ score, size=14 }) {
  return (
    <div style={{display:"flex",gap:2,alignItems:"center"}}>
      {[1,2,3,4,5].map(i => {
        const fill = Math.min(1, Math.max(0, score - (i-1)));
        return (
          <div key={i} style={{position:"relative",width:size,height:size}}>
            <svg width={size} height={size} viewBox="0 0 24 24" fill="#E5E7EB" style={{position:"absolute"}}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <svg width={size} height={size} viewBox="0 0 24 24" style={{position:"absolute",clipPath:`inset(0 ${(1-fill)*100}% 0 0)`}}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={C.coral}/>
            </svg>
          </div>
        );
      })}
    </div>
  );
}

/* ─── RATING BREAKDOWN ──────────────────────────── */
function RatingBreakdown({ itemId, globalRating, reviews, onReview }) {
  const ratingData = RATINGS[itemId];
  const revList    = SAMPLE_REVIEWS[itemId] || [];
  const [showAll, setShowAll] = useState(false);
  if (!ratingData) return null;

  const topKey      = Object.entries(ratingData).sort((a,b)=>b[1]-a[1])[0];
  const topCriteria = RATING_CRITERIA.find(c=>c.key===topKey[0]);

  return (
    <div>
      {/* Global score hero */}
      <div style={S.ratingHero}>
        <div style={S.ratingScore}>
          <span style={S.ratingScoreNum}>{globalRating.toFixed(1)}</span>
          <RatingStars score={globalRating} size={18}/>
        </div>
        <div style={S.ratingMeta}>
          <p style={{fontSize:13,fontWeight:600,color:C.black}}>Note globale</p>
          <p style={{fontSize:12,color:C.light}}>Basée sur {reviews} avis vérifiés</p>
          <span style={{...S.ratingLabel,
            background: globalRating>=4.9?"#F0FDF4":globalRating>=4.7?"#EFF6FF":"#FFF7ED",
            color:      globalRating>=4.9?"#16A34A":globalRating>=4.7?"#2563EB":"#EA580C"
          }}>
            {globalRating>=4.9?"Exceptionnel":globalRating>=4.7?"Très bien":globalRating>=4.5?"Bien":"Correct"}
          </span>
        </div>
      </div>

      {/* Point fort mis en avant */}
      {topCriteria && (
        <div style={S.topCriteriaChip}>
          <span style={{fontSize:16}}>{topCriteria.icon}</span>
          <div>
            <p style={{fontSize:12,fontWeight:700,color:C.coral}}>Point fort · {topCriteria.label}</p>
            <p style={{fontSize:11,color:C.mid}}>Noté {topKey[1].toFixed(1)} / 5 par les locataires</p>
          </div>
        </div>
      )}

      {/* Critères en barres */}
      <div style={{...S.criteriaGrid, marginTop:14}}>
        {RATING_CRITERIA.map(c => {
          const score = ratingData[c.key];
          if (score == null) return null;
          const pct   = (score / 5) * 100;
          return (
            <div key={c.key} style={S.criteriaRow}>
              <div style={S.criteriaLeft}>
                <span style={{fontSize:15}}>{c.icon}</span>
                <span style={S.criteriaLabel}>{c.label}</span>
              </div>
              <div style={S.criteriaRight}>
                <div style={S.progressTrack}>
                  <div style={{...S.progressFill,
                    width:`${pct}%`,
                    background: score>=4.8?C.coral:score>=4.5?"#F59E0B":"#9CA3AF"
                  }}/>
                </div>
                <span style={S.criteriaScore}>{score.toFixed(1)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Avis utilisateurs */}
      {revList.length > 0 && (
        <div style={{marginTop:20}}>
          <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:12}}>Ce que disent les locataires</p>
          {(showAll ? revList : revList.slice(0,2)).map((rev,i) => (
            <div key={i} style={S.reviewCard}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <FaceAvatar photo={rev.photo} avatar={rev.avatar} bg={rev.bg} size={36}/>
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:600,color:C.black}}>{rev.name}</p>
                  <p style={{fontSize:11,color:C.light}}>{rev.date}</p>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4,background:"#FFF5F5",borderRadius:10,padding:"3px 8px"}}>
                  <Icon name="star" size={11} color={C.coral}/>
                  <span style={{fontSize:12,fontWeight:700,color:C.coral}}>{rev.score.toFixed(1)}</span>
                </div>
              </div>
              <p style={{fontSize:13,color:C.mid,lineHeight:1.65}}>{rev.text}</p>
            </div>
          ))}
          {revList.length > 2 && (
            <button
              style={{background:"none",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 0",width:"100%",fontSize:13,fontWeight:600,color:C.dark,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:8}}
              onClick={()=>setShowAll(v=>!v)}
            >
              {showAll ? "Afficher moins ↑" : `Voir les ${revList.length} avis →`}
            </button>
          )}
        </div>
      )}

      {/* CTA laisser un avis */}
      <button style={S.leaveReviewBtn} onClick={onReview}>
        <Icon name="star" size={15} color={C.coral}/>
        <span>Donner mon avis</span>
      </button>
    </div>
  );
}

/* ─── REVIEW SHEET ──────────────────────────────── */
function ReviewSheet({ item, onClose, onSubmit }) {
  const init = Object.fromEntries(RATING_CRITERIA.map(c=>[c.key, 4]));
  const [scores, setScores] = useState(init);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const avg = (Object.values(scores).reduce((s,v)=>s+v,0) / RATING_CRITERIA.length).toFixed(1);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { onSubmit?.(); onClose(); }, 2000);
  };

  return (
    <>
      <div style={{...S.sheetBackdrop,zIndex:300}} onClick={onClose}/>
      <div style={{...S.sheet,zIndex:301,maxHeight:"90vh"}} className="sheet">
        <div style={S.sheetHandle}/>

        {submitted ? (
          <div style={{padding:"32px 24px 48px",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
            <div style={S.successCircle}><svg width="32" height="32" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
            <p style={{fontSize:18,fontWeight:800,color:C.black,textAlign:"center"}}>Avis publié !</p>
            <p style={{fontSize:13,color:C.mid,textAlign:"center"}}>Merci pour votre retour sur <strong>{item.title}</strong>.</p>
          </div>
        ) : (
          <>
            <div style={S.sheetHeader}>
              <p style={S.sheetTitle}>Votre avis</p>
              <button style={S.sheetClose} onClick={onClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{padding:"0 20px",overflowY:"auto",flex:1}}>
              {/* Property pill */}
              <div style={{display:"flex",alignItems:"center",gap:8,background:C.bg,borderRadius:12,padding:"8px 12px",marginBottom:18}}>
                <ByerPin size={14}/>
                <p style={{fontSize:12,fontWeight:600,color:C.dark}}>{item.title}</p>
              </div>

              {/* Note globale calculée */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                <p style={{fontSize:13,fontWeight:600,color:C.dark}}>Votre note globale</p>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <RatingStars score={parseFloat(avg)} size={16}/>
                  <span style={{fontSize:18,fontWeight:800,color:C.coral}}>{avg}</span>
                </div>
              </div>

              {/* Critères — étoiles + légende */}
              {RATING_CRITERIA.map(c => (
                <div key={c.key} style={{marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <p style={{fontSize:13,fontWeight:600,color:C.dark}}>
                      {c.icon}&nbsp;{c.label}
                    </p>
                    <span style={{
                      fontSize:11,fontWeight:700,
                      color:scores[c.key]>=5?"#16A34A":scores[c.key]>=4?C.coral:scores[c.key]>=3?"#F59E0B":"#9CA3AF",
                      background:scores[c.key]>=5?"#F0FDF4":scores[c.key]>=4?"#FFF5F5":scores[c.key]>=3?"#FFFBEB":C.bg,
                      padding:"2px 9px",borderRadius:20,transition:"all .18s",
                    }}>
                      {STAR_LABELS[scores[c.key]]}
                    </span>
                  </div>

                  <div style={{display:"flex",gap:5}}>
                    {[1,2,3,4,5].map(v=>(
                      <button
                        key={v}
                        onClick={()=>setScores(p=>({...p,[c.key]:v}))}
                        style={{
                          flex:1, height:40, borderRadius:10, border:"none", cursor:"pointer",
                          background: scores[c.key]>=v ? C.coral : C.bg,
                          transition:"all .18s", display:"flex",
                          alignItems:"center", justifyContent:"center",
                          boxShadow: scores[c.key]===v ? `0 2px 8px ${C.coral}44` : "none",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24"
                          fill={scores[c.key]>=v?"white":"#D1D5DB"}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      </button>
                    ))}
                  </div>

                  <div style={{display:"flex",marginTop:4}}>
                    {[1,2,3,4,5].map(v=>(
                      <span key={v} style={{
                        flex:1, textAlign:"center",
                        fontSize:9,
                        fontWeight: scores[c.key]===v ? 700 : 400,
                        color: scores[c.key]===v ? C.coral : "#C4C4C4",
                        transition:"all .18s",
                        lineHeight:1.3,
                      }}>
                        {STAR_LABELS[v]}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {/* Commentaire libre */}
              <div style={{marginBottom:24}}>
                <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:8}}>Commentaire (optionnel)</p>
                <textarea
                  style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:14,padding:"12px 14px",fontSize:14,color:C.dark,fontFamily:"'DM Sans',sans-serif",resize:"none",outline:"none",lineHeight:1.6,background:C.white}}
                  rows={3}
                  placeholder="Décrivez votre expérience…"
                  value={comment}
                  onChange={e=>setComment(e.target.value)}
                />
              </div>

              <button style={{...S.payBtn,marginBottom:8}} onClick={handleSubmit}>
                Publier mon avis
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ─── EMPTY STATE ──────────────────────────────── */
function EmptyState({ icon, text }) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:260,padding:24,gap:12}}>
      <Icon name={icon} size={44} color={C.border} stroke={1.5}/>
      {text && <p style={{fontSize:13,color:C.light,textAlign:"center",maxWidth:240,lineHeight:1.6}}>{text}</p>}
    </div>
  );
}

/* ─── DIVIDER ──────────────────────────────────── */
function Divider() { return <div style={{height:1,background:C.border,margin:"18px 0"}}/>; }


/* ═══ js/auth.js ═══ */
/* Byer — Auth Screens */

/* ─── SPLASH ─────────────────────────────────────── */
function SplashScreen({ onDone }) {
  useState(()=>{ const t = setTimeout(onDone, 2600); return ()=>clearTimeout(t); });
  return (
    <div style={{...Os.root, background:C.coral, justifyContent:"center", alignItems:"center"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500;9..40,700;9..40,800&display=swap');
        @keyframes splashPop  { 0%{opacity:0;transform:scale(.5)} 65%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1)} }
        @keyframes splashFade { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
        .spl-logo { animation: splashPop  .8s cubic-bezier(.34,1.56,.64,1) .1s both; }
        .spl-name { animation: splashFade .45s ease .75s both; }
        .spl-sub  { animation: splashFade .45s ease 1s both; }
      `}</style>

      {/* Logo B */}
      <div className="spl-logo" style={{marginBottom:28}}>
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect width="120" height="120" rx="34" fill="rgba(255,255,255,.22)"/>
          <path
            d="M36 34h27a14 14 0 010 28H36m0 0h29a14 14 0 010 28H36V34z"
            stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="spl-name" style={{
        fontSize:22, fontWeight:700, color:"rgba(255,255,255,.7)",
        letterSpacing:4, textTransform:"uppercase",
        fontFamily:"'DM Sans',sans-serif", marginBottom:10,
      }}>
        byer
      </p>

      <p className="spl-sub" style={{
        fontSize:15, color:"rgba(255,255,255,.85)",
        fontFamily:"'DM Sans',sans-serif", fontWeight:500,
      }}>
        vous souhaite la bienvenue 👋
      </p>
    </div>
  );
}

/* ─── ONBOARDING ─────────────────────────────────── */
function OnboardingScreen({ onDone }) {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;

  return (
    <div style={Os.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap');
        @keyframes slideIn { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        .slide-content { animation: slideIn .38s ease both; }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',-apple-system,sans-serif;}
      `}</style>

      {/* Full-bleed photo */}
      <div style={{position:"relative",height:"58%",flexShrink:0,overflow:"hidden"}}>
        <img
          key={idx}
          src={slide.img}
          alt=""
          className="slide-content"
          style={{width:"100%",height:"100%",objectFit:"cover"}}
        />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.55) 100%)"}}/>

        {/* Skip */}
        <button
          style={{position:"absolute",top:52,right:20,background:"rgba(255,255,255,.18)",border:"none",borderRadius:20,padding:"7px 16px",fontSize:13,fontWeight:600,color:"white",cursor:"pointer",backdropFilter:"blur(8px)"}}
          onClick={onDone}
        >
          Passer
        </button>

        {/* Tag pill on photo */}
        <div key={`tag-${idx}`} className="slide-content" style={{position:"absolute",bottom:22,left:20}}>
          <span style={{background:slide.accent,color:"white",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20}}>
            {slide.tag}
          </span>
        </div>
      </div>

      {/* Content card */}
      <div style={{flex:1,background:C.white,borderRadius:"26px 26px 0 0",marginTop:-20,padding:"28px 28px 0",display:"flex",flexDirection:"column"}}>

        {/* Dots */}
        <div style={{display:"flex",gap:6,marginBottom:22}}>
          {SLIDES.map((_,i) => (
            <div key={i} style={{height:4,borderRadius:2,transition:"all .3s ease",
              width: i===idx ? 28 : 8,
              background: i===idx ? slide.accent : C.border,
            }}/>
          ))}
        </div>

        <div key={`body-${idx}`} className="slide-content">
          <p style={{fontSize:30,fontWeight:800,color:C.black,lineHeight:1.2,marginBottom:14,whiteSpace:"pre-line"}}>
            {slide.title}
          </p>
          <p style={{fontSize:15,color:C.mid,lineHeight:1.7,marginBottom:32}}>
            {slide.sub}
          </p>
        </div>

        {/* CTA */}
        <div style={{display:"flex",gap:12,marginTop:"auto",paddingBottom:36}}>
          {idx > 0 && (
            <button
              style={{flex:1,padding:"15px",borderRadius:16,border:`1.5px solid ${C.border}`,background:C.white,fontSize:15,fontWeight:600,color:C.dark,cursor:"pointer"}}
              onClick={()=>setIdx(i=>i-1)}
            >
              ← Retour
            </button>
          )}
          <button
            style={{flex:2,padding:"15px",borderRadius:16,border:"none",background:slide.accent,fontSize:15,fontWeight:700,color:"white",cursor:"pointer",transition:"opacity .18s"}}
            onClick={()=> isLast ? onDone() : setIdx(i=>i+1)}
          >
            {isLast ? "Commencer →" : "Suivant →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── LOGIN ──────────────────────────────────────── */
function LoginScreen({ onLogin, onSignup, onForgotPassword, onSSO }) {
  const [method, setMethod]  = useState("email");
  const [email, setEmail]    = useState("");
  const [phone, setPhone]    = useState("");
  const [pwd, setPwd]        = useState("");
  const [showPwd, setShowPwd]= useState(false);
  const [loading, setLoading]= useState(false);
  const [err, setErr]        = useState("");

  const handle = async () => {
    const id = method==="email" ? email : phone;
    if (!id.trim())  { setErr(method==="email"?"Entrez votre adresse email.":"Entrez votre numéro de téléphone."); return; }
    if (!pwd.trim()) { setErr("Entrez votre mot de passe."); return; }
    setErr(""); setLoading(true);

    // ── Connexion réelle Supabase si configuré, sinon mock ──
    const db = window.byer && window.byer.db;
    if (db && db.isReady && method === "email") {
      const { data, error } = await db.auth.signIn(email.trim().toLowerCase(), pwd);
      setLoading(false);
      if (error) {
        // Messages d'erreur Supabase traduits
        const msg = error.message || "";
        if (/Invalid login credentials/i.test(msg)) setErr("Email ou mot de passe incorrect.");
        else if (/Email not confirmed/i.test(msg)) setErr("Email non confirmé — vérifiez votre boîte de réception.");
        else setErr(msg);
        return;
      }
      if (data && data.session) {
        // SIGNED_IN va aussi être capté par main.js — on appelle quand même
        // onLogin pour être robuste (au cas où l'event ne fire pas dans
        // certains navigateurs)
        onLogin();
      }
      return;
    }

    // Téléphone (Twilio non encore configuré côté Supabase) → mock pour l'instant
    if (db && db.isReady && method === "phone") {
      setLoading(false);
      setErr("Connexion par SMS bientôt disponible. Utilisez votre email.");
      return;
    }

    // Fallback mock (Supabase indisponible)
    setTimeout(()=>{ setLoading(false); onLogin(); }, 1400);
  };

  return (
    <div style={Os.root}>
      <style>{AUTH_CSS}</style>

      {/* Hero */}
      <div style={Os.authHero}>
        <div style={Os.authLogoWrap}>
          <svg width="38" height="38" viewBox="0 0 30 30" fill="none">
            <rect width="30" height="30" rx="9" fill="rgba(255,255,255,.25)"/>
            <path d="M9 8h6.5a3.5 3.5 0 010 7H9m0 0h7a3.5 3.5 0 010 7H9V8z"
              stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={Os.authLogoTxt}>byer</span>
        </div>
        <p style={Os.authTitle}>Bon retour ! 👋</p>
        <p style={Os.authSub}>Connectez-vous pour continuer</p>
      </div>

      {/* Form card */}
      <div style={Os.authCard}>

        {/* Socials */}
        <div style={{display:"flex",gap:10,marginBottom:18}}>
          {[
            { label:"Google", icon:<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
            { label:"Apple",  icon:<svg width="18" height="18" viewBox="0 0 24 24" fill={C.black}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> },
          ].map(s=>(
            <button key={s.label} style={Os.socialBtn} onClick={()=>onSSO?.(s.label)}>
              {s.icon}
              <span style={{fontSize:13,fontWeight:600,color:C.dark}}>{s.label}</span>
            </button>
          ))}
        </div>

        <div style={Os.dividerRow}>
          <div style={Os.dividerLine}/>
          <span style={Os.dividerTxt}>ou avec</span>
          <div style={Os.dividerLine}/>
        </div>

        {/* Toggle Email / Téléphone */}
        <div style={Os.methodToggle}>
          {[
            { id:"email", label:"Email",     icon:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
            { id:"phone", label:"Téléphone", icon:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> },
          ].map(m=>(
            <button
              key={m.id}
              style={{...Os.methodBtn,...(method===m.id?Os.methodBtnOn:{})}}
              onClick={()=>{ setMethod(m.id); setErr(""); }}
            >
              <span style={{color:method===m.id?C.coral:C.mid}}>{m.icon}</span>
              <span style={{fontSize:13,fontWeight:600,color:method===m.id?C.coral:C.mid}}>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Identifiant selon méthode */}
        <div style={{marginBottom:14}}>
          <label style={Os.fieldLabel}>
            {method==="email" ? "Adresse email" : "Numéro de téléphone"}
          </label>
          <div style={Os.fieldWrap}>
            {method==="email"
              ? <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              : <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            }
            {method==="phone" && (
              <span style={{fontSize:13,fontWeight:600,color:C.dark,paddingRight:6,borderRight:`1px solid ${C.border}`}}>+237</span>
            )}
            <input
              key={method}
              style={Os.fieldInput}
              type={method==="email"?"email":"tel"}
              placeholder={method==="email"?"votre@email.com":"6XX XXX XXX"}
              value={method==="email"?email:phone}
              onChange={e=>{ method==="email"?setEmail(e.target.value):setPhone(e.target.value); setErr(""); }}
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div style={{marginBottom:6}}>
          <label style={Os.fieldLabel}>Mot de passe</label>
          <div style={Os.fieldWrap}>
            <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <input
              style={Os.fieldInput}
              type={showPwd?"text":"password"} placeholder="••••••••"
              value={pwd} onChange={e=>{setPwd(e.target.value);setErr("");}}
              onKeyDown={e=>e.key==="Enter"&&handle()}
            />
            <button style={{background:"none",border:"none",cursor:"pointer",padding:2}} onClick={()=>setShowPwd(v=>!v)}>
              <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                {showPwd
                  ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        <button
          onClick={()=>onForgotPassword?.(method==="email"?email:"")}
          style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.coral,fontWeight:600,fontFamily:"'DM Sans',sans-serif",textAlign:"right",width:"100%",marginBottom:18}}>
          Mot de passe oublié ?
        </button>

        {err && <p style={{fontSize:12,color:"#EF4444",marginBottom:12,textAlign:"center"}}>{err}</p>}

        <button style={{...Os.ctaBtn, opacity:loading?.7:1}} onClick={handle} disabled={loading}>
          {loading ? <div style={Os.spinner}/> : "Se connecter"}
        </button>

        <p style={{textAlign:"center",fontSize:13,color:C.mid,marginTop:18}}>
          Pas encore de compte ?{" "}
          <button style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.coral,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}} onClick={onSignup}>
            Créer un compte
          </button>
        </p>
      </div>
    </div>
  );
}

/* ─── SIGNUP ─────────────────────────────────────── */
function SignupScreen({ onBack, onDone, onNeedVerify }) {
  const [step, setStep]      = useState(1);
  const [form, setForm]      = useState({ name:"", email:"", phone:"", pwd:"", role:"locataire", promo:"" });
  const [showPwd, setShowPwd]= useState(false);
  const [loading, setLoading]= useState(false);
  const [code, setCode]      = useState(["","","","",""]);
  const [err, setErr]        = useState("");
  const [promoStatus, setPromoStatus] = useState(null); // null | "valid" | "invalid"
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  // Validation simple : code parrainage = 6+ chars alphanumériques se terminant par "24"
  const validatePromo = (val) => {
    const cleaned = (val || "").trim().toUpperCase();
    if (!cleaned) return null;
    return /^[A-Z0-9]{4,}24$/.test(cleaned) ? "valid" : "invalid";
  };

  const handlePromoChange = (val) => {
    set("promo", val.toUpperCase());
    setPromoStatus(validatePromo(val));
  };

  const handleStep1 = () => {
    if (!form.name.trim()||!form.email.trim()||!form.phone.trim()||!form.pwd.trim()) return;
    setStep(2);
  };
  const handleStep2 = () => setStep(3);
  // Crédite les points de bienvenue si code de parrainage valide (côté local + plus tard côté Supabase)
  const creditPromoBonus = () => {
    if (form.promo && validatePromo(form.promo) === "valid") {
      try {
        pointsManager.add(POINTS_CONFIG.perReferral);
        pointsManager.addCoupon({
          rewardId: "welcome_promo",
          label: `Bonus parrainage (${form.promo})`,
          type: "welcome",
          value: POINTS_CONFIG.perReferral * POINTS_CONFIG.ratio,
        });
      } catch (e) { /* localStorage indisponible */ }
    }
  };

  const handleVerify = async () => {
    setErr(""); setLoading(true);

    // ── Inscription réelle Supabase si configuré, sinon mock ──
    const db = window.byer && window.byer.db;
    if (db && db.isReady) {
      // Métadonnées passées au trigger handle_new_auth_user (qui crée le profile)
      const { data, error } = await db.raw.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.pwd,
        options: {
          data: {
            name: form.name.trim(),
            phone: form.phone.trim() ? `+237${form.phone.replace(/\D/g,'')}` : null,
            role: form.role,
            promo_code: form.promo ? form.promo.trim().toUpperCase() : null,
          },
        },
      });
      setLoading(false);
      if (error) {
        const msg = error.message || "";
        if (/already registered/i.test(msg) || /already been registered/i.test(msg))
          setErr("Cette adresse email est déjà utilisée. Essayez de vous connecter.");
        else if (/Password should be at least/i.test(msg))
          setErr("Le mot de passe doit contenir au moins 6 caractères.");
        else if (/Invalid email/i.test(msg))
          setErr("Adresse email invalide.");
        else
          setErr(msg);
        return;
      }
      // Bonus de parrainage local (sera dupliqué côté Supabase plus tard via Edge Function)
      creditPromoBonus();
      // Si une session existe déjà → email confirmation désactivée → on entre dans l'app
      if (data && data.session) { onDone(); return; }
      // Sinon → email confirmation requise → écran "Vérifie ton email"
      if (onNeedVerify) onNeedVerify(form.email.trim().toLowerCase());
      else onDone();
      return;
    }

    // Fallback mock (Supabase indisponible)
    setTimeout(()=>{
      creditPromoBonus();
      setLoading(false); onDone();
    }, 1400);
  };

  return (
    <div style={Os.root}>
      <style>{AUTH_CSS}</style>

      {/* Header */}
      <div style={{background:C.white,padding:"var(--top-pad) 20px 16px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${C.border}`}}>
        <button style={{background:"none",border:"none",cursor:"pointer",display:"flex"}} onClick={step===1?onBack:()=>setStep(s=>s-1)}>
          <svg width="22" height="22" fill="none" stroke={C.dark} strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{flex:1}}>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>
            {step===1?"Créer un compte":step===2?"Votre profil":"Vérification"}
          </p>
          <p style={{fontSize:12,color:C.light,marginTop:2}}>Étape {step} sur 3</p>
        </div>
        <div style={{width:60,height:4,borderRadius:2,background:C.border,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(step/3)*100}%`,background:C.coral,borderRadius:2,transition:"width .3s ease"}}/>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"24px 20px 40px"}}>

        {/* Step 1 : Infos de base */}
        {step===1 && (
          <div>
            <p style={{fontSize:22,fontWeight:800,color:C.black,marginBottom:6}}>Vos informations</p>
            <p style={{fontSize:14,color:C.mid,marginBottom:24}}>Créez votre compte Byer en quelques secondes.</p>

            {[
              {k:"name",  label:"Nom complet",      type:"text",  icon:"user",    ph:"Jean Dupont"},
              {k:"email", label:"Adresse email",     type:"email", icon:"mail",    ph:"jean@email.com"},
              {k:"phone", label:"Téléphone (+237)",  type:"tel",   icon:"phone",   ph:"6XX XXX XXX"},
            ].map(f=>(
              <div key={f.k} style={{marginBottom:16}}>
                <label style={Os.fieldLabel}>{f.label}</label>
                <div style={Os.fieldWrap}>
                  <SignupFieldIcon name={f.icon}/>
                  <input
                    style={Os.fieldInput} type={f.type} placeholder={f.ph}
                    value={form[f.k]} onChange={e=>set(f.k,e.target.value)}
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div style={{marginBottom:28}}>
              <label style={Os.fieldLabel}>Mot de passe</label>
              <div style={Os.fieldWrap}>
                <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input style={Os.fieldInput} type={showPwd?"text":"password"} placeholder="Min. 8 caractères"
                  value={form.pwd} onChange={e=>set("pwd",e.target.value)}/>
                <button style={{background:"none",border:"none",cursor:"pointer",padding:2}} onClick={()=>setShowPwd(v=>!v)}>
                  <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              {form.pwd.length>0 && (
                <div style={{display:"flex",gap:4,marginTop:6}}>
                  {[1,2,3,4].map(i=>(
                    <div key={i} style={{flex:1,height:3,borderRadius:2,background:
                      form.pwd.length>=8&&i<=4?C.coral:
                      form.pwd.length>=6&&i<=3?"#F59E0B":
                      form.pwd.length>=4&&i<=2?"#FCD34D":
                      i<=1?"#FCA5A5":C.border
                    }}/>
                  ))}
                  <span style={{fontSize:10,color:C.light,alignSelf:"center",marginLeft:4}}>
                    {form.pwd.length>=8?"Fort":form.pwd.length>=6?"Moyen":form.pwd.length>=4?"Faible":"Très faible"}
                  </span>
                </div>
              )}
            </div>

            {/* Code promo / parrainage (facultatif) */}
            <div style={{marginBottom:24}}>
              <label style={{...Os.fieldLabel,display:"flex",alignItems:"center",gap:6}}>
                Code promo / parrainage
                <span style={{fontSize:10,fontWeight:500,color:C.light,textTransform:"none",letterSpacing:0}}>(facultatif)</span>
              </label>
              <div style={{
                ...Os.fieldWrap,
                borderColor: promoStatus==="valid" ? "#16A34A" : promoStatus==="invalid" ? "#EF4444" : undefined,
              }}>
                <span style={{fontSize:14,paddingLeft:2}}>🎁</span>
                <input
                  style={{...Os.fieldInput,textTransform:"uppercase",letterSpacing:1.2,fontFamily:"monospace"}}
                  type="text"
                  placeholder="ex. JEAN24"
                  value={form.promo}
                  onChange={e=>handlePromoChange(e.target.value)}
                  maxLength={20}
                />
                {promoStatus==="valid" && (
                  <svg width="16" height="16" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {promoStatus==="invalid" && (
                  <svg width="16" height="16" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                )}
              </div>
              {promoStatus==="valid" && (
                <p style={{fontSize:11,color:"#16A34A",marginTop:6,fontWeight:600}}>
                  ✓ Vous recevrez {POINTS_CONFIG.perReferral} pts de bienvenue à la création du compte
                </p>
              )}
              {promoStatus==="invalid" && (
                <p style={{fontSize:11,color:"#EF4444",marginTop:6}}>
                  Code invalide. Format attendu : 6+ caractères se terminant par 24
                </p>
              )}
              {!promoStatus && (
                <p style={{fontSize:11,color:C.light,marginTop:6}}>
                  Un ami vous a parrainé ? Entrez son code pour gagner {POINTS_CONFIG.perReferral} pts.
                </p>
              )}
            </div>

            <button
              style={{...Os.ctaBtn, opacity:(!form.name||!form.email||!form.phone||!form.pwd)?.5:1}}
              onClick={handleStep1}
            >
              Continuer →
            </button>
          </div>
        )}

        {/* Step 2 : Rôle */}
        {step===2 && (
          <div>
            <p style={{fontSize:22,fontWeight:800,color:C.black,marginBottom:6}}>Vous êtes…</p>
            <p style={{fontSize:14,color:C.mid,marginBottom:24}}>Choisissez votre rôle principal. Vous pourrez changer à tout moment.</p>

            {[
              {
                id:"locataire",
                title:"Locataire / Voyageur",
                sub:"Je cherche un logement ou un véhicule à louer.",
                emoji:"🔍",
                perks:["Rechercher des logements","Réserver et payer","Suivre mes voyages"],
              },
              {
                id:"bailleur",
                title:"Bailleur / Propriétaire",
                sub:"Je propose des biens ou véhicules à la location.",
                emoji:"🏠",
                perks:["Publier des annonces","Gérer les réservations","Recevoir les loyers"],
              },
            ].map(role=>(
              <button
                key={role.id}
                style={{...Os.roleCard,...(form.role===role.id?Os.roleCardOn:{})}}
                onClick={()=>set("role",role.id)}
              >
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
                  <div style={{width:48,height:48,borderRadius:14,background:form.role===role.id?"#FFF5F5":C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                    {role.emoji}
                  </div>
                  <div style={{flex:1,textAlign:"left"}}>
                    <p style={{fontSize:15,fontWeight:700,color:form.role===role.id?C.coral:C.black}}>{role.title}</p>
                    <p style={{fontSize:12,color:C.mid,marginTop:2}}>{role.sub}</p>
                  </div>
                  <div style={{width:20,height:20,borderRadius:10,border:`2px solid ${form.role===role.id?C.coral:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {form.role===role.id && <div style={{width:10,height:10,borderRadius:5,background:C.coral}}/>}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {role.perks.map(p=>(
                    <div key={p} style={{display:"flex",alignItems:"center",gap:7}}>
                      <svg width="13" height="13" fill="none" stroke={form.role===role.id?C.coral:"#9CA3AF"} strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{fontSize:12,color:C.mid}}>{p}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}

            <button style={{...Os.ctaBtn,marginTop:24}} onClick={handleStep2}>Continuer →</button>
          </div>
        )}

        {/* Step 3 : Vérification SMS */}
        {step===3 && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:72,height:72,borderRadius:36,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
              <svg width="32" height="32" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <p style={{fontSize:22,fontWeight:800,color:C.black,textAlign:"center",marginBottom:8}}>Vérifiez votre téléphone</p>
            <p style={{fontSize:14,color:C.mid,textAlign:"center",lineHeight:1.6,marginBottom:32}}>
              Nous avons envoyé un code SMS au<br/>
              <strong style={{color:C.black}}>{form.phone||"+237 6XX XXX XXX"}</strong>
            </p>

            {/* OTP inputs */}
            <div style={{display:"flex",gap:10,marginBottom:10}}>
              {code.map((v,i)=>(
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  value={v}
                  onChange={e=>{
                    const val=e.target.value.replace(/\D/,"");
                    const nc=[...code]; nc[i]=val; setCode(nc);
                    if(val&&i<4) document.getElementById(`otp-${i+1}`)?.focus();
                  }}
                  onKeyDown={e=>{ if(e.key==="Backspace"&&!v&&i>0) document.getElementById(`otp-${i-1}`)?.focus(); }}
                  style={{
                    width:52,height:58,borderRadius:14,textAlign:"center",fontSize:24,fontWeight:700,
                    border:`2px solid ${v?C.coral:C.border}`,outline:"none",
                    background:v?"#FFF5F5":C.white,color:C.black,
                    fontFamily:"'DM Sans',sans-serif",transition:"all .15s",
                  }}
                />
              ))}
            </div>
            <p style={{fontSize:12,color:C.light,marginBottom:err?12:32}}>
              Code SMS bientôt actif — pour l'instant, cliquez directement sur "Créer mon compte"
            </p>

            {err && (
              <p style={{fontSize:13,color:"#EF4444",marginBottom:16,textAlign:"center",padding:"10px 14px",background:"#FEF2F2",borderRadius:10,border:"1px solid #FECACA",width:"100%"}}>
                {err}
              </p>
            )}

            <button
              style={{...Os.ctaBtn,width:"100%",opacity:loading?.7:1}}
              onClick={handleVerify} disabled={loading}
            >
              {loading ? <div style={Os.spinner}/> : "Vérifier et créer mon compte ✓"}
            </button>
            <button style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.coral,fontWeight:600,fontFamily:"'DM Sans',sans-serif",marginTop:16}}>
              Renvoyer le code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SignupFieldIcon({ name }) {
  const icons = {
    user:  <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    mail:  <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    phone: <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  };
  return icons[name]||null;
}

/* ─── VERIFY EMAIL ───────────────────────────────────
   Affiché après signUp réussi quand Supabase exige
   confirmation email. Lien magique → l'event SIGNED_IN
   capté dans main.js basculera l'app automatiquement.
   ─────────────────────────────────────────────────── */
function VerifyEmailScreen({ email, onBack }) {
  const [resending, setResending] = useState(false);
  const [resentMsg, setResentMsg] = useState("");

  const handleResend = async () => {
    setResentMsg(""); setResending(true);
    const db = window.byer && window.byer.db;
    if (db && db.isReady && db.raw) {
      try {
        const { error } = await db.raw.auth.resend({ type: "signup", email });
        if (error) setResentMsg("Erreur : " + error.message);
        else setResentMsg("✓ Email renvoyé. Vérifiez votre boîte.");
      } catch (e) {
        setResentMsg("Erreur : " + (e.message || "inconnue"));
      }
    } else {
      setResentMsg("Mode hors-ligne — relancez l'app et réessayez.");
    }
    setResending(false);
  };

  return (
    <div style={Os.root}>
      <style>{AUTH_CSS}</style>

      {/* Header avec bouton retour */}
      <div style={{background:C.white,padding:"var(--top-pad) 20px 16px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${C.border}`}}>
        <button style={{background:"none",border:"none",cursor:"pointer",display:"flex"}} onClick={onBack}>
          <svg width="22" height="22" fill="none" stroke={C.dark} strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <p style={{fontSize:17,fontWeight:700,color:C.black}}>Vérification email</p>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 24px 40px",textAlign:"center"}}>
        <div style={{width:96,height:96,borderRadius:24,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24}}>
          <span style={{fontSize:48}}>📬</span>
        </div>

        <p style={{fontSize:24,fontWeight:800,color:C.black,marginBottom:12,lineHeight:1.25}}>
          Vérifiez votre email
        </p>

        <p style={{fontSize:14,color:C.mid,lineHeight:1.6,maxWidth:340,marginBottom:8}}>
          Nous avons envoyé un lien de confirmation à
        </p>
        <p style={{fontSize:15,fontWeight:700,color:C.black,marginBottom:24,wordBreak:"break-all",padding:"0 12px"}}>
          {email}
        </p>

        <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:12,padding:"14px 16px",marginBottom:28,maxWidth:360}}>
          <p style={{fontSize:13,color:"#166534",lineHeight:1.55,fontWeight:500}}>
            👉 Cliquez sur le lien dans l'email pour activer votre compte. L'app vous connectera automatiquement.
          </p>
        </div>

        {resentMsg && (
          <p style={{
            fontSize:13,marginBottom:14,padding:"8px 14px",borderRadius:10,
            background: resentMsg.startsWith("✓") ? "#F0FDF4" : "#FEF2F2",
            color:      resentMsg.startsWith("✓") ? "#166534" : "#EF4444",
            border:     "1px solid " + (resentMsg.startsWith("✓") ? "#BBF7D0" : "#FECACA"),
          }}>{resentMsg}</p>
        )}

        <button
          onClick={handleResend}
          disabled={resending}
          style={{
            background:"none",border:`1.5px solid ${C.border}`,
            padding:"12px 24px",borderRadius:12,fontSize:14,fontWeight:600,
            color:C.dark,cursor:resending?"not-allowed":"pointer",opacity:resending?.6:1,
            fontFamily:"'DM Sans',sans-serif",marginBottom:14,
          }}
        >
          {resending ? "Envoi…" : "Renvoyer l'email"}
        </button>

        <button
          onClick={onBack}
          style={{
            background:"none",border:"none",cursor:"pointer",
            fontSize:13,color:C.coral,fontWeight:700,
            fontFamily:"'DM Sans',sans-serif",
          }}
        >
          ← Retour à la connexion
        </button>

        <p style={{fontSize:11,color:C.light,marginTop:32,maxWidth:300,lineHeight:1.5}}>
          Vous ne recevez rien ? Vérifiez vos courriers indésirables ou contactez <strong>support@byer.cm</strong>
        </p>
      </div>
    </div>
  );
}


/* ═══ js/home.js ═══ */
/* Byer — Home Screen */

/* ─── HOME ──────────────────────────────────────── */
function HomeScreen({ role, setRole, segment, setSegment, propType, setPropType, duration, setDuration, location, onOpenLocPicker, search, setSearch, activeFilterCount, onOpenFilter, items, saved, toggleSave, openDetail, openGallery, onOpenNotifs, onOpenDashboard, onOpenPublish, onOpenPros, onOpenTechs, onOpenBoost }) {
  const isBailleur = role === "bailleur";

  /* Greeting selon role + segment — aligné à l'app
     (location immobilière + véhicules au Cameroun).
     Côté locataire : phrases courtes et directes.
     Côté bailleur  : on pilote des locations & des revenus. */
  const greeting = isBailleur
    ? (segment==="property"
        ? "Pilotez vos locations immobilières"
        : "Pilotez vos locations de véhicules")
    : (segment==="property"
        ? "Votre logement à portée de main !"
        : "Prêt à prendre la route ?");

  /* Stats du bailleur (mock dérivé des données) */
  const ownerProperties = PROPERTIES.slice(0, 4);   // mes annonces (mock)
  const ownerVehicles   = VEHICLES.slice(0, 3);
  const myListings      = segment==="property" ? ownerProperties : ownerVehicles;
  const incomingReqs    = BOOKINGS.filter(b => b.status === "upcoming").length;
  const activeBookings  = BOOKINGS.filter(b => b.status === "active").length;
  const monthRevenue    = BOOKINGS.reduce((s,b)=>s+(b.price*b.nights),0);

  return (
    <div>
      <div style={S.stickyTop}>
        {/* Header row : logo · localisation · cloche */}
        <div style={S.logoRow}>
          {/* Logo */}
          <div style={S.logoMark}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <rect width="30" height="30" rx="9" fill={C.coral}/>
              <path d="M9 8h6.5a3.5 3.5 0 010 7H9m0 0h7a3.5 3.5 0 010 7H9V8z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span style={S.logoTxt}>byer</span>
          </div>

          {/* Localisation pill (centre) */}
          <button style={S.locPill} onClick={onOpenLocPicker}>
            <ByerPin size={18}/>
            <div style={S.locTexts}>
              <span style={S.locSub}>Vous êtes à</span>
              <span style={S.locLabel}>{location.label}</span>
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Cloche */}
          <button style={S.bellBtn} aria-label="Notifications" onClick={onOpenNotifs}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <div style={{position:"absolute",top:4,right:4,width:10,height:10,borderRadius:5,background:C.coral,border:"2px solid white",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/>
          </button>
        </div>

        <p style={S.greeting}>{greeting}</p>

        {/* Search + Duration toggle on same row — pour bailleur : recherche dans MES annonces */}
        <div style={S.searchRow}>
          <div style={S.searchWrap}>
            <Icon name="search" size={17} color={C.mid}/>
            <input
              style={S.searchIn}
              placeholder={isBailleur
                ? (segment==="property"?"Rechercher dans mes logements…":"Rechercher dans ma flotte…")
                : (segment==="property"?"Ville, quartier, type…":"Ville, type de véhicule…")}
              value={search} onChange={e=>setSearch(e.target.value)}
            />
            {search
              ? <button style={S.clearBtn} onClick={()=>setSearch("")}>✕</button>
              : <button style={S.filterIconBtn} onClick={onOpenFilter}>
                  <Icon name="filter" size={17} color={activeFilterCount>0?C.coral:C.dark}/>
                  {activeFilterCount>0 && <div style={S.filterActiveDot}/>}
                </button>
            }
          </div>
          {/* Duration toggle — segment-aware (Nuit/Mois ou Jour/Semaine/Mois) */}
          <div style={S.durToggle}>
            {DURATION_OPTS[segment].map(opt => (
              <button key={opt.id}
                style={{...S.durBtn,...(duration===opt.id?S.durBtnOn:{})}}
                onClick={()=>setDuration(opt.id)}
              >{opt.label}</button>
            ))}
          </div>
        </div>

        {/* Segment tabs — labels adaptés au rôle */}
        <div style={S.segments}>
          {[
            {id:"property",label:isBailleur?"Mes logements":"Logements",icon:"home"},
            {id:"vehicle", label:isBailleur?"Ma flotte":"Véhicules",     icon:"car"},
          ].map(s=>(
            <button key={s.id} style={{...S.seg,...(segment===s.id?S.segOn:{})}} onClick={()=>setSegment(s.id)}>
              <Icon name={s.icon} size={15} color={segment===s.id?C.coral:C.mid} stroke={1.8}/>
              <span style={{...S.segTxt,...(segment===s.id?{color:C.coral}:{})}}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ BAILLEUR OVERVIEW — visible uniquement en mode bailleur ═══ */}
      {isBailleur && (
        <div style={{padding:"12px 16px 0"}}>
          {/* Carte stats */}
          <div style={{
            background:"linear-gradient(135deg,#7E22CE 0%,#A855F7 100%)",
            borderRadius:18,padding:"16px 18px",color:"white",marginBottom:12,
            boxShadow:"0 4px 16px rgba(126,34,206,.25)",
          }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <p style={{fontSize:11,fontWeight:600,opacity:.85,textTransform:"uppercase",letterSpacing:.6}}>Revenus du mois</p>
                <p style={{fontSize:24,fontWeight:800,marginTop:2}}>{fmt(monthRevenue)}</p>
              </div>
              <button onClick={onOpenDashboard} style={{background:"rgba(255,255,255,.18)",border:"1px solid rgba(255,255,255,.3)",borderRadius:10,padding:"7px 11px",cursor:"pointer",color:"white",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>
                Dashboard →
              </button>
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1,background:"rgba(255,255,255,.15)",borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
                <p style={{fontSize:18,fontWeight:800}}>{myListings.length}</p>
                <p style={{fontSize:10,opacity:.85}}>{segment==="property"?"Logements":"Véhicules"}</p>
              </div>
              <div style={{flex:1,background:"rgba(255,255,255,.15)",borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
                <p style={{fontSize:18,fontWeight:800}}>{incomingReqs}</p>
                <p style={{fontSize:10,opacity:.85}}>Demandes</p>
              </div>
              <div style={{flex:1,background:"rgba(255,255,255,.15)",borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
                <p style={{fontSize:18,fontWeight:800}}>{activeBookings}</p>
                <p style={{fontSize:10,opacity:.85}}>En cours</p>
              </div>
            </div>
          </div>

          {/* Quick actions row */}
          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8}}>
            <button onClick={()=>onOpenPublish?.(segment)} style={{flexShrink:0,display:"flex",alignItems:"center",gap:7,padding:"10px 14px",borderRadius:12,background:C.coral,border:"none",cursor:"pointer",color:"white",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>
              <span style={{fontSize:15}}>+</span> Publier {segment==="property"?"un logement":"un véhicule"}
            </button>
            <button onClick={onOpenBoost} style={{flexShrink:0,display:"flex",alignItems:"center",gap:6,padding:"10px 14px",borderRadius:12,background:"#FEF3C7",border:"1px solid #FDE68A",cursor:"pointer",color:"#92400E",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>
              <span style={{fontSize:14}}>🚀</span> Booster
            </button>
            <button onClick={onOpenPros} style={{flexShrink:0,display:"flex",alignItems:"center",gap:6,padding:"10px 14px",borderRadius:12,background:"#FAF5FF",border:"1px solid #E9D5FF",cursor:"pointer",color:"#6B21A8",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>
              <span style={{fontSize:14}}>🛎️</span> Mes pros
            </button>
            <button onClick={onOpenTechs} style={{flexShrink:0,display:"flex",alignItems:"center",gap:6,padding:"10px 14px",borderRadius:12,background:"#F0FDF4",border:"1px solid #BBF7D0",cursor:"pointer",color:"#166534",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>
              <span style={{fontSize:14}}>🔧</span> Techniciens
            </button>
          </div>
        </div>
      )}

      {/* Property-type chips — only for properties */}
      {segment==="property" && (
        <div style={S.typeRow}>
          {PROP_TYPES.map(t=>(
            <button key={t.id} style={{...S.typeChip,...(propType===t.id?S.typeChipOn:{})}} onClick={()=>setPropType(t.id)}>
              <Icon name={t.icon} size={14} color={propType===t.id?C.coral:C.mid} stroke={1.8}/>
              <span style={{...S.typeLabel,...(propType===t.id?{color:C.coral}:{})}}>{t.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Duration info banner */}
      {duration==="month" && segment==="property" && (
        <div style={S.durBanner}>
          <svg width="14" height="14" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{flexShrink:0}}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{fontSize:12,color:C.dark}}>
            Mode <strong>location mensuelle</strong> — idéal pour résidence longue durée.{" "}
            <span style={{color:C.mid}}>{items.length} offre{items.length!==1?"s":""} disponible{items.length!==1?"s":""}.</span>
          </span>
        </div>
      )}
      {segment==="vehicle" && (duration==="week" || duration==="month") && (
        <div style={S.durBanner}>
          <svg width="14" height="14" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{flexShrink:0}}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{fontSize:12,color:C.dark}}>
            Tarif <strong>{duration==="week"?"hebdomadaire":"mensuel"}</strong> — remise automatique appliquée.{" "}
            <span style={{color:C.mid}}>{items.length} véhicule{items.length!==1?"s":""}.</span>
          </span>
        </div>
      )}

      {/* Feed — adapté au rôle */}
      {isBailleur ? (
        <>
          {/* Mes annonces */}
          <div style={{padding:"4px 16px 12px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <p style={S.secTitle}>
                {segment==="property" ? "Mes logements" : "Ma flotte"} ({myListings.length})
              </p>
              <button onClick={onOpenDashboard} style={{background:"none",border:"none",color:C.coral,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                Tout voir →
              </button>
            </div>
            {myListings.length===0 ? (
              <div style={{background:"#FAF5FF",border:"1px dashed #C4B5FD",borderRadius:14,padding:"22px 16px",textAlign:"center"}}>
                <p style={{fontSize:13,color:"#6B21A8",fontWeight:600,marginBottom:6}}>Aucune annonce publiée</p>
                <p style={{fontSize:11,color:"#7C3AED",lineHeight:1.5,marginBottom:12}}>Publiez votre premier {segment==="property"?"logement":"véhicule"} pour commencer à recevoir des réservations.</p>
                <button onClick={()=>onOpenPublish?.(segment)} style={{padding:"10px 18px",background:"#7E22CE",border:"none",borderRadius:10,color:"white",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                  + Publier
                </button>
              </div>
            ) : (
              <div style={S.feedStack}>
                {myListings.map((item,i)=>(
                  <BigCard
                    key={item.id} item={item} idx={i}
                    isSaved={!!saved[item.id]}
                    toggleSave={toggleSave}
                    onTap={()=>openDetail(item)}
                    onGallery={e=>openGallery(item,0,e)}
                    duration={duration}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Espionner la concurrence */}
          <div style={{padding:"12px 16px 12px",borderTop:`6px solid ${C.bg}`,marginTop:8}}>
            <p style={S.secTitle}>Le marché aujourd'hui</p>
            <p style={{fontSize:11,color:C.mid,marginBottom:10,lineHeight:1.5}}>Comparez les prix, l'offre et la concurrence dans votre zone.</p>
            {items.slice(0,3).length === 0 ? (
              <EmptyState icon={segment==="property"?"home":"car"} text="Aucune offre concurrente dans cette sélection."/>
            ) : (
              <div style={S.feedStack}>
                {items.slice(0,3).map((item,i)=>(
                  <PaywallGate key={item.id} item={item} duration={duration}>
                    <BigCard
                      item={item} idx={i}
                      isSaved={!!saved[item.id]}
                      toggleSave={toggleSave}
                      onTap={()=>openDetail(item)}
                      onGallery={e=>openGallery(item,0,e)}
                      duration={duration}
                    />
                  </PaywallGate>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* MODE LOCATAIRE — feed standard */
        <div style={{padding:"4px 16px 12px"}}>
          <p style={S.secTitle}>
            {search || propType!=="all"
              ? `${items.length} résultat${items.length!==1?"s":""}`
              : segment==="property"
                ? duration==="month" ? "Locations longue durée" : "Logements disponibles"
                : duration==="month" ? "Véhicules longue durée"
                : duration==="week"  ? "Véhicules à la semaine"
                : "Véhicules disponibles"
            }
          </p>
          {items.length===0
            ? <EmptyState
                icon={segment==="property"?"home":"car"}
                text={
                  segment==="property"
                    ? (duration==="month"
                        ? "Aucun logement disponible à la location mensuelle dans cette sélection."
                        : "Aucun logement disponible dans cette sélection.")
                    : (duration==="month"
                        ? "Aucun véhicule disponible à la location mensuelle dans cette sélection."
                        : duration==="week"
                          ? "Aucun véhicule disponible à la semaine dans cette sélection."
                          : "Aucun véhicule disponible dans cette sélection.")
                }
              />
            : <div style={S.feedStack}>
                {items.map((item,i)=>(
                  <PaywallGate key={item.id} item={item} duration={duration}>
                    <BigCard
                      item={item} idx={i}
                      isSaved={!!saved[item.id]}
                      toggleSave={toggleSave}
                      onTap={()=>openDetail(item)}
                      onGallery={e=>openGallery(item,0,e)}
                      duration={duration}
                    />
                  </PaywallGate>
                ))}
              </div>
          }
        </div>
      )}
      <div style={{height:24}}/>
    </div>
  );
}

/* ─── BIG CARD ──────────────────────────────────── */
function BigCard({ item, idx, isSaved, toggleSave, onTap, onGallery, duration }) {
  const [imgIdx, setImgIdx] = useState(0);
  const gallery = GALLERY[item.id];
  // Priorité 1 : photos venant de Supabase (item._photos)
  // Priorité 2 : galerie mock indexée par id
  // Priorité 3 : image unique (fallback)
  const imgs    = (item._photos && item._photos.length)
                    ? item._photos
                    : (gallery?.imgs || [item.img]);

  const prev = e => { e.stopPropagation(); setImgIdx(i=>(i-1+imgs.length)%imgs.length); };
  const next = e => { e.stopPropagation(); setImgIdx(i=>(i+1)%imgs.length); };

  const { price, unit } = priceFor(item, duration);
  const showMonthly = item.type==="property" && duration==="month" && item.monthPrice;

  const typeInfo = {
    hotel:   { label:"Hôtel",    bg:"#EFF6FF", color:"#2563EB" },
    motel:   { label:"Motel",    bg:"#F0FDF4", color:"#16A34A" },
    auberge: { label:"Auberge",  bg:"#FFF7ED", color:"#EA580C" },
    villa:   { label:"Villa",    bg:"#FDF4FF", color:"#9333EA" },
    appartement:{ label:"Appart.", bg:C.bg, color:C.mid },
    studio:  { label:"Studio",   bg:C.bg, color:C.mid },
    chambre: { label:"Chambre",  bg:C.bg, color:C.mid },
  };
  const tInfo = item.propType ? (typeInfo[item.propType]||{}) : {};

  const booked   = BOOKED_UNTIL[item.id];
  const avail    = !booked;

  return (
    <div className="bigcard" style={{...S.bigCard, animationDelay:`${idx*55}ms`}}>
      {/* Image */}
      <div style={S.bigImgWrap} onClick={onTap}>
        <img src={imgs[imgIdx]} alt={item.title} style={{...S.bigImg,...(!avail?{filter:"brightness(.75)"}:{})}}/>
        <div style={S.bigGrad}/>

        {imgIdx>0 && <button style={{...S.arrowBtn,left:10}} onClick={prev}><svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>}
        {imgIdx<imgs.length-1 && <button style={{...S.arrowBtn,right:10}} onClick={next}><svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>}

        <div style={S.dotsRow}>{imgs.map((_,i)=><div key={i} style={{...S.dot,...(i===imgIdx?S.dotOn:{})}}/>)}</div>

        {item.superhost && <span style={S.superBadge}>Superhost</span>}

        {!avail && (
          <div style={S.unavailBadge}>
            <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <span>Indisponible · libre le {booked}</span>
          </div>
        )}

        <button style={S.heartBtn} onClick={e=>toggleSave(item.id,e)}>
          <Icon name={isSaved?"heartF":"heart"} size={17} color={isSaved?C.coral:"white"} stroke={2}/>
        </button>
        <button style={S.galleryBtn} onClick={onGallery}>
          <Icon name="grid" size={13} color={C.white} stroke={1.8}/>
          <span style={{fontSize:11,fontWeight:600,color:C.white}}>Voir {imgs.length} photos</span>
        </button>
      </div>

      {/* Info */}
      <div style={S.bigInfo} onClick={onTap}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              {item.type==="property"
                ? <p style={S.bigCity}><ByerPin size={13}/>&nbsp;{item.zone}, {item.city}</p>
                : <p style={S.bigCity}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:3,verticalAlign:"-2px"}}>
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    {item.consumption ? `${item.consumption} L/100km` : "Conso. n/c"}
                  </p>
              }
              {tInfo.label && (
                <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,background:tInfo.bg,color:tInfo.color,flexShrink:0}}>
                  {tInfo.label}
                </span>
              )}
            </div>
            <p style={S.bigTitle}>{item.title}</p>
            <p style={S.bigMeta}>
              {item.type==="property"
                ? `${item.beds} ch. · ${item.baths} sdb · ${item.guests} pers. max`
                : `${item.seats} places · ${item.fuel} · ${item.trans}`}
            </p>
          </div>
          <div style={S.ratingPill}>
            <span style={{fontSize:12,fontWeight:700,color:C.dark}}>{item.rating}</span>
            <RatingStars score={item.rating} size={11}/>
          </div>
        </div>

        <div style={S.tagsRow}>
          {item.amenities.slice(0,3).map(a=><span key={a} style={S.tag}>{a}</span>)}
        </div>

        {/* Price block */}
        <div style={S.bigBottom}>
          <div>
            <span style={S.bigPrice}>{fmt(price)}</span>
            <span style={S.bigNight}>{unit}</span>
            {/* Property : tarif alternatif */}
            {item.type==="property" && item.monthPrice && duration==="night" && (
              <p style={{fontSize:11,color:C.light,marginTop:2}}>ou {fmtM(item.monthPrice)}</p>
            )}
            {item.type==="property" && item.monthPrice && duration==="month" && (
              <p style={{fontSize:11,color:C.light,marginTop:2}}>ou {fmt(item.nightPrice)}/nuit</p>
            )}
            {/* Vehicle : tarif alternatif (jour ↔ semaine/mois) */}
            {item.type==="vehicle" && duration==="week" && (
              <p style={{fontSize:11,color:C.light,marginTop:2}}>{fmt(item.nightPrice)}/jour</p>
            )}
            {item.type==="vehicle" && duration==="month" && (
              <p style={{fontSize:11,color:C.light,marginTop:2}}>{fmt(item.nightPrice)}/jour</p>
            )}
          </div>
          <button style={S.detailBtn} onClick={onTap}>Voir le détail →</button>
        </div>
      </div>
    </div>
  );
}


/* ═══ js/detail.js ═══ */
/* Byer — Detail Screen */

function DetailScreen({ item, saved, toggleSave, onBack, openGallery, duration, onViewOwner, onBook, onOpenAllReviews }) {
  const isSaved   = !!saved[item.id];
  const gallery   = GALLERY[item.id];
  const nights    = 3;
  const hasMonthly = item.type==="property" && item.monthPrice;
  const [localDur, setLocalDur] = useState(duration);
  const booked    = BOOKED_UNTIL[item.id];
  const [reviewOpen, setReviewOpen] = useState(false);

  const ownerEntry = Object.values(OWNERS).find(o =>
    o.buildings.some(b => b.units.some(u => u.id === item.id))
  );
  const ownerName  = ownerEntry?.name || "Ekwalla M.";

  // Tarif calculé via helper (gère vehicle day/week/month et property night/month)
  const { price, unit } = priceFor(item, localDur);

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={S.dScroll}>
        {/* Hero */}
        <div style={{position:"relative",height:280}}>
          <img src={gallery.imgs[0]} alt={item.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.4) 0%,transparent 55%)"}}/>
          <button style={S.dBack} onClick={onBack}><Icon name="back" size={20} color="white" stroke={2.5}/></button>
          <div style={{position:"absolute",top:52,right:16,display:"flex",gap:8}}>
            <button style={S.dAction} onClick={()=>{
              const url = window.location.href;
              const title = `${item.title} — Byer`;
              const text  = `Découvre "${item.title}" à ${item.zone}, ${item.city} sur Byer.`;
              if (navigator.share) {
                navigator.share({ title, text, url }).catch(()=>{});
              } else if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(()=>alert("Lien copié dans le presse-papier !"));
              } else {
                alert("Partagez ce lien : " + url);
              }
            }}><Icon name="share" size={17} color="white" stroke={2}/></button>
            <button style={S.dAction} onClick={e=>toggleSave(item.id,e)}>
              <Icon name={isSaved?"heartF":"heart"} size={17} color={isSaved?C.coral:"white"} stroke={2}/>
            </button>
          </div>
          {item.superhost && <span style={{position:"absolute",bottom:56,left:16,background:"white",borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,color:C.black}}>Superhost</span>}
          <button style={S.heroGalleryBtn} onClick={e=>openGallery(0,e)}>
            <Icon name="grid" size={13} color={C.white} stroke={1.8}/>
            <span style={{fontSize:11,fontWeight:600,color:C.white}}>Voir les {gallery.imgs.length} photos</span>
          </button>
        </div>

        {/* Thumbnail preview */}
        <div style={S.thumbPreviewRow}>
          {gallery.imgs.slice(1).map((img,i)=>(
            <button key={i} style={S.thumbPreview} onClick={e=>openGallery(i+1,e)}>
              <img src={img} alt={gallery.labels[i+1]} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={S.thumbPreviewLabel}>{gallery.labels[i+1]}</div>
            </button>
          ))}
        </div>

        <div style={S.dCard}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:8}}>
            <h1 style={{fontSize:21,fontWeight:700,color:C.black,flex:1,lineHeight:1.25}}>{item.title}</h1>
            <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0,background:C.bg,borderRadius:10,padding:"5px 9px"}}>
              <Icon name="star" size={12} color={C.dark}/>
              <span style={{fontSize:13,fontWeight:700,color:C.black}}>{item.rating}</span>
            </div>
          </div>
          <p style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:C.mid,marginBottom:4}}>
            <ByerPin size={14}/>{item.zone}, {item.city}
          </p>
          <p style={{fontSize:12,color:C.light,marginBottom:16}}>{item.reviews} avis · {item.superhost?"Superhost ✓":"Hôte vérifié"}</p>

          {/* Duration toggle on detail — properties (nuit/mois) */}
          {hasMonthly && (
            <div style={S.detailDurRow}>
              <p style={{fontSize:13,fontWeight:600,color:C.dark}}>Mode de location :</p>
              <div style={S.durToggle}>
                <button style={{...S.durBtn,...(localDur==="night"?S.durBtnOn:{})}} onClick={()=>setLocalDur("night")}>Par nuit</button>
                <button style={{...S.durBtn,...(localDur==="month"?S.durBtnOn:{})}} onClick={()=>setLocalDur("month")}>Par mois</button>
              </div>
            </div>
          )}
          {/* Duration toggle on detail — vehicles (jour/semaine/mois) */}
          {item.type==="vehicle" && (
            <div style={S.detailDurRow}>
              <p style={{fontSize:13,fontWeight:600,color:C.dark}}>Mode de location :</p>
              <div style={S.durToggle}>
                {DURATION_OPTS.vehicle.map(opt => (
                  <button key={opt.id}
                    style={{...S.durBtn,...(localDur===opt.id?S.durBtnOn:{})}}
                    onClick={()=>setLocalDur(opt.id)}
                  >{opt.label}</button>
                ))}
              </div>
            </div>
          )}
          {item.type==="property" && item.monthPrice===null && (
            <div style={{...S.durBanner,marginBottom:16}}>
              <svg width="13" height="13" fill="none" stroke={C.mid} strokeWidth="2" viewBox="0 0 24 24" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style={{fontSize:12,color:C.mid}}>Ce logement n'est disponible qu'à la nuitée.</span>
            </div>
          )}

          <Divider/>

          {/* Stats */}
          <div style={{display:"flex",justifyContent:"space-around",padding:"4px 0"}}>
            {(item.type==="property" ? [
              {icon:"bed",    val:item.beds,   label:"Chambres"},
              {icon:"person", val:item.guests, label:"Voyageurs"},
              {icon:"check",  val:item.baths,  label:"Salle de bain"},
            ] : [
              {icon:"person", val:item.seats,  label:"Places"},
              {icon:"fuel",   val:item.fuel,   label:"Carburant"},
              {icon:"gear",   val:item.trans,  label:"Boîte vitesse"},
            ]).map(s=>(
              <div key={s.label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,flex:1}}>
                <Icon name={s.icon} size={20} color={C.dark} stroke={1.8}/>
                <span style={{fontSize:14,fontWeight:700,color:C.black}}>{s.val}</span>
                <span style={{fontSize:10,color:C.light,fontWeight:500,textAlign:"center"}}>{s.label}</span>
              </div>
            ))}
          </div>

          <Divider/>

          {/* Disponibilité */}
          {booked && (
            <div style={S.unavailDetail}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="18" height="18" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <p style={{fontSize:14,fontWeight:700,color:"#EF4444"}}>Actuellement indisponible</p>
              </div>
              <p style={{fontSize:13,color:C.mid,marginTop:4}}>
                Ce logement est réservé jusqu'au <strong>{booked}</strong>. Vous pouvez le mettre en favori et revenir à cette date.
              </p>
            </div>
          )}
          {!booked && (
            <div style={S.availDetail}>
              <div style={{width:8,height:8,borderRadius:4,background:"#16A34A",boxShadow:"0 0 0 3px #16A34A33"}}/>
              <p style={{fontSize:13,fontWeight:600,color:"#16A34A"}}>Disponible dès maintenant</p>
            </div>
          )}

          <Divider/>

          {/* Host */}
          <button style={{...S.hostRow, cursor:"pointer", width:"100%", textAlign:"left"}} onClick={()=>onViewOwner&&onViewOwner(ownerName)}>
            <FaceAvatar photo={ownerEntry?.photo} avatar={ownerEntry?.avatar||"?"} bg={ownerEntry?.avatarBg} size={46}/>
            <div style={{flex:1}}>
              <p style={{fontSize:14,fontWeight:600,color:C.black}}>{item.type==="property"?"Hébergé par":"Proposé par"} {ownerName}</p>
              <p style={{fontSize:12,color:C.mid,marginTop:1}}>Voir tous ses biens →</p>
            </div>
            {item.superhost && <span style={{background:C.bg,color:C.dark,fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,border:`1.5px solid ${C.border}`}}>✓ Vérifié</span>}
          </button>

          <Divider/>

          <p style={{fontSize:14,color:C.mid,lineHeight:1.72,marginBottom:16}}>
            {item.type==="property"
              ? `Situé à ${item.zone} (${item.city}), ce logement allie confort moderne et ambiance locale. Disponible ${item.monthPrice?"à la nuitée ou en bail mensuel pour une résidence longue durée":"à la nuitée"}.`
              : `Véhicule disponible à ${item.zone} (${item.city}), parfait pour tous vos déplacements.`}
          </p>

          <Divider/>

          {/* Localisation + carte */}
          <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:8}}>Localisation</p>
          <p style={{fontSize:13,color:C.mid,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
            <ByerPin size={14}/>{item.zone}, {item.city}
          </p>
          {(() => {
            const coord = CITY_COORDS[item.city];
            if (!coord) return (
              <div style={{height:160,borderRadius:14,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:C.light,marginBottom:12}}>
                Carte non disponible pour cette ville
              </div>
            );
            const { lat, lon } = coord;
            const bbox = `${lon-0.025},${lat-0.018},${lon+0.025},${lat+0.018}`;
            const src  = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
            return (
              <div style={{borderRadius:14,overflow:"hidden",border:`1.5px solid ${C.border}`,marginBottom:8,position:"relative"}}>
                <iframe
                  title={`Carte ${item.city}`}
                  src={src}
                  width="100%" height="180"
                  style={{border:0,display:"block"}}
                  loading="lazy"
                />
                <a
                  href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{position:"absolute",bottom:8,right:8,background:C.white,padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:600,color:C.coral,textDecoration:"none",boxShadow:"0 2px 6px rgba(0,0,0,.12)"}}
                >Voir en grand ↗</a>
              </div>
            );
          })()}
          <p style={{fontSize:11,color:C.light,marginBottom:4}}>L'emplacement exact est communiqué après la réservation.</p>

          <Divider/>

          {/* Notes détaillées par critère */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <p style={{fontSize:16,fontWeight:700,color:C.black}}>Notes & avis</p>
            {onOpenAllReviews && (SAMPLE_REVIEWS[item.id]?.length > 0) && (
              <button
                style={{background:"none",border:"none",fontSize:12,fontWeight:600,color:C.coral,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
                onClick={()=>onOpenAllReviews(item)}
              >Tous les avis →</button>
            )}
          </div>
          <RatingBreakdown itemId={item.id} globalRating={item.rating} reviews={item.reviews} onReview={()=>setReviewOpen(true)}/>

          <Divider/>

          <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:12}}>{item.type==="property"?"Équipements":"Caractéristiques"}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:4}}>
            {item.amenities.map(a=>(
              <div key={a} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0"}}>
                <Icon name="check" size={14} color={C.coral} stroke={2.5}/>
                <span style={{fontSize:13,color:C.dark}}>{a}</span>
              </div>
            ))}
          </div>

          <Divider/>

          {/* Règles maison / Conditions véhicule */}
          <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:12}}>
            {item.type==="property" ? "Règlement intérieur" : "Conditions du véhicule"}
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:4}}>
            {(item.type==="property" ? [
              {ok:true,  icon:"⏰", label:`Arrivée à partir de 14h00`},
              {ok:true,  icon:"🚪", label:`Départ avant 11h00`},
              {ok:false, icon:"🚭", label:`Non-fumeur (intérieur)`},
              {ok:false, icon:"🎉", label:`Pas de fêtes ni d'évènements`},
              {ok:true,  icon:"🐾", label:`Animaux acceptés sur demande`},
              {ok:true,  icon:"👨‍👩‍👧", label:`Familles bienvenues (jusqu'à ${item.guests} pers.)`},
            ] : [
              {ok:true,  icon:"🪪", label:`Permis B valide depuis 2 ans minimum`},
              {ok:true,  icon:"💳", label:`Caution de 50 000 F (pré-autorisation CB)`},
              {ok:true,  icon:"⛽", label:`Plein restitué — sinon 1 200 F/L`},
              {ok:false, icon:"🚭", label:`Non-fumeur dans le véhicule`},
              {ok:true,  icon:"🛣️", label:`Kilométrage illimité au Cameroun`},
              {ok:false, icon:"🌍", label:`Sortie du territoire interdite sans autorisation`},
            ]).map(rule => (
              <div key={rule.label} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:rule.ok?C.dark:C.mid}}>
                <span style={{fontSize:16,opacity:rule.ok?1:0.6}}>{rule.icon}</span>
                <span>{rule.label}</span>
              </div>
            ))}
          </div>

          <Divider/>

          {/* Politique d'annulation */}
          <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:8}}>Politique d'annulation</p>
          <div style={{padding:"14px 16px",background:"#F0FDF4",borderRadius:14,marginBottom:12,border:"1px solid #BBF7D0"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:14}}>✓</span>
              <p style={{fontSize:13,fontWeight:700,color:"#16A34A"}}>Annulation flexible</p>
            </div>
            <p style={{fontSize:12,color:C.mid,lineHeight:1.55}}>
              Remboursement intégral si vous annulez au moins <strong>48 heures</strong> avant l'arrivée. Au-delà, les frais de service Byer ne sont pas remboursés.
            </p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:4}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.mid,padding:"6px 0",borderBottom:`1px dashed ${C.border}`}}>
              <span>Plus de 48h avant</span><span style={{color:"#16A34A",fontWeight:600}}>100% remboursé</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.mid,padding:"6px 0",borderBottom:`1px dashed ${C.border}`}}>
              <span>Entre 24h et 48h</span><span style={{color:"#F59E0B",fontWeight:600}}>50% remboursé</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.mid,padding:"6px 0"}}>
              <span>Moins de 24h</span><span style={{color:"#EF4444",fontWeight:600}}>Non remboursable</span>
            </div>
          </div>

          <Divider/>

          {/* Date / Period selector */}
          <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:12}}>
            {localDur==="month" ? "Période souhaitée" : "Vos dates"}
          </p>
          <div style={{border:`1.5px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:18}}>
            <div style={{padding:"12px 16px"}}>
              <span style={{display:"block",fontSize:10,fontWeight:700,color:C.light,textTransform:"uppercase",letterSpacing:.6,marginBottom:5}}>
                {localDur==="month" ? "DÉBUT DU BAIL" : "ARRIVÉE / PRISE EN CHARGE"}
              </span>
              <input type="date" style={{border:"none",outline:"none",fontSize:14,color:C.dark,background:"transparent",width:"100%",fontFamily:"'DM Sans',sans-serif"}}/>
            </div>
            <div style={{borderTop:`1px solid ${C.border}`,padding:"12px 16px"}}>
              <span style={{display:"block",fontSize:10,fontWeight:700,color:C.light,textTransform:"uppercase",letterSpacing:.6,marginBottom:5}}>
                {localDur==="month" ? "FIN DU BAIL" : "DÉPART / RETOUR"}
              </span>
              <input type="date" style={{border:"none",outline:"none",fontSize:14,color:C.dark,background:"transparent",width:"100%",fontFamily:"'DM Sans',sans-serif"}}/>
            </div>
          </div>

          {/* Price breakdown — segment + durée awareness */}
          <div style={{background:C.bg,borderRadius:14,padding:"14px 16px"}}>
            {(() => {
              // Construit dynamiquement les lignes selon segment+durée
              let rows, totalLabel, total;
              if (localDur === "month") {
                rows = [
                  { l:`${fmtM(price)} × 1 mois`,        v:fmt(price) },
                  { l:"Frais de dossier Byer (5%)",     v:fmt(Math.round(price*.05)) },
                  { l:"Caution (remboursable)",          v:fmt(price) },
                ];
                totalLabel = "Total 1er mois";
                total = Math.round(price*1.05 + price);
              } else if (localDur === "week") {
                rows = [
                  { l:`${fmt(price)} × 1 semaine`,      v:fmt(price) },
                  { l:"Frais de service Byer (10%)",    v:fmt(Math.round(price*.10)) },
                ];
                totalLabel = "Total semaine";
                total = Math.round(price*1.10);
              } else if (localDur === "day") {
                const days = nights; // réutilise même valeur (3 jours par défaut)
                rows = [
                  { l:`${fmt(price)} × ${days} jours`,  v:fmt(price*days) },
                  { l:"Frais de service Byer (12%)",    v:fmt(Math.round(price*days*.12)) },
                  { l:"Caution véhicule",                v:fmt(50000) },
                ];
                totalLabel = `Total (${days} jours)`;
                total = Math.round(price*days*1.12 + 50000);
              } else {
                // night (property)
                rows = [
                  { l:`${fmt(price)} × ${nights} nuits`,v:fmt(price*nights) },
                  { l:"Frais de service Byer (12%)",    v:fmt(Math.round(price*nights*.12)) },
                  { l:"Taxes locales (5%)",              v:fmt(Math.round(price*nights*.05)) },
                ];
                totalLabel = `Total (${nights} nuits)`;
                total = Math.round(price*nights*1.17);
              }
              return (
                <>
                  {rows.map(row => (
                    <div key={row.l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0"}}>
                      <span style={{fontSize:13,color:C.mid}}>{row.l}</span>
                      <span style={{fontSize:13,color:C.dark,fontWeight:500}}>{row.v}</span>
                    </div>
                  ))}
                  <div style={{height:1,background:C.border,margin:"8px 0"}}/>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontSize:14,fontWeight:700,color:C.black}}>{totalLabel}</span>
                    <span style={{fontSize:14,fontWeight:700,color:C.black}}>{fmt(total)}</span>
                  </div>
                </>
              );
            })()}
          </div>
          <div style={{height:110}}/>
        </div>
      </div>

      <div style={S.dFooter}>
        <div>
          <span style={{fontSize:19,fontWeight:700,color:C.black}}>{fmt(price)}</span>
          <span style={{fontSize:12,color:C.light}}>{unit}</span>
        </div>
        <button style={S.reserveBtn} className="resBtn" onClick={()=>onBook(localDur)}>
          {localDur==="month" && item.type==="property" ? "Louer ce logement"
            : item.type==="vehicle" ? (localDur==="month"?"Louer au mois":localDur==="week"?"Louer à la semaine":"Réserver le véhicule")
            : "Réserver"}
        </button>
      </div>
    </div>
  );
}

/* ─── ALL REVIEWS SCREEN ─────────────────────────── */
function AllReviewsScreen({ item, onBack }) {
  const ratingData = RATINGS[item.id];
  const mockReviews = SAMPLE_REVIEWS[item.id] || [];
  const [sortBy, setSortBy] = useState("recent");

  // Charge les avis réels depuis Supabase si l'annonce est en BDD.
  // Sinon on garde les mocks pour la démo.
  const [dbReviews, setDbReviews] = useState([]);
  React.useEffect(() => {
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady || !item || !item._supabase) return;
    let cancelled = false;
    (async () => {
      const { data } = await db.reviews.listForListing(item.id);
      if (!cancelled && Array.isArray(data)) {
        setDbReviews(data.map(r => ({
          name:   r.profiles?.name || "Voyageur",
          date:   new Date(r.created_at).toLocaleDateString('fr-FR', {month:'long',year:'numeric'}),
          score:  Number(r.rating) || 5,
          text:   r.body || r.comment || "",
          avatar: r.profiles?.avatar_letter || (r.profiles?.name?.[0]?.toUpperCase() || "U"),
          bg:     r.profiles?.avatar_bg || "#FF5A5F",
        })));
      }
    })();
    return () => { cancelled = true; };
  }, [item?.id, item?._supabase]);

  // Source : Supabase si dispo, sinon mocks
  const allReviews = dbReviews.length > 0 ? dbReviews : mockReviews;

  // Génère plus d'avis fictifs en complément (réalisme) — uniquement pour les mocks
  const padded = (!item?._supabase && allReviews.length < 4) ? [
    ...allReviews,
    { name:"Adèle K.",  date:"Déc. 2024", score:4.7, text:"Excellent séjour, je recommande sans hésitation. Tout était conforme à la description.", avatar:"A", bg:"#EC4899" },
    { name:"Boris N.",  date:"Nov. 2024", score:4.8, text:"Hôte très accueillant et bien organisé. Endroit calme.", avatar:"B", bg:"#14B8A6" },
    { name:"Caroline P.",date:"Oct. 2024", score:5.0, text:"Parfait du début à la fin. Logement irréprochable.", avatar:"C", bg:"#F59E0B" },
  ].slice(0, 6) : allReviews;

  const sorted = [...padded].sort((a,b) => {
    if (sortBy === "best")  return b.score - a.score;
    if (sortBy === "worst") return a.score - b.score;
    return 0; // recent = ordre par défaut
  });

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={S.scroll}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"var(--top-pad) 16px 8px",borderBottom:`1px solid ${C.border}`,background:C.white,position:"sticky",top:0,zIndex:10}}>
          <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex"}}>
            <Icon name="back" size={22} color={C.dark} stroke={2}/>
          </button>
          <div style={{flex:1}}>
            <p style={{fontSize:16,fontWeight:700,color:C.black}}>Tous les avis</p>
            <p style={{fontSize:11,color:C.light}}>{item.title}</p>
          </div>
        </div>

        <div style={{padding:"16px"}}>
          {/* Score résumé */}
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18,padding:"14px 16px",background:C.bg,borderRadius:14}}>
            <div style={{textAlign:"center"}}>
              <p style={{fontSize:32,fontWeight:800,color:C.black,lineHeight:1}}>{item.rating.toFixed(1)}</p>
              <RatingStars score={item.rating} size={13}/>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:14,fontWeight:600,color:C.dark}}>{item.reviews} avis vérifiés</p>
              <p style={{fontSize:12,color:C.light,marginTop:2}}>
                {item.rating>=4.9?"Exceptionnel":item.rating>=4.7?"Très bien":"Bien"}
              </p>
            </div>
          </div>

          {/* Sort tabs */}
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            {[
              {id:"recent", label:"Plus récents"},
              {id:"best",   label:"Mieux notés"},
              {id:"worst",  label:"Moins bien notés"},
            ].map(opt => (
              <button key={opt.id}
                onClick={()=>setSortBy(opt.id)}
                style={{
                  padding:"7px 12px",borderRadius:18,fontSize:12,fontWeight:600,cursor:"pointer",
                  border:`1.5px solid ${sortBy===opt.id?C.coral:C.border}`,
                  background:sortBy===opt.id?"#FFF5F5":C.white,
                  color:sortBy===opt.id?C.coral:C.dark,
                  fontFamily:"'DM Sans',sans-serif",
                }}>{opt.label}</button>
            ))}
          </div>

          {/* Critères condensés */}
          {ratingData && (
            <div style={{padding:"12px 14px",background:C.bg,borderRadius:12,marginBottom:18}}>
              <p style={{fontSize:12,fontWeight:700,color:C.dark,marginBottom:8}}>Notes par critère</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 14px"}}>
                {RATING_CRITERIA.map(c => {
                  const sc = ratingData[c.key];
                  if (sc == null) return null;
                  return (
                    <div key={c.key} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.mid}}>
                      <span>{c.icon} {c.label}</span>
                      <span style={{fontWeight:700,color:C.dark}}>{sc.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Liste complète */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {sorted.map((rev,i) => (
              <div key={i} style={S.reviewCard}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <FaceAvatar photo={rev.photo} avatar={rev.avatar} bg={rev.bg} size={40}/>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,fontWeight:600,color:C.black}}>{rev.name}</p>
                    <p style={{fontSize:11,color:C.light}}>{rev.date}</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:4,background:"#FFF5F5",borderRadius:10,padding:"3px 8px"}}>
                    <Icon name="star" size={11} color={C.coral}/>
                    <span style={{fontSize:12,fontWeight:700,color:C.coral}}>{rev.score.toFixed(1)}</span>
                  </div>
                </div>
                <p style={{fontSize:13,color:C.mid,lineHeight:1.65}}>{rev.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══ js/gallery.js ═══ */
/* Byer — Gallery Screen */

function GalleryScreen({ item, startIdx, onBack, onOpenDetail }) {
  const [idx, setIdx] = useState(startIdx);
  const gallery = GALLERY[item.id];
  const imgs    = gallery.imgs;
  const labels  = gallery.labels;

  return (
    <div style={S.galRoot}>
      <style>{BYER_CSS}</style>
      <div style={S.galHeader}>
        <button style={S.galBack} onClick={onBack}><Icon name="close" size={20} color={C.dark} stroke={2}/></button>
        <div style={{textAlign:"center"}}>
          <p style={{fontSize:14,fontWeight:700,color:C.black}}>{item.title}</p>
          <p style={{fontSize:12,color:C.mid}}>{idx+1} / {imgs.length}</p>
        </div>
        <button style={S.galDetailBtn} onClick={onOpenDetail}>Détails</button>
      </div>
      <div style={S.galMain}>
        <img src={imgs[idx]} alt={labels[idx]} style={S.galImg} className="galimg"/>
        <div style={S.galLabel}>{labels[idx]}</div>
        {idx>0 && <button style={{...S.galArrow,left:14}} onClick={()=>setIdx(i=>i-1)}><svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>}
        {idx<imgs.length-1 && <button style={{...S.galArrow,right:14}} onClick={()=>setIdx(i=>i+1)}><svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>}
      </div>
      <div style={S.thumbStrip}>
        {imgs.map((img,i)=>(
          <button key={i} style={{...S.thumb,...(i===idx?S.thumbOn:{})}} onClick={()=>setIdx(i)}>
            <img src={img} alt={labels[i]} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            {i===idx && <div style={S.thumbActiveOverlay}/>}
          </button>
        ))}
      </div>
      <div style={S.labelsStrip}>
        {labels.map((l,i)=>(
          <button key={i} style={{...S.labelChip,...(i===idx?S.labelChipOn:{})}} onClick={()=>setIdx(i)}>{l}</button>
        ))}
      </div>
    </div>
  );
}


/* ═══ js/trips.js ═══ */
/* Byer — Trips & Saved */

/* ─── SAVED ─────────────────────────────────────── */
function SavedScreen({ role, items, openDetail, toggleSave, saved, openGallery, duration }) {
  const [filter, setFilter] = useState("all"); // all | property | vehicle
  const isBailleur = role === "bailleur";

  // Groupage
  const props    = items.filter(i => i.type !== "vehicle");
  const vehicles = items.filter(i => i.type === "vehicle");
  const visible  = filter === "property" ? props : filter === "vehicle" ? vehicles : items;

  // Title & subtitle adaptés au rôle
  const title = isBailleur ? "Veille concurrentielle" : "Mes favoris";

  // Empty state amélioré : quand aucun favori du tout
  if (items.length === 0) {
    return (
      <div>
        <div style={S.pageHead}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <p style={S.pageTitle}>{title}</p>
            {isBailleur && (
              <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8,background:"#FAF5FF",color:"#7E22CE",border:"1px solid #E9D5FF"}}>
                🔑 BAILLEUR
              </span>
            )}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 32px",gap:14,fontFamily:"'DM Sans',sans-serif"}}>
          <div style={{
            width:80,height:80,borderRadius:40,
            background: isBailleur ? "#FAF5FF" : "#FFF5F5",
            display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            <Icon name="heart" size={36} color={isBailleur ? "#7E22CE" : C.coral} stroke={1.5}/>
          </div>
          <p style={{fontSize:16,fontWeight:700,color:C.black,textAlign:"center"}}>
            {isBailleur ? "Aucune annonce surveillée" : "Aucun favori pour le moment"}
          </p>
          <p style={{fontSize:13,color:C.mid,textAlign:"center",lineHeight:1.6,maxWidth:280}}>
            {isBailleur
              ? "Suivez les annonces concurrentes pour ajuster vos tarifs et améliorer vos performances."
              : "Touchez le ❤️ sur un logement ou un véhicule pour le retrouver ici facilement."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={S.pageHead}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <p style={S.pageTitle}>{title}</p>
          {isBailleur && (
            <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8,background:"#FAF5FF",color:"#7E22CE",border:"1px solid #E9D5FF"}}>
              🔑 BAILLEUR
            </span>
          )}
        </div>
        <p style={{fontSize:13,color:C.mid,marginTop:3}}>
          {isBailleur
            ? `${items.length} annonce${items.length>1?"s":""} surveillée${items.length>1?"s":""}`
            : `${items.length} élément${items.length>1?"s":""} sauvegardé${items.length>1?"s":""}`}
        </p>
      </div>

      {/* Tabs filter — affichées seulement si on a au moins 2 catégories */}
      {props.length > 0 && vehicles.length > 0 && (
        <div style={{display:"flex",gap:8,padding:"0 16px 12px"}}>
          {[
            {id:"all",      label:"Tous",       count:items.length},
            {id:"property", label:"Logements",  count:props.length},
            {id:"vehicle",  label:"Véhicules",  count:vehicles.length},
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              style={{
                padding:"7px 14px",borderRadius:18,cursor:"pointer",
                border: filter === t.id ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                background: filter === t.id ? "#FFF5F5" : C.white,
                color: filter === t.id ? C.coral : C.mid,
                fontSize:12,fontWeight:600,
                fontFamily:"'DM Sans',sans-serif",
              }}
            >
              {t.label} <span style={{opacity:.7}}>· {t.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Affichage groupé quand "Tous" et qu'il y a plusieurs catégories */}
      {filter === "all" && props.length > 0 && vehicles.length > 0 ? (
        <div style={{padding:"0 0 32px"}}>
          {props.length > 0 && (
            <>
              <p style={{fontSize:11,fontWeight:700,color:C.light,textTransform:"uppercase",letterSpacing:.5,padding:"8px 16px 6px",fontFamily:"'DM Sans',sans-serif"}}>
                🏠 Logements ({props.length})
              </p>
              <div style={{...S.feedStack, padding:"4px 16px 16px"}}>
                {props.map((it,i)=>(
                  <BigCard key={it.id} item={it} idx={i} isSaved={!!saved[it.id]} toggleSave={toggleSave} onTap={()=>openDetail(it)} onGallery={e=>openGallery(it,0,e)} duration={duration}/>
                ))}
              </div>
            </>
          )}
          {vehicles.length > 0 && (
            <>
              <p style={{fontSize:11,fontWeight:700,color:C.light,textTransform:"uppercase",letterSpacing:.5,padding:"8px 16px 6px",fontFamily:"'DM Sans',sans-serif"}}>
                🚗 Véhicules ({vehicles.length})
              </p>
              <div style={{...S.feedStack, padding:"4px 16px 16px"}}>
                {vehicles.map((it,i)=>(
                  <BigCard key={it.id} item={it} idx={i} isSaved={!!saved[it.id]} toggleSave={toggleSave} onTap={()=>openDetail(it)} onGallery={e=>openGallery(it,0,e)} duration={duration}/>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{...S.feedStack, padding:"4px 16px 32px"}}>
          {visible.length === 0 ? (
            <p style={{textAlign:"center",fontSize:13,color:C.mid,padding:"32px"}}>
              Aucun favori dans cette catégorie.
            </p>
          ) : visible.map((it,i)=>(
            <BigCard key={it.id} item={it} idx={i} isSaved={!!saved[it.id]} toggleSave={toggleSave} onTap={()=>openDetail(it)} onGallery={e=>openGallery(it,0,e)} duration={duration}/>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── TRIPS SCREEN ──────────────────────────────── */
function TripsScreen({ role, openDetail, userBookings = [], onCancelBooking }) {
  const [filter, setFilter] = useState("all");
  const [mapItem, setMapItem] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [acceptTarget, setAcceptTarget] = useState(null);
  const [declineTarget, setDeclineTarget] = useState(null);
  const [tripToast, setTripToast] = useState("");

  // Affichage toast court (3s)
  const flashToast = (msg) => {
    setTripToast(msg);
    setTimeout(() => setTripToast(""), 2400);
  };

  const isBailleur = role === "bailleur";

  // Fusion : réservations utilisateur (récentes en premier) + mocks démo
  // En mode bailleur on simule les réservations entrantes : on enrichit chaque booking avec
  // un "guest" (le voyageur) pour différencier visuellement.
  const allBookings = isBailleur
    ? BOOKINGS.map((b,i)=>({
        ...b,
        guest: ["Caroline N.","David Mboma","Aïcha B.","Junior K.","Sandrine T."][i % 5],
        guestPhoto: `https://i.pravatar.cc/80?img=${20 + i*4}`,
        adults: 2 + (i%3),
        requestedAt: ["Il y a 2h","Il y a 1j","Il y a 3j","Il y a 5j"][i % 4],
        // En mode bailleur, "upcoming" devient "demandes en attente"
        bailleurStatus: b.status === "upcoming" ? "pending" : (b.status === "active" ? "in_progress" : "completed"),
      }))
    : [...userBookings, ...BOOKINGS];

  const filtered = filter === "all"
    ? allBookings
    : isBailleur
      ? allBookings.filter(b => b.bailleurStatus === filter)
      : allBookings.filter(b => b.status === filter);

  const openMaps = (booking, e) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.lat},${booking.lng}&travelmode=driving&destination_place_id=${encodeURIComponent(booking.address)}`;
    window.open(url, "_blank");
  };

  /* Tabs adaptés au rôle */
  const tabs = isBailleur
    ? [
        {id:"all",         label:"Toutes"},
        {id:"pending",     label:"En attente"},
        {id:"in_progress", label:"Séjours en cours"},
        {id:"completed",   label:"Terminés"},
      ]
    : [
        {id:"all",      label:"Tous"},
        {id:"active",   label:"En cours"},
        {id:"upcoming", label:"À venir"},
        {id:"past",     label:"Passés"},
      ];

  /* Title & subtitle adaptés au rôle */
  const title = isBailleur ? "Réservations" : "Mes voyages";
  const pendingCount = isBailleur ? allBookings.filter(b=>b.bailleurStatus==="pending").length : 0;
  const subtitle = isBailleur
    ? (pendingCount > 0
        ? `${pendingCount} demande${pendingCount>1?"s":""} en attente de réponse`
        : `${allBookings.filter(b=>b.bailleurStatus==="in_progress").length} séjour${allBookings.filter(b=>b.bailleurStatus==="in_progress").length>1?"s":""} en cours`)
    : (allBookings.filter(b=>b.status==="active").length > 0
        ? `${allBookings.filter(b=>b.status==="active").length} séjour en cours`
        : `${allBookings.filter(b=>b.status==="upcoming").length} séjour${allBookings.filter(b=>b.status==="upcoming").length>1?"s":""} à venir`);

  return (
    <div>
      <div style={S.pageHead}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <p style={S.pageTitle}>{title}</p>
          {isBailleur && (
            <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8,background:"#FAF5FF",color:"#7E22CE",border:"1px solid #E9D5FF"}}>
              🔑 BAILLEUR
            </span>
          )}
        </div>
        <p style={{fontSize:13,color:C.mid,marginTop:3}}>{subtitle}</p>
      </div>

      {/* Filter tabs */}
      <div style={S.tripsTabs}>
        {tabs.map(f => (
          <button key={f.id} style={{...S.tripsTab,...(filter===f.id?S.tripsTabOn:{})}} onClick={()=>setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      <div style={{padding:"8px 16px 100px",display:"flex",flexDirection:"column",gap:16}}>
        {filtered.length === 0 && (
          <EmptyState
            icon="trips"
            text={isBailleur
              ? (filter==="pending" ? "Aucune demande en attente — vos annonces sont à jour."
                  : filter==="in_progress" ? "Aucun séjour en cours actuellement."
                  : filter==="completed" ? "Aucun séjour terminé pour le moment."
                  : "Aucune réservation reçue. Boostez vos annonces pour augmenter la visibilité.")
              : "Aucune réservation dans cette catégorie"}
          />
        )}

        {/* Bandeau info bailleur : nouvelle demande à traiter */}
        {isBailleur && pendingCount > 0 && filter === "all" && (
          <div style={{background:"#FFF8F8",border:`1px solid #FFD6D7`,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:18}}>🔔</span>
            <div style={{flex:1}}>
              <p style={{fontSize:13,fontWeight:700,color:C.coral,fontFamily:"'DM Sans',sans-serif"}}>
                {pendingCount} demande{pendingCount>1?"s":""} attend{pendingCount>1?"ent":""} votre réponse
              </p>
              <p style={{fontSize:11,color:C.mid,marginTop:1}}>
                Acceptez ou refusez sous 24h pour préserver votre taux de réponse.
              </p>
            </div>
          </div>
        )}

        {/* Bandeau info si l'utilisateur (locataire) vient de créer sa première réservation */}
        {!isBailleur && userBookings.length > 0 && filter === "all" && (
          <div style={{background:"#F0FDF4",border:`1px solid #BBF7D0`,borderRadius:12,padding:"10px 14px"}}>
            <p style={{fontSize:12,color:"#15803D",fontFamily:"'DM Sans',sans-serif"}}>
              ✓ {userBookings.length} réservation{userBookings.length>1?"s":""} enregistrée{userBookings.length>1?"s":""} sur cet appareil.
            </p>
          </div>
        )}

        {filtered.map((booking, i) => {
          const sc = STATUS_CONFIG[booking.status];
          /* Status spécifique bailleur */
          const bailleurSc = booking.bailleurStatus === "pending"
            ? { label:"En attente", color:C.coral, dot:C.coral }
            : booking.bailleurStatus === "in_progress"
              ? { label:"Séjour en cours", color:"#16A34A", dot:"#16A34A" }
              : { label:"Terminé", color:C.mid, dot:C.light };
          const displaySc = isBailleur ? bailleurSc : sc;
          return (
            <div key={booking.id} className="bigcard" style={{...S.bigCard, animationDelay:`${i*60}ms`, overflow:"visible"}}>

              {/* Image hero */}
              <div style={{position:"relative",height:170,borderRadius:"20px 20px 0 0",overflow:"hidden"}}>
                <img src={booking.img} alt={booking.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 50%)"}}/>

                {/* Status badge */}
                <div style={{position:"absolute",top:12,left:12,display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,.92)",borderRadius:20,padding:"4px 10px",backdropFilter:"blur(6px)"}}>
                  <div style={{width:7,height:7,borderRadius:4,background:displaySc.dot, ...((booking.status==="active"||booking.bailleurStatus==="in_progress")?{boxShadow:`0 0 0 3px ${displaySc.dot}44`}:{})}}/>
                  <span style={{fontSize:11,fontWeight:700,color:displaySc.color}}>{displaySc.label}</span>
                </div>

                {/* Type badge */}
                <div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,.35)",borderRadius:20,padding:"4px 10px",backdropFilter:"blur(4px)"}}>
                  <span style={{fontSize:11,fontWeight:600,color:"white"}}>
                    {booking.type==="vehicle" ? "🚗 Véhicule" : "🏠 Logement"}
                  </span>
                </div>

                {/* Demande timestamp pour bailleur en attente */}
                {isBailleur && booking.bailleurStatus === "pending" && (
                  <div style={{position:"absolute",top:46,right:12,background:C.coral,borderRadius:8,padding:"3px 8px"}}>
                    <span style={{fontSize:10,fontWeight:700,color:"white"}}>📨 {booking.requestedAt}</span>
                  </div>
                )}

                {/* Title over image */}
                <div style={{position:"absolute",bottom:12,left:14,right:14}}>
                  <p style={{fontSize:16,fontWeight:700,color:"white",lineHeight:1.2}}>{booking.title}</p>
                  <p style={{fontSize:12,color:"rgba(255,255,255,.8)",marginTop:2,display:"flex",alignItems:"center",gap:4}}>
                    <ByerPin size={12}/>{booking.zone}, {booking.city}
                  </p>
                </div>
              </div>

              {/* Info block */}
              <div style={{padding:"14px 16px 6px"}}>

                {/* Dates row */}
                <div style={S.tripsDatesRow}>
                  <div style={S.tripsDatesCol}>
                    <span style={S.tripsDatesLabel}>
                      {booking.type==="vehicle" ? "PRISE EN CHARGE" : "ARRIVÉE"}
                    </span>
                    <span style={S.tripsDatesVal}>{booking.checkIn}</span>
                  </div>
                  <div style={S.tripsArrow}>
                    <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                    <span style={{fontSize:10,color:C.light}}>{booking.nights}n</span>
                  </div>
                  <div style={{...S.tripsDatesCol,alignItems:"flex-end"}}>
                    <span style={S.tripsDatesLabel}>
                      {booking.type==="vehicle" ? "RETOUR" : "DÉPART"}
                    </span>
                    <span style={S.tripsDatesVal}>{booking.checkOut}</span>
                  </div>
                </div>

                {/* Host (locataire) ou Guest (bailleur) + ref */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderTop:`1px solid ${C.border}`,marginTop:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {isBailleur ? (
                      <>
                        <FaceAvatar photo={booking.guestPhoto} avatar={booking.guest[0]} bg="#7E22CE" size={30} radius={15}/>
                        <div>
                          <p style={{fontSize:12,fontWeight:600,color:C.black}}>{booking.guest}</p>
                          <p style={{fontSize:10,color:C.light}}>{booking.adults} voyageur{booking.adults>1?"s":""} · {booking.ref}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <FaceAvatar photo={booking.hostPhoto} avatar={booking.host[0]} bg="#6366F1" size={30} radius={15}/>
                        <div>
                          <p style={{fontSize:12,fontWeight:600,color:C.black}}>{booking.host}</p>
                          <p style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>{booking.ref}</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{fontSize:14,fontWeight:800,color:isBailleur?"#16A34A":C.black}}>
                      {isBailleur ? "+ " : ""}{(booking.price * booking.nights).toLocaleString("fr-FR")} F
                    </p>
                    {isBailleur && (
                      <p style={{fontSize:9,color:C.light,marginTop:1}}>après commission Byer (15%)</p>
                    )}
                  </div>
                </div>

                {/* Amenities tags */}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",paddingBottom:12}}>
                  {booking.amenities.map(a => (
                    <span key={a} style={S.tag}>{a}</span>
                  ))}
                </div>
              </div>

              {/* Action buttons — adaptés au rôle */}
              <div style={S.tripsActions}>
                {isBailleur ? (
                  <>
                    {/* BAILLEUR : actions selon statut */}
                    {booking.bailleurStatus === "pending" && (
                      <>
                        <button onClick={(e)=>{e.stopPropagation(); setAcceptTarget(booking);}}
                          style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px",borderRadius:10,background:"#16A34A",border:"none",cursor:"pointer",color:"white",fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>
                          <Icon name="check" size={14} color="white" stroke={2.5}/>
                          <span>Accepter</span>
                        </button>
                        <button onClick={(e)=>{e.stopPropagation(); setDeclineTarget(booking);}}
                          style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px",borderRadius:10,background:"#FEF2F2",border:"1.5px solid #FECACA",cursor:"pointer",color:"#B91C1C",fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>
                          <span>Refuser</span>
                        </button>
                      </>
                    )}
                    {booking.bailleurStatus === "in_progress" && (
                      <>
                        <button onClick={(e)=>{e.stopPropagation(); flashToast(`Message envoyé à ${booking.guest||"votre voyageur"}`);}}
                          style={{...S.mapsBtn,background:"#F0FDF4",borderColor:"#BBF7D0",color:"#16A34A"}}>
                          <Icon name="message" size={15} color="#16A34A" stroke={2}/>
                          <span>Contacter le voyageur</span>
                        </button>
                        <button onClick={(e)=>{e.stopPropagation(); openDetail?.(booking);}} style={S.tripsSecBtn}>
                          <span style={{fontSize:13}}>📋</span>
                          <span>Détails séjour</span>
                        </button>
                      </>
                    )}
                    {booking.bailleurStatus === "completed" && (
                      <>
                        <button onClick={(e)=>{e.stopPropagation(); flashToast("Évaluation enregistrée — merci !");}}
                          style={{...S.mapsBtn,background:"#FEF3C7",borderColor:"#FDE68A",color:"#92400E"}}>
                          <Icon name="star" size={15} color="#92400E"/>
                          <span>Évaluer le voyageur</span>
                        </button>
                        <button onClick={(e)=>{e.stopPropagation(); flashToast("Reçu envoyé par email");}} style={S.tripsSecBtn}>
                          <span style={{fontSize:13}}>🧾</span>
                          <span>Reçu</span>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* LOCATAIRE : actions standard */}
                    <button style={S.mapsBtn} onClick={e => openMaps(booking, e)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                        <circle cx="12" cy="9" r="2.5" fill="white"/>
                      </svg>
                      <span>
                        {booking.status === "past" ? "Revoir l'itinéraire" : "Y aller avec Maps"}
                      </span>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24" style={{marginLeft:"auto"}}>
                        <line x1="7" y1="17" x2="17" y2="7"/>
                        <polyline points="7 7 17 7 17 17"/>
                      </svg>
                    </button>

                    {booking.status !== "past" && (
                      <button onClick={(e)=>{e.stopPropagation(); flashToast("Conversation ouverte avec l'hôte");}} style={S.tripsSecBtn}>
                        <Icon name="message" size={15} color={C.dark} stroke={1.8}/>
                        <span>Contacter l'hôte</span>
                      </button>
                    )}
                    {booking.status === "past" && (
                      <button onClick={(e)=>{e.stopPropagation(); flashToast("Avis enregistré — merci !");}} style={S.tripsSecBtn}>
                        <Icon name="star" size={15} color={C.dark}/>
                        <span>Laisser un avis</span>
                      </button>
                    )}

                    {/* Annulation : disponible uniquement pour les réservations utilisateur (upcoming) */}
                    {booking.status === "upcoming" && booking.createdAt && onCancelBooking && (
                      <button
                        style={{...S.tripsSecBtn, color:"#B91C1C", borderColor:"#FECACA"}}
                        onClick={(e) => { e.stopPropagation(); setCancelTarget(booking); }}
                      >
                        <span style={{fontSize:14,fontWeight:700,lineHeight:1}}>×</span>
                        <span>Annuler</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel confirm dialog */}
      {cancelTarget && (
        <div
          onClick={() => setCancelTarget(null)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}
        >
          <div
            onClick={(e)=>e.stopPropagation()}
            style={{background:C.white,borderRadius:14,padding:"22px 18px",minWidth:300,maxWidth:340,fontFamily:"'DM Sans',sans-serif"}}
          >
            <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:8,textAlign:"center"}}>
              Annuler cette réservation ?
            </p>
            <p style={{fontSize:13,color:C.mid,marginBottom:18,textAlign:"center",lineHeight:1.5}}>
              Réf. <strong>{cancelTarget.ref}</strong><br/>
              Cette action est définitive. Selon la politique d'annulation, des frais peuvent s'appliquer.
            </p>
            <div style={{display:"flex",gap:10}}>
              <button
                onClick={() => setCancelTarget(null)}
                style={{flex:1,padding:"11px",border:"none",borderRadius:8,background:C.bg,color:C.dark,fontWeight:600,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}
              >Garder</button>
              <button
                onClick={() => { onCancelBooking?.(cancelTarget.id); setCancelTarget(null); }}
                style={{flex:1,padding:"11px",border:"none",borderRadius:8,background:"#DC2626",color:C.white,fontWeight:600,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}
              >Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Accept (bailleur) confirm dialog */}
      {acceptTarget && (
        <div onClick={()=>setAcceptTarget(null)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
          <div onClick={e=>e.stopPropagation()}
            style={{background:C.white,borderRadius:14,padding:"22px 18px",minWidth:300,maxWidth:340,fontFamily:"'DM Sans',sans-serif"}}>
            <div style={{width:56,height:56,borderRadius:28,background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
              <Icon name="check" size={26} color="#16A34A" stroke={2.5}/>
            </div>
            <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:8,textAlign:"center"}}>
              Accepter la demande ?
            </p>
            <p style={{fontSize:13,color:C.mid,marginBottom:18,textAlign:"center",lineHeight:1.5}}>
              <strong>{acceptTarget.guest}</strong> sera notifié et pourra finaliser le paiement. Vous recevrez <strong style={{color:"#16A34A"}}>{(acceptTarget.price * acceptTarget.nights).toLocaleString("fr-FR")} F</strong> sous 24h après le check-in.
            </p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setAcceptTarget(null)}
                style={{flex:1,padding:"11px",border:"none",borderRadius:8,background:C.bg,color:C.dark,fontWeight:600,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>
                Plus tard
              </button>
              <button onClick={()=>setAcceptTarget(null)}
                style={{flex:1,padding:"11px",border:"none",borderRadius:8,background:"#16A34A",color:C.white,fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline (bailleur) confirm dialog */}
      {declineTarget && (
        <div onClick={()=>setDeclineTarget(null)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
          <div onClick={e=>e.stopPropagation()}
            style={{background:C.white,borderRadius:14,padding:"22px 18px",minWidth:300,maxWidth:340,fontFamily:"'DM Sans',sans-serif"}}>
            <div style={{width:56,height:56,borderRadius:28,background:"#FEF2F2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
              <span style={{fontSize:26,color:"#B91C1C",fontWeight:700}}>×</span>
            </div>
            <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:8,textAlign:"center"}}>
              Refuser la demande ?
            </p>
            <p style={{fontSize:13,color:C.mid,marginBottom:18,textAlign:"center",lineHeight:1.5}}>
              Le voyageur <strong>{declineTarget.guest}</strong> sera notifié. Refuser trop souvent peut affecter votre score de réponse.
            </p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDeclineTarget(null)}
                style={{flex:1,padding:"11px",border:"none",borderRadius:8,background:C.bg,color:C.dark,fontWeight:600,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>
                Annuler
              </button>
              <button onClick={()=>setDeclineTarget(null)}
                style={{flex:1,padding:"11px",border:"none",borderRadius:8,background:"#DC2626",color:C.white,fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>
                Refuser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast actions trips */}
      {tripToast && (
        <div style={{position:"fixed",bottom:96,left:16,right:16,background:C.dark,color:C.white,padding:"12px 16px",borderRadius:8,textAlign:"center",fontSize:14,fontFamily:"'DM Sans',sans-serif",zIndex:999}}>
          {tripToast}
        </div>
      )}
    </div>
  );
}


/* ═══ js/messages.js ═══ */
/* Byer — Messages & Chat */

/* ─── MESSAGES SCREEN ───────────────────────────── */
function MessagesScreen({ role }) {
  const isBailleur = role === "bailleur";

  /* En mode bailleur on simule des conversations entrantes (voyageurs/locataires).
     On enrichit chaque conv avec un rôle adapté côté bailleur.                  */
  const baseConvs = isBailleur
    ? CONVERSATIONS_DATA.map((c,i) => ({
        ...c,
        contact: ["Caroline N.","David M.","Aïcha B.","Junior K.","Sandrine T."][i % 5] || c.contact,
        contactRole: ["Voyageur","Locataire long séjour","Voyageur","Demandeur","Voyageur"][i % 5],
        lastMsg: ["Bonjour, est-ce disponible le 20 ?","Merci pour les clés !","Le wifi fonctionne pas...","Possible de visiter samedi ?","Tout est parfait, merci !"][i % 5],
      }))
    : CONVERSATIONS_DATA;

  const [convos, setConvos]     = useState(baseConvs);
  const [openChat, setOpenChat] = useState(null);
  const [search, setSearch]     = useState("");
  const [newConvOpen, setNewConvOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  /* Re-sync conversations quand on bascule de rôle */
  React.useEffect(() => { setConvos(baseConvs); /* eslint-disable-next-line */ }, [role]);

  /* Charge les vraies conversations depuis Supabase si user connecté.
     Les convs Supabase sont préfixées dans la liste, en complément des mocks
     (ainsi la démo reste vivante même si la BDD est vide). */
  React.useEffect(() => {
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady) return;
    let cancelled = false;
    (async () => {
      const { data: sess } = await db.auth.getSession();
      const user = sess && sess.session && sess.session.user;
      if (!user) return;
      setCurrentUserId(user.id);
      const { data, error } = await db.chat.listConversations(user.id);
      if (error || cancelled || !Array.isArray(data) || data.length === 0) return;
      const realConvs = data.map(c => {
        const isHost = c.host_id === user.id;
        const other  = isHost ? c.guest : c.host;
        return {
          id:           c.id,                        // UUID Supabase
          _convId:      c.id,                        // marqueur Supabase
          _supabase:    true,
          contact:      other?.name || "Voyageur",
          contactRole:  isHost ? "Voyageur" : "Hôte",
          avatar:       other?.avatar_letter || (other?.name?.[0]?.toUpperCase() || "U"),
          avatarBg:     other?.avatar_bg || "#6366F1",
          photo:        other?.photo_url || null,
          logement:     c.listings?.title || "Annonce",
          lastMsg:      "",
          lastTime:     c.last_message_at ? new Date(c.last_message_at).toLocaleDateString('fr-FR') : "—",
          unread:       0,
          blocked:      false,
          messages:     [],
        };
      });
      if (!cancelled) setConvos(prev => [...realConvs, ...prev]);
    })();
    return () => { cancelled = true; };
  }, [role]);

  const toggleBlock = (id) => {
    setConvos(prev => prev.map(c => c.id===id ? {...c, blocked:!c.blocked} : c));
  };

  // Filtrage par recherche : nom de contact, dernier message, logement
  const q = search.trim().toLowerCase();
  const filteredConvos = !q ? convos : convos.filter(c =>
    c.contact.toLowerCase().includes(q) ||
    (c.lastMsg || "").toLowerCase().includes(q) ||
    (c.logement || "").toLowerCase().includes(q)
  );

  // Création d'une nouvelle conversation
  const startNewConversation = (contact) => {
    // Si la conv existe déjà, on l'ouvre
    const existing = convos.find(c => c.contact === contact.name);
    if (existing) {
      setNewConvOpen(false);
      setOpenChat(existing.id);
      return;
    }
    const newConv = {
      id: Date.now(),
      contact: contact.name,
      contactRole: contact.role,
      avatar: contact.name[0],
      avatarBg: contact.bg || "#6366F1",
      photo: contact.photo || null,
      logement: contact.logement || "Nouveau contact",
      lastMsg: "",
      lastTime: "Maintenant",
      unread: 0,
      blocked: false,
      messages: [],
    };
    setConvos(prev => [newConv, ...prev]);
    setNewConvOpen(false);
    setOpenChat(newConv.id);
  };

  /* ─── Chat ouvert : load history + realtime si conv Supabase ─── */
  React.useEffect(() => {
    if (!openChat) return;
    const conv = convos.find(c => c.id === openChat);
    if (!conv || !conv._supabase) return;
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady || !currentUserId) return;
    let cancelled = false;
    let unsub = () => {};

    // 1) Load message history
    (async () => {
      const { data, error } = await db.chat.listMessages(conv._convId);
      if (cancelled || error || !Array.isArray(data)) return;
      const adapted = data.map(m => ({
        id:   m.id,
        from: m.sender_id === currentUserId ? "me" : "them",
        text: m.body || "",
        time: new Date(m.created_at).toLocaleTimeString("fr-FR", {hour:"2-digit",minute:"2-digit"}),
      }));
      setConvos(prev => prev.map(c => c.id === openChat ? { ...c, messages: adapted } : c));
    })();

    // 2) Realtime subscription : pousse les nouveaux messages
    unsub = db.chat.subscribeMessages(conv._convId, (newMsg) => {
      if (cancelled) return;
      setConvos(prev => prev.map(c => {
        if (c.id !== openChat) return c;
        // Évite le doublon si message émis par soi-même (déjà ajouté en optimiste)
        if ((c.messages || []).some(m => m.id === newMsg.id)) return c;
        return {
          ...c,
          lastMsg: newMsg.body,
          lastTime: "Maintenant",
          messages: [...(c.messages || []), {
            id:   newMsg.id,
            from: newMsg.sender_id === currentUserId ? "me" : "them",
            text: newMsg.body || "",
            time: new Date(newMsg.created_at).toLocaleTimeString("fr-FR", {hour:"2-digit",minute:"2-digit"}),
          }],
        };
      }));
    });

    return () => { cancelled = true; try { unsub(); } catch (e) {} };
  }, [openChat, currentUserId]);

  if (openChat) {
    const conv = convos.find(c => c.id === openChat);
    if (!conv) { setOpenChat(null); return null; }
    return (
      <ChatScreen
        conv={conv}
        onBack={() => setOpenChat(null)}
        onToggleBlock={() => toggleBlock(openChat)}
        onSendMessage={async (text) => {
          // Optimistic UI : on ajoute tout de suite, on "ré-aligne" via Realtime
          const optimistic = {
            id: "tmp-" + Date.now(), from:"me", text,
            time: new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})
          };
          setConvos(prev => prev.map(c => c.id === openChat ? {
            ...c, lastMsg: text, lastTime: "Maintenant",
            messages: [...(c.messages||[]), optimistic],
          } : c));

          // Send via Supabase si conv réelle
          if (conv._supabase && currentUserId) {
            const db = window.byer && window.byer.db;
            if (db && db.isReady) {
              try { await db.chat.sendMessage(conv._convId, currentUserId, text); }
              catch (e) { console.warn("[byer] chat send error:", e); }
            }
          }
        }}
      />
    );
  }

  return (
    <div>
      <div style={S.pageHead}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <p style={S.pageTitle}>Messages</p>
              {isBailleur && (
                <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8,background:"#FAF5FF",color:"#7E22CE",border:"1px solid #E9D5FF"}}>
                  🔑 BAILLEUR
                </span>
              )}
            </div>
            <p style={{fontSize:13,color:C.mid,marginTop:3}}>
              {isBailleur
                ? (convos.filter(c=>c.unread>0).length > 0
                    ? `${convos.reduce((s,c)=>s+c.unread,0)} message${convos.reduce((s,c)=>s+c.unread,0)>1?"s":""} de voyageur${convos.reduce((s,c)=>s+c.unread,0)>1?"s":""} à traiter`
                    : "Aucune nouvelle demande de voyageur")
                : (convos.filter(c=>c.unread>0).length > 0
                    ? `${convos.reduce((s,c)=>s+c.unread,0)} message${convos.reduce((s,c)=>s+c.unread,0)>1?"s":""} non lu${convos.reduce((s,c)=>s+c.unread,0)>1?"s":""}`
                    : "Tout est à jour")}
            </p>
          </div>
          <button
            onClick={() => setNewConvOpen(true)}
            title="Nouvelle conversation"
            style={{
              width:42,height:42,borderRadius:21,
              background:C.coral,border:"none",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 2px 8px rgba(255,90,95,.3)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              <line x1="12" y1="9" x2="12" y2="14"/>
              <line x1="9.5" y1="11.5" x2="14.5" y2="11.5"/>
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <div style={{
          marginTop:12,display:"flex",alignItems:"center",gap:8,
          background:C.bg,border:`1px solid ${C.border}`,
          borderRadius:12,padding:"9px 12px",
        }}>
          <svg width="15" height="15" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Rechercher un contact, un message…"
            style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:C.dark,fontFamily:"'DM Sans',sans-serif"}}
          />
          {search && (
            <button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",padding:0,color:C.light,fontSize:16,lineHeight:1}}>×</button>
          )}
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",padding:"8px 0 100px"}}>
        {filteredConvos.length === 0 && (
          <div style={{padding:"40px 24px",textAlign:"center"}}>
            <p style={{fontSize:14,color:C.mid,fontFamily:"'DM Sans',sans-serif"}}>
              {q ? `Aucune conversation pour « ${search} »` : "Aucune conversation pour le moment"}
            </p>
            {!q && (
              <button
                onClick={()=>setNewConvOpen(true)}
                style={{marginTop:14,padding:"10px 20px",background:C.coral,color:C.white,border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
              >Démarrer une conversation</button>
            )}
          </div>
        )}

        {filteredConvos.map(conv => (
          <button
            key={conv.id}
            style={S.convRow}
            onClick={() => setOpenChat(conv.id)}
          >
            {/* Avatar */}
            <div style={{position:"relative",flexShrink:0}}>
              <FaceAvatar photo={conv.photo} avatar={conv.avatar} bg={conv.avatarBg} size={46} blocked={conv.blocked}/>
              {conv.unread > 0 && !conv.blocked && (
                <div style={S.unreadDot}>{conv.unread}</div>
              )}
            </div>

            {/* Content */}
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:14,fontWeight:conv.unread>0?700:600,color:C.black}}>{conv.contact}</span>
                  <span style={{fontSize:10,fontWeight:500,color:C.mid,background:C.bg,padding:"1px 7px",borderRadius:10,border:`1px solid ${C.border}`}}>{conv.contactRole}</span>
                  {conv.blocked && <span style={{fontSize:10,fontWeight:600,color:C.light,background:"#F5F5F5",padding:"1px 7px",borderRadius:10}}>Bloqué</span>}
                </div>
                <span style={{fontSize:11,color:C.light,flexShrink:0}}>{conv.lastTime}</span>
              </div>
              <p style={{fontSize:12,color:C.light,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%",marginBottom:2}}>
                {conv.blocked ? "Cet utilisateur est bloqué" : (conv.lastMsg || "Nouvelle conversation")}
              </p>
              <p style={{fontSize:11,color:C.light}}>{conv.logement}</p>
            </div>

            <Icon name="chevron" size={15} color={C.border} stroke={2}/>
          </button>
        ))}
      </div>

      {/* New conversation sheet */}
      {newConvOpen && (
        <NewConversationSheet
          onClose={()=>setNewConvOpen(false)}
          onSelect={startNewConversation}
          existingNames={convos.map(c => c.contact)}
        />
      )}
    </div>
  );
}

/* ─── NEW CONVERSATION SHEET ───────────────────── */
function NewConversationSheet({ onClose, onSelect, existingNames = [] }) {
  const [search, setSearch] = useState("");

  // Liste de contacts suggérés (dérivés des hôtes/propriétaires des annonces)
  const suggested = (() => {
    const seen = new Set();
    const list = [];
    [...PROPERTIES, ...VEHICLES].forEach(item => {
      const name = item.host || item.owner;
      if (!name || seen.has(name)) return;
      seen.add(name);
      list.push({
        name,
        role: item.type === "vehicle" ? "Loueur véhicule" : "Bailleur",
        bg: ["#6366F1","#0EA5E9","#10B981","#F59E0B","#EC4899"][list.length % 5],
        photo: item.hostPhoto || null,
        logement: item.title,
      });
    });
    return list;
  })();

  const q = search.trim().toLowerCase();
  const filtered = !q ? suggested : suggested.filter(c => c.name.toLowerCase().includes(q));

  return (
    <>
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:200}} onClick={onClose}/>
      <div style={{
        position:"fixed",bottom:0,left:0,right:0,
        background:C.white,borderRadius:"20px 20px 0 0",
        padding:"16px 0 24px",zIndex:201,maxHeight:"80vh",
        display:"flex",flexDirection:"column",
        fontFamily:"'DM Sans',sans-serif",
      }}>
        {/* Handle */}
        <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 12px"}}/>

        {/* Header */}
        <div style={{padding:"0 16px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Nouvelle conversation</p>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.mid,lineHeight:1,padding:0}}>×</button>
        </div>

        {/* Search */}
        <div style={{padding:"0 16px 12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"9px 12px"}}>
            <svg width="15" height="15" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Rechercher un hôte ou bailleur…"
              style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:C.dark,fontFamily:"'DM Sans',sans-serif"}}
            />
          </div>
        </div>

        {/* List */}
        <div style={{flex:1,overflowY:"auto",padding:"0 0 8px"}}>
          {filtered.length === 0 ? (
            <p style={{textAlign:"center",fontSize:13,color:C.light,padding:"24px"}}>Aucun contact trouvé.</p>
          ) : filtered.map((c, i) => {
            const already = existingNames.includes(c.name);
            return (
              <button
                key={i}
                onClick={() => onSelect(c)}
                style={{
                  width:"100%",display:"flex",alignItems:"center",gap:12,
                  padding:"12px 16px",background:"none",border:"none",
                  borderBottom:`1px solid ${C.border}`,cursor:"pointer",textAlign:"left",
                  fontFamily:"'DM Sans',sans-serif",
                }}
              >
                <FaceAvatar photo={c.photo} avatar={c.name[0]} bg={c.bg} size={42}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:14,fontWeight:600,color:C.black}}>{c.name}</p>
                  <p style={{fontSize:11,color:C.mid,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                    {c.role} · {c.logement}
                  </p>
                </div>
                {already && (
                  <span style={{fontSize:10,fontWeight:600,color:C.coral,background:"#FFF5F5",padding:"3px 8px",borderRadius:10}}>
                    Existante
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─── CHAT SCREEN ───────────────────────────────── */
function ChatScreen({ conv, onBack, onToggleBlock, onSendMessage }) {
  const [input, setInput]       = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [blockConfirm, setBlockConfirm] = useState(false);
  const [chatToast, setChatToast] = useState("");
  const isBlocked = conv.blocked;
  const messages = conv.messages || [];

  const flashChat = (msg) => { setChatToast(msg); setTimeout(()=>setChatToast(""), 2200); };

  const sendMsg = () => {
    if (!input.trim() || isBlocked) return;
    onSendMessage?.(input.trim());
    setInput("");
  };

  return (
    <div style={{...S.shell, position:"relative"}}>
      <style>{BYER_CSS}</style>

      {/* Header du chat */}
      <div style={S.chatHeader}>
        <button style={S.dBack2} onClick={onBack}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
        </button>

        <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
          <FaceAvatar photo={conv.photo} avatar={conv.avatar} bg={conv.avatarBg} size={36} blocked={isBlocked}/>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:C.black,lineHeight:1.2}}>{conv.contact}</p>
            <p style={{fontSize:11,color:isBlocked?C.coral:C.mid}}>
              {isBlocked ? "Bloqué · ne peut plus écrire" : conv.contactRole+" · "+conv.logement}
            </p>
          </div>
        </div>

        {/* Menu */}
        <button style={S.chatMenuBtn} onClick={()=>setShowMenu(v=>!v)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={C.dark}>
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <>
            <div style={{position:"fixed",inset:0,zIndex:50}} onClick={()=>setShowMenu(false)}/>
            <div style={S.chatMenu}>
              <button style={S.chatMenuItem} onClick={()=>{ setShowMenu(false); flashChat(`Logement : ${conv.logement}`); }}>
                <Icon name="home" size={16} color={C.dark} stroke={1.8}/>
                <span>Voir le logement</span>
              </button>
              <div style={{height:1,background:C.border,margin:"2px 0"}}/>
              <button
                style={{...S.chatMenuItem,...(isBlocked?S.chatMenuUnblock:S.chatMenuBlock)}}
                onClick={()=>{ setShowMenu(false); setBlockConfirm(true); }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  {isBlocked
                    ? <><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></>
                    : <><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>
                  }
                </svg>
                <span>{isBlocked ? "Débloquer "+conv.contact : "Bloquer "+conv.contact}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Contexte logement */}
      <div style={S.chatContext}>
        <ByerPin size={12}/>
        <span style={{fontSize:11,color:C.mid}}>{conv.logement}</span>
      </div>

      {/* Messages */}
      <div style={S.chatMessages}>

        {isBlocked && (
          <div style={S.blockedBanner}>
            <svg width="15" height="15" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
            <span>
              Vous avez bloqué <strong>{conv.contact}</strong>. Il/elle ne peut plus vous envoyer de messages.
              <button
                style={{color:C.coral,fontWeight:700,background:"none",border:"none",cursor:"pointer",padding:"0 4px",fontFamily:"'DM Sans',sans-serif",fontSize:12}}
                onClick={()=>{ onToggleBlock(); }}
              >Débloquer</button>
            </span>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.from === "me";
          const showAvatar = !isMe && (i===0 || messages[i-1].from==="me");
          return (
            <div key={msg.id} style={{display:"flex",flexDirection:isMe?"row-reverse":"row",alignItems:"flex-end",gap:8,marginBottom:6}}>
              {!isMe && (
                <div style={{opacity:showAvatar?1:0,flexShrink:0}}>
                  <FaceAvatar photo={conv.photo} avatar={conv.avatar} bg={conv.avatarBg} size={28}/>
                </div>
              )}
              <div style={{maxWidth:"72%"}}>
                <div style={{
                  background: isMe ? C.coral : C.white,
                  color: isMe ? "white" : C.black,
                  borderRadius: isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",
                  padding:"10px 13px",
                  fontSize:14, lineHeight:1.5,
                  boxShadow: isMe?"none":"0 1px 4px rgba(0,0,0,.07)",
                }}>
                  {msg.text}
                </div>
                <p style={{fontSize:10,color:C.light,marginTop:3,textAlign:isMe?"right":"left"}}>{msg.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone de saisie */}
      <div style={S.chatInputRow}>
        {isBlocked ? (
          <div style={S.chatBlockedInput}>
            <svg width="14" height="14" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
            <span style={{fontSize:13,color:C.light}}>Messagerie désactivée — utilisateur bloqué</span>
          </div>
        ) : (
          <>
            <div style={S.chatInput}>
              <input
                style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:14,color:C.dark,fontFamily:"'DM Sans',sans-serif"}}
                placeholder="Écrire un message…"
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&sendMsg()}
              />
            </div>
            <button
              style={{...S.chatSendBtn,...(input.trim()?{}:{opacity:.4})}}
              onClick={sendMsg}
              disabled={!input.trim()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Modale confirmation bloquer/débloquer */}
      {blockConfirm && (
        <>
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300}} onClick={()=>setBlockConfirm(false)}/>
          <div style={S.blockModal}>
            <div style={S.blockModalIcon}>
              <svg width="28" height="28" fill="none" stroke={isBlocked?"#16A34A":C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                {isBlocked
                  ? <><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></>
                  : <><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>
                }
              </svg>
            </div>
            <p style={{fontSize:16,fontWeight:700,color:C.black,textAlign:"center"}}>
              {isBlocked ? `Débloquer ${conv.contact} ?` : `Bloquer ${conv.contact} ?`}
            </p>
            <p style={{fontSize:13,color:C.mid,textAlign:"center",lineHeight:1.6}}>
              {isBlocked
                ? `${conv.contact} pourra à nouveau vous envoyer des messages et voir vos annonces.`
                : `${conv.contact} ne pourra plus vous contacter ni voir vos annonces. Vous pouvez débloquer à tout moment.`
              }
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",marginTop:4}}>
              <button
                style={{...S.payBtn, background:isBlocked?"#16A34A":C.coral}}
                onClick={()=>{ onToggleBlock(); setBlockConfirm(false); }}
              >
                {isBlocked ? "Oui, débloquer" : "Oui, bloquer"}
              </button>
              <button
                style={{...S.tripsSecBtn,justifyContent:"center",padding:"12px"}}
                onClick={()=>setBlockConfirm(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </>
      )}

      {chatToast && (
        <div style={{position:"fixed",bottom:90,left:16,right:16,background:C.dark,color:C.white,padding:"12px 16px",borderRadius:8,textAlign:"center",fontSize:14,fontFamily:"'DM Sans',sans-serif",zIndex:1100}}>
          {chatToast}
        </div>
      )}
    </div>
  );
}


/* ═══ js/profile.js ═══ */
/* Byer — Profile Screens */

/* ─── PROFILE ───────────────────────────────────── */
function ProfileScreen({ role, setRole, onOpenRent, onOpenDashboard, onOpenTechs, onOpenPros, onOpenPublish, onOpenSettings, onOpenEditProfile, onOpenReviews, onOpenHistory }) {
  const urgentCount = LOYERS_LOCATAIRE.filter(l => l.statut==="en_attente" && l.rappelActif).length
                    + LOYERS_BAILLEUR.filter(l  => l.statut==="en_attente" && l.joursRestants<=7).length;

  /* Le rôle est désormais lifté dans ByerApp et propagé via props (sync entre toutes les pages). */

  const [inviteOpen, setInviteOpen]       = useState(false);
  const [rewardsOpen, setRewardsOpen]     = useState(false);
  const [toast, setToast]                 = useState("");

  // Points dynamiques (persistés via byerStorage)
  const [rewardsPoints, setRewardsPoints] = useState(() => pointsManager.get());
  const [referralCount, setReferralCount] = useState(() => pointsManager.getReferrals());
  const [coupons, setCoupons]             = useState(() => pointsManager.getCoupons());

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  // Programme parrainage : code de référence stable
  const referralCode = (USER.name || "BYER").replace(/\s+/g, "").toUpperCase().slice(0, 6) + "24";
  const referralLink = `https://byer.cm/r/${referralCode}`;

  const handleShareInvite = async () => {
    const shareData = {
      title: "Rejoins-moi sur Byer",
      text: `Utilise mon code ${referralCode} : on gagne tous les deux ${POINTS_CONFIG.perReferral} pts à échanger contre des forfaits Byer gratuits.`,
      url: referralLink,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        showToast("Lien copié dans le presse-papiers");
      } else {
        alert(`${shareData.text}\n\n${shareData.url}`);
      }
    } catch (e) { /* user cancelled */ }
  };

  // Échange de points contre une récompense
  const handleRedeem = (reward) => {
    if (rewardsPoints < reward.cost) {
      showToast(`Il vous manque ${reward.cost - rewardsPoints} pts`);
      return;
    }
    pointsManager.redeem(reward.cost);
    pointsManager.addCoupon({ rewardId: reward.id, label: reward.label, type: reward.type, value: reward.value });
    setRewardsPoints(pointsManager.get());
    setCoupons(pointsManager.getCoupons());
    showToast(`Bon "${reward.label}" généré !`);
  };

  // Niveau (tier) basé sur les points
  const rewardsTier   = rewardsPoints >= POINTS_TIERS.gold ? "Or"
                      : rewardsPoints >= POINTS_TIERS.silver ? "Argent"
                      : "Bronze";
  const tierColor     = rewardsTier === "Or" ? "#F59E0B" : rewardsTier === "Argent" ? "#94A3B8" : "#B45309";
  const tierBg        = rewardsTier === "Or" ? "#FEF3C7" : rewardsTier === "Argent" ? "#F1F5F9" : "#FEF3C7";

  const rows=[
    {icon:"user",    l:"Informations personnelles",  action:onOpenEditProfile},
    {icon:"trips",   l:"Historique des réservations",action:onOpenHistory},
    {icon:"message", l:"Avis reçus",                  action:onOpenReviews},
    {icon:"home",    l:"Publier une annonce",           action:onOpenPublish},
    {icon:"car",     l:"Mes véhicules",               action:() => onOpenPublish?.("vehicle")},
    {icon:"gear",    l:"Paramètres du compte",        action:onOpenSettings},
  ];
  return (
    <div>
      <div style={S.pageHead}><p style={S.pageTitle}>Mon profil</p></div>

      {/* Avatar card */}
      <div style={{margin:"0 16px 12px",background:C.white,borderRadius:16,padding:"18px 16px",display:"flex",alignItems:"center",gap:14,boxShadow:`0 1px 8px rgba(0,0,0,.05)`}}>
        <div style={{position:"relative"}}>
          <FaceAvatar photo={USER.photo} avatar={USER.avatar} bg={USER.bg} size={56} radius={28}/>
          <div onClick={onOpenEditProfile} style={{position:"absolute",bottom:0,right:0,width:20,height:20,borderRadius:10,background:C.coral,border:"2px solid white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <p style={{fontSize:16,fontWeight:700,color:C.black}}>{USER.name}</p>
          <p style={{fontSize:12,color:C.light,marginTop:2}}>{USER.city} · Membre {USER.since}</p>
        </div>
        <span style={{
          fontSize:10,fontWeight:700,padding:"4px 9px",borderRadius:10,
          background:tierBg,color:tierColor,
          fontFamily:"'DM Sans',sans-serif",
        }}>{rewardsTier}</span>
      </div>

      {/* Invite friends + Rewards : 2 cards row */}
      <div style={{margin:"0 16px 14px",display:"flex",gap:10}}>
        <button
          onClick={() => setInviteOpen(true)}
          style={{
            flex:1,background:C.white,borderRadius:14,padding:"14px 12px",
            border:`1px solid ${C.border}`,cursor:"pointer",textAlign:"left",
            fontFamily:"'DM Sans',sans-serif",
            display:"flex",flexDirection:"column",gap:6,
          }}
        >
          <div style={{width:36,height:36,borderRadius:18,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:18}}>🎁</span>
          </div>
          <p style={{fontSize:13,fontWeight:700,color:C.black}}>Inviter des amis</p>
          <p style={{fontSize:11,color:C.mid,lineHeight:1.4}}>+{POINTS_CONFIG.perReferral} pts par filleul</p>
        </button>
        <button
          onClick={() => setRewardsOpen(true)}
          style={{
            flex:1,background:C.white,borderRadius:14,padding:"14px 12px",
            border:`1px solid ${C.border}`,cursor:"pointer",textAlign:"left",
            fontFamily:"'DM Sans',sans-serif",
            display:"flex",flexDirection:"column",gap:6,
          }}
        >
          <div style={{width:36,height:36,borderRadius:18,background:tierBg,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:18}}>⭐</span>
          </div>
          <p style={{fontSize:13,fontWeight:700,color:C.black}}>Récompenses</p>
          <p style={{fontSize:11,color:C.mid,lineHeight:1.4}}>{rewardsPoints} pts · Niveau {rewardsTier}</p>
        </button>
      </div>

      {/* Gestion des loyers — CTA card */}
      <button style={S.rentCta} onClick={onOpenRent}>
        <div style={S.rentCtaLeft}>
          <div style={S.rentCtaIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.coral} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              <path d="M9 21V12h6v9"/>
              <path d="M9 16h6"/>
            </svg>
          </div>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:C.black}}>Gestion des loyers</p>
            <p style={{fontSize:12,color:C.mid,marginTop:1}}>Paiements · Historique · Rappels</p>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {urgentCount > 0 && (
            <div style={S.urgentBadge}>{urgentCount}</div>
          )}
          <Icon name="chevron" size={16} color={C.light} stroke={2}/>
        </div>
      </button>

      {/* Dashboard bailleur — CTA card */}
      <button style={{...S.rentCta,marginBottom:8}} onClick={onOpenDashboard}>
        <div style={S.rentCtaLeft}>
          <div style={{...S.rentCtaIcon,background:"#EFF6FF"}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:C.black}}>Dashboard bailleur</p>
            <p style={{fontSize:12,color:C.mid,marginTop:1}}>Propriétés · Stats · Boost</p>
          </div>
        </div>
        <Icon name="chevron" size={16} color={C.light} stroke={2}/>
      </button>

      {/* Techniciens — CTA card */}
      <button style={{...S.rentCta,marginBottom:8}} onClick={onOpenTechs}>
        <div style={S.rentCtaLeft}>
          <div style={{...S.rentCtaIcon,background:"#F0FDF4"}}>
            <span style={{fontSize:20}}>🔧</span>
          </div>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:C.black}}>Techniciens</p>
            <p style={{fontSize:12,color:C.mid,marginTop:1}}>Plomberie · Électricité · etc.</p>
          </div>
        </div>
        <Icon name="chevron" size={16} color={C.light} stroke={2}/>
      </button>

      {/* Concierges & Agents immobiliers — CTA card */}
      <button style={{...S.rentCta,marginBottom:8}} onClick={onOpenPros}>
        <div style={S.rentCtaLeft}>
          <div style={{...S.rentCtaIcon,background:"#FAF5FF"}}>
            <span style={{fontSize:20}}>🛎️</span>
          </div>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:C.black}}>Concierges & Agents</p>
            <p style={{fontSize:12,color:C.mid,marginTop:1}}>Conciergerie · Agence immo. · Gestion locative</p>
          </div>
        </div>
        <Icon name="chevron" size={16} color={C.light} stroke={2}/>
      </button>

      {/* Other rows */}
      <div style={{padding:"0 16px 32px"}}>
        {rows.map(row=>(
          <button key={row.l} style={{display:"flex",alignItems:"center",gap:14,padding:"15px 0",background:"none",border:"none",width:"100%",cursor:"pointer",borderBottom:`1px solid ${C.border}`}} onClick={row.action||undefined}>
            <Icon name={row.icon} size={20} color={C.dark} stroke={1.8}/>
            <span style={{flex:1,fontSize:14,fontWeight:500,color:C.dark,textAlign:"left"}}>{row.l}</span>
            <Icon name="chevron" size={16} color={C.light} stroke={2}/>
          </button>
        ))}
      </div>

      {/* Invite modal */}
      {inviteOpen && (
        <>
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:200}} onClick={()=>setInviteOpen(false)}/>
          <div style={{
            position:"fixed",bottom:0,left:0,right:0,
            background:C.white,borderRadius:"20px 20px 0 0",
            padding:"18px 16px 24px",zIndex:201,
            fontFamily:"'DM Sans',sans-serif",
          }}>
            <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 14px"}}/>
            <p style={{fontSize:18,fontWeight:800,color:C.black,textAlign:"center",marginBottom:6}}>
              🎁 Inviter des amis
            </p>
            <p style={{fontSize:13,color:C.mid,textAlign:"center",marginBottom:14,lineHeight:1.5}}>
              Partagez votre lien : vous recevez <strong style={{color:C.coral}}>{POINTS_CONFIG.perReferral} pts</strong> par filleul inscrit (et lui aussi !).
              Échangez vos points contre des forfaits Byer gratuits.
            </p>

            {/* Lien de téléchargement de l'app */}
            <div style={{
              background:"linear-gradient(135deg,#FF5A5F 0%,#FF8A8E 100%)",borderRadius:12,padding:"14px 16px",marginBottom:12,
              display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,
            }}>
              <div style={{minWidth:0}}>
                <p style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,.85)",textTransform:"uppercase",letterSpacing:.5}}>Télécharger Byer</p>
                <p style={{fontSize:13,fontWeight:700,color:"white",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>byer.cm/app</p>
              </div>
              <button
                onClick={() => {
                  const url = "https://byer.cm/app";
                  if (navigator.clipboard) navigator.clipboard.writeText(url).then(()=>showToast("Lien de l'app copié !"));
                  else showToast("Lien : " + url);
                }}
                style={{padding:"8px 12px",background:"rgba(255,255,255,.95)",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,color:C.coral,fontFamily:"'DM Sans',sans-serif",flexShrink:0}}
              >Copier</button>
            </div>

            {/* Code de parrainage */}
            <div style={{
              background:C.bg,borderRadius:12,padding:"14px 16px",marginBottom:14,
              display:"flex",alignItems:"center",justifyContent:"space-between",
              border:`1px dashed ${C.coral}`,
            }}>
              <div>
                <p style={{fontSize:10,fontWeight:600,color:C.light,textTransform:"uppercase",letterSpacing:.5}}>Votre code promo</p>
                <p style={{fontSize:18,fontWeight:800,color:C.coral,letterSpacing:1.2,fontFamily:"monospace"}}>{referralCode}</p>
              </div>
              <button
                onClick={() => {
                  if (navigator.clipboard) navigator.clipboard.writeText(referralCode).then(()=>showToast("Code copié !"));
                  else showToast("Code : " + referralCode);
                }}
                style={{padding:"8px 12px",background:C.white,border:`1px solid ${C.border}`,borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,color:C.dark,fontFamily:"'DM Sans',sans-serif"}}
              >Copier</button>
            </div>

            {/* Stats parrainage */}
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <div style={{flex:1,background:C.bg,borderRadius:12,padding:"10px 12px",textAlign:"center"}}>
                <p style={{fontSize:18,fontWeight:800,color:C.black}}>{referralCount}</p>
                <p style={{fontSize:10,color:C.mid,marginTop:2}}>Filleuls inscrits</p>
              </div>
              <div style={{flex:1,background:C.bg,borderRadius:12,padding:"10px 12px",textAlign:"center"}}>
                <p style={{fontSize:18,fontWeight:800,color:C.coral}}>+{referralCount * POINTS_CONFIG.perReferral}</p>
                <p style={{fontSize:10,color:C.mid,marginTop:2}}>Points gagnés</p>
              </div>
            </div>

            {/* Boutons partage */}
            <button
              onClick={handleShareInvite}
              style={{width:"100%",padding:"13px",background:C.coral,border:"none",borderRadius:10,color:C.white,fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}
            >Partager mon lien</button>
            <button
              onClick={() => setInviteOpen(false)}
              style={{width:"100%",padding:"13px",background:C.bg,border:"none",borderRadius:10,color:C.dark,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
            >Plus tard</button>
          </div>
        </>
      )}

      {/* Rewards modal */}
      {rewardsOpen && (
        <>
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:200}} onClick={()=>setRewardsOpen(false)}/>
          <div style={{
            position:"fixed",bottom:0,left:0,right:0,
            background:C.white,borderRadius:"20px 20px 0 0",
            padding:"18px 16px 24px",zIndex:201,maxHeight:"85vh",overflowY:"auto",
            fontFamily:"'DM Sans',sans-serif",
          }}>
            <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 14px"}}/>
            <p style={{fontSize:18,fontWeight:800,color:C.black,textAlign:"center",marginBottom:6}}>
              ⭐ Mes récompenses
            </p>

            {/* Tier card */}
            <div style={{
              background:`linear-gradient(135deg, ${tierBg} 0%, ${C.white} 100%)`,
              borderRadius:16,padding:"18px",marginBottom:14,marginTop:8,
              border:`1px solid ${tierColor}33`,textAlign:"center",
            }}>
              <p style={{fontSize:11,fontWeight:700,color:tierColor,textTransform:"uppercase",letterSpacing:.6,marginBottom:4}}>
                Niveau {rewardsTier}
              </p>
              <p style={{fontSize:32,fontWeight:800,color:C.black,marginBottom:2}}>{rewardsPoints}</p>
              <p style={{fontSize:12,color:C.mid}}>points fidélité</p>
            </div>

            {/* Progress to next tier */}
            <p style={{fontSize:11,color:C.mid,marginBottom:6}}>
              {rewardsTier === "Or" ? "Niveau maximum atteint 🎉" :
                `${(rewardsTier === "Argent" ? POINTS_TIERS.gold : POINTS_TIERS.silver) - rewardsPoints} pts jusqu'au niveau ${rewardsTier === "Argent" ? "Or" : "Argent"}`}
            </p>
            <div style={{height:6,background:C.bg,borderRadius:3,marginBottom:18,overflow:"hidden"}}>
              <div style={{
                height:"100%",
                width:`${Math.min(100, (rewardsPoints / (rewardsTier === "Argent" ? POINTS_TIERS.gold : POINTS_TIERS.silver)) * 100)}%`,
                background:tierColor,borderRadius:3,
              }}/>
            </div>

            {/* Bons disponibles (déjà échangés, prêts à appliquer) */}
            {coupons.length > 0 && (
              <>
                <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:8}}>🎟️ Mes bons disponibles</p>
                <div style={{marginBottom:18}}>
                  {coupons.map(c => (
                    <div key={c.id} style={{
                      display:"flex",alignItems:"center",justifyContent:"space-between",
                      background:"#F0FDF4",border:"1px dashed #16A34A",borderRadius:10,
                      padding:"10px 12px",marginBottom:6,
                    }}>
                      <div style={{minWidth:0}}>
                        <p style={{fontSize:13,fontWeight:700,color:"#16A34A"}}>{c.label}</p>
                        <p style={{fontSize:10,color:C.mid,marginTop:1}}>Appliqué à votre prochaine {c.type==="boost"?"enchère Boost":"souscription forfait"}</p>
                      </div>
                      <span style={{fontSize:18}}>✓</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Catalogue d'échange : transformer ses points en bons */}
            <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:8}}>🛒 Échanger mes points</p>
            <div style={{marginBottom:18}}>
              {POINTS_REWARDS.map(reward => {
                const canAfford = rewardsPoints >= reward.cost;
                return (
                  <div key={reward.id} style={{
                    display:"flex",alignItems:"center",gap:10,
                    background:canAfford?C.white:C.bg,
                    border:`1px solid ${canAfford?C.border:C.border}`,
                    borderRadius:12,padding:"10px 12px",marginBottom:6,
                    opacity:canAfford?1:.55,
                  }}>
                    <span style={{fontSize:22,flexShrink:0}}>{reward.icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:13,fontWeight:600,color:C.black}}>{reward.label}</p>
                      <p style={{fontSize:11,color:C.coral,fontWeight:700,marginTop:1}}>{reward.cost} pts</p>
                    </div>
                    <button
                      disabled={!canAfford}
                      onClick={() => handleRedeem(reward)}
                      style={{
                        padding:"7px 12px",
                        background:canAfford?C.coral:C.border,
                        color:canAfford?C.white:C.light,
                        border:"none",borderRadius:8,
                        fontSize:12,fontWeight:700,
                        cursor:canAfford?"pointer":"not-allowed",
                        fontFamily:"'DM Sans',sans-serif",flexShrink:0,
                      }}
                    >Échanger</button>
                  </div>
                );
              })}
            </div>

            {/* Comment gagner plus */}
            <div style={{background:"#FFF8E1",borderRadius:10,padding:"10px 12px",marginBottom:14,fontSize:11,color:"#92400E",lineHeight:1.5}}>
              💡 Gagnez +{POINTS_CONFIG.perReferral} pts par filleul inscrit, et +{POINTS_CONFIG.perBooking} pts par réservation effectuée.
            </div>

            <button
              onClick={() => setRewardsOpen(false)}
              style={{width:"100%",padding:"13px",background:C.coral,border:"none",borderRadius:10,color:C.white,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
            >Fermer</button>
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed",bottom:90,left:16,right:16,
          background:C.dark,color:C.white,
          padding:"11px 16px",borderRadius:10,
          textAlign:"center",fontSize:13,fontWeight:500,
          zIndex:300,fontFamily:"'DM Sans',sans-serif",
        }}>{toast}</div>
      )}
    </div>
  );
}

/* ─── OWNER PROFILE SCREEN ──────────────────────── */
function OwnerProfileScreen({ ownerName, onBack }) {
  const owner = OWNERS[ownerName];
  const [expanded, setExpanded] = useState({});

  const toggleBuilding = (id) => setExpanded(p => ({...p,[id]:!p[id]}));

  if (!owner) return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={S.rentHeader}>
        <button style={S.dBack2} onClick={onBack}><Icon name="back" size={20} color={C.dark} stroke={2.5}/></button>
        <p style={{fontSize:17,fontWeight:700,color:C.black}}>Profil propriétaire</p>
        <div style={{width:38}}/>
      </div>
      <EmptyState icon="user" text="Profil non trouvé"/>
    </div>
  );

  const totalUnits   = owner.buildings.reduce((s,b)=>s+b.units.length,0);
  const availUnits   = owner.buildings.reduce((s,b)=>s+b.units.filter(u=>u.available).length,0);
  const totalRevenue = owner.buildings.reduce((s,b)=>s+b.units.reduce((ss,u)=>ss+(u.monthPrice||u.nightPrice*20),0),0);

  const typeLabel = { appartement:"Appart.", studio:"Studio", chambre:"Chambre", villa:"Villa", hotel:"Hôtel" };

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Header avec back */}
        <div style={{position:"relative",height:160,background:owner.avatarBg}}>
          <div style={{position:"absolute",inset:0,opacity:.15,background:`repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)`,backgroundSize:"20px 20px"}}/>
          <button style={{...S.dBack2,position:"absolute",top:52,left:12,background:"rgba(0,0,0,.25)"}} onClick={onBack}>
            <Icon name="back" size={20} color="white" stroke={2.5}/>
          </button>
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 20px 18px",display:"flex",alignItems:"flex-end",gap:14}}>
            <div style={{width:72,height:72,borderRadius:36,background:C.white,border:"3px solid white",boxShadow:"0 4px 16px rgba(0,0,0,.15)",overflow:"hidden"}}>
              <FaceAvatar photo={owner.photo} avatar={owner.avatar} bg={owner.avatarBg} size={72} radius={36}/>
            </div>
            <div style={{paddingBottom:4}}>
              <p style={{fontSize:20,fontWeight:800,color:"white"}}>{owner.name}</p>
              <p style={{fontSize:12,color:"rgba(255,255,255,.8)"}}>Membre depuis {owner.since} · {owner.city}</p>
            </div>
          </div>
        </div>

        <div style={{background:C.white,padding:"16px 20px 0"}}>
          {/* Badges */}
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            {owner.superhost && <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,background:"#FFF5F5",color:C.coral,border:`1px solid ${C.coral}33`}}>⭐ Superhost</span>}
            <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:C.bg,color:C.dark,border:`1px solid ${C.border}`}}>★ {owner.rating} · {owner.reviews} avis</span>
            <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:C.bg,color:C.dark,border:`1px solid ${C.border}`}}>✓ Identité vérifiée</span>
          </div>

          <p style={{fontSize:13,color:C.mid,lineHeight:1.7,marginBottom:16}}>{owner.about}</p>

          {/* Stats portefeuille */}
          <div style={{display:"flex",background:C.bg,borderRadius:14,padding:"14px",gap:0,marginBottom:4}}>
            {[
              {val:owner.buildings.length,  label:"Immeubles"},
              {val:totalUnits,              label:"Unités total"},
              {val:availUnits,              label:"Disponibles", color:"#16A34A"},
              {val:totalUnits-availUnits,   label:"Réservés",    color:C.coral},
            ].map((s,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,...(i>0?{borderLeft:`1px solid ${C.border}`}:{})}}>
                <span style={{fontSize:18,fontWeight:800,color:s.color||C.black}}>{s.val}</span>
                <span style={{fontSize:9,fontWeight:500,color:C.light,textTransform:"uppercase",letterSpacing:.4,textAlign:"center"}}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buildings / Établissements */}
        <div style={{padding:"12px 16px 100px",display:"flex",flexDirection:"column",gap:14}}>
          <p style={{fontSize:15,fontWeight:700,color:C.black}}>Son portefeuille</p>

          {owner.buildings.map(building => {
            const isOpen     = !!expanded[building.id];
            const availInB   = building.units.filter(u=>u.available).length;
            const totalInB   = building.units.length;
            const typeIcons  = { immeuble:"🏢", villa:"🏡", hotel:"🏨", motel:"🏩" };

            return (
              <div key={building.id} style={{background:C.white,borderRadius:18,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.07)"}}>
                {/* Building header */}
                <div style={{position:"relative",height:130,cursor:"pointer"}} onClick={()=>toggleBuilding(building.id)}>
                  <img src={building.img} alt={building.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.65) 0%,transparent 50%)"}}/>
                  <div style={{position:"absolute",bottom:12,left:14,right:14}}>
                    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
                      <div>
                        <p style={{fontSize:15,fontWeight:700,color:"white"}}>{typeIcons[building.type]||"🏠"} {building.name}</p>
                        <p style={{fontSize:11,color:"rgba(255,255,255,.75)",marginTop:2}}>
                          <ByerPin size={11}/> {building.address}
                        </p>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{background:"rgba(255,255,255,.92)",borderRadius:10,padding:"4px 9px",display:"inline-block"}}>
                          <span style={{fontSize:11,fontWeight:700,color:availInB>0?"#16A34A":C.coral}}>
                            {availInB}/{totalInB} dispo
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,.3)",borderRadius:20,padding:"4px 8px",display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:10,fontWeight:600,color:"white"}}>{isOpen?"Fermer":"Voir unités"}</span>
                    <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24" style={{transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>

                {/* Units list — expanded */}
                {isOpen && (
                  <div style={{padding:"8px 0"}}>
                    {building.units.map((unit,ui) => {
                      const isAvail = unit.available;
                      return (
                        <div key={unit.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderTop:ui>0?`1px solid ${C.border}`:"none"}}>
                          <div style={{width:10,height:10,borderRadius:5,flexShrink:0,background:isAvail?"#16A34A":C.light,...(isAvail?{boxShadow:"0 0 0 3px #16A34A22"}:{})}}/>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <p style={{fontSize:13,fontWeight:600,color:C.black}}>{unit.label}</p>
                              {unit.count && <span style={{fontSize:10,color:C.mid,background:C.bg,padding:"1px 6px",borderRadius:8}}>×{unit.count}</span>}
                            </div>
                            <p style={{fontSize:11,color:C.light,marginTop:1}}>
                              {unit.floor}
                              {!isAvail && unit.availableFrom && ` · Libre le ${unit.availableFrom}`}
                            </p>
                          </div>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            {isAvail ? (
                              <>
                                <p style={{fontSize:13,fontWeight:700,color:C.black}}>{fmt(unit.nightPrice)}</p>
                                <p style={{fontSize:10,color:C.light}}>/nuit</p>
                              </>
                            ) : (
                              <span style={{fontSize:10,fontWeight:600,color:C.light,background:C.bg,padding:"3px 8px",borderRadius:10}}>Réservé</span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <div style={{padding:"10px 16px 6px",display:"flex",gap:8}}>
                      <button style={{...S.mapsBtn,flex:1,background:"#F0FDF4",borderColor:"#BBF7D0",color:"#16A34A",justifyContent:"center"}}>
                        <Icon name="message" size={15} color="#16A34A" stroke={2}/>
                        <span>Contacter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


/* ═══ js/rent.js ═══ */
/* Byer — Rent Management */

/* ─── RENT SCREEN ───────────────────────────────── */
function RentScreen({ onBack }) {
  const [role, setRole]       = useState("locataire"); // locataire | bailleur
  const [activeTab, setActiveTab] = useState("courant"); // courant | historique | rappels
  const [paySheet, setPaySheet]   = useState(null); // loyer à payer
  const [sentReminders, setSentReminders] = useState({});
  const [paid, setPaid] = useState({}); // simule paiements effectués

  const loyers  = role === "locataire" ? LOYERS_LOCATAIRE : LOYERS_BAILLEUR;
  const pending = loyers.filter(l => l.statut === "en_attente" || l.statut === "en_retard");
  const history = loyers.filter(l => l.statut === "payé" || paid[l.id]);

  const totalDu   = pending.filter(l=>!paid[l.id]).reduce((s,l)=>s+l.montant,0);
  const totalRecu = (role==="bailleur" ? history : history).reduce((s,l)=>s+l.montant,0);

  const handlePaid = (loyerId) => {
    setPaid(p => ({...p,[loyerId]:true}));
    setPaySheet(null);
  };

  const sendReminder = (id, level="rappel") => setSentReminders(p => ({...p,[id]:level}));

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>

      {/* Header */}
      <div style={S.rentHeader}>
        <button style={S.dBack2} onClick={onBack}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
        </button>
        <p style={{fontSize:17,fontWeight:700,color:C.black}}>Gestion des loyers</p>
        <div style={{width:38}}/>
      </div>

      <div style={{flex:1,overflowY:"auto"}}>

        {/* Role toggle */}
        <div style={S.rentRoleWrap}>
          {[{id:"locataire",label:"Je suis locataire"},{id:"bailleur",label:"Je suis bailleur"}].map(row=>(
            <button
              key={row.id}
              style={{...S.roleBtn,...(role===row.id?S.roleBtnOn:{})}}
              onClick={()=>{ setRole(row.id); setActiveTab("courant"); }}
            >
              {row.label}
            </button>
          ))}
        </div>

        {/* Summary card */}
        <div style={S.rentSummary}>
          {role==="locataire" ? (
            <>
              <div style={S.summaryCol}>
                <span style={S.summaryVal}>{fmt(totalDu)}</span>
                <span style={S.summaryLabel}>À payer ce mois</span>
              </div>
              <div style={S.summaryDivider}/>
              <div style={S.summaryCol}>
                <span style={S.summaryVal}>{history.length}</span>
                <span style={S.summaryLabel}>Paiements effectués</span>
              </div>
              <div style={S.summaryDivider}/>
              <div style={S.summaryCol}>
                <span style={{...S.summaryVal, color: WARN ? C.coral : "#16A34A"}}>
                  {WARN ? `J-${DAYS_LEFT}` : "À jour"}
                </span>
                <span style={S.summaryLabel}>Statut</span>
              </div>
            </>
          ) : (
            <>
              <div style={S.summaryCol}>
                <span style={S.summaryVal}>{pending.filter(l=>!paid[l.id]).length}</span>
                <span style={S.summaryLabel}>En attente</span>
              </div>
              <div style={S.summaryDivider}/>
              <div style={S.summaryCol}>
                <span style={{...S.summaryVal,color:"#16A34A"}}>{fmt(totalRecu)}</span>
                <span style={S.summaryLabel}>Reçu ce mois</span>
              </div>
              <div style={S.summaryDivider}/>
              <div style={S.summaryCol}>
                <span style={{...S.summaryVal,color:C.coral}}>
                  {LOYERS_BAILLEUR.filter(l=>l.statut==="en_retard").length}
                </span>
                <span style={S.summaryLabel}>En retard</span>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div style={S.rentTabs}>
          {[
            {id:"courant",  label:"Ce mois"},
            {id:"historique",label:"Historique"},
            {id:"rappels",  label:"Rappels"},
          ].map(t=>(
            <button key={t.id} style={{...S.rentTab,...(activeTab===t.id?S.rentTabOn:{})}} onClick={()=>setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{padding:"12px 16px 100px"}}>

          {/* ── CE MOIS ── */}
          {activeTab==="courant" && (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {pending.length === 0 && <EmptyState icon="check" text="Tous les loyers du mois sont réglés 🎉"/>}
              {pending.map(loyer => {
                const isPaid = !!paid[loyer.id];
                const isLate = loyer.statut === "en_retard";
                const isWarn = !isLate && loyer.rappelActif;
                return (
                  <div key={loyer.id} style={{...S.loyerCard,...(isLate?{borderLeft:`3px solid #EF4444`}:isWarn?{borderLeft:`3px solid ${C.coral}`}:{borderLeft:`3px solid #16A34A`})}}>
                    {/* Badge statut */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div style={{minWidth:0}}>
                        <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:2}}>{loyer.logement || loyer.locataire}</p>
                        <p style={{fontSize:12,color:C.mid}}>{role==="locataire"?`Bailleur : ${loyer.bailleur}`:`Locataire : ${loyer.locataire}`}</p>
                      </div>
                      <span style={{...S.statutBadge,
                        background: isPaid?"#F0FDF4":isLate?"#FEF2F2":isWarn?"#FFF8F8":"#F0FDF4",
                        color: isPaid?"#16A34A":isLate?"#EF4444":isWarn?C.coral:"#16A34A"
                      }}>
                        {isPaid?"Payé":isLate?"En retard":isWarn?"Rappel J-"+loyer.joursRestants:"En attente"}
                      </span>
                    </div>

                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                      <div>
                        <p style={{fontSize:20,fontWeight:800,color:C.black}}>{fmt(loyer.montant)}</p>
                        <p style={{fontSize:12,color:C.light}}>Échéance : {loyer.echeance}</p>
                      </div>
                    </div>

                    {/* ── Actions locataire ── */}
                    {role==="locataire" && !isPaid && (
                      <button style={S.payBtn} onClick={()=>setPaySheet(loyer)}>
                        Payer maintenant
                      </button>
                    )}
                    {role==="locataire" && isPaid && (
                      <div style={S.paidConfirm}>
                        <Icon name="check" size={14} color="#16A34A" stroke={2.5}/>
                        <span style={{fontSize:13,color:"#16A34A",fontWeight:600}}>Paiement confirmé ce mois</span>
                      </div>
                    )}

                    {/* ── Actions bailleur ──
                        RÈGLE : le bailleur ne peut notifier le locataire
                        qu'APRÈS que l'échéance mensuelle soit dépassée.
                        Avant = Byer gère les rappels automatiques seul.
                    ── */}
                    {role==="bailleur" && !isPaid && !isLate && (
                      /* Avant échéance : informatif uniquement, pas d'action manuelle */
                      <div style={S.autoMsgBox}>
                        <svg width="13" height="13" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{flexShrink:0}}>
                          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
                        </svg>
                        <span style={{fontSize:12,color:C.mid,lineHeight:1.5}}>
                          Byer envoie automatiquement les rappels au locataire.
                          Vous pourrez le notifier directement dès que l'échéance sera dépassée.
                        </span>
                      </div>
                    )}

                    {role==="bailleur" && isLate && !isPaid && (
                      /* Après échéance : deux niveaux d'escalade */
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {/* Niveau 1 — rappel amiable (disponible dès J+1) */}
                        {!sentReminders[loyer.id] && (
                          <button
                            style={S.notifBtn}
                            onClick={()=>sendReminder(loyer.id,"rappel")}
                          >
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
                            </svg>
                            Envoyer un rappel au locataire
                          </button>
                        )}
                        {sentReminders[loyer.id] === "rappel" && (
                          <div style={S.paidConfirm}>
                            <Icon name="check" size={14} color={C.coral} stroke={2.5}/>
                            <span style={{fontSize:12,color:C.coral,fontWeight:600}}>Rappel amiable envoyé à {loyer.locataire}</span>
                          </div>
                        )}

                        {/* Niveau 2 — mise en demeure (visible après rappel envoyé ou si très en retard) */}
                        {(sentReminders[loyer.id] === "rappel" || loyer.joursRestants < -5) && (
                          <button
                            style={{...S.notifBtnRed,...(sentReminders[loyer.id]==="demeure"?S.notifBtnDone:{})}}
                            onClick={()=>setSentReminders(p=>({...p,[loyer.id]:"demeure"}))}
                            disabled={sentReminders[loyer.id]==="demeure"}
                          >
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                            {sentReminders[loyer.id]==="demeure" ? "✓ Mise en demeure envoyée" : "Envoyer une mise en demeure"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── HISTORIQUE ── */}
          {activeTab==="historique" && (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <p style={{fontSize:13,color:C.mid,marginBottom:4}}>
                {history.length} paiement{history.length!==1?"s":""} enregistré{history.length!==1?"s":""}
              </p>
              {history.length===0 && <EmptyState icon="trips" text="Aucun historique pour le moment"/>}
              {history.map(loyer => (
                <div key={loyer.id} style={S.histCard}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <p style={{fontSize:14,fontWeight:700,color:C.black}}>{loyer.logement}</p>
                      <p style={{fontSize:12,color:C.mid}}>{role==="locataire"?loyer.bailleur:loyer.locataire}</p>
                    </div>
                    <span style={{...S.statutBadge,background:"#F0FDF4",color:"#16A34A"}}>Payé</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <p style={{fontSize:16,fontWeight:700,color:C.black}}>{fmt(loyer.montant)}</p>
                      <p style={{fontSize:11,color:C.light}}>Échéance : {loyer.echeance}</p>
                    </div>
                  </div>
                  {/* Proof section */}
                  <div style={S.proofBox}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                      <div style={S.proofIcon}>
                        <svg width="14" height="14" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                      </div>
                      <div>
                        <p style={{fontSize:11,fontWeight:700,color:C.dark}}>{loyer.methode}</p>
                        <p style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>{loyer.ref}</p>
                      </div>
                    </div>
                    <p style={{fontSize:11,color:C.mid,flexShrink:0}}>{loyer.datePaiement}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── RAPPELS ── */}
          {activeTab==="rappels" && (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {/* Rappel automatique banner */}
              <div style={S.autoRappelCard}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:36,height:36,borderRadius:18,background:"#FFF5F5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="18" height="18" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
                      <circle cx="18" cy="8" r="4" fill={C.coral} stroke="none"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{fontSize:14,fontWeight:700,color:C.black}}>Rappels automatiques activés</p>
                    <p style={{fontSize:12,color:C.mid}}>Notification à J-7 avant l'échéance</p>
                  </div>
                  <div style={{marginLeft:"auto",width:42,height:24,borderRadius:12,background:C.coral,display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"2px 3px",cursor:"pointer"}}>
                    <div style={{width:18,height:18,borderRadius:9,background:"white"}}/>
                  </div>
                </div>
                <div style={{background:"#FFF8F8",borderRadius:10,padding:"10px 12px",fontSize:12,color:C.mid,lineHeight:1.6}}>
                  {role==="locataire"
                    ? "Vous recevrez une notification push et un SMS 7 jours avant la fin du mois pour vous rappeler de payer votre loyer."
                    : "Vos locataires recevront automatiquement un rappel 7 jours avant la date d'échéance. Vous serez notifié si un loyer n'est toujours pas réglé à J-3."}
                </div>
              </div>

              {/* Upcoming reminders */}
              <p style={{fontSize:15,fontWeight:700,color:C.black}}>Rappels à venir</p>
              {(role==="locataire" ? LOYERS_LOCATAIRE : LOYERS_BAILLEUR)
                .filter(l => l.statut==="en_attente")
                .map(loyer => (
                  <div key={loyer.id} style={S.rappelCard}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{...S.rappelDot, background: loyer.joursRestants<=3?"#EF4444":loyer.joursRestants<=7?C.coral:"#16A34A"}}/>
                      <div style={{flex:1}}>
                        <p style={{fontSize:14,fontWeight:600,color:C.black}}>{loyer.logement || loyer.locataire}</p>
                        <p style={{fontSize:12,color:C.mid}}>Échéance : {loyer.echeance}</p>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <p style={{fontSize:13,fontWeight:700,color:loyer.joursRestants<=3?"#EF4444":loyer.joursRestants<=7?C.coral:C.mid}}>
                          {loyer.joursRestants > 0 ? `J-${loyer.joursRestants}` : `J+${Math.abs(loyer.joursRestants)}`}
                        </p>
                        <p style={{fontSize:11,color:C.light}}>{loyer.joursRestants<=7?"Rappel actif":"Planifié"}</p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>

      {/* Payment sheet */}
      {paySheet && (
        <PaymentSheet loyer={paySheet} onClose={()=>setPaySheet(null)} onSuccess={handlePaid}/>
      )}
    </div>
  );
}

/* ─── PAYMENT SHEET ─────────────────────────────── */
function PaymentSheet({ loyer, onClose, onSuccess }) {
  const [step, setStep]     = useState("choose"); // choose | confirm | success
  const [method, setMethod] = useState(null);
  const [phone, setPhone]   = useState("");

  return (
    <>
      <div style={{...S.sheetBackdrop,zIndex:300}} onClick={onClose}/>
      <div style={{...S.sheet,zIndex:301,maxHeight:"90vh"}} className="sheet">
        <div style={S.sheetHandle}/>

        {step === "choose" && (
          <>
            <div style={S.sheetHeader}>
              <p style={S.sheetTitle}>Choisir un mode de paiement</p>
              <button style={S.sheetClose} onClick={onClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{padding:"0 16px",marginBottom:16}}>
              <div style={S.payAmountBox}>
                <p style={{fontSize:13,color:C.mid}}>Loyer à payer · {loyer.echeance}</p>
                <p style={{fontSize:24,fontWeight:800,color:C.black,marginTop:2}}>{fmt(loyer.montant)}</p>
                <p style={{fontSize:12,color:C.light,marginTop:1}}>{loyer.logement}</p>
              </div>
            </div>
            <div style={{padding:"0 16px 32px",display:"flex",flexDirection:"column",gap:10}}>
              {PAYMENT_METHODS.map(m => (
                <button key={m.id} style={S.methodBtn} onClick={()=>{ setMethod(m); setStep("confirm"); }}>
                  <div style={{...S.methodLogo, background:m.accent, color:m.textColor}}>
                    <span style={{fontSize:11,fontWeight:800}}>{m.short}</span>
                  </div>
                  <div style={{flex:1,textAlign:"left"}}>
                    <p style={{fontSize:14,fontWeight:600,color:C.black}}>{m.label}</p>
                    <p style={{fontSize:12,color:C.mid}}>{m.sub}</p>
                  </div>
                  <Icon name="chevron" size={16} color={C.light} stroke={2}/>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "confirm" && method && (
          <>
            <div style={S.sheetHeader}>
              <button style={S.sheetClose} onClick={()=>setStep("choose")}>
                <Icon name="back" size={20} color={C.dark} stroke={2}/>
              </button>
              <p style={S.sheetTitle}>{method.label}</p>
              <div style={{width:32}}/>
            </div>
            <div style={{padding:"0 16px 32px"}}>
              <div style={{...S.payAmountBox,marginBottom:20}}>
                <p style={{fontSize:13,color:C.mid}}>Montant à payer</p>
                <p style={{fontSize:26,fontWeight:800,color:C.black,marginTop:2}}>{fmt(loyer.montant)}</p>
              </div>

              {(method.id==="mtn"||method.id==="orange") && (
                <>
                  <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:8}}>Numéro {method.label}</p>
                  <div style={S.phoneInput}>
                    <span style={{fontSize:13,color:C.mid,fontWeight:500}}>+237</span>
                    <div style={{width:1,height:18,background:C.border}}/>
                    <input
                      style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:14,color:C.dark,fontFamily:"'DM Sans',sans-serif"}}
                      placeholder={method.id==="mtn"?"6XX XXX XXX":"6XX XXX XXX"}
                      value={phone} onChange={e=>setPhone(e.target.value)}
                      type="tel"
                    />
                  </div>
                  <p style={{fontSize:11,color:C.light,marginTop:6,marginBottom:20}}>
                    Vous recevrez une demande de confirmation sur votre téléphone.
                  </p>
                </>
              )}
              {method.id==="eu" && (
                <div style={{...S.proofBox,marginBottom:20,padding:"14px"}}>
                  <p style={{fontSize:13,color:C.mid,lineHeight:1.6}}>
                    Rendez-vous dans l'agence Express Union la plus proche avec le code de référence :<br/>
                    <span style={{fontFamily:"monospace",fontWeight:700,color:C.black,fontSize:14}}>BYER-{loyer.id}-{loyer.montant}</span>
                  </p>
                </div>
              )}
              {method.id==="virement" && (
                <div style={{...S.proofBox,marginBottom:20,padding:"14px",flexDirection:"column",gap:6}}>
                  {[{l:"Banque",v:"Afriland First Bank"},{ l:"RIB",v:"10041 01234 00987654321 76"},{l:"Libellé",v:`LOYER ${loyer.id} BYER`}].map(row=>(
                    <div key={row.l} style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:12,color:C.mid}}>{row.l}</span>
                      <span style={{fontSize:12,fontWeight:600,color:C.dark,fontFamily:row.l!=="Banque"?"monospace":"inherit"}}>{row.v}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                style={{...S.payBtn, opacity:(method.id==="mtn"||method.id==="orange")&&phone.length<9?.5:1}}
                onClick={()=>{ if((method.id==="mtn"||method.id==="orange")&&phone.length<9) return; setStep("success"); }}
              >
                {method.id==="virement" ? "J'ai effectué le virement" : `Confirmer le paiement`}
              </button>
            </div>
          </>
        )}

        {step === "success" && (
          <div style={{padding:"32px 24px 48px",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
            <div style={S.successCircle}>
              <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p style={{fontSize:20,fontWeight:800,color:C.black,textAlign:"center"}}>Paiement effectué !</p>
            <p style={{fontSize:14,color:C.mid,textAlign:"center",lineHeight:1.6}}>
              Votre loyer de <strong>{fmt(loyer.montant)}</strong> a été envoyé via {method?.label}.<br/>
              Une preuve de paiement a été enregistrée dans votre historique.
            </p>
            <div style={{...S.proofBox,width:"100%",padding:"14px"}}>
              <div style={S.proofIcon}>
                <svg width="14" height="14" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:11,fontWeight:700,color:C.dark}}>{method?.label}</p>
                <p style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>
                  {method?.short}{Date.now().toString().slice(-8).toUpperCase()}
                </p>
              </div>
              <p style={{fontSize:11,color:C.mid}}>Maintenant</p>
            </div>
            <button style={{...S.payBtn,width:"100%"}} onClick={()=>onSuccess(loyer.id)}>
              Fermer
            </button>
          </div>
        )}
      </div>
    </>
  );
}


/* ═══ js/sheets.js ═══ */
/* Byer — Bottom Sheets */

/* ─── PLACEHOLDER SCREEN ───────────────────────── */
function PlaceholderScreen({ icon, title, sub }) {
  return <div><div style={S.pageHead}><p style={S.pageTitle}>{title}</p></div><EmptyState icon={icon} text={sub}/></div>;
}

/* ─── FILTER SHEET ──────────────────────────────── */
function FilterSheet({ filters, segment, onApply, onClose }) {
  const initial = filters || {};
  const [localRating, setLocalRating] = useState(initial.minRating ?? 0);
  const [priceMax, setPriceMax]       = useState(initial.priceMax ?? 200000);
  const [guests, setGuests]           = useState(initial.guests ?? 0);
  const [amenities, setAmenities]     = useState(initial.amenities ?? []);
  const [superhostOnly, setSuperhost] = useState(initial.superhostOnly ?? false);
  const [instantBook, setInstantBook] = useState(initial.instantBook ?? false);

  const RATING_OPTS = [
    { val:0,   label:"Tous" },
    { val:4.5, label:"4.5★+" },
    { val:4.7, label:"4.7★+" },
    { val:4.9, label:"4.9★+" },
  ];
  const PROPERTY_AMENITIES = ["WiFi","Climatisé","Piscine","Parking","Vue mer","Jardin","Terrasse","Petit-déj","Smart TV","Gardien","Groupe électrogène","BBQ"];
  const VEHICLE_AMENITIES  = ["4×4","GPS","Climatisé","Bluetooth","Chauffeur","Wifi embarqué","Luxe","Diesel"];
  const AMENITIES = segment === "vehicle" ? VEHICLE_AMENITIES : PROPERTY_AMENITIES;

  const toggleAmenity = (a) => {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x!==a) : [...prev, a]);
  };

  const reset = () => {
    setLocalRating(0); setPriceMax(200000); setGuests(0);
    setAmenities([]); setSuperhost(false); setInstantBook(false);
  };

  const apply = () => {
    onApply({
      minRating: localRating,
      priceMax,
      guests,
      amenities,
      superhostOnly,
      instantBook,
    });
  };

  const activeCount =
    (localRating>0?1:0) + (priceMax<200000?1:0) + (guests>0?1:0) +
    (amenities.length>0?1:0) + (superhostOnly?1:0) + (instantBook?1:0);

  const Section = ({title, children}) => (
    <div style={{marginBottom:22}}>
      <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:10}}>{title}</p>
      {children}
    </div>
  );

  return (
    <>
      <div style={{...S.sheetBackdrop,zIndex:200}} onClick={onClose}/>
      <div style={{...S.sheet,zIndex:201,maxHeight:"88vh",display:"flex",flexDirection:"column"}} className="sheet">
        <div style={S.sheetHandle}/>
        <div style={{...S.sheetHeader,flexShrink:0}}>
          <p style={S.sheetTitle}>Filtrer les résultats {activeCount>0 && <span style={{fontSize:12,color:C.coral,marginLeft:6}}>({activeCount} actif{activeCount>1?"s":""})</span>}</p>
          <button style={S.sheetClose} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{padding:"0 20px 12px",overflowY:"auto",flex:1}}>
          {/* Prix max */}
          <Section title={`Prix max : ${fmt(priceMax)}/nuit`}>
            <input type="range" min="10000" max="200000" step="5000" value={priceMax}
              onChange={e=>setPriceMax(Number(e.target.value))}
              style={{width:"100%",accentColor:C.coral,cursor:"pointer"}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.light,marginTop:4}}>
              <span>10 000 F</span>
              <span>200 000 F</span>
            </div>
          </Section>

          {/* Nombre voyageurs (property only) */}
          {segment !== "vehicle" && (
            <Section title="Nombre de voyageurs">
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[0,1,2,4,6,8,10].map(n => (
                  <button key={n}
                    onClick={()=>setGuests(n)}
                    style={{
                      padding:"8px 14px",borderRadius:20,fontSize:13,fontWeight:600,cursor:"pointer",
                      border:`1.5px solid ${guests===n?C.coral:C.border}`,
                      background:guests===n?"#FFF5F5":C.white,
                      color:guests===n?C.coral:C.dark,
                      fontFamily:"'DM Sans',sans-serif",
                    }}>
                    {n===0?"Tous":n===10?`${n}+`:n}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* Note min */}
          <Section title="Note minimale">
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {RATING_OPTS.map(o => (
                <button key={o.val}
                  onClick={()=>setLocalRating(o.val)}
                  style={{
                    padding:"8px 14px",borderRadius:20,fontSize:13,fontWeight:600,cursor:"pointer",
                    border:`1.5px solid ${localRating===o.val?C.coral:C.border}`,
                    background:localRating===o.val?"#FFF5F5":C.white,
                    color:localRating===o.val?C.coral:C.dark,
                    fontFamily:"'DM Sans',sans-serif",
                  }}>
                  {o.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Equipements */}
          <Section title={segment==="vehicle"?"Caractéristiques":"Équipements"}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {AMENITIES.map(a => (
                <button key={a}
                  onClick={()=>toggleAmenity(a)}
                  style={{
                    padding:"7px 12px",borderRadius:16,fontSize:12,fontWeight:600,cursor:"pointer",
                    border:`1.5px solid ${amenities.includes(a)?C.coral:C.border}`,
                    background:amenities.includes(a)?"#FFF5F5":C.white,
                    color:amenities.includes(a)?C.coral:C.mid,
                    fontFamily:"'DM Sans',sans-serif",
                  }}>
                  {amenities.includes(a) && "✓ "}{a}
                </button>
              ))}
            </div>
          </Section>

          {/* Toggles */}
          <Section title="Préférences">
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button onClick={()=>setSuperhost(!superhostOnly)}
                style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",
                  background:superhostOnly?"#FFF5F5":C.bg,borderRadius:12,border:"none",cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif"}}>
                <div style={{textAlign:"left"}}>
                  <p style={{fontSize:13,fontWeight:600,color:C.dark}}>Superhost uniquement</p>
                  <p style={{fontSize:11,color:C.light,marginTop:2}}>Hôtes les mieux notés</p>
                </div>
                <div style={{width:42,height:24,borderRadius:12,background:superhostOnly?C.coral:C.border,
                  display:"flex",alignItems:"center",padding:"0 3px",justifyContent:superhostOnly?"flex-end":"flex-start",transition:"all .18s"}}>
                  <div style={{width:18,height:18,borderRadius:9,background:"white"}}/>
                </div>
              </button>
              <button onClick={()=>setInstantBook(!instantBook)}
                style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",
                  background:instantBook?"#FFF5F5":C.bg,borderRadius:12,border:"none",cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif"}}>
                <div style={{textAlign:"left"}}>
                  <p style={{fontSize:13,fontWeight:600,color:C.dark}}>Réservation instantanée</p>
                  <p style={{fontSize:11,color:C.light,marginTop:2}}>Sans validation préalable</p>
                </div>
                <div style={{width:42,height:24,borderRadius:12,background:instantBook?C.coral:C.border,
                  display:"flex",alignItems:"center",padding:"0 3px",justifyContent:instantBook?"flex-end":"flex-start",transition:"all .18s"}}>
                  <div style={{width:18,height:18,borderRadius:9,background:"white"}}/>
                </div>
              </button>
            </div>
          </Section>
        </div>

        {/* Footer actions */}
        <div style={{padding:"12px 20px 24px",borderTop:`1px solid ${C.border}`,display:"flex",gap:10,flexShrink:0,background:C.white}}>
          <button onClick={reset}
            style={{flex:1,padding:"14px",borderRadius:12,border:`1.5px solid ${C.border}`,
              background:C.white,color:C.dark,fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            Réinitialiser
          </button>
          <button onClick={apply}
            style={{flex:2,padding:"14px",borderRadius:12,border:"none",
              background:C.coral,color:"white",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            Appliquer{activeCount>0?` (${activeCount})`:""}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── LOCATION SHEET ────────────────────────────── */
function LocationSheet({ location, onSelect, onClose }) {
  const [query, setQuery] = useState("");
  const filtered = LOCATIONS.filter(l =>
    l.label.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <>
      {/* Backdrop */}
      <div style={S.sheetBackdrop} onClick={onClose}/>
      {/* Sheet */}
      <div style={S.sheet} className="sheet">
        {/* Handle */}
        <div style={S.sheetHandle}/>

        {/* Header */}
        <div style={S.sheetHeader}>
          <p style={S.sheetTitle}>Choisir une destination</p>
          <button style={S.sheetClose} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Search inside sheet */}
        <div style={S.sheetSearch}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:14,color:C.dark,fontFamily:"'DM Sans',sans-serif"}}
            placeholder="Rechercher une ville…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Options list */}
        <div style={S.sheetList}>
          {/* "Ma position" auto-detect row — toujours en premier */}
          <button
            style={{...S.sheetRow,...(location.id==="cameroun"?S.sheetRowOn:{})}}
            onClick={() => onSelect(LOCATIONS[0])}
          >
            {/* Pin inversé pour "ma position" */}
            <div style={S.sheetPinWrap}>
              <ByerPin size={22}/>
            </div>
            <div style={S.sheetRowTexts}>
              <span style={S.sheetRowLabel}>Ma position actuelle</span>
              <span style={S.sheetRowSub}>Cameroun · Détection GPS</span>
            </div>
            {location.id==="cameroun" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.coral} strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>

          <div style={{height:1,background:C.border,margin:"8px 16px"}}/>

          {/* Villes filtrées */}
          {filtered.slice(1).map(loc => (
            <button
              key={loc.id}
              style={{...S.sheetRow,...(location.id===loc.id?S.sheetRowOn:{})}}
              onClick={() => onSelect(loc)}
            >
              <div style={S.sheetPinWrap}>
                {/* Même ByerPin partout — opacité réduite si non sélectionné */}
                <div style={{opacity: location.id===loc.id ? 1 : 0.35}}>
                  <ByerPin size={22}/>
                </div>
              </div>
              <div style={S.sheetRowTexts}>
                <span style={{...S.sheetRowLabel,...(location.id===loc.id?{color:C.coral}:{})}}>{loc.label}</span>
                <span style={S.sheetRowSub}>{loc.sub}</span>
              </div>
              {location.id===loc.id && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.coral} strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}


/* ═══ js/qrcode.js ═══ */
/* ═══════════════════════════════════════════════════
   Byer — QR Code Scanner & Guest Verification
   Allows bailleurs/concierges to scan a guest's QR code
   and instantly verify their identity + booking status.
   ═══════════════════════════════════════════════════ */

/* ── Mock QR code database (simulates backend) ── */
const QR_GUESTS = {
  "BYR-2025-0322-A": {
    name: "Jean Kamga",
    phone: "+237 6 99 12 34 56",
    photo: "https://i.pravatar.cc/120?img=33",
    booking: {
      ref: "BYR-2025-0322-A",
      title: "Appartement Bonamoussadi",
      city: "Douala",
      zone: "Bonamoussadi",
      checkIn: "22 mars 2025",
      checkOut: "25 mars 2025",
      nights: 3,
      totalPaid: 105000,
      status: "paid",        // paid | pending | unpaid
      paymentMethod: "MTN Mobile Money",
      paymentDate: "20 mars 2025",
    },
  },
  "BYR-2025-0410-B": {
    name: "Marie Ngassa",
    phone: "+237 6 77 88 99 00",
    photo: "https://i.pravatar.cc/120?img=47",
    booking: {
      ref: "BYR-2025-0410-B",
      title: "Villa Balnéaire Kribi",
      city: "Kribi",
      zone: "Bord de mer",
      checkIn: "10 avr. 2025",
      checkOut: "14 avr. 2025",
      nights: 4,
      totalPaid: 300000,
      status: "paid",
      paymentMethod: "Orange Money",
      paymentDate: "8 avr. 2025",
    },
  },
  "BYR-2025-0322-C": {
    name: "Paul Essomba",
    phone: "+237 6 55 44 33 22",
    photo: "https://i.pravatar.cc/120?img=57",
    booking: {
      ref: "BYR-2025-0322-C",
      title: "Toyota Land Cruiser 2022",
      city: "Douala",
      zone: "Akwa",
      checkIn: "22 mars 2025",
      checkOut: "24 mars 2025",
      nights: 2,
      totalPaid: 0,
      status: "unpaid",
      paymentMethod: null,
      paymentDate: null,
    },
  },
  "BYR-UNKNOWN": {
    name: "Visiteur Inconnu",
    phone: null,
    photo: null,
    booking: null,
  },
};

/* ── QR Info Dialog (explains feature by role) ── */
function QRInfoDialog({ onClose, onScan }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 350 }} onClick={onClose}/>
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: C.white,
        borderRadius: "22px 22px 0 0", zIndex: 351, padding: "0 0 36px",
      }} className="sheet">
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "12px auto 4px" }}/>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px 8px" }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: C.black }}>Scanner QR Code</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 16px" }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, background: "#FFF5F5",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.coral} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="8" height="8" rx="1"/>
              <rect x="14" y="2" width="8" height="8" rx="1"/>
              <rect x="2" y="14" width="8" height="8" rx="1"/>
              <path d="M14 14h2v2h-2z" fill={C.coral} stroke="none"/>
              <path d="M20 14h2v2h-2z" fill={C.coral} stroke="none"/>
              <path d="M14 20h2v2h-2z" fill={C.coral} stroke="none"/>
              <path d="M20 20h2v2h-2z" fill={C.coral} stroke="none"/>
              <path d="M17 17h2v2h-2z" fill={C.coral} stroke="none"/>
            </svg>
          </div>
        </div>

        {/* Role-based explanations */}
        <div style={{ padding: "0 20px" }}>

          {/* Bailleur / Concierge */}
          <div style={{
            background: "#FFF5F5", border: `1.5px solid ${C.coral}33`,
            borderRadius: 16, padding: "16px", marginBottom: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: C.coral,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.coral }}>Bailleur / Concierge</p>
                <p style={{ fontSize: 11, color: C.mid }}>Vous gerez un logement</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Scannez le QR code presente par le client a son arrivee",
                "Verifiez instantanement son identite et sa reservation",
                "Confirmez que le paiement a bien ete effectue",
                "Refusez l'acces si aucune reservation n'est trouvee",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <svg width="14" height="14" fill="none" stroke={C.coral} strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: 12, color: C.dark, lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Locataire / Voyageur */}
          <div style={{
            background: C.bg, border: `1.5px solid ${C.border}`,
            borderRadius: 16, padding: "16px", marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: "#6366F1",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#6366F1" }}>Locataire / Voyageur</p>
                <p style={{ fontSize: 11, color: C.mid }}>Vous reservez un logement</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Apres reservation, un QR code unique vous est attribue",
                "Presentez-le au bailleur ou concierge a votre arrivee",
                "Votre identite et paiement sont verifies en 2 secondes",
                "Acces rapide et securise — plus besoin de paperasse",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <svg width="14" height="14" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: 12, color: C.dark, lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={onScan}
            style={{
              width: "100%", background: C.coral, color: "white", border: "none",
              borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="8" height="8" rx="1"/>
              <rect x="14" y="2" width="8" height="8" rx="1"/>
              <rect x="2" y="14" width="8" height="8" rx="1"/>
            </svg>
            Scanner un QR code
          </button>
          <button
            onClick={onClose}
            style={{
              width: "100%", background: C.bg, color: C.dark, border: `1.5px solid ${C.border}`,
              borderRadius: 12, padding: "13px", fontWeight: 600, fontSize: 14,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
}

/* ── QR Scanner Floating Button ── */
function QRScanButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 90,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        background: C.coral,
        border: "none",
        boxShadow: "0 4px 20px rgba(255,90,95,.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 100,
        transition: "transform .18s",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="8" height="8" rx="1"/>
        <rect x="14" y="2" width="8" height="8" rx="1"/>
        <rect x="2" y="14" width="8" height="8" rx="1"/>
        <path d="M14 14h2v2h-2z" fill="white" stroke="none"/>
        <path d="M20 14h2v2h-2z" fill="white" stroke="none"/>
        <path d="M14 20h2v2h-2z" fill="white" stroke="none"/>
        <path d="M20 20h2v2h-2z" fill="white" stroke="none"/>
        <path d="M17 17h2v2h-2z" fill="white" stroke="none"/>
      </svg>
    </button>
  );
}

/* ── QR Scanner Overlay ── */
function QRScannerOverlay({ onClose, onScan }) {
  const [scanning, setScanning] = useState(true);
  const [manualCode, setManualCode] = useState("");

  const simulateScan = (code) => {
    setScanning(false);
    onScan(code);
  };

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 400 }} onClick={onClose}/>
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "90%", maxWidth: 380, background: C.white, borderRadius: 24,
        zIndex: 401, overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 12px" }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: C.black }}>Scanner QR Code</p>
            <p style={{ fontSize: 12, color: C.mid, marginTop: 2 }}>Scannez le code du client</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Camera preview simulation */}
        <div style={{
          margin: "0 20px", height: 220, borderRadius: 16, background: "#0a0a0a",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          {/* Scan frame animation */}
          <div style={{
            width: 160, height: 160, border: "2px solid rgba(255,255,255,.3)",
            borderRadius: 12, position: "relative",
          }}>
            {/* Corner highlights */}
            {[
              { top: -2, left: -2, borderTop: `3px solid ${C.coral}`, borderLeft: `3px solid ${C.coral}` },
              { top: -2, right: -2, borderTop: `3px solid ${C.coral}`, borderRight: `3px solid ${C.coral}` },
              { bottom: -2, left: -2, borderBottom: `3px solid ${C.coral}`, borderLeft: `3px solid ${C.coral}` },
              { bottom: -2, right: -2, borderBottom: `3px solid ${C.coral}`, borderRight: `3px solid ${C.coral}` },
            ].map((s, i) => (
              <div key={i} style={{ position: "absolute", width: 24, height: 24, borderRadius: 4, ...s }}/>
            ))}
            {/* Scanning line */}
            <div style={{
              position: "absolute", left: 8, right: 8, height: 2,
              background: `linear-gradient(90deg, transparent, ${C.coral}, transparent)`,
              animation: "scanLine 2s ease-in-out infinite",
              top: "50%",
            }}/>
          </div>
          <style>{`@keyframes scanLine { 0%,100% { top:15%; opacity:.3; } 50% { top:80%; opacity:1; } }`}</style>
          <p style={{
            position: "absolute", bottom: 12, fontSize: 11, color: "rgba(255,255,255,.5)",
            fontWeight: 500,
          }}>
            Placez le QR code dans le cadre
          </p>
        </div>

        {/* Manual code entry */}
        <div style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 8 }}>
            Ou entrez le code manuellement :
          </p>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 12,
            padding: "10px 14px",
          }}>
            <input
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontSize: 14, color: C.dark, fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600, letterSpacing: .5,
              }}
              placeholder="BYR-2025-XXXX-X"
              value={manualCode}
              onChange={e => setManualCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && manualCode.trim() && simulateScan(manualCode.trim())}
            />
            <button
              onClick={() => manualCode.trim() && simulateScan(manualCode.trim())}
              style={{
                background: C.coral, color: "white", border: "none", borderRadius: 8,
                padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Vérifier
            </button>
          </div>
        </div>

        {/* Demo quick scan buttons */}
        <div style={{ padding: "0 20px 20px" }}>
          <p style={{ fontSize: 11, color: C.light, marginBottom: 8 }}>Demo — Scanner rapidement :</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.keys(QR_GUESTS).filter(k => k !== "BYR-UNKNOWN").map(code => {
              const g = QR_GUESTS[code];
              const isPaid = g.booking?.status === "paid";
              return (
                <button
                  key={code}
                  onClick={() => simulateScan(code)}
                  style={{
                    background: isPaid ? "#F0FDF4" : g.booking ? "#FEF2F2" : C.bg,
                    border: `1px solid ${isPaid ? "#BBF7D0" : g.booking ? "#FECACA" : C.border}`,
                    borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600,
                    color: isPaid ? "#16A34A" : g.booking ? "#EF4444" : C.mid,
                    cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {g.name.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Guest Verification Result ── */
function GuestVerificationSheet({ code, onClose }) {
  const guest = QR_GUESTS[code] || QR_GUESTS["BYR-UNKNOWN"];
  const hasBooking = !!guest.booking;
  const isPaid = hasBooking && guest.booking.status === "paid";
  const isPending = hasBooking && guest.booking.status === "pending";

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 500 }} onClick={onClose}/>
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: C.white,
        borderRadius: "22px 22px 0 0", zIndex: 501, padding: "0 0 36px",
        maxHeight: "85vh", overflowY: "auto",
      }} className="sheet">
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "12px auto 4px" }}/>

        {/* Status banner */}
        <div style={{
          margin: "8px 20px 16px", padding: "16px",
          borderRadius: 16,
          background: isPaid ? "#F0FDF4" : hasBooking ? "#FEF2F2" : "#FFF8F8",
          border: `1.5px solid ${isPaid ? "#BBF7D0" : hasBooking ? "#FECACA" : "#FFD6D7"}`,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          {/* Status icon */}
          <div style={{
            width: 52, height: 52, borderRadius: 26,
            background: isPaid ? "#16A34A" : hasBooking ? "#EF4444" : C.coral,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="26" height="26" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
              {isPaid
                ? <polyline points="20 6 9 17 4 12"/>
                : hasBooking
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
              }
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 17, fontWeight: 800, color: isPaid ? "#16A34A" : "#EF4444" }}>
              {isPaid ? "Client vérifié" : hasBooking ? "Paiement non effectué" : "Aucune réservation"}
            </p>
            <p style={{ fontSize: 12, color: C.mid, marginTop: 2 }}>
              {isPaid
                ? "Réservation confirmée et payée"
                : hasBooking
                  ? "Ce client n'a pas encore réglé sa réservation"
                  : "Ce code QR ne correspond à aucune réservation active"
              }
            </p>
          </div>
        </div>

        {/* Guest identity */}
        <div style={{ padding: "0 20px" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.black, marginBottom: 12 }}>
            Identité du client
          </p>
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            background: C.bg, borderRadius: 16, padding: "14px",
          }}>
            {/* Avatar */}
            <div style={{
              width: 56, height: 56, borderRadius: 28, overflow: "hidden",
              background: guest.photo ? "none" : C.border,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, border: `2px solid ${isPaid ? "#16A34A" : C.border}`,
            }}>
              {guest.photo
                ? <img src={guest.photo} alt={guest.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                : <svg width="24" height="24" fill="none" stroke={C.light} strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
              }
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: C.black }}>{guest.name}</p>
              {guest.phone && (
                <p style={{ fontSize: 13, color: C.mid, marginTop: 2 }}>{guest.phone}</p>
              )}
              <p style={{ fontSize: 11, color: C.light, marginTop: 2, fontFamily: "monospace" }}>{code}</p>
            </div>
          </div>
        </div>

        {/* Booking details */}
        {hasBooking && (
          <div style={{ padding: "16px 20px 0" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.black, marginBottom: 12 }}>
              Détails de la réservation
            </p>
            <div style={{
              background: C.white, borderRadius: 16, padding: "14px",
              border: `1.5px solid ${C.border}`,
            }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.black, marginBottom: 4 }}>
                {guest.booking.title}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
                <ByerPin size={12}/>
                <span style={{ fontSize: 12, color: C.mid }}>{guest.booking.zone}, {guest.booking.city}</span>
              </div>

              {/* Dates */}
              <div style={{
                display: "flex", background: C.bg, borderRadius: 12, padding: "10px", gap: 0, marginBottom: 10,
              }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: C.light, textTransform: "uppercase", letterSpacing: .6 }}>ARRIVÉE</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.black }}>{guest.booking.checkIn}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", padding: "0 8px" }}>
                  <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: C.light, textTransform: "uppercase", letterSpacing: .6 }}>DÉPART</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.black }}>{guest.booking.checkOut}</span>
                </div>
              </div>

              {/* Payment info */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                {[
                  { l: "Durée", v: `${guest.booking.nights} nuit${guest.booking.nights > 1 ? "s" : ""}` },
                  { l: "Montant total", v: fmt(guest.booking.totalPaid), bold: true },
                  { l: "Paiement", v: isPaid ? guest.booking.paymentMethod : "Non effectué", color: isPaid ? "#16A34A" : "#EF4444" },
                  ...(isPaid ? [{ l: "Date paiement", v: guest.booking.paymentDate }] : []),
                ].map(row => (
                  <div key={row.l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                    <span style={{ fontSize: 13, color: C.mid }}>{row.l}</span>
                    <span style={{
                      fontSize: 13, fontWeight: row.bold ? 700 : 500,
                      color: row.color || C.dark,
                    }}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No booking warning */}
        {!hasBooking && (
          <div style={{ padding: "16px 20px 0" }}>
            <div style={{
              background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 16,
              padding: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            }}>
              <svg width="40" height="40" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#EF4444", textAlign: "center" }}>
                Attention — Pas de réservation
              </p>
              <p style={{ fontSize: 12, color: C.mid, textAlign: "center", lineHeight: 1.6 }}>
                Ce code ne correspond à aucune réservation active dans Byer.
                Le visiteur doit d'abord effectuer une réservation et un paiement avant d'accéder au logement.
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {isPaid && (
            <button style={{
              width: "100%", background: "#16A34A", color: "white", border: "none",
              borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}>
              Confirmer l'accès au logement
            </button>
          )}
          {hasBooking && !isPaid && (
            <button style={{
              width: "100%", background: C.coral, color: "white", border: "none",
              borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}>
              Envoyer un rappel de paiement
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              width: "100%", background: C.bg, color: C.dark, border: `1.5px solid ${C.border}`,
              borderRadius: 12, padding: "13px", fontWeight: 600, fontSize: 14,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
}


/* ═══ js/owner-dashboard.js ═══ */
/* Byer — Owner Dashboard
   Dashboard bailleur avec slides horizontales par catégorie,
   stats portefeuille, et navigation entités mères/filles.
   ═══════════════════════════════════════════════════ */

/* ─── OWNER DASHBOARD SCREEN ─────────────────────── */
function OwnerDashboardScreen({ onBack, onViewBuilding, onManageTechs, onManagePros, onBoost, onAddListing }) {
  const [activeOwner] = useState("Ekwalla M.");
  const [chartPeriod, setChartPeriod] = useState("6m"); // 3m | 6m | 12m
  /* Delegation state — sheet ouvert pour quel building */
  const [delegationFor, setDelegationFor] = useState(null);
  const [delegationsMap, setDelegationsMap] = useState(() => delegations.getAll());
  /* Re-sync from storage helper après chaque update */
  const refreshDelegations = () => setDelegationsMap(delegations.getAll());
  const owner = OWNERS[activeOwner];
  if (!owner) return null;

  const totalUnits   = owner.buildings.reduce((s,b)=>s+b.units.length,0);
  const availUnits   = owner.buildings.reduce((s,b)=>s+b.units.filter(u=>u.available).length,0);
  const occupiedUnits= totalUnits - availUnits;
  const occupancyPct = totalUnits>0 ? Math.round((occupiedUnits/totalUnits)*100) : 0;
  const totalRevenue = owner.buildings.reduce((s,b)=>s+b.units.reduce((ss,u)=>ss+(u.monthPrice||u.nightPrice*20),0),0);

  /* Synthèse revenus mensuels — généré à partir du portfolio
     Chaque mois oscille autour de la moyenne, simulant occupation variable.
     Stable (déterministe) basé sur le nom du propriétaire pour des données reproductibles. */
  const monthlyChart = (() => {
    const monthsCount = chartPeriod === "3m" ? 3 : chartPeriod === "12m" ? 12 : 6;
    const baseMonthly = totalRevenue * (occupancyPct / 100); // revenu mensuel attendu
    const labels = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];
    const now = new Date();
    const seed = activeOwner.charCodeAt(0);
    const data = [];
    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      // Pseudo-rand stable : oscillation +/- 18%
      const noise = Math.sin((d.getMonth() + 1) * seed * 0.7) * 0.18;
      const value = Math.round(baseMonthly * (1 + noise));
      data.push({ label: labels[d.getMonth()], value, isCurrent: i === 0 });
    }
    return data;
  })();
  const chartMax = Math.max(1, ...monthlyChart.map(m => m.value));
  const chartTotal = monthlyChart.reduce((s,m) => s + m.value, 0);
  const chartAvg   = Math.round(chartTotal / monthlyChart.length);

  /* Group buildings by type for category slides */
  const typeGroups = {};
  owner.buildings.forEach(b => {
    if (!typeGroups[b.type]) typeGroups[b.type] = [];
    typeGroups[b.type].push(b);
  });
  const typeLabels = { immeuble:"Immeubles", villa:"Villas", hotel:"Hôtels", motel:"Motels" };
  const typeIcons  = { immeuble:"hotel", villa:"villa", hotel:"hotel", motel:"motel" };

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Header */}
        <div style={S.rentHeader}>
          <button style={S.dBack2} onClick={onBack}>
            <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
          </button>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Mon Dashboard</p>
          <div style={{width:38}}/>
        </div>

        {/* Owner card */}
        <div style={{margin:"12px 16px",background:C.white,borderRadius:18,padding:"16px",display:"flex",alignItems:"center",gap:14,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
          <FaceAvatar photo={owner.photo} avatar={owner.avatar} bg={owner.avatarBg} size={52} radius={26}/>
          <div style={{flex:1}}>
            <p style={{fontSize:16,fontWeight:700,color:C.black}}>{owner.name}</p>
            <p style={{fontSize:12,color:C.light}}>Bailleur depuis {owner.since} · {owner.city}</p>
          </div>
          {owner.superhost && (
            <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,background:"#FFF5F5",color:C.coral}}>Superhost</span>
          )}
        </div>

        {/* Stats cards */}
        <div style={{display:"flex",gap:8,padding:"0 16px",marginBottom:16,overflowX:"auto"}}>
          {[
            {val:owner.buildings.length, label:"Propriétés", icon:"🏠", color:"#6366F1"},
            {val:totalUnits,             label:"Unités",      icon:"🚪", color:"#0EA5E9"},
            {val:occupancyPct+"%",       label:"Occupation",  icon:"📊", color:occupancyPct>=70?"#16A34A":"#F59E0B"},
            {val:fmt(totalRevenue),      label:"Rev. estimé", icon:"💰", color:C.coral},
          ].map((s,i)=>(
            <div key={i} style={{flexShrink:0,minWidth:110,background:C.white,borderRadius:16,padding:"14px",boxShadow:"0 1px 8px rgba(0,0,0,.05)",display:"flex",flexDirection:"column",gap:6}}>
              <span style={{fontSize:20}}>{s.icon}</span>
              <span style={{fontSize:18,fontWeight:800,color:s.color}}>{s.val}</span>
              <span style={{fontSize:10,fontWeight:500,color:C.light,textTransform:"uppercase",letterSpacing:.4}}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div style={{margin:"0 16px 16px",background:C.white,borderRadius:16,padding:"14px",boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:C.black}}>Revenus estimés</p>
              <p style={{fontSize:10,color:C.light,marginTop:1,fontFamily:"'DM Sans',sans-serif"}}>
                Moy. {fmt(chartAvg)} F · Total {fmt(chartTotal)} F
              </p>
            </div>
            {/* Period selector */}
            <div style={{display:"flex",gap:4,background:C.bg,borderRadius:8,padding:3}}>
              {["3m","6m","12m"].map(p => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  style={{
                    padding:"4px 9px",borderRadius:6,border:"none",cursor:"pointer",
                    background: chartPeriod === p ? C.white : "transparent",
                    color:      chartPeriod === p ? C.coral : C.mid,
                    fontSize:10,fontWeight:700,
                    fontFamily:"'DM Sans',sans-serif",
                    boxShadow: chartPeriod === p ? "0 1px 3px rgba(0,0,0,.08)" : "none",
                  }}
                >{p}</button>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div style={{
            display:"flex",alignItems:"flex-end",justifyContent:"space-between",
            gap:4,height:120,padding:"6px 0 4px",
          }}>
            {monthlyChart.map((m, i) => {
              const heightPct = (m.value / chartMax) * 100;
              return (
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,height:"100%"}}>
                  {/* Value tooltip */}
                  <div style={{
                    fontSize:9,fontWeight:700,color: m.isCurrent ? C.coral : C.light,
                    fontFamily:"'DM Sans',sans-serif",
                    height:12,whiteSpace:"nowrap",
                  }}>
                    {Math.round(m.value/1000)}k
                  </div>
                  {/* Bar */}
                  <div style={{
                    width:"100%",maxWidth:24,height:`${heightPct}%`,minHeight:4,
                    borderRadius:"6px 6px 2px 2px",
                    background: m.isCurrent
                      ? `linear-gradient(180deg, ${C.coral} 0%, #FF8082 100%)`
                      : `linear-gradient(180deg, #FFB5B7 0%, #FFD6D7 100%)`,
                    transition:"height .35s ease",
                  }}/>
                </div>
              );
            })}
          </div>
          {/* Labels */}
          <div style={{display:"flex",justifyContent:"space-between",gap:4,marginTop:6}}>
            {monthlyChart.map((m, i) => (
              <div key={i} style={{
                flex:1,textAlign:"center",
                fontSize:10,fontWeight:m.isCurrent?700:500,
                color: m.isCurrent ? C.coral : C.light,
                fontFamily:"'DM Sans',sans-serif",
              }}>{m.label}</div>
            ))}
          </div>

          {/* Legend */}
          <div style={{display:"flex",alignItems:"center",gap:14,marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:10,height:10,borderRadius:3,background:C.coral}}/>
              <span style={{fontSize:10,color:C.mid,fontFamily:"'DM Sans',sans-serif"}}>Mois en cours</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:10,height:10,borderRadius:3,background:"#FFD6D7"}}/>
              <span style={{fontSize:10,color:C.mid,fontFamily:"'DM Sans',sans-serif"}}>Historique</span>
            </div>
          </div>
        </div>

        {/* Add new listing — direct entry for property OR vehicle */}
        <div style={{padding:"0 16px",marginBottom:14}}>
          <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:14}}>✨</span> Publier une nouvelle annonce
          </p>
          <div style={{display:"flex",gap:10}}>
            <button
              onClick={()=>onAddListing?.("property")}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,background:`linear-gradient(135deg, ${C.coral} 0%, #FF8082 100%)`,border:"none",borderRadius:16,padding:"14px 12px",cursor:"pointer",boxShadow:"0 3px 10px rgba(255,90,95,.25)"}}
            >
              <span style={{fontSize:24}}>🏠</span>
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:13,fontWeight:700,color:"white"}}>Logement</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,.85)",marginTop:1}}>Hôtel, villa, appart…</p>
              </div>
            </button>
            <button
              onClick={()=>onAddListing?.("vehicle")}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,background:`linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)`,border:"none",borderRadius:16,padding:"14px 12px",cursor:"pointer",boxShadow:"0 3px 10px rgba(37,99,235,.25)"}}
            >
              <span style={{fontSize:24}}>🚗</span>
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:13,fontWeight:700,color:"white"}}>Véhicule</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,.85)",marginTop:1}}>Voiture, 4×4, premium…</p>
              </div>
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{display:"flex",gap:8,padding:"0 16px",marginBottom:14,overflowX:"auto"}}>
          <button onClick={onManageTechs} style={{flexShrink:0,minWidth:130,display:"flex",alignItems:"center",gap:8,background:"#EFF6FF",border:"1.5px solid #BFDBFE",borderRadius:14,padding:"12px 14px",cursor:"pointer"}}>
            <span style={{fontSize:18}}>🔧</span>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:"#1D4ED8",textAlign:"left"}}>Techniciens</p>
              <p style={{fontSize:10,color:"#60A5FA",textAlign:"left"}}>Gérer l'équipe</p>
            </div>
          </button>
          <button onClick={onManagePros} style={{flexShrink:0,minWidth:130,display:"flex",alignItems:"center",gap:8,background:"#FAF5FF",border:"1.5px solid #E9D5FF",borderRadius:14,padding:"12px 14px",cursor:"pointer"}}>
            <span style={{fontSize:18}}>🛎️</span>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:"#7E22CE",textAlign:"left"}}>Mes Pros</p>
              <p style={{fontSize:10,color:"#A855F7",textAlign:"left"}}>Concierges · Agents</p>
            </div>
          </button>
          <button onClick={onBoost} style={{flexShrink:0,minWidth:130,display:"flex",alignItems:"center",gap:8,background:"#FFF5F5",border:"1.5px solid #FFD6D7",borderRadius:14,padding:"12px 14px",cursor:"pointer"}}>
            <span style={{fontSize:18}}>🚀</span>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:C.coral,textAlign:"left"}}>Boost</p>
              <p style={{fontSize:10,color:"#FCA5A5",textAlign:"left"}}>Mettre en avant</p>
            </div>
          </button>
        </div>

        {/* Category slides — horizontal per type */}
        {Object.entries(typeGroups).map(([type, buildings]) => (
          <div key={type} style={{marginBottom:20}}>
            {/* Section header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Icon name={typeIcons[type]||"home"} size={18} color={C.coral} stroke={1.8}/>
                <p style={{fontSize:15,fontWeight:700,color:C.black}}>{typeLabels[type]||type}</p>
                <span style={{fontSize:11,fontWeight:600,color:C.light,background:C.bg,padding:"2px 8px",borderRadius:10}}>{buildings.length}</span>
              </div>
              {buildings.length>2 && (
                <button style={{background:"none",border:"none",fontSize:12,fontWeight:600,color:C.coral,cursor:"pointer"}}>
                  Voir tout →
                </button>
              )}
            </div>

            {/* Horizontal scroll of building cards */}
            <div style={{display:"flex",gap:12,padding:"0 16px",overflowX:"auto"}}>
              {buildings.map(building => {
                const availInB = building.units.filter(u=>u.available).length;
                const totalInB = building.units.length;
                const delegatedIds = delegationsMap[building.id] || [];
                const delegatedPros = delegatedIds
                  .map(id => userProfiles.allPros().find(p=>p.id===id))
                  .filter(Boolean);
                const delegationLabel = building.type === "hotel" || building.type === "motel"
                  ? "Concierge"
                  : "Agent";
                return (
                  <div key={building.id}
                    style={{flexShrink:0,width:260,background:C.white,borderRadius:16,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.07)"}}
                  >
                    {/* Image */}
                    <div style={{position:"relative",height:120,overflow:"hidden",cursor:"pointer"}} onClick={()=>onViewBuilding?.(building)}>
                      <img src={building.img} alt={building.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 50%)"}}/>
                      <div style={{position:"absolute",bottom:8,left:10,right:10,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                        <p style={{fontSize:13,fontWeight:700,color:"white"}}>{building.name}</p>
                        <span style={{fontSize:10,fontWeight:700,color:availInB>0?"#4ADE80":"#FCA5A5",background:"rgba(0,0,0,.4)",padding:"3px 8px",borderRadius:10}}>
                          {availInB}/{totalInB}
                        </span>
                      </div>
                      {/* Badge délégation */}
                      {delegatedPros.length > 0 && (
                        <div style={{position:"absolute",top:8,left:8,background:"rgba(126,34,206,.95)",borderRadius:8,padding:"3px 8px",display:"flex",alignItems:"center",gap:4}}>
                          <span style={{fontSize:10}}>🛎️</span>
                          <span style={{fontSize:10,fontWeight:700,color:"white"}}>{delegatedPros.length} {delegationLabel.toLowerCase()}{delegatedPros.length>1?"s":""}</span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div style={{padding:"10px 12px",cursor:"pointer"}} onClick={()=>onViewBuilding?.(building)}>
                      <p style={{fontSize:11,color:C.light,display:"flex",alignItems:"center",gap:4}}>
                        <ByerPin size={11}/> {building.address}
                      </p>
                      <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>
                        {building.units.slice(0,3).map(u=>(
                          <span key={u.id} style={{fontSize:10,fontWeight:500,padding:"2px 7px",borderRadius:8,background:u.available?"#F0FDF4":"#FEF2F2",color:u.available?"#16A34A":"#EF4444"}}>
                            {u.label.split("·")[0].trim()}
                          </span>
                        ))}
                        {building.units.length>3 && (
                          <span style={{fontSize:10,fontWeight:500,padding:"2px 7px",borderRadius:8,background:C.bg,color:C.mid}}>+{building.units.length-3}</span>
                        )}
                      </div>
                    </div>
                    {/* Delegation footer */}
                    <div style={{padding:"6px 10px 10px",borderTop:`1px solid ${C.border}`,marginTop:4}}>
                      {delegatedPros.length > 0 ? (
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{display:"flex",marginRight:-4}}>
                            {delegatedPros.slice(0,3).map((p,idx) => (
                              <div key={p.id} style={{marginLeft:idx===0?0:-8,border:"2px solid white",borderRadius:"50%"}}>
                                <FaceAvatar photo={p.photo} avatar={p.name[0]} bg="#7E22CE" size={22} radius={11}/>
                              </div>
                            ))}
                          </div>
                          <button onClick={(e)=>{e.stopPropagation(); setDelegationFor(building);}}
                            style={{flex:1,background:"none",border:"none",color:"#7E22CE",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left"}}>
                            Gérer la délégation →
                          </button>
                        </div>
                      ) : (
                        <button onClick={(e)=>{e.stopPropagation(); setDelegationFor(building);}}
                          style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:"#FAF5FF",border:"1px dashed #C4B5FD",borderRadius:9,padding:"7px",cursor:"pointer",color:"#7E22CE",fontSize:11,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>
                          <span style={{fontSize:13}}>🛎️</span>
                          <span>Confier à un {delegationLabel.toLowerCase()}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Occupancy summary */}
        <div style={{margin:"0 16px 24px",background:C.white,borderRadius:16,padding:"16px",boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
          <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:12}}>Taux d'occupation</p>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{flex:1,height:8,borderRadius:4,background:C.border,overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:4,width:`${occupancyPct}%`,background:occupancyPct>=70?"#16A34A":occupancyPct>=40?"#F59E0B":"#EF4444",transition:"width .4s ease"}}/>
            </div>
            <span style={{fontSize:14,fontWeight:800,color:C.black}}>{occupancyPct}%</span>
          </div>
          <div style={{display:"flex",gap:16,marginTop:10}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:4,background:"#16A34A"}}/>
              <span style={{fontSize:11,color:C.mid}}>{availUnits} disponibles</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:4,background:C.coral}}/>
              <span style={{fontSize:11,color:C.mid}}>{occupiedUnits} occupés</span>
            </div>
          </div>
        </div>

        <div style={{height:100}}/>
      </div>

      {/* Delegation sheet */}
      {delegationFor && (
        <DelegationSheet
          building={delegationFor}
          delegatedIds={delegationsMap[delegationFor.id] || []}
          onAdd={(proId) => { delegations.add(delegationFor.id, proId); refreshDelegations(); }}
          onRemove={(proId) => { delegations.remove(delegationFor.id, proId); refreshDelegations(); }}
          onClose={() => setDelegationFor(null)}
        />
      )}
    </div>
  );
}

/* ─── DELEGATION SHEET ─────────────────────────────
   Permet au bailleur de confier un building à un ou plusieurs
   concierges/agents. Many-to-many : un building peut être géré par
   plusieurs pros, et un pro peut gérer plusieurs buildings.
─────────────────────────────────────────────────── */
function DelegationSheet({ building, delegatedIds, onAdd, onRemove, onClose }) {
  const [tab, setTab] = useState("delegated"); // delegated | available
  const [search, setSearch] = useState("");

  /* Catégorie attendue : conciergerie pour hôtel/motel, agent_immo pour immeuble/villa */
  const expectedCat = (building.type === "hotel" || building.type === "motel") ? "conciergerie" : "agent_immo";
  const expectedLabel = expectedCat === "conciergerie" ? "Concierges" : "Agents immobiliers";

  const allPros = userProfiles.allPros();
  const delegatedPros = delegatedIds.map(id => allPros.find(p=>p.id===id)).filter(Boolean);
  const availablePros = allPros.filter(p =>
    !delegatedIds.includes(p.id) &&
    p.available &&
    /* Privilégier la catégorie attendue mais autoriser gestion_loc aussi */
    (p.category === expectedCat || p.category === "gestion_loc")
  );

  const q = search.trim().toLowerCase();
  const filtered = (tab === "delegated" ? delegatedPros : availablePros)
    .filter(p => !q || p.name.toLowerCase().includes(q) || (p.company||"").toLowerCase().includes(q));

  return (
    <>
      <div style={{...S.sheetBackdrop,zIndex:300}} onClick={onClose}/>
      <div style={{...S.sheet,zIndex:301,maxHeight:"92vh",display:"flex",flexDirection:"column"}} className="sheet">
        <div style={S.sheetHandle}/>

        {/* Header */}
        <div style={{padding:"4px 20px 12px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
            <p style={{fontSize:17,fontWeight:700,color:C.black}}>Délégation de gestion</p>
            <button style={S.sheetClose} onClick={onClose}>
              <Icon name="close" size={18} color={C.mid}/>
            </button>
          </div>
          <p style={{fontSize:12,color:C.mid,lineHeight:1.5}}>
            <strong>{building.name}</strong> · {building.address}
          </p>
        </div>

        {/* Info bar */}
        <div style={{margin:"0 20px 12px",background:"#FAF5FF",border:"1px solid #E9D5FF",borderRadius:12,padding:"10px 12px"}}>
          <p style={{fontSize:12,color:"#6B21A8",lineHeight:1.5}}>
            🛎️ Confiez la gestion à un <strong>{expectedCat==="conciergerie" ? "concierge" : "agent immobilier"}</strong>. Plusieurs pros peuvent gérer la même entité — la commission est négociée individuellement.
          </p>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:6,padding:"0 20px",marginBottom:10}}>
          <button onClick={()=>setTab("delegated")}
            style={{flex:1,padding:"9px 10px",borderRadius:10,border:"none",cursor:"pointer",
              background: tab==="delegated" ? "#7E22CE" : C.bg,
              color: tab==="delegated" ? "white" : C.mid,
              fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",
            }}>
            Délégués ({delegatedPros.length})
          </button>
          <button onClick={()=>setTab("available")}
            style={{flex:1,padding:"9px 10px",borderRadius:10,border:"none",cursor:"pointer",
              background: tab==="available" ? "#7E22CE" : C.bg,
              color: tab==="available" ? "white" : C.mid,
              fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",
            }}>
            Disponibles ({availablePros.length})
          </button>
        </div>

        {/* Search */}
        <div style={{padding:"0 20px 10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 12px"}}>
            <svg width="14" height="14" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Rechercher un nom, une société…"
              style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:12,color:C.dark,fontFamily:"'DM Sans',sans-serif"}}/>
          </div>
        </div>

        {/* List */}
        <div style={{flex:1,overflowY:"auto",padding:"0 20px 20px"}}>
          {filtered.length === 0 ? (
            <div style={{padding:"24px 12px",textAlign:"center"}}>
              <p style={{fontSize:13,color:C.mid,fontFamily:"'DM Sans',sans-serif"}}>
                {tab === "delegated"
                  ? "Aucun pro ne gère encore cette entité."
                  : "Aucun pro disponible. Recrutez d'abord depuis la liste des pros."}
              </p>
            </div>
          ) : filtered.map(pro => {
            const cat = PRO_CATEGORIES.find(c=>c.id===pro.category);
            const isDelegated = delegatedIds.includes(pro.id);
            return (
              <div key={pro.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
                <FaceAvatar photo={pro.photo} avatar={pro.name[0]} bg={cat?.color||"#7E22CE"} size={42} radius={21}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <p style={{fontSize:13,fontWeight:600,color:C.black}}>{pro.name}</p>
                    {pro.verified && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#2563EB" stroke="white" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    )}
                  </div>
                  {pro.company && <p style={{fontSize:11,color:C.mid,marginTop:1}}>{pro.company}</p>}
                  <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                    <span style={{fontSize:10,fontWeight:600,padding:"1px 6px",borderRadius:6,background:cat?cat.color+"18":C.bg,color:cat?.color||C.mid}}>
                      {cat?.icon} {cat?.label}
                    </span>
                    {pro.commission && (
                      <span style={{fontSize:10,color:C.coral,fontWeight:600}}>{pro.commission}</span>
                    )}
                  </div>
                </div>
                {isDelegated ? (
                  <button onClick={()=>onRemove(pro.id)} title="Reprendre la gestion de cette entité"
                    style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",cursor:"pointer",color:C.dark,fontSize:11,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>
                    Reprendre
                  </button>
                ) : (
                  <button onClick={()=>onAdd(pro.id)}
                    style={{background:"#7E22CE",border:"none",borderRadius:8,padding:"7px 12px",cursor:"pointer",color:"white",fontSize:11,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>
                    + Confier
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─── BUILDING DETAIL SCREEN (Entité Mère → Filles) ── */
function BuildingDetailScreen({ building, onBack }) {
  const [expandedFloor, setExpandedFloor] = useState(null);

  if (!building) return null;

  const availCount = building.units.filter(u=>u.available).length;
  const totalCount = building.units.length;

  /* Group units by floor */
  const floors = {};
  building.units.forEach(u => {
    const f = u.floor || "RDC";
    if (!floors[f]) floors[f] = [];
    floors[f].push(u);
  });

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Hero image */}
        <div style={{position:"relative",height:200,overflow:"hidden"}}>
          <img src={building.img} alt={building.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.6) 0%,transparent 40%)"}}/>
          <button style={{...S.dBack,background:"rgba(0,0,0,.35)"}} onClick={onBack}>
            <Icon name="back" size={20} color="white" stroke={2.5}/>
          </button>
          <div style={{position:"absolute",bottom:14,left:16,right:16}}>
            <p style={{fontSize:18,fontWeight:800,color:"white"}}>{building.name}</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,.8)",marginTop:2}}>
              <span>{building.address}</span>
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{display:"flex",background:C.white,padding:"12px 16px",gap:0,borderBottom:`1px solid ${C.border}`}}>
          {[
            {val:totalCount, label:"Unités"},
            {val:availCount, label:"Disponibles", color:"#16A34A"},
            {val:totalCount-availCount, label:"Réservés", color:C.coral},
            {val:building.floors, label:"Étages"},
          ].map((s,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,...(i>0?{borderLeft:`1px solid ${C.border}`}:{})}}>
              <span style={{fontSize:16,fontWeight:800,color:s.color||C.black}}>{s.val}</span>
              <span style={{fontSize:9,fontWeight:500,color:C.light,textTransform:"uppercase",letterSpacing:.4}}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Units by floor */}
        <div style={{padding:"16px"}}>
          <p style={{fontSize:15,fontWeight:700,color:C.black,marginBottom:12}}>Unités par étage</p>

          {Object.entries(floors).map(([floor, units]) => {
            const isOpen = expandedFloor === floor;
            const floorAvail = units.filter(u=>u.available).length;
            return (
              <div key={floor} style={{background:C.white,borderRadius:14,marginBottom:8,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}>
                {/* Floor header */}
                <button
                  onClick={()=>setExpandedFloor(isOpen?null:floor)}
                  style={{display:"flex",alignItems:"center",width:"100%",padding:"12px 14px",background:"none",border:"none",cursor:"pointer",gap:10}}
                >
                  <div style={{width:36,height:36,borderRadius:10,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:14,fontWeight:800,color:C.dark}}>{floor.replace("ème","").replace("er","").replace("Entier","E")}</span>
                  </div>
                  <div style={{flex:1,textAlign:"left"}}>
                    <p style={{fontSize:13,fontWeight:600,color:C.black}}>{floor}</p>
                    <p style={{fontSize:11,color:C.light}}>{units.length} unité{units.length>1?"s":""} · {floorAvail} dispo</p>
                  </div>
                  <svg width="14" height="14" fill="none" stroke={C.mid} strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24" style={{transform:isOpen?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Units list */}
                {isOpen && units.map((unit,ui) => (
                  <div key={unit.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderTop:`1px solid ${C.border}`}}>
                    <div style={{width:10,height:10,borderRadius:5,flexShrink:0,background:unit.available?"#16A34A":C.light,...(unit.available?{boxShadow:"0 0 0 3px #16A34A22"}:{})}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <p style={{fontSize:13,fontWeight:600,color:C.black}}>{unit.label}</p>
                        {unit.count && <span style={{fontSize:10,color:C.mid,background:C.bg,padding:"1px 6px",borderRadius:8}}>x{unit.count}</span>}
                      </div>
                      <p style={{fontSize:11,color:C.light,marginTop:1}}>
                        {unit.propType}
                        {!unit.available && unit.availableFrom && ` · Libre le ${unit.availableFrom}`}
                      </p>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      {unit.available ? (
                        <>
                          <p style={{fontSize:13,fontWeight:700,color:C.black}}>{fmt(unit.nightPrice)}</p>
                          <p style={{fontSize:10,color:C.light}}>/nuit</p>
                        </>
                      ) : (
                        <span style={{fontSize:10,fontWeight:600,color:C.light,background:C.bg,padding:"3px 8px",borderRadius:10}}>Réservé</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div style={{height:60}}/>
      </div>
    </div>
  );
}


/* ═══ js/technicians.js ═══ */
/* Byer — Technicians
   Système de gestion des techniciens pour bailleurs et locataires.
   - Bailleur : recruter, valider, remplacer, retirer
   - Locataire : voir profils, appeler
   ═══════════════════════════════════════════════════ */

/* ─── TECHNICIANS LIST SCREEN ────────────────────── */
function TechniciansScreen({ onBack, role }) {
  const [category, setCategory] = useState("all");
  const [selectedTech, setSelectedTech] = useState(null);
  const [assignedIds, setAssignedIds] = useState(OWNER_TECHNICIANS["Ekwalla M."] || []);
  const [confirmRemove, setConfirmRemove] = useState(null);
  /* Profils ajoutés par l'utilisateur (persistés via byerStorage) */
  const [userTechs, setUserTechs] = useState(() => userProfiles.getTechs());
  const [becomeOpen, setBecomeOpen] = useState(false);
  const [becomeSuccess, setBecomeSuccess] = useState(false);

  const isBailleur = role === "bailleur";

  /* Liste combinée : profils utilisateur d'abord, puis catalogue de base */
  const allTechs = [...userTechs, ...TECHNICIANS];
  const filtered = allTechs.filter(t => {
    if (category !== "all" && t.category !== category) return false;
    return true;
  });

  /* Assigned vs available */
  const myTechs     = isBailleur ? filtered.filter(t=>assignedIds.includes(t.id)) : filtered;
  const otherTechs  = isBailleur ? filtered.filter(t=>!assignedIds.includes(t.id)) : [];

  const callPhone = (phone) => {
    window.open("tel:"+phone.replace(/\s/g,""), "_self");
  };

  const addTech = (id) => setAssignedIds(p=>[...p,id]);
  const removeTech = (id) => { setAssignedIds(p=>p.filter(x=>x!==id)); setConfirmRemove(null); };

  const [quoteOpen, setQuoteOpen] = useState(null); // tech | null
  const [quoteSent, setQuoteSent] = useState(null); // techId | null

  if (selectedTech) return (
    <TechProfileScreen
      tech={selectedTech}
      onBack={()=>setSelectedTech(null)}
      isBailleur={isBailleur}
      isAssigned={assignedIds.includes(selectedTech.id)}
      onAssign={()=>addTech(selectedTech.id)}
      onRemove={()=>removeTech(selectedTech.id)}
      onCall={()=>callPhone(selectedTech.phone)}
      onRequestQuote={()=>setQuoteOpen(selectedTech)}
      quoteSent={quoteSent===selectedTech.id}
    />
  );

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Header */}
        <div style={S.rentHeader}>
          <button style={S.dBack2} onClick={onBack}>
            <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
          </button>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>
            {isBailleur ? "Mes Techniciens" : "Techniciens disponibles"}
          </p>
          <div style={{width:38}}/>
        </div>

        {/* Category chips */}
        <div style={{display:"flex",gap:6,padding:"12px 16px",overflowX:"auto"}}>
          <button
            style={{...S.typeChip,...(category==="all"?S.typeChipOn:{})}}
            onClick={()=>setCategory("all")}
          >
            <span style={{fontSize:13}}>👷</span>
            <span style={{...S.typeLabel,...(category==="all"?{color:C.coral}:{})}}>Tous</span>
          </button>
          {TECH_CATEGORIES.map(c=>(
            <button key={c.id}
              style={{...S.typeChip,...(category===c.id?S.typeChipOn:{})}}
              onClick={()=>setCategory(c.id)}
            >
              <span style={{fontSize:13}}>{c.icon}</span>
              <span style={{...S.typeLabel,...(category===c.id?{color:C.coral}:{})}}>
                {c.label}
              </span>
            </button>
          ))}
        </div>

        {/* Become Technician CTA */}
        <div style={{padding:"0 16px 8px"}}>
          <button
            onClick={()=>setBecomeOpen(true)}
            style={{
              width:"100%",display:"flex",alignItems:"center",gap:12,
              background:"linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 100%)",
              border:"1.5px dashed #60A5FA",borderRadius:14,padding:"12px 14px",cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",
            }}
          >
            <div style={{width:38,height:38,borderRadius:19,background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>🛠️</span>
            </div>
            <div style={{flex:1,textAlign:"left"}}>
              <p style={{fontSize:13,fontWeight:700,color:"#1D4ED8"}}>Devenir technicien</p>
              <p style={{fontSize:11,color:"#3B82F6",marginTop:1}}>Inscrivez votre profil pour recevoir des missions</p>
            </div>
            <span style={{fontSize:18,color:"#2563EB",fontWeight:700}}>+</span>
          </button>
        </div>

        {/* My technicians (bailleur) */}
        {isBailleur && myTechs.length>0 && (
          <div style={{padding:"0 16px"}}>
            <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:10}}>Mon équipe ({myTechs.length})</p>
            {myTechs.map(tech => (
              <TechCard
                key={tech.id} tech={tech}
                onTap={()=>setSelectedTech(tech)}
                onCall={()=>callPhone(tech.phone)}
                isBailleur={isBailleur}
                isAssigned={true}
                onRemove={()=>setConfirmRemove(tech.id)}
              />
            ))}
          </div>
        )}

        {/* Available technicians */}
        <div style={{padding:"12px 16px 100px"}}>
          <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:10}}>
            {isBailleur ? "Disponibles à recruter" : `${(isBailleur?otherTechs:myTechs).length} technicien${(isBailleur?otherTechs:myTechs).length>1?"s":""}`}
          </p>
          {(isBailleur ? otherTechs : myTechs).length === 0 ? (
            <EmptyState icon="user" text="Aucun technicien dans cette catégorie."/>
          ) : (
            (isBailleur ? otherTechs : myTechs).map(tech => (
              <TechCard
                key={tech.id} tech={tech}
                onTap={()=>setSelectedTech(tech)}
                onCall={()=>callPhone(tech.phone)}
                isBailleur={isBailleur}
                isAssigned={false}
                onAdd={()=>addTech(tech.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Quote request sheet */}
      {quoteOpen && (
        <QuoteRequestSheet
          tech={quoteOpen}
          onClose={()=>setQuoteOpen(null)}
          onSubmit={()=>{
            setQuoteSent(quoteOpen.id);
            setQuoteOpen(null);
            setTimeout(()=>setQuoteSent(null), 5000);
          }}
        />
      )}

      {/* Become technician sheet */}
      {becomeOpen && (
        <BecomeTechnicianSheet
          onClose={()=>setBecomeOpen(false)}
          onSubmit={(newTech)=>{
            userProfiles.addTech(newTech);
            setUserTechs(userProfiles.getTechs());
            setBecomeOpen(false);
            setBecomeSuccess(true);
            setTimeout(()=>setBecomeSuccess(false), 4000);
          }}
        />
      )}

      {/* Success banner */}
      {becomeSuccess && (
        <div style={{position:"fixed",top:60,left:16,right:16,background:"#16A34A",color:"white",padding:"12px 14px",borderRadius:14,boxShadow:"0 4px 16px rgba(0,0,0,.18)",zIndex:400,display:"flex",alignItems:"center",gap:10,fontFamily:"'DM Sans',sans-serif"}}>
          <span style={{fontSize:18}}>✅</span>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:700}}>Profil créé !</p>
            <p style={{fontSize:11,opacity:.9,marginTop:1}}>Vous êtes désormais visible dans la liste.</p>
          </div>
        </div>
      )}

      {/* Confirm remove dialog */}
      {confirmRemove && (
        <>
          <div style={S.sheetBackdrop} onClick={()=>setConfirmRemove(null)}/>
          <div style={{...S.sheet,padding:"24px",zIndex:201}} className="sheet">
            <div style={S.sheetHandle}/>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"16px 0"}}>
              <div style={{width:56,height:56,borderRadius:28,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:24}}>👋</span>
              </div>
              <p style={{fontSize:16,fontWeight:700,color:C.black,textAlign:"center"}}>Mettre fin à la collaboration ?</p>
              <p style={{fontSize:13,color:C.mid,textAlign:"center",lineHeight:1.6}}>
                Ce technicien ne sera plus visible dans votre équipe. Vous pourrez l'inviter à nouveau plus tard.
              </p>
              <button onClick={()=>removeTech(confirmRemove)} style={{...S.payBtn,background:C.dark,marginTop:8}}>
                Mettre fin à la collaboration
              </button>
              <button onClick={()=>setConfirmRemove(null)} style={{...S.reminderBtn,marginTop:0}}>
                Annuler
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── TECH CARD ──────────────────────────────────── */
function TechCard({ tech, onTap, onCall, isBailleur, isAssigned, onAdd, onRemove }) {
  const cat = TECH_CATEGORIES.find(c=>c.id===tech.category);
  return (
    <div style={{background:C.white,borderRadius:16,padding:"14px",marginBottom:10,boxShadow:"0 1px 8px rgba(0,0,0,.05)",cursor:"pointer"}} onClick={onTap}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{position:"relative"}}>
          <FaceAvatar photo={tech.photo} avatar={tech.name[0]} bg={cat?.color||C.mid} size={48} radius={24}/>
          {tech.available && (
            <div style={{position:"absolute",bottom:0,right:0,width:14,height:14,borderRadius:7,background:"#16A34A",border:"2px solid white"}}/>
          )}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <p style={{fontSize:14,fontWeight:600,color:C.black}}>{tech.name}</p>
            {tech.verified && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#2563EB" stroke="white" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
            <span style={{fontSize:11,fontWeight:600,padding:"2px 7px",borderRadius:8,background:cat?cat.color+"18":C.bg,color:cat?.color||C.mid}}>
              {cat?.icon} {cat?.label}
            </span>
            <span style={{fontSize:11,color:C.light}}>{tech.city}</span>
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:3}}>
            <Icon name="star" size={12} color={C.coral}/>
            <span style={{fontSize:13,fontWeight:700,color:C.dark}}>{tech.rating}</span>
          </div>
          <p style={{fontSize:10,color:C.light}}>{tech.jobs} jobs</p>
        </div>
      </div>

      {/* Action row */}
      <div style={{display:"flex",gap:8,marginTop:10}} onClick={e=>e.stopPropagation()}>
        <button onClick={onCall} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px",borderRadius:10,background:"#F0FDF4",border:"1.5px solid #BBF7D0",cursor:"pointer"}}>
          <span style={{fontSize:12}}>📞</span>
          <span style={{fontSize:12,fontWeight:600,color:"#16A34A"}}>Appeler</span>
        </button>
        {isBailleur && !isAssigned && onAdd && (
          <button onClick={onAdd} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px",borderRadius:10,background:C.coral,border:"none",cursor:"pointer"}}>
            <span style={{fontSize:12,color:"white",fontWeight:600}}>+ Recruter</span>
          </button>
        )}
        {isBailleur && isAssigned && onRemove && (
          <button onClick={onRemove} title="Mettre fin à la collaboration" style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"9px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.bg,cursor:"pointer"}}>
            <Icon name="close" size={14} color={C.mid} stroke={2}/>
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── TECH PROFILE SCREEN ────────────────────────── */
function TechProfileScreen({ tech, onBack, isBailleur, isAssigned, onAssign, onRemove, onCall, onRequestQuote, quoteSent }) {
  const cat = TECH_CATEGORIES.find(c=>c.id===tech.category);
  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Hero */}
        <div style={{position:"relative",height:180,background:cat?.color||C.mid}}>
          <div style={{position:"absolute",inset:0,opacity:.12,background:"repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)",backgroundSize:"20px 20px"}}/>
          <button style={{...S.dBack,background:"rgba(0,0,0,.25)"}} onClick={onBack}>
            <Icon name="back" size={20} color="white" stroke={2.5}/>
          </button>
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 20px 16px",display:"flex",alignItems:"flex-end",gap:14}}>
            <div style={{width:72,height:72,borderRadius:36,border:"3px solid white",overflow:"hidden",boxShadow:"0 4px 16px rgba(0,0,0,.2)"}}>
              <FaceAvatar photo={tech.photo} avatar={tech.name[0]} bg={cat?.color||C.mid} size={72} radius={36}/>
            </div>
            <div style={{paddingBottom:4}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <p style={{fontSize:18,fontWeight:800,color:"white"}}>{tech.name}</p>
                {tech.verified && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke={cat?.color} strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                )}
              </div>
              <p style={{fontSize:12,color:"rgba(255,255,255,.8)"}}>{cat?.icon} {cat?.label} · {tech.city}</p>
            </div>
          </div>
        </div>

        <div style={{padding:"16px"}}>
          {/* Stats */}
          <div style={{display:"flex",background:C.bg,borderRadius:14,padding:"14px",gap:0,marginBottom:16}}>
            {[
              {val:tech.rating, label:"Note"},
              {val:tech.jobs,   label:"Missions"},
              {val:tech.available?"Oui":"Non", label:"Disponible", color:tech.available?"#16A34A":"#EF4444"},
            ].map((s,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,...(i>0?{borderLeft:`1px solid ${C.border}`}:{})}}>
                <span style={{fontSize:18,fontWeight:800,color:s.color||C.black}}>{s.val}</span>
                <span style={{fontSize:9,fontWeight:500,color:C.light,textTransform:"uppercase",letterSpacing:.4}}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* About */}
          <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:8}}>A propos</p>
          <p style={{fontSize:13,color:C.mid,lineHeight:1.7,marginBottom:16}}>{tech.about}</p>

          {/* Phone */}
          <div style={{background:C.white,borderRadius:14,padding:"14px",border:`1.5px solid ${C.border}`,marginBottom:16}}>
            <p style={{fontSize:12,fontWeight:600,color:C.light,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Téléphone</p>
            <p style={{fontSize:16,fontWeight:700,color:C.black,letterSpacing:.5}}>{tech.phone}</p>
          </div>

          {/* Action buttons */}
          <div style={{display:"flex",gap:10,marginBottom:10}}>
            <button onClick={onCall} style={{flex:1,...S.payBtn,background:"#16A34A"}}>
              📞 Appeler
            </button>
          </div>

          {/* Demander un devis : action principale pour locataires */}
          {!isBailleur && (
            <button
              onClick={onRequestQuote}
              style={{
                ...S.payBtn,
                background: quoteSent ? "#16A34A" : C.coral,
                marginBottom:16,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8,
              }}
            >
              {quoteSent ? (
                <>
                  <Icon name="check" size={16} color="white" stroke={2.5}/>
                  <span>Devis envoyé · réponse sous 24h</span>
                </>
              ) : (
                <>
                  <span style={{fontSize:14}}>📝</span>
                  <span>Demander un devis gratuit</span>
                </>
              )}
            </button>
          )}

          {/* Bailleur actions */}
          {isBailleur && (
            isAssigned ? (
              <button onClick={onRemove} style={{...S.payBtn,background:C.dark,marginBottom:16}}>
                Mettre fin à la collaboration
              </button>
            ) : (
              <button onClick={onAssign} style={{...S.payBtn,marginBottom:16}}>
                + Recruter ce technicien
              </button>
            )
          )}
        </div>

        <div style={{height:60}}/>
      </div>
    </div>
  );
}

/* ─── QUOTE REQUEST SHEET ────────────────────────── */
function QuoteRequestSheet({ tech, onClose, onSubmit }) {
  const cat = TECH_CATEGORIES.find(c=>c.id===tech.category);
  const [step, setStep]       = useState(1); // 1=form, 2=success
  const [problem, setProblem] = useState("");
  const [urgency, setUrgency] = useState("normale"); // urgente | normale | flexible
  const [address, setAddress] = useState("");
  const [phone, setPhone]     = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = problem.trim().length >= 10 && address.trim() && phone.trim().length >= 8;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(2);
    }, 1100);
  };

  const handleClose = () => {
    if (step === 2) onSubmit?.();
    else onClose?.();
  };

  return (
    <>
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:300}} onClick={handleClose}/>
      <div style={{
        position:"fixed",bottom:0,left:0,right:0,
        background:C.white,borderRadius:"20px 20px 0 0",
        padding:"16px 0 24px",zIndex:301,maxHeight:"90vh",
        display:"flex",flexDirection:"column",
        fontFamily:"'DM Sans',sans-serif",
      }}>
        <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 12px"}}/>

        {step === 1 ? (
          <>
            {/* Header */}
            <div style={{padding:"0 16px 12px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                <p style={{fontSize:17,fontWeight:700,color:C.black}}>Demande de devis</p>
                <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.mid,lineHeight:1,padding:0}}>×</button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:C.bg,borderRadius:12,marginTop:6}}>
                <FaceAvatar photo={tech.photo} avatar={tech.name[0]} bg={cat?.color||C.mid} size={36} radius={18}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,fontWeight:600,color:C.black}}>{tech.name}</p>
                  <p style={{fontSize:11,color:C.light}}>{cat?.icon} {cat?.label} · {tech.city}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{flex:1,overflowY:"auto",padding:"4px 16px 8px"}}>

              {/* Problem description */}
              <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
                Décrivez votre besoin <span style={{color:C.coral}}>*</span>
              </label>
              <textarea
                rows={4}
                value={problem}
                onChange={e=>setProblem(e.target.value)}
                placeholder={`Ex : Fuite sous évier cuisine, robinet qui goutte depuis 2 jours...`}
                maxLength={500}
                style={{
                  width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,
                  padding:"10px 12px",fontSize:13,color:C.dark,
                  fontFamily:"'DM Sans',sans-serif",resize:"vertical",outline:"none",
                  background:C.white,marginBottom:4,
                }}
              />
              <p style={{fontSize:10,color:C.light,textAlign:"right",marginBottom:14}}>
                {problem.length}/500 — minimum 10 caractères
              </p>

              {/* Urgency */}
              <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>Urgence</label>
              <div style={{display:"flex",gap:6,marginBottom:14}}>
                {[
                  {id:"urgente",  label:"Urgent",   color:"#DC2626"},
                  {id:"normale",  label:"Sous 48h", color:"#F59E0B"},
                  {id:"flexible", label:"Flexible", color:"#16A34A"},
                ].map(u => (
                  <button
                    key={u.id}
                    onClick={()=>setUrgency(u.id)}
                    style={{
                      flex:1,padding:"9px 6px",borderRadius:10,
                      border: urgency === u.id ? `1.5px solid ${u.color}` : `1.5px solid ${C.border}`,
                      background: urgency === u.id ? u.color+"15" : C.white,
                      color: urgency === u.id ? u.color : C.mid,
                      fontSize:12,fontWeight:600,cursor:"pointer",
                      fontFamily:"'DM Sans',sans-serif",
                    }}
                  >{u.label}</button>
                ))}
              </div>

              {/* Address + Phone */}
              <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
                Adresse de l'intervention <span style={{color:C.coral}}>*</span>
              </label>
              <input
                value={address}
                onChange={e=>setAddress(e.target.value)}
                placeholder="Ex : Bonamoussadi, Rue 1.234, Douala"
                style={{
                  width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,
                  padding:"10px 12px",fontSize:13,color:C.dark,
                  fontFamily:"'DM Sans',sans-serif",outline:"none",
                  background:C.white,marginBottom:14,boxSizing:"border-box",
                }}
              />

              <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
                Téléphone de contact <span style={{color:C.coral}}>*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e=>setPhone(e.target.value.replace(/[^\d\s+]/g,""))}
                placeholder="+237 6XX XX XX XX"
                style={{
                  width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,
                  padding:"10px 12px",fontSize:13,color:C.dark,
                  fontFamily:"'DM Sans',sans-serif",outline:"none",
                  background:C.white,marginBottom:14,boxSizing:"border-box",
                }}
              />

              {/* Photos (placeholder count) */}
              <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
                Photos du problème <span style={{color:C.light,fontWeight:400}}>(optionnel)</span>
              </label>
              <button
                onClick={() => setPhotoCount(c => Math.min(5, c + 1))}
                style={{
                  width:"100%",padding:"12px",borderRadius:12,
                  border:`1.5px dashed ${C.border}`,background:C.bg,
                  cursor:"pointer",fontSize:12,color:C.mid,fontWeight:600,
                  fontFamily:"'DM Sans',sans-serif",marginBottom:14,
                }}
              >
                {photoCount === 0 ? "📷 Ajouter une photo" : `📷 ${photoCount} photo(s) ajoutée(s) · cliquer pour +`}
              </button>

              {/* Info box */}
              <div style={{background:"#EFF6FF",borderRadius:10,padding:"10px 12px",marginBottom:14,border:`1px solid #DBEAFE`}}>
                <p style={{fontSize:11,color:"#1E40AF",lineHeight:1.5}}>
                  ℹ️ Le technicien recevra votre demande et vous répondra avec un devis sous 24h. <strong>Service gratuit, sans engagement.</strong>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div style={{padding:"4px 16px 0",borderTop:`1px solid ${C.border}`,paddingTop:12}}>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                style={{
                  ...S.payBtn,
                  background: canSubmit ? C.coral : C.border,
                  color: canSubmit ? C.white : C.light,
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}
              >
                {submitting ? "Envoi..." : "Envoyer la demande"}
              </button>
            </div>
          </>
        ) : (
          /* SUCCESS STEP */
          <div style={{padding:"24px 24px 8px",textAlign:"center"}}>
            <div style={{
              width:72,height:72,borderRadius:36,
              background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center",
              margin:"0 auto 14px",
            }}>
              <Icon name="check" size={36} color="#16A34A" stroke={2.5}/>
            </div>
            <p style={{fontSize:18,fontWeight:800,color:C.black,marginBottom:6}}>Demande envoyée !</p>
            <p style={{fontSize:13,color:C.mid,lineHeight:1.6,marginBottom:18}}>
              <strong>{tech.name}</strong> a reçu votre demande de devis.<br/>
              Vous recevrez une réponse par message sous 24h maximum.
            </p>
            <button
              onClick={handleClose}
              style={{...S.payBtn,marginBottom:0}}
            >Parfait</button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── BECOME TECHNICIAN SHEET ────────────────────── */
function BecomeTechnicianSheet({ onClose, onSubmit }) {
  const [name, setName]     = useState("");
  const [category, setCategory] = useState(TECH_CATEGORIES[0].id);
  const [city, setCity]     = useState("Douala");
  const [zone, setZone]     = useState("");
  const [phone, setPhone]   = useState("");
  const [about, setAbout]   = useState("");

  const canSubmit = name.trim().length >= 3
                 && phone.trim().length >= 8
                 && zone.trim().length >= 2
                 && about.trim().length >= 20;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const newTech = {
      id: "UT" + Date.now(),
      name: name.trim(),
      category,
      phone: phone.trim(),
      rating: 0,
      jobs: 0,
      photo: `https://i.pravatar.cc/100?u=${encodeURIComponent(name.trim())}`,
      city,
      zone: zone.trim(),
      available: true,
      verified: false,
      about: about.trim(),
      isUserCreated: true,
    };
    onSubmit?.(newTech);
  };

  return (
    <>
      <div style={S.sheetBackdrop} onClick={onClose}/>
      <div style={{...S.sheet,padding:"20px",maxHeight:"90vh",overflowY:"auto",zIndex:201}} className="sheet">
        <div style={S.sheetHandle}/>

        <div style={{marginBottom:14}}>
          <p style={{fontSize:18,fontWeight:800,color:C.black}}>Devenir technicien</p>
          <p style={{fontSize:12,color:C.mid,marginTop:4,lineHeight:1.55}}>
            Inscrivez votre profil pour être contacté par des bailleurs et locataires.
          </p>
        </div>

        {/* Name */}
        <div style={{marginBottom:12}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
            Nom complet <span style={{color:C.coral}}>*</span>
          </label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex : Mbarga Jean"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,outline:"none",fontFamily:"'DM Sans',sans-serif",background:C.white,boxSizing:"border-box"}}/>
        </div>

        {/* Category */}
        <div style={{marginBottom:12}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
            Spécialité <span style={{color:C.coral}}>*</span>
          </label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {TECH_CATEGORIES.map(c=>(
              <button key={c.id} onClick={()=>setCategory(c.id)}
                style={{
                  padding:"7px 12px",borderRadius:10,cursor:"pointer",
                  border: category===c.id?`1.5px solid ${C.coral}`:`1.5px solid ${C.border}`,
                  background: category===c.id?"#FFF5F5":C.white,
                  fontSize:12,fontWeight:600,color: category===c.id?C.coral:C.mid,
                  fontFamily:"'DM Sans',sans-serif",
                }}
              >{c.icon} {c.label}</button>
            ))}
          </div>
        </div>

        {/* City + Zone */}
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <div style={{flex:1}}>
            <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
              Ville <span style={{color:C.coral}}>*</span>
            </label>
            <select value={city} onChange={e=>setCity(e.target.value)}
              style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,background:C.white,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",boxSizing:"border-box"}}
            >
              {LOCATIONS.slice(1).map(l=>(<option key={l.id} value={l.id}>{l.label}</option>))}
            </select>
          </div>
          <div style={{flex:1}}>
            <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
              Zone <span style={{color:C.coral}}>*</span>
            </label>
            <input value={zone} onChange={e=>setZone(e.target.value)} placeholder="Ex : Bonamoussadi"
              style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,outline:"none",fontFamily:"'DM Sans',sans-serif",background:C.white,boxSizing:"border-box"}}/>
          </div>
        </div>

        {/* Phone */}
        <div style={{marginBottom:12}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
            Téléphone <span style={{color:C.coral}}>*</span>
          </label>
          <input type="tel" value={phone} onChange={e=>setPhone(e.target.value.replace(/[^\d\s+]/g,""))} placeholder="+237 6XX XX XX XX"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,outline:"none",fontFamily:"'DM Sans',sans-serif",background:C.white,boxSizing:"border-box"}}/>
        </div>

        {/* About */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
            À propos / Expérience <span style={{color:C.coral}}>*</span>
          </label>
          <textarea value={about} onChange={e=>setAbout(e.target.value)} rows={3}
            placeholder="Décrivez votre expérience, vos spécialités, vos disponibilités…"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,outline:"none",fontFamily:"'DM Sans',sans-serif",background:C.white,resize:"none",lineHeight:1.5,boxSizing:"border-box"}}/>
          <p style={{fontSize:10,color:C.light,marginTop:3}}>{about.length} caractères · 20 minimum</p>
        </div>

        {/* Info */}
        <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 12px",marginBottom:14}}>
          <p style={{fontSize:11,color:"#A16207",lineHeight:1.5}}>
            ℹ️ Votre profil apparaîtra avec un badge <strong>"Non vérifié"</strong> jusqu'à validation par notre équipe (24-48h).
          </p>
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose}
            style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${C.border}`,background:C.white,cursor:"pointer",fontSize:13,fontWeight:600,color:C.dark}}
          >Annuler</button>
          <button onClick={canSubmit?handleSubmit:undefined} disabled={!canSubmit}
            style={{flex:1,padding:"12px",borderRadius:12,background:canSubmit?C.coral:C.border,border:"none",cursor:canSubmit?"pointer":"not-allowed",fontSize:13,fontWeight:700,color:"white"}}
          >Créer mon profil</button>
        </div>
      </div>
    </>
  );
}


/* ═══ js/professionals.js ═══ */
/* Byer — Professionals (Concierges & Agents Immobiliers)
   Système de gestion des concierges, agents immobiliers et
   gestionnaires locatifs pour bailleurs et locataires.
   - Bailleur : recruter, valider, retirer
   - Locataire / Voyageur : trouver un concierge, contacter
   ═══════════════════════════════════════════════════ */

/* ─── PROFESSIONALS LIST SCREEN ──────────────────── */
function ProfessionalsScreen({ onBack, role }) {
  const [category, setCategory] = useState("all");
  const [selectedPro, setSelectedPro] = useState(null);
  const [assignedIds, setAssignedIds] = useState(OWNER_PROFESSIONALS["Ekwalla M."] || []);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [contactOpen, setContactOpen] = useState(null); // pro | null
  const [contactSent, setContactSent] = useState(null); // proId | null
  /* Profils ajoutés par l'utilisateur (persistés via byerStorage) */
  const [userPros, setUserPros] = useState(() => userProfiles.getPros());
  const [becomeOpen, setBecomeOpen] = useState(false);
  const [becomeSuccess, setBecomeSuccess] = useState(false);

  const isBailleur = role === "bailleur";

  /* Liste combinée : profils utilisateur d'abord, puis catalogue de base */
  const allPros = [...userPros, ...PROFESSIONALS];
  const filtered = allPros.filter(p => {
    if (category !== "all" && p.category !== category) return false;
    return true;
  });

  /* Mes pros vs disponibles (côté bailleur uniquement) */
  const myPros    = isBailleur ? filtered.filter(p=>assignedIds.includes(p.id)) : filtered;
  const otherPros = isBailleur ? filtered.filter(p=>!assignedIds.includes(p.id)) : [];

  const callPhone = (phone) => {
    window.open("tel:"+phone.replace(/\s/g,""), "_self");
  };

  const addPro = (id) => setAssignedIds(p=>[...p,id]);
  const removePro = (id) => { setAssignedIds(p=>p.filter(x=>x!==id)); setConfirmRemove(null); };

  if (selectedPro) return (
    <ProProfileScreen
      pro={selectedPro}
      onBack={()=>setSelectedPro(null)}
      isBailleur={isBailleur}
      isAssigned={assignedIds.includes(selectedPro.id)}
      onAssign={()=>addPro(selectedPro.id)}
      onRemove={()=>removePro(selectedPro.id)}
      onCall={()=>callPhone(selectedPro.phone)}
      onContact={()=>setContactOpen(selectedPro)}
      contactSent={contactSent===selectedPro.id}
    />
  );

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Header */}
        <div style={S.rentHeader}>
          <button style={S.dBack2} onClick={onBack}>
            <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
          </button>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>
            {isBailleur ? "Mes Pros" : "Concierges & Agents"}
          </p>
          <div style={{width:38}}/>
        </div>

        {/* Subtitle */}
        <div style={{padding:"4px 16px 0"}}>
          <p style={{fontSize:12,color:C.light,lineHeight:1.55}}>
            {isBailleur
              ? "Recrutez des conciergeries, agents immobiliers ou gestionnaires locatifs pour vous accompagner."
              : "Trouvez un service de conciergerie ou un agent immobilier de confiance dans votre ville."}
          </p>
        </div>

        {/* Category chips */}
        <div style={{display:"flex",gap:6,padding:"12px 16px",overflowX:"auto"}}>
          <button
            style={{...S.typeChip,...(category==="all"?S.typeChipOn:{})}}
            onClick={()=>setCategory("all")}
          >
            <span style={{fontSize:13}}>👥</span>
            <span style={{...S.typeLabel,...(category==="all"?{color:C.coral}:{})}}>Tous</span>
          </button>
          {PRO_CATEGORIES.map(c=>(
            <button key={c.id}
              style={{...S.typeChip,...(category===c.id?S.typeChipOn:{})}}
              onClick={()=>setCategory(c.id)}
            >
              <span style={{fontSize:13}}>{c.icon}</span>
              <span style={{...S.typeLabel,...(category===c.id?{color:C.coral}:{})}}>
                {c.label}
              </span>
            </button>
          ))}
        </div>

        {/* Become Pro CTA */}
        <div style={{padding:"0 16px 8px"}}>
          <button
            onClick={()=>setBecomeOpen(true)}
            style={{
              width:"100%",display:"flex",alignItems:"center",gap:12,
              background:"linear-gradient(135deg,#FAF5FF 0%,#F3E8FF 100%)",
              border:"1.5px dashed #A855F7",borderRadius:14,padding:"12px 14px",cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",
            }}
          >
            <div style={{width:38,height:38,borderRadius:19,background:"#7E22CE",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>🛎️</span>
            </div>
            <div style={{flex:1,textAlign:"left"}}>
              <p style={{fontSize:13,fontWeight:700,color:"#7E22CE"}}>Devenir concierge ou agent immo.</p>
              <p style={{fontSize:11,color:"#A855F7",marginTop:1}}>Inscrivez votre activité pour gérer des biens</p>
            </div>
            <span style={{fontSize:18,color:"#7E22CE",fontWeight:700}}>+</span>
          </button>
        </div>

        {/* My pros (bailleur only) */}
        {isBailleur && myPros.length>0 && (
          <div style={{padding:"0 16px"}}>
            <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:10}}>Mon réseau ({myPros.length})</p>
            {myPros.map(pro => (
              <ProCard
                key={pro.id} pro={pro}
                onTap={()=>setSelectedPro(pro)}
                onCall={()=>callPhone(pro.phone)}
                isBailleur={isBailleur}
                isAssigned={true}
                onRemove={()=>setConfirmRemove(pro.id)}
              />
            ))}
          </div>
        )}

        {/* Available pros */}
        <div style={{padding:"12px 16px 100px"}}>
          <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:10}}>
            {isBailleur
              ? "Disponibles à recruter"
              : `${myPros.length} professionnel${myPros.length>1?"s":""}`}
          </p>
          {(isBailleur ? otherPros : myPros).length === 0 ? (
            <EmptyState icon="user" text="Aucun professionnel dans cette catégorie."/>
          ) : (
            (isBailleur ? otherPros : myPros).map(pro => (
              <ProCard
                key={pro.id} pro={pro}
                onTap={()=>setSelectedPro(pro)}
                onCall={()=>callPhone(pro.phone)}
                isBailleur={isBailleur}
                isAssigned={false}
                onAdd={()=>addPro(pro.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Contact request sheet */}
      {contactOpen && (
        <ContactRequestSheet
          pro={contactOpen}
          onClose={()=>setContactOpen(null)}
          onSubmit={()=>{
            setContactSent(contactOpen.id);
            setContactOpen(null);
            setTimeout(()=>setContactSent(null), 5000);
          }}
        />
      )}

      {/* Become pro sheet */}
      {becomeOpen && (
        <BecomeProSheet
          onClose={()=>setBecomeOpen(false)}
          onSubmit={(newPro)=>{
            userProfiles.addPro(newPro);
            setUserPros(userProfiles.getPros());
            setBecomeOpen(false);
            setBecomeSuccess(true);
            setTimeout(()=>setBecomeSuccess(false), 4000);
          }}
        />
      )}

      {/* Success banner */}
      {becomeSuccess && (
        <div style={{position:"fixed",top:60,left:16,right:16,background:"#16A34A",color:"white",padding:"12px 14px",borderRadius:14,boxShadow:"0 4px 16px rgba(0,0,0,.18)",zIndex:400,display:"flex",alignItems:"center",gap:10,fontFamily:"'DM Sans',sans-serif"}}>
          <span style={{fontSize:18}}>✅</span>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:700}}>Profil créé !</p>
            <p style={{fontSize:11,opacity:.9,marginTop:1}}>Vous êtes désormais visible et vous pouvez recevoir des biens à gérer.</p>
          </div>
        </div>
      )}

      {/* Confirm remove dialog */}
      {confirmRemove && (
        <>
          <div style={S.sheetBackdrop} onClick={()=>setConfirmRemove(null)}/>
          <div style={{...S.sheet,padding:"24px",zIndex:201}} className="sheet">
            <div style={S.sheetHandle}/>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"16px 0"}}>
              <div style={{width:56,height:56,borderRadius:28,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:24}}>👋</span>
              </div>
              <p style={{fontSize:16,fontWeight:700,color:C.black,textAlign:"center"}}>Mettre fin à la collaboration ?</p>
              <p style={{fontSize:13,color:C.mid,textAlign:"center",lineHeight:1.6}}>
                Ce professionnel ne fera plus partie de votre réseau. Vous pourrez l'inviter à nouveau plus tard.
              </p>
              <button onClick={()=>removePro(confirmRemove)} style={{...S.payBtn,background:C.dark,marginTop:8}}>
                Mettre fin à la collaboration
              </button>
              <button onClick={()=>setConfirmRemove(null)} style={{...S.reminderBtn,marginTop:0}}>
                Annuler
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── PRO CARD ───────────────────────────────────── */
function ProCard({ pro, onTap, onCall, isBailleur, isAssigned, onAdd, onRemove }) {
  const cat = PRO_CATEGORIES.find(c=>c.id===pro.category);
  return (
    <div style={{background:C.white,borderRadius:16,padding:"14px",marginBottom:10,boxShadow:"0 1px 8px rgba(0,0,0,.05)",cursor:"pointer"}} onClick={onTap}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{position:"relative"}}>
          <FaceAvatar photo={pro.photo} avatar={pro.name[0]} bg={cat?.color||C.mid} size={48} radius={24}/>
          {pro.available && (
            <div style={{position:"absolute",bottom:0,right:0,width:14,height:14,borderRadius:7,background:"#16A34A",border:"2px solid white"}}/>
          )}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <p style={{fontSize:14,fontWeight:600,color:C.black}}>{pro.name}</p>
            {pro.verified && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#2563EB" stroke="white" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            )}
          </div>
          {pro.company && (
            <p style={{fontSize:11,color:C.mid,marginTop:1,fontWeight:500}}>{pro.company}</p>
          )}
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3,flexWrap:"wrap"}}>
            <span style={{fontSize:11,fontWeight:600,padding:"2px 7px",borderRadius:8,background:cat?cat.color+"18":C.bg,color:cat?.color||C.mid}}>
              {cat?.icon} {cat?.label}
            </span>
            <span style={{fontSize:11,color:C.light}}>{pro.city}</span>
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:3}}>
            <Icon name="star" size={12} color={C.coral}/>
            <span style={{fontSize:13,fontWeight:700,color:C.dark}}>{pro.rating}</span>
          </div>
          <p style={{fontSize:10,color:C.light}}>{pro.jobs} miss.</p>
        </div>
      </div>

      {/* Action row */}
      <div style={{display:"flex",gap:8,marginTop:10}} onClick={e=>e.stopPropagation()}>
        <button onClick={onCall} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px",borderRadius:10,background:"#F0FDF4",border:"1.5px solid #BBF7D0",cursor:"pointer"}}>
          <span style={{fontSize:12}}>📞</span>
          <span style={{fontSize:12,fontWeight:600,color:"#16A34A"}}>Appeler</span>
        </button>
        {isBailleur && !isAssigned && onAdd && (
          <button onClick={onAdd} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px",borderRadius:10,background:C.coral,border:"none",cursor:"pointer"}}>
            <span style={{fontSize:12,color:"white",fontWeight:600}}>+ Recruter</span>
          </button>
        )}
        {isBailleur && isAssigned && onRemove && (
          <button onClick={onRemove} title="Mettre fin à la collaboration" style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"9px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.bg,cursor:"pointer"}}>
            <Icon name="close" size={14} color={C.mid} stroke={2}/>
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── PRO PROFILE SCREEN ─────────────────────────── */
function ProProfileScreen({ pro, onBack, isBailleur, isAssigned, onAssign, onRemove, onCall, onContact, contactSent }) {
  const cat = PRO_CATEGORIES.find(c=>c.id===pro.category);

  /* ── Vue inverse : entités déléguées à ce pro ─────────
     Un pro peut gérer plusieurs immeubles/hôtels/villas,
     chacun appartenant à un bailleur différent.
  ───────────────────────────────────────────────────── */
  const managedIds = delegations.forPro(pro.id);
  const allBuildings = Object.values(OWNERS).flatMap(o =>
    o.buildings.map(b => ({ ...b, ownerName: o.name, ownerCity: o.city }))
  );
  const managedBuildings = allBuildings.filter(b => managedIds.includes(b.id));

  const typeIcons  = { immeuble:"🏢", villa:"🏡", hotel:"🏨", motel:"🛏️" };
  const typeLabels = { immeuble:"Immeuble", villa:"Villa", hotel:"Hôtel", motel:"Motel" };

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto",paddingBottom:120}}>

        {/* Header */}
        <div style={S.rentHeader}>
          <button style={S.dBack2} onClick={onBack}>
            <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
          </button>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Profil</p>
          <div style={{width:38}}/>
        </div>

        {/* Identity card */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 24px 8px"}}>
          <div style={{position:"relative"}}>
            <FaceAvatar photo={pro.photo} avatar={pro.name[0]} bg={cat?.color||C.mid} size={86} radius={43}/>
            {pro.available && (
              <div style={{position:"absolute",bottom:2,right:2,width:18,height:18,borderRadius:9,background:"#16A34A",border:"3px solid white"}}/>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:12}}>
            <p style={{fontSize:18,fontWeight:700,color:C.black}}>{pro.name}</p>
            {pro.verified && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563EB" stroke="white" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            )}
          </div>
          {pro.company && (
            <p style={{fontSize:13,color:C.mid,marginTop:2,fontWeight:500}}>{pro.company}</p>
          )}
          <span style={{fontSize:12,fontWeight:700,padding:"4px 10px",borderRadius:10,background:cat?cat.color+"18":C.bg,color:cat?.color||C.mid,marginTop:8}}>
            {cat?.icon} {cat?.label}
          </span>
          <p style={{fontSize:12,color:C.light,marginTop:8,display:"flex",alignItems:"center",gap:4}}>
            <ByerPin size={12}/> {pro.zone}, {pro.city}
          </p>
        </div>

        {/* Stats row */}
        <div style={{display:"flex",gap:10,padding:"16px",margin:"0 16px",borderRadius:16,background:C.bg}}>
          <div style={{flex:1,textAlign:"center"}}>
            <p style={{fontSize:18,fontWeight:800,color:C.black}}>{pro.rating}</p>
            <p style={{fontSize:10,color:C.mid,textTransform:"uppercase",letterSpacing:.4,fontWeight:600}}>Note</p>
          </div>
          <div style={{width:1,background:C.border}}/>
          <div style={{flex:1,textAlign:"center"}}>
            <p style={{fontSize:18,fontWeight:800,color:C.black}}>{pro.jobs}</p>
            <p style={{fontSize:10,color:C.mid,textTransform:"uppercase",letterSpacing:.4,fontWeight:600}}>Missions</p>
          </div>
          <div style={{width:1,background:C.border}}/>
          <div style={{flex:1,textAlign:"center"}}>
            <p style={{fontSize:18,fontWeight:800,color:C.black}}>{pro.experience}</p>
            <p style={{fontSize:10,color:C.mid,textTransform:"uppercase",letterSpacing:.4,fontWeight:600}}>Exp.</p>
          </div>
        </div>

        {/* About */}
        <div style={{padding:"16px",margin:"16px",borderRadius:16,background:C.white,boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
          <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:8}}>À propos</p>
          <p style={{fontSize:13,color:C.dark,lineHeight:1.7}}>{pro.about}</p>
        </div>

        {/* Entités gérées (vue inverse de la délégation) */}
        {managedBuildings.length > 0 && (
          <div style={{padding:"16px",margin:"0 16px 16px",borderRadius:16,background:C.white,boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <p style={{fontSize:13,fontWeight:700,color:C.black}}>
                Entités gérées <span style={{color:C.mid,fontWeight:600}}>({managedBuildings.length})</span>
              </p>
              <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8,background:"#FAF5FF",color:"#7E22CE",border:"1px solid #E9D5FF"}}>
                PORTEFEUILLE
              </span>
            </div>
            <p style={{fontSize:11,color:C.light,marginBottom:12,lineHeight:1.5}}>
              Biens confiés par {new Set(managedBuildings.map(b=>b.ownerName)).size} bailleur{new Set(managedBuildings.map(b=>b.ownerName)).size>1?"s":""} — preuve de confiance et d'expérience.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {managedBuildings.map(b => {
                const totalUnits = b.units?.length || 0;
                const availUnits = b.units?.filter(u=>u.available).length || 0;
                return (
                  <div key={b.id} style={{display:"flex",gap:10,padding:"10px",borderRadius:12,background:C.bg,border:`1px solid ${C.border}`}}>
                    <img src={b.img} alt={b.name}
                      style={{width:56,height:56,borderRadius:10,objectFit:"cover",flexShrink:0,background:C.border}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                        <span style={{fontSize:12}}>{typeIcons[b.type]||"🏠"}</span>
                        <p style={{fontSize:13,fontWeight:700,color:C.black,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                          {b.name}
                        </p>
                      </div>
                      <p style={{fontSize:10,color:C.mid,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                        {typeLabels[b.type]||b.type} · {b.address}
                      </p>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4,flexWrap:"wrap"}}>
                        <span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:6,background:C.white,color:C.dark,border:`1px solid ${C.border}`}}>
                          {totalUnits} unité{totalUnits>1?"s":""}
                        </span>
                        {availUnits>0 && (
                          <span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:6,background:"#F0FDF4",color:"#16A34A",border:"1px solid #BBF7D0"}}>
                            {availUnits} dispo
                          </span>
                        )}
                        <span style={{fontSize:10,color:C.light}}>
                          Bailleur : <strong style={{color:C.dark}}>{b.ownerName}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Services */}
        {pro.services && pro.services.length > 0 && (
          <div style={{padding:"16px",margin:"0 16px 16px",borderRadius:16,background:C.white,boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
            <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:10}}>Services</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {pro.services.map(s=>(
                <span key={s} style={{fontSize:11,fontWeight:600,padding:"5px 10px",borderRadius:10,background:C.bg,color:C.dark}}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pricing & Languages */}
        <div style={{padding:"16px",margin:"0 16px 16px",borderRadius:16,background:C.white,boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
          <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:10}}>Conditions</p>
          {pro.commission && (
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:12,color:C.mid}}>Commission</span>
              <span style={{fontSize:12,fontWeight:700,color:C.coral}}>{pro.commission}</span>
            </div>
          )}
          {pro.languages && pro.languages.length > 0 && (
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}>
              <span style={{fontSize:12,color:C.mid}}>Langues</span>
              <span style={{fontSize:12,fontWeight:600,color:C.dark}}>{pro.languages.join(", ")}</span>
            </div>
          )}
        </div>

        {/* Status banner */}
        {!pro.available && (
          <div style={{padding:"12px 14px",margin:"0 16px 16px",borderRadius:12,background:"#FEF2F2",border:"1px solid #FEC8C8"}}>
            <p style={{fontSize:12,color:"#B91C1C",fontWeight:600}}>⚠️ Indisponible actuellement — agenda complet.</p>
          </div>
        )}

        {/* Contact sent banner */}
        {contactSent && (
          <div style={{padding:"12px 14px",margin:"0 16px 16px",borderRadius:12,background:"#F0FDF4",border:"1px solid #BBF7D0"}}>
            <p style={{fontSize:12,color:"#16A34A",fontWeight:600}}>✓ Demande envoyée — réponse sous 24-48h.</p>
          </div>
        )}
      </div>

      {/* Sticky action bar */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.white,borderTop:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",gap:8}}>
        <button onClick={onCall} style={{flex:1,padding:"12px",borderRadius:12,background:"#16A34A",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,color:"white",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          📞 Appeler
        </button>
        {isBailleur ? (
          isAssigned ? (
            <button onClick={onRemove} style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${C.border}`,background:C.bg,cursor:"pointer",fontSize:13,fontWeight:600,color:C.dark}}>
              Mettre fin
            </button>
          ) : (
            <button onClick={onAssign} disabled={!pro.available} style={{flex:1,padding:"12px",borderRadius:12,background:pro.available?C.coral:C.border,border:"none",cursor:pro.available?"pointer":"not-allowed",fontSize:13,fontWeight:700,color:"white"}}>
              + Recruter
            </button>
          )
        ) : (
          <button onClick={onContact} disabled={!pro.available || contactSent} style={{flex:1,padding:"12px",borderRadius:12,background:(!pro.available||contactSent)?C.border:C.coral,border:"none",cursor:(!pro.available||contactSent)?"not-allowed":"pointer",fontSize:13,fontWeight:700,color:"white"}}>
            {contactSent ? "Envoyée ✓" : "Contacter"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── CONTACT REQUEST SHEET ──────────────────────── */
function ContactRequestSheet({ pro, onClose, onSubmit }) {
  const [need, setNeed] = useState("");
  const [details, setDetails] = useState("");
  const [city, setCity] = useState(pro.city);

  const cat = PRO_CATEGORIES.find(c=>c.id===pro.category);
  const needsByCat = {
    conciergerie:["Gestion location courte durée","Accueil voyageur","Ménage régulier","Autre"],
    agent_immo:  ["Recherche logement","Mise en location","Vente","Estimation"],
    gestion_loc: ["Gestion complète","Encaissement loyers","États des lieux","Autre"],
  };
  const needs = needsByCat[pro.category] || ["Autre"];

  const canSend = need && details.trim().length >= 10;

  return (
    <>
      <div style={S.sheetBackdrop} onClick={onClose}/>
      <div style={{...S.sheet,padding:"20px",maxHeight:"85vh",overflowY:"auto",zIndex:201}} className="sheet">
        <div style={S.sheetHandle}/>

        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <FaceAvatar photo={pro.photo} avatar={pro.name[0]} bg={cat?.color||C.mid} size={44} radius={22}/>
          <div style={{flex:1}}>
            <p style={{fontSize:15,fontWeight:700,color:C.black}}>Contacter {pro.name.split(" ")[0]}</p>
            <p style={{fontSize:11,color:C.mid}}>{cat?.label} · Réponse sous 24-48h</p>
          </div>
        </div>

        {/* Need type */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>
            Quel est votre besoin ?
          </label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {needs.map(n=>(
              <button key={n}
                onClick={()=>setNeed(n)}
                style={{
                  padding:"7px 12px",borderRadius:10,cursor:"pointer",
                  border: need===n ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                  background: need===n ? "#FFF5F5" : C.white,
                  fontSize:12,fontWeight:600,
                  color: need===n ? C.coral : C.mid,
                  fontFamily:"'DM Sans',sans-serif",
                }}
              >{n}</button>
            ))}
          </div>
        </div>

        {/* City */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>
            Ville concernée
          </label>
          <select value={city} onChange={e=>setCity(e.target.value)}
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,background:C.white,fontFamily:"'DM Sans',sans-serif"}}
          >
            {LOCATIONS.slice(1).map(l=>(
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Details */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>
            Détails (10 caractères min.)
          </label>
          <textarea value={details} onChange={e=>setDetails(e.target.value)}
            rows={4}
            placeholder="Décrivez votre demande, vos contraintes, vos dates…"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,resize:"none",outline:"none",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif",background:C.white}}
          />
          <p style={{fontSize:10,color:C.light,marginTop:3}}>{details.length} caractère{details.length>1?"s":""}</p>
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${C.border}`,background:C.white,cursor:"pointer",fontSize:13,fontWeight:600,color:C.dark}}>
            Annuler
          </button>
          <button onClick={canSend?onSubmit:undefined} disabled={!canSend}
            style={{flex:1,padding:"12px",borderRadius:12,background:canSend?C.coral:C.border,border:"none",cursor:canSend?"pointer":"not-allowed",fontSize:13,fontWeight:700,color:"white"}}
          >
            Envoyer la demande
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── BECOME PRO SHEET ───────────────────────────── */
function BecomeProSheet({ onClose, onSubmit }) {
  const [name, setName]         = useState("");
  const [category, setCategory] = useState(PRO_CATEGORIES[0].id);
  const [company, setCompany]   = useState("");
  const [city, setCity]         = useState(LOCATIONS[1]?.id || "douala");
  const [zone, setZone]         = useState("");
  const [phone, setPhone]       = useState("");
  const [commission, setCommission] = useState("");
  const [experience, setExperience] = useState("1 an");
  const [languages, setLanguages]   = useState(["Français"]);
  const [services, setServices]     = useState([]);
  const [about, setAbout]           = useState("");

  const allLanguages = ["Français","Anglais","Espagnol","Allemand","Arabe","Duala","Bassa","Ewondo","Bamiléké"];
  const servicesByCat = {
    conciergerie: ["Accueil voyageur","Ménage","Check-in/out","Linge & blanchisserie","Photo annonce","Maintenance"],
    agent_immo:   ["Vente","Location","Estimation","Visite virtuelle","Négociation","Gestion administrative"],
    gestion_loc:  ["Loyers","États des lieux","Maintenance","Gestion litiges","Comptabilité","Mandataire"],
  };
  const availServices = servicesByCat[category] || [];

  const toggleLang = (lang) => {
    setLanguages(prev => prev.includes(lang) ? prev.filter(l=>l!==lang) : [...prev, lang]);
  };
  const toggleService = (svc) => {
    setServices(prev => prev.includes(svc) ? prev.filter(s=>s!==svc) : [...prev, svc]);
  };

  const canSubmit = name.trim().length >= 3
    && phone.trim().length >= 8
    && zone.trim().length >= 2
    && about.trim().length >= 20
    && services.length >= 1
    && languages.length >= 1;

  const handleSubmit = () => {
    const cat = PRO_CATEGORIES.find(c=>c.id===category);
    const newPro = {
      id: "UP" + Date.now(),
      name: name.trim(),
      category,
      company: company.trim() || null,
      phone: phone.trim(),
      rating: 0,
      jobs: 0,
      photo: `https://i.pravatar.cc/100?u=${encodeURIComponent(name.trim())}`,
      city,
      zone: zone.trim(),
      available: true,
      verified: false,
      commission: commission.trim() || null,
      experience: experience.trim() || "1 an",
      languages: [...languages],
      services: [...services],
      about: about.trim(),
      isUserCreated: true,
      _color: cat?.color,
    };
    onSubmit?.(newPro);
  };

  return (
    <>
      <div style={{...S.sheetBackdrop,zIndex:300}} onClick={onClose}/>
      <div style={{...S.sheet,zIndex:301,maxHeight:"94vh",display:"flex",flexDirection:"column"}} className="sheet">
        <div style={S.sheetHandle}/>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 20px 12px"}}>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Devenir pro</p>
          <button style={S.sheetClose} onClick={onClose}>
            <Icon name="close" size={18} color={C.mid}/>
          </button>
        </div>

        <div style={{padding:"0 20px 20px",overflowY:"auto",flex:1}}>

          {/* Intro */}
          <div style={{background:"#FAF5FF",border:"1px solid #E9D5FF",borderRadius:14,padding:"12px",marginBottom:14}}>
            <p style={{fontSize:12,color:"#6B21A8",lineHeight:1.6}}>
              <strong>Inscrivez votre activité.</strong> Une fois publié, les bailleurs pourront vous confier leurs biens (immeubles, hôtels…) et les voyageurs vous contacter.
            </p>
          </div>

          {/* Name */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Nom complet *</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex. Jean Mboma"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,marginBottom:12,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>

          {/* Category */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Activité *</label>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
            {PRO_CATEGORIES.map(c => (
              <button key={c.id}
                onClick={()=>{setCategory(c.id); setServices([]);}}
                style={{
                  display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,
                  border: category===c.id ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                  background: category===c.id ? "#FFF5F5" : C.white,
                  cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                }}
              >
                <span style={{fontSize:18}}>{c.icon}</span>
                <span style={{fontSize:13,fontWeight:600,color: category===c.id ? C.coral : C.dark}}>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Company */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Société (facultatif)</label>
          <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Ex. Mboma & Associés"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,marginBottom:12,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>

          {/* City + Zone */}
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <div style={{flex:1}}>
              <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Ville *</label>
              <select value={city} onChange={e=>setCity(e.target.value)}
                style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,background:C.white,fontFamily:"'DM Sans',sans-serif"}}>
                {LOCATIONS.slice(1).map(l=>(
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </div>
            <div style={{flex:1}}>
              <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Quartier *</label>
              <input value={zone} onChange={e=>setZone(e.target.value)} placeholder="Ex. Bonapriso"
                style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
            </div>
          </div>

          {/* Phone */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Téléphone *</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Ex. +237 6 99 12 34 56"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,marginBottom:12,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>

          {/* Commission + Experience */}
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <div style={{flex:1}}>
              <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Commission</label>
              <input value={commission} onChange={e=>setCommission(e.target.value)} placeholder="Ex. 15%"
                style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
            </div>
            <div style={{flex:1}}>
              <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Expérience</label>
              <select value={experience} onChange={e=>setExperience(e.target.value)}
                style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,background:C.white,fontFamily:"'DM Sans',sans-serif"}}>
                {["< 1 an","1 an","2 ans","3 ans","5 ans","7 ans","10+ ans"].map(e=>(
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Services */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Services proposés *</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
            {availServices.map(s => (
              <button key={s} onClick={()=>toggleService(s)}
                style={{
                  padding:"6px 11px",borderRadius:10,cursor:"pointer",
                  border: services.includes(s) ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                  background: services.includes(s) ? "#FFF5F5" : C.white,
                  fontSize:11,fontWeight:600,
                  color: services.includes(s) ? C.coral : C.mid,
                  fontFamily:"'DM Sans',sans-serif",
                }}>{s}</button>
            ))}
          </div>

          {/* Languages */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Langues parlées *</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
            {allLanguages.map(l => (
              <button key={l} onClick={()=>toggleLang(l)}
                style={{
                  padding:"6px 11px",borderRadius:10,cursor:"pointer",
                  border: languages.includes(l) ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                  background: languages.includes(l) ? "#FFF5F5" : C.white,
                  fontSize:11,fontWeight:600,
                  color: languages.includes(l) ? C.coral : C.mid,
                  fontFamily:"'DM Sans',sans-serif",
                }}>{l}</button>
            ))}
          </div>

          {/* About */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>À propos * <span style={{color:C.light,fontWeight:400}}>(20 car. min.)</span></label>
          <textarea value={about} onChange={e=>setAbout(e.target.value)} rows={4}
            placeholder="Présentez votre parcours, vos points forts, votre zone d'intervention…"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,marginBottom:6,outline:"none",resize:"none",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif",background:C.white}}/>
          <p style={{fontSize:10,color:C.light,marginBottom:14}}>{about.length} caractère{about.length>1?"s":""}</p>

          {/* Submit */}
          <button onClick={canSubmit ? handleSubmit : undefined} disabled={!canSubmit}
            style={{width:"100%",padding:"13px",borderRadius:14,background:canSubmit?"#7E22CE":C.border,border:"none",cursor:canSubmit?"pointer":"not-allowed",fontSize:14,fontWeight:700,color:"white",fontFamily:"'DM Sans',sans-serif"}}>
            Publier mon profil
          </button>
          <p style={{fontSize:10,color:C.light,textAlign:"center",marginTop:8,lineHeight:1.5}}>
            Votre profil sera visible aux bailleurs et voyageurs. Vous pourrez le modifier ou le supprimer à tout moment.
          </p>
        </div>
      </div>
    </>
  );
}


/* ═══ js/boost.js ═══ */
/* Byer — Boost Découverte
   Système d'enchères pour mettre en avant les annonces.
   Règles :
   - Enchère de 1 000 à 100 000 FCFA/jour
   - Le dernier à payer reste en tête
   - Au plafond (100 000), chaque paiement surclasse le précédent
   ═══════════════════════════════════════════════════ */

/* ─── BOOST SCREEN ───────────────────────────────── */
function BoostScreen({ onBack }) {
  const [selectedProp, setSelectedProp] = useState(null);
  const [bidAmount, setBidAmount] = useState(BOOST_CONFIG.minBid);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [bids, setBids] = useState(BOOST_BIDS);

  /* Properties owned by current user */
  const owner = OWNERS["Ekwalla M."];
  const myProps = owner ? owner.buildings.flatMap(b=>b.units.filter(u=>u.available).map(u=>({
    id: u.id, title: u.label, building: b.name, nightPrice: u.nightPrice
  }))) : [];

  const activeBids = bids.filter(b=>b.active).sort((a,b)=>b.amount-a.amount);

  const handleBid = () => {
    const newBid = {
      id: "BO"+Date.now(),
      propertyId: selectedProp.id,
      ownerName: "Ekwalla M.",
      amount: bidAmount,
      date: "22 mars 2025",
      active: true,
    };
    setBids(p=>[newBid,...p]);
    setShowConfirm(false);
    setShowSuccess(true);
    setTimeout(()=>setShowSuccess(false), 3000);
  };

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Header */}
        <div style={S.rentHeader}>
          <button style={S.dBack2} onClick={onBack}>
            <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
          </button>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Boost Découverte</p>
          <button onClick={()=>setShowInfo(true)} style={{background:"none",border:"none",cursor:"pointer",padding:6}}>
            <svg width="20" height="20" fill="none" stroke={C.mid} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </button>
        </div>

        {/* Banner */}
        <div style={{margin:"12px 16px",background:"linear-gradient(135deg,#FF5A5F 0%,#FF8A8E 100%)",borderRadius:18,padding:"18px",color:"white"}}>
          <p style={{fontSize:16,fontWeight:800,marginBottom:4}}>🚀 Boostez votre annonce</p>
          <p style={{fontSize:12,opacity:.9,lineHeight:1.6}}>
            Placez une enchère pour que votre bien apparaisse en premier dans les résultats de recherche.
            Le dernier enchérisseur prend la tête !
          </p>
        </div>

        {/* Active boosts ranking */}
        {activeBids.length > 0 && (
          <div style={{padding:"0 16px",marginBottom:16}}>
            <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:10}}>Classement actuel</p>
            {activeBids.map((bid,i)=>{
              const prop = PROPERTIES.find(p=>p.id===bid.propertyId);
              const isMe = bid.ownerName === "Ekwalla M.";
              return (
                <div key={bid.id} style={{display:"flex",alignItems:"center",gap:10,background:isMe?"#FFF5F5":C.white,borderRadius:14,padding:"12px",marginBottom:6,border:isMe?`1.5px solid ${C.coral}22`:`1px solid ${C.border}`}}>
                  <div style={{width:28,height:28,borderRadius:14,background:i===0?C.coral:i===1?"#F59E0B":C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:12,fontWeight:800,color:i<2?"white":C.mid}}>{i+1}</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:13,fontWeight:600,color:C.black}}>{prop?.title||"Annonce #"+bid.propertyId}</p>
                    <p style={{fontSize:11,color:C.light}}>{bid.ownerName} · {bid.date}</p>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <p style={{fontSize:14,fontWeight:800,color:C.coral}}>{fmt(bid.amount)}</p>
                    <p style={{fontSize:9,color:C.light}}>/jour</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create new boost */}
        <div style={{padding:"0 16px 24px"}}>
          <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:10}}>Nouvelle enchère</p>

          {/* Select property */}
          <p style={{fontSize:12,fontWeight:600,color:C.mid,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Choisir une annonce</p>
          <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:16,paddingBottom:4}}>
            {myProps.map(p=>(
              <button key={p.id}
                onClick={()=>setSelectedProp(p)}
                style={{flexShrink:0,padding:"10px 14px",borderRadius:12,border:selectedProp?.id===p.id?`2px solid ${C.coral}`:`1.5px solid ${C.border}`,background:selectedProp?.id===p.id?"#FFF5F5":C.white,cursor:"pointer",textAlign:"left"}}
              >
                <p style={{fontSize:12,fontWeight:600,color:selectedProp?.id===p.id?C.coral:C.dark}}>{p.title}</p>
                <p style={{fontSize:10,color:C.light,marginTop:2}}>{p.building}</p>
              </button>
            ))}
          </div>

          {/* Bid amount */}
          <p style={{fontSize:12,fontWeight:600,color:C.mid,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Montant de l'enchère</p>
          <div style={{background:C.white,borderRadius:16,padding:"16px",border:`1.5px solid ${C.border}`,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:12}}>
              <button
                onClick={()=>setBidAmount(v=>Math.max(BOOST_CONFIG.minBid, v-BOOST_CONFIG.step))}
                style={{width:40,height:40,borderRadius:20,border:`1.5px solid ${C.border}`,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,fontWeight:700,color:C.dark}}
              >−</button>
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:28,fontWeight:800,color:C.coral}}>{bidAmount.toLocaleString("fr-FR")}</p>
                <p style={{fontSize:11,color:C.light}}>FCFA / jour</p>
              </div>
              <button
                onClick={()=>setBidAmount(v=>Math.min(BOOST_CONFIG.maxBid, v+BOOST_CONFIG.step))}
                style={{width:40,height:40,borderRadius:20,border:`1.5px solid ${C.border}`,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,fontWeight:700,color:C.dark}}
              >+</button>
            </div>

            {/* Range slider visual */}
            <div style={{position:"relative",height:6,borderRadius:3,background:C.border,margin:"0 8px"}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",borderRadius:3,background:C.coral,width:`${((bidAmount-BOOST_CONFIG.minBid)/(BOOST_CONFIG.maxBid-BOOST_CONFIG.minBid))*100}%`}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6,padding:"0 4px"}}>
              <span style={{fontSize:10,color:C.light}}>{fmt(BOOST_CONFIG.minBid)}</span>
              <span style={{fontSize:10,color:C.light}}>{fmt(BOOST_CONFIG.maxBid)}</span>
            </div>
          </div>

          {/* Quick amounts */}
          <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
            {[5000,10000,25000,50000,100000].map(amt=>(
              <button key={amt}
                onClick={()=>setBidAmount(amt)}
                style={{padding:"7px 14px",borderRadius:10,border:bidAmount===amt?`1.5px solid ${C.coral}`:`1.5px solid ${C.border}`,background:bidAmount===amt?"#FFF5F5":C.white,cursor:"pointer",fontSize:12,fontWeight:600,color:bidAmount===amt?C.coral:C.mid}}
              >
                {fmt(amt)}
              </button>
            ))}
          </div>

          {/* Submit button */}
          <button
            disabled={!selectedProp}
            onClick={()=>setShowConfirm(true)}
            style={{...S.payBtn,opacity:selectedProp?1:.5,cursor:selectedProp?"pointer":"not-allowed"}}
          >
            🚀 Placer l'enchère · {fmt(bidAmount)}/jour
          </button>
        </div>
      </div>

      {/* Confirm sheet */}
      {showConfirm && (
        <>
          <div style={S.sheetBackdrop} onClick={()=>setShowConfirm(false)}/>
          <div style={{...S.sheet,padding:"24px",zIndex:201}} className="sheet">
            <div style={S.sheetHandle}/>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"12px 0"}}>
              <span style={{fontSize:36}}>🚀</span>
              <p style={{fontSize:16,fontWeight:700,color:C.black}}>Confirmer le boost ?</p>
              <div style={{background:C.bg,borderRadius:12,padding:"12px 16px",width:"100%"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:13,color:C.mid}}>Annonce</span>
                  <span style={{fontSize:13,fontWeight:600,color:C.black}}>{selectedProp?.title}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,color:C.mid}}>Montant</span>
                  <span style={{fontSize:13,fontWeight:700,color:C.coral}}>{fmt(bidAmount)}/jour</span>
                </div>
              </div>
              <p style={{fontSize:11,color:C.mid,textAlign:"center",lineHeight:1.6}}>
                Votre annonce sera affichée en tête de résultats tant que vous restez le dernier enchérisseur.
              </p>
              <button onClick={handleBid} style={{...S.payBtn,marginTop:4}}>
                Confirmer et payer
              </button>
              <button onClick={()=>setShowConfirm(false)} style={S.reminderBtn}>
                Annuler
              </button>
            </div>
          </div>
        </>
      )}

      {/* Success banner */}
      {showSuccess && (
        <div style={{position:"fixed",top:60,left:16,right:16,background:"#16A34A",borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:10,zIndex:300,boxShadow:"0 8px 30px rgba(0,0,0,.2)"}}>
          <Icon name="check" size={20} color="white" stroke={2.5}/>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:"white"}}>Boost activé !</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,.8)"}}>Votre annonce est maintenant en tête.</p>
          </div>
        </div>
      )}

      {/* Info dialog */}
      {showInfo && (
        <>
          <div style={S.sheetBackdrop} onClick={()=>setShowInfo(false)}/>
          <div style={{...S.sheet,padding:"24px",zIndex:201}} className="sheet">
            <div style={S.sheetHandle}/>
            <div style={{padding:"8px 0"}}>
              <p style={{fontSize:18,fontWeight:800,color:C.black,marginBottom:14}}>🚀 Comment fonctionne le Boost ?</p>

              {[
                {icon:"💰", title:"Enchère de 1 000 à 100 000 FCFA/jour", desc:"Choisissez le montant que vous souhaitez investir pour promouvoir votre annonce."},
                {icon:"🏆", title:"Le dernier paye, le premier apparaît", desc:"Le dernier propriétaire à payer prend automatiquement la tête du classement."},
                {icon:"⚡", title:"Au plafond ? Surclassez !", desc:"Si l'enchère est à 100 000 FCFA, chaque nouveau paiement au plafond déplace le précédent leader."},
                {icon:"📊", title:"Visibilité maximale", desc:"Votre annonce apparaît en première position dans les résultats de recherche."},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,marginBottom:14}}>
                  <span style={{fontSize:20,flexShrink:0}}>{item.icon}</span>
                  <div>
                    <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:2}}>{item.title}</p>
                    <p style={{fontSize:12,color:C.mid,lineHeight:1.6}}>{item.desc}</p>
                  </div>
                </div>
              ))}

              <button onClick={()=>setShowInfo(false)} style={{...S.payBtn,marginTop:8}}>
                Compris !
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


/* ═══ js/paywall.js ═══ */
/* Byer — Paywall Location au Mois
   Système de paywall pour les annonces en mode "mois" :
   - Images floutées / verrouillées
   - 3 paliers : 3000F/10 visites, 5000F/20 visites, 10000F/2h illimité + 10 favoris 72h
   - Dialog d'explication du système
   ═══════════════════════════════════════════════════ */

/* ─── PAYWALL GATE ───────────────────────────────── */
function PaywallGate({ item, children, duration, onUnlock }) {
  const [showPaywall, setShowPaywall] = useState(false);

  /* Only gate PROPERTY listings in "month" mode — vehicles ne sont jamais paywallés */
  if (item.type !== "property") return children;
  if (duration !== "month" || !item.monthPrice) return children;

  /* Check if user has active paywall pass */
  const hasAccess = PAYWALL_STATE.active && (
    PAYWALL_STATE.tier === "premium" ||
    PAYWALL_STATE.visitsLeft > 0
  );

  if (hasAccess) return children;

  return (
    <>
      {/* Blurred overlay on the card */}
      <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setShowPaywall(true)}>
        <div style={{filter:"blur(6px)",pointerEvents:"none"}}>
          {children}
        </div>
        {/* Lock overlay */}
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.35)",borderRadius:20}}>
          <div style={{width:56,height:56,borderRadius:28,background:"rgba(255,255,255,.95)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(0,0,0,.2)",marginBottom:10}}>
            <svg width="24" height="24" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <p style={{fontSize:14,fontWeight:700,color:"white",textAlign:"center"}}>Contenu réservé</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,.8)",textAlign:"center",marginTop:2}}>Débloquez pour voir cette annonce</p>
          <button
            onClick={e=>{e.stopPropagation();setShowPaywall(true);}}
            style={{marginTop:10,background:C.coral,color:"white",border:"none",borderRadius:12,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer"}}
          >
            Voir les offres →
          </button>
        </div>
      </div>

      {/* Paywall sheet */}
      {showPaywall && (
        <PaywallSheet onClose={()=>setShowPaywall(false)} onUnlock={onUnlock}/>
      )}
    </>
  );
}

/* ─── PAYWALL SHEET ──────────────────────────────── */
function PaywallSheet({ onClose, onUnlock }) {
  const [selectedTier, setSelectedTier] = useState("standard");
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setPaying(true);
    setTimeout(()=>{
      setPaying(false);
      setSuccess(true);
      const tier = PAYWALL_TIERS.find(t=>t.id===selectedTier);
      /* Update global state (mock) */
      PAYWALL_STATE.active = true;
      PAYWALL_STATE.tier = selectedTier;
      PAYWALL_STATE.visitsLeft = tier.visits || 999;
      setTimeout(()=>{
        onUnlock?.();
        onClose();
      }, 2000);
    }, 2000);
  };

  return (
    <>
      <div style={{...S.sheetBackdrop,zIndex:300}} onClick={onClose}/>
      <div style={{...S.sheet,zIndex:301,maxHeight:"92vh"}} className="sheet">
        <div style={S.sheetHandle}/>

        {success ? (
          <div style={{padding:"32px 24px 48px",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
            <div style={S.successCircle}>
              <Icon name="check" size={32} color="white" stroke={2.5}/>
            </div>
            <p style={{fontSize:18,fontWeight:800,color:C.black}}>Accès débloqué !</p>
            <p style={{fontSize:13,color:C.mid,textAlign:"center",lineHeight:1.6}}>
              Profitez de vos annonces location mensuelle.
            </p>
          </div>
        ) : showPayment ? (
          /* Payment step */
          <div style={{padding:"0 20px 32px",overflowY:"auto"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0 16px"}}>
              <button onClick={()=>setShowPayment(false)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                <Icon name="back" size={18} color={C.dark} stroke={2.5}/>
                <span style={{fontSize:13,fontWeight:600,color:C.dark}}>Retour</span>
              </button>
              <p style={{fontSize:15,fontWeight:700,color:C.black}}>Paiement</p>
              <div style={{width:60}}/>
            </div>

            {/* Summary */}
            <div style={{background:C.bg,borderRadius:14,padding:"14px 16px",marginBottom:16}}>
              {(() => {
                const tier = PAYWALL_TIERS.find(t=>t.id===selectedTier);
                return (
                  <>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:13,color:C.mid}}>Offre</span>
                      <span style={{fontSize:13,fontWeight:600,color:C.black}}>{tier.label}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:13,color:C.mid}}>Montant</span>
                      <span style={{fontSize:16,fontWeight:800,color:C.coral}}>{fmt(tier.price)}</span>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Payment methods */}
            <p style={{fontSize:12,fontWeight:600,color:C.mid,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Mode de paiement</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {PAYMENT_METHODS.slice(0,2).map(m=>(
                <button key={m.id} style={S.methodBtn}>
                  <div style={{...S.methodLogo,background:m.accent}}>
                    <span style={{fontSize:14,fontWeight:800,color:m.textColor}}>{m.short}</span>
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:14,fontWeight:600,color:C.black}}>{m.label}</p>
                    <p style={{fontSize:11,color:C.light}}>{m.sub}</p>
                  </div>
                  <Icon name="chevron" size={16} color={C.light}/>
                </button>
              ))}
            </div>

            <button onClick={handlePay} disabled={paying} style={{...S.payBtn,opacity:paying?.7:1}}>
              {paying ? (
                <div style={S.spinner}/>
              ) : (
                `Payer ${fmt(PAYWALL_TIERS.find(t=>t.id===selectedTier)?.price)}`
              )}
            </button>
          </div>
        ) : (
          /* Tier selection */
          <div style={{padding:"0 20px 32px",overflowY:"auto"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0 12px"}}>
              <p style={{fontSize:17,fontWeight:700,color:C.black}}>Location au mois</p>
              <button style={S.sheetClose} onClick={onClose}>
                <Icon name="close" size={18} color={C.mid}/>
              </button>
            </div>

            {/* Explanation */}
            <div style={{background:"#FFF8F8",border:`1px solid #FFD6D7`,borderRadius:14,padding:"14px",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
                <svg width="16" height="16" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{flexShrink:0,marginTop:1}}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div>
                  <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:4}}>Pourquoi un accès payant ?</p>
                  <p style={{fontSize:12,color:C.mid,lineHeight:1.7}}>
                    Les annonces de location mensuelle sont des biens exclusifs. L'accès payant garantit des locataires sérieux et protège la vie privée des propriétaires.
                  </p>
                </div>
              </div>
            </div>

            {/* Tiers */}
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              {PAYWALL_TIERS.map(tier => {
                const isSelected = selectedTier === tier.id;
                const isPremium = tier.id === "premium";
                return (
                  <button key={tier.id}
                    onClick={()=>setSelectedTier(tier.id)}
                    style={{
                      position:"relative",
                      background:isSelected?"#FFF5F5":C.white,
                      border:isSelected?`2px solid ${C.coral}`:`1.5px solid ${C.border}`,
                      borderRadius:18,padding:"16px",cursor:"pointer",textAlign:"left",
                      transition:"all .18s",overflow:"hidden",
                    }}
                  >
                    {isPremium && (
                      <div style={{position:"absolute",top:0,right:0,background:C.coral,color:"white",fontSize:9,fontWeight:700,padding:"3px 10px",borderRadius:"0 0 0 10px",textTransform:"uppercase",letterSpacing:.5}}>
                        Populaire
                      </div>
                    )}

                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                          <div style={{width:10,height:10,borderRadius:5,border:isSelected?`3px solid ${C.coral}`:`2px solid ${C.border}`,background:isSelected?C.coral:"none"}}/>
                          <p style={{fontSize:15,fontWeight:700,color:C.black}}>{tier.label}</p>
                        </div>
                        <p style={{fontSize:12,color:C.mid,lineHeight:1.6,marginBottom:6}}>{tier.desc}</p>

                        {/* Features */}
                        <div style={{display:"flex",flexDirection:"column",gap:4}}>
                          {tier.visits && (
                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                              <Icon name="check" size={12} color="#16A34A" stroke={2.5}/>
                              <span style={{fontSize:11,color:C.dark}}>{tier.visits} visites d'annonces</span>
                            </div>
                          )}
                          {tier.duration && (
                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                              <Icon name="check" size={12} color="#16A34A" stroke={2.5}/>
                              <span style={{fontSize:11,color:C.dark}}>Accès illimité pendant {tier.duration}</span>
                            </div>
                          )}
                          {tier.favorites > 0 && (
                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                              <Icon name="check" size={12} color="#16A34A" stroke={2.5}/>
                              <span style={{fontSize:11,color:C.dark}}>{tier.favorites} favoris consultables {tier.favDuration}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{textAlign:"right",flexShrink:0}}>
                        <p style={{fontSize:22,fontWeight:800,color:tier.color}}>{tier.price.toLocaleString("fr-FR")}</p>
                        <p style={{fontSize:10,color:C.light}}>FCFA</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <button onClick={()=>setShowPayment(true)} style={S.payBtn}>
              Continuer · {fmt(PAYWALL_TIERS.find(t=>t.id===selectedTier)?.price)}
            </button>
          </div>
        )}
      </div>
    </>
  );
}


/* ═══ js/notifications.js ═══ */
/* Byer — Notifications Screen */

/* ─── MOCK NOTIFICATIONS ──────────────────────── */
const NOTIFICATIONS = [
  {
    id:"N1", type:"booking", read:false,
    title:"Réservation confirmée",
    body:"Votre réservation à l'Appartement Bonamoussadi du 22 au 25 mars est confirmée.",
    time:"Il y a 2h", icon:"check", iconBg:"#F0FDF4", iconColor:"#16A34A",
  },
  {
    id:"N2", type:"rent", read:false,
    title:"Rappel loyer — J-9",
    body:"Votre loyer de 450 000 FCFA pour l'Appart. Bonamoussadi est dû le 31 mars.",
    time:"Il y a 5h", icon:"home", iconBg:"#FFF5F5", iconColor:C.coral,
  },
  {
    id:"N3", type:"message", read:false,
    title:"Nouveau message de Ekwalla M.",
    body:"« Bonjour, tout est prêt pour votre arrivée demain. »",
    time:"Il y a 8h", icon:"message", iconBg:"#EFF6FF", iconColor:"#2563EB",
  },
  {
    id:"N4", type:"boost", read:true,
    title:"Boost expiré",
    body:"Votre enchère de 15 000 FCFA/jour sur Villa Balnéaire Kribi a expiré. Relancez-la pour rester en tête.",
    time:"Hier", icon:"star", iconBg:"#FFF7ED", iconColor:"#EA580C",
  },
  {
    id:"N5", type:"review", read:true,
    title:"Nouvel avis reçu",
    body:"Kofi A. vous a laissé un avis 5★ : « Villa impeccable, propreté irréprochable… »",
    time:"Hier", icon:"star", iconBg:"#FDF4FF", iconColor:"#8B5CF6",
  },
  {
    id:"N6", type:"system", read:true,
    title:"Mise à jour Byer v2.1",
    body:"Nouvelles fonctionnalités : Dashboard bailleur, Techniciens, Boost Découverte. Mettez à jour !",
    time:"Il y a 3j", icon:"gear", iconBg:C.bg, iconColor:C.mid,
  },
  {
    id:"N7", type:"booking", read:true,
    title:"Séjour terminé",
    body:"Votre séjour au Penthouse Bastos est terminé. Laissez un avis pour aider la communauté !",
    time:"Il y a 5j", icon:"trips", iconBg:"#F0FDF4", iconColor:"#16A34A",
  },
  {
    id:"N8", type:"tech", read:true,
    title:"Technicien recruté",
    body:"Njoh Bernard (Plomberie) a été ajouté à votre équipe de techniciens.",
    time:"Il y a 1 sem.", icon:"check", iconBg:"#F0FDF4", iconColor:"#16A34A",
  },
];

/* ─── NOTIFICATIONS SCREEN ─────────────────────── */
function NotificationsScreen({ onBack, onOpenBookings, onOpenMessages, onOpenRent, onOpenBoost, onOpenTechs, onOpenReviews }) {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifs.filter(n => !n.read).length;

  const markRead = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  };

  // Routage vers l'écran approprié selon le type de notification
  const handleNotifClick = (notif) => {
    markRead(notif.id);
    const route = {
      booking: onOpenBookings,
      message: onOpenMessages,
      rent:    onOpenRent,
      boost:   onOpenBoost,
      tech:    onOpenTechs,
      review:  onOpenReviews,
      system:  null, // reste sur la liste
    }[notif.type];
    route?.();
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({...n, read: true})));
  };

  const filters = [
    { id:"all",     label:"Toutes" },
    { id:"booking", label:"Réservations" },
    { id:"rent",    label:"Loyers" },
    { id:"message", label:"Messages" },
    { id:"boost",   label:"Boost" },
  ];

  const filtered = filter === "all"
    ? notifs
    : notifs.filter(n => n.type === filter);

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>

      {/* Header */}
      <div style={S.rentHeader}>
        <button style={S.dBack2} onClick={onBack}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
        </button>
        <p style={{fontSize:17,fontWeight:700,color:C.black}}>Notifications</p>
        {unreadCount > 0 ? (
          <button
            onClick={markAllRead}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,color:C.coral,fontFamily:"'DM Sans',sans-serif"}}
          >
            Tout lire
          </button>
        ) : (
          <div style={{width:38}}/>
        )}
      </div>

      <div style={{flex:1,overflowY:"auto"}}>

        {/* Unread count banner */}
        {unreadCount > 0 && (
          <div style={{margin:"8px 16px",background:"#FFF5F5",border:`1px solid #FFD6D7`,borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:8,height:8,borderRadius:4,background:C.coral,boxShadow:`0 0 0 3px ${C.coral}33`}}/>
            <p style={{fontSize:13,fontWeight:600,color:C.coral}}>
              {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue{unreadCount > 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Filter chips */}
        <div style={{display:"flex",gap:6,padding:"8px 16px",overflowX:"auto"}}>
          {filters.map(f => (
            <button key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                flexShrink:0,padding:"6px 14px",borderRadius:20,border:"none",cursor:"pointer",
                fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
                background: filter === f.id ? C.coral : C.bg,
                color: filter === f.id ? "white" : C.mid,
                transition:"all .18s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div style={{padding:"8px 0 100px"}}>
          {filtered.length === 0 && (
            <EmptyState icon="check" text="Aucune notification dans cette catégorie"/>
          )}

          {filtered.map((notif, i) => (
            <button
              key={notif.id}
              onClick={() => handleNotifClick(notif)}
              style={{
                display:"flex",alignItems:"flex-start",gap:12,
                padding:"14px 16px",width:"100%",textAlign:"left",
                background: notif.read ? "transparent" : "#FFFBFB",
                border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                borderBottom:`1px solid ${C.border}`,
                transition:"background .18s",
              }}
            >
              {/* Icon */}
              <div style={{
                width:40,height:40,borderRadius:12,flexShrink:0,
                background:notif.iconBg,
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>
                <Icon name={notif.icon} size={18} color={notif.iconColor} stroke={2}/>
              </div>

              {/* Content */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:3}}>
                  <p style={{fontSize:13,fontWeight:notif.read ? 500 : 700,color:C.black,lineHeight:1.3}}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <div style={{width:8,height:8,borderRadius:4,background:C.coral,flexShrink:0,marginTop:4}}/>
                  )}
                </div>
                <p style={{fontSize:12,color:C.mid,lineHeight:1.5,marginBottom:4}}>{notif.body}</p>
                <p style={{fontSize:11,color:C.light}}>{notif.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ═══ js/publish.js ═══ */
/* Byer — Publish Listing Screen
   Formulaire pour publier une annonce (logement ou véhicule)
   ═══════════════════════════════════════════════════ */

/* ─── PUBLISH SCREEN ─────────────────────────────── */
function PublishScreen({ onBack, initialSegment }) {
  // Si on arrive avec un segment pré-sélectionné (depuis Dashboard),
  // on saute l'étape 1 (sélection du type) directement à l'étape 2.
  const startStep = initialSegment ? 2 : 1;
  const [step, setStep]     = useState(startStep); // 1=type, 2=infos, 3=prix, 4=photos, 5=confirm
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);

  const [form, setForm] = useState({
    segment:   initialSegment || "property",      // property | vehicle
    propType:  "appartement",   // type de bien
    title:     "",
    city:      "Douala",
    zone:      "",
    beds:      1,
    baths:     1,
    guests:    2,
    amenities: [],
    nightPrice:"",
    monthPrice:"",
    description:"",
    photos:    [],              // tableau de data URLs (base64)
    // Vehicle-specific
    brand:     "",
    seats:     5,
    fuel:      "Essence",
    trans:     "Automatique",
  });

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  /* Compresser une image avant stockage (resize max 1200px, JPEG 0.8) */
  const compressImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else       { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const [uploadError, setUploadError] = useState("");

  const handleFiles = async (fileList) => {
    setUploadError("");
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    const remaining = 10 - form.photos.length;
    if (remaining <= 0) {
      setUploadError("Maximum 10 photos atteint.");
      return;
    }
    const toProcess = files.slice(0, remaining);
    const skipped = files.length - toProcess.length;
    try {
      const compressed = [];
      for (const f of toProcess) {
        if (!f.type.startsWith("image/")) continue;
        if (f.size > 10 * 1024 * 1024) {
          setUploadError(`Photo "${f.name}" trop volumineuse (max 10 Mo).`);
          continue;
        }
        const dataUrl = await compressImage(f);
        compressed.push(dataUrl);
      }
      setForm(p => ({ ...p, photos: [...p.photos, ...compressed] }));
      if (skipped > 0) setUploadError(`${skipped} photo(s) ignorée(s) — limite de 10 atteinte.`);
    } catch (err) {
      setUploadError("Erreur lors du chargement d'une photo. Réessayez.");
    }
  };

  const removePhoto = (idx) => {
    setForm(p => ({ ...p, photos: p.photos.filter((_, i) => i !== idx) }));
    setUploadError("");
  };

  const movePhotoToFirst = (idx) => {
    setForm(p => {
      const arr = [...p.photos];
      const [moved] = arr.splice(idx, 1);
      arr.unshift(moved);
      return { ...p, photos: arr };
    });
  };

  const AMENITY_OPTIONS = [
    "WiFi","Climatisé","Parking","Piscine","Vue mer","Terrasse",
    "Cuisine équipée","Eau chaude","Gardien","Groupe électrogène",
    "Smart TV","Room service","Petit-déj","Jardin","BBQ",
  ];

  const VEHICLE_AMENITIES = [
    "GPS","Climatisé","Bluetooth","4×4","Chauffeur","Wifi embarqué",
    "Siège bébé","Coffre grand","Luxe",
  ];

  const toggleAmenity = (a) => {
    setForm(p => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter(x => x !== a)
        : [...p.amenities, a],
    }));
  };

  /* Convertit un data URL base64 en File pour upload Supabase */
  const dataUrlToFile = async (dataUrl, filename) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
  };

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitting(true);

    const db = window.byer && window.byer.db;

    // Mode offline : on simule l'envoi pour ne pas bloquer la démo
    if (!db || !db.isReady) {
      setTimeout(() => { setSubmitting(false); setSuccess(true); }, 1200);
      return;
    }

    try {
      // 1) Vérifier qu'on a une session active
      const { data: sess } = await db.auth.getSession();
      const user = sess && sess.session && sess.session.user;
      if (!user) {
        setSubmitting(false);
        setSubmitError("Vous devez être connecté pour publier une annonce.");
        return;
      }

      // 2) Construire le payload listings selon le segment
      const isVehicle = form.segment === "vehicle";
      const payload = {
        owner_id:     user.id,
        type:         form.segment,
        subtype:      isVehicle ? null : form.propType,
        title:        (form.title || "").trim() || (isVehicle ? form.brand : "Sans titre"),
        description:  (form.description || "").trim() || null,
        city:         form.city,
        zone:         (form.zone || "").trim() || null,
        price_night:  form.nightPrice ? parseInt(form.nightPrice, 10) : null,
        price_month:  form.monthPrice ? parseInt(form.monthPrice, 10) : null,
        bedrooms:     isVehicle ? null : Number(form.beds)  || null,
        bathrooms:    isVehicle ? null : Number(form.baths) || null,
        max_guests:   isVehicle ? Number(form.seats) : Number(form.guests) || null,
        brand:        isVehicle ? (form.brand || "").trim() || null : null,
        fuel:         isVehicle ? form.fuel : null,
        transmission: isVehicle ? form.trans : null,
        amenities:    Array.isArray(form.amenities) ? form.amenities : [],
        is_active:    true,
      };

      // 3) INSERT listing
      const { data: listing, error: e1 } = await db.listings.create(payload);
      if (e1) {
        setSubmitting(false);
        setSubmitError("Erreur création annonce : " + (e1.message || "inconnue"));
        return;
      }

      // 4) Upload des photos (max 10) en parallèle
      if (form.photos && form.photos.length > 0) {
        const uploads = form.photos.map(async (dataUrl, idx) => {
          try {
            const file = await dataUrlToFile(dataUrl, `photo-${idx + 1}.jpg`);
            const { data: up, error: eu } = await db.storage.uploadPhoto(file, listing.id);
            if (eu || !up) return null;
            // Insert dans listing_photos avec la position
            await db.raw.from("listing_photos").insert({
              listing_id: listing.id,
              url:        up.url,
              position:   idx,
            });
            return up.url;
          } catch (err) {
            console.warn("[byer] upload photo", idx, "failed:", err);
            return null;
          }
        });
        await Promise.all(uploads);
      }

      // 5) Succès → l'annonce est en ligne
      setSubmitting(false);
      setSuccess(true);
    } catch (err) {
      console.error("[byer] publish error:", err);
      setSubmitting(false);
      setSubmitError("Erreur réseau. Vérifiez votre connexion et réessayez.");
    }
  };

  const totalSteps = 5;

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>

      {/* Header */}
      <div style={S.rentHeader}>
        <button style={S.dBack2} onClick={step === startStep ? onBack : () => setStep(s => Math.max(startStep, s - 1))}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
        </button>
        <div style={{flex:1,textAlign:"center"}}>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Publier une annonce</p>
          <p style={{fontSize:12,color:C.light}}>Étape {step} sur {totalSteps}</p>
        </div>
        <div style={{width:38}}/>
      </div>

      {/* Progress bar */}
      <div style={{height:3,background:C.border,margin:"0 16px 8px"}}>
        <div style={{height:"100%",width:`${(step/totalSteps)*100}%`,background:C.coral,borderRadius:2,transition:"width .3s ease"}}/>
      </div>

      {success ? (
        /* Success screen */
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,gap:16}}>
          <div style={S.successCircle}>
            <Icon name="check" size={32} color="white" stroke={2.5}/>
          </div>
          <p style={{fontSize:20,fontWeight:800,color:C.black,textAlign:"center"}}>Annonce publiée !</p>
          <p style={{fontSize:14,color:C.mid,textAlign:"center",lineHeight:1.6}}>
            Votre annonce « {form.title || "Sans titre"} » est en ligne.<br/>
            Les locataires peuvent maintenant la voir et réserver.
          </p>
          <button style={{...S.payBtn,width:"100%",maxWidth:300,marginTop:12}} onClick={onBack}>
            Retour au profil
          </button>
        </div>
      ) : (
        <div style={{flex:1,overflowY:"auto",padding:"12px 16px 100px"}}>

          {/* ── STEP 1 : Type de bien ── */}
          {step === 1 && (
            <div>
              <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Que proposez-vous ?</p>
              <p style={{fontSize:13,color:C.mid,marginBottom:20}}>Choisissez le type de bien que vous souhaitez mettre en location.</p>

              {/* Segment choice */}
              <div style={{display:"flex",gap:10,marginBottom:20}}>
                {[
                  {id:"property", label:"Logement", emoji:"🏠"},
                  {id:"vehicle",  label:"Véhicule", emoji:"🚗"},
                ].map(s => (
                  <button key={s.id}
                    onClick={() => set("segment", s.id)}
                    style={{
                      flex:1,padding:"18px",borderRadius:16,cursor:"pointer",textAlign:"center",
                      border: form.segment === s.id ? `2px solid ${C.coral}` : `1.5px solid ${C.border}`,
                      background: form.segment === s.id ? "#FFF5F5" : C.white,
                      fontFamily:"'DM Sans',sans-serif",
                    }}
                  >
                    <span style={{fontSize:28,display:"block",marginBottom:6}}>{s.emoji}</span>
                    <span style={{fontSize:14,fontWeight:600,color: form.segment === s.id ? C.coral : C.dark}}>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Property type */}
              {form.segment === "property" && (
                <>
                  <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:8}}>Type de logement</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
                    {PROP_TYPES.filter(t => t.id !== "all").map(t => (
                      <button key={t.id}
                        onClick={() => set("propType", t.id)}
                        style={{
                          padding:"8px 14px",borderRadius:12,cursor:"pointer",
                          border: form.propType === t.id ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                          background: form.propType === t.id ? "#FFF5F5" : C.white,
                          fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
                          color: form.propType === t.id ? C.coral : C.mid,
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button style={{...S.payBtn,marginTop:8}} onClick={() => setStep(2)}>
                Continuer →
              </button>
            </div>
          )}

          {/* ── STEP 2 : Informations ── */}
          {step === 2 && (
            <div>
              <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Informations</p>
              <p style={{fontSize:13,color:C.mid,marginBottom:20}}>Décrivez votre {form.segment === "property" ? "logement" : "véhicule"}.</p>

              {/* Title */}
              <div style={{marginBottom:16}}>
                <label style={Os.fieldLabel}>Titre de l'annonce</label>
                <div style={Os.fieldWrap}>
                  <input style={Os.fieldInput}
                    placeholder={form.segment === "property" ? "Ex: Villa Balnéaire Kribi" : "Ex: Toyota Land Cruiser 2022"}
                    value={form.title} onChange={e => set("title", e.target.value)}
                  />
                </div>
              </div>

              {/* City + Zone */}
              <div style={{display:"flex",gap:10,marginBottom:16}}>
                <div style={{flex:1}}>
                  <label style={Os.fieldLabel}>Ville</label>
                  <div style={Os.fieldWrap}>
                    <select style={{...Os.fieldInput,padding:"0",cursor:"pointer"}}
                      value={form.city} onChange={e => set("city", e.target.value)}
                    >
                      {LOCATIONS.slice(1).map(l => (
                        <option key={l.id} value={l.id}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{flex:1}}>
                  <label style={Os.fieldLabel}>Quartier / Zone</label>
                  <div style={Os.fieldWrap}>
                    <input style={Os.fieldInput}
                      placeholder="Ex: Bonamoussadi"
                      value={form.zone} onChange={e => set("zone", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Property-specific fields */}
              {form.segment === "property" && (
                <div style={{display:"flex",gap:10,marginBottom:16}}>
                  {[
                    {k:"beds",   label:"Chambres", min:1, max:10},
                    {k:"baths",  label:"Sdb",      min:1, max:5},
                    {k:"guests", label:"Pers. max", min:1, max:20},
                  ].map(f => (
                    <div key={f.k} style={{flex:1}}>
                      <label style={Os.fieldLabel}>{f.label}</label>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:C.bg,borderRadius:12,padding:"8px"}}>
                        <button
                          onClick={() => set(f.k, Math.max(f.min, form[f.k] - 1))}
                          style={{width:28,height:28,borderRadius:14,border:`1.5px solid ${C.border}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:C.dark}}
                        >−</button>
                        <span style={{fontSize:16,fontWeight:700,color:C.black,minWidth:20,textAlign:"center"}}>{form[f.k]}</span>
                        <button
                          onClick={() => set(f.k, Math.min(f.max, form[f.k] + 1))}
                          style={{width:28,height:28,borderRadius:14,border:`1.5px solid ${C.border}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:C.dark}}
                        >+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Vehicle-specific fields */}
              {form.segment === "vehicle" && (
                <>
                  <div style={{marginBottom:16}}>
                    <label style={Os.fieldLabel}>Marque et modèle</label>
                    <div style={Os.fieldWrap}>
                      <input style={Os.fieldInput}
                        placeholder="Ex: Toyota Land Cruiser 2022"
                        value={form.brand} onChange={e => set("brand", e.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{display:"flex",gap:10,marginBottom:16}}>
                    <div style={{flex:1}}>
                      <label style={Os.fieldLabel}>Places</label>
                      <div style={Os.fieldWrap}>
                        <select style={{...Os.fieldInput,cursor:"pointer"}}
                          value={form.seats} onChange={e => set("seats", parseInt(e.target.value))}
                        >
                          {[2,4,5,7,9,12].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{flex:1}}>
                      <label style={Os.fieldLabel}>Carburant</label>
                      <div style={Os.fieldWrap}>
                        <select style={{...Os.fieldInput,cursor:"pointer"}}
                          value={form.fuel} onChange={e => set("fuel", e.target.value)}
                        >
                          {["Essence","Diesel","Hybride","Électrique"].map(f => <option key={f}>{f}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{flex:1}}>
                      <label style={Os.fieldLabel}>Boîte</label>
                      <div style={Os.fieldWrap}>
                        <select style={{...Os.fieldInput,cursor:"pointer"}}
                          value={form.trans} onChange={e => set("trans", e.target.value)}
                        >
                          {["Automatique","Manuelle"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Description */}
              <div style={{marginBottom:16}}>
                <label style={Os.fieldLabel}>Description</label>
                <textarea
                  style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:14,padding:"12px 14px",fontSize:14,color:C.dark,fontFamily:"'DM Sans',sans-serif",resize:"none",outline:"none",lineHeight:1.6,background:C.white}}
                  rows={3}
                  placeholder="Décrivez votre bien en quelques lignes…"
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                />
              </div>

              <button style={{...S.payBtn,opacity:form.title.trim()?1:.5}} onClick={() => form.title.trim() && setStep(3)}>
                Continuer →
              </button>
            </div>
          )}

          {/* ── STEP 3 : Prix + Équipements ── */}
          {step === 3 && (
            <div>
              <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Prix & équipements</p>
              <p style={{fontSize:13,color:C.mid,marginBottom:20}}>Définissez vos tarifs et sélectionnez les équipements disponibles.</p>

              {/* Prices */}
              <div style={{display:"flex",gap:10,marginBottom:20}}>
                <div style={{flex:1}}>
                  <label style={Os.fieldLabel}>Prix / nuit (FCFA)</label>
                  <div style={Os.fieldWrap}>
                    <input style={Os.fieldInput} type="number"
                      placeholder="35 000"
                      value={form.nightPrice} onChange={e => set("nightPrice", e.target.value)}
                    />
                  </div>
                </div>
                {form.segment === "property" && (
                  <div style={{flex:1}}>
                    <label style={Os.fieldLabel}>Prix / mois (FCFA)</label>
                    <div style={Os.fieldWrap}>
                      <input style={Os.fieldInput} type="number"
                        placeholder="450 000"
                        value={form.monthPrice} onChange={e => set("monthPrice", e.target.value)}
                      />
                    </div>
                    <p style={{fontSize:10,color:C.light,marginTop:3}}>Laisser vide si non disponible au mois</p>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:8}}>
                {form.segment === "property" ? "Équipements" : "Caractéristiques"}
              </p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:24}}>
                {(form.segment === "property" ? AMENITY_OPTIONS : VEHICLE_AMENITIES).map(a => {
                  const on = form.amenities.includes(a);
                  return (
                    <button key={a}
                      onClick={() => toggleAmenity(a)}
                      style={{
                        padding:"7px 13px",borderRadius:20,cursor:"pointer",
                        border: on ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                        background: on ? "#FFF5F5" : C.white,
                        fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
                        color: on ? C.coral : C.mid,
                        display:"flex",alignItems:"center",gap:4,
                      }}
                    >
                      {on && <Icon name="check" size={12} color={C.coral} stroke={2.5}/>}
                      {a}
                    </button>
                  );
                })}
              </div>

              <button style={{...S.payBtn,opacity:form.nightPrice?1:.5}} onClick={() => form.nightPrice && setStep(4)}>
                Continuer →
              </button>
            </div>
          )}

          {/* ── STEP 4 : Photos ── */}
          {step === 4 && (
            <div>
              <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Photos</p>
              <p style={{fontSize:13,color:C.mid,marginBottom:14}}>
                Ajoutez au moins 3 photos pour attirer les locataires. ({form.photos.length}/10)
              </p>

              {/* Hidden file input */}
              <input
                id="byer-photo-input"
                type="file"
                accept="image/*"
                multiple
                style={{display:"none"}}
                onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
              />

              {/* Photo grid: existing photos + add tile */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                {form.photos.map((src, i) => (
                  <div key={i} style={{
                    position:"relative",
                    height:120,borderRadius:16,overflow:"hidden",
                    border: i === 0 ? `2px solid ${C.coral}` : `1.5px solid ${C.border}`,
                    background:C.bg,
                  }}>
                    <img src={src} alt={`Photo ${i+1}`} style={{
                      width:"100%",height:"100%",objectFit:"cover",display:"block",
                    }}/>
                    {i === 0 && (
                      <span style={{
                        position:"absolute",top:6,left:6,
                        background:C.coral,color:C.white,
                        fontSize:10,fontWeight:700,
                        padding:"3px 8px",borderRadius:8,
                        fontFamily:"'DM Sans',sans-serif",
                      }}>Principale</span>
                    )}
                    {i !== 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); movePhotoToFirst(i); }}
                        title="Définir comme principale"
                        style={{
                          position:"absolute",top:6,left:6,
                          background:"rgba(0,0,0,0.6)",color:C.white,
                          fontSize:10,fontWeight:600,
                          padding:"3px 8px",borderRadius:8,
                          border:"none",cursor:"pointer",
                          fontFamily:"'DM Sans',sans-serif",
                        }}
                      >★ Principale</button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                      title="Supprimer"
                      style={{
                        position:"absolute",top:6,right:6,
                        width:26,height:26,borderRadius:13,
                        background:"rgba(0,0,0,0.65)",color:C.white,
                        border:"none",cursor:"pointer",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:14,fontWeight:700,lineHeight:1,
                      }}
                    >×</button>
                  </div>
                ))}

                {/* Add tile (only if < 10 photos) */}
                {form.photos.length < 10 && (
                  <label htmlFor="byer-photo-input" style={{
                    height:120,borderRadius:16,
                    border:`2px dashed ${form.photos.length === 0 ? C.coral : C.border}`,
                    background: form.photos.length === 0 ? "#FFF5F5" : C.bg,
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,
                    cursor:"pointer",
                  }}>
                    <svg width="24" height="24" fill="none" stroke={form.photos.length === 0 ? C.coral : C.mid} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span style={{fontSize:11,fontWeight:600,color: form.photos.length === 0 ? C.coral : C.mid,fontFamily:"'DM Sans',sans-serif"}}>
                      {form.photos.length === 0 ? "Ajouter la 1ʳᵉ photo" : "+ Ajouter"}
                    </span>
                  </label>
                )}
              </div>

              {/* Error message */}
              {uploadError && (
                <div style={{background:"#FEF2F2",border:`1px solid #FEC8C8`,borderRadius:10,padding:"10px 12px",marginBottom:14}}>
                  <p style={{fontSize:12,color:"#B91C1C",fontFamily:"'DM Sans',sans-serif"}}>{uploadError}</p>
                </div>
              )}

              {/* Tip box */}
              <div style={{background:C.bg,borderRadius:12,padding:"12px 14px",marginBottom:20}}>
                <p style={{fontSize:12,color:C.mid,lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>
                  💡 La 1ʳᵉ photo sera utilisée comme image principale. Les images sont automatiquement compressées (max 1200 px, JPEG). Format accepté : JPG, PNG, WebP — max 10 Mo par fichier.
                </p>
              </div>

              <button
                style={{...S.payBtn,opacity: form.photos.length >= 3 ? 1 : .5}}
                onClick={() => form.photos.length >= 3 && setStep(5)}
              >
                {form.photos.length >= 3 ? "Continuer →" : `Ajoutez ${3 - form.photos.length} photo(s) de plus`}
              </button>
            </div>
          )}

          {/* ── STEP 5 : Récapitulatif ── */}
          {step === 5 && (
            <div>
              <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Récapitulatif</p>
              <p style={{fontSize:13,color:C.mid,marginBottom:20}}>Vérifiez les informations avant de publier.</p>

              {/* Photo principale preview */}
              {form.photos.length > 0 && (
                <div style={{borderRadius:16,overflow:"hidden",marginBottom:14,position:"relative",height:170}}>
                  <img src={form.photos[0]} alt="Principale" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  {form.photos.length > 1 && (
                    <span style={{
                      position:"absolute",bottom:8,right:8,
                      background:"rgba(0,0,0,0.65)",color:C.white,
                      fontSize:11,fontWeight:600,
                      padding:"4px 10px",borderRadius:10,
                      fontFamily:"'DM Sans',sans-serif",
                    }}>+{form.photos.length - 1} photos</span>
                  )}
                </div>
              )}

              <div style={{background:C.bg,borderRadius:16,padding:"16px",marginBottom:20}}>
                {[
                  {l:"Type",         v: form.segment === "property" ? (PROP_TYPES.find(t=>t.id===form.propType)?.label || form.propType) : "Véhicule"},
                  {l:"Titre",        v: form.title || "—"},
                  {l:"Ville",        v: form.city},
                  {l:"Quartier",     v: form.zone || "—"},
                  {l:"Prix / nuit",  v: form.nightPrice ? fmt(parseInt(form.nightPrice)) : "—"},
                  ...(form.segment === "property" ? [
                    {l:"Prix / mois",  v: form.monthPrice ? fmt(parseInt(form.monthPrice)) : "Non disponible"},
                    {l:"Chambres",     v: form.beds},
                    {l:"Sdb",          v: form.baths},
                    {l:"Pers. max",    v: form.guests},
                  ] : [
                    {l:"Marque",   v: form.brand || "—"},
                    {l:"Places",   v: form.seats},
                    {l:"Carburant",v: form.fuel},
                    {l:"Boîte",    v: form.trans},
                  ]),
                  {l:"Équipements",  v: form.amenities.length > 0 ? form.amenities.join(", ") : "Aucun"},
                  {l:"Photos",       v: `${form.photos.length} ajoutée(s)`},
                ].map(row => (
                  <div key={row.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                    <span style={{fontSize:13,color:C.mid}}>{row.l}</span>
                    <span style={{fontSize:13,fontWeight:600,color:C.black,textAlign:"right",maxWidth:"60%"}}>{row.v}</span>
                  </div>
                ))}
              </div>

              {submitError && (
                <div style={{
                  background:"#FEF2F2",border:"1px solid #FECACA",
                  color:"#B91C1C",padding:"10px 14px",borderRadius:8,
                  fontSize:13,marginBottom:12,
                }}>
                  {submitError}
                </div>
              )}

              <button
                style={{...S.payBtn,opacity:submitting?.7:1}}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? <div style={Os.spinner}/> : "Publier l'annonce ✓"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


/* ═══ js/settings.js ═══ */
function SettingsScreen({ onBack, onOpenTerms, onOpenPrivacy, onOpenForgotPassword, onOpenSupport, onLogout, onDeleteAccount }) {
  const [pushNotifications, setPushNotifications] = useState(() => byerStorage.get("pushNotifications", true));
  const [darkMode, setDarkMode]                   = useState(() => byerStorage.get("darkMode", false));
  const [offlineDownloads, setOfflineDownloads]   = useState(() => byerStorage.get("offlineDownloads", false));
  const [twoFactorAuth, setTwoFactorAuth]         = useState(() => byerStorage.get("twoFactorAuth", false));
  const [language, setLanguage]                   = useState(() => byerStorage.get("language", "Français"));
  const [currency, setCurrency]                   = useState(() => byerStorage.get("currency", "FCFA"));
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showDevicesSheet, setShowDevicesSheet] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Persistance + side-effect : applique/retire la classe `byer-dark` sur <html>
  React.useEffect(() => {
    byerStorage.set("darkMode", darkMode);
    if (darkMode) document.documentElement.classList.add("byer-dark");
    else document.documentElement.classList.remove("byer-dark");
  }, [darkMode]);
  React.useEffect(() => { byerStorage.set("pushNotifications", pushNotifications); }, [pushNotifications]);
  React.useEffect(() => { byerStorage.set("offlineDownloads", offlineDownloads); }, [offlineDownloads]);
  React.useEffect(() => { byerStorage.set("twoFactorAuth", twoFactorAuth); }, [twoFactorAuth]);
  React.useEffect(() => { byerStorage.set("language", language); }, [language]);
  React.useEffect(() => { byerStorage.set("currency", currency); }, [currency]);

  const showToastMsg = (msg, ms = 2000) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), ms);
  };

  const handleDarkModeToggle = (value) => {
    setDarkMode(value);
    showToastMsg(value ? "Mode sombre activé" : "Mode sombre désactivé");
  };

  const LANGUAGES   = ["Français", "English", "Español"];
  const CURRENCIES  = ["FCFA", "EUR", "USD"];
  const DEVICES = [
    { id:"this", name: navigator.userAgent.includes("Chrome") ? "Chrome (cet appareil)" : "Cet appareil", lastSeen:"En ligne", current:true },
  ];

  const ToggleSwitch = ({ value, onChange }) => (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 46,
        height: 26,
        borderRadius: 13,
        backgroundColor: value ? C.coral : C.border,
        display: "flex",
        alignItems: "center",
        padding: value ? "0 3px 0 0" : "0 0 0 3px",
        cursor: "pointer",
        transition: "background-color 0.2s",
        justifyContent: value ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: C.white,
        }}
      />
    </div>
  );

  const SectionHeader = ({ title }) => (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.6,
        color: C.light,
        padding: "20px 16px 8px",
        fontFamily: "DM Sans",
      }}
    >
      {title}
    </div>
  );

  const RowItem = ({ label, rightElement, onPress }) => (
    <div
      onClick={onPress}
      style={{
        backgroundColor: C.white,
        padding: "14px 16px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: onPress ? "pointer" : "default",
        fontFamily: "DM Sans",
      }}
    >
      <span style={{ color: C.dark, fontSize: 14, fontWeight: 500 }}>
        {label}
      </span>
      {rightElement}
    </div>
  );

  const ChevronElement = () => (
    <Icon name="chevron" size={16} color={C.light} stroke={2} />
  );

  const DisplayValue = ({ value }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: C.light, fontSize: 14 }}>{value}</span>
      <ChevronElement />
    </div>
  );

  const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: C.white,
          borderRadius: 12,
          padding: "24px 16px",
          minWidth: 280,
          textAlign: "center",
          fontFamily: "DM Sans",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: C.dark,
            marginBottom: 12,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 14,
            color: C.mid,
            marginBottom: 24,
            lineHeight: 1.4,
          }}
        >
          {message}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px 16px",
              backgroundColor: C.bg,
              border: "none",
              borderRadius: 6,
              color: C.dark,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "DM Sans",
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px 16px",
              backgroundColor: C.coral,
              border: "none",
              borderRadius: 6,
              color: C.white,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "DM Sans",
            }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );

  const Toast = ({ message }) => (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 16,
        right: 16,
        backgroundColor: C.dark,
        color: C.white,
        padding: "12px 16px",
        borderRadius: 8,
        textAlign: "center",
        fontSize: 14,
        fontFamily: "DM Sans",
        zIndex: 999,
        animation: "fadeIn 0.2s ease-in-out",
      }}
    >
      {message}
    </div>
  );

  return (
    <div style={{ ...S.shell, backgroundColor: C.bg }}>
      {/* Header */}
      <div
        style={{
          ...S.rentHeader,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "var(--top-pad) 16px 12px",
          backgroundColor: C.white,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:8,display:"flex",alignItems:"center"}}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
        </button>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: C.dark,
            fontFamily: "DM Sans",
          }}
        >
          Paramètres
        </div>
      </div>

      {/* Content */}
      <div style={{ ...S.scroll, paddingBottom: 80 }}>
        {/* Préférences Section */}
        <SectionHeader title="Préférences" />
        <RowItem
          label="Langue"
          rightElement={<DisplayValue value={language} />}
          onPress={() => setShowLanguagePicker(true)}
        />
        <RowItem
          label="Notifications push"
          rightElement={
            <ToggleSwitch
              value={pushNotifications}
              onChange={setPushNotifications}
            />
          }
        />
        <RowItem
          label="Mode sombre"
          rightElement={
            <ToggleSwitch
              value={darkMode}
              onChange={handleDarkModeToggle}
            />
          }
        />
        <RowItem
          label="Devise"
          rightElement={<DisplayValue value={currency} />}
          onPress={() => setShowCurrencyPicker(true)}
        />

        {/* Données Section */}
        <SectionHeader title="Données" />
        <RowItem
          label="Vider le cache"
          rightElement={<ChevronElement />}
          onPress={() => setShowClearCacheConfirm(true)}
        />
        <RowItem
          label="Téléchargements hors-ligne"
          rightElement={
            <ToggleSwitch
              value={offlineDownloads}
              onChange={setOfflineDownloads}
            />
          }
        />

        {/* Sécurité Section */}
        <SectionHeader title="Sécurité" />
        <RowItem
          label="Changer le mot de passe"
          rightElement={<ChevronElement />}
          onPress={onOpenForgotPassword}
        />
        <RowItem
          label="Vérification en 2 étapes"
          rightElement={
            <ToggleSwitch
              value={twoFactorAuth}
              onChange={setTwoFactorAuth}
            />
          }
        />
        <RowItem
          label="Appareils connectés"
          rightElement={<DisplayValue value={`${DEVICES.length} appareil${DEVICES.length>1?"s":""}`} />}
          onPress={() => setShowDevicesSheet(true)}
        />

        {/* Aide & Support Section */}
        <SectionHeader title="Aide & Support" />
        <RowItem
          label="Centre d'aide"
          rightElement={<ChevronElement />}
          onPress={onOpenSupport}
        />

        {/* À propos Section */}
        <SectionHeader title="À propos" />
        <RowItem
          label="Version de l'app"
          rightElement={
            <span style={{ color: C.light, fontSize: 14 }}>2.1.0</span>
          }
        />
        <RowItem
          label="Conditions d'utilisation"
          rightElement={<ChevronElement />}
          onPress={onOpenTerms}
        />
        <RowItem
          label="Politique de confidentialité"
          rightElement={<ChevronElement />}
          onPress={onOpenPrivacy}
        />
        <RowItem
          label="Licences open source"
          rightElement={<ChevronElement />}
          onPress={() => {
            setToastMessage("Liste des licences disponibles sur byer.cm/licences");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
          }}
        />

        {/* Bottom Actions */}
        <div style={{ padding: "24px 16px 16px" }}>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              width: "100%",
              padding: "14px 16px",
              backgroundColor: C.coral,
              border: "none",
              borderRadius: 8,
              color: C.white,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "DM Sans",
            }}
          >
            Se déconnecter
          </button>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                color: "#D32F2F",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: "DM Sans",
              }}
            >
              Supprimer mon compte
            </span>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {showClearCacheConfirm && (
        <ConfirmDialog
          title="Vider le cache"
          message="Êtes-vous sûr de vouloir supprimer tous les fichiers en cache ? Cela ne supprimera pas vos données."
          onConfirm={() => {
            setShowClearCacheConfirm(false);
            setToastMessage("Cache vidé avec succès");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
          }}
          onCancel={() => setShowClearCacheConfirm(false)}
        />
      )}

      {showLogoutConfirm && (
        <ConfirmDialog
          title="Se déconnecter"
          message="Êtes-vous sûr de vouloir vous déconnecter ?"
          onConfirm={() => {
            setShowLogoutConfirm(false);
            onLogout?.();
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Supprimer mon compte"
          message="Cette action est irréversible. Toutes vos données seront supprimées."
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onDeleteAccount?.();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {/* Picker — Langue */}
      {showLanguagePicker && (
        <PickerSheet
          title="Choisir la langue"
          options={LANGUAGES}
          selected={language}
          onSelect={(v) => { setLanguage(v); setShowLanguagePicker(false); showToastMsg(`Langue : ${v}`); }}
          onClose={() => setShowLanguagePicker(false)}
        />
      )}

      {/* Picker — Devise */}
      {showCurrencyPicker && (
        <PickerSheet
          title="Choisir la devise"
          options={CURRENCIES}
          selected={currency}
          onSelect={(v) => { setCurrency(v); setShowCurrencyPicker(false); showToastMsg(`Devise : ${v}`); }}
          onClose={() => setShowCurrencyPicker(false)}
        />
      )}

      {/* Sheet — Appareils connectés */}
      {showDevicesSheet && (
        <div
          onClick={() => setShowDevicesSheet(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:1000, display:"flex", alignItems:"flex-end" }}
        >
          <div
            onClick={(e)=>e.stopPropagation()}
            className="sheet"
            style={{ width:"100%", background:C.white, borderRadius:"16px 16px 0 0", padding:"20px 16px 32px", fontFamily:"DM Sans" }}
          >
            <div style={{ width:40, height:4, background:C.border, borderRadius:2, margin:"0 auto 16px" }} />
            <div style={{ fontSize:18, fontWeight:700, color:C.dark, marginBottom:16 }}>Appareils connectés</div>
            {DEVICES.map((d) => (
              <div key={d.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.dark }}>{d.name}</div>
                  <div style={{ fontSize:12, color:C.light, marginTop:2 }}>{d.lastSeen}</div>
                </div>
                {d.current ? (
                  <span style={{ fontSize:11, fontWeight:700, color:"#0A8754", background:"#E6F4EC", padding:"4px 8px", borderRadius:6 }}>ACTUEL</span>
                ) : (
                  <button
                    onClick={() => showToastMsg("Appareil déconnecté")}
                    style={{ background:"none", border:`1px solid ${C.coral}`, color:C.coral, fontSize:12, fontWeight:600, padding:"6px 12px", borderRadius:6, cursor:"pointer", fontFamily:"DM Sans" }}
                  >
                    Déconnecter
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setShowDevicesSheet(false)}
              style={{ width:"100%", marginTop:16, padding:"12px 16px", background:C.bg, border:"none", borderRadius:8, color:C.dark, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans" }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && <Toast message={toastMessage} />}
    </div>
  );
}

// Réutilisable: feuille bottom-sheet avec liste de choix radio.
function PickerSheet({ title, options, selected, onSelect, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:1000, display:"flex", alignItems:"flex-end" }}
    >
      <div
        onClick={(e)=>e.stopPropagation()}
        className="sheet"
        style={{ width:"100%", background:C.white, borderRadius:"16px 16px 0 0", padding:"20px 16px 32px", fontFamily:"DM Sans" }}
      >
        <div style={{ width:40, height:4, background:C.border, borderRadius:2, margin:"0 auto 16px" }} />
        <div style={{ fontSize:18, fontWeight:700, color:C.dark, marginBottom:16 }}>{title}</div>
        {options.map((opt) => {
          const active = opt === selected;
          return (
            <div
              key={opt}
              onClick={() => onSelect(opt)}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 4px", borderBottom:`1px solid ${C.border}`, cursor:"pointer" }}
            >
              <span style={{ fontSize:15, fontWeight: active ? 700 : 500, color:C.dark }}>{opt}</span>
              {active && <Icon name="check" size={18} color={C.coral} stroke={2.5} />}
            </div>
          );
        })}
        <button
          onClick={onClose}
          style={{ width:"100%", marginTop:16, padding:"12px 16px", background:C.bg, border:"none", borderRadius:8, color:C.dark, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans" }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}


/* ═══ js/edit-profile.js ═══ */
function EditProfileScreen({ onBack }) {
  const [formData, setFormData] = useState({
    name: USER.name,
    phone: "+237 6XX XXX XXX",
    email: "pino@email.com",
    city: USER.city,
    bio: "Membre Byer depuis mars 2025"
  });

  const [toast, setToast] = useState(null);
  const cities = ["Douala", "Yaoundé", "Kribi", "Limbé", "Buéa", "Bamenda", "Bafoussam"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e) => {
    setFormData(prev => ({
      ...prev,
      city: e.target.value
    }));
  };

  const handleSave = () => {
    setToast("Profil mis à jour !");
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: C.bg,
    fontFamily: "DM Sans, sans-serif"
  };

  const headerStyle = {
    ...S.pageHead,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "var(--top-pad) 16px 16px",
    borderBottom: `1px solid ${C.border}`
  };

  const headerLeftStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  };

  const titleStyle = {
    ...S.pageTitle,
    margin: 0,
    fontSize: "18px",
    fontWeight: 600,
    color: C.black
  };

  const saveButtonStyle = {
    background: "none",
    border: "none",
    color: C.coral,
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.2s",
    "&:hover": {
      opacity: 0.8
    }
  };

  const contentStyle = {
    ...S.scroll,
    flex: 1,
    overflow: "auto",
    paddingBottom: "100px"
  };

  const avatarSectionStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "24px",
    paddingBottom: "32px"
  };

  const avatarContainerStyle = {
    position: "relative",
    width: "80px",
    height: "80px",
    marginBottom: "12px"
  };

  const cameraButtonStyle = {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: C.coral,
    border: `3px solid ${C.white}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
  };

  const changePhotoTextStyle = {
    fontSize: "13px",
    fontWeight: 500,
    color: C.mid,
    marginTop: "8px"
  };

  const formGroupStyle = {
    marginBottom: "18px",
    padding: "0 16px"
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: 600,
    color: C.light,
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "block"
  };

  const inputStyle = {
    fontSize: "15px",
    padding: "12px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${C.border}`,
    backgroundColor: C.white,
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "DM Sans, sans-serif",
    transition: "border-color 0.2s",
    outline: "none"
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer"
  };

  const textareaStyle = {
    ...inputStyle,
    fontFamily: "DM Sans, sans-serif",
    resize: "none",
    minHeight: "80px"
  };

  const charCountStyle = {
    fontSize: "12px",
    color: C.light,
    marginTop: "6px",
    textAlign: "right"
  };

  const verificationsStyle = {
    padding: "16px",
    marginTop: "24px",
    backgroundColor: C.white,
    borderTop: `1px solid ${C.border}`,
    borderBottom: `1px solid ${C.border}`
  };

  const verificationsTitle = {
    fontSize: "13px",
    fontWeight: 600,
    color: C.light,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "16px"
  };

  const verificationItemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "16px",
    marginBottom: "16px",
    borderBottom: `1px solid ${C.border}`
  };

  const verificationItemLastStyle = {
    ...verificationItemStyle,
    borderBottom: "none",
    paddingBottom: "0",
    marginBottom: "0"
  };

  const verificationLabelStyle = {
    fontSize: "14px",
    fontWeight: 500,
    color: C.black
  };

  const verificationStatusStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  const verifiedStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#22C55E"
  };

  const notVerifiedStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#F59E0B"
  };

  const verifyButtonStyle = {
    background: "none",
    border: "none",
    color: "#F59E0B",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    padding: "6px 0",
    textDecoration: "underline",
    transition: "opacity 0.2s"
  };

  const saveButtonFullStyle = {
    position: "fixed",
    bottom: "16px",
    left: "16px",
    right: "16px",
    width: "calc(100% - 32px)",
    padding: "14px 20px",
    backgroundColor: C.coral,
    color: C.white,
    border: "none",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(255,90,95,0.25)"
  };

  const toastStyle = {
    position: "fixed",
    bottom: "80px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: C.black,
    color: C.white,
    borderRadius: "12px",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: 500,
    animation: `toastFade 2s ease-in-out`,
    whiteSpace: "nowrap"
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes toastFade {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        input:focus {
          border-color: ${C.coral} !important;
          box-shadow: 0 0 0 3px rgba(255,90,95,0.1);
        }
        select:focus {
          border-color: ${C.coral} !important;
          box-shadow: 0 0 0 3px rgba(255,90,95,0.1);
        }
        textarea:focus {
          border-color: ${C.coral} !important;
          box-shadow: 0 0 0 3px rgba(255,90,95,0.1);
        }
      `}</style>

      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              padding: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon name="back" size={20} color={C.dark} stroke={2.5} />
          </button>
          <h1 style={titleStyle}>Modifier le profil</h1>
        </div>
        <button onClick={handleSave} style={saveButtonStyle}>Enregistrer</button>
      </div>

      <div style={contentStyle}>
        <div style={avatarSectionStyle}>
          <div style={avatarContainerStyle}>
            <FaceAvatar
              photo={USER.photo}
              avatar={USER.avatar}
              bg={USER.bg}
              size={80}
              radius={40}
            />
            <div style={cameraButtonStyle}>
              <svg width="16" height="16" fill="none" stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          </div>
          <div style={changePhotoTextStyle}>Changer la photo</div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Nom complet</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Numéro de téléphone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Ville</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleSelectChange}
            style={selectStyle}
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            maxLength={200}
            style={textareaStyle}
          />
          <div style={charCountStyle}>{formData.bio.length}/200</div>
        </div>

        <div style={verificationsStyle}>
          <div style={verificationsTitle}>Vérifications</div>

          <div style={verificationItemStyle}>
            <div style={verificationLabelStyle}>Téléphone</div>
            <div style={verificationStatusStyle}>
              <div style={verifiedStyle}>
                <svg width="18" height="18" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span style={{fontSize:13,fontWeight:600}}>Vérifié</span>
              </div>
            </div>
          </div>

          <div style={verificationItemStyle}>
            <div style={verificationLabelStyle}>Email</div>
            <div style={verificationStatusStyle}>
              <div style={notVerifiedStyle}>
                <svg width="18" height="18" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{fontSize:13,fontWeight:600}}>Non vérifié</span>
              </div>
              <button style={verifyButtonStyle}>Vérifier</button>
            </div>
          </div>

          <div style={verificationItemLastStyle}>
            <div style={verificationLabelStyle}>Identité</div>
            <div style={verificationStatusStyle}>
              <div style={notVerifiedStyle}>
                <svg width="18" height="18" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{fontSize:13,fontWeight:600}}>Non vérifié</span>
              </div>
              <button style={verifyButtonStyle}>Vérifier</button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        style={saveButtonFullStyle}
      >
        Enregistrer les modifications
      </button>

      {toast && (
        <div style={toastStyle}>
          {toast}
        </div>
      )}
    </div>
  );
}


/* ═══ js/booking.js ═══ */
function BookingScreen({ item, duration, onBack, onComplete, onCreateBooking }) {
  const [step, setStep] = useState(1);
  const [guests, setGuests] = useState(1);
  const [arrivalDate, setArrivalDate] = useState(new Date().toISOString().split('T')[0]);
  const [departDate, setDepartDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [confirmationRef, setConfirmationRef] = useState('');

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getNights = () => {
    const arrival = new Date(arrivalDate);
    const depart = new Date(departDate);
    const nights = Math.max(1, Math.ceil((depart - arrival) / (1000 * 60 * 60 * 24)));
    return nights;
  };

  const calculatePrice = () => {
    const isVehicle = item?.type === "vehicle";
    const dayBase  = item?.nightPrice || 25000;          // base journalière commune
    const monthP   = item?.monthPrice || null;
    let breakdown = {};

    if (duration === 'month' && (monthP || isVehicle)) {
      // Mensuel — property : monthPrice direct ; vehicle : day*22
      const baseMonth = monthP || Math.round(dayBase * 22);
      breakdown.base    = baseMonth;
      breakdown.label   = `${fmt(baseMonth)} × 1 mois`;
      breakdown.dossier = Math.round(baseMonth * 0.05);
      breakdown.caution = baseMonth;
      breakdown.total   = baseMonth + breakdown.dossier + breakdown.caution;
    } else if (duration === 'week' && isVehicle) {
      const baseWeek = Math.round(dayBase * 6);
      breakdown.base    = baseWeek;
      breakdown.label   = `${fmt(baseWeek)} × 1 semaine`;
      breakdown.service = Math.round(baseWeek * 0.10);
      breakdown.caution = 50000;
      breakdown.total   = baseWeek + breakdown.service + breakdown.caution;
    } else if (duration === 'day' && isVehicle) {
      const days = getNights(); // ré-utilise calc d'écart en jours
      breakdown.base    = dayBase * days;
      breakdown.label   = `${fmt(dayBase)} × ${days} jour${days>1?'s':''}`;
      breakdown.service = Math.round(breakdown.base * 0.12);
      breakdown.caution = 50000;
      breakdown.total   = breakdown.base + breakdown.service + breakdown.caution;
    } else {
      // night (property) — fallback historique
      const nights = getNights();
      breakdown.base    = dayBase * nights;
      breakdown.label   = `${fmt(dayBase)} × ${nights} nuit${nights > 1 ? 's' : ''}`;
      breakdown.service = Math.round(breakdown.base * 0.12);
      breakdown.taxes   = Math.round(breakdown.base * 0.05);
      breakdown.total   = breakdown.base + breakdown.service + breakdown.taxes;
    }

    return breakdown;
  };

  const pricing = calculatePrice();
  const canContinueStep1 = arrivalDate && departDate && arrivalDate < departDate;
  const canConfirmPayment = termsAccepted && (
    paymentMethod === 'eu' ||
    paymentMethod === 'virement' ||
    (paymentMethod && phone)
  );

  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleConfirmPayment = async () => {
    setBookingError("");
    setBookingLoading(true);

    const ref = 'BYR-' + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    setConfirmationRef(ref);

    // ─── INSERT dans Supabase si l'annonce vient de la BDD ───────
    // (item._supabase === true → listing réel avec owner_id)
    const db = window.byer && window.byer.db;
    if (db && db.isReady && item && item._supabase && item.ownerId) {
      try {
        const { data: sess } = await db.auth.getSession();
        const user = sess && sess.session && sess.session.user;
        if (user) {
          const paymentMap = {
            mtn:      "momo",
            om:       "om",
            orange:   "om",
            card:     "card",
            visa:     "card",
            virement: "card",
            eu:       "card",
          };
          const { error: bookErr } = await db.bookings.create({
            guest_id:       user.id,
            host_id:        item.ownerId,
            listing_id:     item.id,
            checkin:        arrivalDate,
            checkout:       departDate,
            guests_count:   guests,
            total_price:    pricing.total,
            payment_method: paymentMap[paymentMethod] || "momo",
            payment_status: "paid",
            status:         "confirmed",
          });
          if (bookErr) {
            console.warn("[byer] booking insert error:", bookErr.message);
            // On n'interrompt PAS le flow : la résa locale fonctionne quand même
          }
        }
      } catch (e) {
        console.warn("[byer] booking error:", e);
      }
    }
    setBookingLoading(false);

    // Construire un booking persistable + l'ajouter à la liste utilisateur
    if (onCreateBooking && item) {
      const isVehicle = item.type === "vehicle";
      const nights = getNights();
      const heroImg = (typeof GALLERY !== "undefined" && GALLERY[item.id]?.imgs?.[0])
        || item.img
        || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400";
      const coords = (typeof CITY_COORDS !== "undefined" && CITY_COORDS[item.city]) || { lat: 4.05, lng: 9.7 };

      const booking = {
        id: ref,
        ref,
        title: item.title || "Réservation",
        type: isVehicle ? "vehicle" : "property",
        city: item.city || "—",
        zone: item.zone || item.city || "—",
        address: `${item.zone || ""} ${item.city || ""}`.trim() || "Cameroun",
        lat: coords.lat,
        lng: coords.lon || coords.lng,
        img: heroImg,
        host: item.host || "Hôte Byer",
        hostPhoto: item.hostPhoto || null,
        checkIn: formatDate(arrivalDate),
        checkOut: formatDate(departDate),
        nights,
        price: pricing.base ? Math.round(pricing.base / Math.max(1, nights)) : (item.nightPrice || 0),
        amenities: (item.amenities || []).slice(0, 3),
        status: "upcoming",
        createdAt: Date.now(),
      };
      onCreateBooking(booking);
    }

    setStep(3);
  };

  const handleReturnHome = () => {
    onBack?.();
  };

  const handleViewTrips = () => {
    // Navigation to trips would be handled by parent
    onComplete?.();
  };

  const StepIndicator = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      marginBottom: 32,
      paddingTop: 16
    }}>
      {[1, 2, 3].map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: s <= step ? C.coral : 'transparent',
            border: s <= step ? 'none' : `2px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: s <= step ? C.white : C.light,
            transition: 'all 0.3s'
          }}>
            {s}
          </div>
          {s < 3 && (
            <div style={{
              width: 8,
              height: 2,
              backgroundColor: s < step ? C.coral : C.border,
              transition: 'all 0.3s'
            }} />
          )}
        </div>
      ))}
    </div>
  );

  // Step 1: Récapitulatif
  if (step === 1) {
    return (
      <div style={{
        backgroundColor: C.white,
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        padding: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, cursor: 'pointer' }} onClick={onBack}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5} />
          <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 500, color: C.dark }}>Retour</span>
        </div>

        <StepIndicator />

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          {/* Property Card */}
          <div style={{
            display: 'flex',
            gap: 12,
            marginBottom: 24,
            alignItems: 'flex-start'
          }}>
            <img
              src={(GALLERY[item?.id]?.imgs?.[0]) || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"}
              style={{
                width: 80,
                height: 80,
                borderRadius: 12,
                objectFit: 'cover',
                flexShrink: 0
              }}
              alt={item?.name}
            />
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: C.dark,
                marginBottom: 4
              }}>
                {item?.title || 'Propriété'}
              </div>
              <div style={{
                fontSize: 13,
                color: C.light,
                marginBottom: 8
              }}>
                {(item?.zone ? item.zone + ', ' + item.city : 'Localisation')}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: C.coral
              }}>
                {(() => {
                  if (!item) return `${fmt(25000)}/nuit`;
                  const { price, unit } = priceFor(item, duration);
                  return `${fmt(price)}${unit}`;
                })()}
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div style={{
            backgroundColor: C.bg,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.dark,
              marginBottom: 12
            }}>
              Arrivée
            </div>
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: `1.5px solid ${C.border}`,
                fontSize: 14,
                fontFamily: 'DM Sans, sans-serif',
                marginBottom: 16,
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.dark,
              marginBottom: 12
            }}>
              Départ
            </div>
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: `1.5px solid ${C.border}`,
                fontSize: 14,
                fontFamily: 'DM Sans, sans-serif',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Guests Selection */}
          <div style={{
            backgroundColor: C.bg,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.dark,
              marginBottom: 12
            }}>
              Nombre de voyageurs
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: `1.5px solid ${C.border}`,
                  backgroundColor: C.white,
                  cursor: 'pointer',
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.dark,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                −
              </button>
              <div style={{
                fontSize: 20,
                fontWeight: 700,
                color: C.dark,
                minWidth: 30,
                textAlign: 'center'
              }}>
                {guests}
              </div>
              <button
                onClick={() => setGuests(Math.min(10, guests + 1))}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: `1.5px solid ${C.border}`,
                  backgroundColor: C.white,
                  cursor: 'pointer',
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.dark,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div style={{
            backgroundColor: C.bg,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.dark,
              marginBottom: 12
            }}>
              Détails du prix
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 10,
              fontSize: 13,
              color: C.dark
            }}>
              <span>{pricing.label}</span>
              <span>{fmt(pricing.base)}</span>
            </div>
            {/* Lignes dynamiques basées sur la breakdown calculée */}
            {(() => {
              const lines = [];
              if (pricing.service != null) lines.push({l:`Frais de service (${duration==='week'?'10':'12'}%)`, v:pricing.service});
              if (pricing.dossier != null) lines.push({l:"Frais de dossier (5%)", v:pricing.dossier});
              if (pricing.taxes   != null) lines.push({l:"Taxes (5%)",            v:pricing.taxes});
              if (pricing.caution != null) lines.push({l:item?.type==='vehicle'?"Caution véhicule":"Caution", v:pricing.caution});
              return lines.map((row, i) => (
                <div key={row.l} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: i === lines.length - 1 ? 16 : 10,
                  fontSize: 13,
                  color: C.light,
                  paddingBottom: i === lines.length - 1 ? 16 : 0,
                  borderBottom: i === lines.length - 1 ? `1.5px solid ${C.border}` : 'none',
                }}>
                  <span>{row.l}</span>
                  <span>{fmt(row.v)}</span>
                </div>
              ));
            })()}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 16,
              fontWeight: 700,
              color: C.dark
            }}>
              <span>Total</span>
              <span>{fmt(pricing.total)}</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => setStep(2)}
          disabled={!canContinueStep1}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 14,
            border: 'none',
            backgroundColor: canContinueStep1 ? C.coral : C.border,
            color: C.white,
            fontSize: 14,
            fontWeight: 700,
            cursor: canContinueStep1 ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s',
            opacity: canContinueStep1 ? 1 : 0.6
          }}
        >
          Continuer
        </button>
      </div>
    );
  }

  // Step 2: Paiement
  if (step === 2) {
    return (
      <div style={{
        backgroundColor: C.white,
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        padding: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, cursor: 'pointer' }} onClick={() => setStep(1)}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5} />
          <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 500, color: C.dark }}>Retour</span>
        </div>

        <StepIndicator />

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: C.dark,
            marginBottom: 20
          }}>
            Mode de paiement
          </div>

          {/* Payment Method Cards */}
          <div style={{ marginBottom: 24 }}>
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  marginBottom: 12,
                  backgroundColor: C.white,
                  borderRadius: 14,
                  border: `2px solid ${paymentMethod === method.id ? C.coral : C.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: 4,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: method.accent,
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.dark
                  }}>
                    {method.label}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: C.light,
                    marginTop: 2
                  }}>
                    {method.short}
                  </div>
                </div>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: `2px solid ${paymentMethod === method.id ? C.coral : C.border}`,
                  backgroundColor: paymentMethod === method.id ? C.coral : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {paymentMethod === method.id && (
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: C.white
                    }} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Phone Input for MoMo/OM */}
          {(paymentMethod === 'mtn' || paymentMethod === 'orange') && (
            <div style={{
              backgroundColor: C.bg,
              borderRadius: 16,
              padding: 16,
              marginBottom: 20
            }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: C.dark,
                marginBottom: 12
              }}>
                Numéro de téléphone
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+237 6XX XXX XXX"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: `1.5px solid ${C.border}`,
                  fontSize: 14,
                  fontFamily: 'DM Sans, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* EU Agence Info */}
          {paymentMethod === 'eu' && (
            <div style={{
              backgroundColor: '#E3F2FD',
              borderRadius: 12,
              padding: 12,
              marginBottom: 20,
              borderLeft: `4px solid #1B4D89`
            }}>
              <div style={{
                fontSize: 13,
                color: '#1B4D89',
                fontWeight: 500
              }}>
                Rendez-vous en agence Express Union pour finaliser votre paiement
              </div>
            </div>
          )}

          {/* Virement Info */}
          {paymentMethod === 'virement' && (
            <div style={{
              backgroundColor: C.bg,
              borderRadius: 16,
              padding: 16,
              marginBottom: 20
            }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: C.dark,
                marginBottom: 12
              }}>
                Détails de virement
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 13,
                color: C.dark
              }}>
                <div>
                  <span style={{ color: C.light }}>IBAN: </span>
                  <span style={{ fontWeight: 600 }}>CM21 30070 00000 00001234567890</span>
                </div>
                <div>
                  <span style={{ color: C.light }}>BIC: </span>
                  <span style={{ fontWeight: 600 }}>BYERCMCX</span>
                </div>
              </div>
            </div>
          )}

          {/* Terms Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 20,
            padding: 12,
            backgroundColor: C.bg,
            borderRadius: 12
          }}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              style={{
                width: 20,
                height: 20,
                cursor: 'pointer',
                marginTop: 2,
                flexShrink: 0
              }}
            />
            <label style={{
              fontSize: 12,
              color: C.dark,
              cursor: 'pointer',
              lineHeight: 1.5
            }}>
              J'accepte les conditions générales de Byer
            </label>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirmPayment}
          disabled={!canConfirmPayment}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 14,
            border: 'none',
            backgroundColor: canConfirmPayment ? C.coral : C.border,
            color: C.white,
            fontSize: 14,
            fontWeight: 700,
            cursor: canConfirmPayment ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s',
            opacity: canConfirmPayment ? 1 : 0.6
          }}
        >
          Confirmer et payer
        </button>
      </div>
    );
  }

  // Step 3: Confirmation
  if (step === 3) {
    return (
      <div style={{
        backgroundColor: C.white,
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        padding: 16
      }}>
        <StepIndicator />

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Checkmark Animation */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            animation: 'scaleIn 0.5s ease-out',
            marginTop: 20
          }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M37 14L16.5 34.5L7 25" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Title */}
          <div style={{
            fontSize: 22,
            fontWeight: 700,
            color: C.dark,
            marginBottom: 8,
            textAlign: 'center'
          }}>
            Réservation confirmée !
          </div>

          {/* Booking Ref */}
          <div style={{
            fontSize: 14,
            color: C.light,
            marginBottom: 24,
            textAlign: 'center'
          }}>
            Référence: <span style={{ fontWeight: 700, color: C.dark }}>{confirmationRef}</span>
          </div>

          {/* Summary Card */}
          <div style={{
            width: '100%',
            backgroundColor: C.bg,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20
          }}>
            <div style={{
              display: 'flex',
              gap: 12,
              marginBottom: 16,
              alignItems: 'flex-start'
            }}>
              <img
                src={(GALLERY[item?.id]?.imgs?.[0]) || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  objectFit: 'cover',
                  flexShrink: 0
                }}
                alt={item?.name}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.dark,
                  marginBottom: 4
                }}>
                  {item?.title || 'Propriété'}
                </div>
                <div style={{
                  fontSize: 12,
                  color: C.light
                }}>
                  {formatDate(arrivalDate)} - {formatDate(departDate)}
                </div>
              </div>
            </div>
            <div style={{
              borderTop: `1.5px solid ${C.border}`,
              paddingTop: 12,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 14,
              fontWeight: 600,
              color: C.dark
            }}>
              <span>Montant payé</span>
              <span>{fmt(calculatePrice().total)}</span>
            </div>
            <div style={{
              marginTop: 12,
              fontSize: 12,
              color: C.light
            }}>
              Mode: {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label || 'N/A'}
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div style={{
            width: 120,
            height: 120,
            backgroundColor: C.bg,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              {[...Array(10)].map((_, i) => (
                [...Array(10)].map((_, j) => (
                  <rect
                    key={`${i}-${j}`}
                    x={j * 10}
                    y={i * 10}
                    width="9"
                    height="9"
                    fill={Math.random() > 0.5 ? C.dark : 'transparent'}
                    stroke={C.border}
                    strokeWidth="0.5"
                  />
                ))
              ))}
            </svg>
          </div>
          <div style={{
            fontSize: 12,
            color: C.light,
            marginBottom: 20
          }}>
            Votre QR Code d'accès
          </div>

          {/* Info Box */}
          <div style={{
            width: '100%',
            backgroundColor: '#F0F9FF',
            borderRadius: 12,
            padding: 12,
            marginBottom: 20,
            borderLeft: `4px solid #0EA5E9`,
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 13,
              color: '#0284C7',
              fontWeight: 500
            }}>
              Le propriétaire a été notifié
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={handleViewTrips}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 14,
              border: `2px solid ${C.coral}`,
              backgroundColor: 'transparent',
              color: C.coral,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Voir mes voyages
          </button>
          <button
            onClick={handleReturnHome}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 14,
              border: 'none',
              backgroundColor: C.coral,
              color: C.white,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Retour à l'accueil
          </button>
        </div>

        <style>{`
          @keyframes scaleIn {
            from {
              transform: scale(0.8);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }
}


/* ═══ js/history.js ═══ */
/* Byer — Reviews & Booking History */

const MOCK_REVIEWS = [
  { id:1, author:"Jean M.", avatar:"J", bg:"#3B82F6", rating:5, date:"12 avril 2026", property:"Studio Akwa Palace", text:"Excellent séjour ! L'appartement était très propre et bien situé. Pino est un hôte très réactif." },
  { id:2, author:"Marie N.", avatar:"M", bg:"#EC4899", rating:4, date:"3 avril 2026", property:"Villa Bonanjo", text:"Très bon logement, juste un petit souci avec l'eau chaude mais résolu rapidement." },
  { id:3, author:"Paul K.", avatar:"P", bg:"#F59E0B", rating:5, date:"28 mars 2026", property:"Studio Akwa Palace", text:"Parfait pour un séjour d'affaires. Je recommande vivement !" },
  { id:4, author:"Aïcha D.", avatar:"A", bg:"#8B5CF6", rating:3, date:"15 mars 2026", property:"Chambre Bonapriso", text:"Correct mais la climatisation faisait du bruit. Le quartier est bien par contre." },
  { id:5, author:"Thomas E.", avatar:"T", bg:"#10B981", rating:5, date:"2 mars 2026", property:"Studio Akwa Palace", text:"Super expérience, comme à la maison ! Merci Pino." },
];

const MOCK_BOOKINGS_HIST = [
  { id:1, title:"Studio Akwa Palace", city:"Douala", zone:"Akwa", img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", checkin:"2026-04-20", checkout:"2026-04-23", status:"active", total:75000, method:"MoMo", ref:"BYR-482916" },
  { id:2, title:"Villa Bonanjo", city:"Douala", zone:"Bonanjo", img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", checkin:"2026-03-10", checkout:"2026-03-15", status:"completed", total:250000, method:"OM", ref:"BYR-371845" },
  { id:3, title:"Toyota Hilux 4x4", city:"Douala", zone:"Bonapriso", img:"https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400", checkin:"2026-02-05", checkout:"2026-02-08", status:"completed", total:120000, method:"MoMo", ref:"BYR-259173" },
  { id:4, title:"Appart Bastos Luxe", city:"Yaoundé", zone:"Bastos", img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", checkin:"2026-01-15", checkout:"2026-01-16", status:"cancelled", total:45000, method:"OM", ref:"BYR-184562" },
];

/* ─── REVIEWS SCREEN ──────────────────────────────── */
function ReviewsScreen({ onBack }) {
  const [filter, setFilter] = useState("Tous");
  const [replyToast, setReplyToast] = useState("");
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState("");
  const flashReply = (msg) => { setReplyToast(msg); setTimeout(()=>setReplyToast(""), 2200); };

  const avg = (MOCK_REVIEWS.reduce((s,r) => s+r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);
  const dist = [5,4,3,2,1].map(n => ({ star:n, count:MOCK_REVIEWS.filter(r=>r.rating===n).length }));

  const filtered = filter === "Tous"
    ? MOCK_REVIEWS
    : MOCK_REVIEWS.filter(r => r.rating === parseInt(filter));

  const filters = ["Tous","5★","4★","3★"];

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Header */}
        <div style={S.rentHeader}>
          <button style={S.dBack2} onClick={onBack}><Icon name="back" size={20} color={C.dark} stroke={2.5}/></button>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Avis reçus</p>
          <div style={{width:38}}/>
        </div>

        {/* Summary card */}
        <div style={{margin:"0 16px 16px",background:C.white,borderRadius:16,padding:20,boxShadow:"0 2px 10px rgba(0,0,0,.05)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div>
              <p style={{fontSize:42,fontWeight:800,color:C.black,lineHeight:1}}>{avg}</p>
              <p style={{fontSize:12,color:C.mid,marginTop:4}}>{MOCK_REVIEWS.length} avis</p>
            </div>
            <RatingStars score={parseFloat(avg)} size={16}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {dist.map(d => (
              <div key={d.star} style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:11,color:C.mid,width:22}}>{d.star}★</span>
                <div style={{flex:1,height:6,background:C.bg,borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",background:C.coral,borderRadius:3,width:`${(d.count/MOCK_REVIEWS.length)*100}%`,transition:"width .3s"}}/>
                </div>
                <span style={{fontSize:11,color:C.mid,width:18,textAlign:"right"}}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter chips */}
        <div style={{display:"flex",gap:8,padding:"0 16px",marginBottom:16,overflowX:"auto"}}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:"7px 14px",borderRadius:20,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",
              background:filter===f?C.coral:C.bg,
              color:filter===f?C.white:C.dark,
              transition:"all .2s"
            }}>{f}</button>
          ))}
        </div>

        {/* Reviews list */}
        <div style={{padding:"0 16px 100px",display:"flex",flexDirection:"column",gap:12}}>
          {filtered.length === 0 && <EmptyState icon="star" text="Aucun avis avec ce filtre"/>}
          {filtered.map(r => (
            <div key={r.id} style={{background:C.white,borderRadius:16,padding:14,boxShadow:"0 2px 10px rgba(0,0,0,.05)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <FaceAvatar avatar={r.avatar} bg={r.bg} size={36}/>
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:600,color:C.dark}}>{r.author}</p>
                  <p style={{fontSize:11,color:C.light}}>{r.date}</p>
                </div>
              </div>
              <div style={{marginBottom:6}}><RatingStars score={r.rating} size={13}/></div>
              <p style={{fontSize:11,color:C.light,marginBottom:6}}>{r.property}</p>
              <p style={{fontSize:13,color:C.dark,lineHeight:1.6,marginBottom:8}}>{r.text}</p>
              <span onClick={()=>{ setReplyTarget(r); setReplyText(""); }} style={{fontSize:12,color:C.coral,fontWeight:600,cursor:"pointer"}}>Répondre</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reply sheet */}
      {replyTarget && (
        <div onClick={()=>setReplyTarget(null)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"flex-end"}}>
          <div onClick={(e)=>e.stopPropagation()} className="sheet"
            style={{width:"100%",background:C.white,borderRadius:"16px 16px 0 0",padding:"20px 16px 32px",fontFamily:"'DM Sans',sans-serif"}}>
            <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px"}}/>
            <p style={{fontSize:16,fontWeight:700,color:C.dark,marginBottom:6}}>Répondre à {replyTarget.author}</p>
            <p style={{fontSize:12,color:C.mid,marginBottom:12,fontStyle:"italic"}}>"{replyTarget.text}"</p>
            <textarea
              value={replyText}
              onChange={(e)=>setReplyText(e.target.value)}
              placeholder="Votre réponse publique…"
              style={{width:"100%",minHeight:90,padding:12,border:`1px solid ${C.border}`,borderRadius:8,fontSize:14,fontFamily:"'DM Sans',sans-serif",resize:"vertical",outline:"none"}}
            />
            <div style={{display:"flex",gap:10,marginTop:12}}>
              <button onClick={()=>setReplyTarget(null)}
                style={{flex:1,padding:"12px",border:"none",borderRadius:8,background:C.bg,color:C.dark,fontWeight:600,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>
                Annuler
              </button>
              <button onClick={()=>{ flashReply(replyText.trim() ? "Réponse publiée" : "Réponse vide ignorée"); setReplyTarget(null); }}
                style={{flex:1,padding:"12px",border:"none",borderRadius:8,background:C.coral,color:C.white,fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>
                Publier
              </button>
            </div>
          </div>
        </div>
      )}

      {replyToast && (
        <div style={{position:"fixed",bottom:24,left:16,right:16,background:C.dark,color:C.white,padding:"12px 16px",borderRadius:8,textAlign:"center",fontSize:14,fontFamily:"'DM Sans',sans-serif",zIndex:1100}}>
          {replyToast}
        </div>
      )}
    </div>
  );
}

/* ─── BOOKING HISTORY SCREEN ──────────────────────── */
function BookingHistoryScreen({ onBack }) {
  const [tab, setTab] = useState("Toutes");
  const [detailItem, setDetailItem] = useState(null);
  const [reviewToast, setReviewToast] = useState("");
  const flashReview = (msg) => { setReviewToast(msg); setTimeout(()=>setReviewToast(""), 2200); };
  const tabs = ["Toutes","En cours","Terminées","Annulées"];

  const statusMap = { active:"En cours", completed:"Terminée", cancelled:"Annulée" };
  const tabFilter = { "Toutes":null, "En cours":"active", "Terminées":"completed", "Annulées":"cancelled" };

  const filtered = tab === "Toutes"
    ? MOCK_BOOKINGS_HIST
    : MOCK_BOOKINGS_HIST.filter(b => b.status === tabFilter[tab]);

  const MONTHS = ["jan","fév","mar","avr","mai","juin","juil","aoû","sep","oct","nov","déc"];
  const fmtRange = (cin,cout) => {
    const a = new Date(cin), b = new Date(cout);
    return `${a.getDate()} ${MONTHS[a.getMonth()]} - ${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
  };

  const statusColor = { active:"#10B981", completed:C.mid, cancelled:"#EF4444" };

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Header */}
        <div style={S.rentHeader}>
          <button style={S.dBack2} onClick={onBack}><Icon name="back" size={20} color={C.dark} stroke={2.5}/></button>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Mes réservations</p>
          <div style={{width:38}}/>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,padding:"0 16px",marginBottom:16}}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:"12px 0",marginRight:16,border:"none",background:"none",cursor:"pointer",
              fontSize:13,fontWeight:600,
              color:tab===t?C.coral:C.mid,
              borderBottom:tab===t?`2px solid ${C.coral}`:"2px solid transparent",
              transition:"all .2s",whiteSpace:"nowrap"
            }}>{t}</button>
          ))}
        </div>

        {/* Bookings */}
        <div style={{padding:"0 16px 100px",display:"flex",flexDirection:"column",gap:12}}>
          {filtered.length === 0 && <EmptyState icon="trips" text="Aucune réservation"/>}
          {filtered.map(b => (
            <div key={b.id} style={{background:C.white,borderRadius:16,padding:14,boxShadow:"0 2px 10px rgba(0,0,0,.05)"}}>
              <div style={{display:"flex",gap:12,marginBottom:10}}>
                <img src={b.img} alt={b.title} style={{width:70,height:70,borderRadius:12,objectFit:"cover",flexShrink:0}}/>
                <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                  <div>
                    <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:2}}>{b.title}</p>
                    <p style={{fontSize:12,color:C.mid,marginBottom:3}}>{b.city}, {b.zone}</p>
                    <p style={{fontSize:11,color:C.light}}>{fmtRange(b.checkin,b.checkout)}</p>
                  </div>
                  <p style={{fontSize:13,fontWeight:700,color:C.dark}}>{fmt(b.total)}</p>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:statusColor[b.status],color:C.white}}>{statusMap[b.status]}</span>
                <span style={{fontSize:11,color:C.light}}>{b.ref}</span>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setDetailItem(b)}
                  style={{flex:1,padding:"10px 12px",border:`1px solid ${C.border}`,background:C.white,borderRadius:10,fontSize:12,fontWeight:600,color:C.dark,cursor:"pointer"}}>Voir détails</button>
                {b.status==="completed" && (
                  <button onClick={()=>flashReview("Avis enregistré — merci !")}
                    style={{flex:1,padding:"10px 12px",border:"none",background:C.coral,borderRadius:10,fontSize:12,fontWeight:600,color:C.white,cursor:"pointer"}}>Laisser un avis</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking detail sheet */}
      {detailItem && (
        <div onClick={()=>setDetailItem(null)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"flex-end"}}>
          <div onClick={(e)=>e.stopPropagation()} className="sheet"
            style={{width:"100%",background:C.white,borderRadius:"16px 16px 0 0",padding:"20px 16px 32px",fontFamily:"'DM Sans',sans-serif"}}>
            <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px"}}/>
            <p style={{fontSize:18,fontWeight:700,color:C.dark,marginBottom:14}}>Détails de la réservation</p>
            <img src={detailItem.img} alt={detailItem.title} style={{width:"100%",height:160,borderRadius:12,objectFit:"cover",marginBottom:14}}/>
            <p style={{fontSize:15,fontWeight:700,color:C.dark,marginBottom:4}}>{detailItem.title}</p>
            <p style={{fontSize:13,color:C.mid,marginBottom:14}}>{detailItem.city}, {detailItem.zone}</p>
            {[
              ["Référence",        detailItem.ref],
              ["Période",          fmtRange(detailItem.checkin,detailItem.checkout)],
              ["Statut",           statusMap[detailItem.status]],
              ["Moyen de paiement", detailItem.method],
              ["Montant total",    fmt(detailItem.total)],
            ].map(([k,v]) => (
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:13,color:C.mid}}>{k}</span>
                <span style={{fontSize:13,fontWeight:600,color:C.dark}}>{v}</span>
              </div>
            ))}
            <button onClick={()=>setDetailItem(null)}
              style={{width:"100%",marginTop:18,padding:"12px",background:C.coral,border:"none",borderRadius:8,color:C.white,fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {reviewToast && (
        <div style={{position:"fixed",bottom:24,left:16,right:16,background:C.dark,color:C.white,padding:"12px 16px",borderRadius:8,textAlign:"center",fontSize:14,fontFamily:"'DM Sans',sans-serif",zIndex:1100}}>
          {reviewToast}
        </div>
      )}
    </div>
  );
}


/* ═══ js/legal.js ═══ */
/* Byer — Pages légales (CGU · Confidentialité · Mot de passe oublié) */

/* ─── HELPER : Layout d'un écran légal ────────────── */
function LegalScrollScreen({ title, subtitle, children, onBack, footer }) {
  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={S.scroll}>
        {/* Header sticky */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"var(--top-pad) 16px 12px",borderBottom:`1px solid ${C.border}`,background:C.white,position:"sticky",top:0,zIndex:10}}>
          <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex"}}>
            <Icon name="back" size={22} color={C.dark} stroke={2}/>
          </button>
          <div style={{flex:1}}>
            <p style={{fontSize:16,fontWeight:700,color:C.black}}>{title}</p>
            {subtitle && <p style={{fontSize:11,color:C.light}}>{subtitle}</p>}
          </div>
        </div>
        <div style={{padding:"16px 18px 30px"}}>
          {children}
        </div>
        {footer}
      </div>
    </div>
  );
}

const LegalSection = ({ n, title, children }) => (
  <div style={{marginBottom:18}}>
    <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:8}}>{n}. {title}</p>
    <div style={{fontSize:13,color:C.mid,lineHeight:1.65}}>{children}</div>
  </div>
);

/* ─── CGU ─────────────────────────────────────────── */
function TermsScreen({ onBack }) {
  return (
    <LegalScrollScreen title="Conditions Générales d'Utilisation" subtitle="Mise à jour : avril 2026" onBack={onBack}>
      <div style={{padding:"12px 14px",background:C.bg,borderRadius:12,marginBottom:18}}>
        <p style={{fontSize:12,color:C.dark,lineHeight:1.55}}>
          Bienvenue sur <strong>Byer</strong> 🌍 — la plateforme camerounaise de location de logements et de véhicules.
          En utilisant l'application, vous acceptez les présentes conditions.
        </p>
      </div>

      <LegalSection n="1" title="Objet">
        Byer met en relation des locataires (« Voyageurs ») et des propriétaires/loueurs (« Hôtes »)
        pour la réservation de logements de courte ou longue durée et la location de véhicules.
      </LegalSection>

      <LegalSection n="2" title="Inscription & Compte">
        L'inscription est gratuite. Vous devez avoir 18 ans révolus, fournir des informations exactes
        et être responsable de la confidentialité de vos identifiants. Toute usurpation d'identité
        peut entraîner la suspension immédiate du compte.
      </LegalSection>

      <LegalSection n="3" title="Réservations & Paiements">
        Les réservations sont confirmées après paiement (Mobile Money, virement, ou carte). Byer prélève
        des frais de service de 12 % (court séjour) ou 5 % (mensuel). Les fonds sont sécurisés et reversés
        à l'hôte 24h après l'arrivée du voyageur.
      </LegalSection>

      <LegalSection n="4" title="Annulation">
        Politique flexible par défaut : remboursement intégral jusqu'à 48h avant l'arrivée, 50 % entre 24h
        et 48h, puis non remboursable. Les hôtes peuvent appliquer une politique stricte sur les biens
        d'exception (signalée sur la fiche).
      </LegalSection>

      <LegalSection n="5" title="Comportement attendu">
        Voyageurs et hôtes s'engagent à un comportement respectueux. Les nuisances, dégradations,
        comportements illégaux ou discriminations entraînent une suspension immédiate et un signalement
        aux autorités compétentes.
      </LegalSection>

      <LegalSection n="6" title="Responsabilité">
        Byer agit comme intermédiaire et n'est pas responsable de la qualité réelle des biens ni des
        litiges directs entre parties. Une assistance Byer est disponible 7j/7 pour médiation.
      </LegalSection>

      <LegalSection n="7" title="Résiliation">
        Vous pouvez supprimer votre compte à tout moment depuis les Paramètres. Byer se réserve le droit
        de suspendre ou supprimer un compte en cas de violation des présentes CGU.
      </LegalSection>

      <LegalSection n="8" title="Droit applicable">
        Les présentes CGU sont régies par le droit camerounais. Tout litige relève des tribunaux de
        Douala, après tentative de résolution amiable.
      </LegalSection>

      <p style={{fontSize:11,color:C.light,marginTop:14,textAlign:"center"}}>
        Pour toute question : <strong>support@byer.cm</strong>
      </p>
    </LegalScrollScreen>
  );
}

/* ─── CONFIDENTIALITÉ ───────────────────────────── */
function PrivacyScreen({ onBack }) {
  return (
    <LegalScrollScreen title="Politique de confidentialité" subtitle="Conformité RGPD & Loi camerounaise 2010/012" onBack={onBack}>
      <div style={{padding:"12px 14px",background:"#EFF6FF",borderRadius:12,marginBottom:18,border:"1px solid #BFDBFE"}}>
        <p style={{fontSize:12,color:"#1E3A8A",fontWeight:600,marginBottom:4}}>🔒 Vos données vous appartiennent</p>
        <p style={{fontSize:12,color:C.mid,lineHeight:1.55}}>
          Nous ne vendons jamais vos données. Vous pouvez les exporter ou les supprimer à tout moment.
        </p>
      </div>

      <LegalSection n="1" title="Données collectées">
        Lors de votre inscription : nom, email, téléphone, photo de profil. Lors d'une réservation :
        coordonnées de paiement (chiffrées), historique de séjours, messages échangés avec l'hôte.
        Données techniques : type d'appareil, adresse IP, logs de connexion (90 jours).
      </LegalSection>

      <LegalSection n="2" title="Finalité">
        Vos données servent à : créer votre compte, traiter les réservations, vous envoyer des
        notifications utiles (confirmations, rappels), améliorer le service via des statistiques
        anonymisées, et lutter contre la fraude.
      </LegalSection>

      <LegalSection n="3" title="Partage avec des tiers">
        Vos données ne sont partagées qu'avec : l'hôte concerné par votre réservation (prénom + photo
        seulement avant validation), les prestataires de paiement (MTN MoMo, Orange Money, banques
        partenaires) sous contrat de confidentialité strict, et les autorités sur réquisition légale.
      </LegalSection>

      <LegalSection n="4" title="Cookies & Analytics">
        Byer utilise des cookies essentiels (session, sécurité) et des cookies analytiques anonymisés
        (mesure d'audience). Vous pouvez les refuser depuis les Paramètres → Confidentialité.
      </LegalSection>

      <LegalSection n="5" title="Conservation">
        Compte actif : conservation continue. Compte supprimé : suppression sous 30 jours, sauf obligations
        légales (factures conservées 10 ans). Messages : 2 ans après la dernière interaction.
      </LegalSection>

      <LegalSection n="6" title="Vos droits">
        Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition.
        Pour exercer ces droits : <strong>privacy@byer.cm</strong> ou Paramètres → Mes données.
      </LegalSection>

      <LegalSection n="7" title="Sécurité">
        Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Audits de sécurité
        trimestriels. En cas de violation, notification sous 72h conformément au RGPD.
      </LegalSection>

      <p style={{fontSize:11,color:C.light,marginTop:14,textAlign:"center"}}>
        Délégué à la protection des données : <strong>dpo@byer.cm</strong>
      </p>
    </LegalScrollScreen>
  );
}

/* ─── AIDE & SUPPORT ──────────────────────────── */
function SupportScreen({ onBack }) {
  const [openFAQ, setOpenFAQ]       = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [report, setReport]         = useState({ category: "", message: "" });
  const [sent, setSent]             = useState(false);

  const FAQS = [
    {
      q: "Comment réserver un logement ?",
      a: "Sélectionnez vos dates, le nombre de voyageurs, puis cliquez sur « Réserver ». Le paiement est sécurisé via Mobile Money, virement ou carte bancaire.",
    },
    {
      q: "Que faire si l'hôte ne répond pas ?",
      a: "Patientez 24h après envoi du message. Sans réponse, contactez le support qui interviendra sous 12h pour annuler ou trouver une alternative équivalente.",
    },
    {
      q: "Comment annuler une réservation ?",
      a: "Allez dans Voyages → sélectionnez la réservation → « Annuler ». Le remboursement dépend de la politique d'annulation affichée sur la fiche (généralement flexible : 100% jusqu'à 48h avant).",
    },
    {
      q: "Mes paiements sont-ils sécurisés ?",
      a: "Oui. Tous les paiements transitent par des prestataires agréés (MTN MoMo, Orange Money, banques partenaires). Aucune donnée bancaire n'est stockée par Byer.",
    },
    {
      q: "Comment devenir hôte ?",
      a: "Cliquez sur Profil → « Mettre en location ». Renseignez vos informations et publiez votre première annonce gratuitement. La validation prend 24h en moyenne.",
    },
    {
      q: "Comment fonctionne la caution véhicule ?",
      a: "Une pré-autorisation de 50 000 F est faite sur votre carte ou Mobile Money lors de la prise du véhicule. Elle est libérée automatiquement au retour si le véhicule est rendu en bon état.",
    },
    {
      q: "Puis-je modifier ma réservation ?",
      a: "Oui, jusqu'à 48h avant l'arrivée et sous réserve de disponibilité. Allez dans Voyages → réservation → « Modifier ».",
    },
    {
      q: "Comment recevoir mes paiements (en tant qu'hôte) ?",
      a: "Les fonds sont reversés sur votre Mobile Money ou compte bancaire 24h après l'arrivée du voyageur. Vous configurez cela dans Profil → Espace bailleur → Paiements.",
    },
  ];

  const sendReport = () => {
    setSent(true);
    setTimeout(() => {
      setReportOpen(false);
      setSent(false);
      setReport({ category: "", message: "" });
    }, 1800);
  };

  return (
    <LegalScrollScreen title="Aide & Support" subtitle="Disponible 7j/7 — Réponse moyenne en 12h" onBack={onBack}>
      {/* Contact rapides */}
      <p style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:10}}>Nous contacter</p>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
        <a href="mailto:support@byer.cm"
           style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:C.bg,borderRadius:12,textDecoration:"none",border:`1px solid ${C.border}`}}>
          <div style={{width:40,height:40,borderRadius:10,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📧</div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:600,color:C.dark}}>Email</p>
            <p style={{fontSize:12,color:C.mid}}>support@byer.cm</p>
          </div>
          <Icon name="chevron" size={14} color={C.light}/>
        </a>
        <a href="tel:+237699000000"
           style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:C.bg,borderRadius:12,textDecoration:"none",border:`1px solid ${C.border}`}}>
          <div style={{width:40,height:40,borderRadius:10,background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📞</div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:600,color:C.dark}}>Téléphone</p>
            <p style={{fontSize:12,color:C.mid}}>+237 699 00 00 00 (8h-20h)</p>
          </div>
          <Icon name="chevron" size={14} color={C.light}/>
        </a>
        <a href="https://wa.me/237699000000" target="_blank" rel="noopener noreferrer"
           style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:C.bg,borderRadius:12,textDecoration:"none",border:`1px solid ${C.border}`}}>
          <div style={{width:40,height:40,borderRadius:10,background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💬</div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:600,color:C.dark}}>WhatsApp</p>
            <p style={{fontSize:12,color:C.mid}}>Réponse moyenne 30 min</p>
          </div>
          <Icon name="chevron" size={14} color={C.light}/>
        </a>
      </div>

      {/* FAQ */}
      <p style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:10}}>Questions fréquentes</p>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
        {FAQS.map((f, i) => (
          <div key={i} style={{borderBottom:`1px solid ${C.border}`}}>
            <button
              onClick={()=>setOpenFAQ(openFAQ===i?null:i)}
              style={{
                width:"100%",padding:"14px 0",background:"none",border:"none",
                display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,
                cursor:"pointer",textAlign:"left",fontFamily:"'DM Sans',sans-serif",
              }}>
              <span style={{fontSize:13,fontWeight:600,color:C.dark,flex:1}}>{f.q}</span>
              <span style={{fontSize:18,color:C.light,transition:"transform .2s",transform:openFAQ===i?"rotate(45deg)":"rotate(0)"}}>+</span>
            </button>
            {openFAQ===i && (
              <p style={{fontSize:12.5,color:C.mid,lineHeight:1.7,padding:"0 0 14px"}}>{f.a}</p>
            )}
          </div>
        ))}
      </div>

      {/* Signaler problème */}
      <p style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:10}}>Un souci avec une réservation ?</p>
      <button
        onClick={()=>setReportOpen(true)}
        style={{
          width:"100%",padding:"14px",borderRadius:12,
          border:`1.5px solid ${C.border}`,background:C.white,
          color:C.dark,fontWeight:600,fontSize:13,
          cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
          display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:14,
        }}>
        🛟 Signaler un problème
      </button>

      <p style={{fontSize:11,color:C.light,textAlign:"center",lineHeight:1.6,marginTop:8}}>
        Pour toute urgence (sécurité, fraude) :<br/>
        <strong style={{color:C.coral}}>+237 699 00 00 11</strong> · 24h/24
      </p>

      {/* Modal signaler */}
      {reportOpen && (
        <>
          <div style={{...S.sheetBackdrop,zIndex:200}} onClick={()=>setReportOpen(false)}/>
          <div style={{...S.sheet,zIndex:201,maxHeight:"80vh",display:"flex",flexDirection:"column"}} className="sheet">
            <div style={S.sheetHandle}/>
            <div style={S.sheetHeader}>
              <p style={S.sheetTitle}>Signaler un problème</p>
              <button style={S.sheetClose} onClick={()=>setReportOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div style={{padding:"4px 20px 20px",overflowY:"auto",flex:1}}>
              {!sent ? (
                <>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,marginTop:8}}>Catégorie</label>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                    {["Hôte indisponible","Logement non conforme","Problème paiement","Bug application","Autre"].map(cat => (
                      <button key={cat}
                        onClick={()=>setReport(r=>({...r,category:cat}))}
                        style={{
                          padding:"7px 12px",borderRadius:18,fontSize:12,fontWeight:600,cursor:"pointer",
                          border:`1.5px solid ${report.category===cat?C.coral:C.border}`,
                          background:report.category===cat?"#FFF5F5":C.white,
                          color:report.category===cat?C.coral:C.dark,
                          fontFamily:"'DM Sans',sans-serif",
                        }}>{cat}</button>
                    ))}
                  </div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:C.dark,marginBottom:6}}>Décrivez le problème</label>
                  <textarea
                    value={report.message}
                    onChange={e=>setReport(r=>({...r,message:e.target.value}))}
                    placeholder="Plus vous donnerez de détails, plus vite nous pourrons vous aider…"
                    rows={5}
                    style={{
                      width:"100%",padding:"12px 14px",borderRadius:12,
                      border:`1.5px solid ${C.border}`,fontSize:13,
                      fontFamily:"'DM Sans',sans-serif",resize:"vertical",
                      outline:"none",boxSizing:"border-box",marginBottom:16,
                    }}
                  />
                  <button
                    onClick={sendReport}
                    disabled={!report.category || !report.message.trim()}
                    style={{
                      width:"100%",padding:"14px",borderRadius:12,border:"none",
                      background:(report.category && report.message.trim())?C.coral:C.border,
                      color:"white",fontWeight:700,fontSize:14,
                      cursor:(report.category && report.message.trim())?"pointer":"not-allowed",
                      fontFamily:"'DM Sans',sans-serif",
                    }}>
                    Envoyer le signalement
                  </button>
                </>
              ) : (
                <div style={{textAlign:"center",padding:"40px 20px"}}>
                  <div style={{fontSize:48,marginBottom:12}}>✓</div>
                  <p style={{fontSize:16,fontWeight:700,color:"#16A34A",marginBottom:8}}>Signalement envoyé</p>
                  <p style={{fontSize:12,color:C.mid,lineHeight:1.6}}>Notre équipe vous répondra par email sous 12h.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </LegalScrollScreen>
  );
}

/* ─── MOT DE PASSE OUBLIÉ ──────────────────────── */
function ForgotPasswordScreen({ onBack, prefillEmail }) {
  const [email, setEmail] = useState(prefillEmail || "");
  const [step, setStep]   = useState(1); // 1 = saisie email, 2 = lien envoyé
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSend = async () => {
    setError("");
    if (!isValidEmail) { setError("Adresse email invalide"); return; }
    setLoading(true);

    // ── Reset password réel via Supabase si configuré, sinon mock ──
    const db = window.byer && window.byer.db;
    if (db && db.isReady) {
      const { error: e } = await db.auth.resetPassword(email.trim().toLowerCase());
      setLoading(false);
      if (e) {
        const msg = e.message || "";
        if (/rate limit/i.test(msg)) setError("Trop de tentatives. Réessayez dans quelques minutes.");
        else setError(msg);
        return;
      }
      setStep(2);
      return;
    }

    setLoading(false);
    setStep(2);
  };

  return (
    <LegalScrollScreen title="Mot de passe oublié" onBack={onBack}>
      {step === 1 ? (
        <>
          <div style={{textAlign:"center",margin:"20px 0 28px"}}>
            <div style={{width:64,height:64,borderRadius:16,background:"#FFF5F5",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              <span style={{fontSize:30}}>🔑</span>
            </div>
            <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:8}}>Pas de panique !</p>
            <p style={{fontSize:13,color:C.mid,lineHeight:1.6,padding:"0 12px"}}>
              Saisissez l'email lié à votre compte. Nous vous enverrons un lien sécurisé pour
              définir un nouveau mot de passe.
            </p>
          </div>

          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:C.dark,marginBottom:6}}>
              Adresse email
            </label>
            <input
              type="email" value={email}
              onChange={e=>{setEmail(e.target.value); setError("");}}
              placeholder="vous@exemple.com"
              autoFocus
              style={{
                width:"100%",padding:"13px 14px",borderRadius:12,
                border:`1.5px solid ${error?"#EF4444":C.border}`,
                fontSize:14,fontFamily:"'DM Sans',sans-serif",
                outline:"none",boxSizing:"border-box",
              }}
            />
            {error && <p style={{fontSize:12,color:"#EF4444",marginTop:6}}>{error}</p>}
          </div>

          <button
            onClick={handleSend}
            disabled={!isValidEmail || loading}
            style={{
              width:"100%",padding:"14px",borderRadius:12,border:"none",
              background:isValidEmail?C.coral:C.border,
              color:"white",fontWeight:700,fontSize:14,
              cursor:isValidEmail&&!loading?"pointer":"not-allowed",
              fontFamily:"'DM Sans',sans-serif",marginTop:6,
              opacity:loading?.7:1,
              display:"flex",alignItems:"center",justifyContent:"center",gap:10,
            }}
          >
            {loading && (
              <span style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,.4)",borderTopColor:"white",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
            )}
            {loading ? "Envoi en cours…" : "Envoyer le lien de réinitialisation"}
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </button>

          <p style={{fontSize:11,color:C.light,textAlign:"center",marginTop:18,lineHeight:1.55}}>
            Vous ne recevez rien ? Vérifiez vos courriers indésirables ou contactez{" "}
            <strong>support@byer.cm</strong>
          </p>
        </>
      ) : (
        <div style={{textAlign:"center",padding:"30px 12px"}}>
          <div style={{width:72,height:72,borderRadius:18,background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
            <span style={{fontSize:34}}>✉️</span>
          </div>
          <p style={{fontSize:17,fontWeight:700,color:C.black,marginBottom:10}}>Lien envoyé !</p>
          <p style={{fontSize:13,color:C.mid,lineHeight:1.65,marginBottom:20}}>
            Un email de réinitialisation a été envoyé à <strong style={{color:C.dark}}>{email}</strong>.
            Le lien est valide pendant <strong>30 minutes</strong>.
          </p>
          <button
            onClick={onBack}
            style={{
              width:"100%",padding:"14px",borderRadius:12,border:"none",
              background:C.coral,color:"white",fontWeight:700,fontSize:14,
              cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
            }}
          >
            Retour à la connexion
          </button>
          <button
            onClick={()=>setStep(1)}
            style={{
              width:"100%",padding:"12px",borderRadius:12,border:"none",
              background:"transparent",color:C.mid,fontWeight:600,fontSize:13,
              cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:8,
            }}
          >
            Renvoyer ou changer d'email
          </button>
        </div>
      )}
    </LegalScrollScreen>
  );
}


/* ═══ js/app.js ═══ */
/* Byer — App Shell */

/* ═══════════════════════════════════════════════════
   ADAPTER : transforme une ligne Supabase listings
   (avec listing_photos en relation) vers la "shape mock"
   que home.js / detail.js / components.js / booking.js
   savent déjà afficher (nightPrice, beds, superhost...).
   Ainsi on migre en douceur sans devoir réécrire toutes
   les cartes — Airbnb-style, l'UI s'en fiche d'où
   viennent les données.
   ═══════════════════════════════════════════════════ */
function adaptListing(row) {
  if (!row) return null;
  const photos = (row.listing_photos || [])
    .slice()
    .sort((a, b) => (a.position || 0) - (b.position || 0));
  // Image fallback si aucune photo n'a encore été uploadée
  const firstImg = photos[0]?.url
    || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
  const isVehicle = row.type === "vehicle";
  return {
    id:          row.id,
    type:        row.type,                        // 'property' | 'vehicle'
    propType:    row.subtype,                     // villa, studio, suv, sedan...
    title:       row.title,
    description: row.description,
    city:        row.city,
    zone:        row.zone,
    address:     row.address,
    lat:         row.lat,
    lng:         row.lng,
    nightPrice:  row.price_night,
    monthPrice:  row.price_month,
    rating:      Number(row.rating_avg) || 0,
    reviews:     row.review_count || 0,
    superhost:   !!row.is_superhost,
    beds:        row.bedrooms,
    baths:       row.bathrooms,
    guests:      row.max_guests,
    seats:       isVehicle ? row.max_guests : undefined,
    fuel:        row.fuel,
    trans:       row.transmission,
    brand:       row.brand,
    model:       row.model,
    year:        row.year,
    amenities:   Array.isArray(row.amenities) ? row.amenities : [],
    img:         firstImg,
    _photos:     photos.map(p => p.url),          // gallerie complète
    _supabase:   true,                            // marqueur source
    ownerId:     row.owner_id,
  };
}

/* ═══════════════════════════════════════════════════ */
function ByerApp({ onLogout }) {
  const [tab, setTab]           = useState("home");
  const [segment, setSegment]   = useState("property");
  const [propType, setPropType] = useState("all");
  const [duration, setDuration] = useState("night");
  const [city, setCity]         = useState("Toutes");
  const [location, setLocation] = useState(LOCATIONS[0]); // default: Cameroun
  const [locOpen, setLocOpen]   = useState(false);
  /* Rôle global : locataire | bailleur — persisted via localStorage.
     Lifted ici pour pouvoir être consommé par toutes les sections (Home, Trips, Messages, Profile).
     Toggle disponible depuis le header Home et depuis Profile.                                  */
  const [role, setRole] = useState(() => byerStorage.get("role", "locataire"));
  React.useEffect(() => { byerStorage.set("role", role); }, [role]);
  // Favoris : persisted via localStorage (default = quelques exemples démo)
  const [saved, setSaved]       = useState(() => byerStorage.get("saved", { 2:true, 11:true }));
  // Réservations utilisateur : persisted via localStorage (s'ajoutent aux mocks)
  const [userBookings, setUserBookings] = useState(() => byerStorage.get("bookings", []));

  // ─────────────────────────────────────────────────────────────
  // dbListings : annonces réelles chargées depuis Supabase.
  // Si la table est vide ou Supabase offline → fallback sur les mocks
  // (PROPERTIES / VEHICLES) pour que l'app reste utilisable en démo.
  // Le loader se déclenche au mount + à chaque changement de segment.
  // ─────────────────────────────────────────────────────────────
  const [dbListings, setDbListings] = useState([]);
  const [dbLoading, setDbLoading]   = useState(false);
  React.useEffect(() => {
    let cancelled = false;
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady) return;
    setDbLoading(true);
    (async () => {
      try {
        const { data, error } = await db.listings.list({ type: segment, limit: 100 });
        if (cancelled) return;
        if (error) {
          console.warn("[byer] listings.list error:", error.message);
          setDbListings([]);
        } else {
          setDbListings((data || []).map(adaptListing).filter(Boolean));
        }
      } catch (e) {
        if (!cancelled) setDbListings([]);
      } finally {
        if (!cancelled) setDbLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [segment]);

  // Sauvegarde auto à chaque changement
  React.useEffect(() => { byerStorage.set("saved", saved); }, [saved]);
  React.useEffect(() => { byerStorage.set("bookings", userBookings); }, [userBookings]);
  const [detail, setDetail]     = useState(null);
  const [gallery, setGallery]   = useState(null);
  const [search, setSearch]     = useState("");
  const [rentOpen, setRentOpen]       = useState(false);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [filters, setFilters]   = useState({
    minRating: 0,
    priceMax: 200000,
    guests: 0,
    amenities: [],
    superhostOnly: false,
    instantBook: false,
  });
  const [filterOpen, setFilterOpen]   = useState(false);

  // Compteur de filtres actifs (utilisé pour pastille indicatrice)
  const activeFilterCount =
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceMax < 200000 ? 1 : 0) +
    (filters.guests > 0 ? 1 : 0) +
    (filters.amenities.length > 0 ? 1 : 0) +
    (filters.superhostOnly ? 1 : 0) +
    (filters.instantBook ? 1 : 0);

  // Nettoyer la recherche en quittant l'accueil
  React.useEffect(() => {
    if (tab !== "home" && search !== "") setSearch("");
  }, [tab]);
  const [qrScanOpen, setQrScanOpen]     = useState(false);
  const [qrResult, setQrResult]         = useState(null);  // scanned code
  const [qrInfoOpen, setQrInfoOpen]     = useState(false); // info dialog

  // New feature screens
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [buildingDetail, setBuildingDetail]= useState(null);
  const [techsOpen, setTechsOpen]         = useState(false);
  const [techsRole, setTechsRole]         = useState("locataire");
  const [prosOpen, setProsOpen]           = useState(false);
  const [prosRole, setProsRole]           = useState("locataire");
  const [boostOpen, setBoostOpen]         = useState(false);
  const [notifsOpen, setNotifsOpen]       = useState(false);
  const [publishOpen, setPublishOpen]     = useState(false);
  const [publishSegment, setPublishSegment] = useState(null); // null | "property" | "vehicle"
  const [settingsOpen, setSettingsOpen]   = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [bookingItem, setBookingItem]     = useState(null);
  const [reviewsOpen, setReviewsOpen]     = useState(false);
  const [historyOpen, setHistoryOpen]     = useState(false);
  const [allReviewsItem, setAllReviewsItem] = useState(null);
  const [termsOpen, setTermsOpen]           = useState(false);
  const [privacyOpen, setPrivacyOpen]       = useState(false);
  const [forgotOpen, setForgotOpen]         = useState(false);
  const [supportOpen, setSupportOpen]       = useState(false);

  const toggleSave  = (id, e) => { e?.stopPropagation(); setSaved(p => ({...p,[id]:!p[id]})); };
  const openGallery = (item, idx=0, e) => { e?.stopPropagation(); setGallery({item,idx}); };

  // Switch segment + migration de la durée pour conserver une valeur valide
  const switchSegment = (newSeg) => {
    setSegment(newSeg);
    setDuration(prev => migrateDuration(prev, newSeg));
  };

  // Source de vérité : Supabase si on a des données, sinon mocks pour démo
  const mockItems = segment === "property" ? PROPERTIES : VEHICLES;
  const allItems  = dbListings.length ? dbListings : mockItems;
  const items = allItems.filter(i => {
    // Location filter: "cameroun" = tout, sinon filtre par ville
    if (location.id !== "cameroun" && i.city !== location.id) return false;
    if (segment === "property" && propType !== "all" && i.propType !== propType) return false;
    // Pour les properties seulement : exclure si pas de monthPrice
    if (segment === "property" && duration === "month" && i.monthPrice === null) return false;

    // Filtres avancés
    if (filters.minRating > 0 && i.rating < filters.minRating) return false;
    if (filters.priceMax < 200000 && i.nightPrice > filters.priceMax) return false;
    if (filters.guests > 0) {
      const cap = segment === "vehicle" ? (i.seats || 0) : (i.guests || 0);
      if (cap < filters.guests) return false;
    }
    if (filters.superhostOnly && !i.superhost) return false;
    if (filters.amenities.length > 0) {
      const itemAmens = (i.amenities || []).map(a => a.toLowerCase());
      const allMatch = filters.amenities.every(want =>
        itemAmens.some(have => have.includes(want.toLowerCase()))
      );
      if (!allMatch) return false;
    }
    // instantBook : pas de champ data → on ignore silencieusement (placeholder UX)

    const q = search.toLowerCase();
    return !q || i.title.toLowerCase().includes(q) || i.city.toLowerCase().includes(q);
  });

  if (gallery) return <GalleryScreen item={gallery.item} startIdx={gallery.idx} onBack={()=>setGallery(null)} onOpenDetail={()=>{setDetail(gallery.item);setGallery(null);}}/>;
  if (detail)  return <DetailScreen  item={detail} saved={saved} toggleSave={toggleSave} onBack={()=>setDetail(null)} openGallery={(idx,e)=>openGallery(detail,idx,e)} duration={duration} onViewOwner={name=>setOwnerProfile(name)} onBook={(localDur)=>{ if(localDur)setDuration(localDur); setBookingItem(detail); setDetail(null); }} onOpenAllReviews={(it)=>setAllReviewsItem(it)}/>;
  if (allReviewsItem) return <AllReviewsScreen item={allReviewsItem} onBack={()=>setAllReviewsItem(null)}/>;
  if (rentOpen) return <RentScreen onBack={()=>setRentOpen(false)}/>;
  if (ownerProfile) return <OwnerProfileScreen ownerName={ownerProfile} onBack={()=>setOwnerProfile(null)}/>;

  /* New feature screens */
  if (buildingDetail) return <BuildingDetailScreen building={buildingDetail} onBack={()=>setBuildingDetail(null)}/>;
  if (dashboardOpen)  return <OwnerDashboardScreen
                                onBack={()=>setDashboardOpen(false)}
                                onViewBuilding={b=>{setDashboardOpen(false);setBuildingDetail(b);}}
                                onManageTechs={()=>{setDashboardOpen(false);setTechsRole("bailleur");setTechsOpen(true);}}
                                onManagePros={()=>{setDashboardOpen(false);setProsRole("bailleur");setProsOpen(true);}}
                                onBoost={()=>{setDashboardOpen(false);setBoostOpen(true);}}
                                onAddListing={(seg)=>{setDashboardOpen(false);setPublishSegment(seg);setPublishOpen(true);}}
                              />;
  if (techsOpen)      return <TechniciansScreen onBack={()=>setTechsOpen(false)} role={techsRole}/>;
  if (prosOpen)       return <ProfessionalsScreen onBack={()=>setProsOpen(false)} role={prosRole}/>;
  if (boostOpen)      return <BoostScreen onBack={()=>setBoostOpen(false)}/>;
  if (notifsOpen)      return <NotificationsScreen
                                onBack={()=>setNotifsOpen(false)}
                                onOpenBookings={()=>{ setNotifsOpen(false); setTab("trips"); }}
                                onOpenMessages={()=>{ setNotifsOpen(false); setTab("messages"); }}
                                onOpenRent={()=>{ setNotifsOpen(false); setRentOpen(true); }}
                                onOpenBoost={()=>{ setNotifsOpen(false); setBoostOpen(true); }}
                                onOpenTechs={()=>{ setNotifsOpen(false); setTechsOpen(true); }}
                                onOpenReviews={()=>{ setNotifsOpen(false); setReviewsOpen(true); }}
                              />;
  if (publishOpen)     return <PublishScreen
                                onBack={()=>{setPublishOpen(false);setPublishSegment(null);}}
                                initialSegment={publishSegment}
                              />;
  if (settingsOpen)    return <SettingsScreen
                                onBack={()=>setSettingsOpen(false)}
                                onOpenTerms={()=>setTermsOpen(true)}
                                onOpenPrivacy={()=>setPrivacyOpen(true)}
                                onOpenForgotPassword={()=>setForgotOpen(true)}
                                onOpenSupport={()=>setSupportOpen(true)}
                                onLogout={()=>{ setSettingsOpen(false); onLogout?.(); }}
                                onDeleteAccount={()=>{ setSettingsOpen(false); onLogout?.(); }}
                              />;
  if (termsOpen)       return <TermsScreen   onBack={()=>setTermsOpen(false)}/>;
  if (privacyOpen)     return <PrivacyScreen onBack={()=>setPrivacyOpen(false)}/>;
  if (forgotOpen)      return <ForgotPasswordScreen onBack={()=>setForgotOpen(false)}/>;
  if (supportOpen)     return <SupportScreen onBack={()=>setSupportOpen(false)}/>;
  if (editProfileOpen) return <EditProfileScreen onBack={()=>setEditProfileOpen(false)}/>;
  if (bookingItem)     return <BookingScreen
                                item={bookingItem}
                                duration={duration}
                                onBack={()=>setBookingItem(null)}
                                onComplete={()=>{setBookingItem(null);setTab("trips");}}
                                onCreateBooking={(b)=>setUserBookings(prev=>[b, ...prev])}
                              />;
  if (reviewsOpen)     return <ReviewsScreen onBack={()=>setReviewsOpen(false)}/>;
  if (historyOpen)     return <BookingHistoryScreen onBack={()=>setHistoryOpen(false)}/>;

  return (
    <Shell tab={tab} setTab={setTab}>
      {locOpen && (
        <LocationSheet
          location={location}
          onSelect={loc => { setLocation(loc); setLocOpen(false); }}
          onClose={() => setLocOpen(false)}
        />
      )}
      {filterOpen && (
        <FilterSheet
          filters={filters}
          segment={segment}
          onApply={(newFilters) => { setFilters(newFilters); setFilterOpen(false); }}
          onClose={() => setFilterOpen(false)}
        />
      )}
      {tab==="home" &&
        <HomeScreen
          role={role} setRole={setRole}
          segment={segment} setSegment={switchSegment}
          propType={propType} setPropType={setPropType}
          duration={duration} setDuration={setDuration}
          location={location} onOpenLocPicker={() => setLocOpen(true)}
          search={search} setSearch={setSearch}
          activeFilterCount={activeFilterCount}
          onOpenFilter={() => setFilterOpen(true)}
          items={items} saved={saved}
          toggleSave={toggleSave} openDetail={setDetail} openGallery={openGallery}
          onOpenNotifs={()=>setNotifsOpen(true)}
          onOpenDashboard={()=>setDashboardOpen(true)}
          onOpenPublish={(seg)=>{setPublishSegment(seg||null);setPublishOpen(true);}}
          onOpenPros={()=>{setProsRole("bailleur");setProsOpen(true);}}
          onOpenTechs={()=>{setTechsRole("bailleur");setTechsOpen(true);}}
          onOpenBoost={()=>setBoostOpen(true)}
        />
      }
      {tab==="saved"    && <SavedScreen role={role} items={[...PROPERTIES,...VEHICLES].filter(i=>saved[i.id])} openDetail={setDetail} toggleSave={toggleSave} saved={saved} openGallery={openGallery} duration={duration}/>}
      {tab==="trips"    && <TripsScreen role={role} openDetail={setDetail} userBookings={userBookings} onCancelBooking={(id)=>setUserBookings(prev=>prev.filter(b=>b.id!==id))}/>}
      {tab==="messages" && <MessagesScreen role={role}/>}
      {tab==="messages" && <QRScanButton onClick={() => setQrInfoOpen(true)}/>}
      {tab==="profile"  && <ProfileScreen role={role} setRole={setRole} onOpenRent={() => setRentOpen(true)} onOpenDashboard={()=>setDashboardOpen(true)} onOpenTechs={()=>{setTechsRole(role);setTechsOpen(true);}} onOpenPros={()=>{setProsRole(role);setProsOpen(true);}} onOpenPublish={()=>{setPublishSegment(null);setPublishOpen(true);}} onOpenSettings={()=>setSettingsOpen(true)} onOpenEditProfile={()=>setEditProfileOpen(true)} onOpenReviews={()=>setReviewsOpen(true)} onOpenHistory={()=>setHistoryOpen(true)}/>}

      {/* QR Code info dialog */}
      {qrInfoOpen && <QRInfoDialog onClose={() => setQrInfoOpen(false)} onScan={() => { setQrInfoOpen(false); setQrScanOpen(true); }}/>}
      {/* QR Scanner overlay */}
      {qrScanOpen && <QRScannerOverlay onClose={() => setQrScanOpen(false)} onScan={(code) => { setQrScanOpen(false); setQrResult(code); }}/>}
      {/* QR Verification result */}
      {qrResult && <GuestVerificationSheet code={qrResult} onClose={() => setQrResult(null)}/>}
    </Shell>
  );
}

/* ─── SHELL ─────────────────────────────────────── */
function Shell({ children, tab, setTab }) {
  const nav = [
    {id:"home",icon:"home",label:"Accueil"},{id:"saved",icon:"heart",label:"Favoris"},
    {id:"trips",icon:"trips",label:"Voyages"},{id:"messages",icon:"message",label:"Messages"},
    {id:"profile",icon:"user",label:"Profil"},
  ];
  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={S.scroll}>{children}</div>
      <nav style={S.nav}>
        {nav.map(n => {
          const on = tab===n.id;
          return (
            <button key={n.id} style={S.navBtn} onClick={()=>setTab(n.id)}>
              <Icon name={on&&n.id==="saved"?"heartF":n.icon} size={21} color={on?C.coral:C.light} stroke={on?2:1.7}/>
              <span style={{...S.navLabel,color:on?C.coral:C.light}}>{n.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}


/* ═══ js/main.js ═══ */
/* Byer — Main Entry Point */

function Root() {
  const [screen, setScreen] = useState("splash"); // splash | onboarding | login | signup | forgot | verify | app
  const [forgotPrefill, setForgotPrefill] = useState("");
  const [verifyEmail, setVerifyEmail]     = useState("");
  const [bootChecked, setBootChecked]     = useState(false);

  // ─────────────────────────────────────────────────────────────
  // 1) BOOT : signale au loader qu'on est mount + check session existante.
  //    Si une session Supabase est déjà active (l'utilisateur s'est déjà
  //    connecté avant), on skip splash/onboarding/login et on l'envoie
  //    directement dans l'app — comme Airbnb/WhatsApp.
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    window.dispatchEvent(new Event('byer-ready'));

    let mounted = true;
    (async () => {
      if (window.byer && window.byer.db && window.byer.db.isReady) {
        try {
          const { data } = await window.byer.db.auth.getSession();
          if (mounted && data && data.session) {
            // Session active → on saute direct à l'app
            setScreen("app");
          }
        } catch (e) { /* offline ou clés invalides → on reste sur splash */ }
      }
      if (mounted) setBootChecked(true);
    })();

    // 2) ÉCOUTE les changements de session (login depuis un autre onglet,
    //    expiration de token, magic link revenant en hash, etc.)
    let unsub = () => {};
    if (window.byer && window.byer.db && window.byer.db.isReady) {
      const { data: sub } = window.byer.db.auth.onAuthChange((event, session) => {
        if (event === "SIGNED_IN" && session) setScreen("app");
        if (event === "SIGNED_OUT")           setScreen("login");
      });
      // sub est un wrapper { subscription: { unsubscribe } } selon Supabase v2
      unsub = () => { try { sub.subscription.unsubscribe(); } catch (e) {} };
    }

    return () => { mounted = false; unsub(); };
  }, []);

  // Handler SSO réel (Google / Apple / Facebook)
  const handleSSO = async (provider) => {
    if (!window.byer || !window.byer.db || !window.byer.db.isReady) {
      alert(`Connexion via ${provider} bientôt disponible.`);
      return;
    }
    const map = { Google: "google", Apple: "apple", Facebook: "facebook" };
    const { error } = await window.byer.db.auth.signInOAuth(map[provider] || provider.toLowerCase());
    if (error) alert(`Erreur ${provider} : ${error.message}`);
  };

  // Logout : déconnecte aussi la session Supabase puis revient au login
  const handleLogout = async () => {
    if (window.byer && window.byer.db && window.byer.db.isReady) {
      try { await window.byer.db.auth.signOut(); } catch (e) {}
    }
    setScreen("login");
  };

  if (screen === "splash")      return <SplashScreen    onDone={()=>setScreen("onboarding")}/>;
  if (screen === "onboarding")  return <OnboardingScreen onDone={()=>setScreen("login")}/>;
  if (screen === "login")       return <LoginScreen
                                          onLogin={()=>setScreen("app")}
                                          onSignup={()=>setScreen("signup")}
                                          onSSO={handleSSO}
                                          onForgotPassword={(em)=>{setForgotPrefill(em||"");setScreen("forgot");}}
                                        />;
  if (screen === "signup")      return <SignupScreen
                                          onBack={()=>setScreen("login")}
                                          onDone={()=>setScreen("app")}
                                          onNeedVerify={(em)=>{ setVerifyEmail(em); setScreen("verify"); }}
                                        />;
  if (screen === "verify")      return <VerifyEmailScreen email={verifyEmail} onBack={()=>setScreen("login")}/>;
  if (screen === "forgot")      return <ForgotPasswordScreen prefillEmail={forgotPrefill} onBack={()=>setScreen("login")}/>;
  return <ByerApp onLogout={handleLogout}/>;
}

// Mount
const container = document.getElementById('root');
const reactRoot = ReactDOM.createRoot(container);
reactRoot.render(<Root/>);

