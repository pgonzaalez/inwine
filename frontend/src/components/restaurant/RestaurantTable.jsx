"use client"

import { DollarSignIcon, Store, Trash2, Edit } from "lucide-react"
import { StatusBadge } from "./StatusBadge"
import { primaryColors } from "./utils/colors"

// Función para formatear el precio con separador de miles
const formatPrice = (price) => {
  return new Intl.NumberFormat("ca-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price)
}

export const RestaurantTable = ({
  requests,
  baseUrl,
  onDelete,
  handleReceiveProduct,
  handleSellProduct,
  receivingProduct,
  sellingProduct,
}) => {
  if (requests.length === 0) {
    return (
      <div className="bg-white text-center p-8 rounded-xl shadow-sm">
        No hi ha sol·licituds disponibles amb aquest filtre
      </div>
    )
  }

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ca-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDelete = (e, id) => {
    e.preventDefault()
    e.stopPropagation()

    if (window.confirm("Estàs segur que vols eliminar aquesta sol·licitud?")) {
      onDelete(id)
    }
  }

  const handleEdit = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `/restaurant/requests/${id}/edit`
  }

  const handleRowClick = (id) => {
    window.location.href = `/restaurant/requests/${id}`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
          Les teves sol·licituds
        </h2>
        <span className="text-sm text-gray-500">
          {requests.length} {requests.length === 1 ? "sol·licitud" : "sol·licituds"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imatge</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalls
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr
                key={request.id || `request-${Math.random()}`}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleRowClick(request.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-24 h-24 overflow-hidden rounded-lg">
                    <img
                      src={`${baseUrl}${request.product.image}`}
                      alt={request.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900 mb-1">{request.product.name}</div>
                    <div className="text-sm text-gray-500">
                      {request.product.year} · {request.product.origin}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {request.product.wine_type || "Vi"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <DollarSignIcon size={14} className="text-gray-500" />
                      <span className="text-xs text-gray-500">Demanat:</span>
                      <span className="text-sm">{request.product.price_demanded}€</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Store size={14} className="text-gray-500" />
                      <span className="text-xs text-gray-500">Restaurant:</span>
                      <span className="text-sm font-bold" style={{ color: primaryColors.dark }}>
                        {request.price_restaurant}€
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(request.created_at)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={(e) => handleEdit(e, request.id)}
                          className="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 transition-colors"
                          title="Editar sol·licitud"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={(e) => handleDelete(e, request.id)}
                          className="p-1.5 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors"
                          title="Eliminar sol·licitud"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}

                    {request.status === "in_transit" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleReceiveProduct(request.product.id)
                        }}
                        disabled={receivingProduct === request.product.id}
                        className={`px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center ${
                          receivingProduct === request.product.id ? "opacity-70" : "hover:opacity-90"
                        }`}
                        style={{
                          backgroundColor: primaryColors.dark,
                          cursor: receivingProduct === request.product.id ? "wait" : "pointer",
                        }}
                      >
                        {receivingProduct === request.product.id ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                            Rebent...
                          </>
                        ) : (
                          <>
                            <Store size={16} className="mr-2" />
                            He rebut
                          </>
                        )}
                      </button>
                    )}

                    {request.status === "in_my_local" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleSellProduct(request.product.id)
                        }}
                        disabled={sellingProduct === request.product.id}
                        className={`px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center ${
                          sellingProduct === request.product.id ? "opacity-70" : "hover:opacity-90"
                        }`}
                        style={{
                          backgroundColor: "#10B981", // Verde esmeralda
                          cursor: sellingProduct === request.product.id ? "wait" : "pointer",
                        }}
                      >
                        {sellingProduct === request.product.id ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                            Venent...
                          </>
                        ) : (
                          <>
                            <DollarSignIcon size={16} className="mr-2" />
                            He venut
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Importar la función getWineTypeColor desde utils/colors
function getWineTypeColor(type) {
  const primaryColors = {
    dark: "#9A3E50",
    light: "#C27D7D",
    background: "#F9F9F9",
  }

  switch (type?.toLowerCase()) {
    case "negre":
      return "#2D1B1E" // Color oscuro para vino tinto
    case "blanc":
      return "#F7F5E8" // Color claro para vino blanco
    case "rossat":
      return primaryColors.light // Color rosado para vino rosado
    case "espumós":
      return "#F2EFD3" // Color champán para espumoso
    case "dolç":
      return "#E8D0B5" // Color ámbar para vino dulce
    default:
      return `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
        primaryColors.dark.slice(3, 5),
        16,
      )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)` // Color por defecto
  }
}

