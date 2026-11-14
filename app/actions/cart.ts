
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { addToCartSchema, removeCartSchema, updateCartSchema } from "@/lib/validation/cart";
import { CartItem, CartResult } from "@/lib/product-type";

export async function addToCartAction(input: unknown) {
  try {
    // 1. Validate input
    const parsed = addToCartSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid cart data.",
      };
    }

    const { variantId, quantity } = parsed.data;

    // 2. Check authentication
    const session = await getSession();

    if (!session?.user) {
      return {
        success: false,
        error: "Please login first.",
      };
    }

    const userId = session.user.id;

    // 3. Database transaction
    const result = await prisma.$transaction(async (tx) => {
      // Find variant
      const variant = await tx.productVariant.findUnique({
        where: { id: variantId },
        include: {
          product: true,
        },
      });

      if (!variant) {
        throw new Error("VARIANT_NOT_FOUND");
      }

      if (!variant.product.isActive) {
        throw new Error("PRODUCT_UNAVAILABLE");
      }

      // Check existing cart item
      const existingCart = await tx.cart.findUnique({
        where: {
          userId_variantId: {
            userId,
            variantId,
          },
        },
      });

      // Calculate total quantity
      const totalQuantity = (existingCart?.quantity ?? 0) + quantity;

      // Check available stock
      if (totalQuantity > variant.stock) {
        throw new Error("INSUFFICIENT_STOCK");
      }

      // Create or update cart
      const cartItem = await tx.cart.upsert({
        where: {
          userId_variantId: {
            userId,
            variantId,
          },
        },
        create: {
          userId,
          variantId,
          quantity,
        },
        update: {
          quantity: {
            increment: quantity,
          },
        },
      });

      return cartItem;
    });

    revalidatePath("/cart", "layout");

    return {
      success: true,
      message: "Added to cart successfully.",
      data: result,
    };
  } catch (error: any) {
    console.error("Add to cart error:", error);

   
    if (
      error.message === "INSUFFICIENT_STOCK" ||
      error.message === "VARIANT_NOT_FOUND" ||
      error.message === "PRODUCT_UNAVAILABLE"
    ) {
      return {
        success: false,
        error: error.message, 
      };
    }

    return {
      success: false,
      error: "Something went wrong.",
    };
  }
}



//only for cart badge 

export async function getCartCountAction() {
  try {
    const session = await getSession();

    //use မရှိရင်တော့ ဘလိုအခြေနေပဲဖြစ်" customer ကိုကိုစားမပြုလို့ 0ပဲပြသင့်တယ် 
    if (!session?.user) {
      return { success: true, count: 0 };
    }

    const result = await prisma.cart.aggregate({
      where: {
        userId: session.user.id,
      },
      _sum: {
        quantity: true,
      },
    });

    return {
      success: true,
      count: result._sum.quantity ?? 0,
    };
  } catch (error) {
    console.error("Cart count error:", error);

    return {
      success: false,
      count: 0,
    };
  }
}


export async function getCart(): Promise<CartResult> {
  const session = await getSession();

  if (!session?.user) {
    return {
      success: false,
      error: "Please login first.",
    };
  }

  const cart = await prisma.cart.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      variant: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const data: CartItem[] = cart.map((item) => ({
    variantId: item.variantId,
    quantity: item.quantity,
    variant: {
      id: item.variant.id,
      size: item.variant.size,
      color: item.variant.color,
      stock: item.variant.stock,
      ImageUrl: item.variant.ImageUrl,
      product: {
        id: item.variant.product.id,
        name: item.variant.product.name,
        slug: item.variant.product.slug,
        price: Number(item.variant.product.price),
        imageUrl: item.variant.product.imageUrl,
        isActive: item.variant.product.isActive,
      },
    },
  }));

  return {
    success: true,
    data,
  };
}



export async function updateCartAction(input: unknown) {
  try {
    // Validate input
    const parsed = updateCartSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid cart data.",
      };
    }

    const { variantId, action } = parsed.data;

    //  Check authentication
    const session = await getSession();

    if (!session?.user) {
      return {
        success: false,
        error: "Please login first.",
      };
    }

    const userId = session.user.id;

    // Database transaction
    const result = await prisma.$transaction(
      async (tx) => {
        // Find user's cart item
        const cartItem = await tx.cart.findUnique({
          where: {
            userId_variantId: {
              userId,
              variantId,
            },
          },
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        });

        if (!cartItem) {
          return {
            success: false,
            error: "CART_NOT_FOUND",
          };
        }

        const { quantity, variant } = cartItem;

        // Check product availability
        if (!variant.product.isActive) {
          return {
            success: false,
            error: "PRODUCT_UNAVAILABLE",
          };
        }

        let newQuantity = quantity;

        // Increase quantity
        if (action === "increase") {
          if (quantity >= variant.stock) {
            return {
              success: false,
              error: "INSUFFICIENT_STOCK",
            };
          }

          newQuantity += 1;
        }

        // Decrease quantity
        if (action === "decrease") {
          if (quantity <= 1) {
            return {
              success: false,
              error: "MINIMUM_QUANTITY",
            };
          }

          newQuantity -= 1;
        }

        // Update cart
        const updated = await tx.cart.updateMany({
          where: {
            userId,
            variantId,
            quantity,
          },
          data: {
            quantity: newQuantity,
          },
        });

        if (updated.count === 0) {
          return {
            success: false,
            error: "CART_CHANGED",
          };
        }

        return {
          success: true,
        };
      },
      {
        isolationLevel: "Serializable",
      }
    );

    if (!result.success) {
      return result;
    }

    revalidatePath("/cart","layout");

    return {
      success: true,
      message: "Cart updated successfully.",
    };

  } catch (error) {
    console.error("Update cart error:", error);

    return {
      success: false,
      error: "Something went wrong.",
    };
  }
}


export async function removeCartAction(input: unknown) {
  try {
    // Validate input
    const parsed = removeCartSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid cart data.",
      };
    }

    const { variantId } = parsed.data;

    //  Check authentication
    const session = await getSession();

    if (!session?.user) {
      return {
        success: false,
        error: "Please login first.",
      };
    }

    const userId = session.user.id;

    // Delete cart item
    const result = await prisma.cart.deleteMany({
      where: {
        userId,
        variantId,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "CART_NOT_FOUND",
      };
    }

    revalidatePath("/cart");

    return {
      success: true,
      message: "Item removed successfully.",
    };

  } catch (error) {
    console.error("Remove cart error:", error);

    return {
      success: false,
      error: "Something went wrong.",
    };
  }
}