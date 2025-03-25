import { useEffect, useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  X,
  Heart,
  MapPin,
  Clock,
  Package,
  Wine,
  TrendingUp,
  TrendingDown,
  Euro,
  Star,
  Filter,
  Store
} from "lucide-react"
import Header from "@/components/HeaderComponent"
import Footer from "@/components/FooterComponent"

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
  // Cargar favoritos desde cookies al iniciar
  useEffect(() => {
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

  // Detectar si es móvil al inicio y manejar cambios de tamaño
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [showFilters, setShowFilters] = useState(!isMobile) // Inicialmente oculto en móvil

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setShowFilters(!mobile)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const [products, setProducts] = useState([])
  const [wineTypes, setWineTypes] = useState([])
  const apiUrl = import.meta.env.VITE_API_URL

  // Product data with real images
  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
        const response = await fetch(`${apiUrl}/v1/winetypes`)
        const data = await response.json()
        setWineTypes(data)
      } catch (error) {
        console.error("Error fetching wine types:", error)
      }
    }
    fetchWineTypes()
  }, [])

  const allProducts = products

  // Zonas disponibles
  const zones = [
    { id: 1, nombre: "Barcelona" },
    { id: 2, nombre: "Girona" },
    { id: 3, nombre: "Tarragona" },
    { id: 4, nombre: "Lleida" },
    { id: 5, nombre: "Costa Brava" },
    { id: 6, nombre: "Penedès" }
  ]

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
        tiempoRespuesta: "24-48h"
      }
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
        tiempoRespuesta: "24h"
      }
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
        tiempoRespuesta: "48h"
      }
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
        tiempoRespuesta: "24-48h"
      }
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
        tiempoRespuesta: "24h"
      }
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
        tiempoRespuesta: "48h"
      }
    }
  ]

  // Cuisine types data
  const cuisineTypes = [
    {
      id: 1,
      nombre: "Mediterrani",
      imagen: "https://cdn-icons-png.flaticon.com/512/3511/3511307.png",
    },
    {
      id: 2,
      nombre: "Català",
      imagen: "https://cdn-icons-png.flaticon.com/512/2252/2252075.png",
    },
    {
      id: 3,
      nombre: "Tapes",
      imagen: "https://cdn-icons-png.flaticon.com/512/1046/1046769.png",
    },
    {
      id: 4,
      nombre: "Tradicional",
      imagen: "https://cdn-icons-png.flaticon.com/512/1147/1147805.png",
    },
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
  const filteredProducts = allProducts.filter((product) => {
    // Filter by wine type
    if (selectedType && product.wine_type !== selectedType) {
      // Cambiado a 'wine_type'
      return false
    }

    // Filter by price range
    if (product.price_demanded < priceRange[0] || product.price_demanded > priceRange[1]) {
      // Cambiado a 'price_demanded'
      return false
    }

    // Filter by winery (usaremos origin como bodega)
    if (selectedWineries.length > 0 && !selectedWineries.includes(product.origin)) {
      // Cambiado a 'origin'
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero section with background image */}
          <div className="relative mb-8 sm:mb-12 rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9A3E50]/90 to-black/70 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Wine background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-20 flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 md:p-12">
              <div className="text-white mb-6 md:mb-0 md:w-1/2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Connectem cellers i restaurants</h1>
                <p className="text-gray-200 text-base sm:text-lg max-w-xl">
                  Descobreix vins únics dels millors cellers o explora les demandes dels restaurants més exclusius. 
                  Una plataforma que uneix l'oferta i la demanda del sector vinícola.
                </p>
              </div>
              <div className="flex flex-col space-y-4 w-full md:w-1/3">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Què vols veure?</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      className={`w-full rounded-full px-4 py-3 text-base font-medium transition-all duration-300 ${
                        activeFilter === "Productors"
                          ? "bg-white text-[#9A3E50] shadow-lg"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                      onClick={() => setActiveFilter("Productors")}
                    >
                      <Store className="inline-block w-5 h-5 mr-2" />
                      Vins disponibles
                    </button>
                    <button
                      className={`w-full rounded-full px-4 py-3 text-base font-medium transition-all duration-300 ${
                        activeFilter === "Restaurants"
                          ? "bg-white text-[#9A3E50] shadow-lg"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                      onClick={() => setActiveFilter("Restaurants")}
                    >
                      <MapPin className="inline-block w-5 h-5 mr-2" />
                      Demandes actives
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters sidebar */}
            <div
              className={`md:w-72 transition-all duration-300 ${
                showFilters ? "opacity-100" : "opacity-0 md:opacity-100 h-0 md:h-auto overflow-hidden"
              }`}
            >
              <div className="sticky top-4 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 bg-[#9A3E50] text-white flex justify-between items-center">
                  <h3 className="font-medium">Filtres</h3>
                  <button className="md:hidden" onClick={() => setShowFilters(false)}>
                    <X size={18} />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Wine types */}
                  <div className="border-b border-gray-100 pb-4">
                    <button
                      className="w-full flex justify-between items-center mb-2"
                      onClick={() => toggleAccordion("tipo")}
                    >
                      <h3 className="font-medium text-gray-800">Tipus de vi</h3>
                      {openAccordion.tipo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openAccordion.tipo && (
                      <div className="space-y-2 mt-3">
                        {wineTypes.map((type) => (
                          <div
                            key={type.id}
                            className="relative rounded-lg overflow-hidden"
                          >
                            <img
                              src={type.image || "/placeholder.svg"}
                              alt={type.name}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <button
                              className={`w-full h-full relative ${
                                selectedType === type.name
                                  ? "bg-[#9A3E50]/70 text-white font-medium"
                                  : "bg-white/30 hover:bg-white/50"
                              } p-4 flex items-center justify-center transition-all duration-300`}
                              onClick={() => setSelectedType(selectedType === type.name ? "" : type.name)}
                            >
                              <span className="text-sm font-medium backdrop-blur-sm px-2 py-1 rounded">
                                {type.name}
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price range */}
                  <div className="border-b border-gray-100 pb-4">
                    <button
                      className="w-full flex justify-between items-center mb-2"
                      onClick={() => toggleAccordion("precio")}
                    >
                      <h3 className="font-medium text-gray-800">Preu</h3>
                      {openAccordion.precio ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openAccordion.precio && (
                      <div className="px-1 pt-4">
                        <div className="relative">
                          <input
                            type="range"
                            min="0"
                            max="2000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                            className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#9A3E50]"
                          />
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>{priceRange[0]},00 €</span>
                            <span>{priceRange[1]},00 € o més</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <button
                      className="w-full flex justify-between items-center mb-2"
                      onClick={() => toggleAccordion("zona")}
                    >
                      <h3 className="font-medium text-gray-800">{activeFilter === "Productors" ? "Celler" : "Restaurant"}</h3>
                      {openAccordion.zona ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openAccordion.zona && (
                      <div className="space-y-2 mt-2">
                        {(activeFilter === "Productors" ? wineries : zones).map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={activeFilter === "Productors"
                                ? selectedWineries.includes(item.nombre)
                                : selectedZones.includes(item.nombre)
                              }
                              onChange={() => activeFilter === "Productors"
                                ? toggleWinery(item.nombre)
                                : toggleZone(item.nombre)
                              }
                              className="w-4 h-4 rounded border-gray-300 text-[#9A3E50] focus:ring-[#9A3E50]"
                            />
                            <span className="text-sm text-gray-700">{item.nombre}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

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
                    {activeFilter === "Productors" && (
                      <button
                        onClick={() => {
                          setSelectedType("")
                          setPriceRange([5, 2000])
                          setSelectedWineries([])
                        }}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.name}
                        producto={product}
                        esFavorito={favorites.includes(product.name)}
                        onToggleFavorito={toggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <X size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">No s'han trobat productes amb els filtres seleccionats.</p>
                    <button
                      className="text-[#9A3E50] font-medium hover:underline"
                      onClick={() => {
                        setSelectedType("")
                        setPriceRange([5, 2000])
                        setSelectedWineries([])
                      }}
                    >
                      Restablir filtres
                    </button>
                  </div>
                )
              ) : // Restaurants
              filteredRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurante={restaurant}
                      esFavorito={favorites.includes(restaurant.id)}
                      onToggleFavorito={toggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <X size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No s'han trobat restaurants amb els filtres seleccionats.</p>
                  <button
                    className="text-[#9A3E50] font-medium hover:underline"
                    onClick={() => {
                      setSelectedType("")
                      setSelectedZones([])
                    }}
                  >
                    Restablir filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

// Product card component
function ProductCard({ producto, esFavorito, onToggleFavorito }) {
  const baseUrl = import.meta.env.VITE_URL_BASE
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 sm:h-56">
        <img
          src={`${baseUrl}${producto.image}` || "/placeholder.svg"}
          alt={producto.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <button
            className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorito(producto.name)
            }}
          >
            <Heart className={`w-5 h-5 ${esFavorito ? "fill-[#9A3E50] text-[#9A3E50]" : "text-gray-400"}`} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-white font-medium">€{producto.price_demanded}</div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-800 mb-1">
              {producto.name} {producto.year}
            </h3>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <img src="https://flagcdn.com/16x12/es.png" alt="D.O." />
              D.O. {producto.origin}{" "}
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <Store className="w-3 h-3 text-red-400" /> {producto.user_id}
            </p>
          </div>
          <div className="bg-[#9A3E50]/10 text-[#9A3E50] text-xs font-medium px-2 py-1 rounded">{producto.year}</div>
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-3">
          <span className="inline-block px-2 py-1 bg-gray-100 rounded-full mr-2">{producto.wine_type}</span>
          <span className="inline-block px-2 py-1 bg-gray-100 rounded-full">{producto.origin}</span>
          <span style={{ display: "none" }}>{producto.user_id}</span>
        </div>
      </div>
    </div>
  )
}

// Restaurant card component
function RestaurantCard({ restaurante, esFavorito, onToggleFavorito }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 sm:h-56">
        <img
          src={restaurante.imagen || "/placeholder.svg"}
          alt={restaurante.nombre}
          className="w-full h-full object-cover"
        />
        <button
          className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.preventDefault()
            onToggleFavorito(restaurante.id)
          }}
        >
          <Heart
            size={20}
            className={`${esFavorito ? "fill-[#9A3E50] text-[#9A3E50]" : "text-gray-600"}`}
          />
        </button>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{restaurante.nombre}</h3>
        <p className="text-gray-600 mb-4">{restaurante.descripcion}</p>
        
        {/* Detalles de la solicitud */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-[#9A3E50] mb-2">Sol·licitud de producte</h4>
          <p className="text-gray-700 font-medium mb-1">{restaurante.solicitud.nombre}</p>
          <p className="text-gray-600 text-sm mb-3">{restaurante.solicitud.descripcion}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Wine size={16} className="text-[#9A3E50]" />
              <span className="text-gray-600">{restaurante.solicitud.tipo}</span>
            </div>
            <div className="flex items-center gap-1">
              <Package size={16} className="text-[#9A3E50]" />
              <span className="text-gray-600">{restaurante.solicitud.cantidadSolicitada}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown size={16} className="text-[#9A3E50]" />
              <span className="text-gray-600">Compra: {restaurante.solicitud.precioCompra},00 €</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={16} className="text-[#9A3E50]" />
              <span className="text-gray-600">Venda: {restaurante.solicitud.precioVenta},00 €</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-[#9A3E50]" />
            {restaurante.zona}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-[#9A3E50]" />
            {restaurante.solicitud.tiempoRespuesta}
          </div>
        </div>
      </div>
    </div>
  )
}
