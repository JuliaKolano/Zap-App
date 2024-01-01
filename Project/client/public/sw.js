const cacheName = 'zap_app_v1.0';
const filesToCache = [
    './',
    './index.html',
    './src/App.js',
    './src/index.js',
    './src/index.css',
    './src/components/Camera.js',
    './src/components/Menu.js',
    './src/components/SearchBar.js',
    './src/components/SightingsList.js',
    './src/components/SightingsForm.js',
    './src/images/home.png',
    './src/images/pangolin_1.jpg',
    './src/images/recordSighting.png',
    './src/images/viewSightings.png',
    './src/pages/Home.js',
    './src/pages/RecordSighting.js',
    './src/pages/ViewSightings.js',
    './src/styles/Home.css',
    './src/styles/RecordSighting.css',
    './src/styles/ViewSightings.css',
];

//install service worker and cache offline content
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

//take control of all fetch requests
//serve cached content where possible
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});