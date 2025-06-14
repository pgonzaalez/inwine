import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "@components/HeaderComponent";
import { CornerDownLeft } from "lucide-react";
import { useFetchUser } from "@components/auth/FetchUser";

export default function EditProductPage() {
  const { id: productID } = useParams();
  const { user, error } = useFetchUser();
  const [wineTypes, setWineTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    year: "",
    wine_type_id: "",
    description: "",
    price_demanded: "",
    quantity: "",
    image: "",
    seller_id: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch wine types from the API
    const fetchWineTypes = async () => {
      const response = await fetch(`${apiUrl}/v1/winetypes`);
      const data = await response.json();
      setWineTypes(data);
    };

    // Fetch product data from the API
    const fetchProductData = async () => {
      const response = await fetch(`${apiUrl}/v1/products/${productID}`);
      const data = await response.json();
      setFormData(data);
    };

    fetchWineTypes();
    fetchProductData();
  }, [productID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleWineTypeSelect = (wineTypeId) => {
    setFormData({
      ...formData,
      wine_type_id: wineTypeId,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/v1/products/${productID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(data.errors);
        } else {
          throw new Error("Error updating product");
        }
      } else {
        navigate(`/seller/products/${productID}`, {
          state: { successMessage: "Producte modificat correctament ✅" },
        });
      }
    } catch (error) {
      // console.error("Error:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col mt-[60px] h-[calc(100vh-60px)]">
        <div className="flex flex-1">
          <main className="flex-1 ml-[245px] p-6 bg-gray-100 overflow-y-auto">
            <div className="bg-white rounded-t-lg shadow-sm p-4 flex justify-between items-center">
              <Link
                to={`/seller/products/${productID}`}
                className="border-2 rounded-lg p-1 hover:bg-gray-200 transition-colors duration-200"
              >
                <CornerDownLeft size={20} className="cursor-pointer" />
              </Link>
            </div>
            <div className="flex bg-white rounded-b-lg shadow-lg p-8 w-full">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                {/* Sección 1: Selección del Tipo de Vino */}
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="md:w-1/3 text-sm text-gray-600 mb-10 md:mb-0">
                    <h2 className="text-lg font-semibold">Tria la categoria</h2>
                    <p>
                      Selecciona una opció d'aquest menú desplegable per escollir la categoria
                    </p>
                  </div>
                  <div className="md:w-2/3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {wineTypes.map((wine) => (
                        <div
                          key={wine.id}
                          onClick={() => handleWineTypeSelect(wine.id)}
                          className={`cursor-pointer border p-6 rounded-lg ${
                            formData.wine_type_id === wine.id
                              ? "bg-blue-100 border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          <img
                            src={wine.image}
                            alt={wine.name}
                            className="w-full h-24 object-cover mb-2 rounded"
                          />
                          <div className="text-center text-sm">{wine.name}</div>
                        </div>
                      ))}
                    </div>
                    {errors.wine_type_id && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.wine_type_id[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sección 2: Campos del Producto */}
                <div className="flex flex-col md:flex-row justify-between mt-8 border-t pt-8">
                  <div className="md:w-1/3 text-sm text-gray-600 mb-4 md:mb-0">
                    <h2 className="text-lg font-semibold">Edita el producte</h2>
                    <p>
                      Omple les següents dades per editar el teu producte.
                      Proporciona tota la informació rellevant.
                    </p>
                  </div>
                  <div className="md:w-2/3 w-full">
                    {/* Nombre del Producto */}
                    <div className="relative mb-4">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="peer w-full h-12 bg-white rounded-lg border border-gray-300 px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=" "
                        id="name"
                      />
                      <label
                        htmlFor="name"
                        className="absolute left-3 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                      >
                        Nom del Vi
                      </label>
                      {errors.name && (
                        <span className="text-red-500 text-xs mt-1">
                          {errors.name[0]}
                        </span>
                      )}
                    </div>

                    {/* Denominación y Año */}
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Denominación */}
                      <div className="relative mb-4 w-full">
                        <input
                          type="text"
                          name="origin"
                          value={formData.origin}
                          onChange={handleChange}
                          className="peer w-full h-12 bg-white rounded-lg border border-gray-300 px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder=" "
                          id="origin"
                        />
                        <label
                          htmlFor="origin"
                          className="absolute left-3 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                        >
                          Denominació d'Origen
                        </label>
                        {errors.origin && (
                          <span className="text-red-500 text-xs mt-1">
                            {errors.origin[0]}
                          </span>
                        )}
                      </div>

                      {/* Año */}
                      <div className="relative mb-4 w-full">
                        <input
                          type="number"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          className="peer w-full h-12 bg-white rounded-lg border border-gray-300 px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder=" "
                          id="year"
                        />
                        <label
                          htmlFor="year"
                          className="absolute left-3 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                        >
                          Any
                        </label>
                        {errors.year && (
                          <span className="text-red-500 text-xs mt-1">
                            {errors.year[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Descripción */}
                    <div className="relative mb-4">
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="peer w-full h-24 bg-white rounded-lg border border-gray-300 px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=" "
                        id="description"
                      />
                      <label
                        htmlFor="description"
                        className="absolute left-3 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                      >
                        Descripció
                      </label>
                      <div className="flex justify-between text-gray-400 text-xs mt-2 px-1">
                        <span>Màxim de 255 caràcters</span>
                        <span>{formData.description.length}/255</span>
                      </div>
                      {errors.description && (
                        <span className="text-red-500 text-xs mt-1">
                          {errors.description[0]}
                        </span>
                      )}
                    </div>

                    {/* Precio y Cantidad */}
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Precio */}
                      <div className="relative mb-4 w-full">
                        <input
                          type="number"
                          name="price_demanded"
                          value={formData.price_demanded}
                          onChange={handleChange}
                          className="peer w-full h-12 bg-white rounded-lg border border-gray-300 px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder=" "
                          id="price_demanded"
                        />
                        <label
                          htmlFor="price_demanded"
                          className="absolute left-3 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                        >
                          Preu
                        </label>
                        {errors.price_demanded && (
                          <span className="text-red-500 text-xs mt-1">
                            {errors.price_demanded[0]}
                          </span>
                        )}
                      </div>

                      {/* Cantidad */}
                      <div className="relative mb-4 w-full">
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          className="peer w-full h-12 bg-white rounded-lg border border-gray-300 px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder=" "
                          id="quantity"
                        />
                        <label
                          htmlFor="quantity"
                          className="absolute left-3 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                        >
                          Quantitat
                        </label>
                        {errors.quantity && (
                          <span className="text-red-500 text-xs mt-1">
                            {errors.quantity[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Imagen */}
                    <div className="relative mb-4">
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="peer w-full h-12 bg-white rounded-lg border border-gray-300 px-4 pt-4 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=" "
                        id="image"
                      />
                      <label
                        htmlFor="image"
                        className="absolute left-3 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                      >
                        URL de la Imatge
                      </label>
                      {errors.image && (
                        <span className="text-red-500 text-xs mt-1">
                          {errors.image[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botón de Envío */}
                <button
                  type="submit"
                  className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors self-end"
                >
                  Actualitzar Producte
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}