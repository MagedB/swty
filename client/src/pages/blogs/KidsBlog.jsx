// src/pages/KidsBlog.jsx
import React from "react";
import "./BlogCategory.css";

function KidsBlog() {
  const posts = [
    {
      title: "Top 5 Kids life Blogs of 2025",
      desc: "Discover the best smartwatches this year with features, prices, and performance.",
      image: "/images/blog-smart1.jpg",
    },
    
  ];

  return (
    <div className="blog-category-container">
      <h1>Kids Blog</h1>
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

export default KidsBlog;
