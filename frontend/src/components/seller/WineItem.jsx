"use client"

import { Trash, Edit, Eye } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { StatusBadge } from "@components/seller/StatusBadge"

// Definimos los colores rosé para usar en todo el componente
const roseColors = {
  light: "#F8E1E7", // Rosé claro
  medium: "#F4C2D0", // Rosé medio
  dark: "#E79FB3", // Rosé oscuro
}

// Función para obtener el color de fondo según el tipo de vino
const getWineTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case "negre":
      return "#2D1B1E" // Color oscuro para vino tinto
    case "blanc":
      return "#F7F5E8" // Color claro para vino blanco
    case "rossat":
      return roseColors.medium // Color rosado para vino rosado
    case "espumós":
      return "#F2EFD3" // Color champán para espumoso
    case "dolç":
      return "#E8D0B5" // Color ámbar para vino dulce
    default:
      return roseColors.light // Color por defecto
  }
}

// Función para obtener el color de texto según el tipo de vino
const getWineTypeTextColor = (type) => {
  switch (type?.toLowerCase()) {
    case "negre":
      return "white" // Texto blanco para fondo oscuro
    default:
      return "#2D1B1E" // Texto oscuro para fondos claros
  }
}

const WineItem = ({
  id,
  image,
  price,
  name,
  year,
  type,
  status = "active",
  create_date,
  update_date,
  onDelete,
  userId,
}) => {
  const navigate = useNavigate()

  create_date = new Date(create_date).toLocaleDateString("ca-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  update_date = new Date(update_date).toLocaleDateString("ca-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  const bgColor = getWineTypeColor(type)
  const textColor = getWineTypeTextColor(type)

  return (
    <div
      className="group w-full transition-all duration-300 hover:translate-y-[-2px]"
      onClick={() => navigate(`/seller/products/${id}`)}
    >
      <div className="p-2">
        <div
          className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          style={{ borderLeft: `4px solid ${roseColors.dark}` }}
        >
          {/* Imagen destacada */}
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={image || "/placeholder.svg?height=200&width=400"}
              alt={name}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute top-0 right-0 px-3 py-1 m-2 rounded-full text-xs font-medium"
              style={{
                backgroundColor: bgColor,
                color: textColor,
              }}
            >
              {type || "Vi"}
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 px-4 py-2 text-white"
              style={{
                background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
              }}
            >
              <p className="text-lg font-bold truncate">{name}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm">{year}</p>
                <p className="text-xl font-bold">{price}€</p>
              </div>
            </div>
          </div>

          {/* Información y acciones */}
          <div className="flex flex-wrap justify-between items-center p-4">
            <div className="flex gap-6 text-gray-600">
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500">Publicació</p>
                <p className="text-gray-700 font-medium">{create_date}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500">Modificació</p>
                <p className="text-gray-700 font-medium">{update_date}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500">Estat</p>
                <StatusBadge status={status} />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/seller/products/${id}`)
                }}
                className="p-2 rounded-lg transition-colors cursor-pointer opacity-70 hover:opacity-100"
                style={{
                  backgroundColor: roseColors.light,
                  color: "#2D1B1E",
                }}
              >
                <Eye size={18} />
              </button>
              <Link
                to={`/seller/products/${id}/edit`}
                className="p-2 rounded-lg transition-colors cursor-pointer opacity-70 hover:opacity-100"
                style={{
                  backgroundColor: roseColors.light,
                  color: "#2D1B1E",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Edit size={18} />
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(id)
                }}
                className="p-2 rounded-lg transition-colors cursor-pointer opacity-70 hover:opacity-100"
                style={{
                  backgroundColor: roseColors.medium,
                  color: "#2D1B1E",
                }}
              >
                <Trash size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WineItem

