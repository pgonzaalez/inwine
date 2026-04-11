import { Bell, MapPin, Clock, Package, Wine, TrendingUp, TrendingDown } from "lucide-react"
import { useTranslation } from "react-i18next";

export default function RestaurantCard({ restaurante }) {
  const { t } = useTranslation();
  const baseUrl = import.meta.env.VITE_URL_BASE;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 sm:h-56">
        {restaurante.request_count > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-[#9A3E50] backdrop-blur-sm text-[#FFF] text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 flex items-center gap-1.5 rounded-full shadow-sm border border-[#9A3E50]/10">
              <Bell className="w-4 h-4 fill-[#9A3E50]" />
              <span>{restaurante.request_count} {t("landing.products.product_card.requests")}</span>
            </div>
          </div>
        )}
        <img
          src={
            restaurante.image 
              ? (restaurante.image.includes("storage") 
                  ? `${baseUrl}${restaurante.image}` 
                  : restaurante.image)
              : "/placeholder.svg"
          }
          alt={restaurante.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{restaurante.name}</h3>
        <p className="text-gray-600 mb-4">{restaurante.description}</p>

        {/* Detalles de la solicitud */}
        {/* <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-[#9A3E50] mb-2">{t("landing.products.restaurant_card.request_title")}</h4>
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
              <span className="text-gray-600">{t("landing.products.restaurant_card.buy_price")}: {restaurante.solicitud.precioCompra},00 €</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={16} className="text-[#9A3E50]" />
              <span className="text-gray-600">{t("landing.products.restaurant_card.sell_price")}: {restaurante.solicitud.precioVenta},00 €</span>
            </div>
          </div>
        </div> */}

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-[#9A3E50]" />
            {restaurante.zone}
          </div>
          {/* <div className="flex items-center gap-1">
            <Clock size={16} className="text-[#9A3E50]" />
            {restaurante.solicitud.tiempoRespuesta}
          </div> */}
        </div>
      </div>
    </div>
  )
}
