"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Trash, ArrowLeft } from "lucide-react"; // Importar el ícono de flecha
import ProductGallery from "@/components/landing/requests/ProductGallery";
import ProductInfo from "@/components/landing/requests/ProductInfo";
import { DeleteProductModal } from "@/components/seller/modals/DeleteProductModal";
import { useFetchUser } from "@components/auth/FetchUser";

export default function ViewProductPage() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { user, loading: userLoading } = useFetchUser();
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = import.meta.env.VITE_URL_BASE;

  useEffect(() => {
    if (!user || userLoading) return;
    fetchProduct();
  }, [user, productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/v1/${user.id}/products/${productId}`);
      if (!response.ok) {
        throw new Error("No se pudo obtener la información del producto.");
      }
      const data = await response.json();
      setProduct(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`${apiUrl}/v1/${user.id}/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el producto.");
      }

      navigate(`/seller/products`, {
        state: { successMessage: "Producto eliminado correctamente." },
      });
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading || userLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="w-12 h-12 rounded-full animate-spin"
          style={{
            borderWidth: "4px",
            borderStyle: "solid",
            borderColor: "#C27D7D",
            borderTopColor: "#9A3E50",
          }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-white text-center p-8 rounded-xl shadow-sm"
        style={{
          borderLeft: "4px solid #9A3E50",
          color: "#9A3E50",
        }}
      >
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-2xl text-gray-600">Producto no encontrado</p>
      </div>
    );
  }

  // Preparar imágenes del producto
  const productImages = [];
  if (product.image) {
    productImages.push(product.image);
  }
  if (product.images && Array.isArray(product.images)) {
    productImages.push(...product.images);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        {/* Sidebar margin */}
        <div
          className="flex-1 md:ml-64 p-8 overflow-y-auto pb-16"
          style={{ backgroundColor: "#F9F9F9" }}
        >
          <main className="container mx-auto px-4 py-8">
            {/* Back Arrow */}
            <button
              onClick={() => navigate(-1)} // Navegar hacia atrás
              className="flex items-center text-gray-500 hover:text-gray-700 mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tornar
            </button>

            {/* SECTION 1: Product Details Section */}
            <section className="mb-8 transition-all duration-500 ease-in-out">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Images */}
                <ProductGallery images={productImages} productName={product.name} baseUrl={baseUrl} />

                {/* Right Column - Info */}
                <div>
                  <ProductInfo product={product} wineTypeName={product.wine_type} />

                  {/* Botones de acción */}
                  <div className="flex flex-wrap gap-4 mt-6">
                    <button
                      onClick={() => navigate(`/seller/products/${productId}/edit`)}
                      className="bg-blue-500 text-white p-3 rounded-md transition-colors flex items-center gap-2 hover:bg-blue-600"
                    >
                      <Edit className="w-5 h-5" />
                      Editar
                    </button>
                    <button
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="bg-red-500 text-white p-3 rounded-md transition-colors flex items-center gap-2 hover:bg-red-600"
                    >
                      <Trash className="w-5 h-5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Modal de eliminación */}
          <DeleteProductModal
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteProduct}
          />
        </div>
      </div>
    </div>
  );
}