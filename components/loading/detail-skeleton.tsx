
import { Skeleton } from "@/components/ui/skeleton";

const main = "bg-[#DED7CC]";
const light = "bg-[#E9E3DA]";

export default function ProductDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse bg-[#F9F8F6] px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-2 sm:mb-8 sm:gap-3">
        <Skeleton className={`h-3 w-12 sm:h-4 sm:w-16 ${light}`} />
        <Skeleton className="h-3 w-2 bg-[#CFC5B8] sm:h-4 sm:w-3" />
        <Skeleton className={`h-3 w-20 sm:h-4 sm:w-24 ${light}`} />
        <Skeleton className="h-3 w-2 bg-[#CFC5B8] sm:h-4 sm:w-3" />
        <Skeleton className={`h-3 w-24 sm:h-4 sm:w-32 ${main}`} />
      </div>

      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="min-w-0 space-y-3 sm:space-y-4">
          <Skeleton className={`h-[300px] w-full rounded-xl sm:h-[400px] sm:rounded-2xl md:h-[450px] lg:h-[500px] ${main}`} />

          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton
                key={item}
                className={`aspect-square w-full rounded-lg sm:rounded-xl ${main}`}
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="flex min-w-0 flex-col space-y-5 sm:space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className={`h-7 w-3/4 rounded-lg sm:h-8 ${main}`} />
              <Skeleton className={`h-4 w-1/4 ${light}`} />
            </div>
            <Skeleton className={`size-10 shrink-0 rounded-full sm:size-11 ${main}`} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className={`h-7 w-24 rounded-lg sm:h-8 sm:w-28 ${main}`} />
            <Skeleton className={`h-6 w-20 rounded-md ${light}`} />
          </div>

          <div className="h-px w-full bg-[#E5DED4]" />

          <div className="space-y-3">
            <Skeleton className={`h-4 w-full ${light}`} />
            <Skeleton className={`h-4 w-full ${light}`} />
            <Skeleton className={`h-4 w-4/5 ${light}`} />
          </div>

          <div className="space-y-4 pt-2 sm:pt-3">
            <Skeleton className={`h-4 w-20 ${main}`} />
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[1, 2, 3].map((item) => (
                <Skeleton
                  key={item}
                  className={`h-10 w-14 rounded-lg sm:h-11 sm:w-16 ${main}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2 sm:space-y-4 sm:pt-4">
            <div className="flex flex-wrap gap-3">
              <Skeleton className={`h-11 w-28 rounded-xl sm:h-12 sm:w-32 ${main}`} />
              <Skeleton className="h-11 min-w-0 flex-1 rounded-xl bg-[#D2C8B9] sm:h-12" />
            </div>

            <Skeleton className="h-11 w-full rounded-xl bg-[#D2C8B9] sm:h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
