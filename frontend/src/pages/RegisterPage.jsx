import { useState } from 'react';
import { User, IdCard, Mail, Lock, Home, Phone, CreditCard, Landmark } from 'lucide-react';

const AddInvestorForm = () => {
    const [formData, setFormData] = useState({
        NIF: '',
        name: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        credit_card: '',
        bank_account: '',
        balance: '',
    });

    const [message, setMessage] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch(`${apiUrl}/v1/investor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear inversor');
            }

            const result = await response.json();
            setMessage('Inversor creado exitosamente');
            setFormData({
                NIF: '',
                name: '',
                email: '',
                password: '',
                address: '',
                phone: '',
                credit_card: '',
                bank_account: '',
                balance: '',
            });
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl flex flex-col md:flex-row">
                <div className="w-full md:w-1/2">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">Crear compte d'usuari inversor</h1>
                        <h4 className="text-gray-600">
                            Tens un compte? <a href="#" className="text-[#800020]">Inicia sessió</a>
                        </h4>
                    </div>
                    {message && <p className="text-center text-green-500 mb-4">{message}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Informació dades personals</h2>
                                <div className="space-y-3">
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
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-2">Informació inici de sessió</h2>
                                <div className="space-y-3">
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
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-2">Informació dades bancàries</h2>
                            <div className="space-y-3">
                                {/* Tarjeta de crédito */}
                                <div className="relative">
                                    <div className="flex items-center">
                                        <CreditCard className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="text"
                                            name="credit_card"
                                            value={formData.credit_card}
                                            onChange={handleChange}
                                            className="peer w-full h-12 bg-white rounded-lg border border-gray-300 pl-10 pr-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder=" "
                                            id="credit_card"
                                        />
                                        <label
                                            htmlFor="credit_card"
                                            className="absolute left-10 top-2 text-gray-500 transition-all transform -translate-y-4 scale-75 origin-top-left bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75"
                                        >
                                            Número tarjeta crèdit
                                        </label>
                                    </div>
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
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#800020] text-white py-2 rounded-lg hover:bg-[#600018] transition duration-300"
                        >
                            Agregar Inversor
                        </button>
                    </form>
                </div>
                <div className="w-full md:w-1/2 md:pl-8 mt-8 md:mt-0">
                    <img
                        src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Imagen lateral"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default AddInvestorForm;
