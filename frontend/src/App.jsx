import { BrowserRouter as Router, Route, Routes } from "react-router";
import "./App.css"
// Pages
import Main from "@pages/MainPage";
import Seller from "@pages/Seller/SellerDashboardPage";
import Create from "@pages/CreatePage";
import Register from "@pages/RegisterPage";
import Login from "@pages/LoginPage";

import ProtectedRoute from "@components/ProtectedRoute";

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/seller/:id/products"
          element={
            <ProtectedRoute>
              <Seller />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

