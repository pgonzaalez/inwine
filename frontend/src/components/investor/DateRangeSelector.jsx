"use client"

import { useState } from "react"
import { Calendar, ChevronDown } from "lucide-react"

export const DateRangeSelector = ({ onDateRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRange, setSelectedRange] = useState("all")

  const dateRanges = [
    { id: "all", label: "Totes les dates" },
    { id: "week", label: "Última setmana" },
    { id: "month", label: "Últim mes" },
    { id: "quarter", label: "Últims 3 mesos" },
    { id: "halfYear", label: "Últims 6 mesos" },
    { id: "year", label: "Últim any" },
  ]

  const handleRangeSelect = (rangeId) => {
    setSelectedRange(rangeId)

    let startDate = null
    let endDate = new Date()

    const now = new Date()

    switch (rangeId) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case "quarter":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        break
      case "halfYear":
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
        break
      case "year":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      case "all":
      default:
        startDate = null
        endDate = null
    }

    onDateRangeChange({ startDate, endDate, rangeId })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={16} className="text-gray-500" />
        <span className="text-sm font-medium">{dateRanges.find((range) => range.id === selectedRange)?.label}</span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-1">
            {dateRanges.map((range) => (
              <button
                key={range.id}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  selectedRange === range.id ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                }`}
                onClick={() => handleRangeSelect(range.id)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
