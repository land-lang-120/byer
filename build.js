/* Byer — Build Script
   Concatenates all JS modules into a single bundle for Babel standalone.
   Run: node build.js
*/
const fs = require('fs');
const path = require('path');

const FILES = [
  'js/config.js',
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
  'js/app.js',
  'js/main.js',
];

let bundle = '/* Byer — Auto-generated bundle. Do not edit manually. */\n\n';

for (const file of FILES) {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
  bundle += `\n/* ═══ ${file} ═══ */\n${content}\n`;
}

fs.writeFileSync(path.join(__dirname, 'bundle.js'), bundle, 'utf-8');
console.log(`✓ Bundle created (${FILES.length} files → bundle.js)`);
