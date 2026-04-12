import { Bell, MapPin, Clock, Users, TimerReset } from "lucide-react"
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
              <span>{restaurante.request_count} {t("landing.products.restaurant_card.requests")}</span>
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
        {(restaurante.number_of_diners || restaurante.wine_rotation) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-[#9A3E50] mb-2">{t("landing.products.restaurant_card.extra_info")}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {restaurante.number_of_diners && (
                <div className="flex items-center gap-1">
                  <Users size={16} className="text-[#9A3E50]" />
                  <span className="text-gray-600">{restaurante.number_of_diners}</span>
                </div>
              )}
              {restaurante.wine_rotation && (
                <div className="flex items-center gap-1">
                  <TimerReset size={16} className="text-[#9A3E50]" />
                  <span className="text-gray-600">{t(`dashboards.restaurant.wine_rotation.${restaurante.wine_rotation}`)}</span>
                </div>
              )}
            </div>
          </div>
        )}

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
