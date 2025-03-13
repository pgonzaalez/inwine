import { Trash, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationDialog from "@components/ConfirmationDialogComponent";
import { useFetchUser } from "@components/FetchUser";

const WineItem = ({
  id,
  image,
  price,
  name,
  year,
  create_date,
  update_date,
  onDelete,
  userId, // Recibimos el userId como prop
}) => {
  const navigate = useNavigate(); // Definim navigate

  create_date = new Date(create_date).toLocaleDateString("ca-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  update_date = new Date(update_date).toLocaleDateString("ca-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div
      className="w-full cursor-pointer"
      onClick={() => navigate(`/seller/${userId}/products/${id}`)}
    >
      <div className="flex items-center justify-between gap-6 p-2">
        {/* <input
          type="checkbox"
          className="w-5 h-5"
          onClick={(e) => e.stopPropagation()}
        /> */}
        <div className="flex-1 bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:min-w-[300px]">
              <img
                src={image}
                alt={name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="space-y-1">
                <p className="text-lg font-semibold text-gray-900">{price}€</p>
                <p className="text-gray-900 font-medium truncate max-w-[200px]">
                  {name}
                </p>
                <p className="text-gray-500 text-sm">{year}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-gray-600 w-full sm:w-auto">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500">Publicació</p>
                <p className="text-gray-700 font-medium">{create_date}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500">Modificació</p>
                <p className="text-gray-700 font-medium">{update_date}</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end w-full sm:w-auto">
              <Link
                to={`/seller/${userId}/products/${id}/edit`}
                className="p-2.5 bg-gray-50 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Edit size={20} className="text-gray-800" />
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="p-2.5 bg-gray-50 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
              >
                <Trash size={20} className="text-red-800" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WineList() {
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentWineId, setCurrentWineId] = useState(null);
  const { user, error } = useFetchUser();
  const openDeleteDialog = (id) => {
    setCurrentWineId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCurrentWineId(null);
  };

  useEffect(() => {
    const fetchWines = async () => {
      if (!user) return;
      try {
        const response = await fetch(`${apiUrl}/v1/${user.id}/products`);
        if (!response.ok) {
          throw new Error("No s'ha pogut connectar amb el servidor");
        }
        const data = await response.json();
        if (data) {
          setWines(Array.isArray(data) ? data : [data]);
        } else {
          setWines([]);
          setErrorMessage("No tens vins publicats");
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWines();
  }, [user]);

  const handleDeleteWine = async () => {
    try {
      const response = await fetch(`${apiUrl}/v1/products/${currentWineId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No s'ha pogut eliminar el producte");
      }

      setWines((prevWines) =>
        prevWines.filter((wine) => wine.id !== currentWineId)
      );
      closeDeleteDialog();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {errorMessage ? (
        <div className="text-center">{errorMessage}</div>
      ) : (
        <div className="mt-4 space-y-4">
          {wines.map((wine) => (
            <WineItem
              key={wine.id}
              id={wine.id}
              image={wine.image}
              price={wine.price_demanded}
              name={wine.name}
              year={wine.year}
              create_date={wine.created_at}
              update_date={wine.updated_at}
              onDelete={openDeleteDialog}
              userId={user?.id}
            />
          ))}

          <ConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onClose={closeDeleteDialog}
            onConfirm={handleDeleteWine}
            title="Eliminar Producte"
            message="Estàs segur que vols eliminar aquest producte? Aquesta acció no es pot desfer."
          />
        </div>
      )}
    </>
  );
}
