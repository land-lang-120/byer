/* Byer — Technicians
   Système de gestion des techniciens pour bailleurs et locataires.
   - Bailleur : recruter, valider, remplacer, retirer
   - Locataire : voir profils, appeler
   ═══════════════════════════════════════════════════ */

/* ─── TECHNICIANS LIST SCREEN ────────────────────── */
function TechniciansScreen({ onBack, role }) {
  const [category, setCategory] = useState("all");
  const [selectedTech, setSelectedTech] = useState(null);
  const [assignedIds, setAssignedIds] = useState(OWNER_TECHNICIANS["Ekwalla M."] || []);
  const [confirmRemove, setConfirmRemove] = useState(null);
  /* Profils ajoutés par l'utilisateur (persistés via byerStorage) */
  const [userTechs, setUserTechs] = useState(() => userProfiles.getTechs());
  const [becomeOpen, setBecomeOpen] = useState(false);
  const [becomeSuccess, setBecomeSuccess] = useState(false);

  const isBailleur = role === "bailleur";

  /* Liste combinée : profils utilisateur d'abord, puis catalogue de base */
  const allTechs = [...userTechs, ...TECHNICIANS];
  const filtered = allTechs.filter(t => {
    if (category !== "all" && t.category !== category) return false;
    return true;
  });

  /* Assigned vs available */
  const myTechs     = isBailleur ? filtered.filter(t=>assignedIds.includes(t.id)) : filtered;
  const otherTechs  = isBailleur ? filtered.filter(t=>!assignedIds.includes(t.id)) : [];

  const callPhone = (phone) => {
    window.open("tel:"+phone.replace(/\s/g,""), "_self");
  };

  const addTech = (id) => setAssignedIds(p=>[...p,id]);
  const removeTech = (id) => { setAssignedIds(p=>p.filter(x=>x!==id)); setConfirmRemove(null); };

  const [quoteOpen, setQuoteOpen] = useState(null); // tech | null
  const [quoteSent, setQuoteSent] = useState(null); // techId | null

  if (selectedTech) return (
    <TechProfileScreen
      tech={selectedTech}
      onBack={()=>setSelectedTech(null)}
      isBailleur={isBailleur}
      isAssigned={assignedIds.includes(selectedTech.id)}
      onAssign={()=>addTech(selectedTech.id)}
      onRemove={()=>removeTech(selectedTech.id)}
      onCall={()=>callPhone(selectedTech.phone)}
      onRequestQuote={()=>setQuoteOpen(selectedTech)}
      quoteSent={quoteSent===selectedTech.id}
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
            {isBailleur ? "Mes Techniciens" : "Techniciens disponibles"}
          </p>
          <div style={{width:38}}/>
        </div>

        {/* Category chips */}
        <div style={{display:"flex",gap:6,padding:"12px 16px",overflowX:"auto"}}>
          <button
            style={{...S.typeChip,...(category==="all"?S.typeChipOn:{})}}
            onClick={()=>setCategory("all")}
          >
            <span style={{fontSize:13}}>👷</span>
            <span style={{...S.typeLabel,...(category==="all"?{color:C.coral}:{})}}>Tous</span>
          </button>
          {TECH_CATEGORIES.map(c=>(
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

        {/* Become Technician CTA */}
        <div style={{padding:"0 16px 8px"}}>
          <button
            onClick={()=>setBecomeOpen(true)}
            style={{
              width:"100%",display:"flex",alignItems:"center",gap:12,
              background:"linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 100%)",
              border:"1.5px dashed #60A5FA",borderRadius:14,padding:"12px 14px",cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",
            }}
          >
            <div style={{width:38,height:38,borderRadius:19,background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>🛠️</span>
            </div>
            <div style={{flex:1,textAlign:"left"}}>
              <p style={{fontSize:13,fontWeight:700,color:"#1D4ED8"}}>Devenir technicien</p>
              <p style={{fontSize:11,color:"#3B82F6",marginTop:1}}>Inscrivez votre profil pour recevoir des missions</p>
            </div>
            <span style={{fontSize:18,color:"#2563EB",fontWeight:700}}>+</span>
          </button>
        </div>

        {/* My technicians (bailleur) */}
        {isBailleur && myTechs.length>0 && (
          <div style={{padding:"0 16px"}}>
            <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:10}}>Mon équipe ({myTechs.length})</p>
            {myTechs.map(tech => (
              <TechCard
                key={tech.id} tech={tech}
                onTap={()=>setSelectedTech(tech)}
                onCall={()=>callPhone(tech.phone)}
                isBailleur={isBailleur}
                isAssigned={true}
                onRemove={()=>setConfirmRemove(tech.id)}
              />
            ))}
          </div>
        )}

        {/* Available technicians */}
        <div style={{padding:"12px 16px 100px"}}>
          <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:10}}>
            {isBailleur ? "Disponibles à recruter" : `${(isBailleur?otherTechs:myTechs).length} technicien${(isBailleur?otherTechs:myTechs).length>1?"s":""}`}
          </p>
          {(isBailleur ? otherTechs : myTechs).length === 0 ? (
            <EmptyState icon="user" text="Aucun technicien dans cette catégorie."/>
          ) : (
            (isBailleur ? otherTechs : myTechs).map(tech => (
              <TechCard
                key={tech.id} tech={tech}
                onTap={()=>setSelectedTech(tech)}
                onCall={()=>callPhone(tech.phone)}
                isBailleur={isBailleur}
                isAssigned={false}
                onAdd={()=>addTech(tech.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Quote request sheet */}
      {quoteOpen && (
        <QuoteRequestSheet
          tech={quoteOpen}
          onClose={()=>setQuoteOpen(null)}
          onSubmit={()=>{
            setQuoteSent(quoteOpen.id);
            setQuoteOpen(null);
            setTimeout(()=>setQuoteSent(null), 5000);
          }}
        />
      )}

      {/* Become technician sheet */}
      {becomeOpen && (
        <BecomeTechnicianSheet
          onClose={()=>setBecomeOpen(false)}
          onSubmit={(newTech)=>{
            userProfiles.addTech(newTech);
            setUserTechs(userProfiles.getTechs());
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
            <p style={{fontSize:11,opacity:.9,marginTop:1}}>Vous êtes désormais visible dans la liste.</p>
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
                Ce technicien ne sera plus visible dans votre équipe. Vous pourrez l'inviter à nouveau plus tard.
              </p>
              <button onClick={()=>removeTech(confirmRemove)} style={{...S.payBtn,background:C.dark,marginTop:8}}>
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

/* ─── TECH CARD ──────────────────────────────────── */
function TechCard({ tech, onTap, onCall, isBailleur, isAssigned, onAdd, onRemove }) {
  const cat = TECH_CATEGORIES.find(c=>c.id===tech.category);
  return (
    <div style={{background:C.white,borderRadius:16,padding:"14px",marginBottom:10,boxShadow:"0 1px 8px rgba(0,0,0,.05)",cursor:"pointer"}} onClick={onTap}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{position:"relative"}}>
          <FaceAvatar photo={tech.photo} avatar={tech.name[0]} bg={cat?.color||C.mid} size={48} radius={24}/>
          {tech.available && (
            <div style={{position:"absolute",bottom:0,right:0,width:14,height:14,borderRadius:7,background:"#16A34A",border:"2px solid white"}}/>
          )}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <p style={{fontSize:14,fontWeight:600,color:C.black}}>{tech.name}</p>
            {tech.verified && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#2563EB" stroke="white" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
            <span style={{fontSize:11,fontWeight:600,padding:"2px 7px",borderRadius:8,background:cat?cat.color+"18":C.bg,color:cat?.color||C.mid}}>
              {cat?.icon} {cat?.label}
            </span>
            <span style={{fontSize:11,color:C.light}}>{tech.city}</span>
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:3}}>
            <Icon name="star" size={12} color={C.coral}/>
            <span style={{fontSize:13,fontWeight:700,color:C.dark}}>{tech.rating}</span>
          </div>
          <p style={{fontSize:10,color:C.light}}>{tech.jobs} jobs</p>
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

/* ─── TECH PROFILE SCREEN ────────────────────────── */
function TechProfileScreen({ tech, onBack, isBailleur, isAssigned, onAssign, onRemove, onCall, onRequestQuote, quoteSent }) {
  const cat = TECH_CATEGORIES.find(c=>c.id===tech.category);
  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Hero */}
        <div style={{position:"relative",height:180,background:cat?.color||C.mid}}>
          <div style={{position:"absolute",inset:0,opacity:.12,background:"repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)",backgroundSize:"20px 20px"}}/>
          <button style={{...S.dBack,background:"rgba(0,0,0,.25)"}} onClick={onBack}>
            <Icon name="back" size={20} color="white" stroke={2.5}/>
          </button>
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 20px 16px",display:"flex",alignItems:"flex-end",gap:14}}>
            <div style={{width:72,height:72,borderRadius:36,border:"3px solid white",overflow:"hidden",boxShadow:"0 4px 16px rgba(0,0,0,.2)"}}>
              <FaceAvatar photo={tech.photo} avatar={tech.name[0]} bg={cat?.color||C.mid} size={72} radius={36}/>
            </div>
            <div style={{paddingBottom:4}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <p style={{fontSize:18,fontWeight:800,color:"white"}}>{tech.name}</p>
                {tech.verified && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke={cat?.color} strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                )}
              </div>
              <p style={{fontSize:12,color:"rgba(255,255,255,.8)"}}>{cat?.icon} {cat?.label} · {tech.city}</p>
            </div>
          </div>
        </div>

        <div style={{padding:"16px"}}>
          {/* Stats */}
          <div style={{display:"flex",background:C.bg,borderRadius:14,padding:"14px",gap:0,marginBottom:16}}>
            {[
              {val:tech.rating, label:"Note"},
              {val:tech.jobs,   label:"Missions"},
              {val:tech.available?"Oui":"Non", label:"Disponible", color:tech.available?"#16A34A":"#EF4444"},
            ].map((s,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,...(i>0?{borderLeft:`1px solid ${C.border}`}:{})}}>
                <span style={{fontSize:18,fontWeight:800,color:s.color||C.black}}>{s.val}</span>
                <span style={{fontSize:9,fontWeight:500,color:C.light,textTransform:"uppercase",letterSpacing:.4}}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* About */}
          <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:8}}>A propos</p>
          <p style={{fontSize:13,color:C.mid,lineHeight:1.7,marginBottom:16}}>{tech.about}</p>

          {/* Phone */}
          <div style={{background:C.white,borderRadius:14,padding:"14px",border:`1.5px solid ${C.border}`,marginBottom:16}}>
            <p style={{fontSize:12,fontWeight:600,color:C.light,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Téléphone</p>
            <p style={{fontSize:16,fontWeight:700,color:C.black,letterSpacing:.5}}>{tech.phone}</p>
          </div>

          {/* Action buttons */}
          <div style={{display:"flex",gap:10,marginBottom:10}}>
            <button onClick={onCall} style={{flex:1,...S.payBtn,background:"#16A34A"}}>
              📞 Appeler
            </button>
          </div>

          {/* Demander un devis : action principale pour locataires */}
          {!isBailleur && (
            <button
              onClick={onRequestQuote}
              style={{
                ...S.payBtn,
                background: quoteSent ? "#16A34A" : C.coral,
                marginBottom:16,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8,
              }}
            >
              {quoteSent ? (
                <>
                  <Icon name="check" size={16} color="white" stroke={2.5}/>
                  <span>Devis envoyé · réponse sous 24h</span>
                </>
              ) : (
                <>
                  <span style={{fontSize:14}}>📝</span>
                  <span>Demander un devis gratuit</span>
                </>
              )}
            </button>
          )}

          {/* Bailleur actions */}
          {isBailleur && (
            isAssigned ? (
              <button onClick={onRemove} style={{...S.payBtn,background:C.dark,marginBottom:16}}>
                Mettre fin à la collaboration
              </button>
            ) : (
              <button onClick={onAssign} style={{...S.payBtn,marginBottom:16}}>
                + Recruter ce technicien
              </button>
            )
          )}
        </div>

        <div style={{height:60}}/>
      </div>
    </div>
  );
}

/* ─── QUOTE REQUEST SHEET ────────────────────────── */
function QuoteRequestSheet({ tech, onClose, onSubmit }) {
  const cat = TECH_CATEGORIES.find(c=>c.id===tech.category);
  const [step, setStep]       = useState(1); // 1=form, 2=success
  const [problem, setProblem] = useState("");
  const [urgency, setUrgency] = useState("normale"); // urgente | normale | flexible
  const [address, setAddress] = useState("");
  const [phone, setPhone]     = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = problem.trim().length >= 10 && address.trim() && phone.trim().length >= 8;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(2);
    }, 1100);
  };

  const handleClose = () => {
    if (step === 2) onSubmit?.();
    else onClose?.();
  };

  return (
    <>
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:300}} onClick={handleClose}/>
      <div style={{
        position:"fixed",bottom:0,left:0,right:0,
        background:C.white,borderRadius:"20px 20px 0 0",
        padding:"16px 0 24px",zIndex:301,maxHeight:"90vh",
        display:"flex",flexDirection:"column",
        fontFamily:"'DM Sans',sans-serif",
      }}>
        <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 12px"}}/>

        {step === 1 ? (
          <>
            {/* Header */}
            <div style={{padding:"0 16px 12px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                <p style={{fontSize:17,fontWeight:700,color:C.black}}>Demande de devis</p>
                <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.mid,lineHeight:1,padding:0}}>×</button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:C.bg,borderRadius:12,marginTop:6}}>
                <FaceAvatar photo={tech.photo} avatar={tech.name[0]} bg={cat?.color||C.mid} size={36} radius={18}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,fontWeight:600,color:C.black}}>{tech.name}</p>
                  <p style={{fontSize:11,color:C.light}}>{cat?.icon} {cat?.label} · {tech.city}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{flex:1,overflowY:"auto",padding:"4px 16px 8px"}}>

              {/* Problem description */}
              <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
                Décrivez votre besoin <span style={{color:C.coral}}>*</span>
              </label>
              <textarea
                rows={4}
                value={problem}
                onChange={e=>setProblem(e.target.value)}
                placeholder={`Ex : Fuite sous évier cuisine, robinet qui goutte depuis 2 jours...`}
                maxLength={500}
                style={{
                  width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,
                  padding:"10px 12px",fontSize:13,color:C.dark,
                  fontFamily:"'DM Sans',sans-serif",resize:"vertical",outline:"none",
                  background:C.white,marginBottom:4,
                }}
              />
              <p style={{fontSize:10,color:C.light,textAlign:"right",marginBottom:14}}>
                {problem.length}/500 — minimum 10 caractères
              </p>

              {/* Urgency */}
              <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>Urgence</label>
              <div style={{display:"flex",gap:6,marginBottom:14}}>
                {[
                  {id:"urgente",  label:"Urgent",   color:"#DC2626"},
                  {id:"normale",  label:"Sous 48h", color:"#F59E0B"},
                  {id:"flexible", label:"Flexible", color:"#16A34A"},
                ].map(u => (
                  <button
                    key={u.id}
                    onClick={()=>setUrgency(u.id)}
                    style={{
                      flex:1,padding:"9px 6px",borderRadius:10,
                      border: urgency === u.id ? `1.5px solid ${u.color}` : `1.5px solid ${C.border}`,
                      background: urgency === u.id ? u.color+"15" : C.white,
                      color: urgency === u.id ? u.color : C.mid,
                      fontSize:12,fontWeight:600,cursor:"pointer",
                      fontFamily:"'DM Sans',sans-serif",
                    }}
                  >{u.label}</button>
                ))}
              </div>

              {/* Address + Phone */}
              <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
                Adresse de l'intervention <span style={{color:C.coral}}>*</span>
              </label>
              <input
                value={address}
                onChange={e=>setAddress(e.target.value)}
                placeholder="Ex : Bonamoussadi, Rue 1.234, Douala"
                style={{
                  width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,
                  padding:"10px 12px",fontSize:13,color:C.dark,
                  fontFamily:"'DM Sans',sans-serif",outline:"none",
                  background:C.white,marginBottom:14,boxSizing:"border-box",
                }}
              />

              <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
                Téléphone de contact <span style={{color:C.coral}}>*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e=>setPhone(e.target.value.replace(/[^\d\s+]/g,""))}
                placeholder="+237 6XX XX XX XX"
                style={{
                  width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,
                  padding:"10px 12px",fontSize:13,color:C.dark,
                  fontFamily:"'DM Sans',sans-serif",outline:"none",
                  background:C.white,marginBottom:14,boxSizing:"border-box",
                }}
              />

              {/* Photos (placeholder count) */}
              <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
                Photos du problème <span style={{color:C.light,fontWeight:400}}>(optionnel)</span>
              </label>
              <button
                onClick={() => setPhotoCount(c => Math.min(5, c + 1))}
                style={{
                  width:"100%",padding:"12px",borderRadius:12,
                  border:`1.5px dashed ${C.border}`,background:C.bg,
                  cursor:"pointer",fontSize:12,color:C.mid,fontWeight:600,
                  fontFamily:"'DM Sans',sans-serif",marginBottom:14,
                }}
              >
                {photoCount === 0 ? "📷 Ajouter une photo" : `📷 ${photoCount} photo(s) ajoutée(s) · cliquer pour +`}
              </button>

              {/* Info box */}
              <div style={{background:"#EFF6FF",borderRadius:10,padding:"10px 12px",marginBottom:14,border:`1px solid #DBEAFE`}}>
                <p style={{fontSize:11,color:"#1E40AF",lineHeight:1.5}}>
                  ℹ️ Le technicien recevra votre demande et vous répondra avec un devis sous 24h. <strong>Service gratuit, sans engagement.</strong>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div style={{padding:"4px 16px 0",borderTop:`1px solid ${C.border}`,paddingTop:12}}>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                style={{
                  ...S.payBtn,
                  background: canSubmit ? C.coral : C.border,
                  color: canSubmit ? C.white : C.light,
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}
              >
                {submitting ? "Envoi..." : "Envoyer la demande"}
              </button>
            </div>
          </>
        ) : (
          /* SUCCESS STEP */
          <div style={{padding:"24px 24px 8px",textAlign:"center"}}>
            <div style={{
              width:72,height:72,borderRadius:36,
              background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center",
              margin:"0 auto 14px",
            }}>
              <Icon name="check" size={36} color="#16A34A" stroke={2.5}/>
            </div>
            <p style={{fontSize:18,fontWeight:800,color:C.black,marginBottom:6}}>Demande envoyée !</p>
            <p style={{fontSize:13,color:C.mid,lineHeight:1.6,marginBottom:18}}>
              <strong>{tech.name}</strong> a reçu votre demande de devis.<br/>
              Vous recevrez une réponse par message sous 24h maximum.
            </p>
            <button
              onClick={handleClose}
              style={{...S.payBtn,marginBottom:0}}
            >Parfait</button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── BECOME TECHNICIAN SHEET ────────────────────── */
function BecomeTechnicianSheet({ onClose, onSubmit }) {
  const [name, setName]     = useState("");
  const [category, setCategory] = useState(TECH_CATEGORIES[0].id);
  const [city, setCity]     = useState("Douala");
  const [zone, setZone]     = useState("");
  const [phone, setPhone]   = useState("");
  const [about, setAbout]   = useState("");

  const canSubmit = name.trim().length >= 3
                 && phone.trim().length >= 8
                 && zone.trim().length >= 2
                 && about.trim().length >= 20;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const newTech = {
      id: "UT" + Date.now(),
      name: name.trim(),
      category,
      phone: phone.trim(),
      rating: 0,
      jobs: 0,
      photo: `https://i.pravatar.cc/100?u=${encodeURIComponent(name.trim())}`,
      city,
      zone: zone.trim(),
      available: true,
      verified: false,
      about: about.trim(),
      isUserCreated: true,
    };
    onSubmit?.(newTech);
  };

  return (
    <>
      <div style={S.sheetBackdrop} onClick={onClose}/>
      <div style={{...S.sheet,padding:"20px",maxHeight:"90vh",overflowY:"auto",zIndex:201}} className="sheet">
        <div style={S.sheetHandle}/>

        <div style={{marginBottom:14}}>
          <p style={{fontSize:18,fontWeight:800,color:C.black}}>Devenir technicien</p>
          <p style={{fontSize:12,color:C.mid,marginTop:4,lineHeight:1.55}}>
            Inscrivez votre profil pour être contacté par des bailleurs et locataires.
          </p>
        </div>

        {/* Name */}
        <div style={{marginBottom:12}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
            Nom complet <span style={{color:C.coral}}>*</span>
          </label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex : Mbarga Jean"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,outline:"none",fontFamily:"'DM Sans',sans-serif",background:C.white,boxSizing:"border-box"}}/>
        </div>

        {/* Category */}
        <div style={{marginBottom:12}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
            Spécialité <span style={{color:C.coral}}>*</span>
          </label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {TECH_CATEGORIES.map(c=>(
              <button key={c.id} onClick={()=>setCategory(c.id)}
                style={{
                  padding:"7px 12px",borderRadius:10,cursor:"pointer",
                  border: category===c.id?`1.5px solid ${C.coral}`:`1.5px solid ${C.border}`,
                  background: category===c.id?"#FFF5F5":C.white,
                  fontSize:12,fontWeight:600,color: category===c.id?C.coral:C.mid,
                  fontFamily:"'DM Sans',sans-serif",
                }}
              >{c.icon} {c.label}</button>
            ))}
          </div>
        </div>

        {/* City + Zone */}
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <div style={{flex:1}}>
            <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
              Ville <span style={{color:C.coral}}>*</span>
            </label>
            <select value={city} onChange={e=>setCity(e.target.value)}
              style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,background:C.white,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",boxSizing:"border-box"}}
            >
              {LOCATIONS.slice(1).map(l=>(<option key={l.id} value={l.id}>{l.label}</option>))}
            </select>
          </div>
          <div style={{flex:1}}>
            <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
              Zone <span style={{color:C.coral}}>*</span>
            </label>
            <input value={zone} onChange={e=>setZone(e.target.value)} placeholder="Ex : Bonamoussadi"
              style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,outline:"none",fontFamily:"'DM Sans',sans-serif",background:C.white,boxSizing:"border-box"}}/>
          </div>
        </div>

        {/* Phone */}
        <div style={{marginBottom:12}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
            Téléphone <span style={{color:C.coral}}>*</span>
          </label>
          <input type="tel" value={phone} onChange={e=>setPhone(e.target.value.replace(/[^\d\s+]/g,""))} placeholder="+237 6XX XX XX XX"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,outline:"none",fontFamily:"'DM Sans',sans-serif",background:C.white,boxSizing:"border-box"}}/>
        </div>

        {/* About */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:600,color:C.dark,display:"block",marginBottom:6}}>
            À propos / Expérience <span style={{color:C.coral}}>*</span>
          </label>
          <textarea value={about} onChange={e=>setAbout(e.target.value)} rows={3}
            placeholder="Décrivez votre expérience, vos spécialités, vos disponibilités…"
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 12px",fontSize:13,color:C.dark,outline:"none",fontFamily:"'DM Sans',sans-serif",background:C.white,resize:"none",lineHeight:1.5,boxSizing:"border-box"}}/>
          <p style={{fontSize:10,color:C.light,marginTop:3}}>{about.length} caractères · 20 minimum</p>
        </div>

        {/* Info */}
        <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 12px",marginBottom:14}}>
          <p style={{fontSize:11,color:"#A16207",lineHeight:1.5}}>
            ℹ️ Votre profil apparaîtra avec un badge <strong>"Non vérifié"</strong> jusqu'à validation par notre équipe (24-48h).
          </p>
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose}
            style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${C.border}`,background:C.white,cursor:"pointer",fontSize:13,fontWeight:600,color:C.dark}}
          >Annuler</button>
          <button onClick={canSubmit?handleSubmit:undefined} disabled={!canSubmit}
            style={{flex:1,padding:"12px",borderRadius:12,background:canSubmit?C.coral:C.border,border:"none",cursor:canSubmit?"pointer":"not-allowed",fontSize:13,fontWeight:700,color:"white"}}
          >Créer mon profil</button>
        </div>
      </div>
    </>
  );
}
