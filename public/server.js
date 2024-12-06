const { version, content } = JSON.parse('MANIFEST');
const addResourcesToCache = async (resources) => {
    const cache = await caches.open(version);
    await cache.addAll(resources);
};

async function getCached(request) {
    const cache = await caches.open(version);
    return await cache.match(request);
}
const cacheFirst = async (request) => {
    let requestUrl = new URL(request.url);
    // 同源
    if (self.location.origin === requestUrl.origin) {
        console.log(request.url, "同源请求");

        const path = requestUrl.pathname;
        if (content.includes(path)) {
            console.log(path, "应该在缓存范围");
            const cachedResponse = await getCached(request);
            if (cachedResponse) {
                console.log(path, "返回缓存");
                return cachedResponse;
            } else {
                console.log(path, "但是没有缓存，返回请求");
                return fetch(request);
            }
        } else {
            console.log(path, "不在缓存范围");
            let cachedNotFound = await getCached("/404.html");
            if (cachedNotFound) {
                console.log(path, "返回缓存的404页面");
                return cachedNotFound;
            } else {
                console.log(path, "但是应该缓存的404页面也不存在，返回请求");
                return fetch(request);
            }
        }
    } else {
        console.log("不是同源请求");
        return fetch(request);
    }
};

self.addEventListener("install", (event) => {
    console.log("install", event);
    event.waitUntil(addResourcesToCache(content));
});
self.addEventListener("fetch", (event) => {
    console.log(version, new Date(version))
    console.log("fetch", event.request.url);
    event.respondWith(cacheFirst(event.request));
});
