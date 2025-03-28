import { BrowserRouter as Router, Route, Routes } from "react-router";
import "./App.css";

// Pages
// Pages Landing
import Main from "@pages/MainPage";
import ProductPage from "@pages/ProductPage";
import ViewProductsRequest from "@pages/ViewProductsRequest"; 
import Login from "@pages/LoginPage";
import Layout from "@layout/Layout";
import ProtectedRoute from "@components/auth/ProtectedRoute";
// Pages Seller
import RegisterSeller from "@pages/RegisterSellerPage";
import Seller from "@pages/Seller/SellerDashboardPage";
import Create from "@pages/Seller/CreateProductPage";
import WineManagement from "@pages/Seller/WineManagementPage";
import ViewProductPage from "@pages/Seller/ViewProductPage";
import EditProductPage from "@pages/Seller/EditProductPage";
// Pages Inversor
import RegisterInversor from "@pages/RegisterInversorPage";
// Pages Restaurant
import RegisterRestaurant from "@pages/RegisterRestaurantPage";
import Restaurant from "@pages/Restaurant/RestaurantDashboard";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/productes" element={<ProductPage />} />
        <Route path="/productes/:id" element={<ViewProductsRequest />} />

        {/* Rutas con Sidebar */}
        <Route element={<Layout />}>
          {" "}

          {/* Aquí usas el Layout con Sidebar */}
          
          {/* Rutas protegidas para Seller */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute>
                <Seller />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/products"
            element={
              <ProtectedRoute>
                <WineManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/products/:id"
            element={
              <ProtectedRoute>
                <ViewProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/products/:id/edit"
            element={
              <ProtectedRoute>
                <EditProductPage />
              </ProtectedRoute>
            }
            />

            {/* Rutas protegidas para Restaurant */}
            <Route
              path="/restaurant/dashboard"
              element={
                <ProtectedRoute>
                  <Restaurant />
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
