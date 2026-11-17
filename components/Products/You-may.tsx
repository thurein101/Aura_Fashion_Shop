
"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductListItem } from "@/lib/product-type";
import { formatPrice, getCategoryLabel } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type Props = {
  products: ProductListItem[];
};

export default function YouMayAlsoLike({ products }: Props) {
  if (!products.length) return null;

  return (
    <section className="mt-10 space-y-6 border-t border-[#E8E1D7] bg-[#F9F8F6] pt-8 sm:mt-16 sm:space-y-7 sm:pt-10">
      {/* Heading */}
      <div className="space-y-2">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:text-[10px]">
          Curated for you
        </p>

        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl lg:text-3xl">
          You May Also Like
        </h2>

        <p className="text-xs text-neutral-500 sm:text-sm">
          A few more pieces worth discovering.
        </p>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group min-w-0"
          >
            {/* Image */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#E9E3DA] sm:rounded-xl">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Hover Arrow */}
              <span className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-neutral-900 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:opacity-100 sm:bottom-3 sm:right-3">
                <ArrowUpRight className="size-4" />
              </span>
            </div>

            {/* Product Info */}
            <div className="mt-2.5 space-y-1.5 sm:mt-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-500 sm:text-[10px]">
                {getCategoryLabel(product.category)}
              </p>

              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                <h3 className="line-clamp-2 min-w-0 text-xs font-medium leading-5 text-neutral-900 transition-colors group-hover:text-orange-600 sm:text-sm">
                  {product.name}
                </h3>

                <span className="shrink-0 text-xs font-semibold text-neutral-900 sm:text-sm">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
