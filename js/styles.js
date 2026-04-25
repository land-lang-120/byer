/* Byer — Styles */

/* SignupFieldIcon defined in auth.js — removed duplicate here to avoid Babel "already declared" error */

/* ─── AUTH CSS ───────────────────────────────────── */
const AUTH_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  body,input,button,textarea{font-family:'DM Sans',-apple-system,sans-serif;}
  ::-webkit-scrollbar{display:none;}
  @keyframes spin{to{transform:rotate(360deg)}}
`;

/* ─── ONBOARDING STYLES ──────────────────────────── */
const Os = {
  root:       { display:"flex", flexDirection:"column", height:"100vh", width:"100%", background:C.white, overflow:"hidden" },
  authHero:   { background:C.coral, padding:"var(--top-pad) 28px 32px", position:"relative", overflow:"hidden" },
  authLogoWrap:{ display:"flex", alignItems:"center", gap:10, marginBottom:20 },
  authLogoTxt:{ fontSize:28, fontWeight:800, color:"white", letterSpacing:-1, fontFamily:"'DM Sans',sans-serif" },
  authTitle:  { fontSize:28, fontWeight:800, color:"white", marginBottom:6, fontFamily:"'DM Sans',sans-serif" },
  authSub:    { fontSize:14, color:"rgba(255,255,255,.8)", fontFamily:"'DM Sans',sans-serif" },
  authCard:   { flex:1, overflowY:"auto", background:C.white, borderRadius:"24px 24px 0 0", marginTop:-16, padding:"28px 24px 40px" },
  socialBtn:  { flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px", borderRadius:14, border:`1.5px solid ${C.border}`, background:C.white, cursor:"pointer" },
  dividerRow: { display:"flex", alignItems:"center", gap:10, margin:"16px 0" },
  dividerLine:{ flex:1, height:1, background:C.border },
  dividerTxt: { fontSize:12, color:C.light, whiteSpace:"nowrap" },
  fieldLabel: { display:"block", fontSize:12, fontWeight:600, color:C.dark, marginBottom:7, textTransform:"uppercase", letterSpacing:.5 },
  fieldWrap:  { display:"flex", alignItems:"center", gap:10, background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"12px 14px", transition:"border .15s" },
  fieldInput: { flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, color:C.dark, fontFamily:"'DM Sans',sans-serif" },
  ctaBtn:     { width:"100%", background:C.coral, color:"white", border:"none", borderRadius:16, padding:"16px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", transition:"opacity .18s" },
  spinner:    { width:20, height:20, borderRadius:10, border:"2.5px solid rgba(255,255,255,.3)", borderTopColor:"white", animation:"spin .7s linear infinite" },
  roleCard:   { width:"100%", background:C.white, border:`1.5px solid ${C.border}`, borderRadius:18, padding:"18px", cursor:"pointer", marginBottom:14, textAlign:"left", transition:"all .18s" },
  roleCardOn: { border:`1.5px solid ${C.coral}`, background:"#FFF8F8" },

  // Email / phone toggle
  methodToggle:{ display:"flex", background:C.bg, borderRadius:12, padding:3, gap:3, marginBottom:18 },
  methodBtn:   { flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px 0", borderRadius:9, border:"none", cursor:"pointer", background:"none", transition:"all .18s" },
  methodBtnOn: { background:C.white, boxShadow:"0 1px 6px rgba(0,0,0,.1)" },
};

/* ─── STYLES ────────────────────────────────────── */
const S = {
  shell:    {display:"flex",flexDirection:"column",height:"100vh",width:"100%",background:C.bg,overflow:"hidden",position:"relative"},
  scroll:   {flex:1,overflowY:"auto",overflowX:"hidden",paddingBottom:80},
  /* Nav bar : position FIXED pour rester visible sur TOUS les écrans
     (y compris les écrans secondaires qui replacent le Shell : Publish,
     Settings, Dashboard, BuildingDetail, ListAll…). z-index élevé pour
     passer au-dessus du contenu. Les écrans doivent garder ~80px de
     paddingBottom (déjà appliqué via S.scroll). */
  nav:      {display:"flex",background:C.white,borderTop:`1px solid ${C.border}`,padding:"8px 0 18px",flexShrink:0,position:"fixed",bottom:0,left:0,right:0,zIndex:200,boxShadow:"0 -2px 8px rgba(0,0,0,0.04)"},
  navBtn:   {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",padding:"4px 0"},
  navLabel: {fontSize:10,fontWeight:500},

  stickyTop:{background:C.white,padding:"var(--top-pad) 20px 0",borderBottom:`1px solid ${C.border}`},
  logoRow:  {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24},
  logoMark: {display:"flex",alignItems:"center",gap:7},
  logoTxt:  {fontSize:24,fontWeight:800,color:C.coral,letterSpacing:-1},
  bellBtn:  {position:"relative",width:38,height:38,borderRadius:19,background:C.bg,border:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0},
  greeting: {fontSize:18,fontWeight:700,color:C.black,marginBottom:12},

  // Search row with duration toggle
  searchRow:{display:"flex",alignItems:"center",gap:8,marginBottom:14},
  searchWrap:{flex:1,display:"flex",alignItems:"center",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"10px 12px",gap:8},
  searchIn: {flex:1,border:"none",outline:"none",background:"transparent",fontSize:14,color:C.dark,minWidth:0},
  clearBtn: {background:"none",border:"none",cursor:"pointer",color:C.light,fontSize:14},
  filterIconBtn:{background:"none",border:"none",cursor:"pointer",display:"flex",padding:2},

  // Duration toggle
  durToggle:{display:"flex",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:12,padding:2,flexShrink:0},
  durBtn:   {background:"none",border:"none",borderRadius:9,padding:"7px 9px",fontSize:11.5,fontWeight:600,color:C.mid,cursor:"pointer",transition:"all .18s",whiteSpace:"nowrap"},
  durBtnOn: {background:C.white,color:C.coral,boxShadow:"0 1px 4px rgba(0,0,0,.1)"},

  // Duration banner
  durBanner:{display:"flex",alignItems:"flex-start",gap:8,background:"#FFF8F8",border:`1px solid #FFD6D7`,borderRadius:12,padding:"10px 14px",margin:"0 16px 12px"},

  segments: {display:"flex"},
  seg:      {flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"none",border:"none",cursor:"pointer",padding:"12px 0",borderBottom:"2px solid transparent",transition:"all .18s"},
  segOn:    {borderBottom:`2px solid ${C.coral}`},
  segTxt:   {fontSize:14,fontWeight:600,color:C.mid},

  // Property type chips
  typeRow:  {display:"flex",gap:6,padding:"10px 20px",overflowX:"auto",background:C.white,borderBottom:`1px solid ${C.border}`},
  typeChip: {flexShrink:0,display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:20,border:`1.5px solid ${C.border}`,background:C.white,cursor:"pointer",transition:"all .18s"},
  typeChipOn:{border:`1.5px solid ${C.coral}`,background:"#FFF5F5"},
  typeLabel:{fontSize:12,fontWeight:600,color:C.mid},

  pillRow:  {display:"flex",gap:8,padding:"10px 20px",overflowX:"auto"},
  pill:     {flexShrink:0,padding:"6px 16px",borderRadius:20,border:`1.5px solid ${C.border}`,background:C.white,fontSize:13,fontWeight:500,color:C.mid,cursor:"pointer"},
  pillOn:   {background:C.black,color:C.white,border:`1.5px solid ${C.black}`},
  secTitle: {fontSize:17,fontWeight:700,color:C.black,marginBottom:14},

  feedStack:{display:"flex",flexDirection:"column",gap:20},
  bigCard:  {background:C.white,borderRadius:20,overflow:"hidden",boxShadow:"0 2px 16px rgba(0,0,0,.07)",cursor:"pointer"},
  bigImgWrap:{position:"relative",height:230,overflow:"hidden"},
  bigImg:   {width:"100%",height:"100%",objectFit:"cover"},
  bigGrad:  {position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.45) 0%,transparent 55%)"},
  arrowBtn: {position:"absolute",top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.38)",border:"none",borderRadius:50,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:2},
  dotsRow:  {position:"absolute",bottom:44,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:2},
  dot:      {width:5,height:5,borderRadius:3,background:"rgba(255,255,255,.45)",transition:"all .2s"},
  dotOn:    {width:14,background:"white"},
  superBadge:{position:"absolute",top:12,left:12,background:"white",borderRadius:8,padding:"3px 9px",fontSize:11,fontWeight:700,color:C.black,zIndex:2},
  heartBtn: {position:"absolute",top:12,right:12,background:"rgba(0,0,0,.28)",border:"none",borderRadius:50,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:2},
  galleryBtn:{position:"absolute",bottom:10,right:12,display:"flex",alignItems:"center",gap:5,background:"rgba(0,0,0,.45)",border:"none",borderRadius:20,padding:"5px 11px",cursor:"pointer",zIndex:2},
  bigInfo:  {padding:"14px 16px 16px"},
  bigCity:  {display:"flex",alignItems:"center",fontSize:11,color:C.light},
  bigTitle: {fontSize:16,fontWeight:700,color:C.black,lineHeight:1.25,marginBottom:4},
  bigMeta:  {fontSize:12,color:C.light},
  ratingPill:{display:"flex",alignItems:"center",background:C.bg,borderRadius:9,padding:"4px 8px",flexShrink:0,height:"fit-content"},
  tagsRow:  {display:"flex",gap:6,marginTop:10,marginBottom:12,flexWrap:"wrap"},
  tag:      {background:C.bg,color:C.dark,fontSize:11,fontWeight:500,padding:"4px 10px",borderRadius:20,border:`1px solid ${C.border}`},
  bigBottom:{display:"flex",alignItems:"flex-end",justifyContent:"space-between"},
  bigPrice: {fontSize:16,fontWeight:800,color:C.black},
  bigNight: {fontSize:12,color:C.light},
  detailBtn:{background:C.black,color:C.white,border:"none",borderRadius:12,padding:"9px 16px",fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0},

  // Gallery
  galRoot:  {display:"flex",flexDirection:"column",height:"100vh",width:"100%",background:C.black,overflow:"hidden"},
  galHeader:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"var(--top-pad) 16px 14px",background:C.white,flexShrink:0},
  galBack:  {background:"none",border:"none",cursor:"pointer",padding:6,borderRadius:8,display:"flex"},
  galDetailBtn:{background:C.coral,color:C.white,border:"none",borderRadius:10,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer"},
  galMain:  {flex:1,position:"relative",overflow:"hidden",minHeight:0},
  galImg:   {width:"100%",height:"100%",objectFit:"contain"},
  galLabel: {position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,.55)",color:"white",fontSize:12,fontWeight:600,padding:"5px 14px",borderRadius:20,whiteSpace:"nowrap"},
  galArrow: {position:"absolute",top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,.18)",border:"none",borderRadius:50,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"},
  thumbStrip:{display:"flex",gap:6,padding:"10px 14px",background:C.black,overflowX:"auto",flexShrink:0},
  thumb:    {flexShrink:0,width:56,height:56,borderRadius:8,overflow:"hidden",border:"2px solid transparent",cursor:"pointer",position:"relative"},
  thumbOn:  {border:`2px solid ${C.coral}`},
  thumbActiveOverlay:{position:"absolute",inset:0,background:"rgba(255,90,95,.12)"},
  labelsStrip:{display:"flex",gap:6,padding:"0 14px 20px",background:C.black,overflowX:"auto",flexShrink:0},
  labelChip:{flexShrink:0,background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.6)",border:"1px solid rgba(255,255,255,.15)",borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:500,cursor:"pointer"},
  labelChipOn:{background:C.coral,color:C.white,border:`1px solid ${C.coral}`},

  // Detail
  dScroll:  {flex:1,overflowY:"auto"},
  dCard:    {background:C.white,padding:"22px 20px 20px"},
  dBack:    {position:"absolute",top:52,left:16,background:"rgba(0,0,0,.3)",border:"none",borderRadius:50,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"},
  dAction:  {background:"rgba(0,0,0,.3)",border:"none",borderRadius:50,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"},
  heroGalleryBtn:{position:"absolute",bottom:12,right:14,display:"flex",alignItems:"center",gap:5,background:"rgba(0,0,0,.45)",border:"none",borderRadius:20,padding:"6px 12px",cursor:"pointer"},
  thumbPreviewRow:{display:"flex",gap:6,padding:"10px 16px",background:C.white,overflowX:"auto",borderBottom:`1px solid ${C.border}`},
  thumbPreview:{flexShrink:0,position:"relative",width:80,height:58,borderRadius:10,overflow:"hidden",border:"none",cursor:"pointer"},
  thumbPreviewLabel:{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,.5)",color:"white",fontSize:9,fontWeight:600,padding:"3px 5px",textAlign:"center"},
  detailDurRow:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,background:C.bg,borderRadius:14,padding:"12px 14px"},
  dFooter:  {background:C.white,borderTop:`1px solid ${C.border}`,padding:"14px 20px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0},
  reserveBtn:{background:C.coral,color:C.white,border:"none",borderRadius:14,padding:"14px 28px",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},

  pageHead: {padding:"var(--top-pad) 20px 12px",background:C.white,borderBottom:`1px solid ${C.border}`,marginBottom:4},
  pageTitle:{fontSize:22,fontWeight:700,color:C.black},

  // Trips screen
  tripsTabs:     {display:"flex",gap:0,padding:"0 16px",background:C.white,borderBottom:`1px solid ${C.border}`,overflowX:"auto"},
  tripsTab:      {flexShrink:0,padding:"12px 14px",background:"none",border:"none",borderBottom:"2px solid transparent",fontSize:13,fontWeight:600,color:C.light,cursor:"pointer",transition:"all .18s"},
  tripsTabOn:    {borderBottom:`2px solid ${C.coral}`,color:C.coral},
  tripsDatesRow: {display:"flex",alignItems:"center",gap:8,marginBottom:0},
  tripsDatesCol: {flex:1,display:"flex",flexDirection:"column",gap:2},
  tripsDatesLabel:{fontSize:9,fontWeight:700,color:C.light,textTransform:"uppercase",letterSpacing:.6},
  tripsDatesVal: {fontSize:14,fontWeight:700,color:C.black},
  tripsArrow:    {display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0},
  tripsActions:  {display:"flex",gap:8,padding:"0 14px 14px"},
  mapsBtn:       {flex:2,display:"flex",alignItems:"center",gap:8,background:"#EAF3FB",border:"1.5px solid #BFDBFE",borderRadius:12,padding:"11px 13px",cursor:"pointer",fontSize:13,fontWeight:700,color:"#1D4ED8",fontFamily:"'DM Sans',sans-serif"},
  tripsSecBtn:   {flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"11px 10px",cursor:"pointer",fontSize:12,fontWeight:600,color:C.dark,fontFamily:"'DM Sans',sans-serif"},

  // Profile rent CTA
  rentCta:    {display:"flex",alignItems:"center",justifyContent:"space-between",margin:"0 16px 8px",background:C.white,borderRadius:16,padding:"16px",border:`1.5px solid ${C.border}`,cursor:"pointer",width:"calc(100% - 32px)",boxShadow:"0 2px 10px rgba(255,90,95,.08)",textAlign:"left"},
  rentCtaLeft:{display:"flex",alignItems:"center",gap:12},
  rentCtaIcon:{width:44,height:44,borderRadius:13,background:"#FFF5F5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  urgentBadge:{background:C.coral,color:C.white,fontSize:11,fontWeight:700,width:20,height:20,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"},

  // Rent screen
  rentHeader: {background:C.white,borderBottom:`1px solid ${C.border}`,padding:"var(--top-pad) 20px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0},
  dBack2:     {background:"none",border:"none",cursor:"pointer",padding:6,borderRadius:8,display:"flex",alignItems:"center"},
  rentRoleWrap:{display:"flex",background:C.bg,borderRadius:14,margin:"16px 16px 0",padding:4,gap:4},
  roleBtn:    {flex:1,padding:"10px 8px",borderRadius:10,border:"none",fontSize:13,fontWeight:600,color:C.mid,cursor:"pointer",background:"none",transition:"all .18s"},
  roleBtnOn:  {background:C.white,color:C.coral,boxShadow:"0 2px 8px rgba(0,0,0,.08)"},

  rentSummary:{display:"flex",background:C.white,margin:"12px 16px 0",borderRadius:16,padding:"16px",boxShadow:"0 1px 8px rgba(0,0,0,.05)"},
  summaryCol: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3},
  summaryVal: {fontSize:16,fontWeight:800,color:C.black},
  summaryLabel:{fontSize:10,color:C.light,fontWeight:500,textAlign:"center"},
  summaryDivider:{width:1,background:C.border,margin:"0 4px"},

  rentTabs:   {display:"flex",gap:0,padding:"12px 16px 0"},
  rentTab:    {flex:1,padding:"10px 0",background:"none",border:"none",borderBottom:"2px solid transparent",fontSize:13,fontWeight:600,color:C.light,cursor:"pointer",transition:"all .18s"},
  rentTabOn:  {borderBottom:`2px solid ${C.coral}`,color:C.coral},

  loyerCard:  {background:C.white,borderRadius:16,padding:"14px 14px 14px 16px",boxShadow:"0 1px 8px rgba(0,0,0,.05)"},
  statutBadge:{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:20,flexShrink:0},
  payBtn:     {width:"100%",background:C.coral,color:C.white,border:"none",borderRadius:12,padding:"13px",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .18s"},
  paidConfirm:{display:"flex",alignItems:"center",gap:6,justifyContent:"center",padding:"10px",background:"#F0FDF4",borderRadius:10},
  reminderBtn:{width:"100%",background:C.bg,color:C.dark,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"11px",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  reminderBtnSent:{background:"#F0FDF4",color:"#16A34A",border:"1.5px solid #BBF7D0"},

  histCard:   {background:C.white,borderRadius:16,padding:"14px",boxShadow:"0 1px 6px rgba(0,0,0,.04)"},
  proofBox:   {display:"flex",alignItems:"center",gap:10,background:C.bg,borderRadius:10,padding:"8px 10px",marginTop:10},
  proofIcon:  {width:28,height:28,borderRadius:8,background:"#FFF5F5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},

  autoRappelCard:{background:C.white,borderRadius:16,padding:"16px",boxShadow:"0 1px 8px rgba(0,0,0,.05)"},
  rappelCard: {background:C.white,borderRadius:14,padding:"14px",boxShadow:"0 1px 6px rgba(0,0,0,.04)"},
  rappelDot:  {width:10,height:10,borderRadius:5,flexShrink:0},

  // Bailleur notification buttons (post-échéance uniquement)
  autoMsgBox: {display:"flex",alignItems:"flex-start",gap:8,background:"#FAFAFA",border:`1px dashed ${C.border}`,borderRadius:10,padding:"10px 12px"},
  notifBtn:   {display:"flex",alignItems:"center",justifyContent:"center",gap:7,width:"100%",background:"#FFF5F5",color:C.coral,border:`1.5px solid #FFD6D7`,borderRadius:12,padding:"11px",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  notifBtnRed:{display:"flex",alignItems:"center",justifyContent:"center",gap:7,width:"100%",background:"#FEF2F2",color:"#EF4444",border:"1.5px solid #FECACA",borderRadius:12,padding:"11px",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  notifBtnDone:{background:"#F0FDF4",color:"#16A34A",border:"1.5px solid #BBF7D0",cursor:"default"},

  // Payment sheet
  payAmountBox:{background:C.bg,borderRadius:14,padding:"14px 16px"},
  methodBtn:  {display:"flex",alignItems:"center",gap:12,padding:"14px",background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,cursor:"pointer",width:"100%",textAlign:"left"},
  methodLogo: {width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  phoneInput: {display:"flex",alignItems:"center",gap:10,background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"12px 14px"},
  successCircle:{width:72,height:72,borderRadius:36,background:"#16A34A",display:"flex",alignItems:"center",justifyContent:"center"},

  // Availability
  unavailBadge:{position:"absolute",bottom:44,left:12,display:"flex",alignItems:"center",gap:5,background:"rgba(239,68,68,.85)",borderRadius:20,padding:"5px 10px",zIndex:2,backdropFilter:"blur(4px)"},
  unavailDetail:{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:14,padding:"12px 14px",marginBottom:0},
  availDetail:  {display:"flex",alignItems:"center",gap:8,padding:"4px 0"},
  hostRow:      {display:"flex",alignItems:"center",gap:12,background:"none",border:"none",padding:"0"},

  // Filter active dot
  filterActiveDot:{position:"absolute",top:0,right:0,width:8,height:8,borderRadius:4,background:C.coral,border:`1.5px solid white`},
  filterIconBtn:  {background:"none",border:"none",cursor:"pointer",display:"flex",padding:2,position:"relative"},

  // Rating breakdown
  ratingHero:       {display:"flex",alignItems:"center",gap:16,background:C.bg,borderRadius:16,padding:"14px 16px",marginBottom:14},
  ratingScore:      {display:"flex",flexDirection:"column",alignItems:"center",gap:6},
  ratingScoreNum:   {fontSize:36,fontWeight:800,color:C.black,lineHeight:1},
  ratingMeta:       {flex:1,display:"flex",flexDirection:"column",gap:5},
  ratingLabel:      {fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,alignSelf:"flex-start"},
  topCriteriaChip:  {display:"flex",alignItems:"center",gap:10,background:"#FFF5F5",border:`1px solid ${C.coral}22`,borderRadius:12,padding:"10px 14px"},
  criteriaGrid:     {display:"flex",flexDirection:"column",gap:10},
  criteriaRow:      {display:"flex",alignItems:"center",gap:12},
  criteriaLeft:     {display:"flex",alignItems:"center",gap:7,width:155,flexShrink:0},
  criteriaLabel:    {fontSize:12,fontWeight:500,color:C.dark},
  criteriaRight:    {display:"flex",alignItems:"center",gap:8,flex:1},
  progressTrack:    {flex:1,height:6,borderRadius:3,background:C.border,overflow:"hidden"},
  progressFill:     {height:"100%",borderRadius:3,transition:"width .4s ease"},
  criteriaScore:    {fontSize:12,fontWeight:700,color:C.dark,width:26,textAlign:"right",flexShrink:0},
  reviewCard:       {background:C.bg,borderRadius:14,padding:"14px",marginBottom:10},
  leaveReviewBtn:   {display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",background:"#FFF5F5",border:`1.5px solid ${C.coral}44`,borderRadius:12,padding:"12px",marginTop:14,cursor:"pointer",fontSize:13,fontWeight:600,color:C.coral,fontFamily:"'DM Sans',sans-serif"},
  locPill:  {display:"flex",alignItems:"center",gap:6,background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"6px 10px 6px 8px",cursor:"pointer",transition:"all .18s",flexShrink:0},
  locTexts: {display:"flex",flexDirection:"column",alignItems:"flex-start",lineHeight:1.2},
  locSub:   {fontSize:9,fontWeight:500,color:C.light,textTransform:"uppercase",letterSpacing:.5},
  locLabel: {fontSize:13,fontWeight:700,color:C.black},

  // Location bottom sheet
  sheetBackdrop:{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:200},
  sheet:        {position:"fixed",bottom:0,left:0,right:0,width:"100%",background:C.white,borderRadius:"22px 22px 0 0",zIndex:201,paddingBottom:32,maxHeight:"80vh",display:"flex",flexDirection:"column"},
  sheetHandle:  {width:36,height:4,borderRadius:2,background:C.border,margin:"12px auto 4px"},
  sheetHeader:  {display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 20px 12px"},
  sheetTitle:   {fontSize:17,fontWeight:700,color:C.black},
  sheetClose:   {background:"none",border:"none",cursor:"pointer",padding:4,borderRadius:8,display:"flex"},
  sheetSearch:  {display:"flex",alignItems:"center",gap:10,background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"10px 14px",margin:"0 16px 12px"},
  sheetList:    {overflowY:"auto",flex:1},
  sheetRow:     {display:"flex",alignItems:"center",gap:12,width:"100%",padding:"11px 20px",background:"none",border:"none",cursor:"pointer",textAlign:"left",transition:"background .15s"},
  sheetRowOn:   {background:"#FFF5F5"},
  sheetPinWrap: {width:36,height:36,borderRadius:18,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  sheetRowTexts:{flex:1,display:"flex",flexDirection:"column",gap:2},
  sheetRowLabel:{fontSize:14,fontWeight:600,color:C.black},
  sheetRowSub:  {fontSize:12,color:C.light},

  // Messages list
  convRow:    {display:"flex",alignItems:"center",gap:12,padding:"14px 20px",background:"none",border:"none",cursor:"pointer",borderBottom:`1px solid ${C.border}`,textAlign:"left",width:"100%",transition:"background .15s"},
  convAvatar: {width:46,height:46,borderRadius:23,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:15,fontWeight:700},
  unreadDot:  {position:"absolute",top:-2,right:-2,width:18,height:18,borderRadius:9,background:C.coral,color:"white",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid white"},

  // Chat screen
  chatHeader:   {background:C.white,borderBottom:`1px solid ${C.border}`,padding:"var(--top-pad) 16px 12px",display:"flex",alignItems:"center",gap:10,flexShrink:0,position:"relative",zIndex:10},
  chatMenuBtn:  {background:"none",border:"none",cursor:"pointer",padding:6,borderRadius:8,display:"flex",flexShrink:0},
  chatMenu:     {position:"absolute",top:"100%",right:12,background:C.white,borderRadius:14,boxShadow:"0 8px 30px rgba(0,0,0,.14)",border:`1px solid ${C.border}`,minWidth:200,zIndex:60,padding:"6px"},
  chatMenuItem: {display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 14px",background:"none",border:"none",cursor:"pointer",borderRadius:10,fontSize:13,fontWeight:500,color:C.dark,fontFamily:"'DM Sans',sans-serif",textAlign:"left",transition:"background .15s"},
  chatMenuBlock:{color:C.coral},
  chatMenuUnblock:{color:"#16A34A"},
  chatContext:  {display:"flex",alignItems:"center",gap:5,padding:"6px 16px",background:"#FAFAFA",borderBottom:`1px solid ${C.border}`,flexShrink:0},
  chatMessages: {flex:1,overflowY:"auto",padding:"16px 16px 8px",display:"flex",flexDirection:"column"},
  blockedBanner:{display:"flex",alignItems:"flex-start",gap:8,background:"#FFF5F5",border:`1px solid #FFD6D7`,borderRadius:12,padding:"10px 12px",marginBottom:14,fontSize:12,color:C.dark,lineHeight:1.6},
  chatInputRow: {display:"flex",alignItems:"center",gap:8,padding:"10px 14px 24px",background:C.white,borderTop:`1px solid ${C.border}`,flexShrink:0},
  chatInput:    {flex:1,display:"flex",alignItems:"center",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:24,padding:"10px 16px"},
  chatSendBtn:  {width:42,height:42,borderRadius:21,background:C.coral,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"opacity .18s"},
  chatBlockedInput:{flex:1,display:"flex",alignItems:"center",gap:8,background:C.bg,borderRadius:24,padding:"12px 16px",justifyContent:"center"},

  // Block confirmation modal
  blockModal:   {position:"fixed",bottom:0,left:0,right:0,width:"100%",background:C.white,borderRadius:"22px 22px 0 0",padding:"28px 24px 40px",zIndex:301,display:"flex",flexDirection:"column",alignItems:"center",gap:14},
  blockModalIcon:{width:60,height:60,borderRadius:30,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"},
};

/* ─── BYER CSS (injected via <style>{BYER_CSS}</style>) ── */
const BYER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  body{font-family:'DM Sans',-apple-system,sans-serif;}
  input,select,button{font-family:'DM Sans',-apple-system,sans-serif;}
  input[type=date]::-webkit-calendar-picker-indicator{opacity:.4;}
  ::-webkit-scrollbar{display:none;}
  .bigcard{animation:cardUp .4s ease both;}
  @keyframes cardUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
  .galimg{animation:galFade .22s ease;}
  @keyframes galFade{from{opacity:.5;}to{opacity:1;}}
  .sheet{animation:sheetUp .32s cubic-bezier(.32,0,.67,0) both;}
  @keyframes sheetUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
  .resBtn:hover{opacity:.88;}.resBtn:active{transform:scale(.97);}
`;
