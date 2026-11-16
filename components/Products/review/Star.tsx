
"use client";

import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ReviewPageResult } from "@/lib/product-type";

type Props = {
  data: ReviewPageResult;
};

export default function ReviewSummary({ data }: Props) {
  const ratedCount = data.ratedCount || 0;

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
        <div className="space-y-1">
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {data.averageRating?.toFixed(1) ?? "—"}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              / 5
            </span>
          </p>

          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-4 ${
                  data.averageRating && star <= Math.round(data.averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            {ratedCount} rated reviews
          </p>
        </div>

        <Separator className="sm:hidden" />

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = data.ratingCounts[star] ?? 0;
            const percentage = ratedCount
              ? (count / ratedCount) * 100
              : 0;

            return (
              <div
                key={star}
                className="grid grid-cols-[12px_1fr_28px] items-center gap-3"
              >
                <span className="text-xs text-muted-foreground">
                  {star}
                </span>

                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="text-right text-xs tabular-nums text-muted-foreground">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Separator className="my-4" />

      <p className="text-xs text-muted-foreground">
        {data.totalCount} total customer reviews
      </p>
    </div>
  );
}
