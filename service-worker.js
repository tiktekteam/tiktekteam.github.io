// Service Worker for Simulation Platform

const CACHE_NAME = 'simulation-platform-cache-v3'; // Updated cache version
const SUPPORTED_SCHEMES = ['http:', 'https:'];

// List of essential files to cache during installation
const ESSENTIAL_FILES = [
  '/',
  '/index.html',
  '/simulations.json'
];

// Function to load simulations from the JSON file and cache them
async function loadAndCacheSimulations() {
  try {
    const response = await fetch('/simulations.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch simulations.json: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.simulations || !Array.isArray(data.simulations)) {
      throw new Error('Invalid simulations.json format');
    }

    console.log(`Service worker: Found ${data.simulations.length} simulations in JSON file`);

    // Get paths of all simulations
    const simulationPaths = data.simulations.map(sim => sim.path);

    // Cache all simulation files
    const cache = await caches.open(CACHE_NAME);

    // Add each simulation file to the cache
    const cachePromises = simulationPaths.map(path => {
      // Make sure the URL is absolute
      const url = new URL(path, self.location.origin).href;

      // Only cache requests with supported schemes
      const urlObj = new URL(url);
      if (!SUPPORTED_SCHEMES.includes(urlObj.protocol)) {
        console.warn('Unsupported URL scheme:', url);
        return Promise.resolve();
      }

      return fetch(url)
        .then(response => {
          if (!response || response.status !== 200) {
            console.error('Failed to fetch file for caching:', url, response.status);
            return;
          }
          console.log('Successfully cached simulation:', url);
          return cache.put(url, response);
        })
        .catch(error => {
          console.error('Error caching simulation file:', url, error);
        });
    });

    return Promise.all(cachePromises);
  } catch (error) {
    console.error('Error loading simulations from JSON:', error);
    return Promise.resolve();
  }
}

// Install event - cache essential files and simulations
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential files');
        return cache.addAll(ESSENTIAL_FILES);
      })
      .then(() => {
        console.log('Caching simulation files from JSON');
        return loadAndCacheSimulations();
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
  } else if (event.data && event.data.type === 'UPDATE_CACHE_FROM_JSON') {
    // Reload and cache all simulations from the JSON file
    const forceUpdate = event.data.forceUpdate === true;
    console.log(`Service Worker received request to update cache from JSON (forceUpdate: ${forceUpdate})`);

    if (forceUpdate) {
      // If forceUpdate is true, clear the cache first
      caches.open(CACHE_NAME)
        .then(cache => {
          // Delete simulations.json from cache to force a fresh fetch
          cache.delete('/simulations.json')
            .then(deleted => {
              console.log('Deleted simulations.json from cache:', deleted);
              // Then reload and cache all simulations
              return loadAndCacheSimulations();
            })
            .then(() => {
              // Notify the client that the cache has been updated
              if (event.source) {
                event.source.postMessage({
                  type: 'CACHE_UPDATED',
                  timestamp: new Date().toISOString(),
                  forceUpdate: true
                });
              }
            });
        });
    } else {
      // Regular update without clearing cache first
      loadAndCacheSimulations()
        .then(() => {
          // Notify the client that the cache has been updated
          if (event.source) {
            event.source.postMessage({
              type: 'CACHE_UPDATED',
              timestamp: new Date().toISOString()
            });
          }
        });
    }
  }
});

// Fetch event - use different strategies based on the request
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // For simulations.json, use a network-first strategy to ensure we get the latest version
  if (url.pathname.endsWith('/simulations.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If we got a valid response, clone it and update the cache
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                console.log('Updating cache with fresh simulations.json');
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // If network request fails, try to return from cache
          console.log('Network request for simulations.json failed, falling back to cache');
          return caches.match(event.request);
        })
    );
  } 
  // For all other requests, use a cache-first strategy
  else {
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
  }
});
