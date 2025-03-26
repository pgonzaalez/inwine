
import { useEffect, useState } from "react"
import { Filter, X } from "lucide-react"
import HeroSection from "@/components/landing/products/HeroSection"
import FilterSidebar from "@/components/landing/products/FilterSection"
import ProductGrid from "@/components/landing/products/ProductGrid"
import RestaurantGrid from "@/components/landing/products/RestaurantGrid"
import EmptyState from "@/components/landing/products/EmptyState"

export default function PopularProducts() {
  // State for filters and tabs
  const [selectedType, setSelectedType] = useState("")
  const [priceRange, setPriceRange] = useState([5, 2000])
  const [selectedWineries, setSelectedWineries] = useState([])
  const [selectedZones, setSelectedZones] = useState([])
  const [activeFilter, setActiveFilter] = useState("Productors")
  const [openAccordion, setOpenAccordion] = useState({
    tipo: true,
    precio: true,
    zona: true,
  })
  const [favorites, setFavorites] = useState([])

  // Detectar si es móvil al inicio y manejar cambios de tamaño
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [products, setProducts] = useState([])
  const [wineTypes, setWineTypes] = useState([])

  // Cargar favoritos desde cookies al iniciar
  useEffect(() => {
    // Set initial mobile state
    setIsMobile(window.innerWidth < 768)
    setShowFilters(window.innerWidth >= 768)

    const savedFavorites = document.cookie.split("; ").find((row) => row.startsWith("favorites="))

    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites.split("=")[1])
        setFavorites(parsedFavorites)
      } catch (error) {
        console.error("Error parsing favorites from cookie:", error)
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
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api"
        const response = await fetch(`${apiUrl}/v1/products`)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchProducts()
  }, [])

  // Fetch wine types from API
  useEffect(() => {
    const fetchWineTypes = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api"
        const response = await fetch(`${apiUrl}/v1/winetypes`)
        const data = await response.json()
        setWineTypes(data)
      } catch (error) {
        console.error("Error fetching wine types:", error)
      }
    }
    fetchWineTypes()
  }, [])

  // Restaurant data
  const allRestaurants = [
    {
      id: 1,
      nombre: "Ca l'Isidre",
      descripcion: "Restaurant d'alta cuina catalana amb més de 50 anys d'història",
      imagen: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      zona: "Barcelona",
      solicitud: {
        tipo: "Vi negre",
        nombre: "Priorat Reserva 2019",
        descripcion: "Vi negre amb cos, anyada 2019-2020, D.O.Q. Priorat",
        precioCompra: 25,
        precioVenta: 45,
        cantidadSolicitada: "120 botellas",
        tiempoRespuesta: "24-48h",
      },
    },
    {
      id: 2,
      nombre: "Botafumeiro",
      descripcion: "Restaurant especialitzat en peix i marisc de primera qualitat",
      imagen: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
      zona: "Barcelona",
      solicitud: {
        tipo: "Vi blanc",
        nombre: "Blanc de blancs Penedès",
        descripcion: "Vi blanc sec i fresc, D.O. Penedès, ideal per marisc",
        precioCompra: 18,
        precioVenta: 35,
        cantidadSolicitada: "200 botellas",
        tiempoRespuesta: "24h",
      },
    },
    {
      id: 3,
      nombre: "El Celler de Can Roca",
      descripcion: "Restaurant amb tres estrelles Michelin, referent de la gastronomia catalana",
      imagen: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17",
      zona: "Girona",
      solicitud: {
        tipo: "Cava",
        nombre: "Gran Reserva Brut Nature",
        descripcion: "Cava Gran Reserva, mínim 30 mesos de criança",
        precioCompra: 35,
        precioVenta: 85,
        cantidadSolicitada: "150 botellas",
        tiempoRespuesta: "48h",
      },
    },
    {
      id: 4,
      nombre: "Can Jubany",
      descripcion: "Restaurant amb una estrella Michelin, cuina d'autor amb arrels tradicionals",
      imagen: "https://images.unsplash.com/photo-1515669097368-22e68427d265",
      zona: "Vic",
      solicitud: {
        tipo: "Vi rosat",
        nombre: "Rosat Empordà",
        descripcion: "Vi rosat fresc i afruitat, D.O. Empordà",
        precioCompra: 15,
        precioVenta: 32,
        cantidadSolicitada: "180 botellas",
        tiempoRespuesta: "24-48h",
      },
    },
    {
      id: 5,
      nombre: "Via Veneto",
      descripcion: "Restaurant clàssic amb una estrella Michelin, referent de la cuina mediterrània",
      imagen: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c",
      zona: "Barcelona",
      solicitud: {
        tipo: "Vi negre",
        nombre: "Ribera del Duero Criança",
        descripcion: "Vi negre amb 12 mesos de criança en roure francès",
        precioCompra: 22,
        precioVenta: 48,
        cantidadSolicitada: "100 botellas",
        tiempoRespuesta: "24h",
      },
    },
    {
      id: 6,
      nombre: "Les Cols",
      descripcion: "Restaurant amb dues estrelles Michelin, cuina d'avantguarda amb producte local",
      imagen: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
      zona: "Girona",
      solicitud: {
        tipo: "Vi blanc",
        nombre: "Blanc Terra Alta",
        descripcion: "Vi blanc amb criança sobre lies, D.O. Terra Alta",
        precioCompra: 20,
        precioVenta: 42,
        cantidadSolicitada: "150 botellas",
        tiempoRespuesta: "48h",
      },
    },
  ]

  // Zonas disponibles
  const zones = [
    { id: 1, nombre: "Barcelona" },
    { id: 2, nombre: "Girona" },
    { id: 3, nombre: "Tarragona" },
    { id: 4, nombre: "Lleida" },
    { id: 5, nombre: "Costa Brava" },
    { id: 6, nombre: "Penedès" },
  ]

  // Wineries data
  const wineries = [
    { id: 1, nombre: "Nom Marca 1" },
    { id: 2, nombre: "Nom Marca 2" },
    { id: 3, nombre: "Nom Marca 3" },
    { id: 4, nombre: "Nom Marca 4" },
    { id: 5, nombre: "Nom Marca 5" },
  ]

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Filter by wine type
    if (selectedType && product.wine_type !== selectedType) {
      return false
    }

    // Filter by price range
    if (product.price_demanded < priceRange[0] || product.price_demanded > priceRange[1]) {
      return false
    }

    // Filter by winery (usaremos origin como bodega)
    if (selectedWineries.length > 0 && !selectedWineries.includes(product.origin)) {
      return false
    }

    return true
  })

  // Filter restaurants
  const filteredRestaurants = allRestaurants.filter((restaurant) => {
    // Filter by wine type
    if (selectedType && restaurant.solicitud.tipo !== selectedType) {
      return false
    }

    // Filter by price range
    if (restaurant.solicitud.precioCompra < priceRange[0] || restaurant.solicitud.precioCompra > priceRange[1]) {
      return false
    }

    // Filter by zone
    if (selectedZones.length > 0 && !selectedZones.includes(restaurant.zona)) {
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
  const toggleFavorite = (name) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(name)) {
        return prevFavorites.filter((favName) => favName !== name)
      } else {
        return [...prevFavorites, name]
      }
    })
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
    setPriceRange([5, 2000])
    if (activeFilter === "Productors") {
      setSelectedWineries([])
    } else {
      setSelectedZones([])
    }
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
              wineries={wineries}
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
                    {activeFilter === "Productors" ? "Vins disponibles" : "Demandes de restaurants"}
                  </h2>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                      className="md:hidden flex items-center gap-2 text-sm font-medium text-white bg-[#9A3E50] px-4 py-2 rounded-lg shadow-sm"
                      onClick={() => setShowFilters(true)}
                    >
                      <Filter size={16} />
                      Filtres
                    </button>
                    {activeFilter === "Productors" || activeFilter === "Restaurants" && (
                      <button
                        onClick={resetFilters}
                        className="flex-1 sm:flex-none text-[#9A3E50] font-medium text-sm bg-[#9A3E50]/5 hover:bg-[#9A3E50]/10 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <X size={16} />
                        Restablir filtres
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {activeFilter === "Productors" ? (
                // Products
                filteredProducts.length > 0 ? (
                  <ProductGrid products={filteredProducts} favorites={favorites} toggleFavorite={toggleFavorite} />
                ) : (
                  <EmptyState type="products" resetFilters={resetFilters} />
                )
              ) : // Restaurants
              filteredRestaurants.length > 0 ? (
                <RestaurantGrid
                  restaurants={filteredRestaurants}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              ) : (
                <EmptyState type="restaurants" resetFilters={resetFilters} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

