import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/admin/Dashboard"
import Artist from "./pages/admin/Artist"
import AdminLayout from "./layout/AdminLayout"
import SignIn from "./pages/admin/SignIn"
import AdminRoutes from "./routes/AdminRoutes"

const App = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<SignIn />} />
      <Route element={<AdminRoutes />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="artists" element={<Artist />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App