import { createBrowserRouter, Navigate } from "react-router";

import { RequireAuth } from "@/components/require-auth";
import { AppLayout } from "@/layouts/app-layout";
import { DashboardPage } from "@/pages/dashboard-page";
import { LoginPage } from "@/pages/login-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { UsersPage } from "@/pages/users/users-page";

// Pages inside AppLayout get the sidebar and header, and RequireAuth redirects to /login without a token.
// For public pages without the sidebar (e.g. /login), add a route next to the RequireAuth route.
export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/users" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "users", element: <UsersPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
