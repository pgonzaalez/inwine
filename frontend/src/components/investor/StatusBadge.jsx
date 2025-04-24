import { primaryColors } from "./utils/colors"

export const StatusBadge = ({ status }) => {
  // Configuració de colors i text segons l'estat
  const getStatusConfig = (status) => {
    switch (status) {
      case "paid":
        return {
          bg: "#DCFCE7",
          text: "#166534",
          label: "Pagada",
        }
      case "shipped":
        return {
          bg: "#E0F2FE",
          text: "#0369A1",
          label: "Enviada",
        }
      case "waiting":
        return {
          bg: "#FEF3C7",
          text: "#92400E",
          label: "En espera",
        }
      case "completed":
        return {
          bg: "#D1FAE5",
          text: "#065F46",
          label: "Completada",
        }
      default:
        return {
          bg: `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
            primaryColors.dark.slice(3, 5),
            16,
          )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
          text: primaryColors.dark,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span
      className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      {config.label}
    </span>
  )
}
