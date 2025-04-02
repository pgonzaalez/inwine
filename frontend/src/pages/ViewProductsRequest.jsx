import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Header from "../components/HeaderComponent"
import Footer from "../components/FooterComponent"
import ProductGallery from "../components/landing/requests/ProductGallery"
import ProductInfo from "../components/landing/requests/ProductInfo"
import RequestsSection from "../components/landing/requests/RequestSection"

export default function ProductDetail() {
  const baseUrl = import.meta.env.VITE_URL_BASE || "http://localhost:8000"
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api"
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [wineTypes, setWineTypes] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!id) {
          console.error("ID del producte no trobat")
          setError("ID del producte no trobat")
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
        setError(null)
        setLoading(false)
      } catch (error) {
        console.error("Error en obtenir detalls del producte:", error)
        setError("Error en obtenir detalls del producte")
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
    productImages.push(product.image)
  }
  if (product.images && Array.isArray(product.images)) {
    productImages.push(...product.images)
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
            <ProductGallery images={productImages} productName={product.name} baseUrl={baseUrl} />

            {/* Right Column - Info */}
            <ProductInfo product={product} wineTypeName={wineTypeName} />
          </div>
        </section>

        {/* SECTION 2: Requests Section */}
        <RequestsSection requests={requests} productPrice={product.price_demanded} />
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

