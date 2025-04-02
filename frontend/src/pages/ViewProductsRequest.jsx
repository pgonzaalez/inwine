import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import Header from "@/components/HeaderComponent"
import Footer from "@/components/FooterComponent"
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

export default function ViewProductsRequest() {
  const baseUrl = import.meta.env.VITE_URL_BASE || "http://localhost:8000"
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api"
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [wineTypes, setWineTypes] = useState([])
  const [isLiked, setIsLiked] = useState(false)
  const [shareStatus, setShareStatus] = useState("")
  const [isRequestsExpanded, setIsRequestsExpanded] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    status: "all",
    minPrice: "",
    maxPrice: "",
    minQuantity: "",
    maxQuantity: "",
  })
  const [filteredRequests, setFilteredRequests] = useState([])

  // Refs for scroll animation
  const requestsSectionRef = useRef(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!id) {
          console.error("ID del producto no encontrado")
          setLoading(false)
          return
        }

        const [productResponse, requestsResponse] = await Promise.all([
          fetch(`${apiUrl}/v1/products/${id}`),
          fetch(`${apiUrl}/v1/request/?product_id=${id}`),
        ])

        if (!productResponse.ok || !requestsResponse.ok) {
          throw new Error("Error al obtener los datos del producto")
        }

        const productData = await productResponse.json()
        const requestsData = await requestsResponse.json()

        // Check if the response has a data property
        setProduct(productData.data || productData)
        setRequests(Array.isArray(requestsData) ? requestsData : [])

        setLoading(false)
      } catch (error) {
        console.error("Error fetching product details:", error)
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
          throw new Error("Error al obtener los tipos de vino")
        }
        const data = await response.json()
        setWineTypes(data.data || data)
      } catch (error) {
        console.error("Error al obtener los tipos de vino:", error)
      }
    }

    fetchWineTypes()
  }, [apiUrl])

  // Check if product is liked from cookies when component mounts
  useEffect(() => {
    if (product && product.id) {
      const likedProducts = getCookie("likedProducts") || ""
      const likedProductsArray = likedProducts ? likedProducts.split(",") : []
      setIsLiked(likedProductsArray.includes(product.id.toString()))
    }
  }, [product])

  useEffect(() => {
    if (!requests.length) {
      setFilteredRequests([])
      return
    }

    let filtered = [...requests]

    // Filter by status
    if (filterOptions.status !== "all") {
      filtered = filtered.filter((request) => request.status === filterOptions.status)
    }

    // Filter by price range
    if (filterOptions.minPrice) {
      filtered = filtered.filter((request) => request.price_restaurant >= Number(filterOptions.minPrice))
    }
    if (filterOptions.maxPrice) {
      filtered = filtered.filter((request) => request.price_restaurant <= Number(filterOptions.maxPrice))
    }

    // Filter by quantity range
    if (filterOptions.minQuantity) {
      filtered = filtered.filter((request) => request.quantity >= Number(filterOptions.minQuantity))
    }
    if (filterOptions.maxQuantity) {
      filtered = filtered.filter((request) => request.quantity <= Number(filterOptions.maxQuantity))
    }

    setFilteredRequests(filtered)
  }, [requests, filterOptions])

  // Function to get cookie by name
  const getCookie = (name) => {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(";").shift()
    return null
  }

  // Function to set cookie
  const setCookie = (name, value, days = 30) => {
    if (typeof document === "undefined") return
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = `expires=${date.toUTCString()}`
    document.cookie = `${name}=${value};${expires};path=/`
  }

  // Toggle like status
  const toggleLike = () => {
    if (!product || !product.id) return

    const productId = product.id.toString()
    const likedProducts = getCookie("likedProducts") || ""
    const likedProductsArray = likedProducts ? likedProducts.split(",").filter(Boolean) : []

    if (isLiked) {
      // Remove from liked products
      const updatedLikedProducts = likedProductsArray.filter((id) => id !== productId)
      setCookie("likedProducts", updatedLikedProducts.join(","))
    } else {
      // Add to liked products
      if (!likedProductsArray.includes(productId)) {
        likedProductsArray.push(productId)
      }
      setCookie("likedProducts", likedProductsArray.join(","))
    }

    setIsLiked(!isLiked)
  }

  // Share functionality
  const shareProduct = async () => {
    if (!product) return

    const shareData = {
      title: product.name,
      text: `Descubre ${product.name}, cosecha ${product.year} de ${product.origin}`,
      url: window.location.href,
    }

    // Check if Web Share API is supported
    if (navigator && navigator.share) {
      try {
        await navigator.share(shareData)
        setShareStatus("¡Compartido!")
        setTimeout(() => setShareStatus(""), 2000)
      } catch (err) {
        console.error("Error al compartir:", err)
        fallbackShare()
      }
    } else {
      fallbackShare()
    }
  }

  // Fallback share method - copy to clipboard
  const fallbackShare = () => {
    if (!navigator || !navigator.clipboard) {
      setShareStatus("No se puede compartir")
      setTimeout(() => setShareStatus(""), 2000)
      return
    }

    const url = window.location.href
    navigator.clipboard.writeText(url).then(
      () => {
        setShareStatus("¡URL copiada!")
        setTimeout(() => setShareStatus(""), 2000)
      },
      () => {
        setShareStatus("Error al copiar")
        setTimeout(() => setShareStatus(""), 2000)
      },
    )
  }

  // Toggle requests section and scroll to it if expanding
  const toggleRequestsSection = () => {
    setIsRequestsExpanded(!isRequestsExpanded)

    if (!isRequestsExpanded && requestsSectionRef.current) {
      // Small delay to allow state to update before scrolling
      setTimeout(() => {
        requestsSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilterOptions((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetFilters = () => {
    setFilterOptions({
      status: "all",
      minPrice: "",
      maxPrice: "",
      minQuantity: "",
      maxQuantity: "",
    })
  }

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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-2xl text-gray-600">Producto no encontrado</p>
      </div>
    )
  }

  // Only include actual images, no placeholders
  const productImages = []
  if (product.image) {
    productImages.push(`${baseUrl}${product.image}`)
  }
  if (product.images && Array.isArray(product.images)) {
    productImages.push(...product.images.map((img) => `${baseUrl}${img}`))
  }

  // Find wine type name
  const wineType = Array.isArray(wineTypes) ? wineTypes.find((type) => type.id === product.wine_type_id) : null
  const wineTypeName = wineType ? wineType.name || wineType.type : "Vino"

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-[#9A3E50]">
            Inicio
          </a>{" "}
          /
          <a href="/vinos" className="hover:text-[#9A3E50] mx-1">
            Vinos
          </a>{" "}
          /<span className="text-gray-700">{product.name}</span>
        </div>

        {/* SECTION 1: Product Details Section */}
        <section className="mb-8 transition-all duration-500 ease-in-out">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-gray-50 rounded-lg overflow-hidden h-[500px]">
                {productImages.length > 0 ? (
                  <img
                    src={productImages[activeImage] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No hay imagen disponible
                  </div>
                )}

                {/* Navigation arrows - only show if there are multiple images */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setActiveImage((prev) => (prev + 1) % productImages.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails - only show if there are multiple images */}
              {productImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${activeImage === idx ? "border-[#9A3E50]" : "border-transparent"}`}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`${product.name} - vista ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Info */}
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
                    <span className="text-sm text-gray-500 ml-2">(24 reseñas)</span>
                  </div>
                </div>

                <div className="text-3xl font-bold text-[#9A3E50] mb-6">€{product.price_demanded}</div>

                <div className="prose prose-sm max-w-none text-gray-600 mb-6">
                  <p>
                    {product.description ||
                      `Un vino excepcional de ${product.origin}, cosecha ${product.year}. Perfecto para ocasiones especiales y maridajes sofisticados.`}
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
                  <p className="text-sm font-medium text-gray-500">Año</p>
                  <p className="font-medium">{product.year}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo</p>
                  <p className="font-medium">{wineTypeName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
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
                        ? "Sin stock"
                        : "Desconocido"}
                  </span>
                </div>
              </div>

              {/* Actions - Like and Share buttons with functionality */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={toggleLike}
                  className={`bg-white border hover:bg-gray-50 p-3 rounded-md transition-colors flex items-center gap-2 ${
                    isLiked ? "border-[#9A3E50] text-[#9A3E50]" : "border-gray-300 text-gray-700"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-[#9A3E50]" : ""}`} />
                  {isLiked ? "Me gusta" : "Me gusta"}
                </button>
                <div className="relative">
                  <button
                    onClick={shareProduct}
                    className="bg-white border border-gray-300 hover:bg-gray-50 p-3 rounded-md flex items-center gap-2"
                  >
                    {shareStatus ? (
                      shareStatus === "¡Compartido!" || shareStatus === "¡URL copiada!" ? (
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
                <p>Fecha de creación: {new Date(product.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Requests Section - Always present but collapsible */}
        {requests.length > 0 && (
          <section className="mb-16">
            {/* Collapsible header */}
            <div
              onClick={toggleRequestsSection}
              className="bg-gray-50 rounded-t-xl p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200"
            >
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <ShoppingCart className="mr-3 text-[#9A3E50]" />
                Solicitudes disponibles ({filteredRequests.length}/{requests.length})
              </h2>
              <button className="text-gray-700 hover:text-[#9A3E50] transition-colors">
                {isRequestsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {/* Collapsible content */}
            <div
              ref={requestsSectionRef}
              className={`bg-gray-50 rounded-b-xl overflow-hidden transition-all duration-500 ease-in-out ${
                isRequestsExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-6 space-y-4">
                <div className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Filtrar solicitudes</h3>
                    <button onClick={resetFilters} className="text-sm text-[#9A3E50] hover:underline">
                      Restablecer
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <select
                        name="status"
                        value={filterOptions.status}
                        onChange={handleFilterChange}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                      >
                        <option value="all">Todos</option>
                        <option value="pending">Pendiente</option>
                        <option value="accepted">Aceptado</option>
                        <option value="rejected">Rechazado</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio mín.</label>
                        <input
                          type="number"
                          name="minPrice"
                          value={filterOptions.minPrice}
                          onChange={handleFilterChange}
                          placeholder="€"
                          className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio máx.</label>
                        <input
                          type="number"
                          name="maxPrice"
                          value={filterOptions.maxPrice}
                          onChange={handleFilterChange}
                          placeholder="€"
                          className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cant. mín.</label>
                        <input
                          type="number"
                          name="minQuantity"
                          value={filterOptions.minQuantity}
                          onChange={handleFilterChange}
                          placeholder="Uds."
                          className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cant. máx.</label>
                        <input
                          type="number"
                          name="maxQuantity"
                          value={filterOptions.maxQuantity}
                          onChange={handleFilterChange}
                          placeholder="Uds."
                          className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request, index) => (
                    <div
                      key={request.id}
                      className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: isRequestsExpanded ? "fadeInUp 0.5s ease forwards" : "none",
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                          <p className="font-medium text-lg">Restaurante #{index + 1}</p>
                          <p className="text-gray-600">Cantidad: {request.quantity} unidades</p>
                          <p className="text-gray-600">
                            Precio solicitado:{" "}
                            <span className="font-medium text-[#9A3E50]">€{request.price_restaurant}</span>
                          </p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              request.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {request.status === "pending"
                              ? "Pendiente"
                              : request.status === "accepted"
                                ? "Aceptado"
                                : "Rechazado"}
                          </span>

                          <button className="bg-[#9A3E50] hover:bg-[#7e3241] text-white py-2 px-4 rounded-md font-medium flex items-center justify-center transition-colors w-full sm:w-auto">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Añadir al carrito
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No se encontraron solicitudes con los filtros aplicados</p>
                    <button onClick={resetFilters} className="mt-2 text-[#9A3E50] hover:underline">
                      Restablecer filtros
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Footer />
    </div>
  )
}

