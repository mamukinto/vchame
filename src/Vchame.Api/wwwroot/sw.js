const CACHE = 'vchame-v15';
const ASSETS = [
    '/',
    '/stats.html',
    '/style.css',
    '/app.js',
    '/icon.svg',
    '/manifest.json',
    '/images/khinkali.png',
    '/images/khachapuri.png',
    '/images/qababi.png',
    '/images/lobiani.png',
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    // API calls — network only
    if (url.pathname.startsWith('/api/')) {
        e.respondWith(fetch(e.request));
        return;
    }

    // Static assets — cache first, fallback to network
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request))
    );
});
