"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Settings, Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItemsCount, setIsCartOpen } = useCart();

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Menu", href: "#menu" },
    { name: "Livraison", href: "#livraison" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Temporaire */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary-600 tracking-tighter">
            SHAKPOT
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Bouton Panier avec Badge */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-surface-hover transition-colors text-muted hover:text-foreground flex items-center justify-center"
            aria-label={`Ouvrir le panier (${totalItemsCount} articles)`}
          >
            <ShoppingBag className="w-5 h-5 text-foreground" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
                {totalItemsCount}
              </span>
            )}
          </button>

          <ThemeToggle />
          
          {/* Bouton Paramètres / Admin */}
          <Link
            href="/admin/login"
            className="p-2 rounded-full hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
            aria-label="Accès Administration"
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-muted hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col py-4 px-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-foreground hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
