
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Heart,
  LogOut,
  ChevronDown,
} from "lucide-react";

import type { getSession } from "@/lib/session";
import { signOut } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserNavClientProps = {
  session: Awaited<ReturnType<typeof getSession>>;
};

export default function UserNavClient({
  session,
}: UserNavClientProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
          onError: (ctx) => {
            console.error("Sign out failed:", ctx.error.message);
          },
        },
      });
    } catch (error) {
      console.error("Unexpected sign out error:", error);
    }
  };

  // Not logged in
  if (!session) {
    return (
      <Button
        asChild
        variant="outline"
        className="h-9 rounded-full border-[#E9E4DC] bg-transparent px-5 text-[11px] font-bold uppercase tracking-widest text-stone-700 transition-all duration-300 hover:border-orange-600 hover:bg-orange-600 hover:text-white active:scale-95"
      >
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  const userName = session.user.name || "User";
  const initial = userName.trim().charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open profile menu"
          className="group flex items-center gap-2 rounded-full p-1 outline-none transition-all duration-300 hover:bg-orange-50 focus-visible:ring-2 focus-visible:ring-orange-300"
        >
          {/* Avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-orange-600">
            {initial}
          </div>

          <ChevronDown className="h-3.5 w-3.5 text-stone-500 transition-transform duration-300 group-data-[state=open]:rotate-180 group-hover:text-orange-600" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-60 origin-top-right rounded-2xl border border-[#E9E4DC] bg-[#FDFCFB] p-2 shadow-xl shadow-stone-900/10
        data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2
        data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-2
        duration-200"
      >
        {/* User Info */}
        <DropdownMenuLabel className="px-3 py-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-stone-900">
              {userName}
            </span>
            <span className="truncate text-xs font-normal text-stone-500">
              {session.user.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-[#EEE9E1]" />

        {/* My Orders */}
        <DropdownMenuItem asChild>
          <Link
            href="/my-orders"
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-700 transition-all duration-200 hover:bg-orange-50 hover:text-orange-700 focus:bg-orange-50 focus:text-orange-700"
          >
            <Package className="h-4 w-4 text-stone-500 transition-colors group-hover:text-orange-600" />
            My Orders
          </Link>
        </DropdownMenuItem>

        {/* My Favourites */}
        <DropdownMenuItem asChild>
          <Link
            href="/favourites"
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-700 transition-all duration-200 hover:bg-orange-50 hover:text-orange-700 focus:bg-orange-50 focus:text-orange-700"
          >
            <Heart className="h-4 w-4 text-stone-500" />
            My Favourites
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[#EEE9E1]" />

        {/* Logout */}
        <DropdownMenuItem
          onSelect={() => handleSignOut()}
          className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors duration-200 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
