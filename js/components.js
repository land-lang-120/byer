/* Byer — Shared Components */

/* ─── ICONS ─────────────────────────────────────── */
const Icon = ({ name, size=22, color=C.mid, stroke=1.8 }) => {
  const p = { width:size, height:size, fill:"none", stroke:color, strokeWidth:stroke, strokeLinecap:"round", strokeLinejoin:"round", viewBox:"0 0 24 24", style:{display:"block",flexShrink:0} };
  const icons = {
    home:    <svg {...p}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
    car:     <svg {...p}><rect x="1" y="9" width="22" height="10" rx="2"/><path d="M16 9V7a2 2 0 00-2-2H10a2 2 0 00-2 2v2"/><circle cx="7" cy="19" r="2" fill={color} stroke={color}/><circle cx="17" cy="19" r="2" fill={color} stroke={color}/></svg>,
    search:  <svg {...p}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    heart:   <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    heartF:  <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill={color} stroke={color}/></svg>,
    pin:     <svg {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    trips:   <svg {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    message: <svg {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    user:    <svg {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    star:    <svg {...p} fill={color} stroke={color} strokeWidth="0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    back:    <svg {...p}><polyline points="15 18 9 12 15 6"/></svg>,
    share:   <svg {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    filter:  <svg {...p}><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>,
    check:   <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    bed:     <svg {...p}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>,
    person:  <svg {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    fuel:    <svg {...p}><path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16"/><path d="M3 10h12"/><path d="M17 8h1a2 2 0 012 2v6a1 1 0 002 0v-4a1 1 0 00-1-1h-2"/></svg>,
    gear:    <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    chevron: <svg {...p}><polyline points="9 18 15 12 9 6"/></svg>,
    grid:    <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    close:   <svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    // Property type icons
    villa:   <svg {...p}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/><rect x="10" y="3" width="4" height="4" fill={color} stroke="none" rx="1"/></svg>,
    studio:  <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>,
    hotel:   <svg {...p}><path d="M3 22V6a1 1 0 011-1h16a1 1 0 011 1v16"/><path d="M2 22h20"/><rect x="7" y="10" width="4" height="4"/><rect x="13" y="10" width="4" height="4"/><rect x="10" y="16" width="4" height="6"/></svg>,
    motel:   <svg {...p}><path d="M3 22V8l9-5 9 5v14"/><path d="M3 12h18"/><rect x="8" y="14" width="3" height="4"/><rect x="13" y="14" width="3" height="4"/></svg>,
    auberge: <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/><circle cx="12" cy="8" r="2" fill={color} stroke="none"/></svg>,
  };
  return icons[name] || null;
};

/* ─── BYER PIN ─────────────────────────────────────── */
function ByerPin({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:"block",flexShrink:0}}>
      <path
        d="M12 22C12 22 4.5 15 4.5 9.5C4.5 5.4 7.9 2 12 2C16.1 2 19.5 5.4 19.5 9.5C19.5 15 12 22 12 22Z"
        fill={C.coral}
      />
      <circle cx="12" cy="9.5" r="2.8" fill={C.white}/>
    </svg>
  );
}

/* ─── FACE AVATAR ───────────────────────────────────── */
function FaceAvatar({ photo, avatar, bg, size=46, radius, blocked=false }) {
  const r = radius ?? size/2;
  const [err, setErr] = useState(false);
  if (blocked) return (
    <div style={{width:size,height:size,borderRadius:r,background:C.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <svg width={size*.4} height={size*.4} fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    </div>
  );
  if (photo && !err) return (
    <img
      src={photo} alt={avatar}
      onError={()=>setErr(true)}
      style={{width:size,height:size,borderRadius:r,objectFit:"cover",flexShrink:0,display:"block"}}
    />
  );
  return (
    <div style={{width:size,height:size,borderRadius:r,background:bg||C.mid,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontSize:size*.38,fontWeight:700,color:"white",lineHeight:1}}>{avatar}</span>
    </div>
  );
}

/* ─── RATING STARS ──────────────────────────────── */
function RatingStars({ score, size=14 }) {
  return (
    <div style={{display:"flex",gap:2,alignItems:"center"}}>
      {[1,2,3,4,5].map(i => {
        const fill = Math.min(1, Math.max(0, score - (i-1)));
        return (
          <div key={i} style={{position:"relative",width:size,height:size}}>
            <svg width={size} height={size} viewBox="0 0 24 24" fill="#E5E7EB" style={{position:"absolute"}}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <svg width={size} height={size} viewBox="0 0 24 24" style={{position:"absolute",clipPath:`inset(0 ${(1-fill)*100}% 0 0)`}}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={C.coral}/>
            </svg>
          </div>
        );
      })}
    </div>
  );
}

/* ─── RATING BREAKDOWN ──────────────────────────── */
function RatingBreakdown({ itemId, globalRating, reviews, onReview }) {
  const ratingData = RATINGS[itemId];
  const revList    = SAMPLE_REVIEWS[itemId] || [];
  const [showAll, setShowAll] = useState(false);
  if (!ratingData) return null;

  const topKey      = Object.entries(ratingData).sort((a,b)=>b[1]-a[1])[0];
  const topCriteria = RATING_CRITERIA.find(c=>c.key===topKey[0]);

  return (
    <div>
      {/* Global score hero */}
      <div style={S.ratingHero}>
        <div style={S.ratingScore}>
          <span style={S.ratingScoreNum}>{globalRating.toFixed(1)}</span>
          <RatingStars score={globalRating} size={18}/>
        </div>
        <div style={S.ratingMeta}>
          <p style={{fontSize:13,fontWeight:600,color:C.black}}>Note globale</p>
          <p style={{fontSize:12,color:C.light}}>Basée sur {reviews} avis vérifiés</p>
          <span style={{...S.ratingLabel,
            background: globalRating>=4.9?"#F0FDF4":globalRating>=4.7?"#EFF6FF":"#FFF7ED",
            color:      globalRating>=4.9?"#16A34A":globalRating>=4.7?"#2563EB":"#EA580C"
          }}>
            {globalRating>=4.9?"Exceptionnel":globalRating>=4.7?"Très bien":globalRating>=4.5?"Bien":"Correct"}
          </span>
        </div>
      </div>

      {/* Point fort mis en avant */}
      {topCriteria && (
        <div style={S.topCriteriaChip}>
          <span style={{fontSize:16}}>{topCriteria.icon}</span>
          <div>
            <p style={{fontSize:12,fontWeight:700,color:C.coral}}>Point fort · {topCriteria.label}</p>
            <p style={{fontSize:11,color:C.mid}}>Noté {topKey[1].toFixed(1)} / 5 par les locataires</p>
          </div>
        </div>
      )}

      {/* Critères en barres */}
      <div style={{...S.criteriaGrid, marginTop:14}}>
        {RATING_CRITERIA.map(c => {
          const score = ratingData[c.key];
          if (score == null) return null;
          const pct   = (score / 5) * 100;
          return (
            <div key={c.key} style={S.criteriaRow}>
              <div style={S.criteriaLeft}>
                <span style={{fontSize:15}}>{c.icon}</span>
                <span style={S.criteriaLabel}>{c.label}</span>
              </div>
              <div style={S.criteriaRight}>
                <div style={S.progressTrack}>
                  <div style={{...S.progressFill,
                    width:`${pct}%`,
                    background: score>=4.8?C.coral:score>=4.5?"#F59E0B":"#9CA3AF"
                  }}/>
                </div>
                <span style={S.criteriaScore}>{score.toFixed(1)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Avis utilisateurs */}
      {revList.length > 0 && (
        <div style={{marginTop:20}}>
          <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:12}}>Ce que disent les locataires</p>
          {(showAll ? revList : revList.slice(0,2)).map((rev,i) => (
            <div key={i} style={S.reviewCard}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <FaceAvatar photo={rev.photo} avatar={rev.avatar} bg={rev.bg} size={36}/>
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
          {revList.length > 2 && (
            <button
              style={{background:"none",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 0",width:"100%",fontSize:13,fontWeight:600,color:C.dark,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:8}}
              onClick={()=>setShowAll(v=>!v)}
            >
              {showAll ? "Afficher moins ↑" : `Voir les ${revList.length} avis →`}
            </button>
          )}
        </div>
      )}

      {/* CTA laisser un avis */}
      <button style={S.leaveReviewBtn} onClick={onReview}>
        <Icon name="star" size={15} color={C.coral}/>
        <span>Donner mon avis</span>
      </button>
    </div>
  );
}

/* ─── REVIEW SHEET ──────────────────────────────── */
function ReviewSheet({ item, onClose, onSubmit }) {
  const init = Object.fromEntries(RATING_CRITERIA.map(c=>[c.key, 4]));
  const [scores, setScores] = useState(init);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const avg = (Object.values(scores).reduce((s,v)=>s+v,0) / RATING_CRITERIA.length).toFixed(1);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { onSubmit?.(); onClose(); }, 2000);
  };

  return (
    <>
      <div style={{...S.sheetBackdrop,zIndex:300}} onClick={onClose}/>
      <div style={{...S.sheet,zIndex:301,maxHeight:"90vh"}} className="sheet">
        <div style={S.sheetHandle}/>

        {submitted ? (
          <div style={{padding:"32px 24px 48px",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
            <div style={S.successCircle}><svg width="32" height="32" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
            <p style={{fontSize:18,fontWeight:800,color:C.black,textAlign:"center"}}>Avis publié !</p>
            <p style={{fontSize:13,color:C.mid,textAlign:"center"}}>Merci pour votre retour sur <strong>{item.title}</strong>.</p>
          </div>
        ) : (
          <>
            <div style={S.sheetHeader}>
              <p style={S.sheetTitle}>Votre avis</p>
              <button style={S.sheetClose} onClick={onClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{padding:"0 20px",overflowY:"auto",flex:1}}>
              {/* Property pill */}
              <div style={{display:"flex",alignItems:"center",gap:8,background:C.bg,borderRadius:12,padding:"8px 12px",marginBottom:18}}>
                <ByerPin size={14}/>
                <p style={{fontSize:12,fontWeight:600,color:C.dark}}>{item.title}</p>
              </div>

              {/* Note globale calculée */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                <p style={{fontSize:13,fontWeight:600,color:C.dark}}>Votre note globale</p>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <RatingStars score={parseFloat(avg)} size={16}/>
                  <span style={{fontSize:18,fontWeight:800,color:C.coral}}>{avg}</span>
                </div>
              </div>

              {/* Critères — étoiles + légende */}
              {RATING_CRITERIA.map(c => (
                <div key={c.key} style={{marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <p style={{fontSize:13,fontWeight:600,color:C.dark}}>
                      {c.icon}&nbsp;{c.label}
                    </p>
                    <span style={{
                      fontSize:11,fontWeight:700,
                      color:scores[c.key]>=5?"#16A34A":scores[c.key]>=4?C.coral:scores[c.key]>=3?"#F59E0B":"#9CA3AF",
                      background:scores[c.key]>=5?"#F0FDF4":scores[c.key]>=4?"#FFF5F5":scores[c.key]>=3?"#FFFBEB":C.bg,
                      padding:"2px 9px",borderRadius:20,transition:"all .18s",
                    }}>
                      {STAR_LABELS[scores[c.key]]}
                    </span>
                  </div>

                  <div style={{display:"flex",gap:5}}>
                    {[1,2,3,4,5].map(v=>(
                      <button
                        key={v}
                        onClick={()=>setScores(p=>({...p,[c.key]:v}))}
                        style={{
                          flex:1, height:40, borderRadius:10, border:"none", cursor:"pointer",
                          background: scores[c.key]>=v ? C.coral : C.bg,
                          transition:"all .18s", display:"flex",
                          alignItems:"center", justifyContent:"center",
                          boxShadow: scores[c.key]===v ? `0 2px 8px ${C.coral}44` : "none",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24"
                          fill={scores[c.key]>=v?"white":"#D1D5DB"}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      </button>
                    ))}
                  </div>

                  <div style={{display:"flex",marginTop:4}}>
                    {[1,2,3,4,5].map(v=>(
                      <span key={v} style={{
                        flex:1, textAlign:"center",
                        fontSize:9,
                        fontWeight: scores[c.key]===v ? 700 : 400,
                        color: scores[c.key]===v ? C.coral : "#C4C4C4",
                        transition:"all .18s",
                        lineHeight:1.3,
                      }}>
                        {STAR_LABELS[v]}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {/* Commentaire libre */}
              <div style={{marginBottom:24}}>
                <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:8}}>Commentaire (optionnel)</p>
                <textarea
                  style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:14,padding:"12px 14px",fontSize:14,color:C.dark,fontFamily:"'DM Sans',sans-serif",resize:"none",outline:"none",lineHeight:1.6,background:C.white}}
                  rows={3}
                  placeholder="Décrivez votre expérience…"
                  value={comment}
                  onChange={e=>setComment(e.target.value)}
                />
              </div>

              <button style={{...S.payBtn,marginBottom:8}} onClick={handleSubmit}>
                Publier mon avis
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ─── EMPTY STATE ──────────────────────────────── */
function EmptyState({ icon, text }) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:260,padding:24,gap:12}}>
      <Icon name={icon} size={44} color={C.border} stroke={1.5}/>
      {text && <p style={{fontSize:13,color:C.light,textAlign:"center",maxWidth:240,lineHeight:1.6}}>{text}</p>}
    </div>
  );
}

/* ─── DIVIDER ──────────────────────────────────── */
function Divider() { return <div style={{height:1,background:C.border,margin:"18px 0"}}/>; }
