import { Heart, Store, Tag } from "lucide-react"

export default function ProductCard({ producto, esFavorito, onToggleFavorito }) {
  const baseUrl = import.meta.env.VITE_URL_BASE || "http://localhost:8000"

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100 h-[420px] w-full">
      <div className="relative w-full h-48">
        <img
          src={`${baseUrl}${producto.image}` || "/placeholder.svg"}
          alt={producto.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Favorite Button */}
        <button
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
          onClick={(e) => {
            e.preventDefault()
            onToggleFavorito(producto.name)
          }}
        >
          <Heart
            size={20}
            className={`transition-transform duration-300 ${esFavorito ? "fill-[#9A3E50] text-[#9A3E50] scale-110" : "text-gray-600"}`}
          />
        </button>

        {/* Year Badge */}
        <div className="absolute top-4 left-4 bg-black/70 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm">
          {producto.year}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      <div className="p-5 flex-grow flex flex-col justify-between">
        {/* Top Section */}
        <div>
          {/* Price and Title */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1 pr-2">{producto.name}</h3>
            <div className="text-[#9A3E50] font-bold text-lg whitespace-nowrap">€{producto.price_demanded}</div>
          </div>

          {/* Origin and Store */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <img src="https://flagcdn.com/16x12/es.png" alt="D.O." className="w-4 h-3 object-contain" />
              <span className="line-clamp-1">D.O. {producto.origin}</span>
            </div>

            <span className="text-gray-300 hidden sm:inline">•</span>

            <div className="flex items-center gap-1">
              <Store size={14} className="text-[#9A3E50] flex-shrink-0" />
              <span className="line-clamp-1">{producto.user_id}</span>
            </div>
          </div>
        </div>

        {/* Bottom Tags - Always at the bottom */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center bg-[#9A3E50]/10 text-[#9A3E50] text-xs font-medium px-3 py-1.5 rounded-full">
            <Tag size={12} className="mr-1" />
            {producto.wine_type}
          </div>

          <div className="flex items-center bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <span>{producto.origin}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

