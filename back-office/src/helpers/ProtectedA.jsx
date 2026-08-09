import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../redux/slices/user";

const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    if (payload.exp && Date.now() >= payload.exp * 1000) return null;
    return payload;
  } catch {
    return null;
  }
};

const ProtectedA = () => {
  const dispatch = useDispatch();
  const { isLoading, loggedIn } = useSelector((state) => state.user);

  const token = localStorage.getItem("token");
  const payload = decodeToken(token);

  useEffect(() => {
    if (payload) {
      dispatch(getUser(payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (!payload) {
    localStorage.removeItem("token");
    return <Navigate to="/admin/login" replace />;
  }

  return (
    !isLoading && (loggedIn ? <Outlet /> : <Navigate to="/admin/login" replace />)
  );
};

export default ProtectedA;
