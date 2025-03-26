import { X } from "lucide-react"

export default function EmptyState({ type, resetFilters }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <X size={24} className="text-gray-400" />
      </div>
      <p className="text-gray-500 mb-4">
        {type === "products"
          ? "No s'han trobat productes amb els filtres seleccionats."
          : "No s'han trobat restaurants amb els filtres seleccionats."}
      </p>
      <button className="text-[#9A3E50] font-medium hover:underline" onClick={resetFilters}>
        Restablir filtres
      </button>
    </div>
  )
}

