/* ═══════════════════════════════════════════════════
   Byer — Service Worker
   Cache-first strategy for offline support
   ═══════════════════════════════════════════════════ */

const CACHE_NAME = 'byer-v1';

const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/global.css',
  '/js/config.js',
  '/js/data.js',
  '/js/styles.js',
  '/js/components.js',
  '/js/auth.js',
  '/js/home.js',
  '/js/detail.js',
  '/js/gallery.js',
  '/js/trips.js',
  '/js/messages.js',
  '/js/profile.js',
  '/js/rent.js',
  '/js/sheets.js',
  '/js/app.js',
  '/js/main.js',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
