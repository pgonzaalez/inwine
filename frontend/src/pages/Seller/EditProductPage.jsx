import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "@components/HeaderComponent";
import Sidebar from "@components/SidebarComponent";
import { CornerDownLeft } from "lucide-react";

export default function EditProductPage() {
  const { id: productID } = useParams();
  const [wineTypes, setWineTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    year: '',
    wine_type_id: '',
    description: '',
    price_demanded: '',
    quantity: '',
    image: '',
    seller_id: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccessNotification, setShowSuccessNotification] = useState(false); // Estado para la notificación
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch wine types from the API
    const fetchWineTypes = async () => {
      const response = await fetch('http://localhost:8000/api/v1/winetypes');
      const data = await response.json();
      setWineTypes(data);
    };

    // Fetch product data from the API
    const fetchProductData = async () => {
      const response = await fetch(`http://localhost:8000/api/v1/products/${productID}`);
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
      [name]: value
    });
  };

  const handleWineTypeSelect = (wineTypeId) => {
    setFormData({
      ...formData,
      wine_type_id: wineTypeId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:8000/api/v1/products/${productID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 422) {
          setErrors(data.errors);
        } else {
          throw new Error('Error updating product');
        }
      } else {
        navigate(`/seller/123/products/${productID}`, {
          state: { successMessage: "Producte modificat correctament ✅" },
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col mt-[60px] h-[calc(100vh-60px)]">
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 ml-[245px] p-6 bg-gray-100 overflow-y-auto">

            <div className="bg-white rounded-t-lg shadow-sm p-4 flex justify-between items-center">
              <Link
                to={`/seller/123/products/${productID}`}
                className="border-2 rounded-lg p-1 hover:bg-gray-200 transition-colors duration-200"
              >
                <CornerDownLeft size={20} className="cursor-pointer" />
              </Link>
            </div>
            <div className="flex bg-white rounded-b-lg shadow-lg p-8 w-full">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-1/2">
                {/* Nombre del producto */}
                <div className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full h-12 bg-white rounded-lg border border-gray-300 py-4 px-3 placeholder-transparent peer ${formData.name ? 'pt-6' : ''}`}
                      placeholder="Nombre del producto"
                    />
                    <label
                      className={`absolute left-3 transition-all text-gray-400 text-xs px-1 ${formData.name ? '-top-2 text-gray-600 text-xs bg-white' : 'top-4 text-base'}`}
                    >
                      Nombre del producto
                    </label>
                  </div>
                  {errors.name && (
                    <span className="text-red-500 text-xs mt-1">{errors.name[0]}</span>
                  )}
                </div>

                {/* Selección del Tipo de Vino */}
                <div className="w-full">
                  <div className="text-lg font-semibold mb-2">Selecciona el Tipo de Vino</div>
                  <div className="grid grid-cols-3 gap-4">
                    {wineTypes.map((wine) => (
                      <div
                        key={wine.id}
                        onClick={() => handleWineTypeSelect(wine.id)}
                        className={`cursor-pointer border p-4 rounded-lg ${formData.wine_type_id === wine.id ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                      >
                        <img src={wine.image} alt={wine.name} className="w-full h-32 object-cover mb-2 rounded" />
                        <div className="text-center text-sm">{wine.name}</div>
                      </div>
                    ))}
                  </div>
                  {errors.wine_type_id && (
                    <span className="text-red-500 text-xs mt-1">{errors.wine_type_id[0]}</span>
                  )}
                </div>

                {/* Denominación de origen y Año */}
                <div className="flex flex-wrap gap-5 w-full">
                  <div className="flex-1 min-w-[250px]">
                    <div className="relative">
                      <input
                        type="text"
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        className={`w-full h-12 bg-white rounded-lg border border-gray-300 py-4 px-3 placeholder-transparent peer ${formData.origin ? 'pt-6' : ''}`}
                        placeholder="Denominación de origen"
                      />
                      <label
                        className={`absolute left-3 transition-all text-gray-400 text-xs px-1 ${formData.origin ? '-top-2 text-gray-600 text-xs bg-white' : 'top-4 text-base'}`}
                      >
                        Denominación de origen
                      </label>
                    </div>
                    <div className="flex justify-between text-gray-400 text-xs mt-2 px-1">
                      <span>Ejemplo: Rioja</span>
                      <span>{formData.origin.length}/50</span>
                    </div>
                    {errors.origin && (
                      <span className="text-red-500 text-xs mt-1">{errors.origin[0]}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-[250px]">
                    <div className="relative">
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className={`w-full h-12 bg-white rounded-lg border border-gray-300 py-4 px-3 placeholder-transparent peer ${formData.year ? 'pt-6' : ''}`}
                        placeholder="Año"
                      />
                      <label
                        className={`absolute left-3 transition-all text-gray-400 text-xs px-1 ${formData.year ? '-top-2 text-gray-600 text-xs bg-white' : 'top-4 text-base'}`}
                      >
                        Año
                      </label>
                    </div>
                    <div className="text-gray-400 text-xs mt-2 px-1">
                      <span>Ejemplo: 2020</span>
                    </div>
                    {errors.year && (
                      <span className="text-red-500 text-xs mt-1">{errors.year[0]}</span>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                <div className="w-full relative">
                  <div className="relative">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full h-24 bg-white rounded-lg border border-gray-300 py-4 px-3 placeholder-transparent peer ${formData.description ? 'pt-6' : ''}`}
                      placeholder="Descripción"
                    />
                    <label
                      className={`absolute left-3 transition-all text-gray-400 text-xs px-1 ${formData.description ? '-top-2 text-gray-600 text-xs bg-white' : 'top-4 text-base'}`}
                    >
                      Descripción
                    </label>
                  </div>
                  <div className="text-gray-400 text-xs mt-2">
                    Añade información como la fecha, el identificador y cualquier otro detalle relevante
                  </div>
                  <div className="absolute right-0 bottom-8 text-gray-400 text-xs">
                    {formData.description.length}/255
                  </div>
                  {errors.description && (
                    <span className="text-red-500 text-xs mt-1">{errors.description[0]}</span>
                  )}
                </div>

                {/* Precio Demandado y Cantidad */}
                <div className="flex flex-wrap gap-5 w-full">
                  <div className="flex-1 min-w-[250px]">
                    <div className="relative">
                      <input
                        type="number"
                        name="price_demanded"
                        value={formData.price_demanded}
                        onChange={handleChange}
                        className={`w-full h-12 bg-white rounded-lg border border-gray-300 py-4 px-3 placeholder-transparent peer ${formData.price_demanded ? 'pt-6' : ''}`}
                        placeholder="Precio Demandado"
                      />
                      <label className={`absolute left-3 transition-all text-gray-400 text-xs px-1 ${formData.price_demanded ? '-top-2 text-gray-600 text-xs bg-white' : 'top-4 text-base'}`}>
                        Precio Demandado
                      </label>
                    </div>
                    <div className="text-gray-400 text-xs mt-2 px-1">
                      <span>Ejemplo: 50.00</span>
                    </div>
                    {errors.price_demanded && (
                      <span className="text-red-500 text-xs mt-1">{errors.price_demanded[0]}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-[250px]">
                    <div className="relative">
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className={`w-full h-12 bg-white rounded-lg border border-gray-300 py-4 px-3 placeholder-transparent peer ${formData.quantity ? 'pt-6' : ''}`}
                        placeholder="Cantidad"
                      />
                      <label className={`absolute left-3 transition-all text-gray-400 text-xs px-1 ${formData.quantity ? '-top-2 text-gray-600 text-xs bg-white' : 'top-4 text-base'}`}>
                        Cantidad
                      </label>
                    </div>
                    <div className="text-gray-400 text-xs mt-2 px-1">
                      <span>Ejemplo: 10</span>
                    </div>
                    {errors.quantity && (
                      <span className="text-red-500 text-xs mt-1">{errors.quantity[0]}</span>
                    )}
                  </div>
                </div>

                {/* URL de la imagen */}
                <div className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className={`w-full h-12 bg-white rounded-lg border border-gray-300 py-4 px-3 placeholder-transparent peer ${formData.image ? 'pt-6' : ''}`}
                      placeholder="URL de la imagen"
                    />
                    <label className={`absolute left-3 transition-all text-gray-400 text-xs px-1 ${formData.image ? '-top-2 text-gray-600 text-xs bg-white' : 'top-4 text-base'}`}>
                      URL de la imagen
                    </label>
                  </div>
                  <div className="flex justify-between text-gray-400 text-xs mt-2 px-1">
                    <span>Ejemplo: https://ejemplo.com/imagen.jpg</span>
                    <span>{formData.image.length}/255</span>
                  </div>
                  {errors.image && (
                    <span className="text-red-500 text-xs mt-1">{errors.image[0]}</span>
                  )}
                </div>

                {/* ID del Vendedor */}
                <div className="w-full">
                  <div className="relative">
                    <input
                      type="number"
                      name="seller_id"
                      value={formData.seller_id}
                      onChange={handleChange}
                      className={`w-full h-12 bg-white rounded-lg border border-gray-300 py-4 px-3 placeholder-transparent peer ${formData.seller_id ? 'pt-6' : ''}`}
                      placeholder="ID del Vendedor"
                    />
                    <label className={`absolute left-3 transition-all text-gray-400 text-xs px-1 ${formData.seller_id ? '-top-2 text-gray-600 text-xs bg-white' : 'top-4 text-base'}`}>
                      ID del Vendedor
                    </label>
                  </div>
                  <div className="text-gray-400 text-xs mt-2 px-1">
                    <span>Ejemplo: 123</span>
                  </div>
                  {errors.seller_id && (
                    <span className="text-red-500 text-xs mt-1">{errors.seller_id[0]}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Actualizar Producto
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}