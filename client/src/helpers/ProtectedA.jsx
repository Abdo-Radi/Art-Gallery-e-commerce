import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../redux/slices/user";

const ProtectedA = () => {
  const { isLoading, loggedIn } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="admin/login" />;

  axiosInstance.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  });

  const dispatch = useDispatch();
  const payload = jwtDecode(token);

  useEffect(() => {
    dispatch(getUser(payload));
  }, []);

  return !isLoading && (loggedIn ? <Outlet /> : <Navigate to="admin/login" />);
};

export default ProtectedA;
