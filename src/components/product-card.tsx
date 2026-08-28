"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { cn, formatPrice, originalPrice, slugToName } from "@/lib/utils";

export function ProductCard({
  product,
  index = 0,
  priority = false,
}: {
  product: Product;
  index?: number;
  priority?: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const outOfStock = product.stock <= 0;
  const listPrice = originalPrice(product.price, product.discountPercentage);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success("Added to cart", { description: product.title });
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: (index % 4) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/products/${product.id}`} className="group block">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-line/60 bg-parchment transition-shadow duration-500",
            "group-hover:shadow-[0_24px_50px_-24px_rgba(23,18,11,0.35)]",
          )}
        >
          <div className="relative aspect-[4/5]">
            <Image
              src={product.images?.[0] ?? product.thumbnail}
              alt={product.title}
              fill
              priority={priority}
              sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 50vw"
              className={cn(
                "object-contain p-6 mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover:scale-[1.07]",
                outOfStock && "opacity-50 grayscale",
              )}
            />
          </div>

          {product.discountPercentage >= 8 && (
            <span className="absolute top-3 left-3 rounded-full bg-clay px-2.5 py-1 text-[11px] font-bold tracking-wide text-cream">
              −{Math.round(product.discountPercentage)}%
            </span>
          )}

          {outOfStock && (
            <span className="absolute top-3 right-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold tracking-wide text-cream">
              Sold out
            </span>
          )}

          {!outOfStock && (
            <button
              onClick={handleAdd}
              aria-label={`Add ${product.title} to cart`}
              className={cn(
                "absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full bg-ink text-cream shadow-lg",
                "translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
                "hover:scale-105 hover:bg-clay active:scale-95",
              )}
            >
              <Plus size={18} />
            </button>
          )}
        </div>

        <div className="mt-3.5 space-y-1 px-0.5">
          <div className="flex items-center justify-between text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
            <span>{slugToName(product.category)}</span>
            <span className="flex items-center gap-1 normal-case">
              <Star size={11} className="fill-gold stroke-gold" />
              {product.rating.toFixed(1)}
            </span>
          </div>
          <h3 className="line-clamp-1 font-medium transition-colors duration-300 group-hover:text-clay">
            {product.title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[17px] font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.discountPercentage >= 8 && (
              <span className="text-[13px] text-muted line-through">
                {formatPrice(listPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
