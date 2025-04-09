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

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.address || formData.address.length < 5) {
      newErrors.address = "La dirección debe tener al menos 5 caracteres"
    }

    if (!formData.phone_contact || formData.phone_contact.length < 9) {
      newErrors.phone_contact = "El teléfono debe tener al menos 9 dígitos"
    }

    if (!formData.name_contact || formData.name_contact.length < 2) {
      newErrors.name_contact = "El nombre de contacto debe tener al menos 2 caracteres"
    }

    if (!formData.credit_card || formData.credit_card.length < 16) {
      newErrors.credit_card = "La tarjeta de crédito debe tener al menos 16 dígitos"
    }

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
        throw new Error(errorData.message || "Error al actualizar los datos del restaurante")
      }

      setSuccessMessage("Datos del restaurante actualizados correctamente")
    } catch (error) {
      setErrors({
        submit: error.message || "Ha ocurrido un error al guardar los cambios"
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

      <div className="space-y-2">
        <label htmlFor="address" className="block text-sm font-medium">
          Direcció
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.address ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="phone_contact" className="block text-sm font-medium">
          Telèfon de contacte
        </label>
        <input
          id="phone_contact"
          name="phone_contact"
          type="tel"
          value={formData.phone_contact}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.phone_contact ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.phone_contact && <p className="text-sm text-red-500">{errors.phone_contact}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="name_contact" className="block text-sm font-medium">
          Nom de contacte
        </label>
        <input
          id="name_contact"
          name="name_contact"
          type="text"
          value={formData.name_contact}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.name_contact ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.name_contact && <p className="text-sm text-red-500">{errors.name_contact}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="credit_card" className="block text-sm font-medium">
          Targeta de crèdit
        </label>
        <input
          id="credit_card"
          name="credit_card"
          type="text"
          value={formData.credit_card}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.credit_card ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.credit_card && <p className="text-sm text-red-500">{errors.credit_card}</p>}
        <p className="text-sm text-gray-500">Informació de targeta per a pagaments</p>
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