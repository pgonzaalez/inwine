import { useState, useEffect } from "react";
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
  Utensils,
  MapPin,
  MessageSquareText,
  Users,
  TimerReset,
  Hash,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "@/utils/utils";

import { useTranslation } from "react-i18next";

const AddRestaurantForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    NIF: "",
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    name_contact: "",
    credit_card: "",
    balance: "",
    business_name: "",
    province: "",
    description: "",
    number_of_diners: "",
    wine_rotation: "",
    reference_number: "",
    workdays_per_week: "",
    services: [],
  });

  const [errors, setErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'error' o 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Validación del formulario en el lado del cliente
  const validateForm = () => {
    const newErrors = {};

    // Validar NIF (formato español: 8 dígitos y una letra)
    if (formData.NIF && !/^[0-9]{8}[A-Z]$/.test(formData.NIF)) {
      newErrors.NIF = [
        "El NIF debe tener 8 dígitos seguidos de una letra mayúscula",
      ];
    }

    // Validar email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = ["El formato del correo electrónico no es válido"];
    }

    // Validar contraseña (mínimo 8 caracteres, al menos una letra y un número)
    if (
      formData.password &&
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)
    ) {
      newErrors.password = [
        "La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número",
      ];
    }

    // Validar teléfono (formato español)
    if (formData.phone && !/^[6-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = [
        "El número de teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9",
      ];
    }

    // Validar nombre de negocio
    if (!formData.business_name || formData.business_name.length < 5) {
      newErrors.business_name = ["El nom ha de tenir al menys 5 caràcters"];
    }

    // Validar zona
    if (!formData.province || formData.province.length < 3) {
      newErrors.province = ["El la zona ha de tenir al menys 3 caràcters"];
    }

    // Validar descripción
    if (
      !formData.description ||
      formData.description.length < 20 ||
      formData.description.length > 100
    ) {
      newErrors.description = [
        "La descripció ha de tenir al menys 20 i no més de 100 caràcters",
      ];
    }

    // Validar descripción
    if (
      !formData.wine_rotation ||
      formData.wine_rotation.length < 4 ||
      formData.wine_rotation.length > 20
    ) {
      newErrors.wine_rotation = [
        "Ha de tenir al menys 4 i no més de 20 caràcters",
      ];
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar en tiempo real cuando cambian los campos
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const handleServiceChange = (service) => {
    const current = formData.services;
    const updated = current.includes(service)
      ? current.filter((s) => s !== service)
      : [...current, service];
    setFormData({ ...formData, services: updated });
    setTouched({ ...touched, services: true });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleImageSelect = (e) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    const preview = URL.createObjectURL(file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    // handleChange({ target: { name: "image", value: file }})
    setSelectedImage({ file, preview });
    setImagePreview(preview);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    // handleChange({ target: { name: "image", value: null }})
    setSelectedImage(null);
    setImagePreview("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageSelect({ target: { files: e.dataTransfer.files } });
      e.dataTransfer.clearData();
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || t("auth.login.error_generic"));
      }

      setCookie("token", result.token, 7);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    // Marcar todos los campos como tocados para mostrar todos los errores
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validar formulario antes de enviar
    if (!validateForm()) {
      setMessage(t("auth.register.error_validation"));
      setMessageType("error");
      return;
    }

    setIsLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("_method", "PUT");

      Object.keys(formData).forEach((key) => {
        if (key === "image" || key === "services") return;
        formDataObj.append(key, formData[key]);
      });

      formData.services.forEach((service) => {
        formDataObj.append("services[]", service);
      });

      if (selectedImage) {
        formDataObj.append("image", selectedImage.file);
      }

      const response = await fetch(`${apiUrl}/v1/restaurant`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formDataObj,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(data.errors || {});
          setMessage(t("auth.register.error_validation"));
          setMessageType("error");
        } else if (response.status === 409) {
          setMessage(t("auth.register.error_conflict"));
          setMessageType("error");
        } else if (response.status === 403) {
          setMessage(t("auth.register.error_forbidden"));
          setMessageType("error");
        } else {
          throw new Error(data.message || t("auth.register.error_generic"));
        }
      } else {
        setMessage(t("auth.register.success_restaurant"));
        setMessageType("success");

        //Realizar login una vez registrado
        await handleLogin(formData.email, formData.password);

        setFormData({
          NIF: "",
          name: "",
          email: "",
          password: "",
          address: "",
          phone: "",
          name_contact: "",
          credit_card: "",
          balance: "",
          business_name: "",
          province: "",
          description: "",
          number_of_diners: "",
          wine_rotation: "",
          reference_number: "",
          workdays_per_week: "",
          services: [],
        });
        setSelectedImage(null);
        setImagePreview("");
        setErrors({});
        setFormErrors({});

        setTimeout(() => {
          navigate("/restaurant/dashboard");
        }, 2000);
      }
    } catch (error) {
      setMessage(`Error: ${error.message || t("auth.register.error_generic")}`);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const dismissMessage = () => {
    setMessage("");
    setMessageType("");
  };

  // Combinar errores del servidor y del cliente
  const getFieldErrors = (fieldName) => {
    const serverErrors = errors[fieldName] || [];
    const clientErrors = formErrors[fieldName] || [];
    return [...serverErrors, ...clientErrors];
  };

  const hasError = (fieldName) => {
    return touched[fieldName] && getFieldErrors(fieldName).length > 0;
  };

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
              <h1 className="text-2xl font-bold text-center w-full">
                {t("auth.register.restaurant_title")}
              </h1>
            </div>
            <h4 className="text-gray-600 text-center">
              {t("auth.register.have_account")}{" "}
              <a href="/login" className="text-[#741C28]">
                {t("auth.register.login_link")}
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
                <button
                  onClick={dismissMessage}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  {t("auth.register.personal_info")}
                </h2>
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
                          hasError("name")
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
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
                        {t("auth.register.labels.name")}
                      </label>
                    </div>
                  </div>
                  <div className="h-6">
                    {hasError("name") && (
                      <span className="text-red-500 text-xs mt-1">
                        {getFieldErrors("name")[0]}
                      </span>
                    )}
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
                          hasError("NIF")
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
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
                        {t("auth.register.labels.nif")}
                      </label>
                    </div>
                  </div>
                  <div className="h-6">
                    {hasError("NIF") && (
                      <span className="text-red-500 text-xs mt-1">
                        {getFieldErrors("NIF")[0]}
                      </span>
                    )}
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
                        {t("auth.register.labels.address")}
                      </label>
                    </div>
                  </div>
                  <div className="h-6">
                    {hasError("address") && (
                      <span className="text-red-500 text-xs mt-1">
                        {getFieldErrors("address")[0]}
                      </span>
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
                        {t("auth.register.labels.phone")}
                      </label>
                    </div>
                  </div>
                  <div className="h-6">
                    {hasError("phone") && (
                      <span className="text-red-500 text-xs mt-1">
                        {getFieldErrors("phone")[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">
                  {t("auth.register.login_info")}
                </h2>
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
                        {t("auth.register.labels.email")}
                      </label>
                    </div>
                  </div>
                  <div className="h-6">
                    {hasError("email") && (
                      <span className="text-red-500 text-xs mt-1">
                        {getFieldErrors("email")[0]}
                      </span>
                    )}
                  </div>

                  {/* Contraseña */}
                  <div className="relative">
                    <div className="flex items-center">
                      <Lock
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          hasError("password")
                            ? "text-red-500"
                            : "text-gray-400"
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
                          hasError("password")
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {t("auth.register.labels.password")}
                      </label>
                    </div>
                  </div>
                  <div className="h-6">
                    {hasError("password") && (
                      <span className="text-red-500 text-xs mt-1">
                        {getFieldErrors("password")[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">
                {t("auth.register.bank_info")}
              </h2>
              <div className="space-y-2">
                {/* Nom de contacto */}
                <div className="relative">
                  <div className="flex items-center">
                    <BookUser
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        hasError("name_contact")
                          ? "text-red-500"
                          : "text-gray-400"
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
                        hasError("name_contact")
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {t("auth.register.labels.contact_person")}
                    </label>
                  </div>
                </div>
                <div className="h-6">
                  {hasError("name_contact") && (
                    <span className="text-red-500 text-xs mt-1">
                      {getFieldErrors("name_contact")[0]}
                    </span>
                  )}
                </div>

                {/* Tarjeta de crédito */}
                <div className="relative">
                  <div className="flex items-center">
                    <Landmark
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        hasError("credit_card")
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      name="credit_card"
                      value={formData.credit_card}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                        hasError("credit_card")
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder=" "
                      id="credit_card"
                    />
                    <label
                      htmlFor="credit_card"
                      className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                        hasError("credit_card")
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {t("auth.register.labels.credit_card")}
                    </label>
                  </div>
                </div>
                <div className="h-6">
                  {hasError("credit_card") && (
                    <span className="text-red-500 text-xs mt-1">
                      {getFieldErrors("credit_card")[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">
                {t("auth.register.restaurant_info")}
              </h2>
              <div className="space-y-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {/* Nombre del Restaurante */}
                    <div className="relative">
                      <div className="flex items-center">
                        <Utensils
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                            hasError("business_name")
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type="text"
                          name="business_name"
                          value={formData.business_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                            hasError("business_name")
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                          placeholder=" "
                          id="business_name"
                        />
                        <label
                          htmlFor="business_name"
                          className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                            hasError("business_name")
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {t("auth.register.labels.restaurant_name")}
                        </label>
                      </div>
                    </div>
                    <div className="h-6">
                      {hasError("business_name") && (
                        <span className="text-red-500 text-xs mt-1">
                          {getFieldErrors("business_name")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {/* Zona */}
                    <div className="relative">
                      <div className="flex items-center">
                        <MapPin
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                            hasError("province")
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type="text"
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                            hasError("province")
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                          placeholder=" "
                          id="province"
                        />
                        <label
                          htmlFor="province"
                          className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                            hasError("province")
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {t("auth.register.labels.restaurant_zone")}
                        </label>
                      </div>
                    </div>
                    <div className="h-6">
                      {hasError("province") && (
                        <span className="text-red-500 text-xs mt-1">
                          {getFieldErrors("province")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="relative">
                  <div className="flex items-center">
                    <MessageSquareText
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        hasError("description")
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                        hasError("description")
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder=" "
                      id="description"
                    />
                    <label
                      htmlFor="description"
                      className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                        hasError("description")
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {t("auth.register.labels.restaurant_description")}
                    </label>
                  </div>
                </div>
                <div className="h-6">
                  {hasError("description") && (
                    <span className="text-red-500 text-xs mt-1">
                      {getFieldErrors("description")[0]}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {/* Número de Comensales */}
                    <div className="relative">
                      <div className="flex items-center">
                        <Users
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                            hasError("number_of_diners")
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          name="number_of_diners"
                          value={formData.number_of_diners}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                            hasError("number_of_diners")
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                          placeholder=" "
                          id="number_of_diners"
                          required
                        />
                        <label
                          htmlFor="number_of_diners"
                          className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                            hasError("number_of_diners")
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {t("auth.register.labels.restaurant_diners")}
                        </label>
                      </div>
                    </div>
                    <div className="h-6">
                      {hasError("number_of_diners") && (
                        <span className="text-red-500 text-xs mt-1">
                          {getFieldErrors("number_of_diners")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {/* Turnos */}
                    <div className="relative">
                      <div className="flex items-center">
                        <CalendarClock
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                            hasError("shifts")
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                        <select
                          name="shifts"
                          value={formData.shifts}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          id="shifts"
                          required
                          className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 focus:outline-none focus:ring-2 appearance-none ${
                            hasError("shifts")
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                        >
                          <option value="unknown">
                            {t(`dashboards.restaurant.status.unknown`)}
                          </option>
                          <option value="mond_to_sund_lunch">
                            {t(
                              `dashboards.restaurant.shifts.mond_to_sund_lunch`,
                            )}
                          </option>
                          <option value="mond_to_sund_dinner">
                            {t(
                              `dashboards.restaurant.shifts.mond_to_sund_dinner`,
                            )}
                          </option>
                          <option value="mond_to_sund_lunch_and_dinner">
                            {t(
                              `dashboards.restaurant.shifts.mond_to_sund_lunch_and_dinner`,
                            )}
                          </option>
                          <option value="tues_to_sund_lunch">
                            {t(
                              `dashboards.restaurant.shifts.tues_to_sund_lunch`,
                            )}
                          </option>
                          <option value="tues_to_sund_dinner">
                            {t(
                              `dashboards.restaurant.shifts.tues_to_sund_dinner`,
                            )}
                          </option>
                          <option value="tues_to_sund_lunch_and_dinner">
                            {t(
                              `dashboards.restaurant.shifts.tues_to_sund_lunch_and_dinner`,
                            )}
                          </option>
                          <option value="frid_to_sund_lunch">
                            {t(
                              `dashboards.restaurant.shifts.frid_to_sund_lunch`,
                            )}
                          </option>
                          <option value="frid_to_sund_dinner">
                            {t(
                              `dashboards.restaurant.shifts.frid_to_sund_dinner`,
                            )}
                          </option>
                          <option value="frid_to_sund_lunch_and_dinner">
                            {t(
                              `dashboards.restaurant.shifts.frid_to_sund_lunch_and_dinner`,
                            )}
                          </option>
                          <option value="satu_and_sund_lunch">
                            {t(
                              `dashboards.restaurant.shifts.satu_and_sund_lunch`,
                            )}
                          </option>
                          <option value="satu_and_sund_dinner">
                            {t(
                              `dashboards.restaurant.shifts.satu_and_sund_dinner`,
                            )}
                          </option>
                          <option value="satu_and_sund_lunch_and_dinner">
                            {t(
                              `dashboards.restaurant.shifts.satu_and_sund_lunch_and_dinner`,
                            )}
                          </option>
                        </select>
                        <label
                          htmlFor="shifts"
                          className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                            hasError("shifts")
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {t("auth.register.labels.restaurant_shifts")}
                        </label>
                      </div>
                    </div>
                    <div className="h-6">
                      {hasError("shifts") && (
                        <span className="text-red-500 text-xs mt-1">
                          {getFieldErrors("shifts")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {/* Número de Comensales */}
                    <div className="relative">
                      <div className="flex items-center">
                        <Wine
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                            hasError("reference_number")
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          name="reference_number"
                          value={formData.reference_number}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                            hasError("reference_number")
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                          placeholder=" "
                          id="reference_number"
                          required
                        />
                        <label
                          htmlFor="reference_number"
                          className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                            hasError("reference_number")
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {t("auth.register.labels.restaurant_wines")}
                        </label>
                      </div>
                    </div>
                    <div className="h-6">
                      {hasError("reference_number") && (
                        <span className="text-red-500 text-xs mt-1">
                          {getFieldErrors("reference_number")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {/* Rotación de Vinos */}
                    <div className="relative">
                      <div className="flex items-center">
                        <TimerReset
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                            hasError("wine_rotation")
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type="text"
                          name="wine_rotation"
                          value={formData.wine_rotation}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${
                            hasError("wine_rotation")
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                          placeholder=" "
                          id="wine_rotation"
                        />
                        <label
                          htmlFor="wine_rotation"
                          className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${
                            hasError("wine_rotation")
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {t("auth.register.labels.restaurant_rotation")}
                        </label>
                      </div>
                    </div>
                    <div className="h-6">
                      {hasError("wine_rotation") && (
                        <span className="text-red-500 text-xs mt-1">
                          {getFieldErrors("wine_rotation")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                  <div>
                    {/* Número de referencia */}
                    <div className="relative">
                      <div className="flex items-center">
                        <Hash
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${hasError("reference_number") ? "text-red-500" : "text-gray-400"}`}
                        />
                        <input
                          type="text"
                          name="reference_number"
                          value={formData.reference_number}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${hasError("reference_number") ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                          placeholder=" "
                          id="reference_number"
                        />
                        <label
                          htmlFor="reference_number"
                          className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${hasError("reference_number") ? "text-red-500" : "text-gray-500"}`}
                        >
                          {t("auth.register.labels.restaurant_reference")}
                        </label>
                      </div>
                    </div>
                    <div className="h-6">
                      {hasError("reference_number") && (
                        <span className="text-red-500 text-xs mt-1">
                          {getFieldErrors("reference_number")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {/* Días laborables por semana */}
                    <div className="relative">
                      <div className="flex items-center">
                        <CalendarDays
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${hasError("workdays_per_week") ? "text-red-500" : "text-gray-400"}`}
                        />
                        <input
                          type="number"
                          min="1"
                          max="7"
                          name="workdays_per_week"
                          value={formData.workdays_per_week}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`peer w-full h-12 bg-white rounded-lg border pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 ${hasError("workdays_per_week") ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                          placeholder=" "
                          id="workdays_per_week"
                        />
                        <label
                          htmlFor="workdays_per_week"
                          className={`absolute left-10 top-2 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 ${hasError("workdays_per_week") ? "text-red-500" : "text-gray-500"}`}
                        >
                          {t("auth.register.labels.restaurant_workdays")}
                        </label>
                      </div>
                    </div>
                    <div className="h-6">
                      {hasError("workdays_per_week") && (
                        <span className="text-red-500 text-xs mt-1">
                          {getFieldErrors("workdays_per_week")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Servicios ofrecidos */}
                <div className="mt-1">
                  <p
                    className={`text-sm font-medium mb-2 ${hasError("services") ? "text-red-500" : "text-gray-700"}`}
                  >
                    {t("auth.register.labels.restaurant_services")}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {["breakfast", "lunch", "dinner"].map((service) => (
                      <label
                        key={service}
                        className="flex items-center gap-2 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceChange(service)}
                          className="w-4 h-4 rounded border-gray-300 text-[#9A3E50] focus:ring-[#9A3E50]"
                        />
                        <span
                          className={`text-sm ${hasError("services") ? "text-red-500" : "text-gray-700"}`}
                        >
                          {t(`auth.register.labels.service_${service}`)}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="h-6">
                    {hasError("services") && (
                      <span className="text-red-500 text-xs mt-1">
                        {getFieldErrors("services")[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("auth.register.labels.restaurant_image")}
                </label>
                {!imagePreview && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mt-1 flex justify-center px-12 pt-10 pb-12 border-2 border-dashed rounded-lg transition-colors ${
                      hasError("image")
                        ? "border-red-300 bg-red-50"
                        : isDragging
                          ? "border-[#8C2E2E] bg-[#F5E6E8]"
                          : "border-gray-300 hover:border-[#D9A5AD]"
                    }`}
                  >
                    <div className="space-y-1 text-center">
                      <svg
                        className={`mx-auto h-12 w-12 ${hasError("image") ? "text-red-400" : "text-gray-400"}`}
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className={`relative cursor-pointer bg-transparent rounded-md font-medium focus-within:outline-none ${
                            hasError("image")
                              ? "text-red-500 hover:text-red-400"
                              : "text-[#9A3E50] hover:text-[#C27D7D]"
                          }`}
                        >
                          <span>
                            {t(
                              "dashboards.seller.product.field_image_upload_single",
                            )}
                          </span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageSelect}
                          />
                        </label>
                        <p className="pl-1">
                          {t("dashboards.seller.product.field_image_drag")}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {t("dashboards.seller.product.field_image_types")}
                      </p>
                    </div>
                  </div>
                )}
                {imagePreview && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative group h-48 sm:h-56">
                        <img
                          src={imagePreview}
                          alt="Restaurant preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="sr-only">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {hasError("image") && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.image}
                  </span>
                )}
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
                  {t("auth.register.loading")}
                </>
              ) : (
                t("auth.register.submit_restaurant")
              )}
            </button>
          </form>
        </div>
        <div className="w-full md:w-1/2 md:pl-8 mt-8 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1602594905755-1cead51600f4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Imagen lateral"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default AddRestaurantForm;
