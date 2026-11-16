
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  hasPrevious: boolean;
  hasNext: boolean;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export default function ReviewPagination({
  page,
  hasPrevious,
  hasNext,
  isLoading,
  onPrevious,
  onNext,
}: Props) {
  return (
    <div className="flex items-center justify-between border-t pt-4">
      <p className="text-xs text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onPrevious}
          disabled={!hasPrevious || isLoading}
          className="h-8 gap-1 px-2.5"
        >
          <ChevronLeft className="size-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onNext}
          disabled={!hasNext || isLoading}
          className="h-8 gap-1 px-2.5"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
