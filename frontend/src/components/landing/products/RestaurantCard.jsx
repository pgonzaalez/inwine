import { Heart, MapPin, Clock, Package, Wine, TrendingDown } from "lucide-react"

export default function RestaurantCard({ restaurante, esFavorito, onToggleFavorito }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-md h-full flex flex-col">
      <div className="relative">
        <img
          src={restaurante.imagen || "/placeholder.svg"}
          alt={restaurante.nombre}
          className="w-full h-60 object-cover"
        />
        <button
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-white transition-colors"
          onClick={(e) => {
            e.preventDefault()
            onToggleFavorito(restaurante.id)
          }}
        >
          <Heart
            size={20}
            className={`transition-transform duration-300 ${esFavorito ? "fill-[#9A3E50] text-[#9A3E50] scale-110" : "text-gray-600"}`}
          />
        </button>

        {/* Price Tag */}
        <div className="absolute -bottom-5 right-4 flex gap-2">
          <div className="bg-[#9A3E50] text-white px-4 py-2 rounded-full shadow-md flex items-center">
            <span className="text-xs mr-1 uppercase tracking-wide">Venda</span>
            <span className="font-bold text-lg">{restaurante.solicitud.precioVenta}€</span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{restaurante.nombre}</h3>
          <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm flex items-center flex-shrink-0 ml-2">
            <span className="font-medium">{restaurante.solicitud.precioCompra}€</span>
            <TrendingDown size={14} className="ml-1 text-[#9A3E50]" />
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin size={16} className="text-[#9A3E50] mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{restaurante.zona}</span>
          <span className="mx-2 flex-shrink-0">•</span>
          <Clock size={16} className="text-[#9A3E50] mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{restaurante.solicitud.tiempoRespuesta}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <Wine size={18} className="text-[#9A3E50] flex-shrink-0" />
            <span className="text-base font-medium line-clamp-1">{restaurante.solicitud.nombre}</span>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{restaurante.solicitud.descripcion}</p>

          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-500 flex items-center">
              <span className="line-clamp-1">{restaurante.solicitud.tipo}</span>
              <span className="mx-2 flex-shrink-0">•</span>
              <Package size={16} className="text-[#9A3E50] mr-1 flex-shrink-0" />
              <span>{restaurante.solicitud.cantidadSolicitada}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm mt-auto">
          <p className="text-gray-500 italic">Ref: #{restaurante.id || "12345"}</p>
          <div className="text-[#9A3E50] font-medium hover:underline cursor-pointer">Veure detalls</div>
        </div>
      </div>
    </div>
  )
}

