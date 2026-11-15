
"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidateUserOrders } from "@/lib/cache_tag";

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
