"use client"

import Header from "@components/HeaderComponent"
import WineManagement from "@components/WineManagement"
import { useFetchUser } from "@components/auth/FetchUser"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
}

export default function WineManagementPage() {
  const { user, loading } = useFetchUser()

  return (
    <>
      <Header />
      <div className="flex flex-col mt-[60px] min-h-[calc(100vh-60px)]">
        <div className="flex flex-1">
          <div className="flex-1 md:ml-64 p-4 md:p-6 overflow-y-auto pb-16 bg-[#F9F9F9]">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div
                  className="w-10 h-10 rounded-full animate-spin"
                  style={{
                    borderWidth: "3px",
                    borderStyle: "solid",
                    borderColor: primaryColors.light,
                    borderTopColor: primaryColors.dark,
                  }}
                ></div>
              </div>
            ) : (
              <WineManagement />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

