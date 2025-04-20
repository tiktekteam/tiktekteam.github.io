// Service Worker for Simulation Platform

const CACHE_NAME = 'simulation-platform-cache-v2'; // Updated cache version
const SUPPORTED_SCHEMES = ['http:', 'https:'];

// List of essential files to cache during installation
const ESSENTIAL_FILES = [
  '/',
  '/index.html',
  '/simulations/parabole-meets-different-lines.html',
  '/simulations/subtracting-negative-number.html',
  '/simulations/test.html'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential files');
        return cache.addAll(ESSENTIAL_FILES);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_NEW_FILE') {
    console.log('Service Worker received request to cache:', event.data.url);

    // Make sure the URL is absolute
    const url = new URL(event.data.url, self.location.origin).href;

    // Only cache requests with supported schemes
    const urlObj = new URL(url);
    if (!SUPPORTED_SCHEMES.includes(urlObj.protocol)) {
      console.warn('Unsupported URL scheme:', url);
      return;
    }

    // Cache the file
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Fetching and caching:', url);
        return fetch(url)
          .then((response) => {
            if (!response || response.status !== 200) {
              console.error('Failed to fetch file for caching:', url, response.status);
              return;
            }
            console.log('Successfully cached:', url);
            return cache.put(url, response);
          })
          .catch((error) => {
            console.error('Error caching file:', url, error);
          });
      });
  }
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        // Only cache requests with supported schemes (http, https)
        const url = new URL(fetchRequest.url);
        if (!SUPPORTED_SCHEMES.includes(url.protocol)) {
          return fetch(fetchRequest);
        }

        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it's a one-time use stream
          const responseToCache = response.clone();

          // Only cache supported schemes
          if (SUPPORTED_SCHEMES.includes(url.protocol)) {
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Check if the URL contains a simulation file
                if (url.pathname.includes('/simulations/') && url.pathname.endsWith('.html')) {
                  console.log('Automatically caching simulation file:', url.pathname);
                }
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        });
      })
  );
});
