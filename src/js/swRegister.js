export default async function () {
    if (import.meta.env.DEV) {
        return;
    }
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("/sw.js", {
                scope: "/",
            });
        } catch (error) {
            console.error("Service Worker:", error.message);
        }
    }
}
