"use client"

export const WinePricingForm = ({
  formData,
  onChange,
  selectedImages,
  errors,
  touchedFields,
  onPrevious,
  isSubmitEnabled,
}) => {
  // Helper function to check if a field has an error
  const hasError = (fieldName) => {
    return touchedFields[fieldName] && errors[fieldName]
  }

  return (
    <div className="flex flex-col justify-between bg-white rounded-lg shadow-md">
      <div className="w-full bg-gradient-to-r from-[#F5E6E8] to-[#E8D5D5] p-4 rounded-t-lg border-b border-gray-200">
        <h2 className="text-lg font-semibold text-[#8C2E2E]">Preu i disponibilitat</h2>
        <p className="text-sm text-gray-600">Estableix el preu i la quantitat disponible del teu vi.</p>
      </div>

      <div className="p-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Preu */}
          <div className="relative">
            <input
              type="number"
              name="price_demanded"
              id="price_demanded"
              value={formData.price_demanded}
              onChange={onChange}
              className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
                hasError("price_demanded") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#9A3E50]"
              }`}
              placeholder=" "
              step="0.01"
            />
            <label
              htmlFor="price_demanded"
              className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                hasError("price_demanded") ? "text-red-500" : "text-gray-500"
              }`}
            >
              Preu (€)
            </label>
            {hasError("price_demanded") && (
              <span className="text-red-500 text-xs mt-1">{errors.price_demanded[0]}</span>
            )}
          </div>

          {/* Quantitat */}
          <div className="relative">
            <input
              type="number"
              name="quantity"
              id="quantity"
              value={formData.quantity}
              onChange={onChange}
              className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
                hasError("quantity") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#9A3E50]"
              }`}
              placeholder=" "
              min="1"
            />
            <label
              htmlFor="quantity"
              className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                hasError("quantity") ? "text-red-500" : "text-gray-500"
              }`}
            >
              Quantitat disponible
            </label>
            {hasError("quantity") && <span className="text-red-500 text-xs mt-1">{errors.quantity[0]}</span>}
          </div>

          {/* Preview section */}
          <div className="mt-8 p-6 bg-[#F5E6E8] rounded-lg border border-[#D9A5AD]">
            <h4 className="text-base font-medium text-[#8C2E2E] mb-4">Resum del vi</h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-[#E8D5D5]">
                <span className="text-sm text-gray-600">Nom:</span>
                <span className="font-medium text-[#8C2E2E]">{formData.name || "-"}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#E8D5D5]">
                <span className="text-sm text-gray-600">Origen:</span>
                <span className="font-medium text-[#8C2E2E]">{formData.origin || "-"}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#E8D5D5]">
                <span className="text-sm text-gray-600">Any:</span>
                <span className="font-medium text-[#8C2E2E]">{formData.year || "-"}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#E8D5D5]">
                <span className="text-sm text-gray-600">Preu:</span>
                <span className="font-bold text-[#8C2E2E] text-lg">
                  {formData.price_demanded ? `${formData.price_demanded}€` : "-"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Quantitat:</span>
                <span className="font-bold text-[#8C2E2E]">{formData.quantity || "-"}</span>
              </div>
            </div>

            {selectedImages.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#E8D5D5]">
                <p className="text-sm text-gray-600 mb-2">Imatges: {selectedImages.length}</p>
                <div className="flex overflow-x-auto space-x-2 pb-2">
                  {selectedImages.map((img, index) => (
                    <img
                      key={index}
                      src={img.preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="h-16 w-16 object-cover rounded-md flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={onPrevious}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Anterior
            </button>
            <button
              type="submit"
              className={`px-6 py-3 rounded-lg transition-colors shadow-md ${
                isSubmitEnabled
                  ? "bg-[#9A3E50] text-white hover:bg-[#8C2E2E]"
                  : "bg-[#E8D5D5] text-[#8C2E2E] cursor-not-allowed"
              }`}
              disabled={!isSubmitEnabled}
            >
              Puja el teu vi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

