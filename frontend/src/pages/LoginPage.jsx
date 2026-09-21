import { useState } from "react"
import {
  User,
  Lock,
  CornerDownLeft,
  AlertCircle,
  X,
  ShieldCheck,
  UserPlus,
  Mail,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getCookie, setCookie } from "@/utils/utils";
import RoleSelector from "@/components/RoleSelector"
import Modal from "@components/Modal";
import { API_URL } from "@/config/api";

import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const { t } = useTranslation();
  const apiUrl = API_URL

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
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false)
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
          throw new Error(t("auth.login.error_credentials"))
        } else if (response.status === 429) {
          throw new Error(t("auth.login.error_too_many_attempts"))
        } else {
          throw new Error(result.message || t("auth.login.error_generic"))
        }
      }

      // Guardar token, resetear form, guardar usuario
      setMessage(t("auth.login.success"))
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
          throw new Error(t("auth.login.error_generic"));
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
            navigate("/investor/dashboard");
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

  const handleRegisterRoleSelect = (role) => {
    setIsRegisterModalOpen(false);
    switch (role) {
      case "seller":
        navigate("/register/seller");
        break;
      case "restaurant":
        navigate("/register/restaurant");
        break;
      case "investor":
        navigate("/register/investor");
        break;
      default:
        navigate("/register/seller");
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
            <h1 className="text-3xl font-bold text-gray-800">{t("auth.login.title")}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {t("auth.login.subtitle")}
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
                placeholder={t("auth.login.email_placeholder")}
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
                placeholder={t("auth.login.password_placeholder")}
                required
              />
            </div>

            {/* Enllaç de recuperació de compte */}
            <div className="text-right -mt-2">
              <button
                type="button"
                onClick={() => setIsForgotPasswordModalOpen(true)}
                className="text-sm font-medium text-[#BE6674] hover:text-[#741C28] hover:underline cursor-pointer"
              >
                {t("auth.login.forgot_password", "Has oblidat la contrasenya?")}
              </button>
            </div>

            {/* Botón de enviar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#BE6674] text-white font-medium rounded-lg hover:bg-[#741C28] transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow"
            >
              {isLoading ? t("auth.login.loading") : t("auth.login.submit")}
            </button>
          </form>

          {/* Separador y sección de registro */}
          <div className="mt-6">
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-200 w-full"></div>
              <span className="bg-white px-3 text-xs text-gray-500 uppercase tracking-wider font-medium">
                {t("auth.login.or_divider", "o")}
              </span>
              <div className="border-t border-gray-200 w-full"></div>
            </div>

            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="w-full py-3 border-2 border-[#BE6674] text-[#BE6674] hover:bg-[#BE6674] hover:text-white rounded-lg font-medium transition duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              <UserPlus size={18} />
              <span>{t("auth.login.register_button", "Crear una cuenta")}</span>
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              {t("auth.login.no_account", "¿No tienes cuenta?")}{" "}
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="font-medium text-[#BE6674] hover:text-[#741C28] hover:underline cursor-pointer"
              >
                {t("auth.login.register_link", "Regístrate aquí")}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Cambio de Rol */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title={t("auth.login.role_modal_title")}
        description={t("auth.login.role_modal_desc")}
        icon={<User className="h-8 w-8 text-[#BE6674]" />}
        iconBackground="bg-[#BE6674]/10"
        variant="default"
        size="md" 
        footer={null}
      >
        <div className="px-2">
          {isRoleModalOpen && (
            <RoleSelector
              roles={userData?.roles || []}
              onSelect={(role) => {
                redirectToDashboard(role);
                setIsRoleModalOpen(false);
              }}
            />
          )}
        </div>
      </Modal>

      {/* Modal de Recuperació de Compte */}
      <Modal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        title={t("auth.login.forgot_password_modal_title", "Recuperar el teu compte")}
        description={t(
          "auth.login.forgot_password_modal_desc",
          "Per motius de seguretat, la recuperació de contrasenya es gestiona manualment. Escriu-nos i t'ajudarem a recuperar l'accés al teu compte."
        )}
        icon={<Mail className="h-8 w-8 text-[#BE6674]" />}
        iconBackground="bg-[#BE6674]/10"
        variant="default"
        size="md"
        footer={
          <a
            href="mailto:administracio@inwine.cat?subject=Recuperaci%C3%B3%20de%20compte"
            className="flex w-full items-center justify-center rounded-lg bg-[#BE6674] hover:bg-[#741C28] px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            <Mail size={16} className="mr-2" />
            administracio@inwine.cat
          </a>
        }
      />

      {/* Modal de Selección de Rol para Registro */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title={t("auth.login.register_modal_title", "Crear una cuenta")}
        description={t("auth.login.register_modal_desc", "Selecciona el tipo de cuenta con el que deseas registrarte:")}
        icon={<UserPlus className="h-8 w-8 text-[#BE6674]" />}
        iconBackground="bg-[#BE6674]/10"
        variant="default"
        size="md"
        footer={null}
      >
        <div className="px-2">
          {isRegisterModalOpen && (
            <RoleSelector
              roles={["seller", "restaurant", "investor"]}
              onSelect={handleRegisterRoleSelect}
            />
          )}
        </div>
      </Modal>
    </>
  )
}

export default LoginForm
