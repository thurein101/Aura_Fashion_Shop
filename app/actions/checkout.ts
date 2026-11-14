
"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";
import { getSession } from "@/lib/session";
import { checkoutSchema } from "@/lib/validation/checkout";
import { revalidateUserOrders } from "@/lib/cache_tag";
import { revalidatePath } from "next/cache";

export async function createOrderAction(input: unknown) {
  try {

    const parsed = checkoutSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false as const,
        error: "Invalid checkout information.",
      };
    }

    const { address, contactNumber, paymentMethod } =
      parsed.data;

   
    const session = await getSession();

    if (!session?.user) {
      return {
        success: false as const,
        error: "Please login first.",
      };
    }

    const userId = session.user.id;

    // 3. Create order inside transaction
    const order = await prisma.$transaction(
      async (tx) => {
        const cartItems = await tx.cart.findMany({
          where: { userId },
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        });

        if (cartItems.length === 0) {
          throw new Error("CART_EMPTY");
        }

        let total = new Prisma.Decimal(0);

        // Validate products and calculate total from DB
        for (const item of cartItems) {
          const { variant } = item;

          if (!variant.product.isActive) {
            throw new Error("PRODUCT_UNAVAILABLE");
          }

          if (variant.stock < item.quantity) {
            throw new Error("INSUFFICIENT_STOCK");
          }

          const price = new Prisma.Decimal(
            variant.product.price.toString()
          );

          total = total.add(price.mul(item.quantity));
        }

        // Reserve stock
        for (const item of cartItems) {
          const stockUpdate = await tx.productVariant.updateMany({
            where: {
              id: item.variantId,
              stock: {
                gte: item.quantity,
              },
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          if (stockUpdate.count === 0) {
            throw new Error("INSUFFICIENT_STOCK");
          }
        }

        // Create order and order items
        const newOrder = await tx.order.create({
          data: {
            userId,
            total,
            address,
            contactNumber,
            paymentMethod,

            status: "PENDING",
            paymentStatus: "PAID",

            orderItems: {
              create: cartItems.map((item) => ({
                variantId: item.variantId,
                productName: item.variant.product.name,
                size: item.variant.size,
                color: item.variant.color,
                quantity: item.quantity,
                price: item.variant.product.price,
              })),
            },
          },
        });

        // Clear cart only after order creation
        await tx.cart.deleteMany({
          where: { userId },
        });

        return newOrder;
      },
      {
        isolationLevel: "Serializable",
      }
    );

    // 4. Invalidate relevant cache after transaction succeeds
   revalidateUserOrders(userId, true);
revalidatePath("/cart");
revalidatePath("/admin/orders");

return {
  success: true as const,
  orderId: order.id,
};

  } catch (error) {
    console.error("Create order error:", error);

    if (error instanceof Error) {
      const messages: Record<string, string> = {
        CART_EMPTY: "Your cart is empty.",
        PRODUCT_UNAVAILABLE:
          "One or more products are unavailable.",
        INSUFFICIENT_STOCK:
          "Some products are out of stock. Please update your cart.",
      };

      if (messages[error.message]) {
        return {
          success: false as const,
          error: messages[error.message],
        };
      }
    }

    // Prisma Serializable transaction conflict
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return {
        success: false as const,
        error:
          "Your cart was updated by another request. Please try again.",
      };
    }

    return {
      success: false as const,
      error: "Unable to place your order. Please try again.",
    };
  }
}
