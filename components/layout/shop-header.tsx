import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import UserNav from "./user-nav";
import CateBar from "./CateBar";
import SearchToggle from "../Products/searchToggle";
import CartBadge from "./cartBadge";

export default function ShopHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/50 bg-[#F9F8F6]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#F9F8F6]/60 transition-all shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          
          <Link
            href="/"
            className="text-2xl font-black tracking-widest text-stone-900 transition-transform duration-200 active:scale-95 hover:opacity-85 flex-shrink-0"
          >
            AURA<span className="text-orange-600">.</span>
          </Link>

          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            <CateBar />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <SearchToggle />

          <CartBadge/>

            <div className="flex items-center justify-center transition-all duration-200 active:scale-95 flex-shrink-0">
              <UserNav />
            </div>
          </div>

        </div>
      </div>

      <div className="md:hidden border-t border-stone-200/50 bg-[#F9F8F6]/90 overflow-hidden">
        <CateBar isMobile={true} />
      </div>
    </header>
  );
}