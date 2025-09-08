import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Cameras.css"; // reuse same style

export default function PcandLaptops() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products?category=smart_devices&sub_category=Pc and Laptops"
        );
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching Pc & Laptops:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="page-container">
      {/* Left Sidebar */}
      <aside className="sidebar-left">
        <h3>Smart Devices</h3>
        <ul>
          <li><Link to="/smart-devices/pcandlaptops">Pc & Laptops</Link></li>
          <li><Link to="/smart-devices/computeraccessories">Computer Accessories</Link></li>
          <li><Link to="/smart-devices/smarthomesdevices">Smart Home Devices</Link></li>
          <li><Link to="/smart-devices/cameras">Cameras</Link></li>
          <li><Link to="/smart-devices/videogames">Video Games</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2>Pc & Laptops</h2>
        <p className="section-subtitle">Best Seller</p>

        {products.length === 0 ? (
          <p>No laptops found.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={`http://localhost:5000/uploads/${product.image}`}
                  alt={product.name}
                />
                <h4>{product.name}</h4>
                <p className="price">EGP {product.price}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Right Sidebar (Ads) */}
      <aside className="sidebar-right">
        <div className="ad-box">Ad Box 1</div>
        <div className="ad-box">Ad Box 2</div>
      </aside>
    </div>
  );
}
