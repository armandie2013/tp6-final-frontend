import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireProfile() {
  const profileId = typeof window !== "undefined" ? localStorage.getItem("profileId") : null;
  const loc = useLocation();
  if (!profileId) return <Navigate to="/profiles" replace state={{ from: loc.pathname }} />;
  return <Outlet />;
}