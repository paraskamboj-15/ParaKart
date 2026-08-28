"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  useCart,
  useCartCount,
  useCartSubtotal,
  useHydrated,
} from "@/store/cart";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 50;

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const closeCart = useCart((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const count = useCartCount();
  const subtotal = useCartSubtotal();
  const hydrated = useHydrated();

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);
  const shippingAway = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/45 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-[430px] flex-col bg-cream shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <p className="font-display text-xl">
                Your Cart{" "}
                <span className="text-muted">({hydrated ? count : 0})</span>
              </p>
              <button
                onClick={closeCart}
                className="flex size-9 items-center justify-center rounded-full border border-line transition-colors hover:border-ink"
                aria-label="Close cart"
              >
                <X size={16} />
              </button>
            </div>

            {!hydrated || items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-parchment">
                  <ShoppingBag size={24} className="text-muted" />
                </span>
                <p className="font-display text-2xl">Your cart is empty</p>
                <p className="text-sm text-muted">
                  Beautiful things are waiting. Go find them.
                </p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="btn-primary mt-2"
                >
                  Start shopping <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <>
                {/* Free shipping meter */}
                <div className="border-b border-line px-6 py-4">
                  <p className="text-xs text-soft">
                    {shippingAway > 0 ? (
                      <>
                        You&rsquo;re{" "}
                        <span className="font-semibold text-clay">
                          {formatPrice(shippingAway)}
                        </span>{" "}
                        away from free shipping
                      </>
                    ) : (
                      <span className="font-semibold text-moss">
                        You&rsquo;ve unlocked free shipping
                      </span>
                    )}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-parchment">
                    <motion.div
                      className="h-full rounded-full bg-clay"
                      initial={false}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ type: "spring", damping: 25 }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="space-y-5">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className="flex gap-4"
                        >
                          <Link
                            href={`/products/${item.id}`}
                            onClick={closeCart}
                            className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-line/60 bg-parchment"
                          >
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              fill
                              sizes="80px"
                              className="object-contain p-2 mix-blend-multiply"
                            />
                          </Link>
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/products/${item.id}`}
                                onClick={closeCart}
                                className="text-sm leading-snug font-medium hover:text-clay"
                              >
                                {item.title}
                              </Link>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-muted transition-colors hover:text-clay"
                                aria-label={`Remove ${item.title}`}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="flex items-center rounded-full border border-line bg-card">
                                <button
                                  onClick={() =>
                                    setQuantity(item.id, item.quantity - 1)
                                  }
                                  className="flex size-7 items-center justify-center text-soft hover:text-ink"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="w-6 text-center text-xs font-semibold">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    setQuantity(item.id, item.quantity + 1)
                                  }
                                  className="flex size-7 items-center justify-center text-soft hover:text-ink"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                              <p className="text-sm font-semibold">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                {/* Footer */}
                <div className="border-t border-line bg-card px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Subtotal</span>
                    <span className="font-display text-xl font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Shipping & taxes calculated at checkout.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="btn-ghost !px-4 text-center"
                    >
                      View cart
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="btn-primary !px-4"
                    >
                      Checkout <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
