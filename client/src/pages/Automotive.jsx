import React, { useEffect, useState } from "react";
import apiFetch from "../api/api";
import "./Automotive.css";

export default function Automotive() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiFetch("/products?category=automotive");
        setProducts(data);
      } catch (err) {
        console.error("Error fetching automotive products:", err);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const existing = cart.find((item) => item.id === product.id);
    if (!existing) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.name} added to cart!`);
    } else {
      alert(`${product.name} is already in the cart`);
    }
  };

  return (
    <div className="products-page">
      <h1>Automotive</h1>
      <div className="products-list">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <img src={`http://localhost:5000/uploads/${p.image}`} alt={p.name} />
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button className="add-to-cart-btn" onClick={() => addToCart(p)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
