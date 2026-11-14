import Link from "next/link";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F9F8F6] overflow-hidden">
      
      <div className="hidden md:flex relative flex-col justify-center w-1/2 p-16 lg:p-24 bg-stone-900 text-stone-50 h-screen overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 bg-[url('@/public/sketches.png')] bg-cover bg-center mix-blend-overlay"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <Link
            href="/"
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-widest hover:opacity-80 transition-opacity"
          >
            AURA<span className="text-orange-500">.</span>
          </Link>
          <p className="mt-6 max-w-md text-stone-400 text-sm md:text-base leading-relaxed hidden md:block">
            Discover your signature style. Elevate your everyday wardrobe with our carefully curated minimal collections.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 lg:p-24 h-screen">
        
        <div className="md:hidden w-full flex justify-center mb-8">
          <Link
            href="/"
            className="text-4xl font-black tracking-widest text-stone-900 transition-transform active:scale-95"
          >
            AURA<span className="text-orange-600">.</span>
          </Link>
        </div>

        <div className="w-full max-w-md  [&::-webkit-scrollbar]:hidden">
          {children} 
        </div>
      </div>
      
    </div>
  );
}