"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Category, Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";

// --- DONNÉES TEMPORAIRES (Mocks) ---
const MOCK_CATEGORIES: Category[] = [
  { id: "all", name: "Tous", slug: "tous", display_order: 0 },
  { id: "1", name: "Burgers", slug: "burgers", display_order: 1 },
  { id: "2", name: "Tacos", slug: "tacos", display_order: 2 },
  { id: "3", name: "Sandwichs", slug: "sandwichs", display_order: 3 },
  { id: "4", name: "Boissons", slug: "boissons", display_order: 4 },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Classic Cheeseburger",
    slug: "classic-cheeseburger",
    description: "Steak haché de bœuf, double cheddar fondu, salade, tomate, sauce maison.",
    price: 1200,
    category_id: "1",
    image_url: "/images/hero-burger.jpg",
    is_available: true,
    is_promotion: false,
  },
  {
    id: "p2",
    name: "Tacos Maxi Viande",
    slug: "tacos-maxi-viande",
    description: "Poulet mariné, viande hachée, frites, sauce fromagère onctueuse.",
    price: 2000,
    promotion_price: 1800,
    category_id: "2",
    image_url: "/images/tacos-maxi.jpg",
    is_available: true,
    is_promotion: true,
  },
  {
    id: "p3",
    name: "Chicken Burger",
    slug: "chicken-burger",
    description: "Poulet pané croustillant, cheddar, salade, mayonnaise.",
    price: 1500,
    category_id: "1",
    image_url: "/images/hero-burger.jpg",
    is_available: true,
    is_promotion: false,
  },
  {
    id: "p4",
    name: "Sandwich Kefta",
    slug: "sandwich-kefta",
    description: "Pain baguette, kefta grillée, oignons, frites, sauce au choix.",
    price: 1000,
    category_id: "3",
    image_url: "/images/sandwich-kefta.jpg",
    is_available: true,
    is_promotion: false,
  },
  {
    id: "p5",
    name: "Coca-Cola",
    slug: "coca-cola",
    description: "Canette 33cl bien fraîche, servie avec glaçons et citron.",
    price: 300,
    category_id: "4",
    image_url: "/images/coca-cola.jpg",
    is_available: true,
    is_promotion: false,
  },
];

export function MenuSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filtrage des produits selon la catégorie et la recherche
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
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
            {MOCK_CATEGORIES.map((category) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
