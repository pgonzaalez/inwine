import React from "react";
import { Avatar, Divider } from "@heroui/react";
import { Link, useLocation } from "react-router-dom";
import {
  LucideShoppingCart,
  BookmarkPlusIcon,
  Bell,
  LogOut,
} from "lucide-react";
import { useFetchUser } from '@components/FetchApiUsersComponent'; // Importar el hook

export default function Sidebar() {
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { user, loading, error } = useFetchUser(); // Llamar al hook para obtener el usuario

  const logout = async () => {
    const token = localStorage.getItem('token');
    console.log(token); // Verifica el valor del token
    if (!token) {
      console.log("No hay token de autenticación");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Asegúrate de usar backticks
        },
      });

      if (response.ok) {
        // Si el logout es exitoso, puedes eliminar el token del localStorage
        localStorage.removeItem('token');
        window.location.href = "/";
      } else {
        console.log("Error al hacer logout");
      }
    } catch (error) {
      console.error("Error en la solicitud de logout:", error);
    }
  };

  if (loading) return <div>Loading...</div>; // Mientras carga, puedes mostrar un mensaje
  if (error) return <div>{error}</div>; // Si hay un error, lo mostramos

  return (
    <>
      {/* Barra lateral per a pantalles grans */}
      <section className="hidden md:flex flex-col w-[245px] h-screen fixed top-[100px] left-0 bg-white shadow-md p-4 overflow-y-auto">
        <Link to="/seller/123/" className="flex gap-3 items-center cursor-pointer">
          <Avatar className="w-[40px] h-[40px] rounded-full" src="" />
          <div>
            <div className="font-extrabold text-black">{user ? user.name : 'Usuari Desconegut'}</div> {/* Mostrar el nombre del usuario */}
            <div className="text-[#91969e] text-xs">Rol del Usuari</div>
          </div>
        </Link>
        <div className="mt-5 space-y-2">
          <Divider />
          <Link
            to="/create"
            className={`flex items-center gap-4 p-3 rounded-[20px] cursor-pointer ${location.pathname === "/create" ? "bg-[#efefef]" : "hover:bg-gray-100"}`}
          >
            <BookmarkPlusIcon size={20} />
            <span>Pujar Producte</span>
          </Link>
          <Link
            to="/seller/123/products"
            className={`p-3 flex items-center gap-4 rounded-[20px] cursor-pointer ${location.pathname === "/seller/123/products" ? "bg-[#efefef]" : "hover:bg-gray-100"}`}
          >
            <LucideShoppingCart size={20} />
            <span>Productes</span>
          </Link>
          <Link
            to="/seller/123/notificacions"
            className={`p-3 flex items-center gap-4 rounded-[20px] cursor-pointer ${location.pathname === "/seller/123/notificacions" ? "bg-[#efefef]" : "hover:bg-gray-100"}`}
          >
            <Bell size={20} />
            <span>Notificacions</span>
          </Link>
          <Link
            to="#"
            onClick={logout}
            className={`p-3 flex items-center gap-4 rounded-[20px] cursor-pointer ${location.pathname === "/logout" ? "bg-[#efefef]" : "hover:bg-gray-100"}`}
          >
            <LogOut size={20} />
            <span>Tanca sessió</span>
          </Link>
        </div>
      </section>

      {/* Barra inferior per a mòbils */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow flex justify-around p-2 z-10">
        <Link
          to="/create"
          className={`flex flex-col items-center p-2 ${location.pathname === "/create" ? "text-[#800020]" : "text-gray-500"}`}
        >
          <BookmarkPlusIcon size={20} />
          <span className="text-xs">Pujar</span>
        </Link>
        <Link
          to="/seller/123/products"
          className={`flex flex-col items-center p-2 ${location.pathname === "/seller/123/products" ? "text-[#800020]" : "text-gray-500"}`}
        >
          <LucideShoppingCart size={20} />
          <span className="text-xs">Productes</span>
        </Link>
        <Link
          to="/seller/123/notificacions"
          className={`flex flex-col items-center p-2 ${location.pathname === "/seller/123/notificacions" ? "text-[#800020]" : "text-gray-500"}`}
        >
          <Bell size={20} />
          <span className="text-xs">Notificacions</span>
        </Link>
        <Link
          to="/logout"
          className={`flex flex-col items-center p-2 ${location.pathname === "/logout" ? "text-[#800020]" : "text-gray-500"}`}
        >
          <LogOut size={20} />
          <span className="text-xs">Sortir</span>
        </Link>
      </nav>
    </>
  );
}
