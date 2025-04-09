import { useState } from "react"

export default function RoleManagement({ userRoles, onAddRole, primaryColors, onRoleAdded }) {
  const [isLoading, setIsLoading] = useState(null)

  const handleAddRole = (role) => {
    setIsLoading(role)

    // Simular llamada a API
    setTimeout(() => {
      onAddRole(role)
      setIsLoading(null)
      if (onRoleAdded) {
        onRoleAdded(role)
      }
    }, 1000)
  }

  const roles = [
    {
      id: "restaurant",
      name: "Restaurant",
      description: "Gestiona els vis del teu restaurant, rep comandes i més",
      icon: "🍽️",
    },
    {
      id: "investor",
      name: "Inversor",
      description: "Inverteix en vi i gestiona les teves inversiones",
      icon: "💼",
    },
    {
      id: "seller",
      name: "Productor",
      description: "Ven els teus productes en la plataforma",
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
                Actiu
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
                Rol actiu
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
                {isLoading === role.id ? "Afegint..." : "Afegir rol"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

