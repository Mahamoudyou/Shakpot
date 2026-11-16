"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Category, Product, VariationGroup } from "@/types";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

// ==================== CONFIGURATION SUPABASE ====================
const RESTAURANT_ID = "00000000-0000-0000-0000-000000000001";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return (
    url.length > 0 &&
    !url.includes("votre-projet") &&
    !url.includes("mock.supabase.co") &&
    url.startsWith("https://")
  );
}

// Helper pour obtenir un client Supabase non-typÃ© (Ã©vite les erreurs never sur les nouvelles tables)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDb(): any {
  return createSupabaseClient();
}

// ==================== DONNÃ‰ES PAR DÃ‰FAUT ====================
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
      { id: "s1", name: "Sauce AlgÃ©rienne", price: 0 },
      { id: "s2", name: "Sauce SamouraÃ¯", price: 0 },
      { id: "s3", name: "Sauce Barbecue", price: 0 },
      { id: "s4", name: "Sauce Andalouse", price: 0 },
      { id: "s5", name: "Sauce FromagÃ¨re", price: 0 },
      { id: "s6", name: "Sauce Shakpot", price: 100 },
      { id: "s7", name: "Mayonnaise", price: 0 },
      { id: "s8", name: "Ketchup", price: 0 },
    ],
  },
  {
    id: "v3",
    title: "EXTRAS ET SUPPLÃ‰MENTS",
    type: "multiple_with_quantity",
    isRequired: false,
    categoryIds: ["1", "2"],
    options: [
      { id: "e1", name: "Double Cheddar fondu", price: 200 },
      { id: "e2", name: "Frites croustillantes", price: 300 },
      { id: "e3", name: "Oignons caramÃ©lisÃ©s", price: 150 },
      { id: "e4", name: "JalapeÃ±os piments", price: 100 },
      { id: "e5", name: "GratinÃ© Cheddar au four", price: 250 },
      { id: "e6", name: "Canette fraÃ®che 33cl", price: 300 },
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
    description: "Steak hachÃ© de bÅ“uf, double cheddar fondu, salade, tomate, sauce maison.",
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
    description: "Poulet marinÃ©, viande hachÃ©e, frites, sauce fromagÃ¨re onctueuse.",
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
    description: "Poulet panÃ© croustillant, cheddar, salade, mayonnaise.",
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
    description: "Pain baguette, kefta grillÃ©e, oignons, frites, sauce au choix.",
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
    description: "Canette 33cl bien fraÃ®che, servie avec glaÃ§ons et citron.",
    price: 300,
    category_id: "4",
    image_url: "/images/coca-cola.jpg",
    is_available: true,
    is_promotion: false,
  },
];

// ClÃ©s localStorage
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

  // CatÃ©gories
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

  // RÃ©initialisation
  resetToDefaults: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [variations, setVariations] = useState<VariationGroup[]>(INITIAL_VARIATIONS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Charger depuis Supabase ou localStorage au montage
  const loadFromStorage = useCallback(async () => {
    if (isSupabaseConfigured()) {
      // ============ MODE SUPABASE ============
      try {
        const supabase = getDb();

        const [catsRes, varsRes, prodsRes] = await Promise.all([
          supabase
            .from("categories")
            .select("*")
            .eq("restaurant_id", RESTAURANT_ID)
            .order("display_order", { ascending: true }),
          supabase
            .from("variation_groups")
            .select("*, variation_options(*)")
            .eq("restaurant_id", RESTAURANT_ID),
          supabase
            .from("products")
            .select("*")
            .eq("restaurant_id", RESTAURANT_ID)
            .order("created_at", { ascending: true }),
        ]);

        if (catsRes.data && catsRes.data.length > 0) {
          setCategories(
            catsRes.data.map((c: any) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              display_order: c.display_order,
              image_url: c.image_url,
            }))
          );
        }

        if (varsRes.data && varsRes.data.length > 0) {
          setVariations(
            varsRes.data.map((v: any) => ({
              id: v.id,
              title: v.title,
              type: v.type,
              isRequired: v.is_required ?? false,
              categoryIds: v.category_ids ?? [],
              options: (v.variation_options ?? []).map((o: any) => ({
                id: o.id,
                name: o.name,
                price: o.price_adjustment ?? 0,
                basePrice: o.base_price,
              })),
            }))
          );
        }

        if (prodsRes.data && prodsRes.data.length > 0) {
          setProducts(
            prodsRes.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              description: p.description ?? "",
              price: p.price,
              category_id: p.category_id,
              image_url: p.image_url,
              is_available: p.is_available ?? true,
              is_promotion: p.is_promotion ?? false,
              promotion_price: p.promotion_price,
            }))
          );
        }
      } catch (e) {
        console.error("Erreur Supabase, fallback localStorage :", e);
        loadFromLocalStorage();
      } finally {
        setIsHydrated(true);
      }
    } else {
      // ============ MODE LOCALSTORAGE ============
      loadFromLocalStorage();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadFromLocalStorage = () => {
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
      console.error("Erreur de chargement des donnÃ©es restaurant :", e);
    } finally {
      setIsHydrated(true);
    }
  };

  useEffect(() => {
    loadFromStorage();

    // Ã‰couter les changements multi-onglets / inter-fenÃªtres
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

  // ==================== ACTIONS CATÃ‰GORIES ====================
  const addCategory = (catData: Omit<Category, "id">): Category => {
    const newCat: Category = {
      ...catData,
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    // Supabase async (fire & forget)
    if (isSupabaseConfigured()) {
      const supabase = getDb();
      supabase.from("categories").insert({
        id: newCat.id,
        restaurant_id: RESTAURANT_ID,
        name: newCat.name,
        slug: newCat.slug,
        display_order: newCat.display_order ?? 0,
        image_url: newCat.image_url,
      }).then(({ error }: { error: any }) => { if (error) console.warn("Supabase addCategory:", error.message); });
    }
    triggerSync();
    return newCat;
  };

  const updateCategory = (cat: Category) => {
    const updated = categories.map((c) => (c.id === cat.id ? cat : c));
    setCategories(updated);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    if (isSupabaseConfigured()) {
      const supabase = getDb();
      supabase.from("categories").update({
        name: cat.name,
        slug: cat.slug,
        display_order: cat.display_order ?? 0,
        image_url: cat.image_url,
      }).eq("id", cat.id).then(({ error }: { error: any }) => { if (error) console.warn("Supabase updateCategory:", error.message); });
    }
    triggerSync();
  };

  const deleteCategory = (catId: string) => {
    const updated = categories.filter((c) => c.id !== catId);
    setCategories(updated);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    if (isSupabaseConfigured()) {
      const supabase = getDb();
      supabase.from("categories").delete().eq("id", catId).then(({ error }: { error: any }) => { if (error) console.warn("Supabase deleteCategory:", error.message); });
    }
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
    if (isSupabaseConfigured()) {
      const supabase = getDb();
      supabase.from("variation_groups").insert({
        id: newVar.id,
        restaurant_id: RESTAURANT_ID,
        title: newVar.title,
        type: newVar.type,
        is_required: newVar.isRequired ?? false,
        category_ids: newVar.categoryIds ?? [],
      }).then(async ({ error }: { error: any }) => {
        if (error) { console.warn("Supabase addVariation group:", error.message); return; }
        if (newVar.options && newVar.options.length > 0) {
          const opts = newVar.options.map(o => ({
            id: o.id,
            variation_group_id: newVar.id,
            name: o.name,
            price_adjustment: o.price ?? 0,
            base_price: o.basePrice,
          }));
          const { error: optsErr } = await supabase.from("variation_options").insert(opts);
          if (optsErr) console.warn("Supabase addVariation options:", optsErr.message);
        }
      });
    }
    triggerSync();
    return newVar;
  };

  const updateVariation = (v: VariationGroup) => {
    const updated = variations.map((item) => (item.id === v.id ? v : item));
    setVariations(updated);
    localStorage.setItem(STORAGE_KEYS.VARIATIONS, JSON.stringify(updated));
    if (isSupabaseConfigured()) {
      const supabase = getDb();
      supabase.from("variation_groups").update({
        title: v.title,
        type: v.type,
        is_required: v.isRequired ?? false,
        category_ids: v.categoryIds ?? [],
      }).eq("id", v.id).then(({ error }: { error: any }) => { if (error) console.warn("Supabase updateVariation:", error.message); });
    }
    triggerSync();
  };

  const deleteVariation = (vId: string) => {
    const updated = variations.filter((item) => item.id !== vId);
    setVariations(updated);
    localStorage.setItem(STORAGE_KEYS.VARIATIONS, JSON.stringify(updated));
    if (isSupabaseConfigured()) {
      const supabase = getDb();
      supabase.from("variation_groups").delete().eq("id", vId).then(({ error }: { error: any }) => { if (error) console.warn("Supabase deleteVariation:", error.message); });
    }
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
    if (isSupabaseConfigured()) {
      const supabase = getDb();
      supabase.from("products").insert({
        id: newProd.id,
        restaurant_id: RESTAURANT_ID,
        name: newProd.name,
        slug: newProd.slug,
        description: newProd.description ?? "",
        price: newProd.price,
        category_id: newProd.category_id,
        image_url: newProd.image_url,
        is_available: newProd.is_available ?? true,
        is_promotion: newProd.is_promotion ?? false,
        promotion_price: newProd.promotion_price ?? null,
      }).then(({ error }: { error: any }) => { if (error) console.warn("Supabase addProduct:", error.message); });
    }
    triggerSync();
    return newProd;
  };

  const updateProduct = (p: Product) => {
    const updated = products.map((item) => (item.id === p.id ? p : item));
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    if (isSupabaseConfigured()) {
      const supabase = getDb();
      supabase.from("products").update({
        name: p.name,
        slug: p.slug,
        description: p.description ?? "",
        price: p.price,
        category_id: p.category_id,
        image_url: p.image_url,
        is_available: p.is_available ?? true,
        is_promotion: p.is_promotion ?? false,
        promotion_price: p.promotion_price ?? null,
      }).eq("id", p.id).then(({ error }: { error: any }) => { if (error) console.warn("Supabase updateProduct:", error.message); });
    }
    triggerSync();
  };

  const deleteProduct = (pId: string) => {
    const updated = products.filter((item) => item.id !== pId);
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    if (isSupabaseConfigured()) {
      const supabase = getDb();
      supabase.from("products").delete().eq("id", pId).then(({ error }: { error: any }) => { if (error) console.warn("Supabase deleteProduct:", error.message); });
    }
    triggerSync();
  };

  const toggleProductAvailability = (pId: string) => {
    const updated = products.map((p) =>
      p.id === pId ? { ...p, is_available: !p.is_available } : p
    );
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    const toggled = updated.find((p) => p.id === pId);
    if (isSupabaseConfigured() && toggled) {
      const supabase = getDb();
      supabase.from("products").update({ is_available: toggled.is_available }).eq("id", pId).then(({ error }: { error: any }) => { if (error) console.warn("Supabase toggleAvailability:", error.message); });
    }
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


