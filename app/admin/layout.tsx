import { ThemeToggle } from "@/components/layout/ThemeToggle";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-hover">
      {/* Admin Header (simplifié) */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary-600 tracking-tighter">
              SHAKPOT <span className="text-muted text-sm font-normal">Admin</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Bouton de retour au site (Mode maquette, on le simule) */}
            <Link 
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Retour au site</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenu principal admin */}
      <main className="flex-1 flex flex-col p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
