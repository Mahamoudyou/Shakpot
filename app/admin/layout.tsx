"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ShieldCheck, User, ArrowLeft } from "lucide-react";

export interface AdminUser {
  name: string | null;
  email: string;
  role: "Administrateur" | "Staff";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      // 1. Tenter de récupérer depuis Supabase Auth
      try {
        if (
          process.env.NEXT_PUBLIC_SUPABASE_URL &&
          !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("votre-projet")
        ) {
          const supabase = createClient();
          const { data: { user: sbUser } } = await supabase.auth.getUser();
          if (sbUser && sbUser.email) {
            const role =
              sbUser.user_metadata?.role === "staff" ||
              sbUser.app_metadata?.role === "staff"
                ? "Staff"
                : "Administrateur";
            const name =
              sbUser.user_metadata?.full_name ||
              sbUser.user_metadata?.name ||
              null;
            setCurrentUser({
              name,
              email: sbUser.email,
              role,
            });
            return;
          }
        }
      } catch {
        // Ignorer si Supabase Auth non joignable
      }

      // 2. Récupérer depuis la session d'authentification du projet
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("shakpot_admin_user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.email) {
              setCurrentUser({
                name: parsed.name || null,
                email: parsed.email,
                role: parsed.role === "Staff" ? "Staff" : "Administrateur",
              });
              return;
            }
          } catch {
            // Ignorer si parse error
          }
        }
      }

      // 3. Utilisateur connecté par défaut dans le projet
      setCurrentUser({
        name: null,
        email: "admin@shakpot.dj",
        role: "Administrateur",
      });
    };

    fetchUser();
  }, []);

  // Sur la page de connexion, ne pas afficher l'en-tête administratif secondaire
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Sur le tableau de bord et les autres pages admin, afficher le 2ème header amélioré
  return (
    <div className="min-h-screen flex flex-col bg-surface-hover">
      {/* 2ème header : En-tête administratif amélioré (sans mot 'Admin' et avec identité connectée) */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Shakpot (sans le mot "Admin") */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-rose-700 flex items-center justify-center text-white font-black text-xs shadow-sm shadow-primary-600/30 group-hover:scale-105 transition-transform">
              SP
            </div>
            <span className="text-xl font-black text-foreground tracking-tight group-hover:text-primary-600 transition-colors">
              SHAKPOT
            </span>
          </Link>

          {/* Section Droite : Identité connectée + Boutons d'action */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Bloc compact et moderne d'identité de l'utilisateur connecté */}
            {currentUser && (
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface border border-border shadow-xs">
                {/* Avatar avec icône de rôle */}
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xs border border-primary-500/20 flex-shrink-0">
                  {currentUser.name ? (
                    currentUser.name.charAt(0).toUpperCase()
                  ) : currentUser.role === "Administrateur" ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Nom (si dispo), Email et Rôle */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    {currentUser.name && (
                      <span className="text-xs font-bold text-foreground truncate max-w-[100px] sm:max-w-[150px]">
                        {currentUser.name}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold tracking-wide ${
                        currentUser.role === "Administrateur"
                          ? "bg-primary-500/15 text-primary-700 dark:text-primary-300 border border-primary-500/30"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {currentUser.role === "Administrateur" ? (
                        <ShieldCheck className="w-2.5 h-2.5 flex-shrink-0" />
                      ) : (
                        <User className="w-2.5 h-2.5 flex-shrink-0" />
                      )}
                      <span>{currentUser.role}</span>
                    </span>
                  </div>
                  <span
                    className="text-[11px] text-muted truncate max-w-[110px] sm:max-w-[180px]"
                    title={currentUser.email}
                  >
                    {currentUser.email}
                  </span>
                </div>
              </div>
            )}

            {/* Sélecteur de thème */}
            <ThemeToggle />
            
            {/* Bouton de retour au restaurant */}
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover border border-transparent hover:border-border transition-all"
              title="Retourner au restaurant"
            >
              <ArrowLeft className="w-4 h-4 text-primary-600 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Retour au restaurant</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenu principal admin (sans aucun footer administratif) */}
      <main className="flex-1 flex flex-col p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
