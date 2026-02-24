
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import Footer from "@components/FooterComponent";
import AIChatComponent from "@components/AIChatComponent";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
  const { t } = useTranslation();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: t("landing.contact.phone.title"),
      detail: "+34 937 12 34 56",
      description: t("landing.contact.phone.desc"),
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: t("landing.contact.email.title"),
      detail: "info@inwine.cat",
      description: t("landing.contact.email.desc"),
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t("landing.contact.office.title"),
      detail: "Carrer del Sol, 1, 08201 Sabadell",
      description: t("landing.contact.office.desc"),
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("landing.contact.title")} <span className="text-[#9A3E50]">InWine</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("landing.contact.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    visible: { opacity: 1, x: 0, transition: { delay: index * 0.1, duration: 0.5 } },
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#9A3E50]/10 rounded-xl text-[#9A3E50]">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{info.title}</h3>
                      <p className="text-[#9A3E50] font-medium mt-1">{info.detail}</p>
                      <p className="text-sm text-gray-500 mt-1">{info.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Message helper */}
              <motion.div
                className="bg-[#9A3E50] p-8 rounded-3xl text-white relative overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1, transition: { delay: 0.4, duration: 0.5 } },
                }}
              >
                <div className="relative z-10">
                  <MessageSquare className="w-10 h-10 mb-4 opacity-50" />
                  <h3 className="text-xl font-bold mb-2">{t("landing.contact.support.title")}</h3>
                  <p className="text-white/80 text-sm">
                    {t("landing.contact.support.desc")}
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              </motion.div>
            </div>

            <motion.div
              className="lg:col-span-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } },
              }}
            >
              <AIChatComponent />
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
