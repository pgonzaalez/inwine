import { DotIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#333333] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Desktop layout */}
        <div className="hidden md:flex justify-between items-start">
          <div className="flex flex-col items-center max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="logo.webp"
                alt="logo"
                className="w-16 h-16 object-cover object-center rounded-full"
              />
              <p className="text-xl font-bold">INWINE</p>
            </div>
            <p className="text-center text-sm text-gray-300">
              Carrer del Sol, 1, 08201 Sabadell, Barcelona
            </p>
          </div>

          <div className="flex items-center">
            <p className="text-sm text-gray-300">
              © INWINE {new Date().getFullYear()}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <a
              href="#"
              className="text-sm hover:text-gray-300 transition-colors"
            >
              Termes i condicions
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-300 transition-colors"
            >
              Politica de privacitat
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-300 transition-colors"
            >
              Politica de Cookies
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-300 transition-colors"
            >
              Contacta amb nosaltres
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-300 transition-colors"
            >
              Avis legal
            </a>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex flex-col items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="logo.webp"
                alt="logo"
                className="w-16 h-16 object-cover object-center rounded-full"
              />
              <p className="text-xl font-bold">INWINE</p>
            </div>
            <p className="text-center text-sm text-gray-300">
              Carrer del Sol, 1, 08201 Sabadell, Barcelona
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="text-sm hover:text-gray-300 transition-colors"
            >
              Termes i condicions
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-300 transition-colors"
            >
              Politica de privacitat
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-300 transition-colors"
            >
              Politica de Cookies
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-300 transition-colors"
            >
              Contacta amb nosaltres
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-300 transition-colors"
            >
              Avis legal
            </a>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-300">
              © INWINE {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
