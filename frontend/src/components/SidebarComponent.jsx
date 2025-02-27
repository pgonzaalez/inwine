import { Avatar, Divider } from "@heroui/react";
import { Link } from "react-router-dom";
import { LucideShoppingCart, BookmarkPlusIcon, Bell, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <section className="w-[245px] h-screen fixed top-[100px] left-0 bg-white shadow-md flex flex-col p-4 overflow-y-auto">
      <Link to="/seller/123/" className="flex gap-3 items-center cursor-pointer">
      <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEjEsvXTv8VN3qvqghpw4cspvlwTsA1JHzEQ&s" />
        <div>
          <div className="font-extrabold text-black">Usuari Prova</div>
          <div className="text-[#91969e] text-xs">Rol del Usuari</div>
        </div>
      </Link>
      <div className="mt-5 space-y-2">
        <Divider />
        <Link
          to="/create"
          className={`flex items-center gap-4 p-3 rounded-[20px] cursor-pointer ${
            location.pathname === "/create" ? "bg-[#efefef]" : "hover:bg-gray-100"
          }`}
        >
          <BookmarkPlusIcon size={20} />
          <span>Pujar Producte</span>
        </Link>
        <Link
          to="/seller/123/products"
          className={`p-3 flex items-center gap-4 rounded-[20px] cursor-pointer ${
            location.pathname === "/seller/123/products" ? "bg-[#efefef]" : "hover:bg-gray-100"
          }`}
        >
          <LucideShoppingCart size={20} />
          <span>Productes</span>
        </Link>
        <Link
          to="/seller/123/notificacions"
          className={`p-3 flex items-center gap-4 rounded-[20px] cursor-pointer ${
            location.pathname === "/seller/123/notificacions" ? "bg-[#efefef]" : "hover:bg-gray-100"
          }`}
        >
          <Bell size={20} />
          <span>Notificacions</span>
        </Link>
        <Link
          to="/logout"
          className={`p-3 flex items-center gap-4 rounded-[20px] cursor-pointer ${
            location.pathname === "/seller/123/notificacions" ? "bg-[#efefef]" : "hover:bg-gray-100"
          }`}
        >
          <LogOut size={20} />
          <span>Tanca sessió</span>
        </Link>
      </div>
    </section>
  );
}
