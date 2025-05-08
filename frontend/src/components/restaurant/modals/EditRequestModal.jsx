import Modal from "@components/Modal"
import { ShoppingBag, Check } from "lucide-react"

export function EditRequestModal({
  isOpen,
  onClose,
  onSubmit,
  offerPrice,
  setOfferPrice,
  product,
  requestStatus,
}) {
  const handleClose = () => {
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Sol·licitar ${product?.name || ""}`}
      description="Introdueix el preu que vols oferir per aquest producte"
      icon={<ShoppingBag className="h-8 w-8 text-[#9A3E50]" />}
      variant="default"
      size="md"
      footer={
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleClose}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel·lar
          </button>
          <button
            onClick={onSubmit}
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
          {requestStatus === 'price_error' && (
            <p className="mt-1 text-sm text-red-600">
              El preu ofertat no pot ser inferior al preu actual del producte
            </p>
          )}
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Preu actual:</span> {product?.price_demanded ?? "—"}€
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
  )
}
