function SettingsScreen({ onBack, onOpenTerms, onOpenPrivacy, onOpenForgotPassword, onOpenSupport, onLogout, onDeleteAccount }) {
  // Hook i18n : force le re-render quand la langue change globalement.
  window.byerI18n.useLangTick();

  const [pushNotifications, setPushNotifications] = useState(() => byerStorage.get("pushNotifications", true));
  const [darkMode, setDarkMode]                   = useState(() => byerStorage.get("darkMode", false));
  const [offlineDownloads, setOfflineDownloads]   = useState(() => byerStorage.get("offlineDownloads", false));
  const [twoFactorAuth, setTwoFactorAuth]         = useState(() => byerStorage.get("twoFactorAuth", false));
  const [language, setLanguage]                   = useState(() => byerStorage.get("language", "Français"));
  const [currency, setCurrency]                   = useState(() => byerStorage.get("currency", "FCFA"));
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false);
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
  React.useEffect(() => {
    byerStorage.set("language", language);
    // Notifie le systeme i18n + force le re-render global de l'app
    window.byerI18n.setLanguage(language);
  }, [language]);
  React.useEffect(() => { byerStorage.set("currency", currency); }, [currency]);

  const showToastMsg = (msg, ms = 2000) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), ms);
  };

  const handleDarkModeToggle = (value) => {
    setDarkMode(value);
    showToastMsg(value ? t("settings.darkModeOn") : t("settings.darkModeOff"));
  };

  // Liste complete des langues (20 langues, noms natifs avec drapeaux)
  const LANGUAGES   = window.byerI18n.LANGUAGES.map(l => `${l.flag} ${l.native}`);
  // Helper : extrait le nom natif depuis "🇫🇷 Francais" pour comparaison
  const stripFlag = (s) => s.replace(/^[\u{1F1E6}-\u{1F1FF}]{2}\s*/u, "").trim();
  const currentLangDisplay = window.byerI18n.LANGUAGES.find(l => l.native === language || l.label === language);
  const languageDisplay = currentLangDisplay ? `${currentLangDisplay.flag} ${currentLangDisplay.native}` : language;
  const CURRENCIES  = ["FCFA", "EUR", "USD", "GBP", "CAD", "CHF", "JPY", "CNY", "NGN", "ZAR"];
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
            {t("common.cancel")}
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
            {t("common.confirm")}
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
      {/* Header — titre CENTRÉ comme dans les autres écrans (back gauche,
          spacer droit de même largeur pour équilibrer le centre optique) */}
      <div
        style={{
          ...S.rentHeader,
          display: "flex",
          alignItems: "center",
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
            flex: 1,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 700,
            color: C.dark,
            fontFamily: "DM Sans",
          }}
        >
          {t("settings.title")}
        </div>
        {/* Spacer = même largeur que le bouton back (icon 20 + padding 8*2 = 36) */}
        <div style={{width: 36}}/>
      </div>

      {/* Content */}
      <div style={{ ...S.scroll, paddingBottom: 80 }}>
        {/* Préférences Section */}
        <SectionHeader title={t("settings.preferences")} />
        <RowItem
          label={t("settings.language")}
          rightElement={<DisplayValue value={languageDisplay} />}
          onPress={() => setShowLanguagePicker(true)}
        />
        <RowItem
          label={t("settings.notifications")}
          rightElement={
            <ToggleSwitch
              value={pushNotifications}
              onChange={setPushNotifications}
            />
          }
        />
        <RowItem
          label={t("settings.darkMode")}
          rightElement={
            <ToggleSwitch
              value={darkMode}
              onChange={handleDarkModeToggle}
            />
          }
        />
        <RowItem
          label={t("settings.currency")}
          rightElement={<DisplayValue value={currency} />}
          onPress={() => setShowCurrencyPicker(true)}
        />

        {/* Données Section */}
        <SectionHeader title={t("settings.data")} />
        <RowItem
          label={t("settings.clearCache")}
          rightElement={<ChevronElement />}
          onPress={() => setShowClearCacheConfirm(true)}
        />
        <RowItem
          label={t("settings.offlineDownloads")}
          rightElement={
            <ToggleSwitch
              value={offlineDownloads}
              onChange={setOfflineDownloads}
            />
          }
        />

        {/* Sécurité Section */}
        <SectionHeader title={t("settings.security")} />
        <RowItem
          label={t("settings.changePassword")}
          rightElement={<ChevronElement />}
          onPress={onOpenForgotPassword}
        />
        <RowItem
          label={t("settings.twoFactor")}
          rightElement={
            <ToggleSwitch
              value={twoFactorAuth}
              onChange={setTwoFactorAuth}
            />
          }
        />
        <RowItem
          label={t("settings.devices")}
          rightElement={<DisplayValue value={`${DEVICES.length}`} />}
          onPress={() => setShowDevicesSheet(true)}
        />

        {/* Aide & Support Section */}
        <SectionHeader title={t("settings.help")} />
        <RowItem
          label={t("settings.helpCenter")}
          rightElement={<ChevronElement />}
          onPress={onOpenSupport}
        />

        {/* À propos Section */}
        <SectionHeader title={t("settings.about")} />
        <RowItem
          label={t("settings.appVersion")}
          rightElement={
            <span style={{ color: C.light, fontSize: 14 }}>2.1.0</span>
          }
        />
        <RowItem
          label={t("settings.terms")}
          rightElement={<ChevronElement />}
          onPress={onOpenTerms}
        />
        <RowItem
          label={t("settings.privacy")}
          rightElement={<ChevronElement />}
          onPress={onOpenPrivacy}
        />
        <RowItem
          label={t("settings.licenses")}
          rightElement={<ChevronElement />}
          onPress={() => {
            setToastMessage("byer.cm/licences");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
          }}
        />

        {/* Bottom Actions — bouton deconnexion retire (deja dans Profil).
            Conserve seulement le lien "Supprimer mon compte". */}
        <div style={{ padding: "24px 16px 16px", textAlign: "center" }}>
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

      {/* Dialogs */}
      {showClearCacheConfirm && (
        <ConfirmDialog
          title={t("settings.clearCache")}
          message={t("settings.confirmClearCache")}
          onConfirm={() => {
            setShowClearCacheConfirm(false);
            setToastMessage(t("settings.cacheCleared"));
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
          }}
          onCancel={() => setShowClearCacheConfirm(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          title={t("settings.deleteAccount")}
          message={t("common.confirm") + " ?"}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onDeleteAccount?.();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {/* Picker — Langue (20 langues avec drapeau) */}
      {showLanguagePicker && (
        <PickerSheet
          title={t("settings.chooseLanguage")}
          options={LANGUAGES}
          selected={languageDisplay}
          onSelect={(v) => {
            // v = "🇫🇷 Francais" → on stocke uniquement le nom natif
            const native = stripFlag(v);
            setLanguage(native);
            setShowLanguagePicker(false);
            // Le toast utilise la nouvelle langue (re-render synchrone via setLanguage above)
            setTimeout(() => showToastMsg(t("settings.languageChanged", { lang: native })), 50);
          }}
          onClose={() => setShowLanguagePicker(false)}
        />
      )}

      {/* Picker — Devise */}
      {showCurrencyPicker && (
        <PickerSheet
          title={t("settings.chooseCurrency")}
          options={CURRENCIES}
          selected={currency}
          onSelect={(v) => { setCurrency(v); setShowCurrencyPicker(false); showToastMsg(t("settings.currencyChanged", { curr: v })); }}
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
            <div style={{ fontSize:18, fontWeight:700, color:C.dark, marginBottom:16 }}>{t("settings.devices")}</div>
            {DEVICES.map((d) => (
              <div key={d.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.dark }}>{d.name}</div>
                  <div style={{ fontSize:12, color:C.light, marginTop:2 }}>{d.lastSeen}</div>
                </div>
                {d.current ? (
                  <span style={{ fontSize:11, fontWeight:700, color:"#0A8754", background:"#E6F4EC", padding:"4px 8px", borderRadius:6 }}>✓</span>
                ) : (
                  <button
                    onClick={() => showToastMsg(t("common.logout"))}
                    style={{ background:"none", border:`1px solid ${C.coral}`, color:C.coral, fontSize:12, fontWeight:600, padding:"6px 12px", borderRadius:6, cursor:"pointer", fontFamily:"DM Sans" }}
                  >
                    {t("common.logout")}
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setShowDevicesSheet(false)}
              style={{ width:"100%", marginTop:16, padding:"12px 16px", background:C.bg, border:"none", borderRadius:8, color:C.dark, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans" }}
            >
              {t("common.close")}
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
