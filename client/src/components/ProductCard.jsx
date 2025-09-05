import React from "react";

export default function ProductCard({ product }) {
  const addToCart = () => {
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const existingIndex = cart.findIndex((item) => item.id === product.id);
    if (existingIndex === -1) {
      cart.push({ ...product, quantity: 1 });
    } else {
      cart[existingIndex].quantity += 1;
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // ✅ Trigger Navbar badge update with new count
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart.length }));

    alert(`${product.name} ${existingIndex === -1 ? "added" : "quantity increased"}!`);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
      <img
        src={
          product.image?.startsWith("http")
            ? product.image
            : `http://localhost:5000/uploads/${product.image}`
        }
        alt={product.name}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />
      <h3>{product.name}</h3>
      <p>${Number(product.price).toFixed(2)}</p>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}
