"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { ProductListItem } from "@/lib/product-type";
import ProductCard from "@/components/Products/ProductCard";
import { getMyFavouritesAction } from "@/app/actions/my";

export default function FavouritesClient() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchFavourites() {
      try {
        const result = await getMyFavouritesAction();

        if (cancelled) return;

        if (result.unauthorized) {
          router.replace("/login");
          return;
        }

        if (!result.success) {
          setError(result.error || "Failed to load favourites");
          return;
        }

        setProducts(result.products);
       
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchFavourites();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse space-y-3"
          >
            <div className="aspect-[3/4] rounded-lg bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-lg font-semibold">
          No favourites yet
        </h2>

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