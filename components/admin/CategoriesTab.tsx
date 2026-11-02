"use client";

import { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  ArrowUpDown, 
  Pencil, 
  Trash2, 
  FolderTree, 
  X, 
  Check, 
  AlertCircle,
  Layers
} from "lucide-react";
import { Category, Product } from "@/types";

interface CategoriesTabProps {
  categories: Category[];
  products: Product[];
  onAddCategory: (category: Omit<Category, "id">) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export function CategoriesTab({
  categories,
  products,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoriesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // État du modal d'ajout / modification
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [formError, setFormError] = useState("");

  // État du modal de confirmation de suppression
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Ouvrir modal d'ajout
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDisplayOrder(categories.length + 1);
    setFormError("");
    setIsModalOpen(true);
  };

  // Ouvrir modal de modification
  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDisplayOrder(cat.display_order);
    setFormError("");
    setIsModalOpen(true);
  };

  // Mise à jour automatique du slug lors de la saisie du nom
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const generatedSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Le nom de la catégorie est obligatoire.");
      return;
    }
    const finalSlug = slug.trim() || name.toLowerCase().replace(/\s+/g, "-");

    if (editingCategory) {
      onUpdateCategory({
        ...editingCategory,
        name: name.trim(),
        slug: finalSlug,
        display_order: Number(displayOrder) || 1,
      });
    } else {
      onAddCategory({
        name: name.trim(),
        slug: finalSlug,
        display_order: Number(displayOrder) || 1,
      });
    }

    setIsModalOpen(false);
  };

  // Filtrage et tri
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        const query = searchQuery.toLowerCase();
        return (
          cat.name.toLowerCase().includes(query) ||
          cat.slug.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a.display_order - b.display_order;
        } else {
          return b.display_order - a.display_order;
        }
      });
  }, [categories, searchQuery, sortOrder]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* En-tête de la section (Inspiré de l'Image 2) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-2xl border border-border">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Catégorie
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Gérez les catégories de votre menu
            </p>
          </div>
        </div>

        {/* Bouton d'action principal vert */}
        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nouvelle catégorie</span>
        </button>
      </div>

      {/* Barre de recherche et de tri (Inspirée de l'Image 2) */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
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

        {/* Bouton de tri */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-hover text-foreground text-sm font-semibold transition-colors"
        >
          <ArrowUpDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{sortOrder === "asc" ? "Croissant" : "Décroissant"}</span>
        </button>
      </div>

      {/* Liste des catégories (Design inspiré de l'Image 2) */}
      <div className="space-y-3">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => {
            const productCount = products.filter(
              (p) => p.category_id === category.id
            ).length;

            return (
              <div
                key={category.id}
                className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-emerald-500/40 hover:shadow-md transition-all duration-200"
              >
                {/* Numéro et Nom */}
                <div className="flex items-center gap-4 min-w-0">
                  {/* Badge vert avec numéro d'ordre */}
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                    {category.display_order}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-extrabold text-foreground text-sm sm:text-base uppercase tracking-wide truncate group-hover:text-emerald-600 transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted">
                      <span>/{category.slug}</span>
                      <span>•</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {productCount} {productCount > 1 ? "produits" : "produit"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action (crayon vert & corbeille rouge comme dans l'Image 2) */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(category)}
                    className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 transition-colors flex items-center justify-center shadow-xs"
                    title="Modifier la catégorie"
                    aria-label={`Modifier ${category.name}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeletingCategory(category)}
                    className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-colors flex items-center justify-center shadow-xs"
                    title="Supprimer la catégorie"
                    aria-label={`Supprimer ${category.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-surface rounded-2xl border border-border border-dashed">
            <FolderTree className="w-10 h-10 mx-auto text-muted/60 mb-3" />
            <p className="text-sm font-semibold text-foreground">
              Aucune catégorie trouvée
            </p>
            <p className="text-xs text-muted mt-1">
              {searchQuery
                ? `Aucun résultat pour "${searchQuery}"`
                : "Commencez par créer une catégorie pour votre menu."}
            </p>
          </div>
        )}
      </div>

      {/* Modal Ajout / Modification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Nom */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Burgers, Tacos, Boissons..."
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Identifiant URL (Slug)
                </label>
                <input
                  type="text"
                  placeholder="ex: burgers"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                />
              </div>

              {/* Ordre d'affichage */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  min="1"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Boutons d'action */}
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition-colors"
                >
                  {editingCategory ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmation de Suppression */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-surface border border-border rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 mx-auto flex items-center justify-center border border-rose-500/20">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                Supprimer cette catégorie ?
              </h3>
              <p className="text-xs text-muted">
                Êtes-vous sûr de vouloir supprimer la catégorie{" "}
                <strong className="text-foreground">
                  « {deletingCategory.name} »
                </strong>{" "}
                ?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingCategory(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-muted hover:text-foreground text-sm font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onDeleteCategory(deletingCategory.id);
                  setDeletingCategory(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md shadow-rose-600/20 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
