

import { z } from "zod";

const reviewImageSchema = z.object({
  publicId: z.string().min(1),
  url: z.string().url(),
});

export const reviewFormSchema = z.object({
  comment: z.string().trim().min(1, "Comment is required").max(3000),
  rating: z.number().int().min(1).max(5).nullable(),
  images: z.array(reviewImageSchema).max(5),
});

const serverFields = {
  comment: z.string().trim().min(1).max(3000),
  rating: z.number().int().min(1).max(5).nullable(),
  imagePublicIds: z.array(z.string().min(1).max(300)).max(5)
    .refine((ids) => new Set(ids).size === ids.length),
};

export const createReviewSchema = z.object({
  productId: z.string().min(1),
  ...serverFields,
});

export const updateReviewSchema = z.object({
  reviewId: z.string().min(1),
  productId: z.string().min(1),
  ...serverFields,
});

export const deleteReviewSchema = z.object({
  reviewId: z.string().min(1),
  productId: z.string().min(1),
});

export const cleanupReviewImagesSchema = z.object({
  publicIds: z.array(z.string().min(1)).max(5),
});

export const uploadSignatureSchema = z.object({
  productId: z.string().min(1),
});




export type ReviewFormInput = z.infer<typeof reviewFormSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
