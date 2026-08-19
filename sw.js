const CACHE = 'liftops-v9';
const ASSETS = ['./','./index.html','./styles.css','./app.js','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
));

self.addEventListener('activate', e => e.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('liftops-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(cache => cache.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      const copy = resp.clone();
      cache.put(e.request, copy);
      return resp;
    }).catch(() => cache.match('./index.html'))))
  );
});
