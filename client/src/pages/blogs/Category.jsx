import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./blogcategory.css"; // Assuming you have some CSS for styling

export default function Category() {
  const { category } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Strip HTML from content safely
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  useEffect(() => {
    const fetchCategoryBlogs = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/blogs/category/${category}`
        );
        if (!res.ok) throw new Error("Failed to fetch category blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching category blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryBlogs();
  }, [category]);

  if (loading) return <p>Loading blogs...</p>;
  if (blogs.length === 0)
    return <p>No blogs found for {category.replace(/-/g, " ")}</p>;

  return (
    <div className="blogs-container">
      {/* Header */}
      <div className="blogs-header">
        <h1>{category.replace(/-/g, " ")}</h1>
        <Link to="/blogs" className="back-link">
          ← Back to Categories
        </Link>
      </div>

      {/* Blog Cards */}
      <div className="blogs-grid">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            {blog.image && (
              <img
                src={`http://localhost:5000/uploads/blogs/${blog.image}`}
                alt={blog.title}
                className="blog-image"
              />
            )}
            <div className="blog-content">
              <h2>{blog.title}</h2>
              <p className="meta">
                {new Date(blog.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                • {blog.author}
              </p>
              <p>{stripHtml(blog.content).substring(0, 160)}...</p>
              <Link to={`/blogs/${category}/${blog.id}`} className="read-more">
                Read full article →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
