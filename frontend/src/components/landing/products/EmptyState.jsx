import { Store, MapPin, RefreshCw } from "lucide-react"
import { useTranslation } from "react-i18next";

export default function EmptyState({ type, resetFilters }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-md p-12 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        {type === "products" ? (
          <Store className="w-10 h-10 text-gray-400" />
        ) : (
          <MapPin className="w-10 h-10 text-gray-400" />
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {type === "products"
          ? t("landing.products.empty.no_products")
          : t("landing.products.empty.no_restaurants")}
      </h3>
      <p className="text-gray-500 mb-8 max-w-sm">
        {t("landing.products.empty.reset")}
      </p>
      <button
        onClick={resetFilters}
        className="flex items-center gap-2 bg-[#9A3E50] text-white px-6 py-3 rounded-full font-medium hover:bg-[#823443] transition-colors shadow-lg"
      >
        <RefreshCw size={18} />
        {t("landing.products.btn_reset")}
      </button>
    </div>
  )
}
