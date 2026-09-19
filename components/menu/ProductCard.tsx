import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-surface rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">
      
      {/* Badge Promotion */}
      {product.is_promotion && (
        <div className="absolute top-4 left-4 z-10 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Promo
        </div>
      )}

      {/* Image (Placeholder temporaire) */}
      <div className="aspect-[4/3] bg-muted/20 relative flex items-center justify-center overflow-hidden">
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
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-muted mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex flex-col">
            {product.promotion_price ? (
              <>
                <span className="text-sm text-muted line-through">
                  {product.price} FDJ
                </span>
                <span className="text-lg font-bold text-primary-600">
                  {product.promotion_price} FDJ
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">
                {product.price} FDJ
              </span>
            )}
          </div>
          
          <button 
            className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 hover:bg-primary-600 hover:text-white transition-colors flex items-center justify-center"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <span className="text-xl leading-none">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}
