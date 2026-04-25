/* gen-icons.js
   Génère les PNG (any + maskable) à partir d'un SVG source.
   Maskable = padding plus large pour la safe zone Android (80% interne).
   Run: node scripts/gen-icons.js
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ICONS_DIR = path.join(__dirname, '..', 'icons');

// SVG "any" (canvas plein) — celui qui s'affiche dans le navigateur
const SVG_ANY = (size) => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="#FF5A5F"/>
  <path d="M${size * 0.302} ${size * 0.271}h${size * 0.224}a${size * 0.115} ${size * 0.115} 0 010 ${size * 0.229}H${size * 0.302}m0 0h${size * 0.24}a${size * 0.115} ${size * 0.115} 0 010 ${size * 0.229}H${size * 0.302}V${size * 0.271}z"
        stroke="white" stroke-width="${Math.round(size * 0.073)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
`);

// SVG "maskable" — Android crop l'icône en formes variables, on garde le logo dans
// la safe zone interne (~60% du canvas pour être tranquille).
// Le fond rouge prend tout, le logo "B" est centré et plus petit.
const SVG_MASKABLE = (size) => {
  const cx = size / 2;
  const cy = size / 2;
  const logo = size * 0.4; // 40% de l'icône → bien dans la safe zone
  const lx = cx - logo / 2;
  const ly = cy - logo / 2;
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
  <rect width="${size}" height="${size}" fill="#FF5A5F"/>
  <g transform="translate(${lx} ${ly})">
    <path d="M${logo * 0.18} ${logo * 0.1}h${logo * 0.42}a${logo * 0.21} ${logo * 0.21} 0 010 ${logo * 0.42}H${logo * 0.18}m0 0h${logo * 0.45}a${logo * 0.21} ${logo * 0.21} 0 010 ${logo * 0.42}H${logo * 0.18}V${logo * 0.1}z"
          stroke="white" stroke-width="${Math.round(logo * 0.13)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
</svg>
`);
};

const TARGETS = [
  { name: 'icon-192.png', size: 192, kind: 'any' },
  { name: 'icon-512.png', size: 512, kind: 'any' },
  { name: 'icon-maskable-192.png', size: 192, kind: 'maskable' },
  { name: 'icon-maskable-512.png', size: 512, kind: 'maskable' },
  { name: 'icon-1024.png', size: 1024, kind: 'any' },
];

(async () => {
  if (!fs.existsSync(ICONS_DIR)) fs.mkdirSync(ICONS_DIR, { recursive: true });
  for (const t of TARGETS) {
    const svg = t.kind === 'maskable' ? SVG_MASKABLE(t.size) : SVG_ANY(t.size);
    const outPath = path.join(ICONS_DIR, t.name);
    await sharp(svg).png({ compressionLevel: 9 }).toFile(outPath);
    const stat = fs.statSync(outPath);
    console.log(`✓ ${t.name} (${t.size}x${t.size}, ${t.kind}) → ${(stat.size / 1024).toFixed(1)} KB`);
  }
  console.log('Done.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
