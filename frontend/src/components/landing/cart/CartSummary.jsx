import { ShoppingBag, ChevronRight, CreditCard, Trash2, Info } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export function CartSummary({
  orderId,
  subtotal,
  serviceCommission,
  shippingCost,
  total,
  selectedItemsCount,
  hasItems,
  onClearCart,
  cartItems,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (hasItems && subtotal !== 0) {
      if (orderId) {
        localStorage.setItem("currentOrderIds", JSON.stringify([orderId]));
      } 
      else if (cartItems && cartItems.length > 0) {
        const orderIds = cartItems.map(item => item.id);
        localStorage.setItem("currentOrderIds", JSON.stringify(orderIds));
      }
      else {
        localStorage.setItem("currentOrderIds", JSON.stringify([]));
        
      }
      localStorage.setItem("totalPrice", total.toFixed(2));
      navigate("/checkout");
    }
  };

  return (
    <div className="lg:w-96">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Resum de la comanda
        </h2>
      </div>

      <div className="bg-white rounded-md shadow-sm overflow-hidden sticky top-24">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{subtotal.toFixed(2)} €</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-gray-600">Comissió de servei</span>
              <button
                className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                title="3% del subtotal"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            <span className="font-medium">
              {serviceCommission.toFixed(2)} €
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-gray-600">Despeses d'enviament</span>
              {subtotal > 100 && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Gratis
                </span>
              )}
            </div>
            <span className="font-medium">{shippingCost.toFixed(2)} €</span>
          </div>

          <div className="border-t pt-4 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl text-[#9A3E50]">
                {total.toFixed(2)} €
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">IVA inclòs</p>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t">
          <button
            onClick={handleClick}
            className={`w-full py-3.5 px-4 rounded-md font-medium transition-all ${
              !hasItems || subtotal === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#9A3E50] hover:bg-[#7e3241] text-white"
            }`}
            disabled={!hasItems || subtotal === 0}
          >
            Finalitzar compra
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
            <span className="font-medium">{selectedItemsCount}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
            <span className="font-medium">Pagament segur</span>
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="h-8 w-12 bg-white rounded shadow-sm flex items-center justify-center">
              <img
                src="./img/visa.jpg"
                alt="Visa"
                className="h-5 w-auto"
              />
            </div>
            <div className="h-8 w-12 bg-white rounded shadow-sm flex items-center justify-center">
              <img
                src="./img/mastercard.png"
                alt="Mastercard"
                className="h-5 w-auto"
              />
            </div>
            <div className="h-8 w-12 bg-white rounded shadow-sm flex items-center justify-center">
              <img
                src="./img/eps.png"
                alt="EPS"
                className="h-5 w-auto"
              />
            </div>
            <div className="h-8 w-12 bg-white rounded shadow-sm flex items-center justify-center">
              <img
                src="./img/bancontact.png"
                alt="Bancontact"
                className="h-5 w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {hasItems && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClearCart}
            className="flex items-center text-gray-600 hover:text-[#9A3E50] py-2 px-4 text-sm rounded-md hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Esborrar cistella
          </button>
        </div>
      )}
    </div>
  );
}