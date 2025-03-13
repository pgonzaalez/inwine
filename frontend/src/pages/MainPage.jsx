import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@components/HeaderComponent";
import LastInteractions from "@components/LastInteractionsComponent";

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
    </>
  );
}
