import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  getConsent,
  hasConsented,
  acceptAll,
  rejectAll,
  setConsent,
  onOpenSettings,
} from "@utils/cookieConsent";
import { syncAnalyticsConsent } from "@utils/analytics";

export default function CookieConsent() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState({ analysis: false, marketing: false });

  // The dialog blocks the whole page until the user makes a first choice.
  // Once a choice exists it can be reopened from the Cookies page and dismissed.
  const dismissible = hasConsented();

  // First visit -> force the dialog. Keep analytics consent in sync on load.
  useEffect(() => {
    if (!hasConsented()) {
      setOpen(true);
    } else {
      const c = getConsent();
      setPrefs({ analysis: !!c.analysis, marketing: !!c.marketing });
    }
    syncAnalyticsConsent();
  }, []);

  // Allow the Cookies Policy page (or anywhere) to reopen the panel.
  useEffect(
    () =>
      onOpenSettings(() => {
        const c = getConsent();
        if (c) setPrefs({ analysis: !!c.analysis, marketing: !!c.marketing });
        setShowSettings(true);
        setOpen(true);
      }),
    [],
  );

  // Lock body scroll while the dialog is visible.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const finish = useCallback(() => {
    syncAnalyticsConsent();
    setOpen(false);
    setShowSettings(false);
  }, []);

  const handleAcceptAll = () => {
    acceptAll();
    finish();
  };

  const handleRejectAll = () => {
    rejectAll();
    finish();
  };

  const handleSavePrefs = () => {
    setConsent(prefs);
    finish();
  };

  const handleClose = () => {
    if (dismissible) {
      setOpen(false);
      setShowSettings(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-dialog-title"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#9A3E50]/10 text-[#9A3E50]">
                <Cookie className="w-5 h-5" />
              </div>
              <h2
                id="cookie-dialog-title"
                className="text-lg font-bold text-gray-900"
              >
                {t("cookies.banner.title", "Utilitzem cookies")}
              </h2>
            </div>
            {dismissible && (
              <button
                type="button"
                onClick={handleClose}
                aria-label={t("cookies.banner.close", "Tancar")}
                className="text-gray-400 hover:text-gray-600 transition-colors -mr-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            {t(
              "cookies.banner.text",
              "Fem servir cookies pròpies i de tercers per garantir el funcionament del lloc, recordar les teves preferències i analitzar l'ús del web. Pots acceptar-les totes, rebutjar-les o configurar-les. Si les rebutges, només farem servir les estrictament necessàries.",
            )}{" "}
            <Link
              to="/cookies"
              className="text-[#9A3E50] font-medium hover:underline"
            >
              {t("cookies.banner.more", "Més informació")}
            </Link>
          </p>

          {showSettings && (
            <div className="mt-5 space-y-3">
              <PrefRow
                checked
                disabled
                title={t(
                  "cookies.banner.necessary_title",
                  "Necessàries (sempre actives)",
                )}
                desc={t(
                  "cookies.banner.necessary_desc",
                  "Imprescindibles per navegar i utilitzar funcions bàsiques com l'inici de sessió o la cistella.",
                )}
              />
              <PrefRow
                checked={prefs.analysis}
                onChange={(v) => setPrefs((p) => ({ ...p, analysis: v }))}
                title={t("cookies.banner.analysis_title", "Analítiques")}
                desc={t(
                  "cookies.banner.analysis_desc",
                  "Ens ajuden a entendre com s'utilitza el web (Google Analytics) per millorar-lo.",
                )}
              />
              <PrefRow
                checked={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
                title={t("cookies.banner.marketing_title", "Màrqueting")}
                desc={t(
                  "cookies.banner.marketing_desc",
                  "Permeten mostrar-te contingut i anuncis més rellevants segons els teus interessos.",
                )}
              />
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleRejectAll}
                className="flex-1 inline-flex items-center justify-center px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                {t("cookies.banner.reject", "Rebutjar totes")}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 inline-flex items-center justify-center px-5 py-2.5 bg-[#9A3E50] text-white text-sm font-bold rounded-xl hover:bg-[#853545] transition-all"
              >
                {t("cookies.banner.accept", "Acceptar totes")}
              </button>
            </div>
            {showSettings ? (
              <button
                type="button"
                onClick={handleSavePrefs}
                className="inline-flex items-center justify-center px-5 py-2.5 text-[#9A3E50] text-sm font-semibold rounded-xl hover:bg-[#9A3E50]/5 transition-all"
              >
                {t("cookies.banner.save", "Desar preferències")}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="inline-flex items-center justify-center px-5 py-2.5 text-[#9A3E50] text-sm font-semibold rounded-xl hover:bg-[#9A3E50]/5 transition-all"
              >
                {t("cookies.banner.configure", "Configurar")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PrefRow({ title, desc, checked, onChange, disabled }) {
  return (
    <label
      className={`flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 ${
        disabled ? "opacity-70" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#9A3E50] focus:ring-[#9A3E50]/30"
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-gray-900">{title}</span>
        <span className="block text-xs text-gray-500 mt-0.5">{desc}</span>
      </span>
    </label>
  );
}

PrefRow.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};
