"use client"

import { useState } from "react"

export default function InvestorForm({ primaryColors }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    address: "",
    phone_contact: "",
    credit_card: "",
    bank_account: "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error al cambiar el valor
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simular llamada a API
    setTimeout(() => {
      setIsLoading(false)
      alert("Datos de inversor actualizados correctamente")
      console.log(formData)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="address" className="block text-sm font-medium">
          Dirección
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
          Teléfono de contacto
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
        <label htmlFor="credit_card" className="block text-sm font-medium">
          Tarjeta de crédito (opcional)
        </label>
        <input
          id="credit_card"
          name="credit_card"
          type="text"
          value={formData.credit_card}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <p className="text-sm text-gray-500">Información de tarjeta para pagos</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="bank_account" className="block text-sm font-medium">
          Cuenta bancaria (opcional)
        </label>
        <input
          id="bank_account"
          name="bank_account"
          type="text"
          value={formData.bank_account}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <p className="text-sm text-gray-500">Cuenta para recibir pagos e inversiones</p>
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
        {isLoading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  )
}

