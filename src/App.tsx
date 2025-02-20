import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";

axios.defaults.baseURL = "https://taxiapp.easybooks.me:8288/";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          index: true,
          element: <LoginPage />,
        },
        {
          path: "dashboard",
          element: <DashboardPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
