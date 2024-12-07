const { revision, resources } = JSON.parse('__MANIFEST__');

function logger(method, ...args) {
    const colors = {
        debug: "#808fa3",       // --data-gray-color-emphasis
        log: "#30a147",         // --data-green-color-emphasis
        warn: "#b88700",        // --data-yellow-color-emphasis
        error: "#df0c24",       // --data-red-color-emphasis
    };
    let style1 = [
        "background: #59636e",  // --bgColor-neutral-emphasis
        "color: white",
        "font-weight: bold",
        "padding: 2px 0.5em",
        "border-radius: 3px 0 0 3px",
    ].join(";");
    let style2 = [
        `background: ${colors[method]}`,
        "color: white",
        "font-weight: bold",
        "padding: 2px 0.5em",
        "border-radius: 0 3px 3px 0",
    ].join(";");
    console[method]("%c%s%c%s", style1, "Service Worker", style2, ...args);
}
async function cacheAddAll(resources) {
    try {
        let cache = await caches.open(revision);
        await cache.addAll(resources);
        logger("debug", "Cached all resources successfully!");
    } catch (error) {
        logger("error", "Failed to cache resources", error.message);
    }
}
async function getCachedData(request) {
    try {
        let cache = await caches.open(revision);
        return await cache.match(request);
    } catch (error) {
        logger("error", "Failed to get cached resources", error.message);
    }
}
async function deleteHistoryCaches() {
    try {
        let keys = await caches.keys();
        for (let key of keys) {
            if (key !== revision) {
                await caches.delete(key);
                logger("debug", "Deleted history cached", key);
            }
        }
    } catch (error) {
        logger("error", "Failed to delete history caches", error.message);
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
                logger("debug", revision, cached.url);
                return cached;
            }
        }
    }
    logger("debug", "fetch", request.url);
    return fetch(request);
}

self.addEventListener("install", (event) => {
    logger("debug", "Installing");
    self.skipWaiting();
    event.waitUntil(cacheAddAll(resources));
});
self.addEventListener("activate", event => {
    logger("debug", "Activate");
    event.waitUntil(Promise.all([
        clients.claim(),
        deleteHistoryCaches(),
    ]));
});
self.addEventListener("fetch", (event) => {
    event.respondWith(sameOriginCacheFirst(event.request));
});
