
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/cache_tag";

const PAGE_SIZE = 10;

export async function getProductReviewPage(
  productId: string,
  cursor: string | null
) {
  "use cache";

  cacheTag(CACHE_TAGS.reviews(productId));
  cacheLife("minutes");

  const [items, totalCount, aggregate, groupedRatings] =
    await Promise.all([
      prisma.review.findMany({
        where: { productId },
        orderBy: [
          { createdAt: "desc" },
          { id: "desc" },
        ],
        take: PAGE_SIZE + 1,
        ...(cursor
          ? {
              cursor: { id: cursor },
              skip: 1,
            }
          : {}),
        select: {
          id: true,
          rating: true,
          comment: true,
          imageUrls: true,
          imagePublicIds: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),

      prisma.review.count({
        where: { productId },
      }),

      prisma.review.aggregate({
        where: {
          productId,
          rating: { not: null },
        },
        _avg: { rating: true },
        _count: { rating: true },
      }),

      prisma.review.groupBy({
        by: ["rating"],
        where: {
          productId,
          rating: { not: null },
        },
        _count: { rating: true },
      }),
    ]);

  const hasMore = items.length > PAGE_SIZE;
  const pageItems = hasMore ? items.slice(0, PAGE_SIZE) : items;

  const ratingCounts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  for (const group of groupedRatings) {
    if (group.rating !== null) {
      ratingCounts[group.rating] = group._count.rating;
    }
  }

  return {
    reviews: pageItems.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    })),

    totalCount,

    averageRating: aggregate._avg.rating
      ? Number(aggregate._avg.rating.toFixed(1))
      : null,

    ratedCount: aggregate._count.rating,

    ratingCounts,

    hasMore,

    nextCursor: hasMore
      ? pageItems[pageItems.length - 1].id
      : null,
  };
}
