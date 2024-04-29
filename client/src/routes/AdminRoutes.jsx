import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { jwtDecode } from "jwt-decode"
import { Navigate, Outlet } from "react-router-dom"
import { getUser } from "../redux/features/user"
import axiosInstance from "../api/axiosInstance"

const AdminRoutes = () => {
    const { check, loggedIn } = useSelector(state => state.user)
    const token = localStorage.getItem("token")

    if (!token) return <Navigate to="admin/login" />

    axiosInstance.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${token}`

        return config
    })

    const dispatch = useDispatch()
    const payload = jwtDecode(token)

    useEffect(() => {
        dispatch(getUser(payload))
    }, [])

    return check ? loggedIn && <Outlet /> : <Navigate to="admin/login" />
}

export default AdminRoutes