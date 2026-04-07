import { AlertCircle, CheckCircle, Package, Truck } from "lucide-react"
import { useTranslation } from "react-i18next"

export const StatusBadge = ({ status }) => {
  const { t } = useTranslation()
  let color = ""
  let bgColor = ""
  let icon = null
  let label = ""

  switch (status) {
    case "in_stock":
      color = "text-green-700"
      bgColor = "bg-green-100"
      icon = <Package size={14} className="mr-1" />
      label = t("dashboards.seller.status.in_stock")
      break
    case "requested":
      color = "text-amber-700"
      bgColor = "bg-amber-100"
      icon = <AlertCircle size={14} className="mr-1" />
      label = t("dashboards.seller.status.requested")
      break
    case "in_transit":
      color = "text-blue-700"
      bgColor = "bg-blue-100"
      icon = <Truck size={14} className="mr-1" />
      label = t("dashboards.seller.status.in_transit")
      break
    case "sold":
      color = "text-purple-700"
      bgColor = "bg-purple-100"
      icon = <CheckCircle size={14} className="mr-1" />
      label = t("dashboards.seller.status.sold")
      break
    default:
      color = "text-gray-700"
      bgColor = "bg-gray-100"
      label = status || t("dashboards.seller.status.unknown")
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${bgColor}`}>
      {icon}
      {label}
    </span>
  )
}

