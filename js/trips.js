/* Byer — Trips & Saved */

/* ─── SAVED ─────────────────────────────────────── */
function SavedScreen({ items, openDetail, toggleSave, saved, openGallery, duration }) {
  return (
    <div>
      <div style={S.pageHead}><p style={S.pageTitle}>Mes favoris</p></div>
      {items.length===0
        ? <EmptyState icon="heart"/>
        : <div style={{...S.feedStack, padding:"4px 16px 32px"}}>
            {items.map((it,i)=><BigCard key={it.id} item={it} idx={i} isSaved={!!saved[it.id]} toggleSave={toggleSave} onTap={()=>openDetail(it)} onGallery={e=>openGallery(it,0,e)} duration={duration}/>)}
          </div>
      }
    </div>
  );
}

/* ─── TRIPS SCREEN ──────────────────────────────── */
function TripsScreen({ openDetail }) {
  const [filter, setFilter] = useState("all");
  const [mapItem, setMapItem] = useState(null);

  const filtered = filter === "all"
    ? BOOKINGS
    : BOOKINGS.filter(b => b.status === filter);

  const openMaps = (booking, e) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.lat},${booking.lng}&travelmode=driving&destination_place_id=${encodeURIComponent(booking.address)}`;
    window.open(url, "_blank");
  };

  return (
    <div>
      <div style={S.pageHead}>
        <p style={S.pageTitle}>Mes voyages</p>
        <p style={{fontSize:13,color:C.mid,marginTop:3}}>
          {BOOKINGS.filter(b=>b.status==="active").length > 0
            ? `${BOOKINGS.filter(b=>b.status==="active").length} séjour en cours`
            : `${BOOKINGS.filter(b=>b.status==="upcoming").length} séjour${BOOKINGS.filter(b=>b.status==="upcoming").length>1?"s":""} à venir`
          }
        </p>
      </div>

      {/* Filter tabs */}
      <div style={S.tripsTabs}>
        {[
          {id:"all",      label:"Tous"},
          {id:"active",   label:"En cours"},
          {id:"upcoming", label:"À venir"},
          {id:"past",     label:"Passés"},
        ].map(f => (
          <button key={f.id} style={{...S.tripsTab,...(filter===f.id?S.tripsTabOn:{})}} onClick={()=>setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      <div style={{padding:"8px 16px 100px",display:"flex",flexDirection:"column",gap:16}}>
        {filtered.length === 0 && <EmptyState icon="trips" text="Aucune réservation dans cette catégorie"/>}

        {filtered.map((booking, i) => {
          const sc = STATUS_CONFIG[booking.status];
          return (
            <div key={booking.id} className="bigcard" style={{...S.bigCard, animationDelay:`${i*60}ms`, overflow:"visible"}}>

              {/* Image hero */}
              <div style={{position:"relative",height:170,borderRadius:"20px 20px 0 0",overflow:"hidden"}}>
                <img src={booking.img} alt={booking.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 50%)"}}/>

                {/* Status badge */}
                <div style={{position:"absolute",top:12,left:12,display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,.92)",borderRadius:20,padding:"4px 10px",backdropFilter:"blur(6px)"}}>
                  <div style={{width:7,height:7,borderRadius:4,background:sc.dot, ...(booking.status==="active"?{boxShadow:`0 0 0 3px ${sc.dot}44`}:{})}}/>
                  <span style={{fontSize:11,fontWeight:700,color:sc.color}}>{sc.label}</span>
                </div>

                {/* Type badge */}
                <div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,.35)",borderRadius:20,padding:"4px 10px",backdropFilter:"blur(4px)"}}>
                  <span style={{fontSize:11,fontWeight:600,color:"white"}}>
                    {booking.type==="vehicle" ? "🚗 Véhicule" : "🏠 Logement"}
                  </span>
                </div>

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

                {/* Host + ref */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderTop:`1px solid ${C.border}`,marginTop:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <FaceAvatar photo={booking.hostPhoto} avatar={booking.host[0]} bg="#6366F1" size={30} radius={15}/>
                    <div>
                      <p style={{fontSize:12,fontWeight:600,color:C.black}}>{booking.host}</p>
                      <p style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>{booking.ref}</p>
                    </div>
                  </div>
                  <p style={{fontSize:14,fontWeight:800,color:C.black}}>
                    {(booking.price * booking.nights).toLocaleString("fr-FR")} F
                  </p>
                </div>

                {/* Amenities tags */}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",paddingBottom:12}}>
                  {booking.amenities.map(a => (
                    <span key={a} style={S.tag}>{a}</span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div style={S.tripsActions}>

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
                  <button style={S.tripsSecBtn}>
                    <Icon name="message" size={15} color={C.dark} stroke={1.8}/>
                    <span>Contacter l'hôte</span>
                  </button>
                )}
                {booking.status === "past" && (
                  <button style={S.tripsSecBtn}>
                    <Icon name="star" size={15} color={C.dark}/>
                    <span>Laisser un avis</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
