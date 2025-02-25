import { BrowserRouter as Router, Route, Routes } from "react-router";
import "./App.css"
// Pages
import Main from "@pages/MainPage";
import Seller from "@pages/Seller/SellerDashboardPage";
import Create from "@pages/CreatePage";

export default function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/seller/:id/products" element={<Seller />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </Router>
  )
}

