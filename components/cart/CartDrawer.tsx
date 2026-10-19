"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    totalItemsCount,
  } = useCart();

  // Bloquer le scroll de la page lorsque le panier est ouvert
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  // Formatage du message de commande WhatsApp
  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;

    let message = "Bonjour SHAKPOT Djibouti ! 🍔🍟\n\n";
    message += "Je souhaite passer la commande suivante :\n\n";

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}* x${item.quantity}\n`;
      message += `   📍 Branche : ${item.branch.name}\n`;
      if (item.selectedOptions.length > 0) {
        const optionsStr = item.selectedOptions
          .map((opt) => `${opt.name}${opt.quantity > 1 ? ` (x${opt.quantity})` : ""}`)
          .join(", ");
        message += `   ➕ Options : ${optionsStr}\n`;
      }
      message += `   💰 Prix : ${item.totalPrice.toLocaleString("fr-FR")} FDJ\n\n`;
    });

    message += "----------------------------\n";
    message += `💰 *TOTAL À PAYER : ${subtotal.toLocaleString("fr-FR")} FDJ*\n`;
    message += "📍 *Mon adresse / quartier de livraison :* \n\n";
    message += "Merci de me confirmer la commande et le temps estimé de livraison !";

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/25377000000?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Fond sombre */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Panneau latéral coulissant */}
      <div className="relative w-full max-w-md bg-surface text-foreground shadow-2xl border-l border-border h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* En-tête */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Mon Panier</h2>
              <p className="text-xs text-muted">
                {totalItemsCount} {totalItemsCount > 1 ? "articles" : "article"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-muted hover:text-red-500 transition-colors px-2 py-1"
                title="Vider le panier"
              >
                Vider
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu : Liste des articles */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center shadow-inner">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Votre panier est vide
                </h3>
                <p className="text-sm text-muted mt-1 max-w-xs">
                  Ajoutez de savoureux burgers, tacos et boissons depuis notre menu.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  const menuEl = document.getElementById("menu");
                  if (menuEl) menuEl.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-md transition-all"
              >
                <span>Découvrir le menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-surface-hover/50 border border-border rounded-2xl p-3.5 flex flex-col gap-3 transition-all hover:border-primary-500/30"
              >
                <div className="flex items-start gap-3">
                  {/* Miniature Image */}
                  <div className="relative w-16 h-16 rounded-xl bg-muted/20 overflow-hidden shrink-0 border border-border">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🍔
                      </div>
                    )}
                  </div>

                  {/* Infos Produit */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-foreground text-sm truncate">
                        {item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-muted hover:text-red-500 transition-colors p-1"
                        aria-label="Supprimer l'article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-primary-600 font-medium">
                      📍 {item.branch.name}
                    </p>

                    <p className="text-xs font-bold text-foreground mt-1">
                      {item.unitPrice.toLocaleString("fr-FR")} FDJ
                    </p>
                  </div>
                </div>

                {/* Options sélectionnées */}
                {item.selectedOptions.length > 0 && (
                  <div className="bg-surface rounded-xl p-2.5 border border-border/60 text-[11px] space-y-1">
                    <p className="font-semibold text-muted text-[10px] uppercase tracking-wider">
                      Options & Suppléments :
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {item.selectedOptions.map((opt, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 bg-surface-hover px-2 py-0.5 rounded-md border border-border text-foreground"
                        >
                          <span>{opt.name}</span>
                          {opt.quantity > 1 && (
                            <span className="font-bold text-primary-600">
                              x{opt.quantity}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sélecteur de Quantité & Sous-total */}
                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <div className="flex items-center gap-2 bg-surface border border-border rounded-full p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                      aria-label="Diminuer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center font-bold text-xs text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                      aria-label="Augmenter"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-primary-600">
                      {item.totalPrice.toLocaleString("fr-FR")} FDJ
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pied du Panier avec Total et Bouton de Validation */}
        {items.length > 0 && (
          <div className="p-5 border-t border-border bg-surface-hover/50 space-y-4">
            
            {/* Récapitulatif Prix */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted">
                <span>Sous-total</span>
                <span className="font-semibold text-foreground">
                  {subtotal.toLocaleString("fr-FR")} FDJ
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Frais de livraison</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Calculés selon l'adresse
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-foreground pt-2 border-t border-border">
                <span>Total estimé</span>
                <span className="text-xl text-primary-600">
                  {subtotal.toLocaleString("fr-FR")} FDJ
                </span>
              </div>
            </div>

            {/* Bouton Passer la commande */}
            <button
              type="button"
              onClick={handleCheckoutWhatsApp}
              className="w-full py-3.5 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-primary-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>PASSER LA COMMANDE</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                {subtotal.toLocaleString("fr-FR")} FDJ
              </span>
            </button>

            <p className="text-[11px] text-center text-muted">
              Paiement à la livraison par Espèces, Waafi ou D-Money.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
