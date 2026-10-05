import Image from "next/image";
import { PhoneCall, MessageCircle, Clock, Zap, MapPin } from "lucide-react";

export function DeliverySection() {
  // Numéro de téléphone de livraison Shakpot (format international Djibouti +253)
  const deliveryPhoneNumber = "+25377000000";
  const displayPhoneNumber = "+253 77 00 00 00";

  const whatsappMessage = encodeURIComponent(
    "Bonjour SHAKPOT ! Je souhaite passer une commande en livraison à Djibouti."
  );
  const whatsappUrl = `https://wa.me/25377000000?text=${whatsappMessage}`;

  return (
    <section id="livraison" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Grande Bannière de Livraison */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-rose-600 to-amber-600 text-white shadow-2xl">
          
          {/* Motifs et halos d'ambiance en arrière-plan */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-black/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-14">
            
            {/* Colonne Gauche : Illustration 3D du Livreurette */}
            <div className="lg:col-span-4 flex justify-center items-center">
              <div className="relative w-64 sm:w-72 md:w-80 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform hover:scale-105 transition-transform duration-500 bg-white/10 backdrop-blur-sm">
                <Image
                  src="/images/delivery-scooter.jpg"
                  alt="Livreur express Shakpot en scooter"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Colonne Centrale : Titre & Avantages */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-4">
              
              {/* Badge d'en-tête */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white shadow-sm text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Livraison Express à Djibouti</span>
              </div>

              {/* Titre percutant */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight drop-shadow-sm">
                Faites-vous livrer en un éclair !
              </h2>

              {/* Texte explicatif */}
              <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                Un smash burger juteux, des frites croustillantes et une boisson bien fraîche... Tout livré directement à votre porte encore tout chaud ! Pourquoi attendre ?
              </p>

              {/* Puces de réassurance */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs sm:text-sm font-semibold text-white/95">
                <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>En ~30 min</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <MapPin className="w-4 h-4 text-emerald-300" />
                  <span>Tout Djibouti-Ville</span>
                </div>
              </div>

            </div>

            {/* Colonne Droite : Boutons d'Action Cliquables (Téléphone & WhatsApp) */}
            <div className="lg:col-span-3 flex flex-col gap-3.5 w-full sm:max-w-xs mx-auto lg:mx-0">
              
              {/* Bouton Appel Direct */}
              <a
                href={`tel:${deliveryPhoneNumber}`}
                className="group flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-white text-primary-700 hover:bg-primary-50 font-black text-base shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-muted uppercase font-bold tracking-wider leading-none">Appeler le livreur</p>
                  <p className="text-sm sm:text-base font-extrabold">{displayPhoneNumber}</p>
                </div>
              </a>

              {/* Bouton WhatsApp Direct */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl shadow-emerald-950/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-emerald-100 uppercase font-bold tracking-wider leading-none">Commander via</p>
                  <p className="text-sm sm:text-base font-extrabold">WhatsApp</p>
                </div>
              </a>

              {/* Mention horaires */}
              <p className="text-center text-[11px] text-white/80 font-medium">
                Disponible 7j/7 de 10:00 à 23:00
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
