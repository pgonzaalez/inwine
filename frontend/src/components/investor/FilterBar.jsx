"use client"

import { primaryColors } from "./utils/colors"

export const FilterBar = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: "all", label: "Tots" },
    { id: "paid", label: "Pagades" },
    { id: "shipped", label: "Enviades" },
    { id: "waiting", label: "En espera" },
    { id: "completed", label: "Completades" },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4" style={{ color: primaryColors.dark }}>
        Filtres
      </h2>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeFilter === filter.id ? "text-white" : "text-gray-700 bg-gray-100 hover:bg-gray-200"
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
