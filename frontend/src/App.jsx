import { BrowserRouter as Router, Route, Routes } from "react-router";
import "./App.css";

// Pages
import Main from "@pages/MainPage";
import Seller from "@pages/Seller/SellerDashboardPage";
import Create from "@pages/Seller/CreateProductPage";
import ViewProductPage from "./pages/Seller/ViewProductPage";
import EditProductPage from "./pages/Seller/EditProductPage";
import RegisterSeller from "@pages/RegisterSellerPage";
import RegisterInversor from "@pages/RegisterInversorPage";
import RegisterRestaurant from "@pages/RegisterRestaurantPage";
import Login from "@pages/LoginPage";
import Layout from "@layout/Layout";

import ProtectedRoute from "@components/auth/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />

        {/* Rutas con Sidebar */}
        <Route element={<Layout />}>
          {" "}
          {/* Aquí usas el Layout con Sidebar */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            }
          />
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
        </Route>

        <Route path="/register/seller" element={<RegisterSeller />} />
        <Route path="/register/inversor" element={<RegisterInversor />} />
        <Route path="/register/restaurant" element={<RegisterRestaurant />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
