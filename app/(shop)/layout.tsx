import { getSession } from "@/lib/session";
import { connection } from "next/server";
import React, { Suspense } from "react";

import ShopHeader from "@/components/layout/shop-header";
import UserNavClient from "@/components/layout/user-nav-client";
import HeaderLoading from "@/components/loading/header-skeleton";
import HomeLoading from "@/components/loading/HomeLoading";
import { FavouriteProvider } from "@/components/Products/providers/Fav-Provider";
import { getUserFavouriteIds } from "@/lib/data/favourite";
import { Toaster } from "sonner";

function Loading() {
  return (
    <>
      <HeaderLoading />
      <HomeLoading />
    </>
  );
}

async function ShopShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  await connection();

  const favouriteIds = session?.user?.id
    ? await getUserFavouriteIds(session.user.id)
    : [];

  return (
    <FavouriteProvider
      initialFavouriteIds={favouriteIds}
      key={session?.user.id}
    >
      <div className="flex flex-col min-h-screen">
        <ShopHeader />

        <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8">
          {children}
        </main>
        <Toaster richColors position="top-center" />
      </div>
    </FavouriteProvider>
  );
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <ShopShell>{children}</ShopShell>
    </Suspense>
  );
}
