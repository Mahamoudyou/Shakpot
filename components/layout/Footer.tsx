"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Link as LinkIcon, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { items, totalItemsCount, subtotal, setIsCartOpen } = useCart();

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800 pt-16 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Grille principale en 2 colonnes épurées */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16 items-start">
          
          {/* Colonne Gauche : Identité, Coordonnées & Réseaux */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Logo Badge façon Fast-Food Naan Stop mais aux couleurs Shakpot */}
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-rose-700 border-2 border-white/20 shadow-lg shadow-primary-600/30 flex items-center justify-center text-white font-black text-xs text-center leading-tight tracking-wider uppercase rotate-[-3deg] hover:rotate-0 transition-transform">
                SHAK<br />POT
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  SHAKPOT
                </h3>
                <p className="text-xs text-primary-500 font-bold uppercase tracking-wider">
                  Fast-Food & Grillades • Djibouti
                </p>
              </div>
            </div>

            {/* Informations de contact */}
            <div className="space-y-3.5 text-sm text-neutral-400">
              {/* Adresse */}
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>Djibouti-ville : Centre-Ville, Einguella et Balbala</span>
              </div>

              {/* Téléphones cliquables */}
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <a 
                    href="tel:+25377000000" 
                    className="hover:text-white hover:underline transition-colors font-medium"
                  >
                    77 00 00 00
                  </a>
                  <span>/</span>
                  <a 
                    href="tel:+25377123456" 
                    className="hover:text-white hover:underline transition-colors font-medium"
                  >
                    77 12 34 56
                  </a>
                </div>
              </div>

              {/* Email cliquable */}
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a 
                  href="mailto:contact@shakpot.dj" 
                  className="hover:text-white hover:underline transition-colors font-medium"
                >
                  contact@shakpot.dj
                </a>
              </div>
            </div>

            {/* Réseaux Sociaux (WhatsApp, TikTok, Instagram, Facebook) */}
            <div className="flex items-center gap-3 pt-2">
              
              {/* WhatsApp */}
              <a 
                href="https://wa.me/25377000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.419-.101.824z" />
                </svg>
              </a>

              {/* TikTok */}
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-black hover:text-white hover:border-neutral-700 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.16 1.18 2.09 2.35 2.29.98.17 2.01-.13 2.69-.87.42-.45.69-1.04.72-1.67.04-3.51.01-7.02.01-10.53 0-.74-.01-1.49-.01-2.23z" />
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-rose-400 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-blue-500 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>

            </div>

          </div>

          {/* Colonne Droite : Horaires d'ouverture nets et précis */}
          <div className="md:col-span-5 bg-neutral-900/60 p-6 sm:p-7 rounded-2xl border border-neutral-800/80 backdrop-blur-sm">
            <h4 className="text-lg font-bold text-white mb-5 flex items-center justify-between">
              <span>Heures d&apos;ouverture</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Ouvert actuellement" />
            </h4>
            
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between py-1 border-b border-neutral-800/60 text-neutral-300">
                <span className="font-medium">Lundi</span>
                <span className="font-mono text-neutral-400">10:00 - 00:00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60 text-neutral-300">
                <span className="font-medium">Mardi</span>
                <span className="font-mono text-neutral-400">10:00 - 00:00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60 text-neutral-300">
                <span className="font-medium">Mercredi</span>
                <span className="font-mono text-neutral-400">10:00 - 00:00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60 text-neutral-300">
                <span className="font-medium">Jeudi</span>
                <span className="font-mono text-neutral-400">10:00 - 00:00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60 text-primary-400 font-semibold">
                <span>Vendredi</span>
                <span className="font-mono">17:00 - 00:00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60 text-neutral-300">
                <span className="font-medium">Samedi</span>
                <span className="font-mono text-neutral-400">10:00 - 00:00</span>
              </div>
              <div className="flex justify-between py-1 text-neutral-300">
                <span className="font-medium">Dimanche</span>
                <span className="font-mono text-neutral-400">10:00 - 00:00</span>
              </div>
            </div>
          </div>

        </div>

        {/* Section Panier en bas de page, à proximité immédiate de "Powered by Netlify" */}
        <div id="panier" className="mb-12 p-6 sm:p-7 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-500/30 text-primary-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Votre Panier</span>
                  <span className="text-xs bg-primary-600 text-white font-bold px-2 py-0.5 rounded-full">
                    {totalItemsCount} {totalItemsCount > 1 ? "articles" : "article"}
                  </span>
                </h4>
                <p className="text-xs text-neutral-400">
                  {totalItemsCount > 0
                    ? "Vos plats sélectionnés sont prêts pour la commande"
                    : "Votre panier est vide. Choisissez vos plats préférés sur notre menu."}
                </p>
              </div>
            </div>

            {items.length > 0 && (
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-xs text-neutral-400">Total estimé</p>
                  <p className="text-xl font-black text-primary-400">
                    {subtotal.toLocaleString("fr-FR")} FDJ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="py-3 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-xl shadow-primary-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Passer la commande</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Aperçu détaillé des articles sélectionnés */}
          {items.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setIsCartOpen(true)}
                  className="bg-neutral-950/70 border border-neutral-800 hover:border-primary-500/40 rounded-2xl p-3.5 flex items-start gap-3 cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden relative shrink-0">
                    {item.product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🍔</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-white truncate group-hover:text-primary-400 transition-colors">
                      {item.product.name}
                    </p>
                    <p className="text-primary-400 font-bold mt-0.5">
                      {item.quantity} × {item.unitPrice.toLocaleString("fr-FR")} FDJ
                    </p>
                    {item.selectedOptions.length > 0 && (
                      <p className="text-neutral-400 text-[11px] truncate mt-1">
                        {item.selectedOptions
                          .map((o) => `${o.name}${o.quantity > 1 ? ` (x${o.quantity})` : ""}`)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-between text-xs text-neutral-400 bg-neutral-950/50 p-3.5 rounded-2xl border border-neutral-800/60">
              <span>Aucun produit dans le panier pour l'instant.</span>
              <a
                href="#menu"
                className="text-primary-400 hover:text-primary-300 font-bold transition-colors"
              >
                Découvrir nos plats →
              </a>
            </div>
          )}
        </div>

        {/* Pied de page inférieur (Centré, net, minimaliste avec mention Powered by Netlify) */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <Link 
              href="#" 
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5 text-primary-500" />
              <span>Conditions d&apos;utilisation</span>
            </Link>
            
            <span>•</span>

            {/* Mention Powered by Netlify */}
            <span className="inline-flex items-center gap-1.5 text-neutral-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#00C7B7]" />
              <span>Powered by Netlify</span>
            </span>
          </div>
          
          <p className="text-xs text-neutral-500">
            All Rights Reserved © {currentYear} — <strong className="text-neutral-400 font-medium">SHAKPOT</strong>
          </p>
        </div>

      </div>
    </footer>
  );
}
