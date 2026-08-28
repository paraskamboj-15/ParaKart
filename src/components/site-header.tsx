"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, Search, ShoppingBag, Sparkle, X } from "lucide-react";
import type { Category } from "@/lib/types";
import { cn, buildQuery } from "@/lib/utils";
import { useCart, useCartCount, useHydrated } from "@/store/cart";

const ANNOUNCEMENTS = [
  "Free shipping on orders over $50",
  "30-day no-fuss returns",
  "The Autumn Edit has landed",
  "Rated 4.8 by 12,000+ customers",
];

const FEATURED_LINKS = [
  { label: "Shop All", href: "/products" },
  { label: "Smartphones", href: "/products?category=smartphones" },
  { label: "Laptops", href: "/products?category=laptops" },
  { label: "Fragrances", href: "/products?category=fragrances" },
  { label: "Furniture", href: "/products?category=furniture" },
];

export function SiteHeader({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement marquee */}
      <div className="overflow-hidden bg-ink py-2 text-cream">
        <div className="flex w-max animate-marquee gap-8">
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map(
            (text, i) => (
              <span
                key={i}
                className="flex items-center gap-8 text-[11px] font-medium tracking-[0.18em] uppercase whitespace-nowrap"
              >
                {text}
                <Sparkle size={10} className="fill-clay text-clay" />
              </span>
            ),
          )}
        </div>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-line bg-cream/85 backdrop-blur-xl"
            : "border-transparent bg-cream",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
          {/* Left: nav (desktop) / burger (mobile) */}
          <nav className="hidden flex-1 items-center gap-6 lg:flex">
            {FEATURED_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative text-[13px] font-medium text-soft transition-colors hover:text-ink",
                  link.href === "/products" &&
                    pathname.startsWith("/products") &&
                    "text-ink",
                )}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-clay transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <button
            className="flex size-10 items-center justify-center rounded-full border border-line bg-card lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          {/* Center: wordmark */}
          <Link
            href="/"
            className="group flex items-baseline gap-1 font-display text-[26px] font-semibold tracking-[0.16em]"
          >
            MiniShop
            <span className="inline-block size-2 rounded-full bg-clay transition-transform duration-500 group-hover:rotate-45 group-hover:scale-125" />
          </Link>

          {/* Right: actions */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex size-10 items-center justify-center rounded-full border border-line bg-card text-ink transition-colors hover:border-ink"
              aria-label="Search products"
            >
              <Search size={17} />
            </button>
            <CartButton />
          </div>
        </div>
      </div>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <SearchOverlay onClose={() => setSearchOpen(false)} />
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            categories={categories}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------ Cart button ------------------------------ */

function CartButton() {
  const openCart = useCart((s) => s.openCart);
  const count = useCartCount();
  const hydrated = useHydrated();

  return (
    <button
      onClick={openCart}
      className="relative flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-cream transition-colors hover:bg-clay"
      aria-label="Open cart"
    >
      <ShoppingBag size={16} />
      <span className="hidden text-[13px] font-medium sm:block">Cart</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={hydrated ? count : "ssr"}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          className="flex size-5 items-center justify-center rounded-full bg-clay text-[11px] font-bold text-cream"
        >
          {hydrated ? count : 0}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/* ----------------------------- Search overlay ---------------------------- */

const SUGGESTIONS = ["phone", "laptop", "watch", "perfume", "lamp", "sofa", "serum", "sunglasses"];

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (q: string) => {
    const query = q.trim();
    if (!query) return;
    router.push(`/products${buildQuery({ q: query })}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-cream/97 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col px-6 pt-28 sm:pt-36">
        <button
          onClick={onClose}
          className="absolute top-7 right-7 flex size-11 items-center justify-center rounded-full border border-line bg-card transition-colors hover:border-ink"
          aria-label="Close search"
        >
          <X size={18} />
        </button>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow text-muted">Search the catalogue</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(value);
            }}
            className="mt-5 flex items-center gap-4 border-b-2 border-ink pb-4"
          >
            <Search size={26} className="shrink-0 text-muted" />
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Try “phone”, “lamp”, “serum”…"
              className="w-full bg-transparent font-display text-3xl outline-none placeholder:text-muted/50 sm:text-4xl"
            />
            <button
              type="submit"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-colors hover:bg-clay"
              aria-label="Search"
            >
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <span className="text-xs tracking-[0.18em] text-muted uppercase">
              Popular
            </span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                className="chip transition-colors hover:border-ink hover:text-ink"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ------------------------------ Mobile menu ------------------------------ */

function MobileMenu({
  categories,
  onClose,
}: {
  categories: Category[];
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-y-0 left-0 z-50 flex w-[320px] max-w-[88vw] flex-col bg-cream lg:hidden"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <span className="font-display text-xl font-semibold tracking-[0.16em]">
            MiniShop
            <span className="ml-1 inline-block size-1.5 rounded-full bg-clay" />
          </span>
          <button
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full border border-line"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">
            Shop
          </p>
          <ul className="mt-3 space-y-1">
            <li>
              <Link
                href="/products"
                onClick={onClose}
                className="block rounded-lg px-3 py-2.5 font-display text-lg hover:bg-parchment"
              >
                All Products
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products?category=${c.slug}`}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-2.5 font-display text-lg hover:bg-parchment"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-line px-6 py-5 text-xs text-muted">
          Free shipping over $50 · 30-day returns
        </div>
      </motion.aside>
    </>
  );
}
