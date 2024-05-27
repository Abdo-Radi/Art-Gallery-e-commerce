import Login from "@/components/Login";
import DefaultLayout from "@/layout/DefaultLayou";
import About from "@/pages/About";
import ArtworkDetail from "@/pages/ArtworkDetail";
import Artworks from "@/pages/Artworks";
import Tickets from "@/pages/Tickets";
import Cart from "@/pages/Cart";
import Home from "@/pages/Home";
import { Route, Routes } from "react-router-dom";

const ConfigRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="/about" element={<About />} />
        <Route path="/exhibitions" element={<Tickets />} />
        <Route path="/artworks/:id" element={<ArtworkDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Route>
    </Routes>
  );
};

export default ConfigRoutes;
