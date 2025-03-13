import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useFetchUser } from "@components/FetchUser"

export default function CreateProduct() {
  const { user, loading } = useFetchUser()
  const [wineTypes, setWineTypes] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    year: "",
    wine_type_id: "",
    description: "",
    price_demanded: "",
    quantity: "",
    image: "",
    user_id: "",
  })
  const [errors, setErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL
  const formSectionRef = useRef(null)
  const priceSectionRef = useRef(null)
  const [selectedImages, setSelectedImages] = useState([])

  useEffect(() => {
    const fetchWineTypes = async () => {
      const response = await fetch(`${apiUrl}/v1/winetypes`)
      const data = await response.json()
      setWineTypes(data)
    }
    fetchWineTypes()
  }, [])

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: user.id, // Asigna el ID del usuario autenticado
      }))
    }
  }, [user])

  // Efecto para hacer scroll al seleccionar el tipo de vino
  useEffect(() => {
    if (formData.wine_type_id && formSectionRef.current && currentStep === 1) {
      setCurrentStep(2)
      formSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [formData.wine_type_id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleWineTypeSelect = (wineTypeId) => {
    setFormData({
      ...formData,
      wine_type_id: wineTypeId,
    })
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)

    // Create preview URLs for the selected files
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setSelectedImages((prevImages) => [...prevImages, ...newImages])

    // Update the form data with the first image file for backend compatibility
    if (files.length > 0 && selectedImages.length === 0) {
      setFormData({
        ...formData,
        image: "file_upload", // This is a placeholder, the actual file will be sent in FormData
      })
    }
  }

  // Add a function to remove an image
  const removeImage = (index) => {
    setSelectedImages((prevImages) => {
      const newImages = [...prevImages]
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })

    // Update form data if all images are removed
    if (selectedImages.length === 1) {
      setFormData({
        ...formData,
        image: "",
      })
    }
  }

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      if (currentStep === 2 && priceSectionRef.current) {
        priceSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Create FormData object for file uploads
      const formDataObj = new FormData()

      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key !== "image") {
          formDataObj.append(key, formData[key])
        }
      })

      // Add image files to FormData
      selectedImages.forEach((img, index) => {
        formDataObj.append(`images[]`, img.file) // Cambiado a images[] para Laravel
      })

      const response = await fetch(`${apiUrl}/v1/products`, {
        method: "POST",
        body: formDataObj, // Send FormData instead of JSON
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(data.errors)
        } else {
          throw new Error("Error en crear el producto")
        }
      } else {
        navigate("/")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 md:ml-[245px] p-4 md:p-8 pb-20 bg-gray-100 min-h-screen">
        {/* Progress bar header */}
        <div className="max-w-4xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Creació de producte</h2>
            <span className="text-sm text-gray-500">Pas {currentStep} de 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#BE6674] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-5">Que vols vendre?</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Sección 1: Selección de tipo de vino */}
            <div
              className={`flex flex-col justify-between bg-white rounded-lg shadow-md ${currentStep !== 1 ? "hidden" : ""}`}
            >
              <div className="w-full bg-[#F3E0D1] p-4 rounded-t-lg border-b border-gray-200">
                <h2 className="text-lg font-semibold text-[#BE6674]">Tria la categoria</h2>
                <p className="text-sm text-gray-600">Selecciona una opció d'aquest vins per escollir la categoria</p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {wineTypes.map((wine) => (
                    <div
                      key={wine.id}
                      onClick={() => handleWineTypeSelect(wine.id)}
                      className={`cursor-pointer border p-4 rounded-lg transition-all ${
                        formData.wine_type_id === wine.id
                          ? "bg-purple-100 border-purple-500 shadow-md"
                          : "border-gray-300 hover:border-purple-400 hover:shadow-sm"
                      }`}
                    >
                      <img
                        src={wine.image || "/placeholder.svg"}
                        alt={wine.name}
                        className="w-full h-20 object-cover mb-1 rounded"
                      />
                      <div className="text-center text-xs font-medium">{wine.name}</div>
                    </div>
                  ))}
                </div>
                {errors.wine_type_id && <span className="text-red-500 text-xs mt-1">{errors.wine_type_id[0]}</span>}
              </div>
            </div>

            {/* Sección 2: Formulario para crear el producto */}
            {formData.wine_type_id && (
              <div
                ref={formSectionRef}
                className={`flex flex-col justify-between bg-white rounded-lg shadow-md ${currentStep !== 2 ? "hidden" : ""}`}
              >
                {/* Header for the form section */}
              <div className="w-full bg-[#F3E0D1] p-4 rounded-t-lg border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-[#BE6674]">Crea el producte</h2>
                  <p className="text-sm text-gray-600">
                    Omple les següents dades per crear el teu producte. Proporciona tota la informació rellevant.
                  </p>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column - Product Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-purple-900 border-b pb-2">Informació del producte</h3>

                    {/* Nom del Vi */}
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="peer w-full h-12 bg-white rounded-lg border border-gray-300 px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder=" "
                        id="name"
                      />
                      <label
                        htmlFor="name"
                        className="absolute left-3 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                      >
                        Nom del Vi
                      </label>
                      {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name[0]}</span>}
                    </div>

                    {/* Denominació */}
                    <div className="relative">
                      <input
                        type="text"
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        className="peer w-full h-12 bg-white rounded-lg border border-gray-300 px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder=" "
                        id="origin"
                      />
                      <label
                        htmlFor="origin"
                        className="absolute left-3 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                      >
                        Denominació d'Origen
                      </label>
                      {errors.origin && <span className="text-red-500 text-xs mt-1">{errors.origin[0]}</span>}
                    </div>

                    {/* Any */}
                    <div className="relative">
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="peer w-full h-12 bg-white rounded-lg border border-gray-300 px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder=" "
                        id="year"
                      />
                      <label
                        htmlFor="year"
                        className="absolute left-3 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                      >
                        Any
                      </label>
                      {errors.year && <span className="text-red-500 text-xs mt-1">{errors.year[0]}</span>}
                    </div>

                    {/* Descripció */}
                    <div className="relative">
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="peer w-full h-24 bg-white rounded-lg border border-gray-300 px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder=" "
                        id="description"
                      />
                      <label
                        htmlFor="description"
                        className="absolute left-3 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                      >
                        Descripció
                      </label>
                      <div className="flex justify-between text-gray-400 text-xs mt-2 px-1">
                        <span>Máxim de 255 caràcters</span>
                        <span>{formData.description.length}/255</span>
                      </div>
                      {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description[0]}</span>}
                    </div>
                  </div>

                  {/* Right column - Images */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-purple-900 border-b pb-2">Imatges del producte</h3>

                    {/* Imatge */}
                    <div className="space-y-4">
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 transition-colors">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
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
                              className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                            >
                              <span>Puja imatges</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageSelect}
                              />
                            </label>
                            <p className="pl-1">o arrossega i deixa anar</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF fins a 10MB</p>
                        </div>
                      </div>

                      {/* Image preview section */}
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
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
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
                                  <span className="sr-only">Eliminar</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {errors.image && <span className="text-red-500 text-xs mt-1">{errors.image[0]}</span>}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        onClick={goToPreviousStep}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Anterior
                      </button>
                      <button
                        type="button"
                        onClick={goToNextStep}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Següent
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sección 3: Precio y cantidad */}
            {formData.wine_type_id && (
              <div
                ref={priceSectionRef}
                className={`flex flex-col justify-between bg-white rounded-lg shadow-md ${currentStep !== 3 ? "hidden" : ""}`}
              >
                {/* Header for the price section */}
                <div className="w-full bg-purple-100 p-4 rounded-t-lg border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-purple-900">Preu i disponibilitat</h2>
                  <p className="text-sm text-gray-600">Estableix el preu i la quantitat disponible del teu producte.</p>
                </div>

                <div className="p-8">
                  <div className="max-w-md mx-auto space-y-6">
                    {/* Preu */}
                    <div>
                      <label htmlFor="price_demanded" className="block text-sm font-medium text-gray-700 mb-1">
                        Preu (€)
                      </label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">€</span>
                        </div>
                        <input
                          type="number"
                          name="price_demanded"
                          id="price_demanded"
                          value={formData.price_demanded}
                          onChange={handleChange}
                          className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md h-12"
                          placeholder="0.00"
                          step="0.01"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">EUR</span>
                        </div>
                      </div>
                      {errors.price_demanded && (
                        <span className="text-red-500 text-xs mt-1">{errors.price_demanded[0]}</span>
                      )}
                    </div>

                    {/* Quantitat */}
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantitat disponible
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md h-12"
                        placeholder="1"
                        min="1"
                      />
                      {errors.quantity && <span className="text-red-500 text-xs mt-1">{errors.quantity[0]}</span>}
                    </div>

                    {/* Preview section */}
                    <div className="mt-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="text-base font-medium text-purple-800 mb-4">Resum del producte</h4>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-purple-100">
                          <span className="text-sm text-gray-600">Nom:</span>
                          <span className="font-medium text-purple-900">{formData.name || "-"}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-purple-100">
                          <span className="text-sm text-gray-600">Origen:</span>
                          <span className="font-medium text-purple-900">{formData.origin || "-"}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-purple-100">
                          <span className="text-sm text-gray-600">Any:</span>
                          <span className="font-medium text-purple-900">{formData.year || "-"}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-purple-100">
                          <span className="text-sm text-gray-600">Preu:</span>
                          <span className="font-bold text-purple-900 text-lg">
                            {formData.price_demanded ? `${formData.price_demanded}€` : "-"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Quantitat:</span>
                          <span className="font-bold text-purple-900">{formData.quantity || "-"}</span>
                        </div>
                      </div>

                      {selectedImages.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-purple-100">
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
                        onClick={goToPreviousStep}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Anterior
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                      >
                        Puja el teu producte
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

