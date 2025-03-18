export const ProgressBar = ({ currentStep, totalSteps }) => {
    return (
      <div className="max-w-4xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Creació de vi</h2>
          <span className="text-sm text-gray-500">
            Pas {currentStep} de {totalSteps}
          </span>
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
  
  