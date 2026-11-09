"use client";

import { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  UtensilsCrossed, 
  Pencil, 
  Trash2, 
  X, 
  Check, 
  AlertCircle, 
  Filter, 
  Package, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  Upload,
  ImageIcon
} from "lucide-react";
import { Category, Product, VariationGroup } from "@/types";

interface MenuTabProps {
  categories: Category[];
  products: Product[];
  variations?: VariationGroup[];
  onAddProduct: (product: Omit<Product, "id">) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const PRESET_IMAGES = [
  { label: "Burger", url: "/images/hero-burger.jpg" },
  { label: "Tacos", url: "/images/tacos-maxi.jpg" },
  { label: "Sandwich Kefta", url: "/images/sandwich-kefta.jpg" },
  { label: "Coca-Cola", url: "/images/coca-cola.jpg" },
];

export function MenuTab({
  categories,
  products,
  variations = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: MenuTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Modal Ajout / Modification
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalTab, setModalTab] = useState<"basic" | "variants" | "inventory">("basic");

  // Formulaire
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState<number>(500);
  const [isPromotion, setIsPromotion] = useState(false);
  const [promotionPrice, setPromotionPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [formError, setFormError] = useState("");

  // Modal Suppression
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Ouvrir modal d'ajout
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setModalTab("basic");
    setName("");
    setCategoryId(categories.length > 0 ? categories[0].id : "");
    setPrice(600);
    setIsPromotion(false);
    setPromotionPrice(0);
    setDescription("");
    setImageUrl(PRESET_IMAGES[0].url);
    setIsAvailable(true);
    setFormError("");
    setIsModalOpen(true);
  };

  // Ouvrir modal de modification
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setModalTab("basic");
    setName(p.name);
    setCategoryId(p.category_id);
    setPrice(p.price);
    setIsPromotion(Boolean(p.is_promotion));
    setPromotionPrice(p.promotion_price || 0);
    setDescription(p.description || "");
    setImageUrl(p.image_url || "");
    setIsAvailable(p.is_available !== false);
    setFormError("");
    setIsModalOpen(true);
  };

  // Basculer la disponibilité en 1 clic
  const handleToggleAvailability = (product: Product) => {
    onUpdateProduct({
      ...product,
      is_available: !product.is_available,
    });
  };

  // Soumission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Le nom du plat est obligatoire.");
      return;
    }
    if (!categoryId) {
      setFormError("Veuillez choisir une catégorie pour ce plat.");
      return;
    }
    if (price <= 0) {
      setFormError("Le prix doit être supérieur à zéro.");
      return;
    }

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: name.trim(),
        slug: editingProduct.slug || slug,
        description: description.trim(),
        price: Number(price),
        category_id: categoryId,
        image_url: imageUrl.trim() || undefined,
        is_available: isAvailable,
        is_promotion: isPromotion,
        promotion_price: isPromotion && promotionPrice > 0 ? Number(promotionPrice) : null,
      });
    } else {
      onAddProduct({
        name: name.trim(),
        slug,
        description: description.trim(),
        price: Number(price),
        category_id: categoryId,
        image_url: imageUrl.trim() || undefined,
        is_available: isAvailable,
        is_promotion: isPromotion,
        promotion_price: isPromotion && promotionPrice > 0 ? Number(promotionPrice) : null,
      });
    }

    setIsModalOpen(false);
  };

  // Filtrage
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);

      const matchesCat =
        selectedCategoryFilter === "all" || p.category_id === selectedCategoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategoryFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Barre d'action supérieure (Inspirée de l'Image 3 : Search, Dropdown Produit/Catégorie, + Ajouter un Item) */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface p-4 sm:p-5 rounded-2xl border border-border">
        
        {/* Recherche */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un plat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdown Catégorie (comme dans Image 3) */}
        <div className="relative w-full sm:w-60">
          <Filter className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton "+ Ajouter un Item" (Vert, comme dans l'Image 3) */}
        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Ajouter un Item</span>
        </button>

      </div>

      {/* Grille des cartes produits (Fidèle à l'Image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const cat = categories.find((c) => c.id === product.category_id);

            return (
              <div
                key={product.id}
                className="group bg-surface rounded-2xl overflow-hidden border border-border hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative"
              >
                {/* Image du produit avec badge prix flottant en haut à droite (Image 3) */}
                <div className="aspect-[4/3] bg-muted/20 relative flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
                      🍔
                    </span>
                  )}

                  {/* Badge Prix Flottant en haut à droite (Style Image 3) */}
                  <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-foreground font-black text-xs shadow-md border border-black/5 dark:border-white/10 flex items-center gap-1">
                    {product.is_promotion && product.promotion_price ? (
                      <>
                        <span className="line-through text-muted font-normal text-[10px]">
                          {product.price}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {product.promotion_price} FDJ
                        </span>
                      </>
                    ) : (
                      <span>{product.price.toLocaleString("fr-FR")} FDJ</span>
                    )}
                  </div>

                  {/* Badge Catégorie en haut à gauche */}
                  {cat && (
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-md bg-emerald-600/90 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
                      {cat.name}
                    </div>
                  )}
                </div>

                {/* Contenu de la carte */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <h3 className="font-extrabold text-foreground text-base mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-muted mb-4 line-clamp-2 flex-1">
                    {product.description || "Aucune description fournie pour ce plat."}
                  </p>

                  {/* Ligne inférieure : Statut en stock & Actions (Crayon vert & Poubelle rouge comme Image 3) */}
                  <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                    
                    {/* Indicateur de stock cliquable */}
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(product)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        product.is_available
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                      }`}
                      title="Cliquer pour changer la disponibilité"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>{product.is_available ? "En stock" : "Épuisé"}</span>
                    </button>

                    {/* Actions Crayon & Corbeille */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center shadow-xs"
                        title="Modifier le plat"
                        aria-label={`Modifier ${product.name}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletingProduct(product)}
                        className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-colors flex items-center justify-center shadow-xs"
                        title="Supprimer le plat"
                        aria-label={`Supprimer ${product.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16 bg-surface rounded-2xl border border-border border-dashed">
            <UtensilsCrossed className="w-12 h-12 mx-auto text-muted/60 mb-3" />
            <p className="text-base font-bold text-foreground">
              Aucun plat dans le menu
            </p>
            <p className="text-xs text-muted mt-1">
              {searchQuery || selectedCategoryFilter !== "all"
                ? "Aucun plat ne correspond à vos filtres de recherche."
                : "Commencez par ajouter des plats à votre carte."}
            </p>
          </div>
        )}
      </div>

      {/* Modal Ajout / Modification Produit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-surface border border-border rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* En-tête de la modale */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {editingProduct ? "Modifier le produit" : "Ajouter un Item"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Onglets internes (Informations de base / Variantes / Inventaire comme dans la Capture 4) */}
            <div className="flex border-b border-border">
              <button
                type="button"
                onClick={() => setModalTab("basic")}
                className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  modalTab === "basic"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                Informations de base
              </button>
              <button
                type="button"
                onClick={() => setModalTab("variants")}
                className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  modalTab === "variants"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                Variantes
              </button>
              <button
                type="button"
                onClick={() => setModalTab("inventory")}
                className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  modalTab === "inventory"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                Inventaire
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* ONGLET 1 : INFORMATIONS DE BASE */}
              {modalTab === "basic" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Section Image du produit (Fidèle à la Capture 4) */}
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-2">
                      Image du produit
                    </label>
                    
                    <div className="p-4 rounded-2xl border border-border bg-surface-hover/20">
                      <div className="flex flex-col sm:flex-row items-center gap-5">
                        {/* À gauche : Aperçu de l'image sélectionnée dans un cadre carré en pointillés */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-surface flex items-center justify-center overflow-hidden shrink-0 shadow-xs relative">
                          {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageUrl}
                              alt="Aperçu du plat"
                              className="w-full h-full object-contain p-1 rounded-xl"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-muted/60">
                              <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                              <span className="text-[10px] mt-1 font-medium">Aucune</span>
                            </div>
                          )}
                        </div>

                        {/* À droite : Deux boutons rectangulaires */}
                        <div className="flex-1 w-full space-y-2.5">
                          {/* 1. Choisir depuis la bibliothèque */}
                          <button
                            type="button"
                            onClick={() => {
                              setCustomUrlInput(imageUrl);
                              setIsLibraryOpen(true);
                            }}
                            className="w-full py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-surface-hover text-foreground font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                          >
                            <Upload className="w-4 h-4 text-emerald-600" />
                            <span>Choisir depuis la bibliothèque</span>
                          </button>

                          {/* 2. Supprimer l'image */}
                          <button
                            type="button"
                            onClick={() => setImageUrl("")}
                            className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                          >
                            <X className="w-4 h-4 stroke-[2.5]" />
                            <span>Supprimer l'image</span>
                          </button>
                        </div>
                      </div>

                      {/* Mention sous la zone */}
                      <p className="text-[11px] text-muted mt-3">
                        Format recommandé: JPG ou PNG en haute résolution (1920x1080px minimum)
                      </p>
                    </div>
                  </div>

                  {/* Nom du produit */}
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Classic Cheeseburger, Tacos Maxi..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      autoFocus
                    />
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">
                      Catégorie *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="" disabled>Sélectionner une catégorie</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Prix & Promotion */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1.5">
                        Prix (FDJ) *
                      </label>
                      <input
                        type="number"
                        min="50"
                        step="50"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground flex items-center justify-between mb-1.5">
                        <span>En promotion ?</span>
                        <input
                          type="checkbox"
                          checked={isPromotion}
                          onChange={(e) => setIsPromotion(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        placeholder="Prix promo"
                        disabled={!isPromotion}
                        value={promotionPrice || ""}
                        onChange={(e) => setPromotionPrice(Number(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ingrédients, recette, accompagnements..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ONGLET 2 : VARIANTES */}
              {modalTab === "variants" && (
                <div className="space-y-4 animate-in fade-in duration-150 py-2">
                  <div className="p-4 rounded-2xl bg-surface-hover/40 border border-border space-y-2">
                    <p className="text-xs font-bold text-foreground">
                      Variantes associées à ce produit
                    </p>
                    <p className="text-xs text-muted leading-relaxed">
                      Les groupes de variantes (Sauces, Tailles, Suppléments, etc.) configurés dans l'onglet{" "}
                      <strong className="text-emerald-600 font-semibold">Variations</strong> et assignés à cette catégorie s'appliqueront automatiquement à ce plat.
                    </p>
                  </div>

                  {/* Liste des variantes actives pour la catégorie sélectionnée */}
                  <div className="space-y-3">
                    {variations.filter(
                      (v) => !v.categoryIds || v.categoryIds.length === 0 || v.categoryIds.includes(categoryId)
                    ).length > 0 ? (
                      variations
                        .filter(
                          (v) => !v.categoryIds || v.categoryIds.length === 0 || v.categoryIds.includes(categoryId)
                        )
                        .map((v) => (
                          <div
                            key={v.id}
                            className="p-3.5 rounded-xl bg-surface border border-border space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs uppercase text-foreground">
                                {v.title}
                              </span>
                              {v.isRequired ? (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                  * Obligatoire
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted">Facultatif</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {v.options.map((opt) => (
                                <span
                                  key={opt.id}
                                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200"
                                >
                                  {opt.name}
                                  {opt.price > 0 && ` (+${opt.price} FDJ)`}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-xs text-muted text-center py-6">
                        Aucune variation assignée à cette catégorie pour le moment. Vous pouvez en créer dans l'onglet Variations.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ONGLET 3 : INVENTAIRE */}
              {modalTab === "inventory" && (
                <div className="space-y-4 animate-in fade-in duration-150 py-2">
                  <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-foreground">
                          Disponibilité du plat
                        </h4>
                        <p className="text-[11px] text-muted mt-0.5">
                          Définissez si ce plat peut être commandé par les clients sur le site.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAvailable(!isAvailable)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-xs ${
                          isAvailable
                            ? "bg-emerald-600 text-white"
                            : "bg-rose-600 text-white"
                        }`}
                      >
                        {isAvailable ? "En stock (Disponible)" : "En rupture (Indisponible)"}
                      </button>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-muted">Quantité estimée en stock :</span>
                      <span className="font-mono font-bold text-foreground">
                        {isAvailable ? "999999 En stock" : "0 (Rupture)"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons d'action (Style Capture 4 : Annuler + Bouton vert foncé Mettre à jour) */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-muted hover:text-foreground text-sm font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold shadow-md shadow-emerald-900/20 transition-colors"
                >
                  {editingProduct ? "Mettre à jour" : "Ajouter un Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmation de Suppression */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-surface border border-border rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 mx-auto flex items-center justify-center border border-rose-500/20">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                Supprimer ce plat ?
              </h3>
              <p className="text-xs text-muted">
                Êtes-vous sûr de vouloir supprimer le plat{" "}
                <strong className="text-foreground">
                  « {deletingProduct.name} »
                </strong>{" "}
                du menu ?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-muted hover:text-foreground text-sm font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(deletingProduct.id);
                  setDeletingProduct(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md shadow-rose-600/20 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bibliothèque d'images */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-surface border border-border rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-foreground">
                  Bibliothèque d'images
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted">
              Sélectionnez une photo haute résolution parmi la galerie du restaurant ou saisissez une URL personnalisée :
            </p>

            {/* Grille des photos disponibles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
              {[
                { label: "Classic Burger", url: "/images/hero-burger.jpg" },
                { label: "Tacos Maxi", url: "/images/tacos-maxi.jpg" },
                { label: "Sandwich Kefta", url: "/images/sandwich-kefta.jpg" },
                { label: "Coca-Cola Frais", url: "/images/coca-cola.jpg" },
                { label: "Scooter Livraison", url: "/images/delivery-scooter.jpg" },
              ].map((item) => {
                const isSelected = customUrlInput === item.url;
                return (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => setCustomUrlInput(item.url)}
                    className={`relative rounded-xl overflow-hidden border-2 p-1 flex flex-col items-center gap-1.5 transition-all text-left ${
                      isSelected
                        ? "border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/20"
                        : "border-border hover:border-emerald-500/40 bg-surface"
                    }`}
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted/20 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white stroke-[3] drop-shadow" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-foreground truncate w-full text-center">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Saisie d'une URL personnalisée */}
            <div className="pt-2 border-t border-border space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Ou coller une URL d'image externe :
              </label>
              <input
                type="text"
                placeholder="https://... ou /images/..."
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-surface text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-muted hover:text-foreground text-xs font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageUrl(customUrlInput);
                  setIsLibraryOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors"
              >
                Choisir cette image
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
