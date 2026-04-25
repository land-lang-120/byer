/* Byer — Reviews & Booking History */

const MOCK_REVIEWS = [
  { id:1, author:"Jean M.", avatar:"J", bg:"#3B82F6", rating:5, date:"12 avril 2026", property:"Studio Akwa Palace", text:"Excellent séjour ! L'appartement était très propre et bien situé. Pino est un hôte très réactif." },
  { id:2, author:"Marie N.", avatar:"M", bg:"#EC4899", rating:4, date:"3 avril 2026", property:"Villa Bonanjo", text:"Très bon logement, juste un petit souci avec l'eau chaude mais résolu rapidement." },
  { id:3, author:"Paul K.", avatar:"P", bg:"#F59E0B", rating:5, date:"28 mars 2026", property:"Studio Akwa Palace", text:"Parfait pour un séjour d'affaires. Je recommande vivement !" },
  { id:4, author:"Aïcha D.", avatar:"A", bg:"#8B5CF6", rating:3, date:"15 mars 2026", property:"Chambre Bonapriso", text:"Correct mais la climatisation faisait du bruit. Le quartier est bien par contre." },
  { id:5, author:"Thomas E.", avatar:"T", bg:"#10B981", rating:5, date:"2 mars 2026", property:"Studio Akwa Palace", text:"Super expérience, comme à la maison ! Merci Pino." },
];

const MOCK_BOOKINGS_HIST = [
  { id:1, kind:"property", title:"Studio Akwa Palace", city:"Douala", zone:"Akwa",       img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", checkin:"2026-04-20", checkout:"2026-04-23", status:"active",    total:75000,  method:"MoMo", ref:"BYR-482916" },
  { id:2, kind:"property", title:"Villa Bonanjo",      city:"Douala", zone:"Bonanjo",    img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", checkin:"2026-03-10", checkout:"2026-03-15", status:"completed", total:250000, method:"OM",   ref:"BYR-371845" },
  { id:3, kind:"vehicle",  title:"Toyota Hilux 4x4",   city:"Douala", zone:"Bonapriso",  img:"https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400", checkin:"2026-02-05", checkout:"2026-02-08", status:"completed", total:120000, method:"MoMo", ref:"BYR-259173" },
  { id:4, kind:"property", title:"Appart Bastos Luxe", city:"Yaoundé", zone:"Bastos",    img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", checkin:"2026-01-15", checkout:"2026-01-16", status:"cancelled", total:45000,  method:"OM",   ref:"BYR-184562" },
  { id:5, kind:"vehicle",  title:"Mercedes Classe E",  city:"Yaoundé", zone:"Centre",    img:"https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400", checkin:"2026-04-05", checkout:"2026-04-07", status:"active",    total:90000,  method:"MoMo", ref:"BYR-571208" },
  { id:6, kind:"vehicle",  title:"Hyundai Tucson SUV", city:"Douala", zone:"Akwa",       img:"https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400", checkin:"2026-01-22", checkout:"2026-01-25", status:"completed", total:135000, method:"OM",   ref:"BYR-309417" },
];

/* ─── REVIEWS SCREEN ──────────────────────────────── */
function ReviewsScreen({ onBack }) {
  const [filter, setFilter] = useState("Tous");
  const [replyToast, setReplyToast] = useState("");
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState("");
  const flashReply = (msg) => { setReplyToast(msg); setTimeout(()=>setReplyToast(""), 2200); };

  const avg = (MOCK_REVIEWS.reduce((s,r) => s+r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);
  const dist = [5,4,3,2,1].map(n => ({ star:n, count:MOCK_REVIEWS.filter(r=>r.rating===n).length }));

  const filtered = filter === "Tous"
    ? MOCK_REVIEWS
    : MOCK_REVIEWS.filter(r => r.rating === parseInt(filter));

  const filters = ["Tous","5★","4★","3★"];

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Header */}
        <div style={S.rentHeader}>
          <button style={S.dBack2} onClick={onBack}><Icon name="back" size={20} color={C.dark} stroke={2.5}/></button>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Avis reçus</p>
          <div style={{width:38}}/>
        </div>

        {/* Summary card */}
        <div style={{margin:"0 16px 16px",background:C.white,borderRadius:16,padding:20,boxShadow:"0 2px 10px rgba(0,0,0,.05)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div>
              <p style={{fontSize:42,fontWeight:800,color:C.black,lineHeight:1}}>{avg}</p>
              <p style={{fontSize:12,color:C.mid,marginTop:4}}>{MOCK_REVIEWS.length} avis</p>
            </div>
            <RatingStars score={parseFloat(avg)} size={16}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {dist.map(d => (
              <div key={d.star} style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:11,color:C.mid,width:22}}>{d.star}★</span>
                <div style={{flex:1,height:6,background:C.bg,borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",background:C.coral,borderRadius:3,width:`${(d.count/MOCK_REVIEWS.length)*100}%`,transition:"width .3s"}}/>
                </div>
                <span style={{fontSize:11,color:C.mid,width:18,textAlign:"right"}}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter chips */}
        <div style={{display:"flex",gap:8,padding:"0 16px",marginBottom:16,overflowX:"auto"}}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:"7px 14px",borderRadius:20,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",
              background:filter===f?C.coral:C.bg,
              color:filter===f?C.white:C.dark,
              transition:"all .2s"
            }}>{f}</button>
          ))}
        </div>

        {/* Reviews list */}
        <div style={{padding:"0 16px 100px",display:"flex",flexDirection:"column",gap:12}}>
          {filtered.length === 0 && <EmptyState icon="star" text="Aucun avis avec ce filtre"/>}
          {filtered.map(r => (
            <div key={r.id} style={{background:C.white,borderRadius:16,padding:14,boxShadow:"0 2px 10px rgba(0,0,0,.05)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <FaceAvatar avatar={r.avatar} bg={r.bg} size={36}/>
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:600,color:C.dark}}>{r.author}</p>
                  <p style={{fontSize:11,color:C.light}}>{r.date}</p>
                </div>
              </div>
              <div style={{marginBottom:6}}><RatingStars score={r.rating} size={13}/></div>
              <p style={{fontSize:11,color:C.light,marginBottom:6}}>{r.property}</p>
              <p style={{fontSize:13,color:C.dark,lineHeight:1.6,marginBottom:8}}>{r.text}</p>
              <span onClick={()=>{ setReplyTarget(r); setReplyText(""); }} style={{fontSize:12,color:C.coral,fontWeight:600,cursor:"pointer"}}>Répondre</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reply sheet */}
      {replyTarget && (
        <div onClick={()=>setReplyTarget(null)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"flex-end"}}>
          <div onClick={(e)=>e.stopPropagation()} className="sheet"
            style={{width:"100%",background:C.white,borderRadius:"16px 16px 0 0",padding:"20px 16px 32px",fontFamily:"'DM Sans',sans-serif"}}>
            <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px"}}/>
            <p style={{fontSize:16,fontWeight:700,color:C.dark,marginBottom:6}}>Répondre à {replyTarget.author}</p>
            <p style={{fontSize:12,color:C.mid,marginBottom:12,fontStyle:"italic"}}>"{replyTarget.text}"</p>
            <textarea
              value={replyText}
              onChange={(e)=>setReplyText(e.target.value)}
              placeholder="Votre réponse publique…"
              style={{width:"100%",minHeight:90,padding:12,border:`1px solid ${C.border}`,borderRadius:8,fontSize:14,fontFamily:"'DM Sans',sans-serif",resize:"vertical",outline:"none"}}
            />
            <div style={{display:"flex",gap:10,marginTop:12}}>
              <button onClick={()=>setReplyTarget(null)}
                style={{flex:1,padding:"12px",border:"none",borderRadius:8,background:C.bg,color:C.dark,fontWeight:600,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>
                Annuler
              </button>
              <button onClick={()=>{ flashReply(replyText.trim() ? "Réponse publiée" : "Réponse vide ignorée"); setReplyTarget(null); }}
                style={{flex:1,padding:"12px",border:"none",borderRadius:8,background:C.coral,color:C.white,fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>
                Publier
              </button>
            </div>
          </div>
        </div>
      )}

      {replyToast && (
        <div style={{position:"fixed",bottom:24,left:16,right:16,background:C.dark,color:C.white,padding:"12px 16px",borderRadius:8,textAlign:"center",fontSize:14,fontFamily:"'DM Sans',sans-serif",zIndex:1100}}>
          {replyToast}
        </div>
      )}
    </div>
  );
}

/* ─── BOOKING HISTORY SCREEN ──────────────────────── */
function BookingHistoryScreen({ onBack }) {
  // Segment Immo/Véhicules + tabs status secondaires
  const [segment, setSegment] = useState("property");   // 'property' | 'vehicle'
  const [tab, setTab] = useState("Toutes");
  const [detailItem, setDetailItem] = useState(null);
  const [reviewToast, setReviewToast] = useState("");
  const flashReview = (msg) => { setReviewToast(msg); setTimeout(()=>setReviewToast(""), 2200); };
  const tabs = ["Toutes","En cours","Terminées","Annulées"];

  const statusMap = { active:"En cours", completed:"Terminée", cancelled:"Annulée" };
  const tabFilter = { "Toutes":null, "En cours":"active", "Terminées":"completed", "Annulées":"cancelled" };

  // Segment immobilier vs véhicules : count par segment pour les badges
  const propCount = MOCK_BOOKINGS_HIST.filter(b => b.kind === "property").length;
  const vehCount  = MOCK_BOOKINGS_HIST.filter(b => b.kind === "vehicle").length;

  // Filtre combiné segment + status tab
  const filtered = MOCK_BOOKINGS_HIST
    .filter(b => b.kind === segment)
    .filter(b => tab === "Toutes" || b.status === tabFilter[tab]);

  const MONTHS = ["jan","fév","mar","avr","mai","juin","juil","aoû","sep","oct","nov","déc"];
  const fmtRange = (cin,cout) => {
    const a = new Date(cin), b = new Date(cout);
    return `${a.getDate()} ${MONTHS[a.getMonth()]} - ${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
  };

  const statusColor = { active:"#10B981", completed:C.mid, cancelled:"#EF4444" };

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Header */}
        <div style={S.rentHeader}>
          <button style={S.dBack2} onClick={onBack}><Icon name="back" size={20} color={C.dark} stroke={2.5}/></button>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Mes réservations</p>
          <div style={{width:38}}/>
        </div>

        {/* Segment Immobilier / Véhicules — toggle pill */}
        <div style={{padding:"4px 16px 14px"}}>
          <div style={{
            display:"flex", background:C.bg, borderRadius:14,
            padding:4, gap:0, border:`1px solid ${C.border}`,
          }}>
            {[
              {id:"property", label:"🏠 Immobilier", count:propCount},
              {id:"vehicle",  label:"🚗 Véhicules",  count:vehCount},
            ].map(s => {
              const active = segment === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => { setSegment(s.id); setTab("Toutes"); }}
                  style={{
                    flex:1, padding:"10px 12px", border:"none",
                    background: active ? C.white : "transparent",
                    color: active ? C.coral : C.mid,
                    borderRadius:10, cursor:"pointer",
                    fontSize:13, fontWeight:700,
                    fontFamily:"'DM Sans',sans-serif",
                    boxShadow: active ? "0 1px 6px rgba(0,0,0,.08)" : "none",
                    transition:"all .18s",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                  }}
                >
                  <span>{s.label}</span>
                  <span style={{
                    fontSize:11, fontWeight:600,
                    color: active ? C.coral : C.light,
                    background: active ? "#FFF5F5" : C.white,
                    padding:"1px 7px", borderRadius:10,
                  }}>{s.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabs status */}
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,padding:"0 16px",marginBottom:16}}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:"12px 0",marginRight:16,border:"none",background:"none",cursor:"pointer",
              fontSize:13,fontWeight:600,
              color:tab===t?C.coral:C.mid,
              borderBottom:tab===t?`2px solid ${C.coral}`:"2px solid transparent",
              transition:"all .2s",whiteSpace:"nowrap"
            }}>{t}</button>
          ))}
        </div>

        {/* Bookings */}
        <div style={{padding:"0 16px 100px",display:"flex",flexDirection:"column",gap:12}}>
          {filtered.length === 0 && (
            <EmptyState
              icon="trips"
              text={segment==="vehicle"
                ? "Aucune location de véhicule dans cette catégorie"
                : "Aucune réservation immobilière dans cette catégorie"}
            />
          )}
          {filtered.map(b => (
            <div key={b.id} style={{background:C.white,borderRadius:16,padding:14,boxShadow:"0 2px 10px rgba(0,0,0,.05)"}}>
              <div style={{display:"flex",gap:12,marginBottom:10}}>
                <img src={b.img} alt={b.title} style={{width:70,height:70,borderRadius:12,objectFit:"cover",flexShrink:0}}/>
                <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                  <div>
                    <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:2}}>{b.title}</p>
                    <p style={{fontSize:12,color:C.mid,marginBottom:3}}>{b.city}, {b.zone}</p>
                    <p style={{fontSize:11,color:C.light}}>{fmtRange(b.checkin,b.checkout)}</p>
                  </div>
                  <p style={{fontSize:13,fontWeight:700,color:C.dark}}>{fmt(b.total)}</p>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:statusColor[b.status],color:C.white}}>{statusMap[b.status]}</span>
                <span style={{fontSize:11,color:C.light}}>{b.ref}</span>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setDetailItem(b)}
                  style={{flex:1,padding:"10px 12px",border:`1px solid ${C.border}`,background:C.white,borderRadius:10,fontSize:12,fontWeight:600,color:C.dark,cursor:"pointer"}}>Voir détails</button>
                {b.status==="completed" && (
                  <button onClick={()=>flashReview("Avis enregistré — merci !")}
                    style={{flex:1,padding:"10px 12px",border:"none",background:C.coral,borderRadius:10,fontSize:12,fontWeight:600,color:C.white,cursor:"pointer"}}>Laisser un avis</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking detail sheet */}
      {detailItem && (
        <div onClick={()=>setDetailItem(null)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"flex-end"}}>
          <div onClick={(e)=>e.stopPropagation()} className="sheet"
            style={{width:"100%",background:C.white,borderRadius:"16px 16px 0 0",padding:"20px 16px 32px",fontFamily:"'DM Sans',sans-serif"}}>
            <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px"}}/>
            <p style={{fontSize:18,fontWeight:700,color:C.dark,marginBottom:14}}>Détails de la réservation</p>
            <img src={detailItem.img} alt={detailItem.title} style={{width:"100%",height:160,borderRadius:12,objectFit:"cover",marginBottom:14}}/>
            <p style={{fontSize:15,fontWeight:700,color:C.dark,marginBottom:4}}>{detailItem.title}</p>
            <p style={{fontSize:13,color:C.mid,marginBottom:14}}>{detailItem.city}, {detailItem.zone}</p>
            {[
              ["Référence",        detailItem.ref],
              ["Période",          fmtRange(detailItem.checkin,detailItem.checkout)],
              ["Statut",           statusMap[detailItem.status]],
              ["Moyen de paiement", detailItem.method],
              ["Montant total",    fmt(detailItem.total)],
            ].map(([k,v]) => (
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:13,color:C.mid}}>{k}</span>
                <span style={{fontSize:13,fontWeight:600,color:C.dark}}>{v}</span>
              </div>
            ))}
            <button onClick={()=>setDetailItem(null)}
              style={{width:"100%",marginTop:18,padding:"12px",background:C.coral,border:"none",borderRadius:8,color:C.white,fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {reviewToast && (
        <div style={{position:"fixed",bottom:24,left:16,right:16,background:C.dark,color:C.white,padding:"12px 16px",borderRadius:8,textAlign:"center",fontSize:14,fontFamily:"'DM Sans',sans-serif",zIndex:1100}}>
          {reviewToast}
        </div>
      )}
    </div>
  );
}
