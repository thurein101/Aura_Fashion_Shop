
import { ShoppingBag, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/lib/product-type";

type OrderSummaryProps = {
  cart: CartItem[];
  total: number;
  isPending: boolean;
};

export function OrderSummary({
  cart,
  total,
  isPending,
}: OrderSummaryProps) {
  return (
    <div className="lg:sticky lg:top-6 lg:self-start">
      <Card className="overflow-hidden rounded-xl border shadow-none">
        <CardHeader className="border-b px-5 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ShoppingBag className="size-5 text-[#F66425]" />
              Order Summary
            </CardTitle>

            <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
              {cart.length} Items
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5">
          {/* Items */}
          <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div
                key={item.variantId}
                className="flex justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {item.variant.product.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.variant.size} / {item.variant.color}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                  {formatPrice(
                    item.variant.product.price * item.quantity
                  )}
                </p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">
              {formatPrice(total)}
            </span>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Amount</span>

            <span className="text-xl font-bold text-[#F66425]">
              {formatPrice(total)}
            </span>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending || cart.length === 0}
            className="h-12 w-full rounded-lg bg-[#F66425] font-semibold text-white hover:bg-[#e85a1f] disabled:opacity-60"
          >
            {isPending ? "Placing Order..." : "Place Order"}
          </Button>

          {/* Trust Information */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-green-600" />
              Secure checkout
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="size-4 text-muted-foreground" />
              Reliable delivery
            </div>
          </div>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Your order will be submitted for confirmation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
