import { Heart, MapPin, Clock, Package, Wine, TrendingUp, TrendingDown } from "lucide-react"

export default function RestaurantCard({ restaurante, esFavorito, onToggleFavorito }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 sm:h-56">
        <img
          src={restaurante.imagen || "/placeholder.svg"}
          alt={restaurante.nombre}
          className="w-full h-full object-cover"
        />
        <button
          className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.preventDefault()
            onToggleFavorito(restaurante.id)
          }}
        >
          <Heart size={20} className={`${esFavorito ? "fill-[#9A3E50] text-[#9A3E50]" : "text-gray-600"}`} />
        </button>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{restaurante.nombre}</h3>
        <p className="text-gray-600 mb-4">{restaurante.descripcion}</p>

        {/* Detalles de la solicitud */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-[#9A3E50] mb-2">Sol·licitud de producte</h4>
          <p className="text-gray-700 font-medium mb-1">{restaurante.solicitud.nombre}</p>
          <p className="text-gray-600 text-sm mb-3">{restaurante.solicitud.descripcion}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Wine size={16} className="text-[#9A3E50]" />
              <span className="text-gray-600">{restaurante.solicitud.tipo}</span>
            </div>
            <div className="flex items-center gap-1">
              <Package size={16} className="text-[#9A3E50]" />
              <span className="text-gray-600">{restaurante.solicitud.cantidadSolicitada}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown size={16} className="text-[#9A3E50]" />
              <span className="text-gray-600">Compra: {restaurante.solicitud.precioCompra},00 €</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={16} className="text-[#9A3E50]" />
              <span className="text-gray-600">Venda: {restaurante.solicitud.precioVenta},00 €</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-[#9A3E50]" />
            {restaurante.zona}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-[#9A3E50]" />
            {restaurante.solicitud.tiempoRespuesta}
          </div>
        </div>
      </div>
    </div>
  )
}
