/* Byer — Messages & Chat */

/* ─── MESSAGES SCREEN ───────────────────────────── */
function MessagesScreen({ role, onChatActiveChange }) {
  const isBailleur = role === "bailleur";

  /* En mode bailleur on simule des conversations entrantes (voyageurs/locataires).
     On enrichit chaque conv avec un rôle adapté côté bailleur.                  */
  const baseConvs = isBailleur
    ? CONVERSATIONS_DATA.map((c,i) => ({
        ...c,
        contact: ["Caroline N.","David M.","Aïcha B.","Junior K.","Sandrine T."][i % 5] || c.contact,
        contactRole: ["Voyageur","Locataire long séjour","Voyageur","Demandeur","Voyageur"][i % 5],
        lastMsg: ["Bonjour, est-ce disponible le 20 ?","Merci pour les clés !","Le wifi fonctionne pas...","Possible de visiter samedi ?","Tout est parfait, merci !"][i % 5],
      }))
    : CONVERSATIONS_DATA;

  const [convos, setConvos]     = useState(baseConvs);
  const [openChat, setOpenChat] = useState(null);
  const [search, setSearch]     = useState("");
  const [newConvOpen, setNewConvOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  /* Re-sync conversations quand on bascule de rôle */
  React.useEffect(() => { setConvos(baseConvs); /* eslint-disable-next-line */ }, [role]);

  /* Notifie le parent (ByerApp) que le chat est actif/inactif pour qu'il
     puisse masquer la nav bar du bas (UX : seule la barre de saisie doit
     rester visible quand on est dans une conversation). */
  React.useEffect(() => {
    onChatActiveChange?.(!!openChat);
    return () => onChatActiveChange?.(false);
  }, [openChat]);

  /* Charge les vraies conversations depuis Supabase si user connecté.
     Les convs Supabase sont préfixées dans la liste, en complément des mocks
     (ainsi la démo reste vivante même si la BDD est vide). */
  React.useEffect(() => {
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady) return;
    let cancelled = false;
    (async () => {
      const { data: sess } = await db.auth.getSession();
      const user = sess && sess.session && sess.session.user;
      if (!user) return;
      setCurrentUserId(user.id);
      const { data, error } = await db.chat.listConversations(user.id);
      if (error || cancelled || !Array.isArray(data) || data.length === 0) return;
      const realConvs = data.map(c => {
        const isHost = c.host_id === user.id;
        const other  = isHost ? c.guest : c.host;
        return {
          id:           c.id,                        // UUID Supabase
          _convId:      c.id,                        // marqueur Supabase
          _supabase:    true,
          contact:      other?.name || "Voyageur",
          contactRole:  isHost ? "Voyageur" : "Hôte",
          avatar:       other?.avatar_letter || (other?.name?.[0]?.toUpperCase() || "U"),
          avatarBg:     other?.avatar_bg || "#6366F1",
          photo:        other?.photo_url || null,
          logement:     c.listings?.title || "Annonce",
          lastMsg:      "",
          lastTime:     c.last_message_at ? new Date(c.last_message_at).toLocaleDateString('fr-FR') : "—",
          unread:       0,
          blocked:      false,
          messages:     [],
        };
      });
      if (!cancelled) setConvos(prev => [...realConvs, ...prev]);
    })();
    return () => { cancelled = true; };
  }, [role]);

  const toggleBlock = (id) => {
    setConvos(prev => prev.map(c => c.id===id ? {...c, blocked:!c.blocked} : c));
  };

  // Filtrage par recherche : nom de contact, dernier message, logement
  const q = search.trim().toLowerCase();
  const filteredConvos = !q ? convos : convos.filter(c =>
    c.contact.toLowerCase().includes(q) ||
    (c.lastMsg || "").toLowerCase().includes(q) ||
    (c.logement || "").toLowerCase().includes(q)
  );

  // Création d'une nouvelle conversation
  const startNewConversation = (contact) => {
    // Si la conv existe déjà, on l'ouvre
    const existing = convos.find(c => c.contact === contact.name);
    if (existing) {
      setNewConvOpen(false);
      setOpenChat(existing.id);
      return;
    }
    const newConv = {
      id: Date.now(),
      contact: contact.name,
      contactRole: contact.role,
      avatar: contact.name[0],
      avatarBg: contact.bg || "#6366F1",
      photo: contact.photo || null,
      logement: contact.logement || "Nouveau contact",
      lastMsg: "",
      lastTime: "Maintenant",
      unread: 0,
      blocked: false,
      messages: [],
    };
    setConvos(prev => [newConv, ...prev]);
    setNewConvOpen(false);
    setOpenChat(newConv.id);
  };

  /* ─── Chat ouvert : load history + realtime si conv Supabase ─── */
  React.useEffect(() => {
    if (!openChat) return;
    const conv = convos.find(c => c.id === openChat);
    if (!conv || !conv._supabase) return;
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady || !currentUserId) return;
    let cancelled = false;
    let unsub = () => {};

    // 1) Load message history
    (async () => {
      const { data, error } = await db.chat.listMessages(conv._convId);
      if (cancelled || error || !Array.isArray(data)) return;
      const adapted = data.map(m => ({
        id:   m.id,
        from: m.sender_id === currentUserId ? "me" : "them",
        text: m.body || "",
        time: new Date(m.created_at).toLocaleTimeString("fr-FR", {hour:"2-digit",minute:"2-digit"}),
      }));
      setConvos(prev => prev.map(c => c.id === openChat ? { ...c, messages: adapted } : c));
    })();

    // 2) Realtime subscription : pousse les nouveaux messages
    unsub = db.chat.subscribeMessages(conv._convId, (newMsg) => {
      if (cancelled) return;
      setConvos(prev => prev.map(c => {
        if (c.id !== openChat) return c;
        // Évite le doublon si message émis par soi-même (déjà ajouté en optimiste)
        if ((c.messages || []).some(m => m.id === newMsg.id)) return c;
        return {
          ...c,
          lastMsg: newMsg.body,
          lastTime: "Maintenant",
          messages: [...(c.messages || []), {
            id:   newMsg.id,
            from: newMsg.sender_id === currentUserId ? "me" : "them",
            text: newMsg.body || "",
            time: new Date(newMsg.created_at).toLocaleTimeString("fr-FR", {hour:"2-digit",minute:"2-digit"}),
          }],
        };
      }));
    });

    return () => { cancelled = true; try { unsub(); } catch (e) {} };
  }, [openChat, currentUserId]);

  if (openChat) {
    const conv = convos.find(c => c.id === openChat);
    if (!conv) { setOpenChat(null); return null; }
    return (
      <ChatScreen
        conv={conv}
        onBack={() => setOpenChat(null)}
        onToggleBlock={() => toggleBlock(openChat)}
        onSendMessage={async (text) => {
          // Optimistic UI : on ajoute tout de suite, on "ré-aligne" via Realtime
          const optimistic = {
            id: "tmp-" + Date.now(), from:"me", text,
            time: new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})
          };
          setConvos(prev => prev.map(c => c.id === openChat ? {
            ...c, lastMsg: text, lastTime: "Maintenant",
            messages: [...(c.messages||[]), optimistic],
          } : c));

          // Send via Supabase si conv réelle
          if (conv._supabase && currentUserId) {
            const db = window.byer && window.byer.db;
            if (db && db.isReady) {
              try { await db.chat.sendMessage(conv._convId, currentUserId, text); }
              catch (e) { console.warn("[byer] chat send error:", e); }
            }
          }
        }}
      />
    );
  }

  return (
    <div>
      <div style={S.pageHead}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <p style={S.pageTitle}>Messages</p>
              {isBailleur && (
                <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8,background:"#FAF5FF",color:"#7E22CE",border:"1px solid #E9D5FF"}}>
                  🔑 BAILLEUR
                </span>
              )}
            </div>
            <p style={{fontSize:13,color:C.mid,marginTop:3}}>
              {isBailleur
                ? (convos.filter(c=>c.unread>0).length > 0
                    ? `${convos.reduce((s,c)=>s+c.unread,0)} message${convos.reduce((s,c)=>s+c.unread,0)>1?"s":""} de voyageur${convos.reduce((s,c)=>s+c.unread,0)>1?"s":""} à traiter`
                    : "Aucune nouvelle demande de voyageur")
                : (convos.filter(c=>c.unread>0).length > 0
                    ? `${convos.reduce((s,c)=>s+c.unread,0)} message${convos.reduce((s,c)=>s+c.unread,0)>1?"s":""} non lu${convos.reduce((s,c)=>s+c.unread,0)>1?"s":""}`
                    : "Tout est à jour")}
            </p>
          </div>
          <button
            onClick={() => setNewConvOpen(true)}
            title="Nouvelle conversation"
            style={{
              width:42,height:42,borderRadius:21,
              background:C.coral,border:"none",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 2px 8px rgba(255,90,95,.3)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              <line x1="12" y1="9" x2="12" y2="14"/>
              <line x1="9.5" y1="11.5" x2="14.5" y2="11.5"/>
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <div style={{
          marginTop:12,display:"flex",alignItems:"center",gap:8,
          background:C.bg,border:`1px solid ${C.border}`,
          borderRadius:12,padding:"9px 12px",
        }}>
          <svg width="15" height="15" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Rechercher un contact, un message…"
            style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:C.dark,fontFamily:"'DM Sans',sans-serif"}}
          />
          {search && (
            <button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",padding:0,color:C.light,fontSize:16,lineHeight:1}}>×</button>
          )}
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",padding:"8px 0 100px"}}>
        {filteredConvos.length === 0 && (
          <div style={{padding:"40px 24px",textAlign:"center"}}>
            <p style={{fontSize:14,color:C.mid,fontFamily:"'DM Sans',sans-serif"}}>
              {q ? `Aucune conversation pour « ${search} »` : "Aucune conversation pour le moment"}
            </p>
            {!q && (
              <button
                onClick={()=>setNewConvOpen(true)}
                style={{marginTop:14,padding:"10px 20px",background:C.coral,color:C.white,border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
              >Démarrer une conversation</button>
            )}
          </div>
        )}

        {filteredConvos.map(conv => (
          <button
            key={conv.id}
            style={S.convRow}
            onClick={() => setOpenChat(conv.id)}
          >
            {/* Avatar */}
            <div style={{position:"relative",flexShrink:0}}>
              <FaceAvatar photo={conv.photo} avatar={conv.avatar} bg={conv.avatarBg} size={46} blocked={conv.blocked}/>
              {conv.unread > 0 && !conv.blocked && (
                <div style={S.unreadDot}>{conv.unread}</div>
              )}
            </div>

            {/* Content */}
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:14,fontWeight:conv.unread>0?700:600,color:C.black}}>{conv.contact}</span>
                  <span style={{fontSize:10,fontWeight:500,color:C.mid,background:C.bg,padding:"1px 7px",borderRadius:10,border:`1px solid ${C.border}`}}>{conv.contactRole}</span>
                  {conv.blocked && <span style={{fontSize:10,fontWeight:600,color:C.light,background:"#F5F5F5",padding:"1px 7px",borderRadius:10}}>Bloqué</span>}
                </div>
                <span style={{fontSize:11,color:C.light,flexShrink:0}}>{conv.lastTime}</span>
              </div>
              <p style={{fontSize:12,color:C.light,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%",marginBottom:2}}>
                {conv.blocked ? "Cet utilisateur est bloqué" : (conv.lastMsg || "Nouvelle conversation")}
              </p>
              <p style={{fontSize:11,color:C.light}}>{conv.logement}</p>
            </div>

            <Icon name="chevron" size={15} color={C.border} stroke={2}/>
          </button>
        ))}
      </div>

      {/* New conversation sheet */}
      {newConvOpen && (
        <NewConversationSheet
          onClose={()=>setNewConvOpen(false)}
          onSelect={startNewConversation}
          existingNames={convos.map(c => c.contact)}
        />
      )}
    </div>
  );
}

/* ─── NEW CONVERSATION SHEET ───────────────────── */
function NewConversationSheet({ onClose, onSelect, existingNames = [] }) {
  const [search, setSearch] = useState("");

  // Liste de contacts suggérés (dérivés des hôtes/propriétaires des annonces)
  const suggested = (() => {
    const seen = new Set();
    const list = [];
    [...PROPERTIES, ...VEHICLES].forEach(item => {
      const name = item.host || item.owner;
      if (!name || seen.has(name)) return;
      seen.add(name);
      list.push({
        name,
        role: item.type === "vehicle" ? "Loueur véhicule" : "Bailleur",
        bg: ["#6366F1","#0EA5E9","#10B981","#F59E0B","#EC4899"][list.length % 5],
        photo: item.hostPhoto || null,
        logement: item.title,
      });
    });
    return list;
  })();

  const q = search.trim().toLowerCase();
  const filtered = !q ? suggested : suggested.filter(c => c.name.toLowerCase().includes(q));

  return (
    <>
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:200}} onClick={onClose}/>
      <div style={{
        position:"fixed",bottom:0,left:0,right:0,
        background:C.white,borderRadius:"20px 20px 0 0",
        padding:"16px 0 24px",zIndex:201,maxHeight:"80vh",
        display:"flex",flexDirection:"column",
        fontFamily:"'DM Sans',sans-serif",
      }}>
        {/* Handle */}
        <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 12px"}}/>

        {/* Header */}
        <div style={{padding:"0 16px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Nouvelle conversation</p>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.mid,lineHeight:1,padding:0}}>×</button>
        </div>

        {/* Search */}
        <div style={{padding:"0 16px 12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"9px 12px"}}>
            <svg width="15" height="15" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Rechercher un hôte ou bailleur…"
              style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:C.dark,fontFamily:"'DM Sans',sans-serif"}}
            />
          </div>
        </div>

        {/* List */}
        <div style={{flex:1,overflowY:"auto",padding:"0 0 8px"}}>
          {filtered.length === 0 ? (
            <p style={{textAlign:"center",fontSize:13,color:C.light,padding:"24px"}}>Aucun contact trouvé.</p>
          ) : filtered.map((c, i) => {
            const already = existingNames.includes(c.name);
            return (
              <button
                key={i}
                onClick={() => onSelect(c)}
                style={{
                  width:"100%",display:"flex",alignItems:"center",gap:12,
                  padding:"12px 16px",background:"none",border:"none",
                  borderBottom:`1px solid ${C.border}`,cursor:"pointer",textAlign:"left",
                  fontFamily:"'DM Sans',sans-serif",
                }}
              >
                <FaceAvatar photo={c.photo} avatar={c.name[0]} bg={c.bg} size={42}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:14,fontWeight:600,color:C.black}}>{c.name}</p>
                  <p style={{fontSize:11,color:C.mid,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                    {c.role} · {c.logement}
                  </p>
                </div>
                {already && (
                  <span style={{fontSize:10,fontWeight:600,color:C.coral,background:"#FFF5F5",padding:"3px 8px",borderRadius:10}}>
                    Existante
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─── CHAT SCREEN ───────────────────────────────── */
function ChatScreen({ conv, onBack, onToggleBlock, onSendMessage }) {
  const [input, setInput]       = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [blockConfirm, setBlockConfirm] = useState(false);
  const [chatToast, setChatToast] = useState("");
  const isBlocked = conv.blocked;
  const messages = conv.messages || [];

  const flashChat = (msg) => { setChatToast(msg); setTimeout(()=>setChatToast(""), 2200); };

  const sendMsg = () => {
    if (!input.trim() || isBlocked) return;
    onSendMessage?.(input.trim());
    setInput("");
  };

  return (
    <div style={{...S.shell, position:"relative"}}>
      <style>{BYER_CSS}</style>

      {/* Header du chat */}
      <div style={S.chatHeader}>
        <button style={S.dBack2} onClick={onBack}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
        </button>

        <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
          <FaceAvatar photo={conv.photo} avatar={conv.avatar} bg={conv.avatarBg} size={36} blocked={isBlocked}/>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:C.black,lineHeight:1.2}}>{conv.contact}</p>
            <p style={{fontSize:11,color:isBlocked?C.coral:C.mid}}>
              {isBlocked ? "Bloqué · ne peut plus écrire" : conv.contactRole+" · "+conv.logement}
            </p>
          </div>
        </div>

        {/* Menu */}
        <button style={S.chatMenuBtn} onClick={()=>setShowMenu(v=>!v)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={C.dark}>
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <>
            <div style={{position:"fixed",inset:0,zIndex:50}} onClick={()=>setShowMenu(false)}/>
            <div style={S.chatMenu}>
              <button style={S.chatMenuItem} onClick={()=>{ setShowMenu(false); flashChat(`Logement : ${conv.logement}`); }}>
                <Icon name="home" size={16} color={C.dark} stroke={1.8}/>
                <span>Voir le logement</span>
              </button>
              <div style={{height:1,background:C.border,margin:"2px 0"}}/>
              <button
                style={{...S.chatMenuItem,...(isBlocked?S.chatMenuUnblock:S.chatMenuBlock)}}
                onClick={()=>{ setShowMenu(false); setBlockConfirm(true); }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  {isBlocked
                    ? <><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></>
                    : <><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>
                  }
                </svg>
                <span>{isBlocked ? "Débloquer "+conv.contact : "Bloquer "+conv.contact}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Contexte logement */}
      <div style={S.chatContext}>
        <ByerPin size={12}/>
        <span style={{fontSize:11,color:C.mid}}>{conv.logement}</span>
      </div>

      {/* Messages */}
      <div style={S.chatMessages}>

        {isBlocked && (
          <div style={S.blockedBanner}>
            <svg width="15" height="15" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
            <span>
              Vous avez bloqué <strong>{conv.contact}</strong>. Il/elle ne peut plus vous envoyer de messages.
              <button
                style={{color:C.coral,fontWeight:700,background:"none",border:"none",cursor:"pointer",padding:"0 4px",fontFamily:"'DM Sans',sans-serif",fontSize:12}}
                onClick={()=>{ onToggleBlock(); }}
              >Débloquer</button>
            </span>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.from === "me";
          const showAvatar = !isMe && (i===0 || messages[i-1].from==="me");
          return (
            <div key={msg.id} style={{display:"flex",flexDirection:isMe?"row-reverse":"row",alignItems:"flex-end",gap:8,marginBottom:6}}>
              {!isMe && (
                <div style={{opacity:showAvatar?1:0,flexShrink:0}}>
                  <FaceAvatar photo={conv.photo} avatar={conv.avatar} bg={conv.avatarBg} size={28}/>
                </div>
              )}
              <div style={{maxWidth:"72%"}}>
                <div style={{
                  background: isMe ? C.coral : C.white,
                  color: isMe ? "white" : C.black,
                  borderRadius: isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",
                  padding:"10px 13px",
                  fontSize:14, lineHeight:1.5,
                  boxShadow: isMe?"none":"0 1px 4px rgba(0,0,0,.07)",
                }}>
                  {msg.text}
                </div>
                <p style={{fontSize:10,color:C.light,marginTop:3,textAlign:isMe?"right":"left"}}>{msg.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone de saisie */}
      <div style={S.chatInputRow}>
        {isBlocked ? (
          <div style={S.chatBlockedInput}>
            <svg width="14" height="14" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
            <span style={{fontSize:13,color:C.light}}>Messagerie désactivée — utilisateur bloqué</span>
          </div>
        ) : (
          <>
            <div style={S.chatInput}>
              <input
                style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:14,color:C.dark,fontFamily:"'DM Sans',sans-serif"}}
                placeholder="Écrire un message…"
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&sendMsg()}
              />
            </div>
            <button
              style={{...S.chatSendBtn,...(input.trim()?{}:{opacity:.4})}}
              onClick={sendMsg}
              disabled={!input.trim()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Modale confirmation bloquer/débloquer */}
      {blockConfirm && (
        <>
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300}} onClick={()=>setBlockConfirm(false)}/>
          <div style={S.blockModal}>
            <div style={S.blockModalIcon}>
              <svg width="28" height="28" fill="none" stroke={isBlocked?"#16A34A":C.coral} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                {isBlocked
                  ? <><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></>
                  : <><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>
                }
              </svg>
            </div>
            <p style={{fontSize:16,fontWeight:700,color:C.black,textAlign:"center"}}>
              {isBlocked ? `Débloquer ${conv.contact} ?` : `Bloquer ${conv.contact} ?`}
            </p>
            <p style={{fontSize:13,color:C.mid,textAlign:"center",lineHeight:1.6}}>
              {isBlocked
                ? `${conv.contact} pourra à nouveau vous envoyer des messages et voir vos annonces.`
                : `${conv.contact} ne pourra plus vous contacter ni voir vos annonces. Vous pouvez débloquer à tout moment.`
              }
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",marginTop:4}}>
              <button
                style={{...S.payBtn, background:isBlocked?"#16A34A":C.coral}}
                onClick={()=>{ onToggleBlock(); setBlockConfirm(false); }}
              >
                {isBlocked ? "Oui, débloquer" : "Oui, bloquer"}
              </button>
              <button
                style={{...S.tripsSecBtn,justifyContent:"center",padding:"12px"}}
                onClick={()=>setBlockConfirm(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </>
      )}

      {chatToast && (
        <div style={{position:"fixed",bottom:90,left:16,right:16,background:C.dark,color:C.white,padding:"12px 16px",borderRadius:8,textAlign:"center",fontSize:14,fontFamily:"'DM Sans',sans-serif",zIndex:1100}}>
          {chatToast}
        </div>
      )}
    </div>
  );
}
