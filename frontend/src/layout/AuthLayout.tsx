import { useAuthStore } from "~/stores/auth.store";
import { observer } from "mobx-react-lite";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const AuthLayout = observer(() => {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuthStore();
  const isLoginPage = pathname === "/login";

  if (!isAuthenticated && !isLoginPage) return <Navigate to="/login" />;
  if (isAuthenticated && isLoginPage) return <Navigate to="/" />;

  return <Outlet />;
});

export default AuthLayout;
