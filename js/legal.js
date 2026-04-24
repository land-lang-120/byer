/* Byer — Pages légales (CGU · Confidentialité · Mot de passe oublié) */

/* ─── HELPER : Layout d'un écran légal ────────────── */
function LegalScrollScreen({ title, subtitle, children, onBack, footer }) {
  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>
      <div style={S.scroll}>
        {/* Header sticky */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"var(--top-pad) 16px 12px",borderBottom:`1px solid ${C.border}`,background:C.white,position:"sticky",top:0,zIndex:10}}>
          <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex"}}>
            <Icon name="back" size={22} color={C.dark} stroke={2}/>
          </button>
          <div style={{flex:1}}>
            <p style={{fontSize:16,fontWeight:700,color:C.black}}>{title}</p>
            {subtitle && <p style={{fontSize:11,color:C.light}}>{subtitle}</p>}
          </div>
        </div>
        <div style={{padding:"16px 18px 30px"}}>
          {children}
        </div>
        {footer}
      </div>
    </div>
  );
}

const LegalSection = ({ n, title, children }) => (
  <div style={{marginBottom:18}}>
    <p style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:8}}>{n}. {title}</p>
    <div style={{fontSize:13,color:C.mid,lineHeight:1.65}}>{children}</div>
  </div>
);

/* ─── CGU ─────────────────────────────────────────── */
function TermsScreen({ onBack }) {
  return (
    <LegalScrollScreen title="Conditions Générales d'Utilisation" subtitle="Mise à jour : avril 2026" onBack={onBack}>
      <div style={{padding:"12px 14px",background:C.bg,borderRadius:12,marginBottom:18}}>
        <p style={{fontSize:12,color:C.dark,lineHeight:1.55}}>
          Bienvenue sur <strong>Byer</strong> 🌍 — la plateforme camerounaise de location de logements et de véhicules.
          En utilisant l'application, vous acceptez les présentes conditions.
        </p>
      </div>

      <LegalSection n="1" title="Objet">
        Byer met en relation des locataires (« Voyageurs ») et des propriétaires/loueurs (« Hôtes »)
        pour la réservation de logements de courte ou longue durée et la location de véhicules.
      </LegalSection>

      <LegalSection n="2" title="Inscription & Compte">
        L'inscription est gratuite. Vous devez avoir 18 ans révolus, fournir des informations exactes
        et être responsable de la confidentialité de vos identifiants. Toute usurpation d'identité
        peut entraîner la suspension immédiate du compte.
      </LegalSection>

      <LegalSection n="3" title="Réservations & Paiements">
        Les réservations sont confirmées après paiement (Mobile Money, virement, ou carte). Byer prélève
        des frais de service de 12 % (court séjour) ou 5 % (mensuel). Les fonds sont sécurisés et reversés
        à l'hôte 24h après l'arrivée du voyageur.
      </LegalSection>

      <LegalSection n="4" title="Annulation">
        Politique flexible par défaut : remboursement intégral jusqu'à 48h avant l'arrivée, 50 % entre 24h
        et 48h, puis non remboursable. Les hôtes peuvent appliquer une politique stricte sur les biens
        d'exception (signalée sur la fiche).
      </LegalSection>

      <LegalSection n="5" title="Comportement attendu">
        Voyageurs et hôtes s'engagent à un comportement respectueux. Les nuisances, dégradations,
        comportements illégaux ou discriminations entraînent une suspension immédiate et un signalement
        aux autorités compétentes.
      </LegalSection>

      <LegalSection n="6" title="Responsabilité">
        Byer agit comme intermédiaire et n'est pas responsable de la qualité réelle des biens ni des
        litiges directs entre parties. Une assistance Byer est disponible 7j/7 pour médiation.
      </LegalSection>

      <LegalSection n="7" title="Résiliation">
        Vous pouvez supprimer votre compte à tout moment depuis les Paramètres. Byer se réserve le droit
        de suspendre ou supprimer un compte en cas de violation des présentes CGU.
      </LegalSection>

      <LegalSection n="8" title="Droit applicable">
        Les présentes CGU sont régies par le droit camerounais. Tout litige relève des tribunaux de
        Douala, après tentative de résolution amiable.
      </LegalSection>

      <p style={{fontSize:11,color:C.light,marginTop:14,textAlign:"center"}}>
        Pour toute question : <strong>support@byer.cm</strong>
      </p>
    </LegalScrollScreen>
  );
}

/* ─── CONFIDENTIALITÉ ───────────────────────────── */
function PrivacyScreen({ onBack }) {
  return (
    <LegalScrollScreen title="Politique de confidentialité" subtitle="Conformité RGPD & Loi camerounaise 2010/012" onBack={onBack}>
      <div style={{padding:"12px 14px",background:"#EFF6FF",borderRadius:12,marginBottom:18,border:"1px solid #BFDBFE"}}>
        <p style={{fontSize:12,color:"#1E3A8A",fontWeight:600,marginBottom:4}}>🔒 Vos données vous appartiennent</p>
        <p style={{fontSize:12,color:C.mid,lineHeight:1.55}}>
          Nous ne vendons jamais vos données. Vous pouvez les exporter ou les supprimer à tout moment.
        </p>
      </div>

      <LegalSection n="1" title="Données collectées">
        Lors de votre inscription : nom, email, téléphone, photo de profil. Lors d'une réservation :
        coordonnées de paiement (chiffrées), historique de séjours, messages échangés avec l'hôte.
        Données techniques : type d'appareil, adresse IP, logs de connexion (90 jours).
      </LegalSection>

      <LegalSection n="2" title="Finalité">
        Vos données servent à : créer votre compte, traiter les réservations, vous envoyer des
        notifications utiles (confirmations, rappels), améliorer le service via des statistiques
        anonymisées, et lutter contre la fraude.
      </LegalSection>

      <LegalSection n="3" title="Partage avec des tiers">
        Vos données ne sont partagées qu'avec : l'hôte concerné par votre réservation (prénom + photo
        seulement avant validation), les prestataires de paiement (MTN MoMo, Orange Money, banques
        partenaires) sous contrat de confidentialité strict, et les autorités sur réquisition légale.
      </LegalSection>

      <LegalSection n="4" title="Cookies & Analytics">
        Byer utilise des cookies essentiels (session, sécurité) et des cookies analytiques anonymisés
        (mesure d'audience). Vous pouvez les refuser depuis les Paramètres → Confidentialité.
      </LegalSection>

      <LegalSection n="5" title="Conservation">
        Compte actif : conservation continue. Compte supprimé : suppression sous 30 jours, sauf obligations
        légales (factures conservées 10 ans). Messages : 2 ans après la dernière interaction.
      </LegalSection>

      <LegalSection n="6" title="Vos droits">
        Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition.
        Pour exercer ces droits : <strong>privacy@byer.cm</strong> ou Paramètres → Mes données.
      </LegalSection>

      <LegalSection n="7" title="Sécurité">
        Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Audits de sécurité
        trimestriels. En cas de violation, notification sous 72h conformément au RGPD.
      </LegalSection>

      <p style={{fontSize:11,color:C.light,marginTop:14,textAlign:"center"}}>
        Délégué à la protection des données : <strong>dpo@byer.cm</strong>
      </p>
    </LegalScrollScreen>
  );
}

/* ─── AIDE & SUPPORT ──────────────────────────── */
function SupportScreen({ onBack }) {
  const [openFAQ, setOpenFAQ]       = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [report, setReport]         = useState({ category: "", message: "" });
  const [sent, setSent]             = useState(false);

  const FAQS = [
    {
      q: "Comment réserver un logement ?",
      a: "Sélectionnez vos dates, le nombre de voyageurs, puis cliquez sur « Réserver ». Le paiement est sécurisé via Mobile Money, virement ou carte bancaire.",
    },
    {
      q: "Que faire si l'hôte ne répond pas ?",
      a: "Patientez 24h après envoi du message. Sans réponse, contactez le support qui interviendra sous 12h pour annuler ou trouver une alternative équivalente.",
    },
    {
      q: "Comment annuler une réservation ?",
      a: "Allez dans Voyages → sélectionnez la réservation → « Annuler ». Le remboursement dépend de la politique d'annulation affichée sur la fiche (généralement flexible : 100% jusqu'à 48h avant).",
    },
    {
      q: "Mes paiements sont-ils sécurisés ?",
      a: "Oui. Tous les paiements transitent par des prestataires agréés (MTN MoMo, Orange Money, banques partenaires). Aucune donnée bancaire n'est stockée par Byer.",
    },
    {
      q: "Comment devenir hôte ?",
      a: "Cliquez sur Profil → « Mettre en location ». Renseignez vos informations et publiez votre première annonce gratuitement. La validation prend 24h en moyenne.",
    },
    {
      q: "Comment fonctionne la caution véhicule ?",
      a: "Une pré-autorisation de 50 000 F est faite sur votre carte ou Mobile Money lors de la prise du véhicule. Elle est libérée automatiquement au retour si le véhicule est rendu en bon état.",
    },
    {
      q: "Puis-je modifier ma réservation ?",
      a: "Oui, jusqu'à 48h avant l'arrivée et sous réserve de disponibilité. Allez dans Voyages → réservation → « Modifier ».",
    },
    {
      q: "Comment recevoir mes paiements (en tant qu'hôte) ?",
      a: "Les fonds sont reversés sur votre Mobile Money ou compte bancaire 24h après l'arrivée du voyageur. Vous configurez cela dans Profil → Espace bailleur → Paiements.",
    },
  ];

  const sendReport = () => {
    setSent(true);
    setTimeout(() => {
      setReportOpen(false);
      setSent(false);
      setReport({ category: "", message: "" });
    }, 1800);
  };

  return (
    <LegalScrollScreen title="Aide & Support" subtitle="Disponible 7j/7 — Réponse moyenne en 12h" onBack={onBack}>
      {/* Contact rapides */}
      <p style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:10}}>Nous contacter</p>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
        <a href="mailto:support@byer.cm"
           style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:C.bg,borderRadius:12,textDecoration:"none",border:`1px solid ${C.border}`}}>
          <div style={{width:40,height:40,borderRadius:10,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📧</div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:600,color:C.dark}}>Email</p>
            <p style={{fontSize:12,color:C.mid}}>support@byer.cm</p>
          </div>
          <Icon name="chevron" size={14} color={C.light}/>
        </a>
        <a href="tel:+237699000000"
           style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:C.bg,borderRadius:12,textDecoration:"none",border:`1px solid ${C.border}`}}>
          <div style={{width:40,height:40,borderRadius:10,background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📞</div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:600,color:C.dark}}>Téléphone</p>
            <p style={{fontSize:12,color:C.mid}}>+237 699 00 00 00 (8h-20h)</p>
          </div>
          <Icon name="chevron" size={14} color={C.light}/>
        </a>
        <a href="https://wa.me/237699000000" target="_blank" rel="noopener noreferrer"
           style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:C.bg,borderRadius:12,textDecoration:"none",border:`1px solid ${C.border}`}}>
          <div style={{width:40,height:40,borderRadius:10,background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💬</div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:600,color:C.dark}}>WhatsApp</p>
            <p style={{fontSize:12,color:C.mid}}>Réponse moyenne 30 min</p>
          </div>
          <Icon name="chevron" size={14} color={C.light}/>
        </a>
      </div>

      {/* FAQ */}
      <p style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:10}}>Questions fréquentes</p>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
        {FAQS.map((f, i) => (
          <div key={i} style={{borderBottom:`1px solid ${C.border}`}}>
            <button
              onClick={()=>setOpenFAQ(openFAQ===i?null:i)}
              style={{
                width:"100%",padding:"14px 0",background:"none",border:"none",
                display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,
                cursor:"pointer",textAlign:"left",fontFamily:"'DM Sans',sans-serif",
              }}>
              <span style={{fontSize:13,fontWeight:600,color:C.dark,flex:1}}>{f.q}</span>
              <span style={{fontSize:18,color:C.light,transition:"transform .2s",transform:openFAQ===i?"rotate(45deg)":"rotate(0)"}}>+</span>
            </button>
            {openFAQ===i && (
              <p style={{fontSize:12.5,color:C.mid,lineHeight:1.7,padding:"0 0 14px"}}>{f.a}</p>
            )}
          </div>
        ))}
      </div>

      {/* Signaler problème */}
      <p style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:10}}>Un souci avec une réservation ?</p>
      <button
        onClick={()=>setReportOpen(true)}
        style={{
          width:"100%",padding:"14px",borderRadius:12,
          border:`1.5px solid ${C.border}`,background:C.white,
          color:C.dark,fontWeight:600,fontSize:13,
          cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
          display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:14,
        }}>
        🛟 Signaler un problème
      </button>

      <p style={{fontSize:11,color:C.light,textAlign:"center",lineHeight:1.6,marginTop:8}}>
        Pour toute urgence (sécurité, fraude) :<br/>
        <strong style={{color:C.coral}}>+237 699 00 00 11</strong> · 24h/24
      </p>

      {/* Modal signaler */}
      {reportOpen && (
        <>
          <div style={{...S.sheetBackdrop,zIndex:200}} onClick={()=>setReportOpen(false)}/>
          <div style={{...S.sheet,zIndex:201,maxHeight:"80vh",display:"flex",flexDirection:"column"}} className="sheet">
            <div style={S.sheetHandle}/>
            <div style={S.sheetHeader}>
              <p style={S.sheetTitle}>Signaler un problème</p>
              <button style={S.sheetClose} onClick={()=>setReportOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div style={{padding:"4px 20px 20px",overflowY:"auto",flex:1}}>
              {!sent ? (
                <>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:C.dark,marginBottom:6,marginTop:8}}>Catégorie</label>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                    {["Hôte indisponible","Logement non conforme","Problème paiement","Bug application","Autre"].map(cat => (
                      <button key={cat}
                        onClick={()=>setReport(r=>({...r,category:cat}))}
                        style={{
                          padding:"7px 12px",borderRadius:18,fontSize:12,fontWeight:600,cursor:"pointer",
                          border:`1.5px solid ${report.category===cat?C.coral:C.border}`,
                          background:report.category===cat?"#FFF5F5":C.white,
                          color:report.category===cat?C.coral:C.dark,
                          fontFamily:"'DM Sans',sans-serif",
                        }}>{cat}</button>
                    ))}
                  </div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:C.dark,marginBottom:6}}>Décrivez le problème</label>
                  <textarea
                    value={report.message}
                    onChange={e=>setReport(r=>({...r,message:e.target.value}))}
                    placeholder="Plus vous donnerez de détails, plus vite nous pourrons vous aider…"
                    rows={5}
                    style={{
                      width:"100%",padding:"12px 14px",borderRadius:12,
                      border:`1.5px solid ${C.border}`,fontSize:13,
                      fontFamily:"'DM Sans',sans-serif",resize:"vertical",
                      outline:"none",boxSizing:"border-box",marginBottom:16,
                    }}
                  />
                  <button
                    onClick={sendReport}
                    disabled={!report.category || !report.message.trim()}
                    style={{
                      width:"100%",padding:"14px",borderRadius:12,border:"none",
                      background:(report.category && report.message.trim())?C.coral:C.border,
                      color:"white",fontWeight:700,fontSize:14,
                      cursor:(report.category && report.message.trim())?"pointer":"not-allowed",
                      fontFamily:"'DM Sans',sans-serif",
                    }}>
                    Envoyer le signalement
                  </button>
                </>
              ) : (
                <div style={{textAlign:"center",padding:"40px 20px"}}>
                  <div style={{fontSize:48,marginBottom:12}}>✓</div>
                  <p style={{fontSize:16,fontWeight:700,color:"#16A34A",marginBottom:8}}>Signalement envoyé</p>
                  <p style={{fontSize:12,color:C.mid,lineHeight:1.6}}>Notre équipe vous répondra par email sous 12h.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </LegalScrollScreen>
  );
}

/* ─── MOT DE PASSE OUBLIÉ ──────────────────────── */
function ForgotPasswordScreen({ onBack, prefillEmail }) {
  const [email, setEmail] = useState(prefillEmail || "");
  const [step, setStep]   = useState(1); // 1 = saisie email, 2 = lien envoyé
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSend = async () => {
    setError("");
    if (!isValidEmail) { setError("Adresse email invalide"); return; }
    setLoading(true);

    // ── Reset password réel via Supabase si configuré, sinon mock ──
    const db = window.byer && window.byer.db;
    if (db && db.isReady) {
      const { error: e } = await db.auth.resetPassword(email.trim().toLowerCase());
      setLoading(false);
      if (e) {
        const msg = e.message || "";
        if (/rate limit/i.test(msg)) setError("Trop de tentatives. Réessayez dans quelques minutes.");
        else setError(msg);
        return;
      }
      setStep(2);
      return;
    }

    setLoading(false);
    setStep(2);
  };

  return (
    <LegalScrollScreen title="Mot de passe oublié" onBack={onBack}>
      {step === 1 ? (
        <>
          <div style={{textAlign:"center",margin:"20px 0 28px"}}>
            <div style={{width:64,height:64,borderRadius:16,background:"#FFF5F5",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              <span style={{fontSize:30}}>🔑</span>
            </div>
            <p style={{fontSize:16,fontWeight:700,color:C.black,marginBottom:8}}>Pas de panique !</p>
            <p style={{fontSize:13,color:C.mid,lineHeight:1.6,padding:"0 12px"}}>
              Saisissez l'email lié à votre compte. Nous vous enverrons un lien sécurisé pour
              définir un nouveau mot de passe.
            </p>
          </div>

          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:C.dark,marginBottom:6}}>
              Adresse email
            </label>
            <input
              type="email" value={email}
              onChange={e=>{setEmail(e.target.value); setError("");}}
              placeholder="vous@exemple.com"
              autoFocus
              style={{
                width:"100%",padding:"13px 14px",borderRadius:12,
                border:`1.5px solid ${error?"#EF4444":C.border}`,
                fontSize:14,fontFamily:"'DM Sans',sans-serif",
                outline:"none",boxSizing:"border-box",
              }}
            />
            {error && <p style={{fontSize:12,color:"#EF4444",marginTop:6}}>{error}</p>}
          </div>

          <button
            onClick={handleSend}
            disabled={!isValidEmail || loading}
            style={{
              width:"100%",padding:"14px",borderRadius:12,border:"none",
              background:isValidEmail?C.coral:C.border,
              color:"white",fontWeight:700,fontSize:14,
              cursor:isValidEmail&&!loading?"pointer":"not-allowed",
              fontFamily:"'DM Sans',sans-serif",marginTop:6,
              opacity:loading?.7:1,
              display:"flex",alignItems:"center",justifyContent:"center",gap:10,
            }}
          >
            {loading && (
              <span style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,.4)",borderTopColor:"white",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
            )}
            {loading ? "Envoi en cours…" : "Envoyer le lien de réinitialisation"}
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </button>

          <p style={{fontSize:11,color:C.light,textAlign:"center",marginTop:18,lineHeight:1.55}}>
            Vous ne recevez rien ? Vérifiez vos courriers indésirables ou contactez{" "}
            <strong>support@byer.cm</strong>
          </p>
        </>
      ) : (
        <div style={{textAlign:"center",padding:"30px 12px"}}>
          <div style={{width:72,height:72,borderRadius:18,background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
            <span style={{fontSize:34}}>✉️</span>
          </div>
          <p style={{fontSize:17,fontWeight:700,color:C.black,marginBottom:10}}>Lien envoyé !</p>
          <p style={{fontSize:13,color:C.mid,lineHeight:1.65,marginBottom:20}}>
            Un email de réinitialisation a été envoyé à <strong style={{color:C.dark}}>{email}</strong>.
            Le lien est valide pendant <strong>30 minutes</strong>.
          </p>
          <button
            onClick={onBack}
            style={{
              width:"100%",padding:"14px",borderRadius:12,border:"none",
              background:C.coral,color:"white",fontWeight:700,fontSize:14,
              cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
            }}
          >
            Retour à la connexion
          </button>
          <button
            onClick={()=>setStep(1)}
            style={{
              width:"100%",padding:"12px",borderRadius:12,border:"none",
              background:"transparent",color:C.mid,fontWeight:600,fontSize:13,
              cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:8,
            }}
          >
            Renvoyer ou changer d'email
          </button>
        </div>
      )}
    </LegalScrollScreen>
  );
}
