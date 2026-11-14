
"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductListItem } from "@/lib/product-type";
import { Card } from "@/components/ui/card";
import { formatPrice, getCategoryLabel } from "@/lib/utils";
import { motion } from "framer-motion";
import FavouriteBtn from "./FavBth";

type ProductCardProps = {
  product: ProductListItem;
  priority?: boolean;
};

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const sizes = [...new Set(product.productVariants.map((v) => v.size))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="group relative h-full overflow-hidden rounded-xl border border-border/60 bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">

        {/* Product Image */}
       <div className="relative aspect-[1/1] w-full overflow-hidden bg-muted/30">

          <Link
            href={`/products/${product.slug}`}
            className="absolute inset-0"
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Image Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />

          {/* Category */}
          <div className="absolute left-2.5 top-2.5 z-10">
            <span className="rounded-md border border-white/20 bg-white/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-neutral-800 shadow-sm backdrop-blur-md">
              {getCategoryLabel(product.category)}
            </span>
          </div>

          {/* Favourite */}
          <div
            className="absolute right-2.5 top-2.5 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <FavouriteBtn
              productId={product.id}
              className="h-8 w-8 rounded-full border border-white/30 bg-white/90 text-neutral-800 shadow-sm backdrop-blur-md transition-transform hover:scale-105 hover:bg-white"
            />
          </div>
        </div>

        {/* Product Information */}
        <Link
          href={`/products/${product.slug}`}
          className="flex flex-col gap-2 p-3 sm:p-3.5"
        >
          {/* Product Name */}
          <h3 className="line-clamp-1 text-xs font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-sm">
            {product.name}
          </h3>

          {/* Price & Sizes */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-extrabold tracking-tight text-foreground sm:text-base">
              {formatPrice(product.price)}
            </span>

            {sizes.length > 0 && (
              <div className="flex items-center gap-1">
                {sizes.slice(0, 3).map((size, idx) => (
                  <span
                    key={idx}
                    className="rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
                  >
                    {size}
                  </span>
                ))}

                {sizes.length > 3 && (
                  <span className="text-[9px] font-medium text-muted-foreground">
                    +{sizes.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      </Card>
    </motion.div>
  );
}
