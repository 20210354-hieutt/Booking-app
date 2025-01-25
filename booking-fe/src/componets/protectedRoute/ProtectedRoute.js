import { Navigate, useNavigate } from "react-router-dom";
import Login from "../../pages/login/Login";
import Error from "../404/404Page";
import { useEffect } from "react";

const ProtectedRoute = ({ redirectPath }) => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate(redirectPath, { replace: true });
    }
  }, [accessToken, navigate, redirectPath]);

  // Render nothing if navigating
  if (!accessToken) return null;

  return <div>Welcome back!</div>;
};
export default ProtectedRoute;
