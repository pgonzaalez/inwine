import { useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  AlertTriangle,
  ShoppingCart,
  ShieldCheck,
} from "lucide-react";
import { useFetchUser } from "@components/auth/FetchUser";
import { getCookie, deleteCookie } from "@/utils/utils";
import Modal from "@components/Modal";
import RoleSelector from '@/components/RoleSelector';
import { useTranslation } from "react-i18next";
import {Globe} from "lucide-react";

import flagCA from "@/img/locales/cataluña.png";
import flagES from "@/img/locales/espana.png";
import flagEN from "@/img/locales/reino-unido.png";

export default function Header() {
  const { t, i18n } = useTranslation();

  const user = useFetchUser();
  const hasMultipleRoles = user.user?.roles?.length > 1;
  // const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [productCount, setProductCount] = useState(0);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isRoleChangeOpen, setIsRoleChangeOpen] = useState(false);
  const role = user.user?.active_role?.[0];

  const redirectToDashboard = async (role) => {
    try {
      const response = await fetch(`${apiUrl}/update-active-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el rol activo");
      }


      setTimeout(() => {
        switch (role) {
          case "seller":
            navigate("/seller/dashboard");
            break;
          case "restaurant":
            navigate("/restaurant/dashboard");
            break;
          case "investor":
            navigate("/investor/dashboard");
            break;
          default:
            navigate("/login");
        }
      }, 500);
    } catch (error) {
      // console.error("Error updating active role:", error);
      // Puedes manejar el error como prefieras
    }
  };

  const handleRoleChange = (role) => {
    redirectToDashboard(role); // Asegúrate de tener esta función definida
    setIsRoleChangeOpen(false);
  };
  const navigate = useNavigate();

  const handleProfile = () => {
    if (role === "seller") {
      navigate("/seller/dashboard");
    } else if (role === "restaurant") {
      navigate("/restaurant/dashboard");
    } else if (role === "investor") {
      navigate("/investor/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    const token = getCookie("token");
    if (!token) {
      // console.log("No hay token de autenticación")
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        deleteCookie("token");
        window.location.href = "/";
      } else {
        // console.log("Error al hacer logout")
      }
    } catch (error) {
      // console.error("Error en la solicitud de logout:", error)
    }
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/v1/${user.user.id}/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        });

        if (!response.ok) {
          // console.error("Error al obtener los pedidos:", response.status);
          throw new Error("Error al obtener los pedidos");
        }

        const data = await response.json();

        // Suma la propiedad `quantity` de cada pedido
        const count = data.reduce((acc, pedido) => {
          const cantidadPedido = pedido.quantity || 0;
          return acc + cantidadPedido;
        }, 0);

        setProductCount(count);
      } catch (error) {
        // console.error("Error al cargar el número de productos:", error);
      }
    };

    if (user?.user?.id) {
      // console.log("User ID disponible:", user.user.id);
      fetchCartCount();
    } else {
      // console.log("No se encontró user.user.id");
    }
  }, [user]);



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
    { name: t("header.nav.home"), href: "/" },
    { name: t("header.nav.products"), href: "/productes" },
    { name: t("header.nav.contact"), href: "/contacte" },
  ];

  const LanguageSelector = () => {
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (langRef.current && !langRef.current.contains(event.target)) {
          setIsLangOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const languages = [
      { code: 'ca', label: 'CA', flag: flagCA },
      { code: 'es', label: 'ES', flag: flagES },
      { code: 'en', label: 'EN', flag: flagEN }
    ];

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    return (
      <div className="relative" ref={langRef}>
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 hover:bg-gray-100 overflow-hidden"
          title={t("languages." + i18n.language)}
        >
          <img src={currentLang.flag} alt={currentLang.label} className="h-4 w-6 object-cover rounded-sm" />
        </button>

        {isLangOpen && (
          <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-lg shadow-lg bg-white ring-1 ring-gray-200 py-1 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setIsLangOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${
                  i18n.language === lang.code ? "font-bold text-[#9A3E50]" : "text-gray-700"
                }`}
              >
                <img src={lang.flag} alt={lang.label} className="h-3 w-5 mr-3 object-cover rounded-sm" />
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 z-50 w-full">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 md:px-8">
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
                placeholder={t("header.search")}
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

          <LanguageSelector />

          <Link
            to="/cistella"
            className="relative flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 hover:bg-gray-100"
          >
            <ShoppingCart className="h-4 w-4" />
            {productCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#9A3E50] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {productCount}
              </span>
            )}
            <span className="sr-only">Cistella</span>
          </Link>

          {/* Mostrar botón de login si no hay usuario, o el avatar con menú desplegable si hay usuario */}
          {user.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-gray-200">
                  <img
                    src={user.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
                    alt="Usuario"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">
                    {user.user?.name || t("header.user.account")}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {t("header.user.role")}: {role || "rol"}
                  </span>
                </div>
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
                      {t("header.user.account")}
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-xs text-gray-500 break-words max-w-[180px]">
                          {user.user?.email || t("header.user.email")}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleProfile}
                      className="flex w-full items-center px-4 py-2.5 text-sm transition-colors text-gray-700 hover:bg-gray-50"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {t("header.user.profile")}
                    </button>

                    {hasMultipleRoles && (
                      <button
                        onClick={() => setIsRoleChangeOpen(true)}
                        className="flex w-full items-center px-4 py-2.5 text-sm transition-colors text-gray-700 hover:bg-gray-50"
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        {t("header.user.change_role")}
                      </button>
                    )}

                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2.5 text-sm transition-colors text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {t("header.user.settings")}
                    </Link>

                    <div className="border-t border-gray-100"></div>

                    <button
                      onClick={() => setIsLogoutOpen(true)}
                      className="flex w-full items-center px-4 py-2.5 text-sm transition-colors text-red-600 hover:bg-gray-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("header.user.logout")}
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
              <span className="sr-only">{t("header.login")}</span>
            </Link>
          )}

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full md:hidden hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t("header.nav.menu", "Menu")}</span>
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
                  <span className="sr-only">{t("common.close")}</span>
                </button>
              </div>

              <div className="mt-8 px-6">
                <div className="relative mb-8">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="search"
                    placeholder={t("header.search")}
                    className="w-full rounded-full border-0 py-3 l-12 pr-4 text-base outline-none ring-1 bg-gray-50 ring-gray-200 focus:ring-gray-300 placeholder:text-gray-400"
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
                  {user.user ? (
                    <div className="flex items-center space-x-3 py-2">
                      <img
                        src={user.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
                        alt="Usuario"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium">{t("header.user.account")}</div>
                        <button
                          onClick={handleProfile}
                          className="text-xs text-gray-500"
                        >
                          {t("header.user.profile")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 py-2 text-gray-700 hover:text-black"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <User className="h-5 w-5" />
                      </div>
                      <span className="text-base font-medium">{t("header.login")}</span>
                    </Link>
                  )}
                  <div className="h-px w-full bg-gray-100" />
                  
                  {/* Selector d'idioma en mòbil */}
                  <div className="flex items-center justify-around py-4">
                    {[
                      { code: 'ca', flag: flagCA },
                      { code: 'es', flag: flagES },
                      { code: 'en', flag: flagEN }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={`p-1 rounded-md transition-all ${
                          i18n.language === lang.code ? "ring-2 ring-[#9A3E50] scale-110" : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                        }`}
                      >
                        <img src={lang.flag} alt={lang.code} className="h-6 w-10 object-cover rounded-sm" />
                      </button>
                    ))}
                  </div>
                  <div className="h-px w-full bg-gray-100" />
                </div>

                {user.user && (
                  <div className="mt-auto pt-10 space-y-4">
                    <Link
                      to="/settings"
                      className="flex w-full items-center justify-between rounded-lg py-3 px-4 bg-gray-50 text-black"
                    >
                      <span className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        {t("header.user.settings")}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Link>
                    <button
                      onClick={() => setIsLogoutOpen(true)}
                      className="flex w-full items-center justify-between rounded-lg py-3 px-4 bg-gray-50 text-red-600"
                    >
                      <span className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("header.user.logout")}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Modal de Canvio de Rol */}
      <Modal
        isOpen={isRoleChangeOpen}
        onClose={() => setIsRoleChangeOpen(false)}
        title={t("sidebar.modals.change_role.title")}
        description={t("sidebar.modals.change_role.description")}
        icon={<ShieldCheck className="h-8 w-8" />}
        variant="primary"
        size="md"
        footer={null}
      >
        <div className="px-2">
          <RoleSelector roles={user?.user?.roles || []} onSelect={handleRoleChange} />
        </div>
      </Modal>
      {/* Modal de Cierre de Sesión */}
      <Modal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        title={t("sidebar.modals.logout.title")}
        description={t("sidebar.modals.logout.description")}
        icon={<LogOut className="h-8 w-8" />}
        variant="danger"
        size="md"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsLogoutOpen(false)}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t("sidebar.modals.logout.cancel")}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-medium text-white hover:from-red-600 hover:to-red-700"
            >
              {t("sidebar.modals.logout.confirm")}
            </button>
          </div>
        }
      >
        <div className="flex items-start rounded-lg bg-amber-50 p-4">
          <AlertTriangle className="mr-3 h-5 w-5 text-amber-500" />
          <p className="text-sm text-amber-700">
            {t("sidebar.modals.logout.warning")}
          </p>
        </div>
      </Modal>

      <style>{`
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
