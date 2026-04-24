/* Byer — Auth Screens */

/* ─── SPLASH ─────────────────────────────────────── */
function SplashScreen({ onDone }) {
  useState(()=>{ const t = setTimeout(onDone, 2600); return ()=>clearTimeout(t); });
  return (
    <div style={{...Os.root, background:C.coral, justifyContent:"center", alignItems:"center"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500;9..40,700;9..40,800&display=swap');
        @keyframes splashPop  { 0%{opacity:0;transform:scale(.5)} 65%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1)} }
        @keyframes splashFade { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
        .spl-logo { animation: splashPop  .8s cubic-bezier(.34,1.56,.64,1) .1s both; }
        .spl-name { animation: splashFade .45s ease .75s both; }
        .spl-sub  { animation: splashFade .45s ease 1s both; }
      `}</style>

      {/* Logo B */}
      <div className="spl-logo" style={{marginBottom:28}}>
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect width="120" height="120" rx="34" fill="rgba(255,255,255,.22)"/>
          <path
            d="M36 34h27a14 14 0 010 28H36m0 0h29a14 14 0 010 28H36V34z"
            stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="spl-name" style={{
        fontSize:22, fontWeight:700, color:"rgba(255,255,255,.7)",
        letterSpacing:4, textTransform:"uppercase",
        fontFamily:"'DM Sans',sans-serif", marginBottom:10,
      }}>
        byer
      </p>

      <p className="spl-sub" style={{
        fontSize:15, color:"rgba(255,255,255,.85)",
        fontFamily:"'DM Sans',sans-serif", fontWeight:500,
      }}>
        vous souhaite la bienvenue 👋
      </p>
    </div>
  );
}

/* ─── ONBOARDING ─────────────────────────────────── */
function OnboardingScreen({ onDone }) {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;

  return (
    <div style={Os.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap');
        @keyframes slideIn { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        .slide-content { animation: slideIn .38s ease both; }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',-apple-system,sans-serif;}
      `}</style>

      {/* Full-bleed photo */}
      <div style={{position:"relative",height:"58%",flexShrink:0,overflow:"hidden"}}>
        <img
          key={idx}
          src={slide.img}
          alt=""
          className="slide-content"
          style={{width:"100%",height:"100%",objectFit:"cover"}}
        />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.55) 100%)"}}/>

        {/* Skip */}
        <button
          style={{position:"absolute",top:52,right:20,background:"rgba(255,255,255,.18)",border:"none",borderRadius:20,padding:"7px 16px",fontSize:13,fontWeight:600,color:"white",cursor:"pointer",backdropFilter:"blur(8px)"}}
          onClick={onDone}
        >
          Passer
        </button>

        {/* Tag pill on photo */}
        <div key={`tag-${idx}`} className="slide-content" style={{position:"absolute",bottom:22,left:20}}>
          <span style={{background:slide.accent,color:"white",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20}}>
            {slide.tag}
          </span>
        </div>
      </div>

      {/* Content card */}
      <div style={{flex:1,background:C.white,borderRadius:"26px 26px 0 0",marginTop:-20,padding:"28px 28px 0",display:"flex",flexDirection:"column"}}>

        {/* Dots */}
        <div style={{display:"flex",gap:6,marginBottom:22}}>
          {SLIDES.map((_,i) => (
            <div key={i} style={{height:4,borderRadius:2,transition:"all .3s ease",
              width: i===idx ? 28 : 8,
              background: i===idx ? slide.accent : C.border,
            }}/>
          ))}
        </div>

        <div key={`body-${idx}`} className="slide-content">
          <p style={{fontSize:30,fontWeight:800,color:C.black,lineHeight:1.2,marginBottom:14,whiteSpace:"pre-line"}}>
            {slide.title}
          </p>
          <p style={{fontSize:15,color:C.mid,lineHeight:1.7,marginBottom:32}}>
            {slide.sub}
          </p>
        </div>

        {/* CTA */}
        <div style={{display:"flex",gap:12,marginTop:"auto",paddingBottom:36}}>
          {idx > 0 && (
            <button
              style={{flex:1,padding:"15px",borderRadius:16,border:`1.5px solid ${C.border}`,background:C.white,fontSize:15,fontWeight:600,color:C.dark,cursor:"pointer"}}
              onClick={()=>setIdx(i=>i-1)}
            >
              ← Retour
            </button>
          )}
          <button
            style={{flex:2,padding:"15px",borderRadius:16,border:"none",background:slide.accent,fontSize:15,fontWeight:700,color:"white",cursor:"pointer",transition:"opacity .18s"}}
            onClick={()=> isLast ? onDone() : setIdx(i=>i+1)}
          >
            {isLast ? "Commencer →" : "Suivant →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── LOGIN ──────────────────────────────────────── */
function LoginScreen({ onLogin, onSignup, onForgotPassword, onSSO }) {
  const [method, setMethod]  = useState("email");
  const [email, setEmail]    = useState("");
  const [phone, setPhone]    = useState("");
  const [pwd, setPwd]        = useState("");
  const [showPwd, setShowPwd]= useState(false);
  const [loading, setLoading]= useState(false);
  const [err, setErr]        = useState("");

  const handle = async () => {
    const id = method==="email" ? email : phone;
    if (!id.trim())  { setErr(method==="email"?"Entrez votre adresse email.":"Entrez votre numéro de téléphone."); return; }
    if (!pwd.trim()) { setErr("Entrez votre mot de passe."); return; }
    setErr(""); setLoading(true);

    // ── Connexion réelle Supabase si configuré, sinon mock ──
    const db = window.byer && window.byer.db;
    if (db && db.isReady && method === "email") {
      const { data, error } = await db.auth.signIn(email.trim().toLowerCase(), pwd);
      setLoading(false);
      if (error) {
        // Messages d'erreur Supabase traduits
        const msg = error.message || "";
        if (/Invalid login credentials/i.test(msg)) setErr("Email ou mot de passe incorrect.");
        else if (/Email not confirmed/i.test(msg)) setErr("Email non confirmé — vérifiez votre boîte de réception.");
        else setErr(msg);
        return;
      }
      if (data && data.session) {
        // SIGNED_IN va aussi être capté par main.js — on appelle quand même
        // onLogin pour être robuste (au cas où l'event ne fire pas dans
        // certains navigateurs)
        onLogin();
      }
      return;
    }

    // Téléphone (Twilio non encore configuré côté Supabase) → mock pour l'instant
    if (db && db.isReady && method === "phone") {
      setLoading(false);
      setErr("Connexion par SMS bientôt disponible. Utilisez votre email.");
      return;
    }

    // Fallback mock (Supabase indisponible)
    setTimeout(()=>{ setLoading(false); onLogin(); }, 1400);
  };

  return (
    <div style={Os.root}>
      <style>{AUTH_CSS}</style>

      {/* Hero */}
      <div style={Os.authHero}>
        <div style={Os.authLogoWrap}>
          <svg width="38" height="38" viewBox="0 0 30 30" fill="none">
            <rect width="30" height="30" rx="9" fill="rgba(255,255,255,.25)"/>
            <path d="M9 8h6.5a3.5 3.5 0 010 7H9m0 0h7a3.5 3.5 0 010 7H9V8z"
              stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={Os.authLogoTxt}>byer</span>
        </div>
        <p style={Os.authTitle}>Bon retour ! 👋</p>
        <p style={Os.authSub}>Connectez-vous pour continuer</p>
      </div>

      {/* Form card */}
      <div style={Os.authCard}>

        {/* Socials */}
        <div style={{display:"flex",gap:10,marginBottom:18}}>
          {[
            { label:"Google", icon:<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
            { label:"Apple",  icon:<svg width="18" height="18" viewBox="0 0 24 24" fill={C.black}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> },
          ].map(s=>(
            <button key={s.label} style={Os.socialBtn} onClick={()=>onSSO?.(s.label)}>
              {s.icon}
              <span style={{fontSize:13,fontWeight:600,color:C.dark}}>{s.label}</span>
            </button>
          ))}
        </div>

        <div style={Os.dividerRow}>
          <div style={Os.dividerLine}/>
          <span style={Os.dividerTxt}>ou avec</span>
          <div style={Os.dividerLine}/>
        </div>

        {/* Toggle Email / Téléphone */}
        <div style={Os.methodToggle}>
          {[
            { id:"email", label:"Email",     icon:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
            { id:"phone", label:"Téléphone", icon:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> },
          ].map(m=>(
            <button
              key={m.id}
              style={{...Os.methodBtn,...(method===m.id?Os.methodBtnOn:{})}}
              onClick={()=>{ setMethod(m.id); setErr(""); }}
            >
              <span style={{color:method===m.id?C.coral:C.mid}}>{m.icon}</span>
              <span style={{fontSize:13,fontWeight:600,color:method===m.id?C.coral:C.mid}}>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Identifiant selon méthode */}
        <div style={{marginBottom:14}}>
          <label style={Os.fieldLabel}>
            {method==="email" ? "Adresse email" : "Numéro de téléphone"}
          </label>
          <div style={Os.fieldWrap}>
            {method==="email"
              ? <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              : <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            }
            {method==="phone" && (
              <span style={{fontSize:13,fontWeight:600,color:C.dark,paddingRight:6,borderRight:`1px solid ${C.border}`}}>+237</span>
            )}
            <input
              key={method}
              style={Os.fieldInput}
              type={method==="email"?"email":"tel"}
              placeholder={method==="email"?"votre@email.com":"6XX XXX XXX"}
              value={method==="email"?email:phone}
              onChange={e=>{ method==="email"?setEmail(e.target.value):setPhone(e.target.value); setErr(""); }}
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div style={{marginBottom:6}}>
          <label style={Os.fieldLabel}>Mot de passe</label>
          <div style={Os.fieldWrap}>
            <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <input
              style={Os.fieldInput}
              type={showPwd?"text":"password"} placeholder="••••••••"
              value={pwd} onChange={e=>{setPwd(e.target.value);setErr("");}}
              onKeyDown={e=>e.key==="Enter"&&handle()}
            />
            <button style={{background:"none",border:"none",cursor:"pointer",padding:2}} onClick={()=>setShowPwd(v=>!v)}>
              <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                {showPwd
                  ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        <button
          onClick={()=>onForgotPassword?.(method==="email"?email:"")}
          style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.coral,fontWeight:600,fontFamily:"'DM Sans',sans-serif",textAlign:"right",width:"100%",marginBottom:18}}>
          Mot de passe oublié ?
        </button>

        {err && <p style={{fontSize:12,color:"#EF4444",marginBottom:12,textAlign:"center"}}>{err}</p>}

        <button style={{...Os.ctaBtn, opacity:loading?.7:1}} onClick={handle} disabled={loading}>
          {loading ? <div style={Os.spinner}/> : "Se connecter"}
        </button>

        <p style={{textAlign:"center",fontSize:13,color:C.mid,marginTop:18}}>
          Pas encore de compte ?{" "}
          <button style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.coral,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}} onClick={onSignup}>
            Créer un compte
          </button>
        </p>
      </div>
    </div>
  );
}

/* ─── SIGNUP ─────────────────────────────────────── */
function SignupScreen({ onBack, onDone, onNeedVerify }) {
  const [step, setStep]      = useState(1);
  const [form, setForm]      = useState({ name:"", email:"", phone:"", pwd:"", role:"locataire", promo:"" });
  const [showPwd, setShowPwd]= useState(false);
  const [loading, setLoading]= useState(false);
  const [code, setCode]      = useState(["","","","",""]);
  const [err, setErr]        = useState("");
  const [promoStatus, setPromoStatus] = useState(null); // null | "valid" | "invalid"
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  // Validation simple : code parrainage = 6+ chars alphanumériques se terminant par "24"
  const validatePromo = (val) => {
    const cleaned = (val || "").trim().toUpperCase();
    if (!cleaned) return null;
    return /^[A-Z0-9]{4,}24$/.test(cleaned) ? "valid" : "invalid";
  };

  const handlePromoChange = (val) => {
    set("promo", val.toUpperCase());
    setPromoStatus(validatePromo(val));
  };

  const handleStep1 = () => {
    if (!form.name.trim()||!form.email.trim()||!form.phone.trim()||!form.pwd.trim()) return;
    setStep(2);
  };
  const handleStep2 = () => setStep(3);
  // Crédite les points de bienvenue si code de parrainage valide (côté local + plus tard côté Supabase)
  const creditPromoBonus = () => {
    if (form.promo && validatePromo(form.promo) === "valid") {
      try {
        pointsManager.add(POINTS_CONFIG.perReferral);
        pointsManager.addCoupon({
          rewardId: "welcome_promo",
          label: `Bonus parrainage (${form.promo})`,
          type: "welcome",
          value: POINTS_CONFIG.perReferral * POINTS_CONFIG.ratio,
        });
      } catch (e) { /* localStorage indisponible */ }
    }
  };

  const handleVerify = async () => {
    setErr(""); setLoading(true);

    // ── Inscription réelle Supabase si configuré, sinon mock ──
    const db = window.byer && window.byer.db;
    if (db && db.isReady) {
      // Métadonnées passées au trigger handle_new_auth_user (qui crée le profile)
      const { data, error } = await db.raw.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.pwd,
        options: {
          data: {
            name: form.name.trim(),
            phone: form.phone.trim() ? `+237${form.phone.replace(/\D/g,'')}` : null,
            role: form.role,
            promo_code: form.promo ? form.promo.trim().toUpperCase() : null,
          },
        },
      });
      setLoading(false);
      if (error) {
        const msg = error.message || "";
        if (/already registered/i.test(msg) || /already been registered/i.test(msg))
          setErr("Cette adresse email est déjà utilisée. Essayez de vous connecter.");
        else if (/Password should be at least/i.test(msg))
          setErr("Le mot de passe doit contenir au moins 6 caractères.");
        else if (/Invalid email/i.test(msg))
          setErr("Adresse email invalide.");
        else
          setErr(msg);
        return;
      }
      // Bonus de parrainage local (sera dupliqué côté Supabase plus tard via Edge Function)
      creditPromoBonus();
      // Si une session existe déjà → email confirmation désactivée → on entre dans l'app
      if (data && data.session) { onDone(); return; }
      // Sinon → email confirmation requise → écran "Vérifie ton email"
      if (onNeedVerify) onNeedVerify(form.email.trim().toLowerCase());
      else onDone();
      return;
    }

    // Fallback mock (Supabase indisponible)
    setTimeout(()=>{
      creditPromoBonus();
      setLoading(false); onDone();
    }, 1400);
  };

  return (
    <div style={Os.root}>
      <style>{AUTH_CSS}</style>

      {/* Header */}
      <div style={{background:C.white,padding:"var(--top-pad) 20px 16px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${C.border}`}}>
        <button style={{background:"none",border:"none",cursor:"pointer",display:"flex"}} onClick={step===1?onBack:()=>setStep(s=>s-1)}>
          <svg width="22" height="22" fill="none" stroke={C.dark} strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{flex:1}}>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>
            {step===1?"Créer un compte":step===2?"Votre profil":"Vérification"}
          </p>
          <p style={{fontSize:12,color:C.light,marginTop:2}}>Étape {step} sur 3</p>
        </div>
        <div style={{width:60,height:4,borderRadius:2,background:C.border,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(step/3)*100}%`,background:C.coral,borderRadius:2,transition:"width .3s ease"}}/>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"24px 20px 40px"}}>

        {/* Step 1 : Infos de base */}
        {step===1 && (
          <div>
            <p style={{fontSize:22,fontWeight:800,color:C.black,marginBottom:6}}>Vos informations</p>
            <p style={{fontSize:14,color:C.mid,marginBottom:24}}>Créez votre compte Byer en quelques secondes.</p>

            {[
              {k:"name",  label:"Nom complet",      type:"text",  icon:"user",    ph:"Jean Dupont"},
              {k:"email", label:"Adresse email",     type:"email", icon:"mail",    ph:"jean@email.com"},
              {k:"phone", label:"Téléphone (+237)",  type:"tel",   icon:"phone",   ph:"6XX XXX XXX"},
            ].map(f=>(
              <div key={f.k} style={{marginBottom:16}}>
                <label style={Os.fieldLabel}>{f.label}</label>
                <div style={Os.fieldWrap}>
                  <SignupFieldIcon name={f.icon}/>
                  <input
                    style={Os.fieldInput} type={f.type} placeholder={f.ph}
                    value={form[f.k]} onChange={e=>set(f.k,e.target.value)}
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div style={{marginBottom:28}}>
              <label style={Os.fieldLabel}>Mot de passe</label>
              <div style={Os.fieldWrap}>
                <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input style={Os.fieldInput} type={showPwd?"text":"password"} placeholder="Min. 8 caractères"
                  value={form.pwd} onChange={e=>set("pwd",e.target.value)}/>
                <button style={{background:"none",border:"none",cursor:"pointer",padding:2}} onClick={()=>setShowPwd(v=>!v)}>
                  <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              {form.pwd.length>0 && (
                <div style={{display:"flex",gap:4,marginTop:6}}>
                  {[1,2,3,4].map(i=>(
                    <div key={i} style={{flex:1,height:3,borderRadius:2,background:
                      form.pwd.length>=8&&i<=4?C.coral:
                      form.pwd.length>=6&&i<=3?"#F59E0B":
                      form.pwd.length>=4&&i<=2?"#FCD34D":
                      i<=1?"#FCA5A5":C.border
                    }}/>
                  ))}
                  <span style={{fontSize:10,color:C.light,alignSelf:"center",marginLeft:4}}>
                    {form.pwd.length>=8?"Fort":form.pwd.length>=6?"Moyen":form.pwd.length>=4?"Faible":"Très faible"}
                  </span>
                </div>
              )}
            </div>

            {/* Code promo / parrainage (facultatif) */}
            <div style={{marginBottom:24}}>
              <label style={{...Os.fieldLabel,display:"flex",alignItems:"center",gap:6}}>
                Code promo / parrainage
                <span style={{fontSize:10,fontWeight:500,color:C.light,textTransform:"none",letterSpacing:0}}>(facultatif)</span>
              </label>
              <div style={{
                ...Os.fieldWrap,
                borderColor: promoStatus==="valid" ? "#16A34A" : promoStatus==="invalid" ? "#EF4444" : undefined,
              }}>
                <span style={{fontSize:14,paddingLeft:2}}>🎁</span>
                <input
                  style={{...Os.fieldInput,textTransform:"uppercase",letterSpacing:1.2,fontFamily:"monospace"}}
                  type="text"
                  placeholder="ex. JEAN24"
                  value={form.promo}
                  onChange={e=>handlePromoChange(e.target.value)}
                  maxLength={20}
                />
                {promoStatus==="valid" && (
                  <svg width="16" height="16" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {promoStatus==="invalid" && (
                  <svg width="16" height="16" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                )}
              </div>
              {promoStatus==="valid" && (
                <p style={{fontSize:11,color:"#16A34A",marginTop:6,fontWeight:600}}>
                  ✓ Vous recevrez {POINTS_CONFIG.perReferral} pts de bienvenue à la création du compte
                </p>
              )}
              {promoStatus==="invalid" && (
                <p style={{fontSize:11,color:"#EF4444",marginTop:6}}>
                  Code invalide. Format attendu : 6+ caractères se terminant par 24
                </p>
              )}
              {!promoStatus && (
                <p style={{fontSize:11,color:C.light,marginTop:6}}>
                  Un ami vous a parrainé ? Entrez son code pour gagner {POINTS_CONFIG.perReferral} pts.
                </p>
              )}
            </div>

            <button
              style={{...Os.ctaBtn, opacity:(!form.name||!form.email||!form.phone||!form.pwd)?.5:1}}
              onClick={handleStep1}
            >
              Continuer →
            </button>
          </div>
        )}

        {/* Step 2 : Rôle */}
        {step===2 && (
          <div>
            <p style={{fontSize:22,fontWeight:800,color:C.black,marginBottom:6}}>Vous êtes…</p>
            <p style={{fontSize:14,color:C.mid,marginBottom:24}}>Choisissez votre rôle principal. Vous pourrez changer à tout moment.</p>

            {[
              {
                id:"locataire",
                title:"Locataire / Voyageur",
                sub:"Je cherche un logement ou un véhicule à louer.",
                emoji:"🔍",
                perks:["Rechercher des logements","Réserver et payer","Suivre mes voyages"],
              },
              {
                id:"bailleur",
                title:"Bailleur / Propriétaire",
                sub:"Je propose des biens ou véhicules à la location.",
                emoji:"🏠",
                perks:["Publier des annonces","Gérer les réservations","Recevoir les loyers"],
              },
            ].map(role=>(
              <button
                key={role.id}
                style={{...Os.roleCard,...(form.role===role.id?Os.roleCardOn:{})}}
                onClick={()=>set("role",role.id)}
              >
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
                  <div style={{width:48,height:48,borderRadius:14,background:form.role===role.id?"#FFF5F5":C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                    {role.emoji}
                  </div>
                  <div style={{flex:1,textAlign:"left"}}>
                    <p style={{fontSize:15,fontWeight:700,color:form.role===role.id?C.coral:C.black}}>{role.title}</p>
                    <p style={{fontSize:12,color:C.mid,marginTop:2}}>{role.sub}</p>
                  </div>
                  <div style={{width:20,height:20,borderRadius:10,border:`2px solid ${form.role===role.id?C.coral:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {form.role===role.id && <div style={{width:10,height:10,borderRadius:5,background:C.coral}}/>}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {role.perks.map(p=>(
                    <div key={p} style={{display:"flex",alignItems:"center",gap:7}}>
                      <svg width="13" height="13" fill="none" stroke={form.role===role.id?C.coral:"#9CA3AF"} strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{fontSize:12,color:C.mid}}>{p}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}

            <button style={{...Os.ctaBtn,marginTop:24}} onClick={handleStep2}>Continuer →</button>
          </div>
        )}

        {/* Step 3 : Vérification SMS */}
        {step===3 && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:72,height:72,borderRadius:36,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
              <svg width="32" height="32" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <p style={{fontSize:22,fontWeight:800,color:C.black,textAlign:"center",marginBottom:8}}>Vérifiez votre téléphone</p>
            <p style={{fontSize:14,color:C.mid,textAlign:"center",lineHeight:1.6,marginBottom:32}}>
              Nous avons envoyé un code SMS au<br/>
              <strong style={{color:C.black}}>{form.phone||"+237 6XX XXX XXX"}</strong>
            </p>

            {/* OTP inputs */}
            <div style={{display:"flex",gap:10,marginBottom:10}}>
              {code.map((v,i)=>(
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  value={v}
                  onChange={e=>{
                    const val=e.target.value.replace(/\D/,"");
                    const nc=[...code]; nc[i]=val; setCode(nc);
                    if(val&&i<4) document.getElementById(`otp-${i+1}`)?.focus();
                  }}
                  onKeyDown={e=>{ if(e.key==="Backspace"&&!v&&i>0) document.getElementById(`otp-${i-1}`)?.focus(); }}
                  style={{
                    width:52,height:58,borderRadius:14,textAlign:"center",fontSize:24,fontWeight:700,
                    border:`2px solid ${v?C.coral:C.border}`,outline:"none",
                    background:v?"#FFF5F5":C.white,color:C.black,
                    fontFamily:"'DM Sans',sans-serif",transition:"all .15s",
                  }}
                />
              ))}
            </div>
            <p style={{fontSize:12,color:C.light,marginBottom:err?12:32}}>
              Code SMS bientôt actif — pour l'instant, cliquez directement sur "Créer mon compte"
            </p>

            {err && (
              <p style={{fontSize:13,color:"#EF4444",marginBottom:16,textAlign:"center",padding:"10px 14px",background:"#FEF2F2",borderRadius:10,border:"1px solid #FECACA",width:"100%"}}>
                {err}
              </p>
            )}

            <button
              style={{...Os.ctaBtn,width:"100%",opacity:loading?.7:1}}
              onClick={handleVerify} disabled={loading}
            >
              {loading ? <div style={Os.spinner}/> : "Vérifier et créer mon compte ✓"}
            </button>
            <button style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.coral,fontWeight:600,fontFamily:"'DM Sans',sans-serif",marginTop:16}}>
              Renvoyer le code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SignupFieldIcon({ name }) {
  const icons = {
    user:  <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    mail:  <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    phone: <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  };
  return icons[name]||null;
}

/* ─── VERIFY EMAIL ───────────────────────────────────
   Affiché après signUp réussi quand Supabase exige
   confirmation email. Lien magique → l'event SIGNED_IN
   capté dans main.js basculera l'app automatiquement.
   ─────────────────────────────────────────────────── */
function VerifyEmailScreen({ email, onBack }) {
  const [resending, setResending] = useState(false);
  const [resentMsg, setResentMsg] = useState("");

  const handleResend = async () => {
    setResentMsg(""); setResending(true);
    const db = window.byer && window.byer.db;
    if (db && db.isReady && db.raw) {
      try {
        const { error } = await db.raw.auth.resend({ type: "signup", email });
        if (error) setResentMsg("Erreur : " + error.message);
        else setResentMsg("✓ Email renvoyé. Vérifiez votre boîte.");
      } catch (e) {
        setResentMsg("Erreur : " + (e.message || "inconnue"));
      }
    } else {
      setResentMsg("Mode hors-ligne — relancez l'app et réessayez.");
    }
    setResending(false);
  };

  return (
    <div style={Os.root}>
      <style>{AUTH_CSS}</style>

      {/* Header avec bouton retour */}
      <div style={{background:C.white,padding:"var(--top-pad) 20px 16px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${C.border}`}}>
        <button style={{background:"none",border:"none",cursor:"pointer",display:"flex"}} onClick={onBack}>
          <svg width="22" height="22" fill="none" stroke={C.dark} strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <p style={{fontSize:17,fontWeight:700,color:C.black}}>Vérification email</p>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 24px 40px",textAlign:"center"}}>
        <div style={{width:96,height:96,borderRadius:24,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24}}>
          <span style={{fontSize:48}}>📬</span>
        </div>

        <p style={{fontSize:24,fontWeight:800,color:C.black,marginBottom:12,lineHeight:1.25}}>
          Vérifiez votre email
        </p>

        <p style={{fontSize:14,color:C.mid,lineHeight:1.6,maxWidth:340,marginBottom:8}}>
          Nous avons envoyé un lien de confirmation à
        </p>
        <p style={{fontSize:15,fontWeight:700,color:C.black,marginBottom:24,wordBreak:"break-all",padding:"0 12px"}}>
          {email}
        </p>

        <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:12,padding:"14px 16px",marginBottom:28,maxWidth:360}}>
          <p style={{fontSize:13,color:"#166534",lineHeight:1.55,fontWeight:500}}>
            👉 Cliquez sur le lien dans l'email pour activer votre compte. L'app vous connectera automatiquement.
          </p>
        </div>

        {resentMsg && (
          <p style={{
            fontSize:13,marginBottom:14,padding:"8px 14px",borderRadius:10,
            background: resentMsg.startsWith("✓") ? "#F0FDF4" : "#FEF2F2",
            color:      resentMsg.startsWith("✓") ? "#166534" : "#EF4444",
            border:     "1px solid " + (resentMsg.startsWith("✓") ? "#BBF7D0" : "#FECACA"),
          }}>{resentMsg}</p>
        )}

        <button
          onClick={handleResend}
          disabled={resending}
          style={{
            background:"none",border:`1.5px solid ${C.border}`,
            padding:"12px 24px",borderRadius:12,fontSize:14,fontWeight:600,
            color:C.dark,cursor:resending?"not-allowed":"pointer",opacity:resending?.6:1,
            fontFamily:"'DM Sans',sans-serif",marginBottom:14,
          }}
        >
          {resending ? "Envoi…" : "Renvoyer l'email"}
        </button>

        <button
          onClick={onBack}
          style={{
            background:"none",border:"none",cursor:"pointer",
            fontSize:13,color:C.coral,fontWeight:700,
            fontFamily:"'DM Sans',sans-serif",
          }}
        >
          ← Retour à la connexion
        </button>

        <p style={{fontSize:11,color:C.light,marginTop:32,maxWidth:300,lineHeight:1.5}}>
          Vous ne recevez rien ? Vérifiez vos courriers indésirables ou contactez <strong>support@byer.cm</strong>
        </p>
      </div>
    </div>
  );
}
