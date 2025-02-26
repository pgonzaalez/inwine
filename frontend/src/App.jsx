import { BrowserRouter as Router, Route, Routes } from "react-router";
import "./App.css"
// Pages
import Main from "@pages/MainPage";
import Seller from "@pages/SellerDashboardPage";
import Create from "@pages/CreatePage";
import Register from "@pages/RegisterPage";

export default function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/seller/:id" element={<Seller />} />
        <Route path="/create" element={<Create />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

