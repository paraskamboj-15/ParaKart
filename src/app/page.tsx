import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Asterisk } from "lucide-react";
import { getCategories, getProducts } from "@/lib/api";
import type { Product, ProductsResponse } from "@/lib/types";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

const EMPTY: ProductsResponse = { products: [], total: 0, skip: 0, limit: 0 };
const safe = (p: Promise<ProductsResponse>) => p.catch(() => EMPTY);

const FEATURED_CATEGORIES = [
  "smartphones",
  "mens-watches",
  "sunglasses",
  "fragrances",
];

const TILES = [
  { slug: "smartphones", label: "Smartphones", note: "Pocket power" },
  { slug: "mens-watches", label: "Watches", note: "Quiet flex" },
  { slug: "beauty", label: "Beauty", note: "Small rituals" },
  { slug: "furniture", label: "Furniture", note: "Room makers" },
  { slug: "fragrances", label: "Fragrances", note: "Invisible outfits" },
  { slug: "laptops", label: "Laptops", note: "Daily drivers" },
];

export default async function HomePage() {
  const [categories, ...rest] = await Promise.all([
    getCategories().catch(() => []),
    ...FEATURED_CATEGORIES.map((c) =>
      safe(getProducts({ category: c, limit: 2, revalidate: 3600 })),
    ),
    ...TILES.map((t) =>
      safe(getProducts({ category: t.slug, limit: 1, revalidate: 86400 })),
    ),
    safe(getProducts({ limit: 4, skip: 60, revalidate: 3600 })),
  ]);

  const featuredResponses = rest.slice(0, FEATURED_CATEGORIES.length);
  const tileResponses = rest.slice(
    FEATURED_CATEGORIES.length,
    FEATURED_CATEGORIES.length + TILES.length,
  );
  const newArrivals = rest[rest.length - 1]?.products ?? [];

  const featured: Product[] = featuredResponses.flatMap((r) => r.products);
  const heroPicks = [
    featuredResponses[0]?.products[0],
    featuredResponses[1]?.products[0],
    featuredResponses[2]?.products[0],
  ].filter((p): p is Product => Boolean(p));

  return (
    <div>
      <Hero picks={heroPicks} />

      {/* Category marquee */}
      <div className="overflow-hidden border-y border-ink/10 bg-ink py-5 text-cream">
        <div className="flex w-max animate-marquee-slow items-center gap-10">
          {[...categories, ...categories].map((c, i) => (
            <Link
              key={`${c.slug}-${i}`}
              href={`/products?category=${c.slug}`}
              className="group flex items-center gap-10 whitespace-nowrap"
            >
              <span className="font-display text-2xl font-light tracking-wide transition-colors group-hover:text-clay sm:text-3xl">
                {c.name}
              </span>
              <Asterisk className="size-5 text-clay transition-transform duration-500 group-hover:rotate-90" />
            </Link>
          ))}
        </div>
      </div>

      {/* Category tiles */}
      <section id="categories" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-muted">Collections</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Find your fix
              </h2>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-2 text-sm font-medium text-soft transition-colors hover:text-clay"
            >
              View all products
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((tile, i) => {
            const product = tileResponses[i]?.products[0];
            return (
              <Reveal key={tile.slug} delay={(i % 3) * 0.08}>
                <Link
                  href={`/products?category=${tile.slug}`}
                  className="group relative block overflow-hidden rounded-3xl border border-line/60 bg-parchment"
                >
                  <div className="relative aspect-[4/3]">
                    {product && (
                      <Image
                        src={product.thumbnail}
                        alt={tile.label}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain p-10 mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108"
                      />
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/75 via-ink/30 to-transparent p-6 pt-14 text-cream">
                    <div>
                      <p className="text-[11px] font-medium tracking-[0.18em] uppercase opacity-70">
                        {tile.note}
                      </p>
                      <p className="mt-1 font-display text-2xl font-medium">
                        {tile.label}
                      </p>
                    </div>
                    <span className="flex size-11 items-center justify-center rounded-full bg-cream text-ink transition-all duration-300 group-hover:bg-clay group-hover:text-cream">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto w-full max-w-[1400px] px-5 pb-20 sm:px-8 sm:pb-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-12">
            <div>
              <p className="eyebrow text-muted">The icons</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Most coveted
              </h2>
            </div>
            <Link
              href="/products?sort=rating"
              className="group flex items-center gap-2 text-sm font-medium text-soft transition-colors hover:text-clay"
            >
              Shop top rated
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
          {featured.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* Editorial band */}
      <section className="px-4 sm:px-6">
        <div className="relative mx-auto w-full max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-ink px-6 py-20 text-center text-cream sm:px-10 sm:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-clay/15 blur-3xl" />
          </div>
          <Reveal className="relative">
            <p className="mx-auto max-w-4xl font-display text-[clamp(1.8rem,4.5vw,3.6rem)] leading-[1.15] font-light">
              “Good design is <em className="text-clay italic">invisible</em>{" "}
              until the moment you hold it — then it&rsquo;s the only thing you
              notice.”
            </p>
            <p className="mt-6 text-[11px] font-semibold tracking-[0.24em] text-cream/40 uppercase">
              The Forma buying philosophy
            </p>
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 border-t border-cream/10 pt-10 sm:grid-cols-4">
              {[
                ["194", "products"],
                ["24", "categories"],
                ["4.8", "avg. rating"],
                ["30", "day returns"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display text-3xl font-semibold text-clay sm:text-4xl">
                    {num}
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.18em] text-cream/50 uppercase">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto w-full max-w-[1400px] px-5 pt-20 sm:px-8 sm:pt-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-12">
            <div>
              <p className="eyebrow text-muted">Fresh off the truck</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                New arrivals
              </h2>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-2 text-sm font-medium text-soft transition-colors hover:text-clay"
            >
              Shop everything
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {newArrivals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
