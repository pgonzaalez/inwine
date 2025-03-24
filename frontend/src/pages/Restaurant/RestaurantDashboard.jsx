"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Wine, ShoppingBag, TrendingUp, Check } from "lucide-react"
import { useFetchUser } from "@components/auth/FetchUser"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
}

// Componente de tarjeta de estadísticas
const StatCard = ({ title, value, icon, trend, percentage }) => {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col transition-all duration-300 hover:translate-y-[-2px] shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div
          className="p-2 rounded-lg"
          style={{
            backgroundColor: `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(primaryColors.dark.slice(3, 5), 16)}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
          }}
        >
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${percentage >= 0 ? "text-green-600" : "text-red-600"}`}>
            {percentage >= 0 ? "+" : ""}
            {percentage}%
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`ml-1 w-4 h-4 ${percentage < 0 ? "transform rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        )}
      </div>
      <div className="text-gray-500 text-sm mb-1">{title}</div>
      <div className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
        {value}
      </div>
    </div>
  )
}

// Componente para mostrar los últimos vinos creados
const LatestWines = ({ wines = [] }) => {
  const baseUrl = import.meta.env.VITE_URL_BASE
  const sortedWines = [...wines].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3)

  return (
    <div className="bg-white rounded-xl p-5 transition-all duration-300 hover:translate-y-[-2px] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg" style={{ color: primaryColors.dark }}>
          Últims vins creats
        </h3>
        <Link
          to="/seller/products"
          className="text-sm font-medium hover:underline"
          style={{ color: primaryColors.light }}
        >
          Veure tots
        </Link>
      </div>
      <div className="space-y-4">
        {sortedWines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Wine size={48} style={{ color: primaryColors.light }} />
            <p className="mt-4">No hi ha vins creats recentment</p>
          </div>
        ) : (
          sortedWines.map((wine) => (
            <div
              key={wine.id}
              className="flex items-center justify-between py-3 border-b"
              style={{
                borderColor: `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(primaryColors.dark.slice(3, 5), 16)}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img src={`${baseUrl}${wine.image}`} alt={wine.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium">{wine.name}</p>
                  <p className="text-sm text-gray-500">
                    {wine.year} · {wine.type || "Vi"} ·{new Date(wine.created_at).toLocaleDateString("ca-ES")}
                  </p>
                </div>
              </div>
              <div className="font-bold" style={{ color: primaryColors.dark }}>
                {wine.price_demanded}€
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Componente para mostrar los últimos vinos vendidos
const LatestSoldWines = ({ wines = [] }) => {
  const baseUrl = import.meta.env.VITE_URL_BASE
  const soldWines = wines
    .filter((wine) => wine.status === "sold")
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5)

  return (
    <div className="bg-white rounded-xl p-5 transition-all duration-300 hover:translate-y-[-2px] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg" style={{ color: primaryColors.dark }}>
          Últims vins venuts
        </h3>
        <Link
          to="/seller/wine-management"
          className="text-sm font-medium hover:underline"
          style={{ color: primaryColors.light }}
        >
          Veure tots
        </Link>
      </div>
      <div className="space-y-4">
        {soldWines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Check size={48} style={{ color: primaryColors.light }} />
            <p className="mt-4">No hi ha vins venuts recentment</p>
          </div>
        ) : (
          soldWines.map((wine) => (
            <div
              key={wine.id}
              className="flex items-center justify-between py-3 border-b"
              style={{
                borderColor: `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(primaryColors.dark.slice(3, 5), 16)}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img src={`${baseUrl}${wine.image}`} alt={wine.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium">{wine.name}</p>
                  <p className="text-sm text-gray-500">
                    {wine.year} · {wine.type || "Vi"} ·{new Date(wine.updated_at).toLocaleDateString("ca-ES")}
                  </p>
                </div>
              </div>
              <div className="font-bold" style={{ color: primaryColors.dark }}>
                {wine.price_demanded}€
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Componente principal del Dashboard
const SellerDashboardContent = () => {
  const [wines, setWines] = useState([])
  const { user } = useFetchUser()
  const apiUrl = import.meta.env.VITE_API_URL

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
      } catch (error) {
        // console.error(error)
      }
    }

    fetchWines()
  }, [user])

  // Calcular estadísticas basadas en datos reales
  const stats = {
    totalProducts: wines.length,
    activeProducts: wines.filter((wine) => wine.status === "active").length || 0,
    totalSales: wines.filter((wine) => wine.status === "sold").length || 0,
    revenue: wines.filter((wine) => wine.status === "sold").reduce((sum, wine) => sum + (wine.price_demanded || 0), 0),
  }

  return (
    <>
      {/* Cabecera del dashboard */}
      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          Benvingut, {user?.name || "Venedor"}
        </h1>
        <p className="text-gray-600">Gestiona els teus productes i segueix les teves vendes</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Productes"
          value={stats.totalProducts}
          icon={<Wine size={20} style={{ color: primaryColors.dark }} />}
          trend={true}
          percentage={5}
        />
        <StatCard
          title="Productes Actius"
          value={stats.activeProducts}
          icon={<ShoppingBag size={20} style={{ color: primaryColors.dark }} />}
          trend={true}
          percentage={2}
        />
        <StatCard
          title="Total Vendes"
          value={stats.totalSales}
          icon={<BarChart3 size={20} style={{ color: primaryColors.dark }} />}
          trend={true}
          percentage={12}
        />
        <StatCard
          title="Ingressos (€)"
          value={stats.revenue.toFixed(2)}
          icon={<TrendingUp size={20} style={{ color: primaryColors.dark }} />}
          trend={true}
          percentage={8}
        />
      </div>

      {/* Sección con últimos vinos creados y vendidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatestWines wines={wines} />
        <LatestSoldWines wines={wines} />
      </div>
    </>
  )
}

export default function SellerDashboardPage() {
  const { loading } = useFetchUser()

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <div className="flex-1 md:ml-64 p-4 md:p-6 overflow-y-auto pb-16" style={{ backgroundColor: "#F9F9F9" }}>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div
                className="w-10 h-10 rounded-full animate-spin"
                style={{
                  borderWidth: "3px",
                  borderStyle: "solid",
                  borderColor: primaryColors.light,
                  borderTopColor: primaryColors.dark,
                }}
              ></div>
            </div>
          ) : (
            <SellerDashboardContent />
          )}
        </div>
      </div>
    </div>
  )
}

