"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/lib/types";
import { SORT_OPTIONS } from "@/lib/api";
import { buildQuery, cn } from "@/lib/utils";

/* ------------------------------ Search input ----------------------------- */

export function ProductSearch({
  initialQuery,
  sort,
}: {
  initialQuery?: string;
  sort?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery ?? "");
  const skipNext = useRef(true);

  // Sync when URL query changes (e.g. chip cleared / category picked)
  useEffect(() => {
    setValue(initialQuery ?? "");
    skipNext.current = true;
  }, [initialQuery]);

  useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    const t = setTimeout(() => {
      const next = value.trim();
      if (next === (initialQuery ?? "")) return;
      router.replace(`/products${buildQuery({ q: next || undefined, sort })}`);
    }, 420);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full">
      <Search
        size={16}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products…"
        className="h-11 w-full rounded-full border border-line bg-card pr-10 pl-11 text-sm outline-none transition-all placeholder:text-muted/70 focus:border-ink focus:ring-2 focus:ring-ink/5"
        aria-label="Search products"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted hover:text-ink"
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

/* ------------------------------ Sort select ------------------------------ */

export function SortSelect({
  sort,
  q,
  category,
}: {
  sort: string;
  q?: string;
  category?: string;
}) {
  const router = useRouter();
  return (
    <div className="relative">
      <select
        value={sort}
        onChange={(e) =>
          router.push(
            `/products${buildQuery({ q, category, sort: e.target.value === "featured" ? undefined : e.target.value })}`,
          )
        }
        className="h-11 cursor-pointer appearance-none rounded-full border border-line bg-card pr-10 pl-4 text-sm font-medium outline-none transition-colors hover:border-ink focus:border-ink"
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

/* ----------------------------- Category list ----------------------------- */

export function CategoryNav({
  categories,
  activeCategory,
  sort,
  onNavigate,
}: {
  categories: Category[];
  activeCategory?: string;
  sort?: string;
  onNavigate?: () => void;
}) {
  const itemClass = (active: boolean) =>
    cn(
      "group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-all",
      active
        ? "bg-ink font-medium text-cream"
        : "text-soft hover:bg-parchment hover:text-ink",
    );

  return (
    <nav aria-label="Categories">
      <p className="px-3.5 text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">
        Categories
      </p>
      <ul className="mt-3 space-y-0.5">
        <li>
          <Link
            href={`/products${buildQuery({ sort: sort === "featured" ? undefined : sort })}`}
            onClick={onNavigate}
            className={itemClass(!activeCategory)}
          >
            All Products
            <span
              className={cn(
                "size-1.5 rounded-full transition-opacity",
                !activeCategory ? "bg-clay" : "bg-muted opacity-0 group-hover:opacity-100",
              )}
            />
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/products${buildQuery({ category: c.slug, sort: sort === "featured" ? undefined : sort })}`}
              onClick={onNavigate}
              className={itemClass(activeCategory === c.slug)}
            >
              {c.name}
              <span
                className={cn(
                  "size-1.5 rounded-full transition-opacity",
                  activeCategory === c.slug
                    ? "bg-clay"
                    : "bg-muted opacity-0 group-hover:opacity-100",
                )}
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* --------------------------- Mobile filter sheet ------------------------- */

export function MobileFilters({
  categories,
  activeCategory,
  sort,
}: {
  categories: Category[];
  activeCategory?: string;
  sort?: string;
}) {
  const [open, setOpen] = useState(false);
  const activeName = categories.find((c) => c.slug === activeCategory)?.name;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-medium transition-colors hover:border-ink lg:hidden"
      >
        <SlidersHorizontal size={15} />
        Filters
        {activeName && (
          <span className="rounded-full bg-clay px-2 py-0.5 text-[11px] font-bold text-cream">
            1
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-ink/45 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 z-[80] max-h-[75vh] overflow-y-auto rounded-t-3xl bg-cream p-6 lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-xl">Filters</p>
                <button
                  onClick={() => setOpen(false)}
                  className="flex size-9 items-center justify-center rounded-full border border-line"
                  aria-label="Close filters"
                >
                  <X size={16} />
                </button>
              </div>
              <CategoryNav
                categories={categories}
                activeCategory={activeCategory}
                sort={sort}
                onNavigate={() => setOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
