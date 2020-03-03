const staticAssetName = 'static-assets-v1';
const dynamicAssetName = 'dynamic-assets';

// Pre-cache asset file path
const staticAssets = [
    '/',
    '/index.html',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    '/js/materialize.min.js',
    '/js/ui.js',
    '/js/app.js',
    '/css/materialize.min.css',
    '/css/styles.css',
    '/img/icons',
    '/img/icons/icon-144x144.png',
    '/img/icons/icon-72x72.png',
    '/img/icons/icon-96x96.png',
    '/img/icons/icon-512x512.png',
    '/img/icons/favicon.ico',
    '/img/dish.png',
    'https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/manifest.json',
];

/**
 * Install Service Worker
 */
self.addEventListener('install', event => {
    // console.log('service worker has been installed...', event);
    event.waitUntil(
        caches.open(staticAssetName).then(cache => {
            cache.addAll(staticAssets)
            .catch(err => console.log('add cache error', err))
        })
        .catch(err => console.log('open cache error', err))
    );
});

/**
 * listen for activate SW life cycle
 */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return keys.filter(key => ((key !== staticAssetName) && (key !== dynamicAssetName)))
            .map(key => caches.delete(key));
        })
        .catch(err => console.log('didn\'t delete', err))
    )
});

/**
 * Fetch event
 * This is where you intercept fetch request
 * and respond with a cached request or return the initial request
 */
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(cacheResponse => (cacheResponse || fetch(event.request).then(fetchedRes => {
            return caches.open(
            ((location.href.split('/').pop() === '') || (location.href.split('/').pop() === 'index.html'))
            ? staticAssetName
            : dynamicAssetName).then(cache => {
                cache.put(event.request.url, fetchedRes.clone());
                return fetchedRes;
            })
        })))
    )
});
