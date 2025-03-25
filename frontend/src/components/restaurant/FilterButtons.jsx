import { Filter } from 'lucide-react'
import { primaryColors } from "./utils/colors"

export const FilterButtons = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={18} style={{ color: primaryColors.dark }} />
        <h3 className="text-lg font-bold" style={{ color: primaryColors.dark }}>
          Filtres
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === "all" ? "text-white" : "text-gray-700 hover:bg-gray-100"
          }`}
          style={
            activeFilter === "all"
              ? {
                  background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                }
              : {}
          }
          onClick={() => setActiveFilter("all")}
        >
          Tots
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === "pending" ? "text-white" : "text-gray-700 hover:bg-gray-100"
          }`}
          style={
            activeFilter === "pending"
              ? {
                  background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                }
              : {}
          }
          onClick={() => setActiveFilter("pending")}
        >
          Pendents
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === "accepted" ? "text-white" : "text-gray-700 hover:bg-gray-100"
          }`}
          style={
            activeFilter === "accepted"
              ? {
                  background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                }
              : {}
          }
          onClick={() => setActiveFilter("accepted")}
        >
          Acceptats
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === "in_my_local" ? "text-white" : "text-gray-700 hover:bg-gray-100"
          }`}
          style={
            activeFilter === "in_my_local"
              ? {
                  background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                }
              : {}
          }
          onClick={() => setActiveFilter("in_my_local")}
        >
          En el local
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === "sold" ? "text-white" : "text-gray-700 hover:bg-gray-100"
          }`}
          style={
            activeFilter === "sold"
              ? {
                  background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                }
              : {}
          }
          onClick={() => setActiveFilter("sold")}
        >
          Venuts
        </button>
      </div>
    </div>
  )
}
