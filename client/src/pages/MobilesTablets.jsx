// src/pages/MobilesTablets.jsx
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/MobilesTablets.css";

export default function MobilesTablets() {
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
    if (location.pathname === "/mobiles-tablets") {
      const fetchData = async () => {
        try {
          const subcategories = [
            "Accessories",
            "Cases and Covers",
            "Chargers and PowerBanks",
            "Mobile Phones",
            "Tablets",
          ];

          const dataObj = {};
          for (let sub of subcategories) {
            const res = await fetch(
              `http://localhost:5000/api/products?category=mobiles_tablets&sub_category=${sub}`
            );
            const data = await res.json();
            dataObj[sub] = data.slice(0, 3);
          }
          setProducts(dataObj);
        } catch (error) {
          console.error("Error fetching mobiles tablets hub products:", error);
        }
      };

      fetchData();
    }
  }, [location.pathname]);

  const isHubPage = location.pathname === "/mobiles-tablets";
  const subToPath = (sub) => sub.replace(/\s+/g, "").toLowerCase();

  return (
    <div className="mobilestablets-page">
      {/* Left Sidebar */}
      <aside className="mobilestablets-sidebar">
        <h2>Mobiles & Tablets</h2>
        <ul>
          <li><Link to="accessories">Accessories</Link></li>
          <li><Link to="casesandcovers">Cases and Covers</Link></li>
          <li><Link to="chargersandpowerbanks">Chargers & PowerBanks</Link></li>
          <li><Link to="mobilephones">Mobile Phones</Link></li>
          <li><Link to="tablets">Tablets</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="mobilestablets-content">
        {isHubPage ? (
          <>
            <h2>Latest Mobiles & Tablets</h2>
            {Object.keys(products).map((sub) => (
              <div key={sub} className="subcategory-block">
                <h3 className="subcategory-title">{sub}</h3>
                <div className="product-grid">
                  {products[sub] && products[sub].length > 0 ? (
                    products[sub].map((product) => (
                      <div key={product.id} className="product-card">
                        <img
                          className="product-image"
                          src={`http://localhost:5000/uploads/${product.image}`}
                          alt={product.name}
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
                  to={`/mobiles-tablets/${subToPath(sub)}`}
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
      <aside className="mobilestablets-right-sidebar">
        <h3>Other Categories</h3>
        <ul>
          <li><Link to="/smart-devices">Smart Devices</Link></li>
          <li><Link to="/woman-fashion">Woman Fashion</Link></li>
          <li><Link to="/man-fashion">Man Fashion</Link></li>
          <li><Link to="/kids">Kids</Link></li>
          <li><Link to="/automotive">Automotive</Link></li>
        </ul>
      </aside>
    </div>
  );
}
