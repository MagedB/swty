import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

// Public Pages
import Home from "./pages/Home";
import SmartDevices from "./pages/SmartDevices";
import MobilesTablets from "./pages/MobilesTablets";
import WomanFashion from "./pages/WomanFashion";
import ManFashion from "./pages/ManFashion";
import Kids from "./pages/kids";
import Automotive from "./pages/Automotive";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import SearchResults from "./pages/SearchResults";

// SmartDevices Sub Pages
import Cameras from "./pages/SmartDevices/Cameras";
import PcandLaptops from "./pages/SmartDevices/PcandLaptops";
import SmartHomeDevices from "./pages/SmartDevices/SmartHomesDevices";
import ComputerAccessories from "./pages/SmartDevices/ComputerAccessories";
import VideoGames from "./pages/SmartDevices/VideoGames";

// MobilesTablets Sub Pages
import Accessories from "./pages/MobilesTablets/Accessories";
import CasesandCovers from "./pages/MobilesTablets/CasesandCovers";
import ChargersandPowerBanks from "./pages/MobilesTablets/ChargersandPowerBanks";
import MobilePhones from "./pages/MobilesTablets/MobilePhones";
import Tablets from "./pages/MobilesTablets/Tablets";

// Automotive Sub Pages
import AutoTools from "./pages/Automotive/AutoTools";
import CarsParts from "./pages/Automotive/CarsParts";
import MotorcycleParts from "./pages/Automotive/MotorcycleParts";
import OilsandCarCare from "./pages/Automotive/OilsandCarCare";
import WheelsandBattery from "./pages/Automotive/WheelsandBattery";

// Blog Pages
import Blogs from "./pages/blogs/Blogs";
import ManFashionBlog from "./pages/blogs/manfashionblog";
import WomanFashionBlog from "./pages/blogs/womanfashionblog";
import KidsBlog from "./pages/blogs/kidsblog";
import SmartDeviceBlog from "./pages/blogs/smartdeviceblog";
import MobilesTabletsBlog from "./pages/blogs/mobilestabletsblog";
import AutomotiveBlog from "./pages/blogs/automotiveblog";
import Category from "./pages/blogs/Category";
import BlogPost from "./pages/blogs/BlogPost";

// Blog Pages
import Books from "./pages/Books.jsx";

// Dashboard + Management Pages
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import ManageProducts from "./pages/ManageProducts";
import ManageAccounts from "./pages/ManageAccounts";
import ManageOrders from "./pages/ManageOrders";
import ManageDelivery from "./pages/ManageDelivery";
import ManageFinance from "./pages/ManageFinance";
import SocialMedia from "./pages/SocialMedia";
import ManageBlogs from "./pages/ManageBlogs";
import AddBlogs from "./pages/AddBlogs";
import BookDetails from "./pages/BookDetails";

function App() {
  const { user } = useAuth();

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

        {/* SmartDevices hub and subpages */}
        <Route path="/smart-devices" element={<SmartDevices />}>
          <Route path="cameras" element={<Cameras />} />
          <Route path="pcandlaptops" element={<PcandLaptops />} />
          <Route path="smarthomesdevices" element={<SmartHomeDevices />} />
          <Route path="computeraccessories" element={<ComputerAccessories />} />
          <Route path="videogames" element={<VideoGames />} />
        </Route>

        {/* MobilesTablets hub and subpages */}
        <Route path="/mobiles-tablets" element={<MobilesTablets />}>
          <Route path="Accessories" element={<Accessories />} />
          <Route path="CasesandCovers" element={<CasesandCovers />} />
          <Route path="ChargersandPowerBanks" element={<ChargersandPowerBanks />} />
          <Route path="MobilePhones" element={<MobilePhones />} />
          <Route path="Tablets" element={<Tablets />} />
        </Route>

        {/* Automotive hub and subpages */}
        <Route path="/Automotive" element={<Automotive />}>
          <Route path="AutoTools" element={<AutoTools />} />
          <Route path="CarsParts" element={<CarsParts />} />
          <Route path="MotorcycleParts" element={<MotorcycleParts />} />
          <Route path="OilsandCarCare" element={<OilsandCarCare />} />
          <Route path="WheelsandBattery" element={<WheelsandBattery />} />
        </Route>

        {/* Other main pages */}
        <Route path="/woman-fashion" element={<WomanFashion />} />
        <Route path="/man-fashion" element={<ManFashion />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/automotive" element={<Automotive />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<Orders />} />

        {/* Blog pages */}
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/manfashionblog" element={<ManFashionBlog />} />
        <Route path="/blogs/womanfashionblog" element={<WomanFashionBlog />} />
        <Route path="/blogs/kidsblog" element={<KidsBlog />} />
        <Route path="/blogs/smartdeviceblog" element={<SmartDeviceBlog />} />
        <Route path="/blogs/mobilestabletsblog" element={<MobilesTabletsBlog />} />
        <Route path="/blogs/automotiveblog" element={<AutomotiveBlog />} />
        <Route path="/blogs/:category" element={<Category />} />
        <Route path="/blogs/:category/:id" element={<BlogPost />} />

        {/* Books page */}
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />

        {/* Search */}
        <Route path="/search" element={<SearchResults />} />

        {/* Dashboard pages */}
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

        {/* Admin-only dashboard pages */}
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
        <Route
          path="/dashboard/manage-blogs"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageBlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/add-blogs"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AddBlogs />
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
