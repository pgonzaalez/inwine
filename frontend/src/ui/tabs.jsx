"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

// Definimos los colores primarios
const primaryColors = {
  dark: "#9A3E50",
  light: "#C27D7D",
  background: "#F9F9F9",
}

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={`inline-flex h-10 items-center justify-center rounded-md bg-white p-1 text-gray-500 shadow-sm ${className}`}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm ${className}`}
    style={{
      "--tab-active-color": primaryColors.dark,
      "--tab-hover-color": `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(primaryColors.dark.slice(3, 5), 16)}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)`,
      "&[data-state=active]": {
        backgroundColor: "var(--tab-active-color)",
        color: "white",
      },
      "&:hover:not([data-state=active])": {
        backgroundColor: "var(--tab-hover-color)",
      },
    }}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
