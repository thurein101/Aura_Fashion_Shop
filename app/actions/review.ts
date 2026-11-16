
"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { cloudinary } from "@/lib/cloudinary";
import { getProductReviewPage } from "@/lib/data/review";
import { revalidateProductReviews } from "@/lib/cache_tag";

import {
  createReviewSchema,
  updateReviewSchema,
  deleteReviewSchema,
  cleanupReviewImagesSchema,
 
} from "@/lib/validation/review";

function getReviewFolder(userId: string, productId: string) {
  return `reviews/${userId}/${productId}/`;
}

async function resolveReviewImages(
  userId: string,
  productId: string,
  publicIds: string[]
) {
  if (publicIds.length > 5) {
    throw new Error("Maximum 5 images allowed");
  }

  const folder = getReviewFolder(userId, productId);

  const uniqueIds = [...new Set(publicIds)];

  if (uniqueIds.length !== publicIds.length) {
    throw new Error("Duplicate images are not allowed");
  }

  const images = await Promise.all(
    uniqueIds.map(async (publicId) => {
      if (!publicId.startsWith(folder)) {
        throw new Error("Invalid image ownership");
      }

      const resource = await cloudinary.api.resource(publicId);

      if (
        resource.public_id !== publicId ||
        resource.resource_type !== "image"
      ) {
        throw new Error("Invalid Cloudinary image");
      }

      return {
        publicId,
        url: cloudinary.url(publicId, {
          secure: true,
          quality: "auto",
          fetch_format: "auto",
        }),
      };
    })
  );

  return images;
}

async function destroyReviewImages(publicIds: string[]) {
  if (!publicIds.length) return;

  await Promise.allSettled(
    publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
      })
    )
  );
}

// READ PAGINATED REVIEWS
export async function getProductReviewsAction(
  productId: string,
  cursor: string | null = null
) {
  try {
    if (!productId) {
      return { success: false as const, error: "Invalid product" };
    }

    const page = await getProductReviewPage(productId, cursor);

    return {
      success: true as const,
      data: page,
    };
  } catch (error) {
    console.error("Get product reviews:", error);

    return {
      success: false as const,
      error: "Unable to load reviews",
    };
  }
}

// GET CURRENT USER'S REVIEW
export async function getMyProductReviewAction(productId: string) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return { success: true as const, review: null };
    }

    const review = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
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
    });

    return {
      success: true as const,
      review: review
        ? {
            ...review,
            createdAt: review.createdAt.toISOString(),
            updatedAt: review.updatedAt.toISOString(),
          }
        : null,
    };
  } catch (error) {
    console.error("Get my review:", error);

    return {
      success: false as const,
      review: null,
      error: "Unable to load your review",
    };
  }
}

// CREATE REVIEW
export async function createReviewAction(input: unknown) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return { success: false as const, error: "Please login first." };
    }

    const parsed = createReviewSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false as const,
        error: "Invalid review data",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const { productId, comment, rating, imagePublicIds } = parsed.data;
    const userId = session.user.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isActive: true },
    });

    if (!product?.isActive) {
      return { success: false as const, error: "Product not available" };
    }

    const images = await resolveReviewImages(
      userId,
      productId,
      imagePublicIds
    );

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        comment,
        rating,
        imageUrls: images.map((image) => image.url),
        imagePublicIds: images.map((image) => image.publicId),
      },
      select: { id: true },
    });

    revalidateProductReviews(productId);

    return {
      success: true as const,
      reviewId: review.id,
    };
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        success: false as const,
        error: "You have already reviewed this product.",
      };
    }

    console.error("Create review:", error);

    return {
      success: false as const,
      error: "Failed to submit review",
    };
  }
}

// UPDATE OWN REVIEW
export async function updateReviewAction(input: unknown) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return { success: false as const, error: "Please login first." };
    }

    const parsed = updateReviewSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false as const,
        error: "Invalid review data",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const {
      reviewId,
      productId,
      comment,
      rating,
      imagePublicIds,
    } = parsed.data;

    const userId = session.user.id;

    const existing = await prisma.review.findFirst({
      where: {
        id: reviewId,
        productId,
        userId,
      },
      select: {
        imagePublicIds: true,
      },
    });

    if (!existing) {
      return {
        success: false as const,
        error: "Review not found or unauthorized",
      };
    }

    const images = await resolveReviewImages(
      userId,
      productId,
      imagePublicIds
    );

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        comment,
        rating,
        imageUrls: images.map((image) => image.url),
        imagePublicIds: images.map((image) => image.publicId),
      },
    });

    const removedImages = existing.imagePublicIds.filter(
      (id) => !imagePublicIds.includes(id)
    );

    await destroyReviewImages(removedImages);

    revalidateProductReviews(productId);

    return { success: true as const };
  } catch (error) {
    console.error("Update review:", error);

    return {
      success: false as const,
      error: "Failed to update review",
    };
  }
}

// DELETE OWN REVIEW
export async function deleteReviewAction(input: unknown) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return { success: false as const, error: "Please login first." };
    }

    const parsed = deleteReviewSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false as const, error: "Invalid request" };
    }

    const { reviewId, productId } = parsed.data;

    const existing = await prisma.review.findFirst({
      where: {
        id: reviewId,
        productId,
        userId: session.user.id,
      },
      select: {
        imagePublicIds: true,
      },
    });

    if (!existing) {
      return {
        success: false as const,
        error: "Review not found or unauthorized",
      };
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    await destroyReviewImages(existing.imagePublicIds);

    revalidateProductReviews(productId);

    return { success: true as const };
  } catch (error) {
    console.error("Delete review:", error);

    return {
      success: false as const,
      error: "Failed to delete review",
    };
  }
}

// CLEAN UP UPLOADED BUT UNUSED IMAGES
export async function cleanupUnusedReviewImagesAction(input: unknown) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return { success: false as const, error: "Unauthorized" };
    }

    const parsed = cleanupReviewImagesSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false as const, error: "Invalid images" };
    }

    const userId = session.user.id;
    const unused: string[] = [];

    for (const publicId of parsed.data.publicIds) {
      if (!publicId.startsWith(`reviews/${userId}/`)) {
        continue;
      }

      const used = await prisma.review.findFirst({
        where: {
          imagePublicIds: { has: publicId },
        },
        select: { id: true },
      });

      if (!used) unused.push(publicId);
    }

    await destroyReviewImages(unused);

    return { success: true as const };
  } catch (error) {
    console.error("Cleanup review images:", error);

    return {
      success: false as const,
      error: "Failed to clean up images",
    };
  }
}
