import { BrowserRouter as Router, Route, Routes } from "react-router";
import "./App.css";

// Layout
import Layout from "@layout/Layout";
import HeaderLayout from "@layout/HeaderLayout";
import ScrollToTop from "@components/ScrollToTop";
// Pages
import Profile from "@pages/Profile/ProfilePage";
import Notifications from "@pages/Notification/NotificationsPage";
// Pages Landing
import Main from "@pages/MainPage";
import ProductPage from "@pages/Landing/ProductsPage";
import ViewProductsRequest from "@pages/ViewProductsRequest";
import OrderCart from "@pages/Landing/Cart/OrderCartPage";
import Login from "@pages/LoginPage";

import ProtectedRoute from "@components/auth/ProtectedRoute";
import CheckoutPage from "@pages/Payments/CheckoutPage";
import OrderSummaryPage from "@pages/Payments/OrderSummaryPage";
// Pages Seller
import RegisterSeller from "@pages/RegisterSellerPage";
import Seller from "@pages/Seller/SellerDashboardPage";
import Create from "@pages/Seller/CreateProductPage";
import WineManagement from "@pages/Seller/WineManagementPage";
import ViewProductPage from "@pages/Seller/ViewProductPage";
import EditProductPage from "@pages/Seller/EditProductPage";
// Pages Inversor
import RegisterInversor from "@pages/RegisterInversorPage";
import Inversor from "@pages/Inversor/InversorDashboardPage";
import InvestmentHistoryPage from "@pages/Inversor/HIstoricPage";
import ShowInvestment from "@pages/Inversor/ShowInvestment";
// Pages Restaurant
import RegisterRestaurant from "@pages/RegisterRestaurantPage";
import Restaurant from "@pages/Restaurant/RestaurantDashboard";
import ViewOneRequest from "@pages/Restaurant/ViewOneRequest";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<HeaderLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/productes" element={<ProductPage />} />
          <Route path="/productes/:id" element={<ViewProductsRequest />} />
          <Route path="/cistella" element={<OrderCart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-summary" element={<OrderSummaryPage />} />
        </Route>

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
          <Route
            path="/seller/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/notificacions"
            element={
              <ProtectedRoute>
                <Notifications />
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
           <Route
            path="/restaurant/requests/:id"
            element={
              <ProtectedRoute>
                <ViewOneRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para Inversor */}
          <Route
            path="/inversor/dashboard"
            element={
              <ProtectedRoute>
                <Inversor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inversor/historic"
            element={
              <ProtectedRoute>
                < InvestmentHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inversor/historic/:id"
            element={
              <ProtectedRoute>
                < ShowInvestment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inversor/profile"
            element={
              <ProtectedRoute>
                <Profile />
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
