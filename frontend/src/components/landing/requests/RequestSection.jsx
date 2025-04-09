import { useState, useRef, useEffect } from "react"
import { ShoppingCart, ChevronUp, ChevronDown, Filter, Plus } from "lucide-react"
import RequestCard from "./RequestCard"

export default function RequestsSection({ requests, productPrice }) {
  const [isRequestsExpanded, setIsRequestsExpanded] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    minPrice: "",
    maxPrice: "",
    minQuantity: "",
    maxQuantity: "",
  })
  const [filteredRequests, setFilteredRequests] = useState([])
  const [visibleRequestsCount, setVisibleRequestsCount] = useState(5) // Número de solicitudes visibles inicialmente

  // Refs for scroll animation
  const requestsSectionRef = useRef(null)
  const loadMoreButtonRef = useRef(null)

  // Filter requests based on filter options
  useEffect(() => {
    if (!requests.length) {
      setFilteredRequests([])
      return
    }

    // Solo mostrar solicitudes pendientes
    let filtered = requests.filter((request) => request.status === "pending")

    // Filter by price range
    if (filterOptions.minPrice) {
      filtered = filtered.filter((request) => request.price_restaurant >= Number(filterOptions.minPrice))
    }
    if (filterOptions.maxPrice) {
      filtered = filtered.filter((request) => request.price_restaurant <= Number(filterOptions.maxPrice))
    }

    // Filter by quantity range
    if (filterOptions.minQuantity) {
      filtered = filtered.filter((request) => request.quantity >= Number(filterOptions.minQuantity))
    }
    if (filterOptions.maxQuantity) {
      filtered = filtered.filter((request) => request.quantity <= Number(filterOptions.maxQuantity))
    }

    setFilteredRequests(filtered)
    // Resetear el contador de solicitudes visibles cuando cambian los filtros
    setVisibleRequestsCount(5)
  }, [requests, filterOptions])

  // Toggle requests section and scroll to it if expanding
  const toggleRequestsSection = () => {
    setIsRequestsExpanded(!isRequestsExpanded)

    if (!isRequestsExpanded && requestsSectionRef.current) {
      // Small delay to allow state to update before scrolling
      setTimeout(() => {
        requestsSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilterOptions((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetFilters = () => {
    setFilterOptions({
      minPrice: "",
      maxPrice: "",
      minQuantity: "",
      maxQuantity: "",
    })
  }

  // Función para cargar más solicitudes
  const loadMoreRequests = () => {
    setVisibleRequestsCount((prev) => prev + 5)

    // Scroll al botón de cargar más para que el usuario vea las nuevas solicitudes
    setTimeout(() => {
      if (loadMoreButtonRef.current) {
        loadMoreButtonRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }, 100)
  }

  // Contar solo las solicitudes pendientes para el contador
  const pendingRequestsCount = requests.filter((request) => request.status === "pending").length

  // Obtener solo las solicitudes visibles
  const visibleRequests = filteredRequests.slice(0, visibleRequestsCount)

  // Determinar si hay más solicitudes para cargar
  const hasMoreRequests = visibleRequestsCount < filteredRequests.length

  if (pendingRequestsCount === 0) {
    return null
  }

  return (
    <section className="mb-16">
      {/* Collapsible header */}
      <div
        onClick={toggleRequestsSection}
        className="bg-gradient-to-r from-[#9A3E50]/5 to-gray-50 rounded-t-xl p-5 flex justify-between items-center cursor-pointer hover:from-[#9A3E50]/10 transition-colors border-b border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="bg-[#9A3E50]/10 p-2 rounded-full mr-3">
            <ShoppingCart className="text-[#9A3E50]" />
          </div>
          Sol·licituds pendents
          <span className="ml-2 bg-[#9A3E50] text-white text-sm py-0.5 px-2 rounded-full flex items-center">
            {filteredRequests.length}
            <span className="text-white/70 mx-1">/</span>
            {pendingRequestsCount}
          </span>
        </h2>
        <button className="text-gray-700 hover:text-[#9A3E50] transition-colors bg-white rounded-full p-2 shadow-sm hover:shadow flex items-center justify-center">
          {isRequestsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Collapsible content - New layout with filter on left and requests on right */}
      <div
        ref={requestsSectionRef}
        className={`bg-gray-50 rounded-b-xl overflow-hidden transition-all duration-500 ease-in-out ${
          isRequestsExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column - Filters */}
            <div className="w-full md:w-1/4 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-[#9A3E50]" />
                    Filtres seleccionats
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Price range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rang de preu</label>
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type="number"
                            name="minPrice"
                            value={filterOptions.minPrice}
                            onChange={handleFilterChange}
                            placeholder="Preu mínim"
                            className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
                          />
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            €
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            name="maxPrice"
                            value={filterOptions.maxPrice}
                            onChange={handleFilterChange}
                            placeholder="Preu màxim"
                            className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
                          />
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            €
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quantity range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rang de quantitat</label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          name="minQuantity"
                          value={filterOptions.minQuantity}
                          onChange={handleFilterChange}
                          placeholder="Quantitat mínima"
                          className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
                        />
                        <input
                          type="number"
                          name="maxQuantity"
                          value={filterOptions.maxQuantity}
                          onChange={handleFilterChange}
                          placeholder="Quantitat màxima"
                          className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Reset button */}
                    <div className="pt-2">
                      <button
                        onClick={resetFilters}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors text-sm"
                      >
                        Restablir filtres
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Request cards */}
            <div className="w-full md:w-3/4">
              {filteredRequests.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">
                        {filteredRequests.length} {filteredRequests.length === 1 ? "sol·licitud" : "sol·licituds"}{" "}
                        {filterOptions.minPrice ||
                        filterOptions.maxPrice ||
                        filterOptions.minQuantity ||
                        filterOptions.maxQuantity
                          ? "filtrades"
                          : "pendents"}
                      </h3>
                      <div className="text-sm text-gray-500">
                        Mostrant {Math.min(visibleRequestsCount, filteredRequests.length)} de {filteredRequests.length}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {visibleRequests.map((request, index) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        index={index}
                        productPrice={productPrice}
                        isRequestsExpanded={isRequestsExpanded}
                      />
                    ))}
                  </div>

                  {/* Botón de cargar más */}
                  {hasMoreRequests && (
                    <div ref={loadMoreButtonRef} className="flex justify-center mt-6">
                      <button
                        onClick={loadMoreRequests}
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md font-medium flex items-center transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2 text-[#9A3E50]" />
                        Carregar més
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg mb-2">No s'han trobat sol·licituds amb els filtres aplicats</p>
                  <button
                    onClick={resetFilters}
                    className="mt-2 text-[#9A3E50] hover:text-[#7e3241] transition-colors inline-flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Restablir filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for animations as a regular style tag */}
      <style>
        {`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filter-appear {
          animation: filterAppear 0.3s ease forwards;
        }

        @keyframes filterAppear {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        `}
      </style>
    </section>
  )
}