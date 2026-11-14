"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { getSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

type UserNavClientProps = {
  session: Awaited<ReturnType<typeof getSession>>;
};

export default function UserNavClient({ session }: UserNavClientProps) {
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
      console.error("An unexpected error occurred during sign out:", error);
    }
  };
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

  return (
    <Button
      onClick={handleSignOut}
      aria-label="Profile"
      variant="ghost"
      className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-transparent hover:bg-stone-200/50 hover:text-orange-600 transition-all duration-300 active:scale-95 p-0"
    >
      Log Out
    </Button>
  );
}
