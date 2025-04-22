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

      {/* Header - Only visible on tablet and desktop */}
      <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-50 px-6 py-3">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Imatge</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Detalls</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tipus</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Estat</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Preu</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Accions</div>
      </div>

      {/* Wine Grid */}
      <div className="divide-y divide-gray-200">
        {wines.map((wine) => (
          <div key={wine.id || `wine-${wine.name}`} className="hover:bg-gray-50 transition-colors">
            {/* Mobile Layout */}
            <div className="md:hidden grid grid-cols-[120px_1fr] gap-4 p-4">
              <div className="relative">
                <div className="w-full h-28 overflow-hidden rounded-lg">
                  <img src={`${baseUrl}${wine.image}`} alt={wine.name} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex flex-col relative">
                {/* Price at top right */}
                <div className="absolute top-0 right-0 text-sm font-bold" style={{ color: primaryColors.dark }}>
                  {formatPrice(wine.price_demanded)}
                </div>

                <div className="text-sm font-medium text-gray-900 mb-1 pr-20">{wine.name}</div>
                <div className="text-xs text-gray-500 mb-2">
                  {wine.year} · {wine.origin}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
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

                  <StatusBadge status={wine.status} />
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
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
                      className={`px-3 py-1 rounded-full text-xs font-medium text-white transition-colors flex items-center ${
                        sendingProduct === wine.id ? "opacity-70" : "hover:opacity-90"
                      }`}
                      style={{
                        backgroundColor: primaryColors.dark,
                        cursor: sendingProduct === wine.id ? "wait" : "pointer",
                      }}
                    >
                      {sendingProduct === wine.id ? (
                        <>
                          <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"></div>
                          Enviant...
                        </>
                      ) : (
                        <>
                          <Send size={12} className="mr-1" />
                          Enviar
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tablet/Desktop Layout */}
            <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4">
              <div className="w-32 h-32 overflow-hidden rounded-lg">
                <img src={`${baseUrl}${wine.image}`} alt={wine.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-900 mb-1">{wine.name}</div>
                <div className="text-sm text-gray-500">
                  {wine.year} · {wine.origin}
                </div>
              </div>

              <div>
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
              </div>

              <div>
                <StatusBadge status={wine.status} />
              </div>

              <div className="text-sm font-bold" style={{ color: primaryColors.dark }}>
                {formatPrice(wine.price_demanded)}
              </div>

              <div className="flex flex-wrap gap-2">
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
                    className={`px-4 py-1 rounded-lg text-xs font-medium text-white transition-colors flex items-center ${
                      sendingProduct === wine.id ? "opacity-70" : "hover:opacity-90"
                    }`}
                    style={{
                      backgroundColor: primaryColors.dark,
                      cursor: sendingProduct === wine.id ? "wait" : "pointer",
                    }}
                  >
                    {sendingProduct === wine.id ? (
                      <>
                        <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"></div>
                        Enviant...
                      </>
                    ) : (
                      <>
                        <Send size={12} className="mr-1" />
                        Enviar
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
