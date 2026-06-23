const CACHE = 'tonggwa-flashcard-v1';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  // 앱 화면(HTML): 네트워크 우선 → 최신 앱, 오프라인이면 캐시
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }
  // 카드 데이터(JSON, ?쿼리): 네트워크 우선 → 최신 카드, 오프라인이면 캐시
  if (url.pathname.endsWith('.json') || url.search) {
    e.respondWith(fetch(req).then(resp => {
      const cp = resp.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return resp;
    }).catch(() => caches.match(req)));
    return;
  }
  // 아이콘 등 정적 파일: 캐시 우선
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
