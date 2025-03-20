import { useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  AlertTriangle
} from "lucide-react";
import { useFetchUser } from "@components/auth/FetchUser";
import {getCookie, deleteCookie} from "@/utils/utils"
import Modal from "@components/Modal";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const apiUrl = import.meta.env.VITE_API_URL

  const user = useFetchUser();

  const handleLogout = async () => {
    const token = getCookie("token")
    if (!token) {
      // console.log("No hay token de autenticación")
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
        // console.log("Error al hacer logout")
      }
    } catch (error) {
      // console.error("Error en la solicitud de logout:", error)
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: "INICI", href: "/" },
    { name: "PRODUCTES", href: "/productes" },
    { name: "CONTACTE", href: "/contacte" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${scrolled
        ? "bg-white/80 backdrop-blur-md"
        : "bg-white/20 backdrop-blur-sm"
        } text-black ${scrolled ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        <div className="flex items-center">
          <Link to="/" className="mr-10">
            <img
              src="/logo.webp"
              alt="Logo"
              className="h-8 w-auto rounded-full"
            />
          </Link>

          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm font-light tracking-wide transition-colors duration-300 hover:text-gray-600"
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
            <div className="relative transition-all duration-300 text-black">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform opacity-50" />
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Buscar..."
                className="w-[200px] rounded-full border-0 bg-transparent py-2 pl-10 pr-4 text-sm outline-none ring-1 ring-gray-200 transition-all duration-300 focus:w-[240px] focus:ring-gray-400 placeholder:text-gray-400 md:w-[220px] md:focus:w-[280px]"
                onBlur={() => {
                  if (!searchInputRef.current.value) {
                    setIsSearchOpen(false);
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 transform"
                onClick={() => {
                  setIsSearchOpen(false);
                  searchInputRef.current.value = "";
                }}
              >
                <X className="h-4 w-4 opacity-50" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 hover:bg-gray-100"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </button>
          )}

          {/* Mostrar botón de login si no hay usuario, o el avatar con menú desplegable si hay usuario */}
          {user.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-transform duration-300 hover:scale-105 ring-1 ring-gray-200"
              >
                <img
                  src={
                    user.avatar ||
                    "https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  }
                  alt="Usuario"
                  className="h-full w-full object-cover"
                />
              </button>

              {isOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg shadow-lg transition-all duration-300 bg-white ring-1 ring-gray-200"
                  style={{
                    transformOrigin: "top right",
                    animation: "dropdownFade 0.2s ease-out forwards",
                  }}
                >
                  <div className="py-1">
                    <div className="border-b px-4 py-3 text-sm font-medium border-gray-100 text-gray-700">
                      El meu compte
                    </div>

                    <Link
                      to={`/seller/products`}
                      className="flex items-center px-4 py-2.5 text-sm transition-colors text-gray-700 hover:bg-gray-50"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2.5 text-sm transition-colors text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configuració
                    </Link>

                    <div className="border-t border-gray-100"></div>

                    <button
                      onClick={() => setIsLogoutOpen(true)}
                      className="flex items-center px-4 py-2.5 text-sm transition-colors text-red-600 hover:bg-gray-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Tancar sessió
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 hover:bg-gray-100"
            >
              <User className="h-4 w-4" />
              <span className="sr-only">Iniciar sesión</span>
            </Link>
          )}

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full md:hidden hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>

      <Transition appear show={isMobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {/* Fondo con blur */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm" />
          </Transition.Child>

          {/* Contenido del diálogo */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-x-full"
            enterTo="opacity-100 translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 translate-x-full"
          >
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-lg">
              <div className="flex h-16 items-center justify-between px-6">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <img
                    src="logo.webp"
                    alt="Logo"
                    className="h-8 w-auto rounded-full"
                  />
                </Link>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Cerrar menú</span>
                </button>
              </div>

              <div className="mt-8 px-6">
                <div className="relative mb-8">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="search"
                    placeholder="Buscar..."
                    className="w-full rounded-full border-0 py-3 pl-12 pr-4 text-base outline-none ring-1 bg-gray-50 ring-gray-200 focus:ring-gray-300 placeholder:text-gray-400"
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
                        <div className="mt-2 h-px w-full bg-gray-100" />
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
                        to={`/seller/dashboard`}
                        className="text-xs text-gray-500"
                      >
                        Ver perfil
                      </Link>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gray-100" />
                </div>

                <div className="mt-auto pt-10 space-y-4">
                  <Link
                    to="/settings"
                    className="flex w-full items-center justify-between rounded-lg py-3 px-4 bg-gray-50 text-black"
                  >
                    <span className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Configuració
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Link>
                  <button
                    onClick={() => setIsLogoutOpen(true)}
                    className="flex w-full items-center justify-between rounded-lg py-3 px-4 bg-gray-50 text-red-600"
                  >
                    <span className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Tancar sessió
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Modal de Cierre de Sesión */}
      <Modal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        title="Tancar sessió?"
        description="Estàs segur que vols tancar la teva sessió actual?"
        icon={<LogOut className="h-8 w-8" />}
        variant="danger"
        size="md"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsLogoutOpen(false)}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel·lar
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-medium text-white hover:from-red-600 hover:to-red-700"
            >
              Tancar sessió
            </button>
          </div>
        }
      >
        <div className="flex items-start rounded-lg bg-amber-50 p-4">
          <AlertTriangle className="mr-3 h-5 w-5 text-amber-500" />
          <p className="text-sm text-amber-700">
            Al tancar sessió, tindràs que tornar a iniciar sessió per accedir al teu compte.
          </p>
        </div>
      </Modal>

      {/* Add global styles for animations */}
      <style jsx global>{`
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
  );
}
