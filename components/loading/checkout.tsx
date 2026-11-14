

import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 space-y-3">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="space-y-8 lg:col-span-2">
          {/* Shipping Information */}
          <section className="rounded-xl border p-5 sm:p-6">
            <Skeleton className="mb-6 h-6 w-52" />

            <div className="space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            </div>
          </section>

          {/* Payment Details */}
          <section className="rounded-xl border p-5 sm:p-6">
            <Skeleton className="mb-6 h-6 w-44" />

            <Skeleton className="mb-5 h-20 w-full rounded-lg" />

            <div className="space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-xl border p-5">
          <Skeleton className="mb-6 h-6 w-40" />

          <div className="space-y-5">
            {[1, 2].map((item) => (
              <div key={item} className="flex gap-3">
                <Skeleton className="size-16 shrink-0 rounded-lg" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>

              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>

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
