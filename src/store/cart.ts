"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  thumbnail: string;
  category: string;
  brand?: string;
  stock: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + quantity, product.stock || 99),
                    }
                  : i,
              ),
            };
          }
          const item: CartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            originalPrice:
              product.discountPercentage > 0
                ? product.price / (1 - product.discountPercentage / 100)
                : product.price,
            thumbnail: product.thumbnail,
            category: product.category,
            brand: product.brand,
            stock: product.stock,
            quantity: Math.min(quantity, product.stock || 99),
          };
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      setQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) =>
                  i.id === id
                    ? { ...i, quantity: Math.min(quantity, i.stock || 99) }
                    : i,
                ),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "mini-shop",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

/** True once the component has mounted on the client (zustand rehydrated). */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function useCartCount() {
  const items = useCart((s) => s.items);
  return items.reduce((n, i) => n + i.quantity, 0);
}

export function useCartSubtotal() {
  const items = useCart((s) => s.items);
  return items.reduce((n, i) => n + i.price * i.quantity, 0);
}
