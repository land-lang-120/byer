/* Byer — Main Entry Point */

/* ═══════════════════════════════════════════════════
   ErrorBoundary — filet de sécurité React
   Capture toute exception non gérée pendant le render et affiche un
   fallback humain au lieu du white-screen. Sans ça, n'importe quelle
   erreur (props undefined, API inattendue) tue toute l'app.
   ═══════════════════════════════════════════════════ */
class ByerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // Log console pour debug en dev / Sentry plus tard.
    // En prod, ce log finit dans la console DevTools — utile si Pino reproduit.
    console.error("[byer] ErrorBoundary caught:", error, info && info.componentStack);
  }
  handleReload = () => {
    try {
      // Hard reload — bypass le SW pour récupérer la dernière version
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((r) => r.update().catch(()=>{}));
        });
      }
    } catch (e) {}
    window.location.reload();
  };
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{
        position:"fixed", inset:0, background:"#F7F7F7",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding:24, fontFamily:"DM Sans, sans-serif", textAlign:"center", zIndex:9999,
      }}>
        <div style={{
          width:64, height:64, borderRadius:32, background:"#FF5A5F",
          display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20,
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h1 style={{ fontSize:20, fontWeight:700, color:"#222", margin:"0 0 8px" }}>
          Oups, un souci technique
        </h1>
        <p style={{ fontSize:14, color:"#666", lineHeight:1.5, maxWidth:340, margin:"0 0 24px" }}>
          L'application a rencontré une erreur inattendue. Nos équipes sont notifiées.
          Recharge la page pour continuer.
        </p>
        <button
          onClick={this.handleReload}
          style={{
            background:"#FF5A5F", color:"white", border:"none", borderRadius:14,
            padding:"14px 28px", fontSize:15, fontWeight:600, cursor:"pointer",
            boxShadow:"0 4px 12px rgba(255,90,95,0.3)", fontFamily:"DM Sans, sans-serif",
          }}
        >
          Recharger l'application
        </button>
        {this.state.error && (
          <details style={{ marginTop:24, fontSize:11, color:"#999", maxWidth:340 }}>
            <summary style={{ cursor:"pointer" }}>Détails techniques</summary>
            <pre style={{ textAlign:"left", overflow:"auto", padding:8, background:"#fff", borderRadius:6, marginTop:8, fontFamily:"monospace", fontSize:10, color:"#666" }}>
              {String(this.state.error.message || this.state.error)}
            </pre>
          </details>
        )}
      </div>
    );
  }
}

function Root() {
  const [screen, setScreen] = useState("splash"); // splash | onboarding | login | signup | forgot | verify | app
  const [forgotPrefill, setForgotPrefill] = useState("");
  const [verifyEmail, setVerifyEmail]     = useState("");
  const [bootChecked, setBootChecked]     = useState(false);

  // ─────────────────────────────────────────────────────────────
  // 1) BOOT : signale au loader qu'on est mount + check session existante.
  //    Si une session Supabase est déjà active (l'utilisateur s'est déjà
  //    connecté avant), on skip splash/onboarding/login et on l'envoie
  //    directement dans l'app — comme Airbnb/WhatsApp.
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    window.dispatchEvent(new Event('byer-ready'));

    let mounted = true;
    (async () => {
      if (window.byer && window.byer.db && window.byer.db.isReady) {
        try {
          const { data } = await window.byer.db.auth.getSession();
          if (mounted && data && data.session) {
            // Session active → on saute direct à l'app
            setScreen("app");
          }
        } catch (e) { /* offline ou clés invalides → on reste sur splash */ }
      }
      if (mounted) setBootChecked(true);
    })();

    // 2) ÉCOUTE les changements de session (login depuis un autre onglet,
    //    expiration de token, magic link revenant en hash, etc.)
    let unsub = () => {};
    if (window.byer && window.byer.db && window.byer.db.isReady) {
      const { data: sub } = window.byer.db.auth.onAuthChange((event, session) => {
        if (event === "SIGNED_IN" && session) setScreen("app");
        if (event === "SIGNED_OUT")           setScreen("login");
      });
      // sub est un wrapper { subscription: { unsubscribe } } selon Supabase v2
      unsub = () => { try { sub.subscription.unsubscribe(); } catch (e) {} };
    }

    return () => { mounted = false; unsub(); };
  }, []);

  // Handler SSO réel (Google / Apple / Facebook)
  const handleSSO = async (provider) => {
    if (!window.byer || !window.byer.db || !window.byer.db.isReady) {
      alert(`Connexion via ${provider} bientôt disponible.`);
      return;
    }
    const map = { Google: "google", Apple: "apple", Facebook: "facebook" };
    const { error } = await window.byer.db.auth.signInOAuth(map[provider] || provider.toLowerCase());
    if (error) alert(`Erreur ${provider} : ${error.message}`);
  };

  // Logout : déconnecte aussi la session Supabase puis revient au login
  const handleLogout = async () => {
    if (window.byer && window.byer.db && window.byer.db.isReady) {
      try { await window.byer.db.auth.signOut(); } catch (e) {}
    }
    setScreen("login");
  };

  if (screen === "splash")      return <SplashScreen    onDone={()=>setScreen("onboarding")}/>;
  if (screen === "onboarding")  return <OnboardingScreen onDone={()=>setScreen("login")}/>;
  if (screen === "login")       return <LoginScreen
                                          onLogin={()=>setScreen("app")}
                                          onSignup={()=>setScreen("signup")}
                                          onSSO={handleSSO}
                                          onForgotPassword={(em)=>{setForgotPrefill(em||"");setScreen("forgot");}}
                                        />;
  if (screen === "signup")      return <SignupScreen
                                          onBack={()=>setScreen("login")}
                                          onDone={()=>setScreen("app")}
                                          onNeedVerify={(em)=>{ setVerifyEmail(em); setScreen("verify"); }}
                                        />;
  if (screen === "verify")      return <VerifyEmailScreen email={verifyEmail} onBack={()=>setScreen("login")}/>;
  if (screen === "forgot")      return <ForgotPasswordScreen prefillEmail={forgotPrefill} onBack={()=>setScreen("login")}/>;
  return <ByerApp onLogout={handleLogout}/>;
}

// Mount — Root est wrappé dans ErrorBoundary pour qu'aucune exception React
// ne white-screen l'app. Si une erreur tape dans un sous-composant, on affiche
// un fallback "Oups, recharger" plutôt qu'un écran blanc opaque.
const container = document.getElementById('root');
const reactRoot = ReactDOM.createRoot(container);
reactRoot.render(
  <ByerErrorBoundary>
    <Root/>
  </ByerErrorBoundary>
);
