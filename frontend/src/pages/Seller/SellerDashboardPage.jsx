import WineList from "@components/WineListComponent";
import Header from "@components/HeaderComponent";
import Sidebar from "@components/SidebarComponent";
import { Link } from "react-router-dom";

export default function SellerDashboardPage() {
  return (
    <>
      <Header />
      <div className="flex flex-col mt-[60px] h-[calc(100vh-60px)]">
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 ml-[245px] p-6 bg-gray-100 overflow-y-auto">
            <div className="text-2xl font-bold text-gray-900">
              Els teus productes
            </div>
            <div className="text-gray-700 mb-4">
              Gestiona els teus productes que hi son a la página
            </div>

            <div className="flex gap-4 mb-6">
              <button className="text-[#800020] font-extrabold px-4 py-2 border-b-2 border-[#800020]">
                ACTIUS
              </button>
              <button className="font-extrabold px-4 py-2 border-b-2 border-transparent hover:border-gray-400">
                EN ESPERA
              </button>
              <button className="font-extrabold px-4 py-2 border-b-2 border-transparent hover:border-gray-400">
                VENUTS
              </button>
            </div>

            <div className="p-4 rounded-2xl">
              <WineList />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
