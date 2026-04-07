"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useTranslation } from "react-i18next"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

export const InvestmentTimelineChart = ({ data = [] }) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === "ca" ? "ca-ES" : i18n.language === "es" ? "es-ES" : "en-US"
  const [dataKey, setDataKey] = useState("amount")

  // Formatear fecha para el eje X
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
    }).format(date)
  }

  // Formatear valores para el tooltip
  const formatValue = (value, dataKey) => {
    if (dataKey === "amount") {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(value)
    }
    return value
  }

  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label)
      const formattedDate = new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date)

      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{formattedDate}</p>
          <p className="text-sm">
            <span style={{ color: primaryColors.dark }}>{dataKey === "amount" ? t("dashboards.investor.charts.amount") + ": " : t("dashboards.investor.charts.count") + ": "}</span>
            {formatValue(payload[0].value, dataKey)}
          </p>
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{t("dashboards.investor.charts.no_data")}</p>
      </div>
    )
  }

  return (
    <div className="h-80">
      <div className="mb-4 flex justify-end">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              dataKey === "amount" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setDataKey("amount")}
          >
            {t("dashboards.investor.charts.amount")}
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              dataKey === "count" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setDataKey("count")}
          >
            {t("dashboards.investor.charts.count")}
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tickFormatter={formatDate} stroke="#888" />
          <YAxis
            stroke="#888"
            tickFormatter={(value) => (dataKey === "amount" ? `${(value / 1000).toFixed(0)}k€` : value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            name={dataKey === "amount" ? t("dashboards.investor.summary.charts.evolution_amount", "Import invertit") : t("dashboards.investor.summary.charts.evolution_count", "Nombre d'inversions")}
            stroke={primaryColors.dark}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
