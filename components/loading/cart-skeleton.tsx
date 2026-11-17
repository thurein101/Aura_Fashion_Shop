
import { Skeleton } from "@/components/ui/skeleton";

const main = "bg-[#DED7CC]";
const light = "bg-[#E9E3DA]";

export function CartSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl bg-[#F9F8F6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <Skeleton className={`h-9 w-40 ${main}`} />
        <Skeleton className={`h-4 w-56 ${light}`} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex gap-4 rounded-2xl border border-[#E8E1D7] bg-white p-4 shadow-sm"
            >
              <Skeleton className={`size-24 shrink-0 rounded-xl sm:size-32 ${main}`} />

              <div className="flex flex-1 flex-col justify-between py-1">
                <div className="space-y-3">
                  <Skeleton className={`h-5 w-3/4 ${main}`} />
                  <Skeleton className={`h-4 w-1/2 ${light}`} />
                  <Skeleton className={`h-4 w-24 ${light}`} />
                </div>

                <div className="flex items-center justify-between">
                  <Skeleton className={`h-8 w-24 rounded-lg ${main}`} />
                  <Skeleton className={`h-5 w-20 ${main}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-[#E8E1D7] bg-white p-5 shadow-sm">
          <Skeleton className={`mb-6 h-6 w-36 ${main}`} />

          <div className="space-y-5">
            <div className="flex justify-between">
              <Skeleton className={`h-4 w-20 ${light}`} />
              <Skeleton className={`h-4 w-20 ${main}`} />
            </div>

            <div className="flex justify-between">
              <Skeleton className={`h-4 w-20 ${light}`} />
              <Skeleton className={`h-4 w-20 ${main}`} />
            </div>

            <div className="border-t border-[#E8E1D7] pt-4">
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
