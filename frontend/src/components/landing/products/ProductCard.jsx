"use client"

import { Heart, Store } from "lucide-react"

export default function ProductCard({ producto, esFavorito, onToggleFavorito }) {
  const baseUrl = import.meta.env.VITE_URL_BASE || "http://localhost:8000"

  // Add safety checks for product properties
  if (!producto) return null

  // Format price with thousand separators
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ca-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Get wine type color
  const getWineTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "negre":
        return "bg-red-900"
      case "blanc":
        return "bg-yellow-100"
      case "rossat":
        return "bg-pink-300"
      case "espumós":
        return "bg-blue-100"
      case "dolç":
        return "bg-amber-300"
      default:
        return "bg-gray-200"
    }
  }

  // Get text color based on wine type
  const getTextColor = (type) => {
    switch (type?.toLowerCase()) {
      case "blanc":
      case "espumós":
        return "text-gray-800"
      default:
        return "text-white"
    }
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300">
      <div className="relative h-64 sm:h-72">
        <img
          src={producto.image ? `${baseUrl}${producto.image}` : "/placeholder.svg"}
          alt={producto.name || "Vino"}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <button
            className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorito(producto.name)
            }}
          >
            <Heart className={`w-5 h-5 ${esFavorito ? "fill-[#9A3E50] text-[#9A3E50]" : "text-gray-400"}`} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="text-white font-medium text-lg">{formatPrice(producto.price_demanded || 0)}</div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-800 mb-1 text-lg">{producto.name || "Sin nombre"}</h3>
            <div className="flex items-center gap-2 mb-1">
              {producto.year && (
                <div className="bg-[#9A3E50]/10 text-[#9A3E50] text-xs font-medium px-2 py-1 rounded">
                  {producto.year}
                </div>
              )}
              {producto.wine_type && (
                <div
                  className={`${getWineTypeColor(producto.wine_type)} ${getTextColor(producto.wine_type)} text-xs font-medium px-2 py-1 rounded`}
                >
                  {producto.wine_type}
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm flex items-center gap-1 mt-2">
              <img src="https://flagcdn.com/16x12/es.png" alt="D.O." className="inline-block" />
              D.O. {producto.origin || "N/A"}{" "}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <Store className="w-3 h-3 text-[#9A3E50]" /> {producto.user_id || "N/A"}
          </p>
          <div className="flex items-center">
            <span className="text-xs text-gray-500">Quantitat: {producto.quantity || 1}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

