import { Avatar } from "@heroui/avatar";
import { Link } from "react-router-dom";
import { LucideShoppingCart, BookmarkPlusIcon } from "lucide-react";

export default function Sidebar() {
  return (
    <section className="w-[245px] h-screen fixed top-0 left-0 bg-white shadow-md flex flex-col p-4 overflow-y-auto">
      <div className="flex gap-3 items-center">
        <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEjEsvXTv8VN3qvqghpw4cspvlwTsA1JHzEQ&s" />
        <div>
          <div className="font-extrabold text-black">Usuari Prova</div>
          <div className="text-[#91969e] text-xs">Rol del Usuari</div>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <Link
          to="/create"
          className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-[20px] cursor-pointer"
        >
          <BookmarkPlusIcon size={20} />
          <span>Pujar Producte</span>
        </Link>
        <Link
          to="/seller/123"
          className="bg-[#efefef] rounded-[20px] p-3 flex items-center gap-4 cursor-pointer "
        >
          <LucideShoppingCart size={20} />
          <span>Productes</span>
        </Link>
      </div>
    </section>
  );
}
