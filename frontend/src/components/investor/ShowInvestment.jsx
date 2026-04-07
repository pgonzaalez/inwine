// Importaciones necesarias
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft, Calendar, User, Store, Wine, Tag, TrendingUp,
  Clock, AlertCircle, ChevronLeft, ChevronRight
} from "lucide-react"
import { StatusBadge } from "@components/investor/StatusBadge"
import { useFetchUser } from "@components/auth/FetchUser"
import { getCookie } from "@/utils/utils"
import { useTranslation } from "react-i18next"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

export default function ShowInvestment() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === "ca" ? "ca-ES" : i18n.language === "es" ? "es-ES" : "en-US"
  const { id: investmentId } = useParams()
  const navigate = useNavigate()
  const [investment, setInvestment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const { user, loading: userLoading } = useFetchUser()
  const apiUrl = import.meta.env.VITE_API_URL
  const baseUrl = import.meta.env.VITE_URL_BASE

  useEffect(() => {
    if (userLoading || !user) return
    fetchInvestment()
  }, [user, investmentId])

  const fetchInvestment = async () => {
    try {
      setIsLoading(true)
      const token = getCookie("token")

      if (!token) {
        setError(t("dashboards.investor.messages.no_token"))
        setIsLoading(false)
        return
      }

      const response = await fetch(`${apiUrl}/${user.id}/investments/${investmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(t("dashboards.investor.details.messages.error_fetch", "No s'ha pogut obtenir la informació de la inversió."))
      }

      const data = await response.json()
      setInvestment(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para formatear el precio con separador de miles
  const formatPrice = (price) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
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

  if (!investment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-2xl text-gray-600">{t("dashboards.investor.details.messages.not_found", "Inversió no trobada")}</p>
      </div>
    )
  }

  // Preparar imágenes para el carousel - ACTUALIZADO para la nueva estructura
  const productImages = []

  // Verificar si existen imágenes en la estructura correcta (ahora en investment.images)
  if (investment.images && Array.isArray(investment.images)) {
    // Ordenar las imágenes por order, poniendo las primarias primero
    const sortedImages = [...investment.images].sort((a, b) => {
      // Primero por is_primary (descendente)
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      // Luego por order (ascendente)
      return a.order - b.order;
    });

    sortedImages.forEach(imgObj => {
      if (imgObj && imgObj.image_path) {
        productImages.push(`${baseUrl}${imgObj.image_path}`)
      }
    })
  }

  // Si no hay imágenes, agregar una imagen de placeholder
  if (productImages.length === 0) {
    productImages.push("/placeholder.svg")
  }

  // Calcular beneficio
  const investmentAmount = investment.product.price_demanded * investment.quantity
  const potentialReturn = investment.price_restaurant * investment.quantity
  const profit = potentialReturn - investmentAmount
  const profitPercentage = ((profit / investmentAmount) * 100).toFixed(2)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <div
          className="flex-1 md:ml-64 p-8 overflow-y-auto pb-16"
          style={{ backgroundColor: primaryColors.background }}
        >
          <main className="container mx-auto px-4 py-8">
            {/* Botón para volver */}
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-700 mb-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t("dashboards.investor.details.back")}
            </button>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna izquierda - Imagen y detalles del producto */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    {/* Imagen del producto con carousel */}
                    <div className="flex flex-col">
                      {/* Imagen principal con navegación */}
                      <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-gray-50">
                        <img
                          src={productImages[activeImage]}
                          alt={investment.product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=400&width=400"
                          }}
                        />

                        {/* Controles de navegación (mostrar solo si hay más de una imagen) */}
                        {productImages.length > 1 && (
                          <>
                            <button
                              onClick={() => setActiveImage((prev) =>
                                prev === 0 ? productImages.length - 1 : prev - 1
                              )}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                              aria-label={t("dashboards.investor.details.aria.previous_image", "Imagen anterior")}
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setActiveImage((prev) =>
                                (prev + 1) % productImages.length
                              )}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                              aria-label={t("dashboards.investor.details.aria.next_image", "Siguiente imagen")}
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Miniaturas (mostrar solo si hay más de una imagen) */}
                      {productImages.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                          {productImages.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveImage(idx)}
                              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${activeImage === idx
                                  ? 'border-[#9A3E50]'
                                  : 'border-transparent'
                                }`}
                              aria-label={`Ver imagen ${idx + 1}`}
                            >
                              <img
                                src={img}
                                alt={`${investment.product.name} - vista ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg?height=64&width=64"
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      )}

                      <h3 className="text-lg font-bold mt-2" style={{ color: primaryColors.dark }}>
                        {investment.product.name}
                      </h3>
                      <p className="text-gray-500">
                        {investment.product.origin} · {investment.product.year}
                      </p>
                    </div>

                    {/* Detalles del producto */}
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold mb-4" style={{ color: primaryColors.dark }}>
                        {t("dashboards.investor.details.product_details")}
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Wine className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: primaryColors.dark }} />
                          <div>
                            <p className="font-medium">{t("dashboards.investor.details.labels.wine_type")}</p>
                            <p className="text-gray-600">{investment.product.wine_type || t("dashboards.investor.details.messages.not_specified", "No especificat")}</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Tag className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: primaryColors.dark }} />
                          <div>
                            <p className="font-medium">{t("dashboards.investor.details.labels.price_demanded")}</p>
                            <p className="text-gray-600">{formatPrice(investment.product.price_demanded)}</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                           <Calendar
                             className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                             style={{ color: primaryColors.dark }}
                           />
                           <div>
                             <p className="font-medium">{t("dashboards.investor.details.labels.year")}</p>
                             <p className="text-gray-600">{investment.product.year}</p>
                           </div>
                         </div>

                         <div className="flex items-start">
                           <User className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: primaryColors.dark }} />
                           <div>
                             <p className="font-medium">{t("dashboards.investor.table.headers.seller")}</p>
                             <p className="text-gray-600">{investment.seller_name}</p>
                           </div>
                         </div>

                         <div className="flex items-start">
                           <Store className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: primaryColors.dark }} />
                           <div>
                             <p className="font-medium">{t("dashboards.investor.table.headers.restaurant")}</p>
                             <p className="text-gray-600">{investment.restaurant_name}</p>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

               {/* Columna derecha - Detalles de la inversión */}
               <div className="lg:col-span-1">
                 <div className="bg-white rounded-xl shadow-sm p-6">
                   <h3 className="text-lg font-bold mb-4" style={{ color: primaryColors.dark }}>
                     {t("dashboards.investor.details.summary_title")}
                   </h3>

                   <div className="space-y-4">
                     <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                       <span className="text-gray-600">{t("dashboards.investor.table.labels.quantity")}</span>
                       <span className="font-medium">{investment.quantity} {t("dashboards.investor.details.messages.units")}</span>
                     </div>

                     <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                       <span className="text-gray-600">{t("dashboards.investor.details.labels.unit_price")}</span>
                       <span className="font-medium">{formatPrice(investment.product.price_demanded)}</span>
                     </div>

                     <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                       <span className="text-gray-600">{t("dashboards.investor.stats.total_invested")}</span>
                       <span className="font-medium">{formatPrice(investmentAmount)}</span>
                     </div>

                     <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                       <span className="text-gray-600">{t("dashboards.investor.details.labels.restaurant_price")}</span>
                       <span className="font-medium">{formatPrice(investment.price_restaurant)}</span>
                     </div>

                     <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                       <span className="text-gray-600">{t("dashboards.investor.table.labels.potential_return")}</span>
                       <span className="font-medium">{formatPrice(potentialReturn)}</span>
                     </div>

                     <div className="flex justify-between items-center pb-2">
                       <span className="text-gray-600">{t("dashboards.investor.stats.potential_profit")}</span>
                      <span
                        className="font-bold"
                        style={{ color: profit > 0 ? "green" : profit < 0 ? "red" : "inherit" }}
                      >
                        {formatPrice(profit)} ({profitPercentage}%)
                      </span>
                    </div>
                  </div>
                </div>

                 {/* Estado de la inversión */}
                 <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                   <h3 className="text-lg font-bold mb-4" style={{ color: primaryColors.dark }}>
                     {t("dashboards.investor.details.status_title")}
                   </h3>

                  <div className="space-y-4">
                     <div className="flex items-start">
                       <Clock className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: primaryColors.dark }} />
                       <div>
                         <p className="font-medium">{t("dashboards.investor.details.labels.investment_date")}</p>
                         <p className="text-gray-600">{formatDate(investment.created_at)}</p>
                       </div>
                     </div>

                    <div className="flex items-start">
                       <AlertCircle
                         className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                         style={{ color: primaryColors.dark }}
                       />
                       <div>
                         <p className="font-medium">{t("dashboards.investor.details.labels.current_status")}</p>
                        <div className="mt-1">
                          <StatusBadge status={investment.status} />
                        </div>
                      </div>
                    </div>

                     <div className="flex items-start">
                       <TrendingUp className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: primaryColors.dark }} />
                       <div>
                         <p className="font-medium">{t("dashboards.investor.stats.profitability_percent")}</p>
                        <p
                          className="text-gray-600 font-bold"
                          style={{ color: profit > 0 ? "green" : profit < 0 ? "red" : "inherit" }}
                        >
                          {profitPercentage}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

             {/* Historial de la inversión (si está disponible) */}
             {investment.history && investment.history.length > 0 && (
               <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                 <h3 className="text-lg font-bold mb-4" style={{ color: primaryColors.dark }}>
                     {t("dashboards.investor.details.history_title")}
                 </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                       <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           {t("dashboards.investor.table.labels.date")}
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           {t("dashboards.investor.table.headers.status")}
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 {t("dashboards.investor.details.table.description")}
                         </th>
                       </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {investment.history.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
