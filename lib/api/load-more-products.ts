import { ProductsPageResult } from "../product-type";
import { authFetch } from "./auth-fetch";

export async function ProductPageFetcher(url: string): Promise<ProductsPageResult> {
    const res = await authFetch(url);
    const body = await res.json();
    
    if (!res.ok || !body.success || !body.data) {
        throw new Error(body.error || "Failed to fetch product data"); 
    }

    return body.data; 
}