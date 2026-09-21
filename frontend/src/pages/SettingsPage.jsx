import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  Lock,
  Bell,
  Globe,
  Shield,
  User,
  ChevronRight,
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useFetchUser } from "@/components/auth/FetchUser";
import Footer from "@components/FooterComponent";
import { useTranslation } from "react-i18next";
import { API_URL } from "@/config/api";
import { getCookie } from "@/utils/utils";

const SettingsPage = () => {
  const { t, i18n } = useTranslation('settings');
  const { user, loading, refetchUser } = useFetchUser();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('security');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [notifyByEmail, setNotifyByEmail] = useState(true);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  useEffect(() => {
    if (user && typeof user.notify_by_email === 'boolean') {
      setNotifyByEmail(user.notify_by_email);
    }
  }, [user]);

  // Aquesta pàgina es munta a /settings (amb el header públic fix, cal
  // separar el contingut amb pt-24) i també a /seller|restaurant|investor
  // /settings (dins del Layout amb Sidebar fixa a l'esquerra en md+, cal
  // ml-64 perquè no quedi tapat i pb-16 perquè el menú mòbil inferior no
  // el tapi).
  const isDashboardRoute = /^\/(seller|restaurant|investor)\//.test(location.pathname);

  const primaryColors = {
    dark: "#9A3E50",
    light: "#C27D7D",
    background: "#F9F9F9",
  };

  const menuItems = [
    { id: "security", label: t("settings.menu.security"), icon: Shield },
    { id: "notifications", label: t("settings.menu.notifications"), icon: Bell },
    { id: "preferences", label: t("settings.menu.preferences"), icon: Globe },
  ];

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.password !== passwordForm.password_confirmation) {
      setPasswordError(t("settings.security.errors.mismatch", "Les contrasenyes noves no coincideixen."));
      return;
    }

    if (passwordForm.password.length < 8) {
      setPasswordError(t("settings.security.errors.too_short", "La nova contrasenya ha de tenir almenys 8 caràcters."));
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await fetch(`${API_URL}/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify(passwordForm),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const firstError =
          data?.errors?.current_password?.[0] ||
          data?.errors?.password?.[0] ||
          t("settings.security.errors.generic", "No s'ha pogut actualitzar la contrasenya.");
        setPasswordError(firstError);
        return;
      }

      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
      setSuccessMessage(t("settings.success_message"));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setPasswordError(t("settings.security.errors.generic", "No s'ha pogut actualitzar la contrasenya."));
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleNotifyByEmailToggle = async (e) => {
    const newValue = e.target.checked;
    const previousValue = notifyByEmail;

    setNotifyByEmail(newValue);
    setIsSavingNotifications(true);

    try {
      const response = await fetch(`${API_URL}/user/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({ notify_by_email: newValue }),
      });

      if (!response.ok) {
        throw new Error();
      }

      await refetchUser();
      setSuccessMessage(t("settings.success_message"));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setNotifyByEmail(previousValue);
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
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
      <div
        className={`flex-grow pb-16 ${isDashboardRoute ? "md:ml-64 pt-8" : "pt-24"}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("settings.title")}</h1>
              <p className="text-gray-500">{t("settings.subtitle")}</p>
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
                      <h2 className="text-2xl font-bold text-gray-900">{t("settings.security.title")}</h2>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                      {passwordError && (
                        <div className="flex items-start gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100 text-sm">
                          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                          <span>{passwordError}</span>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("settings.security.current_password")}</label>
                        <input
                          type="password"
                          name="current_password"
                          value={passwordForm.current_password}
                          onChange={handlePasswordChange}
                          autoComplete="current-password"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#9A3E50]/20 focus:border-[#9A3E50] outline-none transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("settings.security.new_password")}</label>
                        <input
                          type="password"
                          name="password"
                          value={passwordForm.password}
                          onChange={handlePasswordChange}
                          autoComplete="new-password"
                          minLength={8}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#9A3E50]/20 focus:border-[#9A3E50] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("settings.security.confirm_password")}</label>
                        <input
                          type="password"
                          name="password_confirmation"
                          value={passwordForm.password_confirmation}
                          onChange={handlePasswordChange}
                          autoComplete="new-password"
                          minLength={8}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#9A3E50]/20 focus:border-[#9A3E50] outline-none transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSavingPassword}
                        className="bg-[#9A3E50] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#833444] transition-colors shadow-lg shadow-[#9A3E50]/20 disabled:opacity-60"
                      >
                        {isSavingPassword
                          ? t("settings.security.saving", "Actualitzant...")
                          : t("settings.security.update_btn")}
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
                      <h2 className="text-2xl font-bold text-gray-900">{t("settings.notifications.title")}</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg text-gray-400">
                            <Mail size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{t("settings.notifications.email_label")}</p>
                            <p className="text-sm text-gray-500">{t("settings.notifications.email_desc")}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifyByEmail}
                          onChange={handleNotifyByEmailToggle}
                          disabled={isSavingNotifications}
                          className="w-6 h-6 rounded-md text-[#9A3E50] focus:ring-[#9A3E50] disabled:opacity-60"
                        />
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
                      <h2 className="text-2xl font-bold text-gray-900">{t("settings.preferences.title")}</h2>
                    </div>

                    <div className="space-y-6 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("settings.preferences.language_label")}</label>
                        <select
                          value={i18n.language}
                          onChange={handleLanguageChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#9A3E50]/20 focus:border-[#9A3E50] outline-none transition-all"
                        >
                          <option value="ca">Català</option>
                          <option value="es">Castellano</option>
                          <option value="en">English</option>
                        </select>
                      </div>
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
