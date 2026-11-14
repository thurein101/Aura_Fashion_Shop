import { CACHE_TAGS } from '../cache_tag';
import { prisma } from '../prisma';
import { cacheLife, cacheTag } from 'next/cache';

export async function getUserFavouriteIds(userId: string) {
    "use cache";

    cacheTag(CACHE_TAGS.favourites(userId));
    cacheLife("minutes");

   
    const favourites = await prisma.productToUser.findMany({
        where: {
            userId: userId,
        },
        select: {
            productId: true, // Model field name ကို သုံး
        },
    });

    return favourites.map((fav) => fav.productId);
}