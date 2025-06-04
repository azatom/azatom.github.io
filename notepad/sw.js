const ver = 'C';
const cacheName = `npCache-${ver}`;

const urlsToCache = [
  './',
  './index.html',
  './offline.html',
  './sw.js',
  './manifest.json',
  './192x192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === 'POST' && url.pathname.endsWith('/index.html')) {
    event.respondWith(
      (async () => {
        try {
          const formData = await event.request.formData();
          const shared = {
            text: formData.get('text') || '',
            title: formData.get('title') || '',
            url: formData.get('url') || '',
            ver: ver
          };

          const client = await self.clients.get(event.clientId);
          if (client) {
            client.postMessage({ type: 'shared', formData: formData, data: shared, client: client });
          }

          return Response.redirect('./index.html', 303);
        } catch (error) {
          return new Response('Error processing shared data.', { status: 500 });
        }
      })()
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request)
          .then(async (networkResponse) => {
            (await caches.open(cacheName)).put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(async () =>
            event.request.mode === 'navigate' ?
              caches.match('offline.html') :
              caches.match(event.request)
          );
      })
    );
  } else {
    event.respondWith(fetch(event.request).catch(async () => caches.match(event.request)));
  }
});

self.addEventListener('activate', (event) => {
  const whitelist = [cacheName];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(cacheName => !whitelist.includes(cacheName))
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});