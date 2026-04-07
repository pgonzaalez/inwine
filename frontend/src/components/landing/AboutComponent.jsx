import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { useTranslation } from "react-i18next";

export default function AboutSection() {
  const { t } = useTranslation();
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
              <h2 className="text-[#9A3E50] text-2xl font-normal mb-2">{t("landing.about.who_we_are")}</h2>
              <div className="w-full h-1 bg-gradient-to-r from-[#9A3E50] mb-6"></div>
            </div>
            <p className="text-black text-lg leading-relaxed text-left">
              {t("landing.about.description")}
            </p>
          </motion.div>

          <motion.div className="mt-16" variants={rightItemVariants}>
            <div className="flex flex-col items-end">
              <h2 className="text-[#9A3E50] text-2xl font-normal mb-2 text-right w-full">{t("landing.about.what_we_offer")}</h2>
              <div className="w-full h-1 bg-gradient-to-l from-[#C27D7D] mb-6"></div>
            </div>
            <p className="text-black text-lg leading-relaxed text-right">
              {t("landing.about.cellar_question")}
              <br />
              {t("landing.about.restaurant_question")}
              <br />
              {t("landing.about.investor_question")}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

