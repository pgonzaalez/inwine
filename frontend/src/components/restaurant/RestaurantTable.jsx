"use client"

import { DollarSignIcon, Store, Trash2, Edit, Filter, Eye } from "lucide-react"
import { useNavigate } from 'react-router-dom';

const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("ca-ES", {
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
      return "#E8D0B5"
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

const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return "Pendent"
    case "in_transit":
      return "En Trànsit"
    case "in_my_local":
      return "Al Local"
    case "sold":
      return "Venut"
    case "accepted":
      return "Acceptat"
    default:
      return status.replace(/_/g, " ")
  }
}

export const RestaurantTable = ({
  requests,
  baseUrl,
  onDelete,
  handleReceiveProduct,
  handleSellProduct,
  receivingProduct,
  sellingProduct,
  activeFilter,
  setActiveFilter,
}) => {
  const filters = [
    { id: "all", label: "Tots" },
    { id: "pending", label: "Pendents" },
    { id: "accepted", label: "Acceptats" },
    { id: "in_transit", label: "En Trànsit" },
    { id: "in_my_local", label: "Al Local" },
    { id: "sold", label: "Venuts" },
  ]

  const filteredRequests = activeFilter === "all" ? requests : requests.filter((r) => r.status === activeFilter)

  const handleDelete = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm("Estàs segur que vols eliminar aquesta sol·licitud?")) onDelete(id)
  }

  const handleEdit = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `/restaurant/${id}/edit`
  }
  
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
            Les teves sol·licituds
          </h2>
          <span className="text-sm text-gray-500">
            {filteredRequests.length} {filteredRequests.length === 1 ? "sol·licitud" : "sol·licituds"}
          </span>
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter size={16} style={{ color: primaryColors.dark }} />
            <span className="text-sm font-medium" style={{ color: primaryColors.dark }}>
              Filtres
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
        <div className="text-xs font-medium text-gray-500 uppercase">Imatge</div>
        <div className="text-xs font-medium text-gray-500 uppercase">Detalls</div>
        <div className="text-xs font-medium text-gray-500 uppercase">Tipus</div>
        <div className="text-xs font-medium text-gray-500 uppercase">Estat</div>
        <div className="text-xs font-medium text-gray-500 uppercase">Preus</div>
        <div className="text-xs font-medium text-gray-500 uppercase">Data</div>
        <div className="text-xs font-medium text-gray-500 uppercase">Accions</div>
      </div>

      {/* Body */}
      {filteredRequests.length === 0 ? (
        <div className="text-center p-8">No hi ha sol·licituds disponibles amb aquest filtre</div>
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
                      {request.product.wine_type || "Vi"}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 mb-3">
                    <div className="text-xs flex items-center">
                      <DollarSignIcon size={12} className="mr-1 text-gray-500" />
                      <span>Preu demandat: {request.product.price_demanded}€</span>
                    </div>
                    <div className="text-xs text-gray-500">Data: {formatDate(request.created_at)}</div>
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
                          onClick={(e) => handleEdit(e, request.id)}
                          className="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, request.id)}
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
                        {receivingProduct === request.product.id ? "Rebent..." : "He rebut"}
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
                        {sellingProduct === request.product.id ? "Venent..." : "He venut"}
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
                    {request.product.wine_type || "Vi"}
                  </span>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {getStatusText(request.status)}
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
                <div className="text-sm text-gray-500">{formatDate(request.created_at)}</div>
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
                        onClick={(e) => handleEdit(e, request.id)}
                        className="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, request.id)}
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
                      {receivingProduct === request.product.id ? "Rebent..." : "He rebut"}
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
                      {sellingProduct === request.product.id ? "Venent..." : "He venut"}
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
