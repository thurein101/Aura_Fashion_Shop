import FavouritesClient from "@/components/my/MyFav";

export default function FavouritesPage() {
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

      <FavouritesClient />
    </main>
  );
}