import { useState, useEffect } from "react"
import { Star, Heart, Share2, Check, Copy, ShoppingBag, Package } from "lucide-react"
import Modal from "@components/Modal"
import { useFetchUser } from "@components/auth/FetchUser";

export default function ProductInfo({ product, wineTypeName }) {
  const [favorites, setFavorites] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [shareStatus, setShareStatus] = useState("")
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [offerPrice, setOfferPrice] = useState("")
  const [requestStatus, setRequestStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const apiUrl = import.meta.env.VITE_API_URL;

  const user = useFetchUser();
  const role = user.user?.active_role?.[0]

  useEffect(() => {
    // Set initial mobile state
    setIsMobile(window.innerWidth < 768)
    setShowFilters(window.innerWidth >= 768)

    const savedFavorites = document.cookie.split("; ").find((row) => row.startsWith("favorites="))

    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites.split("=")[1])
        setFavorites(parsedFavorites)

        // Check if current product is in favorites
        if (product && product.name) {
          setIsLiked(parsedFavorites.includes(product.name))
        }
      } catch (error) {
        console.error("Error parsing favorites from cookie:", error)
      }
    }
  }, [product])

  // Guardar favoritos en cookies cuando cambien
  useEffect(() => {
    if (favorites.length > 0) {
      const expiryDate = new Date()
      expiryDate.setMonth(expiryDate.getMonth() + 1) // Cookie válida por 1 mes
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

  const handleRequestSubmit = async () => {
    const price = parseFloat(offerPrice)
    if (isNaN(price) || price <= 0) {
      setRequestStatus('error')
      return
    }

    setIsLoading(true)
    setRequestStatus(null)

    try {
      const response = await fetch(`${apiUrl}/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.user?.id,
          product_id: product.id,
          quantity: 1,
          price_restaurant: price
        })
      })

      if (!response.ok) {
        throw new Error('Error en la solicitud')
      }

      const data = await response.json()
      setRequestStatus('success')

      setTimeout(() => {
        setIsRequestOpen(false)
        setRequestStatus(null)
        setOfferPrice("")
      }, 2000)
    } catch (error) {
      console.error('Error al enviar solicitud:', error)
      setRequestStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
          <p className="font-medium">{wineTypeName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Estat</p>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === "in_stock"
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
      </div>

      {/* Actions - Like and Share buttons with functionality */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={toggleFavorite}
          className={`bg-white border hover:bg-gray-50 p-3 rounded-md transition-colors flex items-center gap-2 ${isLiked ? "border-[#9A3E50] text-[#9A3E50]" : "border-gray-300 text-gray-700"
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
        {/* En caso de que sea un usuario con rol restaurante te mostrara el boton */}
        {role === "restaurant" && (
          <button
            onClick={() => setIsRequestOpen(true)}
            className="bg-gradient-to-r from-[#9A3E50] to-[#7a2e3d] text-white p-3 rounded-md transition-colors flex items-center gap-2 hover:from-[#7a2e3d] hover:to-[#5a1e2d]"
          >
            <Package className="w-5 h-5" />
            Sol·licitar producte
          </button>
        )}
      </div>

      {/* Additional Info */}
      <div className="text-sm text-gray-500">
        <p>Data de creació: {new Date(product.created_at).toLocaleDateString()}</p>
      </div>

      {/* Modal de Solicitar Producto */}
      <Modal
        isOpen={isRequestOpen}
        onClose={() => {
          setIsRequestOpen(false)
          setRequestStatus(null)
          setOfferPrice("")
        }}
        title={`Sol·licitar ${product.name}`}
        description="Introdueix el preu que vols oferir per aquest producte"
        icon={<ShoppingBag className="h-8 w-8 text-[#9A3E50]" />}
        variant="default"
        size="md"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsRequestOpen(false)}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel·lar
            </button>
            <button
              onClick={handleRequestSubmit}
              className="flex items-center justify-center rounded-lg bg-gradient-to-r from-[#9A3E50] to-[#7a2e3d] px-4 py-2.5 text-sm font-medium text-white hover:from-[#7a2e3d] hover:to-[#5a1e2d]"
            >
              Enviar sol·licitud
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Preu venta (€)
            </label>
            <input
              type="number"
              id="offerPrice"
              min="0"
              step="0.01"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9A3E50] focus:border-[#9A3E50]"
              placeholder="Introdueix el teu preu"
            />
            {requestStatus === 'error' && (
              <p className="mt-1 text-sm text-red-600">Si us plau, introdueix un preu vàlid</p>
            )}
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Preu actual:</span> {product.price_demanded}€
            </p>
            {offerPrice && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">La teva oferta:</span> {offerPrice}€
                {parseFloat(offerPrice) > parseFloat(product.price_demanded) ? (
                  <span className="ml-2 text-green-600">(Supera el preu actual)</span>
                ) : parseFloat(offerPrice) < parseFloat(product.price_demanded) ? (
                  <span className="ml-2 text-amber-600">(Inferior al preu actual)</span>
                ) : (
                  <span className="ml-2 text-blue-600">(Igual al preu actual)</span>
                )}
              </p>
            )}
          </div>

          {requestStatus === 'success' && (
            <div className="bg-green-50 p-3 rounded-md flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <p className="text-sm text-green-700">
                Sol·licitud enviada correctament! El venedor revisarà la teva oferta i et contactarà aviat.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}