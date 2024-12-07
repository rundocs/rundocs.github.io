const { version, resources } = JSON.parse('__MANIFEST__');

async function cacheAddAll(resources) {
    try {
        let cache = await caches.open(version);
        await cache.addAll(resources);
        console.log("Cached all resources successfully!");
    } catch (error) {
        console.error(error.message);
    }
}
async function getCachedData(request) {
    try {
        let cache = await caches.open(version);
        return await cache.match(request);
    } catch (error) {
        console.error(error.message);
    }
}
async function deleteHistoryCaches() {
    caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cacheName => {
            if (cacheName !== version) {
                return caches.delete(cacheName);
            }
        }));
    });
}
async function cacheFirst(request) {
    let target = new URL(request.url);

    if (self.location.origin === target.origin) {
        if (!resources.includes(target.pathname)) {
            request = new Request("/404.html");
        }
        let cached = await getCachedData(request);
        if (cached && cached.ok) {
            console.log("sw:", target.pathname, cached);
            return cached;
        }
    }
    return fetch(request);
}


self.addEventListener("install", (event) => {
    event.waitUntil(cacheAddAll(resources));
});
self.addEventListener("activate", event => {
    event.waitUntil(deleteHistoryCaches());
});
self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst(event.request));
});
