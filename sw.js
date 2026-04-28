// Odyssey Service Worker
// Strategy:
//   • App shell (HTML/JS/CSS): network-first with cache fallback (always get latest if online)
//   • CDN libs (three, stats.js, lil-gui): cache-first (immutable versions)
//   • API endpoints (/api/*, /stats): network-only (no caching)
//   • WebSocket: bypassed entirely

const VERSION = 'odyssey-v3';
const CDN_CACHE = 'odyssey-cdn-v1';
const SHELL_CACHE = `odyssey-shell-${VERSION}`;

// Files to pre-cache on install (best-effort)
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/game.js',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return Promise.allSettled(
        SHELL_ASSETS.map((url) =>
          fetch(url, { cache: 'reload' })
            .then((res) => res.ok && cache.put(url, res))
            .catch(() => null)
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== CDN_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Network-only paths
  if (url.pathname.startsWith('/api/') || url.pathname === '/stats') {
    return; // browser handles directly
  }

  // CDN libs (cross-origin) — cache-first (immutable)
  if (url.origin !== self.location.origin) {
    event.respondWith(cacheFirst(req, CDN_CACHE));
    return;
  }

  // App shell — network-first with cache fallback
  event.respondWith(networkFirst(req, SHELL_CACHE));
});

async function networkFirst(req, cacheName) {
  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone()).catch(() => {});
    }
    return res;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    // Fallback for navigation
    if (req.mode === 'navigate') {
      const indexCached = await caches.match('/index.html');
      if (indexCached) return indexCached;
    }
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function cacheFirst(req, cacheName) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone()).catch(() => {});
    }
    return res;
  } catch {
    return new Response('CDN offline', { status: 503 });
  }
}

// Allow client to request immediate skip-waiting
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
