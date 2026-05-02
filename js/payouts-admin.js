/* ═══════════════════════════════════════════════════════════════════
   Byer — Payouts Admin Dashboard (v70)
   ═══════════════════════════════════════════════════════════════════
   Écran réservé à l'admin (Pino) pour inspecter le système de payout
   automatique. Données :
     • Liste des payouts (filtrés par status via tabs)
     • Stats du mois en cours (commission Byer encaissée, total reversé,
       payouts en attente, payouts en échec)
     • Bouton "Retry" sur les payouts failed → invoke payout-host
   ═══════════════════════════════════════════════════════════════════ */

const PAYOUT_STATUS_TABS = [
  { id: "pending",    label: "En attente",  color: "#6366F1" },
  { id: "processing", label: "En cours",    color: "#0891B2" },
  { id: "paid",       label: "Reversés",    color: "#16A34A" },
  { id: "failed",     label: "Échecs",      color: "#DC2626" },
];

const PAYOUT_METHOD_LABELS = {
  mtn_momo:     "MTN MoMo",
  orange_money: "Orange Money",
  bank_transfer: "Virement",
  card:         "Carte",
};

function fmtFCFA(n) {
  if (n == null) return "—";
  try { return new Intl.NumberFormat("fr-FR").format(n) + " FCFA"; }
  catch (_) { return n + " FCFA"; }
}

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
      + " " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  } catch (_) { return iso; }
}

function PayoutsAdminScreen({ onBack }) {
  const [activeTab, setActiveTab] = useState("pending");
  const [payouts, setPayouts]     = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [retrying, setRetrying]   = useState({});  // {payoutId: true}

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError("");
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady) {
      setError("Connexion DB indisponible.");
      setLoading(false);
      return;
    }
    try {
      // Liste payouts filtrés par tab
      const { data: rows, error: e1 } = await db.raw
        .from("payouts")
        .select(`
          id, booking_id, host_id, amount_gross, commission_byer, amount_net,
          currency, status, due_at, paid_at, payout_ref, payout_phone,
          payout_method, failure_reason, created_at,
          bookings(ref, checkin, checkout, listings(title, city)),
          host:profiles!host_id(name, payout_name)
        `)
        .eq("status", activeTab)
        .order("created_at", { ascending: false })
        .limit(100);
      if (e1) throw e1;
      setPayouts(rows || []);

      // Stats du mois en cours (vue byer_payouts_stats)
      const { data: statsRows } = await db.raw
        .from("byer_payouts_stats")
        .select("*")
        .order("month", { ascending: false })
        .limit(1);
      setStats((statsRows && statsRows[0]) || null);
    } catch (e) {
      setError("Erreur de chargement : " + (e.message || "inconnue"));
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  React.useEffect(() => { refresh(); }, [refresh]);

  const handleRetry = async (payout) => {
    setRetrying(prev => ({ ...prev, [payout.id]: true }));
    try {
      const SUPABASE_URL_ = (typeof SUPABASE_URL !== "undefined") ? SUPABASE_URL : "";
      const ANON_KEY_     = (typeof SUPABASE_ANON_KEY !== "undefined") ? SUPABASE_ANON_KEY : "";
      const res = await fetch(`${SUPABASE_URL_}/functions/v1/payout-host`, {
        method: "POST",
        headers: {
          "apikey":        ANON_KEY_,
          "Authorization": `Bearer ${ANON_KEY_}`,
          "Content-Type":  "application/json",
        },
        body: JSON.stringify({ payout_id: payout.id }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert("Retry échoué : " + (json?.error || res.status));
      } else {
        // Refresh la liste
        await refresh();
      }
    } catch (e) {
      alert("Erreur retry : " + (e.message || "inconnue"));
    } finally {
      setRetrying(prev => { const n = { ...prev }; delete n[payout.id]; return n; });
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, paddingBottom:80 }}>
      {/* Header */}
      <div style={{
        display:"flex", alignItems:"center", padding:"14px 16px",
        background:C.white, borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:10,
      }}>
        <button onClick={onBack} style={{
          background:"none", border:"none", fontSize:22, color:C.dark,
          cursor:"pointer", marginRight:12, padding:0,
        }}>‹</button>
        <h1 style={{ fontSize:18, fontWeight:800, color:C.black, margin:0 }}>Reversements bailleurs</h1>
        <button onClick={refresh} disabled={loading} style={{
          marginLeft:"auto", background:"none", border:"none", fontSize:14,
          color: loading ? C.light : C.coral, cursor: loading ? "wait" : "pointer", padding:8,
        }}>
          ↻ {loading ? "..." : ""}
        </button>
      </div>

      {/* v70 — Quick links Notch Pay : ouvre les sections clés du dashboard
          NP dans un nouvel onglet. Permet d'aller voir le solde, les
          transferts détaillés, les retraits, sans avoir à recoder ces
          vues côté Byer (Notch Pay les gère déjà très bien). */}
      <div style={{
        display:"flex", gap:8, padding:"12px 16px", background:C.white,
        borderBottom:`1px solid ${C.border}`, flexWrap:"wrap",
      }}>
        <a
          href="https://business.notchpay.co/transfers"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex:"1 1 140px", padding:"10px 12px", borderRadius:10,
            background:"#F0FDF4", border:"1px solid #BBF7D0",
            color:"#16A34A", fontSize:13, fontWeight:600,
            textDecoration:"none", textAlign:"center",
            fontFamily:"'DM Sans',sans-serif",
          }}
        >
          📤 Transferts NP ↗
        </a>
        <a
          href="https://business.notchpay.co/payments"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex:"1 1 140px", padding:"10px 12px", borderRadius:10,
            background:"#EFF6FF", border:"1px solid #BFDBFE",
            color:"#2563EB", fontSize:13, fontWeight:600,
            textDecoration:"none", textAlign:"center",
            fontFamily:"'DM Sans',sans-serif",
          }}
        >
          📥 Paiements NP ↗
        </a>
        <a
          href="https://business.notchpay.co/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex:"1 1 140px", padding:"10px 12px", borderRadius:10,
            background:"#FEF3C7", border:"1px solid #FDE68A",
            color:"#92400E", fontSize:13, fontWeight:600,
            textDecoration:"none", textAlign:"center",
            fontFamily:"'DM Sans',sans-serif",
          }}
        >
          💰 Solde NP ↗
        </a>
      </div>

      {/* Stats du mois en cours */}
      {stats && (
        <div style={{ padding:"16px", background:C.white, borderBottom:`1px solid ${C.border}` }}>
          <p style={{ fontSize:12, color:C.mid, marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>
            Mois en cours ({stats.month})
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <StatCard label="Commission Byer" value={fmtFCFA(stats.commission_paid)} color="#16A34A"/>
            <StatCard label="Total reversé" value={fmtFCFA(stats.net_paid)} color="#0891B2"/>
            <StatCard label="En attente" value={fmtFCFA(stats.gross_pending)} color="#6366F1"/>
            <StatCard label="Échecs" value={(stats.failed_count || 0) + " payouts"} color="#DC2626"/>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display:"flex", padding:"12px 16px", gap:8, overflowX:"auto",
        background:C.white, borderBottom:`1px solid ${C.border}`,
      }}>
        {PAYOUT_STATUS_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding:"8px 14px", borderRadius:20,
            border: activeTab === tab.id ? "none" : `1.5px solid ${C.border}`,
            background: activeTab === tab.id ? tab.color : C.white,
            color: activeTab === tab.id ? C.white : C.dark,
            fontSize:13, fontWeight:600, cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap",
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div style={{ padding:"12px 16px" }}>
        {error && (
          <div style={{
            background:"#FEE2E2", border:"1px solid #FCA5A5", color:"#991B1B",
            padding:"10px 12px", borderRadius:10, fontSize:13, marginBottom:12,
          }}>⚠️ {error}</div>
        )}

        {loading && <p style={{ color:C.mid, textAlign:"center", padding:24 }}>Chargement…</p>}

        {!loading && payouts.length === 0 && (
          <p style={{ color:C.mid, textAlign:"center", padding:24, fontSize:14 }}>
            Aucun payout dans cette catégorie.
          </p>
        )}

        {!loading && payouts.map(p => (
          <PayoutCard
            key={p.id}
            payout={p}
            onRetry={p.status === "failed" ? () => handleRetry(p) : null}
            isRetrying={!!retrying[p.id]}
          />
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background:C.bg, borderRadius:12, padding:"12px 14px",
      borderLeft:`3px solid ${color}`,
    }}>
      <p style={{ fontSize:11, color:C.mid, marginBottom:4 }}>{label}</p>
      <p style={{ fontSize:15, fontWeight:700, color:C.black, margin:0 }}>{value}</p>
    </div>
  );
}

function PayoutCard({ payout, onRetry, isRetrying }) {
  const tab = PAYOUT_STATUS_TABS.find(t => t.id === payout.status);
  const listingTitle = payout.bookings?.listings?.title || "—";
  const hostName = payout.host?.payout_name || payout.host?.name || "—";
  const methodLabel = PAYOUT_METHOD_LABELS[payout.payout_method] || payout.payout_method || "—";

  return (
    <div style={{
      background:C.white, borderRadius:12, padding:"14px",
      marginBottom:10, border:`1px solid ${C.border}`,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:14, fontWeight:700, color:C.black, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {listingTitle}
          </p>
          <p style={{ fontSize:12, color:C.mid }}>
            {payout.bookings?.ref || payout.booking_id?.slice(0, 8)}
          </p>
        </div>
        <span style={{
          padding:"3px 10px", borderRadius:10, fontSize:11, fontWeight:600,
          background: (tab?.color || C.mid) + "20", color: tab?.color || C.mid,
          whiteSpace:"nowrap",
        }}>
          {tab?.label || payout.status}
        </span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:12, color:C.dark, marginBottom:8 }}>
        <div>
          <span style={{ color:C.mid }}>Bailleur :</span> <strong>{hostName}</strong>
        </div>
        <div>
          <span style={{ color:C.mid }}>Méthode :</span> <strong>{methodLabel}</strong>
        </div>
        <div>
          <span style={{ color:C.mid }}>Numéro :</span> <strong>{payout.payout_phone || "—"}</strong>
        </div>
        <div>
          <span style={{ color:C.mid }}>Montant net :</span> <strong>{fmtFCFA(payout.amount_net)}</strong>
        </div>
        <div>
          <span style={{ color:C.mid }}>Commission Byer :</span> {fmtFCFA(payout.commission_byer)}
        </div>
        <div>
          <span style={{ color:C.mid }}>Brut payé :</span> {fmtFCFA(payout.amount_gross)}
        </div>
      </div>

      <div style={{ fontSize:11, color:C.mid, marginBottom: payout.failure_reason || onRetry ? 8 : 0 }}>
        {payout.status === "paid" && payout.paid_at
          ? `Payé le ${fmtDate(payout.paid_at)}`
          : payout.status === "pending"
          ? `Éligible le ${fmtDate(payout.due_at)}`
          : `Créé le ${fmtDate(payout.created_at)}`}
        {payout.payout_ref ? ` · ref: ${payout.payout_ref.slice(0, 24)}` : ""}
      </div>

      {payout.failure_reason && (
        <div style={{
          background:"#FEE2E2", border:"1px solid #FCA5A5", color:"#991B1B",
          padding:"8px 10px", borderRadius:8, fontSize:12, marginBottom: onRetry ? 8 : 0,
        }}>
          ⚠️ {payout.failure_reason}
        </div>
      )}

      {onRetry && (
        <button onClick={onRetry} disabled={isRetrying} style={{
          width:"100%", padding:"10px", borderRadius:10, border:"none",
          background: isRetrying ? C.border : C.coral,
          color: isRetrying ? C.mid : C.white,
          fontSize:13, fontWeight:700, cursor: isRetrying ? "wait" : "pointer",
          fontFamily:"'DM Sans',sans-serif",
        }}>
          {isRetrying ? "Retry en cours…" : "↻ Réessayer ce payout"}
        </button>
      )}
    </div>
  );
}
