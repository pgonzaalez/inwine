import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import {
  BookmarkPlus,
  ShoppingCart,
  Bell,
  LogOut,
  User,
  Home,
  Settings,
  Wine,
  Clock,
  ShoppingBag,
  FileQuestion,
  AlertTriangle,
  ShieldCheck,
  Heart
} from "lucide-react"
import { useTranslation } from "react-i18next";
import { useFetchUser } from "@components/auth/FetchUser"
import { getCookie, deleteCookie } from "@/utils/utils"
import Modal from "@components/Modal";
import RoleSelector from "@/components/RoleSelector"

import flagCA from "@/img/locales/cataluña.png";
import flagES from "@/img/locales/espana.png";
import flagEN from "@/img/locales/reino-unido.png";

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
}

export default function Sidebar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL
  const { user, loading, error } = useFetchUser()

  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isRoleChangeOpen, setIsRoleChangeOpen] = useState(false)

  // // Estados relacionados con la selección de rol
  // const [showRoleSelection, setShowRoleSelection] = useState(false)
  // const [availableRoles, setAvailableRoles] = useState([])
  // const [selectedRole, setSelectedRole] = useState(null)

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
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 hover:bg-gray-100 overflow-hidden ring-1 ring-gray-200"
          title={t("languages." + i18n.language)}
        >
          <img src={currentLang.flag} alt={currentLang.label} className="h-4 w-6 object-cover rounded-sm" />
        </button>

        {isLangOpen && (
          <div className="absolute left-0 bottom-full mb-2 w-32 origin-bottom-left rounded-lg shadow-lg bg-white ring-1 ring-gray-200 py-1 z-50">
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

  // Determinar los elementos de navegación según el rol del usuario
  let navItems = []
  let mobileNavItems = []

  // Comprobar el rol del usuario
  const userRole = user?.active_role?.[0] || "seller";
  const hasMultipleRoles = user?.roles?.length > 1;

  if (userRole === "restaurant") {
    // Navegación para restaurantes
    navItems = [
      {
        icon: Home,
        label: t("sidebar.nav.home"),
        path: `/restaurant/dashboard`,
      },
      {
        icon: Wine,
        label: t("sidebar.nav.back_to_web"),
        path: `/`,
      },
      // {
      //   icon: FileQuestion,
      //   label: "Peticions",
      //   path: "/restaurant/peticions",
      // },
      {
        icon: Heart,
        label: t("favorites.title", "Els meus Favorits"),
        path: `/favorites`,
      },
      // {
      //   icon: ShoppingBag,
      //   label: "Compres",
      //   path: `/restaurant/compres`,
      // },
      // {
      //   icon: Clock,
      //   label: "En espera",
      //   path: `/restaurant/espera`,
      // },
      // {
      //   icon: Bell,
      //   label: "Notificacions",
      //   path: `/restaurant/notificacions`,
      // },
      {
        icon: User,
        label: t("sidebar.nav.profile"),
        path: `/restaurant/profile`,
        divider: true,
      },
      {
        icon: Settings,
        label: t("sidebar.nav.settings"),
        path: `/restaurant/settings`,
      },
    ]

    // Navegación móvil para restaurantes
    mobileNavItems = [
      {
        icon: Home,
        label: t("sidebar.nav.home"),
        path: `/restaurant/dashboard`,
      },
      {
        icon: Wine,
        label: t("sidebar.nav.back_to_web"),
        path: `/`,
      },
      {
        icon: Heart,
        label: t("favorites.title", "Els meus Favorits"),
        path: `/favorites`,
      },
      // {
      //   icon: ShoppingBag,
      //   label: "Compres",
      //   path: `/restaurant/compres`,
      // },
      // {
      //   icon: Bell,
      //   label: "Alertes",
      //   path: `/restaurant/notificacions`,
      // },
      {
        icon: LogOut,
        label: t("sidebar.nav.logout"),
        action: () => setIsLogoutOpen(true)
      },
    ]
  } else if (userRole === "investor") {
    // Navegación para inversores
    navItems = [
      {
        icon: Home,
        label: t("sidebar.nav.home"),
        path: `/investor/dashboard`,
      }, 
      {
        icon: FileQuestion,
        label: t("sidebar.nav.history"),
        path: "/investor/historic",
      },
      {
        icon: Heart,
        label: t("favorites.title", "Els meus Favorits"),
        path: `/favorites`,
      },
      {
        icon: Wine,
        label: t("sidebar.nav.back_to_web"),
        path: `/`,
      },
      // {
      //   icon: Bell,
      //   label: "Notificacions",
      //   path: `/investor/notificacions`,
      // },
      {
        icon: User,
        label: t("sidebar.nav.profile"),
        path: `/investor/profile`,
        divider: true,
      },
      {
        icon: Settings,
        label: t("sidebar.nav.settings"),
        path: `/investor/settings`,
      },
    ]

    // Navegación móvil para restaurantes
    mobileNavItems = [
      {
        icon: Home,
        label: t("sidebar.nav.home"),
        path: `/investor/dashboard`,
      },
      {
        icon: FileQuestion,
        label: t("sidebar.nav.history"),
        path: "/investor/historic",
      },
      {
        icon: Heart,
        label: t("favorites.title", "Els meus Favorits"),
        path: `/favorites`,
      },
      // {
      //   icon: Bell,
      //   label: "Alertes",
      //   path: `/investor/notificacions`,
      // },
      {
        icon: LogOut,
        label: t("sidebar.nav.logout"),
        action: () => setIsLogoutOpen(true)
      },
    ]
  }
  else {
    // Navegación para vendedores (seller)
    navItems = [
      {
        icon: Home,
        label: t("sidebar.nav.home"),
        path: `/seller/dashboard`,
      },
      {
        icon: BookmarkPlus,
        label: t("sidebar.nav.upload_product"),
        path: "/create",
      },
      {
        icon: ShoppingCart,
        label: t("sidebar.nav.products"),
        path: `/seller/products`,
      },
      {
        icon: Heart,
        label: t("favorites.title", "Els meus Favorits"),
        path: `/favorites`,
      },
      // {
      //   icon: Bell,
      //   label: "Notificacions",
      //   path: `/seller/notificacions`,
      // },
      {
        icon: Wine,
        label: t("sidebar.nav.back_to_web"),
        path: `/`,
      },
      {
        icon: User,
        label: t("sidebar.nav.profile"),
        path: `/seller/profile`,
        divider: true,
      },
      {
        icon: Settings,
        label: t("sidebar.nav.settings"),
        path: `/seller/settings`,
      },
    ]

    // Navegación móvil para vendedores
    mobileNavItems = [
      {
        icon: Home,
        label: t("sidebar.nav.home"),
        path: `/seller/dashboard`,
      },
      {
        icon: BookmarkPlus,
        label: t("sidebar.nav.upload"),
        path: "/create",
      },
      {
        icon: ShoppingCart,
        label: t("sidebar.nav.products"),
        path: `/seller/products`,
      },
      {
        icon: Heart,
        label: t("favorites.title", "Els meus Favorits"),
        path: `/favorites`,
      },
      // {
      //   icon: Bell,
      //   label: "Alertes",
      //   path: `/seller/notificacions`,
      // },
      {
        icon: LogOut,
        label: t("sidebar.nav.logout"),
        action: () => setIsLogoutOpen(true)
      },
    ]
  }

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
              <p className="font-medium text-gray-900 break-words max-w-[180px]">{user ? user.name : t("sidebar.user_unknown")}</p>
              <p className="text-sm text-gray-500 break-words max-w-[180px]">{user?.email || "email@example.com"}</p>
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
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path) ? "font-medium text-white" : "text-gray-700 hover:bg-gray-50"
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

        {/* Role & Logout button */}
        <div className="p-4 border-t space-y-1" style={{ borderColor: primaryColors.light }}>
          <div className="flex items-center space-x-3 px-4 py-2 border-b border-gray-50 mb-1">
            <LanguageSelector />
            <span className="text-sm font-medium text-gray-700">{t("sidebar.nav.language", "Idioma")}</span>
          </div>
          {hasMultipleRoles && (
            <button
              onClick={() => setIsRoleChangeOpen(true)}
              className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <ShieldCheck size={18} />
              <span>{t("sidebar.nav.change_role")}</span>
            </button>
          )}
          <button
            onClick={() => setIsLogoutOpen(true)}
            className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <LogOut size={18} />
            <span>{t("sidebar.nav.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Mobile navigation bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 shadow-lg flex justify-between z-10 py-2 p-5"
        style={{
          backgroundColor: "white",
          borderTop: `1px solid ${primaryColors.light}`,
        }}
      >
        {mobileNavItems.map((item, index) =>
          item.action ? (
            <button
              key={index}
              onClick={item.action}
              className="flex flex-col items-center p-2 rounded-lg text-gray-600"
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ) : (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg ${isActive(item.path) ? "text-white" : "text-gray-600"
                }`}
              style={
                isActive(item.path)
                  ? { background: `linear-gradient(to right, ${primaryColors.dark}, ${primaryColors.light})` }
                  : {}
              }
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ),
        )}
          <div className="flex flex-col items-center justify-center p-2">
            <LanguageSelector />
            <span className="text-[10px] mt-1 text-gray-500">{t("sidebar.nav.language", "Idioma")}</span>
          </div>
        </nav>

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

      {/* Modal de Cambio de Rol */}
      <Modal
        isOpen={isRoleChangeOpen}
        onClose={() => setIsRoleChangeOpen(false)}
        title={t("sidebar.modals.change_role.title")}
        description={t("sidebar.modals.change_role.description")}
        icon={<ShieldCheck className="h-8 w-8" />}
        variant="primary"
        size="md" // Cambiado a lg para que quede mejor el RoleSelector
        footer={null} // Eliminamos el footer ya que RoleSelector tiene su propio botón
      >
        <div className="px-2">
          <RoleSelector
            roles={user?.roles || []}
            onSelect={(role) => {
              redirectToDashboard(role);
              setIsRoleChangeOpen(false);
            }}
          />
        </div>
      </Modal>
    </>
  )
}

