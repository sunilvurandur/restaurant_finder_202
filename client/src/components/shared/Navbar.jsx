import { BiUserCircle } from "react-icons/bi";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Layout.css"; // Add styles for the Navbar if needed
import { useSelector } from "react-redux";


const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    alert("Logout Successfully");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <h3>AppLogo</h3>
      </div>
      <div className="navbar-links">
        {/* <button onClick={() => navigate("/")}>Home</button> */}
        <p className="nav-link">
                <BiUserCircle /> Welcome{" "}
                {user?.name || user?.businessOwnerName || user?.admin}
                &nbsp;
                <span className="badge bg-secondary">{user?.role}</span>
        </p>
        <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
      </div>
    </div>
  );
};

export default Navbar;
