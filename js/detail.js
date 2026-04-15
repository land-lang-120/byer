/* Byer — Detail Screen */

function DetailScreen({ item, saved, toggleSave, onBack, openGallery, duration, onViewOwner }) {
  const isSaved   = !!saved[item.id];
  const gallery   = GALLERY[item.id];
  const nights    = 3;
  const hasMonthly = item.type==="property" && item.monthPrice;
  const [localDur, setLocalDur] = useState(duration);
  const booked    = BOOKED_UNTIL[item.id];
  const [reviewOpen, setReviewOpen] = useState(false);

  const ownerEntry = Object.values(OWNERS).find(o =>
    o.buildings.some(b => b.units.some(u => u.id === item.id))
  );
  const ownerName  = ownerEntry?.name || "Ekwalla M.";

  const price = localDur==="month" && hasMonthly ? item.monthPrice : item.nightPrice;
  const unit  = localDur==="month" && hasMonthly ? "/mois" : "/nuit";

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={S.dScroll}>
        {/* Hero */}
        <div style={{position:"relative",height:280}}>
          <img src={gallery.imgs[0]} alt={item.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.4) 0%,transparent 55%)"}}/>
          <button style={S.dBack} onClick={onBack}><Icon name="back" size={20} color="white" stroke={2.5}/></button>
          <div style={{position:"absolute",top:52,right:16,display:"flex",gap:8}}>
            <button style={S.dAction}><Icon name="share" size={17} color="white" stroke={2}/></button>
            <button style={S.dAction} onClick={e=>toggleSave(item.id,e)}>
              <Icon name={isSaved?"heartF":"heart"} size={17} color={isSaved?C.coral:"white"} stroke={2}/>
            </button>
          </div>
          {item.superhost && <span style={{position:"absolute",bottom:56,left:16,background:"white",borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,color:C.black}}>Superhost</span>}
          <button style={S.heroGalleryBtn} onClick={e=>openGallery(0,e)}>
            <Icon name="grid" size={13} color={C.white} stroke={1.8}/>
            <span style={{fontSize:11,fontWeight:600,color:C.white}}>Voir les {gallery.imgs.length} photos</span>
          </button>
        </div>

        {/* Thumbnail preview */}
        <div style={S.thumbPreviewRow}>
          {gallery.imgs.slice(1).map((img,i)=>(
            <button key={i} style={S.thumbPreview} onClick={e=>openGallery(i+1,e)}>
              <img src={img} alt={gallery.labels[i+1]} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={S.thumbPreviewLabel}>{gallery.labels[i+1]}</div>
            </button>
          ))}
        </div>

        <div style={S.dCard}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:8}}>
            <h1 style={{fontSize:21,fontWeight:700,color:C.black,flex:1,lineHeight:1.25}}>{item.title}</h1>
            <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0,background:C.bg,borderRadius:10,padding:"5px 9px"}}>
              <Icon name="star" size={12} color={C.dark}/>
              <span style={{fontSize:13,fontWeight:700,color:C.black}}>{item.rating}</span>
            </div>
          </div>
          <p style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:C.mid,marginBottom:4}}>
            <ByerPin size={14}/>{item.zone}, {item.city}
          </p>
          <p style={{fontSize:12,color:C.light,marginBottom:16}}>{item.reviews} avis · {item.superhost?"Superhost ✓":"Hôte vérifié"}</p>

          {/* Duration toggle on detail */}
          {hasMonthly && (
            <div style={S.detailDurRow}>
              <p style={{fontSize:13,fontWeight:600,color:C.dark}}>Mode de location :</p>
              <div style={S.durToggle}>
                <button style={{...S.durBtn,...(localDur==="night"?S.durBtnOn:{})}} onClick={()=>setLocalDur("night")}>Par nuit</button>
                <button style={{...S.durBtn,...(localDur==="month"?S.durBtnOn:{})}} onClick={()=>setLocalDur("month")}>Par mois</button>
              </div>
            </div>
          )}
          {item.type==="property" && item.monthPrice===null && (
            <div style={{...S.durBanner,marginBottom:16}}>
              <svg width="13" height="13" fill="none" stroke={C.mid} strokeWidth="2" viewBox="0 0 24 24" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style={{fontSize:12,color:C.mid}}>Ce logement n'est disponible qu'à la nuitée.</span>
            </div>
          )}

          <Divider/>

          {/* Stats */}
          <div style={{display:"flex",justifyContent:"space-around",padding:"4px 0"}}>
            {(item.type==="property" ? [
              {icon:"bed",    val:item.beds,   label:"Chambres"},
              {icon:"person", val:item.guests, label:"Voyageurs"},
              {icon:"check",  val:item.baths,  label:"Salle de bain"},
            ] : [
              {icon:"person", val:item.seats,  label:"Places"},
              {icon:"fuel",   val:item.fuel,   label:"Carburant"},
              {icon:"gear",   val:item.trans,  label:"Boîte vitesse"},
            ]).map(s=>(
              <div key={s.label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,flex:1}}>
                <Icon name={s.icon} size={20} color={C.dark} stroke={1.8}/>
                <span style={{fontSize:14,fontWeight:700,color:C.black}}>{s.val}</span>
                <span style={{fontSize:10,color:C.light,fontWeight:500,textAlign:"center"}}>{s.label}</span>
              </div>
            ))}
          </div>

          <Divider/>

          {/* Disponibilité */}
          {booked && (
            <div style={S.unavailDetail}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="18" height="18" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <p style={{fontSize:14,fontWeight:700,color:"#EF4444"}}>Actuellement indisponible</p>
              </div>
              <p style={{fontSize:13,color:C.mid,marginTop:4}}>
                Ce logement est réservé jusqu'au <strong>{booked}</strong>. Vous pouvez le mettre en favori et revenir à cette date.
              </p>
            </div>
          )}
          {!booked && (
            <div style={S.availDetail}>
              <div style={{width:8,height:8,borderRadius:4,background:"#16A34A",boxShadow:"0 0 0 3px #16A34A33"}}/>
              <p style={{fontSize:13,fontWeight:600,color:"#16A34A"}}>Disponible dès maintenant</p>
            </div>
          )}

          <Divider/>

          {/* Host */}
          <button style={{...S.hostRow, cursor:"pointer", width:"100%", textAlign:"left"}} onClick={()=>onViewOwner&&onViewOwner(ownerName)}>
            <FaceAvatar photo={ownerEntry?.photo} avatar={ownerEntry?.avatar||"?"} bg={ownerEntry?.avatarBg} size={46}/>
            <div style={{flex:1}}>
              <p style={{fontSize:14,fontWeight:600,color:C.black}}>{item.type==="property"?"Hébergé par":"Proposé par"} {ownerName}</p>
              <p style={{fontSize:12,color:C.mid,marginTop:1}}>Voir tous ses biens →</p>
            </div>
            {item.superhost && <span style={{background:C.bg,color:C.dark,fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,border:`1.5px solid ${C.border}`}}>✓ Vérifié</span>}
          </button>

          <Divider/>

          <p style={{fontSize:14,color:C.mid,lineHeight:1.72,marginBottom:16}}>
            {item.type==="property"
              ? `Situé à ${item.zone} (${item.city}), ce logement allie confort moderne et ambiance locale. Disponible ${item.monthPrice?"à la nuitée ou en bail mensuel pour une résidence longue durée":"à la nuitée"}.`
              : `Véhicule disponible à ${item.zone} (${item.city}), parfait pour tous vos déplacements.`}
          </p>

          <Divider/>

          {/* Notes détaillées par critère */}
          <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:14}}>Notes & avis</p>
          <RatingBreakdown itemId={item.id} globalRating={item.rating} reviews={item.reviews} onReview={()=>setReviewOpen(true)}/>

          <Divider/>

          <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:12}}>{item.type==="property"?"Équipements":"Caractéristiques"}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:4}}>
            {item.amenities.map(a=>(
              <div key={a} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0"}}>
                <Icon name="check" size={14} color={C.coral} stroke={2.5}/>
                <span style={{fontSize:13,color:C.dark}}>{a}</span>
              </div>
            ))}
          </div>

          <Divider/>

          {/* Date / Period selector */}
          <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:12}}>
            {localDur==="month" ? "Période souhaitée" : "Vos dates"}
          </p>
          <div style={{border:`1.5px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:18}}>
            <div style={{padding:"12px 16px"}}>
              <span style={{display:"block",fontSize:10,fontWeight:700,color:C.light,textTransform:"uppercase",letterSpacing:.6,marginBottom:5}}>
                {localDur==="month" ? "DÉBUT DU BAIL" : "ARRIVÉE / PRISE EN CHARGE"}
              </span>
              <input type="date" style={{border:"none",outline:"none",fontSize:14,color:C.dark,background:"transparent",width:"100%",fontFamily:"'DM Sans',sans-serif"}}/>
            </div>
            <div style={{borderTop:`1px solid ${C.border}`,padding:"12px 16px"}}>
              <span style={{display:"block",fontSize:10,fontWeight:700,color:C.light,textTransform:"uppercase",letterSpacing:.6,marginBottom:5}}>
                {localDur==="month" ? "FIN DU BAIL" : "DÉPART / RETOUR"}
              </span>
              <input type="date" style={{border:"none",outline:"none",fontSize:14,color:C.dark,background:"transparent",width:"100%",fontFamily:"'DM Sans',sans-serif"}}/>
            </div>
          </div>

          {/* Price breakdown */}
          <div style={{background:C.bg,borderRadius:14,padding:"14px 16px"}}>
            {(localDur==="month" ? [
              {l:`${fmtM(price)} × 1 mois`,            v:fmt(price)},
              {l:"Frais de dossier Byer (5%)",           v:fmt(Math.round(price*.05))},
              {l:"Caution (remboursable)",                v:fmt(price)},
            ] : [
              {l:`${fmt(price)} × ${nights} nuits`,     v:fmt(price*nights)},
              {l:"Frais de service Byer (12%)",          v:fmt(Math.round(price*nights*.12))},
              {l:"Taxes locales (5%)",                   v:fmt(Math.round(price*nights*.05))},
            ]).map(row=>(
              <div key={row.l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0"}}>
                <span style={{fontSize:13,color:C.mid}}>{row.l}</span>
                <span style={{fontSize:13,color:C.dark,fontWeight:500}}>{row.v}</span>
              </div>
            ))}
            <div style={{height:1,background:C.border,margin:"8px 0"}}/>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:14,fontWeight:700,color:C.black}}>
                {localDur==="month" ? "Total 1er mois" : `Total (${nights} nuits)`}
              </span>
              <span style={{fontSize:14,fontWeight:700,color:C.black}}>
                {localDur==="month"
                  ? fmt(Math.round(price*1.05+price))
                  : fmt(Math.round(price*nights*1.17))}
              </span>
            </div>
          </div>
          <div style={{height:110}}/>
        </div>
      </div>

      <div style={S.dFooter}>
        <div>
          <span style={{fontSize:19,fontWeight:700,color:C.black}}>{fmt(price)}</span>
          <span style={{fontSize:12,color:C.light}}>{unit}</span>
        </div>
        <button style={S.reserveBtn} className="resBtn">
          {localDur==="month" ? "Louer ce logement" : "Réserver"}
        </button>
      </div>
    </div>
  );
}
