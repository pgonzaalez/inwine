import { Link, useLocation } from "react-router-dom"
import { BookmarkPlus, ShoppingCart, Bell, LogOut, User, Home, Settings, Wine } from "lucide-react"
import { useFetchUser } from "@components/auth/FetchUser"
import {getCookie, deleteCookie} from "@/utils/utils"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
}

export default function Sidebar() {
  const location = useLocation()
  const apiUrl = import.meta.env.VITE_API_URL
  const { user, loading, error } = useFetchUser()

  const logout = async () => {
    const token = getCookie("token")
    if (!token) {
      console.log("No hay token de autenticación")
      return
    }

    try {
      const response = await fetch(`${apiUrl}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        deleteCookie("token");
        window.location.href = "/"
      } else {
        console.log("Error al hacer logout")
      }
    } catch (error) {
      console.error("Error en la solicitud de logout:", error)
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: primaryColors.light }}
        ></div>
      </div>
    )

  if (error)
    return (
      <div className="p-4" style={{ color: primaryColors.dark }}>
        {error}
      </div>
    )

  const navItems = [
    {
      icon: Home,
      label: "Inici",
      path: `/seller/${user?.id || "usuari"}/dashboard`,
    },
    {
      icon: BookmarkPlus,
      label: "Pujar Producte",
      path: "/create",
    },
    {
      icon: ShoppingCart,
      label: "Productes",
      path: `/seller/${user?.id || "usuari"}/products`,
    },
    {
      icon: Wine,
      label: "Gestió de Vins",
      path: `/seller/${user?.id || "usuari"}/wine-management`,
    },
    {
      icon: Bell,
      label: "Notificacions",
      path: `/seller/${user?.id || "usuari"}/notificacions`,
    },
    {
      icon: User,
      label: "Perfil",
      path: `/seller/${user?.id || "usuari"}`,
      divider: true,
    },
    {
      icon: Settings,
      label: "Configuració",
      path: `/seller/${user?.id || "usuari"}/settings`,
    },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed top-0 left-0 h-screen w-64 flex-col bg-white shadow-sm z-40 transition-all duration-300"
        style={{
          backgroundColor: "white",
          borderRight: `1px solid ${primaryColors.light}`,
        }}
      >
        {/* User profile section */}
        <div className="p-6 border-b" style={{ borderColor: primaryColors.light }}>
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})` }}
            >
              <User size={18} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user ? user.name : "Usuari Desconegut"}</p>
              <p className="text-sm text-gray-500">{user?.email || "email@example.com"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <div key={index}>
              {item.divider && <div className="my-4 border-t mx-2" style={{ borderColor: primaryColors.light }}></div>}
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path) ? "font-medium text-white" : "text-gray-700 hover:bg-gray-50"
                }`}
                style={
                  isActive(item.path)
                    ? { background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})` }
                    : {}
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            </div>
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t" style={{ borderColor: primaryColors.light }}>
          <button
            onClick={logout}
            className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Tancar sessió</span>
          </button>
        </div>
      </aside>

      {/* Mobile navigation bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 shadow-lg flex justify-around z-10 py-2"
        style={{
          backgroundColor: "white",
          borderTop: `1px solid ${primaryColors.light}`,
        }}
      >
        <Link
          to={`/seller/${user?.id || "usuari"}/dashboard`}
          className={`flex flex-col items-center p-2 rounded-lg ${
            location.pathname === `/seller/${user?.id}` ? "text-white" : "text-gray-600"
          }`}
          style={
            location.pathname === `/seller/${user?.id}`
              ? { background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})` }
              : {}
          }
        >
          <Home size={20} />
          <span className="text-xs mt-1">Inici</span>
        </Link>

        <Link
          to="/create"
          className={`flex flex-col items-center p-2 rounded-lg ${
            location.pathname === "/create" ? "text-white" : "text-gray-600"
          }`}
          style={
            location.pathname === "/create"
              ? { background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})` }
              : {}
          }
        >
          <BookmarkPlus size={20} />
          <span className="text-xs mt-1">Pujar</span>
        </Link>

        <Link
          to={`/seller/${user?.id || "usuari"}/products`}
          className={`flex flex-col items-center p-2 rounded-lg ${
            location.pathname === `/seller/${user?.id}/products` ? "text-white" : "text-gray-600"
          }`}
          style={
            location.pathname === `/seller/${user?.id}/products`
              ? { background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})` }
              : {}
          }
        >
          <ShoppingCart size={20} />
          <span className="text-xs mt-1">Productes</span>
        </Link>

        <Link
          to={`/seller/${user?.id || "usuari"}/notificacions`}
          className={`flex flex-col items-center p-2 rounded-lg ${
            location.pathname === `/seller/${user?.id}/notificacions` ? "text-white" : "text-gray-600"
          }`}
          style={
            location.pathname === `/seller/${user?.id}/notificacions`
              ? { background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})` }
              : {}
          }
        >
          <Bell size={20} />
          <span className="text-xs mt-1">Alertes</span>
        </Link>
      </nav>
    </>
  )
}

