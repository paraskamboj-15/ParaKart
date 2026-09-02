"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { useCart, useHydrated } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/skeletons";

const FREE_SHIPPING_THRESHOLD = 50;
const FLAT_SHIPPING = 4.95;
const TAX_RATE = 0.08;
const PROMO_CODE = "ParaKart10";

export function CartView() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const clearCart = useCart((s) => s.clearCart);
  const hydrated = useHydrated();

  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
    );
  }

  /* ------------------------------ Success state ----------------------------- */
  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-line bg-card px-8 py-16 text-center"
      >
        <span className="flex size-20 items-center justify-center rounded-full bg-moss/10">
          <CheckCircle2 size={36} className="text-moss" />
        </span>
        <h2 className="mt-6 font-display text-3xl">Order placed</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Thank you — your order is being wrapped with care. A confirmation is
          on its way to your inbox.
        </p>
        <p className="chip mt-6">
          Order <span className="font-bold text-ink">{orderPlaced}</span>
        </p>
        <Link href="/products" className="btn-primary mt-8">
          Continue shopping <ArrowRight size={15} />
        </Link>
      </motion.div>
    );
  }

  /* ------------------------------- Empty state ------------------------------ */
  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-parchment">
          <ShoppingBag size={30} className="text-muted" />
        </span>
        <h2 className="mt-6 font-display text-3xl">Nothing here yet</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Your cart is a blank canvas. Browse the catalogue and find something
          worth taking home.
        </p>
        <Link href="/products" className="btn-primary mt-8">
          Explore products <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  /* --------------------------------- Totals -------------------------------- */
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping =
    subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + shipping + tax;
  const progress = Math.min(1, (subtotal - discount) / FREE_SHIPPING_THRESHOLD);

  const placeOrder = () => {
    const num = `PKT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    clearCart();
    setOrderPlaced(num);
  };

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.6fr_1fr]">
      {/* Items */}
      <div>
        {/* Free shipping meter */}
        <div className="mb-6 rounded-2xl border border-line bg-card p-4">
          <p className="flex items-center gap-2 text-xs text-soft">
            <Truck size={14} className="text-clay" />
            {subtotal - discount >= FREE_SHIPPING_THRESHOLD ? (
              <span className="font-semibold text-moss">
                Free shipping unlocked
              </span>
            ) : (
              <>
                Add{" "}
                <span className="font-semibold text-clay">
                  {formatPrice(FREE_SHIPPING_THRESHOLD - (subtotal - discount))}
                </span>{" "}
                more for free shipping
              </>
            )}
          </p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-parchment">
            <motion.div
              className="h-full rounded-full bg-clay"
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: "spring", damping: 25 }}
            />
          </div>
        </div>

        <ul className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 60 }}
                className="flex gap-5 rounded-2xl border border-line bg-card p-4 sm:p-5"
              >
                <Link
                  href={`/products/${item.id}`}
                  className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-line/60 bg-parchment sm:size-28"
                >
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="112px"
                    className="object-contain p-2.5 mix-blend-multiply"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
                        {item.brand ?? item.category}
                      </p>
                      <Link
                        href={`/products/${item.id}`}
                        className="mt-0.5 line-clamp-1 font-medium hover:text-clay"
                      >
                        {item.title}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-parchment hover:text-clay"
                      aria-label={`Remove ${item.title}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="flex items-center rounded-full border border-line bg-cream">
                      <button
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="flex size-8 items-center justify-center text-soft hover:text-ink"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="flex size-8 items-center justify-center text-soft hover:text-ink"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[11px] text-muted">
                          {formatPrice(item.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <button
          onClick={clearCart}
          className="mt-6 text-xs font-medium text-muted underline-offset-4 transition-colors hover:text-clay hover:underline"
        >
          Clear entire cart
        </button>
      </div>

      {/* Summary */}
      <aside className="rounded-3xl border border-line bg-card p-6 lg:sticky lg:top-28">
        <h2 className="font-display text-2xl">Order summary</h2>

        {/* Promo */}
        <div className="mt-5">
          <label className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
            Promo code
          </label>
          <div className="mt-2 flex gap-2">
            <input
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                setPromoError(false);
              }}
              placeholder={`Try ${PROMO_CODE}`}
              disabled={promoApplied}
              className="h-11 w-full rounded-full border border-line bg-cream px-4 text-sm outline-none placeholder:text-muted/60 focus:border-ink disabled:opacity-50"
            />
            <button
              onClick={() => {
                if (promoInput.trim().toUpperCase() === PROMO_CODE) {
                  setPromoApplied(true);
                  setPromoError(false);
                } else {
                  setPromoError(true);
                }
              }}
              disabled={promoApplied}
              className="h-11 shrink-0 rounded-full bg-ink px-5 text-sm font-medium text-cream transition-colors hover:bg-clay disabled:bg-moss"
            >
              {promoApplied ? "Applied" : "Apply"}
            </button>
          </div>
          {promoError && (
            <p className="mt-2 text-xs text-clay">
              That code doesn&rsquo;t ring a bell. Hint: {PROMO_CODE}.
            </p>
          )}
        </div>

        <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-medium">{formatPrice(subtotal)}</dd>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-moss">
              <dt className="flex items-center gap-1.5">
                <BadgePercent size={14} /> Promo ({PROMO_CODE})
              </dt>
              <dd className="font-medium">−{formatPrice(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className="font-medium">
              {shipping === 0 ? (
                <span className="text-moss">Free</span>
              ) : (
                formatPrice(shipping)
              )}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Estimated tax (8%)</dt>
            <dd className="font-medium">{formatPrice(tax)}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-4">
            <dt className="font-medium">Total</dt>
            <dd className="font-display text-2xl font-semibold">
              {formatPrice(total)}
            </dd>
          </div>
        </dl>

        <button
          onClick={placeOrder}
          className="mt-6 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-ink text-[15px] font-medium text-cream transition-all hover:bg-clay hover:shadow-lg hover:shadow-clay/25 active:scale-[0.98]"
        >
          Place order <ArrowRight size={16} />
        </button>

        <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted">
          <ShieldCheck size={13} className="text-moss" />
          Secure 256-bit encrypted checkout
        </p>
      </aside>
    </div>
  );
}
