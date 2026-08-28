import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { getCategories } from "@/lib/api";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MiniShop - Objects of Everyday Desire",
    template: "%s · MiniShop",
  },
  description:
    "A curated catalogue of tech, beauty and homeware. 190+ products, free shipping over $50, 30-day returns.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    categories = await getCategories();
  } catch {
    // Header still renders without the category menu if the API is down.
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} flex min-h-screen flex-col bg-cream font-sans text-ink antialiased`}>
        <div className="grain" aria-hidden="true" />
        <SiteHeader categories={categories} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CartDrawer />
        <Toaster
          position="bottom-right"
          gap={8}
          toastOptions={{
            style: {
              background: "#17120b",
              color: "#f3eee3",
              border: "1px solid #33291a",
              borderRadius: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
