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

  // A blank screen while the session resolves reads as a broken page.
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-surface">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-bold text-ink">
            Horizons
          </span>
          <span className="mb-0.5 inline-block h-1.5 w-1.5 animate-pulse bg-klein" />
        </div>
        <p className="label-cap">Loading your session…</p>
      </div>
    );
  }

  return loggedIn ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedA;
