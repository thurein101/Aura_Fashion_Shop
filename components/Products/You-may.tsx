
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
    <section className="mt-16 border-t pt-10 space-y-7 bg-[#F9F8F6]">
      {/* Heading */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Curated for you
          </p>

          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            You May Also Like
          </h2>

          <p className="text-sm text-muted-foreground">
            A few more pieces worth discovering.
          </p>
        </div>

        <span className="text-xs text-muted-foreground">
          01 — {String(products.length).padStart(2, "0")}
        </span>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-5">
        {products.map((product, index) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group block"
          >
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted/30">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Number */}
              <span className="absolute bottom-3 left-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-medium backdrop-blur-md">
                0{index + 1}
              </span>

              {/* Hover Arrow */}
              <span className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-full bg-background text-foreground opacity-0 transition-all duration-300 group-hover:opacity-100">
                <ArrowUpRight className="size-4" />
              </span>
            </div>

            {/* Product Info */}
            <div className="mt-3 space-y-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {getCategoryLabel(product.category)}
              </p>

              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 text-sm font-medium leading-5 transition-colors group-hover:text-muted-foreground">
                  {product.name}
                </h3>

                <span className="shrink-0 text-sm font-semibold">
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
