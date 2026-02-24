import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  User, 
  ChevronRight,
  Mail,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { useFetchUser } from "@/components/auth/FetchUser";
import Footer from "@components/FooterComponent";

const SettingsPage = () => {
  const { user, loading } = useFetchUser();
  const [activeSection, setActiveSection] = useState('security');
  const [successMessage, setSuccessMessage] = useState('');

  const primaryColors = {
    dark: "#9A3E50",
    light: "#C27D7D",
    background: "#F9F9F9",
  };

  const menuItems = [
    { id: 'security', label: 'Seguretat', icon: Lock },
    { id: 'notifications', label: 'Notificacions', icon: Bell },
    { id: 'preferences', label: 'Preferències', icon: Globe },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMessage('Configuració actualitzada correctament');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 rounded-full animate-spin border-4 border-gray-200 border-t-[#9A3E50]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuració</h1>
              <p className="text-gray-500">Gestiona la seguretat i les preferències del teu compte</p>
            </div>
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100"
              >
                <CheckCircle2 size={18} />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Menu */}
            <div className="lg:col-span-1 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
                    activeSection === item.id 
                    ? 'bg-[#9A3E50] text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className={activeSection === item.id ? 'opacity-100' : 'opacity-30'} />
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                
                {activeSection === 'security' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-[#9A3E50]/10 rounded-2xl text-[#9A3E50]">
                        <Shield size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Seguretat del Compte</h2>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contrasenya Actual</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#9A3E50]/20 focus:border-[#9A3E50] outline-none transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nova Contrasenya</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#9A3E50]/20 focus:border-[#9A3E50] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Contrasenya</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#9A3E50]/20 focus:border-[#9A3E50] outline-none transition-all"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="bg-[#9A3E50] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#833444] transition-colors shadow-lg shadow-[#9A3E50]/20"
                      >
                        Actualitzar Contrasenya
                      </button>
                    </form>
                  </motion.div>
                )}

                {activeSection === 'notifications' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-[#9A3E50]/10 rounded-2xl text-[#9A3E50]">
                        <Bell size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Preferències de Notificacions</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg text-gray-400">
                            <Mail size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Notificacions per Email</p>
                            <p className="text-sm text-gray-500">Rep actualitzacions de les teves comandes</p>
                          </div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-6 h-6 rounded-md text-[#9A3E50] focus:ring-[#9A3E50]" />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg text-gray-400">
                            <Smartphone size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Notificacions Push</p>
                            <p className="text-sm text-gray-500">Alertes en temps real al navegador</p>
                          </div>
                        </div>
                        <input type="checkbox" className="w-6 h-6 rounded-md text-[#9A3E50] focus:ring-[#9A3E50]" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'preferences' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-[#9A3E50]/10 rounded-2xl text-[#9A3E50]">
                        <Globe size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Configuració Regional</h2>
                    </div>

                    <div className="space-y-6 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Idioma de la plataforma</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#9A3E50]/20 focus:border-[#9A3E50] outline-none transition-all">
                          <option>Català</option>
                          <option>Castellano</option>
                          <option>English</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#9A3E50]/20 focus:border-[#9A3E50] outline-none transition-all">
                          <option>Euro (€)</option>
                          <option>US Dollar ($)</option>
                        </select>
                      </div>
                      <button 
                        onClick={handleSave}
                        className="bg-[#9A3E50] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#833444] transition-colors shadow-lg shadow-[#9A3E50]/20"
                      >
                        Desar Preferències
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;
