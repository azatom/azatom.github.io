const cacheName = `cache-v1`;
const urlsToCache = [
    '.',
    './sw.js',
    './manifest.json',
    './192x192.png',
    './favicon.ico',
];
const urlAlias = { "./": ".", "./index.html": "." };
self.addEventListener('install', (event) => event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(urlsToCache))));
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.origin === self.location.origin) {
        const ali = urlAlias[url.pathname.replace(/^\//, './')];
        const cacheRequest = ali
            ? new Request(ali, { method: event.request.method, headers: event.request.headers })
            : event.request;
        event.respondWith(
            caches.match(cacheRequest).then(async (cachedResponse) =>
                cachedResponse ||
                fetch(event.request).then(async (networkResponse) => {
                    const cache = await caches.open(cacheName);
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                }).catch(async () => event.request.mode === 'navigate'
                    ? new Response("Sorry...Need...Net...\n" + event.request.url, { headers: { 'Content-Type': 'text/plain' } })
                    : caches.match(cacheRequest)
                )
            )
        );
    } else {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
    }
});
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => cacheWhitelist.includes(cacheName) || caches.delete(cacheName))
            );
        })
    );
    self.clients.claim();
});
