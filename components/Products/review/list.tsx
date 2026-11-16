
"use client";

import type { ProductReviewItem } from "@/lib/product-type";
import ReviewCard from "./card";

type Props = {
  productId: string;
  reviews: ProductReviewItem[];
  currentUserId?: string;
  onChanged: () => Promise<void>;
};

export default function ReviewList({
  productId,
  reviews,
  currentUserId,
  onChanged,
}: Props) {
  if (!reviews.length) {
    return (
      <div className="rounded-xl border border-dashed px-4 py-12 text-center">
        <p className="text-sm font-medium">No reviews yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Be the first to share your experience.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          productId={productId}
          review={review}
          currentUserId={currentUserId}
          onChanged={onChanged}
        />
      ))}
    </div>
  );
}
