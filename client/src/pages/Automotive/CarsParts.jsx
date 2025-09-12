// src/pages/Automotive/CarsParts.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Cameras.css";

export default function CarsParts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products?category=automotive&sub_category=Cars Parts"
        );
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching cameras:", error);
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
        <h3>Cars parts</h3>
        <ul>
          <li><Link to="/Automotive/AutoTools">Auto Tools</Link></li>
          <li><Link to="/Automotive/CarsParts">Cars Parts</Link></li>
          <li><Link to="/Automotive/MotorcycleParts">Motorcycle Parts</Link></li>
          <li><Link to="/Automotive/OilsandCarCare">Oils and CarCare</Link></li>
          <li><Link to="/Automotive/WheelsandBattery">Wheels and Battery</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2>Cars Parts</h2>
        <p className="section-subtitle">Best Seller</p>

        {products.length === 0 ? (
          <p>No Cars Parts found.</p>
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
