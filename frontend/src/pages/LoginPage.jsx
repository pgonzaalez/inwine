import { useState } from "react"
import {
  User,
  Lock,
  CornerDownLeft,
  AlertCircle,
  X,
  ShieldCheck,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getCookie, setCookie } from "@/utils/utils";
import RoleSelector from "@/components/RoleSelector"
import Modal from "@components/Modal";

const LoginForm = () => {
  const apiUrl = import.meta.env.VITE_API_URL

  // Estado para controlar formulario
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Estado para mostrar mensajes (error o éxito)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  // Cargando mientras se hace la petición
  const [isLoading, setIsLoading] = useState(false)

  // Estados relacionados con la selección de rol
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  // const [showRoleSelection, setShowRoleSelection] = useState(false)
  // const [availableRoles, setAvailableRoles] = useState([])
  // const [selectedRole, setSelectedRole] = useState(null)
  const [userData, setUserData] = useState(null)

  const navigate = useNavigate()

  // Actualiza los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Lógica al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setMessageType("")
    setIsLoading(true)

    try {
      // Petición al backend
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      // Manejo de errores
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Credencials incorrectes. Comprova el teu correu i contrasenya.")
        } else if (response.status === 429) {
          throw new Error("Massa intents fallits. Torna-ho a provar més tard.")
        } else {
          throw new Error(result.message || "Error al iniciar sessió")
        }
      }

      // Guardar token, resetear form, guardar usuario
      setMessage("Inici de sessió correcte")
      setMessageType("success")
      setCookie("token", result.token, 7)
      setUserData(result.user)
      setFormData({ email: "", password: "" })

      // Si tiene varios roles, mostrar selector. Si no, redirigir.
      if (result.user?.roles?.length > 1) {
        setIsRoleModalOpen(true)
      } else {
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

  const redirectToDashboard = async (role) => {
    try {
      // Solo necesitamos actualizar el rol si hay más de uno
      if (userData?.roles?.length > 1) {
        const response = await fetch(`${apiUrl}/update-active-role`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: JSON.stringify({ role }),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el rol activo");
        }
      }

      setTimeout(() => {
        switch (role) {
          case "seller":
            navigate("/seller/dashboard");
            break;
          case "restaurant":
            navigate("/restaurant/dashboard");
            break;
          case "investor":
            navigate(-1);
            break;
          default:
            navigate("/login");
        }
      }, 500);
    } catch (error) {
      // console.error("Error updating active role:", error);
      // Puedes manejar el error como prefieras
    }
  };

  // Cierra el mensaje de error o éxito
  const dismissMessage = () => {
    setMessage("")
    setMessageType("")
  }

  // // Si debe seleccionar un rol, mostrar la vista de roles
  // if (showRoleSelection) {
  //   return (
  //     <RoleSelector
  //       roles={availableRoles}
  //       onSelect={(role) => {
  //         setSelectedRole(role)
  //         redirectToDashboard(role)
  //       }}
  //     />
  //   )
  // }

  // Vista normal del login
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
          {/* Botón para volver atrás */}
          <button
            onClick={() => navigate(-1)}
            className="border-2 rounded-lg p-2 hover:bg-gray-200 transition-colors duration-200"
          >
            <CornerDownLeft size={20} className="cursor-pointer" />
          </button>

          {/* Título */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Inicia sessió</h1>
            <p className="mt-2 text-sm text-gray-600">
              Introdueix les teves credencials per accedir
            </p>
          </div>

          {/* Mensaje de error o éxito */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg relative ${messageType === "error"
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

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full h-12 pl-10 pr-4 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${messageType === "error" ? "border-red-300" : "border-gray-300"
                  }`}
                placeholder="Correu electrònic"
                required
              />
            </div>

            {/* Campo contraseña */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full h-12 pl-10 pr-4 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${messageType === "error" ? "border-red-300" : "border-gray-300"
                  }`}
                placeholder="Contrasenya"
                required
              />
            </div>

            {/* Botón de enviar */}
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

      {/* Modal de Cambio de Rol */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Escollir rol"
        description="Selecciona el rol amb el qual vols accedir:"
        icon={<User className="h-8 w-8" />}
        variant="primary"
        size="md" 
        footer={null}
      >
        <div className="px-2">
          <RoleSelector
            roles={userData?.roles || []}
            onSelect={(role) => {
              redirectToDashboard(role);
              setIsRoleModalOpen(false);
            }}
          />
        </div>
      </Modal>
    </>
  )
}

export default LoginForm
