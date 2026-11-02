"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomCartBar } from "@/components/cart/BottomCartBar";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  // Sur les pages d'administration, masquer entièrement le premier header public, le footer public et le panier
  if (isAdmin) {
    if (isAdminLogin) {
      return (
        <main className="flex-1 flex flex-col min-h-screen">
          {children}
        </main>
      );
    }
    return <>{children}</>;
  }

  // Sur toutes les pages publiques (accueil, menu, etc.), afficher la structure normale
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
