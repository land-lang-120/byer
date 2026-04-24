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
