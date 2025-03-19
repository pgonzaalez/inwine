"use client"

import { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X } from "lucide-react"

export default function ResponsiveModal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  iconColor = "blue",
  iconBackground = "bg-blue-50",
  children,
  footer,
  closeButton = true,
  size = "md",
  variant = "default", // default, danger, success, warning, info
  className = "",
  mobileFullScreen = false, // Si es true, en móvil ocupa toda la pantalla en lugar de ser un drawer
}) {
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Configurar colores según la variante
  const variantStyles = {
    default: {
      iconBg: iconBackground || "bg-blue-50",
      iconColor: iconColor || "text-blue-500",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
      ring: "ring-blue-500",
    },
    danger: {
      iconBg: iconBackground || "bg-red-50",
      iconColor: iconColor || "text-red-500",
      gradient: "from-red-500 to-red-600",
      hoverGradient: "from-red-600 to-red-700",
      ring: "ring-red-500",
    },
    success: {
      iconBg: iconBackground || "bg-green-50",
      iconColor: iconColor || "text-green-500",
      gradient: "from-green-500 to-green-600",
      hoverGradient: "from-green-600 to-green-700",
      ring: "ring-green-500",
    },
    warning: {
      iconBg: iconBackground || "bg-amber-50",
      iconColor: iconColor || "text-amber-500",
      gradient: "from-amber-500 to-amber-600",
      hoverGradient: "from-amber-600 to-amber-700",
      ring: "ring-amber-500",
    },
    info: {
      iconBg: iconBackground || "bg-indigo-50",
      iconColor: iconColor || "text-indigo-500",
      gradient: "from-indigo-500 to-indigo-600",
      hoverGradient: "from-indigo-600 to-indigo-700",
      ring: "ring-indigo-500",
    },
  }

  const styles = variantStyles[variant] || variantStyles.default

  // Determinar el ancho máximo basado en el tamaño
  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  }

  const maxWidthClass = sizeClasses[size] || sizeClasses.md

  // Versión móvil (drawer desde abajo o pantalla completa)
  if (isMobile) {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
          {/* Overlay de fondo con blur */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          {/* Panel deslizante desde abajo o pantalla completa */}
          <Transition.Child
            as={Fragment}
            enter={mobileFullScreen ? "ease-out duration-300" : "ease-out duration-300"}
            enterFrom={mobileFullScreen ? "opacity-0" : "opacity-0 translate-y-full"}
            enterTo={mobileFullScreen ? "opacity-100" : "opacity-100 translate-y-0"}
            leave={mobileFullScreen ? "ease-in duration-200" : "ease-in duration-200"}
            leaveFrom={mobileFullScreen ? "opacity-100" : "opacity-100 translate-y-0"}
            leaveTo={mobileFullScreen ? "opacity-0" : "opacity-0 translate-y-full"}
          >
            <div
              className={`fixed ${mobileFullScreen ? "inset-0 flex items-center justify-center p-4" : "inset-x-0 bottom-0"} z-10`}
            >
              <div
                className={`bg-white shadow-lg ${mobileFullScreen ? "w-full max-h-[90vh] overflow-y-auto rounded-2xl" : "w-full rounded-t-2xl"} ${className}`}
              >
                {/* Indicador de arrastre (solo para drawer) */}
                {!mobileFullScreen && <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-gray-300"></div>}

                {/* Cabecera */}
                <div className="relative px-4 pt-5 pb-4 sm:px-6">
                  {closeButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                      aria-label="Cerrar"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}

                  <div className="flex flex-col items-center sm:items-start">
                    {icon && (
                      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}>
                        {icon && <div className={styles.iconColor}>{icon}</div>}
                      </div>
                    )}

                    {title && (
                      <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900 text-center sm:text-left">
                        {title}
                      </Dialog.Title>
                    )}

                    {description && (
                      <div className="mt-1 text-sm text-gray-500 text-center sm:text-left">{description}</div>
                    )}
                  </div>
                </div>

                {/* Contenido */}
                {children && <div className="px-4 py-2 sm:px-6">{children}</div>}

                {/* Footer */}
                {footer && <div className="px-4 py-4 sm:px-6">{footer}</div>}

                {/* Espacio para notch/home indicator en iOS (solo para drawer) */}
                {!mobileFullScreen && <div className="h-6 w-full bg-white"></div>}
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    )
  }

  // Versión desktop (modal centrado)
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          {/* Overlay de fondo con blur */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          {/* Este elemento es para centrar el modal verticalmente */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          {/* Contenido del diálogo */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={`inline-block w-full ${maxWidthClass} overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl ${className}`}
            >
              <div className="relative">
                {/* Cabecera */}
                <div className="px-6 pt-6 pb-4">
                  {closeButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                      aria-label="Cerrar"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}

                  <div className="flex flex-col items-center sm:items-start">
                    {icon && (
                      <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${styles.iconBg}`}>
                        {icon && <div className={styles.iconColor}>{icon}</div>}
                      </div>
                    )}

                    {title && (
                      <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900 text-center sm:text-left">
                        {title}
                      </Dialog.Title>
                    )}

                    {description && <div className="mt-2 text-gray-500 text-center sm:text-left">{description}</div>}
                  </div>
                </div>

                {/* Línea separadora con gradiente (solo si hay título o descripción) */}
                {(title || description) && (
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                )}

                {/* Contenido */}
                {children && <div className="px-6 py-4">{children}</div>}

                {/* Footer */}
                {footer && <div className="px-6 py-4">{footer}</div>}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

