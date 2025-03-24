import { Trash, Edit, Eye } from 'lucide-react'
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ConfirmationDialog from "@components/ConfirmationDialogComponent"
import { useFetchUser } from "@components/auth/FetchUser"

// Definimos los colores rosé para usar en todo el componente
const roseColors = {
  light: "#F8E1E7", // Rosé claro
  medium: "#F4C2D0", // Rosé medio
  dark: "#E79FB3", // Rosé oscuro
}

// Función para obtener el color de fondo según el tipo de vino
const getWineTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'negre':
      return '#2D1B1E'; // Color oscuro para vino tinto
    case 'blanc':
      return '#F7F5E8'; // Color claro para vino blanco
    case 'rossat':
      return roseColors.medium; // Color rosado para vino rosado
    case 'espumós':
      return '#F2EFD3'; // Color champán para espumoso
    case 'dolç':
      return '#E8D0B5'; // Color ámbar para vino dulce
    default:
      return roseColors.light; // Color por defecto
  }
}

// Función para obtener el color de texto según el tipo de vino
const getWineTypeTextColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'negre':
      return 'white'; // Texto blanco para fondo oscuro
    default:
      return '#2D1B1E'; // Texto oscuro para fondos claros
  }
}

const WineItem = ({
  id,
  image,
  price,
  name,
  year,
  type,
  create_date,
  update_date,
  onDelete,
  userId,
}) => {
  const navigate = useNavigate()

  create_date = new Date(create_date).toLocaleDateString("ca-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  update_date = new Date(update_date).toLocaleDateString("ca-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  const bgColor = getWineTypeColor(type)
  const textColor = getWineTypeTextColor(type)

  return (
    <div 
      className="group w-full transition-all duration-300 hover:translate-y-[-2px]"
      onClick={() => navigate(`/seller/products/${id}`)}
    >
      <div className="p-2">
        <div 
          className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          style={{ borderLeft: `4px solid ${roseColors.dark}` }}
        >
          {/* Imagen destacada */}
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={image || "/placeholder.svg?height=200&width=400"}
              alt={name}
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute top-0 right-0 px-3 py-1 m-2 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: bgColor,
                color: textColor
              }}
            >
              {type || "Vi"}
            </div>
            <div 
              className="absolute bottom-0 left-0 right-0 px-4 py-2 text-white"
              style={{ 
                background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)'
              }}
            >
              <p className="text-lg font-bold truncate">{name}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm">{year}</p>
                <p className="text-xl font-bold">{price}€</p>
              </div>
            </div>
          </div>
          
          {/* Información y acciones */}
          <div className="flex flex-wrap justify-between items-center p-4">
            <div className="flex gap-6 text-gray-600">
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500">Publicació</p>
                <p className="text-gray-700 font-medium">{create_date}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500">Modificació</p>
                <p className="text-gray-700 font-medium">{update_date}</p>
              </div>
            </div>
            
            {/* Acciones */}
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/seller/products/${id}`)
                }}
                className="p-2 rounded-lg transition-colors cursor-pointer opacity-70 hover:opacity-100"
                style={{ 
                  backgroundColor: roseColors.light,
                  color: '#2D1B1E'
                }}
              >
                <Eye size={18} />
              </button>
              <Link
                to={`/seller/products/${id}/edit`}
                className="p-2 rounded-lg transition-colors cursor-pointer opacity-70 hover:opacity-100"
                style={{ 
                  backgroundColor: roseColors.light,
                  color: '#2D1B1E'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Edit size={18} />
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(id)
                }}
                className="p-2 rounded-lg transition-colors cursor-pointer opacity-70 hover:opacity-100"
                style={{ 
                  backgroundColor: roseColors.medium,
                  color: '#2D1B1E'
                }}
              >
                <Trash size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WineList() {
  const [wines, setWines] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const apiUrl = import.meta.env.VITE_API_URL
  const baseUrl = import.meta.env.VITE_URL_BASE
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentWineId, setCurrentWineId] = useState(null)
  const { user, error } = useFetchUser()
  
  const openDeleteDialog = (id) => {
    setCurrentWineId(id)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setCurrentWineId(null)
  }

  useEffect(() => {
    const fetchWines = async () => {
      if (!user) return
      try {
        const response = await fetch(`${apiUrl}/v1/${user.id}/products`)
        if (!response.ok) {
          throw new Error("No s'ha pogut connectar amb el servidor")
        }
        const data = await response.json()
        if (data) {
          setWines(Array.isArray(data) ? data : [data])
        } else {
          setWines([])
          setErrorMessage("No tens vins publicats")
        }
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWines()
  }, [user])

  const handleDeleteWine = async () => {
    try {
      const response = await fetch(`${apiUrl}/v1/${user.id}/products/${currentWineId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("No s'ha pogut eliminar el producte")
      }

      setWines((prevWines) =>
        prevWines.filter((wine) => wine.id !== currentWineId)
      )
      closeDeleteDialog()
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div 
          className="w-8 h-8 rounded-full animate-spin"
          style={{ 
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: roseColors.light,
            borderTopColor: roseColors.dark
          }}
        ></div>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div 
        className="text-center p-8 rounded-xl"
        style={{ 
          backgroundColor: roseColors.light,
          color: '#2D1B1E'
        }}
      >
        {errorMessage}
      </div>
    )
  }

  if (wines.length === 0) {
    return (
      <div 
        className="text-center p-12 rounded-xl"
        style={{ 
          backgroundColor: roseColors.light,
          color: '#2D1B1E'
        }}
      >
        <p className="text-lg font-medium mb-4">No tens cap vi publicat</p>
        <Link 
          to="/create"
          className="inline-flex items-center px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: roseColors.dark }}
        >
          <Edit size={16} className="mr-2" />
          Pujar un producte
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wines.map((wine) => (
          <WineItem
            key={wine.id}
            id={wine.id}
            image={`${baseUrl}${wine.image}`}
            price={wine.price_demanded}
            name={wine.name}
            year={wine.year}
            type={wine.type}
            create_date={wine.created_at}
            update_date={wine.updated_at}
            onDelete={openDeleteDialog}
            userId={user?.id}
          />
        ))}
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteWine}
        title="Eliminar Producte"
        message="Estàs segur que vols eliminar aquest producte? Aquesta acció no es pot desfer."
      />
    </>
  )
}
