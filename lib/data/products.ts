"use server"
import { cacheLife, cacheTag } from "next/cache";
import { CategoryValue } from "@/lib/utils";
import { CACHE_TAGS } from "../cache_tag";
import { queryProductPage, queryProductSingleDetail } from "../quiries/product-page";
import { queryRecommendedProducts } from "../quiries/product-recommendation";

export async function getProductPage(
    category?: CategoryValue | null,
    type?: string | null,
    cursor?: string | null,
    limit: number = 12,
    search?: string | null 
) {
    "use cache";
    cacheTag(CACHE_TAGS.products);
    cacheLife("hours");

   
    return queryProductPage(category, type, cursor, limit, search);
}


//single
export async function getProductBySlug(slug: string) {
  "use cache";

  cacheLife("hours");
  cacheTag(CACHE_TAGS.product(slug));

  const product = await queryProductSingleDetail(slug);

  if (!product) return null;

    return {
    ...product,
    price: product.price.toString(),
  };
}

export async function getRecommendedProducts(
  productId: string,
  category: string,
  typeId: string | null,
) {
  return queryRecommendedProducts(
    productId,
    category,
    typeId,
  );
}