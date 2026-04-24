/* Byer — Notifications Screen */

/* ─── MOCK NOTIFICATIONS ──────────────────────── */
const NOTIFICATIONS = [
  {
    id:"N1", type:"booking", read:false,
    title:"Réservation confirmée",
    body:"Votre réservation à l'Appartement Bonamoussadi du 22 au 25 mars est confirmée.",
    time:"Il y a 2h", icon:"check", iconBg:"#F0FDF4", iconColor:"#16A34A",
  },
  {
    id:"N2", type:"rent", read:false,
    title:"Rappel loyer — J-9",
    body:"Votre loyer de 450 000 FCFA pour l'Appart. Bonamoussadi est dû le 31 mars.",
    time:"Il y a 5h", icon:"home", iconBg:"#FFF5F5", iconColor:C.coral,
  },
  {
    id:"N3", type:"message", read:false,
    title:"Nouveau message de Ekwalla M.",
    body:"« Bonjour, tout est prêt pour votre arrivée demain. »",
    time:"Il y a 8h", icon:"message", iconBg:"#EFF6FF", iconColor:"#2563EB",
  },
  {
    id:"N4", type:"boost", read:true,
    title:"Boost expiré",
    body:"Votre enchère de 15 000 FCFA/jour sur Villa Balnéaire Kribi a expiré. Relancez-la pour rester en tête.",
    time:"Hier", icon:"star", iconBg:"#FFF7ED", iconColor:"#EA580C",
  },
  {
    id:"N5", type:"review", read:true,
    title:"Nouvel avis reçu",
    body:"Kofi A. vous a laissé un avis 5★ : « Villa impeccable, propreté irréprochable… »",
    time:"Hier", icon:"star", iconBg:"#FDF4FF", iconColor:"#8B5CF6",
  },
  {
    id:"N6", type:"system", read:true,
    title:"Mise à jour Byer v2.1",
    body:"Nouvelles fonctionnalités : Dashboard bailleur, Techniciens, Boost Découverte. Mettez à jour !",
    time:"Il y a 3j", icon:"gear", iconBg:C.bg, iconColor:C.mid,
  },
  {
    id:"N7", type:"booking", read:true,
    title:"Séjour terminé",
    body:"Votre séjour au Penthouse Bastos est terminé. Laissez un avis pour aider la communauté !",
    time:"Il y a 5j", icon:"trips", iconBg:"#F0FDF4", iconColor:"#16A34A",
  },
  {
    id:"N8", type:"tech", read:true,
    title:"Technicien recruté",
    body:"Njoh Bernard (Plomberie) a été ajouté à votre équipe de techniciens.",
    time:"Il y a 1 sem.", icon:"check", iconBg:"#F0FDF4", iconColor:"#16A34A",
  },
];

/* ─── NOTIFICATIONS SCREEN ─────────────────────── */
function NotificationsScreen({ onBack, onOpenBookings, onOpenMessages, onOpenRent, onOpenBoost, onOpenTechs, onOpenReviews }) {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifs.filter(n => !n.read).length;

  const markRead = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  };

  // Routage vers l'écran approprié selon le type de notification
  const handleNotifClick = (notif) => {
    markRead(notif.id);
    const route = {
      booking: onOpenBookings,
      message: onOpenMessages,
      rent:    onOpenRent,
      boost:   onOpenBoost,
      tech:    onOpenTechs,
      review:  onOpenReviews,
      system:  null, // reste sur la liste
    }[notif.type];
    route?.();
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({...n, read: true})));
  };

  const filters = [
    { id:"all",     label:"Toutes" },
    { id:"booking", label:"Réservations" },
    { id:"rent",    label:"Loyers" },
    { id:"message", label:"Messages" },
    { id:"boost",   label:"Boost" },
  ];

  const filtered = filter === "all"
    ? notifs
    : notifs.filter(n => n.type === filter);

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>

      {/* Header */}
      <div style={S.rentHeader}>
        <button style={S.dBack2} onClick={onBack}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
        </button>
        <p style={{fontSize:17,fontWeight:700,color:C.black}}>Notifications</p>
        {unreadCount > 0 ? (
          <button
            onClick={markAllRead}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,color:C.coral,fontFamily:"'DM Sans',sans-serif"}}
          >
            Tout lire
          </button>
        ) : (
          <div style={{width:38}}/>
        )}
      </div>

      <div style={{flex:1,overflowY:"auto"}}>

        {/* Unread count banner */}
        {unreadCount > 0 && (
          <div style={{margin:"8px 16px",background:"#FFF5F5",border:`1px solid #FFD6D7`,borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:8,height:8,borderRadius:4,background:C.coral,boxShadow:`0 0 0 3px ${C.coral}33`}}/>
            <p style={{fontSize:13,fontWeight:600,color:C.coral}}>
              {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue{unreadCount > 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Filter chips */}
        <div style={{display:"flex",gap:6,padding:"8px 16px",overflowX:"auto"}}>
          {filters.map(f => (
            <button key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                flexShrink:0,padding:"6px 14px",borderRadius:20,border:"none",cursor:"pointer",
                fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
                background: filter === f.id ? C.coral : C.bg,
                color: filter === f.id ? "white" : C.mid,
                transition:"all .18s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div style={{padding:"8px 0 100px"}}>
          {filtered.length === 0 && (
            <EmptyState icon="check" text="Aucune notification dans cette catégorie"/>
          )}

          {filtered.map((notif, i) => (
            <button
              key={notif.id}
              onClick={() => handleNotifClick(notif)}
              style={{
                display:"flex",alignItems:"flex-start",gap:12,
                padding:"14px 16px",width:"100%",textAlign:"left",
                background: notif.read ? "transparent" : "#FFFBFB",
                border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                borderBottom:`1px solid ${C.border}`,
                transition:"background .18s",
              }}
            >
              {/* Icon */}
              <div style={{
                width:40,height:40,borderRadius:12,flexShrink:0,
                background:notif.iconBg,
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>
                <Icon name={notif.icon} size={18} color={notif.iconColor} stroke={2}/>
              </div>

              {/* Content */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:3}}>
                  <p style={{fontSize:13,fontWeight:notif.read ? 500 : 700,color:C.black,lineHeight:1.3}}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <div style={{width:8,height:8,borderRadius:4,background:C.coral,flexShrink:0,marginTop:4}}/>
                  )}
                </div>
                <p style={{fontSize:12,color:C.mid,lineHeight:1.5,marginBottom:4}}>{notif.body}</p>
                <p style={{fontSize:11,color:C.light}}>{notif.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
