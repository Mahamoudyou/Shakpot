"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Utensils,
  Bike,
  Package,
  Phone,
  User,
  MapPin,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Wallet,
  Check,
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { OrderMode } from "@/types";
import { DELIVERY_ZONES } from "@/data/deliveryZones";

// Moyens de paiement locaux à Djibouti
const PAYMENT_METHODS = [
  { id: "waafi", name: "Waafi", desc: "Telesom / Waafi Mobile", badge: "WAAFI" },
  { id: "dmoney", name: "D-Money", desc: "Djibouti Telecom", badge: "D-MONEY" },
  { id: "exipay", name: "Exipay", desc: "Paiement sécurisé", badge: "EXIPAY" },
  { id: "sabapay", name: "SabaPay", desc: "Banque Saba Islamique", badge: "SABA" },
  { id: "kakpay", name: "KakPay", desc: "Portefeuille mobile", badge: "KAKPAY" },
  { id: "cacpay", name: "CacPay", desc: "CAC Bank Mobile", badge: "CACPAY" },
];

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    totalItemsCount,
  } = useCart();

  // Référence pour le conteneur de défilement afin de repositionner en haut à chaque étape
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Étapes de la commande : cart -> mode -> summary
  const [step, setStep] = useState<"cart" | "mode" | "summary">("cart");

  // Mode de commande sélectionné
  const [orderMode, setOrderMode] = useState<OrderMode>("livraison");

  // Informations client
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [deliveryZoneId, setDeliveryZoneId] = useState(DELIVERY_ZONES[0].id);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickupTime, setPickupTime] = useState("Au plus vite (~15-20 min)");
  const [instructions, setInstructions] = useState("");

  // Mode de paiement sélectionné (Waafi par défaut)
  const [selectedPayment, setSelectedPayment] = useState("waafi");

  // Gestion des erreurs de validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);

  // Repositionner automatiquement le défilement tout en haut à chaque changement d'étape
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [step]);

  // Bloquer le scroll de la page lorsque le panier est ouvert
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "instant" });
      }
    } else {
      document.body.style.overflow = "unset";
      setStep("cart");
      setIsOrderSubmitted(false);
      setFormErrors({});
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  // Calcul des frais de livraison selon le mode
  const selectedZone = DELIVERY_ZONES.find((z) => z.id === deliveryZoneId) || DELIVERY_ZONES[0];
  const deliveryFee = orderMode === "livraison" ? selectedZone.price : 0;
  const finalTotal = subtotal + deliveryFee;

  // Navigation contrôlée avec réinitialisation du défilement
  const navigateToStep = (newStep: "cart" | "mode" | "summary") => {
    setStep(newStep);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  // Validation du formulaire de mode de commande
  const validateModeForm = () => {
    const errors: Record<string, string> = {};

    if (!customerPhone.trim()) {
      errors.phone = "Le numéro de téléphone est obligatoire";
    } else if (customerPhone.trim().length < 6) {
      errors.phone = "Veuillez entrer un numéro de téléphone valide";
    }

    if (orderMode === "sur_place") {
      if (!tableNumber.trim()) {
        errors.tableNumber = "Veuillez indiquer votre numéro de table";
      }
    } else if (orderMode === "livraison") {
      if (!deliveryAddress.trim()) {
        errors.deliveryAddress = "Veuillez préciser votre adresse ou repère de livraison";
      }
    } else if (orderMode === "en_route") {
      if (!pickupTime.trim()) {
        errors.pickupTime = "Veuillez choisir une heure de récupération";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Passer à l'étape récapitulatif
  const handleProceedToSummary = () => {
    if (validateModeForm()) {
      navigateToStep("summary");
    }
  };

  // Confirmation finale et envoi de la commande par WhatsApp
  const handleConfirmAndSendWhatsApp = () => {
    if (items.length === 0) return;

    const paymentObj = PAYMENT_METHODS.find((p) => p.id === selectedPayment) || PAYMENT_METHODS[0];

    let message = "Bonjour SHAKPOT Djibouti ! 🍔🍟\n\n";
    message += "📋 *NOUVELLE COMMANDE*\n";
    message += "----------------------------\n";

    if (orderMode === "sur_place") {
      message += `🍽️ *Mode : SUR PLACE*\n`;
      message += `🪑 *Table N° :* ${tableNumber.trim()}\n`;
    } else if (orderMode === "livraison") {
      message += `🛵 *Mode : LIVRAISON*\n`;
      message += `📍 *Zone :* ${selectedZone.name} (+${deliveryFee} FDJ)\n`;
      message += `🏠 *Adresse :* ${deliveryAddress.trim()}\n`;
    } else {
      message += `🥡 *Mode : EN ROUTE (À emporter)*\n`;
      message += `⏰ *Heure de retrait :* ${pickupTime}\n`;
    }

    message += `📞 *Téléphone :* ${customerPhone.trim()}\n`;
    if (customerName.trim()) {
      message += `👤 *Client :* ${customerName.trim()}\n`;
    }
    message += `💳 *Moyen de paiement :* *${paymentObj.name}*\n`;
    if (instructions.trim()) {
      message += `📝 *Instructions spéciales :* ${instructions.trim()}\n`;
    }

    message += "\n🍽️ *DÉTAIL DES ARTICLES* :\n";
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}* x${item.quantity}\n`;
      message += `   📍 Préparation : ${item.branch.name}\n`;
      if (item.selectedOptions.length > 0) {
        const optionsStr = item.selectedOptions
          .map((opt) => `${opt.name}${opt.quantity > 1 ? ` (x${opt.quantity})` : ""}`)
          .join(", ");
        message += `   ➕ Options : ${optionsStr}\n`;
      }
      message += `   💰 Prix : ${item.totalPrice.toLocaleString("fr-FR")} FDJ\n\n`;
    });

    message += "----------------------------\n";
    message += `Sous-total articles : ${subtotal.toLocaleString("fr-FR")} FDJ\n`;
    if (orderMode === "livraison") {
      message += `Frais de livraison (${selectedZone.name}) : ${deliveryFee.toLocaleString("fr-FR")} FDJ\n`;
    }
    message += `💰 *TOTAL FINAL : ${finalTotal.toLocaleString("fr-FR")} FDJ*\n\n`;
    message += "Merci de me confirmer la prise en charge de ma commande !";

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/25377000000?text=${encoded}`, "_blank");

    setIsOrderSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Fond sombre */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Panneau latéral coulissant */}
      <div className="relative w-full max-w-lg bg-surface text-foreground shadow-2xl border-l border-border h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* ===================== EN-TÊTE DU TIROIR ===================== */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-surface-hover/30 shrink-0">
          <div className="flex items-center gap-3">
            {step !== "cart" && !isOrderSubmitted && (
              <button
                type="button"
                onClick={() => navigateToStep(step === "summary" ? "mode" : "cart")}
                className="p-1.5 rounded-xl hover:bg-surface-hover text-muted hover:text-foreground transition-colors mr-1"
                aria-label="Retour"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center font-bold shrink-0">
              {step === "cart" ? (
                <ShoppingBag className="w-5 h-5" />
              ) : step === "mode" ? (
                <Utensils className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {step === "cart"
                  ? "Mon Panier"
                  : step === "mode"
                  ? "Mode de commande"
                  : "Récapitulatif"}
              </h2>
              <p className="text-xs text-muted">
                {step === "cart"
                  ? `${totalItemsCount} ${totalItemsCount > 1 ? "articles" : "article"}`
                  : step === "mode"
                  ? "Choisissez comment recevoir votre commande"
                  : "Vérifiez vos choix et moyen de paiement"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === "cart" && items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-muted hover:text-red-500 transition-colors px-2 py-1"
                title="Vider le panier"
              >
                Vider
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===================== CONTENU PRINCIPAL (DÉFILEMENT GÉRÉ AVEC REF) ===================== */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
        >
          
          {/* ---------------- ÉTAPE 1 : LISTE DES ARTICLES ---------------- */}
          {step === "cart" && (
            <>
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center shadow-inner">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Votre panier est vide
                    </h3>
                    <p className="text-sm text-muted mt-1 max-w-xs">
                      Ajoutez de savoureux burgers, tacos et boissons depuis notre menu.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      const menuEl = document.getElementById("menu");
                      if (menuEl) menuEl.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-md transition-all"
                  >
                    <span>Découvrir le menu</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface-hover/50 border border-border rounded-2xl p-3.5 flex flex-col gap-3 transition-all hover:border-primary-500/30"
                  >
                    <div className="flex items-start gap-3">
                      {/* Image du Produit */}
                      <div className="relative w-16 h-16 rounded-xl bg-muted/20 overflow-hidden shrink-0 border border-border">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🍔
                          </div>
                        )}
                      </div>

                      {/* Infos Produit */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-foreground text-sm truncate">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-muted hover:text-red-500 transition-colors p-1"
                            aria-label="Supprimer l'article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-[11px] text-primary-600 font-medium">
                          📍 {item.branch.name}
                        </p>

                        <p className="text-xs font-bold text-foreground mt-1">
                          {item.unitPrice.toLocaleString("fr-FR")} FDJ
                        </p>
                      </div>
                    </div>

                    {/* Options sélectionnées (sans prix individuels) */}
                    {item.selectedOptions.length > 0 && (
                      <div className="bg-surface rounded-xl p-2.5 border border-border/60 text-[11px] space-y-1">
                        <div className="flex flex-wrap gap-1.5">
                          {item.selectedOptions.map((opt, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 bg-surface-hover px-2 py-0.5 rounded-md border border-border text-foreground"
                            >
                              <span>{opt.name}</span>
                              {opt.quantity > 1 && (
                                <span className="font-bold text-primary-600">
                                  x{opt.quantity}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sélecteur de Quantité & Sous-total */}
                    <div className="flex items-center justify-between pt-1 border-t border-border/40">
                      <div className="flex items-center gap-2 bg-surface border border-border rounded-full p-1 shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-primary-600">
                          {item.totalPrice.toLocaleString("fr-FR")} FDJ
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* ---------------- ÉTAPE 2 : CHOIX DU MODE & FORMULAIRE ---------------- */}
          {step === "mode" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Sélecteur des 3 modes */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">
                  Choisissez votre mode de commande :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  
                  {/* Option 1 : Sur place */}
                  <button
                    type="button"
                    onClick={() => {
                      setOrderMode("sur_place");
                      setFormErrors({});
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      orderMode === "sur_place"
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 font-bold shadow-sm ring-1 ring-primary-500"
                        : "border-border bg-surface hover:bg-surface-hover text-muted hover:text-foreground"
                    }`}
                  >
                    <Utensils className="w-5 h-5" />
                    <span className="text-xs sm:text-sm">Sur place</span>
                  </button>

                  {/* Option 2 : Livraison */}
                  <button
                    type="button"
                    onClick={() => {
                      setOrderMode("livraison");
                      setFormErrors({});
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      orderMode === "livraison"
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 font-bold shadow-sm ring-1 ring-primary-500"
                        : "border-border bg-surface hover:bg-surface-hover text-muted hover:text-foreground"
                    }`}
                  >
                    <Bike className="w-5 h-5" />
                    <span className="text-xs sm:text-sm">Livraison</span>
                  </button>

                  {/* Option 3 : En route (À emporter) */}
                  <button
                    type="button"
                    onClick={() => {
                      setOrderMode("en_route");
                      setFormErrors({});
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      orderMode === "en_route"
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 font-bold shadow-sm ring-1 ring-primary-500"
                        : "border-border bg-surface hover:bg-surface-hover text-muted hover:text-foreground"
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    <span className="text-xs sm:text-sm">En route</span>
                  </button>

                </div>
              </div>

              {/* Formulaire dynamique selon le mode */}
              <div className="bg-surface-hover/40 border border-border rounded-2xl p-4 sm:p-5 space-y-4">
                
                {/* 1. Formulaire SUR PLACE */}
                {orderMode === "sur_place" && (
                  <>
                    <div className="flex items-center gap-2 pb-2 border-b border-border text-primary-600 font-bold text-sm">
                      <Utensils className="w-4 h-4" />
                      <span>Commande à table au restaurant</span>
                    </div>

                    {/* Nom du client */}
                    <div>
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                        <User className="w-3.5 h-3.5 text-muted" />
                        <span>Votre nom</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Mohamed"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    {/* Numéro de téléphone */}
                    <div>
                      <label className="text-xs font-semibold text-foreground flex items-center justify-between gap-1.5 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-muted" />
                          <span>Numéro de téléphone</span>
                        </span>
                        <span className="text-[10px] text-red-500 font-bold">*obligatoire</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Ex: 77 12 34 56"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: "" }));
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          formErrors.phone ? "border-red-500 ring-1 ring-red-500" : "border-border"
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Numéro de table */}
                    <div>
                      <label className="text-xs font-semibold text-foreground flex items-center justify-between gap-1.5 mb-1.5">
                        <span>Numéro de table</span>
                        <span className="text-[10px] text-red-500 font-bold">*obligatoire</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Table 4"
                        value={tableNumber}
                        onChange={(e) => {
                          setTableNumber(e.target.value);
                          if (formErrors.tableNumber) setFormErrors((prev) => ({ ...prev, tableNumber: "" }));
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          formErrors.tableNumber ? "border-red-500 ring-1 ring-red-500" : "border-border"
                        }`}
                      />
                      {formErrors.tableNumber && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.tableNumber}</span>
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* 2. Formulaire LIVRAISON */}
                {orderMode === "livraison" && (
                  <>
                    <div className="flex items-center gap-2 pb-2 border-b border-border text-primary-600 font-bold text-sm">
                      <Bike className="w-4 h-4" />
                      <span>Livraison à domicile ou au bureau</span>
                    </div>

                    {/* Nom (facultatif) */}
                    <div>
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                        <User className="w-3.5 h-3.5 text-muted" />
                        <span>Votre nom (facultatif)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Ahmed"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    {/* Numéro de téléphone (obligatoire) */}
                    <div>
                      <label className="text-xs font-semibold text-foreground flex items-center justify-between gap-1.5 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-muted" />
                          <span>Numéro de téléphone</span>
                        </span>
                        <span className="text-[10px] text-red-500 font-bold">*obligatoire</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Ex: 77 00 00 00"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: "" }));
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          formErrors.phone ? "border-red-500 ring-1 ring-red-500" : "border-border"
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Zone de livraison */}
                    <div>
                      <label className="text-xs font-semibold text-foreground flex items-center justify-between gap-1.5 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary-600" />
                          <span>Zone de livraison desservie</span>
                        </span>
                        <span className="text-[11px] text-primary-600 font-bold">
                          +{selectedZone.price} FDJ
                        </span>
                      </label>
                      <select
                        value={deliveryZoneId}
                        onChange={(e) => setDeliveryZoneId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                      >
                        {DELIVERY_ZONES.map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name} — {zone.price} FDJ ({zone.estimatedTime})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Adresse de livraison précise */}
                    <div>
                      <label className="text-xs font-semibold text-foreground flex items-center justify-between gap-1.5 mb-1.5">
                        <span>Adresse ou repère précis</span>
                        <span className="text-[10px] text-red-500 font-bold">*obligatoire</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Précisez l'avenue, le quartier, le bâtiment ou un repère (ex: Avenue 13, face à la pharmacie)"
                        value={deliveryAddress}
                        onChange={(e) => {
                          setDeliveryAddress(e.target.value);
                          if (formErrors.deliveryAddress) setFormErrors((prev) => ({ ...prev, deliveryAddress: "" }));
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
                          formErrors.deliveryAddress ? "border-red-500 ring-1 ring-red-500" : "border-border"
                        }`}
                      />
                      {formErrors.deliveryAddress && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.deliveryAddress}</span>
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* 3. Formulaire EN ROUTE (À emporter) */}
                {orderMode === "en_route" && (
                  <>
                    <div className="flex items-center gap-2 pb-2 border-b border-border text-primary-600 font-bold text-sm">
                      <Package className="w-4 h-4" />
                      <span>Commande à emporter récupérée par vos soins</span>
                    </div>

                    {/* Nom (facultatif) */}
                    <div>
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                        <User className="w-3.5 h-3.5 text-muted" />
                        <span>Votre nom (facultatif)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Youssouf"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    {/* Numéro de téléphone (obligatoire) */}
                    <div>
                      <label className="text-xs font-semibold text-foreground flex items-center justify-between gap-1.5 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-muted" />
                          <span>Numéro de téléphone</span>
                        </span>
                        <span className="text-[10px] text-red-500 font-bold">*obligatoire</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Ex: 77 88 99 00"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: "" }));
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          formErrors.phone ? "border-red-500 ring-1 ring-red-500" : "border-border"
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Heure de récupération souhaitée */}
                    <div>
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted" />
                        <span>Heure de récupération souhaitée</span>
                      </label>
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                      >
                        <option value="Au plus vite (~15-20 min)">Au plus vite (~15-20 min)</option>
                        <option value="Dans 30 minutes">Dans 30 minutes</option>
                        <option value="Dans 45 minutes">Dans 45 minutes</option>
                        <option value="Dans 1 heure">Dans 1 heure</option>
                        <option value="Heure spécifique (préciser en note)">Heure spécifique (préciser en note)</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Instructions pour le restaurant */}
                <div className="pt-2 border-t border-border/60">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                    <FileText className="w-3.5 h-3.5 text-muted" />
                    <span>Instructions pour le restaurant (facultatif)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Préférences alimentaires, sans piment, allergies, sauces à part..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

              </div>

            </div>
          )}

          {/* ---------------- ÉTAPE 3 : RÉCAPITULATIF, MODE DE PAIEMENT & CONFIRMATION ---------------- */}
          {step === "summary" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Carte Récapitulative du Mode */}
              <div className="bg-primary-50/70 dark:bg-primary-950/40 border border-primary-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2.5 text-primary-600 font-bold text-sm">
                  {orderMode === "sur_place" ? (
                    <Utensils className="w-4 h-4" />
                  ) : orderMode === "livraison" ? (
                    <Bike className="w-4 h-4" />
                  ) : (
                    <Package className="w-4 h-4" />
                  )}
                  <span>
                    {orderMode === "sur_place"
                      ? "Commande Sur place"
                      : orderMode === "livraison"
                      ? "Commande en Livraison"
                      : "Commande En route (À emporter)"}
                  </span>
                </div>

                <div className="mt-2.5 space-y-1 text-xs text-foreground/90">
                  {orderMode === "sur_place" && (
                    <p>
                      <strong>Table :</strong> {tableNumber}
                    </p>
                  )}
                  {orderMode === "livraison" && (
                    <>
                      <p>
                        <strong>Zone :</strong> {selectedZone.name} (+{deliveryFee} FDJ)
                      </p>
                      <p>
                        <strong>Adresse :</strong> {deliveryAddress}
                      </p>
                    </>
                  )}
                  {orderMode === "en_route" && (
                    <p>
                      <strong>Heure de retrait :</strong> {pickupTime}
                    </p>
                  )}
                  <p>
                    <strong>Téléphone :</strong> {customerPhone}
                  </p>
                  {customerName && (
                    <p>
                      <strong>Nom :</strong> {customerName}
                    </p>
                  )}
                  {instructions && (
                    <p className="text-muted pt-1 border-t border-border/40 mt-1">
                      <em>Note :</em> {instructions}
                    </p>
                  )}
                </div>
              </div>

              {/* Liste des Plats Commandés */}
              <div className="bg-surface-hover/40 border border-border rounded-2xl p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  Plats commandés ({totalItemsCount}) :
                </p>
                <div className="divide-y divide-border/60">
                  {items.map((item) => (
                    <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-foreground">
                          {item.quantity} × {item.product.name}
                        </p>
                        {item.selectedOptions.length > 0 && (
                          <p className="text-muted text-[11px] truncate">
                            {item.selectedOptions
                              .map((o) => `${o.name}${o.quantity > 1 ? ` (x${o.quantity})` : ""}`)
                              .join(", ")}
                          </p>
                        )}
                        <p className="text-primary-600 text-[10px]">📍 {item.branch.name}</p>
                      </div>
                      <span className="font-bold text-foreground shrink-0">
                        {item.totalPrice.toLocaleString("fr-FR")} FDJ
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ===================== SECTION MODE DE PAIEMENT ===================== */}
              <div className="bg-surface-hover/40 border border-border rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-primary-600" />
                    <span>Mode de paiement</span>
                  </label>
                  <span className="text-xs font-bold text-primary-600">
                    {PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.name}
                  </span>
                </div>

                <p className="text-[11px] text-muted">
                  Sélectionnez le moyen de paiement local que vous utiliserez :
                </p>

                {/* Grille responsive : 2 colonnes de carrés cliquables */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedPayment === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[82px] relative cursor-pointer group ${
                          isSelected
                            ? "border-primary-600 bg-primary-50/80 dark:bg-primary-950/50 shadow-md ring-2 ring-primary-500/20 text-primary-600"
                            : "border-border bg-surface hover:bg-surface-hover hover:border-primary-500/40 text-foreground"
                        }`}
                      >
                        {/* En-tête du carré avec badge et coche de sélection */}
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-primary-600 text-white"
                              : "bg-surface-hover border border-border text-muted"
                          }`}>
                            {method.badge}
                          </span>

                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                            isSelected
                              ? "bg-primary-600 border-primary-600 text-white"
                              : "border-border bg-surface group-hover:border-primary-400"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Nom du moyen de paiement */}
                        <div className="mt-2">
                          <p className={`font-black text-sm sm:text-base leading-tight ${
                            isSelected ? "text-primary-600" : "text-foreground"
                          }`}>
                            {method.name}
                          </p>
                          <p className="text-[10px] text-muted truncate mt-0.5">
                            {method.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Note explicative : aucune transaction automatique simulée */}
                <p className="text-[11px] text-muted pt-1">
                  ℹ️ Le règlement s'effectuera via votre application mobile habituelle lors de la livraison ou au comptoir.
                </p>
              </div>

              {/* Message de succès après confirmation */}
              {isOrderSubmitted && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm space-y-2 animate-in zoom-in-95">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Commande transmise vers WhatsApp !</span>
                  </div>
                  <p className="text-xs text-muted">
                    L'équipe SHAKPOT va valider votre commande dans les plus brefs délais.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      setIsCartOpen(false);
                    }}
                    className="w-full mt-2 py-2 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                  >
                    Vider le panier et terminer
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* ===================== PIED DU TIROIR ===================== */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-border bg-surface-hover/50 space-y-3 shrink-0">
            
            {/* Décomposition Financière */}
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-muted">
                <span>Sous-total des produits</span>
                <span className="font-semibold text-foreground">
                  {subtotal.toLocaleString("fr-FR")} FDJ
                </span>
              </div>

              {/* Affichage des frais de livraison si mode Livraison */}
              {step !== "cart" && orderMode === "livraison" && (
                <div className="flex justify-between text-muted">
                  <span>Frais de livraison ({selectedZone.name})</span>
                  <span className="font-semibold text-primary-600">
                    +{deliveryFee.toLocaleString("fr-FR")} FDJ
                  </span>
                </div>
              )}

              {/* Total final */}
              <div className="flex justify-between text-base font-black text-foreground pt-2 border-t border-border">
                <span>Total à régler</span>
                <span className="text-xl text-primary-600">
                  {(step === "cart" ? subtotal : finalTotal).toLocaleString("fr-FR")} FDJ
                </span>
              </div>
            </div>

            {/* Boutons d'action selon l'étape */}
            {step === "cart" && (
              <button
                type="button"
                onClick={() => navigateToStep("mode")}
                className="w-full py-3.5 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-primary-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>PASSER LA COMMANDE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === "mode" && (
              <button
                type="button"
                onClick={handleProceedToSummary}
                className="w-full py-3.5 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-primary-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>VOIR LE RÉCAPITULATIF</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === "summary" && !isOrderSubmitted && (
              <button
                type="button"
                onClick={handleConfirmAndSendWhatsApp}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>CONFIRMER SUR WHATSAPP</span>
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
