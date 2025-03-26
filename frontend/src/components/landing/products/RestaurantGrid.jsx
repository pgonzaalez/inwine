
import RestaurantCard from "./RestaurantCard"

export default function RestaurantGrid({ restaurants, favorites, toggleFavorite }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurante={restaurant}
          esFavorito={favorites.includes(restaurant.id)}
          onToggleFavorito={toggleFavorite}
        />
      ))}
    </div>
  )
}

