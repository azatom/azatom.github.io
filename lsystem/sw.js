// dummy sw: self.addEventListener("fetch", (e) =>e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));

const CACHE_NAME = 'my-site-v1';

const URLs_TO_CACHE = [
  './',
  './lsystem.svg',
  './README.md',
  './favicon.ico',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLs_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  console.log('fetch:::', event.request.url);
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;
        console.log('notcached:::', event.request.url);
        return fetch(event.request)
          .then(networkResponse => {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
            return networkResponse;
          })
          .catch(() => caches.match(event.request));
      })
  );
});