import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  ShieldCheck,
  FileText,
  ExternalLink,
  Check,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import Modal from "@components/Modal";

const PrivacyTermsAcceptance = ({
  accepted,
  onChange,
  error,
  setError,
}) => {
  const { t } = useTranslation();
  const [hasOpened, setHasOpened] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("privacy");

  const handleOpenModal = (tab = "privacy") => {
    setActiveTab(tab);
    setHasOpened(true);
    setIsModalOpen(true);
  };

  const handleCheckboxClick = (e) => {
    if (!hasOpened) {
      e.preventDefault();
      handleOpenModal("privacy");
    }
  };

  const handleAcceptFromModal = () => {
    setHasOpened(true);
    onChange(true);
    if (setError) setError("");
    setIsModalOpen(false);
  };

  // Cargar secciones de privacidad y condiciones
  const privacySections = t("info.privacy.sections", {
    returnObjects: true,
    defaultValue: [],
  });
  const termsSections = t("info.terms.sections", {
    returnObjects: true,
    defaultValue: [],
  });

  const privacyList = Array.isArray(privacySections) ? privacySections : [];
  const termsList = Array.isArray(termsSections) ? termsSections : [];

  return (
    <>
      <div
        className={`p-4 rounded-xl border transition-all duration-200 my-5 ${
          error
            ? "border-red-300 bg-red-50/40 ring-1 ring-red-200"
            : accepted
            ? "border-emerald-300 bg-emerald-50/30"
            : "border-gray-200 bg-gray-50/70"
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck
              className={`h-5 w-5 ${
                accepted ? "text-emerald-600" : "text-[#BE6674]"
              }`}
            />
            <span className="font-semibold text-sm text-gray-800">
              {t("auth.register.terms_section_title", "Términos y Privacidad")}
            </span>
          </div>

          {accepted ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              <Check size={12} /> {t("auth.register.terms_badge_accepted", "Aceptado")}
            </span>
          ) : hasOpened ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {t("auth.register.terms_badge_pending", "Pendiente de aceptar")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              <AlertCircle size={12} /> {t("auth.register.terms_badge_required", "Lectura requerida")}
            </span>
          )}
        </div>

        {/* Botón para abrir los términos */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            onClick={() => handleOpenModal("privacy")}
            className="w-full sm:w-auto px-3.5 py-2 rounded-lg border-2 border-[#BE6674] text-[#BE6674] hover:bg-[#BE6674] hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <BookOpen size={15} />
            <span>
              {t(
                "auth.register.open_privacy_button",
                "Abrir Política de Privacidad y Términos"
              )}
            </span>
            <ExternalLink size={13} className="opacity-70" />
          </button>
        </div>

        {/* Checkbox de aceptación */}
        <div
          onClick={handleCheckboxClick}
          className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
            !hasOpened
              ? "bg-amber-50/70 border-amber-200 cursor-pointer hover:bg-amber-100/50"
              : accepted
              ? "bg-white border-emerald-300 shadow-xs"
              : "bg-white border-gray-200 hover:border-gray-300 cursor-pointer"
          }`}
        >
          <input
            type="checkbox"
            id="accept-privacy-terms-checkbox"
            checked={accepted}
            disabled={!hasOpened}
            onChange={(e) => {
              if (hasOpened) {
                onChange(e.target.checked);
                if (setError && e.target.checked) setError("");
              }
            }}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#BE6674] focus:ring-[#BE6674] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex-1 text-xs">
            <label
              htmlFor="accept-privacy-terms-checkbox"
              className={`select-none ${
                hasOpened
                  ? "cursor-pointer text-gray-800 font-medium"
                  : "cursor-pointer text-gray-700"
              }`}
            >
              {t(
                "auth.register.accept_terms_text",
                "He leído y acepto la Política de Privacidad y las Condiciones de Uso de Inwine."
              )}
            </label>
            {!hasOpened && (
              <p className="text-[11px] text-amber-700 mt-1 font-medium flex items-center gap-1">
                <AlertCircle size={13} />
                {t(
                  "auth.register.must_open_first",
                  "Antes de aceptarlo, debes abrir y leer la política de privacidad."
                )}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-red-600 font-medium bg-red-100/60 p-2 rounded-md">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Modal para leer la Política de Privacidad y Términos */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("auth.register.terms_modal_title", "Política de Privacidad y Términos")}
        description={t(
          "auth.register.terms_modal_desc",
          "Por favor, revisa atentamente la información legal antes de continuar."
        )}
        icon={<ShieldCheck className="h-8 w-8 text-[#BE6674]" />}
        iconBackground="bg-[#BE6674]/10"
        size="2xl"
        footer={
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {t("auth.register.terms_modal_close", "Cerrar")}
            </button>
            <button
              type="button"
              onClick={handleAcceptFromModal}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#BE6674] hover:bg-[#741C28] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              <Check size={16} />
              <span>
                {t(
                  "auth.register.terms_modal_accept",
                  "He leído y acepto la Política de Privacidad"
                )}
              </span>
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Selector de pestañas */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("privacy")}
              className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === "privacy"
                  ? "border-[#BE6674] text-[#BE6674]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} />
                {t("info.privacy.title", "Política de Privacidad")}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("terms")}
              className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === "terms"
                  ? "border-[#BE6674] text-[#BE6674]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText size={16} />
                {t("info.terms.title", "Condiciones de Uso")}
              </span>
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4 text-xs sm:text-sm text-gray-700 bg-gray-50/60 p-4 rounded-xl border border-gray-200">
            {activeTab === "privacy" ? (
              <div className="space-y-4">
                <p className="font-medium text-gray-900 leading-relaxed">
                  {t(
                    "info.privacy.content",
                    "En INWINE nos tomamos en serio tu privacidad. Esta política explica qué datos personales tratamos, con qué finalidad y base jurídica, durante cuánto tiempo y qué derechos tienes."
                  )}
                </p>
                {privacyList.map((section, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <h4 className="font-bold text-gray-900 text-sm">
                      {section.title}
                    </h4>
                    {(section.body || []).map((paragraph, pIdx) => (
                      <p key={pIdx} className="leading-relaxed text-gray-600">
                        {paragraph}
                      </p>
                    ))}
                    {Array.isArray(section.items) && section.items.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {section.items.map((item, iIdx) => (
                          <li key={iIdx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="font-medium text-gray-900 leading-relaxed">
                  {t(
                    "info.terms.content",
                    "Estas condiciones regulan el acceso y el uso de la plataforma INWINE. Al registrarte o utilizar el sitio web aceptas estas condiciones en su totalidad."
                  )}
                </p>
                {termsList.map((section, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <h4 className="font-bold text-gray-900 text-sm">
                      {section.title}
                    </h4>
                    {(section.body || []).map((paragraph, pIdx) => (
                      <p key={pIdx} className="leading-relaxed text-gray-600">
                        {paragraph}
                      </p>
                    ))}
                    {Array.isArray(section.items) && section.items.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {section.items.map((item, iIdx) => (
                          <li key={iIdx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

PrivacyTermsAcceptance.propTypes = {
  accepted: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  setError: PropTypes.func,
};

export default PrivacyTermsAcceptance;
