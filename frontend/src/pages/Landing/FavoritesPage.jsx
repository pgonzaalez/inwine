"use client"
import { useEffect, useState } from "react"
import { Heart, Search, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import Footer from "@/components/FooterComponent"
import ProductGrid from "@/components/landing/products/ProductGrid"
import EmptyState from "@/components/landing/products/EmptyState"
import { useTranslation } from "react-i18next"
import { getCookie } from "@/utils/utils"

export default function FavoritesPage() {
  const { t } = useTranslation()
  const [favorites, setFavorites] = useState([])
  const [favoriteProducts, setFavoriteProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      setLoading(true)
      const token = getCookie("token")
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

      if (!token) {
        // Fallback to local cookie favorites if not logged in
        const savedFavorites = document.cookie.split("; ").find((row) => row.startsWith("favorites="))
        if (savedFavorites) {
          try {
            const ids = JSON.parse(savedFavorites.split("=")[1])
            setFavorites(ids.map(id => String(id)))
            
            // We still need to fetch the product details for these IDs
            // The API doesn't have a bulk fetch by ID, so we might need to fetch all and filter
            // or we could fetch each one. For now, fetch all products and filter.
            const response = await fetch(`${apiUrl}/v1/products`)
            if (response.ok) {
              const allProducts = await response.json()
              const filtered = allProducts.filter(p => ids.map(id => String(id)).includes(String(p.id)))
              setFavoriteProducts(filtered)
            }
          } catch (error) {}
        }
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${apiUrl}/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setFavoriteProducts(data)
          setFavorites(data.map(p => String(p.id)))
        }
      } catch (error) {
        // console.error("Error fetching favorite products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavoriteProducts()
  }, [])

  const toggleFavorite = async (productId) => {
    const token = getCookie("token")
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

    if (!token) {
      setFavorites((prev) => {
        const newFavs = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        document.cookie = `favorites=${JSON.stringify(newFavs)}; path=/`
        return newFavs
      })
      setFavoriteProducts((prev) => prev.filter(p => p.id !== productId))
      return
    }

    try {
      const response = await fetch(`${apiUrl}/favorites/${productId}/toggle`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (!data.is_favorite) {
          setFavoriteProducts((prev) => prev.filter(p => p.id !== productId))
          setFavorites((prev) => prev.filter(id => id !== productId))
        }
      }
    } catch (error) {}
  }

  const filteredProducts = favoriteProducts.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.origin?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link to="/productes" className="text-[#9A3E50] flex items-center gap-2 mb-2 hover:underline transition-all">
              <ArrowLeft size={16} />
              {t("favorites.back_to_shop", "Tornar a la botiga")}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="fill-[#9A3E50] text-[#9A3E50]" />
              {t("favorites.title", "Els meus Favorits")}
            </h1>
            <p className="text-gray-500 mt-1">
              {favoriteProducts.length} {t("favorites.count_label", "productes guardats")}
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder={t("favorites.search_placeholder", "Cercar als meus favorits...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 px-4 pr-11 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9A3E50]/20 focus:border-[#9A3E50] transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9A3E50]"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid 
            products={filteredProducts} 
            favorites={favorites} 
            toggleFavorite={toggleFavorite} 
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto mt-12">
            <div className="bg-pink-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="text-[#9A3E50] opacity-20" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {t("favorites.empty_title", "Encara no tens favorits")}
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              {t("favorites.empty_desc", "Guarda els teus vins preferits per trobar-los més ràpidament i no perdre'ls de vista.")}
            </p>
            <Link
              to="/productes"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#9A3E50] text-white font-bold rounded-xl hover:bg-[#853545] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-pink-900/10"
            >
              {t("favorites.explore_btn", "Explorar productes")}
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
