import { Skeleton } from "@/components/ui/skeleton"

export function FormSkeleton() {
  return (
    <div className="w-full">
      
      {/* Header Skeleton */}
      <div className="flex flex-col items-center md:items-start mb-8 space-y-2">
        <Skeleton className="h-8 w-48 bg-stone-200/60" />
        <Skeleton className="h-3 w-64 bg-stone-200/60" />
      </div>

      {/* Form Fields Skeleton */}
      <div className="space-y-4">
        
        {/* Full Name Field */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 bg-stone-200/60" />
          <Skeleton className="h-11 w-full rounded-md bg-stone-200/60" />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 bg-stone-200/60" />
          <Skeleton className="h-11 w-full rounded-md bg-stone-200/60" />
        </div>

        {/* Password & Confirm Password (Grid) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 bg-stone-200/60" />
            <Skeleton className="h-11 w-full rounded-md bg-stone-200/60" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 bg-stone-200/60" />
            <Skeleton className="h-11 w-full rounded-md bg-stone-200/60" />
          </div>
        </div>

        {/* Submit Button Skeleton */}
        <div className="pt-2">
          <Skeleton className="h-11 w-full rounded-full bg-stone-300/60" />
        </div>

      </div>

      {/* Footer Link Skeleton */}
      <div className="flex justify-center pt-6">
        <Skeleton className="h-3 w-48 bg-stone-200/60" />
      </div>

    </div>
  )
}