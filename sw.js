/* ═══════════════════════════════════════════════════
   Byer — Service Worker v17
   Network-first pour HTML/JS/CSS (bundle.js, index, css)
   Cache-first pour les libs et icônes (rarement modifiés)
   ═══════════════════════════════════════════════════ */

const CACHE_NAME = 'byer-v33';

// Chemins RELATIFS au scope du SW (compatible GitHub Pages sous-dossier /byer/)
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/global.css',
  './bundle.js',
  './lib/react.min.js',
  './lib/react-dom.min.js',
  './lib/supabase.min.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
];

/* ── INSTALL : pré-cache initial ── */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* ── ACTIVATE : nettoyage des anciens caches ── */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ── FETCH : stratégie hybride ──
   - HTML / JS / CSS : NETWORK-FIRST (tente le réseau, fallback cache si offline)
     → garantit que le dernier code est servi quand l'utilisateur est en ligne.
   - Autres assets    : CACHE-FIRST (rapide, fallback réseau si absent)
*/
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isAppShell = /\.(html|js|css)$/i.test(url.pathname)
    || url.pathname === '/'
    || url.pathname === '/index.html';

  if (isAppShell) {
    // Network-first
    e.respondWith(
      fetch(req)
        .then((res) => {
          // Met à jour le cache avec la version fraîche
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(()=>{});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
  } else {
    // Cache-first pour les libs, icônes, images
    e.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(()=>{});
        return res;
      }))
    );
  }
});

/* ── MESSAGE : permet de forcer un skipWaiting depuis l'app ── */
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
