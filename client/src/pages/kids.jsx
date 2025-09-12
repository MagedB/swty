import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./kids.css";

export default function kids() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products?category=kids"
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching fashion products:", err);
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
    <div className="kids-page">
      {/* ✅ Hero Section with clean banner */}
      <section className="hero-section">
        <img
          src="/images/banner-3.jpg"
          alt="kids Banner"
          className="hero-banner"
        />
      </section>

      {/* ✅ Subcategories Links */}
      <div className="subcategories">
        <Link to="/kids/Babys" className="subcat-link">
          Babys
        </Link>
        <Link to="/kids/GirlsFashion" className="subcat-link">
          Girls Fashion
        </Link>
        <Link to="/kids/BoysFashion" className="subcat-link">
          Boys Fashion
        </Link>
        <Link to="/kids/KidsSchool" className="subcat-link">
          Kids School
        </Link>
        <Link to="/kids/Toys" className="subcat-link">
          Toys
        </Link>
      </div>
            
      {/* ✅ Section Title */}
      <h2 className="section-title"></h2>
      {/* ✅ Supplier Logos Section */}
        <div className="supplier-logos">
          <h2 className="section-title"></h2>
             <div className="logos-container">
              <img src="/logos/logo-1.svg" alt="Supplier 1" className="supplier-logo" />
              <img src="/logos/logo-2.svg" alt="Supplier 2" className="supplier-logo" />
              <img src="/logos/logo-3.svg" alt="Supplier 3" className="supplier-logo" />
              <img src="/logos/logo-4.svg" alt="Supplier 4" className="supplier-logo" />
              <img src="/logos/logo-5.svg" alt="Supplier 5" className="supplier-logo" />
              <img src="/logos/logo-6.svg" alt="Supplier 6" className="supplier-logo" />
              <img src="/logos/logo-7.svg" alt="Supplier 7" className="supplier-logo" />
              <img src="/logos/logo-8.svg" alt="Supplier 8" className="supplier-logo" />
        </div>
       </div>

      {/* ✅ Product Grid */}
      <div className="products-list">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <img
              src={`http://localhost:5000/uploads/${p.image}`}
              alt={p.name}
              className="product-img"
            />
            <h3>{p.name}</h3>
            <p className="price">EGP {p.price}</p>
            <button
              className="add-to-cart-btn"
              onClick={() => addToCart(p)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}