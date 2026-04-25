/* Byer — Profile Screens */

/* ─── PROFILE ───────────────────────────────────── */
function ProfileScreen({ role, setRole, onOpenRent, onOpenDashboard, onOpenTechs, onOpenPros, onOpenPublish, onOpenSettings, onOpenEditProfile, onOpenReviews, onOpenHistory, onLogout }) {
  const urgentCount = LOYERS_LOCATAIRE.filter(l => l.statut==="en_attente" && l.rappelActif).length
                    + LOYERS_BAILLEUR.filter(l  => l.statut==="en_attente" && l.joursRestants<=7).length;

  /* Le rôle est désormais lifté dans ByerApp et propagé via props (sync entre toutes les pages). */

  const [inviteOpen, setInviteOpen]       = useState(false);
  const [rewardsOpen, setRewardsOpen]     = useState(false);
  const [toast, setToast]                 = useState("");
  // Menu 3-points en haut à droite (regroupe "Informations personnelles"
  // et autres actions rapides — évite la redondance avec un row dédié).
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

  // Points dynamiques (persistés via byerStorage)
  const [rewardsPoints, setRewardsPoints] = useState(() => pointsManager.get());
  const [referralCount, setReferralCount] = useState(() => pointsManager.getReferrals());
  const [coupons, setCoupons]             = useState(() => pointsManager.getCoupons());

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  // Programme parrainage : code de référence stable
  const referralCode = (USER.name || "BYER").replace(/\s+/g, "").toUpperCase().slice(0, 6) + "24";
  const referralLink = `https://byer.cm/r/${referralCode}`;

  const handleShareInvite = async () => {
    const shareData = {
      title: "Rejoins-moi sur Byer",
      text: `Utilise mon code ${referralCode} : on gagne tous les deux ${POINTS_CONFIG.perReferral} pts à échanger contre des forfaits Byer gratuits.`,
      url: referralLink,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        showToast("Lien copié dans le presse-papiers");
      } else {
        alert(`${shareData.text}\n\n${shareData.url}`);
      }
    } catch (e) { /* user cancelled */ }
  };

  // Échange de points contre une récompense
  const handleRedeem = (reward) => {
    if (rewardsPoints < reward.cost) {
      showToast(`Il vous manque ${reward.cost - rewardsPoints} pts`);
      return;
    }
    pointsManager.redeem(reward.cost);
    pointsManager.addCoupon({ rewardId: reward.id, label: reward.label, type: reward.type, value: reward.value });
    setRewardsPoints(pointsManager.get());
    setCoupons(pointsManager.getCoupons());
    showToast(`Bon "${reward.label}" généré !`);
  };

  // Niveau (tier) basé sur les points
  const rewardsTier   = rewardsPoints >= POINTS_TIERS.gold ? "Or"
                      : rewardsPoints >= POINTS_TIERS.silver ? "Argent"
                      : "Bronze";
  const tierColor     = rewardsTier === "Or" ? "#F59E0B" : rewardsTier === "Argent" ? "#94A3B8" : "#B45309";
  const tierBg        = rewardsTier === "Or" ? "#FEF3C7" : rewardsTier === "Argent" ? "#F1F5F9" : "#FEF3C7";

  // "Informations personnelles" est désormais dans le menu 3-points du header
  // (Pino : "pour éviter la redondance"). On la retire de la liste des rows.
  const rows=[
    /* L'icône "history" (horloge avec flèche de retour) reflète mieux
       la sémantique "historique" qu'un pin/marker (ancien icon "trips"). */
    {icon:"history", l:"Historique des réservations",action:onOpenHistory},
    {icon:"message", l:"Avis reçus",                  action:onOpenReviews},
    {icon:"home",    l:"Publier une annonce",         action:onOpenPublish},
    {icon:"gear",    l:"Paramètres du compte",        action:onOpenSettings},
  ];

  // Items du menu 3-points (header)
  const headerMenuItems = [
    { icon:"user", label:"Informations personnelles", action: onOpenEditProfile },
  ];

  return (
    <div>
      {/* Header avec menu 3-points en haut à droite */}
      <div style={{...S.pageHead, position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <p style={S.pageTitle}>Mon profil</p>
        <button
          onClick={() => setHeaderMenuOpen(v => !v)}
          aria-label="Menu profil"
          style={{
            width:38, height:38, borderRadius:19,
            background: headerMenuOpen ? C.bg : "transparent",
            border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"background .15s",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={C.dark}>
            <circle cx="5" cy="12" r="2"/>
            <circle cx="12" cy="12" r="2"/>
            <circle cx="19" cy="12" r="2"/>
          </svg>
        </button>

        {headerMenuOpen && (
          <>
            {/* Backdrop pour fermer au clic dehors */}
            <div
              style={{position:"fixed", inset:0, zIndex:90}}
              onClick={() => setHeaderMenuOpen(false)}
            />
            {/* Dropdown */}
            <div style={{
              position:"absolute", top:"calc(100% - 4px)", right:14,
              background:C.white, borderRadius:14,
              boxShadow:"0 10px 36px rgba(0,0,0,.16)",
              border:`1px solid ${C.border}`,
              minWidth:240, zIndex:100, padding:"6px",
              fontFamily:"'DM Sans',sans-serif",
            }}>
              {headerMenuItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => { setHeaderMenuOpen(false); item.action?.(); }}
                  style={{
                    display:"flex", alignItems:"center", gap:12,
                    width:"100%", padding:"12px 14px",
                    background:"none", border:"none", cursor:"pointer",
                    borderRadius:10, textAlign:"left",
                    fontSize:14, fontWeight:500, color:C.dark,
                    fontFamily:"'DM Sans',sans-serif",
                  }}
                >
                  <Icon name={item.icon} size={18} color={C.dark} stroke={1.8}/>
                  <span style={{flex:1}}>{item.label}</span>
                  <Icon name="chevron" size={14} color={C.light} stroke={2}/>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Avatar card — l'édition se fait via le menu 3-points du header.
          Le tier Bronze/Argent/Or apparaît AVANT le nom de l'utilisateur
          (juste à côté de l'avatar) pour donner immédiatement le contexte
          de fidélité — le menu 3-points dans le header au-dessus le
          surplombe naturellement (cf. demande utilisateur). */}
      <div style={{margin:"0 16px 12px",background:C.white,borderRadius:16,padding:"18px 16px",display:"flex",alignItems:"center",gap:14,boxShadow:`0 1px 8px rgba(0,0,0,.05)`}}>
        <FaceAvatar photo={USER.photo} avatar={USER.avatar} bg={USER.bg} size={56} radius={28}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
            <span style={{
              fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8,
              background:tierBg,color:tierColor,flexShrink:0,
              fontFamily:"'DM Sans',sans-serif",
              display:"inline-flex",alignItems:"center",gap:3,
            }}>
              <span style={{fontSize:10,lineHeight:1}}>★</span>{rewardsTier}
            </span>
            <p style={{fontSize:16,fontWeight:700,color:C.black,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{USER.name}</p>
          </div>
          <p style={{fontSize:12,color:C.light,marginTop:2}}>{USER.city} · Membre {USER.since}</p>
        </div>
      </div>

      {/* Invite friends + Rewards : 2 cards row */}
      <div style={{margin:"0 16px 14px",display:"flex",gap:10}}>
        <button
          onClick={() => setInviteOpen(true)}
          style={{
            flex:1,background:C.white,borderRadius:14,padding:"14px 12px",
            border:`1px solid ${C.border}`,cursor:"pointer",textAlign:"left",
            fontFamily:"'DM Sans',sans-serif",
            display:"flex",flexDirection:"column",gap:6,
          }}
        >
          <div style={{width:36,height:36,borderRadius:18,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:18}}>🎁</span>
          </div>
          <p style={{fontSize:13,fontWeight:700,color:C.black}}>Inviter des amis</p>
          <p style={{fontSize:11,color:C.mid,lineHeight:1.4}}>+{POINTS_CONFIG.perReferral} pts par filleul</p>
        </button>
        <button
          onClick={() => setRewardsOpen(true)}
          style={{
            flex:1,background:C.white,borderRadius:14,padding:"14px 12px",
            border:`1px solid ${C.border}`,cursor:"pointer",textAlign:"left",
            fontFamily:"'DM Sans',sans-serif",
            display:"flex",flexDirection:"column",gap:6,
          }}
        >
          <div style={{width:36,height:36,borderRadius:18,background:tierBg,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:18}}>⭐</span>
          </div>
          <p style={{fontSize:13,fontWeight:700,color:C.black}}>Récompenses</p>
          <p style={{fontSize:11,color:C.mid,lineHeight:1.4}}>{rewardsPoints} pts · Niveau {rewardsTier}</p>
        </button>
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

      {/* Dashboard bailleur — CTA card */}
      <button style={{...S.rentCta,marginBottom:8}} onClick={onOpenDashboard}>
        <div style={S.rentCtaLeft}>
          <div style={{...S.rentCtaIcon,background:"#EFF6FF"}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:C.black}}>Dashboard bailleur</p>
            <p style={{fontSize:12,color:C.mid,marginTop:1}}>Propriétés · Stats · Boost</p>
          </div>
        </div>
        <Icon name="chevron" size={16} color={C.light} stroke={2}/>
      </button>

      {/* Techniciens — CTA card */}
      <button style={{...S.rentCta,marginBottom:8}} onClick={onOpenTechs}>
        <div style={S.rentCtaLeft}>
          <div style={{...S.rentCtaIcon,background:"#F0FDF4"}}>
            <span style={{fontSize:20}}>🔧</span>
          </div>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:C.black}}>Techniciens</p>
            <p style={{fontSize:12,color:C.mid,marginTop:1}}>Plomberie · Électricité · etc.</p>
          </div>
        </div>
        <Icon name="chevron" size={16} color={C.light} stroke={2}/>
      </button>

      {/* Concierges & Agents immobiliers — CTA card */}
      <button style={{...S.rentCta,marginBottom:8}} onClick={onOpenPros}>
        <div style={S.rentCtaLeft}>
          <div style={{...S.rentCtaIcon,background:"#FAF5FF"}}>
            <span style={{fontSize:20}}>🛎️</span>
          </div>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:C.black}}>Concierges & Agents</p>
            <p style={{fontSize:12,color:C.mid,marginTop:1}}>Conciergerie · Agence immo. · Gestion locative</p>
          </div>
        </div>
        <Icon name="chevron" size={16} color={C.light} stroke={2}/>
      </button>

      {/* Other rows */}
      <div style={{padding:"0 16px 12px"}}>
        {rows.map(row=>(
          <button key={row.l} style={{display:"flex",alignItems:"center",gap:14,padding:"15px 0",background:"none",border:"none",width:"100%",cursor:"pointer",borderBottom:`1px solid ${C.border}`}} onClick={row.action||undefined}>
            <Icon name={row.icon} size={20} color={C.dark} stroke={1.8}/>
            <span style={{flex:1,fontSize:14,fontWeight:500,color:C.dark,textAlign:"left"}}>{row.l}</span>
            <Icon name="chevron" size={16} color={C.light} stroke={2}/>
          </button>
        ))}
      </div>

      {/* Bouton Déconnexion — au tout fond du profil (avant le padding nav).
          Style distinct (rouge clair, icône logout) pour être identifié comme
          action de fin / sortie. Demande explicite Pino : visibilité directe
          sans devoir entrer dans Paramètres. */}
      <div style={{padding:"4px 16px 28px"}}>
        <button
          onClick={() => {
            if (typeof onLogout === "function") onLogout();
          }}
          style={{
            width:"100%",
            display:"flex",alignItems:"center",justifyContent:"center",gap:10,
            padding:"14px",background:"#FEF2F2",
            border:`1.5px solid #FECACA`,borderRadius:14,
            cursor:"pointer",
            fontSize:14,fontWeight:700,color:"#B91C1C",
            fontFamily:"'DM Sans',sans-serif",
          }}
        >
          <Icon name="logout" size={18} color="#B91C1C" stroke={2}/>
          Déconnexion
        </button>
      </div>

      {/* Invite modal */}
      {inviteOpen && (
        <>
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:200}} onClick={()=>setInviteOpen(false)}/>
          <div style={{
            position:"fixed",bottom:0,left:0,right:0,
            background:C.white,borderRadius:"20px 20px 0 0",
            padding:"18px 16px 24px",zIndex:201,
            fontFamily:"'DM Sans',sans-serif",
          }}>
            <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 14px"}}/>
            <p style={{fontSize:18,fontWeight:800,color:C.black,textAlign:"center",marginBottom:6}}>
              🎁 Inviter des amis
            </p>
            <p style={{fontSize:13,color:C.mid,textAlign:"center",marginBottom:14,lineHeight:1.5}}>
              Partagez votre lien : vous recevez <strong style={{color:C.coral}}>{POINTS_CONFIG.perReferral} pts</strong> par filleul inscrit (et lui aussi !).
              Échangez vos points contre des forfaits Byer gratuits.
            </p>

            {/* Lien de téléchargement de l'app */}
            <div style={{
              background:"linear-gradient(135deg,#FF5A5F 0%,#FF8A8E 100%)",borderRadius:12,padding:"14px 16px",marginBottom:12,
              display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,
            }}>
              <div style={{minWidth:0}}>
                <p style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,.85)",textTransform:"uppercase",letterSpacing:.5}}>Télécharger Byer</p>
                <p style={{fontSize:13,fontWeight:700,color:"white",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>byer.cm/app</p>
              </div>
              <button
                onClick={() => {
                  const url = "https://byer.cm/app";
                  if (navigator.clipboard) navigator.clipboard.writeText(url).then(()=>showToast("Lien de l'app copié !"));
                  else showToast("Lien : " + url);
                }}
                style={{padding:"8px 12px",background:"rgba(255,255,255,.95)",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,color:C.coral,fontFamily:"'DM Sans',sans-serif",flexShrink:0}}
              >Copier</button>
            </div>

            {/* Code de parrainage */}
            <div style={{
              background:C.bg,borderRadius:12,padding:"14px 16px",marginBottom:14,
              display:"flex",alignItems:"center",justifyContent:"space-between",
              border:`1px dashed ${C.coral}`,
            }}>
              <div>
                <p style={{fontSize:10,fontWeight:600,color:C.light,textTransform:"uppercase",letterSpacing:.5}}>Votre code promo</p>
                <p style={{fontSize:18,fontWeight:800,color:C.coral,letterSpacing:1.2,fontFamily:"monospace"}}>{referralCode}</p>
              </div>
              <button
                onClick={() => {
                  if (navigator.clipboard) navigator.clipboard.writeText(referralCode).then(()=>showToast("Code copié !"));
                  else showToast("Code : " + referralCode);
                }}
                style={{padding:"8px 12px",background:C.white,border:`1px solid ${C.border}`,borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,color:C.dark,fontFamily:"'DM Sans',sans-serif"}}
              >Copier</button>
            </div>

            {/* Stats parrainage */}
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <div style={{flex:1,background:C.bg,borderRadius:12,padding:"10px 12px",textAlign:"center"}}>
                <p style={{fontSize:18,fontWeight:800,color:C.black}}>{referralCount}</p>
                <p style={{fontSize:10,color:C.mid,marginTop:2}}>Filleuls inscrits</p>
              </div>
              <div style={{flex:1,background:C.bg,borderRadius:12,padding:"10px 12px",textAlign:"center"}}>
                <p style={{fontSize:18,fontWeight:800,color:C.coral}}>+{referralCount * POINTS_CONFIG.perReferral}</p>
                <p style={{fontSize:10,color:C.mid,marginTop:2}}>Points gagnés</p>
              </div>
            </div>

            {/* Boutons partage */}
            <button
              onClick={handleShareInvite}
              style={{width:"100%",padding:"13px",background:C.coral,border:"none",borderRadius:10,color:C.white,fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}
            >Partager mon lien</button>
            <button
              onClick={() => setInviteOpen(false)}
              style={{width:"100%",padding:"13px",background:C.bg,border:"none",borderRadius:10,color:C.dark,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
            >Plus tard</button>
          </div>
        </>
      )}

      {/* Rewards modal */}
      {rewardsOpen && (
        <>
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:200}} onClick={()=>setRewardsOpen(false)}/>
          <div style={{
            position:"fixed",bottom:0,left:0,right:0,
            background:C.white,borderRadius:"20px 20px 0 0",
            padding:"18px 16px 24px",zIndex:201,maxHeight:"85vh",overflowY:"auto",
            fontFamily:"'DM Sans',sans-serif",
          }}>
            <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 14px"}}/>
            <p style={{fontSize:18,fontWeight:800,color:C.black,textAlign:"center",marginBottom:6}}>
              ⭐ Mes récompenses
            </p>

            {/* Tier card */}
            <div style={{
              background:`linear-gradient(135deg, ${tierBg} 0%, ${C.white} 100%)`,
              borderRadius:16,padding:"18px",marginBottom:14,marginTop:8,
              border:`1px solid ${tierColor}33`,textAlign:"center",
            }}>
              <p style={{fontSize:11,fontWeight:700,color:tierColor,textTransform:"uppercase",letterSpacing:.6,marginBottom:4}}>
                Niveau {rewardsTier}
              </p>
              <p style={{fontSize:32,fontWeight:800,color:C.black,marginBottom:2}}>{rewardsPoints}</p>
              <p style={{fontSize:12,color:C.mid}}>points fidélité</p>
            </div>

            {/* Progress to next tier */}
            <p style={{fontSize:11,color:C.mid,marginBottom:6}}>
              {rewardsTier === "Or" ? "Niveau maximum atteint 🎉" :
                `${(rewardsTier === "Argent" ? POINTS_TIERS.gold : POINTS_TIERS.silver) - rewardsPoints} pts jusqu'au niveau ${rewardsTier === "Argent" ? "Or" : "Argent"}`}
            </p>
            <div style={{height:6,background:C.bg,borderRadius:3,marginBottom:18,overflow:"hidden"}}>
              <div style={{
                height:"100%",
                width:`${Math.min(100, (rewardsPoints / (rewardsTier === "Argent" ? POINTS_TIERS.gold : POINTS_TIERS.silver)) * 100)}%`,
                background:tierColor,borderRadius:3,
              }}/>
            </div>

            {/* Bons disponibles (déjà échangés, prêts à appliquer) */}
            {coupons.length > 0 && (
              <>
                <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:8}}>🎟️ Mes bons disponibles</p>
                <div style={{marginBottom:18}}>
                  {coupons.map(c => (
                    <div key={c.id} style={{
                      display:"flex",alignItems:"center",justifyContent:"space-between",
                      background:"#F0FDF4",border:"1px dashed #16A34A",borderRadius:10,
                      padding:"10px 12px",marginBottom:6,
                    }}>
                      <div style={{minWidth:0}}>
                        <p style={{fontSize:13,fontWeight:700,color:"#16A34A"}}>{c.label}</p>
                        <p style={{fontSize:10,color:C.mid,marginTop:1}}>Appliqué à votre prochaine {c.type==="boost"?"enchère Boost":"souscription forfait"}</p>
                      </div>
                      <span style={{fontSize:18}}>✓</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Catalogue d'échange : transformer ses points en bons */}
            <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:8}}>🛒 Échanger mes points</p>
            <div style={{marginBottom:18}}>
              {POINTS_REWARDS.map(reward => {
                const canAfford = rewardsPoints >= reward.cost;
                return (
                  <div key={reward.id} style={{
                    display:"flex",alignItems:"center",gap:10,
                    background:canAfford?C.white:C.bg,
                    border:`1px solid ${canAfford?C.border:C.border}`,
                    borderRadius:12,padding:"10px 12px",marginBottom:6,
                    opacity:canAfford?1:.55,
                  }}>
                    <span style={{fontSize:22,flexShrink:0}}>{reward.icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:13,fontWeight:600,color:C.black}}>{reward.label}</p>
                      <p style={{fontSize:11,color:C.coral,fontWeight:700,marginTop:1}}>{reward.cost} pts</p>
                    </div>
                    <button
                      disabled={!canAfford}
                      onClick={() => handleRedeem(reward)}
                      style={{
                        padding:"7px 12px",
                        background:canAfford?C.coral:C.border,
                        color:canAfford?C.white:C.light,
                        border:"none",borderRadius:8,
                        fontSize:12,fontWeight:700,
                        cursor:canAfford?"pointer":"not-allowed",
                        fontFamily:"'DM Sans',sans-serif",flexShrink:0,
                      }}
                    >Échanger</button>
                  </div>
                );
              })}
            </div>

            {/* Comment gagner plus */}
            <div style={{background:"#FFF8E1",borderRadius:10,padding:"10px 12px",marginBottom:14,fontSize:11,color:"#92400E",lineHeight:1.5}}>
              💡 Gagnez +{POINTS_CONFIG.perReferral} pts par filleul inscrit, et +{POINTS_CONFIG.perBooking} pts par réservation effectuée.
            </div>

            <button
              onClick={() => setRewardsOpen(false)}
              style={{width:"100%",padding:"13px",background:C.coral,border:"none",borderRadius:10,color:C.white,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
            >Fermer</button>
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed",bottom:90,left:16,right:16,
          background:C.dark,color:C.white,
          padding:"11px 16px",borderRadius:10,
          textAlign:"center",fontSize:13,fontWeight:500,
          zIndex:300,fontFamily:"'DM Sans',sans-serif",
        }}>{toast}</div>
      )}
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
