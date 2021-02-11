const CACHE_NAME = 'bulgarian-quiz-version-32';
const FILES_TO_CACHE = [
    'manifest.json',
    'images/favicon-32x32.png',
    'images/favicon-152x152.png',
    'images/icon-32x32.png',
    'images/icon-128x128.png',
    'images/icon-144x144.png',
    'images/icon-152x152.png',
    'images/icon-192x192.png',
    'images/icon-256x256.png',
    'images/icon-512x512.png',
    'dist/app.min.css',
    'dist/app.min.js',
    'index.html'
];

self.addEventListener('install', (ev) => {
    ev.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (ev) => {
    ev.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', (ev) => {
    ev.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(ev.request).then((response) => {
                return response || fetch(ev.request);
            });
        })
    );
});
