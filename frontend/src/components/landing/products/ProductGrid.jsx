import ProductCard from "./ProductCard"

export default function ProductGrid({ products, favorites, toggleFavorite }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.name}
          producto={product}
          esFavorito={favorites.includes(product.name)}
          onToggleFavorito={toggleFavorite}
        />
      ))}
    </div>
  )
}

