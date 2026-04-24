function EditProfileScreen({ onBack }) {
  const [formData, setFormData] = useState({
    name: USER.name,
    phone: "+237 6XX XXX XXX",
    email: "pino@email.com",
    city: USER.city,
    bio: "Membre Byer depuis mars 2025"
  });

  const [toast, setToast] = useState(null);
  const cities = ["Douala", "Yaoundé", "Kribi", "Limbé", "Buéa", "Bamenda", "Bafoussam"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e) => {
    setFormData(prev => ({
      ...prev,
      city: e.target.value
    }));
  };

  const handleSave = () => {
    setToast("Profil mis à jour !");
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: C.bg,
    fontFamily: "DM Sans, sans-serif"
  };

  const headerStyle = {
    ...S.pageHead,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "var(--top-pad) 16px 16px",
    borderBottom: `1px solid ${C.border}`
  };

  const headerLeftStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  };

  const titleStyle = {
    ...S.pageTitle,
    margin: 0,
    fontSize: "18px",
    fontWeight: 600,
    color: C.black
  };

  const saveButtonStyle = {
    background: "none",
    border: "none",
    color: C.coral,
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.2s",
    "&:hover": {
      opacity: 0.8
    }
  };

  const contentStyle = {
    ...S.scroll,
    flex: 1,
    overflow: "auto",
    paddingBottom: "100px"
  };

  const avatarSectionStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "24px",
    paddingBottom: "32px"
  };

  const avatarContainerStyle = {
    position: "relative",
    width: "80px",
    height: "80px",
    marginBottom: "12px"
  };

  const cameraButtonStyle = {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: C.coral,
    border: `3px solid ${C.white}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
  };

  const changePhotoTextStyle = {
    fontSize: "13px",
    fontWeight: 500,
    color: C.mid,
    marginTop: "8px"
  };

  const formGroupStyle = {
    marginBottom: "18px",
    padding: "0 16px"
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: 600,
    color: C.light,
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "block"
  };

  const inputStyle = {
    fontSize: "15px",
    padding: "12px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${C.border}`,
    backgroundColor: C.white,
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "DM Sans, sans-serif",
    transition: "border-color 0.2s",
    outline: "none"
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer"
  };

  const textareaStyle = {
    ...inputStyle,
    fontFamily: "DM Sans, sans-serif",
    resize: "none",
    minHeight: "80px"
  };

  const charCountStyle = {
    fontSize: "12px",
    color: C.light,
    marginTop: "6px",
    textAlign: "right"
  };

  const verificationsStyle = {
    padding: "16px",
    marginTop: "24px",
    backgroundColor: C.white,
    borderTop: `1px solid ${C.border}`,
    borderBottom: `1px solid ${C.border}`
  };

  const verificationsTitle = {
    fontSize: "13px",
    fontWeight: 600,
    color: C.light,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "16px"
  };

  const verificationItemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "16px",
    marginBottom: "16px",
    borderBottom: `1px solid ${C.border}`
  };

  const verificationItemLastStyle = {
    ...verificationItemStyle,
    borderBottom: "none",
    paddingBottom: "0",
    marginBottom: "0"
  };

  const verificationLabelStyle = {
    fontSize: "14px",
    fontWeight: 500,
    color: C.black
  };

  const verificationStatusStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  const verifiedStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#22C55E"
  };

  const notVerifiedStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#F59E0B"
  };

  const verifyButtonStyle = {
    background: "none",
    border: "none",
    color: "#F59E0B",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    padding: "6px 0",
    textDecoration: "underline",
    transition: "opacity 0.2s"
  };

  const saveButtonFullStyle = {
    position: "fixed",
    bottom: "16px",
    left: "16px",
    right: "16px",
    width: "calc(100% - 32px)",
    padding: "14px 20px",
    backgroundColor: C.coral,
    color: C.white,
    border: "none",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(255,90,95,0.25)"
  };

  const toastStyle = {
    position: "fixed",
    bottom: "80px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: C.black,
    color: C.white,
    borderRadius: "12px",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: 500,
    animation: `toastFade 2s ease-in-out`,
    whiteSpace: "nowrap"
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes toastFade {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        input:focus {
          border-color: ${C.coral} !important;
          box-shadow: 0 0 0 3px rgba(255,90,95,0.1);
        }
        select:focus {
          border-color: ${C.coral} !important;
          box-shadow: 0 0 0 3px rgba(255,90,95,0.1);
        }
        textarea:focus {
          border-color: ${C.coral} !important;
          box-shadow: 0 0 0 3px rgba(255,90,95,0.1);
        }
      `}</style>

      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              padding: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon name="back" size={20} color={C.dark} stroke={2.5} />
          </button>
          <h1 style={titleStyle}>Modifier le profil</h1>
        </div>
        <button onClick={handleSave} style={saveButtonStyle}>Enregistrer</button>
      </div>

      <div style={contentStyle}>
        <div style={avatarSectionStyle}>
          <div style={avatarContainerStyle}>
            <FaceAvatar
              photo={USER.photo}
              avatar={USER.avatar}
              bg={USER.bg}
              size={80}
              radius={40}
            />
            <div style={cameraButtonStyle}>
              <svg width="16" height="16" fill="none" stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          </div>
          <div style={changePhotoTextStyle}>Changer la photo</div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Nom complet</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Numéro de téléphone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Ville</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleSelectChange}
            style={selectStyle}
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            maxLength={200}
            style={textareaStyle}
          />
          <div style={charCountStyle}>{formData.bio.length}/200</div>
        </div>

        <div style={verificationsStyle}>
          <div style={verificationsTitle}>Vérifications</div>

          <div style={verificationItemStyle}>
            <div style={verificationLabelStyle}>Téléphone</div>
            <div style={verificationStatusStyle}>
              <div style={verifiedStyle}>
                <svg width="18" height="18" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span style={{fontSize:13,fontWeight:600}}>Vérifié</span>
              </div>
            </div>
          </div>

          <div style={verificationItemStyle}>
            <div style={verificationLabelStyle}>Email</div>
            <div style={verificationStatusStyle}>
              <div style={notVerifiedStyle}>
                <svg width="18" height="18" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{fontSize:13,fontWeight:600}}>Non vérifié</span>
              </div>
              <button style={verifyButtonStyle}>Vérifier</button>
            </div>
          </div>

          <div style={verificationItemLastStyle}>
            <div style={verificationLabelStyle}>Identité</div>
            <div style={verificationStatusStyle}>
              <div style={notVerifiedStyle}>
                <svg width="18" height="18" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{fontSize:13,fontWeight:600}}>Non vérifié</span>
              </div>
              <button style={verifyButtonStyle}>Vérifier</button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        style={saveButtonFullStyle}
      >
        Enregistrer les modifications
      </button>

      {toast && (
        <div style={toastStyle}>
          {toast}
        </div>
      )}
    </div>
  );
}
