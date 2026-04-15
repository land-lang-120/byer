/* Byer — Profile Screens */

/* ─── PROFILE ───────────────────────────────────── */
function ProfileScreen({ onOpenRent }) {
  const urgentCount = LOYERS_LOCATAIRE.filter(l => l.statut==="en_attente" && l.rappelActif).length
                    + LOYERS_BAILLEUR.filter(l  => l.statut==="en_attente" && l.joursRestants<=7).length;

  const rows=[
    {icon:"user",    l:"Informations personnelles",  action:null},
    {icon:"trips",   l:"Historique des réservations",action:null},
    {icon:"message", l:"Avis reçus",                  action:null},
    {icon:"home",    l:"Mes annonces",                action:null},
    {icon:"car",     l:"Mes véhicules",               action:null},
    {icon:"gear",    l:"Paramètres du compte",        action:null},
  ];
  return (
    <div>
      <div style={S.pageHead}><p style={S.pageTitle}>Mon profil</p></div>

      {/* Avatar card */}
      <div style={{margin:"0 16px 16px",background:C.white,borderRadius:16,padding:"18px 16px",display:"flex",alignItems:"center",gap:14,boxShadow:`0 1px 8px rgba(0,0,0,.05)`}}>
        <div style={{position:"relative"}}>
          <FaceAvatar photo={USER.photo} avatar={USER.avatar} bg={USER.bg} size={56} radius={28}/>
          <div style={{position:"absolute",bottom:0,right:0,width:20,height:20,borderRadius:10,background:C.coral,border:"2px solid white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
        </div>
        <div>
          <p style={{fontSize:16,fontWeight:700,color:C.black}}>{USER.name}</p>
          <p style={{fontSize:12,color:C.light,marginTop:2}}>{USER.city} · Membre {USER.since}</p>
        </div>
      </div>

      {/* Gestion des loyers — CTA card */}
      <button style={S.rentCta} onClick={onOpenRent}>
        <div style={S.rentCtaLeft}>
          <div style={S.rentCtaIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.coral} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              <path d="M9 21V12h6v9"/>
              <path d="M9 16h6"/>
            </svg>
          </div>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:C.black}}>Gestion des loyers</p>
            <p style={{fontSize:12,color:C.mid,marginTop:1}}>Paiements · Historique · Rappels</p>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {urgentCount > 0 && (
            <div style={S.urgentBadge}>{urgentCount}</div>
          )}
          <Icon name="chevron" size={16} color={C.light} stroke={2}/>
        </div>
      </button>

      {/* Other rows */}
      <div style={{padding:"0 16px 32px"}}>
        {rows.map(row=>(
          <button key={row.l} style={{display:"flex",alignItems:"center",gap:14,padding:"15px 0",background:"none",border:"none",width:"100%",cursor:"pointer",borderBottom:`1px solid ${C.border}`}}>
            <Icon name={row.icon} size={20} color={C.dark} stroke={1.8}/>
            <span style={{flex:1,fontSize:14,fontWeight:500,color:C.dark,textAlign:"left"}}>{row.l}</span>
            <Icon name="chevron" size={16} color={C.light} stroke={2}/>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── OWNER PROFILE SCREEN ──────────────────────── */
function OwnerProfileScreen({ ownerName, onBack }) {
  const owner = OWNERS[ownerName];
  const [expanded, setExpanded] = useState({});

  const toggleBuilding = (id) => setExpanded(p => ({...p,[id]:!p[id]}));

  if (!owner) return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={S.rentHeader}>
        <button style={S.dBack2} onClick={onBack}><Icon name="back" size={20} color={C.dark} stroke={2.5}/></button>
        <p style={{fontSize:17,fontWeight:700,color:C.black}}>Profil propriétaire</p>
        <div style={{width:38}}/>
      </div>
      <EmptyState icon="user" text="Profil non trouvé"/>
    </div>
  );

  const totalUnits   = owner.buildings.reduce((s,b)=>s+b.units.length,0);
  const availUnits   = owner.buildings.reduce((s,b)=>s+b.units.filter(u=>u.available).length,0);
  const totalRevenue = owner.buildings.reduce((s,b)=>s+b.units.reduce((ss,u)=>ss+(u.monthPrice||u.nightPrice*20),0),0);

  const typeLabel = { appartement:"Appart.", studio:"Studio", chambre:"Chambre", villa:"Villa", hotel:"Hôtel" };

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Header avec back */}
        <div style={{position:"relative",height:160,background:owner.avatarBg}}>
          <div style={{position:"absolute",inset:0,opacity:.15,background:`repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)`,backgroundSize:"20px 20px"}}/>
          <button style={{...S.dBack2,position:"absolute",top:52,left:12,background:"rgba(0,0,0,.25)"}} onClick={onBack}>
            <Icon name="back" size={20} color="white" stroke={2.5}/>
          </button>
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 20px 18px",display:"flex",alignItems:"flex-end",gap:14}}>
            <div style={{width:72,height:72,borderRadius:36,background:C.white,border:"3px solid white",boxShadow:"0 4px 16px rgba(0,0,0,.15)",overflow:"hidden"}}>
              <FaceAvatar photo={owner.photo} avatar={owner.avatar} bg={owner.avatarBg} size={72} radius={36}/>
            </div>
            <div style={{paddingBottom:4}}>
              <p style={{fontSize:20,fontWeight:800,color:"white"}}>{owner.name}</p>
              <p style={{fontSize:12,color:"rgba(255,255,255,.8)"}}>Membre depuis {owner.since} · {owner.city}</p>
            </div>
          </div>
        </div>

        <div style={{background:C.white,padding:"16px 20px 0"}}>
          {/* Badges */}
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            {owner.superhost && <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,background:"#FFF5F5",color:C.coral,border:`1px solid ${C.coral}33`}}>⭐ Superhost</span>}
            <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:C.bg,color:C.dark,border:`1px solid ${C.border}`}}>★ {owner.rating} · {owner.reviews} avis</span>
            <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:C.bg,color:C.dark,border:`1px solid ${C.border}`}}>✓ Identité vérifiée</span>
          </div>

          <p style={{fontSize:13,color:C.mid,lineHeight:1.7,marginBottom:16}}>{owner.about}</p>

          {/* Stats portefeuille */}
          <div style={{display:"flex",background:C.bg,borderRadius:14,padding:"14px",gap:0,marginBottom:4}}>
            {[
              {val:owner.buildings.length,  label:"Immeubles"},
              {val:totalUnits,              label:"Unités total"},
              {val:availUnits,              label:"Disponibles", color:"#16A34A"},
              {val:totalUnits-availUnits,   label:"Réservés",    color:C.coral},
            ].map((s,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,...(i>0?{borderLeft:`1px solid ${C.border}`}:{})}}>
                <span style={{fontSize:18,fontWeight:800,color:s.color||C.black}}>{s.val}</span>
                <span style={{fontSize:9,fontWeight:500,color:C.light,textTransform:"uppercase",letterSpacing:.4,textAlign:"center"}}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buildings / Établissements */}
        <div style={{padding:"12px 16px 100px",display:"flex",flexDirection:"column",gap:14}}>
          <p style={{fontSize:15,fontWeight:700,color:C.black}}>Son portefeuille</p>

          {owner.buildings.map(building => {
            const isOpen     = !!expanded[building.id];
            const availInB   = building.units.filter(u=>u.available).length;
            const totalInB   = building.units.length;
            const typeIcons  = { immeuble:"🏢", villa:"🏡", hotel:"🏨", motel:"🏩" };

            return (
              <div key={building.id} style={{background:C.white,borderRadius:18,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.07)"}}>
                {/* Building header */}
                <div style={{position:"relative",height:130,cursor:"pointer"}} onClick={()=>toggleBuilding(building.id)}>
                  <img src={building.img} alt={building.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.65) 0%,transparent 50%)"}}/>
                  <div style={{position:"absolute",bottom:12,left:14,right:14}}>
                    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
                      <div>
                        <p style={{fontSize:15,fontWeight:700,color:"white"}}>{typeIcons[building.type]||"🏠"} {building.name}</p>
                        <p style={{fontSize:11,color:"rgba(255,255,255,.75)",marginTop:2}}>
                          <ByerPin size={11}/> {building.address}
                        </p>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{background:"rgba(255,255,255,.92)",borderRadius:10,padding:"4px 9px",display:"inline-block"}}>
                          <span style={{fontSize:11,fontWeight:700,color:availInB>0?"#16A34A":C.coral}}>
                            {availInB}/{totalInB} dispo
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,.3)",borderRadius:20,padding:"4px 8px",display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:10,fontWeight:600,color:"white"}}>{isOpen?"Fermer":"Voir unités"}</span>
                    <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24" style={{transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>

                {/* Units list — expanded */}
                {isOpen && (
                  <div style={{padding:"8px 0"}}>
                    {building.units.map((unit,ui) => {
                      const isAvail = unit.available;
                      return (
                        <div key={unit.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderTop:ui>0?`1px solid ${C.border}`:"none"}}>
                          <div style={{width:10,height:10,borderRadius:5,flexShrink:0,background:isAvail?"#16A34A":C.light,...(isAvail?{boxShadow:"0 0 0 3px #16A34A22"}:{})}}/>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <p style={{fontSize:13,fontWeight:600,color:C.black}}>{unit.label}</p>
                              {unit.count && <span style={{fontSize:10,color:C.mid,background:C.bg,padding:"1px 6px",borderRadius:8}}>×{unit.count}</span>}
                            </div>
                            <p style={{fontSize:11,color:C.light,marginTop:1}}>
                              {unit.floor}
                              {!isAvail && unit.availableFrom && ` · Libre le ${unit.availableFrom}`}
                            </p>
                          </div>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            {isAvail ? (
                              <>
                                <p style={{fontSize:13,fontWeight:700,color:C.black}}>{fmt(unit.nightPrice)}</p>
                                <p style={{fontSize:10,color:C.light}}>/nuit</p>
                              </>
                            ) : (
                              <span style={{fontSize:10,fontWeight:600,color:C.light,background:C.bg,padding:"3px 8px",borderRadius:10}}>Réservé</span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <div style={{padding:"10px 16px 6px",display:"flex",gap:8}}>
                      <button style={{...S.mapsBtn,flex:1,background:"#F0FDF4",borderColor:"#BBF7D0",color:"#16A34A",justifyContent:"center"}}>
                        <Icon name="message" size={15} color="#16A34A" stroke={2}/>
                        <span>Contacter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
