"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomCartBar } from "@/components/cart/BottomCartBar";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminLogin = pathname === "/admin/login";

  // Sur la page de connexion administrative, masquer le header, le footer et le panier
  if (isAdminLogin) {
    return (
      <main className="flex-1 flex flex-col min-h-screen">
        {children}
      </main>
    );
  }

  // Sur toutes les autres pages (accueil, menu, dashboard, etc.), afficher la structure normale
  return (
    <>
      <Header />
      {children}
      <Footer />
      <BottomCartBar />
      <CartDrawer />
    </>
  );
}
