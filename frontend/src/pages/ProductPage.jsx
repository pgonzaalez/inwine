import { useEffect, useState } from "react";
import {
  Heart,
  Star,
  MapPin,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import Header from "@/components/HeaderComponent";
import Footer from "@/components/FooterComponent";

export default function PopularProducts() {
  // State for filters and tabs
  const [selectedType, setSelectedType] = useState("Negre");
  const [priceRange, setPriceRange] = useState([5, 2000]);
  const [selectedWineries, setSelectedWineries] = useState([]);
  const [selectedRestaurantType, setSelectedRestaurantType] =
    useState("Mediterrani");
  const [selectedZones, setSelectedZones] = useState(["Barcelona", "Girona"]);
  const [activeFilter, setActiveFilter] = useState("Productors");
  const [openAccordion, setOpenAccordion] = useState({
    tipo: true,
    precio: true,
    bodega: true,
    zona: true,
    cocina: true,
  });
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [products, setProducts] = useState([]);
  const [wineTypes, setWineTypes] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Product data with real images
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/v1/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  const allProducts = products;

  // Restaurant data
  const allRestaurants = [
    {
      id: 101,
      nombre: "La Vinya",
      tipo: "Mediterrani",
      zona: "Barcelona",
      precio: "€€",
      valoracion: 4.7,
      imagen:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      horario: "12:00 - 23:00",
      especialidad: "Arrossos",
    },
    {
      id: 102,
      nombre: "El Celler",
      tipo: "Català",
      zona: "Girona",
      precio: "€€€",
      valoracion: 4.9,
      imagen:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      horario: "13:00 - 22:30",
      especialidad: "Alta cuina",
    },
    {
      id: 103,
      nombre: "Taverna del Mar",
      tipo: "Mediterrani",
      zona: "Costa Brava",
      precio: "€€",
      valoracion: 4.5,
      imagen:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1474&q=80",
      horario: "12:30 - 23:30",
      especialidad: "Peix fresc",
    },
    {
      id: 104,
      nombre: "Can Roca",
      tipo: "Català",
      zona: "Girona",
      precio: "€€€€",
      valoracion: 5.0,
      imagen:
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      horario: "13:00 - 15:30, 20:00 - 22:30",
      especialidad: "Cuina d'autor",
    },
    {
      id: 105,
      nombre: "La Boqueria",
      tipo: "Tapes",
      zona: "Barcelona",
      precio: "€€",
      valoracion: 4.6,
      imagen:
        "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
      horario: "09:00 - 23:00",
      especialidad: "Tapes variades",
    },
    {
      id: 106,
      nombre: "Montserrat",
      tipo: "Tradicional",
      zona: "Barcelona",
      precio: "€€",
      valoracion: 4.4,
      imagen:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
      horario: "12:00 - 22:00",
      especialidad: "Cuina tradicional",
    },
  ];

  useEffect(() => {
    const fetchWineTypes = async () => {
      try {
        const response = await fetch(`${apiUrl}/v1/winetypes`);
        const data = await response.json();
        setWineTypes(data);
      } catch (error) {
        console.error("Error fetching wine types:", error);
      }
    };
    fetchWineTypes();
  }, []);

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
  ];

  // Wineries data
  const wineries = [
    { id: 1, nombre: "Nom Marca 1" },
    { id: 2, nombre: "Nom Marca 2" },
    { id: 3, nombre: "Nom Marca 3" },
    { id: 4, nombre: "Nom Marca 4" },
    { id: 5, nombre: "Nom Marca 5" },
  ];

  // Zones data
  const zones = [
    { id: 1, nombre: "Barcelona" },
    { id: 2, nombre: "Girona" },
    { id: 3, nombre: "Costa Brava" },
    { id: 4, nombre: "Tarragona" },
    { id: 5, nombre: "Lleida" },
  ];

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    // Filter by wine type
    if (selectedType && product.wine_type !== selectedType) {
      // Cambiado a 'wine_type'
      return false;
    }

    // Filter by price range
    if (
      product.price_demanded < priceRange[0] ||
      product.price_demanded > priceRange[1]
    ) {
      // Cambiado a 'price_demanded'
      return false;
    }

    // Filter by winery (usaremos origin como bodega)
    if (
      selectedWineries.length > 0 &&
      !selectedWineries.includes(product.origin)
    ) {
      // Cambiado a 'origin'
      return false;
    }

    return true;
  });

  // Filter restaurants
  const filteredRestaurants = allRestaurants.filter((restaurant) => {
    // Filter by cuisine type
    if (selectedRestaurantType && restaurant.tipo !== selectedRestaurantType) {
      return false;
    }

    // Filter by zone
    if (selectedZones.length > 0 && !selectedZones.includes(restaurant.zona)) {
      return false;
    }

    return true;
  });

  // Handle accordion toggle
  const toggleAccordion = (section) => {
    setOpenAccordion({
      ...openAccordion,
      [section]: !openAccordion[section],
    });
  };

  // Handle favorites toggle
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Handle winery toggle
  const toggleWinery = (name) => {
    if (selectedWineries.includes(name)) {
      setSelectedWineries(selectedWineries.filter((b) => b !== name));
    } else {
      setSelectedWineries([...selectedWineries, name]);
    }
  };

  // Handle zone toggle
  const toggleZone = (name) => {
    if (selectedZones.includes(name)) {
      setSelectedZones(selectedZones.filter((z) => z !== name));
    } else {
      setSelectedZones([...selectedZones, name]);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero section with background image */}
          <div className="relative mb-12 rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#800020]/90 to-black/70 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Wine background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-20 flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
              <div className="text-white mb-6 md:mb-0 md:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Descobreix els millors productes
                </h1>
                <p className="text-gray-200 text-lg max-w-xl">
                  Explora la nostra selecció de vins i restaurants de qualitat
                  superior. Filtres personalitzats per trobar exactament el que
                  busques.
                </p>
              </div>
              <div className="flex flex-col space-y-4 md:w-1/3">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">
                      Selecciona categoria
                    </h2>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className={`flex-1 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${
                        activeFilter === "Productors"
                          ? "bg-white text-[#800020] shadow-lg"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                      onClick={() => setActiveFilter("Productors")}
                    >
                      Productors
                    </button>
                    <button
                      className={`flex-1 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${
                        activeFilter === "Restaurants"
                          ? "bg-white text-[#800020] shadow-lg"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                      onClick={() => setActiveFilter("Restaurants")}
                    >
                      Restaurants
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
                showFilters
                  ? "opacity-100"
                  : "opacity-0 md:opacity-100 h-0 md:h-auto overflow-hidden"
              }`}
            >
              <div className="sticky top-4 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 bg-[#800020] text-white flex justify-between items-center">
                  <h3 className="font-medium">Filtres</h3>
                  <button
                    className="md:hidden"
                    onClick={() => setShowFilters(false)}
                  >
                    <X size={18} />
                  </button>
                </div>

                {activeFilter === "Productors" ? (
                  <div className="p-4 space-y-4">
                    {/* Product types */}
                    <div className="border-b border-gray-100 pb-4">
                      <button
                        className="w-full flex justify-between items-center mb-2"
                        onClick={() => toggleAccordion("tipo")}
                      >
                        <h3 className="font-medium text-gray-800">
                          Tipus de producte
                        </h3>
                        {openAccordion.tipo ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                      {openAccordion.tipo && (
                        <div className="space-y-2 mt-3">
                          {wineTypes.map((type) => (
                            <div
                              key={type.id}
                              className="rounded-lg p-4 relative bg-cover bg-center bg-no-repeat"
                              style={{
                                backgroundImage: `url(${
                                  type.image || "/placeholder.svg"
                                })`,
                                minHeight: "80px",
                              }}
                            >
                              <div className="absolute inset-0 bg-black/20 rounded-lg"></div>

                              <button
                                className={`w-full relative z-10 ${
                                  selectedType === type.name
                                    ? "bg-[#800020]/80 text-white font-medium"
                                    : "bg-white/70 hover:bg-white"
                                } rounded-lg p-2 flex items-center gap-3 transition-colors`}
                                onClick={() => setSelectedType(type.name)}
                              >
                                <span className="text-sm">{type.name}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="border-b border-gray-100 pb-4">
                      <button
                        className="w-full flex justify-between items-center mb-2"
                        onClick={() => toggleAccordion("precio")}
                      >
                        <h3 className="font-medium text-gray-800">Preu</h3>
                        {openAccordion.precio ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                      {openAccordion.precio && (
                        <div className="px-1 pt-4">
                          <div className="relative">
                            <input
                              type="range"
                              min="0"
                              max="200"
                              value={priceRange[1]}
                              onChange={(e) =>
                                setPriceRange([
                                  priceRange[0],
                                  Number.parseInt(e.target.value),
                                ])
                              }
                              className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#800020]"
                            />
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                              <span>{priceRange[0]},00 €</span>
                              <span>{priceRange[1]},00 € o més</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Winery */}
                    <div>
                      <button
                        className="w-full flex justify-between items-center mb-2"
                        onClick={() => toggleAccordion("bodega")}
                      >
                        <h3 className="font-medium text-gray-800">Bodega</h3>
                        {openAccordion.bodega ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                      {openAccordion.bodega && (
                        <div className="space-y-2 mt-2">
                          {wineries.map((winery) => (
                            <label
                              key={winery.id}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedWineries.includes(
                                  winery.nombre
                                )}
                                onChange={() => toggleWinery(winery.nombre)}
                                className="w-4 h-4 rounded border-gray-300 text-[#800020] focus:ring-[#800020]"
                              />
                              <span className="text-sm text-gray-700">
                                {winery.nombre}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {/* Cuisine types */}
                    <div className="border-b border-gray-100 pb-4">
                      <button
                        className="w-full flex justify-between items-center mb-2"
                        onClick={() => toggleAccordion("cocina")}
                      >
                        <h3 className="font-medium text-gray-800">
                          Tipus de cuina
                        </h3>
                        {openAccordion.cocina ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                      {openAccordion.cocina && (
                        <div className="space-y-2 mt-3">
                          {cuisineTypes.map((type) => (
                            <button
                              key={type.id}
                              className={`w-full ${
                                selectedRestaurantType === type.nombre
                                  ? "bg-[#800020]/10 text-[#800020] font-medium"
                                  : "hover:bg-gray-50"
                              } rounded-lg p-2 flex items-center gap-3 transition-colors`}
                              onClick={() =>
                                setSelectedRestaurantType(type.nombre)
                              }
                            >
                              <div className="w-8 h-8 relative flex-shrink-0">
                                <img
                                  src={type.imagen || "/placeholder.svg"}
                                  alt={type.nombre}
                                  className="w-8 h-8 object-contain"
                                />
                              </div>
                              <span className="text-sm">{type.nombre}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Zone */}
                    <div>
                      <button
                        className="w-full flex justify-between items-center mb-2"
                        onClick={() => toggleAccordion("zona")}
                      >
                        <h3 className="font-medium text-gray-800">Zona</h3>
                        {openAccordion.zona ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                      {openAccordion.zona && (
                        <div className="space-y-2 mt-2">
                          {zones.map((zone) => (
                            <label
                              key={zone.id}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedZones.includes(zone.nombre)}
                                onChange={() => toggleZone(zone.nombre)}
                                className="w-4 h-4 rounded border-gray-300 text-[#800020] focus:ring-[#800020]"
                              />
                              <span className="text-sm text-gray-700">
                                {zone.nombre}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products/Restaurants Grid */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {activeFilter === "Productors"
                      ? "Productes Populars"
                      : "Restaurants Recomanats"}
                  </h2>
                  <button
                    className="md:hidden flex items-center gap-2 text-sm font-medium text-[#800020] bg-[#800020]/10 px-4 py-2 rounded-lg"
                    onClick={() => setShowFilters(true)}
                  >
                    <Filter size={16} />
                    Filtres
                  </button>
                </div>
              </div>

              {activeFilter === "Productors" ? (
                // Products
                filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        producto={product}
                        esFavorito={favorites.includes(product.id)}
                        onToggleFavorito={() => toggleFavorite(product.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <X size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">
                      No s'han trobat productes amb els filtres seleccionats.
                    </p>
                    <button
                      className="text-[#800020] font-medium hover:underline"
                      onClick={() => {
                        setSelectedType("Vi negre");
                        setPriceRange([5, 200]);
                        setSelectedWineries(["Nom Marca 2", "Nom Marca 5"]);
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
                      onToggleFavorito={() => toggleFavorite(restaurant.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <X size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">
                    No s'han trobat restaurants amb els filtres seleccionats.
                  </p>
                  <button
                    className="text-[#800020] font-medium hover:underline"
                    onClick={() => {
                      setSelectedRestaurantType("Mediterrani");
                      setSelectedZones(["Barcelona", "Girona"]);
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
  );
}

// Product card component
function ProductCard({ producto, esFavorito, onToggleFavorito }) {
  const baseUrl = import.meta.env.VITE_URL_BASE;
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300">
      <div className="relative h-56">
        <img
          src={`${baseUrl}${producto.image}` || "/placeholder.svg"}
          alt={producto.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <button
            className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorito();
            }}
          >
            <Heart
              className={`w-5 h-5 ${
                esFavorito ? "fill-[#800020] text-[#800020]" : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-white font-medium">
            €{producto.price_demanded}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-800 mb-1">{producto.name}</h3>
            <p className="text-gray-500 text-sm">{producto.origin}</p>
          </div>
          <div className="bg-[#800020]/10 text-[#800020] text-xs font-medium px-2 py-1 rounded">
            {producto.year}
          </div>
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-3">
          <span className="inline-block px-2 py-1 bg-gray-100 rounded-full mr-2">
            {producto.wine_type}
          </span>
          <span className="inline-block px-2 py-1 bg-gray-100 rounded-full">
            {producto.origin}
          </span>
        </div>
      </div>
    </div>
  );
}

// Restaurant card component
function RestaurantCard({ restaurante, esFavorito, onToggleFavorito }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300">
      <div className="relative h-56">
        <img
          src={restaurante.imagen || "/placeholder.svg"}
          alt={restaurante.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <button
            className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorito();
            }}
          >
            <Heart
              className={`w-5 h-5 ${
                esFavorito ? "fill-[#800020] text-[#800020]" : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(restaurante.valoracion)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-white text-xs ml-1">
              {restaurante.valoracion}
            </span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800">{restaurante.nombre}</h3>
          <div className="text-gray-500 text-sm">{restaurante.precio}</div>
        </div>
        <p className="text-[#800020] text-sm font-medium mb-3">
          {restaurante.tipo}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{restaurante.zona}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{restaurante.horario}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-700">
            Especialitat:{" "}
            <span className="text-[#800020]">{restaurante.especialidad}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
