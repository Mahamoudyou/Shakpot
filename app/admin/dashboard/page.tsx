"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  Layers, 
  Tag, 
  UtensilsCrossed,
  Sparkles,
  TrendingUp,
  Store,
  Phone,
  CheckCircle2
} from "lucide-react";
import { Category, Product, VariationGroup } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { CategoriesTab } from "@/components/admin/CategoriesTab";
import { VariationsTab } from "@/components/admin/VariationsTab";
import { MenuTab } from "@/components/admin/MenuTab";

// --- DONNÉES INITIALES SHAKPOT ---
const INITIAL_CATEGORIES: Category[] = [
  { id: "1", name: "Burgers", slug: "burgers", display_order: 1 },
  { id: "2", name: "Tacos", slug: "tacos", display_order: 2 },
  { id: "3", name: "Sandwichs", slug: "sandwichs", display_order: 3 },
  { id: "4", name: "Boissons", slug: "boissons", display_order: 4 },
];

const INITIAL_VARIATIONS: VariationGroup[] = [
  {
    id: "v1",
    title: "TYPES DE BURGER",
    type: "single",
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
    categoryIds: ["3"],
    options: [
      { id: "p1", name: "Pain Baguette traditionnel", price: 0, basePrice: 1000 },
      { id: "p2", name: "Galette Tortilla", price: 0, basePrice: 1000 },
    ],
  },
];

const INITIAL_PRODUCTS: Product[] = [
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

export default function AdminDashboardPage() {
  const router = useRouter();

  // Navigation Sidebar principale (Catégories a été supprimé comme demandé)
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "settings">("products");

  // Trois onglets de la page Produits : "categories" | "variations" | "menu"
  const [productSubTab, setProductSubTab] = useState<"categories" | "variations" | "menu">("categories");

  // Notifications toast de succès
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Données dynamiques avec persistance locale
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [variations, setVariations] = useState<VariationGroup[]>(INITIAL_VARIATIONS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Charger depuis le localStorage au montage (côté client uniquement)
  useEffect(() => {
    try {
      const savedCats = localStorage.getItem("shakpot_admin_categories");
      if (savedCats) {
        const parsed = JSON.parse(savedCats);
        if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed);
      }

      const savedVars = localStorage.getItem("shakpot_admin_variations");
      if (savedVars) {
        const parsed = JSON.parse(savedVars);
        if (Array.isArray(parsed) && parsed.length > 0) setVariations(parsed);
      }

      const savedProds = localStorage.getItem("shakpot_admin_products");
      if (savedProds) {
        const parsed = JSON.parse(savedProds);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      }
    } catch {}
  }, []);

  // Déconnexion
  const handleLogout = async () => {
    try {
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("votre-projet")
      ) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("shakpot_admin_user");
    }
    router.push("/admin/login");
  };

  // Navigation de la barre latérale (sans l'ancienne entrée 'Catégories')
  const sidebarItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "products", label: "Produits", icon: Package },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  // ==================== GESTION CATÉGORIES ====================
  const handleAddCategory = (newCat: Omit<Category, "id">) => {
    const category: Category = {
      ...newCat,
      id: `cat_${Date.now()}`,
    };
    const updated = [...categories, category];
    setCategories(updated);
    localStorage.setItem("shakpot_admin_categories", JSON.stringify(updated));
    showToast(`Catégorie « ${category.name} » créée avec succès !`);
  };

  const handleUpdateCategory = (updatedCat: Category) => {
    const updated = categories.map((c) => (c.id === updatedCat.id ? updatedCat : c));
    setCategories(updated);
    localStorage.setItem("shakpot_admin_categories", JSON.stringify(updated));
    showToast(`Catégorie « ${updatedCat.name} » mise à jour !`);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    const updated = categories.filter((c) => c.id !== categoryId);
    setCategories(updated);
    localStorage.setItem("shakpot_admin_categories", JSON.stringify(updated));
    showToast(`Catégorie « ${cat?.name || ""} » supprimée.`);
  };

  // ==================== GESTION VARIATIONS ====================
  const handleAddVariation = (newVar: Omit<VariationGroup, "id">) => {
    const variation: VariationGroup = {
      ...newVar,
      id: `var_${Date.now()}`,
    };
    const updated = [...variations, variation];
    setVariations(updated);
    localStorage.setItem("shakpot_admin_variations", JSON.stringify(updated));
    showToast(`Variante « ${variation.title} » ajoutée avec succès !`);
  };

  const handleUpdateVariation = (updatedVar: VariationGroup) => {
    const updated = variations.map((v) => (v.id === updatedVar.id ? updatedVar : v));
    setVariations(updated);
    localStorage.setItem("shakpot_admin_variations", JSON.stringify(updated));
    showToast(`Variante « ${updatedVar.title} » mise à jour !`);
  };

  const handleDeleteVariation = (variationId: string) => {
    const v = variations.find((item) => item.id === variationId);
    const updated = variations.filter((item) => item.id !== variationId);
    setVariations(updated);
    localStorage.setItem("shakpot_admin_variations", JSON.stringify(updated));
    showToast(`Variante « ${v?.title || ""} » supprimée.`);
  };

  // ==================== GESTION PRODUITS / MENU ====================
  const handleAddProduct = (newProd: Omit<Product, "id">) => {
    const product: Product = {
      ...newProd,
      id: `prod_${Date.now()}`,
    };
    const updated = [...products, product];
    setProducts(updated);
    localStorage.setItem("shakpot_admin_products", JSON.stringify(updated));
    showToast(`Plat « ${product.name} » ajouté au menu !`);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    const updated = products.map((p) => (p.id === updatedProd.id ? updatedProd : p));
    setProducts(updated);
    localStorage.setItem("shakpot_admin_products", JSON.stringify(updated));
    showToast(`Plat « ${updatedProd.name} » mis à jour !`);
  };

  const handleDeleteProduct = (productId: string) => {
    const p = products.find((item) => item.id === productId);
    const updated = products.filter((item) => item.id !== productId);
    setProducts(updated);
    localStorage.setItem("shakpot_admin_products", JSON.stringify(updated));
    showToast(`Plat « ${p?.name || ""} » supprimé du menu.`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Toast de confirmation en haut */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Administrative (Sans l'ancienne entrée Catégories) */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-surface border border-border rounded-2xl p-4 space-y-2 sticky top-24 shadow-xs">
            <div className="px-4 pb-4 mb-2 border-b border-border">
              <p className="text-xs uppercase font-extrabold text-muted tracking-wider">
                Menu Administration
              </p>
            </div>
            
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as "dashboard" | "products" | "settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === item.id
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            
            <div className="pt-4 mt-4 border-t border-border">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Zone de contenu principale */}
        <div className="flex-1 space-y-6 min-w-0">
          
          {/* ==================== VUE 1 : TABLEAU DE BORD (STATS) ==================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-surface p-6 rounded-2xl border border-border">
                <h1 className="text-2xl font-black text-foreground tracking-tight">
                  Tableau de bord
                </h1>
                <p className="text-sm text-muted mt-0.5">
                  Vue d'ensemble des activités et données du restaurant SHAKPOT.
                </p>
              </div>

              {/* Cartes d'indicateurs dynamiques */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface p-5 rounded-2xl border border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">
                      Total Plats
                    </p>
                    <p className="text-3xl font-black text-foreground">{products.length}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                      {products.filter((p) => p.is_available).length} en stock
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-surface p-5 rounded-2xl border border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">
                      Catégories
                    </p>
                    <p className="text-3xl font-black text-foreground">{categories.length}</p>
                    <p className="text-[11px] text-muted font-semibold mt-1">
                      Organisées au menu
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-surface p-5 rounded-2xl border border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">
                      Variations
                    </p>
                    <p className="text-3xl font-black text-foreground">{variations.length}</p>
                    <p className="text-[11px] text-muted font-semibold mt-1">
                      Groupes d'options
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                    <Tag className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-surface p-5 rounded-2xl border border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">
                      Promotions
                    </p>
                    <p className="text-3xl font-black text-emerald-600">
                      {products.filter((p) => p.is_promotion).length}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                      Offres actives
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Raccourci vers la gestion */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div>
                  <h3 className="text-lg font-black">
                    Accéder à la gestion complète des Produits
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                    Retrouvez vos 3 nouveaux espaces de gestion : Catégories, Variations et Menu.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab("products");
                    setProductSubTab("menu");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow-md hover:bg-emerald-50 transition-colors shrink-0"
                >
                  Ouvrir le Menu →
                </button>
              </div>
            </div>
          )}

          {/* ==================== VUE 2 : PRODUITS (3 ONGLETS HORIZONTAUX) ==================== */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Barre des 3 Onglets Horizontaux en haut (Catégories / Variations / Menu) */}
              <div className="bg-surface p-2 rounded-2xl border border-border shadow-xs">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  
                  {/* Onglet 1 : Catégories */}
                  <button
                    type="button"
                    onClick={() => setProductSubTab("categories")}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
                      productSubTab === "categories"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "text-muted hover:text-foreground hover:bg-surface-hover"
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Catégories</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                        productSubTab === "categories"
                          ? "bg-white/25 text-white"
                          : "bg-muted/15 text-muted"
                      }`}
                    >
                      {categories.length}
                    </span>
                  </button>

                  {/* Onglet 2 : Variations */}
                  <button
                    type="button"
                    onClick={() => setProductSubTab("variations")}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
                      productSubTab === "variations"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "text-muted hover:text-foreground hover:bg-surface-hover"
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span>Variations</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                        productSubTab === "variations"
                          ? "bg-white/25 text-white"
                          : "bg-muted/15 text-muted"
                      }`}
                    >
                      {variations.length}
                    </span>
                  </button>

                  {/* Onglet 3 : Menu */}
                  <button
                    type="button"
                    onClick={() => setProductSubTab("menu")}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
                      productSubTab === "menu"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "text-muted hover:text-foreground hover:bg-surface-hover"
                    }`}
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Menu</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                        productSubTab === "menu"
                          ? "bg-white/25 text-white"
                          : "bg-muted/15 text-muted"
                      }`}
                    >
                      {products.length}
                    </span>
                  </button>

                </div>
              </div>

              {/* Contenu dynamique selon l'onglet actif (Sans rechargement de page) */}
              {productSubTab === "categories" && (
                <CategoriesTab
                  categories={categories}
                  products={products}
                  onAddCategory={handleAddCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              )}

              {productSubTab === "variations" && (
                <VariationsTab
                  categories={categories}
                  variations={variations}
                  onAddVariation={handleAddVariation}
                  onUpdateVariation={handleUpdateVariation}
                  onDeleteVariation={handleDeleteVariation}
                />
              )}

              {productSubTab === "menu" && (
                <MenuTab
                  categories={categories}
                  products={products}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              )}

            </div>
          )}

          {/* ==================== VUE 3 : PARAMÈTRES ==================== */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-surface p-6 rounded-2xl border border-border">
                <h1 className="text-2xl font-black text-foreground tracking-tight">
                  Paramètres du Restaurant
                </h1>
                <p className="text-sm text-muted mt-0.5">
                  Configuration générale de l'établissement SHAKPOT.
                </p>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-border space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Store className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-foreground">Informations de contact</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-muted block">Nom de l'établissement</span>
                    <span className="font-bold text-foreground">SHAKPOT Fast-Food</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted block">Numéro WhatsApp & Commandes</span>
                    <span className="font-bold text-emerald-600 font-mono">+253 773 77 50 2</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted block">Localisation</span>
                    <span className="font-bold text-foreground">Djibouti-ville</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted block">Devise</span>
                    <span className="font-bold text-foreground">Franc Djiboutien (FDJ)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
