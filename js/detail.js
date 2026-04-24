/* Byer — Detail Screen */

function DetailScreen({ item, saved, toggleSave, onBack, openGallery, duration, onViewOwner, onBook, onOpenAllReviews }) {
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

  // Tarif calculé via helper (gère vehicle day/week/month et property night/month)
  const { price, unit } = priceFor(item, localDur);

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
            <button style={S.dAction} onClick={()=>{
              const url = window.location.href;
              const title = `${item.title} — Byer`;
              const text  = `Découvre "${item.title}" à ${item.zone}, ${item.city} sur Byer.`;
              if (navigator.share) {
                navigator.share({ title, text, url }).catch(()=>{});
              } else if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(()=>alert("Lien copié dans le presse-papier !"));
              } else {
                alert("Partagez ce lien : " + url);
              }
            }}><Icon name="share" size={17} color="white" stroke={2}/></button>
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

          {/* Duration toggle on detail — properties (nuit/mois) */}
          {hasMonthly && (
            <div style={S.detailDurRow}>
              <p style={{fontSize:13,fontWeight:600,color:C.dark}}>Mode de location :</p>
              <div style={S.durToggle}>
                <button style={{...S.durBtn,...(localDur==="night"?S.durBtnOn:{})}} onClick={()=>setLocalDur("night")}>Par nuit</button>
                <button style={{...S.durBtn,...(localDur==="month"?S.durBtnOn:{})}} onClick={()=>setLocalDur("month")}>Par mois</button>
              </div>
            </div>
          )}
          {/* Duration toggle on detail — vehicles (jour/semaine/mois) */}
          {item.type==="vehicle" && (
            <div style={S.detailDurRow}>
              <p style={{fontSize:13,fontWeight:600,color:C.dark}}>Mode de location :</p>
              <div style={S.durToggle}>
                {DURATION_OPTS.vehicle.map(opt => (
                  <button key={opt.id}
                    style={{...S.durBtn,...(localDur===opt.id?S.durBtnOn:{})}}
                    onClick={()=>setLocalDur(opt.id)}
                  >{opt.label}</button>
                ))}
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

          {/* Localisation + carte */}
          <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:8}}>Localisation</p>
          <p style={{fontSize:13,color:C.mid,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
            <ByerPin size={14}/>{item.zone}, {item.city}
          </p>
          {(() => {
            const coord = CITY_COORDS[item.city];
            if (!coord) return (
              <div style={{height:160,borderRadius:14,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:C.light,marginBottom:12}}>
                Carte non disponible pour cette ville
              </div>
            );
            const { lat, lon } = coord;
            const bbox = `${lon-0.025},${lat-0.018},${lon+0.025},${lat+0.018}`;
            const src  = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
            return (
              <div style={{borderRadius:14,overflow:"hidden",border:`1.5px solid ${C.border}`,marginBottom:8,position:"relative"}}>
                <iframe
                  title={`Carte ${item.city}`}
                  src={src}
                  width="100%" height="180"
                  style={{border:0,display:"block"}}
                  loading="lazy"
                />
                <a
                  href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{position:"absolute",bottom:8,right:8,background:C.white,padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:600,color:C.coral,textDecoration:"none",boxShadow:"0 2px 6px rgba(0,0,0,.12)"}}
                >Voir en grand ↗</a>
              </div>
            );
          })()}
          <p style={{fontSize:11,color:C.light,marginBottom:4}}>L'emplacement exact est communiqué après la réservation.</p>

          <Divider/>

          {/* Notes détaillées par critère */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <p style={{fontSize:16,fontWeight:700,color:C.black}}>Notes & avis</p>
            {onOpenAllReviews && (SAMPLE_REVIEWS[item.id]?.length > 0) && (
              <button
                style={{background:"none",border:"none",fontSize:12,fontWeight:600,color:C.coral,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
                onClick={()=>onOpenAllReviews(item)}
              >Tous les avis →</button>
            )}
          </div>
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

          {/* Règles maison / Conditions véhicule */}
          <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:12}}>
            {item.type==="property" ? "Règlement intérieur" : "Conditions du véhicule"}
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:4}}>
            {(item.type==="property" ? [
              {ok:true,  icon:"⏰", label:`Arrivée à partir de 14h00`},
              {ok:true,  icon:"🚪", label:`Départ avant 11h00`},
              {ok:false, icon:"🚭", label:`Non-fumeur (intérieur)`},
              {ok:false, icon:"🎉", label:`Pas de fêtes ni d'évènements`},
              {ok:true,  icon:"🐾", label:`Animaux acceptés sur demande`},
              {ok:true,  icon:"👨‍👩‍👧", label:`Familles bienvenues (jusqu'à ${item.guests} pers.)`},
            ] : [
              {ok:true,  icon:"🪪", label:`Permis B valide depuis 2 ans minimum`},
              {ok:true,  icon:"💳", label:`Caution de 50 000 F (pré-autorisation CB)`},
              {ok:true,  icon:"⛽", label:`Plein restitué — sinon 1 200 F/L`},
              {ok:false, icon:"🚭", label:`Non-fumeur dans le véhicule`},
              {ok:true,  icon:"🛣️", label:`Kilométrage illimité au Cameroun`},
              {ok:false, icon:"🌍", label:`Sortie du territoire interdite sans autorisation`},
            ]).map(rule => (
              <div key={rule.label} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:rule.ok?C.dark:C.mid}}>
                <span style={{fontSize:16,opacity:rule.ok?1:0.6}}>{rule.icon}</span>
                <span>{rule.label}</span>
              </div>
            ))}
          </div>

          <Divider/>

          {/* Politique d'annulation */}
          <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:8}}>Politique d'annulation</p>
          <div style={{padding:"14px 16px",background:"#F0FDF4",borderRadius:14,marginBottom:12,border:"1px solid #BBF7D0"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:14}}>✓</span>
              <p style={{fontSize:13,fontWeight:700,color:"#16A34A"}}>Annulation flexible</p>
            </div>
            <p style={{fontSize:12,color:C.mid,lineHeight:1.55}}>
              Remboursement intégral si vous annulez au moins <strong>48 heures</strong> avant l'arrivée. Au-delà, les frais de service Byer ne sont pas remboursés.
            </p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:4}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.mid,padding:"6px 0",borderBottom:`1px dashed ${C.border}`}}>
              <span>Plus de 48h avant</span><span style={{color:"#16A34A",fontWeight:600}}>100% remboursé</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.mid,padding:"6px 0",borderBottom:`1px dashed ${C.border}`}}>
              <span>Entre 24h et 48h</span><span style={{color:"#F59E0B",fontWeight:600}}>50% remboursé</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.mid,padding:"6px 0"}}>
              <span>Moins de 24h</span><span style={{color:"#EF4444",fontWeight:600}}>Non remboursable</span>
            </div>
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

          {/* Price breakdown — segment + durée awareness */}
          <div style={{background:C.bg,borderRadius:14,padding:"14px 16px"}}>
            {(() => {
              // Construit dynamiquement les lignes selon segment+durée
              let rows, totalLabel, total;
              if (localDur === "month") {
                rows = [
                  { l:`${fmtM(price)} × 1 mois`,        v:fmt(price) },
                  { l:"Frais de dossier Byer (5%)",     v:fmt(Math.round(price*.05)) },
                  { l:"Caution (remboursable)",          v:fmt(price) },
                ];
                totalLabel = "Total 1er mois";
                total = Math.round(price*1.05 + price);
              } else if (localDur === "week") {
                rows = [
                  { l:`${fmt(price)} × 1 semaine`,      v:fmt(price) },
                  { l:"Frais de service Byer (10%)",    v:fmt(Math.round(price*.10)) },
                ];
                totalLabel = "Total semaine";
                total = Math.round(price*1.10);
              } else if (localDur === "day") {
                const days = nights; // réutilise même valeur (3 jours par défaut)
                rows = [
                  { l:`${fmt(price)} × ${days} jours`,  v:fmt(price*days) },
                  { l:"Frais de service Byer (12%)",    v:fmt(Math.round(price*days*.12)) },
                  { l:"Caution véhicule",                v:fmt(50000) },
                ];
                totalLabel = `Total (${days} jours)`;
                total = Math.round(price*days*1.12 + 50000);
              } else {
                // night (property)
                rows = [
                  { l:`${fmt(price)} × ${nights} nuits`,v:fmt(price*nights) },
                  { l:"Frais de service Byer (12%)",    v:fmt(Math.round(price*nights*.12)) },
                  { l:"Taxes locales (5%)",              v:fmt(Math.round(price*nights*.05)) },
                ];
                totalLabel = `Total (${nights} nuits)`;
                total = Math.round(price*nights*1.17);
              }
              return (
                <>
                  {rows.map(row => (
                    <div key={row.l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0"}}>
                      <span style={{fontSize:13,color:C.mid}}>{row.l}</span>
                      <span style={{fontSize:13,color:C.dark,fontWeight:500}}>{row.v}</span>
                    </div>
                  ))}
                  <div style={{height:1,background:C.border,margin:"8px 0"}}/>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontSize:14,fontWeight:700,color:C.black}}>{totalLabel}</span>
                    <span style={{fontSize:14,fontWeight:700,color:C.black}}>{fmt(total)}</span>
                  </div>
                </>
              );
            })()}
          </div>
          <div style={{height:110}}/>
        </div>
      </div>

      <div style={S.dFooter}>
        <div>
          <span style={{fontSize:19,fontWeight:700,color:C.black}}>{fmt(price)}</span>
          <span style={{fontSize:12,color:C.light}}>{unit}</span>
        </div>
        <button style={S.reserveBtn} className="resBtn" onClick={()=>onBook(localDur)}>
          {localDur==="month" && item.type==="property" ? "Louer ce logement"
            : item.type==="vehicle" ? (localDur==="month"?"Louer au mois":localDur==="week"?"Louer à la semaine":"Réserver le véhicule")
            : "Réserver"}
        </button>
      </div>
    </div>
  );
}

/* ─── ALL REVIEWS SCREEN ─────────────────────────── */
function AllReviewsScreen({ item, onBack }) {
  const ratingData = RATINGS[item.id];
  const mockReviews = SAMPLE_REVIEWS[item.id] || [];
  const [sortBy, setSortBy] = useState("recent");

  // Charge les avis réels depuis Supabase si l'annonce est en BDD.
  // Sinon on garde les mocks pour la démo.
  const [dbReviews, setDbReviews] = useState([]);
  React.useEffect(() => {
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady || !item || !item._supabase) return;
    let cancelled = false;
    (async () => {
      const { data } = await db.reviews.listForListing(item.id);
      if (!cancelled && Array.isArray(data)) {
        setDbReviews(data.map(r => ({
          name:   r.profiles?.name || "Voyageur",
          date:   new Date(r.created_at).toLocaleDateString('fr-FR', {month:'long',year:'numeric'}),
          score:  Number(r.rating) || 5,
          text:   r.body || r.comment || "",
          avatar: r.profiles?.avatar_letter || (r.profiles?.name?.[0]?.toUpperCase() || "U"),
          bg:     r.profiles?.avatar_bg || "#FF5A5F",
        })));
      }
    })();
    return () => { cancelled = true; };
  }, [item?.id, item?._supabase]);

  // Source : Supabase si dispo, sinon mocks
  const allReviews = dbReviews.length > 0 ? dbReviews : mockReviews;

  // Génère plus d'avis fictifs en complément (réalisme) — uniquement pour les mocks
  const padded = (!item?._supabase && allReviews.length < 4) ? [
    ...allReviews,
    { name:"Adèle K.",  date:"Déc. 2024", score:4.7, text:"Excellent séjour, je recommande sans hésitation. Tout était conforme à la description.", avatar:"A", bg:"#EC4899" },
    { name:"Boris N.",  date:"Nov. 2024", score:4.8, text:"Hôte très accueillant et bien organisé. Endroit calme.", avatar:"B", bg:"#14B8A6" },
    { name:"Caroline P.",date:"Oct. 2024", score:5.0, text:"Parfait du début à la fin. Logement irréprochable.", avatar:"C", bg:"#F59E0B" },
  ].slice(0, 6) : allReviews;

  const sorted = [...padded].sort((a,b) => {
    if (sortBy === "best")  return b.score - a.score;
    if (sortBy === "worst") return a.score - b.score;
    return 0; // recent = ordre par défaut
  });

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={S.scroll}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"var(--top-pad) 16px 8px",borderBottom:`1px solid ${C.border}`,background:C.white,position:"sticky",top:0,zIndex:10}}>
          <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex"}}>
            <Icon name="back" size={22} color={C.dark} stroke={2}/>
          </button>
          <div style={{flex:1}}>
            <p style={{fontSize:16,fontWeight:700,color:C.black}}>Tous les avis</p>
            <p style={{fontSize:11,color:C.light}}>{item.title}</p>
          </div>
        </div>

        <div style={{padding:"16px"}}>
          {/* Score résumé */}
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18,padding:"14px 16px",background:C.bg,borderRadius:14}}>
            <div style={{textAlign:"center"}}>
              <p style={{fontSize:32,fontWeight:800,color:C.black,lineHeight:1}}>{item.rating.toFixed(1)}</p>
              <RatingStars score={item.rating} size={13}/>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:14,fontWeight:600,color:C.dark}}>{item.reviews} avis vérifiés</p>
              <p style={{fontSize:12,color:C.light,marginTop:2}}>
                {item.rating>=4.9?"Exceptionnel":item.rating>=4.7?"Très bien":"Bien"}
              </p>
            </div>
          </div>

          {/* Sort tabs */}
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            {[
              {id:"recent", label:"Plus récents"},
              {id:"best",   label:"Mieux notés"},
              {id:"worst",  label:"Moins bien notés"},
            ].map(opt => (
              <button key={opt.id}
                onClick={()=>setSortBy(opt.id)}
                style={{
                  padding:"7px 12px",borderRadius:18,fontSize:12,fontWeight:600,cursor:"pointer",
                  border:`1.5px solid ${sortBy===opt.id?C.coral:C.border}`,
                  background:sortBy===opt.id?"#FFF5F5":C.white,
                  color:sortBy===opt.id?C.coral:C.dark,
                  fontFamily:"'DM Sans',sans-serif",
                }}>{opt.label}</button>
            ))}
          </div>

          {/* Critères condensés */}
          {ratingData && (
            <div style={{padding:"12px 14px",background:C.bg,borderRadius:12,marginBottom:18}}>
              <p style={{fontSize:12,fontWeight:700,color:C.dark,marginBottom:8}}>Notes par critère</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 14px"}}>
                {RATING_CRITERIA.map(c => {
                  const sc = ratingData[c.key];
                  if (sc == null) return null;
                  return (
                    <div key={c.key} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.mid}}>
                      <span>{c.icon} {c.label}</span>
                      <span style={{fontWeight:700,color:C.dark}}>{sc.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Liste complète */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {sorted.map((rev,i) => (
              <div key={i} style={S.reviewCard}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <FaceAvatar photo={rev.photo} avatar={rev.avatar} bg={rev.bg} size={40}/>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,fontWeight:600,color:C.black}}>{rev.name}</p>
                    <p style={{fontSize:11,color:C.light}}>{rev.date}</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:4,background:"#FFF5F5",borderRadius:10,padding:"3px 8px"}}>
                    <Icon name="star" size={11} color={C.coral}/>
                    <span style={{fontSize:12,fontWeight:700,color:C.coral}}>{rev.score.toFixed(1)}</span>
                  </div>
                </div>
                <p style={{fontSize:13,color:C.mid,lineHeight:1.65}}>{rev.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
