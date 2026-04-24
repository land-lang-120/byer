/* Byer — Boost Découverte
   Système d'enchères pour mettre en avant les annonces.
   Règles :
   - Enchère de 1 000 à 100 000 FCFA/jour
   - Le dernier à payer reste en tête
   - Au plafond (100 000), chaque paiement surclasse le précédent
   ═══════════════════════════════════════════════════ */

/* ─── BOOST SCREEN ───────────────────────────────── */
function BoostScreen({ onBack }) {
  const [selectedProp, setSelectedProp] = useState(null);
  const [bidAmount, setBidAmount] = useState(BOOST_CONFIG.minBid);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [bids, setBids] = useState(BOOST_BIDS);

  /* Properties owned by current user */
  const owner = OWNERS["Ekwalla M."];
  const myProps = owner ? owner.buildings.flatMap(b=>b.units.filter(u=>u.available).map(u=>({
    id: u.id, title: u.label, building: b.name, nightPrice: u.nightPrice
  }))) : [];

  const activeBids = bids.filter(b=>b.active).sort((a,b)=>b.amount-a.amount);

  const handleBid = () => {
    const newBid = {
      id: "BO"+Date.now(),
      propertyId: selectedProp.id,
      ownerName: "Ekwalla M.",
      amount: bidAmount,
      date: "22 mars 2025",
      active: true,
    };
    setBids(p=>[newBid,...p]);
    setShowConfirm(false);
    setShowSuccess(true);
    setTimeout(()=>setShowSuccess(false), 3000);
  };

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={{flex:1,overflowY:"auto"}}>

        {/* Header */}
        <div style={S.rentHeader}>
          <button style={S.dBack2} onClick={onBack}>
            <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
          </button>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Boost Découverte</p>
          <button onClick={()=>setShowInfo(true)} style={{background:"none",border:"none",cursor:"pointer",padding:6}}>
            <svg width="20" height="20" fill="none" stroke={C.mid} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </button>
        </div>

        {/* Banner */}
        <div style={{margin:"12px 16px",background:"linear-gradient(135deg,#FF5A5F 0%,#FF8A8E 100%)",borderRadius:18,padding:"18px",color:"white"}}>
          <p style={{fontSize:16,fontWeight:800,marginBottom:4}}>🚀 Boostez votre annonce</p>
          <p style={{fontSize:12,opacity:.9,lineHeight:1.6}}>
            Placez une enchère pour que votre bien apparaisse en premier dans les résultats de recherche.
            Le dernier enchérisseur prend la tête !
          </p>
        </div>

        {/* Active boosts ranking */}
        {activeBids.length > 0 && (
          <div style={{padding:"0 16px",marginBottom:16}}>
            <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:10}}>Classement actuel</p>
            {activeBids.map((bid,i)=>{
              const prop = PROPERTIES.find(p=>p.id===bid.propertyId);
              const isMe = bid.ownerName === "Ekwalla M.";
              return (
                <div key={bid.id} style={{display:"flex",alignItems:"center",gap:10,background:isMe?"#FFF5F5":C.white,borderRadius:14,padding:"12px",marginBottom:6,border:isMe?`1.5px solid ${C.coral}22`:`1px solid ${C.border}`}}>
                  <div style={{width:28,height:28,borderRadius:14,background:i===0?C.coral:i===1?"#F59E0B":C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:12,fontWeight:800,color:i<2?"white":C.mid}}>{i+1}</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:13,fontWeight:600,color:C.black}}>{prop?.title||"Annonce #"+bid.propertyId}</p>
                    <p style={{fontSize:11,color:C.light}}>{bid.ownerName} · {bid.date}</p>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <p style={{fontSize:14,fontWeight:800,color:C.coral}}>{fmt(bid.amount)}</p>
                    <p style={{fontSize:9,color:C.light}}>/jour</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create new boost */}
        <div style={{padding:"0 16px 24px"}}>
          <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:10}}>Nouvelle enchère</p>

          {/* Select property */}
          <p style={{fontSize:12,fontWeight:600,color:C.mid,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Choisir une annonce</p>
          <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:16,paddingBottom:4}}>
            {myProps.map(p=>(
              <button key={p.id}
                onClick={()=>setSelectedProp(p)}
                style={{flexShrink:0,padding:"10px 14px",borderRadius:12,border:selectedProp?.id===p.id?`2px solid ${C.coral}`:`1.5px solid ${C.border}`,background:selectedProp?.id===p.id?"#FFF5F5":C.white,cursor:"pointer",textAlign:"left"}}
              >
                <p style={{fontSize:12,fontWeight:600,color:selectedProp?.id===p.id?C.coral:C.dark}}>{p.title}</p>
                <p style={{fontSize:10,color:C.light,marginTop:2}}>{p.building}</p>
              </button>
            ))}
          </div>

          {/* Bid amount */}
          <p style={{fontSize:12,fontWeight:600,color:C.mid,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Montant de l'enchère</p>
          <div style={{background:C.white,borderRadius:16,padding:"16px",border:`1.5px solid ${C.border}`,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:12}}>
              <button
                onClick={()=>setBidAmount(v=>Math.max(BOOST_CONFIG.minBid, v-BOOST_CONFIG.step))}
                style={{width:40,height:40,borderRadius:20,border:`1.5px solid ${C.border}`,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,fontWeight:700,color:C.dark}}
              >−</button>
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:28,fontWeight:800,color:C.coral}}>{bidAmount.toLocaleString("fr-FR")}</p>
                <p style={{fontSize:11,color:C.light}}>FCFA / jour</p>
              </div>
              <button
                onClick={()=>setBidAmount(v=>Math.min(BOOST_CONFIG.maxBid, v+BOOST_CONFIG.step))}
                style={{width:40,height:40,borderRadius:20,border:`1.5px solid ${C.border}`,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,fontWeight:700,color:C.dark}}
              >+</button>
            </div>

            {/* Range slider visual */}
            <div style={{position:"relative",height:6,borderRadius:3,background:C.border,margin:"0 8px"}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",borderRadius:3,background:C.coral,width:`${((bidAmount-BOOST_CONFIG.minBid)/(BOOST_CONFIG.maxBid-BOOST_CONFIG.minBid))*100}%`}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6,padding:"0 4px"}}>
              <span style={{fontSize:10,color:C.light}}>{fmt(BOOST_CONFIG.minBid)}</span>
              <span style={{fontSize:10,color:C.light}}>{fmt(BOOST_CONFIG.maxBid)}</span>
            </div>
          </div>

          {/* Quick amounts */}
          <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
            {[5000,10000,25000,50000,100000].map(amt=>(
              <button key={amt}
                onClick={()=>setBidAmount(amt)}
                style={{padding:"7px 14px",borderRadius:10,border:bidAmount===amt?`1.5px solid ${C.coral}`:`1.5px solid ${C.border}`,background:bidAmount===amt?"#FFF5F5":C.white,cursor:"pointer",fontSize:12,fontWeight:600,color:bidAmount===amt?C.coral:C.mid}}
              >
                {fmt(amt)}
              </button>
            ))}
          </div>

          {/* Submit button */}
          <button
            disabled={!selectedProp}
            onClick={()=>setShowConfirm(true)}
            style={{...S.payBtn,opacity:selectedProp?1:.5,cursor:selectedProp?"pointer":"not-allowed"}}
          >
            🚀 Placer l'enchère · {fmt(bidAmount)}/jour
          </button>
        </div>
      </div>

      {/* Confirm sheet */}
      {showConfirm && (
        <>
          <div style={S.sheetBackdrop} onClick={()=>setShowConfirm(false)}/>
          <div style={{...S.sheet,padding:"24px",zIndex:201}} className="sheet">
            <div style={S.sheetHandle}/>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"12px 0"}}>
              <span style={{fontSize:36}}>🚀</span>
              <p style={{fontSize:16,fontWeight:700,color:C.black}}>Confirmer le boost ?</p>
              <div style={{background:C.bg,borderRadius:12,padding:"12px 16px",width:"100%"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:13,color:C.mid}}>Annonce</span>
                  <span style={{fontSize:13,fontWeight:600,color:C.black}}>{selectedProp?.title}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,color:C.mid}}>Montant</span>
                  <span style={{fontSize:13,fontWeight:700,color:C.coral}}>{fmt(bidAmount)}/jour</span>
                </div>
              </div>
              <p style={{fontSize:11,color:C.mid,textAlign:"center",lineHeight:1.6}}>
                Votre annonce sera affichée en tête de résultats tant que vous restez le dernier enchérisseur.
              </p>
              <button onClick={handleBid} style={{...S.payBtn,marginTop:4}}>
                Confirmer et payer
              </button>
              <button onClick={()=>setShowConfirm(false)} style={S.reminderBtn}>
                Annuler
              </button>
            </div>
          </div>
        </>
      )}

      {/* Success banner */}
      {showSuccess && (
        <div style={{position:"fixed",top:60,left:16,right:16,background:"#16A34A",borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:10,zIndex:300,boxShadow:"0 8px 30px rgba(0,0,0,.2)"}}>
          <Icon name="check" size={20} color="white" stroke={2.5}/>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:"white"}}>Boost activé !</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,.8)"}}>Votre annonce est maintenant en tête.</p>
          </div>
        </div>
      )}

      {/* Info dialog */}
      {showInfo && (
        <>
          <div style={S.sheetBackdrop} onClick={()=>setShowInfo(false)}/>
          <div style={{...S.sheet,padding:"24px",zIndex:201}} className="sheet">
            <div style={S.sheetHandle}/>
            <div style={{padding:"8px 0"}}>
              <p style={{fontSize:18,fontWeight:800,color:C.black,marginBottom:14}}>🚀 Comment fonctionne le Boost ?</p>

              {[
                {icon:"💰", title:"Enchère de 1 000 à 100 000 FCFA/jour", desc:"Choisissez le montant que vous souhaitez investir pour promouvoir votre annonce."},
                {icon:"🏆", title:"Le dernier paye, le premier apparaît", desc:"Le dernier propriétaire à payer prend automatiquement la tête du classement."},
                {icon:"⚡", title:"Au plafond ? Surclassez !", desc:"Si l'enchère est à 100 000 FCFA, chaque nouveau paiement au plafond déplace le précédent leader."},
                {icon:"📊", title:"Visibilité maximale", desc:"Votre annonce apparaît en première position dans les résultats de recherche."},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,marginBottom:14}}>
                  <span style={{fontSize:20,flexShrink:0}}>{item.icon}</span>
                  <div>
                    <p style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:2}}>{item.title}</p>
                    <p style={{fontSize:12,color:C.mid,lineHeight:1.6}}>{item.desc}</p>
                  </div>
                </div>
              ))}

              <button onClick={()=>setShowInfo(false)} style={{...S.payBtn,marginTop:8}}>
                Compris !
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
