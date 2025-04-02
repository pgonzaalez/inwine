"use client"

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
          console.error("ID del producte no trobat")
          setLoading(false)
          return
        }

        const [productResponse, requestsResponse] = await Promise.all([
          fetch(`${apiUrl}/v1/products/${id}`),
          fetch(`${apiUrl}/v1/request/${id}`),
        ])

        if (!productResponse.ok || !requestsResponse.ok) {
          throw new Error("Error en obtenir les dades del producte")
        }

        const productData = await productResponse.json()
        const requestsData = await requestsResponse.json()

        // Check if the response has a data property
        setProduct(productData.data || productData)
        setRequests(Array.isArray(requestsData) ? requestsData : [])

        setLoading(false)
      } catch (error) {
        console.error("Error en obtenir detalls del producte:", error)
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
        console.error("Error en obtenir els tipus de vi:", error)
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
        <p className="text-2xl text-gray-600">Producte no trobat</p>
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
  const wineTypeName = wineType ? wineType.name || wineType.type : "Vi"

  return (
    <div className="min-h-screen bg-white">
      <Header />

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
                    No hi ha imatge disponible
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
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                        activeImage === idx ? "border-[#9A3E50]" : "border-transparent"
                      }`}
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
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === "in_stock"
                        ? "bg-green-100 text-green-800"
                        : product.status === "out_of_stock"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status === "in_stock"
                      ? "En estoc"
                      : product.status === "out_of_stock"
                        ? "Sense estoc"
                        : "Desconegut"}
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
              className="bg-gradient-to-r from-[#9A3E50]/5 to-gray-50 rounded-t-xl p-5 flex justify-between items-center cursor-pointer hover:from-[#9A3E50]/10 transition-colors border-b border-gray-200"
            >
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <div className="bg-[#9A3E50]/10 p-2 rounded-full mr-3">
                  <ShoppingCart className="text-[#9A3E50]" />
                </div>
                Sol·licituds disponibles
                <span className="ml-2 bg-[#9A3E50] text-white text-sm py-0.5 px-2 rounded-full flex items-center">
                  {filteredRequests.length}
                  <span className="text-white/70 mx-1">/</span>
                  {requests.length}
                </span>
              </h2>
              <button className="text-gray-700 hover:text-[#9A3E50] transition-colors bg-white rounded-full p-2 shadow-sm hover:shadow flex items-center justify-center">
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
                <div className="bg-white p-5 rounded-lg mb-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-[#9A3E50]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                      </svg>
                      Filtrar sol·licituds
                    </h3>
                    <button
                      onClick={resetFilters}
                      className="text-sm text-[#9A3E50] hover:text-[#7e3241] transition-colors flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Restablir
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Rang de preu</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <input
                            type="number"
                            name="minPrice"
                            value={filterOptions.minPrice}
                            onChange={handleFilterChange}
                            placeholder="Mínim"
                            className="w-full rounded-md border border-gray-300 py-2.5 pl-8 pr-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
                          />
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            €
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            name="maxPrice"
                            value={filterOptions.maxPrice}
                            onChange={handleFilterChange}
                            placeholder="Màxim"
                            className="w-full rounded-md border border-gray-300 py-2.5 pl-8 pr-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
                          />
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            €
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Rang de quantitat</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <input
                            type="number"
                            name="minQuantity"
                            value={filterOptions.minQuantity}
                            onChange={handleFilterChange}
                            placeholder="Mínim"
                            className="w-full rounded-md border border-gray-300 py-2.5 pl-3 pr-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            name="maxQuantity"
                            value={filterOptions.maxQuantity}
                            onChange={handleFilterChange}
                            placeholder="Màxim"
                            className="w-full rounded-md border border-gray-300 py-2.5 pl-3 pr-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request, index) => (
                    <div
                      key={request.id}
                      className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: isRequestsExpanded ? "fadeInUp 0.5s ease forwards" : "none",
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#9A3E50]/10 flex items-center justify-center mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-[#9A3E50]"
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
                            <p className="font-medium text-lg">Restaurant #{index + 1}</p>
                          </div>
                          <div className="ml-10 space-y-1">
                            <p className="text-gray-600 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1.5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                />
                              </svg>
                              Quantitat: <span className="font-medium ml-1">{request.quantity} unitats</span>
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1.5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Preu sol·licitat:{" "}
                              <span className="font-medium text-[#9A3E50] ml-1">€{request.price_restaurant}</span>
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1.5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              Data: <span className="font-medium ml-1">{new Date().toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                              request.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {request.status === "pending" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            ) : request.status === "accepted" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                            {request.status === "pending"
                              ? "Pendent"
                              : request.status === "accepted"
                                ? "Acceptat"
                                : "Rebutjat"}
                          </span>

                          <button className="bg-[#9A3E50] hover:bg-[#7e3241] text-white cursor-pointer py-2 px-4 rounded-md font-medium flex items-center justify-center transition-colors w-full sm:w-auto shadow-sm hover:shadow">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Afegir al carret
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-400 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg mb-2">No s'han trobat sol·licituds amb els filtres aplicats</p>
                    <button
                      onClick={resetFilters}
                      className="mt-2 text-[#9A3E50] hover:text-[#7e3241] transition-colors inline-flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Restablir filtres
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

        .filter-appear {
          animation: filterAppear 0.3s ease forwards;
        }

        @keyframes filterAppear {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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
      `}</style>

      <Footer />
    </div>
  )
}

