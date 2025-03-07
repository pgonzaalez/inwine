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
            }, 2000);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl flex">
                <div className="w-full px-30 py-15">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">Inicia sessió</h1>
                    </div>
                    {message && <p className="text-center text-green-500 mb-4">{message}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="space-y-3">
                                {/* Tarjeta de crédito */}
                                <div className="relative">
                                    <div className="flex items-center">
                                        <User className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="peer w-full h-12 bg-white rounded-lg border border-gray-300 pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder=" "
                                            id="email"
                                        />
                                        <label
                                            htmlFor="email"
                                            className="absolute left-10 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                                        >
                                            Correu electrònic
                                        </label>
                                    </div>
                                </div>

                                {/* Cuenta bancaria */}
                                <div className="relative">
                                    <div className="flex items-center">
                                        <Lock className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="peer w-full h-12 bg-white rounded-lg border border-gray-300 pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder=" "
                                            id="password"
                                        />
                                        <label
                                            htmlFor="password"
                                            className="absolute left-10 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                                        >
                                            Contrasenya
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#800020] text-white py-2 rounded-lg hover:bg-[#600018] transition duration-300"
                        >
                            Enviar
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default AddLoginForm;