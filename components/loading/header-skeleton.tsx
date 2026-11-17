
import { Skeleton } from "@/components/ui/skeleton";

const main = "bg-[#DED7CC]";
const light = "bg-[#E9E3DA]";

export default function HeaderLoading() {
  return (
    <header className="sticky top-0 z-40 h-14 w-full border-b border-[#E8E1D7] bg-[#F9F8F6] px-3 sm:h-16 sm:px-6">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex shrink-0 items-center">
          <Skeleton className={`h-7 w-24 rounded-lg sm:h-8 sm:w-28 ${main}`} />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 md:flex lg:gap-8">
          <Skeleton className={`h-4 w-12 ${main}`} />
          <Skeleton className={`h-4 w-16 ${main}`} />
          <Skeleton className={`h-4 w-12 ${main}`} />
          <Skeleton className={`h-4 w-24 ${main}`} />
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-5">
          <Skeleton className={`size-8 rounded-full sm:size-9 ${main}`} />

          <Skeleton className={`hidden size-9 rounded-full sm:block ${light}`} />

          {/* Mobile Menu */}
          <Skeleton className={`size-8 rounded-lg md:hidden sm:size-9 ${main}`} />
        </div>
      </div>
    </header>
  );
}
