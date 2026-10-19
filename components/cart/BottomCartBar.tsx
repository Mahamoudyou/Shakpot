"use client";

import { ShoppingBag, ChevronUp, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

export function BottomCartBar() {
  const { totalItemsCount, subtotal, setIsCartOpen } = useCart();

  if (totalItemsCount === 0) return null;

  return (
    <aside 
      aria-label="Aperçu du panier"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-xl animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-surface/95 dark:bg-neutral-900/95 backdrop-blur-md border border-border dark:border-neutral-800 rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center justify-between gap-3 text-foreground ring-1 ring-black/5 dark:ring-white/10">
        
        {/* Résumé du Panier */}
        <div 
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-3 cursor-pointer select-none group flex-1 min-w-0"
        >
          <div className="relative w-11 h-11 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold shadow-md shadow-primary-600/30 group-hover:scale-105 transition-transform shrink-0">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-foreground text-background text-[11px] font-black rounded-full flex items-center justify-center shadow-md">
              {totalItemsCount}
            </span>
          </div>

          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-foreground">
                Mon Panier
              </span>
              <span className="text-[11px] text-muted">
                ({totalItemsCount} {totalItemsCount > 1 ? "articles" : "article"})
              </span>
            </div>
            <p className="text-sm sm:text-base font-black text-primary-600 leading-tight">
              {subtotal.toLocaleString("fr-FR")} <span className="text-xs font-bold">FDJ</span>
            </p>
          </div>
        </div>

        {/* Bouton d'action pour ouvrir le panier */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="py-2.5 px-4 sm:px-5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-primary-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Voir le panier</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
}
