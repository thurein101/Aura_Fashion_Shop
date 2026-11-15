
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
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
        className="h-9 rounded-full border-stone-300 bg-transparent px-5 text-[11px] font-bold uppercase tracking-widest text-stone-600 transition-all duration-300 hover:border-stone-900 hover:bg-stone-900 hover:text-white active:scale-95"
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
         className="flex items-center gap-1.5 rounded-full outline-none transition-all hover:bg-stone-200/60 focus-visible:ring-2 focus-visible:ring-stone-400"
        >
          {/* Avatar */}
       <div className="flex h-7 w-7 mb-0.5 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white shadow-sm">
  {initial}
</div>

          <ChevronDown className="hidden h-3.5 w-3.5 text-stone-500 sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-56 rounded-xl border-stone-200 bg-white p-2 shadow-xl"
      >
        {/* User Info */}
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-stone-900">
              {userName}
            </span>
            <span className="text-xs font-normal text-stone-500">
              {session.user.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-stone-100" />

        {/* My Orders */}
        <DropdownMenuItem asChild>
          <Link
            href="/my-orders"
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700"
          >
            <Package className="h-4 w-4 text-stone-500" />
            My Orders
          </Link>
        </DropdownMenuItem>

        {/* My Favourites */}
        <DropdownMenuItem asChild>
          <Link
            href="/favourites"
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700"
          >
            <Heart className="h-4 w-4 text-stone-500" />
            My Favourites
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-stone-100" />

        {/* Logout */}
        <DropdownMenuItem
          onSelect={() => handleSignOut()}
          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
