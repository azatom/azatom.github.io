const ver = 'b';
const cacheName = `npCache-${ver}`;
const sharedDataCacheName = 'shared-data-cache';

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
          const sharedData = {
            text: formData.get('text') || '',
            title: formData.get('title') || '',
            url: formData.get('url') || '',
          };

          // Generate a unique ID for the shared data
          const sharedId = crypto.randomUUID();
          const sharedDataResponse = new Response(JSON.stringify(sharedData), {
            headers: { 'Content-Type': 'application/json' }
          });

          // Store the shared data in the cache
          const cache = await caches.open(sharedDataCacheName);
          await cache.put(new Request(`/shared-data/${sharedId}`), sharedDataResponse);

          // Redirect to the app with the sharedId in the URL
          const redirectUrl = new URL(url.pathname, url.origin);
          redirectUrl.searchParams.set('sharedId', sharedId);
          return Response.redirect(redirectUrl.toString(), 303);
        } catch (error) {
          console.error('Error handling POST request:', error);
          return new Response('Error processing shared data.', { status: 500 });
        }
      })()
    );
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html')
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).catch(() => caches.match('offline.html'));
        })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request)
          .then(async (networkResponse) => {
            if (networkResponse.ok && networkResponse.type === 'basic') {
              (await caches.open(cacheName)).put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(async () => caches.match(event.request));
      })
    );
  } else {
    event.respondWith(fetch(event.request).catch(async () => caches.match(event.request)));
  }
});

self.addEventListener('activate', (event) => {
  const whitelist = [cacheName, sharedDataCacheName];
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