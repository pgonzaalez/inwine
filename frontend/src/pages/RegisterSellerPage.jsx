import { useState, useEffect } from "react"
import {
  User,
  BadgeIcon as IdCard,
  Mail,
  Lock,
  Home,
  Phone,
  BookUser,
  Landmark,
  CornerDownLeft,
  AlertCircle,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const AddSellerForm = () => {
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  const [formData, setFormData] = useState({
    NIF: "",
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    name_contact: "",
    bank_account: "",
    balance: "",
  })

  const [errors, setErrors] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // 'error' o 'success'
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState({})

  // Validación del formulario en el lado del cliente
  const validateForm = () => {
    const newErrors = {}

    // Validar NIF (formato español: 8 dígitos y una letra)
    if (formData.NIF && !/^[0-9]{8}[A-Z]$/.test(formData.NIF)) {
      newErrors.NIF = ["El NIF debe tener 8 dígitos seguidos de una letra mayúscula"]
    }

    // Validar email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = ["El formato del correo electrónico no es válido"]
    }

    // Validar contraseña (mínimo 8 caracteres, al menos una letra y un número)
    if (formData.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
      newErrors.password = ["La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número"]
    }

    // Validar teléfono (formato español)
    if (formData.phone && !/^[6-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = ["El número de teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9"]
    }

    // Validar cuenta bancaria (IBAN español simplificado)
    if (formData.bank_account && !/^ES\d{22}$/.test(formData.bank_account)) {
      newErrors.bank_account = ["El número de cuenta debe tener formato IBAN español: ES seguido de 22 dígitos"]
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validar en tiempo real cuando cambian los campos
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm()
    }
  }, [formData, touched])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setTouched({ ...touched, [name]: true })
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched({ ...touched, [name]: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setMessageType("")

    // Marcar todos los campos como tocados para mostrar todos los errores
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)

    // Validar formulario antes de enviar
    if (!validateForm()) {
      setMessage("Por favor, corrige los errores en el formulario antes de continuar.")
      setMessageType("error")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${apiUrl}/v1/seller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(data.errors || {})
          setMessage("Hay errores de validación en el formulario. Revisa los campos.")
          setMessageType("error")
        } else if (response.status === 409) {
          setMessage("Ya existe un usuario con este email o NIF. Por favor, utiliza datos diferentes.")
          setMessageType("error")
        } else if (response.status === 403) {
          setMessage("No tienes permisos para realizar esta acción.")
          setMessageType("error")
        } else {
          throw new Error(data.message || "Error al crear el productor")
        }
      } else {
        setMessage("¡Productor registrado exitosamente! Redirigiendo...")
        setMessageType("success")
        setFormData({
          NIF: "",
          name: "",
          email: "",
          password: "",
          address: "",
          phone: "",
          name_contact: "",
          bank_account: "",
          balance: "",
        })
        setErrors({})
        setFormErrors({})

        setTimeout(() => {
          navigate("/")
        }, 2000)
      }
    } catch (error) {
      setMessage(
        `Error: ${error.message || "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde."}`,
      )
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const dismissMessage = () => {
    setMessage("")
    setMessageType("")
  }

  // Combinar errores del servidor y del cliente
  const getFieldErrors = (fieldName) => {
    const serverErrors = errors[fieldName] || []
    const clientErrors = formErrors[fieldName] || []
    return [...serverErrors, ...clientErrors]
  }

  const hasError = (fieldName) => {
    return touched[fieldName] && getFieldErrors(fieldName).length > 0
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl flex flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <div className="text-center mb-6">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => navigate(-1)}
                className="border-2 rounded-lg p-2 hover:bg-gray-200 transition-colors duration-200"
              >
                <CornerDownLeft size={20} className="cursor-pointer" />
              </button>
              <h1 className="text-2xl font-bold text-center w-full">Crear compte d'usuari productor</h1>
            </div>
            <h4 className="text-gray-600 text-center">
              Tens un compte?{" "}
              <a href="/login" className="text-[#741C28]">
                Inicia sessió
              </a>
            </h4>
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
                {messageType === "error" ? (
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                )}
                <div className="flex-1">{message}</div>
                <button onClick={dismissMessage} className="ml-2 text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold mb-4">Informació dades personals</h2>
                <div className="space-y-2">
                  {/* Nombre */}
                  <div className="relative">
                    <div className="flex items-center">
                      <User
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          hasError("name") ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                          hasError("name") ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                        }`}
                        placeholder=" "
                        id="name"
                        required
                      />
                      <label
                        htmlFor="name"
                        className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                          hasError("name") ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        Nom usuari
                      </label>
                    </div>
                  </div>
                  <div className="h-6">
                    {hasError("name") && <span className="text-red-500 text-xs mt-1">{getFieldErrors("name")[0]}</span>}
                  </div>

                  {/* NIF */}
                  <div className="relative">
                    <div className="flex items-center">
                      <IdCard
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          hasError("NIF") ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                      <input
                        type="text"
                        name="NIF"
                        value={formData.NIF}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                          hasError("NIF") ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                        }`}
                        placeholder=" "
                        id="NIF"
                        required
                      />
                      <label
                        htmlFor="NIF"
                        className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                          hasError("NIF") ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        NIF
                      </label>
                    </div>
                  </div>
                  <div className="h-6">
                    {hasError("NIF") && <span className="text-red-500 text-xs mt-1">{getFieldErrors("NIF")[0]}</span>}
                  </div>

                  {/* Dirección */}
                  <div className="relative">
                    <div className="flex items-center">
                      <Home
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          hasError("address") ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                          hasError("address")
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        placeholder=" "
                        id="address"
                      />
                      <label
                        htmlFor="address"
                        className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                          hasError("address") ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        Adreça
                      </label>
                    </div>
                  </div>
                  <div className="h-6">
                    {hasError("address") && (
                      <span className="text-red-500 text-xs mt-1">{getFieldErrors("address")[0]}</span>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="relative">
                    <div className="flex items-center">
                      <Phone
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          hasError("phone") ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                          hasError("phone")
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        placeholder=" "
                        id="phone"
                      />
                      <label
                        htmlFor="phone"
                        className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                          hasError("phone") ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        Telèfon contacte
                      </label>
                    </div>
                  </div>
                  <div className="h-6">
                    {hasError("phone") && (
                      <span className="text-red-500 text-xs mt-1">{getFieldErrors("phone")[0]}</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Informació inici de sessió</h2>
                <div className="space-y-2">
                  {/* Email */}
                  <div className="relative">
                    <div className="flex items-center">
                      <Mail
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          hasError("email") ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                          hasError("email")
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        placeholder=" "
                        id="email"
                        required
                      />
                      <label
                        htmlFor="email"
                        className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                          hasError("email") ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        Email
                      </label>
                    </div>
                  </div>
                  <div className="h-6">
                    {hasError("email") && (
                      <span className="text-red-500 text-xs mt-1">{getFieldErrors("email")[0]}</span>
                    )}
                  </div>

                  {/* Contraseña */}
                  <div className="relative">
                    <div className="flex items-center">
                      <Lock
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          hasError("password") ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                          hasError("password")
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        placeholder=" "
                        id="password"
                        required
                      />
                      <label
                        htmlFor="password"
                        className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                          hasError("password") ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        Contrasenya
                      </label>
                    </div>
                  </div>
                  <div className="h-6">
                    {hasError("password") && (
                      <span className="text-red-500 text-xs mt-1">{getFieldErrors("password")[0]}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Informació dades bancàries</h2>
              <div className="space-y-2">
                {/* Nom de contacto */}
                <div className="relative">
                  <div className="flex items-center">
                    <BookUser
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        hasError("name_contact") ? "text-red-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      name="name_contact"
                      value={formData.name_contact}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                        hasError("name_contact")
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder=" "
                      id="name_contact"
                    />
                    <label
                      htmlFor="name_contact"
                      className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                        hasError("name_contact") ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      Nom de contacte
                    </label>
                  </div>
                </div>
                <div className="h-6">
                  {hasError("name_contact") && (
                    <span className="text-red-500 text-xs mt-1">{getFieldErrors("name_contact")[0]}</span>
                  )}
                </div>

                {/* Cuenta bancaria */}
                <div className="relative">
                  <div className="flex items-center">
                    <Landmark
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        hasError("bank_account") ? "text-red-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      name="bank_account"
                      value={formData.bank_account}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                        hasError("bank_account")
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder=" "
                      id="bank_account"
                    />
                    <label
                      htmlFor="bank_account"
                      className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                        hasError("bank_account") ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      Número compte
                    </label>
                  </div>
                </div>
                <div className="h-6">
                  {hasError("bank_account") && (
                    <span className="text-red-500 text-xs mt-1">{getFieldErrors("bank_account")[0]}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#BE6674] text-white py-3 rounded-lg hover:bg-[#741C28] transition duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Agregar Productor"
              )}
            </button>
          </form>
        </div>
        <div className="w-full md:w-1/2 md:pl-8 mt-8 md:mt-0">
          <img
            src="https://media.istockphoto.com/id/1363666079/es/foto/el-propietario-de-la-bodega-y-experto-en-control-de-calidad-comprobando-la-calidad-del-vino-en.jpg?s=612x612&w=0&k=20&c=23hm_w9AIaUJsQyBZd0TmqkWAvk5iglIjZ7Pw_857_8="
            alt="Imagen lateral"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}

export default AddSellerForm

