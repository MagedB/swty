import React from "react";

export default function ProductCard({ product }) {
  const addToCart = () => {
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
    <div style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
      <img
        src={`http://localhost:5000/uploads/${product.image}`}
        alt={product.name}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}
