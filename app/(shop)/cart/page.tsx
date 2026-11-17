
import { getCart } from "@/app/actions/cart";
import { CartSkeleton } from "@/components/loading/cart-skeleton";
import CartClient from "@/components/Products/CartClient";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const instant = false;

async function CartPageInner() {
  const result = await getCart();

  if (!result.success) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center bg-[#F9F8F6]">
        <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />

        <h1 className="text-2xl font-semibold">
          Your Cart
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {result.error}
        </p>

        <Link
          href="/login"
          className="mt-6 rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground"
        >
          Login to continue
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="mb-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Your Shopping Bag
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Shopping Cart
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Manage your selected items and proceed to checkout.
        </p>
      </div>

      <CartClient cart={result.data} />
    </main>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartPageInner />
    </Suspense>
  );
}
