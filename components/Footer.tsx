
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-[#F9F8F6] text-neutral-900">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <div className="flex flex-col gap-6">
          {/* Brand */}
          <div className="space-y-2">
            <Link
              href="/"
              className="inline-block text-2xl font-bold tracking-[0.12em]"
            >
              AURA<span className="text-orange-600">.</span>
              <span className="ml-2 text-neutral-900">FASHION.</span>
            </Link>

            <p className="text-sm text-neutral-500">
              Modern essentials. Timeless style.
            </p>
          </div>

          {/* Copyright & Portfolio */}
          <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500">
              © {new Date().getFullYear()} AURA Fashion. All rights reserved.
            </p>

            <p className="text-xs text-neutral-500">
              Designed & Developed by{" "}
              <span className="font-semibold text-neutral-900">
                Thurein MyoMin
              </span>
              {" · "}
              <a
                href="https://thurein-portfolio-nplg.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-neutral-900 underline underline-offset-4 transition-colors hover:text-orange-600"
              >
                View Portfolio ↗
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
