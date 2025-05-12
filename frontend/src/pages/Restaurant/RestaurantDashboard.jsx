"use client"

import { useState, useEffect } from "react"
import { useFetchUser } from "@components/auth/FetchUser"
import { primaryColors } from "@/components/restaurant/utils/colors"
import { RequestStats } from "@/components/restaurant/RequestStats"
import { FilterButtons } from "@/components/restaurant/FilterButtons"
import { RestaurantTable } from "@/components/restaurant/RestaurantTable"
import { WineTypeDistribution } from "@/components/restaurant/WineTypeDistribution"
import { Notification } from "@/components/restaurant/Notification"
import { DeleteRequestModal } from "@/components/restaurant/modals/DeleteRequestModal"
import { EditRequestModal } from "@/components/restaurant/modals/EditRequestModal"
import { getCookie } from "@/utils/utils"

function RestaurantDashboardComponent() {
  const [requests, setRequests] = useState([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [receivingProduct, setReceivingProduct] = useState(null)
  const [sellingProduct, setSellingProduct] = useState(null)
  const [notification, setNotification] = useState(null)

  // Estados para los modales
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [offerPrice, setOfferPrice] = useState("")
  const [requestStatus, setRequestStatus] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL
  const baseUrl = import.meta.env.VITE_URL_BASE

  const { user, loading: userLoading } = useFetchUser()

  useEffect(() => {
    fetchRequests()
  }, [user])

  const fetchRequests = async () => {
    if (userLoading || !user) return // Wait until user is loaded

    try {
      setIsLoading(true)
      const response = await fetch(`${apiUrl}/v1/${user.id}/restaurant`)

      if (!response.ok) {
        throw new Error("No s'ha pogut connectar amb el servidor")
      }

      const data = await response.json()
      setRequests(Array.isArray(data) ? data : [data])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconegut")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para abrir el modal de eliminación
  const openDeleteModal = (id) => {
    setSelectedRequestId(id)
    setIsDeleteDialogOpen(true)
  }

  // Función para abrir el modal de edición
  const openEditModal = (request) => {
    setSelectedRequestId(request.id)
    setOfferPrice(request.price_restaurant.toString())
    setSelectedProduct(request.product)
    setIsRequestOpen(true)
  }

  // Handle request deletion
  const handleDeleteRequest = async () => {
    if (!selectedRequestId) return

    try {
      const response = await fetch(`${apiUrl}/v1/restaurant/${selectedRequestId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${getCookie("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("No s'ha pogut eliminar la sol·licitud")
      }

      // Remove the deleted request from state
      setRequests(requests.filter((request) => request.id !== selectedRequestId))

      // Mostrar notificación de éxito
      setNotification({ type: "success", message: "Sol·licitud eliminada correctament" })
      setTimeout(() => setNotification(null), 3000)
    } catch (err) {
      setNotification({ type: "error", message: err.message })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedRequestId(null)
    }
  }

  // Handle request update
  const handleRequestSubmit = async () => {
    // Validar que el precio sea válido
    if (!offerPrice || isNaN(parseFloat(offerPrice)) || parseFloat(offerPrice) <= 0) {
      setRequestStatus("error")
      return
    }

    try {
      // Enviamos solo el precio actualizado
      const response = await fetch(`${apiUrl}/v1/restaurants/${selectedRequestId}?price_restaurant=${offerPrice}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${getCookie("token")}`,
        }
      })

      if (!response.ok) {
        throw new Error("No s'ha pogut actualitzar la sol·licitud")
      }

      // Actualizar el estado local
      setRequests(
        requests.map((request) =>
          request.id === selectedRequestId
            ? { ...request, price_restaurant: parseFloat(offerPrice) }
            : request
        )
      )

      // Actualizar el estado
      setRequestStatus("success")

      // Cerrar el modal después de 2 segundos
      setTimeout(() => {
        setIsRequestOpen(false)
        setRequestStatus(null)
        setOfferPrice("")
        setSelectedProduct(null)
        setSelectedRequestId(null)
      }, 2000)

    } catch (err) {
      console.error(err.message)
      setRequestStatus("error")
    }
  }
  // Handle receiving product
  const handleReceiveProduct = async (productId) => {
    // Verificación simple del ID
    if (!productId) {
      setNotification({ type: "error", message: "ID de producto no válido" })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    try {
      // Marcar como recibiendo
      setReceivingProduct(productId)

      // URL del endpoint
      const url = `${apiUrl}/v1/logistic/${productId}/deliver`

      // Realizar la petición POST
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      // Procesar la respuesta
      if (!response.ok) {
        throw new Error("Error al marcar com rebut")
      }

      // Actualizar el estado local
      setRequests(
        requests.map((request) => (request.product.id === productId ? { ...request, status: "in_my_local" } : request)),
      )

      // Mostrar notificación de éxito
      setNotification({ type: "success", message: "Producte rebut correctament" })
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      // console.error("Error:", error)
      setNotification({ type: "error", message: error.message })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setReceivingProduct(null)
    }
  }

  // Handle selling product
  const handleSellProduct = async (productId) => {
    // Verificación simple del ID
    if (!productId) {
      setNotification({ type: "error", message: "ID de producto no válido" })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    try {
      // Marcar como vendiendo
      setSellingProduct(productId)

      // URL del endpoint
      const url = `${apiUrl}/v1/logistic/${productId}/sell`

      // Realizar la petición POST
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      // Procesar la respuesta
      if (!response.ok) {
        throw new Error("Error al marcar com venut")
      }

      // Actualizar el estado local
      setRequests(
        requests.map((request) => (request.product.id === productId ? { ...request, status: "sold" } : request)),
      )

      // Mostrar notificación de éxito
      setNotification({ type: "success", message: "Producte venut correctament" })
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      // console.error("Error:", error)
      setNotification({ type: "error", message: error.message })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setSellingProduct(null)
    }
  }

  // Request statistics
  const stats = {
    total: requests.length,
    pending: requests.filter((request) => request.status === "pending").length,
    accepted: requests.filter((request) => request.status === "accepted" || request.status === "in_transit").length,
    in_my_local: requests.filter((request) => request.status === "in_my_local").length,
    sold: requests.filter((request) => request.status === "sold").length,
  }

  if (userLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="w-12 h-12 rounded-full animate-spin"
          style={{
            borderWidth: "4px",
            borderStyle: "solid",
            borderColor: primaryColors.light,
            borderTopColor: primaryColors.dark,
          }}
        ></div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="bg-white text-center p-8 rounded-xl shadow-sm"
        style={{
          borderLeft: `4px solid ${primaryColors.dark}`,
          color: primaryColors.dark,
        }}
      >
        {error}
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />

      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          Gestiona les teves Sol·licituds
        </h1>
      </div>

      {/* Statistics */}
      <RequestStats stats={stats} />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Request table */}
        <div className="lg:col-span-3">
          <RestaurantTable
            requests={requests}
            baseUrl={baseUrl}
            onDelete={openDeleteModal} // Cambiado para abrir el modal
            onEdit={openEditModal} // Nuevo prop para editar
            handleReceiveProduct={handleReceiveProduct}
            handleSellProduct={handleSellProduct}
            receivingProduct={receivingProduct}
            sellingProduct={sellingProduct}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

        {/* Wine type distribution */}
        <div className="lg:col-span-1">
          <WineTypeDistribution requests={requests} />
        </div>
      </div>

      {/* Modal de eliminación */}
      <DeleteRequestModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteRequest}
      />

      {/* Modal de edición */}
      <EditRequestModal
        isOpen={isRequestOpen}
        onClose={() => {
          setIsRequestOpen(false);
          setRequestStatus(null);
          setOfferPrice("");
          setSelectedProduct(null);
        }}
        onSubmit={handleRequestSubmit}
        offerPrice={offerPrice}
        setOfferPrice={setOfferPrice}
        product={selectedProduct || {}}
        requestStatus={requestStatus}
      />
    </div>
  )
}

export default function RestaurantDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <div
          className="flex-1 md:ml-64 p-8 overflow-y-auto pb-16"
          style={{ backgroundColor: primaryColors.background }}
        >
          <RestaurantDashboardComponent />
        </div>
      </div>
    </div>
  )
}

