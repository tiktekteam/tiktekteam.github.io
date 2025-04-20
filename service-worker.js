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
    console.log('Service Worker received request to update cache from JSON');
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
