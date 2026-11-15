import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/cache_tag";

// My Orders
export async function getUserOrders(userId: string) {
  "use cache";

  cacheTag(CACHE_TAGS.orders(userId));
  cacheLife("minutes");

  const orders = await prisma.order.findMany({
    where: {
      userId,
      hiddenFromUserAt: null,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      total: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      createdAt: true,
      orderItems: {
        select: {
          id: true,
          productName: true,
          size: true,
          color: true,
          quantity: true,
          price: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    ...order,
    total: order.total.toString(),
    createdAt: order.createdAt.toISOString(),
    orderItems: order.orderItems.map((item) => ({
      ...item,
      price: item.price.toString(),
    })),
  }));
}
// My Favourites
export async function getUserFavourites(userId: string) {
  "use cache";

  cacheTag(CACHE_TAGS.favourites(userId));
  cacheLife("minutes");

  const favourites = await prisma.productToUser.findMany({
    where: { userId },
    select: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          category: true,
          imageUrl: true,
          typeId: true,

          type: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },

          productVariants: {
            select: {
              id: true,
              size: true,
              color: true,
              stock: true,
              ImageUrl: true,
            },
          },
        },
      },
    },
  });

  return favourites.map(({ product }) => ({
    ...product,
    price: Number(product.price),
  }));
}