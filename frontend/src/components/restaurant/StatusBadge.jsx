import { Check, Clock, ShoppingBag, Store } from "lucide-react"
import { getStatusColor, getStatusTextColor } from "./utils/colors"

export const StatusBadge = ({ status }) => {
  let icon, text, bgColor, textColor

  switch (status) {
    case "sold":
      icon = <Check size={14} />
      text = "Venut"
      bgColor = getStatusColor("sold")
      textColor = getStatusTextColor("sold")
      break
    case "in_my_local":
      icon = <Store size={14} />
      text = "En el local"
      bgColor = getStatusColor("in_my_local")
      textColor = getStatusTextColor("in_my_local")
      break
    case "accepted":
      icon = <ShoppingBag size={14} />
      text = "Acceptat"
      bgColor = getStatusColor("accepted")
      textColor = getStatusTextColor("accepted")
      break
    case "pending":
    default:
      icon = <Clock size={14} />
      text = "Pendent"
      bgColor = getStatusColor("pending")
      textColor = getStatusTextColor("pending")
  }

  return (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {icon}
      <span>{text}</span>
    </div>
  )
}

