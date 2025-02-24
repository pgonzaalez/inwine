

export default function Header() {
  
  return (
    <header className="w-full h-[100px]  top-[46.5px]">
    <div className="bg-[#eeeeee80] backdrop-blur-[7.5px] border border-white/80 rounded-[20px] mx-[95px] h-full flex items-center justify-between px-8">
      <img src="../../public/logo.webp" className="w-[70px] h-[70px] rounded-full"/>
      
      <div className="flex gap-9 text-xl">
        <span>INICI</span>
        <span>PRODUCTES</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="bg-white border border-[#dadada] rounded-[20px] px-4 py-3 flex items-center gap-5">
          <img src="search-icon.svg" className="w-6 h-6"/>
          <input placeholder="Buscar..." className="text-[#dadada] outline-none"/>
        </div>
        <img src="user0.svg" className="w-[50px] h-[50px]"/>
      </div>
    </div>
  </header>
  )
}

