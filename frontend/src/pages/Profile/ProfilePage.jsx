"use client"

import { useState, useEffect } from "react"
import UserProfileForm from "@/components/profile/UserProfileForm"
import RoleManagement from "@/components/profile/RoleManagment"
import RestaurantForm from "@/components/profile/RestaurantForm"
import InvestorForm from "@/components/profile/InvestorForm"
import SellerForm from "@/components/profile/SellerForm"
import { useFetchUser } from "@/components/auth/FetchUser"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [userRoles, setUserRoles] = useState([])
  const { user, loading } = useFetchUser()

  // Colores primarios para mantener consistencia con el sidebar
  const primaryColors = {
    dark: "#9A3E50",
    light: "#C27D7D",
  }

  // Efecto para cargar los roles del usuario cuando se obtienen los datos
  useEffect(() => {
    if (user && user.roles) {
      setUserRoles(user.roles)
    }
  }, [user])

  // Función para añadir un rol
  const addRole = (role) => {
    if (!userRoles.includes(role)) {
      setUserRoles([...userRoles, role])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: primaryColors.light }}
        ></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          Mi Perfil
        </h1>
        <p className="text-gray-500">Gestiona tu información personal y roles en la plataforma</p>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === "profile" ? "border-b-2 text-white" : "text-gray-500 hover:text-gray-700"
              }`}
            style={
              activeTab === "profile"
                ? {
                  background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                  borderColor: primaryColors.dark,
                }
                : {}
            }
          >
            Perfil
          </button>

          {userRoles.includes("restaurant") && (
            <button
              onClick={() => setActiveTab("restaurant")}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === "restaurant" ? "border-b-2 text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              style={
                activeTab === "restaurant"
                  ? {
                    background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                    borderColor: primaryColors.dark,
                  }
                  : {}
              }
            >
              Restaurante
            </button>
          )}

          {userRoles.includes("investor") && (
            <button
              onClick={() => setActiveTab("investor")}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === "investor" ? "border-b-2 text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              style={
                activeTab === "investor"
                  ? {
                    background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                    borderColor: primaryColors.dark,
                  }
                  : {}
              }
            >
              Inversor
            </button>
          )}

          {userRoles.includes("seller") && (
            <button
              onClick={() => setActiveTab("seller")}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === "seller" ? "border-b-2 text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              style={
                activeTab === "seller"
                  ? {
                    background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                    borderColor: primaryColors.dark,
                  }
                  : {}
              }
            >
              Vendedor
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
                    Información Personal
                  </h2>
                  <p className="text-gray-500 text-sm">Actualiza tus datos personales y credenciales</p>
                </div>
                <UserProfileForm primaryColors={primaryColors} />
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
                    Gestión de Roles
                  </h2>
                  <p className="text-gray-500 text-sm">Añade roles adicionales a tu cuenta</p>
                </div>
                <RoleManagement userRoles={userRoles} onAddRole={addRole} primaryColors={primaryColors} />
              </div>
            </div>
          )}

          {activeTab === "restaurant" && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
                  Datos de Restaurante
                </h2>
                <p className="text-gray-500 text-sm">Gestiona la información de tu restaurante</p>
              </div>
              <RestaurantForm primaryColors={primaryColors} />
            </div>
          )}

          {activeTab === "investor" && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
                  Datos de Inversor
                </h2>
                <p className="text-gray-500 text-sm">Gestiona la información de tu perfil de inversor</p>
              </div>
              <InvestorForm primaryColors={primaryColors} />
            </div>
          )}

          {activeTab === "seller" && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
                  Datos de Vendedor
                </h2>
                <p className="text-gray-500 text-sm">Gestiona la información de tu perfil de vendedor</p>
              </div>
              <SellerForm primaryColors={primaryColors} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}