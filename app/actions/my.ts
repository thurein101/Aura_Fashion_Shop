
"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidateUserOrders } from "@/lib/cache_tag";
import { getUserFavouriteIds } from "@/lib/data/favourite";
import { getUserFavourites } from "@/lib/data/my-";

export async function hideUserOrderAction(orderId: string) {
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const result = await prisma.order.updateMany({
    where: {
      id: orderId,
      userId: session.user.id,
      hiddenFromUserAt: null,
    },
    data: {
      hiddenFromUserAt: new Date(),
    },
  });

  if (result.count === 0) {
    return { success: false, error: "Order not found" };
  }

  revalidateUserOrders(session.user.id, true);

  return { success: true };
}

export async function clearUserOrdersAction() {
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  await prisma.order.updateMany({
    where: {
      userId: session.user.id,
      hiddenFromUserAt: null,
    },
    data: {
      hiddenFromUserAt: new Date(),
    },
  });

  revalidateUserOrders(session.user.id, true);

  return { success: true };
}

export async function getMyFavouritesAction() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false as const,
        unauthorized: true,
        products: [],
        error: "Unauthorized",
      };
    }

    const products = await getUserFavourites(session.user.id);

    return {
      success: true as const,
      unauthorized: false,
      products,
      error: null,
    };
  } catch (error) {
    console.error("Get favourites error:", error);

    return {
      success: false as const,
      unauthorized: false,
      products: [],
      error: "Failed to load favourites",
    };
  }
}