"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

import { updateCartAction, removeCartAction } from "@/app/actions/cart";

import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/lib/product-type";
import { Button } from "../ui/button";

export default function CartClient({ cart }: { cart: CartItem[] }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [cartItems, setCartItems] = useState(cart);

  // Sync server data
  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  // Calculate totals
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.variant.product.price * item.quantity,
    0,
  );

  // Update quantity
  const handleQuantity = (
    variantId: string,
    action: "increase" | "decrease",
  ) => {
    const item = cartItems.find((item) => item.variantId === variantId);

    if (!item) return;

    const newQuantity =
      action === "increase" ? item.quantity + 1 : item.quantity - 1;

    if (newQuantity < 1 || newQuantity > item.variant.stock) return;

    const previousCart = cartItems;

    // Optimistic UI
    setCartItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );

    // Database update
    startTransition(async () => {
      try {
        const result = await updateCartAction({
          variantId,
          action,
        });

        if (!result.success) {
          setCartItems(previousCart);
          toast.error(result.error);
          return;
        }

        router.refresh();
      } catch {
        setCartItems(previousCart);
        toast.error("Something went wrong.");
      }
    });
  };
  // Remove item
  const handleRemove = (variantId: string) => {
    if (isPending) return;

    const previousCart = cartItems;

    // Optimistic remove
    setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));

    startTransition(async () => {
      try {
        const result = await removeCartAction({ variantId });

        if (!result.success) {
          setCartItems(previousCart);
          toast.error(result.error);
          return;
        }

        toast.success("Removed from cart.");
        router.refresh();
      } catch {
        setCartItems(previousCart);
        toast.error("Something went wrong.");
      }
    });
  };

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center text-center bg-[#F9F8F6]">
        <ShoppingBag size={42} className="text-muted-foreground mb-5" />

        <h2 className="text-xl font-semibold">Your cart is empty</h2>

        <p className="text-sm text-muted-foreground mt-2">
          Add some products to your cart.
        </p>

        <Link
          href="/"
          className="mt-6 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <section className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Cart Items</h2>

          <span className="text-sm text-muted-foreground">
            {totalItems} items
          </span>
        </div>

        {cartItems.map((item) => {
          const { variant } = item;
          const product = variant.product;

          const imageUrl = variant.ImageUrl || product.imageUrl;

          const itemTotal = product.price * item.quantity;

          return (
            <div
              key={item.variantId}
              className="flex gap-4 p-4 border rounded-2xl bg-card"
            >
              {/* Image */}
              <Link
                href={`/shop/products/${product.slug}`}
                className="relative w-24 h-28 sm:w-32 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-muted"
              >
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  unoptimized
                  sizes="128px"
                  className="object-cover"
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between gap-3">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {product.name}
                    </h3>

                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleRemove(item.variantId)}
                      className="text-muted-foreground hover:text-red-500 disabled:opacity-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <p className="text-sm font-semibold mt-2">
                    {formatPrice(product.price)}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                    <span>Size: {variant.size}</span>
                    <span>Color: {variant.color}</span>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <span
                      className={`text-xs ${
                        product.isActive ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {product.isActive ? "Active" : "Unavailable"}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Stock: {variant.stock}
                    </span>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border rounded-full p-1">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleQuantity(item.variantId, "decrease")}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <span className="min-w-6 text-center">{item.quantity}</span>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleQuantity(item.variantId, "increase")}
                      disabled={item.quantity >= item.variant.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="font-semibold text-sm">
                    {formatPrice(itemTotal)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Order Summary */}
      <aside>
        <div className="border rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="font-semibold text-lg">Order Summary</h2>

          <div className="flex justify-between mt-6 text-sm">
            <span className="text-muted-foreground">Total Items</span>

            <span className="font-medium">{totalItems}</span>
          </div>

          <div className="flex justify-between mt-4 text-sm">
            <span className="text-muted-foreground">Subtotal</span>

            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          <div className="border-t mt-5 pt-5 flex justify-between items-center">
            <span className="font-semibold">Total</span>

            <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block text-center rounded-full bg-primary text-primary-foreground py-3 text-sm font-medium hover:opacity-90 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
