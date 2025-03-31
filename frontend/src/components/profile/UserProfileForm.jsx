"use client"

import { useState } from "react"
import { useFetchUser } from "@/components/auth/FetchUser"

export default function UserProfileForm({ primaryColors }) {
  const { user } = useFetchUser()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nif: user?.nif || "",
    name: user?.name || "",
    email: user?.email || "",
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

    if (!formData.nif || formData.nif.length !== 9) {
      newErrors.nif = "El NIF debe tener 9 caracteres"
    }

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres"
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Introduce un email válido"
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
      alert("Perfil actualizado correctamente")
      console.log(formData)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="nif" className="block text-sm font-medium">
          NIF
        </label>
        <input
          id="nif"
          name="nif"
          type="text"
          value={formData.nif}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.nif ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.nif && <p className="text-sm text-red-500">{errors.nif}</p>}
        <p className="text-sm text-gray-500">Tu número de identificación fiscal (NIF)</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
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

