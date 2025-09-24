const ver = "1.3";
const cacheName = `cache-v${ver}`;
const urlsToCache = [
    '.',
    './manifest.json',
    './192x192.png',
    './favicon.ico',
];
const urlAlias = { "./": ".", "./index.html": "." };
self.addEventListener('install', (event) => event.waitUntil(
    caches.open(cacheName)
        .then(cache => cache.addAll(urlsToCache))
        .then(() => self.skipWaiting())
));
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(Promise.all([
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames
                    .filter((name) => !cacheWhitelist.includes(name))
                    .map((name) => caches.delete(name))
            )),
        self.clients.claim()
    ]));
});
self.addEventListener('fetch', (event) => {
    const request = getCacheRequest(event.request);
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => cachedResponse || fetchAndCache(request, event.request))
            .catch(() => handleOffline(request, event.request))
    );
});
function getCacheRequest(request) {
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return request;
    const aliasedUrl = urlAlias[url.pathname.replace(/^\//, './')];
    return aliasedUrl
        ? new Request(aliasedUrl, { method: request.method, headers: request.headers })
        : request;
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
        : caches.match(cacheRequest);
}

self.addEventListener('message', (event) => event.data.action === 'skipWaiting' && self.skipWaiting());
new BroadcastChannel("main").onmessage = ({ data }) => {
    if (data.q === "ver") {
        const chan = new BroadcastChannel(data.respondAt);
        chan.postMessage(ver);
        chan.close();
    }
};
