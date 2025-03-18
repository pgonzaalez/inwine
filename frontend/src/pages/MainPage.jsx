import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@components/HeaderComponent";
import Footer from "@components/FooterComponent";
import LastInteractions from "@components/LastInteractionsComponent";
import { Check, Handshake } from "lucide-react";

export default function App() {
  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      <Header />
      <div className="relative w-full h-screen overflow-hidden">
        {/* Fons de vídeo */}
        <video
          loop
          autoPlay
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="hero.mp4" type="video/mp4" />
        </video>
      </div>

      <section className="text-center">
        <motion.div
          className="mx-auto p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={fadeInLeft}
        >
          <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="mb-16">
              <div className="flex flex-col items-start">
                <h2 className="text-[#741C28] text-2xl font-normal mb-2">
                  QUI SOM
                </h2>
                <div className="w-full h-1 bg-[#741C28] mb-6"></div>
              </div>
              <p className="text-black text-lg leading-relaxed">
                Inwine és una plataforma que permet disposar de qualsevol vi a
                la carta dels restaurants minimitzant el risc, potenciant les
                vendes dels cellers i creant valor pel inversors a partir de
                quantitats molt baixes.
              </p>
            </div>

            <div className="mt-16">
              <div className="flex flex-col items-end">
                <h2 className="text-[#741C28] text-2xl font-normal mb-2 text-right w-full">
                  QUÈ OFERIM
                </h2>
                <div className="w-full h-1 bg-[#741C28] mb-6"></div>
              </div>
              <p className="text-black text-lg leading-relaxed text-right">
                Ets un celler? Arriba a més restaurants.
                <br />
                Tens un restaurant? Amplia la teva carta de vins sense invertir
                i sense risc.
                <br />
                Vols invertir? Inverteix amb opció a altes rendibilitats i amb
                nul risc. Tu tries el vi i el restaurant!
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className=" text-center">
        <motion.div
          className=" mx-auto p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold">Últimes interaccions</h2>
          <LastInteractions />
        </motion.div>
      </section>

      <section className="bg-gray-50 text-center py-12">
        <motion.div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={fadeInRight}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Productor Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="w-full">
                  <img
                    src="https://www.scmlogistica.es/wp-content/uploads/como-poner-en-marcha-un-pequeno-almacen.jpg"
                    alt="Almacén"
                    className="w-full h-56 object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 mb-4">
                    <h2 className="text-black text-xl sm:text-2xl font-medium">
                      Usuari Productor
                    </h2>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      In cum, incidunt iure dolore soluta facilis blanditiis
                      quae voluptas praesentium nesciunt labore recusandae nemo
                      quisquam eveniet, provident illo est, ad ab. Suscipit
                      dolorem odit voluptates!
                    </p>
                  </div>

                  <Link to="/register/seller">
                    <div className="bg-red-800 hover:bg-red-900 rounded-lg py-2 px-6 flex items-center justify-center transition-colors duration-200">
                      <span className="text-white text-sm font-medium">
                        Comença
                      </span>
                    </div>
                  </Link>

                  <div className="mt-6">
                    <h4 className="text-black text-md font-medium mb-3">
                      Característiques:
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Check size={18} className="text-red-800" />
                        <span className="text-gray-800 text-sm">
                          Lorem ipsum dolor
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={18} className="text-red-800" />
                        <span className="text-gray-800 text-sm">
                          Lorem ipsum dolor
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inversor Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="w-full">
                  <img
                    src="https://es.msi.com/frontend/imgs/aboutus/kv-investor-information-xs.jpg"
                    alt="Inversor"
                    className="w-full h-56 object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 mb-4">
                    <h2 className="text-black text-xl sm:text-2xl font-medium">
                      Usuari Inversor
                    </h2>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      In cum, incidunt iure dolore soluta facilis blanditiis
                      quae voluptas praesentium nesciunt labore recusandae nemo
                      quisquam eveniet, provident illo est, ad ab. Suscipit
                      dolorem odit voluptates!
                    </p>
                  </div>

                  <Link to="/register/inversor">
                    <div className="bg-red-800 hover:bg-red-900 rounded-lg py-2 px-6 flex items-center justify-center transition-colors duration-200">
                      <span className="text-white text-sm font-medium">
                        Comença
                      </span>
                    </div>
                  </Link>

                  <div className="mt-6">
                    <h4 className="text-black text-md font-medium mb-3">
                      Característiques:
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Check size={18} className="text-red-800" />
                        <span className="text-gray-800 text-sm">
                          Lorem ipsum dolor
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={18} className="text-red-800" />
                        <span className="text-gray-800 text-sm">
                          Lorem ipsum dolor
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Restaurant Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="w-full">
                  <img
                    src="https://www.antiguarestaurante.com/es/media/ee367c51f9/ee367c51f659c9963f83cba87c831516.cms.jpg"
                    alt="Restaurant"
                    className="w-full h-56 object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 mb-4">
                    <h2 className="text-black text-xl sm:text-2xl font-medium">
                      Usuari Restaurant
                    </h2>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      In cum, incidunt iure dolore soluta facilis blanditiis
                      quae voluptas praesentium nesciunt labore recusandae nemo
                      quisquam eveniet, provident illo est, ad ab. Suscipit
                      dolorem odit voluptates!
                    </p>
                  </div>

                  <Link to="/register/restaurant">
                    <div className="bg-red-800 hover:bg-red-900 rounded-lg py-2 px-6 flex items-center justify-center transition-colors duration-200">
                      <span className="text-white text-sm font-medium">
                        Comença
                      </span>
                    </div>
                  </Link>

                  <div className="mt-6">
                    <h4 className="text-black text-md font-medium mb-3">
                      Característiques:
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Check size={18} className="text-red-800" />
                        <span className="text-gray-800 text-sm">
                          Lorem ipsum dolor
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={18} className="text-red-800" />
                        <span className="text-gray-800 text-sm">
                          Lorem ipsum dolor
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
