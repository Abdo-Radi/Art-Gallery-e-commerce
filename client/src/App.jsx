import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/admin/Dashboard"
import Artist from "./pages/admin/Artist"
import AdminLayout from "./layout/AdminLayout"
import SignIn from "./pages/admin/SignIn"
import AdminRoutes from "./routes/AdminRoutes"
import Exhibition from "./pages/admin/Exhibition"
import Order from "./pages/admin/Order"
import Ticket from "./pages/admin/Ticket"
import Category from "./pages/admin/Category"

const App = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<SignIn />} />
      <Route element={<AdminRoutes />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="artists" element={<Artist />} />
          <Route path="exhibitions" element={<Exhibition />} />
          <Route path="orders" element={<Order />} />
          <Route path="tickets" element={<Ticket />} />
          <Route path="categories" element={<Category />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App