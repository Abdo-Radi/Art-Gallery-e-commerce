import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import ConfigRoutes from "./routes";
import { clearUser, setUser } from "./redux/slices/user";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(clearUser());
      } else {
        dispatch(setUser(JSON.parse(user)));
      }
    }
  }, []);

  return <ConfigRoutes />;
}

export default App;
