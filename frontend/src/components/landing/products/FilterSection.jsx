"use client"

import { ChevronDown, ChevronUp, X } from "lucide-react"

export default function FilterSidebar({
  showFilters,
  setShowFilters,
  openAccordion,
  toggleAccordion,
  wineTypes,
  selectedType,
  setSelectedType,
  priceRange,
  setPriceRange,
  activeFilter,
  wineries,
  zones,
  selectedWineries,
  selectedZones,
  toggleWinery,
  toggleZone,
}) {
  return (
    <div
      className={`md:w-72 transition-all duration-300 ${
        showFilters ? "opacity-100" : "opacity-0 md:opacity-100 h-0 md:h-auto overflow-hidden"
      }`}
    >
      <div className="sticky top-4 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-[#9A3E50] text-white flex justify-between items-center">
          <h3 className="font-medium">Filtres</h3>
          <button className="md:hidden" onClick={() => setShowFilters(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Wine types */}
          <div className="border-b border-gray-100 pb-4">
            <button className="w-full flex justify-between items-center mb-2" onClick={() => toggleAccordion("tipo")}>
              <h3 className="font-medium text-gray-800">Tipus de vi</h3>
              {openAccordion.tipo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openAccordion.tipo && (
              <div className="space-y-2 mt-3">
                <div className="relative rounded-lg overflow-hidden mb-2">
                  <button
                    className={`w-full relative ${
                      selectedType === "" ? "bg-[#9A3E50]/70 text-white font-medium" : "bg-gray-100 hover:bg-gray-200"
                    } p-3 flex items-center justify-center transition-all duration-300`}
                    onClick={() => setSelectedType("")}
                  >
                    <span className="text-sm font-medium">Tots els tipus</span>
                  </button>
                </div>
                {wineTypes.map((type) => (
                  <div key={type.id} className="relative rounded-lg overflow-hidden">
                    <img
                      src={type.image || "/placeholder.svg"}
                      alt={type.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <button
                      className={`w-full h-full relative ${
                        selectedType === type.name
                          ? "bg-[#9A3E50]/70 text-white font-medium"
                          : "bg-white/30 hover:bg-white/50"
                      } p-4 flex items-center justify-center transition-all duration-300`}
                      onClick={() => setSelectedType(selectedType === type.name ? "" : type.name)}
                    >
                      <span className="text-sm font-medium backdrop-blur-sm px-2 py-1 rounded">{type.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price range */}
          <div className="border-b border-gray-100 pb-4">
            <button className="w-full flex justify-between items-center mb-2" onClick={() => toggleAccordion("precio")}>
              <h3 className="font-medium text-gray-800">Preu</h3>
              {openAccordion.precio ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openAccordion.precio && (
              <div className="px-1 pt-4">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#9A3E50]"
                  />
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{priceRange[0]},00 €</span>
                    <span>{priceRange[1]},00 € o més</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <button className="w-full flex justify-between items-center mb-2" onClick={() => toggleAccordion("zona")}>
              <h3 className="font-medium text-gray-800">{activeFilter === "Productors" ? "Celler" : "Restaurant"}</h3>
              {openAccordion.zona ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openAccordion.zona && (
              <div className="space-y-2 mt-2">
                {(activeFilter === "Productors" ? wineries : zones).map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={
                        activeFilter === "Productors"
                          ? selectedWineries.includes(item.nombre)
                          : selectedZones.includes(item.nombre)
                      }
                      onChange={() =>
                        activeFilter === "Productors" ? toggleWinery(item.nombre) : toggleZone(item.nombre)
                      }
                      className="w-4 h-4 rounded border-gray-300 text-[#9A3E50] focus:ring-[#9A3E50]"
                    />
                    <span className="text-sm text-gray-700">{item.nombre}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

