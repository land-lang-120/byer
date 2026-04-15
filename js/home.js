/* Byer — Home Screen */

/* ─── HOME ──────────────────────────────────────── */
function HomeScreen({ segment, setSegment, propType, setPropType, duration, setDuration, location, onOpenLocPicker, search, setSearch, minRating, onOpenFilter, items, saved, toggleSave, openDetail, openGallery }) {
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
          <button style={S.bellBtn} aria-label="Notifications">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
        </div>

        <p style={S.greeting}>Bonjour, où allez-vous ?</p>

        {/* Search + Duration toggle on same row */}
        <div style={S.searchRow}>
          <div style={S.searchWrap}>
            <Icon name="search" size={17} color={C.mid}/>
            <input
              style={S.searchIn}
              placeholder={segment==="property"?"Ville, quartier, type…":"Ville, type de véhicule…"}
              value={search} onChange={e=>setSearch(e.target.value)}
            />
            {search
              ? <button style={S.clearBtn} onClick={()=>setSearch("")}>✕</button>
              : <button style={S.filterIconBtn} onClick={onOpenFilter}>
                  <Icon name="filter" size={17} color={minRating>0?C.coral:C.dark}/>
                  {minRating>0 && <div style={S.filterActiveDot}/>}
                </button>
            }
          </div>
          {/* Duration toggle — only visible for properties */}
          {segment==="property" && (
            <div style={S.durToggle}>
              <button
                style={{...S.durBtn,...(duration==="night"?S.durBtnOn:{})}}
                onClick={()=>setDuration("night")}
              >Nuit</button>
              <button
                style={{...S.durBtn,...(duration==="month"?S.durBtnOn:{})}}
                onClick={()=>setDuration("month")}
              >Mois</button>
            </div>
          )}
        </div>

        {/* Segment tabs */}
        <div style={S.segments}>
          {[{id:"property",label:"Logements",icon:"home"},{id:"vehicle",label:"Véhicules",icon:"car"}].map(s=>(
            <button key={s.id} style={{...S.seg,...(segment===s.id?S.segOn:{})}} onClick={()=>setSegment(s.id)}>
              <Icon name={s.icon} size={15} color={segment===s.id?C.coral:C.mid} stroke={1.8}/>
              <span style={{...S.segTxt,...(segment===s.id?{color:C.coral}:{})}}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

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

      {/* Duration info banner when "mois" selected */}
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

      {/* Feed */}
      <div style={{padding:"4px 16px 12px"}}>
        <p style={S.secTitle}>
          {search || propType!=="all"
            ? `${items.length} résultat${items.length!==1?"s":""}`
            : segment==="property"
              ? duration==="month" ? "Locations longue durée" : "Logements disponibles"
              : "Véhicules disponibles"
          }
        </p>
        {items.length===0
          ? <EmptyState icon={segment==="property"?"home":"car"} text={duration==="month"?"Aucun logement disponible à la location mensuelle dans cette sélection.":undefined}/>
          : <div style={S.feedStack}>
              {items.map((item,i)=>(
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
        }
      </div>
      <div style={{height:24}}/>
    </div>
  );
}

/* ─── BIG CARD ──────────────────────────────────── */
function BigCard({ item, idx, isSaved, toggleSave, onTap, onGallery, duration }) {
  const [imgIdx, setImgIdx] = useState(0);
  const gallery = GALLERY[item.id];
  const imgs    = gallery?.imgs || [item.img];

  const prev = e => { e.stopPropagation(); setImgIdx(i=>(i-1+imgs.length)%imgs.length); };
  const next = e => { e.stopPropagation(); setImgIdx(i=>(i+1)%imgs.length); };

  const showMonthly = item.type==="property" && duration==="month" && item.monthPrice;
  const price       = showMonthly ? item.monthPrice : item.nightPrice;
  const unit        = showMonthly ? "/mois" : "/nuit";

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
              <p style={S.bigCity}><ByerPin size={13}/>&nbsp;{item.zone}, {item.city}</p>
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
            {item.type==="property" && item.monthPrice && duration==="night" && (
              <p style={{fontSize:11,color:C.light,marginTop:2}}>ou {fmtM(item.monthPrice)}</p>
            )}
            {item.type==="property" && item.monthPrice && duration==="month" && (
              <p style={{fontSize:11,color:C.light,marginTop:2}}>ou {fmt(item.nightPrice)}/nuit</p>
            )}
          </div>
          <button style={S.detailBtn} onClick={onTap}>Voir le détail →</button>
        </div>
      </div>
    </div>
  );
}
