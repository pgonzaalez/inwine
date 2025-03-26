import { primaryColors, getWineTypeColor } from "./utils/colors"

export const WineTypeDistribution = ({ requests = [] }) => {
  // Extract products from requests
  const wines = requests.map((request) => request.product)

  // Count wines by type
  const wineTypes = ["Negre", "Blanc", "Rossat", "Espumós", "Dolç", "Altres"]

  const typeCount = wineTypes.reduce((acc, type) => {
    acc[type] = wines.filter(
      (wine) => wine.wine_type?.toLowerCase() === type.toLowerCase() || (!wine.wine_type && type === "Altres"),
    ).length
    return acc
  }, {})

  // Calculate total for percentages
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

