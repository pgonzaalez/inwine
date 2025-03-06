import { useState, useEffect } from "react";

export function useFetchUser(userID) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userID) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/users/${userID}`);
        if (!response.ok) {
          throw new Error("Usuari no trobat");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userID]);

  return { user, loading, error };
}
