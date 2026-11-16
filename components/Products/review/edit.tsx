"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import ReviewForm from "./ReviewForm";

import {
  cleanupUnusedReviewImagesAction,
  updateReviewAction,
} from "@/app/actions/review";

import type {
  ProductReviewItem,
  ReviewFormValues,
  ReviewImage,
} from "@/lib/product-type";

type Props = {
  productId: string;
  review: ProductReviewItem;
  onUpdated: () => Promise<void>;
};

export default function ReviewEditDialog({
  productId,
  review,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [currentImages, setCurrentImages] = useState<ReviewImage[]>(() =>
    review.imagePublicIds.map((publicId, index) => ({
      publicId,
      url: review.imageUrls[index],
    })),
  );

  const defaultValues: ReviewFormValues = {
    comment: review.comment,
    rating: review.rating,
    images: review.imagePublicIds.map((publicId, index) => ({
      publicId,
      url: review.imageUrls[index],
    })),
  };

 const handleOpenChange = (nextOpen: boolean) => {
  // Open immediately
  if (nextOpen) {
    setOpen(true);
    return;
  }

  // Prevent closing while saving
  if (isPending) return;

  // Close immediately — do not wait for Cloudinary cleanup
  setOpen(false);

  // Run cleanup in the background
  void cleanupUnusedReviewImagesAction({
    publicIds: currentImages.map((image) => image.publicId),
  }).catch((error) => {
    console.error("Review image cleanup failed:", error);
  });
};

  const handleSubmit = async (values: ReviewFormValues) => {
    setIsPending(true);

    try {
      const result = await updateReviewAction({
        reviewId: review.id,
        productId,
        comment: values.comment,
        rating: values.rating,
        imagePublicIds: values.images.map((image) => image.publicId),
      });

      if (!result.success) {
        toast.error(result.error || "Unable to update review");
        return;
      }

      toast.success("Review updated");
      setOpen(false);
      await onUpdated();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 gap-1.5 px-2.5">
          <Pencil className="size-3.5" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit your review</DialogTitle>
          <DialogDescription>
            Update your comment, rating and photos.
          </DialogDescription>
        </DialogHeader>

        <ReviewForm
          productId={productId}
          defaultValues={defaultValues}
          submitLabel="Save changes"
          isPending={isPending}
          onSubmit={handleSubmit}
          onImagesChange={setCurrentImages}
        />
      </DialogContent>
    </Dialog>
  );
}
