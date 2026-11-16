
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, LoaderCircle } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import ReviewImageUpload from "./ImageUpload";

import {
  reviewFormSchema,
} from "@/lib/validation/review";

import type {
  ReviewFormValues,
  ReviewImage,
} from "@/lib/product-type";

type Props = {
  productId: string;
  defaultValues?: ReviewFormValues;
  submitLabel: string;
  isPending?: boolean;
  onSubmit: (values: ReviewFormValues) => Promise<void>;
  onImagesChange?: (images: ReviewImage[]) => void;
};

const emptyValues: ReviewFormValues = {
  comment: "",
  rating: null,
  images: [],
};

export default function ReviewForm({
  productId,
  defaultValues,
  submitLabel,
  isPending = false,
  onSubmit,
  onImagesChange,
}: Props) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: defaultValues ?? emptyValues,
  });

  const rating = form.watch("rating");
  const images = form.watch("images");

  const handleRating = (value: number) => {
    form.setValue(
      "rating",
      rating === value ? null : value,
      { shouldDirty: true }
    );
  };

  const handleImages = (nextImages: ReviewImage[]) => {
    
    form.setValue("images", nextImages, {
      shouldDirty: true,
      shouldValidate: true,
      
    });
    onImagesChange?.(nextImages);
  };

  const handleSubmit = async (values: ReviewFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-5"
      >
        {/* Optional Rating */}
        <FormField
          control={form.control}
          name="rating"
          render={() => (
            <FormItem>
              <FormLabel className="text-sm">
                Rating <span className="text-muted-foreground">(Optional)</span>
              </FormLabel>

              <FormControl>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={isPending}
                      onClick={() => handleRating(star)}
                      aria-label={`${star} star rating`}
                      aria-pressed={rating === star}
                      className="rounded-sm p-1 outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Star
                        className={`size-5 transition-colors ${
                          rating !== null && star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/40 hover:text-amber-400"
                        }`}
                      />
                    </button>
                  ))}

                  {rating !== null && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {rating}/5
                    </span>
                  )}
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Required Comment */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>
                  Your comment <span className="text-destructive">*</span>
                </FormLabel>

                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {field.value.length}/3000
                </span>
              </div>

              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  maxLength={3000}
                  disabled={isPending}
                  placeholder="Share your experience with this product..."
                  className="min-h-28 resize-y text-sm leading-6"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Multiple Images */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormControl>
                <ReviewImageUpload
                  productId={productId}
                  value={images}
                  onChange={handleImages}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="min-w-32 gap-2"
          >
            {isPending && (
              <LoaderCircle className="size-4 animate-spin" />
            )}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
