import { useState, useEffect } from "react"
import { useFetchUser } from "@/components/auth/FetchUser"
import { getCookie } from "@/utils/utils"

export default function SellerForm({ primaryColors }) {
  const { user } = useFetchUser()
  const apiUrl = import.meta.env.VITE_API_URL
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    address: "",
    phone_contact: "",
    name_contact: "",
    bank_account: "",
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  // Sincronizar datos del usuario al formulario
  useEffect(() => {
    if (user && user.details && user.details.seller) {
      const sellerData = user.details.seller
      setFormData({
        address: sellerData.address || "",
        phone_contact: sellerData.phone_contact || "",
        name_contact: sellerData.name_contact || "",
        bank_account: sellerData.bank_account || "",
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
      const response = await fetch(`${apiUrl}/seller`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al actualizar los datos de vendedor")
      }

      setSuccessMessage("Datos de vendedor actualizados correctamente")
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
          type="text"
          value={formData.phone_contact}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.phone_contact ? "border-red-500" : "border-gray-300"
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
        <label htmlFor="bank_account" className="block text-sm font-medium">
          Compte bancari
        </label>
        <input
          id="bank_account"
          name="bank_account"
          type="text"
          value={formData.bank_account}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <p className="text-sm text-gray-500">Compte per rebre pagaments per ventes</p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
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