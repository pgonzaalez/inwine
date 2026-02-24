import { TrendingUp, Wallet, Clock, Award } from "lucide-react"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

export const InvestmentSummaryCards = ({ investments = [] }) => {
  // Calcular estadísticas
  const totalInvested = investments.reduce((total, inv) => total + inv.product.price_demanded * inv.quantity, 0)
  const potentialReturn = investments.reduce((total, inv) => total + inv.price_restaurant * inv.quantity, 0)
  const pendingInvestments = investments.filter((inv) => inv.status === "paid").length
  const completedInvestments = investments.filter((inv) => inv.status === "completed").length

  // Calcular beneficio potencial
  const potentialProfit = potentialReturn - totalInvested
  const profitPercentage = totalInvested > 0 ? (potentialProfit / totalInvested) * 100 : 0

  // Encontrar la mejor inversión (mayor porcentaje de beneficio)
  let bestInvestment = { profit: 0, percentage: 0, name: "Cap" }
  investments.forEach((inv) => {
    const investment = inv.product.price_demanded * inv.quantity
    const profit = (inv.price_restaurant - inv.product.price_demanded) * inv.quantity
    const percentage = investment > 0 ? (profit / investment) * 100 : 0

    if (percentage > bestInvestment.percentage) {
      bestInvestment = {
        profit,
        percentage,
        name: inv.product.name,
      }
    }
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total invertido */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            style={{
              backgroundColor: `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
                primaryColors.dark.slice(3, 5),
                16,
              )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
            }}
          >
            <Wallet size={20} style={{ color: primaryColors.dark }} />
          </div>
          <h3 className="text-lg font-bold" style={{ color: primaryColors.dark }}>
            Total Invertit
          </h3>
        </div>
        <p className="text-2xl font-bold">
          {new Intl.NumberFormat("ca-ES", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
          }).format(totalInvested)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {investments.length} {investments.length === 1 ? "inversió" : "inversions"} en total
        </p>
      </div>

      {/* Retorno potencial */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            style={{
              backgroundColor: `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
                primaryColors.dark.slice(3, 5),
                16,
              )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
            }}
          >
            <TrendingUp size={20} style={{ color: primaryColors.dark }} />
          </div>
          <h3 className="text-lg font-bold" style={{ color: primaryColors.dark }}>
            Benefici Potencial
          </h3>
        </div>
        <p className="text-2xl font-bold" style={{ color: potentialProfit > 0 ? "green" : "inherit" }}>
          {new Intl.NumberFormat("ca-ES", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
          }).format(potentialProfit)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {profitPercentage > 0 ? `+${profitPercentage.toFixed(2)}% de rendibilitat` : "Sense benefici encara"}
        </p>
      </div>

      {/* Estado de inversiones */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            style={{
              backgroundColor: `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
                primaryColors.dark.slice(3, 5),
                16,
              )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
            }}
          >
            <Clock size={20} style={{ color: primaryColors.dark }} />
          </div>
          <h3 className="text-lg font-bold" style={{ color: primaryColors.dark }}>
            Estat Inversions
          </h3>
        </div>
        <p className="text-2xl font-bold">
          {pendingInvestments} / {completedInvestments}
        </p>
        <p className="text-sm text-gray-500 mt-1">Pendents / Completades</p>
      </div>

      {/* Mejor inversión */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            style={{
              backgroundColor: `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
                primaryColors.dark.slice(3, 5),
                16,
              )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
            }}
          >
            <Award size={20} style={{ color: primaryColors.dark }} />
          </div>
          <h3 className="text-lg font-bold" style={{ color: primaryColors.dark }}>
            Millor Inversió
          </h3>
        </div>
        <p className="text-xl font-bold truncate" title={bestInvestment.name}>
          {bestInvestment.name}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {bestInvestment.percentage > 0 ? `+${bestInvestment.percentage.toFixed(2)}% de rendibilitat` : "Sense dades"}
        </p>
      </div>
    </div>
  )
}
