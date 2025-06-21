const ver = '0620sw';
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
        const textFiles = formData.getAll("textFiles");
        const htmlFiles = formData.getAll("htmlFiles");
        const images = formData.getAll("images");
        const cache = await caches.open(sharedDataCacheName);

        // Save each file as a separate cache entry
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
        .catch(() => {
          if (event.request.url.endsWith('/sw.js')) {
            return new Response(
              `/* Fallback: Service worker unavailable */`,
              { status: 503, headers: { 'Content-Type': 'application/javascript' } }
            );
          }
          return new Response(
            `<h1>Offline</h1><p>The requested resource <code>${event.request.url}</code> is unavailable.</p></body></html>`,
            { status: 503, headers: { 'Content-Type': 'text/html' } }
          );
        });
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