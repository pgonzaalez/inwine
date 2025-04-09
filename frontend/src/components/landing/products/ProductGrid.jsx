import ProductCard from "./ProductCard"
import { Link } from "react-router-dom"

export default function ProductGrid({ products, favorites, toggleFavorite }) {
  // Add a check for empty or undefined products
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay productos disponibles.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link key={product.name} to={`/productes/${product.id}/`}>
        <ProductCard
          key={product.name || index}
          producto={product}
          esFavorito={favorites.includes(product.name)}
          onToggleFavorito={toggleFavorite}
        />
        </Link>
      ))}
    </div>
  )
}
