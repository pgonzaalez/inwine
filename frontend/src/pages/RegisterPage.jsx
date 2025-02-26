import { useState } from 'react';

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
        <div>
            <div>
                <h1>Crear compte d'usuari inversor</h1>
                <h4>Tens un compte? Inicia sessió</h4>
            </div>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <h2>Informació dades personals</h2>
                        <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
                        <input type="text" name="NIF" placeholder="NIF" value={formData.NIF} onChange={handleChange} required />
                        <input type="text" name="address" placeholder="Dirección" value={formData.address} onChange={handleChange} />
                        <input type="text" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div>
                        <h2>Informació inici de sessió</h2>
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
                    </div>
                </div>
                <div>
                    <h2>Informació dades bancàries</h2>
                    <input type="text" name="credit_card" placeholder="Tarjeta de crédito" value={formData.credit_card} onChange={handleChange} />
                    <input type="text" name="bank_account" placeholder="Cuenta bancaria" value={formData.bank_account} onChange={handleChange} />
                    <input type="number" name="balance" placeholder="Saldo" value={formData.balance} onChange={handleChange} />
                </div>
                <button type="submit">Agregar Inversor</button>
            </form>
        </div>
    );
};

export default AddInvestorForm;
