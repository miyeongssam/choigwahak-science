/* 최과학 과학 앱 서비스워커
   - 처음 설치할 때는 껍데기(홈 · 공통 파일 · 아이콘)만 저장
   - 각 앱과 문제 파일은 처음 열 때 저장 → 그다음부터 인터넷 없이도 열림
   - 항상 최신 내용을 먼저 받아 오고(3초 안에 응답이 없으면 저장본 사용)
   - 앱 기능을 바꾼 뒤에는 VERSION 숫자만 올리면 됨 */
const VERSION = "v25";
const CACHE = "choisci-science-" + VERSION;
const SHELL = ["./", "./index.html", "./apps.json", "./manifest.webmanifest",
  "./common/common.css", "./common/common.js", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("choisci-science-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = req.url.split("?")[0].split("#")[0];
    // 깃허브의 10분 저장을 건너뛰고 항상 새 파일을 받아 옴(고친 내용이 바로 보이게)
    const net = fetch(req.url, { cache: "no-cache", credentials: "same-origin" }).then(res => { if (res.ok) cache.put(key, res.clone()); return res; });
    const timeout = new Promise(r => setTimeout(r, 3000));
    try {
      const res = await Promise.race([net, timeout]);
      if (res) return res;
    } catch (err) {}
    const cached = await cache.match(key) || (req.mode === "navigate" ? await cache.match(new URL("./", self.registration.scope).href) : null);
    if (cached) return cached;
    return net;
  })());
});
