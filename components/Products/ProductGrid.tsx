import React, { Suspense } from "react";
import { VALID_CATEGORIES, CategoryValue } from "@/lib/utils";
import ProductPagination from "./Product-Pagination";
import HomeLoading from "../loading/HomeLoading";

type ProductGridProps = {
  searchParams: Promise<{
    type?: string;
    category?: string;
    query?: string;
  }>;
};

async function ProductGridInner({ searchParams }: ProductGridProps) {
  const resolvedParams = await searchParams;
  const { category, type, query } = resolvedParams;

  // Category တန်ဖိုး ဟုတ်မဟုတ် စစ်ဆေးခြင်း
  const isValidCategory =
    category &&
    VALID_CATEGORIES.some((c) => c.value === category.toUpperCase());

  const selectedCategory = isValidCategory
    ? (category.toUpperCase() as CategoryValue)
    : null;

  return (
    <div className="space-y-4 ">
      <p className="text-sm text-stone-600">
        Selected Category:{" "}
        <span className="font-bold">{selectedCategory || "All"}</span>
        {type && ` | Type: ${type}`}
        {query && ` | Search: "${query}"`}
      </p>
      <ProductPagination
        category={selectedCategory}
        type={type || null}
        search={query || null}
      />
    </div>
  );
}


export default async function ProductGrid({ searchParams }: ProductGridProps) {
  const resolvedParams = await searchParams;
  const { query, category, type } = resolvedParams;
  // URL ထဲက ပါရာမီတာတွေကို ပေါင်းပြီး key တစ်ခုလုပ်ပါ loadingဆွဲဖို့
  const suspenseKey = `${query || ""}-${category || ""}-${type || ""}`;
  return (
    <Suspense key={suspenseKey} fallback={<HomeLoading />}>
      <ProductGridInner  searchParams={searchParams} />
    </Suspense>
  );
}
