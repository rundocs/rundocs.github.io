async function request(url: RequestInfo, options: RequestInit = {}) {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
        return await fetch(url, {
            signal,
            ...options,
        });
    } catch (error) {
        if (error instanceof DOMException) {
            if (error.name === "AbortError") {
                throw new Error("Request Timeout");
            }
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

export default request;
