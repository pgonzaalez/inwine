import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

// Colores para los diferentes orígenes
const ORIGIN_COLORS = [
  "#9A3E50", // Color primario
  "#C27D7D", // Color secundario
  "#D4A373",
  "#E9C46A",
  "#2A9D8F",
  "#264653",
  "#F4A261",
  "#E76F51",
  "#8ECAE6",
  "#219EBC",
  "#023047",
  "#FFB703",
  "#FB8500",
]

export const InvestmentOriginChart = ({ data = [] }) => {
  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload

      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{data.origin}</p>
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
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={ORIGIN_COLORS[index % ORIGIN_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span style={{ color: "#333", fontSize: 14 }}>{value}</span>}
              payload={data.map((item, index) => ({
                value: item.origin,
                type: "circle",
                color: ORIGIN_COLORS[index % ORIGIN_COLORS.length],
              }))}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="h-80">
        <div className="bg-gray-50 p-4 rounded-lg h-full overflow-auto">
          <h3 className="text-lg font-medium mb-2" style={{ color: primaryColors.dark }}>
            Resum per Origen
          </h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origen
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Import
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: ORIGIN_COLORS[index % ORIGIN_COLORS.length] }}
                      ></div>
                      <div className="text-sm font-medium text-gray-900">{item.origin}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat("ca-ES", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    }).format(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
