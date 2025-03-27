"use client"

import { Filter } from "lucide-react"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

export const FilterBar = ({ activeFilter, setActiveFilter }) => {
  // Array de filtros para evitar el warning de keys
  const filters = [
    { id: "all", label: "Tots" },
    { id: "in_stock", label: "En Stock" },
    { id: "requested", label: "Sol·licitats" },
    { id: "in_transit", label: "En Trànsit" },
    { id: "sold", label: "Venuts" },
  ]

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={18} style={{ color: primaryColors.dark }} />
        <h3 className="text-lg font-bold" style={{ color: primaryColors.dark }}>
          Filtres
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === filter.id ? "text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            style={
              activeFilter === filter.id
                ? {
                    background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                  }
                : {}
            }
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}

