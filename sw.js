/* A separate scope and cache from the production Three.js game. */
const CACHE = 'rift-bend-v1-361b9895746876a71757';
const ASSETS = ["./","./build.json","./index.html","./host-d0e3dkvk.js","./worker-7sefw2hv.js","./style-4cc0cbc1299f.css","./THIRD_PARTY_NOTICES.txt","./Bend-Apache-2.0.txt"];
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await cache.addAll(ASSETS.map(file => new Request(new URL(file, self.location.href), { cache: 'reload' })));
  await self.skipWaiting();
})()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const name of await caches.keys()) if (name.startsWith('rift-bend-v1-') && name !== CACHE) await caches.delete(name);
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (event.request.mode === 'navigate') {
      try { return await fetch(event.request); }
      catch { return await cache.match(new URL('./index.html', self.location.href)) || Response.error(); }
    }
    return await cache.match(event.request) || fetch(event.request);
  })());
});
