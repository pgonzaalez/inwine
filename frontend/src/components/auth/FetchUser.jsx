import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/apiFetch";
import { API_URL } from "@/config/api";

export function useFetchUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = API_URL;

  const fetchUser = async () => {
    try {
      setLoading(true);

      const response = await apiFetch(`${apiUrl}/user`);

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
