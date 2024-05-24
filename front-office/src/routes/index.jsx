import Login from "@/components/Login";
import DefaultLayout from "@/layout/DefaultLayou";
import Artworks from "@/pages/Artworks";
import Home from "@/pages/Home";
import { Route, Routes } from "react-router-dom";

const ConfigRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="/artworks" element={<Artworks />} />
      </Route>
    </Routes>
  );
};

export default ConfigRoutes;
