import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import TopUp from "./pages/TopUp";
import Payment from "./pages/Payment";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/homepage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
         <Route path="/homepage" element={<Home />} />
          <Route path="/akun" element={<Profile />} />
          <Route path="/topup" element={<TopUp />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/transaction" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
