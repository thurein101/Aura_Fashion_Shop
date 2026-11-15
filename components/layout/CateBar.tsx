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
      // cat.value က Uppercase ဖြစ်နေနိုင်လို့ (ဥပမာ: "MEN") url/slug အတွက် lowercase သို့ပြောင်းသုံး
      const categoryValue = cat.value.toLowerCase();
      const isActive =
        pathname === "/" && currentCategory?.toLowerCase() === categoryValue;
      const href = `/?category=${categoryValue}`;

      if (isMobile) {
        return (
          <Link
            key={cat.value}
            href={href}
            className={`snap-start whitespace-nowrap text-[11px] font-bold tracking-widest uppercase transition-colors duration-200 ${
              isActive
                ? "text-orange-600 font-black underline underline-offset-4"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            {cat.label}
          </Link>
        );
      }

      return (
        <Link
          key={cat.value}
          href={href}
          className={`group relative text-sm font-bold transition-colors duration-300 py-2 tracking-widest uppercase ${
            isActive
              ? "text-stone-900 font-black"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          {cat.label}
          <span
            className={`absolute -bottom-1 left-1/2 h-[2px] -translate-x-1/2 bg-stone-900 transition-all duration-300 ease-out rounded-full ${
              isActive ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </Link>
      );
    });

  if (isMobile) {
    return (
      <nav className="flex overflow-x-auto snap-x py-3 px-4 gap-6 [&::-webkit-scrollbar]:hidden">
        {renderLinks()}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-8">{renderLinks()}</nav>
  );
}
