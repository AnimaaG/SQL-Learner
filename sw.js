const CACHE = "sqlquest-v3"; // 

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
];

// 1. Install new assets and force the waiting service worker to activate immediately
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

// 2. Clear out old caches automatically and take control of all open pages
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE) {
            console.log("Deleting old cache:", key);
            return caches.delete(key); // Deletes sqlquest-v1, sqlquest-v2, etc.
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch requests from cache, falling back to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
