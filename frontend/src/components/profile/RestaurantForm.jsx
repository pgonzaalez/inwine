import { useState, useEffect } from "react"
import { useFetchUser } from "@/components/auth/FetchUser"
import { getCookie } from "@/utils/utils"
import { useTranslation } from "react-i18next";

export default function RestaurantForm({ primaryColors }) {
  const { t } = useTranslation();
  const { user } = useFetchUser()
  const apiUrl = import.meta.env.VITE_API_URL
  const baseUrl = import.meta.env.VITE_URL_BASE
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    address: "",
    phone_contact: "",
    name_contact: "",
    credit_card: "",
    business_name: "",
    province: "",
    description: "",
    image: "",
    number_of_diners: "",
    wine_rotation: "",
    reference_number: "",
    shifts: "unknown",
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [touchedFields, setTouchedFields] = useState({})
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [existingImage, setExistingImage] = useState("")
  const [removeImageFlag, setRemoveImageFlag] = useState(false)

  useEffect(() => {
    if (user && user.details && user.details.restaurant) {
      const restaurantData = user.details.restaurant
      setFormData({
        address: restaurantData.address || "",
        phone_contact: restaurantData.phone_contact || "",
        name_contact: restaurantData.name_contact || "",
        credit_card: restaurantData.credit_card || "",
        business_name: restaurantData.business_name || "",
        province: restaurantData.province || "",
        description: restaurantData.description || "",
        image: restaurantData.image || "",
        number_of_diners: restaurantData.number_of_diners || "",
        wine_rotation: restaurantData.wine_rotation || "",
        reference_number: restaurantData.reference_number || "",
        shifts: restaurantData.shifts || "unknown",
      })
      setExistingImage(restaurantData.image || "")
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouchedFields((prev) => ({ ...prev, [name]: true }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const hasError = (fieldName) => {
    return touchedFields[fieldName] && errors[fieldName];
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.address || formData.address.length < 5) {
      newErrors.address = "La direcció ha de tenir al menys 5 caràcters"
    }

    if (!formData.phone_contact || formData.phone_contact.length < 9) {
      newErrors.phone_contact = "El telèfon ha de tenir al menys 9 dígits"
    }

    if (!formData.name_contact || formData.name_contact.length < 2) {
      newErrors.name_contact = "El nom de contacte ha de tenir al menys 2 caràcters"
    }

    if (!formData.credit_card || formData.credit_card.length < 16) {
      newErrors.credit_card = "La targeta de crèdit ha de tenir al menys 16 dígits"
    }

    if (!formData.business_name || formData.business_name.length < 5) {
      newErrors.business_name = "El nom de l\'empresa ha de tenir al menys 5 caràcters"
    }

    if (!formData.province || formData.province.length < 3) {
      newErrors.province = "El nom de la provincia ha de tenir al menys 3 caràcters"
    }

    if (!formData.description || formData.description.length < 20 || formData.description.length > 100) {
      newErrors.description = "La descripció ha de tenir al menys 20 i no més de 100 caràcters"
    }

    if (!formData.wine_rotation || formData.wine_rotation.length < 4 || formData.wine_rotation.length > 20) {
      newErrors.wine_rotation = "La rotació de vins ha de tenir al menys 4 caràcters i no més de 20 caràcters"
    }

    // Marcar todos los campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageSelect = (e) => {
    if (!e.target.files?.[0]) return

    const file = e.target.files[0]
    const preview = URL.createObjectURL(file)

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    setSelectedImage({ file, preview })
    setImagePreview(preview)
    setRemoveImageFlag(false)
    setTouchedFields((prev) => ({ ...prev, image: true }))
  }

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setSelectedImage(null)
    setImagePreview("")
    setTouchedFields((prev) => ({ ...prev, image: true }))
  }

  const removeExistingImage = () => {
    setExistingImage("")
    setRemoveImageFlag(true)
    setTouchedFields((prev) => ({ ...prev, image: true }))
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageSelect({ target: { files: e.dataTransfer.files } });
      e.dataTransfer.clearData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const token = getCookie("token")
      const formDataObj = new FormData()
      formDataObj.append("_method", "PUT")

      Object.keys(formData).forEach((key) => {
        if (key !== "image") {
          formDataObj.append(key, formData[key])
        }
      })

      if (selectedImage) {
        formDataObj.append("image", selectedImage.file)
      } else if (removeImageFlag) {
        formDataObj.append("remove_image", "1")
      }

      const response = await fetch(`${apiUrl}/restaurant`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formDataObj
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(data.errors || {})
          throw new Error(t("profile.restaurant_update_error") || "Error al actualitzar les dades del restaurant")
        }
        throw new Error(data.message || "Error al actualitzar les dades del restaurant")
      }

      setSuccessMessage("Dades del restaurant actualitzades correctament")
      setSelectedImage(null)
      if (imagePreview && (data.seller.image)) {
        setExistingImage(data.seller.image)
      }
      setImagePreview("")
      setRemoveImageFlag(false)
    } catch (error) {
      setErrors({
        submit: error.message || "Ha ocorregut un error en guardar els canvis"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mensajes de feedback */}
      {successMessage && (
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {errors.submit}
        </div>
      )}

      <div className="space-y-4">
        {/* Dirección */}
        <div className="relative">
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
              hasError("address") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder=" "
            id="address"
          />
          <label
            htmlFor="address"
            className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
              hasError("address") ? "text-red-500" : "text-gray-500"
            }`}
          >
            Direcció
          </label>
          {hasError("address") && <span className="text-red-500 text-xs mt-1">{errors.address}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre de contacto */}
          <div className="relative">
            <input
              type="text"
              name="name_contact"
              value={formData.name_contact}
              onChange={handleChange}
              className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
                hasError("name_contact") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder=" "
              id="name_contact"
            />
            <label
              htmlFor="name_contact"
              className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                hasError("name_contact") ? "text-red-500" : "text-gray-500"
              }`}
            >
              Nom de contacte
            </label>
            {hasError("name_contact") && <span className="text-red-500 text-xs mt-1">{errors.name_contact}</span>}
          </div>

          {/* Teléfono de contacto */}
          <div className="relative">
            <input
              type="tel"
              name="phone_contact"
              value={formData.phone_contact}
              onChange={handleChange}
              className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
                hasError("phone_contact") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder=" "
              id="phone_contact"
            />
            <label
              htmlFor="phone_contact"
              className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                hasError("phone_contact") ? "text-red-500" : "text-gray-500"
              }`}
            >
              Telèfon de contacte
            </label>
            {hasError("phone_contact") && <span className="text-red-500 text-xs mt-1">{errors.phone_contact}</span>}
          </div>
        </div>

        {/* Tarjeta de crédito */}
        <div className="relative">
          <input
            type="text"
            name="credit_card"
            value={formData.credit_card}
            onChange={handleChange}
            className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
              hasError("credit_card") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder=" "
            id="credit_card"
          />
          <label
            htmlFor="credit_card"
            className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
              hasError("credit_card") ? "text-red-500" : "text-gray-500"
            }`}
          >
            Targeta de crèdit
          </label>
          {hasError("credit_card") && <span className="text-red-500 text-xs mt-1">{errors.credit_card}</span>}
          <p className="text-xs text-gray-500 mt-1">Informació de targeta per a pagaments</p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">{t("profile.restaurant_public_data_title")}</h2>
        <p className="text-gray-600 mb-6">
          {t("profile.restaurant_public_data_desc")}
        </p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="relative">
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
                hasError("business_name") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder=" "
              id="business_name"
            />
            <label
              htmlFor="business_name"
              className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                hasError("business_name") ? "text-red-500" : "text-gray-500"
              }`}
            >
              Nom del negoci
            </label>
            {hasError("business_name") && <span className="text-red-500 text-xs mt-1">{errors.business_name}</span>}
          </div>

          {/* Província */}
          <div className="relative">
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
                hasError("province") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder=" "
              id="province"
            />
            <label
              htmlFor="province"
              className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                hasError("province") ? "text-red-500" : "text-gray-500"
              }`}
            >
              Província
            </label>
            {hasError("province") && <span className="text-red-500 text-xs mt-1">{errors.business_name}</span>}
          </div>
        </div>

        {/* Descripción */}
        <div className="relative">
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
              hasError("description") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder=" "
            id="description"
          />
          <label
            htmlFor="description"
            className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
              hasError("description") ? "text-red-500" : "text-gray-500"
            }`}
          >
            Descripció
          </label>
          {hasError("description") && <span className="text-red-500 text-xs mt-1">{errors.business_name}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Número de Comensales */}
        <div className="relative">
          <input
            type="number"
            min="1"
            max="1000"
            name="number_of_diners"
            value={formData.number_of_diners}
            onChange={handleChange}
            className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
              hasError("number_of_diners") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder=" "
            id="number_of_diners"
          />
          <label
            htmlFor="number_of_diners"
            className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
              hasError("number_of_diners") ? "text-red-500" : "text-gray-500"
            }`}
          >
            Número de comensals
          </label>
          {hasError("number_of_diners") && <span className="text-red-500 text-xs mt-1">{errors.number_of_diners}</span>}
        </div>

        {/* Turnos */}
        <div className="relative">
          <select
            name="shifts"
            value={formData.shifts}
            onChange={handleChange}
            id="shifts"
            className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
              hasError("shifts") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            <option value="unknown">{t(`dashboards.restaurant.status.unknown`)}</option>
            <option value="mond_to_sund_lunch">{t(`dashboards.restaurant.shifts.mond_to_sund_lunch`)}</option>
            <option value="mond_to_sund_dinner">{t(`dashboards.restaurant.shifts.mond_to_sund_dinner`)}</option>
            <option value="mond_to_sund_lunch_and_dinner">{t(`dashboards.restaurant.shifts.mond_to_sund_lunch_and_dinner`)}</option>
            <option value="tues_to_sund_lunch">{t(`dashboards.restaurant.shifts.tues_to_sund_lunch`)}</option>
            <option value="tues_to_sund_dinner">{t(`dashboards.restaurant.shifts.tues_to_sund_dinner`)}</option>
            <option value="tues_to_sund_lunch_and_dinner">{t(`dashboards.restaurant.shifts.tues_to_sund_lunch_and_dinner`)}</option>
            <option value="frid_to_sund_lunch">{t(`dashboards.restaurant.shifts.frid_to_sund_lunch`)}</option>
            <option value="frid_to_sund_dinner">{t(`dashboards.restaurant.shifts.frid_to_sund_dinner`)}</option>
            <option value="frid_to_sund_lunch_and_dinner">{t(`dashboards.restaurant.shifts.frid_to_sund_lunch_and_dinner`)}</option>
            <option value="satu_and_sund_lunch">{t(`dashboards.restaurant.shifts.satu_and_sund_lunch`)}</option>
            <option value="satu_and_sund_dinner">{t(`dashboards.restaurant.shifts.satu_and_sund_dinner`)}</option>
            <option value="satu_and_sund_lunch_and_dinner">{t(`dashboards.restaurant.shifts.satu_and_sund_lunch_and_dinner`)}</option>
          </select>
          <label
            htmlFor="shifts"
            className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
              hasError("shifts") ? "text-red-500" : "text-gray-500"
            }`}
          >
            Torns
          </label>
          {hasError("shifts") && <span className="text-red-500 text-xs mt-1">{errors.shifts}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Número de referencia */}
        <div className="relative">
          <input
            type="number"
            min="1"
            max="1000"
            name="reference_number"
            value={formData.reference_number}
            onChange={handleChange}
            className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
              hasError("reference_number") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder=" "
            id="reference_number"
          />
          <label
            htmlFor="reference_number"
            className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
              hasError("reference_number") ? "text-red-500" : "text-gray-500"
            }`}
          >
            Número de referència (quantitat de vins al restaurant)
          </label>
          {hasError("reference_number") && <span className="text-red-500 text-xs mt-1">{errors.reference_number}</span>}
        </div>

        {/* Rotación de vinos */}
        <div className="relative">
          <input
            type="text"
            name="wine_rotation"
            value={formData.wine_rotation}
            onChange={handleChange}
            className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
              hasError("wine_rotation") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder=" "
            id="wine_rotation"
          />
          <label
            htmlFor="wine_rotation"
            className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
              hasError("wine_rotation") ? "text-red-500" : "text-gray-500"
            }`}
          >
            Rotació de vins (temps que tarda en vendre's cada vi)
          </label>
          {hasError("wine_rotation") && <span className="text-red-500 text-xs mt-1">{errors.wine_rotation}</span>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Imatge del restaurant</label>
          {!(imagePreview || existingImage) && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-1 flex justify-center px-12 pt-10 pb-12 border-2 border-dashed rounded-lg transition-colors ${
                hasError("image")
                  ? "border-red-300 bg-red-50"
                  : isDragging 
                  ? "border-[#8C2E2E] bg-[#F5E6E8]"
                  : "border-gray-300 hover:border-[#D9A5AD]"
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
                    className={`relative cursor-pointer bg-transparent rounded-md font-medium focus-within:outline-none ${hasError("image") ? "text-red-500 hover:text-red-400" : "text-[#9A3E50] hover:text-[#C27D7D]"
                      }`}
                    >
                    <span>{t("dashboards.seller.product.field_image_upload_single")}</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageSelect}
                    />
                  </label>
                  <p className="pl-1">{t("dashboards.seller.product.field_image_drag")}</p>
                </div>
                <p className="text-xs text-gray-500">{t("dashboards.seller.product.field_image_types")}</p>
              </div>
            </div>
          )}
          {(imagePreview || existingImage) && (
            <div className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative group h-48 sm:h-56">
                    <img
                      src={
                        existingImage 
                          ? (existingImage.includes("storage") 
                              ? `${baseUrl}${existingImage}` 
                              : existingImage)
                          : imagePreview
                      }
                      alt="Restaurant preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={selectedImage ? removeImage : removeExistingImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
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
              </div>
            </div>
          )}
          {hasError("image") && <span className="text-red-500 text-xs mt-1">{errors.image}</span>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
          isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
        }`}
        style={{
          background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
        }}
      >
        {isLoading ? t("profile.saving") : t("profile.save_changes")}
      </button>
    </form>
  )
}