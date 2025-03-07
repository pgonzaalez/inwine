import { BrowserRouter as Router, Route, Routes } from "react-router";
import "./App.css"

// Pages
import Main from "@pages/MainPage";
import Seller from "@pages/Seller/SellerDashboardPage";
import Create from "@pages/CreatePage";
import ViewProductPage from "./pages/Seller/ViewProductPage";
import EditProductPage from "./pages/Seller/EditProductPage";
import Register from "@pages/RegisterPage";
import RegisterSeller from "@pages/RegisterSellerPage";
import Login from "@pages/LoginPage";

import ProtectedRoute from "@components/ProtectedRoute";

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route
          path="/seller/:id/products"
          element={
            <ProtectedRoute>
              <Seller />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/:id/products/:id"
          element={
            <ProtectedRoute>
              <ViewProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/:id/products/:id/edit"
          element={
            <ProtectedRoute>
              <EditProductPage />
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
        <Route path="/register" element={<RegisterSeller />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registerinversor" element={<Register />} />
      </Routes>
    </Router>
  )
}

