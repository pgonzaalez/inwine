"use client"

import { useState } from "react"
import { Download, Filter, Search, X } from "lucide-react"
import { StatusBadge } from "./StatusBadge"
import { primaryColors } from "./utils/colors"
import { DateRangeSelector } from "./DateRangeSelector"

export const InvestmentTable = ({
  investments,
  baseUrl,
  handleDownloadHistory,
  activeFilter,
  setActiveFilter,
  onDateRangeChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("")

  // Array de filtres per a la capçalera
  const filters = [
    { id: "all", label: "Tots" },
    { id: "paid", label: "Pagades" },
    { id: "shipped", label: "Enviades" },
    { id: "waiting", label: "En espera" },
    { id: "completed", label: "Completades" },
  ]

  // Funció per formatejar el preu amb separador de milers
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ca-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Funció per formatejar la data
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ca-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  // Filtrar inversions per terme de cerca
  const filteredInvestments = investments.filter((investment) => {
    if (!searchTerm.trim()) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      investment.product.name.toLowerCase().includes(searchLower) ||
      investment.product.origin.toLowerCase().includes(searchLower) ||
      investment.seller_name.toLowerCase().includes(searchLower) ||
      investment.restaurant_name.toLowerCase().includes(searchLower)
    )
  })

  // Netejar el camp de cerca
  const clearSearch = () => {
    setSearchTerm("")
  }

  // Calcular el benefici potencial per a una inversió
  const calculatePotentialProfit = (investment) => {
    return (investment.price_restaurant - investment.product.price_demanded) * investment.quantity
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Capçalera amb filtres */}
      <div className="border-b border-gray-100">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
                Les teves inversions
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Gestiona i visualitza totes les teves inversions en un sol lloc
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <DateRangeSelector onDateRangeChange={onDateRangeChange} />

              <div className="relative rounded-md shadow-sm hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Cerca inversions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={clearSearch}
                    aria-label="Netejar cerca"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <button
                className="px-4 py-2 rounded-md text-xs font-medium bg-gray-100 text-gray-800 flex items-center gap-2"
                onClick={handleDownloadHistory}
              >
                <Download size={14} />
                CSV
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-500">Filtres:</span>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === filter.id ? "text-white" : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                }`}
                style={
                  activeFilter === filter.id
                    ? {
                        background: primaryColors.dark,
                      }
                    : {}
                }
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
            <span className="ml-auto text-sm text-gray-500">
              {filteredInvestments.length} {filteredInvestments.length === 1 ? "inversió" : "inversions"}
            </span>
          </div>
        </div>
      </div>

      {/* Capçalera de la taula - Només visible en tablet i desktop */}
      <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-50 px-6 py-4 border-b border-gray-100">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Imatge</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Detalls</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Venedor</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Data</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Estat</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Preu</div>
      </div>

      {/* Graella d'inversions o missatge de no resultats */}
      {filteredInvestments.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {filteredInvestments.map((investment) => (
            <div key={investment.investment_id} className="hover:bg-gray-50 transition-colors">
              {/* Disseny per a mòbil */}
              <div className="md:hidden grid grid-cols-[100px_1fr] gap-6 p-6">
                <div className="relative">
                  <div className="w-full h-28 overflow-hidden rounded-lg">
                    <img
                      src={`${baseUrl}${investment.product.image}`}
                      alt={investment.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col relative">
                  {/* Preu a dalt a la dreta */}
                  <div className="absolute top-0 right-0 text-sm font-bold" style={{ color: primaryColors.dark }}>
                    {formatPrice(investment.product.price_demanded)}
                  </div>

                  <div className="text-sm font-medium text-gray-900 mb-2 pr-20">{investment.product.name}</div>
                  <div className="text-xs text-gray-500 mb-2">
                    {investment.product.year} · {investment.product.origin}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    <span className="font-medium">Data:</span>{" "}
                    {investment.created_at ? formatDate(investment.created_at) : "N/A"}
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    <span className="font-medium">Venedor:</span> {investment.seller_name}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <StatusBadge status={investment.status} />
                  </div>

                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Restaurant:</span> {investment.restaurant_name}
                  </div>

                  {investment.status === "completed" && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      Benefici: {formatPrice(calculatePotentialProfit(investment))}
                    </div>
                  )}
                </div>
              </div>

              {/* Disseny per a tablet/desktop */}
              <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-6">
                <div className="w-20 h-20 overflow-hidden rounded-lg">
                  <img
                    src={`${baseUrl}${investment.product.image}`}
                    alt={investment.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900 mb-1">{investment.product.name}</div>
                  <div className="text-sm text-gray-500">
                    {investment.product.year} · {investment.product.origin}
                  </div>
                  {investment.status === "completed" && (
                    <div className="mt-1 text-xs text-green-600 font-medium">
                      Benefici: {formatPrice(calculatePotentialProfit(investment))}
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-500">{investment.seller_name}</div>

                <div className="text-sm text-gray-500">{investment.restaurant_name}</div>

                <div className="text-sm text-gray-500">
                  {investment.created_at ? formatDate(investment.created_at) : "N/A"}
                </div>

                <div>
                  <StatusBadge status={investment.status} />
                </div>

                <div className="text-sm font-bold" style={{ color: primaryColors.dark }}>
                  {formatPrice(investment.product.price_demanded)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-gray-500">
          {searchTerm
            ? "No s'han trobat inversions amb aquest terme de cerca"
            : "No hi ha inversions disponibles amb aquest filtre"}
        </div>
      )}
    </div>
  )
}
