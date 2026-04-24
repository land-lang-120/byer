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
