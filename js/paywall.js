/* Byer — Paywall Location au Mois
   Système de paywall pour les annonces en mode "mois" :
   - Images floutées / verrouillées
   - 3 paliers : 3000F/10 visites, 5000F/20 visites, 10000F/2h illimité + 10 favoris 72h
   - Dialog d'explication du système
   ═══════════════════════════════════════════════════ */

/* ─── PAYWALL GATE ───────────────────────────────── */
function PaywallGate({ item, children, duration, onUnlock }) {
  const [showPaywall, setShowPaywall] = useState(false);

  /* Only gate PROPERTY listings in "month" mode — vehicles ne sont jamais paywallés */
  if (item.type !== "property") return children;
  if (duration !== "month" || !item.monthPrice) return children;

  /* Check if user has active paywall pass */
  const hasAccess = PAYWALL_STATE.active && (
    PAYWALL_STATE.tier === "premium" ||
    PAYWALL_STATE.visitsLeft > 0
  );

  if (hasAccess) return children;

  return (
    <>
      {/* Blurred overlay on the card */}
      <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setShowPaywall(true)}>
        <div style={{filter:"blur(6px)",pointerEvents:"none"}}>
          {children}
        </div>
        {/* Lock overlay */}
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.35)",borderRadius:20}}>
          <div style={{width:56,height:56,borderRadius:28,background:"rgba(255,255,255,.95)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(0,0,0,.2)",marginBottom:10}}>
            <svg width="24" height="24" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <p style={{fontSize:14,fontWeight:700,color:"white",textAlign:"center"}}>Contenu réservé</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,.8)",textAlign:"center",marginTop:2}}>Débloquez pour voir cette annonce</p>
          <button
            onClick={e=>{e.stopPropagation();setShowPaywall(true);}}
            style={{marginTop:10,background:C.coral,color:"white",border:"none",borderRadius:12,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer"}}
          >
            Voir les offres →
          </button>
        </div>
      </div>

      {/* Paywall sheet */}
      {showPaywall && (
        <PaywallSheet onClose={()=>setShowPaywall(false)} onUnlock={onUnlock}/>
      )}
    </>
  );
}

/* ─── PAYWALL SHEET ──────────────────────────────── */
function PaywallSheet({ onClose, onUnlock }) {
  const [selectedTier, setSelectedTier] = useState("standard");
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setPaying(true);
    setTimeout(()=>{
      setPaying(false);
      setSuccess(true);
      const tier = PAYWALL_TIERS.find(t=>t.id===selectedTier);
      /* Update global state (mock) */
      PAYWALL_STATE.active = true;
      PAYWALL_STATE.tier = selectedTier;
      PAYWALL_STATE.visitsLeft = tier.visits || 999;
      setTimeout(()=>{
        onUnlock?.();
        onClose();
      }, 2000);
    }, 2000);
  };

  return (
    <>
      <div style={{...S.sheetBackdrop,zIndex:300}} onClick={onClose}/>
      <div style={{...S.sheet,zIndex:301,maxHeight:"92vh"}} className="sheet">
        <div style={S.sheetHandle}/>

        {success ? (
          <div style={{padding:"32px 24px 48px",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
            <div style={S.successCircle}>
              <Icon name="check" size={32} color="white" stroke={2.5}/>
            </div>
            <p style={{fontSize:18,fontWeight:800,color:C.black}}>Accès débloqué !</p>
            <p style={{fontSize:13,color:C.mid,textAlign:"center",lineHeight:1.6}}>
              Profitez de vos annonces location mensuelle.
            </p>
          </div>
        ) : showPayment ? (
          /* Payment step */
          <div style={{padding:"0 20px 32px",overflowY:"auto"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0 16px"}}>
              <button onClick={()=>setShowPayment(false)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                <Icon name="back" size={18} color={C.dark} stroke={2.5}/>
                <span style={{fontSize:13,fontWeight:600,color:C.dark}}>Retour</span>
              </button>
              <p style={{fontSize:15,fontWeight:700,color:C.black}}>Paiement</p>
              <div style={{width:60}}/>
            </div>

            {/* Summary */}
            <div style={{background:C.bg,borderRadius:14,padding:"14px 16px",marginBottom:16}}>
              {(() => {
                const tier = PAYWALL_TIERS.find(t=>t.id===selectedTier);
                return (
                  <>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:13,color:C.mid}}>Offre</span>
                      <span style={{fontSize:13,fontWeight:600,color:C.black}}>{tier.label}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:13,color:C.mid}}>Montant</span>
                      <span style={{fontSize:16,fontWeight:800,color:C.coral}}>{fmt(tier.price)}</span>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Payment methods */}
            <p style={{fontSize:12,fontWeight:600,color:C.mid,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Mode de paiement</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {PAYMENT_METHODS.slice(0,2).map(m=>(
                <button key={m.id} style={S.methodBtn}>
                  <div style={{...S.methodLogo,background:m.accent}}>
                    <span style={{fontSize:14,fontWeight:800,color:m.textColor}}>{m.short}</span>
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:14,fontWeight:600,color:C.black}}>{m.label}</p>
                    <p style={{fontSize:11,color:C.light}}>{m.sub}</p>
                  </div>
                  <Icon name="chevron" size={16} color={C.light}/>
                </button>
              ))}
            </div>

            <button onClick={handlePay} disabled={paying} style={{...S.payBtn,opacity:paying?.7:1}}>
              {paying ? (
                <div style={S.spinner}/>
              ) : (
                `Payer ${fmt(PAYWALL_TIERS.find(t=>t.id===selectedTier)?.price)}`
              )}
            </button>
          </div>
        ) : (
          /* Tier selection */
          <div style={{padding:"0 20px 32px",overflowY:"auto"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0 12px"}}>
              <p style={{fontSize:17,fontWeight:700,color:C.black}}>Location au mois</p>
              <button style={S.sheetClose} onClick={onClose}>
                <Icon name="close" size={18} color={C.mid}/>
              </button>
            </div>

            {/* Explanation */}
            <div style={{background:"#FFF8F8",border:`1px solid #FFD6D7`,borderRadius:14,padding:"14px",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
                <svg width="16" height="16" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{flexShrink:0,marginTop:1}}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div>
                  <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:4}}>Pourquoi un accès payant ?</p>
                  <p style={{fontSize:12,color:C.mid,lineHeight:1.7}}>
                    Les annonces de location mensuelle sont des biens exclusifs. L'accès payant garantit des locataires sérieux et protège la vie privée des propriétaires.
                  </p>
                </div>
              </div>
            </div>

            {/* Tiers */}
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              {PAYWALL_TIERS.map(tier => {
                const isSelected = selectedTier === tier.id;
                const isPremium = tier.id === "premium";
                return (
                  <button key={tier.id}
                    onClick={()=>setSelectedTier(tier.id)}
                    style={{
                      position:"relative",
                      background:isSelected?"#FFF5F5":C.white,
                      border:isSelected?`2px solid ${C.coral}`:`1.5px solid ${C.border}`,
                      borderRadius:18,padding:"16px",cursor:"pointer",textAlign:"left",
                      transition:"all .18s",overflow:"hidden",
                    }}
                  >
                    {isPremium && (
                      <div style={{position:"absolute",top:0,right:0,background:C.coral,color:"white",fontSize:9,fontWeight:700,padding:"3px 10px",borderRadius:"0 0 0 10px",textTransform:"uppercase",letterSpacing:.5}}>
                        Populaire
                      </div>
                    )}

                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                          <div style={{width:10,height:10,borderRadius:5,border:isSelected?`3px solid ${C.coral}`:`2px solid ${C.border}`,background:isSelected?C.coral:"none"}}/>
                          <p style={{fontSize:15,fontWeight:700,color:C.black}}>{tier.label}</p>
                        </div>
                        <p style={{fontSize:12,color:C.mid,lineHeight:1.6,marginBottom:6}}>{tier.desc}</p>

                        {/* Features */}
                        <div style={{display:"flex",flexDirection:"column",gap:4}}>
                          {tier.visits && (
                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                              <Icon name="check" size={12} color="#16A34A" stroke={2.5}/>
                              <span style={{fontSize:11,color:C.dark}}>{tier.visits} visites d'annonces</span>
                            </div>
                          )}
                          {tier.duration && (
                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                              <Icon name="check" size={12} color="#16A34A" stroke={2.5}/>
                              <span style={{fontSize:11,color:C.dark}}>Accès illimité pendant {tier.duration}</span>
                            </div>
                          )}
                          {tier.favorites > 0 && (
                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                              <Icon name="check" size={12} color="#16A34A" stroke={2.5}/>
                              <span style={{fontSize:11,color:C.dark}}>{tier.favorites} favoris consultables {tier.favDuration}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{textAlign:"right",flexShrink:0}}>
                        <p style={{fontSize:22,fontWeight:800,color:tier.color}}>{tier.price.toLocaleString("fr-FR")}</p>
                        <p style={{fontSize:10,color:C.light}}>FCFA</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <button onClick={()=>setShowPayment(true)} style={S.payBtn}>
              Continuer · {fmt(PAYWALL_TIERS.find(t=>t.id===selectedTier)?.price)}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
