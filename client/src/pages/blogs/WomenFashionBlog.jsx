import React from "react";

export default function WomenFashionBlog() {
  return (
    <div className="blog-post">
      <h1>Women Fashion Trends 2025</h1>
      <p>By Admin • {new Date().toLocaleDateString()}</p>
      <img src="/images/blogs/women-fashion.jpg" alt="Women Fashion" />
      <p>
        Fashion is not just about clothes, it’s about expressing identity. In
        2025, women’s fashion is moving toward sustainability, bold colors, and
        smart wearables.
      </p>
      <p>
        Stay tuned as we cover the latest styles, eco-friendly materials, and
        tips for building your own unique look.
      </p>
    </div>
  );
}
