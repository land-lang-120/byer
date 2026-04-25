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
  const [myQrOpen, setMyQrOpen]         = useState(false); // dialog "Mon QR Code"
  // Conversation ouverte dans Messages → masque la nav bar (UX chat plein écran)
  const [chatActive, setChatActive]     = useState(false);

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
    setTab(newTab);
  };

  /* Hide nav bar dans certains contextes immersifs :
     - Conversation chat (UX plein écran)
     - Galerie photo plein écran
     - Scanner QR overlay (caméra plein écran)
     - TOUT écran secondaire (Settings, Publish, Dashboard, Detail, etc.)
       → la nav bar ne doit apparaître QUE sur les 5 onglets principaux. */
  const onSecondaryScreen = !!detail || !!gallery || !!allReviewsItem
    || rentOpen || !!ownerProfile || !!buildingDetail || dashboardOpen
    || !!listAllFilter || techsOpen || prosOpen || boostOpen || notifsOpen
    || publishOpen || settingsOpen || termsOpen || privacyOpen || forgotOpen
    || supportOpen || editProfileOpen || !!bookingItem || reviewsOpen || historyOpen;
  const hideGlobalNav = chatActive || !!gallery || qrScanOpen || onSecondaryScreen;

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
                      onLogout={()=>{ setSettingsOpen(false); onLogout?.(); }}
                      onDeleteAccount={()=>{ setSettingsOpen(false); onLogout?.(); }}
                    />;
  } else if (termsOpen)       { screenContent = <TermsScreen   onBack={()=>setTermsOpen(false)}/>; }
  else if (privacyOpen)       { screenContent = <PrivacyScreen onBack={()=>setPrivacyOpen(false)}/>; }
  else if (forgotOpen)        { screenContent = <ForgotPasswordScreen onBack={()=>setForgotOpen(false)}/>; }
  else if (supportOpen)       { screenContent = <SupportScreen onBack={()=>setSupportOpen(false)}/>; }
  else if (editProfileOpen)   { screenContent = <EditProfileScreen onBack={()=>setEditProfileOpen(false)}/>; }
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
      {/* Boutons QR sur l'onglet Voyages :
          - "Mon QR Code" (icône noire / fond blanc) au-dessus → locataire présente son QR
          - "Scanner QR" (coral) en dessous → bailleur scanne le QR du voyageur
          Plus visible dans Messages (mauvaise ergonomie en chat). */}
      {tab==="trips" && <MyQRCodeButton onClick={() => setMyQrOpen(true)}/>}
      {tab==="trips" && <QRScanButton onClick={() => setQrInfoOpen(true)}/>}
      {tab==="messages" && <MessagesScreen role={role} onChatActiveChange={setChatActive}/>}
      {tab==="profile"  && <ProfileScreen role={role} setRole={setRole} onOpenRent={() => setRentOpen(true)} onOpenDashboard={()=>setDashboardOpen(true)} onOpenTechs={()=>{setTechsRole(role);setTechsOpen(true);}} onOpenPros={()=>{setProsRole(role);setProsOpen(true);}} onOpenPublish={()=>{setPublishSegment(null);setPublishOpen(true);}} onOpenSettings={()=>setSettingsOpen(true)} onOpenEditProfile={()=>setEditProfileOpen(true)} onOpenReviews={()=>setReviewsOpen(true)} onOpenHistory={()=>setHistoryOpen(true)} onLogout={onLogout}/>}

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

  /* Render final : l'écran courant + la nav bar globale toujours visible
     (sauf en mode immersif chat/galerie/scanner). */
  return (
    <>
      {screenContent}
      {!hideGlobalNav && <BottomNavBar tab={tab} setTab={switchTab}/>}
    </>
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
