"use client"

import { Link, useLocation } from "react-router-dom"
import { LucideShoppingCart, BookmarkPlusIcon, Bell, LogOut, User } from "lucide-react"
import { useFetchUser } from "@components/FetchUser"

export default function Sidebar() {
  const location = useLocation()
  const apiUrl = import.meta.env.VITE_API_URL
  const { user, loading, error } = useFetchUser()

  const logout = async () => {
    const token = localStorage.getItem("token")
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
        localStorage.removeItem("token")
        window.location.href = "/"
      } else {
        console.log("Error al hacer logout")
      }
    } catch (error) {
      console.error("Error en la solicitud de logout:", error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <>
      {/* Sidebar solo para desktop */}
      <aside className="hidden md:block fixed top-[60px] left-0 h-[calc(100vh-60px)] w-64 bg-white shadow-lg z-40">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#800020] flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user ? user.name : "Usuari Desconegut"}</p>
                <p className="text-sm text-gray-500">{user?.email || "email@example.com"}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <Link
              to="/create"
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                location.pathname === "/create"
                  ? "bg-gray-100 text-[#800020] font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <BookmarkPlusIcon size={20} />
              <span>Pujar Producte</span>
            </Link>

            <Link
              to={`/seller/${user?.id || "usuari"}/products`}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                location.pathname === `/seller/${user?.id}/products`
                  ? "bg-gray-100 text-[#800020] font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <LucideShoppingCart size={20} />
              <span>Productes</span>
            </Link>

            <Link
              to={`/seller/${user?.id || "usuari"}/notificacions`}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                location.pathname === `/seller/${user?.id}/notificacions`
                  ? "bg-gray-100 text-[#800020] font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Bell size={20} />
              <span>Notificacions</span>
            </Link>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link
                to={`/seller/${user?.id || "usuari"}`}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  location.pathname === `/seller/${user?.id}`
                    ? "bg-gray-100 text-[#800020] font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <User size={20} />
                <span>Perfil</span>
              </Link>
            </div>
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 w-full"
            >
              <LogOut size={20} />
              <span>Tancar sessió</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Barra inferior para móviles - Enfoque principal en móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around p-3 z-10">
        <Link
          to="/create"
          className={`flex flex-col items-center p-2 ${
            location.pathname === "/create" ? "text-[#800020] font-medium" : "text-gray-600"
          }`}
        >
          <BookmarkPlusIcon size={20} />
          <span className="text-xs mt-1">Pujar</span>
        </Link>

        <Link
          to={`/seller/${user?.id || "usuari"}/products`}
          className={`flex flex-col items-center p-2 ${
            location.pathname === `/seller/${user?.id}/products` ? "text-[#800020] font-medium" : "text-gray-600"
          }`}
        >
          <LucideShoppingCart size={20} />
          <span className="text-xs mt-1">Productes</span>
        </Link>

        <Link
          to={`/seller/${user?.id || "usuari"}`}
          className={`flex flex-col items-center p-2 ${
            location.pathname === `/seller/${user?.id}` ? "text-[#800020] font-medium" : "text-gray-600"
          }`}
        >
          <User size={20} />
          <span className="text-xs mt-1">Perfil</span>
        </Link>

        <Link
          to={`/seller/${user?.id || "usuari"}/notificacions`}
          className={`flex flex-col items-center p-2 ${
            location.pathname === `/seller/${user?.id}/notificacions` ? "text-[#800020] font-medium" : "text-gray-600"
          }`}
        >
          <Bell size={20} />
          <span className="text-xs mt-1">Alertes</span>
        </Link>
      </nav>
    </>
  )
}

