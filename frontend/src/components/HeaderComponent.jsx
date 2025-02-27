import { Search } from "lucide-react";
import { Avatar } from "@heroui/react";

export default function Header() {
  return (
    <header className="flex items-center w-[75%] h-[60px] top-0 left-1/2 transform -translate-x-1/2 fixed z-10 bg-[#eeeeee80] backdrop-blur-[5px] border border-white/80 rounded-lg max-w-screen-xl mx-auto justify-between px-3">
      <img
        src="../../public/logo.webp"
        className="w-[40px] h-[40px] rounded-full"
      />

      <div className="flex gap-3 text-base text-black hidden sm:flex">
        <span>INICI</span>
        <span>PRODUCTES</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-white border border-[#dadada] rounded-lg px-3 py-1.5 flex items-center gap-2">
          <Search className="w-4 h-4" />
          <input
            placeholder="Buscar..."
            className="text-[#dadada] outline-none text-sm w-32"
          />
        </div>
        <Avatar
          className="w-[40px] h-[40px]"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEjEsvXTv8VN3qvqghpw4cspvlwTsA1JHzEQ&s"
        />
      </div>
    </header>
  );
}