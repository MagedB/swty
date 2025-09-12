// src/pages/MobilesTablets/Chargers and PowerBanks.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Cameras.css";

export default function ChargersandPowerBanks() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products?category=mobiles_tablets&sub_category=Chargers and PowerBanks"
        );
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching Chargers and PowerBanks:", error);
      }
    };
    fetchProducts();
  }, []);

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

  return (
    <div className="page-container">
      {/* Left Sidebar */}
      <aside className="sidebar-left">
        <h3>Mobiles Tablets</h3>
        <ul>
          <li><Link to="/mobiles-tablets/accessories">Accessories</Link></li>
          <li><Link to="/mobiles-tablets/casesandcovers">Cases and Covers</Link></li>
          <li><Link to="/mobiles-tablets/chargersandpowerbanks">Chargers and PowerBanks</Link></li>
          <li><Link to="/mobiles-tablets/mobilephones">Mobile Phones</Link></li>
          <li><Link to="/mobiles-tablets/tablets">Tablets</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2>Chargers & PowerBanks</h2>
        <p className="section-subtitle">Best Seller</p>

        {products.length === 0 ? (
          <p>No Chargers and PowerBanks found.</p>
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
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
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
