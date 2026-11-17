"use client";

import React, { useMemo, useState, useTransition } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { ProductDetail, ProductListItem } from "@/lib/product-type";
import { formatPrice } from "@/lib/utils";
import FavouriteBtn from "@/components/Products/FavBth";
import { Button } from "../ui/button";
import { ShoppingCart, LoaderCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { addToCartAction } from "@/app/actions/cart";
import { toast } from "sonner";
import ProductReviews from "@/components/Products/ProductReview";
import YouMayAlsoLike from "./You-may";

type ProductDetailClientProps = {
  product: ProductDetail | null;
  recommendedProducts: ProductListItem[];
};

export default function ProductDetailClient({
  product,
  recommendedProducts,
}: ProductDetailClientProps) {
  if (!product) notFound();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { data: session } = useSession();

  const sizes = useMemo(() => {
    return [
      ...new Set(
        (product.productVariants ?? []).map((variant) => variant.size),
      ),
    ];
  }, [product.productVariants]);

  const colors = useMemo(() => {
    if (!product?.productVariants) return [];

    // Size တစ်ခုခု ရွေးထားရင် အဲ့ဒီ size နဲ့ ကိုက်ညီတဲ့ color တွေကိုပဲ စစ်ထုတ်
    const filteredVariants = selectedSize
      ? product.productVariants.filter(
          (variant) => variant.size === selectedSize,
        )
      : product.productVariants;

    // ထပ်နေတဲ့ အရောင်တွေမပါအောင် Set သုံးပြီး Unique လုပ်ထုတ်ခြင်း
    return [...new Set(filteredVariants.map((variant) => variant.color))];
  }, [product?.productVariants, selectedSize]);

  //for add to cart btn and for disabled
  const selectedVariant = useMemo(() => {
    if (!selectedSize || !selectedColor) return null;

    return product.productVariants?.find(
      (variant) =>
        variant.size === selectedSize &&
        variant.color === selectedColor &&
        variant.stock > 0,
    );
  }, [product.productVariants, selectedSize, selectedColor]);

  //function
  const handleAddToCart = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (!selectedVariant) {
      setError("Please choose your size and color.");
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        const result = await addToCartAction({
          variantId: selectedVariant.id,
          quantity: 1,
        });

        if (result.success) {
         router.refresh();
          toast.success("Added to cart successfully!");
        } else if (result.error === "Please login first.") {
          toast.error("Please login first.");
          router.push("/login");
        } else if (
          result.error === "INSUFFICIENT_STOCK" ||
          result.error?.includes("stock")
        ) {
          setError("Requested quantity exceeds available stock.");
          toast.error("NOT ENOUGH");
        } else {
          setError(result.error || "Failed to add product to cart.");
          toast.error(result.error || "Failed to add product to cart.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
        toast.error("Something went wrong.");
      }
    });
  };

  const displayImage = selectedVariant?.ImageUrl ?? product.imageUrl;

  return (
    <main className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-10 bg-[#F9F8F6]">
      <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-[1.05fr_0.95fr] md:gap-10 lg:gap-14">
        {/* Product Image */}
        <div className="mx-auto w-full max-w-[400px]">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted/40">
            <Image
              src={displayImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-500 hover:scale-[1.025]"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="mx-auto w-full max-w-md space-y-5 md:py-2">
          {/* Heading */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Product Details
              </p>

              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {product.name}
              </h1>
            </div>

            <div className="shrink-0">
              <FavouriteBtn productId={product.id} />
            </div>
          </div>

          {/* Price */}
          <p className="text-xl font-semibold tracking-tight">
            {formatPrice(product.price)}
          </p>

          {/* Description */}
          <p className="text-[13px] leading-6 text-muted-foreground">
            {product.description || "No description available."}
          </p>

          <div className="h-px bg-border/70" />

          {/* Size Selection */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold">Size</h2>
              <span className="text-[11px] text-muted-foreground">
                {selectedSize || "Select a size"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const active = selectedSize === size;

                return (
                  <Button
                    key={size}
                    type="button"
                    onClick={() =>
                      setSelectedSize((prev) => (prev === size ? "" : size))
                    }
                    className={`
          min-w-10 shrink-0 rounded-lg border px-3 py-2
          text-xs font-medium transition-all duration-200
          ${
            active
              ? "border-foreground bg-foreground text-background shadow-sm"
              : "border-border bg-background text-foreground hover:border-foreground/50"
          }
        `}
                  >
                    {size}
                  </Button>
                );
              })}
            </div>
          </section>

          {/* Color Selection */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold">Color</h2>
              <span className="text-[11px] text-muted-foreground">
                {selectedColor || "Select a color"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {colors.map((color) => {
                const active = selectedColor === color;

                return (
                  <Button
                    key={color}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedColor((prev) => (prev === color ? "" : color))
                    }
                    aria-label={`Select ${color}`}
                    aria-pressed={active}
                    className={`
                shrink-0 rounded-full px-3 py-1.5 text-xs
                transition-all duration-200
                ${
                  active
                    ? "border-foreground bg-foreground text-background hover:bg-foreground hover:text-background"
                    : "border-border bg-background text-muted-foreground hover:bg-background hover:text-foreground"
                }
            `}
                  >
                    {color}
                  </Button>
                );
              })}
            </div>
          </section>
          {selectedVariant && (
            <div className="space-y-2 rounded-xl border bg-muted/30 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Selected Variant</span>
                <span className="font-medium text-foreground">
                  {selectedVariant.size} / {selectedVariant.color}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Available Stock</span>
                <span className="font-medium">
                  {selectedVariant.stock} items
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-xs font-medium text-destructive">{error}</p>
          )}

          {/* Add to Cart */}
          <Button
            type="button"
            disabled={!selectedVariant || isPending}
            onClick={handleAddToCart}
            className="relative h-12 w-full max-w-xs 
            overflow-hidden rounded-2xl  bg-[#F66425] text-white 
            font-medium shadow-lg shadow-indigo-500/25 transition-all 
            duration-300 hover:shadow-indigo-500/40 hover:scale-[1.01] 
            active:scale-[0.98] disabled:opacity-50 
            disabled:pointer-events-none group"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <span className="relative flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <LoaderCircle className="size-5 animate-spin text-white/90" />
                  <span className="tracking-wide">Adding...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="size-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
                  <span className="tracking-wide">Add to Cart</span>
                </>
              )}
            </span>
          </Button>
        </div>
      </div>

       {/* Customer Reviews */}
    <ProductReviews productId={product.id} />

    <YouMayAlsoLike products={recommendedProducts} />
    </main>
  );
}
