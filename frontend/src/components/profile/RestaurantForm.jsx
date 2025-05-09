import { useState, useEffect } from "react"
import { useFetchUser } from "@/components/auth/FetchUser"
import { getCookie } from "@/utils/utils"

export default function RestaurantForm({ primaryColors }) {
  const { user } = useFetchUser()
  const apiUrl = import.meta.env.VITE_API_URL
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    address: "",
    phone_contact: "",
    name_contact: "",
    credit_card: "",
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [touchedFields, setTouchedFields] = useState({})

  // Sincronizar datos del restaurante al formulario
  useEffect(() => {
    if (user && user.details && user.details.restaurant) {
      const restaurantData = user.details.restaurant
      setFormData({
        address: restaurantData.address || "",
        phone_contact: restaurantData.phone_contact || "",
        name_contact: restaurantData.name_contact || "",
        credit_card: restaurantData.credit_card || "",
      })
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

    // Marcar todos los campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const token = getCookie("token")
      const response = await fetch(`${apiUrl}/restaurant`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al actualitzar les dades del restaurant")
      }

      setSuccessMessage("Dades del restaurant actualitzades correctament")
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
        {isLoading ? "Guardant..." : "Guardar canvis"}
      </button>
    </form>
  )
}