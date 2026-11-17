
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl space-y-6 bg-[#F9F8F6] px-4 py-8">
      {/* Header & Filter */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-[#E8E1D7] pb-6 sm:flex-row sm:items-end">
        <div className="space-y-3">
          <Skeleton className="h-9 w-64 rounded-lg bg-[#DED7CC]" />
          <Skeleton className="h-4 w-96 max-w-full bg-[#E9E3DA]" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 w-20 rounded-full bg-[#DED7CC]" />
          <Skeleton className="h-10 w-20 rounded-full bg-[#DED7CC]" />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 pb-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="space-y-4 rounded-2xl border border-[#E8E1D7] bg-white p-3 shadow-sm sm:p-4"
          >
            <Skeleton className="h-48 w-full rounded-xl bg-[#DED7CC] sm:h-64" />

            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4 bg-[#DED7CC]" />
              <Skeleton className="h-4 w-1/2 bg-[#E9E3DA]" />
              <Skeleton className="h-5 w-1/3 bg-[#D2C8B9]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
