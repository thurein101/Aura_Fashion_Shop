import { z } from "zod";

export const productsPageQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(24).default(12),
  category: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional()
});

export type ProductsPageQuery = z.infer<typeof productsPageQuerySchema>;
