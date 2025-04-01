"use client";

import { useState, useEffect } from "react";
import UserProfileForm from "@/components/profile/UserProfileForm";
import RoleManagement from "@/components/profile/RoleManagment";
import RestaurantForm from "@/components/profile/RestaurantForm";
import InvestorForm from "@/components/profile/InvestorForm";
import SellerForm from "@/components/profile/SellerForm";
import { useFetchUser } from "@/components/auth/FetchUser";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userRoles, setUserRoles] = useState([]);
  const { user, loading } = useFetchUser();

  // Colores primarios para mantener consistencia con el sidebar
  const primaryColors = {
    dark: "#9A3E50",
    light: "#C27D7D",
    background: "#F9F9F9",
  };

  // Efecto para cargar los roles del usuario cuando se obtienen los datos
  useEffect(() => {
    if (user && user.role) {
      // Asumiendo que el usuario ya tiene un rol asignado
      setUserRoles([user.role]);
    }
  }, [user]);

  // Función para añadir un rol
  const addRole = (role) => {
    if (!userRoles.includes(role)) {
      setUserRoles([...userRoles, role]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex flex-1">
          <div
            className="flex-1 md:ml-64 p-8 overflow-y-auto pb-16"
            style={{ backgroundColor: primaryColors.background }}
          >
            <div className="flex items-center justify-center h-64">
              <div
                className="w-12 h-12 rounded-full animate-spin"
                style={{
                  borderWidth: "4px",
                  borderStyle: "solid",
                  borderColor: primaryColors.light,
                  borderTopColor: primaryColors.dark,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <div
          className="flex-1 md:ml-64 p-8 overflow-y-auto pb-16"
          style={{ backgroundColor: primaryColors.background }}
        >
          <div className="mb-6 p-6 bg-white rounded-xl shadow-sm">
            <h1
              className="text-2xl font-bold"
              style={{ color: primaryColors.dark }}
            >
              Mi Perfil
            </h1>
            <p className="text-gray-500">
              Gestiona tu información personal y roles en la plataforma
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeTab === "profile"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={
                  activeTab === "profile"
                    ? {
                        background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                      }
                    : {}
                }
              >
                Perfil
              </button>

              {userRoles.includes("restaurant") && (
                <button
                  onClick={() => setActiveTab("restaurant")}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    activeTab === "restaurant"
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={
                    activeTab === "restaurant"
                      ? {
                          background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
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
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    activeTab === "investor"
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={
                    activeTab === "investor"
                      ? {
                          background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
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
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    activeTab === "seller"
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={
                    activeTab === "seller"
                      ? {
                          background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})`,
                        }
                      : {}
                  }
                >
                  Vendedor
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="mb-4">
                    <h2
                      className="text-xl font-bold"
                      style={{ color: primaryColors.dark }}
                    >
                      Información Personal
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Actualiza tus datos personales y credenciales
                    </p>
                  </div>
                  <UserProfileForm primaryColors={primaryColors} />
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="mb-4">
                    <h2
                      className="text-xl font-bold"
                      style={{ color: primaryColors.dark }}
                    >
                      Gestión de Roles
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Añade roles adicionales a tu cuenta
                    </p>
                  </div>
                  <RoleManagement
                    userRoles={userRoles}
                    onAddRole={addRole}
                    primaryColors={primaryColors}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "restaurant" && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="mb-4">
                <h2
                  className="text-xl font-bold"
                  style={{ color: primaryColors.dark }}
                >
                  Datos de Restaurante
                </h2>
                <p className="text-gray-500 text-sm">
                  Gestiona la información de tu restaurante
                </p>
              </div>
              <RestaurantForm primaryColors={primaryColors} />
            </div>
          )}

          {activeTab === "investor" && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="mb-4">
                <h2
                  className="text-xl font-bold"
                  style={{ color: primaryColors.dark }}
                >
                  Datos de Inversor
                </h2>
                <p className="text-gray-500 text-sm">
                  Gestiona la información de tu perfil de inversor
                </p>
              </div>
              <InvestorForm primaryColors={primaryColors} />
            </div>
          )}

          {activeTab === "seller" && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="mb-4">
                <h2
                  className="text-xl font-bold"
                  style={{ color: primaryColors.dark }}
                >
                  Datos de Vendedor
                </h2>
                <p className="text-gray-500 text-sm">
                  Gestiona la información de tu perfil de vendedor
                </p>
              </div>
              <SellerForm primaryColors={primaryColors} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
