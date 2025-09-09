import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Cameras.css";

export default function ComputerAccessories() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products?category=smart_devices&sub_category=Computer Accessories"
        );
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching computer accessories:", error);
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

      <main className="main-content">
        <h2>Computer Accessories</h2>
        <p className="section-subtitle">Best Seller</p>

        {products.length === 0 ? (
          <p>No accessories found.</p>
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

      <aside className="sidebar-right">
        <div className="ad-box">Ad Box 1</div>
        <div className="ad-box">Ad Box 2</div>
      </aside>
    </div>
  );
}
