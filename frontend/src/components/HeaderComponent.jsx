import { useState, useEffect, useRef } from "react"
import { Search, User, Settings, LogOut } from "lucide-react"
import { Avatar } from "@heroui/react";
import { Link } from "react-router-dom"
import { useFetchUser } from "@components/FetchUser"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const {user} = useFetchUser()

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="flex items-center w-[75%] h-[60px] top-0 left-1/2 transform -translate-x-1/2 fixed z-10 bg-[#eeeeee80] backdrop-blur-[5px] rounded-lg max-w-screen-xl mx-auto justify-between px-3">
      <img src="/logo.webp" className="w-[40px] h-[40px] rounded-full" alt="Logo" />

      <div className="flex gap-3 text-base text-black hidden sm:flex">
        <span>INICI</span>
        <span>PRODUCTES</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-white border border-[#dadada] rounded-lg px-3 py-1.5 flex items-center gap-2">
          <Search className="w-4 h-4" />
          <input placeholder="Buscar..." className="text-[#dadada] outline-none text-sm w-32" />
        </div>

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            <Avatar className="w-[40px] h-[40px] rounded-full" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-1">
                <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                  El meu compte
                </div>

                <Link
                  to={`/seller/${user.id}/products`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </Link>

                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configuració
                </Link>

                <div className="border-t border-gray-100"></div>

                <Link to="/login" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  Tancar sessió
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

