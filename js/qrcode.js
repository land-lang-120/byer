/* ═══════════════════════════════════════════════════
   Byer — QR Code Scanner & Guest Verification
   Allows bailleurs/concierges to scan a guest's QR code
   and instantly verify their identity + booking status.
   ═══════════════════════════════════════════════════ */

/* ── Mock QR code database (simulates backend) ── */
const QR_GUESTS = {
  "BYR-2025-0322-A": {
    name: "Jean Kamga",
    phone: "+237 6 99 12 34 56",
    photo: "https://i.pravatar.cc/120?img=33",
    booking: {
      ref: "BYR-2025-0322-A",
      title: "Appartement Bonamoussadi",
      city: "Douala",
      zone: "Bonamoussadi",
      checkIn: "22 mars 2025",
      checkOut: "25 mars 2025",
      nights: 3,
      totalPaid: 105000,
      status: "paid",        // paid | pending | unpaid
      paymentMethod: "MTN Mobile Money",
      paymentDate: "20 mars 2025",
    },
  },
  "BYR-2025-0410-B": {
    name: "Marie Ngassa",
    phone: "+237 6 77 88 99 00",
    photo: "https://i.pravatar.cc/120?img=47",
    booking: {
      ref: "BYR-2025-0410-B",
      title: "Villa Balnéaire Kribi",
      city: "Kribi",
      zone: "Bord de mer",
      checkIn: "10 avr. 2025",
      checkOut: "14 avr. 2025",
      nights: 4,
      totalPaid: 300000,
      status: "paid",
      paymentMethod: "Orange Money",
      paymentDate: "8 avr. 2025",
    },
  },
  "BYR-2025-0322-C": {
    name: "Paul Essomba",
    phone: "+237 6 55 44 33 22",
    photo: "https://i.pravatar.cc/120?img=57",
    booking: {
      ref: "BYR-2025-0322-C",
      title: "Toyota Land Cruiser 2022",
      city: "Douala",
      zone: "Akwa",
      checkIn: "22 mars 2025",
      checkOut: "24 mars 2025",
      nights: 2,
      totalPaid: 0,
      status: "unpaid",
      paymentMethod: null,
      paymentDate: null,
    },
  },
  "BYR-UNKNOWN": {
    name: "Visiteur Inconnu",
    phone: null,
    photo: null,
    booking: null,
  },
};

/* ── QR Info Dialog (explains feature by role) ── */
function QRInfoDialog({ onClose, onScan }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 350 }} onClick={onClose}/>
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: C.white,
        borderRadius: "22px 22px 0 0", zIndex: 351, padding: "0 0 36px",
      }} className="sheet">
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "12px auto 4px" }}/>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px 8px" }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: C.black }}>Scanner QR Code</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 16px" }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, background: "#FFF5F5",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.coral} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="8" height="8" rx="1"/>
              <rect x="14" y="2" width="8" height="8" rx="1"/>
              <rect x="2" y="14" width="8" height="8" rx="1"/>
              <path d="M14 14h2v2h-2z" fill={C.coral} stroke="none"/>
              <path d="M20 14h2v2h-2z" fill={C.coral} stroke="none"/>
              <path d="M14 20h2v2h-2z" fill={C.coral} stroke="none"/>
              <path d="M20 20h2v2h-2z" fill={C.coral} stroke="none"/>
              <path d="M17 17h2v2h-2z" fill={C.coral} stroke="none"/>
            </svg>
          </div>
        </div>

        {/* Role-based explanations */}
        <div style={{ padding: "0 20px" }}>

          {/* Bailleur / Concierge */}
          <div style={{
            background: "#FFF5F5", border: `1.5px solid ${C.coral}33`,
            borderRadius: 16, padding: "16px", marginBottom: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: C.coral,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.coral }}>Bailleur / Concierge</p>
                <p style={{ fontSize: 11, color: C.mid }}>Vous gerez un logement</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Scannez le QR code presente par le client a son arrivee",
                "Verifiez instantanement son identite et sa reservation",
                "Confirmez que le paiement a bien ete effectue",
                "Refusez l'acces si aucune reservation n'est trouvee",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <svg width="14" height="14" fill="none" stroke={C.coral} strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: 12, color: C.dark, lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Locataire / Voyageur */}
          <div style={{
            background: C.bg, border: `1.5px solid ${C.border}`,
            borderRadius: 16, padding: "16px", marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: "#6366F1",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#6366F1" }}>Locataire / Voyageur</p>
                <p style={{ fontSize: 11, color: C.mid }}>Vous reservez un logement</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Apres reservation, un QR code unique vous est attribue",
                "Presentez-le au bailleur ou concierge a votre arrivee",
                "Votre identite et paiement sont verifies en 2 secondes",
                "Acces rapide et securise — plus besoin de paperasse",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <svg width="14" height="14" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: 12, color: C.dark, lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={onScan}
            style={{
              width: "100%", background: C.coral, color: "white", border: "none",
              borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="8" height="8" rx="1"/>
              <rect x="14" y="2" width="8" height="8" rx="1"/>
              <rect x="2" y="14" width="8" height="8" rx="1"/>
            </svg>
            Scanner un QR code
          </button>
          <button
            onClick={onClose}
            style={{
              width: "100%", background: C.bg, color: C.dark, border: `1.5px solid ${C.border}`,
              borderRadius: 12, padding: "13px", fontWeight: 600, fontSize: 14,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
}

/* ── QR Scanner Floating Button ──
   ICÔNE = un VRAI scanner (viseur avec coins en équerre + ligne de scan
   horizontale au centre) — pour ne PAS confondre avec l'icône QR-code
   du bouton MyQRCodeButton juste au-dessus. */
function QRScanButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Scanner un QR code"
      style={{
        position: "fixed",
        bottom: 90,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        background: C.coral,
        border: "none",
        boxShadow: "0 4px 20px rgba(255,90,95,.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 100,
        transition: "transform .18s",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* 4 coins en équerre — viseur de scanner */}
        <path d="M3 8V5a2 2 0 0 1 2-2h3"/>
        <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
        <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
        <path d="M21 16v3a2 2 0 0 1-2 2h-3"/>
        {/* Ligne de scan horizontale rouge/blanche au centre */}
        <line x1="6" y1="12" x2="18" y2="12"/>
      </svg>
    </button>
  );
}

/* ── My QR Code Floating Button (above the scan button) ──
   Donne au locataire un accès rapide à son propre QR code de réservation.
   Icône noire, fond blanc — contraste fort vs le bouton scan coral du bailleur. */
function MyQRCodeButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Mon QR Code"
      style={{
        position: "fixed",
        bottom: 156,           /* au-dessus du bouton scan (90 + 56 + 10) */
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        background: C.white,
        border: `1.5px solid ${C.border}`,
        boxShadow: "0 4px 16px rgba(0,0,0,.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 100,
        transition: "transform .18s",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="8" height="8" rx="1"/>
        <rect x="14" y="2" width="8" height="8" rx="1"/>
        <rect x="2" y="14" width="8" height="8" rx="1"/>
        <path d="M14 14h2v2h-2z" fill={C.black} stroke="none"/>
        <path d="M20 14h2v2h-2z" fill={C.black} stroke="none"/>
        <path d="M14 20h2v2h-2z" fill={C.black} stroke="none"/>
        <path d="M20 20h2v2h-2z" fill={C.black} stroke="none"/>
        <path d="M17 17h2v2h-2z" fill={C.black} stroke="none"/>
      </svg>
    </button>
  );
}

/* ── My QR Code Dialog (shows the user's own reservation QR) ──
   Affiche le QR code à présenter au bailleur pour la vérification d'arrivée.
   Si l'utilisateur n'a pas encore de réservation, on tombe sur un mock démo. */
function MyQRCodeDialog({ booking, onClose }) {
  // Fallback démo si pas de réservation utilisateur
  const ref      = booking?.ref      || "BYR-2025-0322-A";
  const title    = booking?.title    || "Appartement Bonamoussadi";
  const city     = booking?.city     || "Douala";
  const zone     = booking?.zone     || "Bonamoussadi";
  const checkIn  = booking?.checkIn  || "22 mars 2025";
  const checkOut = booking?.checkOut || "25 mars 2025";

  // Générateur QR via API publique gratuite (sans clé)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(ref)}&color=000000&bgcolor=FFFFFF&margin=10`;

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 350 }} onClick={onClose}/>
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: C.white,
        borderRadius: "22px 22px 0 0", zIndex: 351, padding: "0 0 32px",
        maxHeight: "92vh", overflowY: "auto",
      }} className="sheet">
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "12px auto 4px" }}/>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px 8px" }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: C.black }}>Mon QR Code</p>
            <p style={{ fontSize: 12, color: C.mid, marginTop: 2 }}>Présentez ce code à votre arrivée</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* QR Code visuel — fond blanc, code noir */}
        <div style={{
          margin: "16px 24px 12px", padding: "20px",
          background: C.white, border: `1.5px solid ${C.border}`,
          borderRadius: 20, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,.05)",
        }}>
          <div style={{
            width: 240, height: 240, background: C.white,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 12,
          }}>
            <img
              src={qrUrl}
              alt={`QR Code ${ref}`}
              style={{ width: 240, height: 240, display: "block" }}
            />
          </div>
          <p style={{
            fontSize: 13, fontWeight: 700, color: C.black,
            fontFamily: "monospace", letterSpacing: 1,
          }}>
            {ref}
          </p>
        </div>

        {/* Détails de la réservation */}
        <div style={{ padding: "8px 20px 0" }}>
          <div style={{
            background: C.bg, borderRadius: 14, padding: "14px",
          }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.black, marginBottom: 4 }}>
              {title}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
              <ByerPin size={11}/>
              <span style={{ fontSize: 12, color: C.mid }}>{zone}, {city}</span>
            </div>
            <div style={{
              display: "flex", borderTop: `1px solid ${C.border}`, paddingTop: 10, gap: 0,
            }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: C.light, textTransform: "uppercase", letterSpacing: .6 }}>ARRIVÉE</span>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.black, marginTop: 2 }}>{checkIn}</p>
              </div>
              <div style={{ flex: 1, textAlign: "right" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: C.light, textTransform: "uppercase", letterSpacing: .6 }}>DÉPART</span>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.black, marginTop: 2 }}>{checkOut}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Astuce */}
        <div style={{ padding: "14px 20px 0" }}>
          <div style={{
            background: "#FFF8F8", border: "1px solid #FFD6D7",
            borderRadius: 12, padding: "10px 12px",
            display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <span style={{ fontSize: 16 }}>💡</span>
            <p style={{ fontSize: 12, color: C.dark, lineHeight: 1.5 }}>
              Le bailleur scannera ce code pour vérifier votre identité et votre paiement en 2 secondes.
            </p>
          </div>
        </div>

        {/* Close */}
        <div style={{ padding: "16px 20px 0" }}>
          <button
            onClick={onClose}
            style={{
              width: "100%", background: C.bg, color: C.dark, border: `1.5px solid ${C.border}`,
              borderRadius: 12, padding: "13px", fontWeight: 600, fontSize: 14,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
}

/* ── QR Scanner Overlay ── */
function QRScannerOverlay({ onClose, onScan }) {
  const [scanning, setScanning] = useState(true);
  const [manualCode, setManualCode] = useState("");

  const simulateScan = (code) => {
    setScanning(false);
    onScan(code);
  };

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 400 }} onClick={onClose}/>
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "90%", maxWidth: 380, background: C.white, borderRadius: 24,
        zIndex: 401, overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 12px" }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: C.black }}>Scanner QR Code</p>
            <p style={{ fontSize: 12, color: C.mid, marginTop: 2 }}>Scannez le code du client</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Camera preview simulation */}
        <div style={{
          margin: "0 20px", height: 220, borderRadius: 16, background: "#0a0a0a",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          {/* Scan frame animation */}
          <div style={{
            width: 160, height: 160, border: "2px solid rgba(255,255,255,.3)",
            borderRadius: 12, position: "relative",
          }}>
            {/* Corner highlights */}
            {[
              { top: -2, left: -2, borderTop: `3px solid ${C.coral}`, borderLeft: `3px solid ${C.coral}` },
              { top: -2, right: -2, borderTop: `3px solid ${C.coral}`, borderRight: `3px solid ${C.coral}` },
              { bottom: -2, left: -2, borderBottom: `3px solid ${C.coral}`, borderLeft: `3px solid ${C.coral}` },
              { bottom: -2, right: -2, borderBottom: `3px solid ${C.coral}`, borderRight: `3px solid ${C.coral}` },
            ].map((s, i) => (
              <div key={i} style={{ position: "absolute", width: 24, height: 24, borderRadius: 4, ...s }}/>
            ))}
            {/* Scanning line */}
            <div style={{
              position: "absolute", left: 8, right: 8, height: 2,
              background: `linear-gradient(90deg, transparent, ${C.coral}, transparent)`,
              animation: "scanLine 2s ease-in-out infinite",
              top: "50%",
            }}/>
          </div>
          <style>{`@keyframes scanLine { 0%,100% { top:15%; opacity:.3; } 50% { top:80%; opacity:1; } }`}</style>
          <p style={{
            position: "absolute", bottom: 12, fontSize: 11, color: "rgba(255,255,255,.5)",
            fontWeight: 500,
          }}>
            Placez le QR code dans le cadre
          </p>
        </div>

        {/* Manual code entry */}
        <div style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 8 }}>
            Ou entrez le code manuellement :
          </p>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 12,
            padding: "10px 14px",
          }}>
            <input
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontSize: 14, color: C.dark, fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600, letterSpacing: .5,
              }}
              placeholder="BYR-2025-XXXX-X"
              value={manualCode}
              onChange={e => setManualCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && manualCode.trim() && simulateScan(manualCode.trim())}
            />
            <button
              onClick={() => manualCode.trim() && simulateScan(manualCode.trim())}
              style={{
                background: C.coral, color: "white", border: "none", borderRadius: 8,
                padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Vérifier
            </button>
          </div>
        </div>

        {/* Demo quick scan buttons */}
        <div style={{ padding: "0 20px 20px" }}>
          <p style={{ fontSize: 11, color: C.light, marginBottom: 8 }}>Demo — Scanner rapidement :</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.keys(QR_GUESTS).filter(k => k !== "BYR-UNKNOWN").map(code => {
              const g = QR_GUESTS[code];
              const isPaid = g.booking?.status === "paid";
              return (
                <button
                  key={code}
                  onClick={() => simulateScan(code)}
                  style={{
                    background: isPaid ? "#F0FDF4" : g.booking ? "#FEF2F2" : C.bg,
                    border: `1px solid ${isPaid ? "#BBF7D0" : g.booking ? "#FECACA" : C.border}`,
                    borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600,
                    color: isPaid ? "#16A34A" : g.booking ? "#EF4444" : C.mid,
                    cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {g.name.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Guest Verification Result ── */
function GuestVerificationSheet({ code, onClose }) {
  const guest = QR_GUESTS[code] || QR_GUESTS["BYR-UNKNOWN"];
  const hasBooking = !!guest.booking;
  const isPaid = hasBooking && guest.booking.status === "paid";
  const isPending = hasBooking && guest.booking.status === "pending";

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 500 }} onClick={onClose}/>
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: C.white,
        borderRadius: "22px 22px 0 0", zIndex: 501, padding: "0 0 36px",
        maxHeight: "85vh", overflowY: "auto",
      }} className="sheet">
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "12px auto 4px" }}/>

        {/* Status banner */}
        <div style={{
          margin: "8px 20px 16px", padding: "16px",
          borderRadius: 16,
          background: isPaid ? "#F0FDF4" : hasBooking ? "#FEF2F2" : "#FFF8F8",
          border: `1.5px solid ${isPaid ? "#BBF7D0" : hasBooking ? "#FECACA" : "#FFD6D7"}`,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          {/* Status icon */}
          <div style={{
            width: 52, height: 52, borderRadius: 26,
            background: isPaid ? "#16A34A" : hasBooking ? "#EF4444" : C.coral,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="26" height="26" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
              {isPaid
                ? <polyline points="20 6 9 17 4 12"/>
                : hasBooking
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
              }
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 17, fontWeight: 800, color: isPaid ? "#16A34A" : "#EF4444" }}>
              {isPaid ? "Client vérifié" : hasBooking ? "Paiement non effectué" : "Aucune réservation"}
            </p>
            <p style={{ fontSize: 12, color: C.mid, marginTop: 2 }}>
              {isPaid
                ? "Réservation confirmée et payée"
                : hasBooking
                  ? "Ce client n'a pas encore réglé sa réservation"
                  : "Ce code QR ne correspond à aucune réservation active"
              }
            </p>
          </div>
        </div>

        {/* Guest identity */}
        <div style={{ padding: "0 20px" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.black, marginBottom: 12 }}>
            Identité du client
          </p>
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            background: C.bg, borderRadius: 16, padding: "14px",
          }}>
            {/* Avatar */}
            <div style={{
              width: 56, height: 56, borderRadius: 28, overflow: "hidden",
              background: guest.photo ? "none" : C.border,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, border: `2px solid ${isPaid ? "#16A34A" : C.border}`,
            }}>
              {guest.photo
                ? <img src={guest.photo} alt={guest.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                : <svg width="24" height="24" fill="none" stroke={C.light} strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
              }
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: C.black }}>{guest.name}</p>
              {guest.phone && (
                <p style={{ fontSize: 13, color: C.mid, marginTop: 2 }}>{guest.phone}</p>
              )}
              <p style={{ fontSize: 11, color: C.light, marginTop: 2, fontFamily: "monospace" }}>{code}</p>
            </div>
          </div>
        </div>

        {/* Booking details */}
        {hasBooking && (
          <div style={{ padding: "16px 20px 0" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.black, marginBottom: 12 }}>
              Détails de la réservation
            </p>
            <div style={{
              background: C.white, borderRadius: 16, padding: "14px",
              border: `1.5px solid ${C.border}`,
            }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.black, marginBottom: 4 }}>
                {guest.booking.title}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
                <ByerPin size={12}/>
                <span style={{ fontSize: 12, color: C.mid }}>{guest.booking.zone}, {guest.booking.city}</span>
              </div>

              {/* Dates */}
              <div style={{
                display: "flex", background: C.bg, borderRadius: 12, padding: "10px", gap: 0, marginBottom: 10,
              }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: C.light, textTransform: "uppercase", letterSpacing: .6 }}>ARRIVÉE</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.black }}>{guest.booking.checkIn}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", padding: "0 8px" }}>
                  <svg width="16" height="16" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: C.light, textTransform: "uppercase", letterSpacing: .6 }}>DÉPART</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.black }}>{guest.booking.checkOut}</span>
                </div>
              </div>

              {/* Payment info */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                {[
                  { l: "Durée", v: `${guest.booking.nights} nuit${guest.booking.nights > 1 ? "s" : ""}` },
                  { l: "Montant total", v: fmt(guest.booking.totalPaid), bold: true },
                  { l: "Paiement", v: isPaid ? guest.booking.paymentMethod : "Non effectué", color: isPaid ? "#16A34A" : "#EF4444" },
                  ...(isPaid ? [{ l: "Date paiement", v: guest.booking.paymentDate }] : []),
                ].map(row => (
                  <div key={row.l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                    <span style={{ fontSize: 13, color: C.mid }}>{row.l}</span>
                    <span style={{
                      fontSize: 13, fontWeight: row.bold ? 700 : 500,
                      color: row.color || C.dark,
                    }}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No booking warning */}
        {!hasBooking && (
          <div style={{ padding: "16px 20px 0" }}>
            <div style={{
              background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 16,
              padding: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            }}>
              <svg width="40" height="40" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#EF4444", textAlign: "center" }}>
                Attention — Pas de réservation
              </p>
              <p style={{ fontSize: 12, color: C.mid, textAlign: "center", lineHeight: 1.6 }}>
                Ce code ne correspond à aucune réservation active dans Byer.
                Le visiteur doit d'abord effectuer une réservation et un paiement avant d'accéder au logement.
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {isPaid && (
            <button style={{
              width: "100%", background: "#16A34A", color: "white", border: "none",
              borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}>
              Confirmer l'accès au logement
            </button>
          )}
          {hasBooking && !isPaid && (
            <button style={{
              width: "100%", background: C.coral, color: "white", border: "none",
              borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}>
              Envoyer un rappel de paiement
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              width: "100%", background: C.bg, color: C.dark, border: `1.5px solid ${C.border}`,
              borderRadius: 12, padding: "13px", fontWeight: 600, fontSize: 14,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
}
