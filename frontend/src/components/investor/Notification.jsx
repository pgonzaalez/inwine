"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react"

export const Notification = ({ notification }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (notification) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 2800)
      return () => clearTimeout(timer)
    }
  }, [notification])

  if (!notification) return null

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (notification.type) {
      case "success":
        return "bg-green-50"
      case "error":
        return "bg-red-50"
      case "warning":
        return "bg-yellow-50"
      case "info":
        return "bg-blue-50"
      default:
        return "bg-blue-50"
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transition-opacity duration-300 ${getBgColor()} ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="flex items-center">
        {getIcon()}
        <div className="ml-3">
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      </div>
    </div>
  )
}
