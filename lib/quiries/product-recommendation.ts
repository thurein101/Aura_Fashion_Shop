
import { prisma } from "@/lib/prisma";

export async function queryRecommendedProducts(
  productId: string,
  category: string,
  typeId: string | null,
) {
  // Randomly select 4 product IDs
  const randomProducts = await prisma.$queryRaw<
    { id: string }[]
  >`
    SELECT "id"
    FROM "product"
    WHERE
      "isActive" = true
      AND "id" <> ${productId}
      AND "category" = ${category}::"Category"
      AND (
        ${typeId}::text IS NULL
        OR "typeId" = ${typeId}
      )
    ORDER BY RANDOM()
    LIMIT 4
  `;

  const ids = randomProducts.map((item) => item.id);

  if (ids.length === 0) return [];

  // Fetch complete product data
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      category: true,
      imageUrl: true,
      typeId: true,

      type: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      productVariants: {
        select: {
          id: true,
          size: true,
          color: true,
          stock: true,
          ImageUrl: true,
        },
      },
    },
  });

  // Keep the random order from SQL
  const productMap = new Map(
    products.map((product) => [product.id, product]),
  );

  return ids
    .map((id) => productMap.get(id))
    .filter((product) => product !== undefined)
    .map((product) => ({
      ...product,
      price: Number(product.price),
    }));
}
