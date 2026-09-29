import { Navigate } from "react-router-dom";
import { useFetchUser } from "@/components/auth/FetchUser";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useFetchUser();

    if (loading) return null;

    return user ? children : <Navigate to="/login" />;
}
