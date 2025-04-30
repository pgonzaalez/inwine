"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Trash2, AlertTriangle } from "lucide-react";

export function DeleteProductModal({ isOpen, onClose, onConfirm }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          {/* Overlay de fondo */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          {/* Este elemento es para centrar el modal verticalmente */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          {/* Contenido del modal */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="px-6 pt-6 pb-4">
                {/* Icono y título */}
                <div className="flex flex-col items-center sm:items-start">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                    <Trash2 className="h-8 w-8 text-red-500" />
                  </div>
                  <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900 text-center sm:text-left">
                    ¿Estás seguro de que deseas eliminar este producto?
                  </Dialog.Title>
                  <div className="mt-2 text-gray-500 text-center sm:text-left">
                    Esta acción no se puede deshacer. El producto será eliminado permanentemente.
                  </div>
                </div>
              </div>

              {/* Línea separadora */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

              {/* Advertencia */}
              <div className="flex items-start rounded-lg bg-amber-50 p-4 mx-6 mt-4">
                <AlertTriangle className="mr-3 h-5 w-5 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  Al eliminar el producto, tendrás que volver a agregarlo si deseas venderlo nuevamente.
                </p>
              </div>

              {/* Botones */}
              <div className="px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  className="flex items-center justify-center rounded-md bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-medium text-white hover:from-red-600 hover:to-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}