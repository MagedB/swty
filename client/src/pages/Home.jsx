import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [featured, setFeatured] = useState({
    smart_devices: [],
    fashion: [],
    automotive: [],
  });

  // Track the starting index for carousel per category
  const [startIndex, setStartIndex] = useState({
    smart_devices: 0,
    fashion: 0,
    automotive: 0,
  });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const categories = ["smart_devices", "fashion", "automotive"];
        const result = {};
        for (let cat of categories) {
          const res = await fetch(
            `http://localhost:5000/api/products?category=${cat}`
          );
          const data = await res.json();
          result[cat] = data; // fetch all products
        }
        setFeatured(result);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchFeatured();
  }, []);

  // Rotate products every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => {
        const updated = {};
        for (let cat in prev) {
          if (featured[cat]?.length > 3) {
            updated[cat] = (prev[cat] + 1) % featured[cat].length;
          } else {
            updated[cat] = 0;
          }
        }
        return updated;
      });
     }, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval);
  }, [featured]);

  const getVisibleItems = (category) => {
    const items = featured[category] || [];
    if (items.length <= 3) return items;
    const start = startIndex[category];
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(items[(start + i) % items.length]);
    }
    return visible;
  };

  const renderCategory = (title, category, colorClass) => {
    const items = getVisibleItems(category);
    return (
      <div className={`category-section ${colorClass}`}>
        <h2 className="category-title">{title}</h2>
        <div className="item-list">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="item-card">
                <img
                  src={
                    item?.image
                      ? item.image.startsWith("http")
                        ? item.image
                        : `http://localhost:5000/uploads/${item.image}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={item?.name || "Product"}
                />
                <div className="item-details">
                  <h3>{item?.name || "Unnamed Product"}</h3>
                  <p>${item?.price ? Number(item.price).toFixed(2) : "0.00"}</p>
                  <Link to={`/${category}`} className="view-more-link">
                    View More
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to šwty</h1>
      <p className="home-subtitle">
        Your one-stop shop for Smart Devices, Fashion, and Automotive products!
      </p>

      {renderCategory("Smart Devices", "smart_devices", "color-smart")}
      {renderCategory("Fashion", "fashion", "color-fashion")}
      {renderCategory("Automotive", "automotive", "color-auto")}
    </div>
  );
}
