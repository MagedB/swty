import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import SmartDevices from "./pages/SmartDevices";
import Fashion from "./pages/Fashion";
import Automotive from "./pages/Automotive";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import ManageProducts from "./pages/ManageProducts";
import ManageAccounts from "./pages/ManageAccounts";
import ManageOrders from "./pages/ManageOrders";
import ManageDelivery from "./pages/ManageDelivery";
import ManageFinance from "./pages/ManageFinance";
import SocialMedia from "./pages/SocialMedia";





function App() {
  const { user } = useAuth();

  // helper to protect routes
  const ProtectedRoute = ({ children, roles }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/smart-devices" element={<SmartDevices />} />
        <Route path="/fashion" element={<Fashion />} />
        <Route path="/automotive" element={<Automotive />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<Orders />} />

        {/* Dashboard pages (only admin & moderator) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["admin", "moderator"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/add-product"
          element={
            <ProtectedRoute roles={["admin", "moderator"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manage-products"
          element={
            <ProtectedRoute roles={["admin", "moderator"]}>
              <ManageProducts />
            </ProtectedRoute>
          }
        />

        {/* Admin-only pages */}
        <Route
          path="/dashboard/manage-accounts"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageAccounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manage-orders"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manage-delivery"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageDelivery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manage-finance"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageFinance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/social-media"
          element={
            <ProtectedRoute roles={["admin"]}>
              <SocialMedia />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
