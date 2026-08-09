import Login from "@/components/Login";
import DefaultLayout from "@/layout/DefaultLayout";
import About from "@/pages/About";
import ArtworkDetail from "@/pages/ArtworkDetail";
import Artworks from "@/pages/Artworks";
import Exhibitions from "@/pages/Exhibitions";
import Cart from "@/pages/Cart";
import Home from "@/pages/Home";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import ExhibitionDetail from "@/pages/ExhibitionDetail";
import Checkout from "@/pages/Checkout";

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Login onClose={() => navigate("/")} />
    </div>
  );
};

const ConfigRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="/about" element={<About />} />
        <Route path="/exhibitions" element={<Exhibitions />} />
        <Route path="/artworks/:id" element={<ArtworkDetail />} />
        <Route path="/exhibitions/:id" element={<ExhibitionDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ConfigRoutes;
