import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ChevronRight,
  Package,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Truck,
  Weight,
} from "lucide-react";
import { getProduct, getProducts } from "@/lib/api";
import { formatDate, formatPrice, originalPrice, slugToName, cn } from "@/lib/utils";
import { Gallery } from "@/components/gallery";
import { AddToCartPanel } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { RatingStars } from "@/components/rating-stars";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.description };
}

function stockInfo(stock: number, availability: string) {
  if (stock <= 0 || availability === "Out of Stock")
    return {
      label: "Out of stock",
      className: "bg-clay/10 text-clay",
      dot: "bg-clay",
    };
  if (availability === "Low Stock" || stock < 10)
    return {
      label: `Low stock — only ${stock} left`,
      className: "bg-gold/15 text-[#8a6a1f]",
      dot: "bg-gold",
    };
  return {
    label: "In stock",
    className: "bg-moss/10 text-moss",
    dot: "bg-moss",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);
  if (!product) notFound();

  const related = await getProducts({
    category: product.category,
    limit: 5,
    revalidate: 3600,
  })
    .then((r) => r.products.filter((p) => p.id !== product.id).slice(0, 4))
    .catch(() => []);

  const listPrice = originalPrice(product.price, product.discountPercentage);
  const stock = stockInfo(product.stock, product.availabilityStatus);

  const specs = [
    { icon: Package, label: "SKU", value: product.sku },
    { icon: Weight, label: "Weight", value: `${product.weight} kg` },
    {
      icon: Ruler,
      label: "Dimensions",
      value: `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`,
    },
    {
      icon: ShieldCheck,
      label: "Warranty",
      value: product.warrantyInformation,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pb-24 sm:px-8">
      {/* Breadcrumb */}
      <nav
        className="flex flex-wrap items-center gap-1.5 pt-8 text-xs text-muted sm:pt-12"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="transition-colors hover:text-ink">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/products" className="transition-colors hover:text-ink">
          Shop
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/products?category=${product.category}`}
          className="transition-colors hover:text-ink"
        >
          {slugToName(product.category)}
        </Link>
        <ChevronRight size={12} />
        <span className="line-clamp-1 max-w-48 text-ink sm:max-w-xs">
          {product.title}
        </span>
      </nav>

      {/* Main */}
      <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Gallery
          images={product.images}
          title={product.title}
          discount={product.discountPercentage}
        />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {product.brand && (
              <span className="chip">{product.brand}</span>
            )}
            <Link
              href={`/products?category=${product.category}`}
              className="chip transition-colors hover:border-ink hover:text-ink"
            >
              {slugToName(product.category)}
            </Link>
          </div>

          <h1 className="mt-4 font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
            {product.title}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <RatingStars rating={product.rating} size={16} />
            <span className="text-sm font-medium">
              {product.rating.toFixed(1)}
            </span>
            <a
              href="#reviews"
              className="text-sm text-muted underline-offset-4 transition-colors hover:text-clay hover:underline"
            >
              {product.reviews.length} reviews
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.discountPercentage >= 1 && (
              <>
                <span className="text-lg text-muted line-through">
                  {formatPrice(listPrice)}
                </span>
                <span className="rounded-full bg-clay/10 px-2.5 py-1 text-xs font-bold text-clay">
                  Save {Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-soft">
            {product.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span
              className={cn(
                "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold",
                stock.className,
              )}
            >
              <span className={cn("size-1.5 rounded-full", stock.dot)} />
              {stock.label}
            </span>
            <span className="flex items-center gap-2 rounded-full bg-parchment px-3.5 py-1.5 text-xs font-medium text-soft">
              <Truck size={13} />
              {product.shippingInformation}
            </span>
          </div>

          <div className="mt-8 border-t border-line pt-8">
            <AddToCartPanel product={product} />
          </div>

          {/* Assurance rows */}
          <div className="mt-8 space-y-0 border-t border-line">
            {[
              { icon: Truck, label: "Shipping", value: product.shippingInformation },
              { icon: RotateCcw, label: "Returns", value: product.returnPolicy },
              { icon: ShieldCheck, label: "Warranty", value: product.warrantyInformation },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-4 border-b border-line py-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-parchment">
                  <row.icon size={16} className="text-soft" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
                    {row.label}
                  </p>
                  <p className="mt-0.5 text-sm">{row.value}</p>
                </div>
              </div>
            ))}
          </div>

          {product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line px-3 py-1 text-[11px] font-medium text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Specs + Reviews */}
      <div className="mt-20 grid gap-12 border-t border-line pt-14 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <p className="eyebrow text-muted">The details</p>
          <h2 className="mt-3 font-display text-3xl font-medium">
            Specifications
          </h2>
          <dl className="mt-7 overflow-hidden rounded-2xl border border-line bg-card">
            {specs.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "flex items-center gap-4 px-5 py-4",
                  i !== specs.length - 1 && "border-b border-line/70",
                )}
              >
                <s.icon size={16} className="shrink-0 text-muted" />
                <dt className="w-24 shrink-0 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                  {s.label}
                </dt>
                <dd className="text-sm font-medium">{s.value}</dd>
              </div>
            ))}
            <div className="flex items-center gap-4 px-5 py-4">
              <Package size={16} className="shrink-0 text-muted" />
              <dt className="w-24 shrink-0 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                Min. order
              </dt>
              <dd className="text-sm font-medium">
                {product.minimumOrderQuantity} units
              </dd>
            </div>
          </dl>
        </div>

        <div id="reviews" className="scroll-mt-28">
          <p className="eyebrow text-muted">Word on the street</p>
          <div className="mt-3 flex flex-wrap items-baseline gap-4">
            <h2 className="font-display text-3xl font-medium">Reviews</h2>
            <span className="flex items-center gap-2 text-sm text-muted">
              <RatingStars rating={product.rating} size={14} />
              {product.rating.toFixed(1)} average
            </span>
          </div>

          <div className="mt-7 space-y-4">
            {product.reviews.length > 0 ? (
              product.reviews.map((review, i) => (
                <article
                  key={`${review.reviewerName}-${i}`}
                  className="rounded-2xl border border-line bg-card p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-parchment font-display text-sm font-semibold text-soft">
                        {review.reviewerName
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                      <div>
                        <p className="text-sm font-medium">
                          {review.reviewerName}
                        </p>
                        <p className="text-[11px] text-muted">
                          {formatDate(review.date)}
                        </p>
                      </div>
                    </div>
                    <RatingStars rating={review.rating} size={13} />
                  </div>
                  <p className="mt-3.5 text-sm leading-relaxed text-soft">
                    {review.comment}
                  </p>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
                No reviews yet — be the first to fall in love.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-muted">Keep looking</p>
              <h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">
                You may also like
              </h2>
            </div>
            <Link
              href={`/products?category=${product.category}`}
              className="text-sm font-medium text-soft transition-colors hover:text-clay"
            >
              More {slugToName(product.category)} →
            </Link>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
