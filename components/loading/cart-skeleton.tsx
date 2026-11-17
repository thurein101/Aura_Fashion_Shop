
import { Skeleton } from "@/components/ui/skeleton";

const main = "bg-[#DED7CC]";
const light = "bg-[#E9E3DA]";

export function CartSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl bg-[#F9F8F6] px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6 space-y-3 sm:mb-8">
        <Skeleton className={`h-8 w-36 sm:h-9 sm:w-40 ${main}`} />
        <Skeleton className={`h-4 w-44 max-w-full sm:w-56 ${light}`} />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 lg:col-span-2 sm:space-y-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex min-w-0 gap-3 rounded-xl border border-[#E8E1D7] bg-white p-3 shadow-sm sm:gap-4 sm:rounded-2xl sm:p-4"
            >
              <Skeleton className={`size-20 shrink-0 rounded-lg sm:size-28 md:size-32 sm:rounded-xl ${main}`} />

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-1">
                <div className="min-w-0 space-y-2 sm:space-y-3">
                  <Skeleton className={`h-4 w-3/4 max-w-full sm:h-5 ${main}`} />
                  <Skeleton className={`h-3 w-1/2 sm:h-4 ${light}`} />
                  <Skeleton className={`h-3 w-20 sm:h-4 sm:w-24 ${light}`} />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Skeleton className={`h-7 w-20 rounded-lg sm:h-8 sm:w-24 ${main}`} />
                  <Skeleton className={`h-4 w-16 sm:h-5 sm:w-20 ${main}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit min-w-0 rounded-xl border border-[#E8E1D7] bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5 lg:sticky lg:top-6">
          <Skeleton className={`mb-5 h-6 w-32 sm:mb-6 sm:w-36 ${main}`} />

          <div className="space-y-4 sm:space-y-5">
            <div className="flex justify-between gap-3">
              <Skeleton className={`h-4 w-20 ${light}`} />
              <Skeleton className={`h-4 w-20 ${main}`} />
            </div>

            <div className="flex justify-between gap-3">
              <Skeleton className={`h-4 w-20 ${light}`} />
              <Skeleton className={`h-4 w-20 ${main}`} />
            </div>

            <div className="border-t border-[#E8E1D7] pt-4">
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
