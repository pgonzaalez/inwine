"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  ShoppingBag,
  ChevronRight,
  Minus,
  Plus,
  X,
  Check,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  AlertTriangle,
} from "lucide-react";
import Header from "@/components/HeaderComponent";
import Footer from "@/components/FooterComponent";
import Modal from "@components/Modal";

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    // Simular la obtención de datos del carrito
    setTimeout(() => {
      const items = [
        {
          id: 1,
          name: "Vi Criança 2020",
          price: 37.0,
          quantity: 2,
          image: "/placeholder.svg",
          producer: "Celler Pinord",
          restaurant: "Restaurant La Vinya",
          type: "Negre",
          origin: "D.O. Catalunya",
        },
        {
          id: 2,
          name: "Vi Blanc Chardonnay",
          price: 37.0,
          quantity: 1,
          image: "/placeholder.svg",
          producer: "Celler Torres",
          restaurant: "Restaurant El Racó",
          type: "Blanc",
          origin: "D.O. Penedès",
        },
        {
          id: 3,
          name: "Vi Negre Reserva",
          price: 37.0,
          quantity: 3,
          image: "/placeholder.svg",
          producer: "Celler Freixenet",
          restaurant: "Restaurant Can Roca",
          type: "Negre",
          origin: "D.O. Rioja",
        },
      ];

      setCartItems(items);

      // Inicializar todos los items como seleccionados
      const initialSelected = {};
      items.forEach((item) => {
        initialSelected[item.id] = true;
      });
      setSelectedItems(initialSelected);

      setLoading(false);
    }, 800);
  }, []);

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedItems({});
  };

  const clearCartAndCloseModal = () => {
    clearCart(); // Limpia el carrito
    setIsDeleteOpen(false); // Cierra el modal
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    // Mostrar mensaje de actualización
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Calcular subtotal basado en items seleccionados
  const subtotal = cartItems
    .filter((item) => selectedItems[item.id])
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const shippingCost = 5.0;
  const total = subtotal + shippingCost;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center text-sm text-gray-500">
            <a href="/" className="hover:text-[#9A3E50] transition-colors">
              Inici
            </a>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-700 font-medium">Cistella</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <a
              href="/"
              className="text-[#9A3E50] hover:text-[#7e3241] flex items-center mb-2 transition-colors text-sm"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Tornar a la botiga
            </a>
            <h1 className="text-3xl font-bold flex items-center">
              <ShoppingBag className="mr-3 h-7 w-7 text-[#9A3E50]" />
              Cistella
            </h1>
          </div>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center text-gray-600 hover:text-[#9A3E50] bg-white py-2 px-4 rounded-md border border-gray-200 shadow-sm hover:shadow transition-all"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Esborrar
          </button>
        </div>

        {/* Added to Cart Message */}
        {showAddedMessage && (
          <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg animate-slideIn z-50">
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              <p>Quantitat actualitzada correctament</p>
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              El teu carret està buit
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Sembla que encara no has afegit cap producte al carret. Torna a la
              botiga per explorar els nostres vins.
            </p>
            <a href="/">
              <button className="bg-[#9A3E50] hover:bg-[#7e3241] text-white py-3 px-6 rounded-md font-medium transition-colors shadow-sm hover:shadow">
                Continuar comprant
              </button>
            </a>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">
                    Productes seleccionats
                  </h2>
                </div>

                <div className="border-b py-4 hidden md:flex text-sm text-gray-600 px-6">
                  <div className="w-8"></div>
                  <div className="w-24"></div>
                  <div className="flex-1 font-medium">Productes</div>
                  <div className="w-32 font-medium">Productor</div>
                  <div className="w-32 font-medium">Restaurant</div>
                  <div className="w-24 text-center font-medium">Quantitat</div>
                  <div className="w-24 text-right font-medium">Preu</div>
                </div>

                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-6 px-6 flex items-center hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-8">
                        <input
                          type="checkbox"
                          checked={selectedItems[item.id] || false}
                          onChange={() => toggleSelectItem(item.id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#9A3E50] focus:ring-[#9A3E50]"
                        />
                      </div>
                      <div className="w-24">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 group-hover:shadow-md transition-all">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 group-hover:text-[#9A3E50] transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium mr-2">
                            {item.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.origin}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 md:hidden mt-1">
                          {item.producer} · {item.restaurant}
                        </p>
                      </div>
                      <div className="w-32 hidden md:block text-sm text-gray-600">
                        {item.producer}
                      </div>
                      <div className="w-32 hidden md:block text-sm text-gray-600">
                        {item.restaurant}
                      </div>
                      <div className="w-24 text-center">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="text-gray-500 hover:text-[#9A3E50] transition-colors"
                            aria-label="Disminuir quantitat"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-2 font-medium text-gray-700 w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="text-gray-500 hover:text-[#9A3E50] transition-colors"
                            aria-label="Augmentar quantitat"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="w-24 text-right font-medium">
                        <div className="flex flex-col items-end">
                          <span>
                            {(item.price * item.quantity).toFixed(2)} €
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors mt-1 text-xs flex items-center opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping and Payment Info */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">
                      Enviament gratuït
                    </h3>
                    <p className="text-xs text-gray-500">
                      Per a comandes superiors a 100€
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">
                      Pagament segur
                    </h3>
                    <p className="text-xs text-gray-500">
                      Transaccions encriptades
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">
                      Garantia de qualitat
                    </h3>
                    <p className="text-xs text-gray-500">
                      Tots els vins verificats
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">
                    Resum de la comanda
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{subtotal.toFixed(2)} €</span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">
                      Despeses d'enviament i gestió estimats
                    </span>
                    <span className="font-medium">
                      {shippingCost.toFixed(2)} €
                    </span>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-lg text-[#9A3E50]">
                        {total.toFixed(2)} €
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">IVA inclòs</p>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t">
                  <button
                    className={`w-full py-3 px-4 rounded-md font-medium transition-all ${
                      cartItems.length === 0 || subtotal === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#9A3E50] hover:bg-[#7e3241] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    }`}
                    disabled={cartItems.length === 0 || subtotal === 0}
                  >
                    Pasar al checkout
                  </button>

                  <div className="mt-4 text-center">
                    <a
                      href="/"
                      className="text-[#9A3E50] hover:text-[#7e3241] text-sm font-medium inline-flex items-center"
                    >
                      <ChevronRight className="h-4 w-4 mr-1 transform rotate-180" />
                      Continuar comprant
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-dashed">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      <span>Articles seleccionats</span>
                    </div>
                    <span className="font-medium">
                      {cartItems
                        .filter((item) => selectedItems[item.id])
                        .reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-4 bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium text-gray-800 mb-3">
                  Codi promocional
                </h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Introdueix el codi"
                    className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
                  />
                  <button className="bg-[#9A3E50] hover:bg-[#7e3241] text-white py-2 px-4 rounded-r-md text-sm font-medium transition-colors">
                    Aplicar
                  </button>
                </div>
              </div>

              {/* Secure Payment Info */}
              <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="font-medium">Pagament segur</span>
                </div>
                <p className="text-xs text-gray-500">
                  Totes les transaccions estan protegides amb encriptació SSL
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <img
                    src="/placeholder.svg?height=20&width=40"
                    alt="Visa"
                    className="h-6"
                  />
                  <img
                    src="/placeholder.svg?height=20&width=40"
                    alt="Mastercard"
                    className="h-6"
                  />
                  <img
                    src="/placeholder.svg?height=20&width=40"
                    alt="American Express"
                    className="h-6"
                  />
                  <img
                    src="/placeholder.svg?height=20&width=40"
                    alt="PayPal"
                    className="h-6"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Borrar Cistella */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Vols esborrar tot?"
        description="Esborraras tota la teva cistella. Estàs segur?"
        icon={<Trash2 className="h-8 w-8" />}
        variant="warning"
        size="md"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel·lar
            </button>
            <button
              onClick={clearCartAndCloseModal}
              className="flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-medium text-white hover:from-red-600 hover:to-red-700"
            >
              Esborrar
            </button>
          </div>
        }
      >
        <div className="flex items-start rounded-lg bg-amber-50 p-4">
          <AlertTriangle className="mr-3 h-5 w-5 text-amber-500" />
          <p className="text-sm text-amber-700">
            Al esborrar la cistella, tindràs que tornar a afegir totes les
            sol·licituds dels restaurants.
          </p>
        </div>
      </Modal>

      <Footer />

      {/* CSS para animaciones */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
