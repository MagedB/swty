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
        <Link to="/dashboard/add-product" className="dashboard-btn">
          Add Product
        </Link>
        <Link to="/dashboard/manage-products" className="dashboard-btn">
          Manage Products
        </Link>

        {/* Admin-only pages */}
        {user.role === "admin" && (
          <>
            <Link to="/dashboard/manage-accounts" className="dashboard-btn">
              Manage Accounts
            </Link>
            <Link to="/dashboard/manage-orders" className="dashboard-btn">
              Manage Orders
            </Link>
            <Link to="/dashboard/manage-delivery" className="dashboard-btn">
              Manage Delivery
            </Link>
            <Link to="/dashboard/manage-finance" className="dashboard-btn">
              Manage Finance
            </Link>
            <Link to="/dashboard/social-media" className="dashboard-btn">
              Social Media
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
