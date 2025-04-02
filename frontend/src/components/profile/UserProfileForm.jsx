import { useState, useEffect } from "react"
import { useFetchUser } from "@/components/auth/FetchUser"
import { getCookie } from "@/utils/utils"

export default function UserProfileForm({ primaryColors }) {
  const { user } = useFetchUser()
  const apiUrl = import.meta.env.VITE_API_URL
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    NIF: "",
    name: "",
    email: "",
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  // Sincronizar datos del usuario al formulario
  useEffect(() => {
    if (user) {
      setFormData({
        NIF: user.NIF || "",
        name: user.name || "",
        email: user.email || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.NIF || formData.NIF.length !== 9) {
      newErrors.NIF = "El NIF debe tener 9 caracteres"
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage("")
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const token = getCookie("token")
      const response = await fetch(`${apiUrl}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          NIF: formData.NIF,
          name: formData.name,
          email: formData.email
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al actualizar el perfil")
      }
      
      setSuccessMessage("Perfil actualizado correctamente")
    } catch (error) {
      setErrors({
        submit: error.message || "Hubo un error al guardar los cambios"
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

      {/* Campo NIF */}
      <div className="space-y-2">
        <label htmlFor="NIF" className="block text-sm font-medium">
          NIF
        </label>
        <input
          id="NIF"
          name="NIF"
          type="text"
          value={formData.NIF}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.NIF ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.NIF && <p className="text-sm text-red-500">{errors.NIF}</p>}
        <p className="text-sm text-gray-500">Tu número de identificación fiscal</p>
      </div>

      {/* Campo Nombre */}
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
          className={`w-full px-3 py-2 border rounded-md ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Campo Email */}
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
          className={`w-full px-3 py-2 border rounded-md ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Botón de envío */}
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