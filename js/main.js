/* Byer — Main Entry Point */

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

// Mount
const container = document.getElementById('root');
const reactRoot = ReactDOM.createRoot(container);
reactRoot.render(<Root/>);
