// sw.js - app-shell + offline + S-W-R + version hashing + debug logging
const VER = '1'; // bump manually if needed
const ROOT = '/lsystem';

// assets that form the "app shell" and offline page
const urlsToCache = [
  './',
  './index.html',
  // './offline.html',
  './favicon.ico',
  './favicon.svg',
  './192x192.png',
  './manifest.json',
  './lsystem.svg',      // important: keep SVG in app shell
  './README.md',
];

// simple deterministic string hash (fast and synchronous)
function hashString(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(36);
}

// computed cache name with hash of asset list + VER
const CACHE_HASH = hashString(VER + '|' + urlsToCache.join('|'));
const CACHE_NAME = `cache-${VER}-${CACHE_HASH}`;
const DATA_CACHE = `${ROOT}-data-cache-${CACHE_HASH}`;

// toggle debugging logs
const DEBUG = true;
function log(...args) { if (DEBUG) console.log('[SW]', ...args); }

// BroadcastChannel for version queries (kept from your original)
new BroadcastChannel("chClient").onmessage = ({ data }) => {
  if (data && data.ver === "ver") {
    const chan = new BroadcastChannel(data.respondAt);
    chan.postMessage(VER);
    chan.close();
  }
};

// ---------- INSTALL: populate app-shell (cache-first) ----------
self.addEventListener('install', event => {
  log('install -> caching app shell:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        // Use addAll so fetches happen in a batch and fail early if something's wrong.
        await cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// ---------- ACTIVATE: clean up old caches ----------
self.addEventListener('activate', event => {
  log('activate -> claim & cleanup');
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME && k.indexOf(ROOT) !== 0 ? true : k !== CACHE_NAME && k.indexOf(`${ROOT}-data-cache`) !== 0 && k !== DATA_CACHE)
          .map(k => {
            log('deleting old cache:', k);
            return caches.delete(k);
          })
    ))
  );
  self.clients.claim();
});

// ---------- FETCH: routing & strategies ----------
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Short-circuit for POSTs (keep your original behavior)
  if (req.method === 'POST') {
    // simple reply for unsupported POSTs to app shell root
    if (url.pathname === ROOT || url.pathname === `${ROOT}/`) {
      event.respondWith(new Response('POST not supported here', { status: 503, headers: { 'Content-Type': 'text/plain' }}));
      return;
    }
  }

  // Navigation requests -> App shell: try cache, then network, then offline page
  if (req.mode === 'navigate') {
    event.respondWith(handleNavigate(req));
    return;
  }

  // Same-origin static resources -> Stale-While-Revalidate (fast cached response, background update)
  if (url.origin === location.origin) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // Cross-origin -> Network-first, fallback to cache by URL
  event.respondWith(networkFirstCrossOrigin(req));
});

// ------------------ HANDLERS ------------------

async function handleNavigate(req) {
  const cache = await caches.open(CACHE_NAME);
  // Key app-shell entry is './' or './index.html' – prefer index.html in the cache
  const cachedIndex = await cache.match('./index.html') || await cache.match('./');

  if (cachedIndex) {
    log('serve navigation from cache (app shell)');
    return cachedIndex;
  }

  // network attempt, cache if successful
  try {
    const networkResp = await fetch(req);
    if (networkResp && networkResp.ok) {
      cache.put('./index.html', networkResp.clone()).catch(e => log('cache put index failed', e));
      return networkResp;
    }
  } catch (e) {
    log('navigate network failed:', e);
  }

  // final fallback: offline page from cache
  //const offline = await cache.match('./offline.html');
  const offline = await cache.match('./');
  if (offline) {
    log('serving offline page for navigation');
    return offline;
  }

  // last fallback: plain text
  return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' }});
}

// Stale-While-Revalidate keyed by URL (important for <object> + SVG)
async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_NAME);
  const key = req.url; // KEY: use URL string consistently
  const cached = await cache.match(key);

  // Launch network fetch in background to update cache
  const networkUpdate = (async () => {
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok) {
        // preserve original response (including headers like Content-Type)
        await cache.put(key, fresh.clone());
        log('cache updated for', key);
      } else {
        log('network fetch not ok for', key, fresh && fresh.status);
      }
      return fresh;
    } catch (err) {
      log('network fetch failed for', key, err);
      return null;
    }
  })();

  // If we have a cached response, return it immediately and update in background
  if (cached) {
    // don't await networkUpdate here
    networkUpdate.catch(() => {});
    log('SWR: returning cached for', key);
    return cached;
  }

  // No cache: wait for network and return either network result or fallback to cache if available
  const networkResp = await networkUpdate;
  if (networkResp) return networkResp;
  // last resort: try cached again (maybe race)
  const cachedAgain = await cache.match(key);
  if (cachedAgain) return cachedAgain;

  // nothing: give a minimal fallback
  // For images/SVGs we should return 503 rather than HTML page (so <object> won't try to parse)
  if (req.destination === 'image' || req.destination === 'svg' || req.headers.get('accept')?.includes('image')) {
    return new Response('Offline image', { status: 503, headers: { 'Content-Type': 'text/plain' }});
  }
  return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' }});
}

// Cross-origin: network-first, fallback to cache by URL
async function networkFirstCrossOrigin(req) {
  const cache = await caches.open(DATA_CACHE);
  try {
    const resp = await fetch(req);
    if (resp && resp.ok) {
      await cache.put(req.url, resp.clone());
    }
    return resp;
  } catch (e) {
    log('cross-origin network failed, trying cache for', req.url);
    const cached = await cache.match(req.url) || await caches.match(req.url);
    if (cached) return cached;
    return new Response('Offline (cross-origin)', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

// message handler for skipWaiting (kept)
self.addEventListener('message', (ev) => {
  if (ev.data && ev.data.action === 'skipWaiting') self.skipWaiting();
});
