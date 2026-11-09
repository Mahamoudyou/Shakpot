"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Product } from "@/types";
import { useRestaurantData } from "@/lib/context/RestaurantContext";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";

export function MenuSection() {
  const { categories, products } = useRestaurantData();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Trier les catégories selon l'ordre d'affichage (display_order)
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.display_order - b.display_order);
  }, [categories]);

  // Filtrage des produits selon la catégorie active et la recherche
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Filtre par catégorie
      const matchesCategory =
        activeCategory === "all" || product.category_id === activeCategory;

      // 2. Filtre par recherche (titre ou description)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <section id="menu" className="scroll-mt-16 py-16 md:py-24 bg-surface-hover">
      <div className="container mx-auto px-4">
        
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Notre Menu
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Découvrez nos spécialités préparées à la commande avec des ingrédients frais.
          </p>
        </div>

        {/* Outils de recherche et filtrage */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          
          {/* Barre de recherche */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un plat (ex: burger, tacos...)"
              className="block w-full pl-12 pr-4 py-4 bg-surface border border-border rounded-full text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filtres par catégories (Scroll horizontal sur mobile) */}
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide gap-3">
            {/* Bouton Tous */}
            <button
              onClick={() => setActiveCategory("all")}
              className={`whitespace-nowrap px-6 py-2 rounded-full font-medium transition-colors border ${
                activeCategory === "all"
                  ? "bg-primary-600 text-white border-primary-600 shadow-md"
                  : "bg-surface text-muted border-border hover:bg-border/50"
              }`}
            >
              Tous
            </button>

            {/* Catégories dynamiques respectant le nouvel ordre d'affichage */}
            {sortedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`whitespace-nowrap px-6 py-2 rounded-full font-medium transition-colors border ${
                  activeCategory === category.id
                    ? "bg-primary-600 text-white border-primary-600 shadow-md"
                    : "bg-surface text-muted border-border hover:bg-border/50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des plats */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface rounded-2xl border border-border border-dashed">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Aucun plat trouvé
            </h3>
            <p className="text-muted">
              Nous n'avons pas trouvé de plat correspondant à votre recherche "{searchQuery}".
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-6 px-6 py-2 bg-primary-100 text-primary-700 rounded-full font-medium hover:bg-primary-200 transition-colors"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}

        {/* Modale Fiche Produit Interactive */}
        <ProductModal 
          product={selectedProduct} 
          isOpen={!!selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />

      </div>
    </section>
  );
}
