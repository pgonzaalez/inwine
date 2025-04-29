"use client"

import { useState, useEffect } from "react"
import { Star, Heart, Share2, Check, Copy, CornerDownLeft, Edit, Trash } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import ConfirmationDialog from "@components/ConfirmationDialogComponent"

export default function ProductView() {
  const { id: productID } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState({})
  const [wineType, setWineType] = useState({})
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [shareStatus, setShareStatus] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${apiUrl}/v1/products/${productID}`)
        if (!response.ok) {
          throw new Error("No s'ha pogut connectar amb el servidor")
        }
        const data = await response.json()
        if (!data) {
          setErrorMessage("No s'ha trobat el producte.")
        } else {
          setProduct(data)

          // Fetch wine type if available
          if (data.wine_type_id) {
            const typeResponse = await fetch(`${apiUrl}/v1/winetypes/${data.wine_type_id}`)
            if (typeResponse.ok) {
              const typeData = await typeResponse.json()
              setWineType(typeData)
            }
          }
        }
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setLoading(false)
      }
    }

    // Check for success message in location state
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage)
      setShowSuccessNotification(true)

      setTimeout(() => {
        setShowSuccessNotification(false)
      }, 3000)
    }

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

    fetchProduct()
  }, [productID])

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
      setErrorMessage(error.message)
    } finally {
      closeDeleteDialog()
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#9A3E50] rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {showSuccessNotification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {successMessage}
        </div>
      )}

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteProduct}
        title="Eliminar Producte"
        message="Estàs segur que vols eliminar aquest producte? Aquesta acció no es pot desfer."
      />

      <div className="max-w-4xl mx-auto p-4">
        {/* Header with back button and edit/delete actions */}
        <div className="bg-white rounded-t-lg shadow-sm p-4 flex justify-between items-center">
          <Link
            to="/seller/products"
            className="border-2 rounded-lg p-1 hover:bg-gray-200 transition-colors duration-200"
          >
            <CornerDownLeft size={20} className="cursor-pointer" />
          </Link>
          <div className="flex gap-2 items-center">
            <Link
              to={`/seller/products/${productID}/edit`}
              className="border-2 rounded-lg p-1 hover:bg-gray-200 transition-colors duration-200"
            >
              <Edit size={20} className="cursor-pointer" />
            </Link>
            <button
              onClick={openDeleteDialog}
              className="border-2 border-red-500 rounded-lg p-1 hover:bg-red-100 transition-colors duration-200"
            >
              <Trash size={20} className="text-red-500 cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-b-lg shadow-lg p-6">
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

              <div className="text-3xl font-bold text-[#9A3E50] mb-6">€{product.price_demanded}</div>

              <div className="prose prose-sm max-w-none text-gray-600 mb-6">
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
                    product.status === "in_stock"
                      ? "bg-green-100 text-green-800"
                      : product.status === "out_of_stock"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {product.status === "in_stock"
                    ? "En stock"
                    : product.status === "out_of_stock"
                      ? "Sense stock"
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
                  isLiked ? "border-[#9A3E50] text-[#9A3E50]" : "border-gray-300 text-gray-700"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-[#9A3E50]" : ""}`} />
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
    </div>
  )
}
