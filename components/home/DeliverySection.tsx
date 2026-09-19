import { PhoneCall } from "lucide-react";

export function DeliverySection() {
  // Numéro de téléphone temporaire (à configurer via l'administration plus tard)
  const deliveryPhone = "[NUMÉRO SHAKPOT]";

  return (
    <section id="livraison" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center">
          
          {/* Illustration */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex justify-center items-center bg-primary-50 dark:bg-primary-900/10">
            <div className="text-[120px] md:text-[150px] leading-none animate-pulse">
              🛵
            </div>
          </div>

          {/* Contenu */}
          <div className="w-full md:w-1/2 p-8 md:p-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Vous souhaitez être livré ?
            </h2>
            <p className="text-muted text-lg mb-8">
              Pas envie de cuisiner ni de vous déplacer ? Contactez notre équipe de livraison et recevez votre commande encore toute chaude directement à votre adresse sur Djibouti.
            </p>
            
            <a 
              href={`tel:${deliveryPhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 w-full sm:w-auto"
            >
              <PhoneCall className="w-6 h-6" />
              CONTACTER LE LIVREUR
            </a>
            
            <p className="mt-4 text-sm text-muted">
              Disponible tous les jours aux heures d'ouverture.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
