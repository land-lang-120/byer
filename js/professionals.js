/* Byer — Professionals (Concierges & Agents Immobiliers)
   Système de gestion des concierges, agents immobiliers et
   gestionnaires locatifs pour bailleurs et locataires.
   - Bailleur : recruter, valider, retirer
   - Locataire / Voyageur : trouver un concierge, contacter
   ═══════════════════════════════════════════════════ */

/* ─── PROFESSIONALS LIST SCREEN ──────────────────── */
function ProfessionalsScreen({ onBack, role }) {
  const [category, setCategory] = useState("all");
  const [selectedPro, setSelectedPro] = useState(null);
  const [assignedIds, setAssignedIds] = useState(OWNER_PROFESSIONALS["Ekwalla M."] || []);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [contactOpen, setContactOpen] = useState(null); // pro | null
  const [contactSent, setContactSent] = useState(null); // proId | null
  /* Profils ajoutés par l'utilisateur (persistés via byerStorage) */
  const [userPros, setUserPros] = useState(() => userProfiles.getPros());
  const [becomeOpen, setBecomeOpen] = useState(false);
  const [becomeSuccess, setBecomeSuccess] = useState(false);

  const isBailleur = role === "bailleur";

  /* Liste combinée : profils utilisateur d'abord, puis catalogue de base */
  const allPros = [...userPros, ...PROFESSIONALS];
  const filtered = allPros.filter(p => {
    if (category !== "all" && p.category !== category) return false;
    return true;
  });

  /* Mes pros vs disponibles (côté bailleur uniquement) */
  const myPros    = isBailleur ? filtered.filter(p=>assignedIds.includes(p.id)) : filtered;
  const otherPros = isBailleur ? filtered.filter(p=>!assignedIds.includes(p.id)) : [];

  const callPhone = (phone) => {
    window.open("tel:"+phone.replace(/\s/g,""), "_self");
  };

  const addPro = (id) => setAssignedIds(p=>[...p,id]);
  const removePro = (id) => { setAssignedIds(p=>p.filter(x=>x!==id)); setConfirmRemove(null); };

  if (selectedPro) return (
    <ProProfileScreen
      pro={selectedPro}
      onBack={()=>setSelectedPro(null)}
      isBailleur={isBailleur}
      isAssigned={assignedIds.includes(selectedPro.id)}
      onAssign={()=>addPro(selectedPro.id)}
      onRemove={()=>removePro(selectedPro.id)}
      onCall={()=>callPhone(selectedPro.phone)}
      onContact={()=>setContactOpen(selectedPro)}
      contactSent={contactSent===selectedPro.id}
    />
  );

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Header */}
        <div style={S.rentHeader}>
          <button style={S.dBack2} onClick={onBack}>
            <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
          </button>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>
            {isBailleur ? "Mes Pros" : "Concierges & Agents"}
          </p>
          <div style={{width:38}}/>
        </div>

        {/* Subtitle */}
        <div style={{padding:"4px 16px 0"}}>
          <p style={{fontSize:12,color:C.light,lineHeight:1.55}}>
            {isBailleur
              ? "Recrutez des conciergeries, agents immobiliers ou gestionnaires locatifs pour vous accompagner."
              : "Trouvez un service de conciergerie ou un agent immobilier de confiance dans votre ville."}
          </p>
        </div>

        {/* Category chips */}
        <div style={{display:"flex",gap:6,padding:"12px 16px",overflowX:"auto"}}>
          <button
            style={{...S.typeChip,...(category==="all"?S.typeChipOn:{})}}
            onClick={()=>setCategory("all")}
          >
            <span style={{fontSize:13}}>👥</span>
            <span style={{...S.typeLabel,...(category==="all"?{color:C.coral}:{})}}>Tous</span>
          </button>
          {PRO_CATEGORIES.map(c=>(
            <button key={c.id}
              style={{...S.typeChip,...(category===c.id?S.typeChipOn:{})}}
              onClick={()=>setCategory(c.id)}
            >
              <span style={{fontSize:13}}>{c.icon}</span>
              <span style={{...S.typeLabel,...(category===c.id?{color:C.coral}:{})}}>
                {c.label}
              </span>
            </button>
          ))}
        </div>

        {/* Become Pro CTA */}
        <div style={{padding:"0 16px 8px"}}>
          <button
            onClick={()=>setBecomeOpen(true)}
            style={{
              width:"100%",display:"flex",alignItems:"center",gap:12,
              background:"linear-gradient(135deg,#FAF5FF 0%,#F3E8FF 100%)",
              border:"1.5px dashed #A855F7",borderRadius:14,padding:"12px 14px",cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",
            }}
          >
            <div style={{width:38,height:38,borderRadius:19,background:"#7E22CE",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>🛎️</span>
            </div>
            <div style={{flex:1,textAlign:"left"}}>
              <p style={{fontSize:13,fontWeight:700,color:"#7E22CE"}}>Devenir concierge ou agent immo.</p>
              <p style={{fontSize:11,color:"#A855F7",marginTop:1}}>Inscrivez votre activité pour gérer des biens</p>
            </div>
            <span style={{fontSize:18,color:"#7E22CE",fontWeight:700}}>+</span>
          </button>
        </div>

        {/* My pros (bailleur only) */}
        {isBailleur && myPros.length>0 && (
          <div style={{padding:"0 16px"}}>
            <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:10}}>Mon réseau ({myPros.length})</p>
            {myPros.map(pro => (
              <ProCard
                key={pro.id} pro={pro}
                onTap={()=>setSelectedPro(pro)}
                onCall={()=>callPhone(pro.phone)}
                isBailleur={isBailleur}
                isAssigned={true}
                onRemove={()=>setConfirmRemove(pro.id)}
              />
            ))}
          </div>
        )}

        {/* Available pros */}
        <div style={{padding:"12px 16px 100px"}}>
          <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:10}}>
            {isBailleur
              ? "Disponibles à recruter"
              : `${myPros.length} professionnel${myPros.length>1?"s":""}`}
          </p>
          {(isBailleur ? otherPros : myPros).length === 0 ? (
            <EmptyState icon="user" text="Aucun professionnel dans cette catégorie."/>
          ) : (
            (isBailleur ? otherPros : myPros).map(pro => (
              <ProCard
                key={pro.id} pro={pro}
                onTap={()=>setSelectedPro(pro)}
                onCall={()=>callPhone(pro.phone)}
                isBailleur={isBailleur}
                isAssigned={false}
                onAdd={()=>addPro(pro.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Contact request sheet */}
      {contactOpen && (
        <ContactRequestSheet
          pro={contactOpen}
          onClose={()=>setContactOpen(null)}
          onSubmit={()=>{
            setContactSent(contactOpen.id);
            setContactOpen(null);
            setTimeout(()=>setContactSent(null), 5000);
          }}
        />
      )}

      {/* Become pro sheet */}
      {becomeOpen && (
        <BecomeProSheet
          onClose={()=>setBecomeOpen(false)}
          onSubmit={(newPro)=>{
            userProfiles.addPro(newPro);
            setUserPros(userProfiles.getPros());
            setBecomeOpen(false);
            setBecomeSuccess(true);
            setTimeout(()=>setBecomeSuccess(false), 4000);
          }}
        />
      )}

      {/* Success banner */}
      {becomeSuccess && (
        <div style={{position:"fixed",top:60,left:16,right:16,background:"#16A34A",color:"white",padding:"12px 14px",borderRadius:14,boxShadow:"0 4px 16px rgba(0,0,0,.18)",zIndex:400,display:"flex",alignItems:"center",gap:10,fontFamily:"'DM Sans',sans-serif"}}>
          <span style={{fontSize:18}}>✅</span>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:700}}>Profil créé !</p>
            <p style={{fontSize:11,opacity:.9,marginTop:1}}>Vous êtes désormais visible et vous pouvez recevoir des biens à gérer.</p>
          </div>
        </div>
      )}

      {/* Confirm remove dialog */}
      {confirmRemove && (
        <>
          <div style={S.sheetBackdrop} onClick={()=>setConfirmRemove(null)}/>
          <div style={{...S.sheet,padding:"24px",zIndex:201}} className="sheet">
            <div style={S.sheetHandle}/>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"16px 0"}}>
              <div style={{width:56,height:56,borderRadius:28,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:24}}>👋</span>
              </div>
              <p style={{fontSize:16,fontWeight:700,color:C.black,textAlign:"center"}}>Mettre fin à la collaboration ?</p>
              <p style={{fontSize:13,color:C.mid,textAlign:"center",lineHeight:1.6}}>
                Ce professionnel ne fera plus partie de votre réseau. Vous pourrez l'inviter à nouveau plus tard.
              </p>
              <button onClick={()=>removePro(confirmRemove)} style={{...S.payBtn,background:C.dark,marginTop:8}}>
                Mettre fin à la collaboration
              </button>
              <button onClick={()=>setConfirmRemove(null)} style={{...S.reminderBtn,marginTop:0}}>
                Annuler
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── PRO CARD ───────────────────────────────────── */
function ProCard({ pro, onTap, onCall, isBailleur, isAssigned, onAdd, onRemove }) {
  const cat = PRO_CATEGORIES.find(c=>c.id===pro.category);
  return (
    <div style={{background:C.white,borderRadius:16,padding:"14px",marginBottom:10,boxShadow:"0 1px 8px rgba(0,0,0,.05)",cursor:"pointer"}} onClick={onTap}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{position:"relative"}}>
          <FaceAvatar photo={pro.photo} avatar={pro.name[0]} bg={cat?.color||C.mid} size={48} radius={24}/>
          {pro.available && (
            <div style={{position:"absolute",bottom:0,right:0,width:14,height:14,borderRadius:7,background:"#16A34A",border:"2px solid white"}}/>
          )}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <p style={{fontSize:14,fontWeight:600,color:C.black}}>{pro.name}</p>
            {pro.verified && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#2563EB" stroke="white" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            )}
          </div>
          {pro.company && (
            <p style={{fontSize:11,color:C.mid,marginTop:1,fontWeight:500}}>{pro.company}</p>
          )}
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3,flexWrap:"wrap"}}>
            <span style={{fontSize:11,fontWeight:600,padding:"2px 7px",borderRadius:8,background:cat?cat.color+"18":C.bg,color:cat?.color||C.mid}}>
              {cat?.icon} {cat?.label}
            </span>
            <span style={{fontSize:11,color:C.light}}>{pro.city}</span>
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:3}}>
            <Icon name="star" size={12} color={C.coral}/>
            <span style={{fontSize:13,fontWeight:700,color:C.dark}}>{pro.rating}</span>
          </div>
          <p style={{fontSize:10,color:C.light}}>{pro.jobs} miss.</p>
        </div>
      </div>

      {/* Action row */}
      <div style={{display:"flex",gap:8,marginTop:10}} onClick={e=>e.stopPropagation()}>
        <button onClick={onCall} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px",borderRadius:10,background:"#F0FDF4",border:"1.5px solid #BBF7D0",cursor:"pointer"}}>
          <span style={{fontSize:12}}>📞</span>
          <span style={{fontSize:12,fontWeight:600,color:"#16A34A"}}>Appeler</span>
        </button>
        {isBailleur && !isAssigned && onAdd && (
          <button onClick={onAdd} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px",borderRadius:10,background:C.coral,border:"none",cursor:"pointer"}}>
            <span style={{fontSize:12,color:"white",fontWeight:600}}>+ Recruter</span>
          </button>
        )}
        {isBailleur && isAssigned && onRemove && (
          <button onClick={onRemove} title="Mettre fin à la collaboration" style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"9px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.bg,cursor:"pointer"}}>
            <Icon name="close" size={14} color={C.mid} stroke={2}/>
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── PRO PROFILE SCREEN ─────────────────────────── */
function ProProfileScreen({ pro, onBack, isBailleur, isAssigned, onAssign, onRemove, onCall, onContact, contactSent }) {
  const cat = PRO_CATEGORIES.find(c=>c.id===pro.category);

  /* ── Vue inverse : entités déléguées à ce pro ─────────
     Un pro peut gérer plusieurs immeubles/hôtels/villas,
     chacun appartenant à un bailleur différent.
  ───────────────────────────────────────────────────── */
  const managedIds = delegations.forPro(pro.id);
  const allBuildings = Object.values(OWNERS).flatMap(o =>
    o.buildings.map(b => ({ ...b, ownerName: o.name, ownerCity: o.city }))
  );
  const managedBuildings = allBuildings.filter(b => managedIds.includes(b.id));

  const typeIcons  = { immeuble:"🏢", villa:"🏡", hotel:"🏨", motel:"🛏️" };
  const typeLabels = { immeuble:"Immeuble", villa:"Villa", hotel:"Hôtel", motel:"Motel" };

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto",paddingBottom:120}}>

        {/* Header */}
        <div style={S.rentHeader}>
          <button style={S.dBack2} onClick={onBack}>
            <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
          </button>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Profil</p>
          <div style={{width:38}}/>
        </div>

        {/* Identity card */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 24px 8px"}}>
          <div style={{position:"relative"}}>
            <FaceAvatar photo={pro.photo} avatar={pro.name[0]} bg={cat?.color||C.mid} size={86} radius={43}/>
            {pro.available && (
              <div style={{position:"absolute",bottom:2,right:2,width:18,height:18,borderRadius:9,background:"#16A34A",border:"3px solid white"}}/>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:12}}>
            <p style={{fontSize:18,fontWeight:700,color:C.black}}>{pro.name}</p>
            {pro.verified && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563EB" stroke="white" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            )}
          </div>
          {pro.company && (
            <p style={{fontSize:13,color:C.mid,marginTop:2,fontWeight:500}}>{pro.company}</p>
          )}
          <span style={{fontSize:12,fontWeight:700,padding:"4px 10px",borderRadius:10,background:cat?cat.color+"18":C.bg,color:cat?.color||C.mid,marginTop:8}}>
            {cat?.icon} {cat?.label}
          </span>
          <p style={{fontSize:12,color:C.light,marginTop:8,display:"flex",alignItems:"center",gap:4}}>
            <ByerPin size={12}/> {pro.zone}, {pro.city}
          </p>
        </div>

        {/* Stats row */}
        <div style={{display:"flex",gap:10,padding:"16px",margin:"0 16px",borderRadius:16,background:C.bg}}>
          <div style={{flex:1,textAlign:"center"}}>
            <p style={{fontSize:18,fontWeight:800,color:C.black}}>{pro.rating}</p>
            <p style={{fontSize:10,color:C.mid,textTransform:"uppercase",letterSpacing:.4,fontWeight:600}}>Note</p>
          </div>
          <div style={{width:1,background:C.border}}/>
          <div style={{flex:1,textAlign:"center"}}>
            <p style={{fontSize:18,fontWeight:800,color:C.black}}>{pro.jobs}</p>
            <p style={{fontSize:10,color:C.mid,textTransform:"uppercase",letterSpacing:.4,fontWeight:600}}>Missions</p>
          </div>
          <div style={{width:1,background:C.border}}/>
          <div style={{flex:1,textAlign:"center"}}>
            <p style={{fontSize:18,fontWeight:800,color:C.black}}>{pro.experience}</p>
            <p style={{fontSize:10,color:C.mid,textTransform:"uppercase",letterSpacing:.4,fontWeight:600}}>Exp.</p>
          </div>
        </div>

        {/* About */}
        <div style={{padding:"16px",margin:"16px",borderRadius:16,background:C.white,boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
          <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:8}}>À propos</p>
          <p style={{fontSize:13,color:C.dark,lineHeight:1.7}}>{pro.about}</p>
        </div>

        {/* Entités gérées (vue inverse de la délégation) */}
        {managedBuildings.length > 0 && (
          <div style={{padding:"16px",margin:"0 16px 16px",borderRadius:16,background:C.white,boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <p style={{fontSize:13,fontWeight:700,color:C.black}}>
                Entités gérées <span style={{color:C.mid,fontWeight:600}}>({managedBuildings.length})</span>
              </p>
              <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8,background:"#FAF5FF",color:"#7E22CE",border:"1px solid #E9D5FF"}}>
                PORTEFEUILLE
              </span>
            </div>
            <p style={{fontSize:11,color:C.light,marginBottom:12,lineHeight:1.5}}>
              Biens confiés par {new Set(managedBuildings.map(b=>b.ownerName)).size} bailleur{new Set(managedBuildings.map(b=>b.ownerName)).size>1?"s":""} — preuve de confiance et d'expérience.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {managedBuildings.map(b => {
                const totalUnits = b.units?.length || 0;
                const availUnits = b.units?.filter(u=>u.available).length || 0;
                return (
                  <div key={b.id} style={{display:"flex",gap:10,padding:"10px",borderRadius:12,background:C.bg,border:`1px solid ${C.border}`}}>
                    <img src={b.img} alt={b.name}
                      style={{width:56,height:56,borderRadius:10,objectFit:"cover",flexShrink:0,background:C.border}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                        <span style={{fontSize:12}}>{typeIcons[b.type]||"🏠"}</span>
                        <p style={{fontSize:13,fontWeight:700,color:C.black,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                          {b.name}
                        </p>
                      </div>
                      <p style={{fontSize:10,color:C.mid,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                        {typeLabels[b.type]||b.type} · {b.address}
                      </p>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4,flexWrap:"wrap"}}>
                        <span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:6,background:C.white,color:C.dark,border:`1px solid ${C.border}`}}>
                          {totalUnits} unité{totalUnits>1?"s":""}
                        </span>
                        {availUnits>0 && (
                          <span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:6,background:"#F0FDF4",color:"#16A34A",border:"1px solid #BBF7D0"}}>
                            {availUnits} dispo
                          </span>
                        )}
                        <span style={{fontSize:10,color:C.light}}>
                          Bailleur : <strong style={{color:C.dark}}>{b.ownerName}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Services */}
        {pro.services && pro.services.length > 0 && (
          <div style={{padding:"16px",margin:"0 16px 16px",borderRadius:16,background:C.white,boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
            <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:10}}>Services</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {pro.services.map(s=>(
                <span key={s} style={{fontSize:11,fontWeight:600,padding:"5px 10px",borderRadius:10,background:C.bg,color:C.dark}}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pricing & Languages */}
        <div style={{padding:"16px",margin:"0 16px 16px",borderRadius:16,background:C.white,boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
          <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:10}}>Conditions</p>
          {pro.commission && (
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:12,color:C.mid}}>Commission</span>
              <span style={{fontSize:12,fontWeight:700,color:C.coral}}>{pro.commission}</span>
            </div>
          )}
          {pro.languages && pro.languages.length > 0 && (
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}>
              <span style={{fontSize:12,color:C.mid}}>Langues</span>
              <span style={{fontSize:12,fontWeight:600,color:C.dark}}>{pro.languages.join(", ")}</span>
            </div>
          )}
        </div>

        {/* Status banner */}
        {!pro.available && (
          <div style={{padding:"12px 14px",margin:"0 16px 16px",borderRadius:12,background:"#FEF2F2",border:"1px solid #FEC8C8"}}>
            <p style={{fontSize:12,color:"#B91C1C",fontWeight:600}}>⚠️ Indisponible actuellement — agenda complet.</p>
          </div>
        )}

        {/* Contact sent banner */}
        {contactSent && (
          <div style={{padding:"12px 14px",margin:"0 16px 16px",borderRadius:12,background:"#F0FDF4",border:"1px solid #BBF7D0"}}>
            <p style={{fontSize:12,color:"#16A34A",fontWeight:600}}>✓ Demande envoyée — réponse sous 24-48h.</p>
          </div>
        )}
      </div>

      {/* Sticky action bar */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.white,borderTop:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",gap:8}}>
        <button onClick={onCall} style={{flex:1,padding:"12px",borderRadius:12,background:"#16A34A",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,color:"white",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          📞 Appeler
        </button>
        {isBailleur ? (
          isAssigned ? (
            <button onClick={onRemove} style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${C.border}`,background:C.bg,cursor:"pointer",fontSize:13,fontWeight:600,color:C.dark}}>
              Mettre fin
            </button>
          ) : (
            <button onClick={onAssign} disabled={!pro.available} style={{flex:1,padding:"12px",borderRadius:12,background:pro.available?C.coral:C.border,border:"none",cursor:pro.available?"pointer":"not-allowed",fontSize:13,fontWeight:700,color:"white"}}>
              + Recruter
            </button>
          )
        ) : (
          <button onClick={onContact} disabled={!pro.available || contactSent} style={{flex:1,padding:"12px",borderRadius:12,background:(!pro.available||contactSent)?C.border:C.coral,border:"none",cursor:(!pro.available||contactSent)?"not-allowed":"pointer",fontSize:13,fontWeight:700,color:"white"}}>
            {contactSent ? "Envoyée ✓" : "Contacter"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── CONTACT REQUEST SHEET ──────────────────────── */
function ContactRequestSheet({ pro, onClose, onSubmit }) {
  const [need, setNeed] = useState("");
  const [details, setDetails] = useState("");
  const [city, setCity] = useState(pro.city);

  const cat = PRO_CATEGORIES.find(c=>c.id===pro.category);
  const needsByCat = {
    conciergerie:["Gestion location courte durée","Accueil voyageur","Ménage régulier","Autre"],
    agent_immo:  ["Recherche logement","Mise en location","Vente","Estimation"],
    gestion_loc: ["Gestion complète","Encaissement loyers","États des lieux","Autre"],
  };
  const needs = needsByCat[pro.category] || ["Autre"];

  const canSend = need && details.trim().length >= 10;

  return (
    <>
      <div style={S.sheetBackdrop} onClick={onClose}/>
      <div style={{...S.sheet,padding:"20px",maxHeight:"85vh",overflowY:"auto",zIndex:201}} className="sheet">
        <div style={S.sheetHandle}/>

        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <FaceAvatar photo={pro.photo} avatar={pro.name[0]} bg={cat?.color||C.mid} size={44} radius={22}/>
          <div style={{flex:1}}>
            <p style={{fontSize:15,fontWeight:700,color:C.black}}>Contacter {pro.name.split(" ")[0]}</p>
            <p style={{fontSize:11,color:C.mid}}>{cat?.label} · Réponse sous 24-48h</p>
          </div>
        </div>

        {/* Need type */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>
            Quel est votre besoin ?
          </label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {needs.map(n=>(
              <button key={n}
                onClick={()=>setNeed(n)}
                style={{
                  padding:"7px 12px",borderRadius:10,cursor:"pointer",
                  border: need===n ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                  background: need===n ? "#FFF5F5" : C.white,
                  fontSize:12,fontWeight:600,
                  color: need===n ? C.coral : C.mid,
                  fontFamily:"'DM Sans',sans-serif",
                }}
              >{n}</button>
            ))}
          </div>
        </div>

        {/* City */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>
            Ville concernée
          </label>
          <select value={city} onChange={e=>setCity(e.target.value)}
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,background:C.white,fontFamily:"'DM Sans',sans-serif"}}
          >
            {LOCATIONS.slice(1).map(l=>(
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Details */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>
            Détails (10 caractères min.)
          </label>
          <textarea value={details} onChange={e=>setDetails(e.target.value)}
            rows={4}
            placeholder="Décrivez votre demande, vos contraintes, vos dates…"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,resize:"none",outline:"none",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif",background:C.white}}
          />
          <p style={{fontSize:10,color:C.light,marginTop:3}}>{details.length} caractère{details.length>1?"s":""}</p>
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${C.border}`,background:C.white,cursor:"pointer",fontSize:13,fontWeight:600,color:C.dark}}>
            Annuler
          </button>
          <button onClick={canSend?onSubmit:undefined} disabled={!canSend}
            style={{flex:1,padding:"12px",borderRadius:12,background:canSend?C.coral:C.border,border:"none",cursor:canSend?"pointer":"not-allowed",fontSize:13,fontWeight:700,color:"white"}}
          >
            Envoyer la demande
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── BECOME PRO SHEET ───────────────────────────── */
function BecomeProSheet({ onClose, onSubmit }) {
  const [name, setName]         = useState("");
  const [category, setCategory] = useState(PRO_CATEGORIES[0].id);
  const [company, setCompany]   = useState("");
  const [city, setCity]         = useState(LOCATIONS[1]?.id || "douala");
  const [zone, setZone]         = useState("");
  const [phone, setPhone]       = useState("");
  const [commission, setCommission] = useState("");
  const [experience, setExperience] = useState("1 an");
  const [languages, setLanguages]   = useState(["Français"]);
  const [services, setServices]     = useState([]);
  const [about, setAbout]           = useState("");

  const allLanguages = ["Français","Anglais","Espagnol","Allemand","Arabe","Duala","Bassa","Ewondo","Bamiléké"];
  const servicesByCat = {
    conciergerie: ["Accueil voyageur","Ménage","Check-in/out","Linge & blanchisserie","Photo annonce","Maintenance"],
    agent_immo:   ["Vente","Location","Estimation","Visite virtuelle","Négociation","Gestion administrative"],
    gestion_loc:  ["Loyers","États des lieux","Maintenance","Gestion litiges","Comptabilité","Mandataire"],
  };
  const availServices = servicesByCat[category] || [];

  const toggleLang = (lang) => {
    setLanguages(prev => prev.includes(lang) ? prev.filter(l=>l!==lang) : [...prev, lang]);
  };
  const toggleService = (svc) => {
    setServices(prev => prev.includes(svc) ? prev.filter(s=>s!==svc) : [...prev, svc]);
  };

  const canSubmit = name.trim().length >= 3
    && phone.trim().length >= 8
    && zone.trim().length >= 2
    && about.trim().length >= 20
    && services.length >= 1
    && languages.length >= 1;

  const handleSubmit = () => {
    const cat = PRO_CATEGORIES.find(c=>c.id===category);
    const newPro = {
      id: "UP" + Date.now(),
      name: name.trim(),
      category,
      company: company.trim() || null,
      phone: phone.trim(),
      rating: 0,
      jobs: 0,
      photo: `https://i.pravatar.cc/100?u=${encodeURIComponent(name.trim())}`,
      city,
      zone: zone.trim(),
      available: true,
      verified: false,
      commission: commission.trim() || null,
      experience: experience.trim() || "1 an",
      languages: [...languages],
      services: [...services],
      about: about.trim(),
      isUserCreated: true,
      _color: cat?.color,
    };
    onSubmit?.(newPro);
  };

  return (
    <>
      <div style={{...S.sheetBackdrop,zIndex:300}} onClick={onClose}/>
      <div style={{...S.sheet,zIndex:301,maxHeight:"94vh",display:"flex",flexDirection:"column"}} className="sheet">
        <div style={S.sheetHandle}/>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 20px 12px"}}>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Devenir pro</p>
          <button style={S.sheetClose} onClick={onClose}>
            <Icon name="close" size={18} color={C.mid}/>
          </button>
        </div>

        <div style={{padding:"0 20px 20px",overflowY:"auto",flex:1}}>

          {/* Intro */}
          <div style={{background:"#FAF5FF",border:"1px solid #E9D5FF",borderRadius:14,padding:"12px",marginBottom:14}}>
            <p style={{fontSize:12,color:"#6B21A8",lineHeight:1.6}}>
              <strong>Inscrivez votre activité.</strong> Une fois publié, les bailleurs pourront vous confier leurs biens (immeubles, hôtels…) et les voyageurs vous contacter.
            </p>
          </div>

          {/* Name */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Nom complet *</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex. Jean Mboma"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,marginBottom:12,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>

          {/* Category */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Activité *</label>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
            {PRO_CATEGORIES.map(c => (
              <button key={c.id}
                onClick={()=>{setCategory(c.id); setServices([]);}}
                style={{
                  display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,
                  border: category===c.id ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                  background: category===c.id ? "#FFF5F5" : C.white,
                  cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                }}
              >
                <span style={{fontSize:18}}>{c.icon}</span>
                <span style={{fontSize:13,fontWeight:600,color: category===c.id ? C.coral : C.dark}}>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Company */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Société (facultatif)</label>
          <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Ex. Mboma & Associés"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,marginBottom:12,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>

          {/* City + Zone */}
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <div style={{flex:1}}>
              <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Ville *</label>
              <select value={city} onChange={e=>setCity(e.target.value)}
                style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,background:C.white,fontFamily:"'DM Sans',sans-serif"}}>
                {LOCATIONS.slice(1).map(l=>(
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </div>
            <div style={{flex:1}}>
              <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Quartier *</label>
              <input value={zone} onChange={e=>setZone(e.target.value)} placeholder="Ex. Bonapriso"
                style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
            </div>
          </div>

          {/* Phone */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Téléphone *</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Ex. +237 6 99 12 34 56"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,marginBottom:12,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>

          {/* Commission + Experience */}
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <div style={{flex:1}}>
              <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Commission</label>
              <input value={commission} onChange={e=>setCommission(e.target.value)} placeholder="Ex. 15%"
                style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
            </div>
            <div style={{flex:1}}>
              <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Expérience</label>
              <select value={experience} onChange={e=>setExperience(e.target.value)}
                style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,background:C.white,fontFamily:"'DM Sans',sans-serif"}}>
                {["< 1 an","1 an","2 ans","3 ans","5 ans","7 ans","10+ ans"].map(e=>(
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Services */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Services proposés *</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
            {availServices.map(s => (
              <button key={s} onClick={()=>toggleService(s)}
                style={{
                  padding:"6px 11px",borderRadius:10,cursor:"pointer",
                  border: services.includes(s) ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                  background: services.includes(s) ? "#FFF5F5" : C.white,
                  fontSize:11,fontWeight:600,
                  color: services.includes(s) ? C.coral : C.mid,
                  fontFamily:"'DM Sans',sans-serif",
                }}>{s}</button>
            ))}
          </div>

          {/* Languages */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>Langues parlées *</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
            {allLanguages.map(l => (
              <button key={l} onClick={()=>toggleLang(l)}
                style={{
                  padding:"6px 11px",borderRadius:10,cursor:"pointer",
                  border: languages.includes(l) ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                  background: languages.includes(l) ? "#FFF5F5" : C.white,
                  fontSize:11,fontWeight:600,
                  color: languages.includes(l) ? C.coral : C.mid,
                  fontFamily:"'DM Sans',sans-serif",
                }}>{l}</button>
            ))}
          </div>

          {/* About */}
          <label style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,display:"block"}}>À propos * <span style={{color:C.light,fontWeight:400}}>(20 car. min.)</span></label>
          <textarea value={about} onChange={e=>setAbout(e.target.value)} rows={4}
            placeholder="Présentez votre parcours, vos points forts, votre zone d'intervention…"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,marginBottom:6,outline:"none",resize:"none",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif",background:C.white}}/>
          <p style={{fontSize:10,color:C.light,marginBottom:14}}>{about.length} caractère{about.length>1?"s":""}</p>

          {/* Submit */}
          <button onClick={canSubmit ? handleSubmit : undefined} disabled={!canSubmit}
            style={{width:"100%",padding:"13px",borderRadius:14,background:canSubmit?"#7E22CE":C.border,border:"none",cursor:canSubmit?"pointer":"not-allowed",fontSize:14,fontWeight:700,color:"white",fontFamily:"'DM Sans',sans-serif"}}>
            Publier mon profil
          </button>
          <p style={{fontSize:10,color:C.light,textAlign:"center",marginTop:8,lineHeight:1.5}}>
            Votre profil sera visible aux bailleurs et voyageurs. Vous pourrez le modifier ou le supprimer à tout moment.
          </p>
        </div>
      </div>
    </>
  );
}
