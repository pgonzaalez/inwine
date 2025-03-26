import { AlertCircle, CheckCircle, Package, Truck } from "lucide-react"

export const StatusBadge = ({ status }) => {
  let color = ""
  let bgColor = ""
  let icon = null
  let label = ""

  switch (status) {
    case "in_stock":
      color = "text-green-700"
      bgColor = "bg-green-100"
      icon = <Package size={14} className="mr-1" />
      label = "En Stock"
      break
    case "requested":
      color = "text-amber-700"
      bgColor = "bg-amber-100"
      icon = <AlertCircle size={14} className="mr-1" />
      label = "Sol·licitat"
      break
    case "in_transit":
      color = "text-blue-700"
      bgColor = "bg-blue-100"
      icon = <Truck size={14} className="mr-1" />
      label = "En Trànsit"
      break
    case "sold":
      color = "text-purple-700"
      bgColor = "bg-purple-100"
      icon = <CheckCircle size={14} className="mr-1" />
      label = "Venut"
      break
    default:
      color = "text-gray-700"
      bgColor = "bg-gray-100"
      label = status || "Desconegut"
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${bgColor}`}>
      {icon}
      {label}
    </span>
  )
}

