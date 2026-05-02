/* ═══════════════════════════════════════════════════════════════════
   Byer — Admin App (admin.html entry point)
   ═══════════════════════════════════════════════════════════════════
   Console admin séparée pour Pino (et futurs admins). Servie sur
   https://byer.landonjouajosephpino.workers.dev/admin.html

   Sécurité (defense in depth) :
     1. Frontend gating : check ADMIN_EMAILS sur le user authentifié
     2. Backend gating : RLS Postgres via fonction is_byer_admin()
        (mig 0017) qui vérifie auth.jwt() ->> 'email' contre la
        whitelist SQL.
     Si l'un des deux échoue, l'admin ne voit rien.

   Sections :
     • Reversements bailleurs (PayoutsAdminScreen, réutilise le code v70)
     • Modération KYC (KycAdminScreen, réutilise l'existant)
     • Bientôt : annonces à modérer, comptes utilisateurs, support tickets
   ═══════════════════════════════════════════════════════════════════ */

// Whitelist en dur — gardée synchronisée avec ADMIN_EMAILS dans app.js
// et la fonction SQL is_byer_admin() dans mig 0017.
const ADMIN_EMAILS_LIST = ["pinolando120@gmail.com"];

function AdminApp() {
  const [authState, setAuthState] = useState({ status: "loading", user: null });
  const [section, setSection]     = useState("payouts"); // 'payouts' | 'kyc'

  // Mount-once : bootstrap session
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const db = window.byer && window.byer.db;
        if (!db || !db.isReady) {
          if (!cancelled) setAuthState({ status: "error", user: null, err: "Supabase indisponible" });
          return;
        }
        const { data: sess } = await db.auth.getSession();
        const user = sess && sess.session && sess.session.user;
        if (cancelled) return;
        if (!user) {
          setAuthState({ status: "anon", user: null });
          return;
        }
        const email = (user.email || "").toLowerCase();
        const isAdmin = ADMIN_EMAILS_LIST.includes(email);
        setAuthState({ status: isAdmin ? "admin" : "forbidden", user });
      } catch (e) {
        if (!cancelled) setAuthState({ status: "error", user: null, err: e?.message || "boot error" });
      }
    })();
    // Signal ready pour que le loader HTML disparaisse
    try { window.dispatchEvent(new Event("byer-admin-ready")); } catch (_) {}
    return () => { cancelled = true; };
  }, []);

  if (authState.status === "loading") {
    return <FullScreenMessage title="Chargement…" sub="Vérification de votre session"/>;
  }

  if (authState.status === "error") {
    return <FullScreenMessage title="Erreur" sub={authState.err || "Impossible de charger la console admin"} icon="⚠️" color="#DC2626"/>;
  }

  if (authState.status === "anon") {
    return <AdminLoginScreen onLoggedIn={() => window.location.reload()}/>;
  }

  if (authState.status === "forbidden") {
    return (
      <FullScreenMessage
        title="Accès refusé"
        sub={`L'email ${authState.user?.email || "(inconnu)"} n'est pas un compte admin Byer.`}
        icon="🚫"
        color="#DC2626"
        action={
          <button
            onClick={async () => {
              try { await window.byer.db.auth.signOut(); } catch (_) {}
              window.location.reload();
            }}
            style={btnStyle("#1A1A1A", "#fff")}
          >
            Se déconnecter
          </button>
        }
      />
    );
  }

  // ─── Admin authentifié : rend la console
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#F7F7F7", fontFamily:"'DM Sans',sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: "#1A1A1A",
        color: "#fff",
        padding: "24px 16px",
        position: "sticky",
        top: 0,
        height: "100vh",
        boxSizing: "border-box",
        display:"flex", flexDirection:"column",
      }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
            Byer <span style={{ color: "#FF5A5F" }}>Admin</span>
          </div>
          <p style={{ fontSize: 11, color: "#9B9B9B", marginTop: 4 }}>
            {authState.user?.email}
          </p>
        </div>

        <nav style={{ display:"flex", flexDirection:"column", gap: 4 }}>
          <SidebarItem
            label="💰 Reversements"
            active={section === "payouts"}
            onClick={() => setSection("payouts")}
          />
          <SidebarItem
            label="🪪 Modération KYC"
            active={section === "kyc"}
            onClick={() => setSection("kyc")}
          />
        </nav>

        <div style={{ marginTop:"auto", paddingTop:24, borderTop:"1px solid #333" }}>
          <a
            href="/"
            style={{ ...sidebarLinkStyle, fontSize:12 }}
          >
            ← Retour à l'app Byer
          </a>
          <button
            onClick={async () => {
              try { await window.byer.db.auth.signOut(); } catch (_) {}
              window.location.reload();
            }}
            style={{
              ...sidebarLinkStyle,
              fontSize:12,
              background:"none",
              border:"none",
              cursor:"pointer",
              width:"100%",
              textAlign:"left",
              padding: "8px 12px",
              color: "#9B9B9B",
            }}
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        {section === "payouts" && <PayoutsAdminScreen onBack={() => {}}/>}
        {section === "kyc"     && (typeof KycAdminScreen !== "undefined"
                                    ? <KycAdminScreen onBack={() => {}}/>
                                    : <FullScreenMessage title="KYC indisponible" sub="Module KYC non chargé."/>)}
      </main>
    </div>
  );
}

/* ─── Sidebar item ─────────────────────────────────────────────── */
function SidebarItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...sidebarLinkStyle,
        padding: "10px 12px",
        background: active ? "rgba(255,90,95,.15)" : "transparent",
        color: active ? "#FF5A5F" : "#fff",
        fontWeight: active ? 700 : 500,
        border: "none",
        borderLeft: active ? "3px solid #FF5A5F" : "3px solid transparent",
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        fontSize: 14,
        borderRadius: 6,
        transition: "all .15s",
      }}
    >
      {label}
    </button>
  );
}

const sidebarLinkStyle = {
  display: "block",
  textDecoration: "none",
  fontFamily: "'DM Sans',sans-serif",
};

/* ─── Login Screen pour admin (anon initial) ───────────────────── */
function AdminLoginScreen({ onLoggedIn }) {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) {
      setError("Entrez votre email et mot de passe.");
      return;
    }
    setLoading(true);
    try {
      const db = window.byer && window.byer.db;
      const { error: authErr } = await db.auth.signIn(email.trim(), password);
      if (authErr) {
        setLoading(false);
        setError(authErr.message || "Identifiants invalides");
        return;
      }
      onLoggedIn && onLoggedIn();
    } catch (e) {
      setLoading(false);
      setError(e?.message || "Erreur de connexion");
    }
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"#1A1A1A", padding:20, fontFamily:"'DM Sans',sans-serif",
    }}>
      <div style={{
        background:"#fff", padding:"32px 28px", borderRadius:18,
        maxWidth:420, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,.4)",
      }}>
        <div style={{ fontSize:30, fontWeight:800, marginBottom:6, letterSpacing:-1 }}>
          Byer <span style={{ color:"#FF5A5F" }}>Admin</span>
        </div>
        <p style={{ fontSize:13, color:"#6B6B6B", marginBottom:24 }}>
          Console admin réservée. Connectez-vous avec votre compte admin Byer.
        </p>

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="admin@byer.cm"
          style={inputStyle}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <label style={labelStyle}>Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          style={inputStyle}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {error && (
          <div style={{
            background:"#FEE2E2", border:"1px solid #FCA5A5", color:"#991B1B",
            padding:"10px 12px", borderRadius:10, fontSize:13, marginBottom:14,
          }}>⚠️ {error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            ...btnStyle("#FF5A5F", "#fff"),
            width:"100%", padding:"14px", fontSize:15,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p style={{ fontSize:11, color:"#9B9B9B", marginTop:16, textAlign:"center" }}>
          Vous n'êtes pas admin ? <a href="/" style={{ color:"#FF5A5F" }}>Retour à Byer</a>
        </p>
      </div>
    </div>
  );
}

/* ─── Helpers UI ─────────────────────────────────────────────── */
function FullScreenMessage({ title, sub, icon, color, action }) {
  return (
    <div style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:24,
      background:"#F7F7F7", textAlign:"center", fontFamily:"'DM Sans',sans-serif",
    }}>
      {icon && <div style={{ fontSize:54, marginBottom:12 }}>{icon}</div>}
      <h1 style={{ fontSize:20, fontWeight:800, color: color || "#1A1A1A", marginBottom:8 }}>{title}</h1>
      {sub && <p style={{ fontSize:14, color:"#6B6B6B", maxWidth:420, lineHeight:1.5 }}>{sub}</p>}
      {action && <div style={{ marginTop:20 }}>{action}</div>}
    </div>
  );
}

const labelStyle = {
  fontSize:12, fontWeight:600, color:"#1A1A1A", marginBottom:6, display:"block", marginTop:14,
};
const inputStyle = {
  width:"100%", padding:"12px 14px", borderRadius:10,
  border:"1.5px solid #EBEBEB", fontSize:14,
  fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box",
};
function btnStyle(bg, color) {
  return {
    padding:"10px 16px", borderRadius:10, border:"none",
    background: bg, color: color, fontSize:14, fontWeight:700,
    cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
  };
}
