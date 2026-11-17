import ProductGrid from "@/components/Products/ProductGrid";
import TypeFilter from "@/components/Products/TypeFilter";
import { getProductTypes } from "@/lib/data/product-type";
import { Suspense } from "react";

interface HomeProps {
  searchParams: Promise<{
    type?: string;
    category?: string;
  }>;
}
async function HomeInner({ searchParams }: HomeProps) {

   const productTypes = await getProductTypes();
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6 ">
      {/* Combined Header & Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b pb-6 bg-[#F9F8F6]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AURA COLLECTION</h1>
          <p className="text-gray-600 text-sm mt-1">
            Discover your signature style with our minimal collection. Explore
            products below:
          </p>
        </div>
      <TypeFilter productTypes={productTypes} />
      </div>

      {/* Product Grid */}
      <ProductGrid searchParams={searchParams} />
    </div>
  );
}
export default function Home({ searchParams }: HomeProps) {
  return (
    <Suspense>
      <HomeInner searchParams={searchParams} />
    </Suspense>
  );
}
