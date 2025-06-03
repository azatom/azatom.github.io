const ver = 'v.js0603c';
const cacheName = `np-cache-${ver}`;

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

self.addEventListener('message', (event) => {
  event.data.action === 'skipWaiting' && self.skipWaiting();
  event.data.type === 'getSharedData' && event.source.postMessage({ sharedData: 'example data' });
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === 'POST') {
    setTimeout(()=>{
    const chan = new BroadcastChannel("foo");
    chan.postMessage(event.request);
    chan.close();
    event.respondWith(handleShare(event.request));
    },4000);
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

async function handleShare(request) {
  const formData = await request.formData();
  const text = formData.get('text') || '';
  const title = formData.get('title') || '';
  const url = formData.get('url') || '';
  return Response.redirect(`./index.html?shared=true&title=${encodeURIComponent(title)}&text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, 303);
}