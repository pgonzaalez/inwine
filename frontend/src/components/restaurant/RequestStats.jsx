import { BarChart3, Check, Clock, ShoppingBag, Store } from "lucide-react"
import { primaryColors } from "./utils/colors"

export const RequestStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
          <Clock size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">Pendents</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.pending}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">Acceptats</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.accepted}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Store size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">En local</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.in_my_local}
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

