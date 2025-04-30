"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Share2, Check, Copy, Trash, Edit } from "lucide-react";
import Slider from "react-slick"; // Carousel library
import { useFetchUser } from "@components/auth/FetchUser";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
};

export default function ViewProductPage() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareStatus, setShareStatus] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { user, loading: userLoading } = useFetchUser();
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = import.meta.env.VITE_URL_BASE; // Base URL para las imágenes

  useEffect(() => {
    if (!user || userLoading) return;
    fetchProduct();
  }, [user, productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${apiUrl}/v1/${user.id}/products/${productId}`
      );
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

  const shareProduct = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `Descubre ${product.name}, cosecha ${product.year} de ${product.origin}`,
      url: window.location.href,
    };

    if (navigator && navigator.share) {
      try {
        await navigator.share(shareData);
        setShareStatus("Compartido!");
        setTimeout(() => setShareStatus(""), 2000);
      } catch (err) {
        console.error("Error al compartir:", err);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    if (!navigator || !navigator.clipboard) {
      setShareStatus("No se puede compartir");
      setTimeout(() => setShareStatus(""), 2000);
      return;
    }

    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        setShareStatus("URL copiada!");
        setTimeout(() => setShareStatus(""), 2000);
      },
      () => {
        setShareStatus("Error al copiar");
        setTimeout(() => setShareStatus(""), 2000);
      }
    );
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/v1/${user.id}/products/${productId}`,
        {
          method: "DELETE",
        }
      );

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
            borderColor: primaryColors.light,
            borderTopColor: primaryColors.dark,
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
          borderLeft: `4px solid ${primaryColors.dark}`,
          color: primaryColors.dark,
        }}
      >
        {error}
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true, // Activar cambio automático
    autoplaySpeed: 5000, // Cambiar cada 5 segundos
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <div
          className="flex-1 md:ml-64 p-8 overflow-y-auto pb-16"
          style={{ backgroundColor: primaryColors.background }}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Carrusel de imágenes del producto */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <Slider
                  {...sliderSettings}
                  className="pb-8" 
                >
                  {product.images.map((image) => (
                    <div
                      key={image.id}
                      className="flex justify-center items-center h-96 overflow-hidden rounded-lg"
                    >
                      <img
                        src={`${baseUrl}${image.image_path}`}
                        alt={product.name}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  ))}
                </Slider>
                <div className="mt-4 flex justify-center">
                  <ul className="slick-dots"></ul>
                </div>
              </div>

              {/* Detalles del producto */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= 4
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      (24 reseñas)
                    </span>
                  </div>
                </div>

                <div className="text-3xl font-bold text-[#9A3E50] mb-6">
                  €{product.price_demanded}
                </div>

                <div className="prose prose-sm max-w-none text-gray-600 mb-6">
                  <p>
                    {product.description ||
                      `Un vino excepcional de ${product.origin}, cosecha ${product.year}. Perfecto para ocasiones especiales y maridajes sofisticados.`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Origen</p>
                    <p className="font-medium">{product.origin}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Año</p>
                    <p className="font-medium">{product.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tipo</p>
                    <p className="font-medium">{product.wine_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estado</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === "in_stock"
                          ? "bg-green-100 text-green-800"
                          : product.status === "out_of_stock"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.status === "in_stock"
                        ? "En stock"
                        : product.status === "out_of_stock"
                        ? "Sin stock"
                        : "Desconocido"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <button
                    onClick={shareProduct}
                    className="bg-white border border-gray-300 hover:bg-gray-50 p-3 rounded-md flex items-center gap-2"
                  >
                    {shareStatus ? (
                      shareStatus === "Compartido!" ||
                      shareStatus === "URL copiada!" ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-700" />
                      )
                    ) : (
                      <Share2 className="w-5 h-5 text-gray-700" />
                    )}
                    {shareStatus || "Compartir"}
                  </button>
                  <button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="bg-red-500 text-white p-3 rounded-md transition-colors flex items-center gap-2 hover:bg-red-600"
                  >
                    <Trash className="w-5 h-5" />
                    Eliminar
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/seller/products/${productId}/edit`)
                    }
                    className="bg-blue-500 text-white p-3 rounded-md transition-colors flex items-center gap-2 hover:bg-blue-600"
                  >
                    <Edit className="w-5 h-5" />
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
