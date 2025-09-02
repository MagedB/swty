import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-welcome">
        Welcome, {user.username} ({user.role})
      </p>

      <div className="dashboard-buttons">
        {/* Available for all roles */}
        <Link to="/dashboard/add-product">
          <button className="dashboard-btn">Add Product</button>
        </Link>
        <Link to="/dashboard/manage-products">
          <button className="dashboard-btn">Manage Products</button>
        </Link>

        {/* Admin-only pages */}
        {user.role === "admin" && (
          <>
            <Link to="/dashboard/manage-accounts">
              <button className="dashboard-btn">Manage Accounts</button>
            </Link>
            <Link to="/dashboard/manage-orders">
              <button className="dashboard-btn">Manage Orders</button>
            </Link>
            <Link to="/dashboard/manage-delivery">
              <button className="dashboard-btn">Manage Delivery</button>
            </Link>
            <Link to="/dashboard/manage-finance">
              <button className="dashboard-btn">Manage Finance</button>
            </Link>
            <Link to="/dashboard/social-media">
              <button className="dashboard-btn">Social Media</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
