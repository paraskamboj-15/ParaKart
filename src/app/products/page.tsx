import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, PackageSearch, X } from "lucide-react";
import { getCategories, getProducts, sortToQuery } from "@/lib/api";
import type { ProductsResponse } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { Pagination } from "@/components/pagination";
import {
  CategoryNav,
  MobileFilters,
  ProductSearch,
  SortSelect,
} from "@/components/filters";
import { buildQuery, slugToName } from "@/lib/utils";

const PAGE_SIZE = 12;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = first(sp.q)?.trim() || undefined;
  const category = first(sp.category) || undefined;
  const sort = first(sp.sort) || "featured";
  const page = Math.max(1, parseInt(first(sp.page) ?? "1", 10) || 1);
  const { sortBy, order } = sortToQuery(sort);
  const skip = (page - 1) * PAGE_SIZE;

  let data: ProductsResponse = { products: [], total: 0, skip: 0, limit: PAGE_SIZE };
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let failed = false;

  try {
    [data, categories] = await Promise.all([
      getProducts({ limit: PAGE_SIZE, skip, q, category, sortBy, order }),
      getCategories(),
    ]);
  } catch {
    failed = true;
  }

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  if (data.total > 0 && page > totalPages) {
    redirect(
      `/products${buildQuery({
        q,
        category,
        sort: sort === "featured" ? undefined : sort,
        page: totalPages,
      })}`,
    );
  }

  const categoryName = category ? slugToName(category) : undefined;
  const heading = q
    ? `Results for “${q}”`
    : categoryName ?? "All Products";
  const from = data.total === 0 ? 0 : skip + 1;
  const to = Math.min(skip + PAGE_SIZE, data.total);
  const paginationParams = {
    q,
    category,
    sort: sort === "featured" ? undefined : sort,
  };
  const clearHref = `/products${buildQuery({ sort: sort === "featured" ? undefined : sort })}`;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pb-24 sm:px-8">
      {/* Header */}
      <div className="pt-10 pb-8 sm:pt-14">
        <nav className="flex items-center gap-1.5 text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/products" className="transition-colors hover:text-ink">
            Shop
          </Link>
          {(q || categoryName) && (
            <>
              <ChevronRight size={12} />
              <span className="text-ink">{q ?? categoryName}</span>
            </>
          )}
        </nav>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-6xl">
          {heading}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {failed
            ? "We couldn't reach the catalogue just now."
            : data.total === 0
              ? "No products found"
              : `Showing ${from}–${to} of ${data.total} products`}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-y border-line py-4">
        <div className="min-w-52 flex-1 sm:max-w-sm">
          <ProductSearch key={q ?? "empty"} initialQuery={q} sort={sort} />
        </div>
        <div className="flex items-center gap-3">
          <MobileFilters
            categories={categories}
            activeCategory={category}
            sort={sort}
          />
          <SortSelect sort={sort} q={q} category={category} />
        </div>

        {/* Active filter chips */}
        {(q || category) && (
          <div className="ml-auto flex items-center gap-2">
            {q && (
              <Link href={clearHref} className="chip group transition-colors hover:border-clay hover:text-clay">
                “{q}”
                <X size={12} className="text-muted transition-colors group-hover:text-clay" />
              </Link>
            )}
            {category && (
              <Link href={clearHref} className="chip group transition-colors hover:border-clay hover:text-clay">
                {categoryName}
                <X size={12} className="text-muted transition-colors group-hover:text-clay" />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[230px_1fr]">
        <aside className="hidden self-start lg:sticky lg:top-28 lg:block">
          <CategoryNav
            categories={categories}
            activeCategory={category}
            sort={sort}
          />
        </aside>

        <div>
          {data.products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 2xl:grid-cols-4">
                {data.products.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={i}
                    priority={page === 1 && i < 4}
                  />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                params={paginationParams}
              />
            </>
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-card/50 px-8 py-24 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-parchment">
                <PackageSearch size={26} className="text-muted" />
              </span>
              <h2 className="mt-5 font-display text-2xl">
                {failed ? "The catalogue is resting" : "Nothing matched"}
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted">
                {failed
                  ? "We couldn't load products right now. Take a breath and try again in a moment."
                  : "Try a different search term, or clear the filters and browse the full catalogue."}
              </p>
              <Link href="/products" className="btn-primary mt-7">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
