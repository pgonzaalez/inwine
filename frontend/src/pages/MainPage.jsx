
import { motion } from "framer-motion";
import Header from "@components/HeaderComponent";
import Footer from "@components/FooterComponent";
import AboutSection from "@components/landing/AboutComponent";
import CarouselComponent from "@components/landing/CarouselComponent";
import UserCards from "@components/landing/UserCardsComponent";
import LastInteractions from "@components/landing/LastInteractionsComponent";


export default function App() {

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
        >
          <AboutSection />
        </motion.div>
      </section>

      <section className="text-center">
        <motion.div
          className="mx-auto p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          <CarouselComponent />
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
          <LastInteractions />
        </motion.div>
      </section>

      <section className=" text-center py-12">
        <motion.div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          <UserCards />
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
