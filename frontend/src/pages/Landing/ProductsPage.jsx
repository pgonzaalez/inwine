"use client"
import { useEffect, useState } from "react"
import { Filter, X, Search } from "lucide-react"
import Footer from "@/components/FooterComponent"
import HeroSection from "@/components/landing/products/HeroSection"
import FilterSidebar from "@/components/landing/products/FilterSection"
import ProductGrid from "@/components/landing/products/ProductGrid"
import RestaurantGrid from "@/components/landing/products/RestaurantGrid"
import EmptyState from "@/components/landing/products/EmptyState"
import { useTranslation } from "react-i18next";
import { getCookie } from "@/utils/utils";
import { API_URL } from "@/config/api";

export default function ProductPage() {
  const { t } = useTranslation();
  // State for filters and tabs
  const [selectedType, setSelectedType] = useState("")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedWineries, setSelectedWineries] = useState([])
  const [selectedZones, setSelectedZones] = useState([])
  const [activeFilter, setActiveFilter] = useState("Productors")
  const [openAccordion, setOpenAccordion] = useState({
    tipo: true,
    precio: true,
    zona: true,
  })
  const [favorites, setFavorites] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Detectar si es móvil al inicio y manejar cambios de tamaño
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [products, setProducts] = useState([])
  const [wineTypes, setWineTypes] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar favoritos al iniciar
  useEffect(() => {
    // Set initial mobile state
    setIsMobile(window.innerWidth < 768)
    setShowFilters(window.innerWidth >= 768)

    const token = getCookie("token")
    if (token) {
        const fetchFavorites = async () => {
            const apiUrl = API_URL
            try {
                const response = await fetch(`${apiUrl}/favorites/ids`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.ok) {
                    const data = await response.json()
                    setFavorites(data.map(id => String(id)))
                }
            } catch (error) {}
        }
        fetchFavorites()
    } else {
        const savedFavorites = document.cookie.split("; ").find((row) => row.startsWith("favorites="))
        if (savedFavorites) {
          try {
            const parsedFavorites = JSON.parse(savedFavorites.split("=")[1])
            setFavorites(parsedFavorites.map(id => String(id)))
          } catch (error) {}
        }
    }
  }, [])

  // Guardar favoritos en cookies cuando cambien
  useEffect(() => {
    if (favorites.length > 0) {
      const expiryDate = new Date()
      expiryDate.setMonth(expiryDate.getMonth() + 1) // Cookie válida por 1 mes
      document.cookie = `favorites=${JSON.stringify(favorites)}; expires=${expiryDate.toUTCString()}; path=/`
    } else {
      document.cookie = "favorites=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
  }, [favorites])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setShowFilters(!mobile)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Product data with real images
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const apiUrl = API_URL
        const response = await fetch(`${apiUrl}/v1/products`)
        const data = await response.json()
        
        // Asegurarse de que cada producto tenga un ID y que sea un número
        const productsWithId = data.map((product) => ({
          ...product,
          id: Number(product.id) // Convertir el ID a número
        }))

        setProducts(productsWithId)
      } catch (error) {
        // console.error("Error fetching products:", error)
        // Sense dades falses: si l'API falla, la llista queda buida i es
        // mostra l'EmptyState en comptes de productes inventats.
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Fetch wine types from API
  useEffect(() => {
    const fetchWineTypes = async () => {
      try {
        const apiUrl = API_URL
        const response = await fetch(`${apiUrl}/v1/winetypes`)
        const data = await response.json()
        setWineTypes(data)
      } catch (error) {
        // console.error("Error fetching wine types:", error)
        // Sense dades falses: si l'API falla, el filtre de tipus de vi
        // queda buit en comptes de mostrar tipus inventats.
        setWineTypes([])
      }
    }
    fetchWineTypes()
  }, [])

  // Restaurant data
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const apiUrl = API_URL

        const [restaurantsResponse, requestsResponse] = await Promise.all([
          fetch(`${apiUrl}/v1/restaurants-info`),
          fetch(`${apiUrl}/v1/restaurants-requests`),
        ])

        if (!restaurantsResponse.ok || !requestsResponse.ok) {
          throw new Error("Error en obtenir les dades dels restaurants")
        }

        const restaurantsData = await restaurantsResponse.json()
        const requestsData = await requestsResponse.json()
        const requestsMap = requestsData.reduce((acc, curr) => {
          acc[curr.user_id] = curr.requests_count;
          return acc;
        }, {});
        const userIds = Object.keys(requestsMap).map(Number);
        
        const restaurantsWithId = restaurantsData.filter(restaurant => userIds.includes(restaurant.user_id))
          // Asegurarse de que cada restaurant tenga un ID y que sea un número
        .map((restaurant) => ({
          ...restaurant,
          id: Number(restaurant.id), // Convertir el ID a número
          request_count: requestsMap[restaurant.user_id] || 0
        }))

        setRestaurants(restaurantsWithId)
      } catch (error) {
        // console.error("Error fetching restaurants:", error)
        // Sense dades falses: si l'API falla, la llista queda buida i es
        // mostra l'EmptyState en comptes de restaurants inventats.
        setRestaurants([])
      }
    }
    fetchRestaurants()
  }, [])

  // Zonas disponibles
  const zones = [
    { id: 1, nombre: "Barcelona" },
    { id: 2, nombre: "Girona" },
    { id: 3, nombre: "Tarragona" },
    { id: 4, nombre: "Lleida" },
    { id: 5, nombre: "Costa Brava" },
    { id: 6, nombre: "Penedès" },
  ]

  // Cellers disponibles
  const allWineries = [...new Set(products.map(p => p.user_id).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Verificar que el producto tenga un ID válido
    if (!product.id || typeof product.id !== 'number') {
      // console.warn('Producto sin ID válido:', product)
      return false
    }

    // Search filter
    if (
      searchTerm &&
      !product.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !product.origin?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !product.wine_type?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !product.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Filter by wine type - case insensitive comparison
    if (selectedType && selectedType !== "") {
      // Normalize both strings for comparison (lowercase and trim)
      const normalizedSelectedType = selectedType.toLowerCase().trim()
      const normalizedProductType = (product.wine_type || "").toLowerCase().trim()

      if (normalizedProductType !== normalizedSelectedType) {
        return false
      }
    }

    // Filter by price range - check if price_demanded exists and is a number
    const price = Number(product.price_demanded)
    if (!isNaN(price) && (price < priceRange[0] || price > priceRange[1])) {
      return false
    }

    // Filter by winery (using user_id as bodega)
    // Only apply if wineries are selected
    if (selectedWineries.length > 0 && !selectedWineries.includes(product.user_id)) {
      return false
    }

    return true
  })

  // Filter restaurants
  const filteredRestaurants = restaurants.filter((restaurant) => {
    // Search filter
    if (
      searchTerm &&
      !restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !restaurant.zone?.toLowerCase().includes(searchTerm.toLowerCase()) /*&&
      !restaurant.solicitud?.tipo?.toLowerCase().includes(searchTerm.toLowerCase())*/
    ) {
      return false
    }

    // // Filter by wine type
    // if (selectedType && restaurant.solicitud.tipo !== selectedType) {
    //   return false
    // }

    // // Filter by price range
    // if (restaurant.solicitud.precioCompra < priceRange[0] || restaurant.solicitud.precioCompra > priceRange[1]) {
    //   return false
    // }

    // Filter by zone
    if (selectedZones.length > 0 && !selectedZones.includes(restaurant.zone)) {
      return false
    }

    return true
  })

  // Handle accordion toggle
  const toggleAccordion = (section) => {
    setOpenAccordion({
      ...openAccordion,
      [section]: !openAccordion[section],
    })
  }

  // Handle favorites toggle
  const toggleFavorite = async (productId) => {
    const pId = String(productId);
    console.log("Toggle favorite called with ID:", pId, "Current favorites:", favorites);
    
    const token = getCookie("token")
    const apiUrl = API_URL

    if (!token) {
      setFavorites((prevFavorites) => {
        if (prevFavorites.includes(pId)) {
          return prevFavorites.filter((id) => id !== pId)
        } else {
          return [...prevFavorites, pId]
        }
      })
      return
    }

    try {
      const response = await fetch(`${apiUrl}/favorites/${pId}/toggle`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Toggle response:", data);
        setFavorites((prevFavorites) => {
          if (data.is_favorite) {
            return [...prevFavorites, pId]
          } else {
            return prevFavorites.filter((id) => id !== pId)
          }
        })
      } else {
        console.error("Toggle API error:", response.status);
      }
    } catch (error) {
      console.error("Toggle request failed:", error);
    }
  }

  // Handle winery toggle
  const toggleWinery = (name) => {
    if (selectedWineries.includes(name)) {
      setSelectedWineries(selectedWineries.filter((b) => b !== name))
    } else {
      setSelectedWineries([...selectedWineries, name])
    }
  }

  // Handle zone toggle
  const toggleZone = (name) => {
    if (selectedZones.includes(name)) {
      setSelectedZones(selectedZones.filter((z) => z !== name))
    } else {
      setSelectedZones([...selectedZones, name])
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedType("")
    setPriceRange([0, 10000])
    setSelectedWineries([])
    setSelectedZones([])
    setSearchTerm("")
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <HeroSection activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters sidebar */}
            <FilterSidebar
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              openAccordion={openAccordion}
              toggleAccordion={toggleAccordion}
              wineTypes={wineTypes}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              activeFilter={activeFilter}
              wineries={allWineries}
              zones={zones}
              selectedWineries={selectedWineries}
              selectedZones={selectedZones}
              toggleWinery={toggleWinery}
              toggleZone={toggleZone}
            />

            {/* Products/Restaurants Grid */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {activeFilter === "Productors" ? t("landing.products.title_products") : t("landing.products.title_requests")}
                  </h2>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Search input */}
                    <div className="relative flex-1 sm:w-64">
                      <input
                        type="text"
                        placeholder={t("landing.products.search_placeholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9A3E50] focus:border-transparent"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    <button
                      className="md:hidden flex items-center gap-2 text-sm font-medium text-white bg-[#9A3E50] px-4 py-2 rounded-lg shadow-sm"
                      onClick={() => setShowFilters(true)}
                    >
                      <Filter size={16} />
                      {t("landing.products.btn_filters")}
                    </button>
                    <button
                      onClick={resetFilters}
                      className="flex-none text-[#9A3E50] font-medium text-sm bg-[#9A3E50]/5 hover:bg-[#9A3E50]/10 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <X size={16} />
                      {t("landing.products.btn_reset")}
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9A3E50]"></div>
                </div>
              ) : activeFilter === "Productors" ? (
                // Products
                filteredProducts.length > 0 ? (
                  <ProductGrid products={filteredProducts} favorites={favorites} toggleFavorite={toggleFavorite} />
                ) : (
                  <EmptyState type="products" resetFilters={resetFilters} />
                )
              ) : // Restaurants
              filteredRestaurants.length > 0 ? (
                <RestaurantGrid restaurants={filteredRestaurants} />
              ) : (
                <EmptyState type="restaurants" resetFilters={resetFilters} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
