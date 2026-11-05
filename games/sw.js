// Football games app service worker.
// Pages and data: network first, so every update shows up the next time the app opens; the cached copy is used offline.
// Photos, icons and fonts: cache first (they never change under the same name).
const CACHE = 'games-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './handoff/', './handoff/index.html', './handoff/data.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const static_ = /\.(webp|png|jpg|svg|woff2?)$/.test(url.pathname) || url.host.includes('fonts.g');
  if (static_) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(fetch(req, {cache: 'no-cache'}).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html'))));
});
