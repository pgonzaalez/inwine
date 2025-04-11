"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Check, CreditCard, Truck, Shield, AlertTriangle } from "lucide-react"
import Header from "@/components/HeaderComponent"
import Footer from "@/components/FooterComponent"
import { CartItem } from "@/components/landing/cart/CartItem"
import { CartSummary } from "@/components/landing/cart/CartSummary"
import { DeleteCartModal } from "@/components/landing/cart/DeleteCartModal"
import { useFetchUser } from "@/components/auth/FetchUser"
import { getCookie } from "@/utils/utils"

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState([])
  const [selectedItems, setSelectedItems] = useState({})
  const [loading, setLoading] = useState(true)
  const [showAddedMessage, setShowAddedMessage] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const baseUrl = import.meta.env.VITE_URL_BASE || "http://localhost:8000"

  const { user, loading: userLoading, error: userError } = useFetchUser()

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) return

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"
        const response = await fetch(`${apiUrl}/v1/${user.id}/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch cart items")
        }

        const data = await response.json()
        setCartItems(data)

        // Initialize all items as selected
        const initialSelected = {}
        data.forEach((item) => {
          initialSelected[item.order_id] = true
        })
        setSelectedItems(initialSelected)
      } catch (error) {
        // console.error("Error fetching cart items:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCartItems()
    }
  }, [user])

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"
      await fetch(`${apiUrl}/v1/${user.id}/orders/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })

      setCartItems([])
      setSelectedItems({})
    } catch (error) {
      // console.error("Error clearing cart:", error)
    }
  }

  const clearCartAndCloseModal = () => {
    clearCart()
    setIsDeleteOpen(false)
  }

  const removeItem = async (orderId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"
      await fetch(`${apiUrl}/v1/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })

      // Update local state
      setCartItems(cartItems.filter((item) => item.order_id !== orderId))
    } catch (error) {
      // console.error("Error removing item:", error)
    }
  }

  // Function to get the complete image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg?height=80&width=80"
    if (imagePath.startsWith("http")) return imagePath
    return `${baseUrl}${imagePath}`
  }

  // Calculate subtotal based on selected items
  const subtotal = cartItems
    .filter((item) => selectedItems[item.order_id])
    .reduce((sum, item) => {
      const priceInEuros = Number.parseFloat(item.price_restaurant) || 0
      return sum + priceInEuros * item.quantity
    }, 0)

  // Service commission (3% of subtotal)
  const serviceCommission = subtotal * 0.03

  // Shipping cost
  const shippingCost = subtotal > 100 ? 0 : 5.0

  // Total
  const total = subtotal + serviceCommission + shippingCost

  // Count selected items
  const selectedItemsCount = cartItems
    .filter((item) => selectedItems[item.order_id])
    .reduce((sum, item) => sum + item.quantity, 0)

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 border-4 border-[#9A3E50] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg text-gray-600">Carregant la cistella...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (userError) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white rounded-md shadow-md overflow-hidden md:max-w-lg">
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Error d'autenticació</h2>
                <p className="text-gray-600 mb-6">
                  No s'ha pogut carregar la informació de l'usuari. Si us plau, inicia sessió de nou.
                </p>
                <a href="/login">
                  <button className="bg-[#9A3E50] hover:bg-[#7e3241] text-white py-3 px-6 rounded-md font-medium transition-all duration-300">
                    Iniciar sessió
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content - with padding-top to account for fixed header */}
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Title with Shopping Cart Icon - styled to match reference */}
          <div className="flex items-center mb-8">
            <ShoppingBag className="text-[#9A3E50] h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">La meva cistella</h1>
            {cartItems.length > 0 && (
              <span className="ml-2 bg-[#9A3E50] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>

          {/* Added to Cart Message */}
          {showAddedMessage && (
            <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg z-50 animate-in slide-in-from-right duration-300">
              <div className="flex items-center">
                <Check className="h-5 w-5 mr-2 text-green-500" />
                <p>Quantitat actualitzada correctament</p>
              </div>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-md shadow-sm p-8 md:p-12 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">La teva cistella es buida</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Sembla que encara no has afegit cap producte al carret. Torna a la botiga per explorar els nostres vins.
              </p>
              <a href="/productes">
                <button className="bg-[#9A3E50] hover:bg-[#7e3241] text-white py-3 px-8 rounded-md font-medium transition-all duration-300">
                  Continuar comprant
                </button>
              </a>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items Section */}
              <div className="flex-1">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    Productes seleccionats
                    <span className="ml-2 text-sm bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                      {selectedItemsCount}
                    </span>
                  </h2>
                </div>

                {/* Cart items - cleaner design with fewer borders */}
                <div className="bg-white rounded-md shadow-sm mb-6">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.order_id}
                      item={item}
                      isSelected={selectedItems[item.order_id] || false}
                      onToggleSelect={() => toggleSelectItem(item.order_id)}
                      onRemove={() => removeItem(item.order_id)}
                      getImageUrl={getImageUrl}
                    />
                  ))}
                </div>

                {/* Shipping and Payment Info Cards - cleaner design */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-md shadow-sm p-4 flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                      <Truck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">Enviament gratuït</h3>
                      <p className="text-xs text-gray-500">Per a comandes superiors a 100€</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-md shadow-sm p-4 flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">Pagament segur</h3>
                      <p className="text-xs text-gray-500">Transaccions encriptades</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-md shadow-sm p-4 flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3 flex-shrink-0">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">Garantia de qualitat</h3>
                      <p className="text-xs text-gray-500">Tots els vins verificats</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <CartSummary
                subtotal={subtotal}
                serviceCommission={serviceCommission}
                shippingCost={shippingCost}
                total={total}
                selectedItemsCount={selectedItemsCount}
                hasItems={cartItems.length > 0}
                onClearCart={() => setIsDeleteOpen(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete Cart Modal */}
      <DeleteCartModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={clearCartAndCloseModal}
      />

      <Footer />
    </div>
  )
}
