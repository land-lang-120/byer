/* Byer — Messages & Chat */

/* ─── MESSAGES SCREEN ───────────────────────────── */
function MessagesScreen() {
  const [convos, setConvos]   = useState(CONVERSATIONS_DATA);
  const [openChat, setOpenChat] = useState(null);

  const toggleBlock = (id) => {
    setConvos(prev => prev.map(c => c.id===id ? {...c, blocked:!c.blocked} : c));
  };

  if (openChat) {
    const conv = convos.find(c => c.id === openChat);
    return (
      <ChatScreen
        conv={conv}
        onBack={() => setOpenChat(null)}
        onToggleBlock={() => toggleBlock(openChat)}
      />
    );
  }

  return (
    <div>
      <div style={S.pageHead}>
        <p style={S.pageTitle}>Messages</p>
        <p style={{fontSize:13,color:C.mid,marginTop:3}}>
          {convos.filter(c=>c.unread>0).length > 0
            ? `${convos.reduce((s,c)=>s+c.unread,0)} message${convos.reduce((s,c)=>s+c.unread,0)>1?"s":""} non lu${convos.reduce((s,c)=>s+c.unread,0)>1?"s":""}`
            : "Tout est à jour"}
        </p>
      </div>

      <div style={{display:"flex",flexDirection:"column",padding:"8px 0 100px"}}>
        {convos.map(conv => (
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
                {conv.blocked ? "Cet utilisateur est bloqué" : conv.lastMsg}
              </p>
              <p style={{fontSize:11,color:C.light}}>{conv.logement}</p>
            </div>

            <Icon name="chevron" size={15} color={C.border} stroke={2}/>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── CHAT SCREEN ───────────────────────────────── */
function ChatScreen({ conv, onBack, onToggleBlock }) {
  const [messages, setMessages] = useState(conv.messages);
  const [input, setInput]       = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [blockConfirm, setBlockConfirm] = useState(false);
  const isBlocked = conv.blocked;

  const sendMsg = () => {
    if (!input.trim() || isBlocked) return;
    setMessages(prev => [...prev, {
      id: Date.now(), from:"me",
      text: input.trim(),
      time: new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})
    }]);
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
              <button style={S.chatMenuItem} onClick={()=>setShowMenu(false)}>
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
    </div>
  );
}
