"use client"

import { DollarSignIcon, Store, Trash2, Edit, Filter, Eye } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from 'react-router-dom';

const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

const formatDate = (dateString, lang) =>
  new Date(dateString).toLocaleDateString(lang === 'ca' ? 'ca-ES' : lang === 'es' ? 'es-ES' : 'en-US', {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

const getWineTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case "negre":
      return "#2D1B1E"
    case "blanc":
      return "#F7F5E8"
    case "rossat":
      return primaryColors.light
    case "espumós":
      return "#F2EFD3"
    case "dolç":
      return "#EBBF99"
    default:
      return `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
        primaryColors.dark.slice(3, 5),
        16,
      )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "accepted":
      return "bg-green-100 text-green-800"
    case "in_transit":
      return "bg-blue-100 text-blue-800"
    case "in_my_local":
      return "bg-green-400 text-green-800"
    case "sold":
      return "bg-gray-200 text-gray-700"
    default:
      return "bg-gray-100 text-gray-500"
  }
}

 const getStatusText = (status, t) => {
  switch (status) {
    case "pending":
      return t("dashboards.restaurant.status.pending")
    case "in_transit":
      return t("dashboards.restaurant.status.in_transit")
    case "in_my_local":
      return t("dashboards.restaurant.status.in_my_local")
    case "sold":
      return t("dashboards.restaurant.status.sold")
    case "accepted":
      return t("dashboards.restaurant.status.accepted")
    default:
      return t(`dashboards.restaurant.status.${status}`, { defaultValue: status.replace(/_/g, " ") })
  }
}

export const RestaurantTable = ({
  requests,
  baseUrl,
  onDelete,
  onEdit,
  handleReceiveProduct,
  handleSellProduct,
  receivingProduct,
  sellingProduct,
  activeFilter,
   setActiveFilter,
}) => {
  const { t, i18n } = useTranslation()
  const filters = [
    { id: "all", label: t("dashboards.restaurant.filters.all") },
    { id: "pending", label: t("dashboards.restaurant.filters.pending") },
    { id: "accepted", label: t("dashboards.restaurant.filters.accepted") },
    { id: "in_transit", label: t("dashboards.restaurant.filters.in_transit") },
    { id: "in_my_local", label: t("dashboards.restaurant.filters.in_my_local") },
    { id: "sold", label: t("dashboards.restaurant.filters.sold") },
  ]

  const filteredRequests = activeFilter === "all" ? requests : requests.filter((r) => r.status === activeFilter)

  const navigate = useNavigate();

  const handleRowClick = (id) => {
    navigate(`/restaurant/requests/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b">
         <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
            {t("dashboards.restaurant.table.title")}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredRequests.length} {filteredRequests.length === 1 ? t("dashboards.restaurant.table.count_singular") : t("dashboards.restaurant.table.count_plural")}
          </span>
        </div>

        <div className="px-4 pb-4">
           <div className="flex items-center gap-2 mb-2">
            <Filter size={16} style={{ color: primaryColors.dark }} />
            <span className="text-sm font-medium" style={{ color: primaryColors.dark }}>
              {t("dashboards.restaurant.filters.title")}
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

       {/* Desktop Header */}
      <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1.5fr_1fr_1.5fr] gap-4 bg-gray-50 px-6 py-3">
        <div className="text-xs font-medium text-gray-500 uppercase">{t("dashboards.restaurant.table.cols.image")}</div>
        <div className="text-xs font-medium text-gray-500 uppercase">{t("dashboards.restaurant.table.cols.details")}</div>
        <div className="text-xs font-medium text-gray-500 uppercase">{t("dashboards.restaurant.table.cols.type")}</div>
        <div className="text-xs font-medium text-gray-500 uppercase">{t("dashboards.restaurant.table.cols.status")}</div>
        <div className="text-xs font-medium text-gray-500 uppercase">{t("dashboards.restaurant.table.cols.prices")}</div>
        <div className="text-xs font-medium text-gray-500 uppercase">{t("dashboards.restaurant.table.cols.date")}</div>
        <div className="text-xs font-medium text-gray-500 uppercase">{t("dashboards.restaurant.table.cols.actions")}</div>
      </div>

       {/* Body */}
      {filteredRequests.length === 0 ? (
        <div className="text-center p-8">{t("dashboards.restaurant.table.empty")}</div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleRowClick(request.id)}
            >
              {/* Mobile Layout */}
              <div className="md:hidden grid grid-cols-[120px_1fr] gap-4 p-4">
                <div className="relative">
                  <div className="w-full h-28 overflow-hidden rounded-lg">
                    <img
                      src={`${baseUrl}${request.product.image}`}
                      alt={request.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col relative">
                  {/* Price at top right */}
                  <div className="absolute top-0 right-0 text-sm font-bold" style={{ color: primaryColors.dark }}>
                    {request.price_restaurant}€
                  </div>

                  <div className="text-sm font-medium text-gray-900 mb-1 pr-20">{request.product.name}</div>
                  <div className="text-xs text-gray-500 mb-2">
                    {request.product.year} · {request.product.origin}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className="px-2 py-1 text-xs font-semibold rounded-full"
                      style={{
                        backgroundColor: getWineTypeColor(request.product.wine_type),
                        color: ["blanc", "espumós"].includes(request.product.wine_type?.toLowerCase())
                          ? "#333"
                          : "white",
                      }}
                     >
                      {request.product.wine_type || t("dashboards.restaurant.view.not_specified")}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status, t)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 mb-3">
                     <div className="text-xs flex items-center">
                      <DollarSignIcon size={12} className="mr-1 text-gray-500" />
                      <span>{t("dashboards.restaurant.view.price_demanded")}: {request.product.price_demanded}€</span>
                    </div>
                    <div className="text-xs text-gray-500">{t("dashboards.restaurant.view.request_date")}: {formatDate(request.created_at, i18n.language)}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRowClick(request.id)
                      }}
                      className="p-1.5 bg-green-100 hover:bg-green-200 rounded-full text-green-600"
                    >
                      <Eye size={16} />
                    </button>

                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEdit(request); // Pasar el objeto completo de la solicitud
                          }}
                          className="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(request.id);
                      }}
                          className="p-1.5 bg-red-100 hover:bg-red-200 rounded-full text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                    {request.status === "in_transit" && (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleReceiveProduct(request.product.id)
                        }}
                         disabled={receivingProduct === request.product.id}
                        className="px-3 py-1 text-xs rounded-lg font-medium text-white bg-[#9A3E50] w-full"
                      >
                        {receivingProduct === request.product.id ? t("dashboards.restaurant.table.actions.receiving") : t("dashboards.restaurant.table.actions.receive")}
                      </button>
                    )}
                    {request.status === "in_my_local" && (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleSellProduct(request.product.id)
                        }}
                         disabled={sellingProduct === request.product.id}
                        className="px-3 py-1 text-xs rounded-lg font-medium text-white bg-emerald-500 w-full"
                      >
                        {sellingProduct === request.product.id ? t("dashboards.restaurant.table.actions.selling") : t("dashboards.restaurant.table.actions.sell")}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1.5fr_1fr_1.5fr] gap-4 items-center px-6 py-4">
                <div className="w-24 h-24 overflow-hidden rounded-lg">
                  <img
                    src={`${baseUrl}${request.product.image}`}
                    alt={request.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{request.product.name}</span>
                  <span className="text-sm text-gray-500">
                    {request.product.year} · {request.product.origin}
                  </span>
                </div>
                <div>
                  <span
                    className="px-2 py-1 text-xs font-semibold rounded-full"
                    style={{
                      backgroundColor: getWineTypeColor(request.product.wine_type),
                      color: ["blanc", "espumós"].includes(request.product.wine_type?.toLowerCase()) ? "#333" : "white",
                    }}
                   >
                    {request.product.wine_type || t("dashboards.restaurant.view.not_specified")}
                  </span>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {getStatusText(request.status, t)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm">
                    <DollarSignIcon size={14} className="inline mr-1 text-gray-500" />
                    {request.product.price_demanded}€
                  </span>
                  <span className="text-sm font-bold" style={{ color: primaryColors.dark }}>
                    <Store size={14} className="inline mr-1 text-gray-500" />
                     {request.price_restaurant}€
                  </span>
                </div>
                <div className="text-sm text-gray-500">{formatDate(request.created_at, i18n.language)}</div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRowClick(request.id)
                    }}
                    className="p-1.5 bg-green-100 hover:bg-green-200 rounded-full text-green-600"
                  >
                    <Eye size={16} />
                  </button>
                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEdit(request); // Pasar el objeto completo de la solicitud
                        }}
                        className="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                       onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(request.id);
                      }}
                        className="p-1.5 bg-red-100 hover:bg-red-200 rounded-full text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                  {request.status === "in_transit" && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleReceiveProduct(request.product.id)
                      }}
                       disabled={receivingProduct === request.product.id}
                      className="px-4 py-2 rounded-lg font-medium text-white bg-[#9A3E50]"
                    >
                      {receivingProduct === request.product.id ? t("dashboards.restaurant.table.actions.receiving") : t("dashboards.restaurant.table.actions.receive")}
                    </button>
                  )}
                  {request.status === "in_my_local" && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleSellProduct(request.product.id)
                      }}
                       disabled={sellingProduct === request.product.id}
                      className="px-4 py-2 rounded-lg font-medium text-white bg-emerald-500"
                    >
                      {sellingProduct === request.product.id ? t("dashboards.restaurant.table.actions.selling") : t("dashboards.restaurant.table.actions.sell")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
