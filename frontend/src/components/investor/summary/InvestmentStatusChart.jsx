import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

// Colores para los diferentes estados
const STATUS_COLORS = {
  paid: "#FFC107", // Amarillo para pagado (pendiente)
  completed: "#4CAF50", // Verde para completado
  cancelled: "#F44336", // Rojo para cancelado
  unknown: "#9E9E9E", // Gris para desconocido
}

// Nombres de estado en catalán
const STATUS_NAMES = {
  paid: "Pagat (Pendent)",
  completed: "Completat",
  cancelled: "Cancel·lat",
  unknown: "Desconegut",
}

export const InvestmentStatusChart = ({ data = [] }) => {
  // Formatear datos para el gráfico
  const chartData = data.map((item) => ({
    ...item,
    name: STATUS_NAMES[item.status] || STATUS_NAMES.unknown,
  }))

  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload

      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            <span style={{ color: payload[0].color }}>Nombre: </span>
            {data.count}
          </p>
          <p className="text-sm">
            <span style={{ color: payload[0].color }}>Import: </span>
            {new Intl.NumberFormat("ca-ES", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            }).format(data.amount)}
          </p>
        </div>
      )
    }
    return null
  }

  // Renderizar etiqueta personalizada
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hi ha dades disponibles</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || STATUS_COLORS.unknown} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value) => <span style={{ color: "#333", fontSize: 14 }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || STATUS_COLORS.unknown} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span style={{ color: "#333", fontSize: 14 }}>{value}</span>}
              payload={chartData.map((item) => ({
                value: item.name,
                type: "circle",
                color: STATUS_COLORS[item.status] || STATUS_COLORS.unknown,
              }))}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="md:col-span-2">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2" style={{ color: primaryColors.dark }}>
            Resum per Estat
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Import Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % del Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chartData.map((item, index) => {
                  const totalAmount = chartData.reduce((sum, i) => sum + i.amount, 0)
                  const percentage = totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0

                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: STATUS_COLORS[item.status] || STATUS_COLORS.unknown }}
                          ></div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Intl.NumberFormat("ca-ES", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 0,
                        }).format(item.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{percentage.toFixed(2)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
