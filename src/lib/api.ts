import type { Category, Product, ProductsResponse } from "@/lib/types";

const BASE = "https://dummyjson.com";

export interface GetProductsParams {
  limit?: number;
  skip?: number;
  q?: string;
  category?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  revalidate?: number;
}

export async function getProducts({
  limit = 12,
  skip = 0,
  q,
  category,
  sortBy,
  order,
  revalidate = 300,
}: GetProductsParams = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });
  if (q) params.set("q", q);
  if (sortBy) params.set("sortBy", sortBy);
  if (order) params.set("order", order);

  // The API cannot combine search + category; search takes precedence.
  const path = q
    ? "/products/search"
    : category
      ? `/products/category/${encodeURIComponent(category)}`
      : "/products";

  const res = await fetch(`${BASE}${path}?${params.toString()}`, {
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
  return res.json() as Promise<ProductsResponse>;
}

export async function getProduct(id: string | number): Promise<Product | null> {
  const res = await fetch(`${BASE}/products/${id}`, {
    next: { revalidate: 86_400 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
  return res.json() as Promise<Product>;
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/products/categories`, {
    next: { revalidate: 86_400 },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json() as Promise<Category[]>;
}

/* ------------------------------ Sort options ----------------------------- */

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "title", label: "Name: A to Z" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function sortToQuery(sort: string): {
  sortBy?: string;
  order?: "asc" | "desc";
} {
  switch (sort) {
    case "price-asc":
      return { sortBy: "price", order: "asc" };
    case "price-desc":
      return { sortBy: "price", order: "desc" };
    case "rating":
      return { sortBy: "rating", order: "desc" };
    case "title":
      return { sortBy: "title", order: "asc" };
    default:
      return {};
  }
}
