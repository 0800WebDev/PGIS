self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated!');
});

self.addEventListener('fetch', (event) => {
    // We’re not modifying requests, just passing them through
    event.respondWith(fetch(event.request));
});

// Inject keyboard shortcut on all pages
self.addEventListener('message', (event) => {
    if (event.data === 'injectShortcut') {
        clients.matchAll().then(allClients => {
            allClients.forEach(client => {
                client.postMessage('runShortcut');
            });
        });
    }
});
