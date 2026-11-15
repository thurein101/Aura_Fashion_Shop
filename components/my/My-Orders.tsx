
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import { clearUserOrdersAction } from "@/app/actions/my";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Trash2,
  Package,
  ShoppingBag,
  CalendarDays,
} from "lucide-react";

type OrderItem = {
  id: string;
  productName: string;
  size: string | null;
  color: string | null;
  quantity: number;
  price: string;
};

type UserOrder = {
  id: string;
  total: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  orderItems: OrderItem[];
};

type Props = {
  orders: UserOrder[];
};

export default function MyOrdersClient({ orders }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [clearOpen, setClearOpen] = useState(false);

  function handleClearAll() {
    setError("");

    startTransition(async () => {
      const result = await clearUserOrdersAction();

      if (!result.success) {
        setError(result.error || "Something went wrong");
        return;
      }

      setClearOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </p>
        </div>

        {/* Clear All Dialog */}
        {orders.length > 0 && (
          <AlertDialog
            open={clearOpen}
            onOpenChange={setClearOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Clear Order History?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Are you sure you want to clear your order history?
                  Your orders will disappear from your account, but
                  they will remain available to the store admin.
                  This action cannot be undone from your account.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  No, Keep Orders
                </AlertDialogCancel>

                <AlertDialogAction
                  disabled={isPending}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClearAll();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isPending ? "Clearing..." : "Yes, Clear All"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />

          <h2 className="text-lg font-semibold">
            No orders yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            You haven't placed any orders yet.
          </p>

          <Button asChild className="mt-5">
            <Link href="/">
              Start Shopping
            </Link>
          </Button>
        </div>
      ) : (

        /* Orders List */
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >

              {/* Order Header */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">

                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 shrink-0 text-muted-foreground" />

                    <span className="text-sm font-semibold">
                      Order ID
                    </span>
                  </div>

                  <p className="break-all font-mono text-xs text-muted-foreground">
                    {order.id}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />

                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    Total Amount
                  </p>

                  <p className="text-lg font-bold">
                    {formatPrice(Number(order.total))}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="my-4 space-y-3 border-y py-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">
                        {item.productName}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {[item.size, item.color]
                          .filter(Boolean)
                          .join(" / ")}

                        {" · "}Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 font-medium">
                      {formatPrice(
                        Number(item.price) * item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-wrap items-end justify-between gap-3">

                <div className="space-y-2 text-xs">
                  <p>
                    Order Status:{" "}
                    <span className="font-semibold">
                      {order.status}
                    </span>
                  </p>

                  <p>
                    Payment Status:{" "}
                    <span className="font-semibold">
                      {order.paymentStatus}
                    </span>
                  </p>

                  <p className="text-muted-foreground">
                    Payment Method: {order.paymentMethod}
                  </p>
                </div>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {order.status}
                </span>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
