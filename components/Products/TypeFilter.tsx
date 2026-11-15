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

export default function TypeFilter({
  productTypes,
}: TypeFilterProps) {
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

  return (
    <>
      {/* Desktop Filter */}
      <nav
        aria-label="Product types"
        className="hidden sm:flex flex-wrap items-center gap-2"
      >
        <Link
          href={getHref(null)}
          scroll={false}
          aria-current={!activeType ? "page" : undefined}
          className={`
            rounded-full px-4 py-2.5 text-xs font-bold
            tracking-widest uppercase transition-all
            ${
              !activeType
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }
          `}
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
              className={`
                rounded-full px-4 py-2.5 text-xs font-bold
                tracking-widest uppercase transition-all
                ${
                  isActive
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }
              `}
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
                  rounded-full border-0 px-4 py-2.5 h-auto
                  text-xs font-bold tracking-widest uppercase
                  ${
                    moreTypes.some((type) => type.slug === activeType)
                      ? "bg-stone-900 text-white hover:bg-stone-800 hover:text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }
                `}
              >
                {moreTypes.find((type) => type.slug === activeType)?.name ??
                  "More"}
                <span className="ml-2">⌄</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {moreTypes.map((type) => (
                <DropdownMenuItem key={type.id} asChild>
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
      <div className="sm:hidden w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between rounded-full border-stone-200"
            >
              <span className="font-semibold uppercase tracking-wide text-xs">
                {activeProductType?.name ?? "All"}
              </span>
              <span>⌄</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
            <DropdownMenuItem asChild>
              <Link href={getHref(null)} scroll={false}>
                All
              </Link>
            </DropdownMenuItem>

            {productTypes.map((type) => (
              <DropdownMenuItem key={type.id} asChild>
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