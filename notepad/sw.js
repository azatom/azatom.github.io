const ver = '1';
const cacheName = `cache-${ver}`;
const urlsToCache = [
    '.',
    './192x192.png',
    './favicon.ico',
    './manifest.json',
];
const urlAlias = { "./": ".", "./index.html": "." };
const sharedDataCacheName = 'shared-data-cache';
new BroadcastChannel("main").onmessage = ({ data }) => {
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
        .then(self.clients.claim())
    );
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
        console.log('fetch event.request.mode ' + event.request.mode);
        handleCrossOriginRequest(event);
    }
});

async function handlePostRequest(event, redirectUrl) {
    event.respondWith(
        (async () => {
            try {
                const formData = await event.request.formData();
                const textFiles = formData.getAll("textFiles");
                const htmlFiles = formData.getAll("htmlFiles");
                const images = formData.getAll("images");
                const cache = await caches.open(sharedDataCacheName);

                for (const [i, file] of [...textFiles, ...htmlFiles, ...images].entries()) {
                    if (file && file.name) {
                        file.cid = i;
                        const fileRequest = new Request(`/shared-data/file/${i}`);
                        const fileResponse = new Response(file, { headers: { 'Content-Type': file.type || 'application/octet-stream' } });
                        await cache.put(fileRequest, fileResponse);
                    }
                }

                const mapFiles = (files) => Array.from(files).map(file => ({
                    cid: file.cid,
                    name: file.name,
                    type: file.type,
                }));

                const sharedData = {
                    text: formData.get('text') || '',
                    title: formData.get('title') || '',
                    url: formData.get('url') || '',
                    textFiles: mapFiles(textFiles),
                    htmlFiles: mapFiles(htmlFiles),
                    images: mapFiles(images),
                    etc: `texts: ${textFiles.length}\nhtmls: ${htmlFiles.length}\nimages: ${images.length}`
                };
                const sharedId = crypto.randomUUID();
                const sharedDataResponse = new Response(JSON.stringify(sharedData), {
                    headers: { 'Content-Type': 'application/json' }
                });
                await cache.put(new Request(`/shared-data/${sharedId}`), sharedDataResponse);
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
        caches.open(cacheName).then(cache =>
            cache.match(new Request(self.registration.scope + '.'))
                .then((cachedResponse) => cachedResponse ||
                    fetch(event.request).catch(e => e503(
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
        caches.match(cacheRequest).then((cachedResponse) => cachedResponse || fetch(cacheRequest)
            .then(async (networkResponse) => {
                if (networkResponse.ok && networkResponse.type === 'basic') {
                    (await caches.open(cacheName)).put(cacheRequest, networkResponse.clone());
                }
                return networkResponse;
            })
            .catch(() => new Response(
                `<h1>Offline</h1><p>The requested resource <code>${cacheRequest.url}</code> is unavailable.</p></body></html>`,
                { status: 503, headers: { 'Content-Type': 'text/html' } }
            ))
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
