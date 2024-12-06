import { BiUserCircle } from "react-icons/bi";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Layout.css"; // Make sure the styles are updated here
import { useSelector } from "react-redux";
import banner1 from "../../assets/banner1.jpg";

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
        <img src={banner1} alt="logo" />
      </div>
      <div className="navbar-center">
        <p className="nav-link">
          <BiUserCircle /> Welcome{" "}
          {user?.name || user?.businessOwnerName || user?.admin}
          &nbsp;
          <span className="badge bg-secondary">{user?.role}</span>
        </p>
      </div>
      <div className="navbar-logout">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
