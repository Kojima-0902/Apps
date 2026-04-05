const CACHE = 'english-app-v1';
const ASSETS = [
  '/EnglishLearning/',
  '/EnglishLearning/index.html',
  '/EnglishLearning/css/style.css',
  '/EnglishLearning/js/data.js',
  '/EnglishLearning/js/app.js',
  '/EnglishLearning/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
