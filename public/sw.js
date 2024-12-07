const { version, resources } = JSON.parse('__MANIFEST__');

async function cacheAddAll(resources) {
    try {
        let cache = await caches.open(version);
        await cache.addAll(resources);
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
    try {
        let keys = await caches.keys();
        for (let key of keys) {
            if (key !== version) {
                await caches.delete(key);
            }
        }
    } catch (error) {
        console.error(error.message);
    }
}
async function sameOriginCacheFirst(request) {
    let target = new URL(request.url);
    // same origin
    if (self.location.origin === target.origin) {
        // 404 => 200
        // change non resource request to cached "/404.html"
        if (!resources.includes(target.pathname)) {
            request = new Request("/404.html");
        }
        // cache first
        let cached = await getCachedData(request);
        if (cached) {
            if (cached.ok) {
                return cached;
            }
        }
    }
    return fetch(request);
}

self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(cacheAddAll(resources));
});
self.addEventListener("activate", event => {
    event.waitUntil(Promise.all([
        clients.claim(),
        deleteHistoryCaches(),
    ]));
});
self.addEventListener("fetch", (event) => {
    event.respondWith(sameOriginCacheFirst(event.request));
});
