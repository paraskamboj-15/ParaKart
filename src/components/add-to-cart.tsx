"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

export function AddToCartPanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const router = useRouter();

  const maxQty = Math.max(1, Math.min(product.stock || 99, 99));
  const outOfStock = product.stock <= 0 || product.availabilityStatus === "Out of Stock";

  const handleAdd = () => {
    addItem(product, qty);
    toast.success("Added to cart", {
      description: `${qty} × ${product.title}`,
    });
    openCart();
  };

  const handleBuyNow = () => {
    addItem(product, qty);
    router.push("/cart");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Quantity stepper */}
        <div className="flex h-[52px] items-center justify-between rounded-full border border-line bg-card px-1.5 sm:w-[148px]">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={outOfStock}
            className="flex size-10 items-center justify-center rounded-full text-soft transition-colors hover:bg-parchment hover:text-ink disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-display text-lg font-semibold">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            disabled={outOfStock}
            className="flex size-10 items-center justify-center rounded-full text-soft transition-colors hover:bg-parchment hover:text-ink disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className={cn(
            "flex h-[52px] flex-1 items-center justify-center gap-2.5 rounded-full text-[15px] font-medium transition-all active:scale-[0.98]",
            outOfStock
              ? "cursor-not-allowed bg-parchment text-muted"
              : "bg-ink text-cream hover:bg-clay hover:shadow-lg hover:shadow-clay/25",
          )}
        >
          <ShoppingBag size={17} />
          {outOfStock ? "Out of stock" : "Add to cart"}
        </button>
      </div>

      {!outOfStock && (
        <button
          onClick={handleBuyNow}
          className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full border border-ink/20 text-[15px] font-medium transition-all hover:border-ink hover:bg-ink hover:text-cream active:scale-[0.98]"
        >
          <Zap size={16} />
          Buy it now
        </button>
      )}
    </div>
  );
}
