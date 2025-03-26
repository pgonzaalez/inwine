"use client"

import { useState, useEffect } from "react"
import { useFetchUser } from "@components/auth/FetchUser"
import { primaryColors } from "@/components/restaurant/utils/colors"
import { RequestStats } from "@/components/restaurant/RequestStats"
import { FilterButtons } from "@/components/restaurant/FilterButtons"
import { RequestCard } from "@/components/restaurant/RequestCard"
import { WineTypeDistribution } from "@/components/restaurant/WineTypeDistribution"

function RestaurantDashboardComponent() {
  const [requests, setRequests] = useState([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL
  const baseUrl = import.meta.env.VITE_URL_BASE

  const { user, loading: userLoading } = useFetchUser()

  useEffect(() => {
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

    fetchRequests()
  }, [user, userLoading, apiUrl])

  // Handle request deletion
  const handleDeleteRequest = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/v1/restaurants/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("No s'ha pogut eliminar la sol·licitud")
      }

      // Remove the deleted request from state
      setRequests(requests.filter((request) => request.id !== id))
    } catch (err) {
      console.error("Error eliminant la sol·licitud:", err)
      alert("No s'ha pogut eliminar la sol·licitud")
    }
  }

  // Filter requests based on active filter
  const filteredRequests =
    activeFilter === "all" ? requests : requests.filter((request) => request.status === activeFilter)

  // Request statistics
  const stats = {
    total: requests.length,
    pending: requests.filter((request) => request.status === "pending").length,
    accepted: requests.filter((request) => request.status === "accepted" || request.status === "in_my_local").length,
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
      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold" style={{ color: primaryColors.dark }}>
          Gestiona les teves Sol·licituds
        </h1>
      </div>

      {/* Statistics */}
      <RequestStats stats={stats} />

      {/* Filters */}
      <FilterButtons activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Request cards */}
        <div className="lg:col-span-3">
          {filteredRequests.length === 0 ? (
            <div className="bg-white text-center p-8 rounded-xl shadow-sm">
              No hi ha sol·licituds disponibles amb aquest filtre
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold" style={{ color: primaryColors.dark }}>
                  Les teves sol·licituds
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredRequests.length} {filteredRequests.length === 1 ? "sol·licitud" : "sol·licituds"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                  <RequestCard key={request.id} request={request} baseUrl={baseUrl} onDelete={handleDeleteRequest} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wine type distribution */}
        <div className="lg:col-span-1">
          <WineTypeDistribution requests={requests} />
        </div>
      </div>
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

