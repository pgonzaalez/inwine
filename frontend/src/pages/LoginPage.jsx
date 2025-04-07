import { useState } from "react"
import { User, Lock, CornerDownLeft, AlertCircle, X, ShoppingBag, Utensils, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { setCookie } from "@/utils/utils"

const LoginForm = () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [availableRoles, setAvailableRoles] = useState([])
  const [userData, setUserData] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setMessageType("")
    setIsLoading(true)

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Credencials incorrectes. Comprova el teu correu i contrasenya.")
        } else if (response.status === 429) {
          throw new Error("Massa intents fallits. Torna-ho a provar més tard.")
        } else {
          throw new Error(result.message || "Error al iniciar sessió")
        }
      }

      setMessage("Inici de sessió correcte")
      setMessageType("success")
      setCookie("token", result.token, 7)
      setUserData(result.user)

      setFormData({
        email: "",
        password: "",
      })

      // Verificar si tiene múltiples roles
      if (result.user?.roles?.length > 1) {
        setAvailableRoles(result.user.roles)
        setShowRoleSelection(true)
      } else {
        // Si solo tiene un rol, redirigir directamente
        const role = result.user?.roles?.[0]
        redirectToDashboard(role)
      }
    } catch (error) {
      setMessage(error.message)
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const redirectToDashboard = (role) => {
    setTimeout(() => {
      switch (role) {
        case "seller":
          navigate("/seller/dashboard")
          break
        case "restaurant":
          navigate("/restaurant/dashboard")
          break
        case "investor":
          navigate(-1)
          break
        default:
          navigate("/login")
      }
    }, 500)
  }

  const dismissMessage = () => {
    setMessage("")
    setMessageType("")
  }

  // Get role info
  const getRoleInfo = (role) => {
    switch (role) {
      case "seller":
        return {
          icon: <ShoppingBag size={32} />,
          label: "Venedor",
          description: "Gestiona els teus productes i vendes",
        }
      case "restaurant":
        return {
          icon: <Utensils size={32} />,
          label: "Restaurant",
          description: "Administra el teu restaurant",
        }
      case "investor":
        return {
          icon: <TrendingUp size={32} />,
          label: "Inversor",
          description: "Segueix les teves inversions",
        }
      default:
        return {
          icon: <User size={32} />,
          label: role,
          description: "Accedeix al teu compte",
        }
    }
  }

  // Vista de selección de roles
  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Selecciona el teu rol</h1>
            <p className="text-gray-500 mt-2">Escull com vols accedir al sistema</p>
          </div>

          <div className="grid gap-4">
            {availableRoles.map((role, index) => {
              const { icon, label, description } = getRoleInfo(role)
              const isSelected = selectedRole === role

              return (
                <div
                  key={index}
                  onClick={() => setSelectedRole(role)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-[#BE6674] bg-[#BE6674]/5"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-lg ${isSelected ? "bg-[#BE6674]/10 text-[#BE6674]" : "bg-gray-100 text-gray-600"}`}
                    >
                      {icon}
                    </div>
                    <div className="ml-4">
                      <h3 className={`font-medium ${isSelected ? "text-[#BE6674]" : "text-gray-800"}`}>{label}</h3>
                      <p className="text-sm text-gray-500">{description}</p>
                    </div>
                    <div className="ml-auto">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-[#BE6674] bg-[#BE6674]" : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => selectedRole && redirectToDashboard(selectedRole)}
              disabled={!selectedRole}
              className={`px-6 py-2 rounded-lg text-white transition-all duration-200 ${
                selectedRole ? "bg-[#BE6674] hover:bg-[#741C28]" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Vista normal de login
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="border-2 rounded-lg p-2 hover:bg-gray-200 transition-colors duration-200"
        >
          <CornerDownLeft size={20} className="cursor-pointer" />
        </button>
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Inicia sessió</h1>
          <p className="mt-2 text-sm text-gray-600">Introdueix les teves credencials per accedir</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg relative ${
              messageType === "error"
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-green-50 border border-green-200 text-green-700"
            }`}
          >
            <div className="flex items-start">
              {messageType === "error" && <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />}
              <div className="flex-1">{message}</div>
              <button onClick={dismissMessage} className="ml-2 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full h-12 pl-10 pr-4 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                messageType === "error" ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Correu electrònic"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full h-12 pl-10 pr-4 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                messageType === "error" ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Contrasenya"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#BE6674] text-white rounded-lg hover:bg-[#741C28] transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Carregant..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm

