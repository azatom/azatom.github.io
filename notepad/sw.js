const ver = '2';
const cacheName = `npCache-${ver}`;
const sharedDataCacheName = 'shared-data-cache';

const urlsToCache = [
  './',
  './index.html',
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
    handlePostRequest(event, url);
  } else if (event.request.mode === 'navigate') {
    handleNavigateRequest(event);
  } else if (url.origin === self.location.origin) {
    handleSameOriginRequest(event);
  } else {
    handleCrossOriginRequest(event);
  }
});

async function handlePostRequest(event, url) {
  event.respondWith(
    (async () => {
      try {
        const formData = await event.request.formData();
        const sharedData = {
          text: formData.get('text') || '',
          title: formData.get('title') || '',
          url: formData.get('url') || '',
        };
        const sharedId = crypto.randomUUID();
        const sharedDataResponse = new Response(JSON.stringify(sharedData), {
          headers: { 'Content-Type': 'application/json' }
        });
        const cache = await caches.open(sharedDataCacheName);
        await cache.put(new Request(`/shared-data/${sharedId}`), sharedDataResponse);
        const redirectUrl = new URL(url.pathname, url.origin);
        redirectUrl.searchParams.set('sharedId', sharedId);
        return Response.redirect(redirectUrl.toString(), 303);
      } catch (e) {
        return e500(e);
      }
    })()
  );
}

function handleNavigateRequest(event) {
  event.respondWith(
    caches.match('./index.html')
      .then((cachedResponse) => cachedResponse || fetch(event.request).catch(e503))
  );
}

function handleSameOriginRequest(event) {
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
        .catch(e503);
    })
  );
}

function handleCrossOriginRequest(event) {
  event.respondWith(fetch(event.request).catch(e503));
}

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

function e503(e) { return new Response(`Error 503: Resource not available. ${e}`, { status: 503 }); }
function e500(e) { return new Response(`Error 500: Processing shared data. ${e}`, { status: 500 }); }