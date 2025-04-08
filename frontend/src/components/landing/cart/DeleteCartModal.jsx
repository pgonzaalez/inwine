"use client"

import { AlertTriangle, Trash2 } from "lucide-react"

export function DeleteCartModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md shadow-lg max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold">Vols esborrar tot?</h3>
          </div>

          <p className="text-gray-600 mb-6">Esborraras tota la teva cistella. Estàs segur?</p>

          <div className="flex items-start rounded-lg bg-amber-50 p-4 mb-6">
            <AlertTriangle className="mr-3 h-5 w-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              Al esborrar la cistella, tindràs que tornar a afegir totes les sol·licituds dels restaurants.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel·lar
            </button>
            <button
              onClick={onConfirm}
              className="flex items-center justify-center rounded-md bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-medium text-white hover:from-red-600 hover:to-red-700 transition-colors"
            >
              Esborrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
