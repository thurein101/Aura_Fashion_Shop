
import { Skeleton } from "@/components/ui/skeleton";

const main = "bg-[#DED7CC]";
const light = "bg-[#E9E3DA]";

export function FormSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-[#F9F8F6]">
      <div className="mb-8 flex flex-col items-center space-y-3 md:items-start">
        <Skeleton className={`h-8 w-48 rounded-lg ${main}`} />
        <Skeleton className={`h-3 w-64 ${light}`} />
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Skeleton className={`h-3 w-24 ${main}`} />
          <Skeleton className={`h-12 w-full rounded-lg ${main}`} />
        </div>

        <div className="space-y-2">
          <Skeleton className={`h-3 w-20 ${main}`} />
          <Skeleton className={`h-12 w-full rounded-lg ${main}`} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className={`h-3 w-24 ${main}`} />
            <Skeleton className={`h-12 w-full rounded-lg ${main}`} />
          </div>
          <div className="space-y-2">
            <Skeleton className={`h-3 w-20 ${main}`} />
            <Skeleton className={`h-12 w-full rounded-lg ${main}`} />
          </div>
        </div>

        <Skeleton className="mt-3 h-12 w-full rounded-full bg-[#D2C8B9]" />
      </div>

      <div className="flex justify-center pt-7">
        <Skeleton className={`h-3 w-48 ${light}`} />
      </div>
    </div>
  );
}
