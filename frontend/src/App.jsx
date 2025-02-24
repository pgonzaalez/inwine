import { BrowserRouter as Router, Route, Routes } from "react-router";
import Main from "@pages/MainPage";

export default function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  )
}

