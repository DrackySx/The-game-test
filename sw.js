const CACHE_NAME = 'aventura-fantastica-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx',
  '/metadata.json',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/components/ui/Button.tsx',
  '/components/CharacterCreator.tsx',
  '/components/ContentViewer.tsx',
  '/components/CharacterSelect.tsx',
  '/components/GameScreen.tsx',
  '/components/CombatView.tsx',
  '/components/InventoryScreen.tsx',
  '/components/AIInteractionModal.tsx',
  '/components/LootDisplay.tsx',
  '/components/StatsScreen.tsx',
  '/components/SkillTreeScreen.tsx',
  '/game/character.ts',
  '/game/dice.ts',
  '/game/encounters.ts',
  '/game/events.ts',
  '/game/items.ts',
  '/game/loot.ts',
  '/game/storage.ts',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=MedievalSharp&family=Roboto:wght@400;700&display=swap',
  'https://picsum.photos/seed/fantasyworld/1200/800',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching assets');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
    
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith('chrome-extension://')) {
      return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(err => {
            console.log('Fetch failed; returning cached response if available.', err);
        });

        return response || fetchPromise;
      });
    })
  );
});