"use client"
import { useFetchUser } from "@components/auth/FetchUser"
import { useState, useEffect } from "react"
import { Filter } from "lucide-react"
import { WineCard } from "@components/seller/WineCard"
import { WineStats } from "@components/seller/WineStats"

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

// Componente para mostrar la distribución de vinos por tipo
const WineTypeDistribution = ({ wines = [] }) => {
  // Contar vinos por tipo
  const wineTypes = ["Negre", "Blanc", "Rossat", "Espumós", "Dolç", "Altres"]

  const typeCount = wineTypes.reduce((acc, type) => {
    acc[type] = wines.filter(
      (wine) => wine.wine_type?.toLowerCase() === type.toLowerCase() || (!wine.wine_type && type === "Altres"),
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
                style={{
                  backgroundColor: getWineTypeColor(type.toLowerCase()),
                }}
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

function WineManagementComponent() {
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
      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          Gestiona els teus Vins
        </h1>
      </div>

      {/* Estadísticas */}
      <WineStats wines={wines} />

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
                ? {
                    background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                  }
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
                ? {
                    background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                  }
                : {}
            }
            onClick={() => setActiveFilter("active")}
          >
            Actius
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === "waiting" ? "text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            style={
              activeFilter === "waiting"
                ? {
                    background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                  }
                : {}
            }
            onClick={() => setActiveFilter("waiting")}
          >
            En espera
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === "sold" ? "text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            style={
              activeFilter === "sold"
                ? {
                    background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                  }
                : {}
            }
            onClick={() => setActiveFilter("sold")}
          >
            Venuts
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lista de vinos */}
        <div className="lg:col-span-3">
          {filteredWines.length === 0 ? (
            <div className="bg-white text-center p-8 rounded-xl shadow-sm">
              No hi ha vins disponibles amb aquest filtre
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
                  Els teus vins
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredWines.length} {filteredWines.length === 1 ? "vi" : "vins"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWines.map((wine) => (
                  <WineCard key={wine.id} wine={wine} user={user} baseUrl={baseUrl} />
                ))}
              </div>
            </div>
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

export default function WineManagementPage() {
  const { user, loading } = useFetchUser()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <div
          className="flex-1 md:ml-64 p-8 overflow-y-auto pb-16"
          style={{ backgroundColor: primaryColors.background }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div
                className="w-12 h-12 rounded-full animate-spin"
                style={{
                  borderWidth: "4px",
                  borderStyle: "solid",
                  borderColor: primaryColors.light,
                  borderTopColor: primaryColors.dark,
                }}
              ></div>
            </div>
          ) : (
            <WineManagementComponent />
          )}
        </div>
      </div>
    </div>
  )
}

