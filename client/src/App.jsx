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
        <HomePage />
    ),
  },  
  {
    path: "/business-owner-dashboard",
    element :(<BusinessOwnerDashboard/>),
  },{
    path: "/admin-dashboard",
    element :(<AdminDashboardApp/>),
  },
  {
    path: "/login",
    element: (
      
        <Login />
      
    ),
  },
  {
    path: "/register",
    element: (
        <Register />
    ),
  },
  {
    path: "/admin/login",
    element: (
        <AdminLogin />
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
