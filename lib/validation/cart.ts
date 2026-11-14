import { z } from "zod";

export const addToCartSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});



export const updateCartSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required."),
  action: z.enum(["increase", "decrease"]),
});

export const removeCartSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required."),
});
export type AddToCartInput = z.infer<typeof addToCartSchema>;

export type UpdateCartInput = z.infer<typeof updateCartSchema>;


