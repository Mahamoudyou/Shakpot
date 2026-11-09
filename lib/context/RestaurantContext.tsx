"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Category, Product, VariationGroup } from "@/types";

// ==================== DONNÉES PAR DÉFAUT ====================
export const INITIAL_CATEGORIES: Category[] = [
  { id: "1", name: "Burgers", slug: "burgers", display_order: 1 },
  { id: "2", name: "Tacos", slug: "tacos", display_order: 2 },
  { id: "3", name: "Sandwichs", slug: "sandwichs", display_order: 3 },
  { id: "4", name: "Boissons", slug: "boissons", display_order: 4 },
];

export const INITIAL_VARIATIONS: VariationGroup[] = [
  {
    id: "v1",
    title: "TYPES DE BURGER",
    type: "single",
    isRequired: true,
    categoryIds: ["1"],
    options: [
      { id: "o1", name: "Chicken", price: 0, basePrice: 500 },
      { id: "o2", name: "Beef burger", price: 100, basePrice: 600 },
      { id: "o3", name: "Zinger", price: 200, basePrice: 700 },
      { id: "o4", name: "Double chicken", price: 400, basePrice: 900 },
      { id: "o5", name: "Double beef", price: 400, basePrice: 900 },
      { id: "o6", name: "Double Zinger", price: 500, basePrice: 1000 },
    ],
  },
  {
    id: "v2",
    title: "SAUCES",
    type: "multiple_with_quantity",
    isRequired: false,
    categoryIds: ["1", "2", "3"],
    options: [
      { id: "s1", name: "Sauce Algérienne", price: 0 },
      { id: "s2", name: "Sauce Samouraï", price: 0 },
      { id: "s3", name: "Sauce Barbecue", price: 0 },
      { id: "s4", name: "Sauce Andalouse", price: 0 },
      { id: "s5", name: "Sauce Fromagère", price: 0 },
      { id: "s6", name: "Sauce Shakpot", price: 100 },
      { id: "s7", name: "Mayonnaise", price: 0 },
      { id: "s8", name: "Ketchup", price: 0 },
    ],
  },
  {
    id: "v3",
    title: "EXTRAS ET SUPPLÉMENTS",
    type: "multiple_with_quantity",
    isRequired: false,
    categoryIds: ["1", "2"],
    options: [
      { id: "e1", name: "Double Cheddar fondu", price: 200 },
      { id: "e2", name: "Frites croustillantes", price: 300 },
      { id: "e3", name: "Oignons caramélisés", price: 150 },
      { id: "e4", name: "Jalapeños piments", price: 100 },
      { id: "e5", name: "Gratiné Cheddar au four", price: 250 },
      { id: "e6", name: "Canette fraîche 33cl", price: 300 },
    ],
  },
  {
    id: "v4",
    title: "FORMAT DU TACOS",
    type: "single",
    isRequired: true,
    categoryIds: ["2"],
    options: [
      { id: "t1", name: "Format Simple (L)", price: 0, basePrice: 1500 },
      { id: "t2", name: "Format Maxi (XL)", price: 300, basePrice: 1800 },
      { id: "t3", name: "Format Giga (XXL)", price: 700, basePrice: 2200 },
    ],
  },
  {
    id: "v5",
    title: "TYPE DE PAIN",
    type: "single",
    isRequired: true,
    categoryIds: ["3"],
    options: [
      { id: "p1", name: "Pain Baguette traditionnel", price: 0, basePrice: 1000 },
      { id: "p2", name: "Galette Tortilla", price: 0, basePrice: 1000 },
    ],
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Classic Cheeseburger",
    slug: "classic-cheeseburger",
    description: "Steak haché de bœuf, double cheddar fondu, salade, tomate, sauce maison.",
    price: 600,
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
    price: 1800,
    promotion_price: 1600,
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
    price: 500,
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

// Clés localStorage
const STORAGE_KEYS = {
  CATEGORIES: "shakpot_categories",
  VARIATIONS: "shakpot_variations",
  PRODUCTS: "shakpot_products",
};

interface RestaurantContextType {
  categories: Category[];
  variations: VariationGroup[];
  products: Product[];
  isHydrated: boolean;

  // Catégories
  addCategory: (cat: Omit<Category, "id">) => Category;
  updateCategory: (cat: Category) => void;
  deleteCategory: (catId: string) => void;

  // Variations
  addVariation: (v: Omit<VariationGroup, "id">) => VariationGroup;
  updateVariation: (v: VariationGroup) => void;
  deleteVariation: (vId: string) => void;

  // Produits
  addProduct: (p: Omit<Product, "id">) => Product;
  updateProduct: (p: Product) => void;
  deleteProduct: (pId: string) => void;
  toggleProductAvailability: (pId: string) => void;

  // Réinitialisation
  resetToDefaults: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [variations, setVariations] = useState<VariationGroup[]>(INITIAL_VARIATIONS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Charger depuis localStorage au montage
  const loadFromStorage = useCallback(() => {
    try {
      const storedCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (storedCats) {
        const parsed = JSON.parse(storedCats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      }

      const storedVars = localStorage.getItem(STORAGE_KEYS.VARIATIONS);
      if (storedVars) {
        const parsed = JSON.parse(storedVars);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVariations(parsed);
        }
      }

      const storedProds = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (storedProds) {
        const parsed = JSON.parse(storedProds);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch (e) {
      console.error("Erreur de chargement des données restaurant :", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();

    // Écouter les changements multi-onglets / inter-fenêtres
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === STORAGE_KEYS.CATEGORIES ||
        e.key === STORAGE_KEYS.VARIATIONS ||
        e.key === STORAGE_KEYS.PRODUCTS
      ) {
        loadFromStorage();
      }
    };

    const handleCustomSync = () => {
      loadFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("shakpot_data_sync", handleCustomSync);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("shakpot_data_sync", handleCustomSync);
    };
  }, [loadFromStorage]);

  // Sauvegarde helper
  const triggerSync = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("shakpot_data_sync"));
    }
  };

  // ==================== ACTIONS CATÉGORIES ====================
  const addCategory = (catData: Omit<Category, "id">): Category => {
    const newCat: Category = {
      ...catData,
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    triggerSync();
    return newCat;
  };

  const updateCategory = (cat: Category) => {
    const updated = categories.map((c) => (c.id === cat.id ? cat : c));
    setCategories(updated);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    triggerSync();
  };

  const deleteCategory = (catId: string) => {
    const updated = categories.filter((c) => c.id !== catId);
    setCategories(updated);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    triggerSync();
  };

  // ==================== ACTIONS VARIATIONS ====================
  const addVariation = (vData: Omit<VariationGroup, "id">): VariationGroup => {
    const newVar: VariationGroup = {
      ...vData,
      id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [...variations, newVar];
    setVariations(updated);
    localStorage.setItem(STORAGE_KEYS.VARIATIONS, JSON.stringify(updated));
    triggerSync();
    return newVar;
  };

  const updateVariation = (v: VariationGroup) => {
    const updated = variations.map((item) => (item.id === v.id ? v : item));
    setVariations(updated);
    localStorage.setItem(STORAGE_KEYS.VARIATIONS, JSON.stringify(updated));
    triggerSync();
  };

  const deleteVariation = (vId: string) => {
    const updated = variations.filter((item) => item.id !== vId);
    setVariations(updated);
    localStorage.setItem(STORAGE_KEYS.VARIATIONS, JSON.stringify(updated));
    triggerSync();
  };

  // ==================== ACTIONS PRODUITS ====================
  const addProduct = (pData: Omit<Product, "id">): Product => {
    const newProd: Product = {
      ...pData,
      id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [...products, newProd];
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    triggerSync();
    return newProd;
  };

  const updateProduct = (p: Product) => {
    const updated = products.map((item) => (item.id === p.id ? p : item));
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    triggerSync();
  };

  const deleteProduct = (pId: string) => {
    const updated = products.filter((item) => item.id !== pId);
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    triggerSync();
  };

  const toggleProductAvailability = (pId: string) => {
    const updated = products.map((p) =>
      p.id === pId ? { ...p, is_available: !p.is_available } : p
    );
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    triggerSync();
  };

  const resetToDefaults = () => {
    setCategories(INITIAL_CATEGORIES);
    setVariations(INITIAL_VARIATIONS);
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.VARIATIONS, JSON.stringify(INITIAL_VARIATIONS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    triggerSync();
  };

  return (
    <RestaurantContext.Provider
      value={{
        categories,
        variations,
        products,
        isHydrated,
        addCategory,
        updateCategory,
        deleteCategory,
        addVariation,
        updateVariation,
        deleteVariation,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        resetToDefaults,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurantData() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurantData must be used within a RestaurantProvider");
  }
  return context;
}
