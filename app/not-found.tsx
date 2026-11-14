import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-black text-stone-900">404</h1>

      <h2 className="mt-4 text-2xl font-bold">
        Page Not Found
      </h2>

      <p className="mt-2 text-sm text-stone-500">
        Sorry, the page you are looking for doesn't exist.
      </p>

      <Link
        href="/"
        className="mt-6 rounded-full bg-stone-900 px-8 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
      >
        Back to Home
      </Link>
    </main>
  );
}