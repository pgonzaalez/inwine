import { Heart, Store } from "lucide-react";

export default function ProductCard({
  producto,
  esFavorito,
  onToggleFavorito,
}) {
  const baseUrl = import.meta.env.VITE_URL_BASE || "http://localhost:8000";

  if (!producto) return null;

  const formatPrice = (price) =>
    new Intl.NumberFormat("ca-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);

  const getWineTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "negre":
        return "bg-red-900";
      case "blanc":
        return "bg-yellow-100";
      case "rossat":
        return "bg-pink-300";
      case "espumós":
        return "bg-blue-100";
      case "dolç":
        return "bg-amber-300";
      default:
        return "bg-gray-200";
    }
  };

  const getTextColor = (type) =>
    ["blanc", "espumós"].includes(type?.toLowerCase())
      ? "text-gray-800"
      : "text-white";

  return (
    <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300" style={{ width: "300px" }}>
   <div className="relative h-64 sm:h-72">
        <img
          src={producto.image ? `${baseUrl}${producto.image}` : "/placeholder.svg"}
          alt={producto.name || "Vino"}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <button
            className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorito(producto.name);
            }}
          >
            <Heart
              className={`w-5 h-5 ${
                esFavorito ? "fill-[#9A3E50] text-[#9A3E50]" : "text-gray-400"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-800 text-lg truncate">
            {producto.name || "Sin nombre"}
          </h3>
          <div className="bg-[#9A3E50] text-white font-bold px-3 py-1 rounded ml-2 min-w-[80px] text-center">
            {formatPrice(producto.price_demanded || 0)}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {producto.year && (
            <div className="bg-[#9A3E50]/10 text-[#9A3E50] text-xs font-medium px-2 py-1 rounded">
              {producto.year}
            </div>
          )}
          {producto.wine_type && (
            <div
              className={`${getWineTypeColor(producto.wine_type)} ${getTextColor(
                producto.wine_type
              )} text-xs font-medium px-2 py-1 rounded`}
            >
              {producto.wine_type}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-5 text-gray-500 text-sm">
          <p className="flex items-center gap-1">
            <img src="https://flagcdn.com/16x12/es.png" alt="D.O." /> D.O. {producto.origin || "N/A"}
          </p>
          <p className="text-xs">Quantitat: {producto.quantity || 1}</p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <Store className="w-3 h-3 text-[#9A3E50]" /> {producto.user_id || "N/A"}
          </p>
          {producto.requests_restaurant_count > 0 && (
            <div className="inline-flex items-center bg-black text-white text-xs font-medium py-1 pl-3 pr-5 [clip-path:polygon(0_0,calc(100%_-_8px)_0,100%_50%,calc(100%_-_8px)_100%,0_100%)]">
              {producto.requests_restaurant_count} peticions
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
