import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";


const inter = Inter({
 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AURA Fashion Shop",
    template: "%s | Aura Fashion Shop",
  },
  description: "Discover the latest trends in fashion, stylish clothing, and exclusive collections at Aura Fashion Shop. Shop now for your ultimate everyday look.",
  keywords: ["fashion shop", "clothing store", "trendy clothes", "Aura fashion", "apparel"],
  authors: [{ name: "Aura Fashion Team" }],
  creator: "Aura Fashion",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aura-fashion-shop.com", 
    title: "Aura Fashion Shop | Trendy & Stylish Clothing",
    description: "Discover the latest trends in fashion and stylish clothing at Aura Fashion Shop.",
    siteName: "Aura Fashion Shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Fashion Shop",
    description: "Discover the latest trends in fashion and stylish clothing at Aura Fashion Shop.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
      
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}