import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your picks and check out.",
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pb-24 sm:px-8">
      <div className="pt-10 pb-10 sm:pt-14">
        <p className="eyebrow text-muted">Nearly there</p>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-6xl">
          Your cart
        </h1>
        <p className="mt-3 text-sm text-muted">
          Review your picks, apply a promo code and check out.
        </p>
      </div>
      <CartView />
    </div>
  );
}
