// src/pages/Automotive.jsx
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/automotive.css"; // Use same CSS as Fashion hub for consistency

export default function Automotive() {
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
    if (location.pathname === "/automotive") {
      const fetchData = async () => {
        try {
          const subcategories = [
            "Auto Tools",
            "Cars Parts",
            "Motorcycle Parts",
            "Oils and CarCare",
            "Wheels and Battery",
          ];

          const dataObj = {};
          for (let sub of subcategories) {
            const res = await fetch(
              `http://localhost:5000/api/products?category=automotive&sub_category=${encodeURIComponent(sub)}`
            );
            const data = await res.json();
            dataObj[sub] = data.slice(0, 3);
          }
          setProducts(dataObj);
        } catch (error) {
          console.error("Error fetching Automotive products:", error);
        }
      };
      fetchData();
    }
  }, [location.pathname]);

  const isHubPage = location.pathname === "/automotive";
  const subToPath = (sub) => sub.replace(/\s+/g, "").toLowerCase();

  return (
    <div className="fashion-page">
      {/* Left Sidebar */}
      <aside className="fashion-sidebar">
        <h2>Automotive</h2>
        <ul>
          <li><Link to="autotools">Auto Tools</Link></li>
          <li><Link to="carsparts">Cars Parts</Link></li>
          <li><Link to="motorcycleparts">Motorcycle Parts</Link></li>
          <li><Link to="oilsandcarcare">Oils and Car Care</Link></li>
          <li><Link to="wheelsandbattery">Wheels and Battery</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="fashion-content">
        {isHubPage ? (
          <>
            <h2>Latest Automotive Products</h2>
            {Object.keys(products).map((sub) => (
              <div key={sub} className="subcategory-block">
                <h3 className="subcategory-title">{sub}</h3>
                <div className="product-grid">
                  {products[sub]?.length > 0 ? (
                    products[sub].map((product) => (
                      <div key={product.id} className="product-card">
                        <img
                          src={`http://localhost:5000/uploads/${product.image}`}
                          alt={product.name}
                          className="product-image"
                        />
                        <h4 className="product-name">{product.name}</h4>
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
                  to={`/automotive/${subToPath(sub)}`}
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

      {/* Right Sidebar */}
      <aside className="fashion-right-sidebar">
        <h3>Other Categories</h3>
        <ul>
          <li><Link to="/woman-fashion">Woman Fashion</Link></li>
          <li><Link to="/man-fashion">Man Fashion</Link></li>
          <li><Link to="/kids">Kids</Link></li>
          <li><Link to="/smart-devices">Smart Devices</Link></li>
          <li><Link to="/mobiles-tablets">Mobiles & Tablets</Link></li>
        </ul>
      </aside>
    </div>
  );
}
