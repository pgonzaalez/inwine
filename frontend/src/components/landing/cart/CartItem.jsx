"use client"

import { X } from "lucide-react"

export function CartItem({ item, isSelected, onToggleSelect, onRemove, getImageUrl }) {
  return (
    <div className="py-5 px-4 border-b last:border-b-0 hover:bg-gray-50/30 transition-colors relative">
      {/* Checkbox - mobile (top left) */}
      <div className="md:hidden absolute top-2 left-2 z-10">
        {/* <label className="relative flex items-center justify-center cursor-pointer">
          <input type="checkbox" checked={isSelected} onChange={onToggleSelect} className="peer sr-only" />
          <div className="w-5 h-5 border border-gray-300 rounded peer-checked:bg-[#9A3E50] peer-checked:border-[#9A3E50] transition-colors"></div>
          <svg
            className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 12 10 16 18 8"></polyline>
          </svg>
        </label> */}
      </div>

      {/* Eliminar - mobile (top right) */}
      <button
        onClick={onRemove}
        className="md:hidden absolute top-2 right-2 text-gray-400 hover:text-[#9A3E50] transition-colors z-10"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex items-start gap-4">
        {/* Checkbox - desktop */}
        <div className="hidden md:block">
          {/* <label className="relative flex items-center justify-center cursor-pointer">
            {/* <input type="checkbox" checked={isSelected} onChange={onToggleSelect} className="peer sr-only" /> 
            <div className="w-5 h-5 border border-gray-300 rounded peer-checked:bg-[#9A3E50] peer-checked:border-[#9A3E50] transition-colors"></div>
            <svg
              className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 12 10 16 18 8"></polyline>
            </svg>
          </label> */}
        </div>

        {/* Product image */}
        <div className="h-24 w-24 flex-shrink-0 flex items-center justify-center">
          <img
            src={getImageUrl(item.product?.image) || "/placeholder.svg?height=80&width=80"}
            alt={item.product?.name || "Product image"}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Product info + price block */}
        <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-2">
          {/* Info block */}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{item.product?.name}</h3>
            <p className="text-sm text-gray-500">
              {item.product?.origin} · {item.product?.year}
            </p>

            <div className="flex flex-col sm:flex-row sm:gap-6 mt-1">
              <div className="flex-1">
                <p className="text-xs text-gray-500">Productor:</p>
                <p className="text-sm font-medium">{item.seller_name}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Restaurant:</p>
                <p className="text-sm font-medium">{item.restaurant_name}</p>
              </div>
            </div>
          </div>

          {/* Price + delete (desktop) */}
          <div className="flex flex-col items-end gap-1 min-w-[80px]">
            <span className="font-bold text-[#9A3E50] text-lg md:text-2xl">
              {item.price_restaurant} €
            </span>
            <button
              onClick={onRemove}
              className="hidden md:flex text-gray-400 hover:text-[#9A3E50] transition-colors text-xs items-center"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
