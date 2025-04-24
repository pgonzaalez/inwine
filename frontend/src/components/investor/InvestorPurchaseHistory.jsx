"use client"

import { useState, useEffect } from "react"
import { useFetchUser } from "@components/auth/FetchUser"
import { primaryColors } from "./utils/colors"
import { InvestmentTable } from "./InvestmentTable"
import { InvestmentSummary } from "./InvestmentSummary"
import { Notification } from "./Notification"
import { getCookie } from "@/utils/utils"

export const InvestorPurchaseHistory = () => {
  const [investments, setInvestments] = useState([])
  const [filteredInvestments, setFilteredInvestments] = useState([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null, rangeId: "all" })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL
  const baseUrl = import.meta.env.VITE_URL_BASE

  const { user, loading: userLoading } = useFetchUser()

  useEffect(() => {
    fetchInvestments()
  }, [user])

  // Efecte per filtrar inversions quan canvia el filtre o el rang de dates
  useEffect(() => {
    filterInvestments()
  }, [activeFilter, dateRange, investments])

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
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
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

  // Funció per filtrar inversions segons l'estat i el rang de dates
  const filterInvestments = () => {
    let filtered = [...investments]

    // Filtrar per estat
    if (activeFilter !== "all") {
      filtered = filtered.filter((investment) => investment.status === activeFilter)
    }

    // Filtrar per rang de dates
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((investment) => {
        const investmentDate = new Date(investment.created_at)
        return investmentDate >= dateRange.startDate && investmentDate <= dateRange.endDate
      })
    }

    setFilteredInvestments(filtered)
  }

  // Funció per gestionar el canvi de rang de dates
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange)
    setNotification({
      type: "info",
      message: newDateRange.rangeId === "all" ? "Mostrant totes les dates" : "Filtre de dates aplicat",
    })
    setTimeout(() => setNotification(null), 3000)
  }

  // Descarregar historial en format CSV
  const handleDownloadHistory = () => {
    // Crear capçaleres CSV
    const headers = [
      "ID",
      "Producte",
      "Origen",
      "Any",
      "Quantitat",
      "Preu Invertit",
      "Preu Restaurant",
      "Benefici Potencial",
      "Venedor",
      "Restaurant",
      "Estat",
      "Data",
    ]

    // Convertir dades a files CSV
    const rows = filteredInvestments.map((investment) => [
      investment.investment_id,
      investment.product.name,
      investment.product.origin,
      investment.product.year,
      investment.quantity,
      `${investment.product.price_demanded}€`,
      `${investment.price_restaurant}€`,
      `${((investment.price_restaurant - investment.product.price_demanded) * investment.quantity).toFixed(2)}€`,
      investment.seller_name,
      investment.restaurant_name,
      getStatusText(investment.status),
      investment.created_at ? new Date(investment.created_at).toLocaleDateString("ca-ES") : "N/A",
    ])

    // Combinar capçaleres i files
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

    // Crear i descarregar el fitxer
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `historial-inversions-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Mostrar notificació
    setNotification({ type: "success", message: "Historial descarregat correctament" })
    setTimeout(() => setNotification(null), 3000)
  }

  // Obtenir text d'estat en català
  const getStatusText = (status) => {
    const statusMap = {
      paid: "Pagada",
      shipped: "Enviada",
      waiting: "En espera",
      completed: "Completada",
      cancelled: "Cancel·lada",
    }
    return statusMap[status] || status
  }

  // Calcular tendències basades en dates reals
  const calculateTrends = () => {
    // Dates de referència
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())

    // Funció per calcular el percentatge de canvi
    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    // Inversions actuals vs. anteriors
    const currentTotal = investments.length
    const previousMonthTotal = investments.filter((inv) => new Date(inv.created_at) < oneMonthAgo).length

    const currentCompleted = investments.filter((inv) => inv.status === "completed").length
    const previousYearCompleted = investments.filter(
      (inv) => inv.status === "completed" && new Date(inv.created_at) < oneYearAgo,
    ).length

    // Càlcul d'inversió total
    const currentTotalInvested = investments
      .filter((inv) => ["paid", "shipped", "completed"].includes(inv.status))
      .reduce((total, inv) => total + inv.product.price_demanded * inv.quantity, 0)

    const previousMonthTotalInvested = investments
      .filter((inv) => ["paid", "shipped", "completed"].includes(inv.status) && new Date(inv.created_at) < oneMonthAgo)
      .reduce((total, inv) => total + inv.product.price_demanded * inv.quantity, 0)

    return {
      total: calculatePercentageChange(currentTotal, previousMonthTotal),
      completed: calculatePercentageChange(currentCompleted, previousYearCompleted),
      totalInvested: calculatePercentageChange(currentTotalInvested, previousMonthTotalInvested),
    }
  }

  // Estadístiques d'inversions
  const stats = {
    total: investments.length,
    paid: investments.filter((investment) => investment.status === "paid").length,
    shipped: investments.filter((investment) => investment.status === "shipped").length,
    waiting: investments.filter((investment) => investment.status === "waiting").length,
    completed: investments.filter((investment) => investment.status === "completed").length,
  }

  // Calcular el total invertit en inversions pagades
  const totalInvested = investments
    .filter(
      (investment) =>
        investment.status === "paid" || investment.status === "shipped" || investment.status === "completed",
    )
    .reduce((total, investment) => total + investment.product.price_demanded * investment.quantity, 0)
    .toFixed(2)

  // Calcular tendències
  const trends = calculateTrends()

  // Funció per mostrar totes les inversions
  const handleViewAll = () => {
    setActiveFilter("all")
    setDateRange({ startDate: null, endDate: null, rangeId: "all" })
    setNotification({ type: "info", message: "Mostrant totes les inversions" })
    setTimeout(() => setNotification(null), 3000)
  }

  if (userLoading || isLoading) {
    return (
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
    )
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
    <div className="max-w-[1600px] mx-auto">
      <Notification notification={notification} />

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: primaryColors.dark }}>
          Historial d'Inversions
        </h1>
      </div>

      {/* Contingut principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Taula d'inversions */}
        <div className="lg:col-span-3">
          <InvestmentTable
            investments={filteredInvestments}
            baseUrl={baseUrl}
            handleDownloadHistory={handleDownloadHistory}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>

        {/* Resum d'inversions */}
        <div className="lg:col-span-1">
          <InvestmentSummary
            investments={investments}
            totalInvested={totalInvested}
            stats={stats}
            onViewAll={handleViewAll}
            trends={trends}
          />
        </div>
      </div>
    </div>
  )
}
