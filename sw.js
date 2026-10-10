/* Kill switch. This replaces the old caching worker.
   It unregisters itself and clears every cache, so a browser that already
   installed the previous worker stops serving the withdrawn application. */
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) await caches.delete(k);
    await self.clients.claim();
    await self.registration.unregister();
    for (const c of await self.clients.matchAll({ type: "window" })) c.navigate(c.url);
  })());
});
self.addEventListener("fetch", () => {});   // never serve anything from cache again
