"use client";

import { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Tag, 
  Pencil, 
  Trash2, 
  SlidersHorizontal, 
  X, 
  Check, 
  AlertCircle,
  ChevronRight,
  Filter
} from "lucide-react";
import { Category, VariationGroup, VariationOption } from "@/types";

interface VariationsTabProps {
  categories: Category[];
  variations: VariationGroup[];
  onAddVariation: (variation: Omit<VariationGroup, "id">) => void;
  onUpdateVariation: (variation: VariationGroup) => void;
  onDeleteVariation: (variationId: string) => void;
}

export function VariationsTab({
  categories,
  variations,
  onAddVariation,
  onUpdateVariation,
  onDeleteVariation,
}: VariationsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // État du modal d'ajout / modification
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariation, setEditingVariation] = useState<VariationGroup | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"single" | "multiple_with_quantity">("multiple_with_quantity");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [optionsList, setOptionsList] = useState<{ name: string; price: number }[]>([
    { name: "", price: 0 },
  ]);
  const [formError, setFormError] = useState("");

  // État du modal de suppression
  const [deletingVariation, setDeletingVariation] = useState<VariationGroup | null>(null);

  // Ouvrir modal d'ajout
  const handleOpenAdd = () => {
    setEditingVariation(null);
    setTitle("");
    setType("multiple_with_quantity");
    setSelectedCategoryIds(categories.length > 0 ? [categories[0].id] : []);
    setOptionsList([
      { name: "", price: 0 },
      { name: "", price: 0 },
    ]);
    setFormError("");
    setIsModalOpen(true);
  };

  // Ouvrir modal de modification
  const handleOpenEdit = (v: VariationGroup) => {
    setEditingVariation(v);
    setTitle(v.title);
    setType(v.type);
    setSelectedCategoryIds(v.categoryIds || []);
    setOptionsList(
      v.options && v.options.length > 0
        ? v.options.map((o) => ({ name: o.name, price: o.price || 0 }))
        : [{ name: "", price: 0 }]
    );
    setFormError("");
    setIsModalOpen(true);
  };

  // Gestion des catégories cochées
  const toggleCategorySelection = (catId: string) => {
    if (selectedCategoryIds.includes(catId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== catId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, catId]);
    }
  };

  // Gestion des options dynamiques
  const handleOptionChange = (
    index: number,
    field: "name" | "price",
    value: string | number
  ) => {
    const updated = [...optionsList];
    if (field === "name") {
      updated[index].name = String(value);
    } else {
      updated[index].price = Number(value) || 0;
    }
    setOptionsList(updated);
  };

  const addOptionField = () => {
    setOptionsList([...optionsList, { name: "", price: 0 }]);
  };

  const removeOptionField = (index: number) => {
    if (optionsList.length <= 1) return;
    setOptionsList(optionsList.filter((_, i) => i !== index));
  };

  // Soumission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Veuillez renseigner le nom de la variante.");
      return;
    }

    const validOptions: VariationOption[] = optionsList
      .filter((opt) => opt.name.trim().length > 0)
      .map((opt, i) => ({
        id: `opt_${Date.now()}_${i}`,
        name: opt.name.trim(),
        price: Number(opt.price) || 0,
      }));

    if (validOptions.length === 0) {
      setFormError("Veuillez ajouter au moins une option valide.");
      return;
    }

    if (editingVariation) {
      onUpdateVariation({
        ...editingVariation,
        title: title.trim(),
        type,
        categoryIds: selectedCategoryIds,
        options: validOptions,
      });
    } else {
      onAddVariation({
        title: title.trim(),
        type,
        categoryIds: selectedCategoryIds,
        options: validOptions,
      });
    }

    setIsModalOpen(false);
  };

  // Filtrage
  const filteredVariations = useMemo(() => {
    return variations.filter((v) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        v.title.toLowerCase().includes(query) ||
        v.options.some((opt) => opt.name.toLowerCase().includes(query));

      const matchesCat =
        selectedCategoryFilter === "all" ||
        (v.categoryIds && v.categoryIds.includes(selectedCategoryFilter));

      return matchesSearch && matchesCat;
    });
  }, [variations, searchQuery, selectedCategoryFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* En-tête (Inspiré de l'Image 1) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-2xl border border-border">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Gestion des Variantes
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Gérez les variantes de vos produits (tailles, options, etc.)
            </p>
          </div>
        </div>

        {/* Bouton d'action vert */}
        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Ajouter une Variante</span>
        </button>
      </div>

      {/* Barre de recherche et filtre de catégorie */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une variante..."
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

        {/* Filtrage par catégorie */}
        <div className="relative w-full sm:w-60">
          <Filter className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des cartes de variantes (Design fidèle à l'Image 1) */}
      <div className="space-y-4">
        {filteredVariations.length > 0 ? (
          filteredVariations.map((variation) => {
            // Catégories associées
            const linkedCats = categories.filter((c) =>
              variation.categoryIds?.includes(c.id)
            );

            return (
              <div
                key={variation.id}
                className="group p-5 rounded-2xl bg-surface border border-border hover:border-emerald-500/40 hover:shadow-md transition-all duration-200 space-y-3.5"
              >
                {/* Ligne du haut : Icône, Titre, Badges de catégorie & Actions */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-wrap">
                    {/* Icône Tag verte dans boîte arrondie (comme Image 1) */}
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Tag className="w-5 h-5" />
                    </div>

                    {/* Titre de la variante */}
                    <h3 className="font-extrabold text-foreground text-base tracking-wide uppercase flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
                      <span>{variation.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted" />
                    </h3>

                    {/* Badges des catégories reliées */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {linkedCats.length > 0 ? (
                        linkedCats.map((cat) => (
                          <span
                            key={cat.id}
                            className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] uppercase tracking-wider"
                          >
                            {cat.name}
                          </span>
                        ))
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md bg-surface-hover border border-border text-muted font-bold text-[11px]">
                          Toutes catégories
                        </span>
                      )}
                      
                      <span className="text-[10px] text-muted ml-1">
                        ({variation.type === "single" ? "Choix unique" : "Choix multiple"})
                      </span>
                    </div>
                  </div>

                  {/* Boutons d'action : Crayon vert et Corbeille rouge (Image 1) */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(variation)}
                      className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 transition-colors flex items-center justify-center shadow-xs"
                      title="Modifier la variante"
                      aria-label={`Modifier ${variation.title}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeletingVariation(variation)}
                      className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-colors flex items-center justify-center shadow-xs"
                      title="Supprimer la variante"
                      aria-label={`Supprimer ${variation.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Pilules d'options (Boutons verts arrondis comme dans l'Image 1) */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {variation.options.map((opt) => (
                    <span
                      key={opt.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/25 text-emerald-800 dark:text-emerald-200 text-xs font-semibold"
                    >
                      <span>{opt.name}</span>
                      {opt.price > 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          (+{opt.price.toLocaleString("fr-FR")} FDJ)
                        </span>
                      )}
                    </span>
                  ))}
                </div>

              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-surface rounded-2xl border border-border border-dashed">
            <SlidersHorizontal className="w-10 h-10 mx-auto text-muted/60 mb-3" />
            <p className="text-sm font-semibold text-foreground">
              Aucune variante trouvée
            </p>
            <p className="text-xs text-muted mt-1">
              {searchQuery || selectedCategoryFilter !== "all"
                ? "Aucune variante ne correspond aux critères de filtre."
                : "Ajoutez des variantes (tailles, sauces, suppléments) à vos produits."}
            </p>
          </div>
        )}
      </div>

      {/* Modal Ajout / Modification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-surface border border-border rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {editingVariation ? "Modifier la variante" : "Ajouter une variante"}
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

              {/* Titre */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Nom du groupe de variante *
                </label>
                <input
                  type="text"
                  placeholder="Ex: EXTRA 1, SAUCES, TAILLES..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-semibold"
                  autoFocus
                />
              </div>

              {/* Type de sélection */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Type de sélection
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("single")}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      type === "single"
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500"
                        : "border-border bg-surface text-muted hover:bg-surface-hover"
                    }`}
                  >
                    Choix unique (ex: Taille)
                  </button>

                  <button
                    type="button"
                    onClick={() => setType("multiple_with_quantity")}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      type === "multiple_with_quantity"
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500"
                        : "border-border bg-surface text-muted hover:bg-surface-hover"
                    }`}
                  >
                    Choix multiple (ex: Sauces, Extras)
                  </button>
                </div>
              </div>

              {/* Catégories applicables */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Catégories concernées
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {categories.map((c) => {
                    const isChecked = selectedCategoryIds.includes(c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleCategorySelection(c.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isChecked
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-surface border-border text-muted hover:text-foreground"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Constructeur d'options */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Options / Valeurs possibles *
                  </label>
                  <button
                    type="button"
                    onClick={addOptionField}
                    className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une option</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {optionsList.map((opt, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ex: Cheddar, Sauce Samouraï..."
                        value={opt.name}
                        onChange={(e) =>
                          handleOptionChange(index, "name", e.target.value)
                        }
                        className="flex-1 px-3 py-2 rounded-xl border border-border bg-surface text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="relative w-28 shrink-0">
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          step="50"
                          value={opt.price}
                          onChange={(e) =>
                            handleOptionChange(index, "price", e.target.value)
                          }
                          className="w-full pr-8 pl-2.5 py-2 rounded-xl border border-border bg-surface text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted font-bold">
                          FDJ
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOptionField(index)}
                        disabled={optionsList.length <= 1}
                        className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
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
                  {editingVariation ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmation de Suppression */}
      {deletingVariation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-surface border border-border rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 mx-auto flex items-center justify-center border border-rose-500/20">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                Supprimer cette variante ?
              </h3>
              <p className="text-xs text-muted">
                Êtes-vous sûr de vouloir supprimer la variante{" "}
                <strong className="text-foreground">
                  « {deletingVariation.title} »
                </strong>{" "}
                ?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingVariation(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-muted hover:text-foreground text-sm font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onDeleteVariation(deletingVariation.id);
                  setDeletingVariation(null);
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
