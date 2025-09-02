import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css"; // Import the CSS file

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">šwty</Link>
        <Link to="/">Home</Link>
        <Link to="/smart-devices">Smart Devices</Link>
        <Link to="/fashion">Fashion</Link>
        <Link to="/automotive">Automotive</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">My Orders</Link>
        {user && ["admin", "moderator"].includes(user.role) && (
          <Link to="/dashboard">Dashboard</Link>
        )}
      </div>

      {/* Auth Links */}
      <div className="navbar-right">
        {!user ? (
          <>
            <Link to="/login" className="auth-link">Login</Link>
            <Link to="/register" className="auth-link">Register</Link>
          </>
        ) : (
          <>
            <span className="welcome-text">Welcome, {user.username}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
