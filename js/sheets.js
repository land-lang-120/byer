/* Byer — Bottom Sheets */

/* ─── PLACEHOLDER SCREEN ───────────────────────── */
function PlaceholderScreen({ icon, title, sub }) {
  return <div><div style={S.pageHead}><p style={S.pageTitle}>{title}</p></div><EmptyState icon={icon} text={sub}/></div>;
}

/* ─── FILTER SHEET ──────────────────────────────── */
function FilterSheet({ minRating, onApply, onClose }) {
  const [localRating, setLocalRating] = useState(minRating);
  const OPTIONS = [
    { val:0,   label:"Tous",           sub:"Aucun filtre de note" },
    { val:4.5, label:"4.5 et plus",    sub:"Très bien · Excellent" },
    { val:4.7, label:"4.7 et plus",    sub:"Remarquable" },
    { val:4.9, label:"4.9 et plus",    sub:"Exceptionnel uniquement" },
  ];
  return (
    <>
      <div style={{...S.sheetBackdrop,zIndex:200}} onClick={onClose}/>
      <div style={{...S.sheet,zIndex:201}} className="sheet">
        <div style={S.sheetHandle}/>
        <div style={S.sheetHeader}>
          <p style={S.sheetTitle}>Filtrer les résultats</p>
          <button style={S.sheetClose} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{padding:"0 20px 24px"}}>
          <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:12}}>
            Note minimale
          </p>

          {/* Note min options */}
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
            {OPTIONS.map(o => (
              <button
                key={o.val}
                style={{
                  display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"13px 16px",borderRadius:14,cursor:"pointer",
                  border:`1.5px solid ${localRating===o.val?C.coral:C.border}`,
                  background:localRating===o.val?"#FFF5F5":C.white,
                  fontFamily:"'DM Sans',sans-serif",
                }}
                onClick={()=>setLocalRating(o.val)}
              >
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  {o.val > 0 && <RatingStars score={o.val} size={14}/>}
                  {o.val === 0 && <span style={{fontSize:18}}>🔍</span>}
                  <div style={{textAlign:"left"}}>
                    <p style={{fontSize:14,fontWeight:600,color:localRating===o.val?C.coral:C.black}}>{o.label}</p>
                    <p style={{fontSize:11,color:C.light,marginTop:1}}>{o.sub}</p>
                  </div>
                </div>
                {/* Check mark */}
                {localRating===o.val && (
                  <svg width="18" height="18" fill="none" stroke={C.coral} strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Critères info */}
          <div style={{background:C.bg,borderRadius:14,padding:"12px 14px",marginBottom:20}}>
            <p style={{fontSize:12,fontWeight:700,color:C.dark,marginBottom:8}}>La note globale intègre :</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
              {RATING_CRITERIA.map(c=>(
                <p key={c.key} style={{fontSize:11,color:C.mid}}>
                  {c.icon} {c.label}
                </p>
              ))}
            </div>
          </div>

          <button style={S.payBtn} onClick={()=>onApply(localRating)}>
            {localRating>0 ? `Afficher les biens ≥ ${localRating}★` : "Voir tous les biens"}
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
