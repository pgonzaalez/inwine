"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Search, Menu, X, ChevronDown } from "lucide-react"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const mobileMenuRef = useRef(null)
  const searchInputRef = useRef(null)

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
    // Apply dark mode class to body
    if (isDarkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [isDarkMode])

  const navItems = [
    { name: "INICI", href: "/" },
    { name: "PRODUCTES", href: "/productes" },
    { name: "SERVEIS", href: "/serveis" },
    { name: "CONTACTE", href: "/contacte" },
  ]

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        scrolled
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
            <img
              src={isDarkMode ? "logo-white.webp" : "logo.webp"}
              alt="Logo"
              className="h-8 w-auto transition-transform duration-300 hover:opacity-80"
            />
          </Link>

          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`text-sm font-light tracking-wide transition-colors duration-300 ${
                      isDarkMode ? "hover:text-gray-300" : "hover:text-gray-600"
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
                className={`w-[200px] rounded-full border-0 bg-transparent py-2 pl-10 pr-4 text-sm outline-none ring-1 transition-all duration-300 focus:w-[240px] md:w-[220px] md:focus:w-[280px] ${
                  isDarkMode
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
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${
                isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </button>
          )}

          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
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

          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center rounded-full md:hidden ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Apple/Tesla Style */}
      <div
        ref={mobileMenuRef}
        className={`fixed inset-0 z-50 transform transition-all duration-500 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } ${isDarkMode ? "bg-black" : "bg-white"}`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={isDarkMode ? "logo-white.webp" : "logo.webp"} alt="Logo" className="h-8 w-auto" />
          </Link>
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-100"
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
              className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <input
              type="search"
              placeholder="Buscar..."
              className={`w-full rounded-full border-0 py-3 pl-12 pr-4 text-base outline-none ring-1 ${
                isDarkMode
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

          <div className="mt-auto pt-10">
            <button
              onClick={toggleDarkMode}
              className={`flex w-full items-center justify-between rounded-lg py-3 px-4 ${
                isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
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
          </div>
        </div>
      </div>

      {/* Add global styles for dark mode */}
      <style jsx global>{`
        body.dark-mode {
          background-color: #000;
          color: #fff;
        }
      `}</style>
    </header>
  )
  )
}


