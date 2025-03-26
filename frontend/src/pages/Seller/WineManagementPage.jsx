"use client"
import { useFetchUser } from "@components/auth/FetchUser"
import { useState, useEffect } from "react"
import { WineStats } from "@components/seller/WineStats"
import { FilterBar } from "@components/seller/wineManagement/FilterBar"
import { Notification } from "@components/seller/wineManagement/Notification"
import { WineTable } from "@components/seller/wineManagement/WineTable"
import { WineTypeDistribution } from "@components/seller/wineManagement/WineTypeDistribution"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

function WineManagementComponent() {
  const [wines, setWines] = useState([])
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [sendingProduct, setSendingProduct] = useState(null)
  const { user } = useFetchUser()
  const apiUrl = import.meta.env.VITE_API_URL
  const baseUrl = import.meta.env.VITE_URL_BASE

  // Implementación simple de alertas
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    fetchWines()
  }, [user])

  const fetchWines = async () => {
    if (!user) return
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/v1/${user.id}/products`)
      if (!response.ok) {
        throw new Error("No s'ha pogut connectar amb el servidor")
      }
      const data = await response.json()
      if (data) {
        setWines(Array.isArray(data) ? data : [data])
      } else {
        setWines([])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSendProduct = async (productId) => {
  if (!productId) {
    console.error("No se proporcionó ID de producto");
    return;
  }

  console.log("Enviando producto con ID:", productId);

  try {
    setSendingProduct(productId);

    // Construir la URL completa
    const url = `${apiUrl}/v1/logistic/${productId}/send`;
    console.log("URL de la petición:", url);
    // Hacer la petición directamente con fetch
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("Respuesta recibida:", response);

    // Intentar parsear la respuesta como JSON
    let data;
    try {
      data = await response.json();
      console.log("Datos de respuesta:", data);
    } catch (parseError) {
      console.error("Error al parsear la respuesta:", parseError);
      throw new Error("Error al procesar la respuesta del servidor");
    }

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error(data.error || "Error al enviar el producto");
    }

    // Actualizar el estado local
    setWines(wines.map((wine) => (wine.id === productId ? { ...wine, status: "in_transit" } : wine)));

    // Mostrar notificación de éxito
    setNotification({ type: "success", message: "Producte enviat correctament" });
    setTimeout(() => setNotification(null), 3000);
  } catch (error) {
    console.error("Error en la petición:", error);
    setNotification({ type: "error", message: error.message || "Error al enviar el producto" });
    setTimeout(() => setNotification(null), 3000);
  } finally {
    setSendingProduct(null);
  }
};

  // Filtrar vinos según el estado seleccionado
  const filteredWines = activeFilter === "all" ? wines : wines.filter((wine) => wine.status === activeFilter)

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
          Gestiona els teus Vins
        </h1>
      </div>

      {/* Estadísticas */}
      <WineStats wines={wines} />

      {/* Filtros */}
      <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lista de vinos en formato tabla */}
        <div className="lg:col-span-3">
          <WineTable
            wines={filteredWines}
            baseUrl={baseUrl}
            handleSendProduct={handleSendProduct}
            sendingProduct={sendingProduct}
          />
        </div>

        {/* Distribución por tipo */}
        <div className="lg:col-span-1">
          <WineTypeDistribution wines={wines} />
        </div>
      </div>
    </div>
  )
}

export default function WineManagementPage() {
  const { user, loading } = useFetchUser()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <div
          className="flex-1 md:ml-64 p-8 overflow-y-auto pb-16"
          style={{ backgroundColor: primaryColors.background }}
        >
          {loading ? (
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
          ) : (
            <WineManagementComponent />
          )}
        </div>
      </div>
    </div>
  )
}

