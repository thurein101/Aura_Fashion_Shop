import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Shadcn UI ရဲ့ Skeleton ကို သုံးထားသည်

export default function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
  
      <div className="flex items-center space-x-2 mb-6">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
   
        <div className="space-y-4">
      
          <Skeleton className="w-full h-[400px] md:h-[500px] rounded-xl" />
          
    
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </div>

      
        <div className="space-y-6 flex flex-col justify-start">
      
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/4 rounded-md" />
            </div>
       
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>


          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-28 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>

          <div className="h-[1px] w-full bg-muted my-2" />


          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>


          <div className="space-y-3 pt-4">
            <Skeleton className="h-4 w-20 rounded" />
            <div className="flex space-x-3">
              <Skeleton className="h-10 w-16 rounded-md" />
              <Skeleton className="h-10 w-16 rounded-md" />
              <Skeleton className="h-10 w-16 rounded-md" />
            </div>
          </div>

   
          <div className="space-y-4 pt-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-32 rounded-lg" /> 
              <Skeleton className="h-12 flex-1 rounded-lg" />  
            </div>
            <Skeleton className="h-12 w-full rounded-lg" /> 
          </div>
        </div>
      </div>
    </div>
  );
}