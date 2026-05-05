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
import ViewRestaurantsRequest from "@pages/ViewRestaurantsRequest";
import OrderCart from "@pages/Landing/Cart/OrderCartPage";
import Login from "@pages/LoginPage";
import Contacte from "@pages/Landing/ContactPage";
import FavoritesPage from "@pages/Landing/FavoritesPage";

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
import InvestmentHistoryPage from "@pages/Inversor/PageHistoric";
import ShowInvestment from "@pages/Inversor/ShowInvestment";
// Pages Restaurant
import RegisterRestaurant from "@pages/RegisterRestaurantPage";
import Restaurant from "@pages/Restaurant/RestaurantDashboard";
import RestaurantProductsPage from "@pages/Restaurant/RestaurantProductsPage";
import ViewOneRequest from "@pages/Restaurant/ViewOneRequest";
import SettingsPage from "@pages/SettingsPage";
// Info Pages
import {
  PrivacyPolicyPage,
  TermsOfUsePage,
  CookiesPolicyPage,
  LegalNoticePage,
  AboutUsPage,
  TeamPage,
  InfluencersPage,
  AffiliatesPage,
  MediaPage,
  BlogPage,
  CommunityPage,
  IdeasPage,
  DevelopersPage,
  GuaranteePage,
  ProductDeclarationsPage
} from "@pages/Info/InfoPages";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<HeaderLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/productes" element={<ProductPage />} />
          <Route path="/productes/:id" element={<ViewProductsRequest />} />
          <Route path="/restaurants/:id" element={<ViewRestaurantsRequest />} />
          <Route path="/cistella" element={<OrderCart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-summary" element={<OrderSummaryPage />} />
          <Route path="/contacte" element={<Contacte />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          
          <Route path="/settings" element={<SettingsPage />} />

          {/* Info Routes */}
          <Route path="/privacitat" element={<PrivacyPolicyPage />} />
          <Route path="/condicions" element={<TermsOfUsePage />} />
          <Route path="/cookies" element={<CookiesPolicyPage />} />
          <Route path="/avis-legal" element={<LegalNoticePage />} />
          <Route path="/sobre-nosaltres" element={<AboutUsPage />} />
          <Route path="/equip" element={<TeamPage />} />
          <Route path="/influencers" element={<InfluencersPage />} />
          <Route path="/afiliats" element={<AffiliatesPage />} />
          <Route path="/mitjans" element={<MediaPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/comunitat" element={<CommunityPage />} />
          <Route path="/idees" element={<IdeasPage />} />
          <Route path="/desenvolupadors" element={<DevelopersPage />} />
          <Route path="/garantia" element={<GuaranteePage />} />
          <Route path="/declaracions-producte" element={<ProductDeclarationsPage />} />
        </Route>

        {/* Rutas con Sidebar */}
        <Route element={<Layout />}>
          {" "}
          {/* Aquí usas el Layout con Sidebar */}
          {/* Rutas comunes */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
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
            path="/seller/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
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
            path="/restaurant/products"
            element={
              <ProtectedRoute>
                <RestaurantProductsPage />
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
          <Route
            path="/restaurant/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para Inversor */}
          <Route
            path="/investor/dashboard"
            element={
              <ProtectedRoute>
                <Inversor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/investor/historic"
            element={
              <ProtectedRoute>
                < InvestmentHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/investor/historic/:id"
            element={
              <ProtectedRoute>
                < ShowInvestment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/investor/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/investor/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/register/seller" element={<RegisterSeller />} />
        <Route path="/register/investor" element={<RegisterInversor />} />
        <Route path="/register/restaurant" element={<RegisterRestaurant />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
