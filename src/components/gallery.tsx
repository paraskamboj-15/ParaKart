"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Gallery({
  images,
  title,
  discount,
}: {
  images: string[];
  title: string;
  discount: number;
}) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [];

  if (list.length === 0) return null;

  return (
    <div className="space-y-3 lg:sticky lg:top-28">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-line/60 bg-parchment">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={list[active]}
              alt={`${title} — image ${active + 1}`}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-contain p-8 mix-blend-multiply sm:p-12"
            />
          </motion.div>
        </AnimatePresence>

        {discount >= 8 && (
          <span className="absolute top-4 left-4 z-10 rounded-full bg-clay px-3 py-1.5 text-xs font-bold tracking-wide text-cream">
            Save {Math.round(discount)}%
          </span>
        )}
      </div>

      {list.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-xl border bg-parchment transition-all duration-300",
                active === i
                  ? "border-ink ring-2 ring-ink/10"
                  : "border-line/60 opacity-60 hover:opacity-100",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-contain p-2 mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
