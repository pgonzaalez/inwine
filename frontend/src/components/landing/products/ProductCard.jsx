import { Heart, Store, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProductCard({
  producto,
  esFavorito,
  onToggleFavorito,
}) {
  const { t } = useTranslation();
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
        {producto.requests_restaurant_count > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-white/90 backdrop-blur-sm text-[#9A3E50] text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 flex items-center gap-1.5 rounded-full shadow-sm border border-[#9A3E50]/10">
              <Bell className="w-3.5 h-3.5 fill-[#9A3E50]" />
              <span>{producto.requests_restaurant_count} {t("landing.products.product_card.requests")}</span>
            </div>
          </div>
        )}
        <img
          src={producto.image ? `${baseUrl}${producto.image}` : "/placeholder.svg"}
          alt={producto.name || t("landing.products.product_card.alt")}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 z-20">
          <button
            type="button"
            className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Product clicked for toggle:", producto.id, "esFavorito:", esFavorito);
              if (onToggleFavorito && producto.id) {
                onToggleFavorito(String(producto.id));
              }
            }}
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-200 ${
                esFavorito ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-800 text-lg truncate">
            {producto.name || t("landing.products.product_card.no_name")}
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
          <p className="text-xs">{t("landing.products.product_card.quantity")}: {producto.quantity || 1}</p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <Store className="w-3 h-3 text-[#9A3E50]" /> {producto.user_id || "N/A"}
          </p>
          
        </div>
      </div>
    </div>
  );
}
