import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSearch, FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header>
      {/* 🔹 Top Navbar */}
      <div className="top-navbar">
        {/* Left: Logo + Welcome */}
        <div className="top-left">
          <Link to="/" className="navbar-brand">šwty</Link>
          {user ? (
            <span className="welcome-text">Welcome, {user.username}</span>
          ) : (
            <span className="welcome-text">Welcome, Guest</span>
          )}
        </div>

        {/* Center: Search Bar */}
        <div className="top-center">
          <form onSubmit={handleSearch} className="search-bar-container">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Right: Cart, Orders, Language */}
        <div className="top-right">
          <Link to="/cart" className="cart-link">
            <FaShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <Link to="/orders" className="orders-link">
            <FaBoxOpen size={18} />
          </Link>
          <select className="lang-select">
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>
        </div>
      </div>

      {/* 🔹 Main Navbar */}
      <nav className="main-navbar">
        <div className="main-left">
          <Link to="/">Home</Link>
          <Link to="/smart-devices">Smart Devices</Link>
          <Link to="/mobiles-tablets">Mobiles Tablets</Link>
          <Link to="/woman-fashion">Women Fashion</Link>
          <Link to="/man-fashion">Man Fashion</Link>
          <Link to="/kids">Kids</Link>
          <Link to="/automotive">Automotive</Link>
          
          {user && ["admin", "moderator"].includes(user.role) && (
            <Link to="/dashboard">Dashboard</Link>
          )}
        </div>

        {/* Right Auth Links */}
        <div className="main-right">
          <Link to="/Books">Books</Link> <Link to="/blogs">Blogs</Link> 
          {!user ? (
            <>
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link">Register</Link>
              
            </>
          ) : (
            <button onClick={logout} className="logout-btn">Logout</button>
            
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
