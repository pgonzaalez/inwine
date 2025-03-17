"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  BarChart3,
  Wine,
  ShoppingBag,
  TrendingUp,
  Search,
  Filter,
  ArrowUpRight,
  Calendar,
  Plus,
  ArrowDownAZ,
  ArrowUpAZ,
} from "lucide-react"
import WineList from "@components/WineListComponent"
import Header from "@components/HeaderComponent"
import { useFetchUser } from "@components/FetchUser"


// Componente de tarjeta de estadísticas
const StatCard = ({ title, value, icon, color, trend, percentage }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-lg bg-${color}-light`}>{icon}</div>
        {trend && (
          <div className={`flex items-center text-sm ${percentage >= 0 ? "text-green-600" : "text-red-600"}`}>
            {percentage >= 0 ? "+" : ""}
            {percentage}%
            <ArrowUpRight size={16} className={`ml-1 ${percentage < 0 ? "transform rotate-180" : ""}`} />
          </div>
        )}
      </div>
      <div className="text-gray-500 text-sm mb-1">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}

// Componente de filtro de productos
const ProductFilter = ({ activeFilter, setActiveFilter, sortOrder, setSortOrder, searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
          <button
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === "active" ? "bg-[#800020] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("active")}
          >
            Actius
          </button>
          <button
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === "pending" ? "bg-[#800020] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("pending")}
          >
            En espera
          </button>
          <button
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === "sold" ? "bg-[#800020] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("sold")}
          >
            Venuts
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca per nom..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <>
                <ArrowUpAZ size={18} />
                <span className="hidden sm:inline">A-Z</span>
              </>
            ) : (
              <>
                <ArrowDownAZ size={18} />
                <span className="hidden sm:inline">Z-A</span>
              </>
            )}
          </button>

          <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtres</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente de resumen de ventas recientes
const RecentSales = () => {
  // Datos de ejemplo para ventas recientes
  const recentSales = [
    { id: 1, name: "Vi Negre Reserva 2018", price: 24.99, date: "2023-11-15", status: "completed" },
    { id: 2, name: "Cava Brut Nature", price: 18.5, date: "2023-11-12", status: "completed" },
    { id: 3, name: "Vi Blanc Chardonnay", price: 15.75, date: "2023-11-10", status: "completed" },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Vendes recents</h3>
        <Link to="/seller/sales" className="text-[#800020] text-sm font-medium hover:underline">
          Veure totes
        </Link>
      </div>
      <div className="space-y-4">
        {recentSales.map((sale) => (
          <div key={sale.id} className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F5E6E8] flex items-center justify-center">
                <Wine size={18} className="text-[#9A3E50]" />
              </div>
              <div>
                <p className="font-medium">{sale.name}</p>
                <p className="text-sm text-gray-500">{new Date(sale.date).toLocaleDateString("ca-ES")}</p>
              </div>
            </div>
            <div className="font-bold">{sale.price.toFixed(2)}€</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente de calendario de próximos eventos
const UpcomingEvents = () => {
  // Datos de ejemplo para próximos eventos
  const events = [
    { id: 1, title: "Fira de vins locals", date: "2023-12-10", location: "Barcelona" },
    { id: 2, title: "Tast de vins", date: "2023-12-15", location: "Tarragona" },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Propers esdeveniments</h3>
        <Link to="/seller/events" className="text-[#800020] text-sm font-medium hover:underline">
          Veure tots
        </Link>
      </div>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex items-center gap-3 py-2 border-b border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-[#F9F4E3] flex items-center justify-center">
              <Calendar size={18} className="text-[#E6C9A8]" />
            </div>
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleDateString("ca-ES")} · {event.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SellerDashboardPage() {
  const [activeFilter, setActiveFilter] = useState("active")
  const [sortOrder, setSortOrder] = useState("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const { user, loading } = useFetchUser()

  // Datos de ejemplo para las estadísticas
  const stats = {
    totalProducts: 12,
    activeProducts: 8,
    totalSales: 24,
    revenue: 1250.75,
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#800020] rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="flex flex-col mt-[60px] min-h-[calc(100vh-60px)]">
        <div className="flex flex-1">
          <div className="flex-1 md:ml-[245px] p-4 md:p-6 bg-gray-50 overflow-y-auto pb-16">
            {/* Cabecera del dashboard */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Benvingut, {user?.name || "Venedor"}</h1>
              <p className="text-gray-600">Gestiona els teus productes i segueix les teves vendes</p>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Total Productes"
                value={stats.totalProducts}
                icon={<Wine size={20} className="text-[#9A3E50]" />}
                color="burgundy"
                trend={true}
                percentage={5}
              />
              <StatCard
                title="Productes Actius"
                value={stats.activeProducts}
                icon={<ShoppingBag size={20} className="text-[#E6C9A8]" />}
                color="champagne"
                trend={true}
                percentage={2}
              />
              <StatCard
                title="Total Vendes"
                value={stats.totalSales}
                icon={<BarChart3 size={20} className="text-[#8C2E2E]" />}
                color="merlot"
                trend={true}
                percentage={12}
              />
              <StatCard
                title="Ingressos (€)"
                value={stats.revenue.toFixed(2)}
                icon={<TrendingUp size={20} className="text-[#E79FB3]" />}
                color="rosé"
                trend={true}
                percentage={8}
              />
            </div>

            {/* Botón de añadir producto */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Els teus productes</h2>
              <Link
                to="/create"
                className="flex items-center gap-2 px-4 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#600010] transition-colors"
              >
                <Plus size={18} />
                <span>Afegir producte</span>
              </Link>
            </div>

            {/* Filtros de productos */}
            <ProductFilter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            {/* Lista de productos */}
            <div className="mb-8">
              <WineList />
            </div>

            {/* Sección inferior con ventas recientes y eventos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentSales />
              <UpcomingEvents />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

