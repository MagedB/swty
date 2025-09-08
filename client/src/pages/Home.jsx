import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [productsByCategory, setProductsByCategory] = useState({
    smart_devices: [],
    mobiles_tablets: [],
    woman_fashion: [],
    man_fashion: [],
    kids: [],
    automotive: [],
  });

  const [featured, setFeatured] = useState({
    smart_devices: [],
    mobiles_tablets: [],
    woman_fashion: [],
    man_fashion: [],
    kids: [],
    automotive: [],
  });

  const [indexes, setIndexes] = useState({
    smart_devices: 0,
    mobiles_tablets: 0,
    woman_fashion: 0,
    man_fashion: 0,
    kids: 0,
    automotive: 0,
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const categories = ["smart_devices", "mobiles_tablets", "woman_fashion", "man_fashion", "kids", "automotive"];
        const result = {};
        for (let cat of categories) {
          const res = await fetch(
            `http://localhost:5000/api/products?category=${cat}`
          );
          const data = await res.json();
          result[cat] = data;
        }
        setProductsByCategory(result);

        const initialFeatured = {};
        for (let cat of categories) {
          initialFeatured[cat] = result[cat].slice(0, 3);
        }
        setFeatured(initialFeatured);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeatured((prevFeatured) => {
        const newFeatured = { ...prevFeatured };
        const newIndexes = { ...indexes };

        Object.keys(productsByCategory).forEach((cat) => {
          const allProducts = productsByCategory[cat];
          if (allProducts.length <= 3) return;

          newIndexes[cat] = (indexes[cat] + 1) % allProducts.length;
          const start = newIndexes[cat];
          newFeatured[cat] = [];
          for (let i = 0; i < 3; i++) {
            newFeatured[cat].push(allProducts[(start + i) % allProducts.length]);
          }
        });

        setIndexes(newIndexes);
        return newFeatured;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [productsByCategory, indexes]);

  const categoryRoutes = {
    smart_devices: "smart-devices",
    mobiles_tablets: "mobiles-tablets",
    woman_fashion: "woman-fashion",
    man_fashion: "man-fashion",
    kids: "kids",
    automotive: "automotive",
  };

  const renderCategory = (title, items, category, colorClass) => (
    <div className={`category-section ${colorClass}`}>
      <h2 className="category-title">{title}</h2>
      <div className="item-list">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <img
              src={
                item.image?.startsWith("http")
                  ? item.image
                  : `http://localhost:5000/uploads/${item.image}`
              }
              alt={item.name}
            />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>${Number(item.price).toFixed(2)}</p>
              <Link
                to={`/${categoryRoutes[category]}`}
                className="view-more-link"
              >
                View More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="home-title">Welcome to šwty</h1>
        <p className="home-subtitle">
          Your one-stop shop for Smart Devices, Fashion, and Automotive products!
        </p>

        {renderCategory(
          "Smart Devices",
          featured.smart_devices,
          "smart_devices",
          "color-smart"
        )}
        {renderCategory("Mobiles Tablets", featured.mobiles_tablets, "mobiles_tablets", "color-auto")}
        {renderCategory("Women Fashion", featured.woman_fashion, "woman_fashion", "color-fashion")}
        {renderCategory("Man Fashion", featured.man_fashion, "man_fashion", "color-smart")}
        {renderCategory("Kids", featured.kids, "kids", "color-fashion")}
        {renderCategory(
          "Automotive",
          featured.automotive,
          "automotive",
          "color-auto"
        )}
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-line line1">© 2025 šwty. All Rights Reserved</div>
        <div className="footer-line line2">
          <div className="footer-left">
            <Link to="/warranty">Warranty Policy</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
          <div className="footer-right">
            Contact us
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src="/icons/facebook.png" alt="Facebook" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <img src="/icons/instagram.png" alt="Instagram" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <img src="/icons/youtube.png" alt="YouTube" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer">
              <img src="/icons/tiktok.png" alt="TikTok" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
