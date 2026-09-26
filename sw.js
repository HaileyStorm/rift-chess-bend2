/* A separate scope and cache from the production Three.js game. */
const CACHE = 'rift-bend-v1-316b07717192e7d6d5bb';
const ASSETS = ["./","./build.json","./Bend-Apache-2.0.txt","./Rift-Atlas-Sans-OFL.txt","./THIRD_PARTY_NOTICES.txt","./assets/LICENSES.md","./assets/observatory-astral.rga","./assets/observatory-stone.rga","./assets/pieces-fast-0.rga","./assets/pieces-fast-1.rga","./assets/pieces-fast-2.rga","./assets/rift-observatory-font.rga","./host-w93bdan1.js","./index.html","./sprite-helper-3s6s2y7r.js","./style-01f82ab8949f.css","./worker-libs/bot/bend-77d80270fe5ce1c4.program.mjs","./worker-libs/bot/bend-77d80270fe5ce1c4.runtime.mjs","./worker-libs/bot/bend-77d80270fe5ce1c4.worker.mjs","./worker-libs/bot/index.mjs","./worker-libs/bot/manifest.json","./worker-v2-pabd88n6.js"];
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
