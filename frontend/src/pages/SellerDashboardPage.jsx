import Header from "@components/HeaderComponent";
import Sidebar from "@components/SidebarComponent";

export default function SellerDashboardPage() {
  return (
    <>
      <div className="bg-white border border-black h-[966px] relative shadow-lg overflow-hidden">
        <Sidebar />

        <Header />

        <main className="bg-[#efefef] w-[1189px] h-[773px] absolute left-[251px] top-[193px] overflow-hidden">
          <div className="px-[91px] pt-[61px]">
            <h1 className="text-3xl mb-2">Els teus productes</h1>
            <p className="text-[#91969e] font-semibold mb-8">
              Visualitza els teus productes venuts, amb la possibilitat de
              tornar a vendre el mateix producte.
            </p>

            <div className="flex gap-6 mb-8">
              <button className="font-extrabold">ACTIUS</button>
              <button className="font-extrabold">EN ESPERA</button>
              <button className="font-extrabold text-[#800020]">VENUTS</button>
            </div>

            <div className="bg-white rounded-lg border border-black/10 p-4 flex items-center gap-6 mb-4">
              <img
                src="https://www.bodegasmurilloviteri.com/wp-content/uploads/2019/06/aranzubia-magnum-1.jpg"
                className="w-[97px] h-[97px] object-cover"
              />

              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold">25 €</div>
                    <div className="text-[#91969e] text-sm">
                      Viña Zorzal Garnacha 2023
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-bold">Publicació:</span>
                      <span className="text-[#91969e]">29/01/2025</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-bold">Enviat:</span>
                      <span className="text-[#91969e]">30/01/2025</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="bg-[#800020] text-white px-6 py-3 rounded-[15px] font-bold">
                Torna a vendre
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
