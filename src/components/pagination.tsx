"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function pageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pagination({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    sp.set("page", String(p));
    return `/products?${sp.toString()}`;
  };

  const base =
    "flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors";
  const pages = pageWindow(page, totalPages);

  return (
    <nav
      className="mt-14 flex items-center justify-center gap-1.5"
      aria-label="Pagination"
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={cn(base, "border border-line bg-card hover:border-ink")} aria-label="Previous page">
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span className={cn(base, "cursor-not-allowed border border-line/50 text-muted/40")}>
          <ChevronLeft size={16} />
        </span>
      )}

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-muted">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              base,
              p === page
                ? "bg-ink text-cream"
                : "border border-line bg-card hover:border-ink",
            )}
          >
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={cn(base, "border border-line bg-card hover:border-ink")} aria-label="Next page">
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className={cn(base, "cursor-not-allowed border border-line/50 text-muted/40")}>
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
