
import { Skeleton } from "@/components/ui/skeleton";

const main = "bg-[#DED7CC]";
const light = "bg-[#E9E3DA]";

export default function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse bg-[#F9F8F6] px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-3">
        <Skeleton className={`h-4 w-16 ${light}`} />
        <Skeleton className="h-4 w-3 bg-[#CFC5B8]" />
        <Skeleton className={`h-4 w-24 ${light}`} />
        <Skeleton className="h-4 w-3 bg-[#CFC5B8]" />
        <Skeleton className={`h-4 w-32 ${main}`} />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <Skeleton className={`h-[400px] w-full rounded-2xl md:h-[500px] ${main}`} />

          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton
                key={item}
                className={`h-20 w-full rounded-xl ${main}`}
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="flex flex-col space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <Skeleton className={`h-8 w-3/4 rounded-lg ${main}`} />
              <Skeleton className={`h-4 w-1/4 ${light}`} />
            </div>
            <Skeleton className={`size-11 rounded-full ${main}`} />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className={`h-8 w-28 rounded-lg ${main}`} />
            <Skeleton className={`h-6 w-20 rounded-md ${light}`} />
          </div>

          <div className="h-px w-full bg-[#E5DED4]" />

          <div className="space-y-3">
            <Skeleton className={`h-4 w-full ${light}`} />
            <Skeleton className={`h-4 w-full ${light}`} />
            <Skeleton className={`h-4 w-4/5 ${light}`} />
          </div>

          <div className="space-y-4 pt-3">
            <Skeleton className={`h-4 w-20 ${main}`} />
            <div className="flex gap-3">
              {[1, 2, 3].map((item) => (
                <Skeleton
                  key={item}
                  className={`h-11 w-16 rounded-lg ${main}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex gap-4">
              <Skeleton className={`h-12 w-32 rounded-xl ${main}`} />
              <Skeleton className="h-12 flex-1 rounded-xl bg-[#D2C8B9]" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl bg-[#D2C8B9]" />
          </div>
        </div>
      </div>
    </div>
  );
}
