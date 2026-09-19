"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulation d'une requête de connexion Supabase (Mock)
    setTimeout(() => {
      setIsLoading(false);
      // Fausse validation : accepte tout ce qui n'est pas vide pour l'instant
      if (email && password) {
        router.push("/admin/dashboard");
      } else {
        setError("Veuillez remplir tous les champs.");
      }
    }, 1000);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
        
        {/* En-tête de la carte */}
        <div className="p-8 text-center bg-primary-50 dark:bg-primary-900/10 border-b border-border">
          <div className="w-16 h-16 bg-white dark:bg-surface rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-border">
            <Lock className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Accès Restreint</h1>
          <p className="text-sm text-muted mt-2">
            Connectez-vous pour accéder à l'administration de SHAKPOT.
          </p>
        </div>

        {/* Formulaire */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Adresse e-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-2 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                  placeholder="admin@shakpot.dj"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Mot de passe</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-2 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs text-muted/70 italic">
                Mode maquette : la connexion réelle avec Supabase Auth est désactivée.
                Entrez n'importe quel email/mot de passe pour continuer.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
