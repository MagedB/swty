import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./blogs.css";

export default function Blogs() {
  const [blogsByCategory, setBlogsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  // Helper: strip HTML tags from content
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/blogs");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const blogs = await res.json();

        // Group blogs by slugified category
        const grouped = blogs.reduce((acc, blog) => {
          const slug = blog.category.toLowerCase().replace(/\s+/g, "-");
          if (!acc[slug]) acc[slug] = [];
          acc[slug].push(blog);
          return acc;
        }, {});

        setBlogsByCategory(grouped);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (Object.keys(blogsByCategory).length === 0) return <p>No blogs available</p>;

  return (
    <div className="blogs-container">
      <h1>šwty Blog Categories</h1>

      {Object.keys(blogsByCategory).map((categorySlug) => {
        const blogs = blogsByCategory[categorySlug];
        const displayName = blogs[0]?.category || categorySlug;
        const featuredBlog = blogs[0]; // First blog as featured
        const previews = blogs.slice(1, 3); // Only 2 previews

        return (
          <div key={categorySlug} className="category-section">
            <h2 className="category-title">{displayName}</h2>
            <p className="category-description">
              Discover the latest insights and trends in {displayName}.
            </p>

            {/* Featured Blog */}
            {featuredBlog && (
              <Link
                to={`/blogs/${categorySlug}/${featuredBlog.id}`}  // ✅ Use ID
                className="featured-blog"
              >
                {featuredBlog.image && (
                  <img
                    src={`http://localhost:5000/uploads/blogs/${featuredBlog.image}`}
                    alt={featuredBlog.title}
                  />
                )}
                <div className="featured-content">
                  <h3>{featuredBlog.title}</h3>
                  <p>{stripHtml(featuredBlog.content).substring(0, 200)}...</p>
                </div>
              </Link>
            )}

            {/* Small Previews */}
            <div className="previews-grid">
              {previews.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blogs/${categorySlug}/${blog.id}`}  // ✅ Use ID
                  className="blog-card"
                >
                  {blog.image && (
                    <img
                      src={`http://localhost:5000/uploads/blogs/${blog.image}`}
                      alt={blog.title}
                    />
                  )}
                  <h4>{blog.title}</h4>
                  <p>{stripHtml(blog.content).substring(0, 100)}...</p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
