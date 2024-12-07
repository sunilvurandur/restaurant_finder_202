import React, { useState } from "react";
import "../../styles/AdminLogin.css";
import { handleLogin } from "../../services/authService";
import image123 from"../../assets/image123.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = (e) => {
    e.preventDefault();
    handleLogin(e, email, password, "admin");
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-left">
        {/* Illustration */}
        <img
          src={image123} // Replace with the path to your image
          alt="Admin illustration"
          className="admin-illustration"
        />
      </div>
      <div className="admin-login-right">
        <form onSubmit={handleAdminLogin} className="admin-login-form">
          <h1 className="admin-login-title">Login to Dashboard</h1>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
