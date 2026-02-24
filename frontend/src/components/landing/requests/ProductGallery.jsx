import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductGallery({ images, productName, baseUrl }) {
  // Validar y ordenar las imágenes
  const sortedImages = (images || [])
    .filter((img) => img && img.image_path) // solo si existe y tiene path
    .sort((a, b) => a.order - b.order)

  // Eliminar duplicados por image_path
  const uniqueImages = Array.from(new Map(sortedImages.map(img => [img.image_path, img])).values())

  const productImages = uniqueImages.map((img) => `${baseUrl}${img.image_path}`)

  // Buscar índice de la imagen primaria
  const primaryIndex = uniqueImages.findIndex((img) => img.is_primary === 1)
  const defaultIndex = primaryIndex >= 0 ? primaryIndex : 0

  const [activeImage, setActiveImage] = useState(defaultIndex)

  useEffect(() => {
    setActiveImage(defaultIndex)
  }, [defaultIndex])

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative bg-gray-50 rounded-lg overflow-hidden h-[500px]">
        {productImages.length > 0 ? (
          <img
            src={productImages[activeImage] || "/placeholder.svg"}
            alt={productName}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No hi ha imatge disponible
          </div>
        )}

        {/* Flechas de navegación */}
        {productImages.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveImage((prev) =>
                  prev === 0 ? productImages.length - 1 : prev - 1
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() =>
                setActiveImage((prev) => (prev + 1) % productImages.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {productImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {productImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                activeImage === idx ? "border-[#9A3E50]" : "border-transparent"
              }`}
            >
              <img
                src={img || "/placeholder.svg"}
                alt={`${productName} - vista ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
