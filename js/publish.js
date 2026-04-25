/* Byer — Publish Listing Screen
   Formulaire pour publier une annonce (logement ou véhicule)
   ═══════════════════════════════════════════════════ */

/* ─── BUILDING TYPES ───────────────────────────────
   Types de logements de niveau "bâtiment" et leurs sous-catégories
   d'unités locables typiques. Sert à structurer l'annonce :
   un immeuble peut contenir plusieurs appartements/studios/chambres,
   un hôtel/motel/auberge contient uniquement des chambres,
   une maison ou villa est elle-même l'unité unique.
─────────────────────────────────────────────────── */
const BUILDING_TYPES = [
  { id:"maison",   label:"Maison",   emoji:"🏡", units:[{ id:"maison", label:"La maison" }] },
  { id:"villa",    label:"Villa",    emoji:"🏖️", units:[{ id:"villa",  label:"La villa"  }] },
  { id:"immeuble", label:"Immeuble", emoji:"🏢", units:[
    { id:"appartement", label:"Appartements" },
    { id:"studio",      label:"Studios"      },
    { id:"chambre",     label:"Chambres"     },
  ]},
  { id:"hotel",   label:"Hôtel",   emoji:"🏨", units:[{ id:"chambre", label:"Chambres" }] },
  { id:"motel",   label:"Motel",   emoji:"🛏️", units:[{ id:"chambre", label:"Chambres" }] },
  { id:"auberge", label:"Auberge", emoji:"🛌", units:[{ id:"chambre", label:"Chambres" }] },
];

/* Pièces définissables par unité locable (par sous-catégorie). */
const ROOM_FIELDS = [
  { k:"sejour",    label:"Séjour",         emoji:"🛋️" },
  { k:"chambre",   label:"Chambre",        emoji:"🛏️" },
  { k:"cuisine",   label:"Cuisine",        emoji:"🍳" },
  { k:"douche",    label:"Douche/SdB",     emoji:"🚿" },
  { k:"magasin",   label:"Magasin",        emoji:"📦" },
  { k:"buanderie", label:"Buanderie",      emoji:"🧺" },
  { k:"garage",    label:"Garage",         emoji:"🚙" },
  { k:"piscine",   label:"Piscine",        emoji:"🏊" },
  { k:"gym",       label:"Salle de sport", emoji:"🏋️" },
  { k:"terrasse",  label:"Terrasse",       emoji:"🌅" },
];

/* Compo par défaut selon le sous-type d'unité.
   Chaque pièce est un objet { count, instances } :
   - count : nombre total de cette pièce
   - instances : null par défaut (toutes identiques) → liste {id, amenities}
                 quand l'utilisateur clique "Configurer individuellement"
                 (permet ex. chambre 1 avec douche privée + clim, chambre 2 nue) */
const DEFAULT_ROOMS_FLAT = (subType) => {
  if (subType === "chambre") return { chambre:1, douche:1, sejour:0, cuisine:0, magasin:0, buanderie:0, garage:0, piscine:0, gym:0, terrasse:0 };
  if (subType === "studio")  return { sejour:1, chambre:0, cuisine:1, douche:1, magasin:0, buanderie:0, garage:0, piscine:0, gym:0, terrasse:0 };
  if (subType === "villa" || subType === "maison")
                              return { sejour:1, chambre:3, cuisine:1, douche:2, magasin:0, buanderie:1, garage:1, piscine:0, gym:0, terrasse:1 };
  /* appartement par défaut */
  return { sejour:1, chambre:2, cuisine:1, douche:1, magasin:0, buanderie:0, garage:0, piscine:0, gym:0, terrasse:0 };
};

/* Wrap chaque count dans un objet {count, instances:null} pour permettre la
   configuration pièce-par-pièce ultérieurement. */
const DEFAULT_ROOMS = (subType) => {
  const flat = DEFAULT_ROOMS_FLAT(subType);
  const out = {};
  Object.keys(flat).forEach(k => { out[k] = { count: flat[k], instances: null }; });
  return out;
};

/* Équipements suggérés PAR PIÈCE — proposés quand l'utilisateur configure
   chaque pièce individuellement. La liste est curée pour chaque type de
   pièce (une chambre n'a pas les mêmes options qu'une cuisine). */
const ROOM_AMENITIES = {
  sejour:    ["Smart TV","Climatisé","Canapé-lit","Vue mer","Cheminée","Home cinéma"],
  chambre:   ["Lit double","Lit simple","Lits superposés","Douche privée","WC privé","Climatisé","Balcon","Vue mer","Smart TV","Coffre-fort","Bureau","Dressing"],
  cuisine:   ["Équipée","Électroménager","Micro-ondes","Lave-vaisselle","Frigo","Cafetière","Bouilloire","Four","Plaque induction"],
  douche:    ["Baignoire","Douche italienne","Eau chaude","Sèche-cheveux","Jacuzzi","WC séparé"],
  magasin:   ["Sécurisé","Climatisé","Étagères","Volet roulant"],
  buanderie: ["Lave-linge","Sèche-linge","Étendoir","Fer à repasser","Évier"],
  garage:    ["Couvert","Sécurisé","Porte automatique","Recharge VE","Plusieurs places"],
  piscine:   ["Chauffée","À débordement","Couverte","Pour enfants","Éclairage nocturne"],
  gym:       ["Cardio","Musculation","Tapis","Sauna","Hammam","Vestiaire"],
  terrasse:  ["Couverte","Vue mer","Mobilier extérieur","BBQ","Pergola","Éclairage"],
};

/* Équipements communs suggérés par TYPE D'ENTITÉ (bâtiment).
   Chaque type de bâtiment a ses caractéristiques typiques — affichées en
   étape 3 comme suggestions par défaut. L'utilisateur les coche/décoche
   selon la réalité. */
const BUILDING_AMENITIES_BY_TYPE = {
  maison:   ["Jardin","Garage","Dépendance","Piscine privée","Portail automatique","Barrière sécurisée","Citerne d'eau","Panneaux solaires","Cour intérieure","Atelier"],
  villa:    ["Piscine privée","Jardin paysager","Garage","Vue mer","BBQ","Terrasse panoramique","Maison du gardien","Cuisine d'été","Pool house","Court de tennis"],
  immeuble: ["Ascenseur","Gardien 24/7","Parking sécurisé","Vidéosurveillance","Local poubelles","Local vélos","Hall d'entrée","Interphone","Groupe électrogène","Forage d'eau"],
  hotel:    ["Réception 24/7","Restaurant","Bar","Piscine","Salle de sport","Spa","Salle de conférence","Parking","Ascenseur","Room service","Navette aéroport","Blanchisserie"],
  motel:    ["Réception","Parking gratuit","Vidéosurveillance","WiFi gratuit","Distributeur","Petit-déj inclus","Accès 24/7"],
  auberge:  ["Réception","Cuisine commune","Salon commun","WiFi gratuit","Casiers","Buanderie","Terrasse","Petit-déj inclus","Vélos en location"],
};

/* IDs uniques pour les instances de pièces (clé React stable) */
let _roomInstanceCounter = 1;
const newRoomInstanceId = () => `r${Date.now().toString(36)}-${_roomInstanceCounter++}`;
const buildRoomInstances = (count) =>
  Array.from({length: count}, () => ({ id: newRoomInstanceId(), amenities: [] }));

/* ID unique pour chaque variante (ne dépend pas de l'ordre — stable même
   après suppression/ajout). Suffit pour les keys React et le tracking. */
let _variantIdCounter = 1;
const newVariantId = () => `v${Date.now().toString(36)}-${_variantIdCounter++}`;

/* Construction de l'état initial unitsConfig pour un buildingType.
   Chaque sous-catégorie démarre avec UNE variante (count=1) configurée
   par défaut. L'utilisateur peut ensuite :
   - augmenter le count si toutes les unités sont identiques (duplication)
   - ajouter d'autres variantes si certaines unités ont une compo différente
   - supprimer une variante
   Chaque variante a aussi sa propre liste d'amenities (équipements
   spécifiques à l'unité, distincts des équipements communs du bâtiment). */
const buildUnitsConfig = (buildingType) => {
  const bt = BUILDING_TYPES.find(b => b.id === buildingType);
  if (!bt) return {};
  const cfg = {};
  bt.units.forEach(u => {
    cfg[u.id] = {
      label: u.label,
      variants: [
        { id: newVariantId(), count: 1, rooms: DEFAULT_ROOMS(u.id), amenities: [] },
      ],
    };
  });
  return cfg;
};

/* ─── ÉQUIPEMENTS DUAL-NIVEAU ──────────────────────
   - Équipements communs (BUILDING) : partagés par toutes les unités du bâtiment
     (piscine commune, ascenseur, gardien, parking sécurisé, salle de sport
     du complexe…). À cocher au niveau de l'annonce/bâtiment.
   - Équipements par unité (UNIT) : propres à chaque appartement / chambre /
     studio individuel (WiFi privé, climatisé, smart TV, cuisine équipée,
     eau chaude…). Cochés sur chaque variante.
   Cette séparation permet à un immeuble d'avoir une piscine commune ET à
   chaque appartement d'avoir son propre WiFi/clim/etc. */
const BUILDING_AMENITY_OPTIONS = [
  "Piscine commune","Salle de sport","Ascenseur","Gardien 24/7",
  "Parking sécurisé","Terrasse commune","Buanderie commune","Jardin",
  "BBQ","Groupe électrogène","Réception","Vidéosurveillance",
];

const UNIT_AMENITY_OPTIONS = [
  "WiFi","Climatisé","Eau chaude","Cuisine équipée",
  "Smart TV","Vue mer","Balcon privé","Coffre-fort",
  "Room service","Petit-déj","Mini-bar","Sèche-cheveux",
];

/* ─── PUBLISH SCREEN ─────────────────────────────── */
function PublishScreen({ onBack, initialSegment }) {
  // Si on arrive avec un segment pré-sélectionné (depuis Dashboard),
  // on saute l'étape 1 (sélection du type) directement à l'étape 2.
  const startStep = initialSegment ? 2 : 1;
  const [step, setStep]     = useState(startStep); // 1=type, 2=infos, 3=prix, 4=photos, 5=confirm
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);

  const [form, setForm] = useState({
    segment:      initialSegment || "property",      // property | vehicle
    buildingType: "maison",                          // maison | villa | immeuble | hotel | motel | auberge
    /* unitsConfig : {[subTypeId]: {label, count, rooms:{sejour,chambre,...}}}
       Initialisé selon le buildingType par défaut. Re-initialisé à chaque
       changement de buildingType (fait dans setBuildingType).
       Garde la trace par sous-catégorie pour préserver les saisies si
       l'utilisateur re-bascule sur un type qu'il avait déjà rempli. */
    unitsConfig:  buildUnitsConfig("maison"),
    title:        "",
    city:         "Douala",
    zone:         "",
    /* buildingAmenities : équipements communs au bâtiment entier
       (piscine, ascenseur, gardien…) — ne s'applique qu'aux logements.
       Distinct de variant.amenities qui est par-unité. */
    buildingAmenities: [],
    /* amenities : conservé pour les véhicules (équipements uniques) */
    amenities:    [],
    nightPrice:   "",
    monthPrice:   "",
    description:  "",
    photos:       [],              // tableau de data URLs (base64)
    // Vehicle-specific
    brand:        "",
    seats:        5,
    fuel:         "Essence",
    trans:        "Automatique",
  });

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  /* Helpers pour gérer la composition des unités locables (variantes) */
  const setBuildingType = (bt) => {
    setForm(p => ({
      ...p,
      buildingType: bt,
      // Reset unitsConfig pour ce nouveau type (pas de mémoire entre types)
      unitsConfig: buildUnitsConfig(bt),
    }));
  };
  /* Maj count d'une variante donnée. Si count tombe à 0, on garde la variante
     (l'utilisateur peut ré-incrémenter sans perdre sa compo). Pour supprimer,
     utiliser removeVariant. */
  const setVariantCount = (subId, variantId, delta) => {
    setForm(p => {
      const sub = p.unitsConfig[subId];
      if (!sub) return p;
      const newVariants = sub.variants.map(v =>
        v.id === variantId ? { ...v, count: Math.max(0, Math.min(99, v.count + delta)) } : v
      );
      return { ...p, unitsConfig: { ...p.unitsConfig, [subId]: { ...sub, variants: newVariants } } };
    });
  };
  /* Maj du nombre d'une pièce pour une variante donnée.
     Si la pièce est en mode "individuel" (instances != null), on synchronise
     la longueur du tableau d'instances avec le nouveau count :
     - count up : ajoute des instances vides à la fin
     - count down : tronque depuis la fin */
  const setVariantRoom = (subId, variantId, roomKey, delta) => {
    setForm(p => {
      const sub = p.unitsConfig[subId];
      if (!sub) return p;
      const newVariants = sub.variants.map(v => {
        if (v.id !== variantId) return v;
        const cur = v.rooms[roomKey] || { count: 0, instances: null };
        const newCount = Math.max(0, Math.min(20, cur.count + delta));
        let newInstances = cur.instances;
        if (cur.instances) {
          if (newCount > cur.instances.length) {
            newInstances = [...cur.instances, ...buildRoomInstances(newCount - cur.instances.length)];
          } else if (newCount < cur.instances.length) {
            newInstances = cur.instances.slice(0, newCount);
          }
        }
        return { ...v, rooms: { ...v.rooms, [roomKey]: { count: newCount, instances: newInstances } } };
      });
      return { ...p, unitsConfig: { ...p.unitsConfig, [subId]: { ...sub, variants: newVariants } } };
    });
  };
  /* Bascule mode "configuration individuelle" pour une pièce d'une variante.
     - off→on : crée N instances vides (N = count actuel)
     - on→off : supprime les instances (toutes les pièces redeviennent identiques) */
  const toggleRoomDetailed = (subId, variantId, roomKey) => {
    setForm(p => {
      const sub = p.unitsConfig[subId];
      if (!sub) return p;
      const newVariants = sub.variants.map(v => {
        if (v.id !== variantId) return v;
        const cur = v.rooms[roomKey] || { count: 0, instances: null };
        if (cur.count === 0) return v;
        const newInstances = cur.instances === null ? buildRoomInstances(cur.count) : null;
        return { ...v, rooms: { ...v.rooms, [roomKey]: { ...cur, instances: newInstances } } };
      });
      return { ...p, unitsConfig: { ...p.unitsConfig, [subId]: { ...sub, variants: newVariants } } };
    });
  };
  /* Toggle équipement pour UNE instance précise d'une pièce */
  const toggleRoomInstanceAmenity = (subId, variantId, roomKey, instanceIdx, amenity) => {
    setForm(p => {
      const sub = p.unitsConfig[subId];
      if (!sub) return p;
      const newVariants = sub.variants.map(v => {
        if (v.id !== variantId) return v;
        const cur = v.rooms[roomKey];
        if (!cur || !cur.instances) return v;
        const newInst = cur.instances.map((inst, idx) => {
          if (idx !== instanceIdx) return inst;
          const has = (inst.amenities || []).includes(amenity);
          const newAmens = has ? inst.amenities.filter(x => x !== amenity) : [...(inst.amenities || []), amenity];
          return { ...inst, amenities: newAmens };
        });
        return { ...v, rooms: { ...v.rooms, [roomKey]: { ...cur, instances: newInst } } };
      });
      return { ...p, unitsConfig: { ...p.unitsConfig, [subId]: { ...sub, variants: newVariants } } };
    });
  };
  /* Ajoute une nouvelle variante (config différente) à une sous-catégorie */
  const addVariant = (subId) => {
    setForm(p => {
      const sub = p.unitsConfig[subId];
      if (!sub) return p;
      const newVar = { id: newVariantId(), count: 1, rooms: DEFAULT_ROOMS(subId), amenities: [] };
      return { ...p, unitsConfig: { ...p.unitsConfig, [subId]: { ...sub, variants: [...sub.variants, newVar] } } };
    });
  };
  /* Supprime une variante (uniquement si plus d'une) */
  const removeVariant = (subId, variantId) => {
    setForm(p => {
      const sub = p.unitsConfig[subId];
      if (!sub || sub.variants.length <= 1) return p;
      return {
        ...p,
        unitsConfig: { ...p.unitsConfig, [subId]: { ...sub, variants: sub.variants.filter(v => v.id !== variantId) } },
      };
    });
  };
  /* Toggle équipement commun au bâtiment */
  const toggleBuildingAmenity = (a) => {
    setForm(p => ({
      ...p,
      buildingAmenities: p.buildingAmenities.includes(a)
        ? p.buildingAmenities.filter(x => x !== a)
        : [...p.buildingAmenities, a],
    }));
  };
  /* Toggle équipement spécifique à une variante */
  const toggleVariantAmenity = (subId, variantId, a) => {
    setForm(p => {
      const sub = p.unitsConfig[subId];
      if (!sub) return p;
      const newVariants = sub.variants.map(v => {
        if (v.id !== variantId) return v;
        const has = (v.amenities || []).includes(a);
        const newAmens = has ? v.amenities.filter(x => x !== a) : [...(v.amenities || []), a];
        return { ...v, amenities: newAmens };
      });
      return { ...p, unitsConfig: { ...p.unitsConfig, [subId]: { ...sub, variants: newVariants } } };
    });
  };

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

  /* Équipements véhicule (la liste property est splittée en 2 :
     BUILDING_AMENITY_OPTIONS au niveau bâtiment + UNIT_AMENITY_OPTIONS
     par variante — voir constantes en haut du fichier). */
  const VEHICLE_AMENITIES = [
    "GPS","Climatisé","Bluetooth","4×4","Chauffeur","Wifi embarqué",
    "Siège bébé","Coffre grand","Luxe",
  ];

  /* Toggle pour véhicules uniquement (utilise form.amenities). */
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
      /* Pour un logement, on calcule des agrégats à partir de la compo des
         unités (somme pondérée par count). Sert à conserver les champs
         legacy bedrooms/bathrooms/max_guests cohérents pour les requêtes. */
      let aggBeds = null, aggBaths = null, aggGuests = null;
      if (!isVehicle) {
        const bt = BUILDING_TYPES.find(b => b.id === form.buildingType);
        if (bt) {
          let beds = 0, baths = 0;
          bt.units.forEach(u => {
            const sub = form.unitsConfig[u.id];
            if (!sub) return;
            sub.variants.forEach(v => {
              const ch = v.rooms.chambre ? (v.rooms.chambre.count || 0) : 0;
              const dc = v.rooms.douche  ? (v.rooms.douche.count  || 0) : 0;
              beds  += ch * v.count;
              baths += dc * v.count;
            });
          });
          aggBeds   = beds  || null;
          aggBaths  = baths || null;
          aggGuests = beds ? beds * 2 : null;   // estimation 2 personnes par chambre
        }
      }
      const payload = {
        owner_id:     user.id,
        type:         form.segment,
        subtype:      isVehicle ? null : form.buildingType,
        title:        (form.title || "").trim() || (isVehicle ? form.brand : "Sans titre"),
        description:  (form.description || "").trim() || null,
        city:         form.city,
        zone:         (form.zone || "").trim() || null,
        price_night:  form.nightPrice ? parseInt(form.nightPrice, 10) : null,
        price_month:  form.monthPrice ? parseInt(form.monthPrice, 10) : null,
        bedrooms:     aggBeds,
        bathrooms:    aggBaths,
        max_guests:   isVehicle ? Number(form.seats) : aggGuests,
        brand:        isVehicle ? (form.brand || "").trim() || null : null,
        fuel:         isVehicle ? form.fuel : null,
        transmission: isVehicle ? form.trans : null,
        /* Pour les véhicules : form.amenities (liste plate).
           Pour les logements : on agrège équipements communs +
           équipements uniques de toutes les variantes (dédoublonnés)
           dans le champ amenities pour rester compatible avec les requêtes
           legacy de filtrage; la granularité est conservée dans units_config
           et building_amenities. */
        amenities:    isVehicle
                        ? (Array.isArray(form.amenities) ? form.amenities : [])
                        : (() => {
                            /* Agrège tous les niveaux : bâtiment + variante + chaque instance
                               de pièce (granularité maximale). Dédoublonné via Set pour rester
                               compatible avec le filtrage legacy par mots-clés. */
                            const set = new Set(form.buildingAmenities || []);
                            Object.values(form.unitsConfig || {}).forEach(sub => {
                              (sub.variants || []).forEach(v => {
                                (v.amenities || []).forEach(a => set.add(a));
                                Object.values(v.rooms || {}).forEach(room => {
                                  if (room && Array.isArray(room.instances)) {
                                    room.instances.forEach(inst => {
                                      (inst.amenities || []).forEach(a => set.add(a));
                                    });
                                  }
                                });
                              });
                            });
                            return Array.from(set);
                          })(),
        building_amenities: isVehicle ? null : (form.buildingAmenities || []),
        /* Compo détaillée par unité — stockée en JSON pour conserver la
           granularité des variantes, pièces et amenities par variante.
           Le backend peut l'ignorer sans casser, ou la persister selon
           le schéma listings. */
        units_config: isVehicle ? null : form.unitsConfig,
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

              {/* Property building type — 6 types principaux */}
              {form.segment === "property" && (
                <>
                  <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:8}}>Type de logement</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
                    {BUILDING_TYPES.map(t => {
                      const on = form.buildingType === t.id;
                      return (
                        <button key={t.id}
                          onClick={() => setBuildingType(t.id)}
                          style={{
                            padding:"14px 8px",borderRadius:14,cursor:"pointer",
                            border: on ? `2px solid ${C.coral}` : `1.5px solid ${C.border}`,
                            background: on ? "#FFF5F5" : C.white,
                            fontFamily:"'DM Sans',sans-serif",
                            display:"flex",flexDirection:"column",alignItems:"center",gap:6,
                          }}
                        >
                          <span style={{fontSize:24}}>{t.emoji}</span>
                          <span style={{fontSize:12,fontWeight:700,color: on ? C.coral : C.dark}}>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p style={{fontSize:11,color:C.light,marginBottom:12,lineHeight:1.5}}>
                    💡 Vous pourrez détailler les unités locables (appartements, chambres…) et leurs pièces à l'étape suivante.
                  </p>
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

              {/* Property-specific : composition des unités locables (avec variantes)
                  Chaque sous-catégorie peut avoir plusieurs variantes, chacune avec :
                  - un count (nb d'unités identiques de cette config)
                  - une compo de pièces propre
                  Permet de modéliser un immeuble mixte (ex: 3 appart 3 pièces +
                  2 appart 2 pièces) ou de simplement dupliquer si tout est identique. */}
              {form.segment === "property" && (() => {
                const bt = BUILDING_TYPES.find(b => b.id === form.buildingType);
                if (!bt) return null;
                return (
                  <div style={{marginBottom:18}}>
                    <p style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:14}}>{bt.emoji}</span> Sous-catégories & pièces
                    </p>
                    <p style={{fontSize:11,color:C.light,marginBottom:12,lineHeight:1.5}}>
                      Pour chaque sous-catégorie, définissez le nombre d'unités identiques (duplication) et leur composition. Vous pouvez aussi <strong>ajouter une variante</strong> si certaines unités ont une configuration différente.
                    </p>

                    {bt.units.map(u => {
                      const sub = form.unitsConfig[u.id];
                      if (!sub) return null;
                      const totalUnits = sub.variants.reduce((s,v) => s+v.count, 0);
                      return (
                        <div key={u.id} style={{
                          background:"#FAFAFA",border:`1.5px solid ${C.border}`,borderRadius:14,
                          padding:"12px",marginBottom:12,
                        }}>
                          {/* Sous-cat header */}
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                            <div>
                              <p style={{fontSize:13,fontWeight:700,color:C.black}}>{u.label}</p>
                              <p style={{fontSize:10,color:C.light,marginTop:1}}>
                                {totalUnits} unité{totalUnits>1?"s":""} · {sub.variants.length} variante{sub.variants.length>1?"s":""}
                              </p>
                            </div>
                            <button
                              onClick={() => addVariant(u.id)}
                              style={{
                                background:C.white,border:`1.5px dashed ${C.coral}`,
                                color:C.coral,fontSize:11,fontWeight:700,
                                borderRadius:10,padding:"6px 10px",cursor:"pointer",
                                fontFamily:"'DM Sans',sans-serif",
                              }}
                            >+ Ajouter variante</button>
                          </div>

                          {/* Liste des variantes */}
                          {sub.variants.map((vrt, vIdx) => (
                            <div key={vrt.id} style={{
                              background:C.white,border:`1px solid ${C.border}`,borderRadius:12,
                              padding:"10px 12px",marginBottom:8,
                            }}>
                              {/* Variant header */}
                              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:vrt.count>0?10:0,gap:8}}>
                                <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                                  <span style={{
                                    fontSize:10,fontWeight:700,color:C.coral,
                                    background:"#FFF5F5",border:`1px solid #FFD6D7`,
                                    borderRadius:6,padding:"2px 7px",
                                  }}>
                                    Variante {vIdx+1}
                                  </span>
                                  <span style={{fontSize:11,color:C.mid,fontFamily:"'DM Sans',sans-serif"}}>
                                    {vrt.count} × identique{vrt.count>1?"s":""}
                                  </span>
                                </div>
                                <div style={{display:"flex",alignItems:"center",gap:6}}>
                                  {/* Count */}
                                  <div style={{display:"flex",alignItems:"center",gap:6,background:C.bg,borderRadius:9,padding:"3px 5px"}}>
                                    <button
                                      onClick={() => setVariantCount(u.id, vrt.id, -1)}
                                      style={{width:24,height:24,borderRadius:12,border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:C.dark,padding:0}}
                                    >−</button>
                                    <span style={{fontSize:13,fontWeight:800,color:C.black,minWidth:18,textAlign:"center"}}>{vrt.count}</span>
                                    <button
                                      onClick={() => setVariantCount(u.id, vrt.id, +1)}
                                      style={{width:24,height:24,borderRadius:12,border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:C.dark,padding:0}}
                                    >+</button>
                                  </div>
                                  {/* Delete (only if more than 1 variant) */}
                                  {sub.variants.length > 1 && (
                                    <button
                                      onClick={() => removeVariant(u.id, vrt.id)}
                                      title="Supprimer cette variante"
                                      style={{width:26,height:26,borderRadius:8,border:"none",background:"#FEF2F2",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#B91C1C",fontSize:14,padding:0}}
                                    >×</button>
                                  )}
                                </div>
                              </div>

                              {/* Pièces par unité — visible uniquement si count >= 1
                                  Chaque pièce affiche : compteur +/- ET un toggle
                                  "⚙️ Détailler" qui révèle N cartes individuelles
                                  (une par instance de pièce) avec leurs amenities propres.
                                  Permet ex. dans une maison : 2 chambres dont 1 avec
                                  douche privée, l'autre sans. */}
                              {vrt.count > 0 && (
                                <>
                                  <p style={{fontSize:10,fontWeight:600,color:C.mid,marginBottom:6,textTransform:"uppercase",letterSpacing:.4}}>
                                    Pièces par unité
                                  </p>
                                  <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
                                    {ROOM_FIELDS.map(r => {
                                      const room = vrt.rooms[r.k] || { count:0, instances:null };
                                      const isDetailed = room.instances !== null;
                                      const amensCatalog = ROOM_AMENITIES[r.k] || [];
                                      return (
                                        <div key={r.k} style={{
                                          background:C.bg,borderRadius:8,padding:"6px 9px",
                                        }}>
                                          {/* Ligne principale : compteur + toggle détail */}
                                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                                            <span style={{fontSize:11,color:C.dark,display:"flex",alignItems:"center",gap:5,flex:1,minWidth:0}}>
                                              <span style={{fontSize:13}}>{r.emoji}</span>
                                              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.label}</span>
                                            </span>
                                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                                              {/* Toggle "Détailler chaque pièce" — visible si count >= 1 */}
                                              {room.count > 0 && amensCatalog.length > 0 && (
                                                <button
                                                  onClick={() => toggleRoomDetailed(u.id, vrt.id, r.k)}
                                                  title={isDetailed ? "Tout identique" : "Configurer chaque pièce"}
                                                  style={{
                                                    fontSize:9,fontWeight:700,padding:"2px 7px",
                                                    borderRadius:8,cursor:"pointer",
                                                    border: isDetailed ? `1px solid ${C.coral}` : `1px solid ${C.border}`,
                                                    background: isDetailed ? "#FFF5F5" : C.white,
                                                    color: isDetailed ? C.coral : C.mid,
                                                    fontFamily:"'DM Sans',sans-serif",
                                                  }}
                                                >
                                                  {isDetailed ? "Détaillé ✓" : "⚙️ Détailler"}
                                                </button>
                                              )}
                                              <button
                                                onClick={() => setVariantRoom(u.id, vrt.id, r.k, -1)}
                                                style={{width:20,height:20,borderRadius:10,border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.dark,padding:0}}
                                              >−</button>
                                              <span style={{fontSize:11,fontWeight:700,color:C.black,minWidth:12,textAlign:"center"}}>{room.count}</span>
                                              <button
                                                onClick={() => setVariantRoom(u.id, vrt.id, r.k, +1)}
                                                style={{width:20,height:20,borderRadius:10,border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.dark,padding:0}}
                                              >+</button>
                                            </div>
                                          </div>

                                          {/* Mode détaillé : carte par instance de pièce */}
                                          {isDetailed && room.instances && room.instances.length > 0 && (
                                            <div style={{marginTop:8,paddingTop:8,borderTop:`1px dashed ${C.border}`,display:"flex",flexDirection:"column",gap:6}}>
                                              {room.instances.map((inst, instIdx) => (
                                                <div key={inst.id} style={{
                                                  background:C.white,border:`1px solid ${C.border}`,
                                                  borderRadius:8,padding:"7px 9px",
                                                }}>
                                                  <p style={{fontSize:10,fontWeight:700,color:C.coral,marginBottom:5,textTransform:"uppercase",letterSpacing:.4}}>
                                                    {r.emoji} {r.label} {instIdx + 1}
                                                  </p>
                                                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                                                    {amensCatalog.map(a => {
                                                      const on = (inst.amenities || []).includes(a);
                                                      return (
                                                        <button key={a}
                                                          onClick={() => toggleRoomInstanceAmenity(u.id, vrt.id, r.k, instIdx, a)}
                                                          style={{
                                                            padding:"3px 7px",borderRadius:12,cursor:"pointer",
                                                            border: on ? `1px solid ${C.coral}` : `1px solid ${C.border}`,
                                                            background: on ? "#FFF5F5" : C.bg,
                                                            fontSize:9,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
                                                            color: on ? C.coral : C.mid,
                                                            display:"inline-flex",alignItems:"center",gap:2,
                                                          }}
                                                        >
                                                          {on && <Icon name="check" size={8} color={C.coral} stroke={2.5}/>}
                                                          {a}
                                                        </button>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Équipements PAR UNITÉ (à toute l'unité, distinct des amenities par pièce) */}
                                  <p style={{fontSize:10,fontWeight:600,color:C.mid,marginBottom:6,textTransform:"uppercase",letterSpacing:.4}}>
                                    Équipements de cette unité (toutes pièces)
                                  </p>
                                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                                    {UNIT_AMENITY_OPTIONS.map(a => {
                                      const on = (vrt.amenities || []).includes(a);
                                      return (
                                        <button key={a}
                                          onClick={() => toggleVariantAmenity(u.id, vrt.id, a)}
                                          style={{
                                            padding:"4px 9px",borderRadius:14,cursor:"pointer",
                                            border: on ? `1.5px solid ${C.coral}` : `1px solid ${C.border}`,
                                            background: on ? "#FFF5F5" : C.bg,
                                            fontSize:10,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
                                            color: on ? C.coral : C.mid,
                                            display:"flex",alignItems:"center",gap:3,
                                          }}
                                        >
                                          {on && <Icon name="check" size={9} color={C.coral} stroke={2.5}/>}
                                          {a}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

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

              {/* Amenities — split en 2 niveaux pour les logements,
                  liste unique pour les véhicules.
                  Le catalogue d'équipements bâtiment est CONTEXTUEL au type :
                  une maison propose Jardin/Dépendance/Garage, un hôtel propose
                  Réception/Restaurant/Bar/Spa, etc.
                  L'utilisateur peut aussi ajouter ses propres équipements via
                  un champ libre — utile pour ce qui n'est pas dans le catalogue. */}
              {form.segment === "property" ? (() => {
                const bt = BUILDING_TYPES.find(b => b.id === form.buildingType);
                const btLabel = bt ? bt.label.toLowerCase() : "bâtiment";
                /* Suggestions par type + équipements custom déjà ajoutés (évite doublons) */
                const baseSuggestions = BUILDING_AMENITIES_BY_TYPE[form.buildingType] || BUILDING_AMENITY_OPTIONS;
                const customAdded = form.buildingAmenities.filter(a => !baseSuggestions.includes(a));
                const allChips = [...baseSuggestions, ...customAdded];
                return (
                  <>
                    <p style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:4,display:"flex",alignItems:"center",gap:6}}>
                      <span>{bt ? bt.emoji : "🏗️"}</span> Équipements de votre {btLabel}
                    </p>
                    <p style={{fontSize:11,color:C.light,marginBottom:10,lineHeight:1.5}}>
                      Caractéristiques au niveau du <strong>{btLabel}</strong> (partagées par toutes les unités). Les équipements propres à chaque unité ou pièce ont été définis à l'étape précédente.
                    </p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
                      {allChips.map(a => {
                        const on = form.buildingAmenities.includes(a);
                        return (
                          <button key={a}
                            onClick={() => toggleBuildingAmenity(a)}
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

                    {/* Ajout libre */}
                    <div style={{display:"flex",gap:6,marginBottom:24}}>
                      <input
                        id="byer-custom-amenity"
                        placeholder="Ajouter un équipement personnalisé…"
                        style={{
                          flex:1,padding:"8px 12px",borderRadius:12,
                          border:`1.5px solid ${C.border}`,fontSize:12,
                          fontFamily:"'DM Sans',sans-serif",color:C.dark,
                          outline:"none",background:C.white,
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const v = (e.target.value || "").trim();
                            if (v && !form.buildingAmenities.includes(v)) toggleBuildingAmenity(v);
                            e.target.value = "";
                            e.preventDefault();
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const inp = document.getElementById("byer-custom-amenity");
                          if (!inp) return;
                          const v = (inp.value || "").trim();
                          if (v && !form.buildingAmenities.includes(v)) toggleBuildingAmenity(v);
                          inp.value = "";
                        }}
                        style={{
                          padding:"8px 14px",borderRadius:12,border:"none",
                          background:C.coral,color:C.white,fontSize:12,fontWeight:700,
                          cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                        }}
                      >+ Ajouter</button>
                    </div>
                  </>
                );
              })() : (
                <>
                  <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:8}}>Caractéristiques</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:24}}>
                    {VEHICLE_AMENITIES.map(a => {
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
                </>
              )}

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

              {/* Composition immobilier — résumé par sous-cat & variantes */}
              {form.segment === "property" && (() => {
                const bt = BUILDING_TYPES.find(b => b.id === form.buildingType);
                if (!bt) return null;
                const totalUnits = bt.units.reduce((s, u) => {
                  const sub = form.unitsConfig[u.id];
                  if (!sub) return s;
                  return s + sub.variants.reduce((ss, v) => ss + v.count, 0);
                }, 0);
                return (
                  <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"12px 14px",marginBottom:14}}>
                    <p style={{fontSize:12,fontWeight:700,color:C.dark,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
                      <span>{bt.emoji}</span> {bt.label} · {totalUnits} unité{totalUnits>1?"s":""} au total
                    </p>
                    {bt.units.map(u => {
                      const sub = form.unitsConfig[u.id];
                      if (!sub) return null;
                      const subTotal = sub.variants.reduce((s, v) => s + v.count, 0);
                      if (subTotal === 0) return null;
                      return (
                        <div key={u.id} style={{paddingTop:6,paddingBottom:6,borderTop:`1px dashed ${C.border}`}}>
                          <p style={{fontSize:11,fontWeight:700,color:C.coral,marginBottom:4}}>{u.label} ({subTotal})</p>
                          {sub.variants.filter(v => v.count > 0).map((vrt, i) => {
                            const roomSummary = ROOM_FIELDS
                              .filter(r => {
                                const room = vrt.rooms[r.k];
                                return room && (room.count || 0) > 0;
                              })
                              .map(r => `${vrt.rooms[r.k].count} ${r.label.toLowerCase()}`)
                              .join(" · ") || "Aucune pièce détaillée";
                            const amens = (vrt.amenities || []);
                            /* Pièces avec config individuelle (chaque instance a ses
                               propres amenities) — affichées séparément pour montrer
                               la granularité au-delà du résumé compact. */
                            const detailedRooms = ROOM_FIELDS.filter(r => {
                              const room = vrt.rooms[r.k];
                              return room && room.instances && room.instances.length > 0;
                            });
                            return (
                              <div key={vrt.id} style={{marginBottom:6}}>
                                <p style={{fontSize:11,color:C.mid,lineHeight:1.5}}>
                                  <strong>×{vrt.count}</strong> — {roomSummary}
                                </p>
                                {amens.length > 0 && (
                                  <p style={{fontSize:10,color:C.light,lineHeight:1.4,marginTop:1,paddingLeft:14}}>
                                    🔧 {amens.join(" · ")}
                                  </p>
                                )}
                                {detailedRooms.map(r => (
                                  <div key={r.k} style={{paddingLeft:14,marginTop:3}}>
                                    {vrt.rooms[r.k].instances.map((inst, idx) => {
                                      const a = (inst.amenities || []);
                                      if (a.length === 0) return null;
                                      return (
                                        <p key={inst.id} style={{fontSize:10,color:C.light,lineHeight:1.4}}>
                                          {r.emoji} {r.label} {idx+1} → {a.join(" · ")}
                                        </p>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                    {/* Équipements communs */}
                    {form.buildingAmenities.length > 0 && (
                      <div style={{paddingTop:8,marginTop:6,borderTop:`1px dashed ${C.border}`}}>
                        <p style={{fontSize:11,fontWeight:700,color:C.dark,marginBottom:4,display:"flex",alignItems:"center",gap:4}}>
                          🏗️ Équipements communs
                        </p>
                        <p style={{fontSize:11,color:C.mid,lineHeight:1.5}}>
                          {form.buildingAmenities.join(" · ")}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div style={{background:C.bg,borderRadius:16,padding:"16px",marginBottom:20}}>
                {[
                  {l:"Type", v: form.segment === "property"
                                ? (BUILDING_TYPES.find(b=>b.id===form.buildingType)?.label || form.buildingType)
                                : "Véhicule"},
                  {l:"Titre",        v: form.title || "—"},
                  {l:"Ville",        v: form.city},
                  {l:"Quartier",     v: form.zone || "—"},
                  {l:"Prix / nuit",  v: form.nightPrice ? fmt(parseInt(form.nightPrice)) : "—"},
                  ...(form.segment === "property" ? [
                    {l:"Prix / mois",  v: form.monthPrice ? fmt(parseInt(form.monthPrice)) : "Non disponible"},
                  ] : [
                    {l:"Marque",   v: form.brand || "—"},
                    {l:"Places",   v: form.seats},
                    {l:"Carburant",v: form.fuel},
                    {l:"Boîte",    v: form.trans},
                  ]),
                  ...(form.segment === "vehicle" ? [
                    {l:"Équipements", v: form.amenities.length > 0 ? form.amenities.join(", ") : "Aucun"},
                  ] : []),
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
