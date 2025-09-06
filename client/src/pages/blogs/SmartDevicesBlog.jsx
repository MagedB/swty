// src/pages/SmartDevicesBlog.jsx
import React from "react";
import "./BlogCategory.css";

function SmartDevicesBlog() {
  const posts = [
    {
      title: "Top 5 Smart watches of 2025",
      desc: "Discover the best smartwatches this year with features, prices, and performance.",
      image: "/images/blog-smart1.jpg",
    },
    {
      title: "Why Smart Homes are the Future",
      desc: "From smart lights to security, here’s why smart homes are booming.",
      image: "/images/blog-smart2.jpg",
    },
  ];

  return (
    <div className="blog-category-container">
      <h1>Smart Devices Blog</h1>
      <div className="posts-grid">
        {posts.map((post, idx) => (
          <div key={idx} className="post-card">
            <img src={post.image} alt={post.title} className="post-image" />
            <h2>{post.title}</h2>
            <p>{post.desc}</p>
            <button className="read-more">Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SmartDevicesBlog;
