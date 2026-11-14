"use server";

import { revalidateUserFavourites } from "@/lib/cache_tag";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { toggleFavSchema } from "@/lib/validation/favourite";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function toggleFavouriteAction(input: unknown) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthenticated" };
  }

  const parsed = toggleFavSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { productId } = parsed.data;
  const userId = session.user.id;

  try {
    const existingFavourite = await prisma.productToUser.findUnique({
      where: {
        productId_userId: {
          productId: productId,
          userId: userId,
        },
      },
    });

    if (existingFavourite) {
      // ရှိပြီးသားဆိုရင် ဖျက်မည် (Unfavourite)
      await prisma.productToUser.delete({
        where: {
          productId_userId: {
            productId: productId,
            userId: userId,
          },
        },
      });
      revalidateUserFavourites(session.user.id, true);
      revalidatePath("/", "layout");
      revalidatePath("/products", "layout");
      return { success: true, data: { isFavorited: false } };
    } else {
      // မရှိသေးရင် အသစ်ထည့်မည် (Favourite)
      await prisma.productToUser.create({
        data: {
          productId: productId,
          userId: userId,
        },
      });
      revalidateUserFavourites(session.user.id, true);
      revalidatePath("/", "layout");
      revalidatePath("/products", "layout");
      return { success: true, data: { isFavorited: true } };
    }
  } catch (error) {
    console.error("Failed to toggle favourite:", error);
    return { success: false, error: "Database error occurred" };
  }
}
