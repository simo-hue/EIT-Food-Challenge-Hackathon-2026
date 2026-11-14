// FridgeMate offline cache. Bump VERSION whenever you change any file,
// so phones that already opened the site fetch the new copy.
const VERSION = "fridgemate-v1";
const FILES = [
  "./", "index.html", "base.css", "site.css",
  "app/", "app/index.html", "app/app.css", "app/app.js", "app/data.js", "app/icons.js", "app/manifest.webmanifest",
  "assets/fonts/bricolage-grotesque.woff2",
  "assets/hero.webp", "assets/problem.webp", "assets/how-it-works.webp", "assets/app-screens.webp", "assets/price.webp", "assets/bins.webp",
  "assets/favicon.png", "assets/apple-touch-icon.png", "assets/icon-192.png", "assets/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Serve from cache at once, refresh the cache in the background.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const hit = await cache.match(req, { ignoreSearch: true });
      const net = fetch(req).then((res) => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })
  );
});
