import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import BusinessOwnerDashboard from "./pages/dashboard/BusinessOwner/BusinessOwnerDashboard";
import AdminDashboardApp from "./pages/dashboard/AdminDashboard/AdminDashboardApp";
import AdminLogin from "./pages/auth/AdminLogin";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },  
  {
    path: "/business-owner-dashboard",
    element :(<PublicRoute><BusinessOwnerDashboard/></PublicRoute>),
  },{
    path: "/admin-dashboard",
    element :(<PublicRoute><AdminDashboardApp/></PublicRoute>),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/admin/login",
    element: (
      <PublicRoute>
        <AdminLogin />
      </PublicRoute>
    ),
  },

]);

function App() {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;