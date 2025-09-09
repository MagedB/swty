// src/pages/SmartDevices.jsx
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/SmartDevices.css";

export default function SmartDevices() {
  const [products, setProducts] = useState({});
  const location = useLocation();

  const addToCart = (product) => {
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];
    if (!cart.find((item) => item.id === product.id)) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.name} added to cart!`);
    } else {
      alert(`${product.name} is already in the cart`);
    }
  };

  useEffect(() => {
    // Only fetch hub data if on the main hub page (/smart-devices),
    // not when inside a subcategory (/smart-devices/cameras, etc.)
    if (location.pathname === "/smart-devices") {
      const fetchData = async () => {
        try {
          const subcategories = [
            "Cameras",
            "Pc and Laptops",
            "Computer Accessories",
            "Smart Homes Devices",
            "Video Games",
          ];

          const dataObj = {};
          for (let sub of subcategories) {
            const res = await fetch(
              `http://localhost:5000/api/products?category=smart_devices&sub_category=${sub}`
            );
            const data = await res.json();
            dataObj[sub] = data.slice(0, 3); // latest 3 products
          }
          setProducts(dataObj);
        } catch (error) {
          console.error("Error fetching smart device hub products:", error);
        }
      };

      fetchData();
    }
  }, [location.pathname]);

  const isHubPage = location.pathname === "/smart-devices";

  return (
    <div className="smartdevices-page">
      {/* Left Sidebar - Subcategories */}
      <aside className="smartdevices-sidebar">
        <h2>Smart Devices</h2>
        <ul>
          <li><Link to="cameras">Cameras</Link></li>
          <li><Link to="pcandlaptops">Pc & Laptops</Link></li>
          <li><Link to="computeraccessories">Computer Accessories</Link></li>
          <li><Link to="smarthomesdevices">Smart Home Devices</Link></li>
          <li><Link to="videogames">Video Games</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="smartdevices-content">
        {isHubPage ? (
          <>
            <h2>Latest Smart Devices</h2>
            
            {Object.keys(products).map((sub) => (
              <div key={sub} className="subcategory-block">
                <h3>{sub}</h3>
                <div className="product-grid">
                  {products[sub] && products[sub].length > 0 ? (
                    products[sub].map((product) => (
                      <div key={product.id} className="product-card">
                        <img
                          src={`http://localhost:5000/uploads/${product.image}`}
                          alt={product.name}
                        />
                        <h4>{product.name}</h4>
                        <p className="price">EGP {product.price}</p>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No products yet.</p>
                  )}
                </div>
                <Link
                  to={`/smart-devices/${encodeURIComponent(
                   sub.replace(/\s+/g, "").toLowerCase()
            )}`}
                  className="see-more"
                >
                  See all {sub}
                </Link>
              </div>
            ))}
          </>
        ) : (
          <Outlet />
        )}
      </main>

      {/* Right Sidebar - Other Main Categories */}
      <aside className="smartdevices-right-sidebar">
        <h3>Other Categories</h3>
        <ul>
          <li><Link to="/mobiles-tablets">Mobiles & Tablets</Link></li>
          <li><Link to="/woman-fashion">Woman Fashion</Link></li>
          <li><Link to="/man-fashion">Man Fashion</Link></li>
          <li><Link to="/kids">Kids</Link></li>
          <li><Link to="/automotive">Automotive</Link></li>
        </ul>
      </aside>
    </div>
  );
}
