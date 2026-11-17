"use client"

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CategoryValue } from "@/lib/utils";
import { ProductListItem, ProductsPageResult } from "@/lib/product-type";
import ProductCard from "./ProductCard";
import useSWRInfinite from "swr/infinite";
import { preload } from "swr";
import { ProductPageFetcher } from "@/lib/api/load-more-products";
import { Skeleton } from "../ui/skeleton";

type ProductListProps = {
  initialItem: ProductListItem[];
  category?: CategoryValue | null;
  type?: string | null;
  initialNextCursor: string | null;
  initialHasMore: boolean;
  search?: string | null;
};

function buildProductsUrl(
  category: CategoryValue | undefined | null,
  type: string | undefined | null,
  search: string | undefined | null,
  cursor: string,
) {
  const params = new URLSearchParams({ cursor, limit: "8" });
  if (category) params.set("category", category);
  if (type) params.set("type", type);
  if (search) params.set("search", search);
  return `/api/products?${params.toString()}`;
}

function ProductList({
  initialItem,
  search,
  initialHasMore,
  initialNextCursor,
  type,
  category,
}: ProductListProps) {
  const getKey = useCallback(
    (pageIndex: number, previousPageData: ProductsPageResult | null) => {
      if (previousPageData && !previousPageData.nextCursor) return null;
      const cursor =
        pageIndex === 0 ? initialNextCursor : previousPageData?.nextCursor;
      if (!cursor) return null;

      return buildProductsUrl(category, type, search, cursor);
    },
    [category, type, search, initialNextCursor],
  );

  // isValidating ကို ယူထားပါသည်
  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    ProductPageFetcher,
    {
      initialSize: 0,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    },
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const lastExtraPage = data ? data[data.length - 1] : undefined;

  const loadedExtraItems = data?.flatMap((pg) => pg.items) ?? [];
  const items = [...initialItem, ...loadedExtraItems];

  const hasMore = lastExtraPage ? lastExtraPage.hasMore : initialHasMore;

  useEffect(() => {
    const nextCursor = lastExtraPage
      ? lastExtraPage.nextCursor
      : initialNextCursor;
    if (nextCursor && hasMore) {
      const nextUrl = buildProductsUrl(category, type, search, nextCursor);
      preload(nextUrl, ProductPageFetcher);
    }
  }, [category, type, search, lastExtraPage, initialNextCursor, hasMore]);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsLoadingMore(true);
        setSize((prevSize) => prevSize + 1);
      }
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, setSize]);

  // SWR က Data ခေါ်နေတာ ပြီးသွားတဲ့အခါ (isValidating false) မှ Loading ကို ပိတ်ပါမယ်
  useEffect(() => {
    if (!isValidating) {
      setIsLoadingMore(false);
    }
  }, [isValidating]);

  if (!initialItem || initialItem.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No Products found. Try another category or type!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[#F9F8F6]">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {isLoadingMore && (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 pt-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && !isLoadingMore && (
        <div className="flex justify-center py-6" ref={sentinelRef} />
      )}
    </div>
  );
}

export default ProductList;
