import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedA from "../helpers/ProtectedA"
import Dashboard from "../pages/admin/Dashboard"
import Artist from "../pages/admin/Artist"
import AdminLayout from "../layout/AdminLayout"
import SignIn from "../pages/admin/SignIn"
import Category from "../pages/admin/Category"
import Artwork from "../pages/admin/Artwork"
import Exhibition from "../pages/admin/Exhibition";
import Order from "../pages/admin/Order";
import Ticket from "../pages/admin/Ticket";
import Admin from "../pages/admin/Admin";
import CustomerPage from "../pages/admin/Customer";

const ConfigRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />

        <Route path="/admin/login" element={<SignIn />} />
        <Route element={<ProtectedA />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="artists" element={<Artist />} />
            <Route path="categories" element={<Category />} />
            <Route path="artworks" element={<Artwork />} />
            <Route path="exhibitions" element={<Exhibition />} />
            <Route path="orders" element={<Order />} />
            <Route path="tickets" element={<Ticket />} />
            <Route path="admins" element={<Admin />} />
            <Route path="customers" element={<CustomerPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
}

export default ConfigRoutes
