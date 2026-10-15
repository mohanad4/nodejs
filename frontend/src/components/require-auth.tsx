import { Navigate, Outlet, useLocation } from "react-router";

import { getToken } from "@/api/auth";

// Wraps every protected route: without a valid token, send the user to /login
// and remember where they were going so login can bring them back.
export function RequireAuth() {
  const location = useLocation();
  if (!getToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
