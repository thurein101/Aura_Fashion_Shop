import { prisma } from "@/lib/prisma";
import { CategoryValue } from "@/lib/utils";
import { ProductsPageResult } from "@/lib/product-type";

export async function queryProductPage(
    category?: CategoryValue | null,
    type?: string | null,
    cursor?: string | null,
    limit: number = 12,
    search?: string | null
): Promise<ProductsPageResult> {
    let cursorRow = null;
    if (cursor) {
        cursorRow = await prisma.product.findUnique({
            where: { id: cursor },
            select: { id: true, createdAt: true },
        });
    }

    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            ...(category && { category }),
            ...(type && {
                type: {
                    is: {
                        slug: type,
                    },
                },
            }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }),
        },
        take: limit + 1,
        ...(cursorRow && {
            skip: 1,
            cursor: { id: cursorRow.id },
        }),
        orderBy: [
            { createdAt: "desc" },
            { id: "desc" },
        ],
        include: {
            type: true,
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

    const hasMore = products.length > limit;
    const items = hasMore ? products.slice(0, limit) : products;

   
    const formattedItems = items.map((product) => ({
        ...product,
        price: Number(product.price), 
    }));

    return {
        items: formattedItems,
        nextCursor: hasMore ? items[items.length - 1].id : null,
        hasMore,
    };
}

export async function queryProductSingleDetail(slug: string) {
    const product = await prisma.product.findFirst({
        where: {
            slug: slug,
            isActive: true,
        },
        include: {
            type: true,             // Product Type ပါ တွဲယူရန်
            productVariants: {      // Product Variants များကို တွဲယူရန်
                select: {
                    id: true,
                    size: true,
                    color: true,
                    ImageUrl: true,
                    stock: true,
                },
            },
            reviews: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
    });

    return product;
}