import Login from "@/components/Login";
import DefaultLayout from "@/layout/DefaultLayout";
import About from "@/pages/About";
import ArtworkDetail from "@/pages/ArtworkDetail";
import Artworks from "@/pages/Artworks";
import Exhibitions from "@/pages/Exhibitions";
import Cart from "@/pages/Cart";
import Home from "@/pages/Home";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import ExhibitionDetail from "@/pages/ExhibitionDetail";
import Checkout from "@/pages/Checkout";

// React Router keeps the previous scroll position across navigations;
// reset it so each page opens at the top.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-paper">
      <Login onClose={() => navigate("/")} />
    </div>
  );
};

const ConfigRoutes = () => {
  return (
    <>
      <ScrollToTop />
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
    </>
  );
};

export default ConfigRoutes;
