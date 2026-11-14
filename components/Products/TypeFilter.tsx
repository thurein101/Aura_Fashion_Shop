"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PRODUCT_TYPES = [
  { name: "All", slug: null },
  { name: "Tops", slug: "tops" },
  { name: "Bottoms", slug: "bottoms" },
  { name: "Outerwear", slug: "outerwear" },
  { name: "Bags", slug: "bags" },
];

export default function TypeFilter() {
const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category"); 
  const activeType = searchParams.get("type"); 
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
      {PRODUCT_TYPES.map((type) => {
        const isActive = type.slug === null ? !activeType : activeType === type.slug;

        
        const params = new URLSearchParams();
        if (activeCategory) params.set("category", activeCategory);
        if (type.slug) params.set("type", type.slug);

        const queryString = params.toString();
        const href = queryString ? `/?${queryString}` : "/";

        return (
          <Link
            key={type.name}
            href={href}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
              isActive
                ? "bg-stone-900 text-stone-50 shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200/70"
            }`}
          >
            {type.name}
          </Link>
        );
      })}
    </div>
  );
}