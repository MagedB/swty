import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BlogPost() {
  const { category, slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${category}/${slug}`);
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };
    fetchBlog();
  }, [category, slug]);

  if (!blog) return <p>Loading blog...</p>;

  return (
    <div className="blog-post">
      <h1>{blog.title}</h1>
      <p>
        {blog.author} • {new Date(blog.created_at).toLocaleDateString()}
      </p>
      {blog.image && <img src={`/uploads/${blog.image}`} alt={blog.title} />}
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
}
