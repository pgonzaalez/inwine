"use client"

import { useState } from "react"

export default function RoleManagement({ userRoles, onAddRole, primaryColors }) {
  const [isLoading, setIsLoading] = useState(null)

  const handleAddRole = (role) => {
    setIsLoading(role)

    // Simular llamada a API
    setTimeout(() => {
      onAddRole(role)
      setIsLoading(null)
    }, 1000)
  }

  const roles = [
    {
      id: "restaurant",
      name: "Restaurante",
      description: "Gestiona tu restaurante, recibe pedidos y más",
      icon: "🍽️",
    },
    {
      id: "investor",
      name: "Inversor",
      description: "Invierte en proyectos y gestiona tus inversiones",
      icon: "💼",
    },
    {
      id: "seller",
      name: "Vendedor",
      description: "Vende productos y servicios en la plataforma",
      icon: "🛒",
    },
  ]

  return (
    <div className="grid gap-4">
      {roles.map((role) => (
        <div key={role.id} className="border border-gray-200 rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">{role.icon}</div>
            {userRoles.includes(role.id) && (
              <span
                className="px-2 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: primaryColors.dark }}
              >
                Activo
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold mb-1" style={{ color: primaryColors.dark }}>
            {role.name}
          </h3>
          <p className="text-sm text-gray-500 mb-4">{role.description}</p>
          <div className="mt-auto">
            {userRoles.includes(role.id) ? (
              <button
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                disabled
              >
                Rol activo
              </button>
            ) : (
              <button
                className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${
                  isLoading === role.id ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                }`}
                style={{
                  background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                }}
                onClick={() => handleAddRole(role.id)}
                disabled={isLoading === role.id}
              >
                {isLoading === role.id ? "Añadiendo..." : "Añadir rol"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

