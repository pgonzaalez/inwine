import RestaurantCard from "./RestaurantCard"
import { Link } from "react-router-dom"

export default function RestaurantGrid({ restaurants }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <Link key={restaurant.id} to={`/restaurants/${restaurant.id}/`}>
        <RestaurantCard
          key={restaurant.id}
          restaurante={restaurant}
        />
        </Link>
      ))}
    </div>
  )
}