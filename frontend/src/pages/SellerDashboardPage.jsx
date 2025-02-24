import WineList from "@components/WineListComponent";
import Header from "@components/HeaderComponent";
export default function SellerDashboardPage() {
  return (
    <>
    <Header />

      <div className="border border-black h-[966px] relative shadow-lg overflow-hidden">
        
          <div className="w-[1037px] h-[526px] absolute left-[87px] top-[212px] overflow-hidden">
            <WineList />
          </div>

          <div className="text-[32px] leading-[48px] absolute left-[91px] top-[61px]">
            Els teus productes
          </div>
          <div className="text-[#91969e] font-semibold absolute left-[91px] top-[109px]">
            Gestiona els teus productes que hi son a la página
          </div>

          <div className="flex gap-6 absolute left-[91px] top-[161px]">
            <button className="text-[#800020] font-extrabold">ACTIUS</button>
            <button className="font-extrabold">EN ESPERA</button>
            <button className="font-extrabold">VENUTS</button>
          </div>
      </div>
    </>
  );
}
