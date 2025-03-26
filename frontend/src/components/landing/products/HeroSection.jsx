import { Store, MapPin } from "lucide-react"

export default function HeroSection({ activeFilter, setActiveFilter }) {
  return (
    <div className="relative mb-8 sm:mb-12 rounded-2xl overflow-hidden shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-[#9A3E50]/90 to-black/70 z-10"></div>
      <img
        src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        alt="Wine background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 md:p-12">
        <div className="text-white mb-6 md:mb-0 md:w-1/2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Connectem cellers i restaurants</h1>
          <p className="text-gray-200 text-base sm:text-lg max-w-xl">
            Descobreix vins únics dels millors cellers o explora les demandes dels restaurants més exclusius. Una
            plataforma que uneix l'oferta i la demanda del sector vinícola.
          </p>
        </div>
        <div className="flex flex-col space-y-4 w-full md:w-1/3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Què vols veure?</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className={`w-full rounded-full px-4 py-3 text-base font-medium transition-all duration-300 ${
                  activeFilter === "Productors"
                    ? "bg-white text-[#9A3E50] shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
                onClick={() => setActiveFilter("Productors")}
              >
                <Store className="inline-block w-5 h-5 mr-2" />
                Vins disponibles
              </button>
              <button
                className={`w-full rounded-full px-4 py-3 text-base font-medium transition-all duration-300 ${
                  activeFilter === "Restaurants"
                    ? "bg-white text-[#9A3E50] shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
                onClick={() => setActiveFilter("Restaurants")}
              >
                <MapPin className="inline-block w-5 h-5 mr-2" />
                Demandes actives
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

