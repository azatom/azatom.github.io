const ver = '1';
const cacheName = `cache-${ver}`;
const urlsToCache = [
    '.',
    './192x192.png',
    './cdn.js',
    './favicon.ico',
    './manifest.json',
    './saves.js',
    './script.js',
    './style.css',
    // cdn.js contains:
    // 'https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js',
    // 'https://cdn.jsdelivr.net/npm/jquery-ui@1/dist/jquery-ui.min.js',
    // 'https://cdn.jsdelivr.net/npm/jquery-ui-touch-punch@0.2.3/jquery.ui.touch-punch.min.js',
];
const urlAlias = { "./": ".", "./index.html": "." };
const sharedDataCacheName = 'shared-data-cache';
new BroadcastChannel("chClient").onmessage = ({ data }) => {
    if (data.ver === "ver") {
        const chan = new BroadcastChannel(data.respondAt);
        chan.postMessage(ver);
        chan.close();
    }
};

self.addEventListener('install', (event) => event.waitUntil(
    caches.open(cacheName)
        .then(cache => cache.addAll(urlsToCache))
        .then(() => self.skipWaiting())
));
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [cacheName, sharedDataCacheName];
    event.waitUntil(caches.keys()
        .then((cacheNames) => Promise.all(
            cacheNames
                .filter((name) => !cacheWhitelist.includes(name))
                .map((name) => caches.delete(name))
        ))
        //.then(self.clients.claim())
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const aliasPathname = urlAlias[url.pathname.replace(/^\//, './')];
    if (event.request.method === 'POST' && aliasPathname === '.') {
        handlePostRequest(event, new URL(aliasPathname, url.origin));
    } else if (url.origin === self.location.origin) {
        handleSameOriginRequest(event);
    } else if (event.request.mode === 'navigate') {
        handleNavigateRequest(event);
    } else {
        alert('fetch event.request.mode ' + event.request.mode);
        event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    }
});

async function handlePostRequest(event, redirectUrl) {
    event.respondWith(
        (async () => new Response(
            `<h1>Que?</h1><p>The requested resource <code>${event.request.url}</code> is unavailable.</p></body></html>`,
            { status: 503, headers: { 'Content-Type': 'text/html' } }
        ))
    );
}

function handleNavigateRequest(event) {
    event.respondWith(
        caches.open(cacheName).then(cache =>
            cache.match(new Request(self.registration.scope + 'index.html'))
                .then((cachedResponse) => cachedResponse ||
                    fetch(event.request).catch(e => e503(
                        'somethingindexjtml \n' +
                        'url: ' + event.request.url + ' \n' +
                        'scope: ' + self.registration.scope + ' \n ' +
                        e))
                )
        )
    );
}

function handleSameOriginRequest(event) {
    const cacheRequest = getCacheRequest(event);
    event.respondWith(
        caches.match(cacheRequest)
            .then(async (cachedResponse) => cachedResponse || fetch(event.request)
            .then(async (networkResponse) => {
                const cache = await caches.open(cacheName);
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
            })
            .catch(async () => event.request.mode === 'navigate'
                ? new Response("Sorry...Need...Net...\n" + event.request.url, { headers: { 'Content-Type': 'text/plain' } })
                : caches.match(cacheRequest)
            )
        )
    );
}

function handleCrossOriginRequest(event) { event.respondWith(fetch(event.request).catch(e503)); }

function e503(e) { return new Response(`Error 503: Resource not available. ${e}`, { status: 503 }); }
function e500(e) { return new Response(`Error 500: Processing shared data. ${e}`, { status: 500 }); }

function getCacheRequest(event) {
    const url = new URL(event.request.url);
    const aliasPathname = urlAlias[url.pathname.replace(/^\//, './')];
    return aliasPathname
        ? new Request(aliasPathname, { method: event.request.method, headers: event.request.headers })
        : event.request;
}

self.addEventListener('message', (event) => event.data.action === 'skipWaiting' && self.skipWaiting());

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
