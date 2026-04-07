import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useFetchUser } from "@components/auth/FetchUser";
import { getCookie } from "@/utils/utils"
import { useTranslation } from "react-i18next";

export default function UserCards() {
  const { t } = useTranslation();
  const user = useFetchUser();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }
  
  const handleRoleChange = async (role) => {
    try {
      const response = await fetch(`${apiUrl}/update-active-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el rol activo");
      }

      setTimeout(() => {
        switch (role) {
          case "seller":
            navigate("/seller/dashboard");
            break;
          case "restaurant":
            navigate("/restaurant/dashboard");
            break;
          case "investor":
            navigate("/investor/dashboard");
            break;
          default:
            navigate("/login");
        }
      }, 500);
    } catch (error) {
      // console.error("Error updating active role:", error);
      // Puedes manejar el error como prefieras
    }
  };

  // Card data
  const cards = [
    {
      id: 1,
      title: t("landing.user_cards.producer.title"),
      image: "https://www.scmlogistica.es/wp-content/uploads/como-poner-en-marcha-un-pequeno-almacen.jpg",
      imageAlt: t("landing.user_cards.producer.alt"),
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. In cum, incidunt iure dolore soluta facilis blanditiis quae voluptas praesentium nesciunt labore recusandae nemo quisquam eveniet, provident illo est, ad ab. Suscipit dolorem odit voluptates!",
      linkUrl: "/register/seller",
      role: "seller",
      features: ["Lorem ipsum dolor", "Lorem ipsum dolor"],
    },
    {
      id: 2,
      title: t("landing.user_cards.investor.title"),
      image: "https://es.msi.com/frontend/imgs/aboutus/kv-investor-information-xs.jpg",
      imageAlt: t("landing.user_cards.investor.alt"),
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. In cum, incidunt iure dolore soluta facilis blanditiis quae voluptas praesentium nesciunt labore recusandae nemo quisquam eveniet, provident illo est, ad ab. Suscipit dolorem odit voluptates!",
      linkUrl: "/register/investor",
      role: "investor",
      features: ["Lorem ipsum dolor", "Lorem ipsum dolor"],
    },
    {
      id: 3,
      title: t("landing.user_cards.restaurant.title"),
      image: "https://www.antiguarestaurante.com/es/media/ee367c51f9/ee367c51f659c9963f83cba87c831516.cms.jpg",
      imageAlt: t("landing.user_cards.restaurant.alt"),
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. In cum, incidunt iure dolore soluta facilis blanditiis quae voluptas praesentium nesciunt labore recusandae nemo quisquam eveniet, provident illo est, ad ab. Suscipit dolorem odit voluptates!",
      linkUrl: "/register/restaurant",
      role: "restaurant",
      features: ["Lorem ipsum dolor", "Lorem ipsum dolor"],
    },
  ]

  return (
    <section className="text-center py-12">
      <motion.div
        className="mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <motion.div
                key={card.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                variants={cardVariants}
              >
                <div className="w-full">
                  <img
                    src={card.image || "/placeholder.svg"}
                    alt={card.imageAlt}
                    className="w-full h-56 object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 mb-4">
                    <h2 className="text-black text-xl sm:text-2xl font-medium">{card.title}</h2>
                    <p className="text-gray-700 text-sm leading-relaxed">{card.description}</p>
                  </div>

                  {user.user?.roles?.includes(card.role) ? (
                    <div className="bg-red-800 hover:bg-red-900 rounded-lg py-2 px-6 flex items-center justify-center transition-colors duration-200">
                      <button className="text-white text-sm font-medium" type="button" onClick={() => handleRoleChange(card.role)}>
                        {t("landing.user_cards.open_profile")}
                      </button>
                    </div>
                  ) : (
                    <Link to={user.user ? (user.user.active_role?.[0] + "/profile") : card.linkUrl}>
                      <div className="bg-red-800 hover:bg-red-900 rounded-lg py-2 px-6 flex items-center justify-center transition-colors duration-200">
                        <span className="text-white text-sm font-medium">{t("landing.user_cards.start")}</span>
                      </div>
                    </Link>
                  )}

                  <div className="mt-6">
                    <h4 className="text-black text-md font-medium mb-3">{t("landing.user_cards.features_title")}:</h4>
                    <div className="flex flex-col gap-3">
                      {card.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check size={18} className="text-red-800" />
                          <span className="text-gray-800 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

