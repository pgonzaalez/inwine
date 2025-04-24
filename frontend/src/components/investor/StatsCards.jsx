import { CreditCard, Truck, Clock, CheckCircle, BarChart3, Wallet } from "lucide-react"
import { primaryColors } from "./utils/colors"

// Component de targeta individual
const StatCard = ({ title, value, icon, trend, percentage, period }) => {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col transition-all duration-300 hover:translate-y-[-2px] shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div
          className="p-2.5 rounded-lg"
          style={{
            backgroundColor: `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
              primaryColors.dark.slice(3, 5),
              16,
            )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
          }}
        >
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${percentage >= 0 ? "text-green-600" : "text-red-600"}`}>
            {percentage >= 0 ? "+" : ""}
            {percentage}%
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`ml-1 w-4 h-4 ${percentage < 0 ? "transform rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        )}
      </div>
      <div className="text-gray-500 text-sm mb-1">{title}</div>
      <div className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
        {value}
      </div>
      {period && <div className="text-xs text-gray-500 mt-1">{period}</div>}
    </div>
  )
}

export const StatsCards = ({ total, paid, shipped, waiting, completed, totalInvested, trends }) => {
  const cards = [
    {
      title: "Total Inversions",
      value: total,
      icon: <BarChart3 size={20} style={{ color: primaryColors.dark }} />,
      trend: true,
      percentage: trends?.total || 0,
      period: "vs. mes anterior",
    },
    {
      title: "Pagades",
      value: paid,
      icon: <CreditCard size={20} className="text-green-600" />,
      trend: true,
      percentage: trends?.paid || 0,
      period: "vs. setmana anterior",
    },
    {
      title: "Enviades",
      value: shipped,
      icon: <Truck size={20} className="text-blue-600" />,
      trend: true,
      percentage: trends?.shipped || 0,
      period: "vs. mes anterior",
    },
    {
      title: "En Espera",
      value: waiting,
      icon: <Clock size={20} className="text-yellow-600" />,
      trend: true,
      percentage: trends?.waiting || 0,
      period: "vs. 6 mesos anteriors",
    },
    {
      title: "Completades",
      value: completed,
      icon: <CheckCircle size={20} className="text-emerald-600" />,
      trend: true,
      percentage: trends?.completed || 0,
      period: "vs. any anterior",
    },
    {
      title: "Total Invertit",
      value: `${totalInvested}€`,
      icon: <Wallet size={20} className="text-emerald-600" />,
      trend: true,
      percentage: trends?.totalInvested || 0,
      period: "vs. mes anterior",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-6">
      {cards.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          trend={card.trend}
          percentage={card.percentage}
          period={card.period}
        />
      ))}
    </div>
  )
}
