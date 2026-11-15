import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export async function getProductTypes() {
  "use cache";

  cacheLife("hours");
  cacheTag("product-types");

  return prisma.productType.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}