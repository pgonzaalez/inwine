"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useFetchUser } from "@components/auth/FetchUser"
import { Package, Check, ShoppingBag } from "lucide-react"
import ProductGrid from "@/components/landing/products/ProductGrid"

const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

function RestaurantRequestFormComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useFetchUser()
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  
  const [selectedProductId, setSelectedProductId] = useState("")
  const [offerPrice, setOfferPrice] = useState("")
  const [requestStatus, setRequestStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true)
      try {
        const response = await fetch(`${apiUrl}/v1/products`)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        setProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [apiUrl])

  const selectedProduct = products.find(p => p.id === Number(selectedProductId))

  const handleRequestSubmit = async (e) => {
    e.preventDefault()
    if (!selectedProduct) return

    const price = parseFloat(offerPrice);
    const productPrice = parseFloat(selectedProduct.price_demanded);

    // Validaciones
    if (isNaN(price) || price <= 0) {
      setRequestStatus('error');
      return;
    }

    if (price < productPrice) {
      setRequestStatus('price_error');
      return;
    }

    setIsSubmitting(true);
    setRequestStatus(null);

    try {
      const response = await fetch(`${apiUrl}/v1/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          product_id: selectedProduct.id,
          quantity: 1,
          price_restaurant: price
        })
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      setRequestStatus('success');

      setTimeout(() => {
        setRequestStatus(null);
        setOfferPrice("");
        setSelectedProductId("");
        navigate('/restaurant/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setRequestStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-[1400px] w-full mx-auto">
      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm text-center">
        <div className="mx-auto bg-[#9A3E50]/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-[#9A3E50]" />
        </div>
        <h1 className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          {t("sidebar.nav.request_product", "Sol·licitar producte")}
        </h1>
        <p className="text-gray-500 mt-2">
          {t("dashboards.restaurant.requests.description")}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
        <form onSubmit={handleRequestSubmit} className="space-y-6">
          
          {/* Selector de Vino */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t("dashboards.restaurant.requests.step1_title")}
            </h2>
            {loadingProducts ? (
              <div className="w-full p-8 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-center gap-3 text-gray-500">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-[#9A3E50] rounded-full animate-spin" />
                {t("dashboards.restaurant.requests.loading_catalog")}
              </div>
            ) : (
              <ProductGrid 
                products={products}
                compact={true}
                onSelectProduct={(id) => {
                  setSelectedProductId(id)
                  setOfferPrice("")
                  setRequestStatus(null)
                }}
                selectedProductId={Number(selectedProductId)}
              />
            )}
          </div>

          {/* Información del producto y Oferta */}
          {selectedProduct && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {t("dashboards.restaurant.requests.step2_title", { name: selectedProduct.name })}
              </h2>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{selectedProduct.name}</h3>
                    <p className="text-sm text-gray-500">{t("dashboards.restaurant.requests.origin")}: {selectedProduct.origin} • {t("dashboards.restaurant.requests.year")}: {selectedProduct.year}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <span className="text-sm text-gray-500 block">{t("dashboards.restaurant.requests.current_price")}</span>
                    <span className="text-xl font-bold text-[#9A3E50]">{selectedProduct.price_demanded}€</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("dashboards.restaurant.requests.your_offer")}
                  </label>
                  <input
                    type="number"
                    id="offerPrice"
                    min="0"
                    step="0.01"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#9A3E50] focus:border-[#9A3E50]"
                    placeholder={t("dashboards.restaurant.requests.placeholder_offer")}
                    required
                  />
                  
                  {offerPrice && (
                    <p className="text-sm mt-3">
                      {parseFloat(offerPrice) > parseFloat(selectedProduct.price_demanded) ? (
                        <span className="text-green-600 font-medium">{t("dashboards.restaurant.requests.offer_higher")}</span>
                      ) : parseFloat(offerPrice) < parseFloat(selectedProduct.price_demanded) ? (
                        <span className="text-amber-600 font-medium">{t("dashboards.restaurant.requests.offer_lower")}</span>
                      ) : (
                        <span className="text-blue-600 font-medium">{t("dashboards.restaurant.requests.offer_equal")}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Respuestas de estado */}
          {requestStatus === 'error' && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100">
              {t("dashboards.restaurant.requests.error_invalid_price")}
            </div>
          )}
          {requestStatus === 'price_error' && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100">
              {t("dashboards.restaurant.requests.error_low_price")}
            </div>
          )}
          {requestStatus === 'success' && (
            <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-100 flex items-start">
              <Check className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>
                {t("dashboards.restaurant.requests.success")}
              </span>
            </div>
          )}

          {/* Botón enviar */}
          <button
            type="submit"
            disabled={isSubmitting || !selectedProduct}
            className={`w-full py-3 px-4 flex justify-center items-center rounded-lg text-white font-medium transition-all ${
              isSubmitting || !selectedProduct
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#9A3E50] to-[#7a2e3d] hover:from-[#7a2e3d] hover:to-[#5a1e2d]"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("dashboards.restaurant.requests.sending")}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {t("dashboards.restaurant.requests.make_request")}
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function RestaurantProductsPage() {
  const { loading } = useFetchUser()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <div
          className="flex-1 md:ml-64 p-8 overflow-y-auto pb-16"
          style={{ backgroundColor: primaryColors.background }}
        >
          {loading ? (
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
          ) : (
            <RestaurantRequestFormComponent />
          )}
        </div>
      </div>
    </div>
  )
}
