import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { CheckCircle, CreditCard } from "lucide-react"
import { useFetchUser } from "@/components/auth/FetchUser"

export default function OrderSummaryPage() {
  const apiUrl = import.meta.env.VITE_API_URL
  const baseUrl = import.meta.env.VITE_URL_BASE || "http://localhost:8000"
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, loading: userLoading, error: userError } = useFetchUser()

  const paymentIntent = searchParams.get("payment_intent")
  const redirectStatus = searchParams.get("redirect_status")

  const isPaymentSuccessful = paymentIntent && redirectStatus === "succeeded"
º
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg?height=80&width=80"
    if (imagePath.startsWith("http")) return imagePath
    return `${baseUrl}${imagePath}`
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(";").shift()
    return null
  }
º
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("ca-ES", options).replace(/^\w/, (c) => c.toUpperCase()) 
  }

  const markOrderAsCompleted = async (orderId) => {
    try {
      const response = await fetch(`${apiUrl}/v1/orders/${orderId}/completed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to mark order as completed")
      }
    } catch (err) {
      console.error("Error marking order as completed:", err.message)
    }
  }

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email)
    }
  }, [user])

  useEffect(() => {
    if (userLoading || !user) return

    const fetchOrderDetails = async () => {
      setLoading(true)
      try {
        const token = getCookie("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await fetch(`${apiUrl}/v1/${user.id}/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error fetching orders")
        }

        const ordersData = await response.json()

        if (!ordersData || ordersData.length === 0) {
          throw new Error("No orders found")
        }

        const ordersByOrderId = ordersData.reduce((acc, order) => {
          const orderId = order.order_id.toString()
          if (!acc[orderId]) {
            acc[orderId] = []
          }
          acc[orderId].push(order)
          return acc
        }, {})
        const allOrders = Object.entries(ordersByOrderId).map(([orderId, items]) => {
          return {
            id: orderId,
            date: formatDate(items[0].created_at || new Date()),
            paymentMethod: "Mastercard finalitza en 2543", 
            items: items.map((item) => ({
              id: item.product.id || Math.random().toString(36).substr(2, 9),
              name: item.product.name,
              price: Number.parseFloat(item.price_restaurant),
              quantity: item.quantity,
              image: item.product.image,
              category: item.product.origin,
              year: item.product.year,
              restaurant_name: item.restaurant_name,
              seller_name: item.seller_name,
              order_id: item.order_id,
            })),
          }
        })

        setOrderDetails(allOrders)

        allOrders.forEach((order) => {
          markOrderAsCompleted(order.id)
        })

        if (isPaymentSuccessful) {
          localStorage.removeItem("currentOrderId")
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [user, userLoading, paymentIntent, isPaymentSuccessful, apiUrl])

  const calculateTotals = (order) => {
    if (!order || !order.items || order.items.length === 0) return { subtotal: 0, shippingCost: 0, total: 0 }

    const subtotal = order.items.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)

    const shippingCost = subtotal > 100 ? 0 : 5.0
    const total = subtotal + shippingCost

    return { subtotal, shippingCost, total }
  }
  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#8c4a5a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  if (userError && !orderDetails) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-500 mx-auto mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error d'autenticació</h2>
          <p className="text-gray-600 mb-6">
            No s'ha pogut verificar la seva identitat. Si us plau, iniciï sessió i torni a intentar-ho.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-[#8c4a5a] hover:bg-[#7a3e4c] text-white py-3 px-4 rounded-lg transition duration-200 font-medium"
          >
            Tornar a l'inici
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-22 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-1">GRÀCIES PER LES TEVES COMANDES!</h1>
          <p className="text-sm text-gray-500 text-center">
            Les confirmacions de les comandes han estat enviades a {email || "name.surname@mail.com"}
          </p>
        </div>

        {orderDetails &&
          orderDetails.map((order, index) => {
            const { subtotal, shippingCost, total } = calculateTotals(order)
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg text-gray-900">Comanda #{order.id}</h2>
                    <span className="text-sm text-gray-500">{order.date}</span>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Mètode de pagament</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CreditCard className="h-4 w-4" />
                      <span>{order.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h3 className="font-medium text-gray-900 mb-4">Productes</h3>

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-3 py-2 border-b border-gray-100 last:border-b-0">
                          <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
                            <img
                              src={getImageUrl(item.image) || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {item.name} {item.year}
                            </p>
                            <p className="text-xs text-gray-500">{item.category}</p>
                            {item.restaurant_name && (
                              <p className="text-xs text-gray-500">Restaurant: {item.restaurant_name}</p>
                            )}
                            <div className="flex justify-between mt-1">
                              <p className="text-xs text-gray-500">x{item.quantity}</p>
                              <p className="text-sm">{item.price.toFixed(2)} €</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>

                    <div className="flex justify-between text-sm py-1">
                      <span className="text-gray-600">Despeses d'enviament</span>
                      <span>{shippingCost.toFixed(2)} €</span>
                    </div>

                    <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
                      <span>Total</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

        {/* Continue Shopping Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-[#8e1f2f] hover:bg-[#7a1a29] text-white py-3 px-8 rounded-md font-medium"
            onClick={() => navigate("/productes")}
          >
            Continua comprant
          </button>
        </div>
      </div>
    </div>
  )
}
