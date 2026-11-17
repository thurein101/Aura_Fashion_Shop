
import { Skeleton } from "@/components/ui/skeleton";

const main = "bg-[#DED7CC]";
const light = "bg-[#E9E3DA]";

export function CheckoutSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl bg-[#F9F8F6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <Skeleton className={`h-9 w-44 ${main}`} />
        <Skeleton className={`h-4 w-64 ${light}`} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-2xl border border-[#E8E1D7] bg-white p-5 shadow-sm sm:p-6">
            <Skeleton className={`mb-6 h-6 w-52 ${main}`} />

            <div className="space-y-5">
              <div className="space-y-2">
                <Skeleton className={`h-4 w-28 ${main}`} />
                <Skeleton className={`h-12 w-full rounded-lg ${light}`} />
              </div>

              <div className="space-y-2">
                <Skeleton className={`h-4 w-32 ${main}`} />
                <Skeleton className={`h-12 w-full rounded-lg ${light}`} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E8E1D7] bg-white p-5 shadow-sm sm:p-6">
            <Skeleton className={`mb-6 h-6 w-44 ${main}`} />
            <Skeleton className={`mb-5 h-20 w-full rounded-xl ${main}`} />

            <div className="space-y-5">
              <div className="space-y-2">
                <Skeleton className={`h-4 w-36 ${main}`} />
                <Skeleton className={`h-12 w-full rounded-lg ${light}`} />
              </div>

              <div className="space-y-2">
                <Skeleton className={`h-4 w-28 ${main}`} />
                <Skeleton className={`h-12 w-full rounded-lg ${light}`} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className={`h-4 w-24 ${main}`} />
                  <Skeleton className={`h-12 w-full rounded-lg ${light}`} />
                </div>
                <div className="space-y-2">
                  <Skeleton className={`h-4 w-16 ${main}`} />
                  <Skeleton className={`h-12 w-full rounded-lg ${light}`} />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="h-fit rounded-2xl border border-[#E8E1D7] bg-white p-5 shadow-sm">
          <Skeleton className={`mb-6 h-6 w-40 ${main}`} />

          <div className="space-y-5">
            {[1, 2].map((item) => (
              <div key={item} className="flex gap-3">
                <Skeleton className={`size-16 shrink-0 rounded-lg ${main}`} />
                <div className="flex-1 space-y-2">
                  <Skeleton className={`h-4 w-3/4 ${main}`} />
                  <Skeleton className={`h-3 w-1/3 ${light}`} />
                  <Skeleton className={`h-4 w-20 ${main}`} />
                </div>
              </div>
            ))}

            <div className="space-y-3 border-t border-[#E8E1D7] pt-4">
              <div className="flex justify-between">
                <Skeleton className={`h-4 w-20 ${light}`} />
                <Skeleton className={`h-4 w-20 ${main}`} />
              </div>
              <div className="flex justify-between">
                <Skeleton className={`h-4 w-20 ${light}`} />
                <Skeleton className={`h-4 w-20 ${main}`} />
              </div>
              <div className="flex justify-between">
                <Skeleton className={`h-5 w-16 ${main}`} />
                <Skeleton className={`h-6 w-24 ${main}`} />
              </div>
            </div>

            <Skeleton className="h-12 w-full rounded-full bg-[#D2C8B9]" />
          </div>
        </div>
      </div>
    </div>
  );
}
