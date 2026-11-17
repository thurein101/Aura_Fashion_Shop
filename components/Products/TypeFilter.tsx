
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

type ProductType = {
  id: string;
  name: string;
  slug: string;
};

type TypeFilterProps = {
  productTypes: ProductType[];
};

const VISIBLE_LIMIT = 4;

export default function TypeFilter({ productTypes }: TypeFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeType = searchParams.get("type");

  const visibleTypes = productTypes.slice(0, VISIBLE_LIMIT);
  const moreTypes = productTypes.slice(VISIBLE_LIMIT);

  const activeProductType = productTypes.find(
    (type) => type.slug === activeType
  );

  function getHref(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (slug) {
      params.set("type", slug);
    } else {
      params.delete("type");
    }

    const query = params.toString();

    return query ? `${pathname}?${query}` : pathname;
  }

  const filterClass = (isActive: boolean) =>
    `rounded-full border px-5 py-2.5 text-[11px] font-semibold
    tracking-[0.14em] uppercase transition-all duration-300
    ${
      isActive
        ? "border-orange-600 bg-orange-600 text-white shadow-sm shadow-orange-600/15"
        : "border-[#E9E4DC] bg-white/70 text-stone-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
    }`;

  return (
    <>
      {/* Desktop Filter */}
      <nav
        aria-label="Product types"
        className="hidden sm:flex flex-wrap items-center gap-2.5 bg-[#F9F8F6]"
      >
        <Link
          href={getHref(null)}
          scroll={false}
          aria-current={!activeType ? "page" : undefined}
          className={filterClass(!activeType)}
        >
          All 
        </Link>

        {visibleTypes.map((type) => {
          const isActive = activeType === type.slug;

          return (
            <Link
              key={type.id}
              href={getHref(type.slug)}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              className={filterClass(isActive)}
            >
              {type.name}
            </Link>
          );
        })}

        {moreTypes.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`
                  h-auto rounded-full border px-5 py-2.5
                  text-[11px] font-semibold tracking-[0.14em] uppercase
                  transition-all duration-300
                  ${
                    moreTypes.some((type) => type.slug === activeType)
                      ? "border-orange-600 bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
                      : "border-[#E9E4DC] bg-white/70 text-stone-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                  }
                `}
              >
                {moreTypes.find((type) => type.slug === activeType)?.name ??
                  "More"}
                <span className="ml-2 text-sm">⌄</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="min-w-40 border-[#E9E4DC] bg-[#FDFCFB] p-1.5 shadow-lg"
            >
              {moreTypes.map((type) => (
                <DropdownMenuItem
                  key={type.id}
                  asChild
                  className="cursor-pointer rounded-md text-xs font-medium uppercase tracking-wide text-stone-600 focus:bg-orange-50 focus:text-orange-700"
                >
                  <Link href={getHref(type.slug)} scroll={false}>
                    {type.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>

      {/* Mobile Filter */}
      <div className="w-full sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 w-full justify-between rounded-xl border-[#E9E4DC] bg-white text-stone-800 shadow-none hover:border-orange-300 hover:bg-orange-50"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                {activeProductType?.name ?? "All Products"}
              </span>
              <span className="text-orange-600">⌄</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-[var(--radix-dropdown-menu-trigger-width)] border-[#E9E4DC] bg-[#FDFCFB] p-1.5"
          >
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-md text-xs font-medium uppercase tracking-wide text-stone-600 focus:bg-orange-50 focus:text-orange-700"
            >
              <Link href={getHref(null)} scroll={false}>
                All
              </Link>
            </DropdownMenuItem>

            {productTypes.map((type) => (
              <DropdownMenuItem
                key={type.id}
                asChild
                className="cursor-pointer rounded-md text-xs font-medium uppercase tracking-wide text-stone-600 focus:bg-orange-50 focus:text-orange-700"
              >
                <Link href={getHref(type.slug)} scroll={false}>
                  {type.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
