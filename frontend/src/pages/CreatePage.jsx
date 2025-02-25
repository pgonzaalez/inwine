import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateProduct() {
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
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/v1/products', {
                method: 'POST',
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
                    throw new Error('Error creating product');
                }
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Crear Producto</h1>
                <Link to="/" className="text-blue-500 hover:underline">Volver</Link>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Nombre del producto */}
                <div className="w-full">
                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full h-12 bg-white rounded-lg border border-gray-300 py-4 px-3 placeholder-transparent peer ${formData.name ? 'pt-6' : ''
                                }`}
                            placeholder="Nombre del producto"
                        />
                        <label
                            className={`absolute left-3 transition-all text-gray-400 text-xs px-1 ${formData.name
                                ? '-top-2 text-gray-600 text-xs bg-white'
                                : 'top-4 text-base'
                                }`}
                        >
                            Nombre del producto
                        </label>
                    </div>
                    {errors.name && (
                        <span className="text-red-500 text-xs mt-1">
                            {errors.name[0]}
                        </span>
                    )}
                </div>


                {/* ID del Vendedor */}
                <div className="w-full">
                    <div className="relative">
                        <input
                            type="number"
                            name="wine_type_id"
                            value={formData.wine_type_id}
                            onChange={handleChange}
                            className={`w-full h-12 bg-white rounded-lg border border-gray-300 py-4 px-3 placeholder-transparent peer ${formData.wine_type_id ? 'pt-6' : ''}`}
                            placeholder="ID del Vendedor"
                        />
                        <label className={`absolute left-3 transition-all text-gray-400 text-xs px-1 ${formData.wine_type_id ? '-top-2 text-gray-600 text-xs bg-white' : 'top-4 text-base'}`}>
                            ID del Tipo de Vino
                        </label>
                    </div>
                    <div className="text-gray-400 text-xs mt-2 px-1">
                        <span>Ejemplo: 1</span>
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
                                className={`w-full h-12 bg-white rounded-lg border border-gray-300 py-4 px-3 placeholder-transparent peer ${formData.origin ? 'pt-6' : ''
                                    }`}
                                placeholder="Denominación de origen"
                            />
                            <label
                                className={`absolute left-3 transition-all text-gray-400 text-xs px-1 ${formData.origin
                                    ? '-top-2 text-gray-600 text-xs bg-white'
                                    : 'top-4 text-base'
                                    }`}
                            >
                                Denominación de origen
                            </label>
                        </div>
                        <div className="flex justify-between text-gray-400 text-xs mt-2 px-1">
                            <span>Ejemplo: Rioja</span>
                            <span>{formData.origin.length}/50</span>
                        </div>
                        {errors.origin && (
                            <span className="text-red-500 text-xs mt-1">
                                {errors.origin[0]}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 min-w-[250px]">
                        <div className="relative">
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className={`w-full h-12 bg-white rounded-lg border border-gray-300 py-4 px-3 placeholder-transparent peer ${formData.year ? 'pt-6' : ''
                                    }`}
                                placeholder="Año"
                            />
                            <label
                                className={`absolute left-3 transition-all text-gray-400 text-xs px-1 ${formData.year
                                    ? '-top-2 text-gray-600 text-xs bg-white'
                                    : 'top-4 text-base'
                                    }`}
                            >
                                Año
                            </label>
                        </div>
                        <div className="text-gray-400 text-xs mt-2 px-1">
                            <span>Ejemplo: 2020</span>
                        </div>
                        {errors.year && (
                            <span className="text-red-500 text-xs mt-1">
                                {errors.year[0]}
                            </span>
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
                            className={`w-full h-24 bg-white rounded-lg border border-gray-300 py-4 px-3 placeholder-transparent peer ${formData.description ? 'pt-6' : ''
                                }`}
                            placeholder="Descripción"
                        />
                        <label
                            className={`absolute left-3 transition-all text-gray-400 text-xs px-1 ${formData.description
                                ? '-top-2 text-gray-600 text-xs bg-white'
                                : 'top-4 text-base'
                                }`}
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
                        <span className="text-red-500 text-xs mt-1">
                            {errors.description[0]}
                        </span>
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
                    Crear Producto
                </button>
            </form>
        </div>
    );
}