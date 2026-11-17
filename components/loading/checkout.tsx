
import { Skeleton } from "@/components/ui/skeleton";

const main = "bg-[#DED7CC]";
const light = "bg-[#E9E3DA]";

export function CheckoutSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl bg-[#F9F8F6] px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6 space-y-3 sm:mb-8">
        <Skeleton className={`h-8 w-40 sm:h-9 sm:w-44 ${main}`} />
        <Skeleton className={`h-4 w-48 max-w-full sm:w-64 ${light}`} />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 sm:space-y-8 lg:col-span-2">
          <section className="rounded-xl border border-[#E8E1D7] bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
            <Skeleton className={`mb-5 h-6 w-44 sm:mb-6 sm:w-52 ${main}`} />

            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Skeleton className={`h-4 w-28 ${main}`} />
                <Skeleton className={`h-11 w-full rounded-lg sm:h-12 ${light}`} />
              </div>

              <div className="space-y-2">
                <Skeleton className={`h-4 w-32 ${main}`} />
                <Skeleton className={`h-11 w-full rounded-lg sm:h-12 ${light}`} />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#E8E1D7] bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
            <Skeleton className={`mb-5 h-6 w-40 sm:mb-6 sm:w-44 ${main}`} />
            <Skeleton className={`mb-5 h-16 w-full rounded-xl sm:h-20 ${main}`} />

            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Skeleton className={`h-4 w-36 ${main}`} />
                <Skeleton className={`h-11 w-full rounded-lg sm:h-12 ${light}`} />
              </div>

              <div className="space-y-2">
                <Skeleton className={`h-4 w-28 ${main}`} />
                <Skeleton className={`h-11 w-full rounded-lg sm:h-12 ${light}`} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className={`h-4 w-24 ${main}`} />
                  <Skeleton className={`h-11 w-full rounded-lg sm:h-12 ${light}`} />
                </div>

                <div className="space-y-2">
                  <Skeleton className={`h-4 w-16 ${main}`} />
                  <Skeleton className={`h-11 w-full rounded-lg sm:h-12 ${light}`} />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="h-fit min-w-0 rounded-xl border border-[#E8E1D7] bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5 lg:sticky lg:top-6">
          <Skeleton className={`mb-5 h-6 w-36 sm:mb-6 sm:w-40 ${main}`} />

          <div className="space-y-4 sm:space-y-5">
            {[1, 2].map((item) => (
              <div key={item} className="flex min-w-0 gap-3">
                <Skeleton className={`size-14 shrink-0 rounded-lg sm:size-16 ${main}`} />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className={`h-4 w-3/4 ${main}`} />
                  <Skeleton className={`h-3 w-1/3 ${light}`} />
                  <Skeleton className={`h-4 w-20 ${main}`} />
                </div>
              </div>
            ))}

            <div className="space-y-3 border-t border-[#E8E1D7] pt-4">
              <div className="flex justify-between gap-3">
                <Skeleton className={`h-4 w-20 ${light}`} />
                <Skeleton className={`h-4 w-20 ${main}`} />
              </div>

              <div className="flex justify-between gap-3">
                <Skeleton className={`h-4 w-20 ${light}`} />
                <Skeleton className={`h-4 w-20 ${main}`} />
              </div>

              <div className="flex justify-between gap-3">
                <Skeleton className={`h-5 w-16 ${main}`} />
                <Skeleton className={`h-6 w-24 ${main}`} />
              </div>
            </div>

            <Skeleton className="h-11 w-full rounded-full bg-[#D2C8B9] sm:h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
