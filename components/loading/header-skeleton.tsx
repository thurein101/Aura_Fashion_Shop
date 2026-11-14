import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderLoading() {
  return (
   
    <div className="w-full h-16 border-b border-stone-200 bg-stone-50/85 flex items-center justify-between px-4 md:px-6">
      
   
      <div className="flex items-center">
        <Skeleton className="h-8 w-24 rounded-md bg-stone-200" />
      </div>

   
      <nav className="hidden md:flex items-center gap-8">
        <Skeleton className="h-4 w-12 bg-stone-200" />
        <Skeleton className="h-4 w-16 bg-stone-200" />
        <Skeleton className="h-4 w-12 bg-stone-200" />
        <Skeleton className="h-4 w-24 bg-stone-200" />
      </nav>

  
      <div className="flex items-center gap-4 md:gap-6">
        
     
        <Skeleton className="h-8 w-8 rounded-full bg-stone-200" />
        
    
        <Skeleton className="hidden sm:block h-8 w-8 rounded-full bg-stone-200" />
        
       
        <Skeleton className="md:hidden h-8 w-8 rounded-md bg-stone-200" />
        
      </div>
    </div>
  );
}