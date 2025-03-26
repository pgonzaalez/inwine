// Definimos los colores primarios
const primaryColors = {
    dark: "#9A3E50",
    light: "#C27D7D",
    background: "#F9F9F9",
  }
  
  // Función para obtener el color de fondo según el tipo de vino
  const getWineTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "negre":
        return "#2D1B1E" // Color oscuro para vino tinto
      case "blanc":
        return "#F7F5E8" // Color claro para vino blanco
      case "rossat":
        return primaryColors.light // Color rosado para vino rosado
      case "espumós":
        return "#F2EFD3" // Color champán para espumoso
      case "dolç":
        return "#E8D0B5" // Color ámbar para vino dulce
      default:
        return `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
          primaryColors.dark.slice(3, 5),
          16,
        )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)` // Color por defecto
    }
  }
  
  export const WineTypeDistribution = ({ wines = [] }) => {
    // Contar vinos por tipo
    const wineTypes = ["Negre", "Blanc", "Rossat", "Espumós", "Dolç", "Altres"]
  
    const typeCount = wineTypes.reduce((acc, type) => {
      acc[type] = wines.filter(
        (wine) => wine.wine_type?.toLowerCase() === type.toLowerCase() || (!wine.wine_type && type === "Altres"),
      ).length
      return acc
    }, {})
  
    // Calcular el total para los porcentajes
    const total = wines.length
  
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-lg font-bold mb-4" style={{ color: primaryColors.dark }}>
          Distribució per tipus
        </h3>
  
        <div className="space-y-4">
          {wineTypes.map((type) => {
            const count = typeCount[type] || 0
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0
  
            return (
              <div key={type} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2 flex-shrink-0"
                  style={{
                    backgroundColor: getWineTypeColor(type.toLowerCase()),
                  }}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium truncate">{type}</span>
                    <span className="ml-2 flex-shrink-0">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getWineTypeColor(type.toLowerCase()),
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
  
  