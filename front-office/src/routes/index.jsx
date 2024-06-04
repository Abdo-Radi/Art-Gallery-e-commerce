import Login from "@/components/Login";
import DefaultLayout from "@/layout/DefaultLayout";
import About from "@/pages/About";
import ArtworkDetail from "@/pages/ArtworkDetail";
import Artworks from "@/pages/Artworks";
import Exhibitions from "@/pages/Exhibitions";
import Cart from "@/pages/Cart";
import Home from "@/pages/Home";
import { Route, Routes } from "react-router-dom";
import ExhibitionDetail from "@/pages/ExhibitionDetail";
import Checkout from "@/pages/Checkout";

const ConfigRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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
    </Routes>
  );
};

export default ConfigRoutes;
