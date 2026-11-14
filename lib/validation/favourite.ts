
import { z } from "zod";

export const toggleFavSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export type ToggleFavInput = z.infer<typeof toggleFavSchema>;