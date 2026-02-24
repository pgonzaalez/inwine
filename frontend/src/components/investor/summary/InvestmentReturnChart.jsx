import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

export const InvestmentReturnChart = ({ data = [] }) => {
  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {new Intl.NumberFormat("ca-ES", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              }).format(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hi ha dades disponibles</p>
      </div>
    )
  }

  // Preparar datos para el gráfico
  const chartData = data.map((item) => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
    fullName: item.name,
    investment: item.investment,
    return: item.return,
    profit: item.profit,
  }))

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 70,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#888" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
          <YAxis stroke="#888" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="investment" name="Inversió" fill={primaryColors.dark} radius={[4, 4, 0, 0]} />
          <Bar dataKey="return" name="Retorn Potencial" fill={primaryColors.light} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
