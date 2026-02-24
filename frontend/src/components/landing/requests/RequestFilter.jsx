export default function RequestFilter({ filterOptions, handleFilterChange, resetFilters }) {
  return (
    <div className="bg-white p-5 rounded-lg mb-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-[#9A3E50]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filtrar sol·licituds
        </h3>
        <button
          onClick={resetFilters}
          className="text-sm text-[#9A3E50] hover:text-[#7e3241] transition-colors flex items-center"
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
          Restablir
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Rang de preu</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="number"
                name="minPrice"
                value={filterOptions.minPrice}
                onChange={handleFilterChange}
                placeholder="Mínim"
                className="w-full rounded-md border border-gray-300 py-2.5 pl-8 pr-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
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
                placeholder="Màxim"
                className="w-full rounded-md border border-gray-300 py-2.5 pl-8 pr-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                €
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Rang de quantitat</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="number"
                name="minQuantity"
                value={filterOptions.minQuantity}
                onChange={handleFilterChange}
                placeholder="Mínim"
                className="w-full rounded-md border border-gray-300 py-2.5 pl-3 pr-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
              />
            </div>
            <div className="relative">
              <input
                type="number"
                name="maxQuantity"
                value={filterOptions.maxQuantity}
                onChange={handleFilterChange}
                placeholder="Màxim"
                className="w-full rounded-md border border-gray-300 py-2.5 pl-3 pr-3 text-sm focus:border-[#9A3E50] focus:outline-none focus:ring-1 focus:ring-[#9A3E50] transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}