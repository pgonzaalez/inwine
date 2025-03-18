import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function AboutSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
        staggerDirection: -1,
      },
    },
  }

  const leftItemVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeIn" },
    },
  }

  const rightItemVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
    exit: {
      x: 100,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeIn" },
    },
  }

  return (
    <section ref={sectionRef}>
      <motion.div
        className="mx-auto p-8"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="exit"
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto py-12 px-6">
          <motion.div className="mb-16" variants={leftItemVariants}>
            <div className="flex flex-col items-start">
              <h2 className="text-[#741C28] text-2xl font-normal mb-2">QUI SOM</h2>
              <div className="w-full h-1 bg-[#741C28] mb-6"></div>
            </div>
            <p className="text-black text-lg leading-relaxed text-left">
              Inwine és una plataforma que permet disposar de qualsevol vi a la carta dels restaurants minimitzant el
              risc, potenciant les vendes dels cellers i creant valor pel inversors a partir de quantitats molt baixes.
            </p>
          </motion.div>

          <motion.div className="mt-16" variants={rightItemVariants}>
            <div className="flex flex-col items-end">
              <h2 className="text-[#741C28] text-2xl font-normal mb-2 text-right w-full">QUÈ OFERIM</h2>
              <div className="w-full h-1 bg-[#741C28] mb-6"></div>
            </div>
            <p className="text-black text-lg leading-relaxed text-right">
              Ets un celler? Arriba a més restaurants.
              <br />
              Tens un restaurant? Amplia la teva carta de vins sense invertir i sense risc.
              <br />
              Vols invertir? Inverteix amb opció a altes rendibilitats i amb nul risc. Tu tries el vi i el restaurant!
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

