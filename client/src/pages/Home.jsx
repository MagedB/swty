import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [productsByCategory, setProductsByCategory] = useState({
    smart_devices: [],
    fashion: [],
    automotive: [],
  });

  // Index to keep track of which product starts the visible 3
  const [indexes, setIndexes] = useState({
    smart_devices: 0,
    fashion: 0,
    automotive: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
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
        setProductsByCategory(result);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  // Auto-cycle every 5 seconds, shifting by 1
  useEffect(() => {
    const interval = setInterval(() => {
      setIndexes((prev) => {
        const newIndexes = {};
        Object.keys(prev).forEach((cat) => {
          const total = productsByCategory[cat]?.length || 0;
          if (total > 0) {
            newIndexes[cat] = (prev[cat] + 1) % total;
          } else {
            newIndexes[cat] = 0;
          }
        });
        return newIndexes;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [productsByCategory]);

  const renderCategory = (title, items, category, colorClass) => {
    const startIndex = indexes[category] || 0;
    const visibleItems = [];

    for (let i = 0; i < 3; i++) {
      visibleItems.push(items[(startIndex + i) % items.length]);
    }

    return (
      <div className={`category-section ${colorClass}`}>
        <h2 className="category-title">{title}</h2>
        <div className="item-list">
          {visibleItems.map((item) => (
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
                <Link to={`/${category}`} className="view-more-link">
                  View More
                </Link>
              </div>
            </div>
          ))}
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

      {renderCategory(
        "Smart Devices",
        productsByCategory.smart_devices,
        "smart_devices",
        "color-smart"
      )}
      {renderCategory(
        "Fashion",
        productsByCategory.fashion,
        "fashion",
        "color-fashion"
      )}
      {renderCategory(
        "Automotive",
        productsByCategory.automotive,
        "automotive",
        "color-auto"
      )}
    </div>
  );
}
