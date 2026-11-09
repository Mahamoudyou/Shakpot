"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { X, Plus, Minus, MapPin, ShoppingBag, Check, AlertCircle } from "lucide-react";
import { Product, SelectedOption, VariationGroup } from "@/types";
import { useCart } from "@/lib/context/CartContext";
import { useRestaurantData } from "@/lib/context/RestaurantContext";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const BRANCHES = [
  { id: "centre", name: "Centre-Ville", desc: "Avenue 13" },
  { id: "balbala", name: "Balbala", desc: "Carrefour principal" },
  { id: "heron", name: "Héron", desc: "Zone résidentielle" },
];

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const { variations } = useRestaurantData();

  const [quantity, setQuantity] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState("centre");
  const [singleSelections, setSingleSelections] = useState<Record<string, string>>({});
  const [optionQuantities, setOptionQuantities] = useState<Record<string, number>>({});
  const [isAdded, setIsAdded] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Groupes de variations dynamiques correspondant à la catégorie de ce produit
  const productVariations: VariationGroup[] = useMemo(() => {
    if (!product) return [];
    return variations.filter((v) => {
      // Si aucune catégorie assignée ou si la catégorie du produit est incluse
      return (
        !v.categoryIds ||
        v.categoryIds.length === 0 ||
        v.categoryIds.includes(product.category_id)
      );
    });
  }, [variations, product]);

  // Réinitialiser les sélections quand le produit s'ouvre
  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedBranch("centre");
      setIsAdded(false);
      setValidationError(null);

      // Présélectionner les options uniques (par exemple la première si obligatoire)
      const initialSingles: Record<string, string> = {};
      productVariations.forEach((group) => {
        if (group.type === "single" && group.options.length > 0) {
          // Si c'est un burger, tenter de mapper sur l'option appropriée ou la 1ère option
          if (product.category_id === "1") {
            const chickenOpt = group.options.find((o) =>
              o.name.toLowerCase().includes("chicken")
            );
            const zingerOpt = group.options.find((o) =>
              o.name.toLowerCase().includes("zinger")
            );
            const beefOpt = group.options.find((o) =>
              o.name.toLowerCase().includes("beef")
            );

            if (product.slug.includes("chicken") && chickenOpt) {
              initialSingles[group.id] = chickenOpt.id;
            } else if (product.slug.includes("zinger") && zingerOpt) {
              initialSingles[group.id] = zingerOpt.id;
            } else if (beefOpt) {
              initialSingles[group.id] = beefOpt.id;
            } else {
              initialSingles[group.id] = group.options[0].id;
            }
          } else if (group.isRequired) {
            // Pour les groupes uniques obligatoires, présélectionner par défaut la première option
            initialSingles[group.id] = group.options[0].id;
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
  }, [isOpen, product, productVariations]);

  if (!isOpen || !product) return null;

  const isAvailable = product.is_available !== false;

  // Calcul du prix unitaire dynamique avec les prix réels des variations
  let currentBasePrice = product.promotion_price || product.price;
  let singleExtras = 0;

  productVariations.forEach((group) => {
    if (group.type === "single") {
      const selectedId = singleSelections[group.id];
      const opt = group.options.find((o) => o.id === selectedId);
      if (opt) {
        if (opt.basePrice !== undefined && opt.basePrice > 0) {
          currentBasePrice = opt.basePrice;
        } else if (opt.price && opt.price > 0) {
          singleExtras += opt.price;
        }
      }
    }
  });

  let quantityExtrasTotal = 0;
  Object.entries(optionQuantities).forEach(([key, qty]) => {
    if (qty > 0) {
      const [groupId, optId] = key.split("_");
      const group = productVariations.find((g) => g.id === groupId);
      const opt = group?.options.find((o) => o.id === optId);
      if (opt && opt.price) {
        quantityExtrasTotal += opt.price * qty;
      }
    }
  });

  const unitPrice = currentBasePrice + singleExtras + quantityExtrasTotal;
  const totalPrice = unitPrice * quantity;

  // Gestion sélection option unique
  const handleSelectSingle = (groupId: string, optionId: string) => {
    setValidationError(null);
    setSingleSelections((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));
  };

  // Gestion quantité option multiple
  const handleUpdateOptionQuantity = (groupId: string, optionId: string, delta: number) => {
    setValidationError(null);
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
        [key]: Math.min(next, 5),
      };
    });
  };

  // Validation et ajout au panier
  const handleAddToCart = () => {
    setValidationError(null);

    // 1. Vérification de disponibilité du plat
    if (!isAvailable) {
      setValidationError("Ce plat est actuellement en rupture de stock et ne peut pas être commandé.");
      return;
    }

    // 2. Vérification des variations OBLIGATOIRES
    const missingRequiredGroups: string[] = [];
    productVariations.forEach((group) => {
      if (group.isRequired) {
        if (group.type === "single") {
          const sel = singleSelections[group.id];
          if (!sel) {
            missingRequiredGroups.push(group.title);
          }
        } else {
          // Multiple avec quantité : au moins une option choisie
          const hasSelected = group.options.some((opt) => {
            const key = `${group.id}_${opt.id}`;
            return (optionQuantities[key] || 0) > 0;
          });
          if (!hasSelected) {
            missingRequiredGroups.push(group.title);
          }
        }
      }
    });

    if (missingRequiredGroups.length > 0) {
      setValidationError(
        `Veuillez obligatoirement sélectionner au moins une option pour : « ${missingRequiredGroups.join(", ")} » avant d'ajouter au panier.`
      );
      return;
    }

    const branchObj = BRANCHES.find((b) => b.id === selectedBranch) || BRANCHES[0];

    // Construire la liste des options choisies
    const selectedOptionsList: SelectedOption[] = [];

    productVariations.forEach((group) => {
      if (group.type === "single") {
        const selId = singleSelections[group.id];
        const opt = group.options.find((o) => o.id === selId);
        if (opt) {
          selectedOptionsList.push({
            groupId: group.id,
            groupTitle: group.title,
            optionId: opt.id,
            name: opt.name,
            price: opt.price || 0,
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
        price: currentBasePrice,
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
        <div className={`relative aspect-[16/10] w-full bg-muted/20 overflow-hidden shrink-0 ${
          !isAvailable ? "grayscale-[40%]" : ""
        }`}>
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

          {/* Badges en haut à gauche */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
            {product.is_promotion && (
              <div className="bg-primary-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Offre Spéciale
              </div>
            )}
            {!isAvailable && (
              <div className="bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Rupture de stock
              </div>
            )}
          </div>
        </div>

        {/* Corps de la Fiche Produit (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Titre & Description */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-foreground">
                  {product.name}
                </h3>
                <span className={`inline-block text-xs font-bold mt-1 ${
                  isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}>
                  {isAvailable ? "● En stock" : "● Rupture de stock (Indisponible)"}
                </span>
              </div>
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

          {/* Message clair si rupture de stock */}
          {!isAvailable && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Ce produit est actuellement en rupture de stock et ne peut pas être ajouté au panier.</span>
            </div>
          )}

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

          {/* Groupes de Variations dynamiques reliés à ce produit */}
          {productVariations.map((group) => {
            return (
              <div key={group.id} className="space-y-2.5">
                {/* Titre avec mention Obligatoire ou Facultatif */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <span>{group.title}</span>
                  </label>
                  {group.isRequired ? (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      * Obligatoire
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted font-medium">
                      (Facultatif)
                    </span>
                  )}
                </div>

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
                            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? "border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 font-bold shadow-sm ring-1 ring-primary-500"
                                : "border-border bg-surface hover:bg-surface-hover text-muted hover:text-foreground"
                            }`}
                          >
                            <span>{opt.name}</span>
                            {opt.price > 0 && (
                              <span className="text-[10px] text-primary-600 font-bold">
                                (+{opt.price.toLocaleString("fr-FR")} FDJ)
                              </span>
                            )}
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
                                className="px-3 py-2 flex items-center gap-1.5 hover:text-foreground transition-colors"
                              >
                                <span>{opt.name}</span>
                                {opt.price > 0 && (
                                  <span className="text-[10px] text-muted">
                                    (+{opt.price.toLocaleString("fr-FR")} FDJ)
                                  </span>
                                )}
                              </button>
                            ) : (
                              <div className="px-2.5 py-1.5 flex items-center gap-2">
                                <span className="text-foreground">{opt.name}</span>
                                {opt.price > 0 && (
                                  <span className="text-[10px] text-primary-600 font-bold">
                                    (+{(opt.price * qty).toLocaleString("fr-FR")} FDJ)
                                  </span>
                                )}

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
                                    disabled={qty >= 5}
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

        {/* Pied de la Fiche Produit : Quantité, Alertes et Bouton d'Action */}
        <div className="p-5 border-t border-border bg-surface-hover/50 flex flex-col gap-4">
          
          {/* Alerte si variation obligatoire manquante */}
          {validationError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95 duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            {/* Sélecteur de Quantité du Plat */}
            <div className="flex items-center gap-3 bg-surface border border-border rounded-full p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || !isAvailable}
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
                disabled={!isAvailable}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover disabled:opacity-40 transition-colors"
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

          {/* Bouton Ajouter au Panier (Désactivé si rupture de stock) */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdded}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none ${
              !isAvailable
                ? "bg-muted text-muted-foreground shadow-none"
                : isAdded
                ? "bg-emerald-600 text-white shadow-emerald-600/25"
                : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/25"
            }`}
          >
            {!isAvailable ? (
              <span>RUPTURE DE STOCK (INDISPONIBLE)</span>
            ) : isAdded ? (
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
