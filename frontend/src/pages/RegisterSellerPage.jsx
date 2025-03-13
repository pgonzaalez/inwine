import { useState } from 'react';
import { User, IdCard, Mail, Lock, Home, Phone, BookUser, Landmark, CornerDownLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const AddSellerForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        NIF: '',
        name: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        name_contact: '',
        bank_account: '',
        balance: '',
    });
    const apiUrl = import.meta.env.VITE_API_URL;
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch(`${apiUrl}/v1/seller`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    setErrors(data.errors || {}); // Asegúrate de que data.errors no sea undefined
                } else {
                    throw new Error(data.message || 'Error al crear seller');
                }
            } else {
                setMessage('Seller creado exitosamente');
                setFormData({
                    NIF: '',
                    name: '',
                    email: '',
                    password: '',
                    address: '',
                    phone: '',
                    name_contact: '',
                    bank_account: '',
                    balance: '',
                });

                setTimeout(() => {
                    navigate("/");
                }, 1000);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl flex flex-col md:flex-row">
                <div className="w-full md:w-1/2">
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <button
                                onClick={() => navigate(-1)}
                                className="border-2 rounded-lg p-2 hover:bg-gray-200 transition-colors duration-200"
                            >
                                <CornerDownLeft size={20} className="cursor-pointer" />
                            </button>
                            <h1 className="text-2xl font-bold text-center w-full">Crear compte d'usuari productor</h1>
                        </div>
                        <h4 className="text-gray-600 text-center">
                            Tens un compte? <a href="/login" className="text-[#800020]">Inicia sessió</a>
                        </h4>
                    </div>

                    {message && <p className="text-center text-green-500 mb-4">{message}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h2 className="text-lg font-semibold mb-4">Informació dades personals</h2>
                                <div className="space-y-2">
                                    {/* Nombre */}
                                    <div className="relative">
                                        <div className="flex items-center">
                                            <User className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="peer w-full h-12 bg-white rounded-lg border border-gray-300 pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder=" "
                                                id="name"
                                                required
                                            />
                                            <label
                                                htmlFor="name"
                                                className="absolute left-10 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                                            >
                                                Nom usuari
                                            </label>
                                        </div>
                                    </div>
                                    <div className="h-6">
                                        {errors.name && (
                                            <span className="text-red-500 text-xs mt-1">
                                                {errors.name[0]}
                                            </span>
                                        )}
                                    </div>

                                    {/* NIF */}
                                    <div className="relative">
                                        <div className="flex items-center">
                                            <IdCard className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            <input
                                                type="text"
                                                name="NIF"
                                                value={formData.NIF}
                                                onChange={handleChange}
                                                className="peer w-full h-12 bg-white rounded-lg border border-gray-300 pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder=" "
                                                id="NIF"
                                                required
                                            />
                                            <label
                                                htmlFor="NIF"
                                                className="absolute left-10 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                                            >
                                                NIF
                                            </label>
                                        </div>
                                    </div>
                                    <div className="h-6">
                                        {errors.NIF && (
                                            <span className="text-red-500 text-xs mt-1">
                                                {errors.NIF[0]}
                                            </span>
                                        )}
                                    </div>

                                    {/* Dirección */}
                                    <div className="relative">
                                        <div className="flex items-center">
                                            <Home className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="peer w-full h-12 bg-white rounded-lg border border-gray-300 pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder=" "
                                                id="address"
                                            />
                                            <label
                                                htmlFor="address"
                                                className="absolute left-10 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                                            >
                                                Adreça
                                            </label>
                                        </div>
                                    </div>
                                    <div className="h-6">
                                        {errors.address && (
                                            <span className="text-red-500 text-xs mt-1">
                                                {errors.address[0]}
                                            </span>
                                        )}
                                    </div>

                                    {/* Teléfono */}
                                    <div className="relative">
                                        <div className="flex items-center">
                                            <Phone className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="peer w-full h-12 bg-white rounded-lg border border-gray-300 pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder=" "
                                                id="phone"
                                            />
                                            <label
                                                htmlFor="phone"
                                                className="absolute left-10 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                                            >
                                                Telèfon contacte
                                            </label>
                                        </div>
                                    </div>
                                    <div className="h-6">
                                        {errors.phone && (
                                            <span className="text-red-500 text-xs mt-1">
                                                {errors.phone[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-4">Informació inici de sessió</h2>
                                <div className="space-y-2">
                                    {/* Email */}
                                    <div className="relative">
                                        <div className="flex items-center">
                                            <Mail className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="peer w-full h-12 bg-white rounded-lg border border-gray-300 pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder=" "
                                                id="email"
                                                required
                                            />
                                            <label
                                                htmlFor="email"
                                                className="absolute left-10 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                                            >
                                                Email
                                            </label>
                                        </div>
                                    </div>
                                    <div className="h-6">
                                        {errors.email && (
                                            <span className="text-red-500 text-xs mt-1">
                                                {errors.email[0]}
                                            </span>
                                        )}
                                    </div>

                                    {/* Contraseña */}
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
                                                required
                                            />
                                            <label
                                                htmlFor="password"
                                                className="absolute left-10 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                                            >
                                                Contrasenya
                                            </label>
                                        </div>
                                    </div>
                                    <div className="h-6">
                                        {errors.password && (
                                            <span className="text-red-500 text-xs mt-1">
                                                {errors.password[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-4">Informació dades bancàries</h2>
                            <div className="space-y-2">
                                {/* Nom de contacto */}
                                <div className="relative">
                                    <div className="flex items-center">
                                        <BookUser className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="text"
                                            name="name_contact"
                                            value={formData.name_contact}
                                            onChange={handleChange}
                                            className="peer w-full h-12 bg-white rounded-lg border border-gray-300 pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder=" "
                                            id="name_contact"
                                        />
                                        <label
                                            htmlFor="name_contact"
                                            className="absolute left-10 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                                        >
                                            Nom de contacte
                                        </label>
                                    </div>
                                </div>
                                <div className="h-6">
                                    {errors.name_contact && (
                                        <span className="text-red-500 text-xs mt-1">
                                            {errors.name_contact[0]}
                                        </span>
                                    )}
                                </div>

                                {/* Cuenta bancaria */}
                                <div className="relative">
                                    <div className="flex items-center">
                                        <Landmark className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="text"
                                            name="bank_account"
                                            value={formData.bank_account}
                                            onChange={handleChange}
                                            className="peer w-full h-12 bg-white rounded-lg border border-gray-300 pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder=" "
                                            id="bank_account"
                                        />
                                        <label
                                            htmlFor="bank_account"
                                            className="absolute left-10 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                                        >
                                            Número compte
                                        </label>
                                    </div>
                                </div>
                                <div className="h-6">
                                    {errors.bank_account && (
                                        <span className="text-red-500 text-xs mt-1">
                                            {errors.bank_account[0]}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#800020] text-white py-2 rounded-lg hover:bg-[#600018] transition duration-300"
                        >
                            Agregar Productor
                        </button>
                    </form>
                </div>
                <div className="w-full md:w-1/2 md:pl-8 mt-8 md:mt-0">
                    <img
                        src="https://media.istockphoto.com/id/1363666079/es/foto/el-propietario-de-la-bodega-y-experto-en-control-de-calidad-comprobando-la-calidad-del-vino-en.jpg?s=612x612&w=0&k=20&c=23hm_w9AIaUJsQyBZd0TmqkWAvk5iglIjZ7Pw_857_8="
                        alt="Imagen lateral"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default AddSellerForm;
