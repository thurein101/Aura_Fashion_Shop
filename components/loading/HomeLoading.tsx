import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header & Filter Section Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b pb-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64 bg-stone-200" />
          <Skeleton className="h-4 w-96 max-w-full bg-stone-100" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-full bg-stone-200" />
          <Skeleton className="h-9 w-20 rounded-full bg-stone-200" />
        </div>
      </div>

      {/* Product Grid Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm space-y-4">
            <Skeleton className="w-full h-64 rounded-xl bg-stone-200" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 bg-stone-200" />
              <Skeleton className="h-4 w-1/2 bg-stone-200" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}