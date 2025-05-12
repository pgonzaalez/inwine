// Definimos los colores primarios
const primaryColors = {
    dark: "#9A3E50",
    light: "#C27D7D",
    background: "#F9F9F9",
  }
  
  export const StatusBadge = ({ status }) => {
    let backgroundColor
    let textColor
    let statusText
  
    switch (status) {
      case "paid":
        backgroundColor = "#FFF8E1"
        textColor = "#FFA000"
        statusText = "Pagat (Pendent)"
        break
      case "completed":
        backgroundColor = "#E8F5E9"
        textColor = "#2E7D32"
        statusText = "Completat"
        break
      case "cancelled":
        backgroundColor = "#FFEBEE"
        textColor = "#C62828"
        statusText = "Cancel·lat"
        break
      default:
        backgroundColor = "#ECEFF1"
        textColor = "#546E7A"
        statusText = "Desconegut"
    }
  
    return (
      <span
        className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
        style={{ backgroundColor, color: textColor }}
      >
        {statusText}
      </span>
    )
  }
  