"use client"
import { useState, useEffect } from "react"
import { useFetchUser } from "@components/auth/FetchUser"
import { getCookie } from "@/utils/utils"
import { InvestmentSummaryCards } from "./InvestmentSummaryCards"
import { InvestmentTimelineChart } from "./InvestmentTimelineChart"
import { InvestmentStatusChart } from "./InvestmentStatusChart"
import { InvestmentReturnChart } from "./InvestmentReturnChart"
import { InvestmentOriginChart } from "./InvestmentOriginChart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs"
import { Calendar, BarChartIcon as ChartBar, CircleDollarSign, Map } from "lucide-react"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

function InvestmentDashboardComponent() {
  const [investments, setInvestments] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState(null)
  const { user, userLoading } = useFetchUser()
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchInvestments()
  }, [user])

  const fetchInvestments = async () => {
    if (userLoading || !user) return

    try {
      setIsLoading(true)

      const token = getCookie("token")

      if (!token) {
        setNotification("No s'ha trobat el token d'autenticació.")
        setIsLoading(false)
        return
      }

      const response = await fetch(`${apiUrl}/${user.id}/investments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("No s'ha pogut connectar amb el servidor")
      }

      const data = await response.json()
      setInvestments(data.investments)
      setNotification(null)
    } catch (err) {
      setError(err.message)
      setNotification("Hi ha hagut un error carregant les inversions.")
    } finally {
      setIsLoading(false)
    }
  }

  // Preparar datos para los gráficos
  const prepareChartData = () => {
    // Agrupar por fecha para el gráfico de línea temporal
    const timelineData = {}
    investments.forEach((inv) => {
      const date = new Date(inv.created_at).toISOString().split("T")[0]
      if (!timelineData[date]) {
        timelineData[date] = {
          date,
          amount: 0,
          count: 0,
        }
      }
      timelineData[date].amount += inv.product.price_demanded * inv.quantity
      timelineData[date].count += 1
    })

    // Agrupar por estado para el gráfico circular
    const statusData = {}
    investments.forEach((inv) => {
      const status = inv.status || "unknown"
      if (!statusData[status]) {
        statusData[status] = {
          status,
          count: 0,
          amount: 0,
        }
      }
      statusData[status].count += 1
      statusData[status].amount += inv.product.price_demanded * inv.quantity
    })

    // Datos para el gráfico de retorno
    const returnData = investments.map((inv) => ({
      id: inv.investment_id,
      name: inv.product.name,
      investment: inv.product.price_demanded * inv.quantity,
      return: inv.price_restaurant * inv.quantity,
      profit: (inv.price_restaurant - inv.product.price_demanded) * inv.quantity,
    }))

    // Agrupar por origen para el gráfico de origen
    const originData = {}
    investments.forEach((inv) => {
      const origin = inv.product.origin || "Desconegut"
      if (!originData[origin]) {
        originData[origin] = {
          origin,
          count: 0,
          amount: 0,
        }
      }
      originData[origin].count += 1
      originData[origin].amount += inv.product.price_demanded * inv.quantity
    })

    return {
      timelineData: Object.values(timelineData).sort((a, b) => new Date(a.date) - new Date(b.date)),
      statusData: Object.values(statusData),
      returnData: returnData.sort((a, b) => b.investment - a.investment).slice(0, 10), // Top 10
      originData: Object.values(originData).sort((a, b) => b.amount - a.amount),
    }
  }

  const chartData = prepareChartData()

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
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {notification}
        </div>
      )}

      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          Dashboard d'Inversions
        </h1>
      </div>

      {/* Tarjetas de resumen */}
      <InvestmentSummaryCards investments={investments} />

      {/* Pestañas para los diferentes gráficos */}
      <div className="mt-6">
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="hidden sm:inline">Evolució Temporal</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <ChartBar size={16} />
              <span className="hidden sm:inline">Estat</span>
            </TabsTrigger>
            <TabsTrigger value="return" className="flex items-center gap-2">
              <CircleDollarSign size={16} />
              <span className="hidden sm:inline">Retorn</span>
            </TabsTrigger>
            <TabsTrigger value="origin" className="flex items-center gap-2">
              <Map size={16} />
              <span className="hidden sm:inline">Origen</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4" style={{ color: primaryColors.dark }}>
              Evolució de les Inversions
            </h2>
            <InvestmentTimelineChart data={chartData.timelineData} />
          </TabsContent>

          <TabsContent value="status" className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4" style={{ color: primaryColors.dark }}>
              Distribució per Estat
            </h2>
            <InvestmentStatusChart data={chartData.statusData} />
          </TabsContent>

          <TabsContent value="return" className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4" style={{ color: primaryColors.dark }}>
              Inversió vs Retorn Potencial
            </h2>
            <InvestmentReturnChart data={chartData.returnData} />
          </TabsContent>

          <TabsContent value="origin" className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4" style={{ color: primaryColors.dark }}>
              Inversions per Origen
            </h2>
            <InvestmentOriginChart data={chartData.originData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function InvestmentDashboardPage() {
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
            <InvestmentDashboardComponent />
          )}
        </div>
      </div>
    </div>
  )
}
