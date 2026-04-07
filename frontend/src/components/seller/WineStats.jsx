import { BarChart3, Wine, Clock, Check } from "lucide-react"
import { useTranslation } from "react-i18next"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

export const WineStats = ({ wines = [] }) => {
  const { t } = useTranslation()
  // Calcular estadísticas actualizadas según los nuevos estados
  const stats = {
    total: wines.length,
    in_stock: wines.filter((wine) => wine.status === "in_stock").length,
    requested: wines.filter((wine) => wine.status === "requested").length,
    in_transit: wines.filter((wine) => wine.status === "in_transit").length,
    sold: wines.filter((wine) => wine.status === "sold").length,
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">{t("dashboards.seller.stats.total_products")}</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.total}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Wine size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">{t("dashboards.seller.stats.in_stock")}</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.in_stock}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">{t("dashboards.seller.stats.requested")}</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.requested}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">{t("dashboards.seller.stats.in_transit")}</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.in_transit}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Check size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">{t("dashboards.seller.stats.sold")}</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.sold}
        </p>
      </div>
    </div>
  )
}

