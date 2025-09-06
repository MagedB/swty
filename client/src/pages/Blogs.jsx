import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Blogs.css";

export default function Blogs() {
  const [blogsByCategory, setBlogsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/blogs");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const blogs = await res.json();

        // Group blogs by category
        const grouped = blogs.reduce((acc, blog) => {
          if (!acc[blog.category]) acc[blog.category] = [];
          acc[blog.category].push(blog);
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
      <h1>Explore Blog Categories</h1>
      <div className="categories-grid">
        {Object.keys(blogsByCategory).map((category) => {
          const firstBlog = blogsByCategory[category][0]; // get first blog for image
          return (
            <Link
              key={category}
              to={`/blogs/${category}`}
              className="category-card"
            >
              {firstBlog?.image && (
                <img
                  src={`http://localhost:5000/uploads/blogs/${firstBlog.image}`}
                  alt={category}
                />
              )}
              <h2>{category.replace(/-/g, " ")}</h2>
              <p>{blogsByCategory[category].length} posts</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
