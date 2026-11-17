
import { Skeleton } from "@/components/ui/skeleton";

const main = "bg-[#DED7CC]";
const light = "bg-[#E9E3DA]";

export default function HomeLoading() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl space-y-5 bg-[#F9F8F6] px-3 py-6 sm:space-y-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header & Filter */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-[#E8E1D7] pb-5 sm:flex-row sm:items-end sm:pb-6">
        <div className="w-full min-w-0 space-y-3">
          <Skeleton className={`h-8 w-48 max-w-full rounded-lg sm:h-9 sm:w-64 ${main}`} />
          <Skeleton className={`h-3 w-64 max-w-full sm:h-4 sm:w-96 ${light}`} />
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <Skeleton className={`h-9 w-20 rounded-full sm:h-10 ${main}`} />
          <Skeleton className={`h-9 w-20 rounded-full sm:h-10 ${main}`} />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3 pb-10 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 lg:pb-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="min-w-0 space-y-3 rounded-xl border border-[#E8E1D7] bg-white p-2.5 shadow-sm sm:space-y-4 sm:rounded-2xl sm:p-4"
          >
            <Skeleton className={`aspect-[3/4] w-full rounded-lg sm:rounded-xl ${main}`} />

            <div className="space-y-2 sm:space-y-3">
              <Skeleton className={`h-3 w-3/4 sm:h-4 ${main}`} />
              <Skeleton className={`h-3 w-1/2 sm:h-4 ${light}`} />
              <Skeleton className={`h-4 w-1/3 sm:h-5 ${main}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
