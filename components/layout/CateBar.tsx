
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { VALID_CATEGORIES } from "@/lib/utils";

interface CateBarProps {
  isMobile?: boolean;
}

export default function CateBar({ isMobile = false }: CateBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const renderLinks = () =>
    VALID_CATEGORIES.map((cat) => {
      const categoryValue = cat.value.toLowerCase();

      const isActive =
        pathname === "/" &&
        currentCategory?.toLowerCase() === categoryValue;

      const href = `/?category=${categoryValue}`;

      if (isMobile) {
        return (
          <Link
            key={cat.value}
            href={href}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={`relative snap-start whitespace-nowrap pb-2 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 ${
              isActive
                ? "font-bold text-orange-600"
                : "text-stone-500 hover:text-orange-600"
            }`}
          >
            {cat.label}

            <span
              className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-orange-600 transition-all duration-300 ${
                isActive ? "w-full" : "w-0"
              }`}
            />
          </Link>
        );
      }

      return (
        <Link
          key={cat.value}
          href={href}
          scroll={false}
          aria-current={isActive ? "page" : undefined}
          className={`group relative py-2 text-[12px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${
            isActive
              ? "text-orange-600"
              : "text-stone-600 hover:text-orange-600"
          }`}
        >
          {cat.label}

          <span
            className={`absolute -bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-orange-600 transition-all duration-300 ease-out ${
              isActive ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </Link>
      );
    });

  if (isMobile) {
    return (
      <nav
        aria-label="Product categories"
        className="flex snap-x snap-mandatory items-center gap-7 overflow-x-auto bg-[#F9F8F6] px-4 py-3 [&::-webkit-scrollbar]:hidden"
      >
        {renderLinks()}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Product categories"
      className="hidden items-center gap-8 md:flex"
    >
      {renderLinks()}
    </nav>
  );
}
