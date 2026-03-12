"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X, Search, Check } from "lucide-react"
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const [winerySearch, setWinerySearch] = useState("");

  const visibleWineries = wineries.filter((item) => {
    const matchesSearch = item.toLowerCase().includes(winerySearch.toLowerCase()) //&& "" !== winerySearch
    const isSelected = selectedWineries.includes(item)
    
    return matchesSearch || isSelected
  })

  return (
    <div
      className={`md:w-72 transition-all duration-300 ${
        showFilters ? "opacity-100" : "opacity-0 md:opacity-100 h-0 md:h-auto overflow-hidden"
      }`}
    >
      <div className="sticky top-4 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-[#9A3E50] text-white flex justify-between items-center">
          <h3 className="font-medium">{t("landing.products.filters.title")}</h3>
          <button className="md:hidden" onClick={() => setShowFilters(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Wine types */}
          <div className="border-b border-gray-100 pb-4">
            <button className="w-full flex justify-between items-center mb-2" onClick={() => toggleAccordion("tipo")}>
              <h3 className="font-medium text-gray-800">{t("landing.products.filters.wine_type")}</h3>
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
                    <span className="text-sm font-medium">{t("landing.products.filters.all_types")}</span>
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
              <h3 className="font-medium text-gray-800">{t("landing.products.filters.price")}</h3>
              {openAccordion.precio ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openAccordion.precio && (
              <div className="px-1 pt-4">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={Math.min(priceRange[1], 2000)}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#9A3E50]"
                  />
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{t("landing.products.filters.price_from")} {priceRange[0]},00 €</span>
                    <span>{t("landing.products.filters.price_to")} {Math.min(priceRange[1], 2000)},00 €</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Winery Section with searcher */}
          <div>
            <button
              onClick={() => toggleAccordion("zona")}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="font-medium text-gray-800">
                {activeFilter === "Productors" 
                  ? t("landing.products.filters.winery") 
                  : t("landing.products.filters.restaurant")}
              </h3>
              {openAccordion.zona ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openAccordion.zona && (
              <div className="mt-3 space-y-2">
                
                {/* SEARCH BOX */}
                {activeFilter === "Productors" && (
                  <div className="relative mb-3">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t("landing.products.filters.search_winery")}
                      value={winerySearch}
                      onChange={(e) => setWinerySearch(e.target.value)}
                      className="w-full text-sm pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9A3E50] focus:border-[#9A3E50]"
                    />
                  </div>
                )}

                {/* CHECKBOXES WITH SCROLL */}
                <div className="max-h-60 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                  {(activeFilter === "Productors" ? visibleWineries : zones).map((item) => (
                    <label
                      key={item}
                      className={`flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors ${
                        selectedWineries.includes(item) ? "bg-[#9A3E50]/5" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={
                          activeFilter === "Productors"
                            ? selectedWineries.includes(item)
                            : selectedZones.includes(item)
                        }
                        onChange={() =>
                          activeFilter === "Productors" ? toggleWinery(item) : toggleZone(item)
                        }
                        className="w-4 h-4 rounded border-gray-300 text-[#9A3E50] focus:ring-[#9A3E50]"
                      />
                      <span className={`text-sm ${
                        selectedWineries.includes(item) ? "text-[#9A3E50] font-medium" : "text-gray-700"
                      }`}>
                        {item}
                      </span>
                    </label>
                  ))}

                  {activeFilter === "Productors" && visibleWineries.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">
                      {t("landing.products.filters.no_winery_found")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

