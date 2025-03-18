import { useFetchUser } from "@components/auth/FetchUser";
import Header from "@components/HeaderComponent";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { CircleAlert, CornerDownLeft, Edit, Star, Trash } from "lucide-react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useEffect, useState } from "react";
import ConfirmationDialog from "@components/ConfirmationDialogComponent";

export default function ViewProductPage() {
  const { id: productID } = useParams();
  const { user, error } = useFetchUser();
  const [wines, setWines] = useState({});
  const [typeWines, setTypeWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Estat per al diàleg
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setShowSuccessNotification(true);

      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
    }
    const fetchWines = async () => {
      try {
        const response = await fetch(`${apiUrl}/v1/products/${productID}`);
        if (!response.ok) {
          throw new Error("No s'ha pogut connectar amb el servidor");
        }
        const data = await response.json();
        if (!data) {
          setErrorMessage("No s'ha trobat el producte.");
        } else {
          setWines(data);
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWines();
  }, [productID, location.state]);

  useEffect(() => {
    if (!wines.wine_type_id) return;

    const fetchTypeWines = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/v1/winetypes/${wines.wine_type_id}`
        );
        if (!response.ok) {
          throw new Error("No s'ha pogut connectar amb el servidor");
        }
        const data = await response.json();
        if (!data) {
          setErrorMessage("No s'ha trobat el tipus de vi.");
        } else {
          setTypeWines(data);
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchTypeWines();
  }, [wines.wine_type_id]);

  const {
    user: seller,
    loading: sellerLoading,
    error: sellerError,
  } = useFetchUser(wines.user_id);

  // Funció per obrir el diàleg de confirmació
  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  // Funció per tancar el diàleg de confirmació
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  // Funció per eliminar el producte
  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`${apiUrl}/v1/products/${productID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No s'ha pogut eliminar el producte");
      }

      // Redirigir a la llista de productes amb un missatge d'èxit
      navigate(`/seller/${user?.id || "usuari"}/products`, {
        state: { successMessage: "Producte eliminat correctament ✅" },
      });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      closeDeleteDialog(); // Tancar el diàleg després de l'acció
    }
  };

  const formatDates = (data) => {
    const date = new Date(data);
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const images = wines.image ? [{ original: wines.image }] : [];

  return (
    <>
      {errorMessage ? (
        <div className="text-center">{errorMessage}</div>
      ) : (
        <>
          <Header />
          <div className="flex flex-col mt-[60px] h-[calc(100vh-60px)]">
            {/* Envoltem el contingut amb flex-col per a mòbil i en fila en desktop */}
            <div className="flex flex-1 flex-col md:flex-row">
              {/* El marge esquerre només s'aplica en desktop i afegim padding-bottom per a mòbil */}
              <main className="flex-1 md:ml-[245px] p-6 pb-20 bg-gray-100 overflow-y-auto">
                {showSuccessNotification && (
                  <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    {successMessage}
                  </div>
                )}
                {/* Diàleg de confirmació */}
                <ConfirmationDialog
                  isOpen={isDeleteDialogOpen}
                  onClose={closeDeleteDialog}
                  onConfirm={handleDeleteProduct}
                  title="Eliminar Producte"
                  message="Estàs segur que vols eliminar aquest producte? Aquesta acció no es pot desfer."
                />
                <div className="bg-white rounded-t-lg shadow-sm p-4 flex justify-between items-center">
                  <Link
                    to={`/seller/${user?.id || "usuari"}/products`}
                    className="border-2 rounded-lg p-1 hover:bg-gray-200 transition-colors duration-200"
                  >
                    <CornerDownLeft size={20} className="cursor-pointer" />
                  </Link>
                  <div className="flex gap-2 items-center">
                    <Link
                      to={`/seller/${user?.id || "usuari"}/products/${productID}/edit`}
                      className="border-2 rounded-lg p-1 hover:bg-gray-200 transition-colors duration-200"
                    >
                      <Edit size={20} className="cursor-pointer" />
                    </Link>
                    <button
                      onClick={openDeleteDialog}
                      className="border-2 border-red-500 rounded-lg p-1 hover:bg-red-100 transition-colors duration-200"
                    >
                      <Trash
                        size={20}
                        className="text-red-500 cursor-pointer"
                      />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row bg-white rounded-b-lg shadow-lg p-8 w-full">
                  <div className="flex flex-col gap-4 md:w-1/2">
                    <div className="w-full flex justify-center items-center h-[400px]">
                      <div className="w-full max-w-lg object-cover">
                        <div className="w-full max-w-md mx-auto">
                          {images.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                              {images.map((img, index) => (
                                <div
                                  key={index}
                                  className="relative w-full h-[400px] flex justify-center items-center"
                                >
                                  <img
                                    src={img.original}
                                    alt={wines.name}
                                    className="max-w-full max-h-full object-contain "
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="w-full h-[300px] flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                              No hi ha imatges disponibles
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 pl-0 md:pl-8 flex flex-col justify-between mt-4 md:mt-0">
                    <div>
                      <div className="flex flex-col justify-between text-gray-500 text-sm">
                        <div className="flex justify-between gap-2 items-center">
                          <span>Vi {typeWines.name}</span>
                        </div>
                      </div>
                      <h2 className="text-black text-2xl font-semibold mt-2">
                        {wines.name} {wines.year}
                      </h2>
                      <div className="flex gap-2 items-center mt-2">
                        <span className="text-gray-500 text-sm">
                          {wines.origin}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center mt-2">
                        <span className="text-black text-xl font-bold">
                          {wines.price_demanded}€
                        </span>
                      </div>
                      <div className="flex gap-2 items-center mt-2">
                        <span
                          className={`text-sm ${
                            wines.quantity <= 10
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {wines.quantity} en stock
                        </span>
                        {wines.quantity <= 10 && (
                          <span className="text-red-500 text-sm ml-2 flex items-center gap-1">
                            <CircleAlert className="w-4 h-4" />
                            ¡Queda poc stock!
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 items-center mt-2">
                        <div className="flex gap-1">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <Star className="w-5 h-5 text-yellow-500" />
                          <Star className="w-5 h-5 text-yellow-500" />
                          <Star className="w-5 h-5 text-yellow-500" />
                          <Star className="w-5 h-5 text-gray-300" />
                        </div>
                        <span className="text-black text-xs">(4)</span>
                        <span className="text-black text-xs">1,3k Reseñas</span>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-black text-lg font-bold">
                          Descripció
                        </h3>
                        <p className="text-gray-500 text-base leading-6 mt-1">
                          {wines.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 items-center text-gray-500 mt-4">
                      <span>Publicat: {formatDates(wines.created_at)}</span>
                      <span>Actualitzat: {formatDates(wines.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </>
      )}
    </>
  );
}
