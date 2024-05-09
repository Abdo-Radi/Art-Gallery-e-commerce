import { Outlet } from "react-router-dom"
import Header from "../components/customer/Header"
import { useEffect } from "react"

const CustomerLayout = () => {

    useEffect(() => {
        document.querySelector("body").classList.add("font-platypi")
    }, [])

    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default CustomerLayout