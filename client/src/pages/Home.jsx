import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Make sure this CSS file exists

export default function Home() {
  const [featured, setFeatured] = useState({
    smart_devices: [],
    fashion: [],
    automotive: [],
  });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const categories = ["smart_devices", "fashion", "automotive"];
        const result = {};
        for (let cat of categories) {
          const res = await fetch(`http://localhost:5000/api/products?category=${cat}`);
          const data = await res.json();
          result[cat] = data.slice(0, 3); // Show top 3 products for each category
        }
        setFeatured(result);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchFeatured();
  }, []);

  const renderCategory = (title, items, category, colorClass) => (
    <div className={`category-section ${colorClass}`}>
      <h2 className="category-title">{title}</h2>
      <div className="item-list">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <img
              src={`http://localhost:5000/uploads/${item.image}`}
              alt={item.name}
            />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <Link to={`/${category}`} className="view-more-link">
                View More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to šwty</h1>
      <p className="home-subtitle">
        Your one-stop shop for Smart Devices, Fashion, and Automotive products!
      </p>

      {renderCategory("Smart Devices", featured.smart_devices, "smart-devices", "color-smart")}
      {renderCategory("Fashion", featured.fashion, "fashion", "color-fashion")}
      {renderCategory("Automotive", featured.automotive, "automotive", "color-auto")}
    </div>
  );
}
