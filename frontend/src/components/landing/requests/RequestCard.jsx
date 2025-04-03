import { ShoppingCart } from "lucide-react"

export default function RequestCard({ request, index, productPrice, isRequestsExpanded }) {
  // Calcular el beneficio
  const profit = productPrice - request.price_restaurant
  const profitPercentage = ((profit / request.price_restaurant) * 100).toFixed(1)

  return (
    <div
      className="bg-white py-2 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: isRequestsExpanded ? "fadeInUp 0.5s ease forwards" : "none",
      }}
    >
      {/* Versión móvil - apilada */}
      <div className="md:hidden space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-[#9A3E50]/10 flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-[#9A3E50]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <p className="font-medium">Restaurant #{index + 1}</p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendent</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Quantitat</p>
            <p className="font-medium">{request.quantity} u.</p>
          </div>
          <div>
            <p className="text-gray-500">Preu sol·licitat</p>
            <p className="font-medium">€{request.price_restaurant}</p>
          </div>
          <div>
            <p className="text-gray-500">Preu vi</p>
            <p className="font-medium">€{productPrice}</p>
          </div>
          <div>
            <p className="text-gray-500">Benefici</p>
            <p className={`font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              €{profit} ({profitPercentage}%)
            </p>
          </div>
        </div>

        <button className="w-full bg-[#9A3E50] hover:bg-[#7e3241] text-white cursor-pointer py-1.5 px-3 rounded-md font-medium flex items-center justify-center transition-colors text-sm">
          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
          Afegir al carret
        </button>
      </div>

      {/* Versión escritorio - una línea */}
      <div className="hidden md:grid md:grid-cols-6 md:gap-4 md:items-center">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-[#9A3E50]/10 flex items-center justify-center mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-[#9A3E50]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <span className="font-medium">Restaurant #{index + 1}</span>
        </div>

        <div className="font-medium">{request.quantity} unitats</div>

        <div className="font-medium">€{request.price_restaurant}</div>

        <div className="font-medium">€{productPrice}</div>

        <div className={`font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
          €{profit} ({profitPercentage}%)
        </div>

        <div className="text-right">
          <button className="bg-[#9A3E50] hover:bg-[#7e3241] text-white cursor-pointer py-1.5 px-3 rounded-md font-medium flex items-center justify-center transition-colors text-sm ml-auto">
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            Afegir
          </button>
        </div>
      </div>
    </div>
  )
}

