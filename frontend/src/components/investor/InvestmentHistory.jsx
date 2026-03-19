"use client"
import { useFetchUser } from "@components/auth/FetchUser"
import { useState, useEffect } from "react"
import { Notification } from "@components/seller/wineManagement/Notification"
import { InvestmentStats } from "./InvestmentStats"
import { InvestmentStatusDistribution } from "./InvestmentStatusDistribution";
import { InvestmentTable } from "./InvestmentTable"
import { getCookie } from "@/utils/utils" // Usando tu utilidad personalizada
import { useTranslation } from "react-i18next"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

function InvestmentHistoryComponent() {
  const { t } = useTranslation()
  const [investments, setInvestments] = useState([])
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const { user, userLoading } = useFetchUser()
  const apiUrl = import.meta.env.VITE_API_URL

  // Implementación simple de alertas
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    fetchInvestments()
  }, [user])

  const fetchInvestments = async () => {
    if (userLoading || !user) return

    try {
      setIsLoading(true)

      const token = getCookie("token")

      if (!token) {
        setNotification(t("dashboards.investor.messages.no_token"))
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
        throw new Error(t("dashboards.investor.messages.error_server"))
      }

      const data = await response.json()
      setInvestments(data.investments)
      setNotification(null)
    } catch (err) {
      setError(err.message)
      setNotification(t("dashboards.investor.messages.error_fetch"))
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar inversiones según el estado seleccionado
  const filteredInvestments =
    activeFilter === "all" ? investments : investments.filter((investment) => investment.status === activeFilter)

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
      <Notification notification={notification} />

      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {t("dashboards.investor.summary.history_title")}
        </h1>
      </div>

      {/* Estadísticas */}
      <InvestmentStats investments={investments} />

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lista de inversiones en formato tabla */}
        <div className="lg:col-span-3">
          <InvestmentTable
            investments={filteredInvestments}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

        {/* Distribución por estado */}
        <div className="lg:col-span-1">
          <InvestmentStatusDistribution investments={investments} />
        </div>
      </div>
    </div>
  )
}

export default function InvestmentHistoryPage() {
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
            <InvestmentHistoryComponent />
          )}
        </div>
      </div>
    </div>
  )
}
