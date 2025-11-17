const ver = '1.0.16';
const cacheName = `cache-${ver}`;
const urlsToCache = [
    '.',
    './192x192.png',
    './favicon.ico',
    './manifest.json',
];
const urlAlias = { "./": ".", "./index.html": "." };

const chSw = new BroadcastChannel("chSw");
const console = {};
console.log = (...a) => chSw.postMessage(a);

self.addEventListener('install', (event) => event.waitUntil(
    caches.open(cacheName)
        .then(cache => cache.addAll(urlsToCache))
        .then(() => self.skipWaiting())
));
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(caches.keys()
        .then((cacheNames) => Promise.all(
            cacheNames
                .filter((name) => !cacheWhitelist.includes(name))
                .map((name) => caches.delete(name))
        ))
        .then(self.clients.claim())
    );
});
self.addEventListener('fetch', (event) => {
    const request = getCacheRequest(event);
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => cachedResponse || fetchAndCache(request, event.request))
            .catch(() => handleOffline(request, event.request))
    );
});

self.addEventListener('message', (event) => {
    event.data.action === 'skipWaiting' && self.skipWaiting();
    console.log('sw', event.data);
});

new BroadcastChannel("chClient").onmessage = ({ data }) => {
    if (data.q === "ver") {
        const chan = new BroadcastChannel(data.respondAt);
        chan.postMessage(ver);
        chan.close();
    }
};

function getCacheRequest(event) {
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return event.request;
    const aliasPathname = urlAlias[url.pathname.replace(/^\//, './')];
    return aliasPathname
        ? new Request(aliasPathname, { method: event.request.method, headers: event.request.headers })
        : event.request;
}
async function fetchAndCache(cacheRequest, originalRequest) {
    const networkResponse = await fetch(originalRequest);
    if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        await cache.put(originalRequest, networkResponse.clone());
    }
    return networkResponse;
}
function handleOffline(cacheRequest, originalRequest) {
    return originalRequest.mode === 'navigate'
        ? new Response(`Sorry...Need...Net... ${originalRequest.url}`, { headers: { 'Content-Type': 'text/plain' } })
        : caches.match(originalRequest.url, cacheRequest.url);
}

self.addEventListener('push', event => {
    console.log('Push event:', event);
    const data = event.data ? event.data.text() : 'No payload';
    event.waitUntil(
        self.registration.showNotification('PushStopwatch', {
            body: data,
            icon: './192x192.png'
        })
    );
});
