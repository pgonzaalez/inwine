"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Edit, Trash, ArrowLeft, DollarSign, Store, Tag, MapPin, Calendar, Wine } from "lucide-react"
import { getCookie } from "@/utils/utils";
import { useFetchUser } from "@components/auth/FetchUser"
import { DeleteRequestModal } from "@/components/restaurant/modals/DeleteRequestModal";
import ProductGallery from "@/components/landing/requests/ProductGallery"
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}
// Componente para el badge de estado
const StatusBadge = ({ status }) => {
  let backgroundColor
  let textColor
  let statusText

  switch (status) {
    case "pending":
      backgroundColor = "#FFF8E1"
      textColor = "#FFA000"
      statusText = "Pendent"
      break
    case "accepted":
      backgroundColor = "#E8F5E9"
      textColor = "#2E7D32"
      statusText = "Acceptat"
      break
    case "in_transit":
      backgroundColor = "#E3F2FD"
      textColor = "#1565C0"
      statusText = "En Trànsit"
      break
    case "in_my_local":
      backgroundColor = "#E8F5E9"
      textColor = "#2E7D32"
      statusText = "Al Local"
      break
    case "sold":
      backgroundColor = "#ECEFF1"
      textColor = "#546E7A"
      statusText = "Venut"
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
      className="px-3 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-full"
      style={{ backgroundColor, color: textColor }}
    >
      {statusText}
    </span>
  )
}

// Función para obtener el color del tipo de vino
const getWineTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case "negre":
      return "#2D1B1E"
    case "blanc":
      return "#F7F5E8"
    case "rossat":
      return primaryColors.light
    case "espumós":
      return "#F2EFD3"
    case "dolç":
      return "#E8D0B5"
    default:
      return `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
        primaryColors.dark.slice(3, 5),
        16,
      )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`
  }
}

// Componente principal
export default function ViewOneRequest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { user, loading: userLoading } = useFetchUser()
  const apiUrl = import.meta.env.VITE_API_URL
  const baseUrl = import.meta.env.VITE_URL_BASE

  useEffect(() => {
    if (!user || userLoading) return
    fetchRequest()
  }, [user, id])

  const fetchRequest = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${apiUrl}/v1/${user.id}/restaurant/${id}`)
      if (!response.ok) {
        throw new Error("No s'ha pogut obtenir la informació de la sol·licitud.")
      }
      const data = await response.json()
      setRequest(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRequest = async () => {
    try {
      const response = await fetch(`${apiUrl}/v1/restaurant/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("No s'ha pogut eliminar la sol·licitud.")
      }

      navigate(`/restaurant/dashboard`, {
        state: { successMessage: "Sol·licitud eliminada correctament." },
      })
    } catch (err) {
      console.error(err.message)
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const handleReceiveProduct = async () => {
    try {
      const response = await fetch(`${apiUrl}/${user.id}/requests/${id}/receive`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("No s'ha pogut actualitzar l'estat de la sol·licitud.")
      }

      // Actualizar la solicitud después de cambiar el estado
      fetchRequest()
    } catch (err) {
      console.error(err.message)
    }
  }

  const handleSellProduct = async () => {
    try {
      const response = await fetch(`${apiUrl}/${user.id}/requests/${id}/sell`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("No s'ha pogut actualitzar l'estat de la sol·licitud.")
      }

      // Actualizar la solicitud después de cambiar el estado
      fetchRequest()
    } catch (err) {
      console.error(err.message)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ca-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading || userLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="w-12 h-12 rounded-full animate-spin"
          style={{
            borderWidth: "4px",
            borderStyle: "solid",
            borderColor: primaryColors.light,
            borderTopColor: primaryColors.dark,
          }}
        ></div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="bg-white text-center p-8 rounded-xl shadow-sm"
        style={{
          borderLeft: `4px solid ${primaryColors.dark}`,
          color: primaryColors.dark,
        }}
      >
        {error}
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-2xl text-gray-600">Sol·licitud no trobada</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        {/* Sidebar margin */}
        <div
          className="flex-1 md:ml-64 p-8 overflow-y-auto pb-16"
          style={{ backgroundColor: primaryColors.background }}
        >
          <main className="container mx-auto px-4 py-8">
            {/* Back Arrow */}
            <button
              onClick={() => navigate(-1)} // Navegar hacia atrás
              className="flex items-center text-gray-500 hover:text-gray-700 mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tornar
            </button>

            {/* SECTION 1: Request Details Section */}
            <section className="mb-8 transition-all duration-500 ease-in-out">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Images */}
                <ProductGallery
                  images={request.images}
                  productName={request.product.name}
                  baseUrl={baseUrl}
                />
                {/* Right Column - Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{request.product.name}</h1>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-lg text-gray-500">
                        {request.product.year} · {request.product.origin}
                      </span>
                      {request.product.wine_type && (
                        <span
                          className="px-2 py-1 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: getWineTypeColor(request.product.wine_type),
                            color: ["blanc", "espumós"].includes(request.product.wine_type?.toLowerCase())
                              ? "#333"
                              : "white",
                          }}
                        >
                          {request.product.wine_type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <StatusBadge status={request.status} />
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Preu demandat</p>
                          <p className="font-medium">{request.product.price_demanded}€</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Store className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Preu restaurant</p>
                          <p className="font-medium" style={{ color: primaryColors.dark }}>
                            {request.price_restaurant}€
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Data de sol·licitud</p>
                        <p className="font-medium">{formatDate(request.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Detalls del producte</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-start gap-2">
                        <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Quantitat</p>
                          <p className="font-medium">{request.product.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Origen</p>
                          <p className="font-medium">{request.product.origin || "No especificat"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Wine className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Tipus de vi</p>
                          <p className="font-medium">{request.product.wine_type || "No especificat"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-wrap gap-4 mt-6">
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() => navigate(`/restaurant/requests/${id}/edit`)}
                          className="bg-blue-500 text-white p-3 rounded-md transition-colors flex items-center gap-2 hover:bg-blue-600"
                        >
                          <Edit className="w-5 h-5" />
                          Editar
                        </button>
                        <button
                          onClick={() => setIsDeleteDialogOpen(true)}
                          className="bg-red-500 text-white p-3 rounded-md transition-colors flex items-center gap-2 hover:bg-red-600"
                        >
                          <Trash className="w-5 h-5" />
                          Eliminar
                        </button>
                      </>
                    )}

                    {request.status === "in_transit" && (
                      <button
                        onClick={handleReceiveProduct}
                        className="bg-[#9A3E50] text-white p-3 rounded-md transition-colors flex items-center gap-2 hover:bg-[#8A2D40]"
                      >
                        <Store className="w-5 h-5" />
                        He rebut el producte
                      </button>
                    )}

                    {request.status === "in_my_local" && (
                      <button
                        onClick={handleSellProduct}
                        className="bg-emerald-500 text-white p-3 rounded-md transition-colors flex items-center gap-2 hover:bg-emerald-600"
                      >
                        <DollarSign className="w-5 h-5" />
                        He venut el producte
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Modal de eliminación */}
          <DeleteRequestModal
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteRequest}
          />
        </div>
      </div>
    </div>
  )
}
