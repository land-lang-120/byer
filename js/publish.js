/* Byer — Publish Listing Screen
   Formulaire pour publier une annonce (logement ou véhicule)
   ═══════════════════════════════════════════════════ */

/* ─── PUBLISH SCREEN ─────────────────────────────── */
function PublishScreen({ onBack, initialSegment }) {
  // Si on arrive avec un segment pré-sélectionné (depuis Dashboard),
  // on saute l'étape 1 (sélection du type) directement à l'étape 2.
  const startStep = initialSegment ? 2 : 1;
  const [step, setStep]     = useState(startStep); // 1=type, 2=infos, 3=prix, 4=photos, 5=confirm
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);

  const [form, setForm] = useState({
    segment:   initialSegment || "property",      // property | vehicle
    propType:  "appartement",   // type de bien
    title:     "",
    city:      "Douala",
    zone:      "",
    beds:      1,
    baths:     1,
    guests:    2,
    amenities: [],
    nightPrice:"",
    monthPrice:"",
    description:"",
    photos:    [],              // tableau de data URLs (base64)
    // Vehicle-specific
    brand:     "",
    seats:     5,
    fuel:      "Essence",
    trans:     "Automatique",
  });

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  /* Compresser une image avant stockage (resize max 1200px, JPEG 0.8) */
  const compressImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else       { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const [uploadError, setUploadError] = useState("");

  const handleFiles = async (fileList) => {
    setUploadError("");
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    const remaining = 10 - form.photos.length;
    if (remaining <= 0) {
      setUploadError("Maximum 10 photos atteint.");
      return;
    }
    const toProcess = files.slice(0, remaining);
    const skipped = files.length - toProcess.length;
    try {
      const compressed = [];
      for (const f of toProcess) {
        if (!f.type.startsWith("image/")) continue;
        if (f.size > 10 * 1024 * 1024) {
          setUploadError(`Photo "${f.name}" trop volumineuse (max 10 Mo).`);
          continue;
        }
        const dataUrl = await compressImage(f);
        compressed.push(dataUrl);
      }
      setForm(p => ({ ...p, photos: [...p.photos, ...compressed] }));
      if (skipped > 0) setUploadError(`${skipped} photo(s) ignorée(s) — limite de 10 atteinte.`);
    } catch (err) {
      setUploadError("Erreur lors du chargement d'une photo. Réessayez.");
    }
  };

  const removePhoto = (idx) => {
    setForm(p => ({ ...p, photos: p.photos.filter((_, i) => i !== idx) }));
    setUploadError("");
  };

  const movePhotoToFirst = (idx) => {
    setForm(p => {
      const arr = [...p.photos];
      const [moved] = arr.splice(idx, 1);
      arr.unshift(moved);
      return { ...p, photos: arr };
    });
  };

  const AMENITY_OPTIONS = [
    "WiFi","Climatisé","Parking","Piscine","Vue mer","Terrasse",
    "Cuisine équipée","Eau chaude","Gardien","Groupe électrogène",
    "Smart TV","Room service","Petit-déj","Jardin","BBQ",
  ];

  const VEHICLE_AMENITIES = [
    "GPS","Climatisé","Bluetooth","4×4","Chauffeur","Wifi embarqué",
    "Siège bébé","Coffre grand","Luxe",
  ];

  const toggleAmenity = (a) => {
    setForm(p => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter(x => x !== a)
        : [...p.amenities, a],
    }));
  };

  /* Convertit un data URL base64 en File pour upload Supabase */
  const dataUrlToFile = async (dataUrl, filename) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
  };

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitting(true);

    const db = window.byer && window.byer.db;

    // Mode offline : on simule l'envoi pour ne pas bloquer la démo
    if (!db || !db.isReady) {
      setTimeout(() => { setSubmitting(false); setSuccess(true); }, 1200);
      return;
    }

    try {
      // 1) Vérifier qu'on a une session active
      const { data: sess } = await db.auth.getSession();
      const user = sess && sess.session && sess.session.user;
      if (!user) {
        setSubmitting(false);
        setSubmitError("Vous devez être connecté pour publier une annonce.");
        return;
      }

      // 2) Construire le payload listings selon le segment
      const isVehicle = form.segment === "vehicle";
      const payload = {
        owner_id:     user.id,
        type:         form.segment,
        subtype:      isVehicle ? null : form.propType,
        title:        (form.title || "").trim() || (isVehicle ? form.brand : "Sans titre"),
        description:  (form.description || "").trim() || null,
        city:         form.city,
        zone:         (form.zone || "").trim() || null,
        price_night:  form.nightPrice ? parseInt(form.nightPrice, 10) : null,
        price_month:  form.monthPrice ? parseInt(form.monthPrice, 10) : null,
        bedrooms:     isVehicle ? null : Number(form.beds)  || null,
        bathrooms:    isVehicle ? null : Number(form.baths) || null,
        max_guests:   isVehicle ? Number(form.seats) : Number(form.guests) || null,
        brand:        isVehicle ? (form.brand || "").trim() || null : null,
        fuel:         isVehicle ? form.fuel : null,
        transmission: isVehicle ? form.trans : null,
        amenities:    Array.isArray(form.amenities) ? form.amenities : [],
        is_active:    true,
      };

      // 3) INSERT listing
      const { data: listing, error: e1 } = await db.listings.create(payload);
      if (e1) {
        setSubmitting(false);
        setSubmitError("Erreur création annonce : " + (e1.message || "inconnue"));
        return;
      }

      // 4) Upload des photos (max 10) en parallèle
      if (form.photos && form.photos.length > 0) {
        const uploads = form.photos.map(async (dataUrl, idx) => {
          try {
            const file = await dataUrlToFile(dataUrl, `photo-${idx + 1}.jpg`);
            const { data: up, error: eu } = await db.storage.uploadPhoto(file, listing.id);
            if (eu || !up) return null;
            // Insert dans listing_photos avec la position
            await db.raw.from("listing_photos").insert({
              listing_id: listing.id,
              url:        up.url,
              position:   idx,
            });
            return up.url;
          } catch (err) {
            console.warn("[byer] upload photo", idx, "failed:", err);
            return null;
          }
        });
        await Promise.all(uploads);
      }

      // 5) Succès → l'annonce est en ligne
      setSubmitting(false);
      setSuccess(true);
    } catch (err) {
      console.error("[byer] publish error:", err);
      setSubmitting(false);
      setSubmitError("Erreur réseau. Vérifiez votre connexion et réessayez.");
    }
  };

  const totalSteps = 5;

  return (
    <div style={S.shell}>
      <style>{BYER_CSS}</style>

      {/* Header */}
      <div style={S.rentHeader}>
        <button style={S.dBack2} onClick={step === startStep ? onBack : () => setStep(s => Math.max(startStep, s - 1))}>
          <Icon name="back" size={20} color={C.dark} stroke={2.5}/>
        </button>
        <div style={{flex:1,textAlign:"center"}}>
          <p style={{fontSize:17,fontWeight:700,color:C.black}}>Publier une annonce</p>
          <p style={{fontSize:12,color:C.light}}>Étape {step} sur {totalSteps}</p>
        </div>
        <div style={{width:38}}/>
      </div>

      {/* Progress bar */}
      <div style={{height:3,background:C.border,margin:"0 16px 8px"}}>
        <div style={{height:"100%",width:`${(step/totalSteps)*100}%`,background:C.coral,borderRadius:2,transition:"width .3s ease"}}/>
      </div>

      {success ? (
        /* Success screen */
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,gap:16}}>
          <div style={S.successCircle}>
            <Icon name="check" size={32} color="white" stroke={2.5}/>
          </div>
          <p style={{fontSize:20,fontWeight:800,color:C.black,textAlign:"center"}}>Annonce publiée !</p>
          <p style={{fontSize:14,color:C.mid,textAlign:"center",lineHeight:1.6}}>
            Votre annonce « {form.title || "Sans titre"} » est en ligne.<br/>
            Les locataires peuvent maintenant la voir et réserver.
          </p>
          <button style={{...S.payBtn,width:"100%",maxWidth:300,marginTop:12}} onClick={onBack}>
            Retour au profil
          </button>
        </div>
      ) : (
        <div style={{flex:1,overflowY:"auto",padding:"12px 16px 100px"}}>

          {/* ── STEP 1 : Type de bien ── */}
          {step === 1 && (
            <div>
              <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Que proposez-vous ?</p>
              <p style={{fontSize:13,color:C.mid,marginBottom:20}}>Choisissez le type de bien que vous souhaitez mettre en location.</p>

              {/* Segment choice */}
              <div style={{display:"flex",gap:10,marginBottom:20}}>
                {[
                  {id:"property", label:"Logement", emoji:"🏠"},
                  {id:"vehicle",  label:"Véhicule", emoji:"🚗"},
                ].map(s => (
                  <button key={s.id}
                    onClick={() => set("segment", s.id)}
                    style={{
                      flex:1,padding:"18px",borderRadius:16,cursor:"pointer",textAlign:"center",
                      border: form.segment === s.id ? `2px solid ${C.coral}` : `1.5px solid ${C.border}`,
                      background: form.segment === s.id ? "#FFF5F5" : C.white,
                      fontFamily:"'DM Sans',sans-serif",
                    }}
                  >
                    <span style={{fontSize:28,display:"block",marginBottom:6}}>{s.emoji}</span>
                    <span style={{fontSize:14,fontWeight:600,color: form.segment === s.id ? C.coral : C.dark}}>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Property type */}
              {form.segment === "property" && (
                <>
                  <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:8}}>Type de logement</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
                    {PROP_TYPES.filter(t => t.id !== "all").map(t => (
                      <button key={t.id}
                        onClick={() => set("propType", t.id)}
                        style={{
                          padding:"8px 14px",borderRadius:12,cursor:"pointer",
                          border: form.propType === t.id ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                          background: form.propType === t.id ? "#FFF5F5" : C.white,
                          fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
                          color: form.propType === t.id ? C.coral : C.mid,
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button style={{...S.payBtn,marginTop:8}} onClick={() => setStep(2)}>
                Continuer →
              </button>
            </div>
          )}

          {/* ── STEP 2 : Informations ── */}
          {step === 2 && (
            <div>
              <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Informations</p>
              <p style={{fontSize:13,color:C.mid,marginBottom:20}}>Décrivez votre {form.segment === "property" ? "logement" : "véhicule"}.</p>

              {/* Title */}
              <div style={{marginBottom:16}}>
                <label style={Os.fieldLabel}>Titre de l'annonce</label>
                <div style={Os.fieldWrap}>
                  <input style={Os.fieldInput}
                    placeholder={form.segment === "property" ? "Ex: Villa Balnéaire Kribi" : "Ex: Toyota Land Cruiser 2022"}
                    value={form.title} onChange={e => set("title", e.target.value)}
                  />
                </div>
              </div>

              {/* City + Zone */}
              <div style={{display:"flex",gap:10,marginBottom:16}}>
                <div style={{flex:1}}>
                  <label style={Os.fieldLabel}>Ville</label>
                  <div style={Os.fieldWrap}>
                    <select style={{...Os.fieldInput,padding:"0",cursor:"pointer"}}
                      value={form.city} onChange={e => set("city", e.target.value)}
                    >
                      {LOCATIONS.slice(1).map(l => (
                        <option key={l.id} value={l.id}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{flex:1}}>
                  <label style={Os.fieldLabel}>Quartier / Zone</label>
                  <div style={Os.fieldWrap}>
                    <input style={Os.fieldInput}
                      placeholder="Ex: Bonamoussadi"
                      value={form.zone} onChange={e => set("zone", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Property-specific fields */}
              {form.segment === "property" && (
                <div style={{display:"flex",gap:10,marginBottom:16}}>
                  {[
                    {k:"beds",   label:"Chambres", min:1, max:10},
                    {k:"baths",  label:"Sdb",      min:1, max:5},
                    {k:"guests", label:"Pers. max", min:1, max:20},
                  ].map(f => (
                    <div key={f.k} style={{flex:1}}>
                      <label style={Os.fieldLabel}>{f.label}</label>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:C.bg,borderRadius:12,padding:"8px"}}>
                        <button
                          onClick={() => set(f.k, Math.max(f.min, form[f.k] - 1))}
                          style={{width:28,height:28,borderRadius:14,border:`1.5px solid ${C.border}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:C.dark}}
                        >−</button>
                        <span style={{fontSize:16,fontWeight:700,color:C.black,minWidth:20,textAlign:"center"}}>{form[f.k]}</span>
                        <button
                          onClick={() => set(f.k, Math.min(f.max, form[f.k] + 1))}
                          style={{width:28,height:28,borderRadius:14,border:`1.5px solid ${C.border}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:C.dark}}
                        >+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Vehicle-specific fields */}
              {form.segment === "vehicle" && (
                <>
                  <div style={{marginBottom:16}}>
                    <label style={Os.fieldLabel}>Marque et modèle</label>
                    <div style={Os.fieldWrap}>
                      <input style={Os.fieldInput}
                        placeholder="Ex: Toyota Land Cruiser 2022"
                        value={form.brand} onChange={e => set("brand", e.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{display:"flex",gap:10,marginBottom:16}}>
                    <div style={{flex:1}}>
                      <label style={Os.fieldLabel}>Places</label>
                      <div style={Os.fieldWrap}>
                        <select style={{...Os.fieldInput,cursor:"pointer"}}
                          value={form.seats} onChange={e => set("seats", parseInt(e.target.value))}
                        >
                          {[2,4,5,7,9,12].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{flex:1}}>
                      <label style={Os.fieldLabel}>Carburant</label>
                      <div style={Os.fieldWrap}>
                        <select style={{...Os.fieldInput,cursor:"pointer"}}
                          value={form.fuel} onChange={e => set("fuel", e.target.value)}
                        >
                          {["Essence","Diesel","Hybride","Électrique"].map(f => <option key={f}>{f}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{flex:1}}>
                      <label style={Os.fieldLabel}>Boîte</label>
                      <div style={Os.fieldWrap}>
                        <select style={{...Os.fieldInput,cursor:"pointer"}}
                          value={form.trans} onChange={e => set("trans", e.target.value)}
                        >
                          {["Automatique","Manuelle"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Description */}
              <div style={{marginBottom:16}}>
                <label style={Os.fieldLabel}>Description</label>
                <textarea
                  style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:14,padding:"12px 14px",fontSize:14,color:C.dark,fontFamily:"'DM Sans',sans-serif",resize:"none",outline:"none",lineHeight:1.6,background:C.white}}
                  rows={3}
                  placeholder="Décrivez votre bien en quelques lignes…"
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                />
              </div>

              <button style={{...S.payBtn,opacity:form.title.trim()?1:.5}} onClick={() => form.title.trim() && setStep(3)}>
                Continuer →
              </button>
            </div>
          )}

          {/* ── STEP 3 : Prix + Équipements ── */}
          {step === 3 && (
            <div>
              <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Prix & équipements</p>
              <p style={{fontSize:13,color:C.mid,marginBottom:20}}>Définissez vos tarifs et sélectionnez les équipements disponibles.</p>

              {/* Prices */}
              <div style={{display:"flex",gap:10,marginBottom:20}}>
                <div style={{flex:1}}>
                  <label style={Os.fieldLabel}>Prix / nuit (FCFA)</label>
                  <div style={Os.fieldWrap}>
                    <input style={Os.fieldInput} type="number"
                      placeholder="35 000"
                      value={form.nightPrice} onChange={e => set("nightPrice", e.target.value)}
                    />
                  </div>
                </div>
                {form.segment === "property" && (
                  <div style={{flex:1}}>
                    <label style={Os.fieldLabel}>Prix / mois (FCFA)</label>
                    <div style={Os.fieldWrap}>
                      <input style={Os.fieldInput} type="number"
                        placeholder="450 000"
                        value={form.monthPrice} onChange={e => set("monthPrice", e.target.value)}
                      />
                    </div>
                    <p style={{fontSize:10,color:C.light,marginTop:3}}>Laisser vide si non disponible au mois</p>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:8}}>
                {form.segment === "property" ? "Équipements" : "Caractéristiques"}
              </p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:24}}>
                {(form.segment === "property" ? AMENITY_OPTIONS : VEHICLE_AMENITIES).map(a => {
                  const on = form.amenities.includes(a);
                  return (
                    <button key={a}
                      onClick={() => toggleAmenity(a)}
                      style={{
                        padding:"7px 13px",borderRadius:20,cursor:"pointer",
                        border: on ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                        background: on ? "#FFF5F5" : C.white,
                        fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
                        color: on ? C.coral : C.mid,
                        display:"flex",alignItems:"center",gap:4,
                      }}
                    >
                      {on && <Icon name="check" size={12} color={C.coral} stroke={2.5}/>}
                      {a}
                    </button>
                  );
                })}
              </div>

              <button style={{...S.payBtn,opacity:form.nightPrice?1:.5}} onClick={() => form.nightPrice && setStep(4)}>
                Continuer →
              </button>
            </div>
          )}

          {/* ── STEP 4 : Photos ── */}
          {step === 4 && (
            <div>
              <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Photos</p>
              <p style={{fontSize:13,color:C.mid,marginBottom:14}}>
                Ajoutez au moins 3 photos pour attirer les locataires. ({form.photos.length}/10)
              </p>

              {/* Hidden file input */}
              <input
                id="byer-photo-input"
                type="file"
                accept="image/*"
                multiple
                style={{display:"none"}}
                onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
              />

              {/* Photo grid: existing photos + add tile */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                {form.photos.map((src, i) => (
                  <div key={i} style={{
                    position:"relative",
                    height:120,borderRadius:16,overflow:"hidden",
                    border: i === 0 ? `2px solid ${C.coral}` : `1.5px solid ${C.border}`,
                    background:C.bg,
                  }}>
                    <img src={src} alt={`Photo ${i+1}`} style={{
                      width:"100%",height:"100%",objectFit:"cover",display:"block",
                    }}/>
                    {i === 0 && (
                      <span style={{
                        position:"absolute",top:6,left:6,
                        background:C.coral,color:C.white,
                        fontSize:10,fontWeight:700,
                        padding:"3px 8px",borderRadius:8,
                        fontFamily:"'DM Sans',sans-serif",
                      }}>Principale</span>
                    )}
                    {i !== 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); movePhotoToFirst(i); }}
                        title="Définir comme principale"
                        style={{
                          position:"absolute",top:6,left:6,
                          background:"rgba(0,0,0,0.6)",color:C.white,
                          fontSize:10,fontWeight:600,
                          padding:"3px 8px",borderRadius:8,
                          border:"none",cursor:"pointer",
                          fontFamily:"'DM Sans',sans-serif",
                        }}
                      >★ Principale</button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                      title="Supprimer"
                      style={{
                        position:"absolute",top:6,right:6,
                        width:26,height:26,borderRadius:13,
                        background:"rgba(0,0,0,0.65)",color:C.white,
                        border:"none",cursor:"pointer",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:14,fontWeight:700,lineHeight:1,
                      }}
                    >×</button>
                  </div>
                ))}

                {/* Add tile (only if < 10 photos) */}
                {form.photos.length < 10 && (
                  <label htmlFor="byer-photo-input" style={{
                    height:120,borderRadius:16,
                    border:`2px dashed ${form.photos.length === 0 ? C.coral : C.border}`,
                    background: form.photos.length === 0 ? "#FFF5F5" : C.bg,
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,
                    cursor:"pointer",
                  }}>
                    <svg width="24" height="24" fill="none" stroke={form.photos.length === 0 ? C.coral : C.mid} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span style={{fontSize:11,fontWeight:600,color: form.photos.length === 0 ? C.coral : C.mid,fontFamily:"'DM Sans',sans-serif"}}>
                      {form.photos.length === 0 ? "Ajouter la 1ʳᵉ photo" : "+ Ajouter"}
                    </span>
                  </label>
                )}
              </div>

              {/* Error message */}
              {uploadError && (
                <div style={{background:"#FEF2F2",border:`1px solid #FEC8C8`,borderRadius:10,padding:"10px 12px",marginBottom:14}}>
                  <p style={{fontSize:12,color:"#B91C1C",fontFamily:"'DM Sans',sans-serif"}}>{uploadError}</p>
                </div>
              )}

              {/* Tip box */}
              <div style={{background:C.bg,borderRadius:12,padding:"12px 14px",marginBottom:20}}>
                <p style={{fontSize:12,color:C.mid,lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>
                  💡 La 1ʳᵉ photo sera utilisée comme image principale. Les images sont automatiquement compressées (max 1200 px, JPEG). Format accepté : JPG, PNG, WebP — max 10 Mo par fichier.
                </p>
              </div>

              <button
                style={{...S.payBtn,opacity: form.photos.length >= 3 ? 1 : .5}}
                onClick={() => form.photos.length >= 3 && setStep(5)}
              >
                {form.photos.length >= 3 ? "Continuer →" : `Ajoutez ${3 - form.photos.length} photo(s) de plus`}
              </button>
            </div>
          )}

          {/* ── STEP 5 : Récapitulatif ── */}
          {step === 5 && (
            <div>
              <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Récapitulatif</p>
              <p style={{fontSize:13,color:C.mid,marginBottom:20}}>Vérifiez les informations avant de publier.</p>

              {/* Photo principale preview */}
              {form.photos.length > 0 && (
                <div style={{borderRadius:16,overflow:"hidden",marginBottom:14,position:"relative",height:170}}>
                  <img src={form.photos[0]} alt="Principale" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  {form.photos.length > 1 && (
                    <span style={{
                      position:"absolute",bottom:8,right:8,
                      background:"rgba(0,0,0,0.65)",color:C.white,
                      fontSize:11,fontWeight:600,
                      padding:"4px 10px",borderRadius:10,
                      fontFamily:"'DM Sans',sans-serif",
                    }}>+{form.photos.length - 1} photos</span>
                  )}
                </div>
              )}

              <div style={{background:C.bg,borderRadius:16,padding:"16px",marginBottom:20}}>
                {[
                  {l:"Type",         v: form.segment === "property" ? (PROP_TYPES.find(t=>t.id===form.propType)?.label || form.propType) : "Véhicule"},
                  {l:"Titre",        v: form.title || "—"},
                  {l:"Ville",        v: form.city},
                  {l:"Quartier",     v: form.zone || "—"},
                  {l:"Prix / nuit",  v: form.nightPrice ? fmt(parseInt(form.nightPrice)) : "—"},
                  ...(form.segment === "property" ? [
                    {l:"Prix / mois",  v: form.monthPrice ? fmt(parseInt(form.monthPrice)) : "Non disponible"},
                    {l:"Chambres",     v: form.beds},
                    {l:"Sdb",          v: form.baths},
                    {l:"Pers. max",    v: form.guests},
                  ] : [
                    {l:"Marque",   v: form.brand || "—"},
                    {l:"Places",   v: form.seats},
                    {l:"Carburant",v: form.fuel},
                    {l:"Boîte",    v: form.trans},
                  ]),
                  {l:"Équipements",  v: form.amenities.length > 0 ? form.amenities.join(", ") : "Aucun"},
                  {l:"Photos",       v: `${form.photos.length} ajoutée(s)`},
                ].map(row => (
                  <div key={row.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                    <span style={{fontSize:13,color:C.mid}}>{row.l}</span>
                    <span style={{fontSize:13,fontWeight:600,color:C.black,textAlign:"right",maxWidth:"60%"}}>{row.v}</span>
                  </div>
                ))}
              </div>

              {submitError && (
                <div style={{
                  background:"#FEF2F2",border:"1px solid #FECACA",
                  color:"#B91C1C",padding:"10px 14px",borderRadius:8,
                  fontSize:13,marginBottom:12,
                }}>
                  {submitError}
                </div>
              )}

              <button
                style={{...S.payBtn,opacity:submitting?.7:1}}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? <div style={Os.spinner}/> : "Publier l'annonce ✓"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
