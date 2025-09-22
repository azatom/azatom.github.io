const ver = 'v3';
const cacheName = `cache-${ver}`;

const urlsToCache = [
  './index.html',
  './sw.js',
  './manifest.json',
  './192x192.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

new BroadcastChannel("main").onmessage = ({ data }) => {
  if (data.ver === "ver") {
    const chan = new BroadcastChannel(data.respondAt);
    chan.postMessage(ver);
    chan.close();
  }
};

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then(async (networkResponse) => {
            const cache = await caches.open(cacheName);
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(async () => event.request.mode === 'navigate'
            ? new Response("you should not see this", { headers: { 'Content-Type': 'text/plain' } })
            : caches.match(event.request)
          );
      })
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(async () => {
        return caches.match(event.request);
      })
    );
  }
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
