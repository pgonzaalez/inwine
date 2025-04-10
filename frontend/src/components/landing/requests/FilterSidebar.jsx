"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X, Filter } from "lucide-react"

export default function FilterSidebar({ requests, filteredRequests, setFilterOptions, filterOptions, resetFilters }) {
  const [openAccordion, setOpenAccordion] = useState({
    price: true,
    quantity: true,
  })
  const [showFilters, setShowFilters] = useState(true)

  const toggleAccordion = (section) => {
    setOpenAccordion((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Contar solo las solicitudes pendientes para el contador
  const pendingRequestsCount = requests.filter((request) => request.status === "pending").length

  return (
    <div
      className={`md:w-full transition-all duration-300 ${
        showFilters ? "opacity-100" : "opacity-0 md:opacity-100 h-0 md:h-auto overflow-hidden"
      }`}
    >
      <div className="sticky top-4 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-[#9A3E50] text-white flex justify-between items-center">
          <h3 className="font-medium flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </h3>
          <button className="md:hidden" onClick={() => setShowFilters(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Price range */}
          <div className="border-b border-gray-100 pb-4">
            <button className="w-full flex justify-between items-center mb-2" onClick={() => toggleAccordion("price")}>
              <h3 className="font-medium text-gray-800">Rang de preu</h3>
              {openAccordion.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openAccordion.price && (
              <div className="space-y-2 mt-3">
                <div className="relative">
                  <input
                    type="number"
                    name="minPrice"
                    value={filterOptions.minPrice}
                    onChange={(e) => setFilterOptions((prev) => ({ ...prev, minPrice: e.target.value }))}
                    placeholder="Preu mínim"
                    className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    €
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="maxPrice"
                    value={filterOptions.maxPrice}
                    onChange={(e) => setFilterOptions((prev) => ({ ...prev, maxPrice: e.target.value }))}
                    placeholder="Preu màxim"
                    className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    €
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quantity range */}
          <div className="border-b border-gray-100 pb-4">
            <button
              className="w-full flex justify-between items-center mb-2"
              onClick={() => toggleAccordion("quantity")}
            >
              <h3 className="font-medium text-gray-800">Rang de quantitat</h3>
              {openAccordion.quantity ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openAccordion.quantity && (
              <div className="space-y-2 mt-3">
                <input
                  type="number"
                  name="minQuantity"
                  value={filterOptions.minQuantity}
                  onChange={(e) => setFilterOptions((prev) => ({ ...prev, minQuantity: e.target.value }))}
                  placeholder="Quantitat mínima"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
                />
                <input
                  type="number"
                  name="maxQuantity"
                  value={filterOptions.maxQuantity}
                  onChange={(e) => setFilterOptions((prev) => ({ ...prev, maxQuantity: e.target.value }))}
                  placeholder="Quantitat màxima"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
                />
              </div>
            )}
          </div>

          {/* Status section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Estat</h3>
              <span className="bg-[#9A3E50] text-white text-xs py-0.5 px-2 rounded-full">
                {filteredRequests.length}
                <span className="text-white/70 mx-1">/</span>
                {pendingRequestsCount}
              </span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                {filteredRequests.length} {filteredRequests.length === 1 ? "sol·licitud" : "sol·licituds"}{" "}
                {filterOptions.minPrice ||
                filterOptions.maxPrice ||
                filterOptions.minQuantity ||
                filterOptions.maxQuantity
                  ? "filtrades"
                  : "pendents"}
              </p>
            </div>
          </div>

          {/* Reset button */}
          <div className="pt-2">
            <button
              onClick={resetFilters}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors text-sm"
            >
              Restablir filtres
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
