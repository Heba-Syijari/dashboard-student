import { ReactNode } from "react";
import axios from "axios";
import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider,
} from "react-router-dom";

import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";

axios.defaults.baseURL = "https://taxiapp.easybooks.me:8288/";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/" replace />;
};
const loader = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return redirect("/dashboard");
  }
  return null;
};
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          index: true,
          loader: loader,
          element: <LoginPage />,
        },
        {
          path: "dashboard",
          element: (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
