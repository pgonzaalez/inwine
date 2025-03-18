import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Link } from "react-router-dom"

export default function UserCards() {
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

  // Card data
  const cards = [
    {
      id: 1,
      title: "Usuari Productor",
      image: "https://www.scmlogistica.es/wp-content/uploads/como-poner-en-marcha-un-pequeno-almacen.jpg",
      imageAlt: "Almacén",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. In cum, incidunt iure dolore soluta facilis blanditiis quae voluptas praesentium nesciunt labore recusandae nemo quisquam eveniet, provident illo est, ad ab. Suscipit dolorem odit voluptates!",
      linkUrl: "/register",
      features: ["Lorem ipsum dolor", "Lorem ipsum dolor"],
    },
    {
      id: 2,
      title: "Usuari Inversor",
      image: "https://es.msi.com/frontend/imgs/aboutus/kv-investor-information-xs.jpg",
      imageAlt: "Inversor",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. In cum, incidunt iure dolore soluta facilis blanditiis quae voluptas praesentium nesciunt labore recusandae nemo quisquam eveniet, provident illo est, ad ab. Suscipit dolorem odit voluptates!",
      linkUrl: "/registerinversor",
      features: ["Lorem ipsum dolor", "Lorem ipsum dolor"],
    },
    {
      id: 3,
      title: "Usuari Restaurant",
      image: "https://www.antiguarestaurante.com/es/media/ee367c51f9/ee367c51f659c9963f83cba87c831516.cms.jpg",
      imageAlt: "Restaurant",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. In cum, incidunt iure dolore soluta facilis blanditiis quae voluptas praesentium nesciunt labore recusandae nemo quisquam eveniet, provident illo est, ad ab. Suscipit dolorem odit voluptates!",
      linkUrl: "/register",
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

                  <Link to={card.linkUrl}>
                    <div className="bg-red-800 hover:bg-red-900 rounded-lg py-2 px-6 flex items-center justify-center transition-colors duration-200">
                      <span className="text-white text-sm font-medium">Comença</span>
                    </div>
                  </Link>

                  <div className="mt-6">
                    <h4 className="text-black text-md font-medium mb-3">Característiques:</h4>
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

