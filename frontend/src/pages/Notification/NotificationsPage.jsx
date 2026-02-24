import React, { useState, useEffect } from "react";

const Notifications = ({ userToken }) => {
  const [notifications, setNotifications] = useState([]);

  const primaryColors = {
    dark: "#9A3E50",
    light: "#C27D7D",
    background: "#F9F9F9",
  };
  // Función para recuperar notificaciones
  const fetchNotifications = async () => {
    const res = await fetch("http://localhost:8000/api/not ifications", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setNotifications(data);
    } else {
      console.error("Error al recuperar notificaciones");
    }
  };

  // Llamamos a la función al montar el componente
  useEffect(() => {
    fetchNotifications();
  }, [userToken]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
    <div className="flex flex-1">
      <div
        className="flex-1 md:ml-64 p-8 overflow-y-auto pb-16"
        style={{ backgroundColor: primaryColors.background }}
      >
        <div className="mb-6 p-6 bg-white rounded-xl shadow-sm">
          <h1
            className="text-2xl font-bold"
            style={{ color: primaryColors.dark }}
          >
            Notificacions
          </h1>
          <p className="text-gray-500">
            Gestiona les teves notificacions i mantén-te al dia amb les actualitzacions
          </p>
        </div>
        {notifications.length === 0 ? (
          <p>No tienes notificaciones.</p>
        ) : (
          <ul>
            {notifications.map((notification, index) => (
              <li key={index} className="notification-item">
                <strong>Producto ID:</strong> {notification.product_id}
                <br />
                <strong>Estado:</strong> {notification.status}
                <br />
                <p>{notification.message}</p>
                <hr />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
};

export default Notifications;
