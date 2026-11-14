export async function authFetch<T>(url: string, options?: RequestInit) {
    return fetch(url, {
        ...options, 
        credentials: "include", // အရေးကြီး
        headers: options?.headers
    });
}