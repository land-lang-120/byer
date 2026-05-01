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
/* ═══════════════════════════════════════════════════
   ADAPTER : transforme une ligne Supabase bookings
   (avec listings + listing_photos joints) vers la shape
   que TripsScreen attend (booking mock).
   Sans ça, les vraies réservations Supabase n'apparaissaient
   pas dans /trips → l'utilisateur changeait d'appareil et
   ses voyages avaient disparu (audit 2026-04-27).
   ═══════════════════════════════════════════════════ */
function adaptBooking(row) {
  if (!row) return null;
  const lst = row.listings || {};
  const photo = (lst.listing_photos || []).slice().sort((a,b)=>(a.position||0)-(b.position||0))[0];
  const img = photo?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
  // Mapping status DB → status TripsScreen attendu (active/upcoming/past)
  // DB enum bookings.status (mig 0001) : 'pending','confirmed','active','completed','cancelled'
  const dbStatus = row.status || "pending";
  let uiStatus = "upcoming";
  if (dbStatus === "active") uiStatus = "active";
  else if (dbStatus === "completed" || dbStatus === "cancelled") uiStatus = "past";
  else if (dbStatus === "confirmed" || dbStatus === "pending") uiStatus = "upcoming";
  return {
    id:        row.id,
    status:    uiStatus,
    rawStatus: dbStatus,                     // pour debug + cancel
    title:     lst.title || "Réservation",
    city:      lst.city || "",
    img,
    checkin:   row.checkin,
    checkout:  row.checkout,
    total:     row.total_price,
    ref:       row.ref,                      // numéro court 6 chiffres
    listingId: row.listing_id,
    qrToken:   row.qr_token || null,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    _supabase: true,
    // v57 fix : champs guest/host (avatar lettre + nom) pour éviter
    // booking.host[0] / booking.guest[0] qui crashe en locataire mode
    // si la résa Supabase n'a pas de profil joint. Bug observé par Pino :
    // "Cannot read properties of undefined (reading '0')".
    // Les profils sont joints via supabase-client bookings.listMine query.
    host:      row.host?.name || "Hôte",
    hostPhoto: row.host?.photo_url || null,
    guest:     row.guest?.name || "Voyageur",
    guestPhoto: row.guest?.photo_url || null,
    guestName: row.guest?.name || null,      // pour le bailleur mode mapping
    // Champs additionnels demandés par le rendu trips.js
    nights:    (() => {
                 if (!row.checkin || !row.checkout) return 1;
                 const ci = new Date(row.checkin);
                 const co = new Date(row.checkout);
                 return Math.max(1, Math.round((co - ci) / 86400000));
               })(),
    price:     row.total_price && row.checkin && row.checkout
                 ? Math.round(row.total_price / Math.max(1, Math.round((new Date(row.checkout) - new Date(row.checkin)) / 86400000)))
                 : 0,
    address:   lst.address || "",
    lat:       lst.lat || null,
    lng:       lst.lng || null,
    type:      lst.type || "property",
    checkIn:   row.checkin,                  // alias (rendu trips.js utilise checkIn capitalisé)
    checkOut:  row.checkout,
    // v67 fix : amenities depuis listings (jsonb array). Sans ça,
    // trips.js ligne 400 `booking.amenities.map(...)` crashait global
    // après "Voir ma réservation" du callback overlay v66.
    amenities: Array.isArray(lst.amenities) ? lst.amenities.slice(0, 6) : [],
  };
}

function adaptListing(row) {
  if (!row) return null;
  const photos = (row.listing_photos || [])
    .slice()
    .sort((a, b) => (a.position || 0) - (b.position || 0));
  // Image fallback si aucune photo n'a encore été uploadée
  const firstImg = photos[0]?.url
    || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
  const isVehicle = row.type === "vehicle";
  // Profile owner peut venir via l'embed `profiles!owner_id(...)` (cf.
  // db.listings.get) ou être absent (cf. db.listings.list qui n'embed pas
  // owner). Dans le 2e cas, ownerName/Photo restent undefined et l'UI
  // tombe sur ses fallbacks neutres.
  const ownerProfile = row.profiles || null;
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
    ownerName:   ownerProfile?.name || null,
    ownerPhoto:  ownerProfile?.photo_url || null,
    ownerVerified: !!ownerProfile?.identity_verified,
    ownerSince:  ownerProfile?.member_since || null,
  };
}

/* ═══════════════════════════════════════════════════ */
function ByerApp({ onLogout }) {
  /* i18n : tick d'invalidation. Quand la langue change dans Settings,
     ce hook bump un counter, ce qui re-rend ByerApp et toute sa
     descendance avec les nouvelles traductions via t(). */
  window.byerI18n.useLangTick();

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

  // ─── v64 : Payment Callback Handler ─────────────────────────────────
  // Quand l'utilisateur revient de Notch Pay avec ?payment=callback&ref=byer_xxx,
  // on affiche un overlay qui poll le statut du paiement en DB toutes les 2s
  // (le webhook met à jour async, donc le statut peut prendre 1-30s à arriver).
  // États : "checking" → "paid" → "failed" / "cancelled" / "timeout"
  // v66 fix : ByerApp se démonte/remonte au boot (probablement quand la
  // session Supabase finit de charger), donc le state local paymentCallback
  // est perdu. On persiste le ref dans sessionStorage pour survivre au
  // remount. Storage cleared dès que le statut devient terminal (paid/
  // failed/cancelled/timeout) ou que l'user ferme l'overlay.
  const PAYMENT_CB_KEY = "byer.paymentCallback";
  const [paymentCallback, setPaymentCallback] = useState(() => {
    // Initial state lazy : lire d'abord sessionStorage, sinon URL
    try {
      const cached = sessionStorage.getItem(PAYMENT_CB_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Si le cache date de plus de 10 min, on l'ignore (sécurité)
        if (parsed && parsed.startedAt && (Date.now() - parsed.startedAt) < 600000) {
          console.log("[byer-cb] initial state restored from sessionStorage", parsed);
          return parsed;
        }
        sessionStorage.removeItem(PAYMENT_CB_KEY);
      }
    } catch (_) {}
    // Fallback : lire l'URL au tout premier mount
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("payment") === "callback") {
        const ref = params.get("ref");
        if (ref) {
          const initial = { ref, status: "checking", startedAt: Date.now() };
          try { sessionStorage.setItem(PAYMENT_CB_KEY, JSON.stringify(initial)); } catch (_) {}
          console.log("[byer-cb] initial state set from URL on mount", initial);
          return initial;
        }
      }
    } catch (_) {}
    return null;
  });
  // Effect : nettoie l'URL une fois que le state est set (juste cosmétique).
  React.useEffect(() => {
    console.log("[byer-cb] mount-once useEffect FIRED. search =", window.location.search, "paymentCallback =", paymentCallback);
    if (paymentCallback && window.location.search.includes("payment=callback")) {
      try {
        window.history.replaceState({}, "", window.location.pathname);
        console.log("[byer-cb] URL cleaned via replaceState (state already set)");
      } catch (e) { console.warn("[byer-cb] replaceState failed:", e); }
    }
  }, []); // mount-once

  // Persist paymentCallback à chaque changement (survit au remount du composant).
  React.useEffect(() => {
    try {
      if (paymentCallback) {
        sessionStorage.setItem(PAYMENT_CB_KEY, JSON.stringify(paymentCallback));
      } else {
        sessionStorage.removeItem(PAYMENT_CB_KEY);
      }
    } catch (_) {}
  }, [paymentCallback]);

  // Poll DB toutes les 2s pour voir si le webhook a updaté payments.status.
  // Timeout 60s au total (30 polls). Si toujours pending → on affiche
  // "En attente de confirmation" + bouton "Voir ma résa".
  React.useEffect(() => {
    console.log("[byer-cb] poll useEffect ran. paymentCallback =", paymentCallback);
    if (!paymentCallback || !paymentCallback.ref) {
      console.log("[byer-cb] no paymentCallback → exit poll effect");
      return;
    }
    if (paymentCallback.status !== "checking") {
      console.log("[byer-cb] status =", paymentCallback.status, "(not checking) → exit poll effect");
      return;
    }
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady) {
      console.warn("[byer-cb] db NOT READY at poll start! db =", db);
      return;
    }
    console.log("[byer-cb] starting poll loop for ref =", paymentCallback.ref);
    let cancelled = false;
    let pollCount = 0;
    const MAX_POLLS = 30; // 30 * 2s = 60s
    const poll = async () => {
      if (cancelled) return;
      pollCount++;
      console.log("[byer-cb] poll #" + pollCount + " querying payments table...");
      try {
        // Query payments by tx_ref (notre ref interne envoyée à Notch Pay)
        const { data, error } = await db.raw
          .from("payments")
          .select("status, booking_id, failure_reason, amount, currency")
          .eq("provider", "notchpay")
          .eq("tx_ref", paymentCallback.ref)
          .maybeSingle();
        if (cancelled) return;
        console.log("[byer-cb] poll #" + pollCount + " result: data =", data, "error =", error);
        if (data && data.status === "success") {
          console.log("[byer-cb] ✅ payment SUCCESS detected → set status=paid");
          setPaymentCallback(p => ({ ...p, status: "paid", payment: data }));
          // Refresh la liste des bookings pour qu'elle apparaisse comme confirmée
          try { refreshDbBookings(); } catch (_) {}
          return; // stop polling
        }
        if (data && (data.status === "failed" || data.status === "cancelled")) {
          console.log("[byer-cb] ❌ payment", data.status, "detected → set status=" + data.status);
          setPaymentCallback(p => ({ ...p, status: data.status, payment: data }));
          return;
        }
        // Still pending → continue polling
        if (pollCount >= MAX_POLLS) {
          console.log("[byer-cb] ⏳ max polls reached → status=timeout");
          setPaymentCallback(p => ({ ...p, status: "timeout", payment: data }));
          return;
        }
        setTimeout(poll, 2000);
      } catch (e) {
        console.warn("[byer-cb] poll #" + pollCount + " EXCEPTION:", e);
        if (!cancelled) setTimeout(poll, 2000);
      }
    };
    poll();
    return () => { console.log("[byer-cb] poll effect cleanup (cancel)"); cancelled = true; };
  }, [paymentCallback]);

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
  // Recherche full-text débouncée — branche sur le RPC search_listings
  // (mig.0005, ts_vector + filtres) dès qu'on tape ≥2 caractères. Tant que
  // searchResults est null, on retombe sur la liste classique (dbListings
  // ou mocks). Quand !== null, c'est la source de vérité.
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
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

  // Recherche full-text via RPC search_listings (mig.0005) — debounce 350ms.
  // Pourquoi un effect séparé : on ne veut pas spammer le backend à chaque
  // touche. On déclenche dès 2 caractères pour éviter les requêtes inutiles
  // sur "a"/"e". Si Supabase n'est pas prêt, on laisse searchResults=null
  // et le filtre client (title/city includes) prendra le relais (mocks).
  React.useEffect(() => {
    const q = search.trim();
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady || q.length < 2) {
      setSearchResults(null);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const { data, error } = await db.listings.search({
          query: q,
          type: segment,
          city: location.id !== "cameroun" ? location.id : null,
          maxPrice: filters.priceMax < 200000 ? filters.priceMax : null,
          minRating: filters.minRating > 0 ? filters.minRating : null,
          amenities: filters.amenities.length ? filters.amenities : null,
          limit: 50,
        });
        if (cancelled) return;
        if (error) {
          console.warn("[byer] search_listings error:", error.message);
          setSearchResults([]);
        } else {
          setSearchResults((data || []).map(adaptListing).filter(Boolean));
        }
      } catch (e) {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 350);
    return () => { cancelled = true; clearTimeout(t); };
  }, [search, segment, location.id, filters.priceMax, filters.minRating, filters.amenities]);
  const [qrScanOpen, setQrScanOpen]     = useState(false);
  const [qrResult, setQrResult]         = useState(null);  // scanned code
  const [qrInfoOpen, setQrInfoOpen]     = useState(false); // info dialog
  const [myQrOpen, setMyQrOpen]         = useState(false); // dialog "Mon QR Code"
  // Conversation ouverte dans Messages → masque la nav bar (UX chat plein écran)
  const [chatActive, setChatActive]     = useState(false);

  /* v57 — openChat lifté ici depuis MessagesScreen pour qu'il survive au
     unmount de MessagesScreen quand DetailScreen prend la place (cas
     "Voir le logement" du menu chat). Sans ça, l'utilisateur revenait
     dans la liste des conversations au lieu de dans la conv où il était
     (audit Pino 2026-04-28). */
  const [messagesOpenChat, setMessagesOpenChat] = useState(null);

  // New feature screens
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [buildingDetail, setBuildingDetail]= useState(null);
  /* listAllFilter : objet { kind:'property'|'vehicle', type, label } pour OwnerListAllScreen */
  const [listAllFilter, setListAllFilter] = useState(null);
  const [techsOpen, setTechsOpen]         = useState(false);
  const [techsRole, setTechsRole]         = useState("locataire");
  const [prosOpen, setProsOpen]           = useState(false);
  const [prosRole, setProsRole]           = useState("locataire");
  const [boostOpen, setBoostOpen]         = useState(false);
  const [notifsOpen, setNotifsOpen]       = useState(false);
  const [publishOpen, setPublishOpen]     = useState(false);
  const [publishSegment, setPublishSegment] = useState(null); // null | "property" | "vehicle"
  /* returnToDashboard : flag pour réafficher le Dashboard quand on quitte
     un sous-écran ouvert depuis le Dashboard (Techniciens, Pros, Boost,
     Publish). Sans ça, on retombait sur l'onglet courant (Profil/Accueil)
     ce qui cassait le flux de navigation bailleur. */
  const [returnToDashboard, setReturnToDashboard] = useState(false);
  const closeAndMaybeReturnToDashboard = (closer) => {
    closer(false);
    if (returnToDashboard) { setDashboardOpen(true); setReturnToDashboard(false); }
  };
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

  // Détecte si l'utilisateur courant est admin → affiche l'entrée "KYC review"
  // dans Settings. La même liste d'emails que côté Edge Function (durci en
  // backend mais utile en frontend pour cacher le bouton aux non-admins).
  const ADMIN_EMAILS = ["pinolando120@gmail.com"];
  const [isAdmin, setIsAdmin] = useState(false);
  const [kycAdminOpen, setKycAdminOpen] = useState(false);

  // Profil utilisateur connecté — chargé depuis Supabase au mount + après
  // édition (refreshCurrentProfile). Sans ça, ProfileScreen/EditProfileScreen
  // affichaient le mock USER ("Pino") à TOUS les utilisateurs (bug critique
  // identifié dans l'audit 2026-04-27 — chaque user voyait son nom remplacé
  // par "Pino" + sa ville par celle de Pino).
  // Quand currentProfile est null → fallback transparent sur USER (mode démo
  // ou Supabase indispo).
  const [currentUserId, setCurrentUserId]   = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const refreshCurrentProfile = React.useCallback(async () => {
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady) return;
    const { data: sess } = await db.auth.getSession();
    const uid = sess?.session?.user?.id;
    const email = sess?.session?.user?.email?.toLowerCase();
    setIsAdmin(!!email && ADMIN_EMAILS.includes(email));
    if (!uid) {
      setCurrentUserId(null);
      setCurrentProfile(null);
      return;
    }
    setCurrentUserId(uid);
    const { data, error } = await db.profiles.get(uid);
    if (!error && data) setCurrentProfile(data);
  }, []);
  React.useEffect(() => { refreshCurrentProfile(); }, [refreshCurrentProfile]);

  // ─────────────────────────────────────────────────────────────
  // dbBookings : vraies réservations chargées depuis Supabase au mount
  // + à chaque changement de role (locataire ↔ bailleur). En mode
  // bailleur on demande role="host" (filtre col host_id), sinon guest_id.
  // Sans ce fetch, TripsScreen ne montrait que la liste localStorage et
  // les mocks démo → réservations perdues entre devices (audit 2026-04-27).
  // ─────────────────────────────────────────────────────────────
  const [dbBookings, setDbBookings] = useState([]);
  const refreshDbBookings = React.useCallback(async () => {
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady || !currentUserId) return;
    const { data, error } = await db.bookings.listMine(currentUserId, role === "bailleur" ? "host" : "guest");
    if (!error && Array.isArray(data)) {
      setDbBookings(data.map(adaptBooking).filter(Boolean));
    } else if (error) {
      console.warn("[byer] bookings.listMine error:", error.message);
    }
  }, [currentUserId, role]);
  React.useEffect(() => { refreshDbBookings(); }, [refreshDbBookings]);

  // ─────────────────────────────────────────────────────────────
  // dbMyListings : annonces publiées par le user connecté.
  // Sert à brancher OwnerDashboard + Home bailleur sur la vraie DB
  // au lieu d'afficher les mocks "Ekwalla M." pour tous les bailleurs
  // (audit 2026-04-27 — Phase 3).
  // ─────────────────────────────────────────────────────────────
  const [dbMyListings, setDbMyListings] = useState([]);
  const refreshDbMyListings = React.useCallback(async () => {
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady || !currentUserId) return;
    const { data, error } = await db.listings.listMine(currentUserId);
    if (!error && Array.isArray(data)) {
      setDbMyListings(data.map(adaptListing).filter(Boolean));
    } else if (error) {
      console.warn("[byer] listings.listMine error:", error.message);
    }
  }, [currentUserId]);
  React.useEffect(() => { refreshDbMyListings(); }, [refreshDbMyListings]);

  // Stats bailleur agrégées depuis dbMyListings + dbBookings.
  // Calculées mémoïsées pour éviter les re-calculs à chaque render.
  // - hostBookings : sous-ensemble des bookings où je suis hôte
  //                  (dbBookings est déjà filtré côté DB par role, mais
  //                   on garde le filtre client pour robustesse)
  // - monthRevenue : somme des total_price des bookings 'active' ou
  //                  'completed' du mois courant
  // - incomingReqs : pending/confirmed (host doit valider/préparer)
  // - activeBookings : status='active' (séjour en cours)
  const ownerStats = React.useMemo(() => {
    const hostBookings = role === "bailleur" ? dbBookings : [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const monthRevenue = hostBookings.reduce((sum, b) => {
      if (!b.checkin || !b.total) return sum;
      const ci = new Date(b.checkin);
      if (ci >= monthStart && ci <= monthEnd && (b.rawStatus === "active" || b.rawStatus === "completed" || b.rawStatus === "confirmed")) {
        return sum + (Number(b.total) || 0);
      }
      return sum;
    }, 0);
    const incomingReqs = hostBookings.filter(b => b.rawStatus === "pending" || b.rawStatus === "confirmed").length;
    const activeBookings = hostBookings.filter(b => b.rawStatus === "active").length;
    return {
      myListingsCount: dbMyListings.length,
      monthRevenue,
      incomingReqs,
      activeBookings,
      hasRealData: dbMyListings.length > 0 || hostBookings.length > 0,
    };
  }, [dbMyListings, dbBookings, role]);

  const toggleSave  = (id, e) => { e?.stopPropagation(); setSaved(p => ({...p,[id]:!p[id]})); };
  const openGallery = (item, idx=0, e) => { e?.stopPropagation(); setGallery({item,idx}); };

  // Switch segment + migration de la durée pour conserver une valeur valide
  const switchSegment = (newSeg) => {
    setSegment(newSeg);
    setDuration(prev => migrateDuration(prev, newSeg));
  };

  // Source de vérité (priorité décroissante) :
  //  1. searchResults — recherche full-text RPC active (search.length ≥ 2)
  //  2. dbListings    — données Supabase chargées au mount
  //  3. mocks         — fallback démo si offline
  const mockItems = segment === "property" ? PROPERTIES : VEHICLES;
  const allItems  = searchResults !== null
    ? searchResults
    : (dbListings.length ? dbListings : mockItems);
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

    // Filtre textuel : si searchResults est actif, le RPC a déjà fait le job
    // (ts_vector pondéré title>city>desc). On n'applique le includes() que
    // sur la liste mock/db pour rester rétro-compatible offline.
    if (searchResults !== null) return true;
    const q = search.toLowerCase();
    return !q || i.title.toLowerCase().includes(q) || i.city.toLowerCase().includes(q);
  });

  // Le bouton "Mon QR Code" affiche le QR de la réservation utilisateur
  // la plus récente (ou la première booking mock si aucune userBooking).
  const myQrBooking = userBookings[0] || BOOKINGS[0];

  /* closeAllOverlays : ferme tous les écrans secondaires en un seul appel.
     Sert quand on clique sur un onglet de la nav bar globale alors qu'un
     écran secondaire est ouvert : on veut basculer vers l'onglet demandé
     et donc fermer ce qui était ouvert par-dessus. */
  const closeAllOverlays = () => {
    setGallery(null);
    setDetail(null);
    setAllReviewsItem(null);
    setRentOpen(false);
    setOwnerProfile(null);
    setBuildingDetail(null);
    setDashboardOpen(false);
    setListAllFilter(null);
    setTechsOpen(false);
    setProsOpen(false);
    setBoostOpen(false);
    setNotifsOpen(false);
    setPublishOpen(false);
    setPublishSegment(null);
    setSettingsOpen(false);
    setTermsOpen(false);
    setPrivacyOpen(false);
    setForgotOpen(false);
    setSupportOpen(false);
    setEditProfileOpen(false);
    setBookingItem(null);
    setReviewsOpen(false);
    setHistoryOpen(false);
    setReturnToDashboard(false);
  };

  /* switchTab : helper passé à BottomNavBar pour fermer tout écran
     secondaire AVANT de changer d'onglet. */
  const switchTab = (newTab) => {
    closeAllOverlays();
    setMessagesOpenChat(null);  // v57 : ferme aussi le chat si ouvert
    setTab(newTab);
  };

  /* v57 — closeTopOverlay : ferme UNIQUEMENT l'overlay le plus visible,
     pas tout. Permet la nav back-stack "page précédente" demandée par
     Pino : chat → detail → back → revient au chat (au lieu de fermer
     les deux). Renvoie true si un overlay a été fermé.
     L'ordre suit la priorité visuelle (cf. screenContent if/else),
     plus messagesOpenChat (chat) en dernier (chat est sous detail mais
     au-dessus de la liste de convs). */
  const closeTopOverlayRef = React.useRef(() => false);
  closeTopOverlayRef.current = () => {
    if (detail)            { setDetail(null); return true; }
    if (gallery)           { setGallery(null); return true; }
    if (allReviewsItem)    { setAllReviewsItem(null); return true; }
    if (rentOpen)          { setRentOpen(false); return true; }
    if (ownerProfile)      { setOwnerProfile(null); return true; }
    if (buildingDetail)    {
      setBuildingDetail(null);
      if (returnToDashboard) { setDashboardOpen(true); setReturnToDashboard(false); }
      return true;
    }
    if (listAllFilter)     { setListAllFilter(null); return true; }
    if (dashboardOpen)     { setDashboardOpen(false); return true; }
    if (techsOpen)         { setTechsOpen(false); return true; }
    if (prosOpen)          { setProsOpen(false); return true; }
    if (boostOpen)         { setBoostOpen(false); return true; }
    if (notifsOpen)        { setNotifsOpen(false); return true; }
    if (publishOpen)       {
      setPublishOpen(false); setPublishSegment(null);
      if (returnToDashboard) { setDashboardOpen(true); setReturnToDashboard(false); }
      return true;
    }
    if (settingsOpen)      { setSettingsOpen(false); return true; }
    if (kycAdminOpen)      { setKycAdminOpen(false); return true; }
    if (termsOpen)         { setTermsOpen(false); return true; }
    if (privacyOpen)       { setPrivacyOpen(false); return true; }
    if (forgotOpen)        { setForgotOpen(false); return true; }
    if (supportOpen)       { setSupportOpen(false); return true; }
    if (editProfileOpen)   { setEditProfileOpen(false); refreshCurrentProfile(); return true; }
    if (bookingItem)       { setBookingItem(null); return true; }
    if (reviewsOpen)       { setReviewsOpen(false); return true; }
    if (historyOpen)       { setHistoryOpen(false); return true; }
    if (messagesOpenChat)  { setMessagesOpenChat(null); return true; }
    return false;
  };

  /* ── Gestion du bouton "Retour" système (Android, navigateur PC) ──
     v57 (refactor v51 : closeAllOverlays → closeTopOverlay) :
     - Au montage : on tag la 1ère entry du history du navigateur comme
       "ancre" (sans en créer une nouvelle).
     - Quand un overlay/chat NOUVEAU s'ouvre (depth augmente) : on push
       une entry dédiée → chaque overlay a sa propre entry d'historique.
     - Au popstate (back système ou history.back()) :
       - On ferme l'overlay du dessus (closeTopOverlayRef.current()).
       - Le browser a déjà popé l'entry correspondante.
       - Pas de re-push : la prochaine entry deviendra le top et le
         prochain back fermera l'overlay suivant (cas chat → detail :
         premier back = ferme detail, second back = ferme chat).
     - Si rien à fermer : on laisse le pop naturel quitter l'app. */

  // Mount-once: anchor + popstate listener
  React.useEffect(() => {
    try {
      const cur = window.history.state || {};
      if (!cur._byerAnchor) {
        window.history.replaceState({ ...cur, _byerAnchor: true }, "");
      }
    } catch (_) {}

    const onPop = () => {
      // closeTopOverlayRef.current() lit l'état le plus récent (ref
      // mise à jour à chaque render au-dessus). Renvoie true si fermé.
      closeTopOverlayRef.current();
      // Pas de re-push : chaque overlay a sa propre entry, et si rien à
      // fermer le pop naturel suit son cours (anchor consumé → exit).
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* Hide nav bar dans certains contextes immersifs :
     - Conversation chat (UX plein écran)
     - Galerie photo plein écran
     - Scanner QR overlay (caméra plein écran)
     - TOUT écran secondaire (Settings, Publish, Dashboard, Detail, etc.)
       → la nav bar ne doit apparaître QUE sur les 5 onglets principaux. */
  const onSecondaryScreen = !!detail || !!gallery || !!allReviewsItem
    || rentOpen || !!ownerProfile || !!buildingDetail || dashboardOpen
    || !!listAllFilter || techsOpen || prosOpen || boostOpen || notifsOpen
    || publishOpen || settingsOpen || kycAdminOpen || termsOpen || privacyOpen || forgotOpen
    || supportOpen || editProfileOpen || !!bookingItem || reviewsOpen || historyOpen;
  const hideGlobalNav = chatActive || !!gallery || qrScanOpen || onSecondaryScreen;

  /* v57 — Push UNE entry d'historique pour CHAQUE nouvel overlay/chat
     ouvert. Avant : un seul push global → le back fermait tout. Maintenant
     chaque ouverture incrémente la profondeur, et chaque back en pop une.
     Inclut messagesOpenChat pour que le bouton retour téléphone ferme
     d'abord le chat puis chaque overlay au-dessus.

     overlayDepth = nombre d'overlays/chat actuellement ouverts.
     prevDepthRef = la valeur précédente.
     Si depth a augmenté → un nouveau s'est ouvert → on push une entry. */
  const overlayDepth =
      (detail?1:0) + (gallery?1:0) + (allReviewsItem?1:0) + (rentOpen?1:0)
    + (ownerProfile?1:0) + (buildingDetail?1:0) + (dashboardOpen?1:0)
    + (listAllFilter?1:0) + (techsOpen?1:0) + (prosOpen?1:0)
    + (boostOpen?1:0) + (notifsOpen?1:0) + (publishOpen?1:0)
    + (settingsOpen?1:0) + (kycAdminOpen?1:0) + (termsOpen?1:0)
    + (privacyOpen?1:0) + (forgotOpen?1:0) + (supportOpen?1:0)
    + (editProfileOpen?1:0) + (bookingItem?1:0) + (reviewsOpen?1:0)
    + (historyOpen?1:0) + (messagesOpenChat?1:0);
  const prevDepthRef = React.useRef(0);
  React.useEffect(() => {
    if (overlayDepth > prevDepthRef.current) {
      try { window.history.pushState({ _byerOverlay: true, depth: overlayDepth }, ""); } catch (_) {}
    }
    prevDepthRef.current = overlayDepth;
  }, [overlayDepth]);

  /* renderScreen : sélectionne l'écran courant. Une seule sortie pour
     que le nav bar soit toujours rendu en dessous (au niveau racine). */
  let screenContent;
  if (detail) {
    screenContent = <DetailScreen item={detail} saved={saved} toggleSave={toggleSave} onBack={()=>setDetail(null)} openGallery={(idx,e)=>openGallery(detail,idx,e)} duration={duration} onViewOwner={name=>setOwnerProfile(name)} onBook={(localDur)=>{ if(localDur)setDuration(localDur); setBookingItem(detail); setDetail(null); }} onOpenAllReviews={(it)=>setAllReviewsItem(it)}/>;
  } else if (gallery) {
    screenContent = <GalleryScreen item={gallery.item} startIdx={gallery.idx} onBack={()=>setGallery(null)} onOpenDetail={()=>{setDetail(gallery.item);setGallery(null);}}/>;
  } else if (allReviewsItem) {
    screenContent = <AllReviewsScreen item={allReviewsItem} onBack={()=>setAllReviewsItem(null)}/>;
  } else if (rentOpen) {
    screenContent = <RentScreen onBack={()=>setRentOpen(false)}/>;
  } else if (ownerProfile) {
    screenContent = <OwnerProfileScreen ownerName={ownerProfile} onBack={()=>setOwnerProfile(null)}/>;
  } else if (buildingDetail) {
    screenContent = <BuildingDetailScreen building={buildingDetail} onBack={()=>{ setBuildingDetail(null); if (returnToDashboard) { setDashboardOpen(true); setReturnToDashboard(false); } }}/>;
  } else if (dashboardOpen) {
    screenContent = <OwnerDashboardScreen
                      currentProfile={currentProfile}
                      dbMyListings={dbMyListings}
                      ownerStats={ownerStats}
                      onBack={()=>setDashboardOpen(false)}
                      onViewBuilding={b=>{setDashboardOpen(false);setBuildingDetail(b);setReturnToDashboard(true);}}
                      onManageTechs={()=>{setDashboardOpen(false);setTechsRole("bailleur");setTechsOpen(true);setReturnToDashboard(true);}}
                      onManagePros={()=>{setDashboardOpen(false);setProsRole("bailleur");setProsOpen(true);setReturnToDashboard(true);}}
                      onBoost={()=>{setDashboardOpen(false);setBoostOpen(true);setReturnToDashboard(true);}}
                      onAddListing={(seg)=>{setDashboardOpen(false);setPublishSegment(seg);setPublishOpen(true);setReturnToDashboard(true);}}
                      onViewAll={(filter)=>{setDashboardOpen(false);setListAllFilter(filter);setReturnToDashboard(true);}}
                    />;
  } else if (listAllFilter) {
    screenContent = <OwnerListAllScreen
                      currentProfile={currentProfile}
                      dbMyListings={dbMyListings}
                      filter={listAllFilter}
                      onBack={()=>{ setListAllFilter(null); if (returnToDashboard) { setDashboardOpen(true); setReturnToDashboard(false); } }}
                      onViewBuilding={b=>{ setListAllFilter(null); setBuildingDetail(b); setReturnToDashboard(true); }}
                    />;
  } else if (techsOpen) {
    screenContent = <TechniciansScreen onBack={()=>closeAndMaybeReturnToDashboard(setTechsOpen)} role={techsRole}/>;
  } else if (prosOpen) {
    screenContent = <ProfessionalsScreen onBack={()=>closeAndMaybeReturnToDashboard(setProsOpen)} role={prosRole}/>;
  } else if (boostOpen) {
    screenContent = <BoostScreen onBack={()=>closeAndMaybeReturnToDashboard(setBoostOpen)}/>;
  } else if (notifsOpen) {
    screenContent = <NotificationsScreen
                      currentUserId={currentUserId}
                      onBack={()=>setNotifsOpen(false)}
                      onOpenBookings={()=>{ setNotifsOpen(false); setTab("trips"); }}
                      onOpenMessages={()=>{ setNotifsOpen(false); setTab("messages"); }}
                      onOpenRent={()=>{ setNotifsOpen(false); setRentOpen(true); }}
                      onOpenBoost={()=>{ setNotifsOpen(false); setBoostOpen(true); }}
                      onOpenTechs={()=>{ setNotifsOpen(false); setTechsOpen(true); }}
                      onOpenReviews={()=>{ setNotifsOpen(false); setReviewsOpen(true); }}
                    />;
  } else if (publishOpen) {
    screenContent = <PublishScreen
                      onBack={()=>{
                        setPublishOpen(false);setPublishSegment(null);
                        if (returnToDashboard) { setDashboardOpen(true); setReturnToDashboard(false); }
                      }}
                      initialSegment={publishSegment}
                    />;
  } else if (settingsOpen) {
    screenContent = <SettingsScreen
                      onBack={()=>setSettingsOpen(false)}
                      onOpenTerms={()=>setTermsOpen(true)}
                      onOpenPrivacy={()=>setPrivacyOpen(true)}
                      onOpenForgotPassword={()=>setForgotOpen(true)}
                      onOpenSupport={()=>setSupportOpen(true)}
                      isAdmin={isAdmin}
                      onOpenKycAdmin={()=>{ setSettingsOpen(false); setKycAdminOpen(true); }}
                      onLogout={()=>{ setSettingsOpen(false); onLogout?.(); }}
                      onDeleteAccount={()=>{ setSettingsOpen(false); onLogout?.(); }}
                    />;
  } else if (kycAdminOpen) {
    screenContent = <KycAdminScreen onBack={()=>setKycAdminOpen(false)}/>;
  } else if (termsOpen)       { screenContent = <TermsScreen   onBack={()=>setTermsOpen(false)}/>; }
  else if (privacyOpen)       { screenContent = <PrivacyScreen onBack={()=>setPrivacyOpen(false)}/>; }
  else if (forgotOpen)        { screenContent = <ForgotPasswordScreen onBack={()=>setForgotOpen(false)}/>; }
  else if (supportOpen)       { screenContent = <SupportScreen onBack={()=>setSupportOpen(false)}/>; }
  else if (editProfileOpen)   { screenContent = <EditProfileScreen
                                                   currentProfile={currentProfile}
                                                   currentUserId={currentUserId}
                                                   onSaved={refreshCurrentProfile}
                                                   onBack={()=>{ setEditProfileOpen(false); refreshCurrentProfile(); }}
                                                 />; }
  else if (bookingItem) {
    screenContent = <BookingScreen
                      item={bookingItem}
                      duration={duration}
                      onBack={()=>setBookingItem(null)}
                      onComplete={()=>{setBookingItem(null);setTab("trips");}}
                      onCreateBooking={(b)=>setUserBookings(prev=>[b, ...prev])}
                    />;
  } else if (reviewsOpen)     { screenContent = <ReviewsScreen onBack={()=>setReviewsOpen(false)}/>; }
  else if (historyOpen)       { screenContent = <BookingHistoryScreen onBack={()=>setHistoryOpen(false)}/>; }
  else {
    /* Onglets principaux dans le Shell */
    screenContent = (
      <Shell hideNav={chatActive}>
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
          searchLoading={searchLoading}
          activeFilterCount={activeFilterCount}
          onOpenFilter={() => setFilterOpen(true)}
          items={items} saved={saved}
          toggleSave={toggleSave} openDetail={setDetail} openGallery={openGallery}
          /* Phase 3 : stats bailleur réelles (Supabase) ; HomeScreen bascule
             en mode "vraies données" si ownerStats.hasRealData=true.
             Sinon affiche le bandeau démo + chiffres mock pour design preview. */
          ownerStats={ownerStats}
          dbMyListings={dbMyListings}
          onOpenNotifs={()=>setNotifsOpen(true)}
          onOpenDashboard={()=>setDashboardOpen(true)}
          onOpenPublish={(seg)=>{setPublishSegment(seg||null);setPublishOpen(true);}}
          onOpenPros={()=>{setProsRole("bailleur");setProsOpen(true);}}
          onOpenTechs={()=>{setTechsRole("bailleur");setTechsOpen(true);}}
          onOpenBoost={()=>setBoostOpen(true)}
        />
      }
      {tab==="saved"    && <SavedScreen
                              role={role}
                              /*
                                Source de vérité favoris :
                                  - Les annonces Supabase (dbListings) ET les mocks (PROPERTIES + VEHICLES).
                                  - On dédoublonne par id (priorité Supabase si même id).
                                Sans ça, un user qui mettait en favori une vraie annonce ne la
                                retrouvait jamais dans Favoris (audit 2026-04-27).
                              */
                              items={(() => {
                                const all = [...dbListings];
                                const seen = new Set(all.map(i => i.id));
                                [...PROPERTIES, ...VEHICLES].forEach(i => {
                                  if (!seen.has(i.id)) all.push(i);
                                });
                                return all.filter(i => saved[i.id]);
                              })()}
                              openDetail={setDetail}
                              toggleSave={toggleSave}
                              saved={saved}
                              openGallery={openGallery}
                              duration={duration}
                           />}
      {tab==="trips"    && <TripsScreen
                              role={role}
                              openDetail={setDetail}
                              userBookings={dbBookings.length ? dbBookings : userBookings}
                              dbBookingsLoaded={dbBookings.length > 0}
                              onCancelBooking={async (id) => {
                                // 1) si réservation Supabase → RPC cancel_booking (atomique avec refund)
                                const target = dbBookings.find(b => b.id === id);
                                if (target && target._supabase) {
                                  const db = window.byer && window.byer.db;
                                  if (db && db.isReady) {
                                    const { error } = await db.bookings.cancel(id, "Annulation utilisateur");
                                    if (!error) await refreshDbBookings();
                                    return;
                                  }
                                }
                                // 2) fallback localStorage pour les vieilles résa démo
                                setUserBookings(prev => prev.filter(b => b.id !== id));
                              }}
                            />}
      {/* Boutons QR sur l'onglet Voyages :
          - "Mon QR Code" (icône noire / fond blanc) au-dessus → locataire présente son QR
          - "Scanner QR" (coral) en dessous → bailleur scanne le QR du voyageur
          Plus visible dans Messages (mauvaise ergonomie en chat). */}
      {tab==="trips" && <MyQRCodeButton onClick={() => setMyQrOpen(true)}/>}
      {tab==="trips" && <QRScanButton onClick={() => setQrInfoOpen(true)}/>}
      {tab==="messages" && <MessagesScreen
                              role={role}
                              onChatActiveChange={setChatActive}
                              openChat={messagesOpenChat}
                              setOpenChat={setMessagesOpenChat}
                              /* "Voir le logement" depuis le menu d'une conversation :
                                 résout l'objet listing depuis (1) listingId si fourni
                                 (Supabase via embed conversations.listing_id) ou (2)
                                 le titre `logement` (mocks). Ouvre DetailScreen. */
                              onOpenListing={(conv) => {
                                if (!conv) return;
                                const candidates = [...dbListings, ...PROPERTIES, ...VEHICLES];
                                let item = null;
                                if (conv.listingId) {
                                  item = candidates.find(i => i.id === conv.listingId) || null;
                                }
                                if (!item && conv.logement) {
                                  item = candidates.find(i => i.title === conv.logement) || null;
                                }
                                if (item) setDetail(item);
                              }}
                            />}
      {tab==="profile"  && <ProfileScreen role={role} setRole={setRole} currentProfile={currentProfile} onOpenRent={() => setRentOpen(true)} onOpenDashboard={()=>setDashboardOpen(true)} onOpenTechs={()=>{setTechsRole(role);setTechsOpen(true);}} onOpenPros={()=>{setProsRole(role);setProsOpen(true);}} onOpenPublish={()=>{setPublishSegment(null);setPublishOpen(true);}} onOpenSettings={()=>setSettingsOpen(true)} onOpenEditProfile={()=>setEditProfileOpen(true)} onOpenReviews={()=>setReviewsOpen(true)} onOpenHistory={()=>setHistoryOpen(true)} onLogout={onLogout}/>}

      {/* My QR Code dialog (locataire) */}
      {myQrOpen && <MyQRCodeDialog booking={myQrBooking} onClose={() => setMyQrOpen(false)}/>}
      {/* QR Code info dialog */}
      {qrInfoOpen && <QRInfoDialog onClose={() => setQrInfoOpen(false)} onScan={() => { setQrInfoOpen(false); setQrScanOpen(true); }}/>}
      {/* QR Scanner overlay */}
      {qrScanOpen && <QRScannerOverlay onClose={() => setQrScanOpen(false)} onScan={(code) => { setQrScanOpen(false); setQrResult(code); }}/>}
      {/* QR Verification result */}
      {qrResult && <GuestVerificationSheet code={qrResult} onClose={() => setQrResult(null)}/>}
    </Shell>
  );
  }

  /* Render final : l'écran courant + la nav bar globale.
     La nav est TOUJOURS rendue (pas de unmount) pour éviter qu'elle
     "saute" visuellement quand on quitte un écran secondaire. Elle est
     juste masquée via opacity+pointer-events quand hideGlobalNav=true.
     Avantage : sa position fixe (bottom:0) est stable, et pas de
     re-mount qui déclenche un repaint visible. */
  return (
    <>
      {screenContent}
      <div style={{
        opacity: hideGlobalNav ? 0 : 1,
        visibility: hideGlobalNav ? "hidden" : "visible",
        pointerEvents: hideGlobalNav ? "none" : "auto",
        transition: "opacity 0.12s ease",
      }}>
        <BottomNavBar tab={tab} setTab={switchTab}/>
      </div>

      {/* v64 : Payment Callback Overlay — affiché au retour de Notch Pay
           avec ?payment=callback&ref=byer_xxx. Poll DB jusqu'à un statut
           terminal (paid / failed / cancelled) ou timeout 60s. */}
      {paymentCallback && (
        <PaymentCallbackOverlay
          callback={paymentCallback}
          onClose={() => setPaymentCallback(null)}
          onViewBooking={() => { setPaymentCallback(null); switchTab("trips"); }}
        />
      )}
    </>
  );
}

/* ─── Payment Callback Overlay (v64) ───────────────────────────────
   Plein écran semi-transparent avec carte centrée. État dérivé de
   callback.status :
   - "checking"  : spinner + "Vérification du paiement…"
   - "paid"      : ✅ vert + "Paiement confirmé" + bouton Voir ma résa
   - "failed"    : ❌ rouge + raison + bouton Réessayer / Fermer
   - "cancelled" : ⚠️ orange + "Paiement annulé" + bouton Fermer
   - "timeout"   : ⏳ "Confirmation en cours côté banque" + bouton Voir ma résa */
function PaymentCallbackOverlay({ callback, onClose, onViewBooking }) {
  console.log("[byer-cb] PaymentCallbackOverlay RENDER with callback =", callback);
  const status = callback.status;
  const isFinal = status === "paid" || status === "failed" || status === "cancelled" || status === "timeout";
  const config = {
    checking:  { icon: "⏳", color: "#6366F1", bg: "#EEF2FF",  title: "Vérification du paiement…",        sub: "Nous attendons la confirmation de votre banque. Cela prend quelques secondes." },
    paid:      { icon: "✅", color: "#16A34A", bg: "#DCFCE7",  title: "Paiement confirmé",                   sub: "Votre réservation est confirmée. L'hôte a été notifié." },
    failed:    { icon: "❌", color: "#DC2626", bg: "#FEE2E2",  title: "Paiement échoué",                     sub: callback.payment?.failure_reason || "Le paiement n'a pas pu être finalisé. Réessayez." },
    cancelled: { icon: "⚠️", color: "#EA580C", bg: "#FED7AA",  title: "Paiement annulé",                     sub: "Vous avez annulé le paiement. Vous pouvez réessayer depuis vos voyages." },
    timeout:   { icon: "⏳", color: "#0891B2", bg: "#CFFAFE",  title: "Confirmation en cours",               sub: "Le paiement est toujours en traitement côté opérateur. Vous serez notifié quand il sera confirmé." },
  }[status] || {};
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        backgroundColor: "#fff", borderRadius: 20, padding: "32px 24px",
        maxWidth: 380, width: "100%", textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          backgroundColor: config.bg, color: config.color,
          fontSize: 36, lineHeight: "72px",
          margin: "0 auto 20px", display: "inline-block",
        }}>{config.icon}</div>
        {status === "checking" && (
          <div style={{
            width: 28, height: 28, margin: "0 auto 16px",
            border: "3px solid #E0E7FF", borderTopColor: config.color,
            borderRadius: "50%", animation: "byer-spin 0.8s linear infinite",
          }}/>
        )}
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>
          {config.title}
        </div>
        <div style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.5, marginBottom: 24 }}>
          {config.sub}
        </div>
        {callback.payment?.amount && (
          <div style={{
            fontSize: 13, color: "#1A1A1A", fontWeight: 600,
            padding: "10px 14px", backgroundColor: "#F7F7F7",
            borderRadius: 10, marginBottom: 20, display: "inline-block",
          }}>
            {callback.payment.amount.toLocaleString("fr-FR")} {callback.payment.currency || "FCFA"}
          </div>
        )}
        {isFinal && (
          <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
            {(status === "paid" || status === "timeout") && (
              <button onClick={onViewBooking} style={{
                width: "100%", padding: "13px 16px", borderRadius: 12,
                border: "none", backgroundColor: "#FF5A5F", color: "white",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}>
                Voir ma réservation
              </button>
            )}
            <button onClick={onClose} style={{
              width: "100%", padding: "13px 16px", borderRadius: 12,
              border: "1.5px solid #EBEBEB", backgroundColor: "#fff", color: "#1A1A1A",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>
              {status === "paid" ? "Continuer" : "Fermer"}
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes byer-spin { from {transform:rotate(0)} to {transform:rotate(360deg)} } @keyframes fadeIn { from {opacity:0} to {opacity:1} }`}</style>
    </div>
  );
}

/* ─── SHELL ─────────────────────────────────────── */
/* La nav bar est désormais rendue séparément (BottomNavBar) au niveau
   racine de ByerApp pour rester visible sur TOUS les écrans (y compris
   les écrans secondaires qui replacent le Shell). Shell ne contient
   donc plus que le scroll wrapper. */
function Shell({ children, hideNav }) {
  const scrollStyle = hideNav ? {...S.scroll, paddingBottom: 0} : S.scroll;
  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={scrollStyle}>{children}</div>
    </div>
  );
}

/* ─── BOTTOM NAV BAR (fixed, always visible) ─────
   Rendue au niveau racine de ByerApp. position:fixed dans S.nav
   garantit la visibilité sur tous les écrans. Cliquer sur un onglet
   ferme automatiquement tout écran secondaire ouvert (via setTab
   qui appelle closeAll). */
function BottomNavBar({ tab, setTab }) {
  const nav = [
    {id:"home",icon:"home",label:t("nav.home")},
    {id:"saved",icon:"heart",label:t("nav.favorites") === "nav.favorites" ? "Favoris" : t("nav.favorites")},
    {id:"trips",icon:"trips",label:t("nav.trips")},
    {id:"messages",icon:"message",label:t("nav.messages")},
    {id:"profile",icon:"user",label:t("nav.profile")},
  ];
  return (
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
  );
}
