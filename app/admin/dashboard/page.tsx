"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Settings, 
  LogOut, 
  Plus, 
  MoreVertical 
} from "lucide-react";
import { Category, Product } from "@/types";

// Mock data (same as frontend for dashboard display)
const MOCK_CATEGORIES = [
  { id: "1", name: "Burgers", slug: "burgers", display_order: 1 },
  { id: "2", name: "Tacos", slug: "tacos", display_order: 2 },
];

const MOCK_PRODUCTS = [
  { id: "p1", name: "Classic Cheeseburger", price: 1200, category: "Burgers", is_promotion: false },
  { id: "p2", name: "Tacos Maxi Viande", price: 2000, promotion_price: 1800, category: "Tacos", is_promotion: true },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "products", label: "Produits", icon: Package },
    { id: "categories", label: "Catégories", icon: Tags },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* Sidebar Admin */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-surface border border-border rounded-2xl p-4 space-y-2 sticky top-24">
          <div className="px-4 pb-4 mb-4 border-b border-border">
            <p className="text-sm font-bold text-foreground">Menu Administration</p>
          </div>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20"
                    : "text-muted hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="pt-4 mt-4 border-t border-border">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-colors">
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        
        {/* En-tête du contenu */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-2xl border border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground capitalize">
              {sidebarItems.find(i => i.id === activeTab)?.label || activeTab}
            </h1>
            <p className="text-sm text-muted">
              Gérez votre contenu et vos paramètres depuis cette interface.
            </p>
          </div>
          {activeTab !== "dashboard" && activeTab !== "settings" && (
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          )}
        </div>

        {/* Contenu dynamique (Mock) */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <p className="text-sm text-muted font-medium mb-2">Total Produits</p>
              <p className="text-3xl font-bold text-foreground">24</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <p className="text-sm text-muted font-medium mb-2">Catégories</p>
              <p className="text-3xl font-bold text-foreground">8</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <p className="text-sm text-muted font-medium mb-2">Promotions Actives</p>
              <p className="text-3xl font-bold text-primary-600">3</p>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-hover text-muted">
                <tr>
                  <th className="px-6 py-4 font-medium">Nom du plat</th>
                  <th className="px-6 py-4 font-medium">Catégorie</th>
                  <th className="px-6 py-4 font-medium">Prix</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_PRODUCTS.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{product.name}</td>
                    <td className="px-6 py-4 text-muted">{product.category}</td>
                    <td className="px-6 py-4 text-foreground">
                      {product.is_promotion ? (
                        <span className="text-primary-600 font-bold">{product.promotion_price} FDJ</span>
                      ) : (
                        <span>{product.price} FDJ</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.is_promotion ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">En promo</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-50 text-secondary-700">Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted hover:text-foreground">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Disclaimer Maquette */}
        <div className="p-4 bg-secondary-50/50 border border-secondary-200 dark:border-secondary-900 rounded-xl">
          <p className="text-sm text-secondary-700 dark:text-secondary-400 text-center">
            ⚠️ Ceci est une maquette fonctionnelle. Les données affichées sont statiques et ne proviennent pas encore de Supabase.
          </p>
        </div>

      </div>
    </div>
  );
}
