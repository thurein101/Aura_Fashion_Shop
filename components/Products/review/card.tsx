
"use client";

import Image from "next/image";
import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import type { ProductReviewItem } from "@/lib/product-type";
import ReviewEditDialog from "./edit";
import ReviewDeleteDialog from "./delete";

type Props = {
  productId: string;
  review: ProductReviewItem;
  currentUserId?: string;
  onChanged: () => Promise<void>;
};

export default function ReviewCard({
  productId,
  review,
  currentUserId,
  onChanged,
}: Props) {
  const isOwner = currentUserId === review.userId;

  const initial = review.user.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <article className="space-y-3 rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-9 border">
            <AvatarImage src={review.user.image ?? undefined} />
            <AvatarFallback className="text-xs">
              {initial}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {review.user.name}
              {isOwner && (
                <span className="ml-2 text-[10px] font-normal text-muted-foreground">
                  You
                </span>
              )}
            </p>

            <p className="text-[11px] text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString()}
              {review.updatedAt !== review.createdAt && " · Edited"}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="flex shrink-0 items-center gap-1">
            <ReviewEditDialog
              productId={productId}
              review={review}
              onUpdated={onChanged}
            />

            <ReviewDeleteDialog
              productId={productId}
              reviewId={review.id}
              onDeleted={onChanged}
            />
          </div>
        )}
      </div>

      {review.rating !== null && (
        <div
          className="flex items-center gap-0.5"
          aria-label={`${review.rating} out of 5 stars`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`size-3.5 ${
                star <= review.rating!
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      )}

      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground/90">
        {review.comment}
      </p>

      {review.imageUrls.length > 0 && (
        <>
          <Separator />

          <div className="flex flex-wrap gap-2">
            {review.imageUrls.map((url, index) => (
              <a
                key={review.imagePublicIds[index] ?? url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="relative size-[76px] overflow-hidden rounded-lg border bg-muted sm:size-20"
              >
                <Image
                  src={url}
                  alt={`Review photo ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform hover:scale-105"
                />
              </a>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
