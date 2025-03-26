import { Heart, Store } from "lucide-react"

export default function ProductCard({ producto, esFavorito, onToggleFavorito }) {
  const baseUrl = import.meta.env.VITE_URL_BASE || "http://localhost:8000"
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 sm:h-56">
        <img
          src={`${baseUrl}${producto.image}` || "/placeholder.svg"}
          alt={producto.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-white font-medium">€{producto.price_demanded}</div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-800 mb-1">
              {producto.name} {producto.year}
            </h3>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <img src="https://flagcdn.com/16x12/es.png" alt="D.O." />
              D.O. {producto.origin}{" "}
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <Store className="w-3 h-3 text-red-400" /> {producto.user_id}
            </p>
          </div>
          <div className="bg-[#9A3E50]/10 text-[#9A3E50] text-xs font-medium px-2 py-1 rounded">{producto.year}</div>
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-3">
          <span className="inline-block px-2 py-1 bg-gray-100 rounded-full mr-2">{producto.wine_type}</span>
          <span className="inline-block px-2 py-1 bg-gray-100 rounded-full">{producto.origin}</span>
          <span style={{ display: "none" }}>{producto.user_id}</span>
        </div>
      </div>
    </div>
  )
}

