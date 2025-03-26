import { BarChart3, Wine, Clock, Check } from "lucide-react"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

export const WineStats = ({ wines = [] }) => {
  // Calcular estadísticas
  const stats = {
    total: wines.length,
    active: wines.filter((wine) => wine.status === "active").length,
    waiting: wines.filter((wine) => wine.status === "waiting").length,
    sold: wines.filter((wine) => wine.status === "sold").length,
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.total}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Wine size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">Actius</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.active}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">En espera</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.waiting}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Check size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">Venuts</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.sold}
        </p>
      </div>
    </div>
  )
}

