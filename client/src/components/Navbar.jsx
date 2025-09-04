import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Load initial cart count
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartCount(JSON.parse(savedCart).length);
  }, []);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      const savedCart = localStorage.getItem("cart");
      setCartCount(savedCart ? JSON.parse(savedCart).length : 0);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">šwty</Link>
        <Link to="/">Home</Link>
        <Link to="/smart-devices">Smart Devices</Link>
        <Link to="/fashion">Fashion</Link>
        <Link to="/automotive">Automotive</Link>
        <Link to="/cart" className="cart-link">
          Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        <Link to="/orders">My Orders</Link>
        {user && ["admin", "moderator"].includes(user.role) && (
          <Link to="/dashboard">Dashboard</Link>
        )}
      </div>

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
