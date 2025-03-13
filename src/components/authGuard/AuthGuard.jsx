import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../services/authServices/Authervices"
const AuthGuard = () => {
  console.log("AuthGuard check - Utilisateur connecté ?", isAuthenticated()); // ✅ Debugging

  return isAuthenticated() ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default AuthGuard;
