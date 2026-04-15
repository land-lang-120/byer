/* Byer — Mock Data */

/* ─── GALLERY ──────────────────────────────────────
   Photo galleries per listing (keyed by item id).
   5 photos each with labels.
─────────────────────────────────────────────────── */
const GALLERY = {

  /* ── 1 · Villa Balnéaire Kribi ─ villa tropicale bord de mer + piscine ── */
  1: {
    labels:["Façade & piscine","Grand salon","Chambre principale","Cuisine ouverte","Vue mer"],
    imgs:[
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80", // villa tropicale piscine
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80", // salon lumineux
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", // chambre vue mer
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",   // cuisine moderne
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80", // terrasse mer
    ],
  },

  /* ── 2 · Appartement Bonamoussadi ─ appart urbain moderne ── */
  2: {
    labels:["Séjour","Chambre","Cuisine équipée","Salle de bain","Balcon"],
    imgs:[
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",   // living room moderne
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80", // chambre propre
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80", // cuisine équipée
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",   // salle de bain
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",   // immeuble balcon
    ],
  },

  /* ── 3 · Penthouse Bastos ─ luxe vue panoramique ── */
  3: {
    labels:["Terrasse rooftop","Grand salon","Suite master","Cuisine ouverte","Salle de bain luxe"],
    imgs:[
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", // penthouse extérieur
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80", // salon luxueux
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80", // chambre luxe
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",   // cuisine design
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",   // sdb marbre
    ],
  },

  /* ── 4 · Studio Ndokoti ─ studio compact fonctionnel ── */
  4: {
    labels:["Studio complet","Coin nuit","Bureau","Coin cuisine","Salle de bain"],
    imgs:[
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80", // studio vue ensemble
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80", // lit simple propre
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80", // bureau compact
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80",   // kitchenette
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",   // sdb studio
    ],
  },

  /* ── 5 · Villa Bafoussam Hills ─ villa avec jardin collines ── */
  5: {
    labels:["Façade & jardin","Salon","Chambre","Terrasse BBQ","Vue collines"],
    imgs:[
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80", // villa jardin
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80", // salon confortable
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80", // chambre cosy
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80", // terrasse verdure
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // vue collines
    ],
  },

  /* ── 6 · Chambre Limbé Plage ─ chambre côtière ── */
  6: {
    labels:["Chambre vue mer","Lit double","Salle de bain","Terrasse","Plage proche"],
    imgs:[
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", // chambre bord de mer
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80", // lit propre blanc
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",   // sdb simple
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80", // terrasse plage
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", // plage tropicale
    ],
  },

  /* ── 7 · Hôtel La Falaise ─ hôtel facade + lobby + chambres ── */
  7: {
    labels:["Façade hôtel","Lobby & réception","Chambre standard","Salle de bain","Restaurant"],
    imgs:[
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", // hotel facade
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",   // hotel lobby
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", // chambre hôtel
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80", // sdb hôtel
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", // restaurant hôtel
    ],
  },

  /* ── 8 · Motel Autoroute Douala ─ motel simple fonctionnel ── */
  8: {
    labels:["Extérieur motel","Chambre","Bureau","Salle de bain","Parking"],
    imgs:[
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", // motel extérieur
      "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=800&q=80", // chambre simple
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80", // bureau tv
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",   // sdb basique
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",   // parking
    ],
  },

  /* ── 9 · Auberge du Voyageur ─ auberge de jeunesse conviviale ── */
  9: {
    labels:["Entrée auberge","Dortoir","Cuisine commune","Espace détente","Jardin"],
    imgs:[
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",   // entrée auberge
      "https://images.unsplash.com/photo-1520277739336-7bf67a832e24?w=800&q=80", // dortoir lits superposés
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",   // cuisine commune
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80", // salon commun
      "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80", // jardin détente
    ],
  },

  /* ── 10 · Toyota Land Cruiser ── */
  10: {
    labels:["Face avant","Profil droit","Intérieur","Tableau de bord","Coffre"],
    imgs:[
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80", // land cruiser face
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80", // suv profil
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",   // intérieur 4x4
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80", // tableau de bord
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",   // coffre grand
    ],
  },

  /* ── 11 · Hyundai Tucson ── */
  11: {
    labels:["Face avant","Profil gauche","Habitacle","Console centrale","Arrière"],
    imgs:[
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",   // tucson face
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",   // suv côté
      "https://images.unsplash.com/photo-1605559424843-9073c6e09a6b?w=800&q=80", // intérieur propre
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80", // console
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80", // arrière suv
    ],
  },

  /* ── 12 · Mercedes Classe E ── */
  12: {
    labels:["Face avant","3/4 arrière","Cuir intérieur","Tableau de bord","Jantes AMG"],
    imgs:[
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80",   // mercedes face
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80", // mercedes 3/4
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", // cuir beige luxe
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80", // tableau de bord luxe
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",   // jantes
    ],
  },

  /* ── 13 · Appart. Bonapriso Neuf ─ appartement neuf haut standing ── */
  13: {
    labels:["Séjour moderne","Chambre master","2ème chambre","Cuisine","Balcon vue"],
    imgs:[
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", // appart neuf salon
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80", // chambre haut standing
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", // 2e chambre
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80", // cuisine moderne
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",   // balcon immeuble neuf
    ],
  },
};

/* ─── PROPERTIES ───────────────────────────────────
   10 property listings across Cameroon.
   nightPrice = prix/nuit  |  monthPrice = prix/mois (null = non disponible)
─────────────────────────────────────────────────── */
const PROPERTIES = [
  { id:1,  type:"property", propType:"villa",       title:"Villa Balnéaire Kribi",    city:"Kribi",     zone:"Bord de mer",    nightPrice:75000,  monthPrice:1200000, rating:4.96, reviews:89,  superhost:true,  beds:4, baths:3, guests:8,  amenities:["Piscine","Vue mer","Terrasse","WiFi"] },
  { id:2,  type:"property", propType:"appartement", title:"Appartement Bonamoussadi", city:"Douala",    zone:"Bonamoussadi",   nightPrice:35000,  monthPrice:450000,  rating:4.82, reviews:134, superhost:false, beds:2, baths:1, guests:4,  amenities:["Climatisé","Parking","WiFi fibre"] },
  { id:3,  type:"property", propType:"villa",       title:"Penthouse Bastos",         city:"Yaoundé",   zone:"Bastos",         nightPrice:120000, monthPrice:1800000, rating:5.0,  reviews:42,  superhost:true,  beds:5, baths:4, guests:10, amenities:["Rooftop","Conciergerie","Gardien","Smart TV"] },
  { id:4,  type:"property", propType:"studio",      title:"Studio Ndokoti",           city:"Douala",    zone:"Ndokoti",        nightPrice:18000,  monthPrice:220000,  rating:4.71, reviews:201, superhost:false, beds:1, baths:1, guests:2,  amenities:["Climatisé","Eau chaude"] },
  { id:5,  type:"property", propType:"villa",       title:"Villa Bafoussam Hills",    city:"Bafoussam", zone:"Tamdja",         nightPrice:55000,  monthPrice:750000,  rating:4.91, reviews:67,  superhost:true,  beds:3, baths:2, guests:6,  amenities:["Jardin","BBQ","Vue collines"] },
  { id:6,  type:"property", propType:"chambre",     title:"Chambre Limbé Plage",      city:"Limbé",     zone:"Down Beach",     nightPrice:22000,  monthPrice:280000,  rating:4.78, reviews:56,  superhost:false, beds:1, baths:1, guests:2,  amenities:["Plage 2min","Petit-déj"] },
  { id:7,  type:"property", propType:"hotel",       title:"Hôtel La Falaise",         city:"Yaoundé",   zone:"Hippodrome",     nightPrice:65000,  monthPrice:null,    rating:4.85, reviews:312, superhost:true,  beds:1, baths:1, guests:2,  amenities:["Room service","Piscine","Restaurant","Bar","WiFi"] },
  { id:8,  type:"property", propType:"motel",       title:"Motel Autoroute Douala",   city:"Douala",    zone:"PK12",           nightPrice:25000,  monthPrice:null,    rating:4.55, reviews:88,  superhost:false, beds:1, baths:1, guests:2,  amenities:["Parking gratuit","Climatisé","TV satellite"] },
  { id:9,  type:"property", propType:"auberge",     title:"Auberge du Voyageur",      city:"Kribi",     zone:"Centre",         nightPrice:12000,  monthPrice:150000,  rating:4.67, reviews:145, superhost:false, beds:1, baths:1, guests:2,  amenities:["Cuisine commune","WiFi","Casiers","Ambiance"] },
  { id:13, type:"property", propType:"appartement", title:"Appart. Bonapriso Neuf",   city:"Douala",    zone:"Bonapriso",      nightPrice:48000,  monthPrice:580000,  rating:4.88, reviews:72,  superhost:true,  beds:3, baths:2, guests:6,  amenities:["Gardienné","Groupe électrogène","WiFi","Parking"] },
];

/* ─── VEHICLES ─────────────────────────────────────
   3 vehicle listings
─────────────────────────────────────────────────── */
const VEHICLES = [
  { id:10, type:"vehicle", title:"Toyota Land Cruiser 2022", city:"Douala",    zone:"Akwa",           nightPrice:55000, monthPrice:null, rating:4.95, reviews:61, superhost:true,  seats:7,  fuel:"Essence", trans:"Automatique", amenities:["4×4","GPS","Climatisé","Chauffeur optionnel"] },
  { id:11, type:"vehicle", title:"Hyundai Tucson 2023",      city:"Yaoundé",   zone:"Centre-ville",   nightPrice:40000, monthPrice:null, rating:4.88, reviews:44, superhost:false, seats:5,  fuel:"Essence", trans:"Automatique", amenities:["GPS","Climatisé","Bluetooth"] },
  { id:12, type:"vehicle", title:"Mercedes Classe E 2021",   city:"Douala",    zone:"Bonapriso",      nightPrice:85000, monthPrice:null, rating:5.0,  reviews:29, superhost:true,  seats:5,  fuel:"Diesel",  trans:"Automatique", amenities:["Luxe","Chauffeur","Wifi embarqué"] },
];

/* ─── RATINGS DÉTAILLÉES ───────────────────────────
   8 critères : Propreté · Confort · Accessibilité ·
   Convivialité · Emplacement · Sécurité ·
   Équipement · Rapport qualité/prix
   Chaque note est sur 5. La note globale = moyenne.
─────────────────────────────────────────────────── */
const RATINGS = {
  1:  { proprete:5.0, confort:4.9, accessibilite:4.8, convivialite:5.0, emplacement:4.9, securite:4.9, equipement:4.8, qualitePrix:4.8 },
  2:  { proprete:4.8, confort:4.7, accessibilite:4.9, convivialite:4.8, emplacement:4.7, securite:4.8, equipement:4.7, qualitePrix:4.9 },
  3:  { proprete:5.0, confort:5.0, accessibilite:4.9, convivialite:5.0, emplacement:5.0, securite:5.0, equipement:5.0, qualitePrix:4.9 },
  4:  { proprete:4.6, confort:4.5, accessibilite:4.8, convivialite:4.7, emplacement:4.6, securite:4.5, equipement:4.4, qualitePrix:4.8 },
  5:  { proprete:4.9, confort:4.9, accessibilite:4.7, convivialite:5.0, emplacement:4.8, securite:4.8, equipement:4.7, qualitePrix:4.9 },
  6:  { proprete:4.8, confort:4.7, accessibilite:4.6, convivialite:4.8, emplacement:5.0, securite:4.6, equipement:4.5, qualitePrix:4.7 },
  7:  { proprete:4.9, confort:4.8, accessibilite:4.9, convivialite:4.8, emplacement:4.7, securite:4.9, equipement:4.9, qualitePrix:4.7 },
  8:  { proprete:4.5, confort:4.4, accessibilite:4.8, convivialite:4.5, emplacement:4.5, securite:4.4, equipement:4.3, qualitePrix:4.6 },
  9:  { proprete:4.7, confort:4.5, accessibilite:4.6, convivialite:4.9, emplacement:4.6, securite:4.5, equipement:4.4, qualitePrix:4.8 },
  10: { proprete:4.9, confort:4.9, accessibilite:4.8, convivialite:5.0, emplacement:4.9, securite:5.0, equipement:4.9, qualitePrix:4.8 },
  11: { proprete:4.9, confort:4.8, accessibilite:4.9, convivialite:4.9, emplacement:4.8, securite:4.9, equipement:4.8, qualitePrix:4.8 },
  12: { proprete:5.0, confort:5.0, accessibilite:5.0, convivialite:5.0, emplacement:5.0, securite:5.0, equipement:5.0, qualitePrix:4.9 },
  13: { proprete:4.9, confort:4.8, accessibilite:5.0, convivialite:4.9, emplacement:4.8, securite:4.9, equipement:4.9, qualitePrix:4.9 },
};

/* ─── SAMPLE REVIEWS ──────────────────────────────── */
const SAMPLE_REVIEWS = {
  1:  [
    { name:"Kofi A.",   date:"Fév. 2025", score:5.0, text:"Villa impeccable, propreté irréprochable et vue sur mer magnifique. L'hôte est très disponible.", avatar:"K", bg:"#6366F1", photo:"https://i.pravatar.cc/80?u=kofia" },
    { name:"Mariama D.",date:"Jan. 2025", score:4.9, text:"Séjour parfait en famille. La piscine est un vrai plus. Je recommande vivement !", avatar:"M", bg:"#0EA5E9", photo:"https://i.pravatar.cc/80?u=mariamd" },
  ],
  2:  [
    { name:"Thierry N.", date:"Mars 2025", score:4.8, text:"Appartement propre et bien situé. Le WiFi est excellent. Hôte réactif.", avatar:"T", bg:"#F59E0B", photo:"https://i.pravatar.cc/80?u=thierry" },
    { name:"Fatou S.",   date:"Fév. 2025", score:4.7, text:"Bon rapport qualité/prix. Le parking est pratique. Je reviendrai.", avatar:"F", bg:"#EF4444", photo:"https://i.pravatar.cc/80?u=fatous" },
  ],
  3:  [
    { name:"Rodrigue F.",date:"Mars 2025", score:5.0, text:"Penthouse exceptionnel ! Vue panoramique sur Yaoundé, équipements haut de gamme.", avatar:"R", bg:"#8B5CF6", photo:"https://i.pravatar.cc/80?u=rodriguef" },
    { name:"Amina B.",   date:"Fév. 2025", score:5.0, text:"Le meilleur séjour de ma vie à Yaoundé. Service de conciergerie au top.", avatar:"A", bg:"#10B981", photo:"https://i.pravatar.cc/80?u=aminab" },
  ],
  4:  [{ name:"Patrick K.",date:"Mars 2025", score:4.7, text:"Studio fonctionnel, bien équipé. Idéal pour un séjour seul.", avatar:"P", bg:"#F59E0B", photo:"https://i.pravatar.cc/80?u=patrickk" }],
  5:  [{ name:"Nadège T.", date:"Fév. 2025", score:4.9, text:"Villa magnifique avec une vue imprenable sur les collines. Très paisible.", avatar:"N", bg:"#6366F1", photo:"https://i.pravatar.cc/80?u=nadeget" }],
  6:  [{ name:"Eric M.",   date:"Jan. 2025", score:4.8, text:"À 2 minutes de la plage ! Petit déjeuner inclus, accueil chaleureux.", avatar:"E", bg:"#0EA5E9", photo:"https://i.pravatar.cc/80?u=ericm" }],
  7:  [{ name:"Sophie L.", date:"Mars 2025", score:4.9, text:"Hôtel très professionnel. Chambre impeccable, restaurant excellent.", avatar:"S", bg:"#8B5CF6", photo:"https://i.pravatar.cc/80?u=sophiel" }],
  8:  [{ name:"Jean-Paul N.",date:"Fév. 2025", score:4.5, text:"Motel propre et pratique pour une étape. Parking spacieux.", avatar:"J", bg:"#64748B", photo:"https://i.pravatar.cc/80?u=jeanpauln" }],
  9:  [{ name:"Clémentine A.",date:"Jan. 2025", score:4.7, text:"Auberge avec une super ambiance. J'ai rencontré des voyageurs du monde entier.", avatar:"C", bg:"#EA580C", photo:"https://i.pravatar.cc/80?u=clemantinea" }],
  13: [{ name:"Serge B.",  date:"Mars 2025", score:4.9, text:"Appartement neuf et très bien situé à Bonapriso. Groupe électrogène très apprécié !", avatar:"S", bg:"#16A34A", photo:"https://i.pravatar.cc/80?u=sergeb" }],
  10: [{ name:"Claude E.", date:"Mars 2025", score:4.9, text:"Land Cruiser en parfait état. Chauffeur très professionnel.", avatar:"C", bg:"#6366F1", photo:"https://i.pravatar.cc/80?u=claudee" }],
  11: [{ name:"Brigitte F.",date:"Fév. 2025", score:4.8, text:"Tucson impeccable, GPS fonctionnel. Location très fluide.", avatar:"B", bg:"#F59E0B", photo:"https://i.pravatar.cc/80?u=brigittef" }],
  12: [{ name:"Michel A.", date:"Mars 2025", score:5.0, text:"Classe E de rêve. Intérieur cuir parfait, chauffeur élégant.", avatar:"M", bg:"#0EA5E9", photo:"https://i.pravatar.cc/80?u=michela" }],
};

/* ─── OWNER PORTFOLIOS ─────────────────────────────
   Chaque propriétaire possède un ou plusieurs immeubles/
   établissements, chacun contenant des unités (appartements,
   chambres, studios…). Un hôtel = établissement parent
   avec types de chambres comme unités enfants.
─────────────────────────────────────────────────── */
const OWNERS = {
  "Ekwalla M.": {
    id:"O1", name:"Ekwalla M.", since:"2019", city:"Douala",
    avatar:"E", avatarBg:"#6366F1",
    photo:"https://i.pravatar.cc/120?u=ekwallam",
    superhost:true, rating:4.88, reviews:347,
    about:"Propriétaire professionnel à Douala depuis 2019. Je gère mes biens en personne pour garantir un séjour de qualité.",
    buildings: [
      {
        id:"B1", name:"Résidence Les Palmiers", address:"Rue Ivy, Bonamoussadi, Douala",
        type:"immeuble", floors:4, img:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
        units:[
          { id:2,  label:"Appart. 2A · 2 ch.",  floor:"2ème",  propType:"appartement", nightPrice:35000, monthPrice:450000,  available:true,  availableFrom:null },
          { id:13, label:"Appart. 3B · 3 ch.",  floor:"3ème",  propType:"appartement", nightPrice:48000, monthPrice:580000,  available:false, availableFrom:"26 mars 2025" },
          { id:4,  label:"Studio 1C",            floor:"1er",   propType:"studio",      nightPrice:18000, monthPrice:220000,  available:true,  availableFrom:null },
          { id:"U5", label:"Studio 1D",          floor:"1er",   propType:"studio",      nightPrice:18000, monthPrice:220000,  available:false, availableFrom:"1 avr. 2025" },
          { id:"U6", label:"Chambre 4A",         floor:"4ème",  propType:"chambre",     nightPrice:12000, monthPrice:140000,  available:true,  availableFrom:null },
        ],
      },
      {
        id:"B2", name:"Villa Akwa Prestige", address:"Rue de la Paix, Akwa, Douala",
        type:"villa", floors:2, img:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
        units:[
          { id:"U7", label:"Villa entière",    floor:"Entier", propType:"villa",       nightPrice:95000, monthPrice:1400000, available:true,  availableFrom:null },
          { id:"U8", label:"Suite principale", floor:"1er",    propType:"chambre",     nightPrice:45000, monthPrice:null,    available:true,  availableFrom:null },
        ],
      },
    ],
  },
  "Fouda R.": {
    id:"O2", name:"Fouda R.", since:"2021", city:"Yaoundé",
    avatar:"F", avatarBg:"#0EA5E9",
    photo:"https://i.pravatar.cc/120?u=foudar",
    superhost:true, rating:4.95, reviews:201,
    about:"Gestionnaire d'hôtels et de résidences premium à Yaoundé. Qualité et service haut de gamme.",
    buildings:[
      {
        id:"B3", name:"Hôtel La Falaise", address:"Avenue Hippodrome, Yaoundé",
        type:"hotel", floors:6, img:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        units:[
          { id:7,    label:"Chambre Standard",  floor:"2–3ème", propType:"chambre",    nightPrice:45000, monthPrice:null,   available:true,  availableFrom:null,          count:8  },
          { id:"U9", label:"Chambre Supérieure",floor:"4ème",   propType:"chambre",    nightPrice:65000, monthPrice:null,   available:false, availableFrom:"24 mars 2025", count:4  },
          { id:"U10",label:"Suite Junior",      floor:"5ème",   propType:"chambre",    nightPrice:95000, monthPrice:null,   available:true,  availableFrom:null,          count:3  },
          { id:"U11",label:"Suite Présidentielle",floor:"6ème", propType:"chambre",    nightPrice:180000,monthPrice:null,   available:false, availableFrom:"28 mars 2025", count:1  },
        ],
      },
      {
        id:"B4", name:"Penthouse Bastos", address:"Quartier Bastos, Yaoundé",
        type:"villa", floors:2, img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
        units:[
          { id:3, label:"Penthouse complet", floor:"Entier", propType:"villa", nightPrice:120000, monthPrice:1800000, available:true, availableFrom:null },
        ],
      },
    ],
  },
};

/* ─── AVAILABILITY MAP ─────────────────────────────
   Simule les réservations actives qui bloquent un bien.
   Dans une vraie app : données serveur en temps réel.
─────────────────────────────────────────────────── */
const BOOKED_UNTIL = {
  13: "26 mars 2025",   // Appart. 3B réservé
  "U5": "1 avr. 2025",  // Studio 1D réservé
  "U9": "24 mars 2025", // Chambre Supérieure hôtel
  "U11":"28 mars 2025", // Suite Présidentielle
};

/* ─── RENT SCREEN CONSTANTS ────────────────────────
   Dates et seuils pour l'écran de loyers
─────────────────────────────────────────────────── */
const TODAY      = new Date("2025-03-22");
const DEADLINE_1 = new Date("2025-03-31"); // fin du mois courant
const DAYS_LEFT  = Math.ceil((DEADLINE_1 - TODAY) / 86400000); // 9 jours
const WARN       = DAYS_LEFT <= 7; // rappel actif si <= 7 jours

/* ─── LOYERS — VUE LOCATAIRE ───────────────────────── */
const LOYERS_LOCATAIRE = [
  {
    id:"L1", logement:"Appartement Bonamoussadi", bailleur:"Ekwalla M.",
    montant:450000, echeance:"31 mars 2025", statut:"en_attente",
    joursRestants: DAYS_LEFT, rappelActif: WARN,
  },
  {
    id:"L2", logement:"Appartement Bonamoussadi", bailleur:"Ekwalla M.",
    montant:450000, echeance:"28 fév. 2025", statut:"payé",
    datePaiement:"25 fév. 2025", methode:"MTN Mobile Money", ref:"MTN250225KD91",
  },
  {
    id:"L3", logement:"Appartement Bonamoussadi", bailleur:"Ekwalla M.",
    montant:450000, echeance:"31 jan. 2025", statut:"payé",
    datePaiement:"28 jan. 2025", methode:"Orange Money", ref:"OM250128AX44",
  },
  {
    id:"L4", logement:"Appartement Bonamoussadi", bailleur:"Ekwalla M.",
    montant:450000, echeance:"31 déc. 2024", statut:"payé",
    datePaiement:"29 déc. 2024", methode:"Express Union", ref:"EU241229BM07",
  },
];

/* ─── LOYERS — VUE BAILLEUR ────────────────────────── */
const LOYERS_BAILLEUR = [
  {
    id:"B1", locataire:"Kamga P.", logement:"Studio Ndokoti",
    montant:220000, echeance:"31 mars 2025", statut:"en_attente",
    joursRestants: DAYS_LEFT, rappelEnvoye: false,
  },
  {
    id:"B2", locataire:"Nguema A.", logement:"Appart. Bonapriso Neuf",
    montant:580000, echeance:"31 mars 2025", statut:"payé",
    datePaiement:"20 mars 2025", methode:"MTN Mobile Money", ref:"MTN250320NG55",
  },
  {
    id:"B3", locataire:"Mballa T.", logement:"Villa Bafoussam Hills",
    montant:750000, echeance:"31 mars 2025", statut:"en_retard",
    joursRestants:-3, rappelEnvoye: true,
  },
  {
    id:"B4", locataire:"Kamga P.", logement:"Studio Ndokoti",
    montant:220000, echeance:"28 fév. 2025", statut:"payé",
    datePaiement:"26 fév. 2025", methode:"Orange Money", ref:"OM250226KP12",
  },
  {
    id:"B5", locataire:"Mballa T.", logement:"Villa Bafoussam Hills",
    montant:750000, echeance:"28 fév. 2025", statut:"payé",
    datePaiement:"27 fév. 2025", methode:"Virement bancaire", ref:"VIR250227MT88",
  },
];

/* ─── CONVERSATIONS ────────────────────────────────
   4 conversations avec messages
─────────────────────────────────────────────────── */
const CONVERSATIONS_DATA = [
  {
    id:"C1", role:"locataire",
    contact:"Ekwalla M.", contactRole:"Bailleur",
    logement:"Appartement Bonamoussadi",
    avatar:"E", avatarBg:"#6366F1",
    photo:"https://i.pravatar.cc/80?u=ekwallam",
    lastMsg:"Bonjour, tout est prêt pour votre arrivée demain.",
    lastTime:"10:42", unread:2, blocked:false,
    messages:[
      {id:1, from:"them", text:"Bonjour, avez-vous bien reçu la confirmation de votre réservation ?", time:"09:15"},
      {id:2, from:"me",   text:"Oui merci, tout est parfait !", time:"09:22"},
      {id:3, from:"them", text:"N'hésitez pas si vous avez des questions sur l'appartement.", time:"09:45"},
      {id:4, from:"me",   text:"Super ! Quelle est l'adresse exacte et le code de la porte ?", time:"10:10"},
      {id:5, from:"them", text:"L'adresse est Rue Ivy, Bonamoussadi. Code porte : 4521.", time:"10:38"},
      {id:6, from:"them", text:"Bonjour, tout est prêt pour votre arrivée demain.", time:"10:42"},
    ],
  },
  {
    id:"C2", role:"locataire",
    contact:"Atangana B.", contactRole:"Bailleur",
    logement:"Villa Balnéaire Kribi",
    avatar:"A", avatarBg:"#0EA5E9",
    photo:"https://i.pravatar.cc/80?u=atanganab",
    lastMsg:"Le ménage sera fait avant votre arrivée",
    lastTime:"Hier", unread:0, blocked:false,
    messages:[
      {id:1, from:"me",   text:"Bonjour, est-ce que la piscine sera disponible pendant notre séjour ?", time:"14:00"},
      {id:2, from:"them", text:"Absolument, elle est chauffée et accessible 24h/24.", time:"14:20"},
      {id:3, from:"me",   text:"Parfait, merci beaucoup !", time:"14:35"},
      {id:4, from:"them", text:"Le ménage sera fait avant votre arrivée", time:"15:00"},
    ],
  },
  {
    id:"C3", role:"bailleur",
    contact:"Kamga P.", contactRole:"Locataire",
    logement:"Studio Ndokoti",
    avatar:"K", avatarBg:"#F59E0B",
    photo:"https://i.pravatar.cc/80?u=kamgap",
    lastMsg:"D'accord, je procède au paiement ce soir.",
    lastTime:"Lun.", unread:0, blocked:false,
    messages:[
      {id:1, from:"them", text:"Bonjour, est-il possible de décaler l'échéance de 3 jours ?", time:"08:00"},
      {id:2, from:"me",   text:"Bonjour Kamga, malheureusement l'échéance est fixée au 31.", time:"08:30"},
      {id:3, from:"them", text:"Je comprends, je ferai le nécessaire.", time:"09:00"},
      {id:4, from:"them", text:"D'accord, je procède au paiement ce soir.", time:"09:15"},
    ],
  },
  {
    id:"C4", role:"bailleur",
    contact:"Mballa T.", contactRole:"Locataire",
    logement:"Villa Bafoussam Hills",
    avatar:"M", avatarBg:"#EF4444",
    photo:"https://i.pravatar.cc/80?u=mballat",
    lastMsg:"Je ne peux pas payer ce mois-ci.",
    lastTime:"Dim.", unread:1, blocked:false,
    messages:[
      {id:1, from:"them", text:"Bonjour, j'ai un souci financier ce mois.", time:"18:00"},
      {id:2, from:"me",   text:"Bonjour, le loyer reste dû à la date prévue.", time:"18:30"},
      {id:3, from:"them", text:"Je comprends mais la situation est difficile.", time:"19:00"},
      {id:4, from:"them", text:"Je ne peux pas payer ce mois-ci.", time:"20:00"},
    ],
  },
];

/* ─── BOOKINGS ─────────────────────────────────────
   4 bookings (active, upcoming, past)
─────────────────────────────────────────────────── */
const BOOKINGS = [
  {
    id:"R1", status:"active",
    title:"Appartement Bonamoussadi", type:"property",
    city:"Douala", zone:"Bonamoussadi",
    address:"Rue Ivy, Bonamoussadi, Douala",
    host:"Ekwalla M.", hostPhoto:"https://i.pravatar.cc/80?img=33",
    checkIn:"22 mars 2025", checkOut:"25 mars 2025",
    nights:3, price:35000,
    img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    lat:4.0667, lng:9.7500, ref:"BYR-2025-0322-A",
    amenities:["Climatisé","Parking","WiFi fibre"],
  },
  {
    id:"R2", status:"upcoming",
    title:"Villa Balnéaire Kribi", type:"property",
    city:"Kribi", zone:"Bord de mer",
    address:"Avenue de la Plage, Kribi",
    host:"Atangana B.", hostPhoto:"https://i.pravatar.cc/80?img=11",
    checkIn:"10 avr. 2025", checkOut:"14 avr. 2025",
    nights:4, price:75000,
    img:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    lat:2.9390, lng:9.9090, ref:"BYR-2025-0410-B",
    amenities:["Piscine","Vue mer","Terrasse"],
  },
  {
    id:"R3", status:"upcoming",
    title:"Toyota Land Cruiser 2022", type:"vehicle",
    city:"Douala", zone:"Akwa",
    address:"Agence Byer, Avenue de Gaulle, Akwa, Douala",
    host:"Mbarga C.", hostPhoto:"https://i.pravatar.cc/80?img=57",
    checkIn:"22 mars 2025", checkOut:"24 mars 2025",
    nights:2, price:55000,
    img:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    lat:4.0472, lng:9.6952, ref:"BYR-2025-0322-C",
    amenities:["4×4","GPS","Climatisé"],
  },
  {
    id:"R4", status:"past",
    title:"Penthouse Bastos", type:"property",
    city:"Yaoundé", zone:"Bastos",
    address:"Quartier Bastos, Yaoundé",
    host:"Fouda R.", hostPhoto:"https://i.pravatar.cc/80?img=14",
    checkIn:"1 fév. 2025", checkOut:"4 fév. 2025",
    nights:3, price:120000,
    img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    lat:3.8780, lng:11.5360, ref:"BYR-2025-0201-D",
    amenities:["Rooftop","Conciergerie","Smart TV"],
  },
];

/* ─── STATUS CONFIG ────────────────────────────────
   Booking status labels and colors
─────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  active:   { label:"En cours",   bg:"#F0FDF4", color:"#16A34A", dot:"#16A34A" },
  upcoming: { label:"À venir",    bg:"#EFF6FF", color:"#2563EB", dot:"#2563EB" },
  past:     { label:"Terminé",    bg:C.bg,      color:C.mid,     dot:C.light   },
};
