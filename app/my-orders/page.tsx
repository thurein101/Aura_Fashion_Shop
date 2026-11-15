import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { getSession } from "@/lib/session";
import { getUserOrders } from "@/lib/data/my-";
import MyOrdersClient from "@/components/my/My-Orders";
import { CheckoutSkeleton } from "@/components/loading/checkout";

async function MyOrdersPageInner() {
  await connection();

  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <main className="container mx-auto min-h-screen px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          My Orders
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View and manage your order history
        </p>
      </div>

      <MyOrdersClient orders={orders} />
    </main>
  );
}

export default function MyOrderPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <MyOrdersPageInner />
    </Suspense>
  );
}