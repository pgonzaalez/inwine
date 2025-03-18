import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Search, Menu, X, ChevronDown, User, Settings, LogOut } from "lucide-react"
import { useFetchUser } from "@components/auth/FetchUser"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const mobileMenuRef = useRef(null)
  const searchInputRef = useRef(null)
  const dropdownRef = useRef(null)

  const user = useFetchUser()
  console.log(user)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [isDarkMode])

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

  const navItems = [
    { name: "INICI", href: "/" },
    { name: "PRODUCTES", href: "/productes" },
    { name: "CONTACTE", href: "/contacte" },
  ]

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${scrolled
          ? isDarkMode
            ? "bg-black/80 backdrop-blur-md"
            : "bg-white/80 backdrop-blur-md"
          : isDarkMode
            ? "bg-black/20 backdrop-blur-sm"
            : "bg-white/20 backdrop-blur-sm"
        } ${isDarkMode ? "text-white" : "text-black"}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        <div className="flex items-center">
          <Link to="/" className="mr-10">
            <img src="logo.webp" alt="Logo" className="h-8 w-auto rounded-full" />
          </Link>

          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`text-sm font-light tracking-wide transition-colors duration-300 ${isDarkMode ? "hover:text-gray-300" : "hover:text-gray-600"
                      }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-5">
          {isSearchOpen ? (
            <div className={`relative transition-all duration-300 ${isDarkMode ? "text-white" : "text-black"}`}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform opacity-50" />
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Buscar..."
                className={`w-[200px] rounded-full border-0 bg-transparent py-2 pl-10 pr-4 text-sm outline-none ring-1 transition-all duration-300 focus:w-[240px] md:w-[220px] md:focus:w-[280px] ${isDarkMode
                    ? "ring-gray-700 focus:ring-gray-500 placeholder:text-gray-500"
                    : "ring-gray-200 focus:ring-gray-400 placeholder:text-gray-400"
                  }`}
                onBlur={() => {
                  if (!searchInputRef.current.value) {
                    setIsSearchOpen(false)
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 transform"
                onClick={() => {
                  setIsSearchOpen(false)
                  searchInputRef.current.value = ""
                }}
              >
                <X className="h-4 w-4 opacity-50" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </button>
          )}

          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            onClick={toggleDarkMode}
          >
            <span className="sr-only">{isDarkMode ? "Modo claro" : "Modo oscuro"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-4 w-4"
            >
              {isDarkMode ? (
                // Sun icon
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              ) : (
                // Moon icon
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              )}
            </svg>
          </button>

          {/* Mostrar botón de login si no hay usuario, o el avatar con menú desplegable si hay usuario */}
          {user.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-transform duration-300 hover:scale-105 ${isDarkMode ? "ring-1 ring-gray-700" : "ring-1 ring-gray-200"
                  }`}
              >
                <img src={user.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} alt="Usuario" className="h-full w-full object-cover" />
              </button>

              {isOpen && (
                <div
                  className={`absolute right-0 mt-2 w-56 origin-top-right rounded-lg shadow-lg transition-all duration-300 ${isDarkMode ? "bg-gray-900 ring-1 ring-gray-800" : "bg-white ring-1 ring-gray-200"
                    }`}
                  style={{
                    transformOrigin: "top right",
                    animation: "dropdownFade 0.2s ease-out forwards",
                  }}
                >
                  <div className="py-1">
                    <div
                      className={`border-b px-4 py-3 text-sm font-medium ${isDarkMode ? "border-gray-800 text-gray-300" : "border-gray-100 text-gray-700"
                        }`}
                    >
                      El meu compte
                    </div>

                    <Link
                      to={`/seller/${user.id}/products`}
                      className={`flex items-center px-4 py-2.5 text-sm transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>

                    <Link
                      to="/settings"
                      className={`flex items-center px-4 py-2.5 text-sm transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configuració
                    </Link>

                    <div className={isDarkMode ? "border-t border-gray-800" : "border-t border-gray-100"}></div>

                    <Link
                      to="/login"
                      className={`flex items-center px-4 py-2.5 text-sm transition-colors ${isDarkMode ? "text-red-400" : "text-red-600"
                        } ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Tancar sessió
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
            >
              <User className="h-4 w-4" />
              <span className="sr-only">Iniciar sesión</span>
            </Link>
          )}

          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center rounded-full md:hidden ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>

      <div
        ref={mobileMenuRef}
        className={`fixed inset-0 z-50 transform transition-all duration-500 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } ${isDarkMode ? "bg-black" : "bg-white"}`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="logo.webp" alt="Logo" className="h-8 w-auto rounded-full" />
          </Link>
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-full ${isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-100"
              }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar menu</span>
          </button>
        </div>

        <div className="mt-8 px-6">
          <div className="relative mb-8">
            <Search
              className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform ${isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
            />
            <input
              type="search"
              placeholder="Buscar..."
              className={`w-full rounded-full border-0 py-3 pl-12 pr-4 text-base outline-none ring-1 ${isDarkMode
                  ? "bg-gray-900 ring-gray-800 focus:ring-gray-700 placeholder:text-gray-600"
                  : "bg-gray-50 ring-gray-200 focus:ring-gray-300 placeholder:text-gray-400"
                }`}
            />
          </div>

          <nav>
            <ul className="space-y-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="flex items-center justify-between py-2 text-lg font-light tracking-wide"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                    <ChevronDown className="h-5 w-5 opacity-50" />
                  </Link>
                  <div className={`mt-2 h-px w-full ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Perfil en menú móvil */}
          <div className="mt-8 space-y-6">
            <div className="flex items-center space-x-3 py-2">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt="Usuario"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-medium">Mi cuenta</div>
                <Link
                  to={`/seller/${user.id}/products`}
                  className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Ver perfil
                </Link>
              </div>
            </div>
            <div className={`h-px w-full ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`} />
          </div>

          <div className="mt-auto pt-10 space-y-4">
            <Link
              to="/settings"
              className={`flex w-full items-center justify-between rounded-lg py-3 px-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
                }`}
            >
              <span className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Configuració
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Link>

            <button
              onClick={toggleDarkMode}
              className={`flex w-full items-center justify-between rounded-lg py-3 px-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
                }`}
            >
              <span>{isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                {isDarkMode ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                )}
              </svg>
            </button>

            <Link
              to="/login"
              className={`flex w-full items-center justify-between rounded-lg py-3 px-4 ${isDarkMode ? "bg-gray-900 text-red-400" : "bg-gray-50 text-red-600"
                }`}
            >
              <span className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Tancar sessió
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Add global styles for dark mode and animations */}
      <style jsx global>{`
        body.dark-mode {
          background-color: #000;
          color: #fff;
        }
        
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  )
}

