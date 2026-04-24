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
