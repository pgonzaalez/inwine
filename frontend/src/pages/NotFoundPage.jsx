import { Link } from "react-router-dom";
import { Home, Wine } from "lucide-react";
import { useTranslation } from "react-i18next";
import Footer from "@components/FooterComponent";
import Seo from "@components/Seo";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t("notFound.title")} noindex />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[7rem] leading-none font-bold text-[#9A3E50]/20 select-none">
            404
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3">
            {t("notFound.title")}
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {t("notFound.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#9A3E50] text-white font-bold rounded-xl hover:bg-[#853545] transition-all shadow-lg shadow-pink-900/10"
            >
              <Home className="w-4 h-4" />
              {t("notFound.home")}
            </Link>
            <Link
              to="/productes"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
            >
              <Wine className="w-4 h-4" />
              {t("notFound.products")}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
