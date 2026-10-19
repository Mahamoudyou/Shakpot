"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product, SelectedOption } from "@/types";

interface AddToCartPayload {
  product: Product;
  quantity: number;
  branch: {
    id: string;
    name: string;
  };
  selectedOptions: SelectedOption[];
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItemsCount: number;
  subtotal: number;
  lastAddedItemName: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "shakpot_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastAddedItemName, setLastAddedItemName] = useState<string | null>(null);

  // Charger le panier depuis le localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Erreur de chargement du panier :", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sauvegarder dans le localStorage à chaque changement
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Erreur de sauvegarde du panier :", e);
    }
  }, [items, isHydrated]);

  const addItem = (payload: AddToCartPayload) => {
    const newItem: CartItem = {
      id: `${payload.product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      product: payload.product,
      quantity: payload.quantity,
      branch: payload.branch,
      selectedOptions: payload.selectedOptions,
      unitPrice: payload.unitPrice,
      totalPrice: payload.unitPrice * payload.quantity,
    };

    setItems((prev) => [...prev, newItem]);
    setLastAddedItemName(payload.product.name);

    // Réinitialiser le nom après 3 secondes
    setTimeout(() => {
      setLastAddedItemName(null);
    }, 3000);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItemsCount,
        subtotal,
        lastAddedItemName,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé au sein d'un CartProvider");
  }
  return context;
}
