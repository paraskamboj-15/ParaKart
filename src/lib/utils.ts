import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

/** DummyJSON `price` is the discounted price; recover the original list price. */
export function originalPrice(price: number, discountPercentage: number) {
  if (!discountPercentage) return price;
  return price / (1 - discountPercentage / 100);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function slugToName(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function buildQuery(
  params: Record<string, string | number | undefined>,
): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") sp.set(key, String(value));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}
