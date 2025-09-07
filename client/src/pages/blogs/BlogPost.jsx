// src/pages/blogs/BlogPost.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function BlogPost() {
  const { category, id } = useParams(); // ✅ using id now
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p>Loading blog...</p>;
  if (!blog) return <p>Blog not found</p>;

  return (
    <div className="blogpost-container">
      <Link to={`/blogs/${category}`} className="back-link">
        ← Back to {category.replace(/-/g, " ")}
      </Link>

      <h1>{blog.title}</h1>
      <p className="meta">
        {new Date(blog.created_at).toLocaleDateString()} • {blog.author}
      </p>

      {blog.image && (
        <img
          src={`http://localhost:5000/uploads/blogs/${blog.image}`}
          alt={blog.title}
          className="blog-image"
        />
      )}

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
