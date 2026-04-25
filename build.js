/* Byer — Build Script
   Transpile JSX → JS pur via Babel, puis concatène en bundle.js
   → Aucun Babel runtime côté client (le mobile ne tient pas le coup sinon).
   Run: node build.js
*/
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const FILES = [
  'js/config.js',
  'js/supabase-client.js',
  'js/data.js',
  'js/styles.js',
  'js/components.js',
  'js/auth.js',
  'js/home.js',
  'js/detail.js',
  'js/gallery.js',
  'js/trips.js',
  'js/messages.js',
  'js/profile.js',
  'js/rent.js',
  'js/sheets.js',
  'js/qrcode.js',
  'js/owner-dashboard.js',
  'js/technicians.js',
  'js/professionals.js',
  'js/boost.js',
  'js/paywall.js',
  'js/notifications.js',
  'js/publish.js',
  'js/settings.js',
  'js/edit-profile.js',
  'js/booking.js',
  'js/history.js',
  'js/legal.js',
  'js/app.js',
  'js/main.js',
];

const BABEL_OPTS = {
  presets: [
    ['@babel/preset-env', { targets: '> 0.5%, last 2 versions, Firefox ESR, not dead' }],
    ['@babel/preset-react', { runtime: 'classic' }],
  ],
  babelrc: false,
  configFile: false,
  sourceMaps: false,
  compact: false,
};

let bundle = '/* Byer — Auto-generated bundle (Babel pre-compiled). Do not edit manually. */\n\n';

const t0 = Date.now();
for (const file of FILES) {
  const src = fs.readFileSync(path.join(__dirname, file), 'utf-8');
  let out;
  try {
    const res = babel.transformSync(src, { ...BABEL_OPTS, filename: file });
    out = res.code;
  } catch (err) {
    console.error(`✗ Babel a échoué sur ${file}:\n${err.message}`);
    process.exit(1);
  }
  bundle += `\n/* ═══ ${file} ═══ */\n${out}\n`;
}

fs.writeFileSync(path.join(__dirname, 'bundle.js'), bundle, 'utf-8');
const sizeKB = (Buffer.byteLength(bundle, 'utf-8') / 1024).toFixed(1);
console.log(`✓ Bundle créé : ${FILES.length} fichiers → bundle.js (${sizeKB} KB) en ${Date.now() - t0} ms`);
