/* Byer — Publish Listing Screen (v33)
   Formulaire pour publier une annonce (logement ou véhicule)
   ═══════════════════════════════════════════════════════════
   v33 — Refonte du modèle "logement" :
   • 8 catégories top-level (Maison, Immeuble/Cité, Hôtel, Motel,
     Auberge, Appartement, Studio, Chambre)
   • Palette GENERAL_AMENITIES partagée — l'utilisateur coche les
     équipements présents dans son annonce.
   • CHILD_ENTITIES_BY_TYPE — chaque catégorie a ses entités filles
     (ex. Chambre → douche/buanderie/gardien/garage ;
          Immeuble → appartement/studio/chambre/magasin/buanderie/garage
                     avec count 0-100 chacun ;
          Hôtel/Motel/Auberge → juste chambres avec count).
   • Pour chaque entité fille, l'utilisateur choisit un MODE :
     - "Tous identiques" (par défaut) : amenities s'appliquent à tout
     - "Personnaliser par unité" : chaque instance a sa propre
       sélection prise dans la palette générale.
   ═══════════════════════════════════════════════════════════ */

/* ─── 8 CATÉGORIES TOP-LEVEL ─────────────────────── */
const BUILDING_TYPES = [
  { id:"maison",      label:"Maison/Villa",  emoji:"🏡" },
  { id:"immeuble",    label:"Immeuble/Cité", emoji:"🏢" },
  { id:"hotel",       label:"Hôtel",         emoji:"🏨" },
  { id:"motel",       label:"Motel",         emoji:"🛏️" },
  { id:"auberge",     label:"Auberge",       emoji:"🛌" },
  { id:"appartement", label:"Appartement",   emoji:"🏬" },
  { id:"studio",      label:"Studio",        emoji:"🏠" },
  { id:"chambre",     label:"Chambre",       emoji:"🚪" },
];

/* ─── PALETTE GLOBALE D'ÉQUIPEMENTS ──────────────────
   Liste partagée. L'utilisateur coche les équipements présents,
   puis pour chaque entité fille il peut soit appliquer "tout pareil",
   soit personnaliser par unité (chaque unité reçoit un sous-ensemble). */
const GENERAL_AMENITIES = [
  { id:"wifi",         label:"WiFi",            emoji:"📶" },
  { id:"piscine",      label:"Piscine",         emoji:"🏊" },
  { id:"garage",       label:"Garage",          emoji:"🚙" },
  { id:"eau_chaude",   label:"Eau chaude",      emoji:"🚿" },
  { id:"vue_mer",      label:"Vue sur la mer",  emoji:"🌊" },
  { id:"balcon",       label:"Balcon",          emoji:"🪟" },
  { id:"prive",        label:"Privé",           emoji:"🔒" },
  { id:"coffre",       label:"Coffre-fort",     emoji:"🔐" },
  { id:"room_service", label:"Room service",    emoji:"🛎️" },
  { id:"climatise",    label:"Climatisé",       emoji:"❄️" },
  { id:"mini_bar",     label:"Mini-bar",        emoji:"🥤" },
  { id:"gardien",      label:"Gardien",         emoji:"👮" },
  { id:"concierge",    label:"Concierge",       emoji:"🎩" },
  { id:"meuble",       label:"Meublé",          emoji:"🛋️" },
  { id:"tv",           label:"Smart TV",        emoji:"📺" },
  { id:"parking",      label:"Parking",         emoji:"🅿️" },
];

/* ─── ENTITÉS FILLES PAR CATÉGORIE ────────────────────
   default = valeur de départ pour le compteur
   max     = limite supérieure (ex. 100 pour immeuble, 1 pour balcon studio)
   force   = entité forcée (ne peut pas tomber à 0, ex: douche pour chambre)
─────────────────────────────────────────────────────── */
const CHILD_ENTITIES_BY_TYPE = {
  maison: [
    { id:"sejour",    label:"Séjour",      emoji:"🛋️", default:1, max:5,  force:false },
    { id:"chambre",   label:"Chambre",     emoji:"🛏️", default:3, max:20, force:false },
    { id:"cuisine",   label:"Cuisine",     emoji:"🍳", default:1, max:3,  force:false },
    { id:"douche",    label:"Douche/SdB",  emoji:"🚿", default:2, max:10, force:false },
    { id:"buanderie", label:"Buanderie",   emoji:"🧺", default:1, max:3,  force:false },
    { id:"terrasse",  label:"Terrasse",    emoji:"🌅", default:1, max:3,  force:false },
  ],
  immeuble: [
    { id:"appartement", label:"Appartement", emoji:"🏬", default:0, max:100, force:false },
    { id:"studio",      label:"Studio",      emoji:"🏠", default:0, max:100, force:false },
    { id:"chambre",     label:"Chambre",     emoji:"🛏️", default:0, max:100, force:false },
    { id:"magasin",     label:"Magasin",     emoji:"📦", default:0, max:100, force:false },
    { id:"buanderie",   label:"Buanderie",   emoji:"🧺", default:0, max:100, force:false },
  ],
  hotel: [
    { id:"chambre", label:"Chambre", emoji:"🛏️", default:1, max:300, force:true },
  ],
  motel: [
    { id:"chambre", label:"Chambre", emoji:"🛏️", default:1, max:100, force:true },
  ],
  auberge: [
    { id:"chambre", label:"Chambre", emoji:"🛏️", default:1, max:50, force:true },
  ],
  appartement: [
    { id:"sejour",    label:"Séjour",       emoji:"🛋️", default:1, max:3,  force:false },
    { id:"chambre",   label:"Chambre",      emoji:"🛏️", default:2, max:10, force:false },
    { id:"cuisine",   label:"Cuisine",      emoji:"🍳", default:1, max:2,  force:false },
    { id:"douche",    label:"Douche/SdB",   emoji:"🚿", default:1, max:5,  force:false },
    { id:"magasin",   label:"Magasin",      emoji:"📦", default:0, max:3,  force:false },
    { id:"buanderie", label:"Buanderie",    emoji:"🧺", default:0, max:2,  force:false },
    { id:"balcon",    label:"Balcon privé", emoji:"🪟", default:0, max:3,  force:false },
  ],
  studio: [
    { id:"sejour",    label:"Séjour",       emoji:"🛋️", default:1, max:1, force:false },
    { id:"cuisine",   label:"Cuisine",      emoji:"🍳", default:1, max:1, force:false },
    { id:"douche",    label:"Douche/SdB",   emoji:"🚿", default:1, max:2, force:false },
    { id:"magasin",   label:"Magasin",      emoji:"📦", default:0, max:2, force:false },
    { id:"buanderie", label:"Buanderie",    emoji:"🧺", default:0, max:1, force:false },
    { id:"balcon",    label:"Balcon privé", emoji:"🪟", default:0, max:2, force:false },
  ],
  chambre: [
    { id:"douche",    label:"Douche",     emoji:"🚿", default:1, max:2, force:true },
    { id:"buanderie", label:"Buanderie",  emoji:"🧺", default:0, max:1, force:false },
    { id:"gardien",   label:"Gardien",    emoji:"👮", default:0, max:1, force:false },
  ],
};

/* ─── RÈGLEMENT (HOUSE RULES) ────────────────────────
   Règles pré-définies que le bailleur peut activer en chips.
   Liste séparée pour propriétés vs véhicules. L'utilisateur peut
   aussi ajouter ses propres règles personnalisées en texte libre. */
const PROPERTY_RULES = [
  { id:"no_smoking",            label:"Non fumeur",                  emoji:"🚭" },
  { id:"no_pets",               label:"Animaux non admis",           emoji:"🐾" },
  { id:"no_parties",            label:"Pas de fêtes / événements",   emoji:"🎉" },
  { id:"no_visitors",           label:"Visiteurs non admis",         emoji:"🚫" },
  { id:"limit_visitors",        label:"Visiteurs limités",           emoji:"👥" },
  { id:"curfew",                label:"Couvre-feu (22h)",            emoji:"🌙" },
  { id:"no_kids",               label:"Pas d'enfants",               emoji:"👶" },
  { id:"shoes_off",             label:"Chaussures à retirer",        emoji:"👞" },
  { id:"no_loud_music",         label:"Pas de musique forte",        emoji:"🎵" },
  { id:"no_alcohol",            label:"Alcool interdit",             emoji:"🥃" },
  { id:"no_filming",            label:"Pas d'enregistrement",        emoji:"📷" },
  { id:"clean_before_leaving",  label:"Ménage au départ",            emoji:"🧹" },
  { id:"caution_required",      label:"Caution obligatoire",         emoji:"💰" },
  { id:"lock_when_leaving",     label:"Verrouiller en sortant",      emoji:"🔒" },
  { id:"save_water",            label:"Économiser l'eau",            emoji:"💧" },
  { id:"family_only",           label:"Familles uniquement",         emoji:"👨‍👩‍👧" },
  { id:"students_only",         label:"Étudiants uniquement",        emoji:"🎓" },
  { id:"professionals_only",    label:"Professionnels uniquement",   emoji:"👔" },
  { id:"no_unmarried_couples",  label:"Pas de couples non mariés",   emoji:"💍" },
  { id:"id_required",           label:"Pièce d'identité requise",    emoji:"🪪" },
];

const VEHICLE_RULES = [
  { id:"no_smoking",        label:"Non fumeur",                emoji:"🚭" },
  { id:"min_age_25",        label:"Conducteur min 25 ans",     emoji:"📅" },
  { id:"min_age_21",        label:"Conducteur min 21 ans",     emoji:"📅" },
  { id:"license_2years",    label:"Permis depuis +2 ans",      emoji:"🪪" },
  { id:"no_pets",           label:"Animaux non admis",         emoji:"🐾" },
  { id:"caution_required",  label:"Caution obligatoire",       emoji:"💰" },
  { id:"clean_return",      label:"Rendre propre",             emoji:"🧹" },
  { id:"full_tank",         label:"Plein essence au retour",   emoji:"⛽" },
  { id:"no_offroad",        label:"Pas de tout-terrain",       emoji:"🏔️" },
  { id:"no_long_trip",      label:"Pas de trajets longs",      emoji:"🛣️" },
  { id:"max_km_per_day",    label:"Kilométrage limité/jour",   emoji:"📍" },
  { id:"no_outside_country",label:"Frontière interdite",       emoji:"🚧" },
  { id:"id_required",       label:"Pièce d'identité requise",  emoji:"🪪" },
  { id:"deposit_required",  label:"Avance obligatoire",        emoji:"💵" },
];

const getRulesForSegment = (seg) => seg === "vehicle" ? VEHICLE_RULES : PROPERTY_RULES;

/* IDs uniques pour les instances (clé React stable) */
let _instanceCounter = 1;
const newInstanceId = () => `i${Date.now().toString(36)}-${_instanceCounter++}`;
const buildInstances = (count) =>
  Array.from({length: count}, () => ({ id: newInstanceId(), amenities: [] }));

/* État initial des entités filles pour un buildingType.
   Chaque entité a : {count, shared, sharedAmenities, instances}
   - shared:true → toutes les unités partagent la même liste sharedAmenities
   - shared:false → chaque instance a ses propres amenities (champ instances)
*/
const buildChildEntitiesConfig = (buildingType) => {
  const ents = CHILD_ENTITIES_BY_TYPE[buildingType] || [];
  const cfg = {};
  ents.forEach(e => {
    cfg[e.id] = {
      count: e.default,
      shared: true,
      sharedAmenities: [],
      instances: null,
    };
  });
  return cfg;
};

/* ─── PUBLISH SCREEN ─────────────────────────────── */
function PublishScreen({ onBack, initialSegment }) {
  // Si on arrive avec un segment pré-sélectionné (depuis Dashboard),
  // on saute l'étape 1 (sélection du type) directement à l'étape 2.
  const startStep = initialSegment ? 2 : 1;
  const [step, setStep]     = useState(startStep); // 1=type, 2=infos, 3=prix, 4=photos, 5=règlement, 6=confirm
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);

  const [form, setForm] = useState({
    segment:           initialSegment || "property",  // property | vehicle
    buildingType:      "maison",                      // 8 catégories
    title:             "",
    city:              "Douala",
    zone:              "",
    description:       "",
    /* generalAmenities : palette globale activée pour cette annonce
       Ce sont les chips visibles en home feed (sert aussi de filtre) */
    generalAmenities:  [],
    /* childEntities : composition par entité fille (chambre, appart…)
       {[entityId]: { count, shared, sharedAmenities, instances }} */
    childEntities:     buildChildEntitiesConfig("maison"),
    nightPrice:        "",
    monthPrice:        "",
    photos:            [],
    /* houseRules : IDs des règles pré-définies cochées (PROPERTY_RULES ou VEHICLE_RULES)
       customRules : règles personnalisées en texte libre (max 10) */
    houseRules:        [],
    customRules:       [],
    // Vehicle-specific
    brand:             "",
    seats:             5,
    fuel:              "Essence",
    trans:             "Automatique",
    amenities:         [],   // véhicules uniquement
  });

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  /* ── Helpers : changement de buildingType ── */
  const setBuildingType = (bt) => {
    setForm(p => ({
      ...p,
      buildingType: bt,
      childEntities: buildChildEntitiesConfig(bt),
    }));
  };

  /* ── Helpers : palette générale ── */
  const toggleGeneralAmenity = (id) => {
    setForm(p => {
      const has = p.generalAmenities.includes(id);
      const newList = has
        ? p.generalAmenities.filter(x => x !== id)
        : [...p.generalAmenities, id];
      // Si on retire un amenity de la palette, le retirer aussi
      // de toutes les sélections par entité (cohérence)
      const newChild = {};
      Object.entries(p.childEntities).forEach(([eid, ent]) => {
        const cleanShared = (ent.sharedAmenities || []).filter(a => newList.includes(a));
        const cleanInstances = ent.instances
          ? ent.instances.map(i => ({ ...i, amenities: (i.amenities||[]).filter(a => newList.includes(a)) }))
          : null;
        newChild[eid] = { ...ent, sharedAmenities: cleanShared, instances: cleanInstances };
      });
      return { ...p, generalAmenities: newList, childEntities: newChild };
    });
  };

  /* ── Helpers : count d'une entité fille ── */
  const setChildCount = (entityId, delta) => {
    setForm(p => {
      const ent = p.childEntities[entityId];
      if (!ent) return p;
      const ents = CHILD_ENTITIES_BY_TYPE[p.buildingType] || [];
      const meta = ents.find(e => e.id === entityId);
      if (!meta) return p;
      const min = meta.force ? 1 : 0;
      const newCount = Math.max(min, Math.min(meta.max, ent.count + delta));
      // Si on est en mode "personnalisé", aligner la longueur des instances
      let newInstances = ent.instances;
      if (ent.instances) {
        if (newCount > ent.instances.length) {
          newInstances = [...ent.instances, ...buildInstances(newCount - ent.instances.length)];
        } else if (newCount < ent.instances.length) {
          newInstances = ent.instances.slice(0, newCount);
        }
      }
      return {
        ...p,
        childEntities: {
          ...p.childEntities,
          [entityId]: { ...ent, count: newCount, instances: newInstances },
        },
      };
    });
  };

  /* ── Helpers : bascule shared ↔ personnalisé ── */
  const toggleChildShared = (entityId) => {
    setForm(p => {
      const ent = p.childEntities[entityId];
      if (!ent || ent.count === 0) return p;
      if (ent.shared) {
        // On passe en personnalisé : créer N instances initialisées avec sharedAmenities
        const seed = ent.sharedAmenities || [];
        const instances = Array.from({length: ent.count}, () => ({
          id: newInstanceId(),
          amenities: [...seed],
        }));
        return {
          ...p,
          childEntities: {
            ...p.childEntities,
            [entityId]: { ...ent, shared: false, instances },
          },
        };
      } else {
        // On revient en partagé : on conserve sharedAmenities tel quel
        return {
          ...p,
          childEntities: {
            ...p.childEntities,
            [entityId]: { ...ent, shared: true, instances: null },
          },
        };
      }
    });
  };

  /* ── Helpers : toggle amenity sur une entité (mode partagé) ── */
  const toggleChildSharedAmenity = (entityId, amenityId) => {
    setForm(p => {
      const ent = p.childEntities[entityId];
      if (!ent) return p;
      const has = (ent.sharedAmenities || []).includes(amenityId);
      const newList = has
        ? ent.sharedAmenities.filter(x => x !== amenityId)
        : [...(ent.sharedAmenities || []), amenityId];
      return {
        ...p,
        childEntities: {
          ...p.childEntities,
          [entityId]: { ...ent, sharedAmenities: newList },
        },
      };
    });
  };

  /* ── Helpers : toggle amenity pour UNE instance précise ── */
  const toggleInstanceAmenity = (entityId, instanceIdx, amenityId) => {
    setForm(p => {
      const ent = p.childEntities[entityId];
      if (!ent || !ent.instances) return p;
      const newInstances = ent.instances.map((inst, idx) => {
        if (idx !== instanceIdx) return inst;
        const has = (inst.amenities || []).includes(amenityId);
        const newList = has
          ? inst.amenities.filter(x => x !== amenityId)
          : [...(inst.amenities || []), amenityId];
        return { ...inst, amenities: newList };
      });
      return {
        ...p,
        childEntities: {
          ...p.childEntities,
          [entityId]: { ...ent, instances: newInstances },
        },
      };
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

  /* Index de la photo actuellement en cours d'étiquetage.
     - null      : aucun picker ouvert
     - number    : index de la photo dans form.photos pour laquelle
                   le picker (TagPickerSheet) est affiché. */
  const [taggingPhotoIdx, setTaggingPhotoIdx] = useState(null);

  const handleFiles = async (fileList) => {
    setUploadError("");
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    /* Limite = somme des slots prédéfinis (façade + chambres + …), plafond 10.
       Une fois atteinte → upload bloqué, il faut supprimer une photo pour
       libérer un slot. */
    const remaining = photosMaxAllowed - form.photos.length;
    if (remaining <= 0) {
      setUploadError(`Maximum ${photosMaxAllowed} photos atteint. Supprimez une photo pour en ajouter une autre.`);
      return;
    }
    const toProcess = files.slice(0, remaining);
    const skipped = files.length - toProcess.length;
    /* Capture la position de départ AVANT la mise à jour async — sert à
       identifier la 1ère nouvelle photo non-étiquetée pour ouvrir le picker. */
    const startIdx = form.photos.length;
    try {
      const compressed = [];
      for (const f of toProcess) {
        if (!f.type.startsWith("image/")) continue;
        if (f.size > 10 * 1024 * 1024) {
          setUploadError(`Photo "${f.name}" trop volumineuse (max 10 Mo).`);
          continue;
        }
        const dataUrl = await compressImage(f);
        /* Photo = objet {src, tag} où tag = juste le TYPE (ex "chambre").
           Le NUMÉRO (Chambre 1, Chambre 2…) est ajouté automatiquement à
           l'affichage selon la position parmi les photos de même type. */
        compressed.push({ src: dataUrl, tag: null });
      }
      if (compressed.length === 0) return;
      setForm(p => {
        const sIdx = p.photos.length;
        const tagged = compressed.map((ph, i) => ({
          ...ph,
          /* La toute 1ère photo de l'annonce est auto-étiquetée "exterior" (façade) */
          tag: (sIdx + i === 0) ? "exterior" : null,
        }));
        return { ...p, photos: [...p.photos, ...tagged] };
      });
      if (skipped > 0) setUploadError(`${skipped} photo(s) ignorée(s) — limite de ${photosMaxAllowed} atteinte.`);
      /* Ouvre AUTOMATIQUEMENT le picker d'étiquette pour la 1ère nouvelle
         photo non-déjà-étiquetée. Si c'est la toute 1ère photo de l'annonce
         (startIdx === 0), elle reçoit "exterior" auto → on saute à la 2ème. */
      const firstUntaggedIdx = startIdx === 0
        ? (compressed.length > 1 ? 1 : null)
        : startIdx;
      if (firstUntaggedIdx !== null) {
        /* setTimeout pour laisser React appliquer setForm avant d'ouvrir
           le picker (évite que le picker lise un form.photos désynchronisé). */
        setTimeout(() => setTaggingPhotoIdx(firstUntaggedIdx), 120);
      }
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

  /* Définit / change le TYPE d'une photo (ex "chambre", "sejour"…).
     Le numéro affiché (Chambre 1, Chambre 2…) est calculé automatiquement
     selon la position parmi les photos de même type.
     BLOQUE si la limite (maxCount) du type est déjà atteinte par d'autres
     photos — la limite vient du nombre de pièces prédéfinies au step 2. */
  const setPhotoTag = (idx, typeId) => {
    if (typeId) {
      const meta = (computePhotoTagTypes()).find(t => t.id === typeId);
      if (meta) {
        const usedByOthers = form.photos.filter((p, j) => p.tag === typeId && j !== idx).length;
        if (usedByOthers >= meta.maxCount) {
          setUploadError(`Limite atteinte pour « ${meta.label} » (${meta.maxCount} photo${meta.maxCount>1?"s":""} max). Modifiez la composition au step précédent pour en ajouter.`);
          return false;
        }
      }
    }
    setUploadError("");
    setForm(p => ({
      ...p,
      photos: p.photos.map((ph, i) => i === idx ? { ...ph, tag: typeId || null } : ph),
    }));
    return true;
  };

  /* Cherche la prochaine photo NON-étiquetée à partir d'un index donné
     (exclus). Renvoie son index ou null si aucune. Utilisé pour enchaîner
     automatiquement les pickers après upload multiple. */
  const findNextUntaggedIdx = (afterIdx) => {
    for (let i = afterIdx + 1; i < form.photos.length; i++) {
      if (!form.photos[i].tag) return i;
    }
    return null;
  };

  /* Liste des TYPES disponibles pour ce buildingType.
     Chaque type a un MAXCOUNT = limite du nombre de photos étiquetables
     pour ce type, pris depuis la composition prédéfinie au step 2.
     - "exterior" : max 1 (façade unique)
     - Chaque entité fille avec count > 0 : max = count configuré
       (ex: 3 chambres configurées → max 3 photos "Chambre" → Chambre 1, 2, 3)
     - Les types avec count = 0 ne sont PAS proposés.
     Le numéro est automatique selon la position d'apparition. */
  const computePhotoTagTypes = () => {
    const types = [];
    if (form.segment === "property") {
      types.push({ id: "exterior", label: "Vue extérieure / façade", emoji: "🏞️", maxCount: 1 });
      const ents = CHILD_ENTITIES_BY_TYPE[form.buildingType] || [];
      ents.forEach(meta => {
        const ent = form.childEntities[meta.id];
        if (!ent || ent.count === 0) return;   // skip si non configuré
        types.push({
          id: meta.id, label: meta.label, emoji: meta.emoji,
          maxCount: ent.count,
        });
      });
    } else {
      types.push(
        { id: "exterior",  label: "Vue extérieure",  emoji: "🚗",  maxCount: 1 },
        { id: "interior",  label: "Intérieur",       emoji: "🪑",  maxCount: 1 },
        { id: "dashboard", label: "Tableau de bord", emoji: "🎛️", maxCount: 1 },
        { id: "trunk",     label: "Coffre",          emoji: "🧳",  maxCount: 1 },
        { id: "engine",    label: "Moteur",          emoji: "⚙️",  maxCount: 1 },
      );
    }
    return types;
  };
  const PHOTO_TAG_TYPES = computePhotoTagTypes();
  const tagTypeMeta = (typeId) => PHOTO_TAG_TYPES.find(t => t.id === typeId);

  /* MAX TOTAL de photos autorisées pour cette annonce :
     somme des maxCount de TOUS les types disponibles (façade + chambres +
     cuisine + … pour property, ou les 5 vues pour vehicle), plafonné à 10.
     Une fois ce total atteint, l'utilisateur ne peut PLUS uploader de
     nouvelle photo — il peut seulement modifier l'étiquette ou supprimer
     une photo existante pour libérer un slot. */
  const photosMaxAllowed = Math.min(
    10,
    PHOTO_TAG_TYPES.reduce((s, t) => s + t.maxCount, 0) || 10,
  );

  /* Calcule le LABEL affiché d'une photo, avec numéro automatique.
     - Pas de tag → null
     - "exterior" (vue façade) → unique, sans numéro
     - 1 seule photo de ce type → "Chambre" (sans numéro)
     - Plusieurs → "Chambre 1", "Chambre 2"… selon position d'apparition (1-300) */
  const computePhotoLabel = (idx) => {
    const photo = form.photos[idx];
    if (!photo || !photo.tag) return null;
    const meta = tagTypeMeta(photo.tag);
    if (!meta) return photo.tag;
    if (photo.tag === "exterior") return `${meta.emoji} ${meta.label}`;
    const sameTypeCount = form.photos.filter(p => p.tag === photo.tag).length;
    if (sameTypeCount === 1) return `${meta.emoji} ${meta.label}`;
    /* Position de la photo (1-based) parmi les photos de même type */
    const position = form.photos.slice(0, idx + 1).filter(p => p.tag === photo.tag).length;
    return `${meta.emoji} ${meta.label} ${Math.min(position, 300)}`;
  };

  /* Idem mais sans emoji (pour les récaps textuels) */
  const computePhotoLabelShort = (idx) => {
    const photo = form.photos[idx];
    if (!photo || !photo.tag) return null;
    const meta = tagTypeMeta(photo.tag);
    if (!meta) return photo.tag;
    if (photo.tag === "exterior") return meta.label;
    const sameTypeCount = form.photos.filter(p => p.tag === photo.tag).length;
    if (sameTypeCount === 1) return meta.label;
    const position = form.photos.slice(0, idx + 1).filter(p => p.tag === photo.tag).length;
    return `${meta.label} ${Math.min(position, 300)}`;
  };

  /* Tag stocké en base : "type-N" (N 0-based) ou "exterior" ou null.
     Calculé automatiquement selon la position parmi les photos de même type. */
  const buildPhotoTagForDB = (idx) => {
    const photo = form.photos[idx];
    if (!photo || !photo.tag) return null;
    if (photo.tag === "exterior") return "exterior";
    const position = form.photos.slice(0, idx + 1).filter(p => p.tag === photo.tag).length;
    return `${photo.tag}-${Math.min(position, 300) - 1}`;  // 0-based
  };

  /* Équipements véhicule */
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
      const { data: sess } = await db.auth.getSession();
      const user = sess && sess.session && sess.session.user;
      if (!user) {
        setSubmitting(false);
        setSubmitError("Vous devez être connecté pour publier une annonce.");
        return;
      }

      const isVehicle = form.segment === "vehicle";

      /* Agrégats legacy : compte les chambres et douches sur toutes les
         entités filles (utile pour les filtres existants). */
      let aggBeds = null, aggBaths = null, aggGuests = null;
      if (!isVehicle) {
        const ents = CHILD_ENTITIES_BY_TYPE[form.buildingType] || [];
        let beds = 0, baths = 0;
        ents.forEach(meta => {
          const c = (form.childEntities[meta.id] && form.childEntities[meta.id].count) || 0;
          if (meta.id === "chambre" || meta.id === "appartement" || meta.id === "studio") beds += c;
          if (meta.id === "douche") baths += c;
        });
        aggBeds   = beds  || null;
        aggBaths  = baths || null;
        aggGuests = beds ? beds * 2 : null;
      }

      /* Pour le filtrage legacy, on convertit les amenityIds en labels lisibles */
      const labelOf = (id) => (GENERAL_AMENITIES.find(a => a.id === id) || {}).label || id;
      const generalAmenityLabels = (form.generalAmenities || []).map(labelOf);

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
        /* amenities = palette générale (labels lisibles, ex: ["WiFi","Piscine"…])
           pour rester compatible avec les filtres legacy par mots-clés. */
        amenities:    isVehicle
                        ? (Array.isArray(form.amenities) ? form.amenities : [])
                        : generalAmenityLabels,
        /* general_amenities : IDs canoniques (ex: ["wifi","piscine"]) */
        general_amenities: isVehicle ? null : (form.generalAmenities || []),
        /* child_entities : compo détaillée (count + shared/instances + amenities) */
        child_entities:    isVehicle ? null : form.childEntities,
        /* house_rules : IDs des règles pré-définies cochées par le bailleur
           custom_rules : règles personnalisées (texte libre, max 10) */
        house_rules:       Array.isArray(form.houseRules)  ? form.houseRules  : [],
        custom_rules:      Array.isArray(form.customRules) ? form.customRules : [],
        is_active:    true,
      };

      const { data: listing, error: e1 } = await db.listings.create(payload);
      if (e1) {
        setSubmitting(false);
        setSubmitError("Erreur création annonce : " + (e1.message || "inconnue"));
        return;
      }

      // Upload des photos (max 10) en parallèle
      if (form.photos && form.photos.length > 0) {
        const uploads = form.photos.map(async (photo, idx) => {
          const dataUrl = photo.src || photo;        // compat anciennes données
          const tag     = buildPhotoTagForDB(idx);   // ex: "chambre-1", "exterior", "appartement-0"
          try {
            const file = await dataUrlToFile(dataUrl, `photo-${idx + 1}.jpg`);
            const { data: up, error: eu } = await db.storage.uploadPhoto(file, listing.id);
            if (eu || !up) return null;
            await db.raw.from("listing_photos").insert({
              listing_id: listing.id,
              url:        up.url,
              position:   idx,
              tag:        tag,   // numéroté automatiquement (1 à 300 par type)
            });
            return up.url;
          } catch (err) {
            console.warn("[byer] upload photo", idx, "failed:", err);
            return null;
          }
        });
        await Promise.all(uploads);
      }

      setSubmitting(false);
      setSuccess(true);
    } catch (err) {
      console.error("[byer] publish error:", err);
      setSubmitting(false);
      setSubmitError("Erreur réseau. Vérifiez votre connexion et réessayez.");
    }
  };

  /* 6 étapes : 1=type, 2=infos, 3=prix, 4=photos, 5=règlement, 6=récap.
     Le step 5 (règlement) a été ajouté en v41 — la barre/compteur de
     progression doit refléter ces 6 étapes pour éviter "6 sur 5". */
  const totalSteps = 6;

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

              {/* Property building type — 8 catégories */}
              {form.segment === "property" && (
                <>
                  <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:8}}>Catégorie de logement</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
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
                    💡 À l'étape suivante, cochez les équipements présents et définissez les entités filles (chambres, appartements, etc.) avec leurs équipements respectifs.
                  </p>
                </>
              )}

              <button style={{...S.payBtn,marginTop:8}} onClick={() => setStep(2)}>
                Continuer →
              </button>
            </div>
          )}

          {/* ── STEP 2 : Informations + Équipements + Entités filles ── */}
          {step === 2 && (
            <div>
              <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Informations</p>
              <p style={{fontSize:13,color:C.mid,marginBottom:20}}>Décrivez votre {form.segment === "property" ? "logement" : "véhicule"}.</p>

              {/* Title */}
              <div style={{marginBottom:14}}>
                <label style={Os.fieldLabel}>Titre de l'annonce</label>
                <div style={Os.fieldWrap}>
                  <input style={Os.fieldInput}
                    placeholder={form.segment === "property" ? "Ex: Villa Balnéaire Kribi" : "Ex: Toyota Land Cruiser 2022"}
                    value={form.title} onChange={e => set("title", e.target.value)}
                  />
                </div>
              </div>

              {/* Catégorie (rappel) — visible si pré-sélectionné */}
              {form.segment === "property" && (
                <div style={{marginBottom:14}}>
                  <label style={Os.fieldLabel}>Catégorie</label>
                  <div style={Os.fieldWrap}>
                    <select style={{...Os.fieldInput,padding:"0",cursor:"pointer"}}
                      value={form.buildingType}
                      onChange={e => setBuildingType(e.target.value)}
                    >
                      {BUILDING_TYPES.map(t => (
                        <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

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

              {/* ─── Property : équipements généraux + entités filles ─── */}
              {form.segment === "property" && (() => {
                const cat = BUILDING_TYPES.find(b => b.id === form.buildingType);
                const ents = CHILD_ENTITIES_BY_TYPE[form.buildingType] || [];
                return (
                  <>
                    {/* ── Palette générale ── */}
                    <div style={{marginBottom:18,marginTop:6}}>
                      <p style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:4,display:"flex",alignItems:"center",gap:6}}>
                        <span>✨</span> Équipements présents
                      </p>
                      <p style={{fontSize:11,color:C.light,marginBottom:10,lineHeight:1.5}}>
                        Cochez tous les équipements présents dans votre annonce. Ils s'afficheront en description du feed et pourront ensuite être <strong>répartis différemment</strong> par entité fille.
                      </p>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {GENERAL_AMENITIES.map(a => {
                          const on = form.generalAmenities.includes(a.id);
                          return (
                            <button key={a.id}
                              onClick={() => toggleGeneralAmenity(a.id)}
                              style={{
                                padding:"7px 11px",borderRadius:18,cursor:"pointer",
                                border: on ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
                                background: on ? "#FFF5F5" : C.white,
                                fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
                                color: on ? C.coral : C.mid,
                                display:"flex",alignItems:"center",gap:4,
                              }}
                            >
                              <span style={{fontSize:13}}>{a.emoji}</span>
                              {a.label}
                              {on && <Icon name="check" size={11} color={C.coral} stroke={2.5}/>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── Entités filles ── */}
                    {ents.length > 0 && (
                      <div style={{marginBottom:18}}>
                        <p style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:4,display:"flex",alignItems:"center",gap:6}}>
                          <span>{cat ? cat.emoji : "🏗️"}</span> Composition de votre {cat ? cat.label.toLowerCase() : "logement"}
                        </p>
                        <p style={{fontSize:11,color:C.light,marginBottom:12,lineHeight:1.5}}>
                          Définissez le nombre d'unités pour chaque type. Pour chacune, vous pouvez appliquer les équipements à toutes les unités <strong>(Tous identiques)</strong> ou les <strong>personnaliser unité par unité</strong>.
                        </p>

                        {ents.map(meta => {
                          const ent = form.childEntities[meta.id];
                          if (!ent) return null;
                          return (
                            <div key={meta.id} style={{
                              background:"#FAFAFA",border:`1.5px solid ${C.border}`,borderRadius:14,
                              padding:"12px",marginBottom:10,
                            }}>
                              {/* Entity header */}
                              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:ent.count>0?10:0}}>
                                <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                                  <span style={{fontSize:18}}>{meta.emoji}</span>
                                  <div>
                                    <p style={{fontSize:13,fontWeight:700,color:C.black}}>{meta.label}</p>
                                    {meta.force && (
                                      <p style={{fontSize:9,color:C.coral,marginTop:1}}>obligatoire</p>
                                    )}
                                  </div>
                                </div>
                                <div style={{display:"flex",alignItems:"center",gap:6,background:C.white,borderRadius:9,padding:"3px 5px",border:`1px solid ${C.border}`}}>
                                  <button
                                    onClick={() => setChildCount(meta.id, -1)}
                                    style={{width:26,height:26,borderRadius:13,border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:C.dark,padding:0}}
                                  >−</button>
                                  <span style={{fontSize:14,fontWeight:800,color:C.black,minWidth:24,textAlign:"center"}}>{ent.count}</span>
                                  <button
                                    onClick={() => setChildCount(meta.id, +1)}
                                    style={{width:26,height:26,borderRadius:13,border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:C.dark,padding:0}}
                                  >+</button>
                                </div>
                              </div>

                              {/* Mode toggle + amenity assignment (visible si count > 0 ET palette non vide) */}
                              {ent.count > 0 && form.generalAmenities.length > 0 && (
                                <div style={{borderTop:`1px dashed ${C.border}`,paddingTop:8}}>
                                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,gap:8}}>
                                    <p style={{fontSize:10,fontWeight:700,color:C.mid,textTransform:"uppercase",letterSpacing:.4}}>
                                      Équipements
                                    </p>
                                    <button
                                      onClick={() => toggleChildShared(meta.id)}
                                      style={{
                                        fontSize:10,fontWeight:700,padding:"4px 9px",
                                        borderRadius:10,cursor:"pointer",
                                        border: !ent.shared ? `1px solid ${C.coral}` : `1px solid ${C.border}`,
                                        background: !ent.shared ? "#FFF5F5" : C.white,
                                        color: !ent.shared ? C.coral : C.mid,
                                        fontFamily:"'DM Sans',sans-serif",
                                      }}
                                    >
                                      {ent.shared ? "⚙️ Personnaliser par unité" : "✓ Personnalisé"}
                                    </button>
                                  </div>

                                  {/* Mode partagé : 1 sélection pour toutes les unités */}
                                  {ent.shared && (
                                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                                      {form.generalAmenities.map(aid => {
                                        const a = GENERAL_AMENITIES.find(x => x.id === aid);
                                        if (!a) return null;
                                        const on = (ent.sharedAmenities || []).includes(aid);
                                        return (
                                          <button key={aid}
                                            onClick={() => toggleChildSharedAmenity(meta.id, aid)}
                                            style={{
                                              padding:"5px 10px",borderRadius:14,cursor:"pointer",
                                              border: on ? `1.5px solid ${C.coral}` : `1px solid ${C.border}`,
                                              background: on ? "#FFF5F5" : C.white,
                                              fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
                                              color: on ? C.coral : C.mid,
                                              display:"flex",alignItems:"center",gap:3,
                                            }}
                                          >
                                            <span style={{fontSize:11}}>{a.emoji}</span>
                                            {a.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Mode personnalisé : 1 carte par instance */}
                                  {!ent.shared && ent.instances && (
                                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                                      {ent.instances.map((inst, idx) => (
                                        <div key={inst.id} style={{
                                          background:C.white,border:`1px solid ${C.border}`,
                                          borderRadius:10,padding:"8px 10px",
                                        }}>
                                          <p style={{fontSize:10,fontWeight:700,color:C.coral,marginBottom:6,textTransform:"uppercase",letterSpacing:.4}}>
                                            {meta.emoji} {meta.label} {idx + 1}
                                          </p>
                                          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                                            {form.generalAmenities.map(aid => {
                                              const a = GENERAL_AMENITIES.find(x => x.id === aid);
                                              if (!a) return null;
                                              const on = (inst.amenities || []).includes(aid);
                                              return (
                                                <button key={aid}
                                                  onClick={() => toggleInstanceAmenity(meta.id, idx, aid)}
                                                  style={{
                                                    padding:"4px 8px",borderRadius:12,cursor:"pointer",
                                                    border: on ? `1px solid ${C.coral}` : `1px solid ${C.border}`,
                                                    background: on ? "#FFF5F5" : C.bg,
                                                    fontSize:10,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
                                                    color: on ? C.coral : C.mid,
                                                    display:"inline-flex",alignItems:"center",gap:2,
                                                  }}
                                                >
                                                  <span style={{fontSize:10}}>{a.emoji}</span>
                                                  {a.label}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {ent.count > 0 && form.generalAmenities.length === 0 && (
                                <p style={{fontSize:10,color:C.light,marginTop:4,fontStyle:"italic"}}>
                                  Cochez d'abord les équipements présents (au-dessus) pour les répartir ici.
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
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

          {/* ── STEP 3 : Prix (+ équipements véhicule) ── */}
          {step === 3 && (
            <div>
              <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Prix</p>
              <p style={{fontSize:13,color:C.mid,marginBottom:20}}>Définissez vos tarifs.</p>

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

              {/* Vehicle-only amenities */}
              {form.segment === "vehicle" && (
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

              {/* Property : récap palette pour rappel */}
              {form.segment === "property" && form.generalAmenities.length > 0 && (
                <div style={{background:C.bg,borderRadius:12,padding:"12px 14px",marginBottom:20}}>
                  <p style={{fontSize:11,fontWeight:700,color:C.mid,marginBottom:6,textTransform:"uppercase",letterSpacing:.4}}>
                    ✨ Équipements de votre annonce
                  </p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {form.generalAmenities.map(aid => {
                      const a = GENERAL_AMENITIES.find(x => x.id === aid);
                      if (!a) return null;
                      return (
                        <span key={aid} style={{
                          display:"inline-flex",alignItems:"center",gap:3,
                          padding:"4px 9px",borderRadius:12,background:C.white,
                          border:`1px solid ${C.border}`,
                          fontSize:11,fontWeight:600,color:C.dark,fontFamily:"'DM Sans',sans-serif",
                        }}>
                          <span>{a.emoji}</span>{a.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
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
                Ajoutez au moins 3 photos pour attirer les locataires. ({form.photos.length}/{photosMaxAllowed})
              </p>

              <input
                id="byer-photo-input"
                type="file"
                accept="image/*"
                multiple
                style={{display:"none"}}
                onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
              />

              {/* Conseil de prise de vue : aide à comprendre quoi photographier */}
              <div style={{background:"#FFF8E1",border:"1px solid #FFE082",borderRadius:12,padding:"10px 12px",marginBottom:14}}>
                <p style={{fontSize:11,color:"#7A5500",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif"}}>
                  📸 <strong>Conseil :</strong> commencez par la <strong>vue extérieure</strong> (façade), puis choisissez le <strong>type</strong> de pièce pour chaque photo. Le numéro (Chambre 1, Chambre 2…) est ajouté <strong>automatiquement</strong>. La <strong>limite</strong> par type vient du nombre de pièces fixé au step précédent — ex : 3 chambres configurées → max 3 photos « Chambre ».
                </p>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                {form.photos.map((photo, i) => {
                  const src = photo.src || photo;   // compat si jamais string
                  const tag = photo.tag || null;
                  const autoLabel = computePhotoLabel(i);   // ex: "🛏️ Chambre 2"
                  return (
                    <div key={i} style={{
                      borderRadius:16,
                      border: i === 0 ? `2px solid ${C.coral}` : `1.5px solid ${C.border}`,
                      background:C.white,
                      overflow:"hidden",
                      display:"flex",flexDirection:"column",
                    }}>
                      {/* Image — cliquable pour ouvrir le picker (modifier l'étiquette) */}
                      <div
                        onClick={() => setTaggingPhotoIdx(i)}
                        style={{position:"relative",height:108,background:C.bg,cursor:"pointer"}}
                      >
                        <img src={src} alt={`Photo ${i+1}`} style={{
                          width:"100%",height:"100%",objectFit:"cover",display:"block",
                        }}/>
                        {i === 0 && (
                          <span style={{
                            position:"absolute",top:6,left:6,
                            background:C.coral,color:C.white,
                            fontSize:9,fontWeight:700,
                            padding:"3px 7px",borderRadius:8,
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
                              fontSize:9,fontWeight:600,
                              padding:"3px 7px",borderRadius:8,
                              border:"none",cursor:"pointer",
                              fontFamily:"'DM Sans',sans-serif",
                            }}
                          >★</button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                          title="Supprimer"
                          style={{
                            position:"absolute",top:6,right:6,
                            width:24,height:24,borderRadius:12,
                            background:"rgba(0,0,0,0.65)",color:C.white,
                            border:"none",cursor:"pointer",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:13,fontWeight:700,lineHeight:1,
                          }}
                        >×</button>
                      </div>
                      {/* Bouton-badge unique : affiche l'étiquette si définie,
                          sinon "Étiqueter cette photo" en rouge. Clic = ouvre le picker. */}
                      <button
                        onClick={() => setTaggingPhotoIdx(i)}
                        style={{
                          border:"none",
                          borderTop:`1px solid ${C.border}`,
                          background: tag ? "#FFF5F5" : "#FFE5E7",
                          color: C.coral,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "9px 6px",
                          textAlign: "center",
                          fontFamily: "'DM Sans',sans-serif",
                          cursor: "pointer",
                          width: "100%",
                          lineHeight: 1.3,
                        }}
                      >
                        {tag && autoLabel ? autoLabel : "📍 Étiqueter cette photo"}
                      </button>
                    </div>
                  );
                })}

                {/* Tuile d'upload — masquée dès que tous les slots prédéfinis
                    sont occupés (ex : 1 façade + 3 chambres + 1 cuisine = 5 max).
                    Une fois pleine, l'utilisateur ne peut QUE modifier ou
                    supprimer une photo existante (pas en ajouter de nouvelle). */}
                {form.photos.length < photosMaxAllowed && (
                  <label htmlFor="byer-photo-input" style={{
                    minHeight:140,borderRadius:16,
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

              {/* Bandeau "tous les slots remplis" — feedback explicite quand
                  l'utilisateur a atteint le nombre exact de photos prévues
                  par sa composition. Indique clairement comment libérer un slot. */}
              {form.photos.length >= photosMaxAllowed && (
                <div style={{
                  background:"#E8F5E9",border:"1px solid #A5D6A7",borderRadius:12,
                  padding:"10px 12px",marginBottom:14,
                }}>
                  <p style={{fontSize:11,color:"#1B5E20",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif"}}>
                    ✅ <strong>Tous les emplacements ({photosMaxAllowed}) sont remplis.</strong> Vous ne pouvez plus ajouter de nouvelle photo. Pour en remplacer une, supprimez-la d'abord (×) puis uploadez la nouvelle. Pour changer son étiquette, cliquez simplement dessus.
                  </p>
                </div>
              )}

              {uploadError && (
                <div style={{background:"#FEF2F2",border:`1px solid #FEC8C8`,borderRadius:10,padding:"10px 12px",marginBottom:14}}>
                  <p style={{fontSize:12,color:"#B91C1C",fontFamily:"'DM Sans',sans-serif"}}>{uploadError}</p>
                </div>
              )}

              {/* Indicateur de couverture : compteur détaillé par type
                  (utilisé / max prédéfini au step précédent). */}
              {form.segment === "property" && PHOTO_TAG_TYPES.length > 0 && (() => {
                const stats = PHOTO_TAG_TYPES.map(t => ({
                  ...t,
                  used: form.photos.filter(p => p.tag === t.id).length,
                }));
                const totalUsed = stats.reduce((s, x) => s + x.used, 0);
                const totalMax  = stats.reduce((s, x) => s + x.maxCount, 0);
                const allDone = stats.every(s => s.used >= s.maxCount);
                return (
                  <div style={{background:C.bg,borderRadius:12,padding:"10px 12px",marginBottom:14}}>
                    <p style={{fontSize:11,fontWeight:700,color:C.mid,marginBottom:8,textTransform:"uppercase",letterSpacing:.4}}>
                      Couverture · {totalUsed}/{totalMax} étiquetée(s)
                    </p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {stats.map(s => {
                        const full = s.used >= s.maxCount;
                        const empty = s.used === 0;
                        return (
                          <span key={s.id} style={{
                            fontSize:10, padding:"3px 8px", borderRadius:10,
                            fontWeight:600,
                            background: full ? "#0A8754" : (empty ? "#FFF5F5" : C.white),
                            color:      full ? C.white   : (empty ? C.coral   : C.dark),
                            border:     full ? "none"    : (empty ? `1px solid ${C.coral}` : `1px solid ${C.border}`),
                            fontFamily:"'DM Sans',sans-serif",
                          }}>
                            {s.emoji} {s.label} {s.used}/{s.maxCount}
                          </span>
                        );
                      })}
                    </div>
                    <p style={{fontSize:10,color: allDone ? "#0A8754" : C.light,marginTop:8,fontStyle:"italic",lineHeight:1.4}}>
                      {allDone
                        ? "✓ Toutes les pièces ont leur(s) photo(s)."
                        : "💡 La limite vient de la composition fixée au step précédent. Numérotation auto (Chambre 1, 2…)."}
                    </p>
                  </div>
                );
              })()}

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

              {/* ─── TAG PICKER SHEET ───
                  Bottom-sheet plein écran qui s'ouvre AUTOMATIQUEMENT après
                  upload (pour la 1ère nouvelle photo non étiquetée) ou au CLIC
                  sur une photo déjà uploadée (pour modifier son étiquette).
                  L'utilisateur choisit un type → enchaîne sur la photo suivante
                  non étiquetée s'il y en a, sinon ferme le picker. */}
              {taggingPhotoIdx !== null && form.photos[taggingPhotoIdx] && (() => {
                const idx     = taggingPhotoIdx;
                const photo   = form.photos[idx];
                const curTag  = photo.tag || null;
                const types   = computePhotoTagTypes();
                const close   = () => setTaggingPhotoIdx(null);
                const advance = () => {
                  /* Cherche la prochaine photo non étiquetée APRÈS celle-ci.
                     Si trouvée → bascule sur elle. Sinon → ferme. */
                  const next = findNextUntaggedIdx(idx);
                  if (next !== null) setTaggingPhotoIdx(next);
                  else close();
                };
                return (
                  <div
                    onClick={close}
                    style={{
                      position:"fixed",inset:0,zIndex:200,
                      background:"rgba(0,0,0,0.55)",
                      display:"flex",alignItems:"flex-end",justifyContent:"center",
                    }}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="sheet"
                      style={{
                        background:C.white,
                        width:"100%",maxWidth:480,
                        borderTopLeftRadius:24,borderTopRightRadius:24,
                        padding:"18px 18px calc(18px + env(safe-area-inset-bottom)) 18px",
                        maxHeight:"85vh",overflow:"auto",
                        display:"flex",flexDirection:"column",gap:14,
                      }}
                    >
                      {/* Drag handle */}
                      <div style={{
                        width:42,height:4,borderRadius:2,background:C.border,
                        margin:"0 auto",
                      }}/>

                      {/* Header */}
                      <div style={{textAlign:"center"}}>
                        <p style={{fontSize:18,fontWeight:800,color:C.black,marginBottom:4}}>
                          Étiqueter la photo {idx + 1}
                        </p>
                        <p style={{fontSize:12,color:C.mid,lineHeight:1.4}}>
                          Choisissez ce que représente cette photo. Le numéro
                          (Chambre 1, 2…) est ajouté automatiquement.
                        </p>
                      </div>

                      {/* Aperçu de la photo */}
                      <div style={{
                        height:160,borderRadius:14,overflow:"hidden",
                        background:C.bg,position:"relative",
                      }}>
                        <img
                          src={photo.src || photo}
                          alt={`Photo ${idx + 1}`}
                          style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
                        />
                        {curTag && computePhotoLabel(idx) && (
                          <span style={{
                            position:"absolute",bottom:8,left:8,
                            background:"rgba(0,0,0,0.65)",color:C.white,
                            fontSize:11,fontWeight:700,
                            padding:"4px 9px",borderRadius:10,
                            fontFamily:"'DM Sans',sans-serif",
                          }}>
                            Actuel : {computePhotoLabel(idx)}
                          </span>
                        )}
                      </div>

                      {/* Erreur (limite atteinte) */}
                      {uploadError && (
                        <div style={{
                          background:"#FFE5E7",border:`1px solid ${C.coral}`,
                          borderRadius:10,padding:"8px 10px",
                          fontSize:11,color:C.coral,fontWeight:600,lineHeight:1.4,
                        }}>
                          {uploadError}
                        </div>
                      )}

                      {/* Grille de types */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        {types.map(t => {
                          const usedByOthers = form.photos.filter((p, j) => p.tag === t.id && j !== idx).length;
                          const isCurrent = curTag === t.id;
                          const isFull = usedByOthers >= t.maxCount;
                          const counter = t.maxCount > 1
                            ? `${usedByOthers + (isCurrent ? 1 : 0)}/${t.maxCount}`
                            : null;
                          const disabled = isFull && !isCurrent;
                          return (
                            <button
                              key={t.id}
                              disabled={disabled}
                              onClick={() => {
                                const ok = setPhotoTag(idx, t.id);
                                if (ok) {
                                  /* Petit délai pour que l'utilisateur voit
                                     visuellement la sélection avant transition. */
                                  setTimeout(advance, 180);
                                }
                              }}
                              style={{
                                display:"flex",flexDirection:"column",alignItems:"center",
                                justifyContent:"center",gap:4,
                                padding:"12px 8px",
                                borderRadius:14,
                                border: isCurrent ? `2px solid ${C.coral}` : `1.5px solid ${C.border}`,
                                background: isCurrent ? "#FFF5F5" : (disabled ? C.bg : C.white),
                                color: disabled ? C.light : C.dark,
                                cursor: disabled ? "not-allowed" : "pointer",
                                opacity: disabled ? .55 : 1,
                                fontFamily:"'DM Sans',sans-serif",
                              }}
                            >
                              <span style={{fontSize:22,lineHeight:1}}>{t.emoji}</span>
                              <span style={{fontSize:12,fontWeight:700,textAlign:"center",lineHeight:1.2}}>
                                {t.label}
                              </span>
                              {counter && (
                                <span style={{
                                  fontSize:10,fontWeight:600,
                                  color: isFull ? "#0A8754" : C.mid,
                                }}>{counter}{isFull ? " ✓" : ""}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Action bar */}
                      <div style={{display:"flex",gap:8,marginTop:4}}>
                        {curTag && (
                          <button
                            onClick={() => { setPhotoTag(idx, null); }}
                            style={{
                              flex:1,padding:"12px 10px",borderRadius:14,
                              border:`1.5px solid ${C.border}`,background:C.white,
                              color:C.mid,fontWeight:700,fontSize:13,
                              fontFamily:"'DM Sans',sans-serif",cursor:"pointer",
                            }}
                          >Retirer l'étiquette</button>
                        )}
                        <button
                          onClick={close}
                          style={{
                            flex:1,padding:"12px 10px",borderRadius:14,
                            border:"none",background:C.dark,color:C.white,
                            fontWeight:700,fontSize:13,
                            fontFamily:"'DM Sans',sans-serif",cursor:"pointer",
                          }}
                        >Plus tard</button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── STEP 5 : Règlement ── */}
          {step === 5 && (() => {
            const RULES_LIST = getRulesForSegment(form.segment);
            const toggleRule = (id) => {
              setForm(p => ({
                ...p,
                houseRules: p.houseRules.includes(id)
                  ? p.houseRules.filter(x => x !== id)
                  : [...p.houseRules, id],
              }));
            };
            const addCustomRule = () => {
              const text = (form._customDraft || "").trim();
              if (!text) return;
              if (form.customRules.length >= 10) return;
              setForm(p => ({
                ...p,
                customRules: [...p.customRules, text],
                _customDraft: "",
              }));
            };
            const removeCustomRule = (idx) => {
              setForm(p => ({ ...p, customRules: p.customRules.filter((_, i) => i !== idx) }));
            };
            return (
              <div>
                <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Règlement</p>
                <p style={{fontSize:13,color:C.mid,marginBottom:16,lineHeight:1.5}}>
                  Définissez les règles d'utilisation. Les locataires les verront avant de réserver et devront les accepter.
                </p>

                {/* Astuce */}
                <div style={{background:"#FFF8E1",border:"1px solid #FFE082",borderRadius:12,padding:"10px 12px",marginBottom:16}}>
                  <p style={{fontSize:11,color:"#7A5500",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif"}}>
                    💡 Cochez les règles qui s'appliquent. Vous pouvez aussi ajouter <strong>jusqu'à 10 règles personnalisées</strong> en bas (ex. « Heure d'arrivée 14h-22h »).
                  </p>
                </div>

                {/* Règles pré-définies en chips */}
                <p style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:8}}>
                  Règles courantes ({form.houseRules.length} sélectionnée{form.houseRules.length>1?"s":""})
                </p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
                  {RULES_LIST.map(r => {
                    const active = form.houseRules.includes(r.id);
                    return (
                      <button key={r.id} onClick={() => toggleRule(r.id)} style={{
                        fontSize:12, padding:"7px 12px", borderRadius:18,
                        background: active ? C.coral : C.white,
                        color:      active ? C.white : C.dark,
                        border:     `1.5px solid ${active ? C.coral : C.border}`,
                        fontWeight:600, cursor:"pointer",
                        fontFamily:"'DM Sans',sans-serif",
                        display:"inline-flex", alignItems:"center", gap:5,
                      }}>
                        <span>{r.emoji}</span> {r.label}
                      </button>
                    );
                  })}
                </div>

                {/* Règles personnalisées */}
                <p style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:8}}>
                  Règles personnalisées ({form.customRules.length}/10)
                </p>
                <div style={{display:"flex",gap:6,marginBottom:10}}>
                  <input
                    type="text"
                    value={form._customDraft || ""}
                    onChange={e => set("_customDraft", e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustomRule(); } }}
                    placeholder="Ex. Pas de bruit après 22h"
                    maxLength={120}
                    disabled={form.customRules.length >= 10}
                    style={{
                      flex:1, padding:"10px 12px", borderRadius:10,
                      border:`1.5px solid ${C.border}`,
                      fontSize:13, outline:"none",
                      fontFamily:"'DM Sans',sans-serif",
                      background: form.customRules.length >= 10 ? C.bg : C.white,
                    }}
                  />
                  <button onClick={addCustomRule} disabled={!form._customDraft || form.customRules.length >= 10} style={{
                    padding:"10px 14px", borderRadius:10,
                    background: (form._customDraft && form.customRules.length < 10) ? C.coral : C.bg,
                    color:      (form._customDraft && form.customRules.length < 10) ? C.white : C.light,
                    border:"none", fontSize:13, fontWeight:700,
                    cursor: (form._customDraft && form.customRules.length < 10) ? "pointer" : "not-allowed",
                    fontFamily:"'DM Sans',sans-serif",
                  }}>+ Ajouter</button>
                </div>

                {form.customRules.length > 0 && (
                  <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
                    {form.customRules.map((rule, i) => (
                      <div key={i} style={{
                        display:"flex", alignItems:"center", justifyContent:"space-between",
                        padding:"10px 12px", borderRadius:10,
                        background: C.bg, border:`1px solid ${C.border}`,
                        gap:8,
                      }}>
                        <p style={{fontSize:12,color:C.dark,flex:1,fontFamily:"'DM Sans',sans-serif"}}>
                          📌 {rule}
                        </p>
                        <button onClick={() => removeCustomRule(i)} style={{
                          background:"transparent", border:"none", cursor:"pointer",
                          color:"#B91C1C", fontSize:18, fontWeight:700, lineHeight:1,
                          padding:"0 4px",
                        }}>×</button>
                      </div>
                    ))}
                  </div>
                )}

                {(form.houseRules.length === 0 && form.customRules.length === 0) && (
                  <div style={{background:"#FEF2F2",border:`1px solid #FEC8C8`,borderRadius:10,padding:"10px 12px",marginBottom:16}}>
                    <p style={{fontSize:11,color:"#B91C1C",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif"}}>
                      ⚠️ Aucune règle définie. Vous pouvez continuer mais c'est recommandé d'en ajouter au moins une pour éviter les malentendus.
                    </p>
                  </div>
                )}

                <button style={S.payBtn} onClick={() => setStep(6)}>
                  Continuer →
                </button>
              </div>
            );
          })()}

          {/* ── STEP 6 : Récapitulatif ── */}
          {step === 6 && (
            <div>
              <p style={{fontSize:20,fontWeight:800,color:C.black,marginBottom:6}}>Récapitulatif</p>
              <p style={{fontSize:13,color:C.mid,marginBottom:20}}>Vérifiez les informations avant de publier.</p>

              {form.photos.length > 0 && (
                <div style={{borderRadius:16,overflow:"hidden",marginBottom:14,position:"relative",height:170}}>
                  <img src={form.photos[0].src || form.photos[0]} alt="Principale" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  {form.photos.length > 1 && (
                    <span style={{
                      position:"absolute",bottom:8,right:8,
                      background:"rgba(0,0,0,0.65)",color:C.white,
                      fontSize:11,fontWeight:600,
                      padding:"4px 10px",borderRadius:10,
                      fontFamily:"'DM Sans',sans-serif",
                    }}>+{form.photos.length - 1} photos</span>
                  )}
                  {form.photos[0].tag && computePhotoLabel(0) && (
                    <span style={{
                      position:"absolute",top:8,left:8,
                      background:"rgba(0,0,0,0.65)",color:C.white,
                      fontSize:10,fontWeight:600,
                      padding:"4px 8px",borderRadius:8,
                      fontFamily:"'DM Sans',sans-serif",
                    }}>{computePhotoLabel(0)}</span>
                  )}
                </div>
              )}

              {/* Récap des étiquettes photo si l'annonce en a */}
              {form.photos.some(p => p.tag) && (
                <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"10px 12px",marginBottom:14}}>
                  <p style={{fontSize:11,fontWeight:700,color:C.dark,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                    <span>📸</span> Photos étiquetées
                  </p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {form.photos.map((p, i) => p.tag ? (
                      <span key={i} style={{
                        fontSize:10,padding:"3px 7px",borderRadius:10,
                        background:C.bg,color:C.dark,
                        fontFamily:"'DM Sans',sans-serif",
                      }}>#{i+1} → {computePhotoLabel(i)}</span>
                    ) : null)}
                  </div>
                  {form.photos.some(p => !p.tag) && (
                    <p style={{fontSize:10,color:C.light,marginTop:6,fontStyle:"italic"}}>
                      {form.photos.filter(p => !p.tag).length} photo(s) sans étiquette
                    </p>
                  )}
                </div>
              )}

              {/* Récap règlement */}
              {(form.houseRules.length > 0 || form.customRules.length > 0) && (() => {
                const RULES_LIST = getRulesForSegment(form.segment);
                return (
                  <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"10px 12px",marginBottom:14}}>
                    <p style={{fontSize:11,fontWeight:700,color:C.dark,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                      <span>📜</span> Règlement ({form.houseRules.length + form.customRules.length})
                    </p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {form.houseRules.map(rid => {
                        const r = RULES_LIST.find(x => x.id === rid);
                        if (!r) return null;
                        return (
                          <span key={rid} style={{
                            fontSize:10,padding:"3px 7px",borderRadius:10,
                            background:C.bg,color:C.dark,
                            fontFamily:"'DM Sans',sans-serif",
                          }}>{r.emoji} {r.label}</span>
                        );
                      })}
                      {form.customRules.map((rule, i) => (
                        <span key={`c${i}`} style={{
                          fontSize:10,padding:"3px 7px",borderRadius:10,
                          background:"#FFF5F5",color:C.coral,
                          fontFamily:"'DM Sans',sans-serif",
                          border:`1px solid ${C.coral}`,
                        }}>📌 {rule}</span>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Récap composition */}
              {form.segment === "property" && (() => {
                const cat = BUILDING_TYPES.find(b => b.id === form.buildingType);
                const ents = CHILD_ENTITIES_BY_TYPE[form.buildingType] || [];
                const totalUnits = ents.reduce((s, m) => {
                  const e = form.childEntities[m.id];
                  return s + (e ? e.count : 0);
                }, 0);
                return (
                  <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"12px 14px",marginBottom:14}}>
                    <p style={{fontSize:12,fontWeight:700,color:C.dark,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
                      <span>{cat ? cat.emoji : "🏗️"}</span> {cat ? cat.label : form.buildingType} · {totalUnits} unité{totalUnits>1?"s":""} au total
                    </p>

                    {/* Palette générale */}
                    {form.generalAmenities.length > 0 && (
                      <div style={{paddingTop:6,paddingBottom:8,borderTop:`1px dashed ${C.border}`}}>
                        <p style={{fontSize:11,fontWeight:700,color:C.dark,marginBottom:5}}>✨ Équipements de l'annonce</p>
                        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                          {form.generalAmenities.map(aid => {
                            const a = GENERAL_AMENITIES.find(x => x.id === aid);
                            if (!a) return null;
                            return (
                              <span key={aid} style={{
                                fontSize:10,padding:"3px 7px",borderRadius:10,
                                background:C.bg,color:C.dark,
                                fontFamily:"'DM Sans',sans-serif",
                              }}>{a.emoji} {a.label}</span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Détail par entité fille */}
                    {ents.map(meta => {
                      const ent = form.childEntities[meta.id];
                      if (!ent || ent.count === 0) return null;
                      return (
                        <div key={meta.id} style={{paddingTop:6,paddingBottom:6,borderTop:`1px dashed ${C.border}`}}>
                          <p style={{fontSize:11,fontWeight:700,color:C.coral,marginBottom:3}}>
                            {meta.emoji} {meta.label} × {ent.count}
                          </p>
                          {ent.shared ? (
                            <p style={{fontSize:11,color:C.mid,lineHeight:1.5}}>
                              {(ent.sharedAmenities || []).length > 0
                                ? <>Tous identiques : {ent.sharedAmenities.map(aid => {
                                    const a = GENERAL_AMENITIES.find(x => x.id === aid);
                                    return a ? a.label : aid;
                                  }).join(" · ")}</>
                                : <em style={{color:C.light}}>Aucun équipement spécifique</em>
                              }
                            </p>
                          ) : (
                            <div style={{paddingLeft:6}}>
                              {(ent.instances || []).map((inst, idx) => {
                                const labels = (inst.amenities || []).map(aid => {
                                  const a = GENERAL_AMENITIES.find(x => x.id === aid);
                                  return a ? a.label : aid;
                                });
                                return (
                                  <p key={inst.id} style={{fontSize:10,color:C.mid,lineHeight:1.4,marginTop:2}}>
                                    <strong style={{color:C.dark}}>{meta.label} {idx+1}</strong> →{" "}
                                    {labels.length > 0 ? labels.join(" · ") : <em style={{color:C.light}}>aucun</em>}
                                  </p>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
