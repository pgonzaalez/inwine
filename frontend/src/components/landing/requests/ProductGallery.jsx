import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductGallery({ images, productName, baseUrl }) {
  const [activeImage, setActiveImage] = useState(0)

  // Only include actual images, no placeholders
  const productImages = images.filter(Boolean).map((img) => `${baseUrl}${img}`)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-gray-50 rounded-lg overflow-hidden h-[500px]">
        {productImages.length > 0 ? (
          <img
            src={productImages[activeImage] || "/placeholder.svg"}
            alt={productName}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No hi ha imatge disponible</div>
        )}

        {/* Navigation arrows - only show if there are multiple images */}
        {productImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActiveImage((prev) => (prev + 1) % productImages.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails - only show if there are multiple images */}
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