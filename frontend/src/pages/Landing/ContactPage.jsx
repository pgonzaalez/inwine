import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Footer from "@components/FooterComponent";
import Seo from "@components/Seo";
import { useTranslation } from "react-i18next";

const PRIMARY = "#9A3E50";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

export default function ContactPage() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success

  const contactInfo = [
    {
      icon: Phone,
      title: t("landing.contact.phone.title"),
      detail: "+34 937 12 34 56",
      href: "tel:+34937123456",
      description: t("landing.contact.phone.desc"),
    },
    {
      icon: Mail,
      title: t("landing.contact.email.title"),
      detail: "info@inwine.cat",
      href: "mailto:info@inwine.cat",
      description: t("landing.contact.email.desc"),
    },
    {
      icon: MapPin,
      title: t("landing.contact.office.title"),
      detail: "Carrer del Sol, 1, 08201 Sabadell",
      href: "https://maps.google.com/?q=Carrer+del+Sol+1+Sabadell",
      description: t("landing.contact.office.desc"),
    },
  ];

  const validate = () => {
    const next = {};
    const requiredMsg = t("landing.contact.form.error_required");
    if (!form.name.trim()) next.name = requiredMsg;
    if (!form.email.trim()) next.email = requiredMsg;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = t("landing.contact.form.error_email");
    if (!form.message.trim()) next.message = requiredMsg;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending" || !validate()) return;
    setStatus("sending");
    // No hi ha endpoint de contacte al backend: simulem l'enviament.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const inputBase =
    "w-full py-2.5 px-4 bg-white border rounded-xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9A3E50]/20 focus:border-[#9A3E50] transition-all";

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <Seo
        title="Contacte"
        description={t("landing.contact.subtitle")}
        path="/contacte"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("landing.contact.title")}{" "}
            <span style={{ color: PRIMARY }}>InWine</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("landing.contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: contact info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={info.title}
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#9A3E50]/30 transition-all"
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                >
                  <div className="p-3 rounded-xl bg-[#9A3E50]/10 text-[#9A3E50] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {info.title}
                    </h3>
                    <p className="text-[#9A3E50] font-medium mt-0.5 break-words">
                      {info.detail}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {info.description}
                    </p>
                  </div>
                </motion.a>
              );
            })}

            {/* Hours */}
            <motion.div
              className="flex items-start gap-4 bg-[#9A3E50] p-5 rounded-2xl text-white"
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div className="p-3 rounded-xl bg-white/15 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">
                  {t("landing.contact.hours_title")}
                </h3>
                <p className="text-white/85 text-sm mt-1">
                  {t("landing.contact.hours_desc")}
                </p>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <iframe
                title="InWine map"
                className="w-full h-56"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.openstreetmap.org/export/embed.html?bbox=2.0980%2C41.5400%2C2.1180%2C41.5520&layer=mapnik&marker=41.5460%2C2.1080"
              />
            </motion.div>
          </div>

          {/* Right: form */}
          <motion.div
            className="lg:col-span-3"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={2}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              {status === "success" ? (
                <div className="text-center py-12">
                  <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="text-green-600 w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {t("landing.contact.form.success_title")}
                  </h2>
                  <p className="text-gray-500 mb-6">
                    {t("landing.contact.form.success_desc")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                  >
                    {t("landing.contact.form.title")}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t("landing.contact.form.title")}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 mb-6">
                    {t("landing.contact.form.desc")}
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          {t("landing.contact.form.name")}
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          placeholder={t("landing.contact.form.name_ph")}
                          className={`${inputBase} ${
                            errors.name ? "border-red-400" : "border-gray-200"
                          }`}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          {t("landing.contact.form.email")}
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder={t("landing.contact.form.email_ph")}
                          className={`${inputBase} ${
                            errors.email ? "border-red-400" : "border-gray-200"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        {t("landing.contact.form.subject")}
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder={t("landing.contact.form.subject_ph")}
                        className={`${inputBase} border-gray-200`}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        {t("landing.contact.form.message")}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder={t("landing.contact.form.message_ph")}
                        className={`${inputBase} resize-none ${
                          errors.message ? "border-red-400" : "border-gray-200"
                        }`}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#9A3E50] text-white font-bold rounded-xl hover:bg-[#853545] transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-pink-900/10 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t("landing.contact.form.sending")}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {t("landing.contact.form.send")}
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
