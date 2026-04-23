/* Byer — Main Entry Point */

function Root() {
  const [screen, setScreen] = useState("splash"); // splash | onboarding | login | signup | app

  // Signal au loading screen (dans index.html) qu'on a fini de mount.
  // Plus propre que le poll innerHTML toutes les 200ms.
  useEffect(() => {
    window.dispatchEvent(new Event('byer-ready'));
  }, []);

  if (screen === "splash")      return <SplashScreen    onDone={()=>setScreen("onboarding")}/>;
  if (screen === "onboarding")  return <OnboardingScreen onDone={()=>setScreen("login")}/>;
  if (screen === "login")       return <LoginScreen      onLogin={()=>setScreen("app")} onSignup={()=>setScreen("signup")}/>;
  if (screen === "signup")      return <SignupScreen     onBack={()=>setScreen("login")} onDone={()=>setScreen("app")}/>;
  return <ByerApp/>;
}

// Mount
const container = document.getElementById('root');
const reactRoot = ReactDOM.createRoot(container);
reactRoot.render(<Root/>);
