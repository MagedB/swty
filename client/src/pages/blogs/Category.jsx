import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Category() {
  const { category } = useParams(); // gets category from URL
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryBlogs = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/category/${category}`);
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
  if (blogs.length === 0) return <p>No blogs found for {category.replace(/-/g, " ")}</p>;

  return (
    <div className="blogs-container">
      <h1>{category.replace(/-/g, " ")}</h1>
      <div className="blog-list">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            {blog.image && (
              <img
                src={`http://localhost:5000/uploads/blogs/${blog.image}`}
                alt={blog.title}
              />
            )}
            <h2>{blog.title}</h2>
            <p>{new Date(blog.created_at).toLocaleDateString()} • {blog.author}</p>
            <p>{blog.content.substring(0, 150)}...</p>
            <Link to={`/blogs/${category}/${blog.slug}`} className="read-more">
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
