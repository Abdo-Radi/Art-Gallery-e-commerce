import { Outlet } from "react-router-dom"
import Header from "../components/customer/Header"

const CustomerLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default CustomerLayout