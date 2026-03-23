import { useTranslation } from "react-i18next"

export const ProgressBar = ({ currentStep, totalSteps, onCancel }) => {
  const { t } = useTranslation()
  return (
    <div className="max-w-4xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">{t("dashboards.seller.product.create_subtitle")}</h2>
          <span className="text-sm text-gray-500">
            {t("dashboards.seller.product.step_x_of_y", { current: currentStep, total: totalSteps })}
          </span>
        </div>
        {currentStep >= 2 && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-[#9A3E50] text-white rounded-lg hover:bg-[#8C2E2E] transition-colors text-sm"
          >
            {t("dashboards.seller.product.btn_cancel", "Cancel")}
          </button>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-[#9A3E50] to-[#C27D7D] h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}
  
  