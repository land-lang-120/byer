/* Byer — Rent Management */

/* ─── RENT SCREEN ───────────────────────────────── */
function RentScreen({ onBack }) {
  const [role, setRole]       = useState("locataire"); // locataire | bailleur
  const [activeTab, setActiveTab] = useState("courant"); // courant | historique | rappels
  const [paySheet, setPaySheet]   = useState(null); // loyer à payer
  const [sentReminders, setSentReminders] = useState({});
  const [paid, setPaid] = useState({}); // simule paiements effectués

  const loyers  = role === "locataire" ? LOYERS_LOCATAIRE : LOYERS_BAILLEUR;
  const pending = loyers.filter(l => l.statut === "en_attente" || l.statut === "en_retard");
  const history = loyers.filter(l => l.statut === "payé" || paid[l.id]);

  const totalDu   = pending.filter(l=>!paid[l.id]).reduce((s,l)=>s+l.montant,0);
  const totalRecu = (role==="bailleur" ? history : history).reduce((s,l)=>s+l.montant,0);

  const handlePaid = (loyerId) => {
    setPaid(p => ({...p,[loyerId]:true}));
    setPaySheet(null);
  };

  const sendReminder = (id, level="rappel") => setSentReminders(p => ({...p,[id]:level}));

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>

      {/* Header */}
      <div style={S.rentHeader}>
        <button style={S.dBack2} onClick={onBack}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
        </button>
        <p style={{fontSize:17,fontWeight:700,color:C.black}}>Gestion des loyers</p>
        <div style={{width:38}}/>
      </div>

      <div style={{flex:1,overflowY:"auto"}}>

        {/* Role toggle */}
        <div style={S.rentRoleWrap}>
          {[{id:"locataire",label:"Je suis locataire"},{id:"bailleur",label:"Je suis bailleur"}].map(row=>(
            <button
              key={row.id}
              style={{...S.roleBtn,...(role===row.id?S.roleBtnOn:{})}}
              onClick={()=>{ setRole(row.id); setActiveTab("courant"); }}
            >
              {row.label}
            </button>
          ))}
        </div>

        {/* Summary card */}
        <div style={S.rentSummary}>
          {role==="locataire" ? (
            <>
              <div style={S.summaryCol}>
                <span style={S.summaryVal}>{fmt(totalDu)}</span>
                <span style={S.summaryLabel}>À payer ce mois</span>
              </div>
              <div style={S.summaryDivider}/>
              <div style={S.summaryCol}>
                <span style={S.summaryVal}>{history.length}</span>
                <span style={S.summaryLabel}>Paiements effectués</span>
              </div>
              <div style={S.summaryDivider}/>
              <div style={S.summaryCol}>
                <span style={{...S.summaryVal, color: WARN ? C.coral : "#16A34A"}}>
                  {WARN ? `J-${DAYS_LEFT}` : "À jour"}
                </span>
                <span style={S.summaryLabel}>Statut</span>
              </div>
            </>
          ) : (
            <>
              <div style={S.summaryCol}>
                <span style={S.summaryVal}>{pending.filter(l=>!paid[l.id]).length}</span>
                <span style={S.summaryLabel}>En attente</span>
              </div>
              <div style={S.summaryDivider}/>
              <div style={S.summaryCol}>
                <span style={{...S.summaryVal,color:"#16A34A"}}>{fmt(totalRecu)}</span>
                <span style={S.summaryLabel}>Reçu ce mois</span>
              </div>
              <div style={S.summaryDivider}/>
              <div style={S.summaryCol}>
                <span style={{...S.summaryVal,color:C.coral}}>
                  {LOYERS_BAILLEUR.filter(l=>l.statut==="en_retard").length}
                </span>
                <span style={S.summaryLabel}>En retard</span>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div style={S.rentTabs}>
          {[
            {id:"courant",  label:"Ce mois"},
            {id:"historique",label:"Historique"},
            {id:"rappels",  label:"Rappels"},
          ].map(t=>(
            <button key={t.id} style={{...S.rentTab,...(activeTab===t.id?S.rentTabOn:{})}} onClick={()=>setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{padding:"12px 16px 100px"}}>

          {/* ── CE MOIS ── */}
          {activeTab==="courant" && (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {pending.length === 0 && <EmptyState icon="check" text="Tous les loyers du mois sont réglés 🎉"/>}
              {pending.map(loyer => {
                const isPaid = !!paid[loyer.id];
                const isLate = loyer.statut === "en_retard";
                const isWarn = !isLate && loyer.rappelActif;
                return (
                  <div key={loyer.id} style={{...S.loyerCard,...(isLate?{borderLeft:`3px solid #EF4444`}:isWarn?{borderLeft:`3px solid ${C.coral}`}:{borderLeft:`3px solid #16A34A`})}}>
                    {/* Badge statut */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div style={{minWidth:0}}>
                        <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:2}}>{loyer.logement || loyer.locataire}</p>
                        <p style={{fontSize:12,color:C.mid}}>{role==="locataire"?`Bailleur : ${loyer.bailleur}`:`Locataire : ${loyer.locataire}`}</p>
                      </div>
                      <span style={{...S.statutBadge,
                        background: isPaid?"#F0FDF4":isLate?"#FEF2F2":isWarn?"#FFF8F8":"#F0FDF4",
                        color: isPaid?"#16A34A":isLate?"#EF4444":isWarn?C.coral:"#16A34A"
                      }}>
                        {isPaid?"Payé":isLate?"En retard":isWarn?"Rappel J-"+loyer.joursRestants:"En attente"}
                      </span>
                    </div>

                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                      <div>
                        <p style={{fontSize:20,fontWeight:800,color:C.black}}>{fmt(loyer.montant)}</p>
                        <p style={{fontSize:12,color:C.light}}>Échéance : {loyer.echeance}</p>
                      </div>
                    </div>

                    {/* ── Actions locataire ── */}
                    {role==="locataire" && !isPaid && (
                      <button style={S.payBtn} onClick={()=>setPaySheet(loyer)}>
                        Payer maintenant
                      </button>
                    )}
                    {role==="locataire" && isPaid && (
                      <div style={S.paidConfirm}>
                        <Icon name="check" size={14} color="#16A34A" stroke={2.5}/>
                        <span style={{fontSize:13,color:"#16A34A",fontWeight:600}}>Paiement confirmé ce mois</span>
                      </div>
                    )}

                    {/* ── Actions bailleur ──
                        RÈGLE : le bailleur ne peut notifier le locataire
                        qu'APRÈS que l'échéance mensuelle soit dépassée.
                        Avant = Byer gère les rappels automatiques seul.
                    ── */}
                    {role==="bailleur" && !isPaid && !isLate && (
                      /* Avant échéance : informatif uniquement, pas d'action manuelle */
                      <div style={S.autoMsgBox}>
                        <svg width="13" height="13" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{flexShrink:0}}>
                          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
                        </svg>
                        <span style={{fontSize:12,color:C.mid,lineHeight:1.5}}>
                          Byer envoie automatiquement les rappels au locataire.
                          Vous pourrez le notifier directement dès que l'échéance sera dépassée.
                        </span>
                      </div>
                    )}

                    {role==="bailleur" && isLate && !isPaid && (
                      /* Après échéance : deux niveaux d'escalade */
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {/* Niveau 1 — rappel amiable (disponible dès J+1) */}
                        {!sentReminders[loyer.id] && (
                          <button
                            style={S.notifBtn}
                            onClick={()=>sendReminder(loyer.id,"rappel")}
                          >
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
                            </svg>
                            Envoyer un rappel au locataire
                          </button>
                        )}
                        {sentReminders[loyer.id] === "rappel" && (
                          <div style={S.paidConfirm}>
                            <Icon name="check" size={14} color={C.coral} stroke={2.5}/>
                            <span style={{fontSize:12,color:C.coral,fontWeight:600}}>Rappel amiable envoyé à {loyer.locataire}</span>
                          </div>
                        )}

                        {/* Niveau 2 — mise en demeure (visible après rappel envoyé ou si très en retard) */}
                        {(sentReminders[loyer.id] === "rappel" || loyer.joursRestants < -5) && (
                          <button
                            style={{...S.notifBtnRed,...(sentReminders[loyer.id]==="demeure"?S.notifBtnDone:{})}}
                            onClick={()=>setSentReminders(p=>({...p,[loyer.id]:"demeure"}))}
                            disabled={sentReminders[loyer.id]==="demeure"}
                          >
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                            {sentReminders[loyer.id]==="demeure" ? "✓ Mise en demeure envoyée" : "Envoyer une mise en demeure"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── HISTORIQUE ── */}
          {activeTab==="historique" && (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <p style={{fontSize:13,color:C.mid,marginBottom:4}}>
                {history.length} paiement{history.length!==1?"s":""} enregistré{history.length!==1?"s":""}
              </p>
              {history.length===0 && <EmptyState icon="trips" text="Aucun historique pour le moment"/>}
              {history.map(loyer => (
                <div key={loyer.id} style={S.histCard}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <p style={{fontSize:14,fontWeight:700,color:C.black}}>{loyer.logement}</p>
                      <p style={{fontSize:12,color:C.mid}}>{role==="locataire"?loyer.bailleur:loyer.locataire}</p>
                    </div>
                    <span style={{...S.statutBadge,background:"#F0FDF4",color:"#16A34A"}}>Payé</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <p style={{fontSize:16,fontWeight:700,color:C.black}}>{fmt(loyer.montant)}</p>
                      <p style={{fontSize:11,color:C.light}}>Échéance : {loyer.echeance}</p>
                    </div>
                  </div>
                  {/* Proof section */}
                  <div style={S.proofBox}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                      <div style={S.proofIcon}>
                        <svg width="14" height="14" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                      </div>
                      <div>
                        <p style={{fontSize:11,fontWeight:700,color:C.dark}}>{loyer.methode}</p>
                        <p style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>{loyer.ref}</p>
                      </div>
                    </div>
                    <p style={{fontSize:11,color:C.mid,flexShrink:0}}>{loyer.datePaiement}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── RAPPELS ── */}
          {activeTab==="rappels" && (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {/* Rappel automatique banner */}
              <div style={S.autoRappelCard}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:36,height:36,borderRadius:18,background:"#FFF5F5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="18" height="18" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
                      <circle cx="18" cy="8" r="4" fill={C.coral} stroke="none"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{fontSize:14,fontWeight:700,color:C.black}}>Rappels automatiques activés</p>
                    <p style={{fontSize:12,color:C.mid}}>Notification à J-7 avant l'échéance</p>
                  </div>
                  <div style={{marginLeft:"auto",width:42,height:24,borderRadius:12,background:C.coral,display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"2px 3px",cursor:"pointer"}}>
                    <div style={{width:18,height:18,borderRadius:9,background:"white"}}/>
                  </div>
                </div>
                <div style={{background:"#FFF8F8",borderRadius:10,padding:"10px 12px",fontSize:12,color:C.mid,lineHeight:1.6}}>
                  {role==="locataire"
                    ? "Vous recevrez une notification push et un SMS 7 jours avant la fin du mois pour vous rappeler de payer votre loyer."
                    : "Vos locataires recevront automatiquement un rappel 7 jours avant la date d'échéance. Vous serez notifié si un loyer n'est toujours pas réglé à J-3."}
                </div>
              </div>

              {/* Upcoming reminders */}
              <p style={{fontSize:15,fontWeight:700,color:C.black}}>Rappels à venir</p>
              {(role==="locataire" ? LOYERS_LOCATAIRE : LOYERS_BAILLEUR)
                .filter(l => l.statut==="en_attente")
                .map(loyer => (
                  <div key={loyer.id} style={S.rappelCard}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{...S.rappelDot, background: loyer.joursRestants<=3?"#EF4444":loyer.joursRestants<=7?C.coral:"#16A34A"}}/>
                      <div style={{flex:1}}>
                        <p style={{fontSize:14,fontWeight:600,color:C.black}}>{loyer.logement || loyer.locataire}</p>
                        <p style={{fontSize:12,color:C.mid}}>Échéance : {loyer.echeance}</p>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <p style={{fontSize:13,fontWeight:700,color:loyer.joursRestants<=3?"#EF4444":loyer.joursRestants<=7?C.coral:C.mid}}>
                          {loyer.joursRestants > 0 ? `J-${loyer.joursRestants}` : `J+${Math.abs(loyer.joursRestants)}`}
                        </p>
                        <p style={{fontSize:11,color:C.light}}>{loyer.joursRestants<=7?"Rappel actif":"Planifié"}</p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>

      {/* Payment sheet */}
      {paySheet && (
        <PaymentSheet loyer={paySheet} onClose={()=>setPaySheet(null)} onSuccess={handlePaid}/>
      )}
    </div>
  );
}

/* ─── PAYMENT SHEET ─────────────────────────────── */
function PaymentSheet({ loyer, onClose, onSuccess }) {
  const [step, setStep]     = useState("choose"); // choose | confirm | success
  const [method, setMethod] = useState(null);
  const [phone, setPhone]   = useState("");

  return (
    <>
      <div style={{...S.sheetBackdrop,zIndex:300}} onClick={onClose}/>
      <div style={{...S.sheet,zIndex:301,maxHeight:"90vh"}} className="sheet">
        <div style={S.sheetHandle}/>

        {step === "choose" && (
          <>
            <div style={S.sheetHeader}>
              <p style={S.sheetTitle}>Choisir un mode de paiement</p>
              <button style={S.sheetClose} onClick={onClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{padding:"0 16px",marginBottom:16}}>
              <div style={S.payAmountBox}>
                <p style={{fontSize:13,color:C.mid}}>Loyer à payer · {loyer.echeance}</p>
                <p style={{fontSize:24,fontWeight:800,color:C.black,marginTop:2}}>{fmt(loyer.montant)}</p>
                <p style={{fontSize:12,color:C.light,marginTop:1}}>{loyer.logement}</p>
              </div>
            </div>
            <div style={{padding:"0 16px 32px",display:"flex",flexDirection:"column",gap:10}}>
              {PAYMENT_METHODS.map(m => (
                <button key={m.id} style={S.methodBtn} onClick={()=>{ setMethod(m); setStep("confirm"); }}>
                  <div style={{...S.methodLogo, background:m.accent, color:m.textColor}}>
                    <span style={{fontSize:11,fontWeight:800}}>{m.short}</span>
                  </div>
                  <div style={{flex:1,textAlign:"left"}}>
                    <p style={{fontSize:14,fontWeight:600,color:C.black}}>{m.label}</p>
                    <p style={{fontSize:12,color:C.mid}}>{m.sub}</p>
                  </div>
                  <Icon name="chevron" size={16} color={C.light} stroke={2}/>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "confirm" && method && (
          <>
            <div style={S.sheetHeader}>
              <button style={S.sheetClose} onClick={()=>setStep("choose")}>
                <Icon name="back" size={20} color={C.dark} stroke={2}/>
              </button>
              <p style={S.sheetTitle}>{method.label}</p>
              <div style={{width:32}}/>
            </div>
            <div style={{padding:"0 16px 32px"}}>
              <div style={{...S.payAmountBox,marginBottom:20}}>
                <p style={{fontSize:13,color:C.mid}}>Montant à payer</p>
                <p style={{fontSize:26,fontWeight:800,color:C.black,marginTop:2}}>{fmt(loyer.montant)}</p>
              </div>

              {(method.id==="mtn"||method.id==="orange") && (
                <>
                  <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:8}}>Numéro {method.label}</p>
                  <div style={S.phoneInput}>
                    <span style={{fontSize:13,color:C.mid,fontWeight:500}}>+237</span>
                    <div style={{width:1,height:18,background:C.border}}/>
                    <input
                      style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:14,color:C.dark,fontFamily:"'DM Sans',sans-serif"}}
                      placeholder={method.id==="mtn"?"6XX XXX XXX":"6XX XXX XXX"}
                      value={phone} onChange={e=>setPhone(e.target.value)}
                      type="tel"
                    />
                  </div>
                  <p style={{fontSize:11,color:C.light,marginTop:6,marginBottom:20}}>
                    Vous recevrez une demande de confirmation sur votre téléphone.
                  </p>
                </>
              )}
              {method.id==="eu" && (
                <div style={{...S.proofBox,marginBottom:20,padding:"14px"}}>
                  <p style={{fontSize:13,color:C.mid,lineHeight:1.6}}>
                    Rendez-vous dans l'agence Express Union la plus proche avec le code de référence :<br/>
                    <span style={{fontFamily:"monospace",fontWeight:700,color:C.black,fontSize:14}}>BYER-{loyer.id}-{loyer.montant}</span>
                  </p>
                </div>
              )}
              {method.id==="virement" && (
                <div style={{...S.proofBox,marginBottom:20,padding:"14px",flexDirection:"column",gap:6}}>
                  {[{l:"Banque",v:"Afriland First Bank"},{ l:"RIB",v:"10041 01234 00987654321 76"},{l:"Libellé",v:`LOYER ${loyer.id} BYER`}].map(row=>(
                    <div key={row.l} style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:12,color:C.mid}}>{row.l}</span>
                      <span style={{fontSize:12,fontWeight:600,color:C.dark,fontFamily:row.l!=="Banque"?"monospace":"inherit"}}>{row.v}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                style={{...S.payBtn, opacity:(method.id==="mtn"||method.id==="orange")&&phone.length<9?.5:1}}
                onClick={()=>{ if((method.id==="mtn"||method.id==="orange")&&phone.length<9) return; setStep("success"); }}
              >
                {method.id==="virement" ? "J'ai effectué le virement" : `Confirmer le paiement`}
              </button>
            </div>
          </>
        )}

        {step === "success" && (
          <div style={{padding:"32px 24px 48px",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
            <div style={S.successCircle}>
              <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p style={{fontSize:20,fontWeight:800,color:C.black,textAlign:"center"}}>Paiement effectué !</p>
            <p style={{fontSize:14,color:C.mid,textAlign:"center",lineHeight:1.6}}>
              Votre loyer de <strong>{fmt(loyer.montant)}</strong> a été envoyé via {method?.label}.<br/>
              Une preuve de paiement a été enregistrée dans votre historique.
            </p>
            <div style={{...S.proofBox,width:"100%",padding:"14px"}}>
              <div style={S.proofIcon}>
                <svg width="14" height="14" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:11,fontWeight:700,color:C.dark}}>{method?.label}</p>
                <p style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>
                  {method?.short}{Date.now().toString().slice(-8).toUpperCase()}
                </p>
              </div>
              <p style={{fontSize:11,color:C.mid}}>Maintenant</p>
            </div>
            <button style={{...S.payBtn,width:"100%"}} onClick={()=>onSuccess(loyer.id)}>
              Fermer
            </button>
          </div>
        )}
      </div>
    </>
  );
}
