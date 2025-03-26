"use client"

import { StatusBadge } from "@components/seller/StatusBadge"

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

export const WineCard = ({ wine, user, baseUrl }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md hover:translate-y-[-2px]"
      onClick={() => (window.location.href = `/seller/products/${wine.id}`)}
    >
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={`${baseUrl}${wine.image}`}
            alt={wine.name}
            className="w-full h-full object-contain transition-transform hover:scale-105"
          />
        </div>
        <div
          className="absolute top-0 left-0 w-2 h-full"
          style={{
            backgroundColor: getWineTypeColor(wine.wine_type?.toLowerCase()),
          }}
        ></div>
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium"
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
      <div className="p-4">
        <h3 className="font-medium text-lg truncate">{wine.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-500">
            {wine.year} · {wine.origin}
          </p>
          <StatusBadge status={wine.status || "active"} />
        </div>
        <div className="mt-3 flex justify-between items-center">
          <p className="text-xl font-bold" style={{ color: primaryColors.dark }}>
            {wine.price_demanded}€
          </p>
          <button
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
        </div>
      </div>
    </div>
  )
}

