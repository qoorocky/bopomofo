const CACHE = 'bopomoo-v3';
// Paths are relative to the SW scope (which is /bopomofo/ on GitHub Pages)
const PRECACHE = [
  './',
  './index.html',
  // index.html is explicitly listed so navigation fallback can always find it
  './audio/sfx/click.wav',
  './audio/sfx/flip.wav',
  './audio/sfx/correct.wav',
  './audio/sfx/wrong.wav',
  './audio/sfx/star.wav',
  './audio/sfx/gameStart.wav',
  './audio/sfx/gameWin.wav',
  './audio/sfx/levelUp.wav',
  './audio/sfx/countdown.wav',
  './audio/sfx/pop.wav',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      // addAll skips entries that fail to fetch (e.g. audio not yet generated)
      Promise.allSettled(PRECACHE.map((url) => c.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // Cache API only supports http/https — skip other schemes (chrome-extension, etc.)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Navigation requests (HTML page loads / refreshes): serve index.html from cache
  // This prevents 404s on sub-paths after the SW is installed
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('./index.html').then(
        (cached) => cached || fetch(new Request(new URL('./', self.location).href))
      )
    );
    return;
  }

  // BGM: cache-first, populate on first successful fetch
  if (url.pathname.includes('/audio/bgm/')) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((res) => {
          if (res.ok) {
            caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
          }
          return res;
        });
      })
    );
    return;
  }

  // Everything else: network-first, fall back to cache
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => new Response('', { status: 503, statusText: 'Unavailable' }));
    })
  );
});
