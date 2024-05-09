import { Routes, Route } from "react-router-dom"
import CustomerLayout from "../layout/CustomerLayout"
import Home from "../pages/customer/Home"

const CustomerRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CustomerLayout />}>
                <Route index element={<Home />} />
            </Route>

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
        </Routes>
    )
}

export default CustomerRoutes