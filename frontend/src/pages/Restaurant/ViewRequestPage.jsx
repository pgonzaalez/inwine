"use client"

import { useState, useEffect } from "react"
import { useFetchUser } from "@components/auth/FetchUser"
import { primaryColors } from "@/components/restaurant/utils/colors"
import { Star, Heart, Share2, Check, Copy, CornerDownLeft, Edit, Trash } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import ConfirmationDialog from "@components/ConfirmationDialogComponent"
import { Notification } from "@/components/restaurant/Notification"

function RestaurantProductViewComponent() {
  const { id: productID } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState({})
  const [wineType, setWineType] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [shareStatus, setShareStatus] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [receivingProduct, setReceivingProduct] = useState(null)
  const [sellingProduct, setSellingProduct] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL
  const baseUrl = import.meta.env.VITE_URL_BASE

  const { user, loading: userLoading } = useFetchUser()

  useEffect(() => {
    if (userLoading || !user) return // Wait until user is loaded

    fetchProduct()

    // Set favorites from cookies
    const savedFavorites = document.cookie.split("; ").find((row) => row.startsWith("favorites="))
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites.split("=")[1])
        setFavorites(parsedFavorites)
      } catch (error) {
        console.error("Error parsing favorites from cookie:", error)
      }
    }

    // Check for success message in location state
    if (location.state?.successMessage) {
      setNotification({ type: "success", message: location.state.successMessage })
      setTimeout(() => setNotification(null), 3000)
    }
  }, [user, productID])

  // Update isLiked when product or favorites change
  useEffect(() => {
    if (product && product.name && favorites.length > 0) {
      setIsLiked(favorites.includes(product.name))
    }
  }, [product, favorites])

  // Save favorites to cookies when they change
  useEffect(() => {
    if (favorites.length > 0) {
      const expiryDate = new Date()
      expiryDate.setMonth(expiryDate.getMonth() + 1) // Cookie valid for 1 month
      document.cookie = `favorites=${JSON.stringify(favorites)}; expires=${expiryDate.toUTCString()}; path=/`
    } else {
      document.cookie = "favorites=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
  }, [favorites])

  const fetchProduct = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${apiUrl}/v1/products/${productID}`)

      if (!response.ok) {
        throw new Error("No s'ha pogut connectar amb el servidor")
      }

      const data = await response.json()
      if (!data) {
        throw new Error("No s'ha trobat el producte.")
      }

      setProduct(data)

      // Fetch wine type if available
      if (data.wine_type_id) {
        const typeResponse = await fetch(`${apiUrl}/v1/winetypes/${data.wine_type_id}`)
        if (typeResponse.ok) {
          const typeData = await typeResponse.json()
          setWineType(typeData)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconegut")
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle like status
  const toggleFavorite = () => {
    if (!product || !product.name) return

    const productName = product.name

    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(productName)) {
        setIsLiked(false)
        return prevFavorites.filter((name) => name !== productName)
      } else {
        setIsLiked(true)
        return [...prevFavorites, productName]
      }
    })
  }

  // Share functionality
  const shareProduct = async () => {
    if (!product) return

    const shareData = {
      title: product.name,
      text: `Descobreix ${product.name}, collita ${product.year} de ${product.origin}`,
      url: window.location.href,
    }

    // Check if Web Share API is supported
    if (navigator && navigator.share) {
      try {
        await navigator.share(shareData)
        setShareStatus("Compartit!")
        setTimeout(() => setShareStatus(""), 2000)
      } catch (err) {
        console.error("Error en compartir:", err)
        fallbackShare()
      }
    } else {
      fallbackShare()
    }
  }

  // Fallback share method - copy to clipboard
  const fallbackShare = () => {
    if (!navigator || !navigator.clipboard) {
      setShareStatus("No es pot compartir")
      setTimeout(() => setShareStatus(""), 2000)
      return
    }

    const url = window.location.href
    navigator.clipboard.writeText(url).then(
      () => {
        setShareStatus("URL copiada!")
        setTimeout(() => setShareStatus(""), 2000)
      },
      () => {
        setShareStatus("Error en copiar")
        setTimeout(() => setShareStatus(""), 2000)
      },
    )
  }

  // Delete dialog functions
  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
  }

  // Delete product function
  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`${apiUrl}/v1/products/${productID}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("No s'ha pogut eliminar el producte")
      }

      // Redirect to products list with success message
      navigate(`/seller/products`, {
        state: { successMessage: "Producte eliminat correctament ✅" },
      })
    } catch (error) {
      setNotification({ type: "error", message: error.message })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      closeDeleteDialog()
    }
  }

  // Handle receiving product
  const handleReceiveProduct = async () => {
    if (!productID) {
      setNotification({ type: "error", message: "ID de producto no válido" })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    try {
      // Marcar como recibiendo
      setReceivingProduct(productID)

      // URL del endpoint
      const url = `${apiUrl}/v1/logistic/${productID}/deliver`

      // Realizar la petición POST
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      // Procesar la respuesta
      if (!response.ok) {
        throw new Error("Error al marcar com rebut")
      }

      // Actualizar el estado local
      setProduct({ ...product, status: "in_my_local" })

      // Mostrar notificación de éxito
      setNotification({ type: "success", message: "Producte rebut correctament" })
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      setNotification({ type: "error", message: error.message })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setReceivingProduct(null)
    }
  }

  // Handle selling product
  const handleSellProduct = async () => {
    if (!productID) {
      setNotification({ type: "error", message: "ID de producto no válido" })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    try {
      // Marcar como vendiendo
      setSellingProduct(productID)

      // URL del endpoint
      const url = `${apiUrl}/v1/logistic/${productID}/sell`

      // Realizar la petición POST
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      // Procesar la respuesta
      if (!response.ok) {
        throw new Error("Error al marcar com venut")
      }

      // Actualizar el estado local
      setProduct({ ...product, status: "sold" })

      // Mostrar notificación de éxito
      setNotification({ type: "success", message: "Producte venut correctament" })
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      setNotification({ type: "error", message: error.message })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setSellingProduct(null)
    }
  }

  if (userLoading || isLoading) {
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

  return (
    <div>
      <Notification notification={notification} />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteProduct}
        title="Eliminar Producte"
        message="Estàs segur que vols eliminar aquest producte? Aquesta acció no es pot desfer."
      />

      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
            Detalls del Producte
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/seller/products")}
              className="border-2 rounded-lg p-1 hover:bg-gray-200 transition-colors duration-200"
            >
              <CornerDownLeft size={20} className="cursor-pointer" />
            </button>
            <button
              onClick={() => navigate(`/seller/products/${productID}/edit`)}
              className="border-2 rounded-lg p-1 hover:bg-gray-200 transition-colors duration-200"
            >
              <Edit size={20} className="cursor-pointer" />
            </button>
            <button
              onClick={openDeleteDialog}
              className="border-2 border-red-500 rounded-lg p-1 hover:bg-red-100 transition-colors duration-200"
            >
              <Trash size={20} className="text-red-500 cursor-pointer" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Product details */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">(24 ressenyes)</span>
                  </div>
                </div>

                <div className="text-3xl font-bold" style={{ color: primaryColors.dark }}>
                  €{product.price_demanded}
                </div>

                <div className="prose prose-sm max-w-none text-gray-600 mb-6 mt-4">
                  <p>
                    {product.description ||
                      `Un vi excepcional de ${product.origin}, collita ${product.year}. Perfecte per a ocasions especials i maridatges sofisticats.`}
                  </p>
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-500">Origen</p>
                  <p className="font-medium">{product.origin}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Any</p>
                  <p className="font-medium">{product.year}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipus</p>
                  <p className="font-medium">{wineType.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estat</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === "in_stock" || product.status === "in_my_local"
                        ? "bg-green-100 text-green-800"
                        : product.status === "out_of_stock" || product.status === "sold"
                          ? "bg-red-100 text-red-800"
                          : product.status === "in_transit" || product.status === "accepted"
                            ? "bg-blue-100 text-blue-800"
                            : product.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status === "in_stock" || product.status === "in_my_local"
                      ? "En stock"
                      : product.status === "out_of_stock" || product.status === "sold"
                        ? "Sense stock / Venut"
                        : product.status === "in_transit" || product.status === "accepted"
                          ? "En trànsit"
                          : product.status === "pending"
                            ? "Pendent"
                            : "Desconegut"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Quantitat</p>
                  <p className="font-medium">{product.quantity} unitats</p>
                </div>
              </div>

              {/* Actions - Like and Share buttons with functionality */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={toggleFavorite}
                  className={`bg-white border hover:bg-gray-50 p-3 rounded-md transition-colors flex items-center gap-2 ${
                    isLiked
                      ? `border-[${primaryColors.dark}] text-[${primaryColors.dark}]`
                      : "border-gray-300 text-gray-700"
                  }`}
                  style={isLiked ? { borderColor: primaryColors.dark, color: primaryColors.dark } : {}}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? `fill-[${primaryColors.dark}]` : ""}`}
                    style={isLiked ? { fill: primaryColors.dark } : {}}
                  />
                  {isLiked ? "M'agrada" : "M'agrada"}
                </button>
                <div className="relative">
                  <button
                    onClick={shareProduct}
                    className="bg-white border border-gray-300 hover:bg-gray-50 p-3 rounded-md flex items-center gap-2"
                  >
                    {shareStatus ? (
                      shareStatus === "Compartit!" || shareStatus === "URL copiada!" ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-700" />
                      )
                    ) : (
                      <Share2 className="w-5 h-5 text-gray-700" />
                    )}
                    {shareStatus || "Compartir"}
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-sm text-gray-500">
                <p>Data de creació: {new Date(product.created_at).toLocaleDateString()}</p>
                {product.updated_at && <p>Última actualització: {new Date(product.updated_at).toLocaleDateString()}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4" style={{ color: primaryColors.dark }}>
              Accions
            </h2>

            {/* Product status actions */}
            <div className="space-y-3">
              {(product.status === "accepted" || product.status === "in_transit") && (
                <button
                  onClick={handleReceiveProduct}
                  disabled={!!receivingProduct}
                  className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex justify-center items-center"
                >
                  {receivingProduct ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : null}
                  Marcar com Rebut
                </button>
              )}

              {product.status === "in_my_local" && (
                <button
                  onClick={handleSellProduct}
                  disabled={!!sellingProduct}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex justify-center items-center"
                >
                  {sellingProduct ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : null}
                  Marcar com Venut
                </button>
              )}

              {product.status === "sold" && (
                <div className="p-3 bg-gray-100 rounded-md text-center text-gray-700">
                  Aquest producte ja ha estat venut
                </div>
              )}

              {product.status === "pending" && (
                <div className="p-3 bg-yellow-50 rounded-md text-center text-yellow-700">Pendent d'acceptació</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RestaurantProductView() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <div
          className="flex-1 md:ml-64 p-8 overflow-y-auto pb-16"
          style={{ backgroundColor: primaryColors.background }}
        >
          <RestaurantProductViewComponent />
        </div>
      </div>
    </div>
  )
}
