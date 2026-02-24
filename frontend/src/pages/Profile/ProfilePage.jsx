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
    if (user && user.roles) {
      setUserRoles(user.roles)
    }
  }, [user]);

  // Función para añadir un rol
  const addRole = (role) => {
    if (!userRoles.includes(role)) {
      setUserRoles([...userRoles, role]);
    }
  };

  // Función para manejar cuando se añade un nuevo rol
  const handleRoleAdded = (role) => {
    // Redirigir a la pestaña del nuevo rol
    setActiveTab(role);
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
              El Meu Perfil
            </h1>
            <p className="text-gray-500">
              Gestiona la teva informació personal i rols en la plataforma
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
                  Restaurant
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
                  Productor
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
                      Informació Personal
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Actualitza les teves dades personals i credencials
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
                      Gestió de Rols
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Afegeix rols adicionals al teu compte
                    </p>
                  </div>
                  <RoleManagement
                    userRoles={userRoles}
                    onAddRole={addRole}
                    onRoleAdded={handleRoleAdded}
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
                  Dades de Restaurant
                </h2>
                <p className="text-gray-500 text-sm">
                  Gestiona la informació del teu restaurant
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
                  Dades d'Inversor
                </h2>
                <p className="text-gray-500 text-sm">
                  Gestiona la informació del teu perfil d'inversor
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
                  Dades de Productor
                </h2>
                <p className="text-gray-500 text-sm">
                  Gestiona la informació del teu perfil de productor
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
