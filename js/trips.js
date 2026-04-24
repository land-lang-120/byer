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
