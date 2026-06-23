const CACHE = 'tonggwa-flashcard-v2';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const req = e.request; const url = new URL(req.url);
  if (req.mode === 'navigate' || req.destination === 'document') { e.respondWith(fetch(req).catch(() => caches.match('./index.html'))); return; }
  if (url.pathname.endsWith('.json') || url.search) { e.respondWith(fetch(req).then(r => { const cp=r.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); return r; }).catch(() => caches.match(req))); return; }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
