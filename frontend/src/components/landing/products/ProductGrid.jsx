import ProductCard from "./ProductCard"
import { Link } from "react-router-dom"

export default function ProductGrid({ products, favorites = [], toggleFavorite, compact = false, onSelectProduct, selectedProductId }) {
  // Add a check for empty or undefined products
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay productos disponibles.</p>
      </div>
    )
  }

  const gridClasses = compact 
    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className={gridClasses}>
      {products.map((product, index) => {
        const isSelected = selectedProductId === product.id;
        const cardComponent = (
          <ProductCard
            key={`card-${product.id || index}`}
            producto={product}
            esFavorito={favorites.some(fav => String(fav) === String(product.id))}
            onToggleFavorito={toggleFavorite}
            compact={compact}
          />
        );

        if (onSelectProduct) {
          return (
            <div 
              key={product.id || index}
              onClick={() => onSelectProduct(product.id)}
              className={`cursor-pointer transition-all duration-200 rounded-xl ${isSelected ? 'ring-4 ring-[#9A3E50] ring-offset-2 scale-[1.02]' : 'hover:scale-[1.01]'}`}
            >
              {cardComponent}
            </div>
          );
        }

        return (
          <Link key={product.id || index} to={`/productes/${product.id}/`}>
            {cardComponent}
          </Link>
        );
      })}
    </div>
  )
}
