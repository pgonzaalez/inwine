import { useState } from "react"
import { DollarSign, Store, Trash2, Edit } from 'lucide-react'
import { StatusBadge } from "./StatusBadge"
import { primaryColors, getWineTypeColor } from "./utils/colors"

export const RequestCard = ({ request, baseUrl, onDelete }) => {
  const { product, price_restaurant, status, created_at, id } = request
  const [isDeleting, setIsDeleting] = useState(false)

  // Format date
  const formattedDate = new Date(created_at).toLocaleDateString("ca-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const handleDelete = (e) => {
    e.stopPropagation() // Prevent card click
    
    if (window.confirm("Estàs segur que vols eliminar aquesta sol·licitud?")) {
      setIsDeleting(true)
      onDelete(id)
    }
  }

  const handleEdit = (e) => {
    e.stopPropagation() // Prevent card click
    window.location.href = `/restaurant/requests/${id}/edit`
  }

  const handleCardClick = () => {
    window.location.href = `/restaurant/requests/${id}`
  }

  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md hover:translate-y-[-2px] relative"
      onClick={handleCardClick}
    >
      {/* Action buttons */}
      <div className="absolute top-3 left-3 z-10 flex space-x-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1.5 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors"
          title="Eliminar sol·licitud"
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={handleEdit}
          className="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 transition-colors"
          title="Editar sol·licitud"
        >
          <Edit size={16} />
        </button>
      </div>

      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={`${baseUrl}${product.image}`}
            alt={product.name}
            className="w-full h-full object-contain transition-transform hover:scale-105"
          />
        </div>
        <div
          className="absolute top-0 left-0 w-2 h-full"
          style={{
            backgroundColor: getWineTypeColor(product.wine_type?.toLowerCase()),
          }}
        ></div>
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: getWineTypeColor(product.wine_type?.toLowerCase()),
            color:
              product.wine_type?.toLowerCase() === "blanc" || product.wine_type?.toLowerCase() === "espumós"
                ? "#333"
                : "white",
          }}
        >
          {product.wine_type || "Vi"}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg truncate">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-500">
            {product.year} · {product.origin}
          </p>
          <StatusBadge status={status} />
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <DollarSign size={14} className="text-gray-500" />
              <p className="text-sm text-gray-500">Preu demanat:</p>
            </div>
            <p className="text-base font-medium">{product.price_demanded}€</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Store size={14} className="text-gray-500" />
              <p className="text-sm text-gray-500">El teu preu:</p>
            </div>
            <p className="text-xl font-bold" style={{ color: primaryColors.dark }}>
              {price_restaurant}€
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-500">Sol·licitat: {formattedDate}</p>
          <button
            className="text-xs font-medium px-3 py-1 rounded-full transition-colors"
            style={{
              backgroundColor: `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
                primaryColors.dark.slice(3, 5),
                16,
              )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
              color: primaryColors.dark,
            }}
          >
            Detalls
          </button>
        </div>
      </div>
    </div>
  )
}
