"use client"

import { BarChart3, History, Wine, MapPin, Wallet, CreditCard, Truck, Clock, CheckCircle } from "lucide-react"
import { primaryColors } from "./utils/colors"

export const InvestmentSummary = ({ investments, totalInvested, stats, onViewAll, trends }) => {
  // Calcular distribució per origen
  const originDistribution = investments.reduce((acc, investment) => {
    const origin = investment.product.origin
    acc[origin] = (acc[origin] || 0) + 1
    return acc
  }, {})

  // Calcular el benefici potencial (diferència entre price_restaurant i price_demanded)
  const potentialProfit = investments
    .filter((investment) => investment.status !== "cancelled")
    .reduce((total, investment) => {
      const profit = (investment.price_restaurant - investment.product.price_demanded) * investment.quantity
      return total + profit
    }, 0)
    .toFixed(2)

  // Calcular el benefici real (només de les inversions completades)
  const actualProfit = investments
    .filter((investment) => investment.status === "completed")
    .reduce((total, investment) => {
      const profit = (investment.price_restaurant - investment.product.price_demanded) * investment.quantity
      return total + profit
    }, 0)
    .toFixed(2)

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div
            className="p-2 rounded-lg mr-3"
            style={{
              backgroundColor: `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
                primaryColors.dark.slice(3, 5),
                16,
              )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
            }}
          >
            <BarChart3 size={20} style={{ color: primaryColors.dark }} />
          </div>
          <h2 className="text-lg font-semibold" style={{ color: primaryColors.dark }}>
            Resum d'Inversions
          </h2>
        </div>
        <div className={`flex items-center text-sm ${trends?.totalInvested >= 0 ? "text-green-600" : "text-red-600"}`}>
          {trends?.totalInvested >= 0 ? "+" : ""}
          {trends?.totalInvested || 0}%
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`ml-1 w-4 h-4 ${trends?.totalInvested < 0 ? "transform rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      </div>

      <div className="space-y-8">
        <div className="p-6 rounded-lg border border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Wallet size={18} className="text-emerald-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Inversió Total</h3>
            </div>
            <div
              className={`flex items-center text-xs ${trends?.totalInvested >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {trends?.totalInvested >= 0 ? "+" : ""}
              {trends?.totalInvested || 0}%
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{totalInvested}€</p>
          <p className="text-xs text-gray-500 mt-1">vs. mes anterior</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 rounded-lg border border-gray-100">
            <div className="flex items-center mb-2">
              <CreditCard size={16} className="text-green-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Pagades</h3>
            </div>
            <p className="text-xl font-semibold text-green-600">{stats.paid}</p>
          </div>

          <div className="p-4 rounded-lg border border-gray-100">
            <div className="flex items-center mb-2">
              <Truck size={16} className="text-blue-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Enviades</h3>
            </div>
            <p className="text-xl font-semibold text-blue-600">{stats.shipped}</p>
          </div>

          <div className="p-4 rounded-lg border border-gray-100">
            <div className="flex items-center mb-2">
              <Clock size={16} className="text-yellow-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">En Espera</h3>
            </div>
            <p className="text-xl font-semibold text-yellow-600">{stats.waiting}</p>
          </div>

          <div className="p-4 rounded-lg border border-gray-100">
            <div className="flex items-center mb-2">
              <CheckCircle size={16} className="text-emerald-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Completades</h3>
            </div>
            <p className="text-xl font-semibold text-emerald-600">{stats.completed}</p>
            <div className="flex items-center text-xs mt-1 text-gray-500">
              <span className={trends?.completed >= 0 ? "text-green-600" : "text-red-600"}>
                {trends?.completed >= 0 ? "+" : ""}
                {trends?.completed || 0}%
              </span>
              <span className="ml-1">vs. any anterior</span>
            </div>
          </div>
        </div>

        {/* Secció de beneficis */}
        <div className="p-6 rounded-lg border border-gray-100 bg-gray-50">
          <div className="flex items-center mb-3">
            <Wallet size={18} className="text-purple-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Benefici Potencial</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">{potentialProfit}€</p>
          <p className="text-xs text-gray-500 mt-1">Diferència entre preu de restaurant i preu d'inversió</p>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center mb-2">
              <CheckCircle size={16} className="text-emerald-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Benefici Realitzat</h3>
            </div>
            <p className="text-xl font-semibold text-emerald-600">{actualProfit}€</p>
            <p className="text-xs text-gray-500 mt-1">De les inversions completades</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <MapPin size={18} className="text-gray-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Distribució per Origen</h3>
          </div>
          {investments.length > 0 ? (
            <div className="space-y-3">
              {Object.entries(originDistribution).map(([origin, count]) => (
                <div
                  key={origin}
                  className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center">
                    <Wine size={14} className="text-gray-500 mr-2" />
                    <span className="text-sm">{origin}</span>
                  </div>
                  <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-full">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Cap inversió registrada</p>
          )}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 flex items-center justify-center gap-2 transition-colors"
            onClick={onViewAll}
          >
            <History size={16} />
            Veure historial complet
          </button>
        </div>
      </div>
    </div>
  )
}
