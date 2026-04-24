function SettingsScreen({ onBack, onOpenTerms, onOpenPrivacy, onOpenForgotPassword, onOpenSupport, onLogout, onDeleteAccount }) {
  const [pushNotifications, setPushNotifications] = useState(() => byerStorage.get("pushNotifications", true));
  const [darkMode, setDarkMode]                   = useState(() => byerStorage.get("darkMode", false));
  const [offlineDownloads, setOfflineDownloads]   = useState(() => byerStorage.get("offlineDownloads", false));
  const [twoFactorAuth, setTwoFactorAuth]         = useState(() => byerStorage.get("twoFactorAuth", false));
  const [language, setLanguage]                   = useState(() => byerStorage.get("language", "Français"));
  const [currency, setCurrency]                   = useState(() => byerStorage.get("currency", "FCFA"));
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showDevicesSheet, setShowDevicesSheet] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Persistance + side-effect : applique/retire la classe `byer-dark` sur <html>
  React.useEffect(() => {
    byerStorage.set("darkMode", darkMode);
    if (darkMode) document.documentElement.classList.add("byer-dark");
    else document.documentElement.classList.remove("byer-dark");
  }, [darkMode]);
  React.useEffect(() => { byerStorage.set("pushNotifications", pushNotifications); }, [pushNotifications]);
  React.useEffect(() => { byerStorage.set("offlineDownloads", offlineDownloads); }, [offlineDownloads]);
  React.useEffect(() => { byerStorage.set("twoFactorAuth", twoFactorAuth); }, [twoFactorAuth]);
  React.useEffect(() => { byerStorage.set("language", language); }, [language]);
  React.useEffect(() => { byerStorage.set("currency", currency); }, [currency]);

  const showToastMsg = (msg, ms = 2000) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), ms);
  };

  const handleDarkModeToggle = (value) => {
    setDarkMode(value);
    showToastMsg(value ? "Mode sombre activé" : "Mode sombre désactivé");
  };

  const LANGUAGES   = ["Français", "English", "Español"];
  const CURRENCIES  = ["FCFA", "EUR", "USD"];
  const DEVICES = [
    { id:"this", name: navigator.userAgent.includes("Chrome") ? "Chrome (cet appareil)" : "Cet appareil", lastSeen:"En ligne", current:true },
  ];

  const ToggleSwitch = ({ value, onChange }) => (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 46,
        height: 26,
        borderRadius: 13,
        backgroundColor: value ? C.coral : C.border,
        display: "flex",
        alignItems: "center",
        padding: value ? "0 3px 0 0" : "0 0 0 3px",
        cursor: "pointer",
        transition: "background-color 0.2s",
        justifyContent: value ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: C.white,
        }}
      />
    </div>
  );

  const SectionHeader = ({ title }) => (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.6,
        color: C.light,
        padding: "20px 16px 8px",
        fontFamily: "DM Sans",
      }}
    >
      {title}
    </div>
  );

  const RowItem = ({ label, rightElement, onPress }) => (
    <div
      onClick={onPress}
      style={{
        backgroundColor: C.white,
        padding: "14px 16px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: onPress ? "pointer" : "default",
        fontFamily: "DM Sans",
      }}
    >
      <span style={{ color: C.dark, fontSize: 14, fontWeight: 500 }}>
        {label}
      </span>
      {rightElement}
    </div>
  );

  const ChevronElement = () => (
    <Icon name="chevron" size={16} color={C.light} stroke={2} />
  );

  const DisplayValue = ({ value }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: C.light, fontSize: 14 }}>{value}</span>
      <ChevronElement />
    </div>
  );

  const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: C.white,
          borderRadius: 12,
          padding: "24px 16px",
          minWidth: 280,
          textAlign: "center",
          fontFamily: "DM Sans",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: C.dark,
            marginBottom: 12,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 14,
            color: C.mid,
            marginBottom: 24,
            lineHeight: 1.4,
          }}
        >
          {message}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px 16px",
              backgroundColor: C.bg,
              border: "none",
              borderRadius: 6,
              color: C.dark,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "DM Sans",
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px 16px",
              backgroundColor: C.coral,
              border: "none",
              borderRadius: 6,
              color: C.white,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "DM Sans",
            }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );

  const Toast = ({ message }) => (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 16,
        right: 16,
        backgroundColor: C.dark,
        color: C.white,
        padding: "12px 16px",
        borderRadius: 8,
        textAlign: "center",
        fontSize: 14,
        fontFamily: "DM Sans",
        zIndex: 999,
        animation: "fadeIn 0.2s ease-in-out",
      }}
    >
      {message}
    </div>
  );

  return (
    <div style={{ ...S.shell, backgroundColor: C.bg }}>
      {/* Header */}
      <div
        style={{
          ...S.rentHeader,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "var(--top-pad) 16px 12px",
          backgroundColor: C.white,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:8,display:"flex",alignItems:"center"}}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
        </button>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: C.dark,
            fontFamily: "DM Sans",
          }}
        >
          Paramètres
        </div>
      </div>

      {/* Content */}
      <div style={{ ...S.scroll, paddingBottom: 80 }}>
        {/* Préférences Section */}
        <SectionHeader title="Préférences" />
        <RowItem
          label="Langue"
          rightElement={<DisplayValue value={language} />}
          onPress={() => setShowLanguagePicker(true)}
        />
        <RowItem
          label="Notifications push"
          rightElement={
            <ToggleSwitch
              value={pushNotifications}
              onChange={setPushNotifications}
            />
          }
        />
        <RowItem
          label="Mode sombre"
          rightElement={
            <ToggleSwitch
              value={darkMode}
              onChange={handleDarkModeToggle}
            />
          }
        />
        <RowItem
          label="Devise"
          rightElement={<DisplayValue value={currency} />}
          onPress={() => setShowCurrencyPicker(true)}
        />

        {/* Données Section */}
        <SectionHeader title="Données" />
        <RowItem
          label="Vider le cache"
          rightElement={<ChevronElement />}
          onPress={() => setShowClearCacheConfirm(true)}
        />
        <RowItem
          label="Téléchargements hors-ligne"
          rightElement={
            <ToggleSwitch
              value={offlineDownloads}
              onChange={setOfflineDownloads}
            />
          }
        />

        {/* Sécurité Section */}
        <SectionHeader title="Sécurité" />
        <RowItem
          label="Changer le mot de passe"
          rightElement={<ChevronElement />}
          onPress={onOpenForgotPassword}
        />
        <RowItem
          label="Vérification en 2 étapes"
          rightElement={
            <ToggleSwitch
              value={twoFactorAuth}
              onChange={setTwoFactorAuth}
            />
          }
        />
        <RowItem
          label="Appareils connectés"
          rightElement={<DisplayValue value={`${DEVICES.length} appareil${DEVICES.length>1?"s":""}`} />}
          onPress={() => setShowDevicesSheet(true)}
        />

        {/* Aide & Support Section */}
        <SectionHeader title="Aide & Support" />
        <RowItem
          label="Centre d'aide"
          rightElement={<ChevronElement />}
          onPress={onOpenSupport}
        />

        {/* À propos Section */}
        <SectionHeader title="À propos" />
        <RowItem
          label="Version de l'app"
          rightElement={
            <span style={{ color: C.light, fontSize: 14 }}>2.1.0</span>
          }
        />
        <RowItem
          label="Conditions d'utilisation"
          rightElement={<ChevronElement />}
          onPress={onOpenTerms}
        />
        <RowItem
          label="Politique de confidentialité"
          rightElement={<ChevronElement />}
          onPress={onOpenPrivacy}
        />
        <RowItem
          label="Licences open source"
          rightElement={<ChevronElement />}
          onPress={() => {
            setToastMessage("Liste des licences disponibles sur byer.cm/licences");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
          }}
        />

        {/* Bottom Actions */}
        <div style={{ padding: "24px 16px 16px" }}>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              width: "100%",
              padding: "14px 16px",
              backgroundColor: C.coral,
              border: "none",
              borderRadius: 8,
              color: C.white,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "DM Sans",
            }}
          >
            Se déconnecter
          </button>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                color: "#D32F2F",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: "DM Sans",
              }}
            >
              Supprimer mon compte
            </span>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {showClearCacheConfirm && (
        <ConfirmDialog
          title="Vider le cache"
          message="Êtes-vous sûr de vouloir supprimer tous les fichiers en cache ? Cela ne supprimera pas vos données."
          onConfirm={() => {
            setShowClearCacheConfirm(false);
            setToastMessage("Cache vidé avec succès");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
          }}
          onCancel={() => setShowClearCacheConfirm(false)}
        />
      )}

      {showLogoutConfirm && (
        <ConfirmDialog
          title="Se déconnecter"
          message="Êtes-vous sûr de vouloir vous déconnecter ?"
          onConfirm={() => {
            setShowLogoutConfirm(false);
            onLogout?.();
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Supprimer mon compte"
          message="Cette action est irréversible. Toutes vos données seront supprimées."
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onDeleteAccount?.();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {/* Picker — Langue */}
      {showLanguagePicker && (
        <PickerSheet
          title="Choisir la langue"
          options={LANGUAGES}
          selected={language}
          onSelect={(v) => { setLanguage(v); setShowLanguagePicker(false); showToastMsg(`Langue : ${v}`); }}
          onClose={() => setShowLanguagePicker(false)}
        />
      )}

      {/* Picker — Devise */}
      {showCurrencyPicker && (
        <PickerSheet
          title="Choisir la devise"
          options={CURRENCIES}
          selected={currency}
          onSelect={(v) => { setCurrency(v); setShowCurrencyPicker(false); showToastMsg(`Devise : ${v}`); }}
          onClose={() => setShowCurrencyPicker(false)}
        />
      )}

      {/* Sheet — Appareils connectés */}
      {showDevicesSheet && (
        <div
          onClick={() => setShowDevicesSheet(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:1000, display:"flex", alignItems:"flex-end" }}
        >
          <div
            onClick={(e)=>e.stopPropagation()}
            className="sheet"
            style={{ width:"100%", background:C.white, borderRadius:"16px 16px 0 0", padding:"20px 16px 32px", fontFamily:"DM Sans" }}
          >
            <div style={{ width:40, height:4, background:C.border, borderRadius:2, margin:"0 auto 16px" }} />
            <div style={{ fontSize:18, fontWeight:700, color:C.dark, marginBottom:16 }}>Appareils connectés</div>
            {DEVICES.map((d) => (
              <div key={d.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.dark }}>{d.name}</div>
                  <div style={{ fontSize:12, color:C.light, marginTop:2 }}>{d.lastSeen}</div>
                </div>
                {d.current ? (
                  <span style={{ fontSize:11, fontWeight:700, color:"#0A8754", background:"#E6F4EC", padding:"4px 8px", borderRadius:6 }}>ACTUEL</span>
                ) : (
                  <button
                    onClick={() => showToastMsg("Appareil déconnecté")}
                    style={{ background:"none", border:`1px solid ${C.coral}`, color:C.coral, fontSize:12, fontWeight:600, padding:"6px 12px", borderRadius:6, cursor:"pointer", fontFamily:"DM Sans" }}
                  >
                    Déconnecter
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setShowDevicesSheet(false)}
              style={{ width:"100%", marginTop:16, padding:"12px 16px", background:C.bg, border:"none", borderRadius:8, color:C.dark, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans" }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && <Toast message={toastMessage} />}
    </div>
  );
}

// Réutilisable: feuille bottom-sheet avec liste de choix radio.
function PickerSheet({ title, options, selected, onSelect, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:1000, display:"flex", alignItems:"flex-end" }}
    >
      <div
        onClick={(e)=>e.stopPropagation()}
        className="sheet"
        style={{ width:"100%", background:C.white, borderRadius:"16px 16px 0 0", padding:"20px 16px 32px", fontFamily:"DM Sans" }}
      >
        <div style={{ width:40, height:4, background:C.border, borderRadius:2, margin:"0 auto 16px" }} />
        <div style={{ fontSize:18, fontWeight:700, color:C.dark, marginBottom:16 }}>{title}</div>
        {options.map((opt) => {
          const active = opt === selected;
          return (
            <div
              key={opt}
              onClick={() => onSelect(opt)}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 4px", borderBottom:`1px solid ${C.border}`, cursor:"pointer" }}
            >
              <span style={{ fontSize:15, fontWeight: active ? 700 : 500, color:C.dark }}>{opt}</span>
              {active && <Icon name="check" size={18} color={C.coral} stroke={2.5} />}
            </div>
          );
        })}
        <button
          onClick={onClose}
          style={{ width:"100%", marginTop:16, padding:"12px 16px", background:C.bg, border:"none", borderRadius:8, color:C.dark, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans" }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
