import ProductDetailSkeleton from "@/components/loading/detail-skeleton";
import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react"; 

import { getProductBySlug } from "@/lib/products";
import { ProductDetail, ProductVariantListItem } from "@/lib/product-type";
import ProductDetailClient from "@/components/Products/product-detail-client";


type DetailProps = {
  params: Promise<{ slug: string }>;
};


async function ProductDetailInner({ params }: DetailProps) {
  const { slug } = await params;
  const rawProduct = await getProductBySlug(slug);
 const product = (Array.isArray(rawProduct) ? rawProduct[0] : rawProduct) as ProductDetail | null;


  return <div className="container mx-auto px-4 py-2 max-w-7xl space-y-6">
   
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      {/* Main Content */}
      <div>
        <ProductDetailClient product={product} />
      </div>
    </div>
}

function ProductDetailPage({ params }: DetailProps) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailInner params={params} />
      </Suspense>
    </div>
  );
}

export default ProductDetailPage;
