export const Notification = ({ notification }) => {
    if (!notification) return null
  
    return (
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {notification.message}
      </div>
    )
  }
  
  