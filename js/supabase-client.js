/* ═══════════════════════════════════════════════════
   Byer — Supabase Client Wrapper
   Exposé : window.byer.db
   Toutes les méthodes sont async et renvoient { data, error }.
   Si Supabase n'est pas configuré (SUPABASE_READY=false),
   les méthodes renvoient { data:null, error:{message:"offline"} }
   pour que l'UI continue de fonctionner avec les mocks.

   Couvre les 7 migrations :
   0001-0003 : schéma initial + RLS + storage
   0004     : auth (KYC, 2FA, trusted devices, parrainage RPC)
   0005     : listings (search, nearby, toggle_active, photos taggées)
   0006     : bookings (anti double-résa, cancel, QR, payout)
   0007     : reviews 8 critères, rewards_catalog, anti-triche points,
              chat (block, mark_read, unread_count)
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
    signUp: async (email, password, name) => {
      return await sb.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
    },
    signIn: async (email, password) => {
      return await sb.auth.signInWithPassword({ email, password });
    },
    signInMagicLink: async (email) => {
      return await sb.auth.signInWithOtp({ email });
    },
    signInSMS: async (phone) => {
      return await sb.auth.signInWithOtp({ phone });
    },
    verifySMS: async (phone, token) => {
      return await sb.auth.verifyOtp({ phone, token, type: "sms" });
    },
    signInOAuth: async (provider) => {
      return await sb.auth.signInWithOAuth({ provider });
    },
    resetPassword: async (email) => {
      return await sb.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/?reset=1",
      });
    },
    updatePassword: async (newPassword) => {
      return await sb.auth.updateUser({ password: newPassword });
    },
    signOut: async () => sb.auth.signOut(),
    getUser: async () => sb.auth.getUser(),
    getSession: async () => sb.auth.getSession(),
    onAuthChange: (cb) => sb.auth.onAuthStateChange(cb),

    // RPC parrainage (migration 0004)
    checkReferralCode: async (code) => sb.rpc("check_referral_code", { p_code: code }),
    applyReferralCode: async (code) => sb.rpc("apply_referral_code", { p_code: code }),
    requestAccountDeletion: async ()    => sb.rpc("delete_my_account_request"),
  };

  // ──────────────────────────────────────────────────
  //  PROFILES
  // ──────────────────────────────────────────────────
  const profiles = {
    get: async (userId) => {
      return await sb.from("profiles").select("*").eq("id", userId).single();
    },
    // ⚠️ rewards_points / referral_count NE PEUVENT PAS être modifiés ici
    // (RLS policy profiles_self_update_safe) → utiliser rewards.redeem(...)
    update: async (userId, patch) => {
      return await sb.from("profiles").update(patch).eq("id", userId).select().single();
    },
    findByReferralCode: async (code) => {
      return await sb.from("profiles").select("id,name").eq("referral_code", code).single();
    },
  };

  // ──────────────────────────────────────────────────
  //  KYC (migration 0004)
  // ──────────────────────────────────────────────────
  const kyc = {
    list: async (userId) => sb.from("kyc_documents")
      .select("*").eq("user_id", userId)
      .order("uploaded_at", { ascending: false }),

    upload: async (file, userId, docType) => {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${docType}-${Date.now()}.${ext}`;
      const { error: upErr } = await sb.storage
        .from("kyc-documents")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) return { data: null, error: upErr };
      // Insertion du record
      return await sb.from("kyc_documents").insert({
        user_id: userId,
        doc_type: docType,
        file_path: path,
        status: "pending",
      }).select().single();
    },

    delete: async (id, filePath) => {
      await sb.storage.from("kyc-documents").remove([filePath]);
      return await sb.from("kyc_documents").delete().eq("id", id);
    },
  };

  // ──────────────────────────────────────────────────
  //  TRUSTED DEVICES (migration 0004)
  // ──────────────────────────────────────────────────
  const devices = {
    list: async (userId) => sb.from("trusted_devices")
      .select("*").eq("user_id", userId)
      .order("last_seen_at", { ascending: false }),

    register: async (userId, deviceName, fingerprint) => sb.from("trusted_devices")
      .upsert({
        user_id: userId,
        device_name: deviceName,
        fingerprint,
        last_seen_at: new Date().toISOString(),
      }, { onConflict: "user_id,fingerprint" })
      .select().single(),

    remove: async (id) => sb.from("trusted_devices").delete().eq("id", id),
  };

  // ──────────────────────────────────────────────────
  //  LISTINGS (migrations 0001 + 0005)
  // ──────────────────────────────────────────────────
  const listings = {
    list: async ({ type, city, limit = 30 } = {}) => {
      let q = sb.from("listings")
        .select("*, listing_photos(url, position, tag)")
        .eq("is_active", true)
        .order("rating_avg", { ascending: false })
        .limit(limit);
      if (type) q = q.eq("type", type);
      if (city) q = q.eq("city", city);
      return await q;
    },

    get: async (id) => sb.from("listings")
      .select("*, listing_photos(url, position, tag), profiles!owner_id(name, photo_url, avatar_letter, avatar_bg, member_since, is_superhost, identity_verified)")
      .eq("id", id).single(),

    create: async (data) => sb.from("listings").insert(data).select().single(),

    update: async (id, patch) => sb.from("listings").update(patch).eq("id", id).select().single(),

    remove: async (id) => sb.from("listings").delete().eq("id", id),

    listMine: async (userId) => sb.from("listings")
      .select("*, listing_photos(url, position, tag)")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false }),

    // RPC migration 0005 — full-text search pondéré + filtres
    search: async ({ query, type, subtype, city, minPrice, maxPrice, minRating, amenities, limit = 30, offset = 0 } = {}) =>
      sb.rpc("search_listings", {
        p_query: query || null,
        p_type: type || null,
        p_subtype: subtype || null,
        p_city: city || null,
        p_min_price: minPrice ?? null,
        p_max_price: maxPrice ?? null,
        p_min_rating: minRating ?? null,
        p_amenities: amenities || null,
        p_limit: limit,
        p_offset: offset,
      }),

    // RPC migration 0005 — proximité géo
    nearby: async ({ lat, lng, radiusKm = 10, type, limit = 20 } = {}) =>
      sb.rpc("nearby_listings", {
        p_lat: lat,
        p_lng: lng,
        p_radius_km: radiusKm,
        p_type: type || null,
        p_limit: limit,
      }),

    // RPC migration 0005 — bascule actif/inactif (avec check propriétaire)
    toggleActive: async (listingId) =>
      sb.rpc("toggle_listing_active", { p_listing_id: listingId }),
  };

  // ──────────────────────────────────────────────────
  //  LISTING PHOTOS (migration 0005)
  // ──────────────────────────────────────────────────
  const photos = {
    listForListing: async (listingId) => sb.from("listing_photos")
      .select("*").eq("listing_id", listingId)
      .order("position", { ascending: true }),

    insert: async (listingId, url, position, tag = null) =>
      sb.from("listing_photos")
        .insert({ listing_id: listingId, url, position, tag })
        .select().single(),

    updateTag: async (photoId, tag) => sb.from("listing_photos")
      .update({ tag }).eq("id", photoId),

    remove: async (photoId) => sb.from("listing_photos")
      .delete().eq("id", photoId),
  };

  // ──────────────────────────────────────────────────
  //  BOOKINGS (migrations 0001 + 0006)
  // ──────────────────────────────────────────────────
  const bookings = {
    listMine: async (userId, role = "guest") => {
      const col = role === "host" ? "host_id" : "guest_id";
      return await sb.from("bookings")
        .select("*, listings(title, city, listing_photos(url))")
        .eq(col, userId)
        .order("checkin", { ascending: false });
    },

    get: async (id) => sb.from("bookings")
      .select("*, listings(title, city, listing_photos(url, position)), profiles!host_id(name, photo_url, avatar_letter, avatar_bg)")
      .eq("id", id).single(),

    // ⚠️ Crée la résa avec décomposition prix complète + champ rental_mode
    create: async (data) => sb.from("bookings").insert(data).select().single(),

    updateStatus: async (id, status) => sb.from("bookings")
      .update({ status }).eq("id", id).select().single(),

    // RPC migration 0006 — vérifie disponibilité (sans réserver)
    isAvailable: async (listingId, checkin, checkout, excludeId = null) =>
      sb.rpc("is_listing_available", {
        p_listing_id: listingId,
        p_checkin: checkin,
        p_checkout: checkout,
        p_exclude_id: excludeId,
      }),

    // RPC migration 0006 — dates bloquées sur une période (pour calendrier)
    getBlockedDates: async (listingId, fromDate, toDate) =>
      sb.rpc("get_blocked_dates", {
        p_listing_id: listingId,
        p_from: fromDate,
        p_to: toDate,
      }),

    // RPC migration 0006 — annulation atomique avec calcul remboursement
    cancel: async (bookingId, reason = null) =>
      sb.rpc("cancel_booking", {
        p_booking_id: bookingId,
        p_reason: reason,
      }),

    // RPC migration 0006 — vérification QR par hôte (lecture)
    verifyQR: async (qrToken) =>
      sb.rpc("verify_booking_qr", { p_qr_token: qrToken }),

    // RPC migration 0006 — validation arrivée (idempotent)
    validateArrival: async (qrToken) =>
      sb.rpc("validate_arrival", { p_qr_token: qrToken }),
  };

  // ──────────────────────────────────────────────────
  //  CHAT (migrations 0001 + 0007)
  // ──────────────────────────────────────────────────
  const chat = {
    listConversations: async (userId) => sb.from("conversations")
      .select(`
        *,
        guest:profiles!guest_id(name, photo_url, avatar_letter, avatar_bg),
        host:profiles!host_id(name, photo_url, avatar_letter, avatar_bg),
        listings(title, city)
      `)
      .or(`guest_id.eq.${userId},host_id.eq.${userId}`)
      .order("last_message_at", { ascending: false }),

    getOrCreate: async (guestId, hostId, listingId) => {
      const { data: existing } = await sb.from("conversations")
        .select("*")
        .eq("guest_id", guestId)
        .eq("host_id", hostId)
        .eq("listing_id", listingId)
        .maybeSingle();
      if (existing) return { data: existing, error: null };
      return await sb.from("conversations")
        .insert({ guest_id: guestId, host_id: hostId, listing_id: listingId })
        .select().single();
    },

    listMessages: async (conversationId, limit = 100) => sb.from("messages")
      .select("*, sender:profiles!sender_id(name, avatar_letter, avatar_bg)")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(limit),

    sendMessage: async (conversationId, senderId, body) => {
      // Le trigger enforce_message_not_blocked rejettera si conv bloquée
      const { data, error } = await sb.from("messages")
        .insert({ conversation_id: conversationId, sender_id: senderId, body })
        .select().single();
      if (!error) {
        // Bumpe last_message_at + last_message_preview
        await sb.from("conversations")
          .update({
            last_message_at: new Date().toISOString(),
            last_message_preview: body.slice(0, 200),
          })
          .eq("id", conversationId);
      }
      return { data, error };
    },

    subscribeMessages: (conversationId, onNew) => {
      const channel = sb.channel(`messages:${conversationId}`)
        .on("postgres_changes",
          { event: "INSERT", schema: "public", table: "messages",
            filter: `conversation_id=eq.${conversationId}` },
          (payload) => onNew(payload.new))
        .subscribe();
      return () => sb.removeChannel(channel);
    },

    // RPC migration 0007 — bulk read pour badge non-lus
    markRead: async (conversationId) =>
      sb.rpc("mark_conversation_read", { p_conversation_id: conversationId }),

    // RPC migration 0007 — bloque/débloque (les 2 sens via conversation)
    block: async (conversationId) =>
      sb.rpc("block_conversation", { p_conversation_id: conversationId }),
    unblock: async (conversationId) =>
      sb.rpc("unblock_conversation", { p_conversation_id: conversationId }),
  };

  // ──────────────────────────────────────────────────
  //  REVIEWS (migrations 0001 + 0007 — 8 critères)
  // ──────────────────────────────────────────────────
  const reviews = {
    listForListing: async (listingId) => sb.from("reviews")
      .select("*, profiles!author_id(name, photo_url, avatar_letter, avatar_bg)")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false }),

    // ⚠️ Champs 8 critères (alignement schema 0007) :
    //   rating_proprete, rating_confort, rating_accessibilite,
    //   rating_convivialite, rating_emplacement, rating_securite,
    //   rating_equipement, rating_qualite_prix
    //   Le rating global est calculé auto par trigger compute_review_rating
    //   si non fourni. Le trigger validate_review_eligibility rejette si
    //   l'auteur n'est pas le guest d'un booking completed.
    create: async (data) => sb.from("reviews").insert(data).select().single(),

    // Réponse hôte (champ host_response, host_response_at)
    reply: async (reviewId, replyText) => sb.from("reviews")
      .update({
        host_response: replyText,
        host_response_at: new Date().toISOString(),
      })
      .eq("id", reviewId).select().single(),
  };

  // ──────────────────────────────────────────────────
  //  NOTIFICATIONS
  // ──────────────────────────────────────────────────
  const notifications = {
    listMine: async (userId, limit = 50) => sb.from("notifications")
      .select("*").eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit),

    markRead: async (id) => sb.from("notifications")
      .update({ is_read: true }).eq("id", id),

    markAllRead: async (userId) => sb.from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false),
  };

  // ──────────────────────────────────────────────────
  //  POINTS / COUPONS / REFERRALS / REWARDS_CATALOG
  //  (migrations 0001 + 0007)
  // ──────────────────────────────────────────────────
  const rewards = {
    // Catalogue éditable depuis dashboard Supabase (table rewards_catalog)
    listCatalog: async () => sb.from("rewards_catalog")
      .select("*").eq("is_active", true)
      .order("cost", { ascending: true }),

    // Solde + tier — lus depuis profile (read-only via API)
    getBalance: async (userId) => sb.from("profiles")
      .select("rewards_points, rewards_tier, referral_count")
      .eq("id", userId).single(),

    // Historique des transactions (gain + débit)
    listPoints: async (userId) => sb.from("points_transactions")
      .select("*").eq("user_id", userId)
      .order("created_at", { ascending: false }),

    // Coupons générés par échange (filtrable actifs / utilisés / expirés)
    listCoupons: async (userId, activeOnly = true) => {
      let q = sb.from("coupons").select("*").eq("user_id", userId);
      if (activeOnly) {
        q = q.eq("status", "active");
      }
      return await q.order("created_at", { ascending: false });
    },

    // Filleuls (parrainage)
    listReferrals: async (userId) => sb.from("referrals")
      .select("*, profiles!referred_id(name, created_at)")
      .eq("referrer_id", userId),

    // RPC migration 0007 — échange ATOMIQUE points → coupon
    // Vérifie pts + tier + débit + création coupon + log tx, le tout serveur-side
    redeem: async (rewardId) =>
      sb.rpc("redeem_reward", { p_reward_id: rewardId }),

    // RPC migration 0007 — marque le coupon utilisé (idempotent)
    applyCoupon: async (couponId) =>
      sb.rpc("apply_coupon", { p_coupon_id: couponId }),
  };

  // ──────────────────────────────────────────────────
  //  COMPTEURS GLOBAUX (migration 0007)
  // ──────────────────────────────────────────────────
  const counters = {
    // RPC : { notifications: n, messages: n } pour badges
    getUnreadCount: async () => sb.rpc("get_unread_count"),
  };

  // ──────────────────────────────────────────────────
  //  STORAGE (photos d'annonces — bucket public)
  // ──────────────────────────────────────────────────
  const storage = {
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

    deletePhoto: async (path) => sb.storage.from("listing-photos").remove([path]),

    // Avatar (bucket avatars public)
    uploadAvatar: async (file, userId) => {
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;
      const { data, error } = await sb.storage
        .from("avatars")
        .upload(path, file, { cacheControl: "3600", upsert: true });
      if (error) return { data: null, error };
      const { data: urlData } = sb.storage.from("avatars").getPublicUrl(path);
      return { data: { path, url: urlData.publicUrl }, error: null };
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
    kyc,
    devices,
    listings,
    photos,
    bookings,
    chat,
    reviews,
    notifications,
    rewards,
    counters,
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
      auth: {
        signUp: off, signIn: off, signOut: off, getUser: off, getSession: off,
        signInMagicLink: off, signInSMS: off, verifySMS: off, signInOAuth: off,
        resetPassword: off, updatePassword: off, onAuthChange: () => () => {},
        checkReferralCode: off, applyReferralCode: off, requestAccountDeletion: off,
      },
      profiles: { get: off, update: off, findByReferralCode: off },
      kyc: { list: off, upload: off, delete: off },
      devices: { list: off, register: off, remove: off },
      listings: {
        list: off, get: off, create: off, update: off, remove: off, listMine: off,
        search: off, nearby: off, toggleActive: off,
      },
      photos: { listForListing: off, insert: off, updateTag: off, remove: off },
      bookings: {
        listMine: off, get: off, create: off, updateStatus: off,
        isAvailable: off, getBlockedDates: off, cancel: off, verifyQR: off, validateArrival: off,
      },
      chat: {
        listConversations: off, getOrCreate: off, listMessages: off, sendMessage: off,
        subscribeMessages: () => () => {}, markRead: off, block: off, unblock: off,
      },
      reviews: { listForListing: off, create: off, reply: off },
      notifications: { listMine: off, markRead: off, markAllRead: off },
      rewards: {
        listCatalog: off, getBalance: off, listPoints: off, listCoupons: off, listReferrals: off,
        redeem: off, applyCoupon: off,
      },
      counters: { getUnreadCount: off },
      storage: { uploadPhoto: off, deletePhoto: off, uploadAvatar: off },
    };
  }
})();
