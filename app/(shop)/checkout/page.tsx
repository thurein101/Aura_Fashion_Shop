
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getCart } from "@/app/actions/cart";
import { CheckoutForm } from "@/components/Products/CheckOutForm";
import { CheckoutSkeleton } from "@/components/loading/checkout";

export const instant = false;

async function CheckoutPageInner() {
  const result = await getCart();

  if (!result.success) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Checkout
        </h1>

        <p className="mt-2 text-muted-foreground">
          Complete your shipping and payment information.
        </p>
      </div>

      <CheckoutForm cart={result.data} />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutPageInner />
    </Suspense>
  );
}
