// src/components/RoleSelector.jsx
import { useState } from "react"
import { ShoppingBag, Utensils, TrendingUp, User } from "lucide-react"

const RoleSelector = ({ roles = [], onSelect }) => {
  const [selectedRole, setSelectedRole] = useState(null)

  const handleContinue = () => {
    if (selectedRole) {
      onSelect(selectedRole)
    }
  }

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

  return (
    <div className=" flex items-center justify-center p-4">
      <div>
        <div className="grid gap-4">
          {roles.map((role, index) => {
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
            onClick={handleContinue}
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

export default RoleSelector
