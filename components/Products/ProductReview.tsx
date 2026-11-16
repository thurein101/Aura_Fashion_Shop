
"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageSquareText, LogIn } from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  getProductReviewsAction,
  getMyProductReviewAction,
  createReviewAction,
} from "@/app/actions/review";

import type {
  ProductReviewItem,
  ReviewFormValues,
  ReviewPageResult,
} from "@/lib/product-type";

import ReviewSummary from "./review/Star";
import ReviewList from "./review/list";
import ReviewForm from "./review/ReviewForm";
import ReviewEditDialog from "./review/edit";
import ReviewDeleteDialog from "./review/delete";
import ReviewPagination from "./review/pagination";
import ReviewSkeleton from "./review/skeleton";

type Props = {
  productId: string;
};

export default function ProductReviews({ productId }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const [pageData, setPageData] = useState<ReviewPageResult | null>(null);
  const [myReview, setMyReview] = useState<ProductReviewItem | null>(null);

  const [cursors, setCursors] = useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, startSubmit] = useTransition();

  const loadPage = useCallback(
    async (cursor: string | null) => {
      setIsLoading(true);

      try {
        const result = await getProductReviewsAction(productId, cursor);

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        setPageData(result.data);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load reviews");
      } finally {
        setIsLoading(false);
      }
    },
    [productId]
  );

  const loadMyReview = useCallback(async () => {
    try {
      const result = await getMyProductReviewAction(productId);

      if (result.success) {
        setMyReview(result.review as ProductReviewItem | null);
      }
    } catch (error) {
      console.error("Load my review:", error);
    }
  }, [productId]);

  const refreshReviews = useCallback(async () => {
    setPageIndex(0);
    setCursors([null]);

    await Promise.all([
      loadPage(null),
      loadMyReview(),
    ]);
  }, [loadPage, loadMyReview]);

  useEffect(() => {
    void refreshReviews();
  }, [refreshReviews]);

  const handleCreate = async (values: ReviewFormValues) => {
    startSubmit(async () => {
      try {
        const result = await createReviewAction({
          productId,
          comment: values.comment,
          rating: values.rating,
          imagePublicIds: values.images.map((image) => image.publicId),
        });

        if (!result.success) {
          toast.error(result.error || "Unable to submit review");
          return;
        }

        toast.success("Your review has been submitted");
        await refreshReviews();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  };

  const handleNext = async () => {
    if (!pageData?.nextCursor || isLoading) return;

    const nextCursor = pageData.nextCursor;
    const nextIndex = pageIndex + 1;

    setCursors((previous) => [
      ...previous.slice(0, nextIndex),
      nextCursor,
    ]);

    setPageIndex(nextIndex);
    await loadPage(nextCursor);
  };

  const handlePrevious = async () => {
    if (pageIndex === 0 || isLoading) return;

    const previousIndex = pageIndex - 1;
    const previousCursor = cursors[previousIndex];

    setPageIndex(previousIndex);
    await loadPage(previousCursor);
  };

  const pageReviews = pageData?.reviews ?? [];

  // My review is shown separately above the paginated list.
  const otherReviews = pageReviews.filter(
    (review) => review.id !== myReview?.id
  );

  return (
    <section
      id="customer-reviews"
      className="mx-auto mt-14 w-full max-w-6xl border-t border-border pt-9 sm:mt-16 sm:pt-12"
    >
      {/* Heading */}
      <div className="mb-6 flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <MessageSquareText className="size-5" />
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Customer Reviews
          </h2>

          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Honest feedback from our customers.
          </p>
        </div>
      </div>

      {/* Summary */}
      {pageData && <ReviewSummary data={pageData} />}

      <div className="mt-7 space-y-6">
        {/* Guest prompt */}
        {!session && (
          <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-sm font-medium">
                Share your experience
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                You need to login if you want to comment.
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => router.push("/login")}
              className="w-full gap-2 sm:w-auto"
            >
              <LogIn className="size-3.5" />
              Login to comment
            </Button>
          </div>
        )}

        {/* Create Form */}
        {session && !myReview && (
          <div className="rounded-xl border bg-card p-4 sm:p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold">
                Write a review
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Tell others about your experience with this product.
              </p>
            </div>

            <ReviewForm
              productId={productId}
              submitLabel="Post review"
              isPending={isSubmitting}
              onSubmit={handleCreate}
            />
          </div>
        )}

        {/* Your Review */}
        {myReview && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Your review</h3>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
                Your account
              </span>
            </div>

            <article className="rounded-xl border border-primary/20 bg-primary/[0.025] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Your feedback
                </p>

                <div className="flex items-center gap-1">
                  <ReviewEditDialog
                    key={`${myReview.id}-${myReview.updatedAt}`}
                    productId={productId}
                    review={myReview}
                    onUpdated={refreshReviews}
                  />

                  <ReviewDeleteDialog
                    productId={productId}
                    reviewId={myReview.id}
                    onDeleted={refreshReviews}
                  />
                </div>
              </div>

              {myReview.rating !== null && (
                <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
                  <span>{myReview.rating}/5</span>
                </div>
              )}

              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
                {myReview.comment}
              </p>

              {myReview.imageUrls.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {myReview.imageUrls.map((url, index) => (
                    <a
                      key={myReview.imagePublicIds[index] ?? url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="overflow-hidden rounded-lg border"
                    >
                      <img
                        src={url}
                        alt={`Your review photo ${index + 1}`}
                        className="size-20 object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}
            </article>
          </div>
        )}

        <Separator />

        {/* All Reviews */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            All reviews
          </h3>

          <span className="text-xs text-muted-foreground">
            {pageData?.totalCount ?? 0} reviews
          </span>
        </div>

        {isLoading ? (
          <ReviewSkeleton />
        ) : pageData && (
          <ReviewList
            productId={productId}
            reviews={otherReviews}
            currentUserId={session?.user?.id}
            onChanged={refreshReviews}
          />
        )}

        {/* Pagination */}
        {pageData && pageData.totalCount > 10 && (
          <ReviewPagination
            page={pageIndex + 1}
            hasPrevious={pageIndex > 0}
            hasNext={pageData.hasMore}
            isLoading={isLoading}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        )}
      </div>
    </section>
  );
}
