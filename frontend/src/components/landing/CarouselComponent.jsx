import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const wines = [
  { id: 1, name: "ONDULE", description: "NAPA VALLEY COLOMBARD", image: "https://hips.hearstapps.com/hmg-prod/images/red-wine-being-poured-into-glass-at-sunset-outdoor-royalty-free-image-1738062893.pjpeg?crop=0.667xw:1.00xh;0.219xw,0&resize=640:*" },
  { id: 2, name: "RESERVE", description: "CABERNET SAUVIGNON", image: "https://www.productosdeasturias.com/7708-home_default/vino-tinto-dop-aroma-de-ibias.jpg" },
  { id: 3, name: "VINTAGE", description: "MERLOT SPECIAL EDITION", image: "https://www.saborusa.com/do/wp-content/uploads/sites/8/2019/10/Vino-para-quedarse-Foto-destacada.png" },
  { id: 4, name: "ELEGANCE", description: "PINOT NOIR", image: "https://covinas.com/wp-content/uploads/2016/10/253-10-CURIOSIDADES.jpg" },
  { id: 5, name: "PRESTIGE", description: "CHARDONNAY RESERVE", image: "https://fishsolutions.pescanova.es/wp-content/uploads/2022/04/formacion-vinos-copa-fish-solutions.jpg" },
  { id: 6, name: "HERITAGE", description: "SYRAH GRAND CRU", image: "https://www.bodegasgongora.com/wp-content/uploads/2023/08/color-del-vino.jpg" },
  // { id: 7, name: "TERROIR", description: "MALBEC SELECTION", image: "https://distribucionestodobar.es/wp-content/uploads/2024/04/rioja.jpg" },
  // { id: 8, name: "LEGACY", description: "TEMPRANILLO CRIANZA", image: "https://images.unsplash.com/photo-1605530692359-436bec27a35a" },
  // { id: 9, name: "ESSENCE", description: "GRENACHE NOIR", image: "https://images.unsplash.com/photo-1571624436278-43d52a7d90fc" },
  // { id: 10, name: "ALTITUDE", description: "SAUVIGNON BLANC", image: "https://images.unsplash.com/photo-1571939208996-5de7527b64a0" },
];

export default function WineShowcase() {
  const [currentWine, setCurrentWine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWine((prev) => (prev + 1) % wines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-white relative">
      <div className="h-screen flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 h-screen flex items-center justify-center relative overflow-hidden">
          {wines.map((wine, index) => (
            <motion.div
              key={wine.id}
              className="absolute w-full h-full flex items-center justify-center"
              initial={{ x: index > currentWine ? "100%" : index < currentWine ? "-100%" : 0, opacity: 0 }}
              animate={{ x: index === currentWine ? 0 : index > currentWine ? "100%" : "-100%", opacity: index === currentWine ? 1 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="relative w-full h-full">
                <img src={wine.image} alt={wine.name} className="object-cover w-full h-full" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full md:w-1/2 h-screen flex items-center justify-center p-8">
          <div className="max-w-md">
            <motion.h2
              key={`title-${currentWine}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold text-black mb-4"
            >
              {wines[currentWine].name}
            </motion.h2>
            <motion.p
              key={`desc-${currentWine}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl text-black/80 mb-8"
            >
              {wines[currentWine].description}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <h3 className="text-3xl font-medium text-black mb-6">Aconsegueix els millors vins</h3>
              <p className="text-black/70 mb-8">
                Descobreix la nostra selecció de vins premium, elaborats amb les millors raïms i tècniques tradicionals.
                Cada ampolla representa l’excel·lència i passió per la viticultura.
              </p>
              <button className="px-8 py-3 bg-black/10 hover:bg-black/20 text-black rounded-full transition-colors">
                Veure col·lecció
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}