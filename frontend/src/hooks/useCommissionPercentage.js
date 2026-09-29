import { useEffect, useState } from "react"
import { API_URL } from "@/config/api"

/**
 * Percentatge d'una de les tres comissions de la plataforma ("product",
 * "restaurant" o "investor"), configurades des del panell d'administració.
 * Si la petició falla, es queda a 0 en comptes de bloquejar la pantalla:
 * el càrrec/descompte real sempre el calcula el servidor.
 */
export function useCommissionPercentage(type) {
  const [percentage, setPercentage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchCommission = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/commissions/${type}`)
        if (!response.ok) return
        const data = await response.json()
        if (isMounted) {
          setPercentage(Number.parseFloat(data.percentage) || 0)
        }
      } catch (error) {
        // Silenciós: la pantalla segueix funcionant amb percentage = 0.
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCommission()

    return () => {
      isMounted = false
    }
  }, [type])

  return { percentage, loading }
}
