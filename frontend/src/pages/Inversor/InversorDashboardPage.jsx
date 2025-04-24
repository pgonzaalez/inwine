import { InvestorPurchaseHistory } from "@/components/investor/InvestorPurchaseHistory"
import { primaryColors } from "@components/investor/utils/colors"

const InversorDashboardPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <div
          className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto pb-16"
          style={{ backgroundColor: primaryColors.background }}
        >
          <InvestorPurchaseHistory />
        </div>
      </div>
    </div>
  )
}

export default InversorDashboardPage
