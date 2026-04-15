/* Byer — App Shell */

/* ═══════════════════════════════════════════════════ */
function ByerApp() {
  const [tab, setTab]           = useState("home");
  const [segment, setSegment]   = useState("property");
  const [propType, setPropType] = useState("all");
  const [duration, setDuration] = useState("night");
  const [city, setCity]         = useState("Toutes");
  const [location, setLocation] = useState(LOCATIONS[0]); // default: Cameroun
  const [locOpen, setLocOpen]   = useState(false);
  const [saved, setSaved]       = useState({ 2:true, 11:true });
  const [detail, setDetail]     = useState(null);
  const [gallery, setGallery]   = useState(null);
  const [search, setSearch]     = useState("");
  const [rentOpen, setRentOpen]       = useState(false);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [minRating, setMinRating]     = useState(0);    // filtre note min
  const [filterOpen, setFilterOpen]   = useState(false);
  const [qrScanOpen, setQrScanOpen]     = useState(false);
  const [qrResult, setQrResult]         = useState(null);  // scanned code
  const [qrInfoOpen, setQrInfoOpen]     = useState(false); // info dialog

  const toggleSave  = (id, e) => { e?.stopPropagation(); setSaved(p => ({...p,[id]:!p[id]})); };
  const openGallery = (item, idx=0, e) => { e?.stopPropagation(); setGallery({item,idx}); };

  const allItems = segment === "property" ? PROPERTIES : VEHICLES;
  const items = allItems.filter(i => {
    // Location filter: "cameroun" = tout, sinon filtre par ville
    if (location.id !== "cameroun" && i.city !== location.id) return false;
    if (segment === "property" && propType !== "all" && i.propType !== propType) return false;
    if (duration === "month" && i.monthPrice === null) return false;
    if (minRating > 0 && i.rating < minRating) return false;
    const q = search.toLowerCase();
    return !q || i.title.toLowerCase().includes(q) || i.city.toLowerCase().includes(q);
  });

  if (gallery) return <GalleryScreen item={gallery.item} startIdx={gallery.idx} onBack={()=>setGallery(null)} onOpenDetail={()=>{setDetail(gallery.item);setGallery(null);}}/>;
  if (detail)  return <DetailScreen  item={detail} saved={saved} toggleSave={toggleSave} onBack={()=>setDetail(null)} openGallery={(idx,e)=>openGallery(detail,idx,e)} duration={duration} onViewOwner={name=>setOwnerProfile(name)}/>;
  if (rentOpen) return <RentScreen onBack={()=>setRentOpen(false)}/>;
  if (ownerProfile) return <OwnerProfileScreen ownerName={ownerProfile} onBack={()=>setOwnerProfile(null)}/>;

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
          minRating={minRating}
          onApply={(r) => { setMinRating(r); setFilterOpen(false); }}
          onClose={() => setFilterOpen(false)}
        />
      )}
      {tab==="home" &&
        <HomeScreen
          segment={segment} setSegment={setSegment}
          propType={propType} setPropType={setPropType}
          duration={duration} setDuration={setDuration}
          location={location} onOpenLocPicker={() => setLocOpen(true)}
          search={search} setSearch={setSearch}
          minRating={minRating}
          onOpenFilter={() => setFilterOpen(true)}
          items={items} saved={saved}
          toggleSave={toggleSave} openDetail={setDetail} openGallery={openGallery}
        />
      }
      {tab==="saved"    && <SavedScreen items={[...PROPERTIES,...VEHICLES].filter(i=>saved[i.id])} openDetail={setDetail} toggleSave={toggleSave} saved={saved} openGallery={openGallery} duration={duration}/>}
      {tab==="trips"    && <TripsScreen openDetail={setDetail}/>}
      {tab==="messages" && <MessagesScreen/>}
      {tab==="messages" && <QRScanButton onClick={() => setQrInfoOpen(true)}/>}
      {tab==="profile"  && <ProfileScreen onOpenRent={() => setRentOpen(true)}/>}

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
