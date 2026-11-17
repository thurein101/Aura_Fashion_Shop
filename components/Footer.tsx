
"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer className="relative border-t border-neutral-200 bg-[#F9F8F6] text-neutral-900">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-col gap-6">
            {/* Brand */}
            <div className="space-y-2 text-center sm:text-left">
              <Link
                href="/"
                className="inline-block text-xl font-bold tracking-[0.1em] transition-opacity hover:opacity-80 sm:text-2xl sm:tracking-[0.12em]"
              >
                AURA<span className="text-orange-600">.</span>
                <span className="ml-1.5 text-neutral-900 sm:ml-2">
                  FASHION.
                </span>
              </Link>

              <p className="text-xs text-neutral-500 sm:text-sm">
                Modern essentials. Timeless style.
              </p>
            </div>

            {/* Copyright & Portfolio */}
            <div className="flex flex-col items-center gap-3 border-t border-neutral-200 pt-5 text-center sm:flex-row sm:justify-between sm:gap-4 sm:pt-6 sm:text-left">
              <p className="text-[11px] leading-relaxed text-neutral-500 sm:text-xs">
                © {new Date().getFullYear()} AURA Fashion. All rights reserved.
              </p>

              <p className="flex flex-wrap items-center justify-center gap-x-1 text-[11px] leading-relaxed text-neutral-500 sm:justify-end sm:text-xs">
                <span>Designed & Developed by</span>

                <span className="font-semibold text-neutral-900">
                  Thurein MyoMin
                </span>

                <span>·</span>

                <Link
                  href="https://thurein-portfolio-nplg.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-neutral-900 underline underline-offset-4 transition-colors duration-200 hover:text-orange-600"
                >
                  View Portfolio
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back To Top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        className="fixed bottom-5 right-4 z-50 flex size-11 items-center justify-center rounded-full border border-orange-500/20 bg-orange-600 text-white shadow-lg shadow-orange-900/20 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-700 hover:shadow-xl active:scale-95 sm:bottom-7 sm:right-7 sm:size-12"
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </button>
    </>
  );
}
