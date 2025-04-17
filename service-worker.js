// Service Worker for aggressive cache control
const VERSION = new Date().getTime(); // Use timestamp as version
const CACHE_NAME = `tiktekteam-cache-v1-${VERSION}`; // Add version to cache name

// Files to never cache
const NEVER_CACHE = [
  'index.html',
  'simulations/manifest.json',
  '.js', // Add JS files to never cache list
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...', VERSION);
  self.skipWaiting(); // Force activation
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker...', VERSION);
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('[Service Worker] Clearing Old Cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming Clients...');
        return self.clients.claim();
      })
  );
});

// Fetch event - network first strategy for HTML, manifest, and JS files, cache for others
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const requestPath = url.pathname.split('/').pop();

  // Check if the request is for a file that should never be cached
  const shouldNeverCache = NEVER_CACHE.some((item) => {
    // For file extensions (like .js), check if the path ends with that extension
    if (item.startsWith('.')) {
      return requestPath.endsWith(item);
    }
    // For specific files, check if the path includes that file
    return requestPath.includes(item);
  });

  // For index.html, manifest.json, and all JS files, always go to network
  if (shouldNeverCache) {
    console.log('[Service Worker] Network Only for:', requestPath);
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }).catch((error) => {
        console.error('[Service Worker] Fetch Failed:', error);
        return caches.match(event.request);
      })
    );
  } else {
    // For other resources, use network first with cache fallback
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the fetched response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[Service Worker] Clearing Cache by Request');
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(cacheNames.map((cache) => caches.delete(cache)));
        })
        .then(() => {
          console.log('[Service Worker] Cache Cleared');
          event.ports[0].postMessage({ result: 'Cache cleared successfully' });
        })
    );
  }
});
