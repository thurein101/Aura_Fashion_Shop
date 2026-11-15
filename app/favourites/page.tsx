
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUserFavourites } from "@/lib/data/my-";
import FavouritesClient from "@/components/my/MyFav";

export default async function FavouritesPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const products = await getUserFavourites(session.user.id);

  return (
    <main className="container mx-auto min-h-screen px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          My Favourites
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your favourite products
        </p>
      </div>

      <FavouritesClient
        products={products as Parameters<typeof FavouritesClient>[0]["products"]}
      />
    </main>
  );
}
