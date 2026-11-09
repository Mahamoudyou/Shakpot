"use client";

import { useMemo } from "react";
import { ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { useRestaurantData } from "@/lib/context/RestaurantContext";

export function PromotionSection() {
  const { products } = useRestaurantData();

  // Produits configurés en promotion dans l'administration
  const activePromotions = useMemo(() => {
    return products.filter((p) => p.is_promotion && p.promotion_price);
  }, [products]);

  if (activePromotions.length === 0) return null;

  return (
    <section id="promotions" className="py-16 md:py-24 bg-primary-600 dark:bg-primary-900/50">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-primary-500/20 text-white px-4 py-2 rounded-full mb-4">
              <Tag className="w-5 h-5" />
              <span className="font-bold uppercase tracking-wider text-sm">Offres Spéciales</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Nos offres du moment
            </h2>
          </div>
          <Link 
            href="#menu" 
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-primary-600 bg-white rounded-full hover:bg-primary-50 transition-colors"
          >
            Voir tout le menu
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activePromotions.map((promo) => (
            <div 
              key={promo.id} 
              className="bg-white dark:bg-surface rounded-2xl overflow-hidden shadow-xl flex flex-col sm:flex-row transform hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto bg-muted/10 relative flex items-center justify-center">
                {promo.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={promo.image_url} alt={promo.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl">🎁</span>
                )}
                {promo.promotion_price && promo.price && (
                  <div className="absolute top-4 left-4 bg-secondary-500 text-secondary-50 font-bold px-3 py-1 rounded-full shadow-md text-sm">
                    -{Math.round(((promo.price - promo.promotion_price) / promo.price) * 100)}%
                  </div>
                )}
              </div>
              
              <div className="p-6 w-full sm:w-3/5 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {promo.name}
                </h3>
                <p className="text-muted text-sm mb-6 line-clamp-3">
                  {promo.description}
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  {promo.promotion_price ? (
                    <div className="flex flex-col">
                      <span className="text-sm text-muted line-through">
                        {promo.price} FDJ
                      </span>
                      <span className="text-2xl font-bold text-primary-600">
                        {promo.promotion_price} FDJ
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-foreground">
                      {promo.price} FDJ
                    </span>
                  )}
                  <Link
                    href="#menu"
                    className="ml-auto px-4 py-2 bg-foreground text-background rounded-full font-medium hover:bg-muted transition-colors text-sm"
                  >
                    Commander
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
