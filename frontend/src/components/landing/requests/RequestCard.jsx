"use client";

import { useState } from "react";
import { Home, ShoppingCart } from "lucide-react";
import { useFetchUser } from "@components/auth/FetchUser";

export default function RequestCard({ request, index, productPrice, isRequestsExpanded }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // Llamada al hook en el nivel superior del componente
  const { user, loading: userLoading } = useFetchUser();

  // Calcular el benefici
  const profit = request.price_restaurant - productPrice;
  const profitPercentage = ((profit / request.price_restaurant) * 100).toFixed(1);

  const handleAddToOrder = async () => {
    try {
      setIsLoading(true);

      if (!user || userLoading) {
        throw new Error("El usuario no está cargado");
      }

      // Realizar la petición POST a la API
      const response = await fetch(`${apiUrl}/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          request_restaurant_id: request.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la comanda");
      }

      setIsSuccess(true); 
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-white py-2 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: isRequestsExpanded ? "fadeInUp 0.5s ease forwards" : "none",
      }}
    >
      {/* Versió mòbil - apilada */}
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
            <p className="font-medium">Restaurant {request.user_id}</p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendent</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-medium">{request.quantity} uds.</p>
          </div>
          <div>
            <p className="font-medium">€{request.price_restaurant}</p>
          </div>
          <div>
            <p className="font-medium">€{productPrice}</p>
          </div>
          <div>
            <p className={`font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              €{profit} ({profitPercentage}%)
            </p>
          </div>
        </div>

        <button
          onClick={handleAddToOrder}
          disabled={isLoading || isSuccess}
          className={`w-full bg-[#9A3E50] hover:bg-[#7e3241] text-white cursor-pointer py-1.5 px-3 rounded-md font-medium flex items-center justify-center transition-colors text-sm ${isLoading ? "opacity-70" : ""} ${isSuccess ? "bg-green-600 hover:bg-green-700" : ""}`}
        >
          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
          {isLoading ? "Processant..." : isSuccess ? "Afegit!" : "Afegir"}
        </button>
      </div>

      {/* Versió escriptori */}
      <div className="hidden md:block">
        <div className="grid grid-cols-6 gap-4 items-center text-gray-500 text-xs uppercase font-medium pb-1">
          <div></div>
          <div></div>
          <div>Preu Restaurant</div>
          <div>Preu Producte</div>
          <div>Benefici</div>
          <div></div>
        </div>
        <div className="grid grid-cols-6 gap-4 items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-[#9A3E50]/10 flex items-center justify-center mr-2">
              <Home className="h-3 w-3 text-[#9A3E50]" />
            </div>
            <span className="font-medium whitespace-nowrap">Restaurant {request.user_id}</span>
          </div>
          <div className="font-normal">{request.quantity} uds.</div>
          <div className="font-normal">€{request.price_restaurant}</div>
          <div className="font-normal">€{productPrice}</div>
          <div className={`font-normal ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
            €{profit} ({profitPercentage}%)
          </div>
          <div className="text-right">
            <button
              onClick={handleAddToOrder}
              disabled={isLoading || isSuccess}
              className={`bg-[#9A3E50] hover:bg-[#7e3241] text-white cursor-pointer py-1.5 px-3 rounded-md font-medium flex items-center justify-center transition-colors text-sm ml-auto ${isLoading ? "opacity-70" : ""} ${isSuccess ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
              {isLoading ? "Processant..." : isSuccess ? "Afegit!" : "Afegir"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
