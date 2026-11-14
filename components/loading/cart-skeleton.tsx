

import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 space-y-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-5 lg:col-span-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex gap-4 rounded-xl border p-4"
            >
              {/* Product Image */}
              <Skeleton className="size-24 shrink-0 rounded-lg sm:size-32" />

              {/* Product Details */}
              <div className="flex flex-1 flex-col justify-between py-1">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-24" />
                </div>

                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-xl border p-5">
          <Skeleton className="mb-6 h-6 w-36" />

          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
