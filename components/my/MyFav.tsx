
"use client";

import Link from "next/link";
import { ProductListItem } from "@/lib/product-type";
import ProductCard from "@/components/Products/ProductCard";

type FavouritesClientProps = {
  products: ProductListItem[];
};

export default function FavouritesClient({
  products,
}: FavouritesClientProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-lg font-semibold">No favourites yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You haven't added any products to your favourites.
        </p>
        <Link
          href="/"
          className="mt-5 rounded-md bg-primary px-5 py-2 text-sm text-primary-foreground"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
