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
                    setErrors(data.errors); // Manejo de errores de validación
                } else {
                    throw new Error('Error creating product');
                }
            } else {
                navigate('/'); // Redirige a la página principal después de crear el producto
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Create Product</h1>
            <Link to="/">Go back</Link>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <span>{errors.name[0]}</span>}
                </div>
                <div>
                    <label>Origin:</label>
                    <input type="text" name="origin" value={formData.origin} onChange={handleChange} />
                    {errors.origin && <span>{errors.origin[0]}</span>}
                </div>
                <div>
                    <label>Year:</label>
                    <input type="number" name="year" value={formData.year} onChange={handleChange} />
                    {errors.year && <span>{errors.year[0]}</span>}
                </div>
                <div>
                    <label>Wine Type ID:</label>
                    <input type="number" name="wine_type_id" value={formData.wine_type_id} onChange={handleChange} />
                    {errors.wine_type_id && <span>{errors.wine_type_id[0]}</span>}
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} />
                    {errors.description && <span>{errors.description[0]}</span>}
                </div>
                <div>
                    <label>Price Demand:</label>
                    <input type="number" name="price_demanded" value={formData.price_demanded} onChange={handleChange} />
                    {errors.price_demanded && <span>{errors.price_demanded[0]}</span>}
                </div>
                <div>
                    <label>Quantity:</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
                    {errors.quantity && <span>{errors.quantity[0]}</span>}
                </div>
                <div>
                    <label>Image URL:</label>
                    <input type="text" name="image" value={formData.image} onChange={handleChange} />
                    {errors.image && <span>{errors.image[0]}</span>}
                </div>
                <div>
                    <label>Seller ID:</label>
                    <input type="number" name="seller_id" value={formData.seller_id} onChange={handleChange} />
                    {errors.seller_id && <span>{errors.seller_id[0]}</span>}
                </div>
                <button type="submit">Create Product</button>
            </form>
        </div>
    );
}