import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const AddLoginForm = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al loguear');
            }

            const result = await response.json();
            setMessage('Login creado exitosamente');

            localStorage.setItem('token', result.token);

            setFormData({
                email: '',
                password: '',
            });

            setTimeout(() => {
                navigate("/"); 
            }, 1000);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Inicia sessió</h1>
                    <p className="mt-2 text-sm text-gray-600">Introdueix les teves credencials per accedir</p>
                </div>
                {message && <p className="text-center mb-4 text-green-500">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <User className="text-gray-400" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Correu electrònic"
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="text-gray-400" />
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contrasenya"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#800020] text-white rounded-lg hover:bg-[#600018] transition duration-300"
                    >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddLoginForm;
