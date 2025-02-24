export default function Sidebar() {
  return (
    <section>
      <div className="w-[245px] h-[773px] absolute left-6 top-[193px] overflow-hidden bg-white">
        <div className="h-[115px] w-full p-4 flex items-center gap-4">
          <img
            src="image-usuari0.png"
            className="w-[43px] h-[45px] object-cover"
          />
          <div>
            <div className="font-extrabold text-black">Usuari Prova</div>
            <div className="text-[#91969e] text-xs">Rol del Usuari</div>
          </div>
        </div>

        <div className="mt-4 space-y-2 px-4">
          <div className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-[20px] cursor-pointer">
            <img src="file-plus0.svg" className="w-6 h-6" />
            <span>Pujar Producte</span>
          </div>

          <div className="bg-[#efefef] rounded-[20px] p-3 flex items-center gap-4 cursor-pointer">
            <img src="shopping-cart0.svg" className="w-6 h-6" />
            <span>Productes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
