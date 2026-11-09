import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const isAvailable = product.is_available !== false;

  return (
    <div 
      onClick={() => onSelect && onSelect(product)}
      className={`group bg-surface rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col h-full relative cursor-pointer transform hover:-translate-y-1 ${
        isAvailable
          ? "border-border hover:border-primary-500/40 hover:shadow-xl"
          : "border-border/60 opacity-80 hover:border-rose-400/40"
      }`}
    >
      
      {/* Badge Promotion */}
      {product.is_promotion && (
        <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 bg-primary-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-md">
          Promo
        </div>
      )}

      {/* Badge Statut de stock */}
      {!isAvailable ? (
        <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 bg-rose-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
          <span>Rupture de stock</span>
        </div>
      ) : (
        <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 bg-emerald-600/90 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>En stock</span>
        </div>
      )}

      {/* Image */}
      <div className={`aspect-[4/3] bg-muted/20 relative flex items-center justify-center overflow-hidden ${
        !isAvailable ? "grayscale-[40%]" : ""
      }`}>
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-4xl group-hover:scale-110 transition-transform duration-500">🍔</span>
        )}
      </div>

      {/* Contenu */}
      <div className="p-3.5 sm:p-5 flex flex-col flex-1">
        <h3 className="text-sm sm:text-lg font-bold text-foreground mb-1 sm:mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-xs sm:text-sm text-muted mb-2.5 sm:mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2.5 sm:pt-4 border-t border-border">
          <div className="flex flex-col">
            {product.promotion_price ? (
              <>
                <span className="text-xs sm:text-sm text-muted line-through">
                  {product.price.toLocaleString("fr-FR")} FDJ
                </span>
                <span className="text-sm sm:text-lg font-bold text-primary-600">
                  {product.promotion_price.toLocaleString("fr-FR")} FDJ
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-lg font-bold text-foreground">
                {product.price.toLocaleString("fr-FR")} FDJ
              </span>
            )}
          </div>

          {/* Indicateur textuel de disponibilité */}
          <span className={`text-[11px] font-bold ${
            isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          }`}>
            {isAvailable ? "Disponible" : "Indisponible"}
          </span>
        </div>
      </div>
    </div>
  );
}
