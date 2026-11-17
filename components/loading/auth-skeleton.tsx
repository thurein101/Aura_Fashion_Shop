
import { Skeleton } from "@/components/ui/skeleton";

const main = "bg-[#DED7CC]";
const light = "bg-[#E9E3DA]";

export function FormSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-[#F9F8F6]">
      <div className="mb-6 flex flex-col items-center space-y-3 sm:mb-8 md:items-start">
        <Skeleton className={`h-7 w-40 rounded-lg sm:h-8 sm:w-48 ${main}`} />
        <Skeleton className={`h-3 w-48 max-w-full sm:w-64 ${light}`} />
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <Skeleton className={`h-3 w-24 ${main}`} />
          <Skeleton className={`h-11 w-full rounded-lg sm:h-12 ${main}`} />
        </div>

        <div className="space-y-2">
          <Skeleton className={`h-3 w-20 ${main}`} />
          <Skeleton className={`h-11 w-full rounded-lg sm:h-12 ${main}`} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className={`h-3 w-24 ${main}`} />
            <Skeleton className={`h-11 w-full rounded-lg sm:h-12 ${main}`} />
          </div>

          <div className="space-y-2">
            <Skeleton className={`h-3 w-20 ${main}`} />
            <Skeleton className={`h-11 w-full rounded-lg sm:h-12 ${main}`} />
          </div>
        </div>

        <Skeleton className="mt-3 h-11 w-full rounded-full bg-[#D2C8B9] sm:h-12" />
      </div>

      <div className="flex justify-center pt-6 sm:pt-7">
        <Skeleton className={`h-3 w-40 max-w-full sm:w-48 ${light}`} />
      </div>
    </div>
  );
}
