"use client"

import { useState, useEffect } from "react"
import { useFetchUser } from "@components/auth/FetchUser"
import { Wine, Check, Clock, BarChart3, Filter } from "lucide-react"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
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
      return `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(primaryColors.dark.slice(3, 5), 16)}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)` // Color por defecto
  }
}

// Componente para mostrar el estado del vino
const StatusBadge = ({ status }) => {
  let icon, text, bgColor, textColor

  switch (status) {
    case "sold":
      icon = <Check size={14} />
      text = "Venut"
      bgColor = "#D1E7DD"
      textColor = "#0F5132"
      break
    case "process":
      icon = <Clock size={14} />
      text = "En procés"
      bgColor = "#FFF3CD"
      textColor = "#856404"
      break
    case "active":
    default:
      icon = <Wine size={14} />
      text = "Actiu"
      bgColor = `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(primaryColors.dark.slice(3, 5), 16)}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`
      textColor = primaryColors.dark
  }

  return (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {icon}
      <span>{text}</span>
    </div>
  )
}

// Componente para mostrar estadísticas de vinos
const WineStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.total}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Wine size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">Actius</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.active}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">En procés</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.process}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Check size={18} style={{ color: primaryColors.dark }} />
          <p className="text-sm text-gray-600">Venuts</p>
        </div>
        <p className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {stats.sold}
        </p>
      </div>
    </div>
  )
}

// Componente para mostrar la distribución de vinos por tipo
const WineTypeDistribution = ({ wines = [] }) => {
  // Contar vinos por tipo
  const wineTypes = ["Negre", "Blanc", "Rossat", "Espumós", "Dolç", "Altres"]

  const typeCount = wineTypes.reduce((acc, type) => {
    acc[type] = wines.filter(
      (wine) => wine.type?.toLowerCase() === type.toLowerCase() || (!wine.type && type === "Altres"),
    ).length
    return acc
  }, {})

  // Calcular el total para los porcentajes
  const total = wines.length

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-bold mb-4" style={{ color: primaryColors.dark }}>
        Distribució per tipus
      </h3>

      <div className="space-y-4">
        {wineTypes.map((type) => {
          const count = typeCount[type] || 0
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0

          return (
            <div key={type} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: getWineTypeColor(type.toLowerCase()) }}
              ></div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1">
                  <span className="font-medium truncate">{type}</span>
                  <span className="ml-2 flex-shrink-0">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: getWineTypeColor(type.toLowerCase()),
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Componente para mostrar un vino en formato de tarjeta
const WineCard = ({ wine, user, baseUrl }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md"
      onClick={() => (window.location.href = `/seller/${user?.id}/products/${wine.id}`)}
    >
      <div className="flex items-center p-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img src={`${baseUrl}${wine.image}`} alt={wine.name} className="w-full h-full object-cover" />
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <h3 className="font-medium truncate">{wine.name}</h3>
          <p className="text-sm text-gray-500 truncate">
            {wine.year} · {wine.type || "Vi"}
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="font-bold" style={{ color: primaryColors.dark }}>
              {wine.price_demanded}€
            </p>
            <StatusBadge status={wine.status || "active"} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WineManagement() {
  const [wines, setWines] = useState([])
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const { user } = useFetchUser()
  const apiUrl = import.meta.env.VITE_API_URL
  const baseUrl = import.meta.env.VITE_URL_BASE

  useEffect(() => {
    const fetchWines = async () => {
      if (!user) return
      try {
        const response = await fetch(`${apiUrl}/v1/${user.id}/products`)
        if (!response.ok) {
          throw new Error("No s'ha pogut connectar amb el servidor")
        }
        const data = await response.json()
        if (data) {
          setWines(Array.isArray(data) ? data : [data])
        } else {
          setWines([])
        }
      } catch (err) {
        setError(err.message)
      }
    }

    fetchWines()
  }, [user])

  // Filtrar vinos según el estado seleccionado
  const filteredWines = activeFilter === "all" ? wines : wines.filter((wine) => wine.status === activeFilter)

  // Agrupar vinos por tipo
  const winesByType = filteredWines.reduce((acc, wine) => {
    const type = wine.type || "Altres"
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(wine)
    return acc
  }, {})

  // Estadísticas de vinos
  const stats = {
    total: wines.length,
    active: wines.filter((wine) => wine.status === "active").length,
    process: wines.filter((wine) => wine.status === "process").length,
    sold: wines.filter((wine) => wine.status === "sold").length,
  }

  if (error) {
    return (
      <div
        className="bg-white text-center p-8 rounded-xl shadow-sm"
        style={{
          borderLeft: `4px solid ${primaryColors.dark}`,
          color: primaryColors.dark,
        }}
      >
        {error}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: primaryColors.dark }}>
        Gestió de Vins
      </h1>

      {/* Estadísticas */}
      <WineStats stats={stats} />

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} style={{ color: primaryColors.dark }} />
          <h3 className="text-lg font-bold" style={{ color: primaryColors.dark }}>
            Filtres
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === "all" ? "text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            style={
              activeFilter === "all"
                ? { background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})` }
                : {}
            }
            onClick={() => setActiveFilter("all")}
          >
            Tots
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === "active" ? "text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            style={
              activeFilter === "active"
                ? { background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})` }
                : {}
            }
            onClick={() => setActiveFilter("active")}
          >
            Actius
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === "process" ? "text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            style={
              activeFilter === "process"
                ? { background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})` }
                : {}
            }
            onClick={() => setActiveFilter("process")}
          >
            En procés
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === "sold" ? "text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            style={
              activeFilter === "sold"
                ? { background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})` }
                : {}
            }
            onClick={() => setActiveFilter("sold")}
          >
            Venuts
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de vinos */}
        <div className="lg:col-span-2">
          {Object.keys(winesByType).length === 0 ? (
            <div className="bg-white text-center p-8 rounded-xl shadow-sm">
              No hi ha vins disponibles amb aquest filtre
            </div>
          ) : (
            Object.entries(winesByType).map(([type, wines]) => (
              <div key={type} className="bg-white rounded-xl p-5 shadow-sm mb-6">
                <div className="flex items-center mb-4">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: getWineTypeColor(type.toLowerCase()) }}
                  ></div>
                  <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
                    {type}
                  </h2>
                  <span className="ml-2 text-sm font-normal text-gray-500">({wines.length})</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {wines.map((wine) => (
                    <WineCard key={wine.id} wine={wine} user={user} baseUrl={baseUrl} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Distribución por tipo */}
        <div className="lg:col-span-1">
          <WineTypeDistribution wines={wines} />
        </div>
      </div>
    </div>
  )
}

