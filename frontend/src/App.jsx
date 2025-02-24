import { BrowserRouter as Router, Route, Routes } from "react-router";
import "./App.css"
// Pages
import Main from "@pages/MainPage";
import Seller from "@pages/SellerDashboardPage";

export default function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/seller/:id" element={<Seller />} />
      </Routes>
    </Router>
  )
}

