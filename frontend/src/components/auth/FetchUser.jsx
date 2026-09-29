import { useState, useEffect } from "react";
import { getCookie } from "@/utils/utils";
import { API_URL } from "@/config/api";

export function useFetchUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = API_URL;

  const fetchUser = async () => {
    const token = getCookie("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setUser(null);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, refetchUser: fetchUser };
}