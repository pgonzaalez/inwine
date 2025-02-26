import Header from "@components/HeaderComponent";
import Sidebar from "@components/SidebarComponent";
import { Link } from "react-router-dom";
import { CornerDownLeft, Star, Trash } from "lucide-react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const images = [
  {
    original:
      "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202207/01/00118715401248____9__600x600.jpg",
    thumbnail:
      "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202207/01/00118715401248____9__600x600.jpg",
  },
  {
    original: "https://shop.veritas.es/documents/10180/23257/39246_G.jpg",
    thumbnail: "https://shop.veritas.es/documents/10180/23257/39246_G.jpg",
  },
  {
    original:
      "https://tienda.pagosdelrey.com/253-large_default2x/mucho-mas-tinto.jpg",
    thumbnail:
      "https://tienda.pagosdelrey.com/253-large_default2x/mucho-mas-tinto.jpg",
  },
];

export default function ViewProductPage() {
  return (
    <>
      <Header />
      <div className="flex flex-col mt-[60px] h-[calc(100vh-60px)]">
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 ml-[245px] p-6 bg-gray-100 overflow-y-auto">
            <div className="flex bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
              <div className="flex flex-col gap-4 w-1/2">
                <div className="self-start flex gap-2">
                  <Link to="/seller/123/products" className="self-start border-2 rounded-lg p-1">
                    <CornerDownLeft size={20} className="cursor-pointer" />
                  </Link>
                  <Link className="self-start border-2 border-red-500 rounded-lg p-1">
                    <Trash size={20} className="text-red-500 cursor-pointer" />
                  </Link>
                </div>
                <div>
                  <ImageGallery
                    className="object-cover rounded-lg"
                    items={images}
                    disableKeyDown={true}
                    showNav={false}
                    showPlayButton={false}
                    showFullscreenButton={false}
                  />
                </div>
              </div>

              <div className="w-1/2 pl-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Vi</span>
                    <span>Productor: Darlene Robertson</span>
                  </div>
                  <h2 className="text-black text-2xl font-semibold mt-2">
                    Viña Pomal Crianza Rioja 2021
                  </h2>
                  <div className="flex gap-2 items-center mt-2">
                    <span className="text-black text-xl font-bold">
                      37,00 €
                    </span>
                  </div>
                  <div className="flex gap-2 items-center mt-2">
                    <span className="text-gray-500 text-sm">Quantitat: 3</span>
                  </div>
                  <div className="flex gap-2 items-center mt-2">
                    <div className="flex gap-1">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <Star className="w-5 h-5 text-yellow-500" />
                      <Star className="w-5 h-5 text-yellow-500" />
                      <Star className="w-5 h-5 text-yellow-500" />
                      <Star className="w-5 h-5 text-gray-300" />
                    </div>
                    <span className="text-black text-xs">(4)</span>
                    <span className="text-black text-xs">1,3k Reseñas</span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-black text-lg font-bold">
                      Descripció
                    </h3>
                    <p className="text-gray-500 text-base leading-6 mt-1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
