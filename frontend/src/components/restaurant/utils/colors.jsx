// Definimos los colores primarios
export const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

// Función para obtener el color de fondo según el tipo de vino
export const getWineTypeColor = (type) => {
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

// Función para obtener un color uniforme para los tipos de vino (para la tabla)
export const getUniformWineTypeColor = () => {
  return "#F3F4F6" // Un gris muy claro (gray-100)
}

// Función para obtener el color de fondo según el estado
export const getStatusColor = (status) => {
  switch (status) {
    case "sold":
      return "#DCFCE7" // Verde claro
    case "in_my_local":
      return "#E0F2FE" // Azul claro
    case "in_transit":
      return "#FEF3C7" // Amarillo claro
    case "accepted":
      return "#E0E7FF" // Púrpura claro
    case "pending":
    default:
      return "#FEE2E2" // Rojo claro
  }
}

// Función para obtener el color del texto según el estado
export const getStatusTextColor = (status) => {
  switch (status) {
    case "sold":
      return "#166534" // Verde oscuro
    case "in_my_local":
      return "#0369A1" // Azul oscuro
    case "in_transit":
      return "#854D0E" // Amarillo oscuro
    case "accepted":
      return "#4338CA" // Púrpura oscuro
    case "pending":
    default:
      return "#B91C1C" // Rojo oscuro
  }
}

