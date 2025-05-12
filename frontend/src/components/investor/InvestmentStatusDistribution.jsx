// Definimos los colores primarios
const primaryColors = {
    dark: "#9A3E50",
    light: "#C27D7D",
    background: "#F9F9F9",
  }
  
  // Función para obtener el color de fondo según el estado de la inversión
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "#FFC107" // Color amarillo para pagado (pendiente)
      case "completed":
        return "#4CAF50" // Color verde para completado
      case "cancelled":
        return "#F44336" // Color rojo para cancelado
      default:
        return `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
          primaryColors.dark.slice(3, 5),
          16,
        )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)` // Color por defecto
    }
  }
  
  export const InvestmentStatusDistribution = ({ investments = [] }) => {
    // Contar inversiones por estado
    const statusTypes = ["paid", "completed", "cancelled", "other"]
  
    const statusLabels = {
      paid: "Pagat (Pendent)",
      completed: "Completat",
      cancelled: "Cancel·lat",
      other: "Altres",
    }
  
    const statusCount = statusTypes.reduce((acc, status) => {
      acc[status] = investments.filter(
        (inv) => inv.status?.toLowerCase() === status.toLowerCase() || (!inv.status && status === "other"),
      ).length
      return acc
    }, {})
  
    // Calcular el total para los porcentajes
    const total = investments.length
  
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-lg font-bold mb-4" style={{ color: primaryColors.dark }}>
          Distribució per estat
        </h3>
  
        <div className="space-y-4">
          {statusTypes.map((status) => {
            const count = statusCount[status] || 0
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0
  
            // No mostrar estados sin inversiones
            if (count === 0) return null
  
            return (
              <div key={status} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2 flex-shrink-0"
                  style={{
                    backgroundColor: getStatusColor(status.toLowerCase()),
                  }}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium truncate">{statusLabels[status]}</span>
                    <span className="ml-2 flex-shrink-0">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getStatusColor(status.toLowerCase()),
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
  