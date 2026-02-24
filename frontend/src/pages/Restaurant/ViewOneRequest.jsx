"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Edit, Trash, ArrowLeft, DollarSign, Store, Tag, MapPin, Calendar, Wine } from "lucide-react"
import { getCookie } from "@/utils/utils";
import { useFetchUser } from "@components/auth/FetchUser"
import { DeleteRequestModal } from "@/components/restaurant/modals/DeleteRequestModal";
import { EditRequestModal } from "@/components/restaurant/modals/EditRequestModal";
import ProductGallery from "@/components/landing/requests/ProductGallery"

const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

// Componente para el badge de estado
const StatusBadge = ({ status }) => {
  const { t } = useTranslation()
  let backgroundColor
  let textColor
  let statusText

  switch (status) {
    case "pending":
      backgroundColor = "#FFF8E1"
      textColor = "#FFA000"
      statusText = t("dashboards.restaurant.status.pending")
      break
    case "accepted":
      backgroundColor = "#E8F5E9"
      textColor = "#2E7D32"
      statusText = t("dashboards.restaurant.status.accepted")
      break
    case "in_transit":
      backgroundColor = "#E3F2FD"
      textColor = "#1565C0"
      statusText = t("dashboards.restaurant.status.in_transit")
      break
    case "in_my_local":
      backgroundColor = "#E8F5E9"
      textColor = "#2E7D32"
      statusText = t("dashboards.restaurant.status.in_my_local")
      break
    case "sold":
      backgroundColor = "#ECEFF1"
      textColor = "#546E7A"
      statusText = t("dashboards.restaurant.status.sold")
      break
    case "cancelled":
      backgroundColor = "#FFEBEE"
      textColor = "#C62828"
      statusText = t("dashboards.restaurant.status.cancelled")
      break
    default:
      backgroundColor = "#ECEFF1"
      textColor = "#546E7A"
      statusText = t("dashboards.restaurant.status.unknown")
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
      return "#EBBF99"
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
  const { t } = useTranslation()
  const [request, setRequest] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Estados para el modal de edición
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [offerPrice, setOfferPrice] = useState("")
  const [requestStatus, setRequestStatus] = useState(null)

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
        throw new Error(t("dashboards.restaurant.messages.error_fetch"))
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
        throw new Error(t("dashboards.restaurant.messages.error_delete"))
      }

      navigate(`/restaurant/dashboard`, {
        state: { successMessage: t("dashboards.restaurant.messages.success_delete") },
      })
    } catch (err) {
      console.error(err.message)
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const handleRequestSubmit = async () => {
    // Validar que el precio sea válido
    if (!offerPrice || isNaN(parseFloat(offerPrice)) || parseFloat(offerPrice) <= 0) {
      setRequestStatus("error");
      return;
    }

    try {
      // Enviamos solo el precio actualizado
      const response = await fetch(`${apiUrl}/v1/restaurants/${id}?price_restaurant=${offerPrice}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        }
      });

      if (!response.ok) {
        throw new Error(t("dashboards.restaurant.messages.error_update"));
      }

      // Actualizar el estado
      setRequestStatus("success");

      // Cerrar el modal después de 2 segundos
      setTimeout(() => {
        setIsRequestOpen(false);
        setRequestStatus(null);
        setOfferPrice("");
        // Recargar los datos
        fetchRequest();
      }, 2000);

    } catch (err) {
      console.error(err.message);
      setRequestStatus("error");
    }
  };

  const handleReceiveProduct = async () => {
    try {
      const productId = request.product.id;
      const url = `${apiUrl}/v1/logistic/${productId}/deliver`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(t("dashboards.restaurant.messages.error_update_status", "No s'ha pogut actualitzar l'estat de la sol·licitud."))
      }

      // Actualizar la solicitud después de cambiar el estado
      fetchRequest()
    } catch (err) {
      console.error(err.message)
    }
  }

  const handleSellProduct = async () => {
    try {
      const productId = request.product.id;
      const url = `${apiUrl}/v1/logistic/${productId}/sell`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(t("dashboards.restaurant.messages.error_update_status", "No s'ha pogut actualitzar l'estat de la sol·licitud."))
      }

      // Actualizar la solicitud después de cambiar el estado
      fetchRequest()
    } catch (err) {
      console.error(err.message)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(i18n.language === 'ca' ? 'ca-ES' : i18n.language === 'es' ? 'es-ES' : 'en-US', {
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
        <p className="text-2xl text-gray-600">{t("dashboards.restaurant.view.not_found")}</p>
      </div>
    )
  }

  // Preparar imágenes del producto para el carousel
  const productImages = [];

  // Verificar si existen imágenes en la estructura correcta
  if (request.images && Array.isArray(request.images)) {
    // Pasar los objetos completos de imagen, no solo las rutas
    productImages.push(...request.images);
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
              {t("dashboards.restaurant.view.back")}
            </button>

            {/* SECTION 1: Request Details Section */}
            <section className="mb-8 transition-all duration-500 ease-in-out">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Images */}
                <ProductGallery
                  images={productImages}
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
                          <p className="text-sm text-gray-500">{t("dashboards.restaurant.view.price_demanded")}</p>
                          <p className="font-medium">{request.product.price_demanded}€</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Store className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">{t("dashboards.restaurant.view.price_restaurant")}</p>
                          <p className="font-medium" style={{ color: primaryColors.dark }}>
                            {request.price_restaurant}€
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">{t("dashboards.restaurant.view.request_date")}</p>
                        <p className="font-medium">{formatDate(request.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t("dashboards.restaurant.view.product_details")}</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">{t("dashboards.restaurant.view.origin")}</p>
                          <p className="font-medium">{request.product.origin || t("dashboards.restaurant.view.not_specified")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Wine className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">{t("dashboards.restaurant.view.wine_type")}</p>
                          <p className="font-medium">{request.product.wine_type || t("dashboards.restaurant.view.not_specified")}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-wrap gap-4 mt-6">
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() => setIsRequestOpen(true)}
                          className="bg-blue-500 text-white p-3 rounded-md transition-colors flex items-center gap-2 hover:bg-blue-600"
                        >
                          <Edit className="w-5 h-5" />
                          {t("dashboards.restaurant.table.actions.edit")}
                        </button>
                        <button
                          onClick={() => setIsDeleteDialogOpen(true)}
                          className="bg-red-500 text-white p-3 rounded-md transition-colors flex items-center gap-2 hover:bg-red-600"
                        >
                          <Trash className="w-5 h-5" />
                          {t("dashboards.restaurant.table.actions.delete")}
                        </button>
                      </>
                    )}

                    {request.status === "in_transit" && (
                      <button
                        onClick={handleReceiveProduct}
                        className="bg-[#9A3E50] text-white p-3 rounded-md transition-colors flex items-center gap-2 hover:bg-[#8A2D40]"
                      >
                        <Store className="w-5 h-5" />
                        {t("dashboards.restaurant.table.actions.receive")}
                      </button>
                    )}

                    {request.status === "in_my_local" && (
                      <button
                        onClick={handleSellProduct}
                        className="bg-emerald-500 text-white p-3 rounded-md transition-colors flex items-center gap-2 hover:bg-emerald-600"
                      >
                        <DollarSign className="w-5 h-5" />
                        {t("dashboards.restaurant.table.actions.sell")}
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

          {/* Modal de edición */}
          <EditRequestModal
            isOpen={isRequestOpen}
            onClose={() => {
              setIsRequestOpen(false);
              setRequestStatus(null);
              setOfferPrice("");
            }}
            onSubmit={handleRequestSubmit}
            offerPrice={offerPrice}
            setOfferPrice={setOfferPrice}
            product={request?.product || {}}
            requestStatus={requestStatus}
          />
        </div>
      </div>
    </div>
  )
}