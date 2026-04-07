"use client"

import { Filter, Eye } from "lucide-react"
import { StatusBadge } from "./StatusBadge"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

export const InvestmentTable = ({ investments, activeFilter, setActiveFilter }) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === "ca" ? "ca-ES" : i18n.language === "es" ? "es-ES" : "en-US"
  // Get the base URL from environment variables
  const baseUrl = import.meta.env.VITE_URL_BASE
  const navigate = useNavigate()

  // Array de filtros para evitar el warning de keys
  const filters = [
    { id: "all", label: t("dashboards.investor.table.filters.all") },
    { id: "paid", label: t("dashboards.investor.table.filters.paid") },
    { id: "completed", label: t("dashboards.investor.table.filters.completed") },
    { id: "cancelled", label: t("dashboards.investor.table.filters.cancelled") },
  ]

  // Función para formatear el precio con separador de miles
  const formatPrice = (price) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  // Función para navegar a los detalles de la inversión
  const handleViewDetails = (investmentId) => {
    navigate(`/investor/historic/${investmentId}`)
  }

  if (investments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with filters */}
        <div className="border-b">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
              {t("dashboards.investor.table.title")}
            </h2>
            <span className="text-sm text-gray-500">{t("dashboards.investor.table.count_zero")}</span>
          </div>

          {/* Filter section */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter size={16} style={{ color: primaryColors.dark }} />
              <span className="text-sm font-medium" style={{ color: primaryColors.dark }}>
                {t("dashboards.investor.table.filters_title")}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${activeFilter === filter.id ? "text-white" : "text-gray-700 hover:bg-gray-100"
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
        </div>

        <div className="text-center p-8">{t("dashboards.investor.table.empty")}</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header with filters */}
      <div className="border-b">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
            {t("dashboards.investor.table.title")}
          </h2>
          <span className="text-sm text-gray-500">
            {investments.length === 1 
              ? t("dashboards.investor.table.count_single") 
              : t("dashboards.investor.table.count_multiple", { count: investments.length })}
          </span>
        </div>

        {/* Filter section */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter size={16} style={{ color: primaryColors.dark }} />
            <span className="text-sm font-medium" style={{ color: primaryColors.dark }}>
              {t("dashboards.investor.table.filters_title")}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${activeFilter === filter.id ? "text-white" : "text-gray-700 hover:bg-gray-100"
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
      </div>

      {/* Header - Only visible on tablet and desktop */}
      <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_0.5fr] gap-4 bg-gray-50 px-6 py-3">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t("dashboards.investor.table.headers.image")}</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t("dashboards.investor.table.headers.product")}</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t("dashboards.investor.table.headers.seller")}</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t("dashboards.investor.table.headers.status")}</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t("dashboards.investor.table.headers.investment")}</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t("dashboards.investor.table.headers.return")}</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t("dashboards.investor.table.headers.actions")}</div>
      </div>

      {/* Investment Grid */}
      <div className="divide-y divide-gray-200">
        {investments.map((investment) => (
          <div key={investment.investment_id} className="hover:bg-gray-50 transition-colors">
            {/* Mobile Layout */}
            <div className="md:hidden grid grid-cols-[120px_1fr] gap-4 p-4">
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
                {/* Price at top right */}
                <div className="absolute top-0 right-0 text-sm font-bold" style={{ color: primaryColors.dark }}>
                  {formatPrice(investment.product.price_demanded * investment.quantity)}
                </div>

                <div className="text-sm font-medium text-gray-900 mb-1 pr-20">{investment.product.name}</div>
                <div className="text-xs text-gray-500 mb-2">
                  {investment.product.origin} · {investment.product.year}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="text-xs text-gray-500">{t("dashboards.investor.table.headers.seller")}: {investment.seller_name}</div>
                  <StatusBadge status={investment.status} />
                </div>

                <div className="flex flex-col gap-1 mt-auto">
                  <div className="text-xs text-gray-500">
                    {t("dashboards.investor.table.headers.investment")}: {formatPrice(investment.product.price_demanded * investment.quantity)}
                  </div>
                  <div className="text-xs font-medium" style={{ color: primaryColors.dark }}>
                    {t("dashboards.investor.table.labels.potential_return")}: {formatPrice(investment.price_restaurant * investment.quantity)}
                  </div>
                  <div className="text-xs text-gray-500">{t("dashboards.investor.table.labels.date")}: {formatDate(investment.created_at)}</div>

                  {/* Botón de detalles */}
                  <button
                    onClick={() => handleViewDetails(investment.investment_id)}
                    className="mt-2 px-3 py-1 text-xs rounded-lg font-medium text-white flex items-center gap-1"
                    style={{
                      background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                    }}
                  >
                    <Eye size={12} />
                    {t("dashboards.investor.table.actions.details")}
                  </button>
                </div>
              </div>
            </div>

            {/* Tablet/Desktop Layout */}
            <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_0.5fr] gap-4 items-center px-6 py-4">
              <div className="w-32 h-32 overflow-hidden rounded-lg">
                <img
                  src={`${baseUrl}${investment.product.image}`}
                  alt={investment.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-900 mb-1">{investment.product.name}</div>
                <div className="text-sm text-gray-500">
                  {investment.product.origin} · {investment.product.year}
                </div>
                <div className="text-xs text-gray-500 mt-1">{formatDate(investment.created_at)}</div>
              </div>

              <div>
                <div className="text-sm text-gray-700">{investment.seller_name}</div>
                <div className="text-xs text-gray-500 mt-1">{t("dashboards.investor.table.headers.restaurant")}: {investment.restaurant_name}</div>
              </div>

              <div>
                <StatusBadge status={investment.status} />
              </div>

              <div className="text-sm font-medium text-gray-700">
                {formatPrice(investment.product.price_demanded * investment.quantity)}
                <div className="text-xs text-gray-500 mt-1">{t("dashboards.investor.table.labels.quantity")}: {investment.quantity}</div>
              </div>

              <div className="text-sm font-bold" style={{ color: primaryColors.dark }}>
                {formatPrice(investment.price_restaurant * investment.quantity)}
                <div className="text-xs text-gray-500 mt-1">
                  {t("dashboards.investor.table.labels.profit")}:{" "}
                  {formatPrice((investment.price_restaurant - investment.product.price_demanded) * investment.quantity)}
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleViewDetails(investment.investment_id)}
                  className="text-xs font-medium px-3 py-1 rounded-full transition-colors"
                  style={{
                    backgroundColor: `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
                      primaryColors.dark.slice(3, 5),
                      16,
                    )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
                    color: primaryColors.dark,
                  }}
                >
                  {t("dashboards.investor.table.actions.details")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
