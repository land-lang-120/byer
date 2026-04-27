/* ═══════════════════════════════════════════════════
   Byer — KYC UI
   ─────────────────────────────────────────────────────
   Deux composants exposés :
     • KycUploadSheet — feuille modale côté utilisateur :
         charge la liste des docs déjà soumis (db.kyc.list),
         affiche leur statut (pending / approved / rejected),
         permet d'uploader CNI / Passeport / Permis / Selfie.
     • KycAdminScreen — écran admin (gating via email) :
         appelle l'Edge Function `kyc-review` pour lister les
         pending et les approuver/rejeter avec preview + motif.
   ─────────────────────────────────────────────────────
   Pourquoi un module à part : la logique upload + admin est
   isolée du reste du profil pour qu'on puisse la rebrancher
   ailleurs (settings, dashboard) sans dupliquer.
   ═══════════════════════════════════════════════════ */

/* ── Types de documents acceptés ──────────────────── */
const KYC_DOC_TYPES = [
  { id: "id_card",        label: "Carte nationale d'identité", emoji: "🪪" },
  { id: "passport",       label: "Passeport",                   emoji: "🛂" },
  { id: "driver_license", label: "Permis de conduire",          emoji: "🚗" },
  { id: "selfie",         label: "Selfie de vérification",      emoji: "🤳" },
];

/* ── Helpers status → couleur/label ──────────────── */
function kycStatusBadge(status) {
  switch (status) {
    case "approved":
      return { color: "#16A34A", bg: "rgba(22,163,74,.10)", label: "Validé ✓", icon: "✅" };
    case "rejected":
      return { color: "#DC2626", bg: "rgba(220,38,38,.10)", label: "Refusé ✗", icon: "❌" };
    case "pending":
      return { color: "#D97706", bg: "rgba(217,119,6,.10)", label: "En cours…", icon: "⏳" };
    default:
      return { color: C.mid, bg: "rgba(0,0,0,.04)",        label: "Non soumis", icon: "—" };
  }
}

/* ────────────────────────────────────────────────────
   KycUploadSheet : modal pour uploader / suivre KYC
   ──────────────────────────────────────────────────── */
function KycUploadSheet({ open, onClose }) {
  const [docs, setDocs]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [uploading, setUploading] = useState(null); // doc_type en cours d'upload
  const [toast, setToast]       = useState("");
  const [userId, setUserId]     = useState(null);
  const fileInputRef            = useRef(null);
  const pendingTypeRef          = useRef(null); // type cible quand l'input file s'ouvre

  // Recharge la liste des docs depuis la DB. Mémoïsé via useCallback pour
  // pouvoir l'appeler depuis useEffect ET après chaque upload.
  const refresh = React.useCallback(async () => {
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady) {
      setDocs([]);
      return;
    }
    setLoading(true);
    try {
      const { data: sess } = await db.auth.getSession();
      const uid = sess?.session?.user?.id;
      if (!uid) {
        setDocs([]);
        setUserId(null);
        return;
      }
      setUserId(uid);
      const { data, error } = await db.kyc.list(uid);
      if (error) {
        console.warn("[byer] kyc.list error:", error.message);
        setDocs([]);
      } else {
        setDocs(data || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch chaque ouverture (l'admin peut avoir validé entre 2 ouvertures).
  useEffect(() => { if (open) refresh(); }, [open, refresh]);

  // Pour chaque type, on ne garde que le doc le plus récent (la table
  // garde l'historique mais l'UI affiche la dernière soumission).
  const latestByType = React.useMemo(() => {
    const map = {};
    for (const d of docs) {
      const cur = map[d.doc_type];
      if (!cur || new Date(d.uploaded_at) > new Date(cur.uploaded_at)) {
        map[d.doc_type] = d;
      }
    }
    return map;
  }, [docs]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const triggerFilePick = (docType) => {
    pendingTypeRef.current = docType;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    const docType = pendingTypeRef.current;
    // Reset l'input pour permettre de re-sélectionner le même fichier après
    e.target.value = "";
    pendingTypeRef.current = null;
    if (!file || !docType) return;

    // Garde-fous client : taille max 5 Mo + type image/pdf seulement.
    // (Les RLS storage refusent aussi mais autant échouer vite côté UI.)
    const MAX = 5 * 1024 * 1024;
    if (file.size > MAX) {
      showToast("Fichier trop gros (max 5 Mo)");
      return;
    }
    if (!/^image\/(png|jpe?g|webp)$|^application\/pdf$/.test(file.type)) {
      showToast("Format accepté : PNG, JPG, WEBP ou PDF");
      return;
    }

    const db = window.byer && window.byer.db;
    if (!db || !db.isReady || !userId) {
      showToast("Service indisponible — réessayez plus tard");
      return;
    }

    setUploading(docType);
    try {
      const { error } = await db.kyc.upload(file, userId, docType);
      if (error) {
        // Cas typique : violation de l'index unique partiel (déjà approuvé).
        const msg = /duplicate|unique/i.test(error.message)
          ? "Ce document est déjà validé."
          : `Échec : ${error.message}`;
        showToast(msg);
      } else {
        showToast("Document soumis ✓ — vérification en cours");
        await refresh();
      }
    } catch (err) {
      showToast("Erreur réseau, réessayez");
    } finally {
      setUploading(null);
    }
  };

  if (!open) return null;

  // Styles inline (cohérent avec le reste de Byer qui n'utilise pas de CSS Modules)
  const overlay = {
    position:"fixed", inset:0, background:"rgba(0,0,0,.45)",
    zIndex:1500, display:"flex", alignItems:"flex-end", justifyContent:"center",
  };
  const sheet = {
    width:"100%", maxWidth:520, background:C.white, borderRadius:"20px 20px 0 0",
    maxHeight:"86vh", overflowY:"auto", padding:"22px 20px 32px",
    fontFamily:"DM Sans, sans-serif", animation:"sheetUp .3s ease",
  };
  const header = { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 };
  const title  = { fontSize:18, fontWeight:700, color:C.black };
  const close  = { background:"none", border:"none", fontSize:22, color:C.mid, cursor:"pointer", padding:4 };
  const subtitle = { fontSize:13, color:C.mid, lineHeight:1.5, marginBottom:18 };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <div style={title}>Vérification d'identité (KYC)</div>
          <button style={close} onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        <div style={subtitle}>
          <strong>KYC</strong> = "Know Your Customer". Pour louer ou publier une annonce,
          on a besoin de vérifier qui vous êtes via une <strong>pièce d'identité officielle</strong> (carte
          nationale, passeport ou permis). Vos documents sont chiffrés et examinés sous 24h.
          <br/><span style={{color:C.light}}>Formats : PNG/JPG/WEBP/PDF · 5 Mo max.</span>
        </div>

        {loading && <div style={{textAlign:"center", padding:30, color:C.mid, fontSize:13}}>Chargement…</div>}

        {!loading && KYC_DOC_TYPES.map((dt) => {
          const cur = latestByType[dt.id];
          const badge = kycStatusBadge(cur?.status);
          const isUploading = uploading === dt.id;
          const isApproved  = cur?.status === "approved";
          const isPending   = cur?.status === "pending";

          // CTA texte change selon l'état :
          //  • approved → désactivé ("Validé")
          //  • pending  → "Remplacer" possible (rare mais utile si erreur upload)
          //  • rejected → "Re-soumettre"
          //  • absent   → "Soumettre"
          const ctaLabel = isApproved
            ? "Validé"
            : isUploading ? "Envoi…"
            : isPending   ? "Remplacer"
            : cur?.status === "rejected" ? "Re-soumettre"
            : "Soumettre";

          return (
            <div key={dt.id} style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"14px 12px", marginBottom:10,
              border:`1px solid ${C.border}`, borderRadius:14, background:C.white,
            }}>
              <div style={{fontSize:26, lineHeight:1}}>{dt.emoji}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:14, fontWeight:600, color:C.black}}>{dt.label}</div>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:6,
                  marginTop:4, padding:"3px 10px", borderRadius:12,
                  fontSize:11, fontWeight:600,
                  color:badge.color, background:badge.bg,
                }}>
                  {badge.label}
                </div>
                {cur?.status === "rejected" && cur.reject_reason && (
                  <div style={{fontSize:12, color:"#DC2626", marginTop:6, lineHeight:1.4}}>
                    Motif : {cur.reject_reason}
                  </div>
                )}
              </div>
              <button
                disabled={isApproved || isUploading}
                onClick={() => triggerFilePick(dt.id)}
                style={{
                  background: isApproved ? C.bg : C.coral,
                  color: isApproved ? C.light : C.white,
                  border:"none",
                  padding:"9px 14px", borderRadius:10,
                  fontSize:12, fontWeight:700,
                  cursor: isApproved || isUploading ? "default" : "pointer",
                  opacity: isUploading ? 0.7 : 1,
                  fontFamily:"inherit",
                  whiteSpace:"nowrap",
                }}
              >
                {ctaLabel}
              </button>
            </div>
          );
        })}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          style={{display:"none"}}
          onChange={handleFileChange}
        />

        <div style={{fontSize:11, color:C.light, lineHeight:1.5, marginTop:18, textAlign:"center"}}>
          🔒 Vos pièces sont stockées dans un bucket privé chiffré. Seul un admin
          Byer y accède pour la vérification. Aucune donnée n'est partagée à des tiers.
        </div>

        {toast && (
          <div style={{
            position:"fixed", bottom:30, left:"50%", transform:"translateX(-50%)",
            background:C.dark, color:C.white, padding:"10px 18px", borderRadius:24,
            fontSize:13, fontWeight:600, zIndex:1600,
            boxShadow:"0 6px 20px rgba(0,0,0,.2)",
          }}>{toast}</div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   KycAdminScreen : écran de validation pour les admins
   ────────────────────────────────────────────────────
   Appelle l'Edge Function `kyc-review` (et non la table
   directement) — les signed URLs requièrent la
   service_role key, side-server uniquement. */
function KycAdminScreen({ onBack }) {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [acting, setActing]     = useState(null);  // { id, action } en cours
  const [rejectFor, setRejectFor] = useState(null); // doc_id ou null
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast]       = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  // Construit l'URL de la fonction. SUPABASE_URL provient de config.js.
  const FN_URL = `${SUPABASE_URL}/functions/v1/kyc-review`;

  const callFn = async (route, body) => {
    const db = window.byer && window.byer.db;
    if (!db || !db.isReady) throw new Error("Backend offline");
    const { data: sess } = await db.auth.getSession();
    const jwt = sess?.session?.access_token;
    if (!jwt) throw new Error("Session expirée — reconnectez-vous");
    const res = await fetch(`${FN_URL}/${route}`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : "{}",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
    return json;
  };

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { items } = await callFn("list-pending");
      setItems(items || []);
    } catch (e) {
      setError(e.message || "Erreur de chargement");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const onApprove = async (doc) => {
    setActing({ id: doc.id, action: "approve" });
    try {
      await callFn("review", { doc_id: doc.id, action: "approve" });
      showToast(`✅ ${doc.profile?.name || "Utilisateur"} validé`);
      // Optimiste : on retire de la liste (sinon attendre refresh)
      setItems((prev) => prev.filter((it) => it.id !== doc.id));
    } catch (e) {
      showToast(`Erreur : ${e.message}`);
    } finally {
      setActing(null);
    }
  };

  const onReject = async () => {
    if (!rejectFor || !rejectReason.trim()) {
      showToast("Le motif est obligatoire");
      return;
    }
    setActing({ id: rejectFor, action: "reject" });
    try {
      await callFn("review", { doc_id: rejectFor, action: "reject", reason: rejectReason.trim() });
      showToast("❌ Document refusé");
      setItems((prev) => prev.filter((it) => it.id !== rejectFor));
      setRejectFor(null);
      setRejectReason("");
    } catch (e) {
      showToast(`Erreur : ${e.message}`);
    } finally {
      setActing(null);
    }
  };

  // Styles
  const wrap = { position:"fixed", inset:0, background:C.bg, zIndex:1400, fontFamily:"DM Sans, sans-serif", overflowY:"auto" };
  const header = {
    background:C.white, padding:"var(--top-pad) 16px 14px",
    borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:10,
    display:"flex", alignItems:"center", gap:12,
  };
  const backBtn = { background:"none", border:"none", fontSize:22, cursor:"pointer", padding:4, color:C.dark };
  const headerTitle = { fontSize:17, fontWeight:700, color:C.black, flex:1 };
  const refreshBtn = { background:C.coral, color:C.white, border:"none", padding:"7px 14px", borderRadius:18, fontSize:12, fontWeight:700, cursor:"pointer" };

  const docTypeLabels = {
    id_card: "Carte d'identité",
    passport: "Passeport",
    driver_license: "Permis de conduire",
    selfie: "Selfie",
  };

  return (
    <div style={wrap}>
      <div style={header}>
        <button style={backBtn} onClick={onBack} aria-label="Retour">←</button>
        <div style={headerTitle}>KYC en attente {items.length > 0 && `(${items.length})`}</div>
        <button style={refreshBtn} onClick={refresh} disabled={loading}>
          {loading ? "…" : "↻ Actualiser"}
        </button>
      </div>

      <div style={{padding:16, maxWidth:680, margin:"0 auto"}}>
        {loading && <div style={{textAlign:"center", padding:40, color:C.mid}}>Chargement…</div>}

        {!loading && error && (
          <div style={{
            padding:16, background:"rgba(220,38,38,.08)", border:"1px solid rgba(220,38,38,.25)",
            borderRadius:12, color:"#DC2626", fontSize:13,
          }}>
            {error.includes("admin") || error.includes("403")
              ? "Accès refusé : vous n'êtes pas dans la liste des administrateurs."
              : `Erreur : ${error}`}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div style={{textAlign:"center", padding:60, color:C.mid}}>
            <div style={{fontSize:48, marginBottom:12}}>✓</div>
            <div style={{fontSize:15, fontWeight:600, color:C.dark}}>Aucun KYC en attente</div>
            <div style={{fontSize:13, marginTop:6}}>Tout est à jour, beau travail !</div>
          </div>
        )}

        {!loading && items.map((doc) => {
          const isActing = acting?.id === doc.id;
          return (
            <div key={doc.id} style={{
              background:C.white, border:`1px solid ${C.border}`, borderRadius:16,
              padding:14, marginBottom:14,
            }}>
              {/* Profil utilisateur */}
              <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:12}}>
                <div style={{
                  width:40, height:40, borderRadius:"50%",
                  background:doc.profile?.avatar_bg || "#6366F1",
                  color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:16, fontWeight:700,
                }}>{doc.profile?.avatar_letter || doc.profile?.name?.[0] || "?"}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:14, fontWeight:600, color:C.black}}>{doc.profile?.name || "Utilisateur"}</div>
                  <div style={{fontSize:12, color:C.mid}}>
                    {doc.profile?.email || "—"} · {doc.profile?.phone || ""}
                  </div>
                </div>
              </div>

              {/* Type + date */}
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:12, color:C.mid}}>
                <span>📄 {docTypeLabels[doc.doc_type] || doc.doc_type}</span>
                <span>{new Date(doc.submitted_at).toLocaleString("fr-FR", { dateStyle:"short", timeStyle:"short" })}</span>
              </div>

              {/* Image preview (signed URL 5 min) */}
              {doc.signed_url ? (
                <a href={doc.signed_url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={doc.signed_url}
                    alt={`KYC ${doc.doc_type}`}
                    style={{
                      width:"100%", maxHeight:280, objectFit:"contain",
                      borderRadius:10, background:C.bg, marginBottom:12,
                      border:`1px solid ${C.border}`,
                    }}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </a>
              ) : (
                <div style={{
                  padding:24, textAlign:"center", color:C.mid, fontSize:12,
                  background:C.bg, borderRadius:10, marginBottom:12,
                }}>
                  {doc.signed_url_error
                    ? `Aperçu indisponible : ${doc.signed_url_error}`
                    : "Aperçu indisponible"}
                </div>
              )}

              {/* Actions */}
              <div style={{display:"flex", gap:10}}>
                <button
                  disabled={isActing}
                  onClick={() => onApprove(doc)}
                  style={{
                    flex:1, padding:"11px 0", borderRadius:10, border:"none",
                    background:"#16A34A", color:"white", fontWeight:700, fontSize:13,
                    cursor: isActing ? "default" : "pointer",
                    opacity: isActing && acting?.action === "approve" ? 0.6 : 1,
                  }}
                >
                  {isActing && acting?.action === "approve" ? "Validation…" : "✓ Approuver"}
                </button>
                <button
                  disabled={isActing}
                  onClick={() => { setRejectFor(doc.id); setRejectReason(""); }}
                  style={{
                    flex:1, padding:"11px 0", borderRadius:10,
                    border:`1px solid ${C.border}`, background:C.white, color:"#DC2626",
                    fontWeight:700, fontSize:13,
                    cursor: isActing ? "default" : "pointer",
                  }}
                >
                  ✕ Rejeter
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal motif de rejet */}
      {rejectFor && (
        <div
          style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
            zIndex:1700, display:"flex", alignItems:"center", justifyContent:"center", padding:16,
          }}
          onClick={() => { if (!acting) { setRejectFor(null); setRejectReason(""); } }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background:C.white, borderRadius:18, padding:22, maxWidth:420, width:"100%",
              fontFamily:"DM Sans, sans-serif",
            }}
          >
            <div style={{fontSize:16, fontWeight:700, marginBottom:8}}>Motif du rejet</div>
            <div style={{fontSize:13, color:C.mid, marginBottom:14, lineHeight:1.5}}>
              Le motif sera communiqué à l'utilisateur via une notification.
              Soyez explicite (ex : "Photo floue, recommencez avec plus de lumière").
            </div>
            <textarea
              autoFocus
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Photo illisible, document expiré, prénom différent…"
              maxLength={300}
              rows={4}
              style={{
                width:"100%", padding:12, borderRadius:10,
                border:`1px solid ${C.border}`, fontSize:14,
                fontFamily:"inherit", resize:"vertical", outline:"none",
                boxSizing:"border-box", marginBottom:14,
              }}
            />
            <div style={{display:"flex", gap:10}}>
              <button
                disabled={!!acting}
                onClick={() => { setRejectFor(null); setRejectReason(""); }}
                style={{
                  flex:1, padding:"11px 0", borderRadius:10,
                  border:`1px solid ${C.border}`, background:C.white,
                  fontWeight:600, fontSize:13, cursor:"pointer",
                }}
              >
                Annuler
              </button>
              <button
                disabled={!!acting || !rejectReason.trim()}
                onClick={onReject}
                style={{
                  flex:1, padding:"11px 0", borderRadius:10, border:"none",
                  background:"#DC2626", color:"white",
                  fontWeight:700, fontSize:13,
                  cursor: (acting || !rejectReason.trim()) ? "default" : "pointer",
                  opacity: (!rejectReason.trim() || acting) ? 0.5 : 1,
                }}
              >
                {acting ? "Envoi…" : "Confirmer le rejet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          position:"fixed", bottom:30, left:"50%", transform:"translateX(-50%)",
          background:C.dark, color:C.white, padding:"10px 18px", borderRadius:24,
          fontSize:13, fontWeight:600, zIndex:1800,
          boxShadow:"0 6px 20px rgba(0,0,0,.2)",
        }}>{toast}</div>
      )}
    </div>
  );
}
