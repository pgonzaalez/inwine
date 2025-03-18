export const WineTypeSelector = ({ wineTypes, selectedTypeId, onSelect, error }) => {
  return (
    <div className="flex flex-col justify-between bg-white rounded-lg shadow-md">
      <div className="w-full bg-gradient-to-r from-[#F5E6E8] to-[#E8D5D5] p-4 rounded-t-lg border-b border-gray-200">
        <h2 className="text-lg font-semibold text-[#8C2E2E]">Tria la categoria</h2>
        <p className="text-sm text-gray-600">Selecciona una opció d'aquest vins per escollir la categoria</p>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {wineTypes.map((wine) => (
            <div
              key={wine.id}
              onClick={() => onSelect(wine.id)}
              className={`cursor-pointer border p-4 rounded-lg transition-all ${selectedTypeId === wine.id.toString()
                  ? "bg-[#F5E6E8] border-[#9A3E50] shadow-md"
                  : "border-gray-300 hover:border-[#D9A5AD] hover:shadow-sm"
                }`}
            >
              <div className="relative">
                <img
                  src={wine.image || "/placeholder.svg"}
                  alt={wine.name}
                  className="w-full h-20 object-cover mb-1 rounded"
                />
                {selectedTypeId === wine.id.toString() && (
                  <div className="absolute top-1 right-1 bg-[#9A3E50] text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="text-center text-xs font-medium mt-2">{wine.name}</div>
            </div>
          ))}
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

