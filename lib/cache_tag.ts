import { updateTag } from "next/cache";
import { revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  products: "products",
  product: (slug: string) => `product-${slug}`,
  favourites: (userId: string) => `favourites-${userId}`,
  orders: (userId: string) => `orders-${userId}`,
  reviews: (productId: string) => `reviews-${productId}`,
} as const;

function invalidateCacheTag(tag: string, immediate = false) {
  if (immediate) {
    updateTag(tag);
    return;
  }

  revalidateTag(tag, "max");
}

export function revalidateUserFavourites(userId: string, immediate = false) {
  invalidateCacheTag(CACHE_TAGS.favourites(userId), immediate);
}

export function revalidateUserOrders(userId: string, immediate = false) {
  invalidateCacheTag(CACHE_TAGS.orders(userId), immediate);
}

export function revalidateProductReviews(productId: string) {
  updateTag(CACHE_TAGS.reviews(productId));
}