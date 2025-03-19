import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@heroui/react";

// Función para generar un número aleatorio entre un rango
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const investors = [
  {
    id: 1,
    img: <Avatar src={`https://i.pravatar.cc/${getRandomNumber(1, 1000)}`} />,
    name: "Nom Inversor",
    producer: "Nom Productor",
    restaurant: "Nom Restaurant",
    profit: "28%",
    productImg: "rectangle-370.svg",
    productName: "Nom del producte",
    price: "100,00 €",
  },
  {
    id: 2,
    img: <Avatar src={`https://i.pravatar.cc/150?u=${getRandomNumber(1, 1000)}`} />,
    name: "Nom Inversor",
    producer: "Nom Productor",
    restaurant: "Nom Restaurant",
    profit: "28%",
    productImg: "rectangle-371.svg",
    productName: "Nom del producte",
    price: "100,00 €",
  },
  {
    id: 3,
    img: <Avatar src={`https://i.pravatar.cc/150?u=${getRandomNumber(1, 1000)}`} />,
    name: "Nom Inversor",
    producer: "Nom Productor",
    restaurant: "Nom Restaurant",
    profit: "28%",
    productImg: "rectangle-372.svg",
    productName: "Nom del producte",
    price: "100,00 €",
  },
  {
    id: 4,
    img: <Avatar src={`https://i.pravatar.cc/150?u=${getRandomNumber(1, 1000)}`} />,
    name: "Nom Inversor",
    producer: "Nom Productor",
    restaurant: "Nom Restaurant",
    profit: "28%",
    productImg: "rectangle-373.svg",
    productName: "Nom del producte",
    price: "100,00 €",
  },
  {
    id: 5,
    img: <Avatar src={`https://i.pravatar.cc/150?u=${getRandomNumber(1, 1000)}`} />,
    name: "Nom Inversor",
    producer: "Nom Productor",
    restaurant: "Nom Restaurant",
    profit: "28%",
    productImg: "rectangle-374.svg",
    productName: "Nom del producte",
    price: "100,00 €",
  },
  {
    id: 6,
    img: <Avatar src={`https://i.pravatar.cc/150?u=${getRandomNumber(1, 1000)}`} />,
    name: "Nom Inversor",
    producer: "Nom Productor",
    restaurant: "Nom Restaurant",
    profit: "28%",
    productImg: "rectangle-375.svg",
    productName: "Nom del producte",
    price: "100,00 €",
  },
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 3) % investors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <h2 className="text-3xl font-bold">Últimes interaccions</h2>
    <div className="relative w-full flex justify-center items-center overflow-hidden h-96">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="flex gap-4"
        >
          {investors.slice(index, index + 3).map((investor) => (
            <div
              key={investor.id}
              className="bg-white p-6 rounded-2xl shadow-lg w-80"
            >
              <div className="flex items-center gap-4">
                {investor.img}
                <div>
                  <div className="text-lg font-bold">{investor.name}</div>
                  <div className="text-gray-500 text-sm">
                    {investor.producer}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {investor.restaurant}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-gray-700">
                Benefici del {investor.profit}
              </div>
              <div className="mt-4 flex items-center gap-4 border p-2 rounded-lg">
                <img
                  src={investor.productImg}
                  alt="Product"
                  className="w-16 h-16"
                />
                <div>
                  <div className="font-bold">{investor.productName}</div>
                  <div className="text-gray-500">
                    Preu venda: {investor.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
    </>
  );
}