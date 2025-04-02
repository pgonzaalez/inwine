"use client"

import { Send } from "lucide-react"
import { StatusBadge } from "@components/seller/wineManagement/StatusBadge"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

// Función para obtener el color de fondo según el tipo de vino
const getWineTypeColor = (type) => {
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

export const WineTable = ({ wines, baseUrl, handleSendProduct, sendingProduct }) => {
  if (wines.length === 0) {
    return (
      <div className="bg-white text-center p-8 rounded-xl shadow-sm">No hi ha vins disponibles amb aquest filtre</div>
    )
  }

  // Función para formatear el precio con separador de miles
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ca-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
          Els teus vins
        </h2>
        <span className="text-sm text-gray-500">
          {wines.length} {wines.length === 1 ? "vi" : "vins"}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {wines.map((wine) => (
              <tr key={wine.id || `wine-${wine.name}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-32 h-32 overflow-hidden rounded-lg">
                    <img src={`${baseUrl}${wine.image}`} alt={wine.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900 mb-1">{wine.name}</div>
                    <div className="text-sm text-gray-500">
                      {wine.year} · {wine.origin}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    style={{
                      backgroundColor: getWineTypeColor(wine.wine_type?.toLowerCase()),
                      color:
                        wine.wine_type?.toLowerCase() === "blanc" || wine.wine_type?.toLowerCase() === "espumós"
                          ? "#333"
                          : "white",
                    }}
                  >
                    {wine.wine_type || "Vi"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={wine.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold" style={{ color: primaryColors.dark }}>
                    {formatPrice(wine.price_demanded)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.location.href = `/seller/products/${wine.id}`
                      }}
                      className="text-xs font-medium px-3 py-1 rounded-full transition-colors"
                      style={{
                        backgroundColor: `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
                          primaryColors.dark.slice(3, 5),
                          16,
                        )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
                        color: primaryColors.dark,
                      }}
                    >
                      Detalls
                    </button>

                    {wine.status === "requested" && (
                      <button
                        type="button"
                        onClick={() => handleSendProduct(wine.id)}
                        disabled={sendingProduct === wine.id}
                        className={`px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center ${
                          sendingProduct === wine.id ? "opacity-70" : "hover:opacity-90"
                        }`}
                        style={{
                          backgroundColor: primaryColors.dark,
                          cursor: sendingProduct === wine.id ? "wait" : "pointer",
                        }}
                      >
                        {sendingProduct === wine.id ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                            Enviant...
                          </>
                        ) : (
                          <>
                            <Send size={16} className="mr-2" />
                            Enviar
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

