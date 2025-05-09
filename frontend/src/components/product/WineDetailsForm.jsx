export const WineDetailsForm = ({
  formData,
  onChange,
  selectedImages,
  existingImages = [],
  onImageSelect,
  onImageRemove,
  onExistingImageRemove,
  errors,
  touchedFields,
  onPrevious,
  onNext,
  isNextEnabled,
  isEditMode = false,
}) => {
  // Helper function to check if a field has an error
  const baseUrl = import.meta.env.VITE_URL_BASE;
  const hasError = (fieldName) => {
    return touchedFields[fieldName] && errors[fieldName]
  }

  // Calcular el total de imágenes (existentes + nuevas)
  const totalImages = existingImages.length + selectedImages.length;
  return (
    <div className="flex flex-col justify-between bg-white rounded-lg shadow-md">
      <div className="w-full bg-gradient-to-r from-[#F5E6E8] to-[#E8D5D5] p-4 rounded-t-lg border-b border-gray-200">
        <h2 className="text-lg font-semibold text-[#8C2E2E]">
          {isEditMode ? "Edita el vi" : "Crea el vi"}
        </h2>
        <p className="text-sm text-gray-600">
          Omple les següents dades per {isEditMode ? "editar" : "crear"} el teu vi. Proporciona tota la informació rellevant.
        </p>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Product Information */}
        <div className="space-y-4">
          <h3 className="font-medium text-[#8C2E2E] border-b border-[#E8D5D5] pb-2">Informació del vi</h3>

          {/* Nom del Vi */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${hasError("name") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#9A3E50]"
                }`}
              placeholder=" "
              id="name"
            />
            <label
              htmlFor="name"
              className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${hasError("name") ? "text-red-500" : "text-gray-500"
                }`}
            >
              Nom del Vi
            </label>
            {hasError("name") && <span className="text-red-500 text-xs mt-1">{errors.name[0]}</span>}
          </div>

          {/* Denominació */}
          <div className="relative">
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={onChange}
              className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${hasError("origin") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#9A3E50]"
                }`}
              placeholder=" "
              id="origin"
            />
            <label
              htmlFor="origin"
              className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${hasError("origin") ? "text-red-500" : "text-gray-500"
                }`}
            >
              Denominació d'Origen
            </label>
            {hasError("origin") && <span className="text-red-500 text-xs mt-1">{errors.origin[0]}</span>}
          </div>

          {/* Any */}
          <div className="relative">
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={onChange}
              className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${hasError("year") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#9A3E50]"
                }`}
              placeholder=" "
              id="year"
            />
            <label
              htmlFor="year"
              className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${hasError("year") ? "text-red-500" : "text-gray-500"
                }`}
            >
              Any
            </label>
            {hasError("year") && <span className="text-red-500 text-xs mt-1">{errors.year[0]}</span>}
          </div>

          {/* Descripció */}
          <div className="relative">
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              className={`peer w-full h-24 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${hasError("description") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#9A3E50]"
                }`}
              placeholder=" "
              id="description"
            />
            <label
              htmlFor="description"
              className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${hasError("description") ? "text-red-500" : "text-gray-500"
                }`}
            >
              Descripció
            </label>
            <div className="flex justify-between text-gray-400 text-xs mt-2 px-1">
              <span>Máxim de 255 caràcters</span>
              <span className={formData.description.length > 255 ? "text-red-500 font-medium" : ""}>
                {formData.description.length}/255
              </span>
            </div>
            {hasError("description") && <span className="text-red-500 text-xs mt-1">{errors.description[0]}</span>}
          </div>
        </div>

        {/* Right column - Images */}
        <div className="space-y-4">
          <h3 className="font-medium text-[#8C2E2E] border-b border-[#E8D5D5] pb-2">
            Imatges del vi {totalImages > 0 && <span className="text-sm text-gray-600">({totalImages} {totalImages === 1 ? 'imatge' : 'imatges'})</span>}
          </h3>

          {/* Imatge */}
          <div className="space-y-4">
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${hasError("image") ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-[#D9A5AD]"
                }`}
            >
              <div className="space-y-1 text-center">
                <svg
                  className={`mx-auto h-12 w-12 ${hasError("image") ? "text-red-400" : "text-gray-400"}`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className={`relative cursor-pointer bg-white rounded-md font-medium focus-within:outline-none ${hasError("image") ? "text-red-500 hover:text-red-400" : "text-[#9A3E50] hover:text-[#C27D7D]"
                      }`}
                  >
                    <span>{totalImages > 0 ? "Afegir més imatges" : "Puja imatges"}</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      onChange={onImageSelect}
                    />
                  </label>
                  <p className="pl-1">o arrossega i deixa anar</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF fins a 10MB</p>
              </div>
            </div>

            {/* Existing images section (for edit mode) */}
            {existingImages && existingImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Imatges existents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={`${baseUrl}${image.image_path}`}
                        alt={`Imatge existent ${index + 1}`}
                        className="h-40 w-full object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => onExistingImageRemove(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="sr-only">Eliminar</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New images preview section */}
            {selectedImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Previsualització d'imatges</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="h-40 w-full object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => onImageRemove(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="sr-only">Eliminar</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasError("image") && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.image[0]}
                </p>
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
              type="button"
              onClick={onNext}
              className={`px-4 py-2 rounded-lg transition-colors ${isNextEnabled
                ? "bg-[#9A3E50] text-white hover:bg-[#8C2E2E]"
                : "bg-[#E8D5D5] text-[#8C2E2E] cursor-not-allowed"
                }`}
              disabled={!isNextEnabled}
            >
              Següent
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}