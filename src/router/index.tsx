
import {
    createBrowserRouter,
  } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import EditorPage from "../pages/EditorPage";
  
  export const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
            path: "/dashboard",
            element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
        },
        {
            path: "/editor/:kitId",
            element: <ProtectedRoute><EditorPage /></ProtectedRoute>,
        }
      ]
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/signup",
        element: <SignUpPage />,
    },
  ]);
