"use client";

import Image from "next/image";
import { Flame, Clock, Star, Sparkles, ShoppingBag, ShieldCheck } from "lucide-react";

export function Hero() {
  const handleScrollToMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const menuElement = document.getElementById("menu");
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", "#menu");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-surface/40 to-background pt-8 md:pt-16 lg:pt-20 pb-16 lg:pb-24">
      {/* Éléments de fond décoratifs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-primary-500/15 via-secondary-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 left-10 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Colonne Gauche : Texte & Call to Actions */}
          <div className="lg:col-span-6 text-center lg:text-left z-10">
            
            {/* Tag d'accroche */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800/60 mb-6 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-ping" />
              <Flame className="w-4 h-4 text-primary-600" />
              <span className="text-xs md:text-sm font-semibold text-primary-700 dark:text-primary-300 tracking-wide uppercase">
                Le N°1 du Fast-Food à Djibouti
              </span>
            </div>

            {/* Titre Principal */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight text-foreground leading-[1.08] mb-8">
              Savourez chaque <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                bouchée royale.
              </span>
            </h1>

            {/* Bouton d'action principal avec scroll direct garanti */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <a 
                href="#menu" 
                onClick={handleScrollToMenu}
                className="group relative inline-flex items-center justify-center px-9 py-4 text-base md:text-lg font-bold text-white bg-primary-600 rounded-full overflow-hidden shadow-xl shadow-primary-600/30 hover:shadow-primary-600/50 hover:bg-primary-700 transition-all duration-300 w-full sm:w-auto transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 mr-2.5 transition-transform group-hover:scale-110" />
                <span>COMMANDER MAINTENANT</span>
              </a>
            </div>

            {/* Reassurance & Avantages */}
            <div className="pt-6 border-t border-border/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-muted">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-600 flex-shrink-0" />
                <span>Livraison en <strong className="text-foreground">~30 min</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Viande <strong className="text-foreground">100% Halal</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Paiement <strong className="text-foreground">D-Money & Cash</strong></span>
              </div>
            </div>

          </div>

          {/* Colonne Droite : Visuel Central Animé façon Dribbble */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-6 lg:py-0">
            
            {/* Halo lumineux avec pulsation d'ambiance */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 md:w-[460px] md:h-[460px] rounded-full bg-gradient-to-tr from-primary-500/25 via-amber-400/20 to-rose-500/10 blur-2xl animate-pulse-glow pointer-events-none" />

            {/* Cercle d'arrière-plan stylisé */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px] rounded-full bg-gradient-to-b from-surface/90 via-surface/40 to-transparent p-1 border border-border/60 shadow-2xl flex items-center justify-center backdrop-blur-sm">
              
              {/* Image principale du Burger avec animation de lévitation */}
              <div className="relative w-[115%] h-[115%] animate-float flex items-center justify-center drop-shadow-2xl">
                <Image
                  src="/images/hero-burger.jpg"
                  alt="Burger Gourmet Shakpot Signature"
                  width={600}
                  height={600}
                  priority
                  className="object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_25px_35px_rgba(225,29,72,0.25)] select-none pointer-events-none rounded-3xl"
                />
              </div>

            </div>

            {/* Badge Flottant 1 : Livraison Express (Haut Gauche) */}
            <div className="absolute -top-2 -left-2 sm:top-4 sm:left-2 md:top-8 md:-left-4 bg-surface/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-border/80 flex items-center gap-3.5 animate-float z-20 hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-primary-500/30">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Express</p>
                <p className="text-sm font-bold text-foreground">Livraison Rapide</p>
                <p className="text-xs text-muted">Sur tout Djibouti</p>
              </div>
            </div>

            {/* Badge Flottant 2 : Note & Qualité (Bas Droite) */}
            <div className="absolute -bottom-4 -right-2 sm:bottom-2 sm:right-2 md:bottom-6 md:-right-4 bg-surface/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-border/80 flex items-center gap-3.5 animate-float-slow z-20 hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-foreground">4.9 / 5</span>
                  <span className="text-xs text-muted">(1.4k+ avis)</span>
                </div>
                <p className="text-xs font-semibold text-primary-600">Double Smash Royal</p>
                <p className="text-xs text-muted">À partir de 1 200 FDJ</p>
              </div>
            </div>

            {/* Badge Flottant 3 : Fraîcheur Garantie (Bas Gauche) */}
            <div className="hidden sm:flex absolute bottom-2 left-6 bg-surface/85 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-border/60 items-center gap-2 animate-float text-xs font-medium text-foreground z-20">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Pain brioché artisanal</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
