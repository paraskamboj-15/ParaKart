"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export interface HeroPick {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  images: string[];
}

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ picks }: { picks: HeroPick[] }) {
  const [main, secondary, tertiary] = picks;

  return (
    <section className="relative overflow-hidden">
      {/* background washes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 size-[560px] rounded-full bg-parchment blur-3xl" />
        <div className="absolute -bottom-52 -left-32 size-[480px] rounded-full bg-clay/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-14 px-5 pt-16 pb-20 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-24 lg:pb-28">
        {/* Copy */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="eyebrow text-muted">
              New season · The Autumn Catalogue
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.08, ease }}
            className="mt-6 font-display text-[clamp(3rem,8.5vw,6.8rem)] leading-[0.95] font-medium tracking-[-0.02em]"
          >
            Objects of
            <br />
            <em className="font-light text-clay italic">everyday</em> desire.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease }}
            className="mt-7 max-w-md text-[15px] leading-relaxed text-soft sm:text-base"
          >
            A tightly curated catalogue of tech, beauty and homeware — 190+
            products, chosen slowly, described honestly, shipped quickly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease }}
            className="mt-9 flex flex-wrap items-center gap-3.5"
          >
            <Link href="/products" className="btn-primary">
              Shop the catalogue <ArrowRight size={15} />
            </Link>
            <Link href="#categories" className="btn-ghost">
              Browse categories <ArrowDown size={15} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted"
          >
            <span className="flex items-center gap-1.5">
              <Star size={13} className="fill-gold stroke-gold" />
              4.8 average rating
            </span>
            <span className="hidden size-1 rounded-full bg-line sm:block" />
            <span>190+ products · 24 categories</span>
            <span className="hidden size-1 rounded-full bg-line sm:block" />
            <span>30-day returns</span>
          </motion.div>
        </div>

        {/* Collage */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[440px]">
            {/* Main card */}
            {main && (
              <motion.div
                initial={{ opacity: 0, y: 50, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: 2 }}
                transition={{ duration: 0.9, delay: 0.2, ease }}
                className="absolute inset-x-6 top-0 bottom-16"
              >
                <Link
                  href={`/products/${main.id}`}
                  className="group relative block h-full overflow-hidden rounded-[2rem] border border-line/70 bg-parchment shadow-[0_40px_80px_-40px_rgba(23,18,11,0.4)]"
                >
                  <div className="relative h-full w-full animate-float">
                    <Image
                      src={main.images?.[0] ?? main.thumbnail}
                      alt={main.title}
                      fill
                      priority
                      sizes="(min-width: 1024px) 32vw, 80vw"
                      className="object-contain p-10 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink/90 px-4 py-2 text-xs font-semibold whitespace-nowrap text-cream backdrop-blur">
                    {formatPrice(main.price)}
                  </span>
                </Link>
              </motion.div>
            )}

            {/* Secondary card */}
            {secondary && (
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: -7 }}
                transition={{ duration: 0.9, delay: 0.35, ease }}
                className="absolute bottom-0 -left-2 w-[46%]"
              >
                <Link
                  href={`/products/${secondary.id}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-line/70 bg-card shadow-[0_30px_60px_-30px_rgba(23,18,11,0.45)]"
                >
                  <Image
                    src={secondary.thumbnail}
                    alt={secondary.title}
                    fill
                    sizes="(min-width: 1024px) 15vw, 40vw"
                    className="object-contain p-5 mix-blend-multiply transition-transform duration-700 group-hover:scale-108"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold text-ink">
                    {formatPrice(secondary.price)}
                  </span>
                </Link>
              </motion.div>
            )}

            {/* Tertiary chip card */}
            {tertiary && (
              <motion.div
                initial={{ opacity: 0, y: -30, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: 5 }}
                transition={{ duration: 0.9, delay: 0.45, ease }}
                className="absolute -top-6 -right-3 w-[38%]"
              >
                <Link
                  href={`/products/${tertiary.id}`}
                  className="group relative block aspect-square overflow-hidden rounded-3xl border border-line/70 bg-card shadow-[0_24px_50px_-24px_rgba(23,18,11,0.45)]"
                >
                  <Image
                    src={tertiary.thumbnail}
                    alt={tertiary.title}
                    fill
                    sizes="(min-width: 1024px) 12vw, 32vw"
                    className="object-contain p-4 mix-blend-multiply transition-transform duration-700 group-hover:scale-108"
                  />
                </Link>
              </motion.div>
            )}

            {/* Rotating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.6, ease }}
              className="absolute -bottom-6 right-2 z-10"
            >
              <div className="relative flex size-28 items-center justify-center rounded-full bg-ink text-cream shadow-xl">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 size-full animate-rotate-slow"
                >
                  <defs>
                    <path
                      id="badge-circle"
                      d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                    />
                  </defs>
                  <text className="fill-cream text-[9.5px] font-semibold tracking-[0.22em] uppercase">
                    <textPath href="#badge-circle">
                      Free shipping over $50 · Easy returns ·
                    </textPath>
                  </text>
                </svg>
                <ArrowRight size={20} className="text-clay" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
