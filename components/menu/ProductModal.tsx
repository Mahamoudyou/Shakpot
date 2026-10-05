"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, Check, PhoneCall, Sparkles, MapPin } from "lucide-react";
import { Product } from "@/types";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

const FOOD_EXTRAS: ExtraOption[] = [
  { id: "cheddar", name: "Double Cheddar fondu", price: 200 },
  { id: "sauce", name: "Sauce Shakpot Secrète", price: 150 },
  { id: "frites", name: "Frites croustillantes", price: 300 },
  { id: "boisson", name: "Canette fraîche 33cl", price: 300 },
];

const DRINK_EXTRAS: ExtraOption[] = [
  { id: "citron", name: "Glaçons & Rondelle de citron", price: 0 },
  { id: "canette2", name: "Deuxième canette fraîche", price: 250 },
];

const BRANCHES = [
  { id: "centre", name: "Centre-Ville", desc: "Avenue 13" },
  { id: "balbala", name: "Balbala", desc: "Carrefour principal" },
  { id: "heron", name: "Héron", desc: "Zone résidentielle" },
];

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState("centre");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  // Réinitialiser les options quand le produit change
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedBranch("centre");
      setSelectedExtras([]);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const isDrink = product.category_id === "4";
  const availableExtras = isDrink ? DRINK_EXTRAS : FOOD_EXTRAS;
  const basePrice = product.promotion_price || product.price;

  const extrasTotal = selectedExtras.reduce((sum, extraId) => {
    const extra = availableExtras.find((e) => e.id === extraId);
    return sum + (extra ? extra.price : 0);
  }, 0);

  const totalPrice = (basePrice + extrasTotal) * quantity;

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Génération du lien de commande WhatsApp
  const handleWhatsAppOrder = () => {
    const branchName = BRANCHES.find((b) => b.id === selectedBranch)?.name || "Centre-Ville";
    const extrasList = selectedExtras.length > 0
      ? selectedExtras
          .map((id) => availableExtras.find((e) => e.id === id)?.name)
          .filter(Boolean)
          .join(", ")
      : "Aucun supplément";

    const message = encodeURIComponent(
      `Bonjour SHAKPOT Djibouti !\n\nJe souhaite commander :\n` +
      `🍽️ Plat : *${product.name}*\n` +
      `🔢 Quantité : *${quantity}*\n` +
      `📍 Branche : *${branchName}*\n` +
      `➕ Extras : *${extrasList}*\n` +
      `💰 Total : *${totalPrice.toLocaleString("fr-FR")} FDJ*\n\n` +
      `Merci de me confirmer la livraison !`
    );

    // Numéro WhatsApp par défaut de commande (peut être configuré)
    window.open(`https://wa.me/25377000000?text=${message}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
      {/* Arrière-plan assombri */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Boîte Modale */}
      <div className="relative w-full max-w-lg bg-surface rounded-3xl shadow-2xl border border-border overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* En-tête avec Image du Produit */}
        <div className="relative aspect-[16/10] w-full bg-muted/20 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🍔
            </div>
          )}

          {/* Dégradé pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/30" />

          {/* Bouton Fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface/80 backdrop-blur-md border border-border text-foreground hover:bg-surface flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge Promo si applicable */}
          {product.is_promotion && (
            <div className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
              Offre Spéciale
            </div>
          )}

          {/* Badge disponibilité en bas de photo */}
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              Préparé à la minute • Frais garanti
            </span>
          </div>
        </div>

        {/* Corps de la Fiche Produit (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Titre & Description */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-black text-foreground">
                {product.name}
              </h3>
              <div className="text-right">
                {product.promotion_price ? (
                  <>
                    <p className="text-xs text-muted line-through">
                      {product.price.toLocaleString("fr-FR")} FDJ
                    </p>
                    <p className="text-xl font-black text-primary-600">
                      {product.promotion_price.toLocaleString("fr-FR")} FDJ
                    </p>
                  </>
                ) : (
                  <p className="text-xl font-black text-primary-600">
                    {product.price.toLocaleString("fr-FR")} FDJ
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Choix de la Branche / Quartier */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-3">
              <MapPin className="w-3.5 h-3.5 text-primary-600" />
              <span>Branche / Quartier de préparation :</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BRANCHES.map((branch) => {
                const isSelected = selectedBranch === branch.id;
                return (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => setSelectedBranch(branch.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all text-xs ${
                      isSelected
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 font-bold shadow-sm"
                        : "border-border hover:bg-surface-hover text-foreground font-medium"
                    }`}
                  >
                    <p>{branch.name}</p>
                    <p className="text-[10px] text-muted truncate">{branch.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Suppléments & Extras */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Personnaliser avec des suppléments :</span>
            </label>
            <div className="space-y-2">
              {availableExtras.map((extra) => {
                const isChecked = selectedExtras.includes(extra.id);
                return (
                  <button
                    key={extra.id}
                    type="button"
                    onClick={() => toggleExtra(extra.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-sm ${
                      isChecked
                        ? "border-primary-600 bg-primary-50/50 dark:bg-primary-950/30 text-foreground"
                        : "border-border hover:bg-surface-hover text-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-primary-600 border-primary-600 text-white"
                            : "border-border bg-surface"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className={isChecked ? "font-semibold text-foreground" : ""}>
                        {extra.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-primary-600">
                      {extra.price > 0 ? `+${extra.price} FDJ` : "Inclus"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Pied de la Fiche Produit : Quantité et Bouton d'Action */}
        <div className="p-5 border-t border-border bg-surface-hover/50 flex flex-col gap-4">
          
          <div className="flex items-center justify-between">
            {/* Sélecteur de Quantité */}
            <div className="flex items-center gap-3 bg-surface border border-border rounded-full p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover disabled:opacity-40 transition-colors"
                aria-label="Diminuer la quantité"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-bold text-foreground text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                aria-label="Augmenter la quantité"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Total Dynamique */}
            <div className="text-right">
              <p className="text-xs text-muted">Total estimé</p>
              <p className="text-2xl font-black text-foreground">
                {totalPrice.toLocaleString("fr-FR")} <span className="text-primary-600 text-base font-bold">FDJ</span>
              </p>
            </div>
          </div>

          {/* Bouton Commander */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="flex-1 py-4 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-primary-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>COMMANDER VIA WHATSAPP</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                {totalPrice.toLocaleString("fr-FR")} FDJ
              </span>
            </button>
            
            <a
              href="tel:[NUMÉROSHAKPOT]"
              className="w-14 rounded-2xl border border-border bg-surface hover:bg-surface-hover text-foreground flex items-center justify-center transition-colors shadow-sm"
              title="Appeler directement"
            >
              <PhoneCall className="w-5 h-5 text-primary-600" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
