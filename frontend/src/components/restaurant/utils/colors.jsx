// Define primary colors for the restaurant dashboard
export const primaryColors = {
    dark: "#9A3E50",
    light: "#C27D7D",
    background: "#F9F9F9",
  }
  
  // Function to get background color based on status
  export const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#FFF3CD" // Light yellow for pending
      case "accepted":
        return "#D1E7DD" // Light green for accepted
      case "in_my_local":
        return "#CFF4FC" // Light blue for in my local
      case "sold":
        return "#E8D0B5" // Amber for sold
      default:
        return `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
          primaryColors.dark.slice(3, 5),
          16,
        )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)` // Default color
    }
  }
  
  // Function to get text color based on status
  export const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#856404" // Dark yellow for pending
      case "accepted":
        return "#0F5132" // Dark green for accepted
      case "in_my_local":
        return "#055160" // Dark blue for in my local
      case "sold":
        return "#664D03" // Dark amber for sold
      default:
        return primaryColors.dark // Default color
    }
  }
  
  // Function to get background color based on wine type
  export const getWineTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "negre":
        return "#2D1B1E" // Dark color for red wine
      case "blanc":
        return "#F7F5E8" // Light color for white wine
      case "rossat":
        return primaryColors.light // Pink color for rosé wine
      case "espumós":
        return "#F2EFD3" // Champagne color for sparkling wine
      case "dolç":
        return "#E8D0B5" // Amber color for sweet wine
      default:
        return `rgba(${Number.parseInt(primaryColors.dark.slice(1, 3), 16)}, ${Number.parseInt(
          primaryColors.dark.slice(3, 5),
          16,
        )}, ${Number.parseInt(primaryColors.dark.slice(5, 7), 16)}, 0.1)` // Default color
    }
  }
  