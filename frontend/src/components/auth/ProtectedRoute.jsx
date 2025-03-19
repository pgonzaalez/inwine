import { Navigate } from "react-router-dom";
import {getCookie} from "@/utils/utils"

export default function ProtectedRoute({ children }) {
    const token = getCookie("token");
    
    return token ? children : <Navigate to="/login" />;
}
