async function request(url: RequestInfo, options: RequestInit = {}) {
    let controller = new AbortController();
    let signal = controller.signal;
    let timeout = setTimeout(() => controller.abort(), 5000);
    try {
        return await fetch(url, {
            signal,
            ...options,
        });
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("Request Timeout");
        } else {
            throw error;
        }
    } finally {
        clearTimeout(timeout);
    }
}

export default request;
