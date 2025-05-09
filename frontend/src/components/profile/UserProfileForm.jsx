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
  const [touchedFields, setTouchedFields] = useState({})

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
    setTouchedFields(prev => ({ ...prev, [name]: true }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const hasError = (fieldName) => {
    return touchedFields[fieldName] && errors[fieldName];
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.NIF || formData.NIF.length !== 9) {
      newErrors.NIF = "El NIF ha de tenir 9 caràcters"
    }

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "El nom ha de tenir al menys 2 caràcters"
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Introdueix un email vàlid"
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
        throw new Error(errorData.message || "Error a l'actualitzar el perfil")
      }

      setSuccessMessage("Perfil actualitzat correctament")
    } catch (error) {
      setErrors({
        submit: error.message || "Ha hagut un error al guardar els canvis"
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
        {/* Campo NIF */}
        <div className="relative">
          <input
            type="text"
            name="NIF"
            value={formData.NIF}
            onChange={handleChange}
            className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
              hasError("NIF") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder=" "
            id="NIF"
          />
          <label
            htmlFor="NIF"
            className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
              hasError("NIF") ? "text-red-500" : "text-gray-500"
            }`}
          >
            NIF
          </label>
          {hasError("NIF") && <span className="text-red-500 text-xs mt-1">{errors.NIF}</span>}
        </div>

        {/* Campo Nombre */}
        <div className="relative">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
              hasError("name") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder=" "
            id="name"
          />
          <label
            htmlFor="name"
            className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
              hasError("name") ? "text-red-500" : "text-gray-500"
            }`}
          >
            Nom
          </label>
          {hasError("name") && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
        </div>

        {/* Campo Email */}
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`peer w-full h-12 bg-white rounded-lg border px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 ${
              hasError("email") ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder=" "
            id="email"
          />
          <label
            htmlFor="email"
            className={`absolute left-3 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
              hasError("email") ? "text-red-500" : "text-gray-500"
            }`}
          >
            Correu electrònic
          </label>
          {hasError("email") && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
        </div>
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
        {isLoading ? "Guardant..." : "Guardar canvis"}
      </button>
    </form>
  )
}