// src/pages/WomanFashion/AccessoriesandPerfumes.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/MobilesTablets.css";

export default function BeautyandMakeup() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products?category=woman_fashion&sub_category=Beauty and Makeup"
        );
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching Beauty and Makeup:", error);
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
        <h3>Woman Fashion</h3>
        <ul>
          <li><Link to="/womanfashion/accessoriesandperfumes">Accessories & Perfumes</Link></li>
          <li><Link to="/womanfashion/beautyandmakeup">Beauty & Makeup</Link></li>
          <li><Link to="/womanfashion/clothes">Clothes</Link></li>
          <li><Link to="/womanfashion/goldandjewelry">Gold & Jewelry</Link></li>
          <li><Link to="/womanfashion/shoesandbags">Shoes & Bags</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2>Beauty & Makeup</h2>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={`http://localhost:5000/uploads/${product.image}`}
                  alt={product.name}
                  className="product-img"
                />
                <h4>{product.name}</h4>
                <p className="price">EGP {product.price}</p>
                <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Right Sidebar */}
      <aside className="sidebar-right">
        <div className="ad-box">Ad Box 1</div>
        <div className="ad-box">Ad Box 2</div>
      </aside>
    </div>
  );
}
