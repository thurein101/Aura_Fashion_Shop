
"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("query") || ""
  );

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = term.trim();

    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }

    params.delete("page");

    const query = params.toString();

    startTransition(() => {
      router.replace(query ? `/?${query}` : "/");
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(searchTerm);
    if (e.key === "Escape") setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-full p-2 text-foreground transition-colors hover:bg-muted/60"
        aria-label={isOpen ? "Close Search" : "Open Search"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Search className="h-5 w-5" />
        )}
      </button>

      {/* Search Bar - Slide Down */}
      <div
        className={`
          absolute left-0 top-full z-50 w-full
          overflow-hidden border-b border-stone-200/70
          bg-[#F9F8F6]/95 backdrop-blur-xl
          transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "max-h-24 translate-y-0 opacity-100"
              : "max-h-0 -translate-y-2 opacity-0 pointer-events-none"
          }
        `}
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              autoFocus={isOpen}
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-11 rounded-xl border-stone-200 bg-white pl-10 pr-10 text-sm shadow-sm"
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <button
                  type="button"
                  onClick={() => handleSearch(searchTerm)}
                  className="text-xs font-semibold text-stone-700 hover:text-orange-600"
                >
                  Search
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
