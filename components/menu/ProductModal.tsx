"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, MapPin, ShoppingBag, Check } from "lucide-react";
import { Product, SelectedOption } from "@/types";
import { useCart } from "@/lib/context/CartContext";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

interface OptionDef {
  id: string;
  name: string;
  price?: number; // Prix du supplément pour les sauces/extras
  basePrice?: number; // Prix de base direct pour les types de produit
  maxQuantity?: number;
}

interface OptionGroupDef {
  id: string;
  title: string;
  icon: string;
  type: "single" | "multiple_with_quantity";
  defaultSelected?: string;
  options: OptionDef[];
}

const BRANCHES = [
  { id: "centre", name: "Centre-Ville", desc: "Avenue 13" },
  { id: "balbala", name: "Balbala", desc: "Carrefour principal" },
  { id: "heron", name: "Héron", desc: "Zone résidentielle" },
];

// Configuration des options par catégorie de produit
const CATEGORY_OPTIONS: Record<string, OptionGroupDef[]> = {
  // Catégorie 1 : Burgers
  "1": [
    {
      id: "types",
      title: "Types de burger",
      icon: "🍔",
      type: "single",
      defaultSelected: "chicken",
      options: [
        { id: "chicken", name: "Chicken", basePrice: 500 },
        { id: "beef", name: "Beef burger", basePrice: 600 },
        { id: "zinger", name: "Zinger", basePrice: 700 },
        { id: "double_chicken", name: "Double chicken", basePrice: 900 },
        { id: "double_beef", name: "Double beef", basePrice: 900 },
        { id: "double_zinger", name: "Double Zinger", basePrice: 1000 },
        { id: "mixed", name: "Mixed beef chicken", basePrice: 1000 },
      ],
    },
    {
      id: "sauces",
      title: "Sauces",
      icon: "🥫",
      type: "multiple_with_quantity",
      options: [
        { id: "algerienne", name: "Sauce Algérienne", price: 0 },
        { id: "samourai", name: "Sauce Samouraï", price: 0 },
        { id: "barbecue", name: "Sauce Barbecue", price: 0 },
        { id: "andalouse", name: "Sauce Andalouse", price: 0 },
        { id: "shakpot", name: "Sauce Shakpot", price: 100 },
        { id: "mayo", name: "Mayonnaise", price: 0 },
        { id: "ketchup", name: "Ketchup", price: 0 },
      ],
    },
    {
      id: "extras",
      title: "Extras et suppléments",
      icon: "✨",
      type: "multiple_with_quantity",
      options: [
        { id: "cheddar", name: "Double Cheddar fondu", price: 200 },
        { id: "frites", name: "Frites croustillantes", price: 300 },
        { id: "oignons", name: "Oignons caramélisés", price: 150 },
        { id: "jalapenos", name: "Jalapeños piments", price: 100 },
        { id: "boisson", name: "Canette fraîche 33cl", price: 300 },
      ],
    },
  ],

  // Catégorie 2 : Tacos
  "2": [
    {
      id: "types",
      title: "Format du Tacos",
      icon: "🌮",
      type: "single",
      defaultSelected: "maxi",
      options: [
        { id: "simple", name: "Format Simple (L)", basePrice: 1500 },
        { id: "maxi", name: "Format Maxi (XL)", basePrice: 1800 },
        { id: "giga", name: "Format Giga (XXL)", basePrice: 2200 },
      ],
    },
    {
      id: "sauces",
      title: "Sauces",
      icon: "🥫",
      type: "multiple_with_quantity",
      options: [
        { id: "fromagere", name: "Sauce Fromagère Shakpot", price: 0 },
        { id: "algerienne", name: "Sauce Algérienne", price: 0 },
        { id: "samourai", name: "Sauce Samouraï", price: 0 },
        { id: "barbecue", name: "Sauce Barbecue", price: 0 },
        { id: "andalouse", name: "Sauce Andalouse", price: 0 },
      ],
    },
    {
      id: "extras",
      title: "Extras et suppléments",
      icon: "✨",
      type: "multiple_with_quantity",
      options: [
        { id: "gratine", name: "Gratiné Cheddar au four", price: 250 },
        { id: "frites", name: "Supplément Frites", price: 300 },
        { id: "cheddar", name: "Double Fromage fondu", price: 200 },
        { id: "boisson", name: "Canette fraîche 33cl", price: 300 },
      ],
    },
  ],

  // Catégorie 3 : Sandwichs
  "3": [
    {
      id: "types",
      title: "Type de Pain",
      icon: "🥖",
      type: "single",
      defaultSelected: "baguette",
      options: [
        { id: "baguette", name: "Pain Baguette traditionnel", basePrice: 1000 },
        { id: "galette", name: "Galette Tortilla", basePrice: 1000 },
      ],
    },
    {
      id: "sauces",
      title: "Sauces",
      icon: "🥫",
      type: "multiple_with_quantity",
      options: [
        { id: "algerienne", name: "Sauce Algérienne", price: 0 },
        { id: "samourai", name: "Sauce Samouraï", price: 0 },
        { id: "blanche", name: "Sauce Blanche", price: 0 },
        { id: "barbecue", name: "Sauce Barbecue", price: 0 },
        { id: "andalouse", name: "Sauce Andalouse", price: 0 },
      ],
    },
    {
      id: "extras",
      title: "Extras et suppléments",
      icon: "✨",
      type: "multiple_with_quantity",
      options: [
        { id: "oeuf", name: "Œuf au plat", price: 150 },
        { id: "cheddar", name: "Double Fromage Cheddar", price: 200 },
        { id: "frites", name: "Portion de Frites", price: 300 },
        { id: "boisson", name: "Canette fraîche 33cl", price: 300 },
      ],
    },
  ],

  // Catégorie 4 : Boissons
  "4": [
    {
      id: "types",
      title: "Format",
      icon: "🥤",
      type: "single",
      defaultSelected: "33cl",
      options: [
        { id: "33cl", name: "Canette 33cl", basePrice: 300 },
        { id: "50cl", name: "Bouteille 50cl", basePrice: 400 },
        { id: "15l", name: "Bouteille 1.5L", basePrice: 600 },
      ],
    },
    {
      id: "service",
      title: "Service & Température",
      icon: "🧊",
      type: "single",
      defaultSelected: "glacons",
      options: [
        { id: "glacons", name: "Glaçons & Rondelle de citron", price: 0 },
        { id: "frais", name: "Bien frais", price: 0 },
        { id: "ambiant", name: "Température ambiante", price: 0 },
      ],
    },
    {
      id: "extras",
      title: "Extras et suppléments",
      icon: "✨",
      type: "multiple_with_quantity",
      options: [
        { id: "canette2", name: "Deuxième canette fraîche", price: 250 },
        { id: "gobelet", name: "Gobelet supplémentaire avec glaçons", price: 50 },
      ],
    },
  ],
};

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState("centre");
  const [singleSelections, setSingleSelections] = useState<Record<string, string>>({});
  const [optionQuantities, setOptionQuantities] = useState<Record<string, number>>({});
  const [isAdded, setIsAdded] = useState(false);

  // Groupes d'options correspondant à la catégorie du produit
  const optionGroups: OptionGroupDef[] =
    product && CATEGORY_OPTIONS[product.category_id]
      ? CATEGORY_OPTIONS[product.category_id]
      : product
      ? CATEGORY_OPTIONS["1"]
      : [];

  // Réinitialiser les options quand le produit change ou s'ouvre
  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedBranch("centre");
      setIsAdded(false);

      // Initialiser les sélections uniques avec leurs valeurs par défaut
      const initialSingles: Record<string, string> = {};
      const groups = CATEGORY_OPTIONS[product.category_id] || CATEGORY_OPTIONS["1"];
      groups.forEach((g) => {
        if (g.type === "single" && g.defaultSelected) {
          // Si c'est un burger spécifique, présélectionner le bon type
          if (product.category_id === "1") {
            if (product.slug.includes("chicken")) {
              initialSingles[g.id] = "chicken";
            } else if (product.slug.includes("zinger")) {
              initialSingles[g.id] = "zinger";
            } else {
              initialSingles[g.id] = "beef";
            }
          } else {
            initialSingles[g.id] = g.defaultSelected;
          }
        }
      });
      setSingleSelections(initialSingles);
      setOptionQuantities({});

      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Calcul du prix unitaire de base :
  // Le choix du type de burger (ou type de produit) définit directement le prix de base.
  let currentBasePrice = product.promotion_price || product.price;

  optionGroups.forEach((group) => {
    if (group.type === "single") {
      const selectedId = singleSelections[group.id];
      const opt = group.options.find((o) => o.id === selectedId);
      if (opt && opt.basePrice !== undefined) {
        currentBasePrice = opt.basePrice;
      }
    }
  });

  // Calcul des suppléments issus des options avec quantité (sauces, extras)
  let quantityExtrasTotal = 0;
  Object.entries(optionQuantities).forEach(([key, qty]) => {
    if (qty > 0) {
      const [groupId, optId] = key.split("_");
      const group = optionGroups.find((g) => g.id === groupId);
      const opt = group?.options.find((o) => o.id === optId);
      if (opt && opt.price) {
        quantityExtrasTotal += opt.price * qty;
      }
    }
  });

  const unitPrice = currentBasePrice + quantityExtrasTotal;
  const totalPrice = unitPrice * quantity;

  // Sélection d'une option unique (ex: Type de burger)
  const handleSelectSingle = (groupId: string, optionId: string) => {
    setSingleSelections((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));
  };

  // Modification de quantité pour une option (sauces, extras)
  const handleUpdateOptionQuantity = (groupId: string, optionId: string, delta: number) => {
    const key = `${groupId}_${optionId}`;
    setOptionQuantities((prev) => {
      const current = prev[key] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return {
        ...prev,
        [key]: Math.min(next, 5), // Limite à 5 max par option
      };
    });
  };

  // Ajout au Panier
  const handleAddToCart = () => {
    const branchObj = BRANCHES.find((b) => b.id === selectedBranch) || BRANCHES[0];

    // Construire la liste complète des options sélectionnées
    const selectedOptionsList: SelectedOption[] = [];

    optionGroups.forEach((group) => {
      if (group.type === "single") {
        const selId = singleSelections[group.id];
        const opt = group.options.find((o) => o.id === selId);
        if (opt) {
          selectedOptionsList.push({
            groupId: group.id,
            groupTitle: group.title,
            optionId: opt.id,
            name: opt.name,
            price: 0, // Inclus dans le prix de base du plat
            quantity: 1,
          });
        }
      } else {
        group.options.forEach((opt) => {
          const key = `${group.id}_${opt.id}`;
          const qty = optionQuantities[key] || 0;
          if (qty > 0) {
            selectedOptionsList.push({
              groupId: group.id,
              groupTitle: group.title,
              optionId: opt.id,
              name: opt.name,
              price: opt.price || 0,
              quantity: qty,
            });
          }
        });
      }
    });

    addItem({
      product: {
        ...product,
        price: currentBasePrice, // Prix de base déterminé par le type sélectionné
      },
      quantity,
      branch: {
        id: branchObj.id,
        name: branchObj.name,
      },
      selectedOptions: selectedOptionsList,
      unitPrice,
    });

    setIsAdded(true);

    // Feedback visuel puis fermeture de la modale SANS ouvrir automatiquement le panier
    setTimeout(() => {
      onClose();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200">
      {/* Arrière-plan assombri */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Boîte Modale */}
      <div className="relative w-full max-w-lg bg-surface rounded-3xl shadow-2xl border border-border overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* En-tête avec Image du Produit */}
        <div className="relative aspect-[16/10] w-full bg-muted/20 overflow-hidden shrink-0">
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
        </div>

        {/* Corps de la Fiche Produit (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Titre & Description */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-black text-foreground">
                {product.name}
              </h3>
              <div className="text-right">
                <p className="text-xl font-black text-primary-600">
                  {currentBasePrice.toLocaleString("fr-FR")} FDJ
                </p>
              </div>
            </div>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Choix de la Branche / Quartier */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-2.5">
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
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 font-bold shadow-sm ring-1 ring-primary-500"
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

          {/* Catégories de Personnalisation : Titre épuré et affichage horizontal */}
          {optionGroups.map((group) => {
            return (
              <div key={group.id} className="space-y-2.5">
                {/* Titre épuré sans mentions explicatives */}
                <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <span>{group.icon}</span>
                  <span>{group.title}</span>
                </label>

                {/* Choix affichés horizontalement */}
                <div className="flex flex-wrap gap-2">
                  {group.type === "single"
                    ? group.options.map((opt) => {
                        const isSelected = singleSelections[group.id] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectSingle(group.id, opt.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all flex items-center ${
                              isSelected
                                ? "border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 font-bold shadow-sm ring-1 ring-primary-500"
                                : "border-border bg-surface hover:bg-surface-hover text-muted hover:text-foreground"
                            }`}
                          >
                            <span>{opt.name}</span>
                          </button>
                        );
                      })
                    : group.options.map((opt) => {
                        const key = `${group.id}_${opt.id}`;
                        const qty = optionQuantities[key] || 0;
                        const isSelected = qty > 0;

                        return (
                          <div
                            key={opt.id}
                            className={`rounded-xl border transition-all text-xs sm:text-sm flex items-center overflow-hidden ${
                              isSelected
                                ? "border-primary-600 bg-primary-50/80 dark:bg-primary-950/40 text-foreground font-semibold shadow-sm ring-1 ring-primary-500"
                                : "border-border bg-surface hover:bg-surface-hover text-muted hover:text-foreground"
                            }`}
                          >
                            {!isSelected ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateOptionQuantity(group.id, opt.id, 1)
                                }
                                className="px-3 py-2 flex items-center hover:text-foreground transition-colors"
                              >
                                <span>{opt.name}</span>
                              </button>
                            ) : (
                              <div className="px-2.5 py-1.5 flex items-center gap-2">
                                <span className="text-foreground">{opt.name}</span>

                                {/* Boutons de contrôle de quantité + et - */}
                                <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-0.5 ml-1 shadow-xs">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateOptionQuantity(group.id, opt.id, -1)
                                    }
                                    className="w-5 h-5 rounded-md flex items-center justify-center text-muted hover:text-red-500 hover:bg-surface-hover transition-colors"
                                    aria-label={`Diminuer ${opt.name}`}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-4 text-center font-black text-xs text-primary-600">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateOptionQuantity(group.id, opt.id, 1)
                                    }
                                    disabled={qty >= (opt.maxQuantity || 5)}
                                    className="w-5 h-5 rounded-md flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover transition-colors disabled:opacity-30"
                                    aria-label={`Augmenter ${opt.name}`}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                </div>
              </div>
            );
          })}

        </div>

        {/* Pied de la Fiche Produit : Quantité et Bouton d'Action */}
        <div className="p-5 border-t border-border bg-surface-hover/50 flex flex-col gap-4">
          
          <div className="flex items-center justify-between">
            {/* Sélecteur de Quantité du Plat */}
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

          {/* Bouton Ajouter au Panier */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
              isAdded
                ? "bg-emerald-600 text-white shadow-emerald-600/25"
                : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/25"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5 animate-in zoom-in-50 duration-200" />
                <span>AJOUTÉ AU PANIER !</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>AJOUTER AU PANIER</span>
                <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold ml-1">
                  {totalPrice.toLocaleString("fr-FR")} FDJ
                </span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}
