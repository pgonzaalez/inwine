import { useState } from 'react';
import { User, Mail, Lock, Home, Phone, CreditCard, Banknote } from 'lucide-react';

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:8000/api/v1/investor', {
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
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl flex">
                <div className="w-1/2">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">Crear compte d'usuari inversor</h1>
                        <h4 className="text-gray-600">Tens un compte? <a href="#" className="text-[#800020]">Inicia sessió</a></h4>
                    </div>
                    {message && <p className="text-center text-green-500 mb-4">{message}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Informació dades personals</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center border-1 border-gray-400 rounded-lg p-2">
                                        <User className="text-gray-400 mr-2" />
                                        <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required className="w-full outline-none" />
                                    </div>
                                    <div className="flex items-center border-1 border-gray-400 rounded-lg p-2">
                                        <User className="text-gray-400 mr-2" />
                                        <input type="text" name="NIF" placeholder="NIF" value={formData.NIF} onChange={handleChange} required className="w-full outline-none" />
                                    </div>
                                    <div className="flex items-center border-1 border-gray-400 rounded-lg p-2">
                                        <Home className="text-gray-400 mr-2" />
                                        <input type="text" name="address" placeholder="Dirección" value={formData.address} onChange={handleChange} className="w-full outline-none" />
                                    </div>
                                    <div className="flex items-center border-1 border-gray-400 rounded-lg p-2">
                                        <Phone className="text-gray-400 mr-2" />
                                        <input type="text" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} className="w-full outline-none" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Informació inici de sessió</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center border-1 border-gray-400 rounded-lg p-2">
                                        <Mail className="text-gray-400 mr-2" />
                                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full outline-none" />
                                    </div>
                                    <div className="flex items-center border-1 border-gray-400 rounded-lg p-2">
                                        <Lock className="text-gray-400 mr-2" />
                                        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required className="w-full outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Informació dades bancàries</h2>
                            <div className="space-y-3">
                                <div className="flex items-center border-1 border-gray-400 rounded-lg p-2">
                                    <CreditCard className="text-gray-400 mr-2" />
                                    <input type="text" name="credit_card" placeholder="Tarjeta de crédito" value={formData.credit_card} onChange={handleChange} className="w-full outline-none" />
                                </div>
                                <div className="flex items-center border-1 border-gray-400 rounded-lg p-2">
                                    <Banknote className="text-gray-400 mr-2" />
                                    <input type="text" name="bank_account" placeholder="Cuenta bancaria" value={formData.bank_account} onChange={handleChange} className="w-full outline-none" />
                                </div>
                                <div className="flex items-center border-1 border-gray-400 rounded-lg p-2">
                                    <Banknote className="text-gray-400 mr-2" />
                                    <input type="number" name="balance" placeholder="Saldo" value={formData.balance} onChange={handleChange} className="w-full outline-none" />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-[#800020] text-white py-2 rounded-lg hover:bg-[#600018] transition duration-300">Agregar Inversor</button>
                    </form>
                </div>
                <div className="w-1/2 pl-8">
                    <img 
                        src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Reemplaza con la URL de tu imagen
                        alt="Imagen lateral"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default AddInvestorForm;