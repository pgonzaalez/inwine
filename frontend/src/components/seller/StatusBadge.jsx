import { Check, Clock, Wine } from "lucide-react"

export const StatusBadge = ({ status }) => {
  let icon, text, bgColor, textColor

  switch (status) {
    case "sold":
      icon = <Check size={14} />
      text = "Venut"
      bgColor = "#D1E7DD"
      textColor = "#0F5132"
      break
    case "waiting":
      icon = <Clock size={14} />
      text = "En espera"
      bgColor = "#FFF3CD"
      textColor = "#856404"
      break
    case "active":
    default:
      icon = <Wine size={14} />
      text = "Actiu"
      bgColor = "#F8E1E7" // Using your rose light color
      textColor = "#2D1B1E"
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

