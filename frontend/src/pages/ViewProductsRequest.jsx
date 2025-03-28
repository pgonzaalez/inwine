import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "@/components/HeaderComponent"
import Footer from "@/components/FooterComponent"

export default function ViewProductsRequest() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!id) {
          console.error("ID del producto no encontrado")
          setLoading(false)
          return
        }

        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api"
        const [productResponse, requestsResponse] = await Promise.all([
          fetch(`${apiUrl}/v1/products/${id}`),
          fetch(`${apiUrl}/v1/request/?product_id=${id}`)
        ])

        if (!productResponse.ok || !requestsResponse.ok) {
          throw new Error("Error al obtener los datos del producto")
        }

        const productData = await productResponse.json()
        const requestsData = await requestsResponse.json()

        setProduct(productData)
        setRequests(requestsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching product details:", error)
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Cargando...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Producto no encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Detalles del producto */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                {/* Nombre y precio */}
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                  <div className="text-2xl font-bold text-[#9A3E50]">€{product.price_demanded}</div>
                </div>

                {/* Imagen */}
                <div className="mt-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                </div>

                {/* Detalles */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Origen:</p>
                    <p className="text-lg font-semibold">{product.origin}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Año:</p>
                    <p className="text-lg font-semibold">{product.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tipo:</p>
                    <p className="text-lg font-semibold">{product.wine_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Estado:</p>
                    <p className="text-lg font-semibold">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'in_stock' ? 'bg-green-100 text-green-800' :
                        product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status === 'in_stock' ? 'En stock' :
                         product.status === 'out_of_stock' ? 'Sin stock' :
                         'Desconocido'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Productor */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-600 mb-2">Productor:</p>
                  <p className="text-lg font-semibold">{product.user_id}</p>
                </div>

                {/* Fecha de creación */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-600 mb-2">Fecha de creación:</p>
                  <p className="text-gray-600">{new Date(product.created_at).toLocaleDateString()}</p>
                </div>

                {/* Solicitudes */}
                {requests.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Solicitudes</h2>
                    <div className="space-y-4">
                      {requests.map((request) => (
                        <div key={request.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-lg font-medium">Restaurante: {request.restaurant_name}</p>
                              <p className="text-gray-600">Cantidad: {request.quantity} unidades</p>
                              <p className="text-gray-600">Precio solicitado: €{request.price_restaurant}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}