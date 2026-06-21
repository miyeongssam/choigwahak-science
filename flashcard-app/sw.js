/* 최과학 암기 플래시카드 - Service Worker
   앱 껍데기는 캐시 우선, 문제 데이터(data/*.json)는 네트워크 우선으로
   매달 GitHub 업데이트 시 자동 반영되도록 함. */
const VERSION = 'v1.0.0';
const SHELL_CACHE = 'shell-' + VERSION;
const DATA_CACHE = 'data-' + VERSION;

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== SHELL_CACHE && k !== DATA_CACHE).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 문제 데이터: 네트워크 우선 (최신 내용 우선), 실패 시 캐시
  if (url.pathname.includes('/data/')) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(DATA_CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // 앱 껍데기: 캐시 우선, 없으면 네트워크
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(SHELL_CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => cached))
  );
});
