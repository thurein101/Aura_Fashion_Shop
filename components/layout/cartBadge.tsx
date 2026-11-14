import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getCartCountAction } from "@/app/actions/cart";

export default async function CartBadge() {

  const result = await getCartCountAction();
  const count = result.success ? result.count : 0;

  return (
    <Link
      href="/cart"
      aria-label={`Cart with ${count} items`}
      className="group relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-stone-600 transition-all duration-300 hover:bg-stone-200/50 hover:text-orange-600 active:scale-95"
    >
      <ShoppingBag
        className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.5}
      />

      {count > 0 && (
        <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[9px] font-bold text-white ring-2 ring-[#F9F8F6] shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}