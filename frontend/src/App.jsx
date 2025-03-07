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
        <Route path="/seller/:id/products" element={<Seller />} />
        <Route path="/seller/:id/products/:id" element={<ViewProductPage />} />
        <Route path="/seller/:id/products/:id/edit" element={<EditProductPage />} />
        <Route path="/create" element={<Create />} />
        <Route path="/register" element={<RegisterSeller />} />
        <Route path="/registerinversor" element={<Register />} />

      </Routes>
    </Router>
  )
}

