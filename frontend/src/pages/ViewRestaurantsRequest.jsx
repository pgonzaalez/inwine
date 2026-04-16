"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next";
import Footer from "../components/FooterComponent"
import RequestsSection from "../components/landing/requests/RequestSection"

export default function RestaurantDetail() {
  const baseUrl = import.meta.env.VITE_URL_BASE || "http://localhost:8000"
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api"
  const { t } = useTranslation();
  const { id } = useParams()

  const [restaurant, setRestaurant] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [wineTypes, setWineTypes] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!id) {
          // console.error("ID del restaurant no trobat")
          setError("ID del restaurant no trobat")
          setLoading(false)
          return
        }

        const restaurantResponse = await fetch(`${apiUrl}/v1/restaurants-info/${id}`)

        if (!restaurantResponse.ok) {
          throw new Error("Error en obtenir les dades del restaurant")
        }

        const restaurantData = await restaurantResponse.json()
        setRestaurant(restaurantData)

        const requestsResponse = await fetch(`${apiUrl}/v1/${restaurantData.user_id}/restaurant`)

        if (!requestsResponse.ok) {
          throw new Error("Error en obtenir les dades de les sol·licituts del restaurant")
        }

        const requestsData = await requestsResponse.json()

        setRequests(Array.isArray(requestsData) ? requestsData : [])
        setError(null)
        setLoading(false)
      } catch (error) {
        console.error("Error en obtenir detalls del restaurant:", error)
        // setError("Error en obtenir detalls del restaurant")
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [id, apiUrl])

  // Get wine type name
  useEffect(() => {
    const fetchWineTypes = async () => {
      try {
        const response = await fetch(`${apiUrl}/v1/winetypes`)
        if (!response.ok) {
          throw new Error("Error en obtenir els tipus de vi")
        }
        const data = await response.json()
        setWineTypes(data.data || data)
      } catch (error) {
        // console.error("Error en obtenir els tipus de vi:", error)
      }
    }

    fetchWineTypes()
  }, [apiUrl])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-2xl text-red-600">{error}</p>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-2xl text-gray-600">Producte no trobat</p>
      </div>
    )
  }

  // Only include actual images, no placeholders
  const productImages = []
  if (restaurant.image) {
    productImages.push(restaurant.image)
  }
  if (restaurant.images && Array.isArray(restaurant.images)) {
    productImages.push(...restaurant.images)
  }

  // Find wine type name
  const wineType = Array.isArray(wineTypes) ? wineTypes.find((type) => type.id === restaurant.wine_type_id) : null
  const wineTypeName = wineType ? wineType.name || wineType.type : "Vi"

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-[#9A3E50]">
            Inici
          </a>{" "}
          /
          <a href="/vinos" className="hover:text-[#9A3E50] mx-1">
            Vins
          </a>{" "}
          /<span className="text-gray-700">{restaurant.name}</span>
        </div>

        {/* SECTION 1: Product Details Section */}
        <section className="mb-8 transition-all duration-500 ease-in-out">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div className="space-y-4">
              <div className="relative bg-gray-50 rounded-lg overflow-hidden h-[500px]">
                {restaurant.image ? (
                  <img
                    src={
                      restaurant.image 
                        ? (restaurant.image.includes("storage") 
                            ? `${baseUrl}${restaurant.image}` 
                            : restaurant.image)
                        : "/placeholder.svg"
                    }
                    alt={restaurant.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No hi ha imatge disponible
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-16">{restaurant.name}</h1>

                <div className="prose prose-sm max-w-none text-gray-600 mb-10">
                  <p>
                    {restaurant.description || `Sense descripció`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-500">Adreça</p>
                  <p className="font-medium">{restaurant.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Zona</p>
                  <p className="font-medium">{restaurant.zone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t("auth.register.labels.restaurant_diners")}</p>
                  <p className="font-medium">{restaurant.number_of_diners}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t("auth.register.labels.restaurant_shifts")}</p>
                  <p className="font-medium">{t(`dashboards.restaurant.shifts.${restaurant.shifts}`)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t("auth.register.labels.restaurant_rotation")}</p>
                  <p className="font-medium">{restaurant.wine_rotation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t("auth.register.labels.restaurant_wines")}</p>
                  <p className="font-medium">{restaurant.reference_number} {t("dashboards.seller.management.table.count_plural")}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-sm text-gray-500">
                <p>Data de creació: {new Date(restaurant.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Requests Section */}
        <RequestsSection requests={requests} mode={"restaurant_view"} productPrice={0} />
      </main>

      {/* Global styles for animations as a regular style tag */}
      <style>
        {`
        input:focus, select:focus {
          box-shadow: 0 0 0 2px rgba(154, 62, 80, 0.2);
        }

        .hover-scale {
          transition: transform 0.2s ease;
        }

        .hover-scale:hover {
          transform: scale(1.02);
        }

        /* Animació per als elements del filtre */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Animació per als botons */
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(154, 62, 80, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(154, 62, 80, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(154, 62, 80, 0);
          }
        }

        /* Millora visual per als inputs */
        input::placeholder, select::placeholder {
          color: #9ca3af;
          opacity: 0.7;
        }

        /* Efecte de hover per a les targetes */
        .request-card {
          transition: all 0.3s ease;
        }

        .request-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        `}
      </style>

      <Footer />
    </div>
  )
}