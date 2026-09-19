import Link from "next/link";
import { Phone, MapPin, MessageCircle } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Colonne 1 : Logo & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-primary-600 tracking-tighter">
                SHAKPOT
              </span>
            </Link>
            <p className="text-sm text-muted">
              Le fast-food de référence à Djibouti. Des plats savoureux, généreux et préparés à la commande avec des ingrédients de qualité.
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/" className="hover:text-primary-600 transition-colors">Accueil</Link></li>
              <li><Link href="#menu" className="hover:text-primary-600 transition-colors">Menu</Link></li>
              <li><Link href="#promotions" className="hover:text-primary-600 transition-colors">Promotions</Link></li>
              <li><Link href="#livraison" className="hover:text-primary-600 transition-colors">Livraison</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-primary-600" />
                <span>[NUMÉRO SHAKPOT]</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 mt-0.5 text-primary-600" />
                <span>[WHATSAPP SHAKPOT]</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-600" />
                <span>[ADRESSE SHAKPOT], Djibouti</span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Réseaux Sociaux */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center text-muted hover:text-primary-600 hover:bg-primary-50 transition-colors" aria-label="Facebook">
                <span className="font-bold">FB</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center text-muted hover:text-primary-600 hover:bg-primary-50 transition-colors" aria-label="Instagram">
                <span className="font-bold">IG</span>
              </a>
              {/* TikTok icon (using a placeholder or text since Lucide doesn't have a standard TikTok icon natively without extending) */}
              <a href="#" className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center text-muted hover:text-primary-600 hover:bg-primary-50 transition-colors" aria-label="TikTok">
                <span className="font-bold text-lg">𝕏</span>
              </a>
            </div>
          </div>

          {/* Colonne 5 : Horaires */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Horaires</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex justify-between"><span>Lundi :</span> <span>10:00 - 23:00</span></li>
              <li className="flex justify-between"><span>Mardi :</span> <span>10:00 - 23:00</span></li>
              <li className="flex justify-between"><span>Mercredi :</span> <span>10:00 - 23:00</span></li>
              <li className="flex justify-between"><span>Jeudi :</span> <span>10:00 - 23:00</span></li>
              <li className="flex justify-between"><span>Vendredi :</span> <span>14:00 - 00:00</span></li>
              <li className="flex justify-between"><span>Samedi :</span> <span>10:00 - 00:00</span></li>
              <li className="flex justify-between"><span>Dimanche :</span> <span>10:00 - 23:00</span></li>
            </ul>
            <p className="text-xs mt-2 italic text-muted/70">[HORAIRES À CONFIRMER]</p>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted text-center md:text-left">
            © {currentYear} SHAKPOT — Tous droits réservés.
          </p>
          <div className="flex gap-4 text-sm text-muted">
            <Link href="#" className="hover:text-primary-600 transition-colors">Mentions légales</Link>
            <Link href="#" className="hover:text-primary-600 transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
