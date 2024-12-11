import logger from "./logger.ts";

export default async function () {
    if (import.meta.env.DEV) {
        return;
    }
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js", {
            scope: "/",
        }).catch(error => {
            logger("error", "Service Worker Register", error.message)
        });
    }
}
